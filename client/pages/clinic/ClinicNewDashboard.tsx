import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Calendar, Users, Stethoscope, TrendingUp, Clock, Bell, MessageSquare, Plus, ChevronRight, Activity, Package, AlertTriangle, CheckCircle, Eye, Settings, Phone, Search, Filter, MoreHorizontal, Building2, ChevronDown, FlaskConical, Timer, RotateCcw, Send, FileText, User, UserPlus, Crown, ClipboardList, Target, ArrowRight, Star, Zap, CreditCard, Truck, BarChart3, Home, ShoppingCart, DollarSign, PieChart, Headphones, Wrench, Pill } from "lucide-react";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import ClinicSubNav from "@/components/ClinicSubNav";
import { sharedClinicData, type Appointment, type Patient } from "@/services/sharedClinicData";
import { notificationsService } from "@/services/notificationsService";
import { initializeClinicNotifications } from "@/services/mockClinicNotifications";

// Mock clinic data - will be shared with clinic_old
const mockClinicData = {
  stats: {
    todayAppointments: 12,
    pendingAppointments: 5,
    completedToday: 7,
    totalPatients: 342,
    monthlyRevenue: 15750000,
    // IQD
    activeStaff: 8,
    lowStock: 3,
    upcomingReminders: 4
  },
  notifications: [{
    id: "1",
    type: "appointment",
    title: "موعد جديد",
    message: "المريض أحمد محم�� حجز موعداً الساعة 3:00 مساءً",
    time: "منذ 5 دقائق",
    priority: "high"
  }, {
    id: "2",
    type: "payment",
    title: "دفعة مستلمة",
    message: "تم استلام دفعة 250,000 د.ع من المريضة فاطمة علي",
    time: "منذ 15 دقيقة",
    priority: "medium"
  }],
  recentPatients: [{
    id: "1",
    name: "أحمد محمد الطائي",
    lastVisit: "2024-01-15",
    treatment: "تنظيف الأسنان",
    status: "completed",
    phone: "+964 770 123 4567"
  }, {
    id: "2",
    name: "فاطمة علي السعد",
    lastVisit: "2024-01-14",
    treatment: "حشوة ضرس",
    status: "in_progress",
    phone: "+964 750 987 6543"
  }]
};

