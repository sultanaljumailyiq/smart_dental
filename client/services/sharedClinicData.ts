// Shared clinic data service that will be used by both /clinic and /clinic_old systems
// This ensures data consistency between the two management interfaces

export interface Patient {
  id: string;
  name: string;
  age: number;
  phone: string;
  email: string;
  address: string;
  lastVisit: string;
  nextAppointment: string | null;
  treatment: string;
  status: "active" | "in_treatment" | "completed" | "urgent";
  priority: "normal" | "high";
  totalVisits: number;
  totalSpent: number;
  notes: string;
  medicalHistory: string[];
  avatar?: string;
  birthDate?: string;
  gender?: "male" | "female";
  emergencyContact?: string;
  emergencyPhone?: string;
}

export interface Appointment {
  id: string;
  patientId: string;
  patientName: string;
  date: string;
  time: string;
  duration: number;
  treatment: string;
  doctorId: string;
  doctorName: string;
  status: "scheduled" | "confirmed" | "in_progress" | "completed" | "cancelled";
  notes?: string;
  reminder?: boolean;
  source?: "manual" | "online_booking"; // Track if appointment was booked online
  patientPhone?: string;
  patientEmail?: string;
}

export interface Treatment {
  id: string;
  name: string;
  description: string;
  duration: number; // minutes
  price: number;
  category: string;
  status: "active" | "inactive";
  requiresEquipment?: string[];
}

export interface Staff {
  id: string;
  name: string;
  role: "doctor" | "nurse" | "assistant" | "receptionist" | "manager";
  phone: string;
  email: string;
  specialization?: string;
  schedule?: {
    [key: string]: { start: string; end: string };
  };
  status: "active" | "on_leave" | "inactive";
  permissions: string[];
}

export interface InventoryItem {
  id: string;
  name: string;
  category: "medicine" | "equipment" | "supplies";
  currentStock: number;
  minStock: number;
  maxStock: number;
  unit: string;
  price: number;
  supplier?: string;
  expiryDate?: string;
  status: "in_stock" | "low_stock" | "out_of_stock" | "expired";
}

export interface FinancialRecord {
  id: string;
  type: "income" | "expense";
  amount: number;
  description: string;
  category: string;
  date: string;
  relatedTo?: {
    type: "patient" | "supplier" | "staff";
    id: string;
    name: string;
  };
  paymentMethod: "cash" | "card" | "transfer" | "insurance";
  status: "pending" | "completed" | "cancelled";
}

export interface Laboratory {
  id: string;
  name: string;
  address: string;
  phone: string;
  email?: string;
  specialties: string[];
  workingHours: string;
  isActive: boolean;
  averageDeliveryTime: number; // days
  qualityRating: number; // 1-5
  priceRange: "low" | "medium" | "high";
}

export interface LabOrder {
  id: string;
  patientId: string;
  patientName: string;
  laboratoryId: string;
  laboratoryName: string;
  treatmentPlanId?: string;
  orderType:
    | "prosthetics"
    | "crown"
    | "bridge"
    | "implant"
    | "orthodontics"
    | "other";
  description: string;
  specifications: {
    material?: string;
    color?: string;
    size?: string;
    quantity?: number;
    specialInstructions?: string;
  };
  status:
    | "ordered"
    | "in_progress"
    | "ready"
    | "delivered"
    | "installed"
    | "cancelled";
  orderDate: string;
  expectedDeliveryDate: string;
  actualDeliveryDate?: string;
  cost: number;
  isPaid: boolean;
  paymentStatus: "pending" | "partial" | "paid";
  doctorNotes?: string;
  labNotes?: string;
  photos?: string[];
  priority: "normal" | "urgent";
  followUpRequired: boolean;
  installationAppointmentId?: string;
}

export interface TreatmentPlan {
  id: string;
  patientId: string;
  patientName: string;
  doctorId: string;
  doctorName: string;
  title: string;
  description: string;
  phases: Array<{
    id: string;
    title: string;
    description: string;
    estimatedDuration: number; // days
    cost: number;
    status: "pending" | "in_progress" | "completed" | "cancelled";
    requiresLab: boolean;
    labOrderId?: string;
    appointments: string[]; // appointment IDs
  }>;
  totalCost: number;
  estimatedDuration: number; // total days
  status: "draft" | "approved" | "in_progress" | "completed" | "cancelled";
  createdDate: string;
  approvedDate?: string;
  completedDate?: string;
  notes?: string;
}

export interface ClinicStats {
  todayAppointments: number;
  pendingAppointments: number;
  completedToday: number;
  totalPatients: number;
  monthlyRevenue: number;
  activeStaff: number;
  lowStock: number;
  upcomingReminders: number;
  totalRevenue: number;
  totalExpenses: number;
  netProfit: number;
  // Lab statistics
  pendingLabOrders: number;
  readyLabOrders: number;
  overdueLabOrders: number;
  thisMonthLabCosts: number;
}

export interface Clinic {
  id: string;
  name: string;
  nameAr: string;
  address: string;
  city: string;
  phone: string;
  email?: string;
  doctorId: string;
  doctorName: string;
  specializations: string[];
  onlineBookingEnabled: boolean;
  bookingLink: string; // e.g., /simplified-booking/{id}
  workingHours: {
    [key: string]: { open: string; close: string; isOpen: boolean };
  };
  timeSlotDuration: number; // in minutes (e.g., 30)
  breakTimes?: Array<{ start: string; end: string }>;
  acceptedTreatments: string[];
}

export interface TimeSlot {
  time: string;
  available: boolean;
  clinicId: string;
  date: string;
}

export interface StaffTask {
  id: string;
  clinicId: string;
  fromStaffId: string;
  fromStaffName: string;
  toStaffId: string;
  toStaffName: string;
  title: string;
  description?: string;
  priority: "low" | "medium" | "high";
  status: "pending" | "accepted" | "rejected" | "completed";
  taskType?: "general" | "treatment_plan" | "purchase_suggestion" | "patient_recall" | "inventory_check" | "lab_order" | "appointment_followup";
  relatedEntityId?: string; // ID for related entity (treatment, patient, product, etc)
  relatedEntityType?: string; // treatment_plan, patient, product, lab_order, etc
  dueDate?: string;
  completedAt?: string;
  rejectionReason?: string;
  createdAt: string;
  updatedAt: string;
}

