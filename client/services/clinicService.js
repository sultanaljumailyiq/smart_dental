// Mock Firebase Firestore imports - these will work with our mock Firebase config
import { 
  collection, 
  doc, 
  addDoc, 
  getDoc, 
  getDocs, 
  updateDoc, 
  deleteDoc, 
  query, 
  where, 
  orderBy,
  onSnapshot,
  serverTimestamp,
  GeoPoint
} from '../config/firebase';
import { db } from '../config/firebase';
import { sharedClinicData } from './sharedClinicData';
import { adaptStaffToDoctors } from './clinicDataAdapter';

// Initialize collection references safely with mock handling
let clinicsRef, appointmentsRef;

try {
  clinicsRef = collection(db, 'clinics');
  appointmentsRef = collection(db, 'appointments');
} catch (error) {
  console.log('Using mock Firebase services. For full functionality, please connect Supabase.');
  clinicsRef = { _isMock: true };
  appointmentsRef = { _isMock: true };
}

/**
 * خدمة إدارة العيادات
 */
export class ClinicService {
  
  /**
   * إنشاء عيادة جديدة
   */
  static async createClinic(clinicData) {
    try {
      const clinic = {
        ...clinicData,
        clinicId: this.generateClinicId(),
        status: 'active',
        verified: false,
        rating: 0,
        totalReviews: 0,
        location: new GeoPoint(clinicData.latitude, clinicData.longitude),
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      };

      const docRef = await addDoc(clinicsRef, clinic);
      return { id: docRef.id, ...clinic };
    } catch (error) {
      console.error('Error creating clinic:', error);
      throw error;
    }
  }

  /**
   * الحصول على جميع العيادات
   */
  static async getAllClinics() {
    try {
      const q = query(clinicsRef, where('status', '==', 'active'), orderBy('rating', 'desc'));
      const querySnapshot = await getDocs(q);
      
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
    } catch (error) {
      console.error('Error getting clinics:', error);
      throw error;
    }
  }

  /**
   * البحث عن العيادات القريبة
   */
  static async getNearByClinics(userLat, userLng, radiusKm = 10) {
    try {
      // حساب حدود البحث
      const latRange = radiusKm / 111; // تقريباً 111 كم لكل درجة خط عرض
      const lngRange = radiusKm / (111 * Math.cos(userLat * Math.PI / 180));

      const q = query(
        clinicsRef,
        where('status', '==', 'active'),
        where('location', '>=', new GeoPoint(userLat - latRange, userLng - lngRange)),
        where('location', '<=', new GeoPoint(userLat + latRange, userLng + lngRange))
      );

      const querySnapshot = await getDocs(q);
      
      const clinics = querySnapshot.docs.map(doc => {
        const data = doc.data();
        const distance = this.calculateDistance(
          userLat, userLng, 
          data.location.latitude, data.location.longitude
        );
        
        return {
          id: doc.id,
          ...data,
          distance: distance
        };
      });

      // ترتيب حسب المسافة
      return clinics
        .filter(clinic => clinic.distance <= radiusKm)
        .sort((a, b) => a.distance - b.distance);
        
    } catch (error) {
      console.error('Error getting nearby clinics:', error);
      throw error;
    }
  }

  /**
   * الحصول على عيادة محددة
   */
  static async getClinicById(clinicId) {
    try {
      const docRef = doc(clinicsRef, clinicId);
      const docSnap = await getDoc(docRef);
      
      if (docSnap.exists()) {
        const clinicData = { id: docSnap.id, ...docSnap.data() };
        
        // إضافة الأطباء من بيانات الموظفين
        try {
          const staff = await sharedClinicData.getStaff();
          clinicData.doctors = adaptStaffToDoctors(staff);
        } catch (err) {
          console.warn('Could not load doctors:', err);
          clinicData.doctors = [];
        }
        
        return clinicData;
      } else {
        throw new Error('Clinic not found');
      }
    } catch (error) {
      console.error('Error getting clinic:', error);
      throw error;
    }
  }

  /**
   * الحصول ع��ى عيادة بالرقم التعريفي
   */
  static async getClinicByIdentifier(identifier) {
    try {
      const q = query(clinicsRef, where('clinicId', '==', identifier));
      const querySnapshot = await getDocs(q);
      
      if (!querySnapshot.empty) {
        const doc = querySnapshot.docs[0];
        const clinicData = { id: doc.id, ...doc.data() };
        
        // إضافة الأطباء من بيانات الموظفين
        try {
          const staff = await sharedClinicData.getStaff();
          clinicData.doctors = adaptStaffToDoctors(staff);
        } catch (err) {
          console.warn('Could not load doctors:', err);
          clinicData.doctors = [];
        }
        
        return clinicData;
      } else {
        throw new Error('Clinic not found with this identifier');
      }
    } catch (error) {
      console.error('Error getting clinic by identifier:', error);
      throw error;
    }
  }

