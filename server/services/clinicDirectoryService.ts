import { db, clinics } from "../storage";
import { sql, eq, and, or, gte, lte, desc, asc } from "drizzle-orm";

export interface ClinicFilter {
  governorate?: string;
  city?: string;
  userLat?: number;
  userLng?: number;
  radiusKm?: number;
  specialty?: string;
  mode?: 'distance' | 'promoted'; // distance-based or promotion-based
  isActive?: boolean;
  limit?: number;
}

export interface ClinicWithDistance {
  id: number;
  name: string;
  arabicName: string;
  phone: string;
  address: string;
  arabicAddress: string;
  governorate: string;
  city: string;
  locationLat: string;
  locationLng: string;
  specialty: string[];
  arabicSpecialty: string[];
  doctorName: string | null;
  arabicDoctorName: string | null;
  rating: string;
  reviewCount: number;
  image: string | null;
  services: string[];
  arabicServices: string[];
  subscriptionTier: string;
  isPromoted: boolean;
  priorityLevel: number;
  isVerified: boolean;
  distance?: number; // calculated distance in km
}

export class ClinicDirectoryService {
  // Calculate distance using Haversine formula
  private calculateDistance(lat1: number, lng1: number, lat2: number, lng2: number): number {
    const R = 6371; // Earth's radius in km
    const dLat = this.toRad(lat2 - lat1);
    const dLng = this.toRad(lng2 - lng1);
    
    const a = 
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(this.toRad(lat1)) * Math.cos(this.toRad(lat2)) *
      Math.sin(dLng / 2) * Math.sin(dLng / 2);
    
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  }

  private toRad(value: number): number {
    return (value * Math.PI) / 180;
  }

  // Get clinics with smart ranking
  async getClinics(filter: ClinicFilter): Promise<ClinicWithDistance[]> {
    const conditions: any[] = [];

    // Always show only active clinics
    if (filter.isActive !== false) {
      conditions.push(eq(clinics.isActive, true));
    }

    // Filter by governorate
    if (filter.governorate) {
      conditions.push(eq(clinics.governorate, filter.governorate));
    }

    // Filter by city
    if (filter.city) {
      conditions.push(eq(clinics.city, filter.city));
    }

    // Get base query
    const whereClause = conditions.length > 0 ? and(...conditions) : undefined;
    let allClinics = await db.select().from(clinics).where(whereClause);

    // Filter by specialty (post-query since it's stored in JSON array)
    if (filter.specialty) {
      allClinics = allClinics.filter(clinic => 
        clinic.specialty?.includes(filter.specialty!)
      );
    }

    // Calculate distances and add numeric coordinates if user location provided
    if (filter.userLat && filter.userLng) {
      allClinics = allClinics.map(clinic => ({
        ...clinic,
        latitude: parseFloat(clinic.locationLat),
        longitude: parseFloat(clinic.locationLng),
        distance: this.calculateDistance(
          filter.userLat!,
          filter.userLng!,
          parseFloat(clinic.locationLat),
          parseFloat(clinic.locationLng)
        )
      }));

      // Filter by radius
      if (filter.radiusKm) {
        allClinics = allClinics.filter(c => (c as any).distance <= filter.radiusKm!);
      }
    } else {
      // Add numeric coordinates even without distance calculation
      allClinics = allClinics.map(clinic => ({
        ...clinic,
        latitude: parseFloat(clinic.locationLat),
        longitude: parseFloat(clinic.locationLng)
      }));
    }

    // Sort based on mode
    if (filter.mode === 'promoted') {
      // Promoted mode: promoted clinics first, then by priority, then by distance/rating
      allClinics.sort((a, b) => {
        // First: promoted status
        if (a.isPromoted !== b.isPromoted) {
          return b.isPromoted ? 1 : -1;
        }
        
        // Second: priority level (higher is better)
        if (a.priorityLevel !== b.priorityLevel) {
          return b.priorityLevel - a.priorityLevel;
        }
        
        // Third: subscription tier priority
        const tierPriority: Record<string, number> = {
          enterprise: 4,
          premium: 3,
          basic: 2,
          free: 1
        };
        const aPriority = tierPriority[a.subscriptionTier] || 0;
        const bPriority = tierPriority[b.subscriptionTier] || 0;
        if (aPriority !== bPriority) {
          return bPriority - aPriority;
        }
        
        // Fourth: distance if available, otherwise rating
        if ((a as any).distance !== undefined && (b as any).distance !== undefined) {
          return (a as any).distance - (b as any).distance;
        }
        return parseFloat(b.rating) - parseFloat(a.rating);
      });
    } else {
      // Distance mode: sort by distance or rating
      allClinics.sort((a, b) => {
        if ((a as any).distance !== undefined && (b as any).distance !== undefined) {
          return (a as any).distance - (b as any).distance;
        }
        return parseFloat(b.rating) - parseFloat(a.rating);
      });
    }

    // Apply limit
    if (filter.limit) {
      allClinics = allClinics.slice(0, filter.limit);
    }

    return allClinics as ClinicWithDistance[];
  }