export interface StaffReminder {
  id: string;
  clinicId: string;
  fromStaffId: string;
  fromStaffName: string;
  toStaffId: string;
  toStaffName: string;
  title: string;
  description?: string;
  reminderTime: string;
  reminderType?: "general" | "appointment" | "medication" | "followup" | "lab_result" | "payment";
  status: "pending" | "acknowledged" | "snoozed" | "dismissed";
  snoozedUntil?: string;
  acknowledgedAt?: string;
  relatedEntityId?: string; // ID for related entity
  relatedEntityType?: string; // appointment, patient, treatment_plan, etc
  relatedAppointmentId?: string;
  createdAt: string;
  updatedAt: string;
}

// Mock data that will be shared between both systems
class SharedClinicDataService {
  // In a real implementation, this would connect to a database/API
  private static instance: SharedClinicDataService;

  private patients: Patient[] = [
    {
      id: "1",
      name: "أحمد محمد الطائي",
      age: 28,
      phone: "+964 770 123 4567",
      email: "ahmed.taie@email.com",
      address: "الكرادة، بغداد",
      lastVisit: "2024-01-15",
      nextAppointment: "2024-01-22",
      treatment: "تنظيف الأسنان",
      status: "active",
      priority: "normal",
      totalVisits: 8,
      totalSpent: 750000,
      notes: "مريض منتظم، لا يوجد حساسية معروفة",
      medicalHistory: ["تسوس أسنان", "التهاب لثة خفيف"],
    },
    {
      id: "2",
      name: "فاطمة علي السعد",
      age: 35,
      phone: "+964 750 987 6543",
      email: "fatima.saad@email.com",
      address: "المنصور، بغداد",
      lastVisit: "2024-01-14",
      nextAppointment: "2024-01-20",
      treatment: "حشوة ضرس",
      status: "in_treatment",
      priority: "high",
      totalVisits: 12,
      totalSpent: 1250000,
      notes: "تحتاج متابعة دورية، حساسية من البنسلين",
      medicalHistory: ["تسوس متقدم", "حشوات سابقة", "تقويم أسنان"],
    },
  ];

  private appointments: Appointment[] = [
    {
      id: "1",
      patientId: "1",
      patientName: "أحمد محمد الطائي",
      date: "2024-01-22",
      time: "10:00",
      duration: 60,
      treatment: "تنظيف الأسنان",
      doctorId: "doc1",
      doctorName: "د. سارة أحمد",
      status: "scheduled",
      reminder: true,
    },
  ];

  private treatments: Treatment[] = [
    {
      id: "1",
      name: "تنظيف الجير",
      description: "إزالة الترسبات الكلسية والجير من الأسنان",
      duration: 30,
      price: 50000,
      category: "وقائي",
      status: "active",
    },
    {
      id: "2",
      name: "تلميع الأسنان",
      description: "تلميع وتنعيم سطح الأسنان بعد التنظيف",
      duration: 20,
      price: 30000,
      category: "وقائي",
      status: "active",
    },
    {
      id: "3",
      name: "حشوة بسيطة",
      description: "حشوة تجميلية بسيطة للأسنان الأمامية أو الخلفية",
      duration: 30,
      price: 75000,
      category: "علاجي",
      status: "active",
    },
    {
      id: "4",
      name: "حشوة معقدة",
      description: "حشوة معقدة تتطلب إزالة تسوس عميق",
      duration: 60,
      price: 120000,
      category: "علاجي",
      status: "active",
    },
    {
      id: "5",
      name: "إنلاي",
      description: "حشوة خزفية داخلية مصنوعة في المختبر",
      duration: 90,
      price: 200000,
      category: "تجميلي",
      status: "active",
    },
    {
      id: "6",
      name: "أونلاي",
      description: "حشوة خزفية جزئية تغطي سطح السن",
      duration: 90,
      price: 250000,
      category: "تجميلي",
      status: "active",
    },
    {
      id: "7",
      name: "تاج/تلبيسة",
      description: "تاج خزفي أو معدني لحماية السن المتضرر",
      duration: 120,
      price: 350000,
      category: "تعويضي",
      status: "active",
    },
    {
      id: "8",
      name: "خلع الأسنان",
      description: "خلع بسيط أو جراحي للأسنان المتضررة",
      duration: 45,
      price: 60000,
      category: "جراحي",
      status: "active",
    },
    {
      id: "9",
      name: "تقويم الأسنان",
      description: "علاج تقويمي لتصحيح وضعية الأسنان والفكين",
      duration: 60,
      price: 2500000,
      category: "تقويمي",
      status: "active",
    },
    {
      id: "10",
      name: "زراعة الأسنان",
      description: "زراعة جذر صناعي (Implant) لتعويض الأسنان المفقودة",
      duration: 120,
      price: 1200000,
      category: "جراحي",
      status: "active",
    },
    {
      id: "11",
      name: "علاج العصب",
      description: "علاج قنوات الجذور وإزالة العصب المصاب",
      duration: 90,
      price: 180000,
      category: "علاجي",
      status: "active",
    },
  ];

  private staff: Staff[] = [
    {
      id: "doc1",
      name: "د. سارة أحمد",
      role: "doctor",
      phone: "+964 770 111 2222",
      email: "dr.sara@clinic.com",
      specialization: "علاج الجذور",
      status: "active",
      permissions: ["view_patients", "edit_patients", "manage_appointments"],
    },
    {
      id: "doc2",
      name: "د. أحمد محمد",
      role: "doctor",
      phone: "+964 750 222 3333",
      email: "dr.ahmed@clinic.com",
      specialization: "جراحة الفم",
      status: "active",
      permissions: ["view_patients", "edit_patients", "manage_appointments"],
    },
    {
      id: "nurse1",
      name: "فاطمة علي",
      role: "assistant",
      phone: "+964 770 333 4444",
      email: "fatima.ali@clinic.com",
      specialization: "الرعاية العامة",
      status: "active",
      permissions: ["view_patients", "assist_treatment"],
    },
    {
      id: "doc3",
      name: "علي حسن",
      role: "doctor",
      phone: "+964 750 444 5555",
      email: "ali.hassan@clinic.com",
      specialization: "تقويم الأسنان",
      status: "on_leave",
      permissions: ["view_patients", "edit_patients", "manage_appointments"],
    },
    {
      id: "receptionist1",
      name: "زينب محمود",
      role: "receptionist",
      phone: "+964 770 555 6666",
      email: "zeinab.mahmoud@clinic.com",
      specialization: "خدمة العملاء",
      status: "active",
      permissions: ["view_patients", "manage_appointments"],
    },
    {
      id: "assist1",
      name: "محمد كريم",
      role: "assistant",
      phone: "+964 750 666 7777",
      email: "mohammed.karim@clinic.com",
      specialization: "التصوير الطبي",
      status: "active",
      permissions: ["view_patients", "manage_equipment"],
    },
  ];

