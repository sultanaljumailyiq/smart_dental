import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  Home,
  Calendar,
  Users,
  Stethoscope,
  UserCheck,
  CreditCard,
  TrendingUp,
  ShoppingCart,
  Package,
  BarChart3,
  Plus,
  Search,
  Filter,
  Download,
  Settings,
  Bell,
  ChevronRight,
  Activity,
  Clock,
  Star,
  AlertCircle,
  CheckCircle,
  ArrowLeft,
  Menu,
  X,
} from "lucide-react";

interface NavigationItem {
  id: string;
  label: string;
  icon: React.ComponentType<any>;
  path: string;
  description?: string;
  color?: string;
  badge?: number;
}

interface QuickAction {
  id: string;
  title: string;
  description: string;
  icon: React.ComponentType<any>;
  action: () => void;
  color: string;
}

// بيانات تجريبية للمرضى
const mockPatients = [
  {
    id: 1,
    name: "أحمد محمد",
    phone: "0501234567",
    lastVisit: "2024-01-15",
    status: "مكتمل",
  },
  {
    id: 2,
    name: "فاطمة أحمد",
    phone: "0509876543",
    lastVisit: "2024-01-14",
    status: "منتظر",
  },
  {
    id: 3,
    name: "محمد علي",
    phone: "0505555555",
    lastVisit: "2024-01-13",
    status: "مؤجل",
  },
];

// بيانات تجريبية للحجوزات
const mockReservations = [
  {
    id: 1,
    patient: "سارة خالد",
    time: "09:00",
    treatment: "فحص دوري",
    status: "مؤكد",
  },
  {
    id: 2,
    patient: "عمر سالم",
    time: "10:30",
    treatment: "تنظيف أسنان",
    status: "منتظر",
  },
  {
    id: 3,
    patient: "ليلى عبدالله",
    time: "14:00",
    treatment: "حشو أسنان",
    status: "مؤكد",
  },
];

