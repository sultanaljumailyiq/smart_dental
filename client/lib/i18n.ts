import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";

export type Language = "ar" | "en";
export type Theme = "light" | "dark";

interface I18nContextType {
  language: Language;
  theme: Theme;
  isRTL: boolean;
  setLanguage: (lang: Language) => void;
  setTheme: (theme: Theme) => void;
  t: (key: string) => string;
}

const I18nContext = createContext<I18nContextType | undefined>(undefined);

export const useI18n = () => {
  const context = useContext(I18nContext);
  if (!context) {
    throw new Error("useI18n must be used within an I18nProvider");
  }
  return context;
};

// Arabic translations
const translations = {
  ar: {
    // App branding
    "app.name": "Smart",
    "app.slogan": "منصة طب الأسنان الذكية",

    // Navigation
    "nav.dashboard": "لوحة التحكم",
    "nav.reservations": "الحجوزات",
    "nav.patients": "المرضى",
    "nav.treatments": "العلاجات",
    "nav.staff": "الطاقم",
    "nav.accounts": "الحسابات",
    "nav.sales": "المبيعات",
    "nav.purchases": "المشتريات",
    "nav.payment_methods": "طرق الدفع",
    "nav.stocks": "المخزون",
    "nav.peripherals": "الأجهزة",
    "nav.reports": "التقارير",
    "nav.support": "الدعم الفني",
    "nav.platform_admin": "إدارة المنصة",
    "nav.marketplace_admin": "إدارة السوق",

    // Sections
    "section.clinic": "العي����دة",
    "section.finance": "المالية",
    "section.physical_asset": "الأصول المادية",
    "section.other": "��خرى",

    // User roles
    "role.super_admin": "المدير العام",
    "role.admin": "مدير",
    "role.dentist": "طبيب أسنان",
    "role.staff": "موظف",
    "role.patient": "مريض",

    // Clinic info
    "clinic.name": "عيادة بغداد للأسنان",
    "clinic.address": "شارع الكرادة، بغداد، العراق",

    // Common actions
    "action.save": "حفظ",
    "action.cancel": "إلغاء",
    "action.edit": "تعديل",
    "action.delete": "حذف",
    "action.add": "إضافة",
    "action.search": "بحث",
    "action.filter": "تصفية",
    "action.export": "تصدير",
    "action.import": "استيراد",
    "action.view": "عرض",
    "action.print": "طباعة",
    "action.send": "إرسال",
    "action.submit": "إرسال",
    "action.confirm": "تأكيد",

    // Settings
    "settings.title": "الإعدادات",
    "settings.general": "عام",
    "settings.language": "اللغة",
    "settings.theme": "المظهر",
    "settings.clinic": "العيادة",
    "settings.permissions": "الصلاحيات",
    "settings.database": "قاعدة البيانات",
    "settings.branding": "الهوية التجارية",
    "settings.notifications": "الإشعارات",
    "settings.security": "الأمان",
    "settings.backup": "النسخ الاحتياطي",

    // Dashboard
    "dashboard.welcome": "مرحباً بك",
    "dashboard.overview": "نظرة عامة",
    "dashboard.today_appointments": "مواعيد اليوم",
    "dashboard.pending_payments": "المدفوعات المعلقة",
    "dashboard.new_patients": "مرضى جدد",
    "dashboard.revenue": "الإيرادات",

    // Authentication
    "auth.sign_in": "تسجيل الدخول",
    "auth.sign_up": "إنشاء حساب",
    "auth.email": "البريد الإلكتروني",
    "auth.password": "كلمة المرور",
    "auth.confirm_password": "تأكيد كلمة المرور",
    "auth.first_name": "الاسم الأول",
    "auth.last_name": "اسم العائلة",
    "auth.phone": "رقم الهاتف",
    "auth.forgot_password": "نسيت كلمة المرور؟",
    "auth.remember_me": "تذكرني",

    // Status
    "status.active": "نشط",
    "status.inactive": "غير نشط",
    "status.pending": "معلق",
    "status.completed": "مكتمل",
    "status.cancelled": "ملغى",
    "status.approved": "معتمد",
    "status.rejected": "مرفوض",

    // Time
    "time.today": "اليوم",
    "time.yesterday": "أمس",
    "time.tomorrow": "غداً",
    "time.this_week": "هذا الأسبوع",
    "time.this_month": "هذا الشهر",
    "time.this_year": "هذا العام",

    // Messages
    "message.success": "تم بنجاح",
    "message.error": "حدث خطأ",
    "message.warning": "تحذير",
    "message.info": "معلومات",
    "message.confirm_delete": "هل أنت متأكد من الحذف؟",
    "message.no_data": "لا توجد بيانات",
    "message.loading": "جارٍ التحميل...",

    // Numbers and currency
    "currency.symbol": "د.ع",
    "currency.name": "دينار عراقي",

    // Marketplace
    "marketplace.title": "السوق الطبي",
    "marketplace.subtitle": "اكتشف أفضل العروض الطبية",
    "marketplace.patient_market": "سوق المرضى",
    "marketplace.dental_supply": "المستلزمات الطبية",
    "marketplace.find_services": "البحث عن خدمات",
    "marketplace.book_appointment": "حجز موعد",
    "marketplace.view_products": "عرض المنتجات",
    "marketplace.add_to_cart": "إضافة للسلة",
    "marketplace.buy_now": "اشتر الآن",
    "marketplace.price": "السعر",
    "marketplace.discount": "خصم",
    "marketplace.free_shipping": "شحن مجاني",
    "marketplace.in_stock": "متوفر",
    "marketplace.out_of_stock": "غير متوفر",
    "marketplace.rating": "التقييم",
    "marketplace.reviews": "المراجعات",
    "marketplace.location": "الموقع",
    "marketplace.distance": "المسافة",
    "marketplace.categories": "الفئات",
    "marketplace.filters": "المرشحات",
    "marketplace.sort_by": "ترتيب حسب",
    "marketplace.search_results": "نتائج البحث",
    "marketplace.no_results": "لا توجد نتائج",

    // Community
    "community.title": "مجتمع الأطباء",
    "community.subtitle": "شارك خبراتك مع زملائك",
    "community.posts": "المنشورات",
    "community.articles": "المقالات",
    "community.discussions": "النقاش����ت",
    "community.experts": "الخبراء",
    "community.learning": "التعلم",
    "community.trending": "الشائع",
    "community.create_post": "إنشاء منشور",
    "community.share": "مشاركة",
    "community.like": "إعجاب",
    "community.comment": "تعليق",
    "community.follow": "متابعة",
    "community.followers": "المتابعين",
    "community.following": "المتابَعين",
    "community.join_discussion": "انضم للنقاش",
    "community.read_more": "اقرأ المزيد",
    "community.featured": "مميز",
    "community.popular": "شائع",
    "community.recent": "حديث",

    // Jobs Platform
    "jobs.title": "منصة الوظائف",
    "jobs.subtitle": "فرص عمل لأطباء الأسنان",
    "jobs.browse_jobs": "تصفح الوظائف",
    "jobs.post_job": "نشر وظيفة",
    "jobs.my_applications": "طلباتي",
    "jobs.freelance": "العمل الحر",
    "jobs.find_professionals": "العثور على محترفين",
    "jobs.apply_now": "قدم الآن",
    "jobs.job_type": "نوع الوظيفة",
    "jobs.experience": "الخبرة",
    "jobs.salary": "الراتب",
    "jobs.full_time": "دوام كامل",
    "jobs.part_time": "دوام جزئي",
    "jobs.contract": "عقد",
    "jobs.remote": "عن بُعد",
    "jobs.location": "الموقع",
    "jobs.requirements": "المتطلبات",
    "jobs.benefits": "المزايا",
    "jobs.company": "الشركة",
    "jobs.posted": "تاريخ النشر",
    "jobs.deadline": "آخر موعد",
    "jobs.applicants": "المتقدمين",

    // Admin Dashboard
    "admin.marketplace_stats": "إحصائيات السوق",
    "admin.user_management": "إدارة المستخدمين",
    "admin.content_moderation": "إدارة المحتوى",
    "admin.revenue": "الإيرادات",
    "admin.growth": "النمو",
    "admin.active_users": "المستخدمين النشطين",
    "admin.pending_approvals": "الموافقات المعلقة",
    "admin.recent_activity": "النشاط الأخير",
    "admin.top_performers": "الأفضل أداءً",
    "admin.analytics": "التحليلات",
    "admin.reports": "التقارير",
    "admin.settings": "الإعدادات",
    "admin.export_data": "تصدير البيانات",
    "admin.backup": "النسخ الاحتياطي",

    // Notifications
    "notification.new_message": "رسالة جديدة",
    "notification.new_order": "طلب جديد",
    "notification.appointment_reminder": "تذكير بالموعد",
    "notification.payment_received": "تم استلام الدفع",
    "notification.new_review": "مراجعة جديدة",
    "notification.system_update": "تحديث النظام",

    // Promotional
    "promo.limited_time": "عرض محدود",
    "promo.special_offer": "عرض خاص",
    "promo.discount_available": "خصم متاح",
    "promo.free_delivery": "توصيل مجاني",
    "promo.bulk_discount": "خصم الكمية",
    "promo.new_customer": "عميل جديد",
    "promo.seasonal_offer": "عرض موسمي",
    "promo.flash_sale": "تخفيضات سريعة",
  },
  en: {
    // App branding
    "app.name": "Smart",
    "app.slogan": "Smart Dental Platform",

    // Navigation
    "nav.dashboard": "Dashboard",
    "nav.reservations": "Reservations",
    "nav.patients": "Patients",
    "nav.treatments": "Treatments",
    "nav.staff": "Staff",
    "nav.accounts": "Accounts",
    "nav.sales": "Sales",
    "nav.purchases": "Purchases",
    "nav.payment_methods": "Payment Methods",
    "nav.stocks": "Stocks",
    "nav.peripherals": "Peripherals",
    "nav.reports": "Reports",
    "nav.support": "Support",
    "nav.platform_admin": "Platform Admin",
    "nav.marketplace_admin": "Marketplace Admin",

    // Sections
    "section.clinic": "Clinic",
    "section.finance": "Finance",
    "section.physical_asset": "Physical Asset",
    "section.other": "Other",

    // User roles
    "role.super_admin": "Super Admin",
    "role.admin": "Admin",
    "role.dentist": "Dentist",
    "role.staff": "Staff",
    "role.patient": "Patient",

    // Clinic info
    "clinic.name": "Baghdad Dental Clinic",
    "clinic.address": "Karrada Street, Baghdad, Iraq",

    // Common actions
    "action.save": "Save",
    "action.cancel": "Cancel",
    "action.edit": "Edit",
    "action.delete": "Delete",
    "action.add": "Add",
    "action.search": "Search",
    "action.filter": "Filter",
    "action.export": "Export",
    "action.import": "Import",
    "action.view": "View",
    "action.print": "Print",
    "action.send": "Send",
    "action.submit": "Submit",
    "action.confirm": "Confirm",

    // Settings
    "settings.title": "Settings",
    "settings.general": "General",
    "settings.language": "Language",
    "settings.theme": "Theme",
    "settings.clinic": "Clinic",
    "settings.permissions": "Permissions",
    "settings.database": "Database",
    "settings.branding": "Branding",
    "settings.notifications": "Notifications",
    "settings.security": "Security",
    "settings.backup": "Backup",

    // Dashboard
    "dashboard.welcome": "Welcome",
    "dashboard.overview": "Overview",
    "dashboard.today_appointments": "Today's Appointments",
    "dashboard.pending_payments": "Pending Payments",
    "dashboard.new_patients": "New Patients",
    "dashboard.revenue": "Revenue",

    // Authentication
    "auth.sign_in": "Sign In",
    "auth.sign_up": "Sign Up",
    "auth.email": "Email",
    "auth.password": "Password",
    "auth.confirm_password": "Confirm Password",
    "auth.first_name": "First Name",
    "auth.last_name": "Last Name",
    "auth.phone": "Phone",
    "auth.forgot_password": "Forgot Password?",
    "auth.remember_me": "Remember Me",

    // Status
    "status.active": "Active",
    "status.inactive": "Inactive",
    "status.pending": "Pending",
    "status.completed": "Completed",
    "status.cancelled": "Cancelled",
    "status.approved": "Approved",
    "status.rejected": "Rejected",

    // Time
    "time.today": "Today",
    "time.yesterday": "Yesterday",
    "time.tomorrow": "Tomorrow",
    "time.this_week": "This Week",
    "time.this_month": "This Month",
    "time.this_year": "This Year",

    // Messages
    "message.success": "Success",
    "message.error": "Error",
    "message.warning": "Warning",
    "message.info": "Information",
    "message.confirm_delete": "Are you sure you want to delete?",
    "message.no_data": "No Data Available",
    "message.loading": "Loading...",

    // Numbers and currency
    "currency.symbol": "IQD",
    "currency.name": "Iraqi Dinar",
  },
};