  private clinics: Clinic[] = [
    {
      id: "clinic-1",
      name: "Baghdad Dental Center",
      nameAr: "مركز بغداد لطب الأسنان",
      address: "الكرادة، بغداد",
      city: "بغداد",
      phone: "+964 770 123 4567",
      email: "info@baghdaddental.iq",
      doctorId: "doc1",
      doctorName: "د. سارة أحمد",
      specializations: ["علاج الجذور", "تنظيف الأسنان", "حشوات تجميلية"],
      onlineBookingEnabled: true,
      bookingLink: "/simplified-booking/1",
      workingHours: {
        sunday: { open: "09:00", close: "18:00", isOpen: true },
        monday: { open: "09:00", close: "18:00", isOpen: true },
        tuesday: { open: "09:00", close: "18:00", isOpen: true },
        wednesday: { open: "09:00", close: "18:00", isOpen: true },
        thursday: { open: "09:00", close: "18:00", isOpen: true },
        friday: { open: "00:00", close: "00:00", isOpen: false },
        saturday: { open: "10:00", close: "14:00", isOpen: true },
      },
      timeSlotDuration: 30,
      breakTimes: [{ start: "12:00", end: "13:00" }],
      acceptedTreatments: ["تنظيف الأسنان", "حشوة أسنان", "فحص عام"],
    },
    {
      id: "clinic-2",
      name: "Al-Mansour Dental Clinic",
      nameAr: "عيادة المنصور لطب الأسنان",
      address: "المنصور، بغداد",
      city: "بغداد",
      phone: "+964 750 222 3333",
      email: "info@mansour-dental.iq",
      doctorId: "doc2",
      doctorName: "د. أحمد محمد",
      specializations: ["جراحة الفم", "زراعة الأسنان"],
      onlineBookingEnabled: true,
      bookingLink: "/simplified-booking/2",
      workingHours: {
        sunday: { open: "08:00", close: "17:00", isOpen: true },
        monday: { open: "08:00", close: "17:00", isOpen: true },
        tuesday: { open: "08:00", close: "17:00", isOpen: true },
        wednesday: { open: "08:00", close: "17:00", isOpen: true },
        thursday: { open: "08:00", close: "17:00", isOpen: true },
        friday: { open: "00:00", close: "00:00", isOpen: false },
        saturday: { open: "09:00", close: "13:00", isOpen: true },
      },
      timeSlotDuration: 45,
      breakTimes: [{ start: "11:30", end: "12:30" }],
      acceptedTreatments: ["جراحة الفم", "زراعة الأسنان", "خلع الأسنان"],
    },
  ];

  private inventory: InventoryItem[] = [
    {
      id: "1",
      name: "مخدر موضعي",
      category: "medicine",
      currentStock: 5,
      minStock: 10,
      maxStock: 50,
      unit: "أمبولة",
      price: 25000,
      supplier: "شركة الأدوية المتحدة",
      expiryDate: "2024-06-15",
      status: "low_stock",
    },
    {
      id: "2",
      name: "قفازات طبية",
      category: "supplies",
      currentStock: 150,
      minStock: 100,
      maxStock: 500,
      unit: "صندوق",
      price: 15000,
      supplier: "شركة المستلزمات الطبية",
      expiryDate: "2025-12-31",
      status: "in_stock",
    },
    {
      id: "3",
      name: "مراية فحص الأسنان",
      category: "equipment",
      currentStock: 2,
      minStock: 5,
      maxStock: 20,
      unit: "قطعة",
      price: 45000,
      supplier: "شركة الأدوات الطبية",
      status: "low_stock",
    },
    {
      id: "4",
      name: "مادة الحشو التجميلي",
      category: "medicine",
      currentStock: 25,
      minStock: 15,
      maxStock: 100,
      unit: "أنبوب",
      price: 120000,
      supplier: "شركة المواد التجميلية",
      expiryDate: "2024-08-30",
      status: "in_stock",
    },
    {
      id: "5",
      name: "أقراص مسكنة للألم",
      category: "medicine",
      currentStock: 80,
      minStock: 30,
      maxStock: 200,
      unit: "علبة",
      price: 8000,
      supplier: "شركة الأدوية المتحدة",
      expiryDate: "2024-09-15",
      status: "in_stock",
    },
    {
      id: "6",
      name: "إبر حقن",
      category: "supplies",
      currentStock: 200,
      minStock: 150,
      maxStock: 500,
      unit: "حزمة",
      price: 12000,
      supplier: "شركة المستلزمات الطبية",
      expiryDate: "2025-06-30",
      status: "in_stock",
    },
    {
      id: "7",
      name: "معجون أسنان طبي",
      category: "medicine",
      currentStock: 0,
      minStock: 20,
      maxStock: 100,
      unit: "أنبوب",
      price: 5000,
      supplier: "شركة العناية بالأسنان",
      status: "out_of_stock",
    },
    {
      id: "8",
      name: "كمامات جراحية",
      category: "supplies",
      currentStock: 5,
      minStock: 50,
      maxStock: 300,
      unit: "صندوق",
      price: 10000,
      supplier: "شركة المستلزمات الطبية",
      expiryDate: "2025-03-15",
      status: "low_stock",
    },
    {
      id: "9",
      name: "ملقط طبي",
      category: "equipment",
      currentStock: 15,
      minStock: 10,
      maxStock: 30,
      unit: "قطعة",
      price: 35000,
      supplier: "شركة الأدوات الطبية",
      status: "in_stock",
    },
    {
      id: "10",
      name: "محلول تعقيم",
      category: "supplies",
      currentStock: 30,
      minStock: 25,
      maxStock: 100,
      unit: "زجاجة",
      price: 18000,
      supplier: "شركة المواد الطبية",
      expiryDate: "2024-12-31",
      status: "in_stock",
    },
  ];

