// Subscription management service for Iraqi Dental Platform
// Handles subscription plans, promo codes, activations, and reminders

export interface SubscriptionPlan {
  id: string;
  name: string;
  nameAr: string;
  description: string;
  descriptionAr: string;
  price: number;
  currency: string;
  duration: number; // in days
  features: string[];
  featuresAr: string[];
  isActive: boolean;
  type: "free" | "basic" | "premium" | "enterprise";
  maxClinics: number;
  maxPatients: number;
  maxStaff: number;
  includeLab: boolean;
  includeInventory: boolean;
  includeFinance: boolean;
  includeAI: boolean;
  supportLevel: "basic" | "priority" | "dedicated";
}

export interface PromoCode {
  id: string;
  code: string;
  description: string;
  descriptionAr: string;
  discountType: "percentage" | "fixed";
  discountValue: number;
  validFrom: string;
  validUntil: string;
  maxUses: number;
  currentUses: number;
  applicablePlans: string[]; // plan IDs
  isActive: boolean;
  createdBy: string;
  createdAt: string;
}

export interface ActivationRequest {
  id: string;
  clinicId: string;
  clinicName: string;
  planId: string;
  planName: string;
  promoCode?: string;
  originalPrice: number;
  finalPrice: number;
  discount: number;
  requestedBy: string;
  requestedByEmail: string;
  requestedAt: string;
  status: "pending" | "approved" | "rejected" | "expired";
  approvedBy?: string;
  approvedAt?: string;
  notes?: string;
}

export interface Subscription {
  id: string;
  clinicId: string;
  clinicName: string;
  planId: string;
  planName: string;
  startDate: string;
  endDate: string;
  status: "active" | "expired" | "cancelled" | "suspended";
  autoRenew: boolean;
  paymentStatus: "paid" | "pending" | "overdue";
  price: number;
  promoCodeUsed?: string;
  activatedBy: string;
  activatedAt: string;
  lastRenewalDate?: string;
  nextRenewalDate?: string;
}

export interface SubscriptionReminder {
  id: string;
  subscriptionId: string;
  clinicId: string;
  clinicName: string;
  type: "expiring_soon" | "expired" | "payment_due" | "renewal";
  message: string;
  messageAr: string;
  scheduledDate: string;
  sentDate?: string;
  status: "scheduled" | "sent" | "failed" | "cancelled";
  recipientEmail: string;
  createdAt: string;
}

export interface SubscriptionStats {
  totalSubscriptions: number;
  activeSubscriptions: number;
  expiredSubscriptions: number;
  pendingActivations: number;
  totalRevenue: number;
  monthlyRevenue: number;
  averageSubscriptionDuration: number;
  popularPlan: string;
  expiringThisWeek: number;
  expiringThisMonth: number;
}

class SubscriptionManagementService {
  private static instance: SubscriptionManagementService;

