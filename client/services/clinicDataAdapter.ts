// Adapter to normalize data between sharedClinicData and legacy UI components
import { 
  Patient, 
  Appointment, 
  Treatment, 
  Staff, 
  InventoryItem, 
  FinancialRecord 
} from "./sharedClinicData";

export interface LegacyPatient {
  id: string | number;
  name: string;
  phone: string;
  email: string;
  address: string;
  registered?: string;
  lastVisit: string;
  treatment: string;
  avatar?: string;
  color?: string;
  age: number;
  gender?: string;
  status: string;
  visits: number;
  nextAppointment: string | null;
  medicalHistory: string[];
  priority: string;
  totalSpent?: number;
  notes?: string;
}

export interface LegacyAppointment {
  id: string | number;
  patientId: string;
  patientName: string;
  date: string;
  time: string;
  service: string;
  doctor: string;
  status: string;
  type?: string;
  notes?: string;
}

export interface LegacyTreatment {
  id: string | number;
  name: string;
  description: string;
  duration: string;
  price: string | number;
  category: string;
  status: string;
}

export interface LegacyStaff {
  id: string | number;
  name: string;
  role: string;
  phone: string;
  email: string;
  specialization?: string;
  status: string;
  avatar?: string;
  color?: string;
}

export interface LegacyInventoryItem {
  id: string | number;
  name: string;
  category: string;
  quantity: number;
  minQuantity: number;
  unit: string;
  price: string | number;
  status: string;
  expiryDate?: string;
}

export interface LegacyFinancialRecord {
  id: string | number;
  type: string;
  amount: string | number;
  description: string;
  category: string;
  date: string;
  paymentMethod: string;
  status: string;
  relatedTo?: string;
}

// Map shared data status to Arabic status
const mapStatus = (status: string): string => {
  const statusMap: Record<string, string> = {
    'active': 'نشط',
    'in_treatment': 'نشط',
    'completed': 'غير نشط',
    'urgent': 'نشط',
    'pending': 'نشط',
    'follow_up': 'نشط'
  };
  return statusMap[status.toLowerCase()] || 'نشط';
};

// Map shared data priority to Arabic priority
const mapPriority = (priority: string): string => {
  const priorityMap: Record<string, string> = {
    'high': 'عاجل',
    'urgent': 'عاجل',
    'critical': 'عاجل',
    'normal': 'عادي',
    'low': 'عادي'
  };
  return priorityMap[priority.toLowerCase()] || 'عادي';
};

// Generate avatar color based on name
const getAvatarColor = (name: string): string => {
  const colors = [
    "bg-purple-100 text-purple-700",
    "bg-blue-100 text-blue-700",
    "bg-green-100 text-green-700",
    "bg-pink-100 text-pink-700",
    "bg-indigo-100 text-indigo-700",
    "bg-yellow-100 text-yellow-700"
  ];
  const hash = name.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
  return colors[hash % colors.length];
};

// Convert shared patient to legacy format
export const adaptPatientToLegacy = (patient: Patient): LegacyPatient => {
  return {
    id: patient.id,
    name: patient.name,
    phone: patient.phone,
    email: patient.email,
    address: patient.address,
    lastVisit: patient.lastVisit,
    treatment: patient.treatment,
    avatar: patient.avatar || patient.name.substring(0, 2),
    color: getAvatarColor(patient.name),
    age: patient.age,
    gender: patient.age > 30 ? 'ذكر' : 'أنثى', // Default gender based on age (placeholder)
    status: mapStatus(patient.status),
    visits: patient.totalVisits,
    nextAppointment: patient.nextAppointment || 'غير محدد',
    medicalHistory: patient.medicalHistory || [],
    priority: mapPriority(patient.priority),
    totalSpent: patient.totalSpent,
    notes: patient.notes,
    registered: patient.lastVisit // Use lastVisit as registered date fallback
  };
};

// Convert array of shared patients to legacy format
export const adaptPatientsToLegacy = (patients: Patient[]): LegacyPatient[] => {
  return patients.map(adaptPatientToLegacy);
};

// Map appointment status to Arabic
const mapAppointmentStatus = (status: string): string => {
  const statusMap: Record<string, string> = {
    'scheduled': 'محجوز',
    'confirmed': 'مؤكد',
    'in_progress': 'جاري',
    'completed': 'مكتمل',
    'cancelled': 'ملغي'
  };
  return statusMap[status.toLowerCase()] || 'محجوز';
};

// Convert shared appointment to legacy format
export const adaptAppointmentToLegacy = (appointment: Appointment): LegacyAppointment => {
  return {
    id: appointment.id,
    patientId: appointment.patientId,
    patientName: appointment.patientName,
    date: appointment.date,
    time: appointment.time,
    service: appointment.treatment,
    doctor: appointment.doctorName,
    status: mapAppointmentStatus(appointment.status),
    notes: appointment.notes
  };
};

export const adaptAppointmentsToLegacy = (appointments: Appointment[]): LegacyAppointment[] => {
  return appointments.map(adaptAppointmentToLegacy);
};

