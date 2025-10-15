import React, { useState } from "react";
import {
  Settings,
  Globe,
  Palette,
  Building,
  Shield,
  Database,
  Bell,
  Lock,
  HardDrive,
  Users,
  Save,
  Upload,
  Eye,
  EyeOff,
  Camera,
  X,
  Check,
  AlertCircle,
  Info,
  Star,
  Zap,
  Moon,
  Sun,
  Languages,
  Key,
  RefreshCw,
  Download,
  Trash2,
  Plus,
  Edit,
  ChevronRight,
  UserCheck,
  Calendar,
  CreditCard,
  Package,
  BarChart3,
  MessageCircle,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useI18n } from "@/lib/i18n";

interface Permission {
  id: string;
  name: string;
  description: string;
  enabled: boolean;
  category: string;
}

interface UserRole {
  id: string;
  name: string;
  nameAr: string;
  permissions: string[];
  userCount: number;
  color: string;
}

export default function SuperAdminSettings() {
  const { language, theme, isRTL, setLanguage, setTheme, t } = useI18n();
  const [activeTab, setActiveTab] = useState("general");
  const [appSettings, setAppSettings] = useState({
    appName: "Smart",
    appNameEn: "Smart",
    appSlogan: "مستقبل طب الأس��ان",
    appSloganEn: "The Future of Dental Care",
    clinicName: "عيادة بغداد للأسنان",
    clinicNameEn: "Baghdad Dental Clinic",
    clinicAddress: "شارع الكرادة، بغداد، العراق",
    clinicAddressEn: "Karrada Street, Baghdad, Iraq",
    clinicPhone: "+964 770 123 4567",
    clinicEmail: "info@baghdaddental.iq",
    country: "العراق",
    countryEn: "Iraq",
    currency: "IQD",
    currencySymbol: "د.ع",
    timezone: "Asia/Baghdad",
    defaultLanguage: "ar",
    enableRTL: true,
    logo: null,
    favicon: null,
  });

  const [databaseSettings, setDatabaseSettings] = useState({
    host: "localhost",
    port: "5432",
    database: "smart_dental",
    username: "admin",
    password: "",
    backupFrequency: "daily",
    retentionDays: 30,
    encryption: true,
  });

  const [permissions, setPermissions] = useState<Permission[]>([
    // Platform Management
    {
      id: "platform_manage",
      name: "إدارة المنصة الكاملة",
      description: "السيطرة الكاملة على جميع جوانب المنصة",
      enabled: true,
      category: "platform",
    },
    {
      id: "user_manage",
      name: "إدارة المستخدمين",
      description: "إضافة وتعديل وحذف المستخدمين",
      enabled: true,
      category: "platform",
    },
    {
      id: "settings_manage",
      name: "إدارة الإعدادات",
      description: "تعديل إعدادات النظام والتطبيق",
      enabled: true,
      category: "platform",
    },

    // Clinic Management
    {
      id: "clinic_full_access",
      name: "وصول كامل للعيادة",
      description: "إدارة جميع عمليات العيادة",
      enabled: true,
      category: "clinic",
    },
    {
      id: "patient_manage",
      name: "إدارة المرضى",
      description: "عرض وتعديل بيانات المرضى",
      enabled: true,
      category: "clinic",
    },
    {
      id: "appointment_manage",
      name: "إدارة المواعيد",
      description: "جدولة وإلغاء المواعيد",
      enabled: true,
      category: "clinic",
    },
    {
      id: "treatment_manage",
      name: "إدارة العلاجات",
      description: "إضافة وتعديل خطط العلاج",
      enabled: true,
      category: "clinic",
    },

    // Financial Management
    {
      id: "finance_full_access",
      name: "وصول كامل للمالية",
      description: "إدارة جميع العمليات المالية",
      enabled: true,
      category: "finance",
    },
    {
      id: "payment_manage",
      name: "إدارة المدفوعات",
      description: "معالجة ومراقبة المدفوعات",
      enabled: true,
      category: "finance",
    },
    {
      id: "invoice_manage",
      name: "إدارة الفواتير",
      description: "إنشاء وإدارة الفواتير",
      enabled: true,
      category: "finance",
    },
    {
      id: "report_access",
      name: "الوصول للتقارير",
      description: "عرض وتصدير التقارير المالية",
      enabled: true,
      category: "finance",
    },

    // Marketplace Management
    {
      id: "marketplace_admin",
      name: "إدارة السوق",
      description: "إدارة السوق الإلكتروني والموردين",
      enabled: true,
      category: "marketplace",
    },
    {
      id: "supplier_manage",
      name: "إدارة الموردين",
      description: "إضافة وإدارة الموردين",
      enabled: true,
      category: "marketplace",
    },
    {
      id: "product_manage",
      name: "إدارة المنتجات",
      description: "إضافة وتعديل المنتجات",
      enabled: true,
      category: "marketplace",
    },

    // Community Management
    {
      id: "community_admin",
      name: "إدارة المجتمع",
      description: "إدارة مجتمع الأطباء والمحتوى",
      enabled: true,
      category: "community",
    },
    {
      id: "content_moderate",
      name: "إدارة المحتوى",
      description: "مراجعة وإدارة المحتوى المنشور",
      enabled: true,
      category: "community",
    },
  ]);

  const [userRoles, setUserRoles] = useState<any[]>([
    {
      id: "super_admin",
      name: "مدير عام",
      nameAr: "مدير عام",
      permissions: permissions.map((p) => p.id),
      userCount: 1,
      color: "bg-red-500",
    },
    {
      id: "admin",
      name: "مدير",
      nameAr: "مدير",
      permissions: permissions
        .filter((p) => !p.id.includes("platform") && !p.id.includes("settings"))
        .map((p) => p.id),
      userCount: 3,
      color: "bg-blue-500",
    },
    {
      id: "dentist",
      name: "طبيب أسنان",
      nameAr: "طبيب أسنان",
      permissions: permissions
        .filter((p) => p.category === "clinic" || p.category === "community")
        .map((p) => p.id),
      userCount: 12,
      color: "bg-green-500",
    },
    {
      id: "staff",
      name: "موظف",
      nameAr: "موظف",
      permissions: permissions
        .filter((p) => p.id.includes("patient") || p.id.includes("appointment"))
        .map((p) => p.id),
      userCount: 8,
      color: "bg-yellow-500",
    },
  ]);

  const handleLogoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setAppSettings({ ...appSettings, logo: e.target?.result as string });
      };
      reader.readAsDataURL(file);
    }
  };

  const permissionCategories = [
    { id: "platform", name: "المنصة", nameEn: "Platform", icon: Settings },
    { id: "clinic", name: "العيادة", nameEn: "Clinic", icon: Building },
    { id: "finance", name: "المالية", nameEn: "Finance", icon: CreditCard },
    { id: "marketplace", name: "السوق", nameEn: "Marketplace", icon: Package },
    { id: "community", name: "المجتمع", nameEn: "Community", icon: Users },
  ];

  const tabs = [
    { id: "general", label: "عام", labelEn: "General", icon: Settings },
    { id: "branding", label: "الهوية", labelEn: "Branding", icon: Palette },
    {
      id: "permissions",
      label: "الصلاحيات",
      labelEn: "Permissions",
      icon: Shield,
    },
    {
      id: "database",
      label: "قاعدة البيانات",
      labelEn: "Database",
      icon: Database,
    },
    { id: "security", label: "الأمان", labelEn: "Security", icon: Lock },
    {
      id: "backup",
      label: "النسخ الاحتياطي",
      labelEn: "Backup",
      icon: HardDrive,
    },
  ];

  return (
    <div className={cn("space-y-6", isRTL ? "font-arabic" : "")}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            إعدادات المدير العام
          </h1>
          <p className="text-gray-600">
            إدارة شاملة لجميع جوانب النظام والتطبيق
          </p>
        </div>
        <div className="flex items-center gap-3">
          {/* Language Toggle */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => setLanguage("ar")}
              className={cn(
                "px-3 py-2 rounded-lg text-sm font-medium transition-colors",
                language === "ar"
                  ? "bg-blue-600 text-white"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200",
              )}
            >
              العربية
            </button>
            <button
              onClick={() => setLanguage("en")}
              className={cn(
                "px-3 py-2 rounded-lg text-sm font-medium transition-colors",
                language === "en"
                  ? "bg-blue-600 text-white"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200",
              )}
            >
              English
            </button>
          </div>

          {/* Theme Toggle */}
          <button
            onClick={() => setTheme(theme === "light" ? "dark" : "light")}
            className="p-2 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
          >
            {theme === "light" ? (
              <Moon className="w-5 h-5 text-gray-600" />
            ) : (
              <Sun className="w-5 h-5 text-gray-600" />
            )}
          </button>

          <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center gap-2">
            <Save className="w-4 h-4" />
            حفظ الإعدادات
          </button>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <nav className="flex overflow-x-auto">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={cn(
                "flex items-center gap-2 px-6 py-4 text-sm font-medium border-b-2 transition-colors whitespace-nowrap",
                activeTab === tab.id
                  ? "border-blue-500 text-blue-600 bg-blue-50"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:bg-gray-50",
              )}
            >
              <tab.icon className="w-4 h-4" />
              {language === "ar" ? tab.label : tab.labelEn}
            </button>
          ))}
        </nav>
      </div>

      {/* General Settings */}
      {activeTab === "general" && (
        <div className="grid lg:grid-cols-2 gap-6">
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-6">
              {language === "ar" ? "إعد��دات التطبيق" : "Application Settings"}
            </h3>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {language === "ar"
                      ? "اسم التطبيق (عربي)"
                      : "App Name (Arabic)"}
                  </label>
                  <input
                    type="text"
                    value={appSettings.appName}
                    onChange={(e) =>
                      setAppSettings({
                        ...appSettings,
                        appName: e.target.value,
                      })
                    }
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {language === "ar"
                      ? "اسم التطبيق (إنجليزي)"
                      : "App Name (English)"}
                  </label>
                  <input
                    type="text"
                    value={appSettings.appNameEn}
                    onChange={(e) =>
                      setAppSettings({
                        ...appSettings,
                        appNameEn: e.target.value,
                      })
                    }
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {language === "ar"
                      ? "شعار التطبيق (عربي)"
                      : "App Slogan (Arabic)"}
                  </label>
                  <input
                    type="text"
                    value={appSettings.appSlogan}
                    onChange={(e) =>
                      setAppSettings({
                        ...appSettings,
                        appSlogan: e.target.value,
                      })
                    }
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {language === "ar"
                      ? "شعار التطبيق (إنجليزي)"
                      : "App Slogan (English)"}
                  </label>
                  <input
                    type="text"
                    value={appSettings.appSloganEn}
                    onChange={(e) =>
                      setAppSettings({
                        ...appSettings,
                        appSloganEn: e.target.value,
                      })
                    }
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {language === "ar" ? "البلد" : "Country"}
                  </label>
                  <select
                    value={appSettings.country}
                    onChange={(e) =>
                      setAppSettings({
                        ...appSettings,
                        country: e.target.value,
                      })
                    }
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="العراق">العراق</option>
                    <option value="الأردن">الأردن</option>
                    <option value="لبنان">لبنان</option>
                    <option value="سوريا">سوريا</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {language === "ar" ? "المنطقة الزمنية" : "Timezone"}
                  </label>
                  <select
                    value={appSettings.timezone}
                    onChange={(e) =>
                      setAppSettings({
                        ...appSettings,
                        timezone: e.target.value,
                      })
                    }
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="Asia/Baghdad">بغداد (UTC+3)</option>
                    <option value="Asia/Damascus">دمشق (UTC+3)</option>
                    <option value="Asia/Amman">عمان (UTC+3)</option>
                    <option value="Asia/Beirut">بيروت (UTC+3)</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {language === "ar" ? "رمز العملة" : "Currency Symbol"}
                  </label>
                  <input
                    type="text"
                    value={appSettings.currencySymbol}
                    onChange={(e) =>
                      setAppSettings({
                        ...appSettings,
                        currencySymbol: e.target.value,
                      })
                    }
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {language === "ar"
                      ? "اللغة الافتراضية"
                      : "Default Language"}
                  </label>
                  <select
                    value={appSettings.defaultLanguage}
                    onChange={(e) =>
                      setAppSettings({
                        ...appSettings,
                        defaultLanguage: e.target.value,
                      })
                    }
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="ar">العربية</option>
                    <option value="en">English</option>
                  </select>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-6">
              {language === "ar" ? "معلومات العيادة" : "Clinic Information"}
            </h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {language === "ar" ? "اسم العيادة" : "Clinic Name"}
                </label>
                <input
                  type="text"
                  value={appSettings.clinicName}
                  onChange={(e) =>
                    setAppSettings({
                      ...appSettings,
                      clinicName: e.target.value,
                    })
                  }
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {language === "ar" ? "العنوان" : "Address"}
                </label>
                <textarea
                  value={appSettings.clinicAddress}
                  onChange={(e) =>
                    setAppSettings({
                      ...appSettings,
                      clinicAddress: e.target.value,
                    })
                  }
                  rows={3}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {language === "ar" ? "رقم الهاتف" : "Phone Number"}
                  </label>
                  <input
                    type="tel"
                    value={appSettings.clinicPhone}
                    onChange={(e) =>
                      setAppSettings({
                        ...appSettings,
                        clinicPhone: e.target.value,
                      })
                    }
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {language === "ar" ? "البريد الإلكتروني" : "Email"}
                  </label>
                  <input
                    type="email"
                    value={appSettings.clinicEmail}
                    onChange={(e) =>
                      setAppSettings({
                        ...appSettings,
                        clinicEmail: e.target.value,
                      })
                    }
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Branding Settings */}
      {activeTab === "branding" && (
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-6">
            {language === "ar" ? "إدارة الهوية التجارية" : "Brand Management"}
          </h3>
          <div className="grid lg:grid-cols-2 gap-8">
            <div>
              <h4 className="font-medium text-gray-900 mb-4">
                {language === "ar" ? "شعار التطبيق" : "Application Logo"}
              </h4>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                {appSettings.logo ? (
                  <div className="relative">
                    <img
                      src={appSettings.logo}
                      alt="Logo"
                      className="max-h-32 mx-auto mb-4"
                    />
                    <button
                      onClick={() =>
                        setAppSettings({ ...appSettings, logo: null })
                      }
                      className="absolute top-2 right-2 w-8 h-8 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ) : (
                  <div>
                    <Camera className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                    <p className="text-gray-600 mb-4">
                      {language === "ar"
                        ? "ارفع شعار التطبيق"
                        : "Upload application logo"}
                    </p>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleLogoUpload}
                      className="hidden"
                      id="logo-upload"
                    />
                    <label
                      htmlFor="logo-upload"
                      className="bg-blue-600 text-white px-4 py-2 rounded-lg cursor-pointer hover:bg-blue-700"
                    >
                      {language === "ar" ? "اختر ملف" : "Choose File"}
                    </label>
                  </div>
                )}
              </div>
            </div>

            <div>
              <h4 className="font-medium text-gray-900 mb-4">
                {language === "ar" ? "معاينة الهوية" : "Brand Preview"}
              </h4>
              <div className="bg-gray-50 rounded-lg p-6">
                <div className="flex items-center gap-3 mb-4">
                  {appSettings.logo ? (
                    <img
                      src={appSettings.logo}
                      alt="Logo"
                      className="w-10 h-10 object-contain"
                    />
                  ) : (
                    <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
                      <div className="w-6 h-6 bg-white rounded-sm"></div>
                    </div>
                  )}
                  <div>
                    <div className="font-bold text-gray-900">
                      {language === "ar"
                        ? appSettings.appName
                        : appSettings.appNameEn}
                    </div>
                    <div className="text-sm text-gray-600">
                      {language === "ar"
                        ? appSettings.appSlogan
                        : appSettings.appSloganEn}
                    </div>
                  </div>
                </div>
                <div className="text-sm text-gray-600">
                  <div className="flex items-center gap-2 mb-1">
                    <Building className="w-4 h-4" />
                    {language === "ar"
                      ? appSettings.clinicName
                      : appSettings.clinicNameEn}
                  </div>
                  <div className="flex items-center gap-2">
                    <Globe className="w-4 h-4" />
                    {language === "ar"
                      ? appSettings.clinicAddress
                      : appSettings.clinicAddressEn}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Permissions Management */}
      {activeTab === "permissions" && (
        <div className="space-y-6">
          {/* User Roles */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-900">
                {language === "ar" ? "أدوار المستخدمين" : "User Roles"}
              </h3>
              <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center gap-2">
                <Plus className="w-4 h-4" />
                {language === "ar" ? "إضافة دور" : "Add Role"}
              </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {userRoles.map((role) => (
                <div
                  key={role.id}
                  className="border border-gray-200 rounded-lg p-4 hover:border-blue-300 transition-colors"
                >
                  <div className="flex items-center gap-3 mb-3">
                    <div className={cn("w-3 h-3 rounded-full", role.color)} />
                    <div>
                      <div className="font-medium text-gray-900">
                        {language === "ar" ? role.name : role.nameAr}
                      </div>
                      <div className="text-sm text-gray-500">
                        {role.userCount}{" "}
                        {language === "ar" ? "مستخدم" : "users"}
                      </div>
                    </div>
                  </div>
                  <div className="text-sm text-gray-600 mb-3">
                    {role.permissions.length}{" "}
                    {language === "ar" ? "صلاحية" : "permissions"}
                  </div>
                  <button className="w-full bg-gray-100 text-gray-700 py-2 px-3 rounded-lg hover:bg-gray-200 transition-colors text-sm">
                    {language === "ar" ? "تعديل الصلاحيات" : "Edit Permissions"}
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Permissions by Category */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-6">
              {language === "ar" ? "إدارة الصلاحيات" : "Permissions Management"}
            </h3>
            <div className="space-y-6">
              {permissionCategories.map((category) => (
                <div
                  key={category.id}
                  className="border border-gray-200 rounded-lg p-6"
                >
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                      <category.icon className="w-5 h-5 text-blue-600" />
                    </div>
                    <h4 className="text-lg font-medium text-gray-900">
                      {language === "ar" ? category.name : category.nameEn}
                    </h4>
                  </div>
                  <div className="grid gap-3">
                    {permissions
                      .filter((p) => p.category === category.id)
                      .map((permission) => (
                        <div
                          key={permission.id}
                          className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                        >
                          <div className="flex-1">
                            <div className="font-medium text-gray-900 mb-1">
                              {permission.name}
                            </div>
                            <div className="text-sm text-gray-600">
                              {permission.description}
                            </div>
                          </div>
                          <div className="flex items-center gap-3">
                            <label className="relative inline-flex items-center cursor-pointer">
                              <input
                                type="checkbox"
                                checked={permission.enabled}
                                onChange={(e) => {
                                  const updated = permissions.map((p) =>
                                    p.id === permission.id
                                      ? { ...p, enabled: e.target.checked }
                                      : p,
                                  );
                                  setPermissions(updated);
                                }}
                                className="sr-only peer"
                              />
                              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                            </label>
                          </div>
                        </div>
                      ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Database Settings */}
      {activeTab === "database" && (
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-6">
            {language === "ar" ? "إعدادات قاعدة البيانات" : "Database Settings"}
          </h3>
          <div className="grid lg:grid-cols-2 gap-8">
            <div>
              <h4 className="font-medium text-gray-900 mb-4">
                {language === "ar"
                  ? "اتصال قاعدة البيانات"
                  : "Database Connection"}
              </h4>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {language === "ar" ? "المضيف" : "Host"}
                    </label>
                    <input
                      type="text"
                      value={databaseSettings.host}
                      onChange={(e) =>
                        setDatabaseSettings({
                          ...databaseSettings,
                          host: e.target.value,
                        })
                      }
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {language === "ar" ? "المنفذ" : "Port"}
                    </label>
                    <input
                      type="text"
                      value={databaseSettings.port}
                      onChange={(e) =>
                        setDatabaseSettings({
                          ...databaseSettings,
                          port: e.target.value,
                        })
                      }
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {language === "ar" ? "اسم قاعدة البيانات" : "Database Name"}
                  </label>
                  <input
                    type="text"
                    value={databaseSettings.database}
                    onChange={(e) =>
                      setDatabaseSettings({
                        ...databaseSettings,
                        database: e.target.value,
                      })
                    }
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {language === "ar" ? "اسم المستخدم" : "Username"}
                    </label>
                    <input
                      type="text"
                      value={databaseSettings.username}
                      onChange={(e) =>
                        setDatabaseSettings({
                          ...databaseSettings,
                          username: e.target.value,
                        })
                      }
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {language === "ar" ? "كلمة المرور" : "Password"}
                    </label>
                    <input
                      type="password"
                      value={databaseSettings.password}
                      onChange={(e) =>
                        setDatabaseSettings({
                          ...databaseSettings,
                          password: e.target.value,
                        })
                      }
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>
              </div>

              <div className="mt-6 pt-6 border-t border-gray-200">
                <div className="flex gap-3">
                  <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center gap-2">
                    <RefreshCw className="w-4 h-4" />
                    {language === "ar" ? "اختبار الاتصال" : "Test Connection"}
                  </button>
                  <button className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 flex items-center gap-2">
                    <Save className="w-4 h-4" />
                    {language === "ar" ? "حفظ الإعدادات" : "Save Settings"}
                  </button>
                </div>
              </div>
            </div>

            <div>
              <h4 className="font-medium text-gray-900 mb-4">
                {language === "ar" ? "حالة قاعدة البيانات" : "Database Status"}
              </h4>
              <div className="space-y-4">
                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <div className="flex items-center gap-3">
                    <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                    <span className="font-medium text-green-800">
                      {language === "ar" ? "متصل" : "Connected"}
                    </span>
                  </div>
                  <div className="text-sm text-green-700 mt-2">
                    {language === "ar"
                      ? "آخر اتصال: منذ دقيقتين"
                      : "Last connected: 2 minutes ago"}
                  </div>
                </div>

                <div className="bg-gray-50 rounded-lg p-4">
                  <h5 className="font-medium text-gray-900 mb-3">
                    {language === "ar"
                      ? "إحصائيات قاعدة البيانات"
                      : "Database Statistics"}
                  </h5>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-gray-600">
                        {language === "ar"
                          ? "حجم قاعدة البيانات:"
                          : "Database Size:"}
                      </span>
                      <div className="font-medium">2.4 GB</div>
                    </div>
                    <div>
                      <span className="text-gray-600">
                        {language === "ar" ? "عدد الجداول:" : "Tables Count:"}
                      </span>
                      <div className="font-medium">28</div>
                    </div>
                    <div>
                      <span className="text-gray-600">
                        {language === "ar" ? "المستخدمون:" : "Users:"}
                      </span>
                      <div className="font-medium">1,234</div>
                    </div>
                    <div>
                      <span className="text-gray-600">
                        {language === "ar"
                          ? "آخر نسخة احتياطية:"
                          : "Last Backup:"}
                      </span>
                      <div className="font-medium">
                        {language === "ar" ? "أمس" : "Yesterday"}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Other tabs would be implemented similarly */}
      {(activeTab === "security" || activeTab === "backup") && (
        <div className="bg-white rounded-xl shadow-sm p-12 text-center">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            {activeTab === "security" ? (
              <Lock className="w-8 h-8 text-gray-400" />
            ) : (
              <HardDrive className="w-8 h-8 text-gray-400" />
            )}
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            {activeTab === "security"
              ? language === "ar"
                ? "إعدادات الأمان"
                : "Security Settings"
              : language === "ar"
                ? "إعدادات النسخ الاحتياطي"
                : "Backup Settings"}
          </h3>
          <p className="text-gray-600">
            {language === "ar"
              ? "هذا القسم قيد التطوير"
              : "This section is under development"}
          </p>
        </div>
      )}
    </div>
  );
}