const AdminClinicDashboard: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  // قائمة التنقل الرئيسية
  const navigationItems: NavigationItem[] = [
    {
      id: "overview",
      label: "لوحة التحكم",
      icon: Home,
      path: "/admin",
      description: "نظرة عامة على العيادة",
      color: "blue",
    },
    {
      id: "reservations",
      label: "الحجوزات",
      icon: Calendar,
      path: "/admin/reservations",
      description: "إدارة مواعيد المرضى",
      color: "green",
      badge: 12,
    },
    {
      id: "patients",
      label: "المرضى",
      icon: Users,
      path: "/admin/patients",
      description: "ملفات المرضى",
      color: "purple",
      badge: 156,
    },
    {
      id: "treatments",
      label: "العلاجات",
      icon: Stethoscope,
      path: "/admin/treatments",
      description: "إدارة العلاجات",
      color: "pink",
    },
    {
      id: "staff",
      label: "الطاقم",
      icon: UserCheck,
      path: "/admin/staff",
      description: "إدارة الموظفين",
      color: "orange",
    },
    {
      id: "accounts",
      label: "الحسابات",
      icon: CreditCard,
      path: "/admin/accounts",
      description: "المالية وا��حسابات",
      color: "cyan",
    },
    {
      id: "sales",
      label: "المبيعات",
      icon: TrendingUp,
      path: "/admin/sales",
      description: "تقارير المبيعات",
      color: "emerald",
    },
    {
      id: "purchases",
      label: "المشتريات",
      icon: ShoppingCart,
      path: "/admin/purchases",
      description: "إدارة المشتريات",
      color: "indigo",
    },
    {
      id: "stocks",
      label: "المخزون",
      icon: Package,
      path: "/admin/stocks",
      description: "إدارة المواد والأدوات",
      color: "teal",
    },
    {
      id: "peripherals",
      label: "الأجهزة",
      icon: Package,
      path: "/admin/peripherals",
      description: "أجهزة العيادة",
      color: "amber",
    },
    {
      id: "reports",
      label: "التقارير",
      icon: BarChart3,
      path: "/admin/reports",
      description: "تقارير شاملة",
      color: "red",
    },
  ];

  // الإجراءات السريعة
  const quickActions: QuickAction[] = [
    {
      id: "new-patient",
      title: "مريض جديد",
      description: "إضافة مريض جديد للنظام",
      icon: Plus,
      action: () => navigate("/admin/patients/new"),
      color: "blue",
    },
    {
      id: "new-appointment",
      title: "حجز موعد",
      description: "جدولة موعد جديد",
      icon: Calendar,
      action: () => navigate("/admin/reservations/new"),
      color: "green",
    },
    {
      id: "quick-treatment",
      title: "علاج سريع",
      description: "تسجيل علاج سريع",
      icon: Stethoscope,
      action: () => navigate("/admin/treatments/quick"),
      color: "purple",
    },
    {
      id: "view-reports",
      title: "عرض التقارير",
      description: "مراجعة التقارير الأخيرة",
      icon: BarChart3,
      action: () => navigate("/admin/reports"),
      color: "orange",
    },
  ];

  // إحصائيات سريعة
  const quickStats = [
    {
      title: "مواعيد اليوم",
      value: "12",
      change: "+3 من أمس",
      color: "green",
      icon: Calendar,
    },
    {
      title: "مرضى جدد",
      value: "8",
      change: "+2 هذا الأسبوع",
      color: "blue",
      icon: Users,
    },
    {
      title: "إيرادات الشهر",
      value: "15,500 ر.س",
      change: "+8% م�� الشهر الماضي",
      color: "purple",
      icon: TrendingUp,
    },
    {
      title: "معدل الرضا",
      value: "98%",
      change: "ممتاز",
      color: "emerald",
      icon: Star,
    },
  ];

  // تحديد القسم النشط
  const getActiveSection = () => {
    const path = location.pathname;
    const activeItem = navigationItems.find(
      (item) =>
        path === item.path ||
        (item.path !== "/admin" && path.startsWith(item.path)),
    );
    return activeItem?.id || "overview";
  };

  const activeSection = getActiveSection();

  // العنوان الحالي
  const getCurrentTitle = () => {
    const activeItem = navigationItems.find(
      (item) => item.id === activeSection,
    );
    return activeItem?.label || "لوحة التحكم";
  };

  return (
    <div className="min-h-screen bg-gray-50" dir="rtl">
      {/* الهيدر */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-40">
        <div className="px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* الجانب الأيمن */}
            <div className="flex items-center gap-4">
              <button
                onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                className="lg:hidden p-2 rounded-lg hover:bg-gray-100"
              >
                <Menu className="w-5 h-5" />
              </button>

              <div className="flex items-center gap-3">
                <button
                  onClick={() => navigate("/dentist-hub")}
                  className="flex items-center gap-2 text-gray-600 hover:text-blue-600 transition-colors"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span className="hidden sm:inline">مركز الأطباء</span>
                </button>
                <ChevronRight className="w-4 h-4 text-gray-400" />
                <h1 className="text-lg font-semibold text-gray-900">
                  {getCurrentTitle()}
                </h1>
              </div>
            </div>

            {/* الجانب الأيسر */}
            <div className="flex items-center gap-3">
              <div className="relative hidden md:block">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder="بحث..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 w-64"
                />
              </div>
              <button className="relative p-2 text-gray-600 hover:text-blue-600 rounded-lg hover:bg-gray-100">
                <Bell className="w-5 h-5" />
                <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full"></span>
              </button>
              <button className="p-2 text-gray-600 hover:text-blue-600 rounded-lg hover:bg-gray-100">
                <Settings className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* الشريط الجانبي للهاتف */}
        {isSidebarOpen && (
          <div className="fixed inset-0 z-50 lg:hidden">
            <div
              className="fixed inset-0 bg-black bg-opacity-50"
              onClick={() => setIsSidebarOpen(false)}
            />
            <div className="fixed right-0 top-0 h-full w-64 bg-white shadow-lg">
              <div className="p-4 border-b">
                <div className="flex justify-between items-center">
                  <h2 className="text-lg font-semibold">إدارة العيادة</h2>
                  <button onClick={() => setIsSidebarOpen(false)}>
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </div>
              <nav className="p-4">
                {navigationItems.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => {
                      navigate(item.path);
                      setIsSidebarOpen(false);
                    }}
                    className={`w-full flex items-center gap-3 px-3 py-2.5 mb-1 rounded-lg text-right transition-colors ${
                      activeSection === item.id
                        ? "bg-blue-50 text-blue-700 border-l-4 border-blue-500"
                        : "text-gray-700 hover:bg-gray-50"
                    }`}
                  >
                    <item.icon
                      className={`w-5 h-5 ${
                        activeSection === item.id
                          ? "text-blue-600"
                          : "text-gray-500"
                      }`}
                    />
                    <span className="flex-1">{item.label}</span>
                    {item.badge && (
                      <span className="bg-red-500 text-white text-xs px-2 py-1 rounded-full">
                        {item.badge}
                      </span>
                    )}
                  </button>
                ))}
              </nav>
            </div>
          </div>
        )}

        {/* الشريط الجانبي للكمبيوتر */}
        <aside className="hidden lg:block w-64 bg-white border-l border-gray-200 h-[calc(100vh-4rem)] overflow-y-auto">
          <div className="p-4">
            <h2 className="text-lg font-semibold text-gray-900 mb-6">
              إدارة العيادة
            </h2>
            <nav>
              {navigationItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => navigate(item.path)}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 mb-1 rounded-lg text-right transition-colors ${
                    activeSection === item.id
                      ? "bg-blue-50 text-blue-700 border-l-4 border-blue-500"
                      : "text-gray-700 hover:bg-gray-50"
                  }`}
                >
                  <item.icon
                    className={`w-5 h-5 ${
                      activeSection === item.id
                        ? "text-blue-600"
                        : "text-gray-500"
                    }`}
                  />
                  <div className="flex-1 text-right">
                    <div className="font-medium">{item.label}</div>
                    {item.description && (
                      <div className="text-xs text-gray-500 mt-0.5">
                        {item.description}
                      </div>
                    )}
                  </div>
                  {item.badge && (
                    <span className="bg-red-500 text-white text-xs px-2 py-1 rounded-full">
                      {item.badge}
                    </span>
                  )}
                </button>
              ))}
            </nav>
          </div>
        </aside>

        {/* المحتوى الرئيسي */}
        <main className="flex-1 overflow-auto">
          {activeSection === "overview" ? (
            // لوحة التحكم الرئيسية
            <div className="p-6">
              {/* الإحصائيات السريعة */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                {quickStats.map((stat, index) => (
                  <div
                    key={index}
                    className="bg-white p-6 rounded-xl shadow-sm border border-gray-200"
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-600">
                          {stat.title}
                        </p>
                        <p className="text-2xl font-bold text-gray-900 mt-1">
                          {stat.value}
                        </p>
                        <p className={`text-sm mt-1 text-${stat.color}-600`}>
                          {stat.change}
                        </p>
                      </div>
                      <stat.icon className={`w-8 h-8 text-${stat.color}-600`} />
                    </div>
                  </div>
                ))}
              </div>

              {/* الإجراءات السريعة */}
              <div className="mb-8">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  إجراءات سريعة
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  {quickActions.map((action) => (
                    <button
                      key={action.id}
                      onClick={action.action}
                      className={`p-6 bg-white rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-shadow text-right`}
                    >
                      <action.icon
                        className={`w-8 h-8 text-${action.color}-600 mb-3`}
                      />
                      <h4 className="font-medium text-gray-900 mb-1">
                        {action.title}
                      </h4>
                      <p className="text-sm text-gray-600">
                        {action.description}
                      </p>
                    </button>
                  ))}
                </div>
              </div>

              {/* المرضى الأخيرون والحجوزات */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* المرضى الأخيرون */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-200">
                  <div className="p-6 border-b border-gray-200">
                    <div className="flex justify-between items-center">
                      <h3 className="text-lg font-semibold text-gray-900">
                        المرضى الأخيرون
                      </h3>
                      <button
                        onClick={() => navigate("/admin/patients")}
                        className="text-blue-600 hover:text-blue-700 text-sm font-medium"
                      >
                        عرض الكل
                      </button>
                    </div>
                  </div>
                  <div className="p-6">
                    <div className="space-y-4">
                      {mockPatients.map((patient) => (
                        <div
                          key={patient.id}
                          className="flex items-center justify-between"
                        >
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center">
                              <Users className="w-5 h-5 text-gray-600" />
                            </div>
                            <div>
                              <p className="font-medium text-gray-900">
                                {patient.name}
                              </p>
                              <p className="text-sm text-gray-600">
                                {patient.phone}
                              </p>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="text-sm text-gray-600">
                              {patient.lastVisit}
                            </p>
                            <span
                              className={`inline-block px-2 py-1 rounded-full text-xs ${
                                patient.status === "مكتمل"
                                  ? "bg-green-100 text-green-800"
                                  : patient.status === "منتظر"
                                    ? "bg-yellow-100 text-yellow-800"
                                    : "bg-gray-100 text-gray-800"
                              }`}
                            >
                              {patient.status}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* الحجوزات اليوم */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-200">
                  <div className="p-6 border-b border-gray-200">
                    <div className="flex justify-between items-center">
                      <h3 className="text-lg font-semibold text-gray-900">
                        حجوزات اليوم
                      </h3>
                      <button
                        onClick={() => navigate("/admin/reservations")}
                        className="text-blue-600 hover:text-blue-700 text-sm font-medium"
                      >
                        عرض الكل
                      </button>
                    </div>
                  </div>
                  <div className="p-6">
                    <div className="space-y-4">
                      {mockReservations.map((reservation) => (
                        <div
                          key={reservation.id}
                          className="flex items-center justify-between"
                        >
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                              <Clock className="w-5 h-5 text-blue-600" />
                            </div>
                            <div>
                              <p className="font-medium text-gray-900">
                                {reservation.patient}
                              </p>
                              <p className="text-sm text-gray-600">
                                {reservation.treatment}
                              </p>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="font-medium text-gray-900">
                              {reservation.time}
                            </p>
                            <span
                              className={`inline-block px-2 py-1 rounded-full text-xs ${
                                reservation.status === "��ؤكد"
                                  ? "bg-green-100 text-green-800"
                                  : "bg-yellow-100 text-yellow-800"
                              }`}
                            >
                              {reservation.status}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            // صفحة قيد التطوير للأقسام الأخرى
            <div className="p-6">
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 text-center">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Settings className="w-8 h-8 text-gray-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  {getCurrentTitle()}
                </h3>
                <p className="text-gray-600 mb-6">
                  هذا القسم قيد التطوير وسيكون متاحاً قريباً
                </p>
                <button
                  onClick={() => navigate("/admin")}
                  className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  <Home className="w-4 h-4" />
                  العودة للرئيسية
                </button>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default AdminClinicDashboard;