// Clinic management sections for new mobile-optimized design
const clinicSections = [{
  id: "patients",
  title: "المرضى",
  description: "إدارة ملفات المرضى والتاريخ الطبي",
  icon: Users,
  color: "blue",
  count: mockClinicData.stats.totalPatients,
  path: "/clinic/patients",
  badge: "جديد"
}, {
  id: "reservations",
  title: "الحجوزات",
  description: "جدولة المواعيد وإدارة الحجوزات",
  icon: Calendar,
  color: "green",
  count: mockClinicData.stats.todayAppointments,
  path: "/clinic/reservations",
  badge: mockClinicData.stats.pendingAppointments > 0 ? `${mockClinicData.stats.pendingAppointments} معلقة` : null
}, {
  id: "treatments",
  title: "العلاجات",
  description: "خطط العلاج والإجراءات الطبية",
  icon: Stethoscope,
  color: "purple",
  count: 45,
  path: "/clinic/treatments"
}, {
  id: "staff",
  title: "الموظفي��",
  description: "إدارة فريق العمل والصلاحيات",
  icon: UserPlus,
  color: "indigo",
  count: mockClinicData.stats.activeStaff,
  path: "/clinic/staff"
}, {
  id: "accounts",
  title: "الحسابات",
  description: "الفواتير والمد��وعات والتقارير المالية",
  icon: CreditCard,
  color: "emerald",
  count: "15.7M د.ع",
  path: "/clinic/accounts"
}, {
  id: "sales",
  title: "المبيعات",
  description: "مبيعات الأدوية والمواد الطبية",
  icon: ShoppingCart,
  color: "orange",
  count: 23,
  path: "/clinic/sales"
}, {
  id: "purchases",
  title: "المشتريات",
  description: "طلبات المواد والأدوية من الموردين",
  icon: Truck,
  color: "cyan",
  count: 8,
  path: "/clinic/purchases"
}, {
  id: "stocks",
  title: "المخزون",
  description: "إدارة مخزون الأدوية والمواد الطبية",
  icon: Package,
  color: "amber",
  count: mockClinicData.stats.lowStock,
  path: "/clinic/stocks",
  badge: mockClinicData.stats.lowStock > 0 ? "نفاد قريب" : null
}, {
  id: "peripherals",
  title: "الأجهزة",
  description: "صيانة وإدارة الأجهزة الطبية",
  icon: Wrench,
  color: "slate",
  count: 12,
  path: "/clinic/peripherals"
}, {
  id: "reports",
  title: "التقارير",
  description: "تقارير شاملة عن أ��اء العيادة",
  icon: BarChart3,
  color: "rose",
  count: "تحديث يومي",
  path: "/clinic/reports"
}, {
  id: "lab",
  title: "المختبر",
  description: "إدارة طلبات المختبر والتركيبات",
  icon: Pill,
  color: "violet",
  count: 8,
  path: "/clinic/lab",
  badge: "طلبات جديدة"
}];
const ClinicNewDashboard: React.FC = () => {
  const navigate = useNavigate();
  const [selectedPeriod, setSelectedPeriod] = useState("today");
  const [showNotifications, setShowNotifications] = useState(false);
  const [patients, setPatients] = useState<Patient[]>([]);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [clinicOptions, setClinicOptions] = useState<{
    id: string;
    name: string;
  }[]>([]);
  const [activeClinicId, setActiveClinicId] = useState<string | null>(null);
  const [notificationStats, setNotificationStats] = useState({ unreadNotifications: 0, unreadMessages: 0, upcomingReminders: 0 });
  useEffect(() => {
    let mounted = true;
    const load = async () => {
      try {
        const [pts, appts] = await Promise.all([sharedClinicData.getPatients(), sharedClinicData.getAppointments()]);
        if (mounted) {
          setPatients(pts);
          setAppointments(appts);
        }
      } catch (e) {
        // ignore
      }
    };
    load();
    return () => {
      mounted = false;
    };
  }, []);
  useEffect(() => {
    try {
      const cached = localStorage.getItem("clinics_cache");
      const list = cached ? JSON.parse(cached) as {
        id: string;
        name: string;
      }[] : [];
      setClinicOptions(list);
      const stored = localStorage.getItem("active_clinic_id");
      setActiveClinicId(stored && list.find(c => c.id === stored) ? stored : list[0]?.id || null);
    } catch {
      setClinicOptions([]);
      setActiveClinicId(null);
    }
  }, []);

  // تحميل إحصائيات الإشعارات من الخدمة المشتركة
  useEffect(() => {
    // تهيئة البيانات الوهمية عند أول تحميل
    initializeClinicNotifications();
    
    const updateStats = () => {
      const stats = notificationsService.getStats('clinic');
      setNotificationStats(stats);
    };
    
    updateStats();
    const unsubscribe = notificationsService.subscribe(updateStats);
    
    return () => {
      unsubscribe();
    };
  }, []);
  const upcomingAppointments = appointments.filter(a => {
    const dateTime = new Date(`${a.date}T${(a as any).time || "00:00"}`);
    return dateTime >= new Date() && (a.status === "scheduled" || a.status === "confirmed");
  }).sort((a, b) => {
    const da = new Date(`${a.date}T${(a as any).time || "00:00"}`).getTime();
    const db = new Date(`${b.date}T${(b as any).time || "00:00"}`).getTime();
    return da - db;
  }).slice(0, 5);
  const recentNotes = patients.filter(p => p.notes && p.notes.trim().length > 0).map(p => ({
    patientName: p.name,
    note: p.notes,
    lastVisit: p.lastVisit
  })).sort((a, b) => new Date(b.lastVisit).getTime() - new Date(a.lastVisit).getTime()).slice(0, 5);
  const getColorClasses = (color: string) => {
    const colorMap: Record<string, string> = {
      blue: "bg-blue-500 text-white",
      green: "bg-green-500 text-white",
      purple: "bg-purple-500 text-white",
      indigo: "bg-indigo-500 text-white",
      emerald: "bg-emerald-500 text-white",
      orange: "bg-orange-500 text-white",
      cyan: "bg-cyan-500 text-white",
      amber: "bg-amber-500 text-white",
      slate: "bg-slate-500 text-white",
      rose: "bg-rose-500 text-white"
    };
    return colorMap[color] || "bg-gray-500 text-white";
  };
  const getBgColorClasses = (color: string) => {
    const colorMap: Record<string, string> = {
      blue: "bg-blue-50 border-blue-200",
      green: "bg-green-50 border-green-200",
      purple: "bg-purple-50 border-purple-200",
      indigo: "bg-indigo-50 border-indigo-200",
      emerald: "bg-emerald-50 border-emerald-200",
      orange: "bg-orange-50 border-orange-200",
      cyan: "bg-cyan-50 border-cyan-200",
      amber: "bg-amber-50 border-amber-200",
      slate: "bg-slate-50 border-slate-200",
      rose: "bg-rose-50 border-rose-200"
    };
    return colorMap[color] || "bg-gray-50 border-gray-200";
  };
  return <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center">
                <Building2 className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">
                  لوحة إدارة العيادة
                </h1>
                
              </div>
            </div>

            <div className="flex items-center gap-3">
              {clinicOptions.length > 0 && <div className="hidden md:flex items-center gap-2">
                  <label className="text-xs text-gray-500">العيادة</label>
                  <select value={activeClinicId || ""} onChange={e => {
                const val = e.target.value || null;
                setActiveClinicId(val);
                if (val) {
                  localStorage.setItem("active_clinic_id", val);
                  const chosen = clinicOptions.find(c => c.id === val);
                  if (chosen) localStorage.setItem("active_clinic_name", chosen.name);
                }
              }} className="px-2 py-1 rounded-lg border text-sm">
                    {clinicOptions.map(c => <option key={c.id} value={c.id}>
                        {c.name}
                      </option>)}
                  </select>
                </div>}

              <button onClick={() => navigate('/dentist-hub/messages')} className="relative p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors" title="الرسائل">
                <MessageSquare className="w-5 h-5" />
                {notificationStats.unreadMessages > 0 && <span className="absolute -top-1 -right-1 bg-purple-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                    {notificationStats.unreadMessages}
                  </span>}
              </button>

              <button onClick={() => navigate('/dentist-hub/notifications')} className="relative p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors" title="الإشعارات">
                <Bell className="w-5 h-5" />
                {(notificationStats.unreadNotifications + notificationStats.upcomingReminders) > 0 && <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                    {notificationStats.unreadNotifications + notificationStats.upcomingReminders}
                  </span>}
              </button>

              <Link to="/clinic_old" className="text-sm bg-gray-100 hover:bg-gray-200 text-gray-700 px-3 py-2 rounded-lg transition-colors">النظام القديم</Link>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-6">
        <ClinicSubNav />
        {/* Quick Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center">
                <Calendar className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">
                  {mockClinicData.stats.todayAppointments}
                </p>
                <p className="text-sm text-gray-600">مواعيد اليوم</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-green-500 rounded-lg flex items-center justify-center">
                <Users className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">
                  {mockClinicData.stats.totalPatients}
                </p>
                <p className="text-sm text-gray-600">إجمالي المرضى</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-emerald-500 rounded-lg flex items-center justify-center">
                <DollarSign className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="text-lg font-bold text-gray-900">15.7M</p>
                <p className="text-sm text-gray-600">إيرادات الشهر</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-orange-500 rounded-lg flex items-center justify-center">
                <Package className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">
                  {mockClinicData.stats.lowStock}
                </p>
                <p className="text-sm text-gray-600">نفاد قريب</p>
              </div>
            </div>
          </div>
        </div>

        {/* Management Sections Grid */}
        

        {/* Recent Activity & Notifications */}
        <div className="grid md:grid-cols-2 gap-6">
          {/* Recent Patients */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-gray-900">
                المرضى الحديثون
              </h3>
              <Link to="/clinic_old/patients" className="text-blue-600 hover:text-blue-700 text-sm font-medium">
                عرض الكل
              </Link>
            </div>

            <div className="space-y-3">
              {mockClinicData.recentPatients.map(patient => <div key={patient.id} className="flex items-center gap-3 p-3 hover:bg-gray-50 rounded-lg transition-colors">
                  <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                    <User className="w-5 h-5 text-blue-600" />
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-gray-900">{patient.name}</p>
                    <p className="text-sm text-gray-600">{patient.treatment}</p>
                  </div>
                  <div className="text-left">
                    <Badge variant={patient.status === "completed" ? "default" : "secondary"} className="text-xs">
                      {patient.status === "completed" ? "مكتمل" : "قيد العلاج"}
                    </Badge>
                  </div>
                </div>)}
            </div>
          </div>

          {/* Notifications */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-gray-900">الإشعارات والتذكيرات</h3>
              <Button variant="ghost" size="sm" onClick={() => navigate('/dentist-hub/notifications')}>
                مشاهدة الكل
              </Button>
            </div>

            <div className="space-y-3">
              {notificationsService.getNotifications('clinic').slice(0, 3).length === 0 ? (
                <p className="text-sm text-gray-600 text-center py-4">لا توجد إشعارات جديدة</p>
              ) : (
                notificationsService.getNotifications('clinic').slice(0, 3).map(notification => (
                  <div key={notification.id} className="flex items-start gap-3 p-3 hover:bg-gray-50 rounded-lg transition-colors cursor-pointer" onClick={() => {
                    notificationsService.markNotificationAsRead(notification.id);
                    if (notification.actionUrl) {
                      navigate(notification.actionUrl);
                    }
                  }}>
                    <div className={cn("w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0", 
                      notification.priority === "urgent" ? "bg-red-100" : 
                      notification.priority === "high" ? "bg-orange-100" : "bg-blue-100"
                    )}>
                      {notification.category === "appointment" ? (
                        <Calendar className={cn("w-4 h-4", 
                          notification.priority === "urgent" ? "text-red-600" : 
                          notification.priority === "high" ? "text-orange-600" : "text-blue-600"
                        )} />
                      ) : notification.category === "financial" ? (
                        <CreditCard className={cn("w-4 h-4", 
                          notification.priority === "urgent" ? "text-red-600" : 
                          notification.priority === "high" ? "text-orange-600" : "text-blue-600"
                        )} />
                      ) : (
                        <Bell className={cn("w-4 h-4", 
                          notification.priority === "urgent" ? "text-red-600" : 
                          notification.priority === "high" ? "text-orange-600" : "text-blue-600"
                        )} />
                      )}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-start justify-between">
                        <p className={cn("font-medium text-sm", notification.read ? "text-gray-600" : "text-gray-900")}>
                          {notification.title}
                        </p>
                        {!notification.read && <span className="w-2 h-2 bg-blue-500 rounded-full"></span>}
                      </div>
                      <p className="text-sm text-gray-600 line-clamp-1">
                        {notification.message}
                      </p>
                      <p className="text-xs text-gray-500 mt-1">
                        {new Date(notification.timestamp).toLocaleDateString('ar-IQ', { hour: '2-digit', minute: '2-digit' })}
                      </p>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Upcoming Appointments & Notes */}
        <div className="grid md:grid-cols-2 gap-6 mt-8">
          {/* Upcoming Appointments */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-gray-900">
                المواعيد القادمة
              </h3>
              <Link to="/clinic/reservations" className="text-blue-600 hover:text-blue-700 text-sm font-medium">
                عرض الكل
              </Link>
            </div>
            {upcomingAppointments.length === 0 ? <p className="text-sm text-gray-600">لا توجد مواعيد قادمة</p> : <div className="space-y-3">
                {upcomingAppointments.map(appt => <div key={appt.id} className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg transition-colors">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                        <Calendar className="w-5 h-5 text-blue-600" />
                      </div>
                      <div>
                        <p className="font-medium text-gray-900 text-sm">
                          {appt.patientName}
                        </p>
                        <p className="text-xs text-gray-600">
                          {appt.treatment}
                        </p>
                      </div>
                    </div>
                    <div className="text-left text-xs text-gray-600">
                      <div>{appt.date}</div>
                      {(appt as any).time && <div className="text-gray-500">
                          {(appt as any).time}
                        </div>}
                    </div>
                  </div>)}
              </div>}
          </div>

          {/* Notes */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-gray-900">الملاحظات</h3>
              <button className="text-sm text-gray-600 hover:text-gray-900 font-medium">
                إدارة الملاحظات
              </button>
            </div>
            {recentNotes.length === 0 ? <p className="text-sm text-gray-600">لا توجد ملا��ظات بعد</p> : <div className="space-y-3">
                {recentNotes.map((n, idx) => <div key={idx} className="p-3 hover:bg-gray-50 rounded-lg transition-colors">
                    <div className="flex items-center justify-between mb-1">
                      <p className="font-medium text-gray-900 text-sm">
                        {n.patientName}
                      </p>
                      <span className="text-xs text-gray-500">
                        آخر زيارة: {n.lastVisit}
                      </span>
                    </div>
                    <p className="text-xs text-gray-700 line-clamp-2">
                      {n.note}
                    </p>
                  </div>)}
              </div>}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="mt-8 bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h3 className="text-lg font-bold text-gray-900 mb-4">
            إجراءات سريعة
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Button className="h-auto p-4 flex-col gap-2" onClick={() => navigate("/clinic/reservations")}>
              <Plus className="w-5 h-5" />
              موعد جديد
            </Button>

            <Button variant="outline" className="h-auto p-4 flex-col gap-2" onClick={() => navigate("/clinic_old/patients")}>
              <UserPlus className="w-5 h-5" />
              مريض جديد
            </Button>

            <Button variant="outline" className="h-auto p-4 flex-col gap-2" onClick={() => navigate("/clinic/treatments")}>
              <Stethoscope className="w-5 h-5" />
              خطة علاج
            </Button>

            <Button variant="outline" className="h-auto p-4 flex-col gap-2" onClick={() => navigate("/clinic/reports")}>
              <BarChart3 className="w-5 h-5" />
              تقرير
            </Button>
          </div>
        </div>
      </div>

    </div>;
};
export default ClinicNewDashboard;