  private plans: SubscriptionPlan[] = [
    {
      id: "plan-free",
      name: "Free Plan",
      nameAr: "الخطة المجانية",
      description: "Basic features for small clinics",
      descriptionAr: "ميزات أساسية للعيادات الصغيرة",
      price: 0,
      currency: "IQD",
      duration: 30,
      features: [
        "1 Clinic",
        "Up to 50 Patients",
        "Basic Appointment Management",
        "Basic Reports"
      ],
      featuresAr: [
        "عيادة واحدة",
        "حتى 50 مريض",
        "إدارة المواعيد الأساسية",
        "تقارير أساسية"
      ],
      isActive: true,
      type: "free",
      maxClinics: 1,
      maxPatients: 50,
      maxStaff: 2,
      includeLab: false,
      includeInventory: false,
      includeFinance: false,
      includeAI: false,
      supportLevel: "basic"
    },
    {
      id: "plan-basic",
      name: "Basic Plan",
      nameAr: "الخطة الأساسية",
      description: "Essential features for growing clinics",
      descriptionAr: "ميزات أساسية للعيادات المتنامية",
      price: 100000,
      currency: "IQD",
      duration: 30,
      features: [
        "1 Clinic",
        "Up to 200 Patients",
        "Full Appointment Management",
        "Inventory Management",
        "Financial Reports",
        "Email Support"
      ],
      featuresAr: [
        "عيادة واحدة",
        "حتى 200 مريض",
        "إدارة المواعيد الكاملة",
        "إدارة المخزون",
        "التقارير المالية",
        "دعم البريد الإلكتروني"
      ],
      isActive: true,
      type: "basic",
      maxClinics: 1,
      maxPatients: 200,
      maxStaff: 5,
      includeLab: false,
      includeInventory: true,
      includeFinance: true,
      includeAI: false,
      supportLevel: "basic"
    },
    {
      id: "plan-premium",
      name: "Premium Plan",
      nameAr: "الخطة المميزة",
      description: "Advanced features for professional clinics",
      descriptionAr: "ميزات متقدمة للعيادات المحترفة",
      price: 250000,
      currency: "IQD",
      duration: 30,
      features: [
        "Up to 3 Clinics",
        "Unlimited Patients",
        "Full Appointment Management",
        "Lab Integration",
        "Inventory Management",
        "Financial Reports & Analytics",
        "AI-Assisted Diagnosis",
        "Priority Support"
      ],
      featuresAr: [
        "حتى 3 عيادات",
        "مرضى غير محدودين",
        "إدارة المواعيد الكاملة",
        "التكامل مع المختبر",
        "إدارة المخزون",
        "التقارير المالية والتحليلات",
        "التشخيص بمساعدة الذكاء الاصطناعي",
        "دعم ذو أولوية"
      ],
      isActive: true,
      type: "premium",
      maxClinics: 3,
      maxPatients: -1, // unlimited
      maxStaff: 15,
      includeLab: true,
      includeInventory: true,
      includeFinance: true,
      includeAI: true,
      supportLevel: "priority"
    },
    {
      id: "plan-enterprise",
      name: "Enterprise Plan",
      nameAr: "خطة المؤسسات",
      description: "Complete solution for dental chains and large clinics",
      descriptionAr: "حل شامل لسلاسل الأسنان والعيادات الكبيرة",
      price: 500000,
      currency: "IQD",
      duration: 30,
      features: [
        "Unlimited Clinics",
        "Unlimited Patients & Staff",
        "Full Feature Access",
        "Custom Integration",
        "Advanced Analytics",
        "Multi-location Management",
        "Dedicated Account Manager",
        "24/7 Premium Support"
      ],
      featuresAr: [
        "عيادات غير محدودة",
        "مرضى وموظفين غير محدودين",
        "الوصول الكامل للميزات",
        "تكامل مخصص",
        "تحليلات متقدمة",
        "إدارة متعددة المواقع",
        "مدير حساب مخصص",
        "دعم متميز على مدار الساعة"
      ],
      isActive: true,
      type: "enterprise",
      maxClinics: -1, // unlimited
      maxPatients: -1, // unlimited
      maxStaff: -1, // unlimited
      includeLab: true,
      includeInventory: true,
      includeFinance: true,
      includeAI: true,
      supportLevel: "dedicated"
    }
  ];

  private promoCodes: PromoCode[] = [
    {
      id: "promo-1",
      code: "LAUNCH2024",
      description: "Launch discount - 20% off any plan",
      descriptionAr: "خصم الإطلاق - خصم 20٪ على أي خطة",
      discountType: "percentage",
      discountValue: 20,
      validFrom: "2024-01-01",
      validUntil: "2024-12-31",
      maxUses: 100,
      currentUses: 15,
      applicablePlans: ["plan-basic", "plan-premium", "plan-enterprise"],
      isActive: true,
      createdBy: "admin",
      createdAt: "2024-01-01T00:00:00Z"
    },
    {
      id: "promo-2",
      code: "NEWCLINIC",
      description: "New clinic special - 50,000 IQD off premium plans",
      descriptionAr: "عرض خاص للعيادات الجديدة - خصم 50,000 د.ع على الخطط المميزة",
      discountType: "fixed",
      discountValue: 50000,
      validFrom: "2024-01-01",
      validUntil: "2024-06-30",
      maxUses: 50,
      currentUses: 8,
      applicablePlans: ["plan-premium", "plan-enterprise"],
      isActive: true,
      createdBy: "admin",
      createdAt: "2024-01-01T00:00:00Z"
    }
  ];