  /**
   * تحديث بيانات العيادة
   */
  static async updateClinic(clinicId, updateData) {
    try {
      const docRef = doc(clinicsRef, clinicId);
      const updates = {
        ...updateData,
        updatedAt: serverTimestamp()
      };
      
      if (updateData.latitude && updateData.longitude) {
        updates.location = new GeoPoint(updateData.latitude, updateData.longitude);
        delete updates.latitude;
        delete updates.longitude;
      }

      await updateDoc(docRef, updates);
      return await this.getClinicById(clinicId);
    } catch (error) {
      console.error('Error updating clinic:', error);
      throw error;
    }
  }

  /**
   * حذف عيادة (حذف منطقي)
   */
  static async deleteClinic(clinicId) {
    try {
      const docRef = doc(clinicsRef, clinicId);
      await updateDoc(docRef, {
        status: 'deleted',
        updatedAt: serverTimestamp()
      });
      return true;
    } catch (error) {
      console.error('Error deleting clinic:', error);
      throw error;
    }
  }

  /**
   * الحصول على عيادات الطبيب
   */
  static async getDoctorClinics(doctorId) {
    try {
      const q = query(
        clinicsRef, 
        where('ownerId', '==', doctorId),
        where('status', '==', 'active')
      );
      const querySnapshot = await getDocs(q);
      
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
    } catch (error) {
      console.error('Error getting doctor clinics:', error);
      throw error;
    }
  }

  /**
   * حجز موعد
   */
  static async bookAppointment(appointmentData) {
    try {
      const appointment = {
        ...appointmentData,
        status: 'pending',
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      };

      const docRef = await addDoc(appointmentsRef, appointment);
      return { id: docRef.id, ...appointment };
    } catch (error) {
      console.error('Error booking appointment:', error);
      throw error;
    }
  }

  /**
   * الاستماع للتحديثات المباشرة للعيادات
   */
  static subscribeToNearByClinics(userLat, userLng, callback, radiusKm = 10) {
    try {
      const latRange = radiusKm / 111;
      const lngRange = radiusKm / (111 * Math.cos(userLat * Math.PI / 180));

      const q = query(
        clinicsRef,
        where('status', '==', 'active'),
        where('location', '>=', new GeoPoint(userLat - latRange, userLng - lngRange)),
        where('location', '<=', new GeoPoint(userLat + latRange, userLng + lngRange))
      );

      return onSnapshot(q, (querySnapshot) => {
        const clinics = querySnapshot.docs.map(doc => {
          const data = doc.data();
          const distance = this.calculateDistance(
            userLat, userLng, 
            data.location.latitude, data.location.longitude
          );
          
          return {
            id: doc.id,
            ...data,
            distance: distance
          };
        });

        const nearByClinics = clinics
          .filter(clinic => clinic.distance <= radiusKm)
          .sort((a, b) => a.distance - b.distance);
          
        callback(nearByClinics);
      });
    } catch (error) {
      console.error('Error subscribing to clinics:', error);
      throw error;
    }
  }

  /**
   * توليد رقم تعريفي فريد للعيادة
   */
  static generateClinicId() {
    const timestamp = Date.now().toString(36);
    const randomStr = Math.random().toString(36).substr(2, 5);
    return `CL-${timestamp}-${randomStr}`.toUpperCase();
  }

  /**
   * حساب المسافة بين نقطتين
   */
  static calculateDistance(lat1, lon1, lat2, lon2) {
    const R = 6371; // نصف قطر الأرض بالكيلومتر
    const dLat = this.deg2rad(lat2 - lat1);
    const dLon = this.deg2rad(lon2 - lon1);
    const a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(this.deg2rad(lat1)) * Math.cos(this.deg2rad(lat2)) * 
      Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c; // المسافة بالكيلومتر
  }

  static deg2rad(deg) {
    return deg * (Math.PI/180);
  }

  /**
   * الحصول على موقع المستخدم
   */
  static async getUserLocation() {
    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        reject(new Error('Geolocation is not supported by this browser.'));
        return;
      }

      navigator.geolocation.getCurrentPosition(
        (position) => {
          resolve({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
            accuracy: position.coords.accuracy
          });
        },
        (error) => {
          reject(error);
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 300000 // 5 minutes
        }
      );
    });
  }

  /**
   * تقدير الموقع من IP
   */
  static async getLocationFromIP() {
    try {
      const response = await fetch('https://ipapi.co/json/');
      const data = await response.json();
      
      return {
        latitude: data.latitude,
        longitude: data.longitude,
        city: data.city,
        country: data.country_name
      };
    } catch (error) {
      console.error('Error getting location from IP:', error);
      throw error;
    }
  }
}

export default ClinicService;
