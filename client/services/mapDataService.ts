// Map Data Management Service for Clinics, Locations, and Appointments
// Manages geographic data for interactive maps across the platform

export interface ClinicLocation {
  id: string;
  name: string;
  nameAr: string;
  latitude: number;
  longitude: number;
  address: string;
  addressAr: string;
  city: string;
  phone: string;
  email?: string;
  rating: number;
  reviewCount: number;
  services: string[];
  workingHours: {
    [key: string]: { open: string; close: string; isOpen: boolean };
  };
  photos: string[];
  dentistName: string;
  dentistNameAr: string;
  specializations: string[];
  verified: boolean;
  appointmentLink?: string; // Shareable appointment booking link
  acceptsNewPatients: boolean;
}

export interface JobLocation {
  id: string;
  title: string;
  titleAr: string;
  clinicName: string;
  clinicNameAr: string;
  latitude: number;
  longitude: number;
  address: string;
  addressAr: string;
  city: string;
  salary: string;
  type: 'full_time' | 'part_time' | 'contract';
  postedDate: string;
  description: string;
}

export interface AppointmentSlot {
  clinicId: string;
  date: string;
  time: string;
  available: boolean;
  duration: number; // in minutes
}

// In-memory storage (will be replaced with database integration)
class MapDataService {
  private clinics: ClinicLocation[] = [
    {
      id: 'clinic-1',
      name: 'Baghdad Dental Center',
      nameAr: 'مركز بغداد لطب الأسنان',
      latitude: 33.3152,
      longitude: 44.3661,
      address: 'Karrada, Baghdad',
      addressAr: 'الكرادة، بغداد',
      city: 'Baghdad',
      phone: '+964 770 123 4567',
      email: 'info@baghdaddental.iq',
      rating: 4.8,
      reviewCount: 156,
      services: ['تقويم الأسنان', 'زراعة الأسنان', 'تبييض', 'علاج الجذور'],
      workingHours: {
        sunday: { open: '09:00', close: '18:00', isOpen: true },
        monday: { open: '09:00', close: '18:00', isOpen: true },
        tuesday: { open: '09:00', close: '18:00', isOpen: true },
        wednesday: { open: '09:00', close: '18:00', isOpen: true },
        thursday: { open: '09:00', close: '18:00', isOpen: true },
        friday: { open: '00:00', close: '00:00', isOpen: false },
        saturday: { open: '10:00', close: '14:00', isOpen: true },
      },
      photos: [],
      dentistName: 'Dr. Ahmed Al-Najjar',
      dentistNameAr: 'د. أحمد النجار',
      specializations: ['تقويم الأسنان', 'جراحة الفم'],
      verified: true,
      appointmentLink: '/simplified-booking/1',
      acceptsNewPatients: true,
    },
    {
      id: 'clinic-2',
      name: 'Basra Modern Dental Clinic',
      nameAr: 'عيادة البصرة الحديثة للأسنان',
      latitude: 30.5085,
      longitude: 47.7835,
      address: 'Al-Ashar, Basra',
      addressAr: 'العشار، البصرة',
      city: 'Basra',
      phone: '+964 771 234 5678',
      rating: 4.6,
      reviewCount: 89,
      services: ['حشوات تجميلية', 'زراعة', 'تبييض الأسنان', 'علاج اللثة'],
      workingHours: {
        sunday: { open: '08:00', close: '17:00', isOpen: true },
        monday: { open: '08:00', close: '17:00', isOpen: true },
        tuesday: { open: '08:00', close: '17:00', isOpen: true },
        wednesday: { open: '08:00', close: '17:00', isOpen: true },
        thursday: { open: '08:00', close: '17:00', isOpen: true },
        friday: { open: '00:00', close: '00:00', isOpen: false },
        saturday: { open: '09:00', close: '13:00', isOpen: true },
      },
      photos: [],
      dentistName: 'Dr. Sara Al-Qaisi',
      dentistNameAr: 'د. سارة القيسي',
      specializations: ['طب أسنان تجميلي', 'علاج اللثة'],
      verified: true,
      appointmentLink: '/simplified-booking/2',
      acceptsNewPatients: true,
    },
    {
      id: 'clinic-3',
      name: 'Erbil Smile Specialists',
      nameAr: 'مركز أربيل للابتسامة',
      latitude: 36.1911,
      longitude: 44.0091,
      address: 'Downtown, Erbil',
      addressAr: 'وسط المدينة، أربيل',
      city: 'Erbil',
      phone: '+964 750 345 6789',
      rating: 4.9,
      reviewCount: 203,
      services: ['تقويم شفاف', 'زراعة متقدمة', 'ابتسامة هوليود', 'طوارئ'],
      workingHours: {
        sunday: { open: '09:00', close: '19:00', isOpen: true },
        monday: { open: '09:00', close: '19:00', isOpen: true },
        tuesday: { open: '09:00', close: '19:00', isOpen: true },
        wednesday: { open: '09:00', close: '19:00', isOpen: true },
        thursday: { open: '09:00', close: '19:00', isOpen: true },
        friday: { open: '00:00', close: '00:00', isOpen: false },
        saturday: { open: '10:00', close: '15:00', isOpen: true },
      },
      photos: [],
      dentistName: 'Dr. Mohammed Rashid',
      dentistNameAr: 'د. محمد رشيد',
      specializations: ['تقويم الأسنان', 'زراعة الأسنان'],
      verified: true,
      appointmentLink: '/simplified-booking/3',
      acceptsNewPatients: true,
    },
  ];