  private financialRecords: FinancialRecord[] = [
    {
      id: "1",
      type: "income",
      amount: 50000,
      description: "تنظيف أسنان",
      category: "خدمات طبية",
      date: "2024-01-15",
      relatedTo: {
        type: "patient",
        id: "1",
        name: "أحمد محمد الطائي",
      },
      paymentMethod: "cash",
      status: "completed",
    },
  ];

  private laboratories: Laboratory[] = [
    {
      id: "lab1",
      name: "مختبر الدقة لطب الأسنان",
      address: "شارع الجادرية، بغداد",
      phone: "+964 770 111 3333",
      email: "info@precision-lab.com",
      specialties: [
        "تركيبات سيراميك",
        "أطقم أسنان",
        "تيجان زيركونيا",
        "تقويم الأسنان",
      ],
      workingHours: "8:00 ص - 6:00 م",
      isActive: true,
      averageDeliveryTime: 5,
      qualityRating: 4.8,
      priceRange: "medium",
    },
    {
      id: "lab2",
      name: "مختبر التميز الذهبي",
      address: "شارع الكرادة، بغداد",
      phone: "+964 750 222 4444",
      email: "orders@golden-excellence.com",
      specialties: ["تركيبات ذهبية", "تيجان بورسلين", "جسور ثابتة"],
      workingHours: "9:00 ص - 7:00 م",
      isActive: true,
      averageDeliveryTime: 7,
      qualityRating: 4.9,
      priceRange: "high",
    },
  ];

  private labOrders: LabOrder[] = [
    {
      id: "order1",
      patientId: "1",
      patientName: "أحمد محمد الطائي",
      laboratoryId: "lab1",
      laboratoryName: "مختبر الدقة لطب الأسنان",
      treatmentPlanId: "plan1",
      orderType: "crown",
      description: "تاج سيراميك للضرس العلوي الأيمن",
      specifications: {
        material: "سيراميك زيركونيا",
        color: "A2",
        quantity: 1,
        specialInstructions: "مطابقة اللون مع الأسنان الطبيعية",
      },
      status: "in_progress",
      orderDate: "2024-01-18",
      expectedDeliveryDate: "2024-01-23",
      cost: 200000,
      isPaid: false,
      paymentStatus: "pending",
      priority: "normal",
      followUpRequired: true,
    },
    {
      id: "order2",
      patientId: "2",
      patientName: "فاطمة علي السعد",
      laboratoryId: "lab2",
      laboratoryName: "مختبر التميز الذهبي",
      orderType: "prosthetics",
      description: "طقم أسنان علوي جزئي",
      specifications: {
        material: "أكريليك مقوى",
        color: "طبيعي",
        quantity: 1,
      },
      status: "ready",
      orderDate: "2024-01-12",
      expectedDeliveryDate: "2024-01-19",
      actualDeliveryDate: "2024-01-19",
      cost: 350000,
      isPaid: true,
      paymentStatus: "paid",
      priority: "normal",
      followUpRequired: true,
    },
  ];

  private treatmentPlans: TreatmentPlan[] = [
    {
      id: "plan1",
      patientId: "1",
      patientName: "أحمد محمد الطائي",
      doctorId: "doc1",
      doctorName: "د. سارة أحمد",
      title: "خطة علاج شاملة للأسنان الخلفية",
      description: "علاج تسوس متقدم وتركيب تاج للضرس العلوي",
      phases: [
        {
          id: "phase1",
          title: "علاج العصب",
          description: "علاج عصب الضرس العلوي الأيمن",
          estimatedDuration: 7,
          cost: 120000,
          status: "completed",
          requiresLab: false,
          appointments: ["1"],
        },
        {
          id: "phase2",
          title: "تحضير وتركيب التاج",
          description: "تحضير السن وأخذ طبعة وتركيب تاج زيركونيا",
          estimatedDuration: 14,
          cost: 200000,
          status: "in_progress",
          requiresLab: true,
          labOrderId: "order1",
          appointments: ["2"],
        },
      ],
      totalCost: 320000,
      estimatedDuration: 21,
      status: "in_progress",
      createdDate: "2024-01-15",
      approvedDate: "2024-01-15",
    },
  ];