  private activationRequests: ActivationRequest[] = [
    {
      id: "act-req-1",
      clinicId: "clinic-1",
      clinicName: "عيادة الأسنان المتطورة",
      planId: "plan-premium",
      planName: "الخطة المميزة",
      promoCode: "LAUNCH2024",
      originalPrice: 250000,
      finalPrice: 200000,
      discount: 50000,
      requestedBy: "د. أحمد محمد",
      requestedByEmail: "dr.ahmed@clinic.com",
      requestedAt: "2024-01-20T10:00:00Z",
      status: "pending"
    }
  ];

  private subscriptions: Subscription[] = [
    {
      id: "sub-1",
      clinicId: "clinic-2",
      clinicName: "مركز طب الأسنان الشامل",
      planId: "plan-basic",
      planName: "الخطة الأساسية",
      startDate: "2024-01-15",
      endDate: "2024-02-15",
      status: "active",
      autoRenew: true,
      paymentStatus: "paid",
      price: 100000,
      activatedBy: "د. سارة أحمد",
      activatedAt: "2024-01-15T09:00:00Z",
      nextRenewalDate: "2024-02-15"
    }
  ];

  private reminders: SubscriptionReminder[] = [];

  static getInstance(): SubscriptionManagementService {
    if (!SubscriptionManagementService.instance) {
      SubscriptionManagementService.instance = new SubscriptionManagementService();
    }
    return SubscriptionManagementService.instance;
  }

  // Subscription Plans Management
  async getPlans(): Promise<SubscriptionPlan[]> {
    return this.plans.filter(p => p.isActive);
  }

  async getPlan(id: string): Promise<SubscriptionPlan | null> {
    return this.plans.find(p => p.id === id) || null;
  }

  async addPlan(plan: Omit<SubscriptionPlan, "id">): Promise<SubscriptionPlan> {
    const newPlan: SubscriptionPlan = {
      ...plan,
      id: `plan-${Date.now()}`
    };
    this.plans.push(newPlan);
    return newPlan;
  }

  async updatePlan(id: string, updates: Partial<SubscriptionPlan>): Promise<SubscriptionPlan | null> {
    const index = this.plans.findIndex(p => p.id === id);
    if (index >= 0) {
      this.plans[index] = { ...this.plans[index], ...updates };
      return this.plans[index];
    }
    return null;
  }

  // Promo Codes Management
  async getPromoCodes(): Promise<PromoCode[]> {
    return this.promoCodes;
  }

  async getPromoCode(code: string): Promise<PromoCode | null> {
    return this.promoCodes.find(p => p.code === code && p.isActive) || null;
  }

  async validatePromoCode(code: string, planId: string): Promise<{ valid: boolean; message?: string; discount?: number }> {
    const promo = await this.getPromoCode(code);
    
    if (!promo) {
      return { valid: false, message: "كود الخصم غير صالح" };
    }

    const now = new Date();
    const validFrom = new Date(promo.validFrom);
    const validUntil = new Date(promo.validUntil);

    if (now < validFrom || now > validUntil) {
      return { valid: false, message: "انتهت صلاحية كود الخصم" };
    }

    if (promo.currentUses >= promo.maxUses) {
      return { valid: false, message: "تم استخدام كود الخصم بالكامل" };
    }

    if (!promo.applicablePlans.includes(planId)) {
      return { valid: false, message: "كود الخصم غير قابل للتطبيق على هذه الخطة" };
    }

    return { 
      valid: true, 
      discount: promo.discountType === "percentage" 
        ? promo.discountValue 
        : promo.discountValue 
    };
  }

  async addPromoCode(promo: Omit<PromoCode, "id" | "currentUses" | "createdAt">): Promise<PromoCode> {
    const newPromo: PromoCode = {
      ...promo,
      id: `promo-${Date.now()}`,
      currentUses: 0,
      createdAt: new Date().toISOString()
    };
    this.promoCodes.push(newPromo);
    return newPromo;
  }

  // Activation Requests Management
  async getActivationRequests(): Promise<ActivationRequest[]> {
    return this.activationRequests;
  }

  async createActivationRequest(request: Omit<ActivationRequest, "id" | "requestedAt" | "status">): Promise<ActivationRequest> {
    const newRequest: ActivationRequest = {
      ...request,
      id: `act-req-${Date.now()}`,
      requestedAt: new Date().toISOString(),
      status: "pending"
    };
    this.activationRequests.push(newRequest);
    return newRequest;
  }