  private jobs: JobLocation[] = [
    {
      id: 'job-1',
      title: 'Orthodontist Position',
      titleAr: 'مطلوب أخصائي تقويم أسنان',
      clinicName: 'Baghdad Dental Center',
      clinicNameAr: 'مركز بغداد لطب الأسنان',
      latitude: 33.3152,
      longitude: 44.3661,
      address: 'Karrada, Baghdad',
      addressAr: 'الكرادة، بغداد',
      city: 'Baghdad',
      salary: '2,000,000 - 3,500,000 IQD',
      type: 'full_time',
      postedDate: '2025-10-01',
      description: 'نبحث عن أخصائي تقويم أسنان ذو خبرة للانضمام إلى فريقنا',
    },
    {
      id: 'job-2',
      title: 'Dental Assistant',
      titleAr: 'مطلوب مساعد طبيب أسنان',
      clinicName: 'Basra Modern Dental Clinic',
      clinicNameAr: 'عيادة البصرة الحديثة للأسنان',
      latitude: 30.5085,
      longitude: 47.7835,
      address: 'Al-Ashar, Basra',
      addressAr: 'العشار، البصرة',
      city: 'Basra',
      salary: '800,000 - 1,200,000 IQD',
      type: 'full_time',
      postedDate: '2025-09-28',
      description: 'عيادة حديثة تبحث عن مساعد طبيب أسنان محترف',
    },
  ];

  private appointmentSlots: AppointmentSlot[] = [];

  // Get all clinics
  getAllClinics(): ClinicLocation[] {
    return [...this.clinics];
  }

  // Get clinic by ID
  getClinicById(id: string): ClinicLocation | undefined {
    return this.clinics.find((clinic) => clinic.id === id);
  }

  // Get clinics by city
  getClinicsByCity(city: string): ClinicLocation[] {
    return this.clinics.filter((clinic) => clinic.city === city);
  }

  // Get nearby clinics (within radius in km)
  getNearbyClinics(lat: number, lng: number, radiusKm: number = 10): ClinicLocation[] {
    return this.clinics.filter((clinic) => {
      const distance = this.calculateDistance(lat, lng, clinic.latitude, clinic.longitude);
      return distance <= radiusKm;
    });
  }