  private staffTasks: StaffTask[] = [
    {
      id: "1",
      clinicId: "1",
      fromStaffId: "3",
      fromStaffName: "أحمد - السكرتير",
      toStaffId: "1",
      toStaffName: "د. أحمد محمد",
      title: "تحديث قائمة المخزون",
      description: "مراجعة وتحديث قائمة المخزون الطبي",
      priority: "high",
      status: "pending",
      taskType: "inventory_check",
      dueDate: "2024-01-25",
      createdAt: "2024-01-20",
      updatedAt: "2024-01-20",
    },
    {
      id: "2",
      clinicId: "1",
      fromStaffId: "4",
      fromStaffName: "فاطمة - المحاسب",
      toStaffId: "1",
      toStaffName: "د. أحمد محمد",
      title: "مراجعة الفواتير",
      description: "مراجعة فواتير الأسبوع الماضي",
      priority: "medium",
      status: "pending",
      taskType: "purchase_suggestion",
      dueDate: "2024-01-23",
      createdAt: "2024-01-20",
      updatedAt: "2024-01-20",
    },
    {
      id: "3",
      clinicId: "1",
      fromStaffId: "1",
      fromStaffName: "د. أحمد محمد",
      toStaffId: "3",
      toStaffName: "أحمد - السكرتير",
      title: "إعداد خطة علاج للمريض فاطمة",
      description: "تحضير خطة علاج شاملة لتقويم الأسنان",
      priority: "high",
      status: "pending",
      taskType: "treatment_plan",
      relatedEntityId: "2",
      relatedEntityType: "patient",
      dueDate: "2024-01-24",
      createdAt: "2024-01-20",
      updatedAt: "2024-01-20",
    },
    {
      id: "4",
      clinicId: "1",
      fromStaffId: "3",
      fromStaffName: "أحمد - السكرتير",
      toStaffId: "1",
      toStaffName: "د. أحمد محمد",
      title: "استدعاء المريض أحمد للفحص الدوري",
      description: "تذكير المريض بموعد الفحص الدوري بعد 6 أشهر",
      priority: "low",
      status: "pending",
      taskType: "patient_recall",
      relatedEntityId: "1",
      relatedEntityType: "patient",
      dueDate: "2024-02-15",
      createdAt: "2024-01-20",
      updatedAt: "2024-01-20",
    },
    {
      id: "5",
      clinicId: "1",
      fromStaffId: "1",
      fromStaffName: "د. أحمد محمد",
      toStaffId: "4",
      toStaffName: "فاطمة - المحاسب",
      title: "طلب شراء مواد تعقيم",
      description: "المخزون منخفض، طلب 10 زجاجات محلول تعقيم",
      priority: "high",
      status: "pending",
      taskType: "purchase_suggestion",
      relatedEntityId: "10",
      relatedEntityType: "product",
      dueDate: "2024-01-22",
      createdAt: "2024-01-20",
      updatedAt: "2024-01-20",
    },
    {
      id: "6",
      clinicId: "1",
      fromStaffId: "1",
      fromStaffName: "د. أحمد محمد",
      toStaffId: "3",
      toStaffName: "أحمد - السكرتير",
      title: "متابعة طلب المختبر",
      description: "متابعة طلب التاج من المختبر - موعد الاستلام غداً",
      priority: "medium",
      status: "pending",
      taskType: "lab_order",
      relatedEntityId: "order1",
      relatedEntityType: "lab_order",
      dueDate: "2024-01-21",
      createdAt: "2024-01-20",
      updatedAt: "2024-01-20",
    },
    {
      id: "7",
      clinicId: "1",
      fromStaffId: "3",
      fromStaffName: "أحمد - السكرتير",
      toStaffId: "1",
      toStaffName: "د. أحمد محمد",
      title: "متابعة مع مريض بعد الجراحة",
      description: "الاتصال بالمريض محمد للتأكد من حالته بعد خلع الضرس",
      priority: "high",
      status: "accepted",
      taskType: "appointment_followup",
      relatedEntityId: "3",
      relatedEntityType: "appointment",
      dueDate: "2024-01-21",
      createdAt: "2024-01-19",
      updatedAt: "2024-01-20",
    },
  ];

  private staffReminders: StaffReminder[] = [
    {
      id: "1",
      clinicId: "1",
      fromStaffId: "3",
      fromStaffName: "أحمد - السكرتير",
      toStaffId: "1",
      toStaffName: "د. أحمد محمد",
      title: "اتصال بمريض متابعة",
      description: "متابعة حالة المريض أحمد بعد العملية",
      reminderTime: "2024-01-20T16:00:00",
      reminderType: "followup",
      status: "pending",
      relatedEntityId: "1",
      relatedEntityType: "patient",
      relatedAppointmentId: "1",
      createdAt: "2024-01-20",
      updatedAt: "2024-01-20",
    },
    {
      id: "2",
      clinicId: "1",
      fromStaffId: "4",
      fromStaffName: "فاطمة - المحاسب",
      toStaffId: "1",
      toStaffName: "د. أحمد محمد",
      title: "طلب أدوات من المورد",
      description: "طلب قفازات وكمامات من المورد",
      reminderTime: "2024-01-21T10:00:00",
      reminderType: "general",
      status: "pending",
      createdAt: "2024-01-20",
      updatedAt: "2024-01-20",
    },
    {
      id: "3",
      clinicId: "1",
      fromStaffId: "1",
      fromStaffName: "د. أحمد محمد",
      toStaffId: "3",
      toStaffName: "أحمد - السكرتير",
      title: "موعد مع المريضة فاطمة غداً",
      description: "تذكير بموعد فاطمة الساعة 10 صباحاً لتركيب التاج",
      reminderTime: "2024-01-21T09:00:00",
      reminderType: "appointment",
      status: "pending",
      relatedEntityId: "2",
      relatedEntityType: "appointment",
      relatedAppointmentId: "2",
      createdAt: "2024-01-20",
      updatedAt: "2024-01-20",
    },
    {
      id: "4",
      clinicId: "1",
      fromStaffId: "3",
      fromStaffName: "أحمد - السكرتير",
      toStaffId: "1",
      toStaffName: "د. أحمد محمد",
      title: "تذكير بوصفة المريض محمد",
      description: "تذكير المريض بتناول المضاد الحيوي ثلاث مرات يومياً",
      reminderTime: "2024-01-21T14:00:00",
      reminderType: "medication",
      status: "pending",
      relatedEntityId: "3",
      relatedEntityType: "patient",
      createdAt: "2024-01-20",
      updatedAt: "2024-01-20",
    },
    {
      id: "5",
      clinicId: "1",
      fromStaffId: "1",
      fromStaffName: "د. أحمد محمد",
      toStaffId: "3",
      toStaffName: "أحمد - السكرتير",
      title: "استلام نتائج المختبر",
      description: "استلام تاج الزيركونيا من المختبر للمريضة فاطمة",
      reminderTime: "2024-01-22T11:00:00",
      reminderType: "lab_result",
      status: "pending",
      relatedEntityId: "order1",
      relatedEntityType: "lab_order",
      createdAt: "2024-01-20",
      updatedAt: "2024-01-20",
    },
    {
      id: "6",
      clinicId: "1",
      fromStaffId: "4",
      fromStaffName: "فاطمة - المحاسب",
      toStaffId: "1",
      toStaffName: "د. أحمد محمد",
      title: "تحصيل دفعة من المريض علي",
      description: "تذكير بتحصيل الدفعة الثانية من خطة العلاج",
      reminderTime: "2024-01-23T15:00:00",
      reminderType: "payment",
      status: "pending",
      relatedEntityId: "3",
      relatedEntityType: "patient",
      createdAt: "2024-01-20",
      updatedAt: "2024-01-20",
    },
  ];

  static getInstance(): SharedClinicDataService {
    if (!SharedClinicDataService.instance) {
      SharedClinicDataService.instance = new SharedClinicDataService();
    }
    return SharedClinicDataService.instance;
  }