  // Get clinic by ID
  async getClinicById(id: number) {
    const result = await db.select().from(clinics).where(eq(clinics.id, id));
    return result[0] || null;
  }

  // Get clinics by governorate
  async getClinicsByGovernorate(governorate: string, mode: 'distance' | 'promoted' = 'distance') {
    return this.getClinics({ governorate, mode, limit: 20 });
  }

  // Get nearby clinics
  async getNearbyClinics(
    userLat: number, 
    userLng: number, 
    radiusKm: number = 50,
    mode: 'distance' | 'promoted' = 'distance',
    limit: number = 10
  ) {
    return this.getClinics({
      userLat,
      userLng,
      radiusKm,
      mode,
      limit
    });
  }

  // Seed Iraqi clinics (for initial data)
  async seedIraqiClinics() {
    const iraqiClinics = [
      {
        name: 'Baghdad Dental Center',
        arabicName: 'مركز بغداد لطب الأسنان',
        phone: '+964 770 123 4567',
        email: 'info@baghdaddental.iq',
        address: 'Karrada, Baghdad',
        arabicAddress: 'الكرادة، بغداد',
        governorate: 'Baghdad',
        city: 'Baghdad',
        locationLat: '33.3152',
        locationLng: '44.3661',
        specialty: ['Orthodontics', 'Implants', 'Whitening'],
        arabicSpecialty: ['تقويم الأسنان', 'زراعة الأسنان', 'تبييض'],
        doctorName: 'Dr. Ahmed Al-Najjar',
        arabicDoctorName: 'د. أحمد النجار',
        rating: '4.8',
        reviewCount: 156,
        services: ['تقويم الأسنان', 'زراعة الأسنان', 'تبييض', 'علاج الجذور'],
        arabicServices: ['تقويم الأسنان', 'زراعة الأسنان', 'تبييض', 'علاج الجذور'],
        subscriptionTier: 'premium',
        isPromoted: true,
        priorityLevel: 3,
        isActive: true,
        isVerified: true
      },
      {
        name: 'Basra Modern Dental Clinic',
        arabicName: 'عيادة البصرة الحديثة للأسنان',
        phone: '+964 771 234 5678',
        address: 'Al-Ashar, Basra',
        arabicAddress: 'العشار، البصرة',
        governorate: 'Basra',
        city: 'Basra',
        locationLat: '30.5085',
        locationLng: '47.7835',
        specialty: ['Cosmetic Dentistry', 'Periodontics'],
        arabicSpecialty: ['طب الأسنان التجميلي', 'علاج اللثة'],
        doctorName: 'Dr. Sara Al-Qaisi',
        arabicDoctorName: 'د. سارة القيسي',
        rating: '4.6',
        reviewCount: 89,
        services: ['حشوات تجميلية', 'زراعة', 'تبييض الأسنان', 'علاج اللثة'],
        arabicServices: ['حشوات تجميلية', 'زراعة', 'تبييض الأسنان', 'علاج اللثة'],
        subscriptionTier: 'basic',
        isPromoted: false,
        priorityLevel: 1,
        isActive: true,
        isVerified: true
      },
      {
        name: 'Erbil Smile Specialists',
        arabicName: 'مركز أربيل للابتسامة',
        phone: '+964 750 345 6789',
        address: 'Downtown, Erbil',
        arabicAddress: 'وسط المدينة، أربيل',
        governorate: 'Erbil',
        city: 'Erbil',
        locationLat: '36.1911',
        locationLng: '44.0091',
        specialty: ['Clear Aligners', 'Advanced Implants', 'Hollywood Smile'],
        arabicSpecialty: ['تقويم شفاف', 'زراعة متقدمة', 'ابتسامة هوليود'],
        doctorName: 'Dr. Mohammed Rashid',
        arabicDoctorName: 'د. محمد رشيد',
        rating: '4.9',
        reviewCount: 203,
        services: ['تقويم شفاف', 'زراعة متقدمة', 'ابتسامة هوليود', 'طوارئ'],
        arabicServices: ['تقويم شفاف', 'زراعة متقدمة', 'ابتسامة هوليود', 'طوارئ'],
        subscriptionTier: 'enterprise',
        isPromoted: true,
        priorityLevel: 5,
        isActive: true,
        isVerified: true
      },
      {
        name: 'Mosul Dental Care',
        arabicName: 'عيادة الموصل لطب الأسنان',
        phone: '+964 752 456 7890',
        address: 'Al-Majmua, Mosul',
        arabicAddress: 'المجموعة الثقافية، الموصل',
        governorate: 'Nineveh',
        city: 'Mosul',
        locationLat: '36.3350',
        locationLng: '43.1189',
        specialty: ['General Dentistry', 'Pediatric Dentistry'],
        arabicSpecialty: ['طب الأسنان العام', 'طب أسنان الأطفال'],
        doctorName: 'Dr. Omar Hassan',
        arabicDoctorName: 'د. عمر حسن',
        rating: '4.7',
        reviewCount: 124,
        services: ['علاج عام', 'طب أسنان الأطفال', 'حشوات', 'تنظيف'],
        arabicServices: ['علاج عام', 'طب أسنان الأطفال', 'حشوات', 'تنظيف'],
        subscriptionTier: 'basic',
        isPromoted: false,
        priorityLevel: 1,
        isActive: true,
        isVerified: true
      },
      {
        name: 'Najaf Premium Dental',
        arabicName: 'عيادة النجف المميزة للأسنان',
        phone: '+964 753 567 8901',
        address: 'Al-Kufa Road, Najaf',
        arabicAddress: 'طريق الكوفة، النجف',
        governorate: 'Najaf',
        city: 'Najaf',
        locationLat: '31.9966',
        locationLng: '44.3166',
        specialty: ['Implantology', 'Prosthodontics'],
        arabicSpecialty: ['زراعة الأسنان', 'التعويضات السنية'],
        doctorName: 'Dr. Ali Kadhim',
        arabicDoctorName: 'د. علي كاظم',
        rating: '4.8',
        reviewCount: 167,
        services: ['زراعة', 'تركيبات', 'تبييض', 'علاج متقدم'],
        arabicServices: ['زراعة', 'تركيبات', 'تبييض', 'علاج متقدم'],
        subscriptionTier: 'premium',
        isPromoted: true,
        priorityLevel: 4,
        isActive: true,
        isVerified: true
      }
    ];

    for (const clinic of iraqiClinics) {
      await db.insert(clinics).values(clinic).onConflictDoNothing();
    }
  }
}

export const clinicDirectoryService = new ClinicDirectoryService();