  // Calculate distance between two points (Haversine formula)
  private calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
    const R = 6371; // Earth's radius in km
    const dLat = this.toRad(lat2 - lat1);
    const dLon = this.toRad(lon2 - lon1);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(this.toRad(lat1)) * Math.cos(this.toRad(lat2)) *
      Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  }

  private toRad(value: number): number {
    return (value * Math.PI) / 180;
  }

  // Add new clinic (for dentists creating their clinic profile)
  addClinic(clinic: Omit<ClinicLocation, 'id'>): ClinicLocation {
    const clinicId = Date.now();
    const newClinic: ClinicLocation = {
      ...clinic,
      id: `clinic-${clinicId}`,
      appointmentLink: `/simplified-booking/${clinicId}`,
    };
    this.clinics.push(newClinic);
    return newClinic;
  }

  // Update clinic information
  updateClinic(id: string, updates: Partial<ClinicLocation>): ClinicLocation | null {
    const index = this.clinics.findIndex((c) => c.id === id);
    if (index === -1) return null;
    
    this.clinics[index] = { ...this.clinics[index], ...updates };
    return this.clinics[index];
  }

  // Generate shareable appointment link
  generateAppointmentLink(clinicId: string): string {
    const clinic = this.getClinicById(clinicId);
    if (!clinic) throw new Error('Clinic not found');
    
    // Extract numeric ID from clinic-X format
    const numericId = clinicId.replace('clinic-', '');
    const link = `/simplified-booking/${numericId}`;
    this.updateClinic(clinicId, { appointmentLink: link });
    return link;
  }

  // Get all job listings
  getAllJobs(): JobLocation[] {
    return [...this.jobs];
  }

  // Get jobs by city
  getJobsByCity(city: string): JobLocation[] {
    return this.jobs.filter((job) => job.city === city);
  }

  // Get nearby jobs
  getNearbyJobs(lat: number, lng: number, radiusKm: number = 50): JobLocation[] {
    return this.jobs.filter((job) => {
      const distance = this.calculateDistance(lat, lng, job.latitude, job.longitude);
      return distance <= radiusKm;
    });
  }

  // Add job listing
  addJob(job: Omit<JobLocation, 'id'>): JobLocation {
    const newJob: JobLocation = {
      ...job,
      id: `job-${Date.now()}`,
    };
    this.jobs.push(newJob);
    return newJob;
  }

  // Get available appointment slots for a clinic
  getAvailableSlots(clinicId: string, date: string): AppointmentSlot[] {
    return this.appointmentSlots.filter(
      (slot) => slot.clinicId === clinicId && slot.date === date && slot.available
    );
  }

  // Book an appointment slot
  bookAppointment(clinicId: string, date: string, time: string): boolean {
    const slot = this.appointmentSlots.find(
      (s) => s.clinicId === clinicId && s.date === date && s.time === time && s.available
    );
    
    if (slot) {
      slot.available = false;
      return true;
    }
    return false;
  }

  // Generate appointment slots for a clinic
  generateSlotsForClinic(clinicId: string, date: string, startTime: string, endTime: string, slotDuration: number = 30): void {
    const clinic = this.getClinicById(clinicId);
    if (!clinic) return;

    const slots: AppointmentSlot[] = [];
    const start = this.timeToMinutes(startTime);
    const end = this.timeToMinutes(endTime);

    for (let minutes = start; minutes < end; minutes += slotDuration) {
      slots.push({
        clinicId,
        date,
        time: this.minutesToTime(minutes),
        available: true,
        duration: slotDuration,
      });
    }

    this.appointmentSlots.push(...slots);
  }

  private timeToMinutes(time: string): number {
    const [hours, minutes] = time.split(':').map(Number);
    return hours * 60 + minutes;
  }

  private minutesToTime(minutes: number): string {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}`;
  }
}

// Export singleton instance
export const mapDataService = new MapDataService();
