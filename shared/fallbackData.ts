// Fallback data for subscription plans and payment methods
// Used when database is unavailable

export interface SubscriptionPlan {
  id: number;
  name: string;
  arabicName: string;
  description: string;
  arabicDescription: string;
  price: number;
  durationMonths: number;
  features: string[];
  arabicFeatures: string[];
  canBePromoted: boolean;
  maxPriorityLevel: number;
  showInTop: boolean;
  maxMonthlyAppearances: number;
  isActive: boolean;
  displayOrder: number;
}

export interface PaymentMethod {
  id: number;
  name: string;
  arabicName: string;
  type: string;
  icon: string;
  description: string;
  arabicDescription: string;
  fees: number;
  isActive: boolean;
}

export const FALLBACK_SUBSCRIPTION_PLANS: SubscriptionPlan[] = [
  {
    id: 1,
    name: "Free Plan",
    arabicName: "الباقة المجانية",
    description: "Limited usage for trial",
    arabicDescription: "استخدام محدود للتجربة",
    price: 0,
    durationMonths: 1,
    features: [
      "30 patients maximum",
      "1 clinic only",
      "AI usage: 5 daily attempts",
      "Basic features"
    ],
    arabicFeatures: [
      "عدد المرضى: 30 مريض فقط",
      "عيادة واحدة فقط",
      "استخدام الذكاء الاصطناعي: 5 محاولات يومياً",
      "وظائف أساسية"
    ],
    canBePromoted: false,
    maxPriorityLevel: 0,
    showInTop: false,
    maxMonthlyAppearances: 0,
    isActive: true,
    displayOrder: 0
  },
  {
    id: 2,
    name: "Basic Clinic Plan",
    arabicName: "الباقة الأساسية للعيادات",
    description: "Perfect for individual clinics",
    arabicDescription: "مثالية للعيادات الفردية",
    price: 60000,
    durationMonths: 1,
    features: [
      "Unlimited patients",
      "1 clinic only",
      "Unlimited AI usage",
      "Exclusive store discounts",
      "Search visibility and nearby clinics"
    ],
    arabicFeatures: [
      "عدد مرضى غير محدود",
      "عيادة واحدة فقط",
      "استخدام الذكاء الاصطناعي غير محدود",
      "تخفيضات حصرية من المتاجر",
      "ظهور في نتائج البحث والعيادات القريبة"
    ],
    canBePromoted: false,
    maxPriorityLevel: 3,
    showInTop: false,
    maxMonthlyAppearances: 0,
    isActive: true,
    displayOrder: 1
  },
  {
    id: 3,
    name: "Premium Medical Centers Plan",
    arabicName: "الباقة المميزة للمراكز والعيادات التخصصية",
    description: "Best for large medical centers",
    arabicDescription: "الأفضل للمراكز الطبية الكبرى",
    price: 100000,
    durationMonths: 1,
    features: [
      "Unlimited patients",
      "Unlimited clinics",
      "Unlimited AI usage",
      "Huge store discounts",
      "Top search results visibility",
      "Dedicated technical support",
      "Comprehensive analytics and reports"
    ],
    arabicFeatures: [
      "عدد مرضى غير محدود",
      "عدد عيادات غير محدود",
      "استخدام الذكاء الاصطناعي غير محدود",
      "تخفيضات هائلة من المتاجر",
      "ظهور في النتائج الأولى للبحث والعيادات القريبة",
      "دعم فني مخصص",
      "تحليلات وتقارير شاملة"
    ],
    canBePromoted: true,
    maxPriorityLevel: 10,
    showInTop: true,
    maxMonthlyAppearances: 100,
    isActive: true,
    displayOrder: 2
  }
];

export const FALLBACK_PAYMENT_METHODS: PaymentMethod[] = [
  {
    id: 1,
    name: "Credit Card (Stripe)",
    arabicName: "بطاقة ائتمانية (Stripe)",
    type: "stripe",
    icon: "CreditCard",
    description: "Visa, Mastercard, American Express",
    arabicDescription: "Visa, Mastercard, American Express",
    fees: 2.9,
    isActive: true
  },
  {
    id: 2,
    name: "Zain Cash",
    arabicName: "زين كاش",
    type: "zain_cash",
    icon: "Smartphone",
    description: "Payment via Zain Cash",
    arabicDescription: "الدفع عبر زين كاش",
    fees: 0,
    isActive: true
  },
  {
    id: 3,
    name: "Cash Agents",
    arabicName: "وكلائنا بالمحافظات",
    type: "cash_agents",
    icon: "MapPin",
    description: "Payment through our approved agents",
    arabicDescription: "الدفع عبر وكلائنا المعتمدين",
    fees: 0,
    isActive: true
  },
  {
    id: 4,
    name: "Bank Transfer",
    arabicName: "تحويل بنكي",
    type: "bank_transfer",
    icon: "Banknote",
    description: "Direct bank transfer",
    arabicDescription: "تحويل مباشر إلى الحساب البنكي",
    fees: 0,
    isActive: true
  },
  {
    id: 5,
    name: "Al-Rafidain",
    arabicName: "الرافدين",
    type: "rafidain",
    icon: "Building2",
    description: "Payment via Al-Rafidain app",
    arabicDescription: "الدفع عبر تطبيق الرافدين",
    fees: 0,
    isActive: true
  }
];