// Convert shared treatment to legacy format
export const adaptTreatmentToLegacy = (treatment: Treatment): LegacyTreatment => {
  return {
    id: treatment.id,
    name: treatment.name,
    description: treatment.description,
    duration: `${treatment.duration} دقيقة`,
    price: treatment.price,
    category: treatment.category,
    status: treatment.status === 'active' ? 'نشط' : 'غير نشط'
  };
};

export const adaptTreatmentsToLegacy = (treatments: Treatment[]): LegacyTreatment[] => {
  return treatments.map(adaptTreatmentToLegacy);
};

// Map staff role to Arabic
const mapStaffRole = (role: string): string => {
  const roleMap: Record<string, string> = {
    'doctor': 'طبيب',
    'nurse': 'ممرض',
    'assistant': 'مساعد',
    'receptionist': 'موظف استقبال',
    'manager': 'مدير'
  };
  return roleMap[role.toLowerCase()] || role;
};

// Map staff status to Arabic
const mapStaffStatus = (status: string): string => {
  const statusMap: Record<string, string> = {
    'active': 'نشط',
    'on_leave': 'في إجازة',
    'inactive': 'غير نشط'
  };
  return statusMap[status.toLowerCase()] || 'نشط';
};

// Convert shared staff to legacy format
export const adaptStaffToLegacy = (staff: Staff): LegacyStaff => {
  return {
    id: staff.id,
    name: staff.name,
    role: mapStaffRole(staff.role),
    phone: staff.phone,
    email: staff.email,
    specialization: staff.specialization,
    status: mapStaffStatus(staff.status),
    avatar: staff.name.substring(0, 2),
    color: getAvatarColor(staff.name)
  };
};

export const adaptStaffListToLegacy = (staffList: Staff[]): LegacyStaff[] => {
  return staffList.map(adaptStaffToLegacy);
};

// Convert staff (doctors only) to booking page doctor format
export interface BookingDoctor {
  id: string;
  name: string;
  specialties: string[];
  schedule?: any;
  image?: string;
}

export const adaptStaffToDoctor = (staff: Staff): BookingDoctor => {
  return {
    id: staff.id,
    name: staff.name,
    specialties: staff.specialization ? [staff.specialization] : ['طب أسنان عام'],
    schedule: staff.schedule || {},
    image: undefined
  };
};

// Convert array of staff (filter doctors only) to booking doctors
export const adaptStaffToDoctors = (staffList: Staff[]): BookingDoctor[] => {
  return staffList
    .filter(staff => staff.role === 'doctor')
    .map(adaptStaffToDoctor);
};

// Map inventory status to Arabic
const mapInventoryStatus = (status: string): string => {
  const statusMap: Record<string, string> = {
    'in_stock': 'متوفر',
    'low_stock': 'منخفض',
    'out_of_stock': 'غير متوفر',
    'expired': 'منتهي الصلاحية'
  };
  return statusMap[status.toLowerCase()] || 'متوفر';
};

// Map inventory category to Arabic
const mapInventoryCategory = (category: string): string => {
  const categoryMap: Record<string, string> = {
    'medicine': 'دواء',
    'equipment': 'معدات',
    'supplies': 'مستلزمات'
  };
  return categoryMap[category.toLowerCase()] || category;
};

// Convert shared inventory item to legacy format
export const adaptInventoryToLegacy = (item: InventoryItem): LegacyInventoryItem => {
  return {
    id: item.id,
    name: item.name,
    category: mapInventoryCategory(item.category),
    quantity: item.currentStock,
    minQuantity: item.minStock,
    unit: item.unit,
    price: item.price,
    status: mapInventoryStatus(item.status),
    expiryDate: item.expiryDate
  };
};

export const adaptInventoryListToLegacy = (inventory: InventoryItem[]): LegacyInventoryItem[] => {
  return inventory.map(adaptInventoryToLegacy);
};

// Map financial type to Arabic
const mapFinancialType = (type: string): string => {
  return type === 'income' ? 'دخل' : 'مصروف';
};

// Map payment method to Arabic
const mapPaymentMethod = (method: string): string => {
  const methodMap: Record<string, string> = {
    'cash': 'نقدي',
    'card': 'بطاقة',
    'transfer': 'تحويل',
    'insurance': 'تأمين'
  };
  return methodMap[method.toLowerCase()] || method;
};

// Map financial status to Arabic
const mapFinancialStatus = (status: string): string => {
  const statusMap: Record<string, string> = {
    'pending': 'معلق',
    'completed': 'مكتمل',
    'cancelled': 'ملغي'
  };
  return statusMap[status.toLowerCase()] || 'معلق';
};

// Convert shared financial record to legacy format
export const adaptFinancialToLegacy = (record: FinancialRecord): LegacyFinancialRecord => {
  return {
    id: record.id,
    type: mapFinancialType(record.type),
    amount: record.amount,
    description: record.description,
    category: record.category,
    date: record.date,
    paymentMethod: mapPaymentMethod(record.paymentMethod),
    status: mapFinancialStatus(record.status),
    relatedTo: record.relatedTo?.name
  };
};

export const adaptFinancialListToLegacy = (records: FinancialRecord[]): LegacyFinancialRecord[] => {
  return records.map(adaptFinancialToLegacy);
};