  // Patient management methods
  async getPatients(): Promise<Patient[]> {
    return this.patients;
  }

  async getPatient(id: string): Promise<Patient | null> {
    return this.patients.find((p) => p.id === id) || null;
  }

  async addPatient(patient: Omit<Patient, "id">): Promise<Patient> {
    const newPatient: Patient = {
      ...patient,
      id: Date.now().toString(),
    };
    this.patients.push(newPatient);
    return newPatient;
  }

  async updatePatient(
    id: string,
    updates: Partial<Patient>,
  ): Promise<Patient | null> {
    const index = this.patients.findIndex((p) => p.id === id);
    if (index >= 0) {
      this.patients[index] = { ...this.patients[index], ...updates };
      return this.patients[index];
    }
    return null;
  }

  // Appointment management methods
  async getAppointments(): Promise<Appointment[]> {
    return this.appointments;
  }

  async addAppointment(
    appointment: Omit<Appointment, "id">,
  ): Promise<Appointment> {
    const newAppointment: Appointment = {
      ...appointment,
      id: Date.now().toString(),
    };
    this.appointments.push(newAppointment);
    return newAppointment;
  }

  async updateAppointment(
    id: string,
    updates: Partial<Appointment>,
  ): Promise<Appointment | null> {
    const index = this.appointments.findIndex((a) => a.id === id);
    if (index >= 0) {
      this.appointments[index] = { ...this.appointments[index], ...updates };
      return this.appointments[index];
    }
    return null;
  }

  // Treatment management methods
  async getTreatments(): Promise<Treatment[]> {
    return this.treatments;
  }

  // Staff management methods
  async getStaff(clinicId?: number): Promise<Staff[]> {
    // If clinicId is provided, fetch from API
    if (clinicId) {
      try {
        const response = await fetch(`/api/clinics/${clinicId}/staff`);
        if (response.ok) {
          const apiStaff = await response.json();
          // Convert API staff format to our Staff interface
          return apiStaff.map((s: any) => ({
            id: s.id.toString(),
            name: s.arabicName || s.name,
            role: this.mapRoleToType(s.role),
            phone: s.phone || '',
            email: s.email || '',
            specialization: s.arabicSpecialization || s.specialization,
            status: this.mapStatus(s.status),
            permissions: s.permissions || [],
          }));
        }
      } catch (error) {
        console.error('Error fetching staff from API:', error);
      }
    }
    
    // Fallback to mock data
    return this.staff;
  }
  
  private mapRoleToType(role: string): "doctor" | "nurse" | "assistant" | "receptionist" | "manager" {
    const roleMap: Record<string, "doctor" | "nurse" | "assistant" | "receptionist" | "manager"> = {
      'doctor': 'doctor',
      'طبيب': 'doctor',
      'nurse': 'nurse',
      'ممرض': 'nurse',
      'ممرضة': 'nurse',
      'assistant': 'assistant',
      'مساعد': 'assistant',
      'receptionist': 'receptionist',
      'موظف استقبال': 'receptionist',
      'manager': 'manager',
      'مدير': 'manager',
    };
    return roleMap[role] || 'assistant';
  }
  
  private mapStatus(status: string | null): "active" | "on_leave" | "inactive" {
    if (!status) return 'active';
    const statusMap: Record<string, "active" | "on_leave" | "inactive"> = {
      'active': 'active',
      'نشط': 'active',
      'on_leave': 'on_leave',
      'في إجازة': 'on_leave',
      'inactive': 'inactive',
      'غير نشط': 'inactive',
    };
    return statusMap[status] || 'active';
  }

  async addStaffMember(staff: Staff): Promise<Staff> {
    this.staff.push(staff);
    return staff;
  }

  async updateStaffMember(id: string, updates: Partial<Staff>): Promise<Staff | null> {
    const index = this.staff.findIndex((s) => s.id === id);
    if (index >= 0) {
      this.staff[index] = { ...this.staff[index], ...updates };
      return this.staff[index];
    }
    return null;
  }

  async deleteStaffMember(id: string): Promise<boolean> {
    const index = this.staff.findIndex((s) => s.id === id);
    if (index >= 0) {
      this.staff.splice(index, 1);
      return true;
    }
    return false;
  }

  // Inventory management methods
  async getInventory(): Promise<InventoryItem[]> {
    return this.inventory;
  }

  // Financial management methods
  async getFinancialRecords(): Promise<FinancialRecord[]> {
    return this.financialRecords;
  }

  // Laboratory management methods
  async getLaboratories(): Promise<Laboratory[]> {
    return this.laboratories;
  }

  async addLaboratory(lab: Omit<Laboratory, "id">): Promise<Laboratory> {
    const newLab: Laboratory = {
      ...lab,
      id: Date.now().toString(),
    };
    this.laboratories.push(newLab);
    return newLab;
  }

  async getLabOrders(): Promise<LabOrder[]> {
    return this.labOrders;
  }

  async getLabOrder(id: string): Promise<LabOrder | null> {
    return this.labOrders.find((order) => order.id === id) || null;
  }

  async addLabOrder(order: Omit<LabOrder, "id">): Promise<LabOrder> {
    const newOrder: LabOrder = {
      ...order,
      id: Date.now().toString(),
    };
    this.labOrders.push(newOrder);

    // Add lab cost to financial records
    const labExpense: FinancialRecord = {
      id: (Date.now() + 1).toString(),
      type: "expense",
      amount: order.cost,
      description: `طلب مختبر: ${order.description}`,
      category: "مختبر",
      date: order.orderDate,
      relatedTo: {
        type: "patient",
        id: order.patientId,
        name: order.patientName,
      },
      paymentMethod: "transfer",
      status: order.isPaid ? "completed" : "pending",
    };
    this.financialRecords.push(labExpense);

    return newOrder;
  }

  async updateLabOrder(
    id: string,
    updates: Partial<LabOrder>,
  ): Promise<LabOrder | null> {
    const index = this.labOrders.findIndex((order) => order.id === id);
    if (index >= 0) {
      this.labOrders[index] = { ...this.labOrders[index], ...updates };
      return this.labOrders[index];
    }
    return null;
  }

  // Treatment Plans management methods
  async getTreatmentPlans(): Promise<TreatmentPlan[]> {
    return this.treatmentPlans;
  }