  async approveActivationRequest(id: string, approvedBy: string): Promise<Subscription | null> {
    const request = this.activationRequests.find(r => r.id === id);
    if (!request || request.status !== "pending") {
      return null;
    }

    request.status = "approved";
    request.approvedBy = approvedBy;
    request.approvedAt = new Date().toISOString();

    const plan = await this.getPlan(request.planId);
    if (!plan) return null;

    const startDate = new Date();
    const endDate = new Date(startDate);
    endDate.setDate(endDate.getDate() + plan.duration);

    const subscription: Subscription = {
      id: `sub-${Date.now()}`,
      clinicId: request.clinicId,
      clinicName: request.clinicName,
      planId: request.planId,
      planName: request.planName,
      startDate: startDate.toISOString().split('T')[0],
      endDate: endDate.toISOString().split('T')[0],
      status: "active",
      autoRenew: false,
      paymentStatus: "paid",
      price: request.finalPrice,
      promoCodeUsed: request.promoCode,
      activatedBy: approvedBy,
      activatedAt: new Date().toISOString()
    };

    this.subscriptions.push(subscription);
    return subscription;
  }

  async rejectActivationRequest(id: string, notes: string): Promise<boolean> {
    const request = this.activationRequests.find(r => r.id === id);
    if (!request || request.status !== "pending") {
      return false;
    }

    request.status = "rejected";
    request.notes = notes;
    return true;
  }

  // Subscriptions Management
  async getSubscriptions(): Promise<Subscription[]> {
    return this.subscriptions;
  }

  async getSubscriptionByClinicId(clinicId: string): Promise<Subscription | null> {
    return this.subscriptions.find(s => s.clinicId === clinicId && s.status === "active") || null;
  }

  async updateSubscription(id: string, updates: Partial<Subscription>): Promise<Subscription | null> {
    const index = this.subscriptions.findIndex(s => s.id === id);
    if (index >= 0) {
      this.subscriptions[index] = { ...this.subscriptions[index], ...updates };
      return this.subscriptions[index];
    }
    return null;
  }

  // Reminders Management
  async getReminders(): Promise<SubscriptionReminder[]> {
    return this.reminders;
  }

  async scheduleReminder(reminder: Omit<SubscriptionReminder, "id" | "status" | "createdAt">): Promise<SubscriptionReminder> {
    const newReminder: SubscriptionReminder = {
      ...reminder,
      id: `reminder-${Date.now()}`,
      status: "scheduled",
      createdAt: new Date().toISOString()
    };
    this.reminders.push(newReminder);
    return newReminder;
  }

  // Statistics
  async getSubscriptionStats(): Promise<SubscriptionStats> {
    const now = new Date();
    const weekFromNow = new Date(now);
    weekFromNow.setDate(weekFromNow.getDate() + 7);
    const monthFromNow = new Date(now);
    monthFromNow.setMonth(monthFromNow.getMonth() + 1);

    const activeSubscriptions = this.subscriptions.filter(s => s.status === "active");
    const expiredSubscriptions = this.subscriptions.filter(s => s.status === "expired");

    const expiringThisWeek = activeSubscriptions.filter(s => {
      const endDate = new Date(s.endDate);
      return endDate <= weekFromNow;
    }).length;

    const expiringThisMonth = activeSubscriptions.filter(s => {
      const endDate = new Date(s.endDate);
      return endDate <= monthFromNow;
    }).length;

    const totalRevenue = this.subscriptions.reduce((sum, s) => sum + s.price, 0);
    
    const thisMonth = now.toISOString().substring(0, 7);
    const monthlyRevenue = this.subscriptions
      .filter(s => s.activatedAt.startsWith(thisMonth))
      .reduce((sum, s) => sum + s.price, 0);

    return {
      totalSubscriptions: this.subscriptions.length,
      activeSubscriptions: activeSubscriptions.length,
      expiredSubscriptions: expiredSubscriptions.length,
      pendingActivations: this.activationRequests.filter(r => r.status === "pending").length,
      totalRevenue,
      monthlyRevenue,
      averageSubscriptionDuration: 30,
      popularPlan: "plan-premium",
      expiringThisWeek,
      expiringThisMonth
    };
  }
}

export const subscriptionService = SubscriptionManagementService.getInstance();
export default SubscriptionManagementService;