interface I18nProviderProps {
  children: ReactNode;
}

export const I18nProvider: React.FC<I18nProviderProps> = ({ children }) => {
  const [language, setLanguageState] = useState<Language>("ar");
  const [theme, setThemeState] = useState<Theme>("light");

  useEffect(() => {
    // Load saved language and theme from localStorage
    const savedLanguage = localStorage.getItem("language") as Language;
    const savedTheme = localStorage.getItem("theme") as Theme;

    if (savedLanguage && ["ar", "en"].includes(savedLanguage)) {
      setLanguageState(savedLanguage);
    }

    if (savedTheme && ["light", "dark"].includes(savedTheme)) {
      setThemeState(savedTheme);
    }

    // Set document direction (always LTR)
    document.dir = "ltr";
    document.documentElement.lang = language;

    // Apply theme class to body
    document.body.className = theme === "dark" ? "dark" : "";
  }, [language, theme]);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem("language", lang);
    document.dir = "ltr";
    document.documentElement.lang = lang;
  };

  const setTheme = (newTheme: Theme) => {
    setThemeState(newTheme);
    localStorage.setItem("theme", newTheme);
    document.body.className = newTheme === "dark" ? "dark" : "";
  };

  const t = (key: string): string => {
    return translations[language][key] || key;
  };

  return React.createElement(
    I18nContext.Provider,
    {
      value: {
        language,
        theme,
        isRTL: language === "ar",
        setLanguage,
        setTheme,
        t,
      },
    },
    children,
  );
};