  async getTreatmentPlan(id: string): Promise<TreatmentPlan | null> {
    return this.treatmentPlans.find((plan) => plan.id === id) || null;
  }

  async addTreatmentPlan(
    plan: Omit<TreatmentPlan, "id">,
  ): Promise<TreatmentPlan> {
    const newPlan: TreatmentPlan = {
      ...plan,
      id: Date.now().toString(),
    };
    this.treatmentPlans.push(newPlan);
    return newPlan;
  }

  async updateTreatmentPlan(
    id: string,
    updates: Partial<TreatmentPlan>,
  ): Promise<TreatmentPlan | null> {
    const index = this.treatmentPlans.findIndex((plan) => plan.id === id);
    if (index >= 0) {
      this.treatmentPlans[index] = {
        ...this.treatmentPlans[index],
        ...updates,
      };
      return this.treatmentPlans[index];
    }
    return null;
  }

  async getPatientTreatmentPlans(patientId: string): Promise<TreatmentPlan[]> {
    return this.treatmentPlans.filter((plan) => plan.patientId === patientId);
  }

  async getPatientLabOrders(patientId: string): Promise<LabOrder[]> {
    return this.labOrders.filter((order) => order.patientId === patientId);
  }

  // Staff Tasks management methods
  async getStaffTasks(clinicId?: string): Promise<StaffTask[]> {
    if (clinicId) {
      return this.staffTasks.filter((task) => task.clinicId === clinicId);
    }
    return this.staffTasks;
  }

  async getStaffTask(id: string): Promise<StaffTask | null> {
    return this.staffTasks.find((task) => task.id === id) || null;
  }

