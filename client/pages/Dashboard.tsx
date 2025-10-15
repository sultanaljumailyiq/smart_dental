import React from "react";
import {
  TrendingUp,
  TrendingDown,
  DollarSign,
  Users,
  Package,
  Star,
  Clock,
  Calendar,
  Activity,
  Heart,
  AlertTriangle,
  CheckCircle,
  ArrowRight,
  Plus,
  Eye,
  Settings,
  BarChart3,
  Zap,
  Target,
  Award,
  ShoppingCart,
  Stethoscope,
  Bell,
  MessageSquare,
  X,
  Maximize2,
  ExternalLink,
  ChevronDown,
  Building2,
  Loader2,
} from "lucide-react";
import { useI18n } from "@/lib/i18n";
import { useNavigate, useSearchParams } from "react-router-dom";
import { cn } from "@/lib/utils";
import BookingNotifications from "@/components/BookingNotifications";
import ClinicQuickActions from "@/components/ClinicQuickActions";
import { sharedClinicData, type ClinicStats } from "@/services/sharedClinicData";

const Dashboard = () => {
  const { language, isRTL, t } = useI18n();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const clinicIdFromUrl = searchParams.get("clinicId");
  const [showModal, setShowModal] = React.useState(false);
  const [activeTab, setActiveTab] = React.useState<
    "notifications" | "messages" | "reminders"
  >("notifications");
  const [isExpanded, setIsExpanded] = React.useState(false);
  const [selectedClinic, setSelectedClinic] = React.useState(clinicIdFromUrl || "1");
  const [clinics, setClinics] = React.useState<any[]>([]);
  const [isClinicDropdownOpen, setIsClinicDropdownOpen] = React.useState(false);
  const [stats, setStats] = React.useState<ClinicStats | null>(null);
  const [isLoading, setIsLoading] = React.useState(true);

  // Function to open modal with specific tab
  const openModal = (tab: "notifications" | "messages" | "reminders") => {
    setActiveTab(tab);
    setShowModal(true);
  };

  React.useEffect(() => {
    const loadClinics = async () => {
      const clinicsData = await sharedClinicData.getClinics();
      const formattedClinics = clinicsData.map(c => ({
        id: c.id,
        name: c.nameAr,
        location: c.address,
        patients: 0,
      }));
      setClinics(formattedClinics);
      
      if (clinicIdFromUrl && formattedClinics.some(c => c.id === clinicIdFromUrl)) {
        setSelectedClinic(clinicIdFromUrl);
      } else if (formattedClinics.length > 0) {
        setSelectedClinic(formattedClinics[0].id);
      }
    };
    loadClinics();
  }, [clinicIdFromUrl]);

  React.useEffect(() => {
    const loadStats = async () => {
      setIsLoading(true);
      try {
        const clinicStats = await sharedClinicData.getClinicStats();
        setStats(clinicStats);
      } catch (error) {
        console.error("Error loading clinic stats:", error);
      } finally {
        setIsLoading(false);
      }
    };
    loadStats();
  }, [selectedClinic]);

  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (isClinicDropdownOpen) {
        setIsClinicDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isClinicDropdownOpen]);

  const currentDate = new Date().toLocaleDateString(
    language === "ar" ? "ar-IQ" : "en-IQ",
    {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    },
  );

  return (
    <div
      className={`min-h-screen bg-gray-50 space-y-6 p-6 ${isRTL ? "font-arabic" : ""}`}
      dir="rtl"
    >
      {/* Clinic Selector */}
      <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-200">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-900">
            لوحة تحكم إدارة العيا��ة
          </h2>
          <div className="relative">
            <button
              onClick={() => setIsClinicDropdownOpen(!isClinicDropdownOpen)}
              className="flex items-center gap-3 px-4 py-2 bg-gray-50 hover:bg-gray-100 rounded-xl transition-colors"
            >
              <Building2 className="w-5 h-5 text-blue-600" />
              <div className="text-right">
                <div className="font-medium text-gray-900">
                  {clinics.find((c) => c.id === selectedClinic)?.name}
                </div>
                <div className="text-sm text-gray-500">
                  {clinics.find((c) => c.id === selectedClinic)?.location}
                </div>
              </div>
              <ChevronDown className="w-4 h-4 text-gray-500" />
            </button>

            {isClinicDropdownOpen && (
              <div className="absolute top-full left-0 mt-2 w-80 bg-white rounded-xl shadow-lg border border-gray-200 z-50">
                <div className="p-2">
                  {clinics.map((clinic) => (
                    <button
                      key={clinic.id}
                      onClick={() => {
                        setSelectedClinic(clinic.id);
                        setIsClinicDropdownOpen(false);
                      }}
                      className={cn(
                        "w-full text-right p-3 rounded-lg transition-colors flex items-center gap-3",
                        selectedClinic === clinic.id
                          ? "bg-blue-50 text-blue-700 border border-blue-200"
                          : "hover:bg-gray-50",
                      )}
                    >
                      <Building2 className="w-4 h-4 text-blue-600" />
                      <div className="flex-1">
                        <div className="font-medium">{clinic.name}</div>
                        <div className="text-sm text-gray-500 flex items-center gap-2">
                          <span>{clinic.location}</span>
                          <span>•</span>
                          <span>{clinic.patients} مريض</span>
                        </div>
                      </div>
                      {selectedClinic === clinic.id && (
                        <CheckCircle className="w-4 h-4 text-blue-600" />
                      )}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 rounded-3xl p-8 text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="absolute top-0 right-0 w-40 h-40 bg-white/10 rounded-full -translate-y-16 translate-x-16"></div>
        <div className="absolute bottom-0 left-0 w-32 h-32 bg-white/10 rounded-full translate-y-16 -translate-x-16"></div>
        <div className="relative z-10">
          <h1 className="text-3xl font-bold mb-2">
            {language === "ar"
              ? "مرحباً بك، د. أحمد!"
              : "Welcome back, Dr. Ahmed!"}
          </h1>
          <p className="text-blue-100 text-lg mb-4">{currentDate}</p>
          <p className="text-blue-100">
            {isLoading ? (
              <span className="flex items-center gap-2">
                <Loader2 className="w-4 h-4 animate-spin" />
                جاري التحميل...
              </span>
            ) : (
              <>
                لديك {stats?.todayAppointments || 0} موعد اليوم و{" "}
                {stats?.upcomingReminders || 0} مهام معلقة
              </>
            )}
          </p>

          {/* Quick Shortcuts */}
          <div className="grid grid-cols-3 gap-4 mt-6 mb-6">
            <button
              onClick={() => openModal("notifications")}
              className="bg-white/20 backdrop-blur-sm p-4 rounded-2xl text-white hover:bg-white/30 transition-all group relative"
            >
              <div className="flex flex-col items-center gap-2">
                <div className="relative">
                  <Bell className="w-6 h-6" />
                  <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                    5
                  </span>
                </div>
                <span className="text-sm font-medium">الإشعارات</span>
              </div>
            </button>

            <button
              onClick={() => openModal("messages")}
              className="bg-white/20 backdrop-blur-sm p-4 rounded-2xl text-white hover:bg-white/30 transition-all group relative"
            >
              <div className="flex flex-col items-center gap-2">
                <div className="relative">
                  <MessageSquare className="w-6 h-6" />
                  <span className="absolute -top-1 -right-1 w-4 h-4 bg-blue-500 text-white text-xs rounded-full flex items-center justify-center">
                    8
                  </span>
                </div>
                <span className="text-sm font-medium">ا��رسائل</span>
              </div>
            </button>

            <button
              onClick={() => openModal("reminders")}
              className="bg-white/20 backdrop-blur-sm p-4 rounded-2xl text-white hover:bg-white/30 transition-all group relative"
            >
              <div className="flex flex-col items-center gap-2">
                <div className="relative">
                  <Clock className="w-6 h-6" />
                  <span className="absolute -top-1 -right-1 w-4 h-4 bg-yellow-500 text-white text-xs rounded-full flex items-center justify-center">
                    3
                  </span>
                </div>
                <span className="text-sm font-medium">التذكيرات</span>
              </div>
            </button>
          </div>

          <div className="flex gap-4">
            <button className="bg-white/20 backdrop-blur-sm px-6 py-3 rounded-xl text-white font-medium hover:bg-white/30 transition-all flex items-center gap-2">
              <Calendar className="w-5 h-5" />
              عرض المواعيد
            </button>
            <button className="bg-white text-blue-600 px-6 py-3 rounded-xl font-medium hover:bg-blue-50 transition-all flex items-center gap-2">
              <Plus className="w-5 h-5" />
              موعد جديد
            </button>
          </div>
        </div>
      </div>

      {/* Quick Stats - Bento Style */}
      <div className="grid grid-cols-12 gap-6">
        {/* Main Revenue Card */}
        <div className="col-span-12 lg:col-span-8 bg-white rounded-3xl p-8 shadow-sm border border-gray-100 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-green-100 to-transparent rounded-full -translate-y-16 translate-x-16"></div>
          <div className="relative z-10">
            <div className="flex items-start justify-between mb-6">
              <div>
                <h3 className="text-2xl font-bold text-gray-900 mb-2">
                  الإيرادات الشهرية
                </h3>
                <div className="flex items-center gap-4">
                  {isLoading ? (
                    <Loader2 className="w-8 h-8 text-green-600 animate-spin" />
                  ) : (
                    <>
                      <span className="text-4xl font-bold text-green-600">
                        {((stats?.monthlyRevenue || 0) / 1000).toFixed(1)}K د.ع
                      </span>
                      <span className="flex items-center gap-1 text-sm bg-green-100 text-green-700 px-3 py-1 rounded-full">
                        <TrendingUp className="w-4 h-4" />
                        +15.3%
                      </span>
                    </>
                  )}
                </div>
                <p className="text-gray-600 mt-2">مقارنة بالشهر الماضي</p>
              </div>
              <div className="w-16 h-16 bg-green-100 rounded-2xl flex items-center justify-center">
                <DollarSign className="w-8 h-8 text-green-600" />
              </div>
            </div>

            {/* Mini Chart */}
            <div className="h-24 bg-gradient-to-r from-green-50 to-emerald-50 rounded-2xl flex items-end justify-center p-4">
              <div className="flex items-end gap-1 h-full">
                {[40, 65, 45, 80, 60, 75, 90, 85, 70, 95, 100, 85].map(
                  (height, i) => (
                    <div
                      key={i}
                      className="bg-gradient-to-t from-green-600 to-green-400 rounded-t-sm flex-1 transition-all duration-300 hover:from-green-700 hover:to-green-500"
                      style={{ height: `${height}%` }}
                    ></div>
                  ),
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Patients Today */}
        <div className="col-span-12 lg:col-span-4 bg-white rounded-3xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <div className="w-14 h-14 bg-blue-100 rounded-2xl flex items-center justify-center">
              <Users className="w-7 h-7 text-blue-600" />
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-600">مرضى اليوم</p>
              {isLoading ? (
                <Loader2 className="w-6 h-6 text-gray-900 animate-spin" />
              ) : (
                <p className="text-3xl font-bold text-gray-900">
                  {stats?.todayAppointments || 0}
                </p>
              )}
            </div>
          </div>
          <div className="space-y-3">
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-600">جدد</span>
              {isLoading ? (
                <Loader2 className="w-4 h-4 text-blue-600 animate-spin" />
              ) : (
                <span className="font-semibold text-blue-600">
                  {Math.floor((stats?.todayAppointments || 0) * 0.25)}
                </span>
              )}
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-600">متابعة</span>
              {isLoading ? (
                <Loader2 className="w-4 h-4 text-green-600 animate-spin" />
              ) : (
                <span className="font-semibold text-green-600">
                  {Math.floor((stats?.todayAppointments || 0) * 0.75)}
                </span>
              )}
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-gradient-to-r from-blue-600 to-green-600 h-2 rounded-full"
                style={{ width: "75%" }}
              ></div>
            </div>
          </div>
        </div>

        {/* Appointments Status */}
        <div className="col-span-12 lg:col-span-6 admin-legacy-card admin-legacy-card-hover p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-bold text-gray-900">حالة ال��واعيد</h3>
            <Calendar className="w-6 h-6 text-gray-400" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="text-center p-4 bg-green-50 rounded-2xl">
              <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center mx-auto mb-3">
                <CheckCircle className="w-6 h-6 text-green-600" />
              </div>
              {isLoading ? (
                <Loader2 className="w-6 h-6 text-green-600 animate-spin mx-auto" />
              ) : (
                <>
                  <p className="text-2xl font-bold text-green-600">
                    {stats?.completedToday || 0}
                  </p>
                  <p className="text-sm text-green-700">مكتملة</p>
                </>
              )}
            </div>
            <div className="text-center p-4 bg-yellow-50 rounded-2xl">
              <div className="w-12 h-12 bg-yellow-100 rounded-xl flex items-center justify-center mx-auto mb-3">
                <Clock className="w-6 h-6 text-yellow-600" />
              </div>
              {isLoading ? (
                <Loader2 className="w-6 h-6 text-yellow-600 animate-spin mx-auto" />
              ) : (
                <>
                  <p className="text-2xl font-bold text-yellow-600">
                    {stats?.pendingAppointments || 0}
                  </p>
                  <p className="text-sm text-yellow-700">في الانتظار</p>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Treatment Stats */}
        <div className="col-span-12 lg:col-span-6 admin-legacy-card admin-legacy-card-hover p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-bold text-gray-900">
              العلاجات الشائعة
            </h3>
            <Stethoscope className="w-6 h-6 text-gray-400" />
          </div>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                <span className="text-sm text-gray-700">تنظيف الأسنان</span>
              </div>
              <span className="text-sm font-semibold text-gray-900">45%</span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                <span className="text-sm text-gray-700">حشو الأسنان</span>
              </div>
              <span className="text-sm font-semibold text-gray-900">30%</span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
                <span className="text-sm text-gray-700">خلع الأسنان</span>
              </div>
              <span className="text-sm font-semibold text-gray-900">15%</span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 bg-orange-500 rounded-full"></div>
                <span className="text-sm text-gray-700">أخرى</span>
              </div>
              <span className="text-sm font-semibold text-gray-900">10%</span>
            </div>
          </div>
        </div>

        {/* Inventory Alert */}
        <div className="col-span-12 lg:col-span-4 bg-gradient-to-br from-red-50 to-orange-50 rounded-3xl p-6 border border-red-100">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-14 h-14 bg-red-100 rounded-2xl flex items-center justify-center">
              <AlertTriangle className="w-7 h-7 text-red-600" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-red-900">تنبيه المخزون</h3>
              {isLoading ? (
                <Loader2 className="w-4 h-4 text-red-700 animate-spin" />
              ) : (
                <p className="text-sm text-red-700">
                  {stats?.lowStock || 0} منتجات منخفضة
                </p>
              )}
            </div>
          </div>
          <div className="space-y-2">
            <div className="text-sm text-red-800 bg-red-100 px-3 py-2 rounded-lg">
              مادة التخدير الموضعي
            </div>
            <div className="text-sm text-red-800 bg-red-100 px-3 py-2 rounded-lg">
              قفازات طبية
            </div>
            <div className="text-sm text-red-800 bg-red-100 px-3 py-2 rounded-lg">
              مراية فحص
            </div>
          </div>
          <button className="w-full mt-4 bg-red-600 text-white py-3 rounded-xl font-medium hover:bg-red-700 transition-colors flex items-center justify-center gap-2">
            <Package className="w-4 h-4" />
            إدارة ال��خز��ن
          </button>
        </div>

        {/* Performance Metrics */}
        <div className="col-span-12 lg:col-span-5 bg-white rounded-3xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-bold text-gray-900">مؤشرات الأداء</h3>
            <BarChart3 className="w-6 h-6 text-gray-400" />
          </div>
          <div className="space-y-4">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-gray-600">معدل رضا المرضى</span>
                <span className="text-sm font-bold text-green-600">4.8/5</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-green-500 h-2 rounded-full"
                  style={{ width: "96%" }}
                ></div>
              </div>
            </div>
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-gray-600">معدل الحضور</span>
                <span className="text-sm font-bold text-blue-600">92%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-blue-500 h-2 rounded-full"
                  style={{ width: "92%" }}
                ></div>
              </div>
            </div>
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-gray-600">كفاءة الوقت</span>
                <span className="text-sm font-bold text-purple-600">85%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-purple-500 h-2 rounded-full"
                  style={{ width: "85%" }}
                ></div>
              </div>
            </div>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="col-span-12 lg:col-span-3 bg-white rounded-3xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-bold text-gray-900">النشاط الأخير</h3>
            <Activity className="w-6 h-6 text-gray-400" />
          </div>
          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
              <div>
                <p className="text-sm font-medium text-gray-900">موعد مكتمل</p>
                <p className="text-xs text-gray-600">د. أحمد - تنظيف أسنان</p>
                <p className="text-xs text-gray-500">منذ 5 دقائق</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
              <div>
                <p className="text-sm font-medium text-gray-900">مريض جديد</p>
                <p className="text-xs text-gray-600">سارة محمد</p>
                <p className="text-xs text-gray-500">منذ 15 دقيقة</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-2 h-2 bg-yellow-500 rounded-full mt-2"></div>
              <div>
                <p className="text-sm font-medium text-gray-900">تذكير</p>
                <p className="text-xs text-gray-600">موعد خلال ساعة</p>
                <p className="text-xs text-gray-500">منذ 30 دقيقة</p>
              </div>
            </div>
          </div>
        </div>

        {/* إشع��رات الحجز الجديدة */}
        <div className="col-span-12 lg:col-span-8">
          <BookingNotifications
            clinicId="CL-BAGHDAD-001"
            onNotificationAction={(notificationId, action) => {
              console.log(`إجراء ${action} على الإشعار ${notificationId}`);
              // يمكن إضافة منطق للتعامل مع الإجراءات هنا
            }}
          />
        </div>

        {/* Quick Actions */}
        <div className="col-span-12 bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <h3 className="text-lg font-bold text-gray-900 mb-6">
            إجراءات سريعة
          </h3>
          <ClinicQuickActions variant="full" />
        </div>
      </div>

      {/* Unified Modal with Tabs */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div
            className={cn(
              "bg-white rounded-3xl shadow-2xl transition-all duration-300",
              isExpanded
                ? "w-full max-w-6xl h-[90vh]"
                : "w-full max-w-3xl h-[700px]",
            )}
          >
            {/* Header with close buttons */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                {activeTab === "notifications" && (
                  <>
                    <Bell className="w-6 h-6 text-blue-600" />
                    الإشعارات
                  </>
                )}
                {activeTab === "messages" && (
                  <>
                    <MessageSquare className="w-6 h-6 text-green-600" />
                    الرسائل
                  </>
                )}
                {activeTab === "reminders" && (
                  <>
                    <Clock className="w-6 h-6 text-yellow-600" />
                    التذكيرات
                  </>
                )}
              </h2>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setIsExpanded(!isExpanded)}
                  className="p-2 hover:bg-gray-100 rounded-xl transition-colors"
                  title={isExpanded ? "تصغير" : "توسيع"}
                >
                  <Maximize2 className="w-5 h-5 text-gray-600" />
                </button>
                <button
                  onClick={() => navigate("/dentist-hub/notifications")}
                  className="p-2 hover:bg-gray-100 rounded-xl transition-colors"
                  title="الذهاب لقسم الإشعارات"
                >
                  <ExternalLink className="w-5 h-5 text-gray-600" />
                </button>
                <button
                  onClick={() => setShowModal(false)}
                  className="p-2 hover:bg-gray-100 rounded-xl transition-colors"
                >
                  <X className="w-5 h-5 text-gray-600" />
                </button>
              </div>
            </div>

            {/* Tab Navigation */}
            <div className="border-b border-gray-200">
              <div className="flex">
                <button
                  onClick={() => setActiveTab("notifications")}
                  className={cn(
                    "flex-1 py-4 px-6 text-center font-medium transition-all relative",
                    activeTab === "notifications"
                      ? "text-blue-600 bg-blue-50 border-b-2 border-blue-600"
                      : "text-gray-600 hover:text-gray-900 hover:bg-gray-50",
                  )}
                >
                  <div className="flex items-center justify-center gap-2">
                    <Bell className="w-5 h-5" />
                    <span>الإشعارات</span>
                    <span className="w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                      5
                    </span>
                  </div>
                </button>
                <button
                  onClick={() => setActiveTab("messages")}
                  className={cn(
                    "flex-1 py-4 px-6 text-center font-medium transition-all relative",
                    activeTab === "messages"
                      ? "text-green-600 bg-green-50 border-b-2 border-green-600"
                      : "text-gray-600 hover:text-gray-900 hover:bg-gray-50",
                  )}
                >
                  <div className="flex items-center justify-center gap-2">
                    <MessageSquare className="w-5 h-5" />
                    <span>الرسائل</span>
                    <span className="w-5 h-5 bg-blue-500 text-white text-xs rounded-full flex items-center justify-center">
                      8
                    </span>
                  </div>
                </button>
                <button
                  onClick={() => setActiveTab("reminders")}
                  className={cn(
                    "flex-1 py-4 px-6 text-center font-medium transition-all relative",
                    activeTab === "reminders"
                      ? "text-yellow-600 bg-yellow-50 border-b-2 border-yellow-600"
                      : "text-gray-600 hover:text-gray-900 hover:bg-gray-50",
                  )}
                >
                  <div className="flex items-center justify-center gap-2">
                    <Clock className="w-5 h-5" />
                    <span>التذكيرات</span>
                    <span className="w-5 h-5 bg-yellow-500 text-white text-xs rounded-full flex items-center justify-center">
                      3
                    </span>
                  </div>
                </button>
              </div>
            </div>

            {/* Content Area */}
            <div
              className="p-6 overflow-y-auto"
              style={{ height: "calc(100% - 160px)" }}
            >
              {/* Notifications Content */}
              {activeTab === "notifications" && (
                <div className="space-y-4">
                  {[
                    {
                      type: "notification",
                      icon: <Bell className="w-5 h-5 text-blue-600" />,
                      title: "موعد قريب",
                      message: "لديك موعد مع المريض أحمد محمد خلال 15 دقيقة",
                      time: "منذ 10 دقائق",
                      urgent: true,
                    },
                    {
                      type: "notification",
                      icon: <Package className="w-5 h-5 text-green-600" />,
                      title: "وصول شحنة جديدة",
                      message: "و����ت شحنة الموا�� الطبية الجديدة للمخزون",
                      time: "منذ ساعة",
                      urgent: false,
                    },
                    {
                      type: "notification",
                      icon: (
                        <AlertTriangle className="w-5 h-5 text-orange-600" />
                      ),
                      title: "تنبيه مخزون",
                      message: "مستوى مادة التخدير منخفض جداً",
                      time: "منذ ساعتين",
                      urgent: true,
                    },
                    {
                      type: "notification",
                      icon: <CheckCircle className="w-5 h-5 text-green-600" />,
                      title: "موعد مكتمل",
                      message: "تم إنهاء علاج المريضة سارة بنجاح",
                      time: "منذ 3 ساعات",
                      urgent: false,
                    },
                  ].map((item, index) => (
                    <div
                      key={index}
                      className={cn(
                        "p-4 rounded-2xl border transition-all hover:shadow-md",
                        item.urgent
                          ? "border-red-200 bg-red-50"
                          : "border-gray-200 bg-white",
                      )}
                    >
                      <div className="flex items-start gap-3">
                        <div
                          className={cn(
                            "w-10 h-10 rounded-xl flex items-center justify-center",
                            item.urgent ? "bg-red-100" : "bg-gray-100",
                          )}
                        >
                          {item.icon}
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="font-semibold text-gray-900">
                            {item.title}
                          </h3>
                          <p className="text-gray-600 text-sm mt-1">
                            {item.message}
                          </p>
                          <span className="text-xs text-gray-500 mt-2 block">
                            {item.time}
                          </span>
                        </div>
                        {item.urgent && (
                          <span className="px-2 py-1 bg-red-100 text-red-700 text-xs rounded-full">
                            عاجل
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Messages Content */}
              {activeTab === "messages" && (
                <div className="space-y-4">
                  {[
                    {
                      sender: "د. سارة أحمد",
                      message: "مرحباً، أحتاج لاستشارة حول حالة المريض",
                      time: "منذ 5 دقائق",
                      unread: true,
                      avatar: "👩‍⚕️",
                    },
                    {
                      sender: "إدارة المستشفى",
                      message: "تم تحديث جدول الطوا��ئ للأسبوع القادم",
                      time: "منذ 20 دقيقة",
                      unread: true,
                      avatar: "🏥",
                    },
                    {
                      sender: "محمد علي (مريض)",
                      message: "شكراً لك على الخدمة الممتازة، أشعر بتحسن كبير",
                      time: "منذ ساعة",
                      unread: false,
                      avatar: "����",
                    },
                    {
                      sender: "د. أحمد كريم",
                      message: "هل يمكنك مراجعة تقرير الأشعة للمريض؟",
                      time: "منذ ساعتين",
                      unread: false,
                      avatar: "👨‍⚕️",
                    },
                    {
                      sender: "نظام التذكيرات",
                      message: "موعد المريضة فاطمة غداً في الساعة 10:00 صباحاً",
                      time: "منذ 3 ساعات",
                      unread: false,
                      avatar: "⏰",
                    },
                  ].map((message, index) => (
                    <div
                      key={index}
                      className={cn(
                        "p-4 rounded-2xl border transition-all hover:shadow-md cursor-pointer",
                        message.unread
                          ? "border-blue-200 bg-blue-50"
                          : "border-gray-200 bg-white",
                      )}
                    >
                      <div className="flex items-start gap-3">
                        <div className="w-10 h-10 rounded-xl bg-gray-100 flex items-center justify-center text-lg">
                          {message.avatar}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between">
                            <h3 className="font-semibold text-gray-900">
                              {message.sender}
                            </h3>
                            <span className="text-xs text-gray-500">
                              {message.time}
                            </span>
                          </div>
                          <p className="text-gray-600 text-sm mt-1 line-clamp-2">
                            {message.message}
                          </p>
                        </div>
                        {message.unread && (
                          <div className="w-3 h-3 bg-blue-600 rounded-full"></div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Reminders Content */}
              {activeTab === "reminders" && (
                <div className="space-y-4">
                  {[
                    {
                      title: "فحص دوري للمعدات",
                      description: "فحص وصيانة جهاز الأشعة السينية",
                      dueTime: "اليوم - 3:00 م",
                      priority: "high",
                      category: "صيانة",
                    },
                    {
                      title: "متابعة علاج المريض",
                      description:
                        "موعد متابعة للمريض أحمد محمد بعد علاج العصب",
                      dueTime: "غداً - 10:00 ص",
                      priority: "medium",
                      category: "طبي",
                    },
                    {
                      title: "طلب مواد طبية",
                      description: "انتهت كمية مواد ��لحشو، يجب طلب شحنة جديدة",
                      dueTime: "خلال 3 أيام",
                      priority: "medium",
                      category: "مخزون",
                    },
                    {
                      title: "تحديث ملفات المرضى",
                      description: "مراجعة وتحديث ملفات المرضى القديمة",
                      dueTime: "نهاية الأسبوع",
                      priority: "low",
                      category: "إداري",
                    },
                    {
                      title: "اجتماع الفريق الطبي",
                      description: "اجتماع شهري لمناقشة الحالات المعقدة",
                      dueTime: "الأربعاء - 2:00 م",
                      priority: "medium",
                      category: "اجتماع",
                    },
                  ].map((reminder, index) => (
                    <div
                      key={index}
                      className={cn(
                        "p-4 rounded-2xl border transition-all hover:shadow-md",
                        reminder.priority === "high"
                          ? "border-red-200 bg-red-50"
                          : reminder.priority === "medium"
                            ? "border-yellow-200 bg-yellow-50"
                            : "border-gray-200 bg-white",
                      )}
                    >
                      <div className="flex items-start gap-3">
                        <div
                          className={cn(
                            "w-10 h-10 rounded-xl flex items-center justify-center",
                            reminder.priority === "high"
                              ? "bg-red-100"
                              : reminder.priority === "medium"
                                ? "bg-yellow-100"
                                : "bg-gray-100",
                          )}
                        >
                          <Clock
                            className={cn(
                              "w-5 h-5",
                              reminder.priority === "high"
                                ? "text-red-600"
                                : reminder.priority === "medium"
                                  ? "text-yellow-600"
                                  : "text-gray-600",
                            )}
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between">
                            <h3 className="font-semibold text-gray-900">
                              {reminder.title}
                            </h3>
                            <span
                              className={cn(
                                "px-2 py-1 text-xs rounded-full",
                                reminder.priority === "high"
                                  ? "bg-red-100 text-red-700"
                                  : reminder.priority === "medium"
                                    ? "bg-yellow-100 text-yellow-700"
                                    : "bg-gray-100 text-gray-700",
                              )}
                            >
                              {reminder.category}
                            </span>
                          </div>
                          <p className="text-gray-600 text-sm mt-1">
                            {reminder.description}
                          </p>
                          <div className="flex items-center justify-between mt-2">
                            <span className="text-xs text-gray-500">
                              {reminder.dueTime}
                            </span>
                            <button className="text-xs text-blue-600 hover:text-blue-700 transition-colors">
                              تم الإنجاز
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
