import React, { useState, useEffect } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import {
  Calendar,
  Users,
  Stethoscope,
  TrendingUp,
  Clock,
  Bell,
  MessageSquare,
  Plus,
  ChevronRight,
  Activity,
  Package,
  AlertTriangle,
  CheckCircle,
  Eye,
  Settings,
  Phone,
  Search,
  Filter,
  MoreHorizontal,
  Building2,
  ChevronDown,
  FlaskConical,
  Timer,
  RotateCcw,
  Send,
  FileText,
  User,
  UserPlus,
  Crown,
  ClipboardList,
  Target,
  ArrowRight,
  Star,
  Zap,
  CreditCard,
  Truck,
  BarChart3,
  Home,
  ShoppingCart,
  DollarSign,
  PieChart,
  CalendarDays,
  X,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import BookingNotifications from "@/components/BookingNotifications";
import InteractiveCalendar from "@/components/InteractiveCalendar";
import ModernMedicalCheckupModal from "@/components/ModernMedicalCheckupModal";
import { sharedClinicData, Clinic } from "@/services/sharedClinicData";

// Mock clinic data
const mockClinicData = {
  name: "عيادة النجمة لطب الأسنان",
  doctor: "د. أحمد محمد علي",
  address: "شارع الكندي، بغداد",
  phone: "+964 770 123 4567",
  email: "info@najma-dental.com",
  stats: {
    todayAppointments: 12,
    totalPatients: 345,
    monthlyRevenue: 15750000, // IQD
    pendingTreatments: 8,
    completedToday: 5,
    staff: 6,
    inventory: 89,
    reports: 23,
  },
};

const getTodayDate = () => new Date().toISOString().split('T')[0];
const getTomorrowDate = () => new Date(Date.now() + 86400000).toISOString().split('T')[0];

const mockAppointments = [
  {
    id: 1,
    patientName: "سارة أحمد",
    patient: "سارة أحمد",
    date: getTodayDate(),
    time: "09:00",
    treatment: "فحص دوري",
    duration: "30 دقيقة",
    status: "confirmed" as const,
    phone: "07701234567",
    avatar: "👩",
    color: "bg-blue-500",
    email: "sara@example.com",
    priority: "normal",
    treatmentPlan: {
      stage: "المرحلة الأولى",
      stepType: "consultation" as const,
      description: "فحص دوري للأسنان",
      progress: 50,
      nextStep: "تنظيف الأسنان"
    }
  },
  {
    id: 2,
    patientName: "محمد علي",
    patient: "محمد علي",
    date: getTodayDate(),
    time: "10:30",
    treatment: "حشو أسنان",
    duration: "45 دقيقة",
    status: "in-progress" as const,
    phone: "07709876543",
    avatar: "👨",
    color: "bg-green-500",
    email: "mohammed@example.com",
    priority: "high",
    treatmentPlan: {
      stage: "المرحلة الثانية",
      stepType: "treatment" as const,
      description: "حشو الأسنان الأمامية",
      progress: 75,
      nextStep: "متابعة الحشو"
    }
  },
  {
    id: 3,
    patientName: "فاطمة حسن",
    patient: "فاطمة حسن",
    date: getTomorrowDate(),
    time: "14:00",
    treatment: "تنظيف أسنان",
    duration: "30 دقيقة",
    status: "confirmed" as const,
    phone: "07701111222",
    avatar: "👩",
    color: "bg-purple-500",
    email: "fatima@example.com",
    priority: "normal",
    treatmentPlan: {
      stage: "المرحلة الأولى",
      stepType: "examination" as const,
      description: "تنظيف شامل للأسنان",
      progress: 25
    }
  },
];

export default function ClinicDashboard() {
  const [activeTab, setActiveTab] = useState("overview");
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const [isNewAppointmentModalOpen, setIsNewAppointmentModalOpen] = useState(false);
  
  // Clinic selector state
  const [clinics, setClinics] = useState<Clinic[]>([]);
  const [selectedClinic, setSelectedClinic] = useState<Clinic | null>(null);
  const [isClinicDropdownOpen, setIsClinicDropdownOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  
  // Load clinics and set selected clinic from URL or default to first
  useEffect(() => {
    const loadClinics = async () => {
      const clinicsData = await sharedClinicData.getClinics();
      setClinics(clinicsData);
      
      const clinicIdFromUrl = searchParams.get("clinicId");
      if (clinicIdFromUrl) {
        const clinic = clinicsData.find((c) => c.id === clinicIdFromUrl);
        setSelectedClinic(clinic || clinicsData[0]);
      } else {
        setSelectedClinic(clinicsData[0]);
      }
      
      setLoading(false);
    };
    loadClinics();
  }, [searchParams]);

  const handleNotificationAction = (
    notificationId: string,
    action: "accept" | "reject" | "view"
  ) => {
    console.log(`إجراء ${action} على الإشعار ${notificationId}`);
    // يمكن إضافة منطق إضافي هنا مثل حفظ الحجز في قاعدة البيانات
    if (action === "accept" || action === "reject") {
      // يمكن إظهار رسالة تأكيد أو تحديث قاعدة البيانات
    }
  };

  const handleEditAppointment = (notification: any) => {
    console.log("تعديل الموعد:", notification);
    // التوجه لصفحة الحجوزات مع معلومات الموعد
    navigate("/clinic_old/reservations", { state: { editNotification: notification } });
  };

  const handleClinicChange = (clinic: Clinic) => {
    setSelectedClinic(clinic);
    setIsClinicDropdownOpen(false);
    // Update URL query parameter without reloading the page
    setSearchParams({ clinicId: clinic.id });
  };

  const navigationItems = [
    {
      id: "overview",
      label: "لوحة التحكم",
      icon: Home,
      path: "/clinic_old",
      description: "نظرة عامة",
    },
    {
      id: "reservations",
      label: "الحجوزات",
      icon: Calendar,
      path: "/clinic_old/reservations",
      description: "إدارة المواعيد",
    },
    {
      id: "patients",
      label: "المرضى",
      icon: Users,
      path: "/clinic_old/patients",
      description: "ملفات المرضى",
    },
    {
      id: "treatments",
      label: "العلاجات",
      icon: Stethoscope,
      path: "/clinic_old/treatments",
      description: "خطط العلاج",
    },
    {
      id: "staff",
      label: "الطاقم",
      icon: User,
      path: "/clinic_old/staff",
      description: "إدارة الموظفين",
    },
    {
      id: "accounts",
      label: "الحسابات",
      icon: DollarSign,
      path: "/clinic_old/accounts",
      description: "الشؤون المالية",
    },
    {
      id: "sales",
      label: "المبيعات",
      icon: TrendingUp,
      path: "/clinic_old/sales",
      description: "تقارير المبيعات",
    },
    {
      id: "purchases",
      label: "المشتريات",
      icon: ShoppingCart,
      path: "/clinic_old/purchases",
      description: "طلبات الشراء",
    },
    {
      id: "inventory",
      label: "المخزون",
      icon: Package,
      path: "/clinic_old/stocks",
      description: "إدارة المخزون",
    },
    {
      id: "equipment",
      label: "الأجهزة",
      icon: Settings,
      path: "/clinic_old/peripherals",
      description: "المعدات الطبية",
    },
    {
      id: "reports",
      label: "التقارير",
      icon: BarChart3,
      path: "/clinic_old/reports",
      description: "تقارير شاملة",
    },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "confirmed":
        return "bg-green-100 text-green-800";
      case "in_progress":
        return "bg-blue-100 text-blue-800";
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "cancelled":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "confirmed":
        return "مؤكد";
      case "in_progress":
        return "جاري";
      case "pending":
        return "معلق";
      case "cancelled":
        return "ملغ��";
      default:
        return "غير محدد";
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("ar-IQ", {
      style: "currency",
      currency: "IQD",
      minimumFractionDigits: 0,
    }).format(amount);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center" dir="rtl">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">جاري تحميل بيانات العيادة...</p>
        </div>
      </div>
    );
  }

  if (!selectedClinic) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center" dir="rtl">
        <div className="text-center">
          <p className="text-gray-600">لا توجد عيادات متاحة</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-20" dir="rtl">
      {/* Header with Navigation - Sticky */}
      <div className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-gray-200 shadow-sm">
        {/* Header */}
        <div className="px-4 py-6">
          <div className="max-w-7xl mx-auto">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
                  <Building2 className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">
                    {selectedClinic.nameAr}
                  </h1>
                  <p className="text-gray-600">{selectedClinic.doctorName}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                {/* Clinic Selector */}
                <div className="relative z-50">
                  <button
                    onClick={() => setIsClinicDropdownOpen(!isClinicDropdownOpen)}
                    className="flex items-center gap-2 px-3 py-2 bg-gray-50 border border-gray-300 rounded-lg hover:bg-gray-100 transition-colors"
                  >
                    <Building2 className="w-4 h-4 text-blue-600" />
                    <div className="flex-1 text-right">
                      <div className="text-sm font-medium text-gray-900">{selectedClinic.nameAr}</div>
                      <div className="text-xs text-gray-500">{selectedClinic.city}</div>
                    </div>
                    <ChevronDown className={cn("w-4 h-4 text-gray-600 transition-transform", isClinicDropdownOpen && "rotate-180")} />
                  </button>
                  
                  {isClinicDropdownOpen && (
                    <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-200 rounded-xl shadow-lg z-[100] overflow-hidden min-w-[280px]">
                      {clinics.map((clinic) => (
                        <button
                          key={clinic.id}
                          onClick={() => handleClinicChange(clinic)}
                          className={cn(
                            "w-full px-4 py-3 text-right hover:bg-gray-50 transition-colors",
                            selectedClinic.id === clinic.id && "bg-blue-50"
                          )}
                        >
                          <div className="text-sm font-medium text-gray-900">{clinic.nameAr}</div>
                          <div className="text-xs text-gray-500">{clinic.city}</div>
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                <Button 
                  size="sm" 
                  variant="outline"
                  onClick={() => navigate("/clinic_old/peripherals")}
                >
                  <Settings className="w-4 h-4 ml-1" />
                  الإعدادات
                </Button>
                <Button 
                  size="sm"
                  onClick={() => navigate("/clinic_old/patients")}
                >
                  <Plus className="w-4 h-4 ml-1" />
                  مريض جديد
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <div className="px-4 py-2">
          <div className="max-w-7xl mx-auto">
            <div className="flex overflow-x-auto scrollbar-none gap-1">
              {navigationItems.map((item) => {
                const Icon = item.icon;
                const isActive = activeTab === item.id;
                return (
                  <Link
                    key={item.id}
                    to={item.path}
                    onClick={() => setActiveTab(item.id)}
                    className={cn(
                      "flex items-center gap-2 px-4 py-3 text-sm font-medium rounded-lg transition-all whitespace-nowrap",
                      isActive
                        ? "bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-md"
                        : "text-gray-600 hover:bg-gray-100 hover:text-gray-900",
                    )}
                  >
                    <Icon className="w-4 h-4" />
                    {item.label}
                  </Link>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-6">
        {/* Quick Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <div className="bg-white rounded-xl p-4 border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">مواعيد اليوم</p>
                <p className="text-2xl font-bold text-gray-900">
                  {mockClinicData.stats.todayAppointments}
                </p>
              </div>
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                <Calendar className="w-5 h-5 text-blue-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-4 border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">إجمالي المرضى</p>
                <p className="text-2xl font-bold text-gray-900">
                  {mockClinicData.stats.totalPatients}
                </p>
              </div>
              <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                <Users className="w-5 h-5 text-green-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-4 border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">الإيرادات الشهرية</p>
                <p className="text-lg font-bold text-gray-900">
                  {formatCurrency(mockClinicData.stats.monthlyRevenue)}
                </p>
              </div>
              <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                <TrendingUp className="w-5 h-5 text-purple-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-4 border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">العلاجات المعلقة</p>
                <p className="text-2xl font-bold text-gray-900">
                  {mockClinicData.stats.pendingTreatments}
                </p>
              </div>
              <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
                <Stethoscope className="w-5 h-5 text-orange-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Appointment Actions */}
        <div className="bg-white rounded-xl p-4 border border-gray-200 mb-6">
          <div className="flex flex-wrap items-center gap-3 justify-center">
            <button
              onClick={() => setIsCalendarOpen(true)}
              className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-xl hover:shadow-lg transition-all"
            >
              <CalendarDays className="w-5 h-5" />
              <span className="font-medium">عرض المواعيد</span>
            </button>

            <button
              onClick={() => setIsNewAppointmentModalOpen(true)}
              className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-blue-600 to-cyan-600 text-white rounded-xl hover:shadow-lg transition-all"
            >
              <Plus className="w-5 h-5" />
              <span className="font-medium">موعد جديد</span>
            </button>
          </div>
        </div>

        {/* Booking Requests - Compact and Centered */}
        <div className="bg-white rounded-xl p-4 border border-gray-200 mb-6">
          <h3 className="text-base font-semibold text-gray-900 mb-3 text-center">طلبات الحجز الجديدة</h3>
          <div className="max-w-3xl mx-auto">
            <BookingNotifications 
              clinicId="CL-BAGHDAD-001"
              onNotificationAction={handleNotificationAction}
              onEditAppointment={handleEditAppointment}
              compact={true}
              hideHeader={true}
              maxItems={5}
            />
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-xl p-5 border border-gray-200 mb-8">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            إجراءات سريعة
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 place-items-center">
            {[
              {
                icon: Calendar,
                label: "حجز موعد",
                href: "/clinic_old/reservations",
                color: "blue",
              },
              {
                icon: UserPlus,
                label: "مريض جديد",
                href: "/clinic_old/patients",
                color: "green",
              },
              {
                icon: Stethoscope,
                label: "بدء علاج",
                href: "/clinic_old/treatments",
                color: "purple",
              },
              {
                icon: FileText,
                label: "تقرير جديد",
                href: "/clinic_old/reports",
                color: "orange",
              },
              {
                icon: Package,
                label: "طلب مخزون",
                href: "/clinic_old/stocks",
                color: "cyan",
              },
              {
                icon: CreditCard,
                label: "دفعة جديدة",
                href: "/clinic_old/accounts",
                color: "indigo",
              },
            ].map((action, index) => {
              const Icon = action.icon;
              return (
                <Link
                  key={index}
                  to={action.href}
                  className={cn(
                    "flex flex-col items-center gap-1.5 p-3 rounded-lg border transition-all hover:shadow-md w-full max-w-[140px]",
                    `border-${action.color}-200 hover:border-${action.color}-300 bg-${action.color}-50 hover:bg-${action.color}-100`,
                  )}
                >
                  <Icon className={`w-6 h-6 text-${action.color}-600`} />
                  <span
                    className={`text-sm font-medium text-${action.color}-700`}
                  >
                    {action.label}
                  </span>
                </Link>
              );
            })}
          </div>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-2 gap-4 lg:gap-8">
          {/* Today's Appointments */}
          <div className="bg-white rounded-xl p-4 border border-gray-200">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">
                مواعيد اليوم
              </h3>
              <Link
                to="/clinic_old/reservations"
                className="text-blue-600 hover:text-blue-700 font-medium text-sm"
              >
                عرض الكل
              </Link>
            </div>
            <div className="space-y-4">
              {mockAppointments.map((appointment) => (
                <div
                  key={appointment.id}
                  className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
                >
                  <div className="flex items-center gap-4">
                    <div className="text-center">
                      <div className="text-lg font-bold text-gray-900">
                        {appointment.time}
                      </div>
                    </div>
                    <div>
                      <div className="font-medium text-gray-900">
                        {appointment.patientName}
                      </div>
                      <div className="text-sm text-gray-600">
                        {appointment.treatment}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge
                      className={cn(
                        "text-xs",
                        getStatusColor(appointment.status),
                      )}
                    >
                      {getStatusText(appointment.status)}
                    </Badge>
                    <Button size="sm" variant="ghost">
                      <Phone className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Recent Activity */}
          <div className="bg-white rounded-xl p-4 border border-gray-200">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">
                النشاطات الأخيرة
              </h3>
              <Link
                to="/clinic_old/reports"
                className="text-blue-600 hover:text-blue-700 font-medium text-sm"
              >
                عرض التقارير
              </Link>
            </div>
            <div className="space-y-4">
              {[
                {
                  action: "تم إكمال علاج",
                  details: "تنظيف أسنان - سارة أحمد",
                  time: "منذ 30 دقيقة",
                  icon: CheckCircle,
                  color: "green",
                },
                {
                  action: "حجز موعد جديد",
                  details: "فحص دوري - محمد علي",
                  time: "منذ ساعة",
                  icon: Calendar,
                  color: "blue",
                },
                {
                  action: "دفعة مستلمة",
                  details: "IQD 150,000 - فاطمة حسن",
                  time: "منذ ساعتين",
                  icon: CreditCard,
                  color: "purple",
                },
                {
                  action: "طلب مخزون",
                  details: "مواد حشو - كمية 10",
                  time: "أمس",
                  icon: Package,
                  color: "orange",
                },
              ].map((activity, index) => {
                const Icon = activity.icon;
                return (
                  <div key={index} className="flex items-center gap-4">
                    <div
                      className={`w-8 h-8 bg-${activity.color}-100 rounded-lg flex items-center justify-center`}
                    >
                      <Icon className={`w-4 h-4 text-${activity.color}-600`} />
                    </div>
                    <div className="flex-1">
                      <div className="font-medium text-gray-900">
                        {activity.action}
                      </div>
                      <div className="text-sm text-gray-600">
                        {activity.details}
                      </div>
                    </div>
                    <div className="text-xs text-gray-500">{activity.time}</div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Interactive Calendar Modal */}
      <InteractiveCalendar
        isOpen={isCalendarOpen}
        onClose={() => setIsCalendarOpen(false)}
        appointments={mockAppointments}
        onAddAppointment={(date) => {
          setIsCalendarOpen(false);
          setIsNewAppointmentModalOpen(true);
        }}
      />

      {/* New Appointment Modal */}
      <ModernMedicalCheckupModal
        isOpen={isNewAppointmentModalOpen}
        onClose={() => setIsNewAppointmentModalOpen(false)}
        onSave={(data) => {
          console.log("New appointment:", data);
          setIsNewAppointmentModalOpen(false);
        }}
      />
    </div>
  );
}