  async addStaffTask(task: Omit<StaffTask, "id" | "createdAt" | "updatedAt">): Promise<StaffTask> {
    const now = new Date().toISOString();
    const newTask: StaffTask = {
      ...task,
      id: Date.now().toString(),
      createdAt: now,
      updatedAt: now,
    };
    this.staffTasks.push(newTask);
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('tasksRemindersUpdated'));
    }
    return newTask;
  }

  async updateStaffTask(
    id: string,
    updates: Partial<StaffTask>,
  ): Promise<StaffTask | null> {
    const index = this.staffTasks.findIndex((task) => task.id === id);
    if (index >= 0) {
      this.staffTasks[index] = {
        ...this.staffTasks[index],
        ...updates,
        updatedAt: new Date().toISOString(),
      };
      // Notify listeners of update
      if (typeof window !== 'undefined') {
        window.dispatchEvent(new CustomEvent('tasksRemindersUpdated'));
      }
      return this.staffTasks[index];
    }
    return null;
  }

  async deleteStaffTask(id: string): Promise<boolean> {
    const index = this.staffTasks.findIndex((task) => task.id === id);
    if (index >= 0) {
      this.staffTasks.splice(index, 1);
      if (typeof window !== 'undefined') {
        window.dispatchEvent(new CustomEvent('tasksRemindersUpdated'));
      }
      return true;
    }
    return false;
  }

  // Staff Reminders management methods
  async getStaffReminders(clinicId?: string): Promise<StaffReminder[]> {
    if (clinicId) {
      return this.staffReminders.filter((reminder) => reminder.clinicId === clinicId);
    }
    return this.staffReminders;
  }

  async getStaffReminder(id: string): Promise<StaffReminder | null> {
    return this.staffReminders.find((reminder) => reminder.id === id) || null;
  }

  async addStaffReminder(
    reminder: Omit<StaffReminder, "id" | "createdAt" | "updatedAt">,
  ): Promise<StaffReminder> {
    const now = new Date().toISOString();
    const newReminder: StaffReminder = {
      ...reminder,
      id: Date.now().toString(),
      createdAt: now,
      updatedAt: now,
    };
    this.staffReminders.push(newReminder);
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('tasksRemindersUpdated'));
    }
    return newReminder;
  }

  async updateStaffReminder(
    id: string,
    updates: Partial<StaffReminder>,
  ): Promise<StaffReminder | null> {
    const index = this.staffReminders.findIndex((reminder) => reminder.id === id);
    if (index >= 0) {
      this.staffReminders[index] = {
        ...this.staffReminders[index],
        ...updates,
        updatedAt: new Date().toISOString(),
      };
      if (typeof window !== 'undefined') {
        window.dispatchEvent(new CustomEvent('tasksRemindersUpdated'));
      }
      return this.staffReminders[index];
    }
    return null;
  }

  async deleteStaffReminder(id: string): Promise<boolean> {
    const index = this.staffReminders.findIndex((reminder) => reminder.id === id);
    if (index >= 0) {
      this.staffReminders.splice(index, 1);
      if (typeof window !== 'undefined') {
        window.dispatchEvent(new CustomEvent('tasksRemindersUpdated'));
      }
      return true;
    }
    return false;
  }

  // Statistics methods
  async getClinicStats(): Promise<ClinicStats> {
    const today = new Date().toISOString().split("T")[0];
    const thisMonth = new Date().toISOString().substring(0, 7);

    const todayAppointments = this.appointments.filter(
      (a) => a.date === today,
    ).length;
    const pendingAppointments = this.appointments.filter(
      (a) => a.status === "scheduled",
    ).length;
    const completedToday = this.appointments.filter(
      (a) => a.date === today && a.status === "completed",
    ).length;
    const totalPatients = this.patients.length;

    const monthlyRevenue = this.financialRecords
      .filter((r) => r.type === "income" && r.date.startsWith(thisMonth))
      .reduce((sum, r) => sum + r.amount, 0);

    const totalRevenue = this.financialRecords
      .filter((r) => r.type === "income")
      .reduce((sum, r) => sum + r.amount, 0);

    const totalExpenses = this.financialRecords
      .filter((r) => r.type === "expense")
      .reduce((sum, r) => sum + r.amount, 0);

    const activeStaff = this.staff.filter((s) => s.status === "active").length;
    const lowStock = this.inventory.filter(
      (i) => i.status === "low_stock" || i.status === "out_of_stock",
    ).length;

    // Lab statistics
    const pendingLabOrders = this.labOrders.filter(
      (order) => order.status === "ordered" || order.status === "in_progress",
    ).length;
    const readyLabOrders = this.labOrders.filter(
      (order) => order.status === "ready",
    ).length;
    const overdueLabOrders = this.labOrders.filter((order) => {
      const expectedDate = new Date(order.expectedDeliveryDate);
      const today = new Date();
      return (
        expectedDate < today &&
        (order.status === "ordered" || order.status === "in_progress")
      );
    }).length;

    const thisMonthLabCosts = this.financialRecords
      .filter(
        (r) =>
          r.type === "expense" &&
          r.category === "مختبر" &&
          r.date.startsWith(thisMonth),
      )
      .reduce((sum, r) => sum + r.amount, 0);

    return {
      todayAppointments,
      pendingAppointments,
      completedToday,
      totalPatients,
      monthlyRevenue,
      activeStaff,
      lowStock,
      upcomingReminders: 4, // Mock data
      totalRevenue,
      totalExpenses,
      netProfit: totalRevenue - totalExpenses,
      pendingLabOrders,
      readyLabOrders,
      overdueLabOrders,
      thisMonthLabCosts,
    };
  }

  // Search and filter methods
  async searchPatients(query: string): Promise<Patient[]> {
    const lowerQuery = query.toLowerCase();
    return this.patients.filter(
      (p) =>
        p.name.toLowerCase().includes(lowerQuery) ||
        p.phone.includes(query) ||
        p.treatment.toLowerCase().includes(lowerQuery),
    );
  }

  async getPatientsByStatus(status: Patient["status"]): Promise<Patient[]> {
    return this.patients.filter((p) => p.status === status);
  }

  // System configuration methods
  async getSystemConfig(): Promise<{ defaultClinicSystem: "new" | "old" }> {
    // This would typically be stored in a database or configuration file
    return { defaultClinicSystem: "new" };
  }

  async setSystemConfig(config: {
    defaultClinicSystem: "new" | "old";
  }): Promise<void> {
    // This would typically save to a database or configuration file
    console.log("System config updated:", config);
  }

  // Clinic management methods
  async getClinics(): Promise<Clinic[]> {
    return [...this.clinics];
  }

  async getClinic(clinicId: string): Promise<Clinic | null> {
    return this.clinics.find((c) => c.id === clinicId) || null;
  }

  async updateClinicBookingSettings(
    clinicId: string,
    settings: Partial<Pick<Clinic, "onlineBookingEnabled" | "workingHours" | "timeSlotDuration" | "breakTimes" | "acceptedTreatments">>
  ): Promise<Clinic | null> {
    const index = this.clinics.findIndex((c) => c.id === clinicId);
    if (index !== -1) {
      this.clinics[index] = { ...this.clinics[index], ...settings };
      return this.clinics[index];
    }
    return null;
  }

  async getAvailableTimeSlots(clinicId: string, date: string): Promise<TimeSlot[]> {
    const clinic = await this.getClinic(clinicId);
    if (!clinic || !clinic.onlineBookingEnabled) {
      return [];
    }

    const dayOfWeek = new Date(date).toLocaleDateString('en-US', { weekday: 'long' }).toLowerCase();
    const daySchedule = clinic.workingHours[dayOfWeek];

    if (!daySchedule || !daySchedule.isOpen) {
      return [];
    }

    const slots: TimeSlot[] = [];
    const [openHour, openMinute] = daySchedule.open.split(':').map(Number);
    const [closeHour, closeMinute] = daySchedule.close.split(':').map(Number);

    let currentTime = openHour * 60 + openMinute;
    const endTime = closeHour * 60 + closeMinute;

    while (currentTime + clinic.timeSlotDuration <= endTime) {
      const hour = Math.floor(currentTime / 60);
      const minute = currentTime % 60;
      const timeString = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;

      const isBreak = clinic.breakTimes?.some((breakTime) => {
        const [breakStart] = breakTime.start.split(':').map(Number);
        const [breakEnd] = breakTime.end.split(':').map(Number);
        const breakStartMinutes = breakStart * 60;
        const breakEndMinutes = breakEnd * 60;
        return currentTime >= breakStartMinutes && currentTime < breakEndMinutes;
      });

      if (!isBreak) {
        const existingAppointment = this.appointments.find(
          (apt) => apt.date === date && apt.time === timeString
        );

        slots.push({
          time: timeString,
          available: !existingAppointment,
          clinicId,
          date,
        });
      }

      currentTime += clinic.timeSlotDuration;
    }

    return slots;
  }

  async createOnlineBooking(data: {
    clinicId: string;
    patientName: string;
    patientPhone: string;
    patientEmail: string;
    date: string;
    time: string;
    treatment: string;
  }): Promise<Appointment | null> {
    const clinic = await this.getClinic(data.clinicId);
    if (!clinic || !clinic.onlineBookingEnabled) {
      return null;
    }

    const timeSlots = await this.getAvailableTimeSlots(data.clinicId, data.date);
    const selectedSlot = timeSlots.find((slot) => slot.time === data.time);

    if (!selectedSlot || !selectedSlot.available) {
      return null;
    }

    const newPatient: Patient = {
      id: `patient-${Date.now()}`,
      name: data.patientName,
      age: 0,
      phone: data.patientPhone,
      email: data.patientEmail,
      address: "",
      lastVisit: data.date,
      nextAppointment: data.date,
      treatment: data.treatment,
      status: "active",
      priority: "normal",
      totalVisits: 1,
      totalSpent: 0,
      notes: "حجز عبر الإنترنت",
      medicalHistory: [],
    };

    this.patients.push(newPatient);

    const treatment = this.treatments.find((t) => t.name === data.treatment);
    const newAppointment: Appointment = {
      id: `apt-${Date.now()}`,
      patientId: newPatient.id,
      patientName: data.patientName,
      date: data.date,
      time: data.time,
      duration: treatment?.duration || 30,
      treatment: data.treatment,
      doctorId: clinic.doctorId,
      doctorName: clinic.doctorName,
      status: "scheduled",
      source: "online_booking",
      patientPhone: data.patientPhone,
      patientEmail: data.patientEmail,
      reminder: true,
    };

    this.appointments.push(newAppointment);
    return newAppointment;
  }
}

export const sharedClinicData = SharedClinicDataService.getInstance();
export default SharedClinicDataService;
