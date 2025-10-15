import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
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
  Crown,
  ClipboardList,
  Target,
  ArrowRight,
  Star,
  Zap,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  NewLabOrderModal,
  NewReminderModal,
} from "@/components/LabOrderModals";
import { dentalHubSync } from "@/services/dentalHubSync";
import { patientDentalService } from "@/services/patientDentalService";

// Types for Dental Lab system
interface LabOrder {
  id: string;
  patient: {
    id: string;
    name: string;
    phone: string;
  };
  treatment: string;
  tooth: string;
  labName: string;
  status: "pending" | "in_progress" | "ready" | "delivered" | "revision";
  priority: "low" | "medium" | "high" | "urgent";
  submittedDate: string;
  expectedDate: string;
  deliveredDate?: string;
  notes: string;
  cost: number;
  reminderDate?: string;
  reminderNote?: string;
}

interface LabReminder {
  id: string;
  orderId: string;
  patient: string;
  lab: string;
  message: string;
  scheduledFor: string;
  completed: boolean;
  type: "call" | "visit" | "check" | "followup";
}

interface DashboardStats {
  todayAppointments: number;
  totalPatients: number;
  monthlyRevenue: number;
  activeLabOrders: number;
  pendingLabOrders: number;
  overdueLabOrders: number;
  todayReminders: number;
}

const mockStats: DashboardStats = {
  todayAppointments: 12,
  totalPatients: 245,
  monthlyRevenue: 45000,
  activeLabOrders: 8,
  pendingLabOrders: 5,
  overdueLabOrders: 2,
  todayReminders: 3,
};

const mockLabOrders: LabOrder[] = [
  {
    id: "LAB001",
    patient: { id: "P001", name: "أحمد محمد علي", phone: "07701234567" },
    treatment: "تاج أسنان",
    tooth: "رقم 14",
    labName: "مختبر النخبة للأسنان",
    status: "pending",
    priority: "high",
    submittedDate: "2024-01-15",
    expectedDate: "2024-01-20",
    notes: "لون A2, مع تطابق اللثة",
    cost: 250,
    reminderDate: "2024-01-18",
    reminderNote: "الاتصال للتأكد من التقدم",
  },
  {
    id: "LAB002",
    patient: { id: "P002", name: "فاطمة أحمد", phone: "07709876543" },
    treatment: "طقم أسنان جزئي",
    tooth: "الأسنان العلوية اليمنى",
    labName: "مختبر الدقة",
    status: "in_progress",
    priority: "medium",
    submittedDate: "2024-01-10",
    expectedDate: "2024-01-22",
    notes: "مع أسنان اكريليك عالية الجودة",
    cost: 400,
  },
  {
    id: "LAB003",
    patient: { id: "P003", name: "محمد سالم", phone: "07701111222" },
    treatment: "جسر أسنان",
    tooth: "من 12 إلى 14",
    labName: "مختبر التميز",
    status: "ready",
    priority: "medium",
    submittedDate: "2024-01-05",
    expectedDate: "2024-01-15",
    deliveredDate: "2024-01-16",
    notes: "جاهز للتركيب",
    cost: 600,
  },
  {
    id: "LAB004",
    patient: { id: "P004", name: "سارة حسن", phone: "07703333444" },
    treatment: "تركيبة متحركة",
    tooth: "الفك السفلي كامل",
    labName: "مختبر الإبداع",
    status: "revision",
    priority: "urgent",
    submittedDate: "2024-01-08",
    expectedDate: "2024-01-18",
    notes: "يحتاج تعديل في اللون",
    cost: 500,
  },
];

const mockReminders: LabReminder[] = [
  {
    id: "R001",
    orderId: "LAB001",
    patient: "أحمد محمد علي",
    lab: "مختبر النخبة للأسنان",
    message: "الاتصال للتأكد من حالة التاج",
    scheduledFor: "2024-01-18 10:00",
    completed: false,
    type: "call",
  },
  {
    id: "R002",
    orderId: "LAB004",
    patient: "سارة حسن",
    lab: "مختبر الإبداع",
    message: "متابعة التعديل المطلوب على التركيبة",
    scheduledFor: "2024-01-18 14:00",
    completed: false,
    type: "followup",
  },
];

export default function EnhancedClinicDashboard() {
  const [activeTab, setActiveTab] = useState<
    "overview" | "labs" | "patients" | "appointments"
  >("overview");
  const [selectedLabFilter, setSelectedLabFilter] = useState<
    "all" | "pending" | "in_progress" | "ready" | "revision"
  >("all");
  const [showNewLabOrder, setShowNewLabOrder] = useState(false);
  const [showNewReminder, setShowNewReminder] = useState(false);
  const navigate = useNavigate();

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "in_progress":
        return "bg-blue-100 text-blue-800";
      case "ready":
        return "bg-green-100 text-green-800";
      case "delivered":
        return "bg-gray-100 text-gray-800";
      case "revision":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "urgent":
        return "bg-red-500";
      case "high":
        return "bg-orange-500";
      case "medium":
        return "bg-yellow-500";
      case "low":
        return "bg-green-500";
      default:
        return "bg-gray-500";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "pending":
        return <Timer className="w-4 h-4" />;
      case "in_progress":
        return <Activity className="w-4 h-4" />;
      case "ready":
        return <CheckCircle className="w-4 h-4" />;
      case "delivered":
        return <Package className="w-4 h-4" />;
      case "revision":
        return <RotateCcw className="w-4 h-4" />;
      default:
        return <Clock className="w-4 h-4" />;
    }
  };

  const filteredLabOrders =
    selectedLabFilter === "all"
      ? mockLabOrders
      : mockLabOrders.filter((order) => order.status === selectedLabFilter);

  return (
    <div className="min-h-screen bg-gray-50 p-2 lg:p-6 pb-20" dir="rtl">
      <div className="max-w-7xl mx-auto space-y-4 lg:space-y-6">
        {/* Mobile-First Header - Compact */}
        <div className="bg-white rounded-xl lg:rounded-2xl p-3 lg:p-4 shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-lg lg:text-xl font-bold text-gray-900">
                لوحة التحكم
              </h1>
              <p className="text-xs lg:text-sm text-gray-600">
                إدارة العيادة والمختبرات
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Button size="sm" className="hidden lg:flex">
                <Plus className="w-4 h-4 ml-1" />
                إضافة
              </Button>
              <Button size="sm" variant="outline" className="lg:hidden">
                <Plus className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>

        {/* Navigation Tabs - Mobile Optimized */}
        <div className="bg-white rounded-xl lg:rounded-2xl p-1 shadow-sm border border-gray-200">
          <div className="flex overflow-x-auto">
            {[
              { id: "overview", label: "النظرة العامة", icon: Activity },
              { id: "labs", label: "المختبرات", icon: FlaskConical },
              { id: "patients", label: "المرضى", icon: Users },
              { id: "appointments", label: "المواعيد", icon: Calendar },
            ].map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={cn(
                    "flex items-center gap-2 px-3 lg:px-4 py-2 lg:py-3 rounded-lg lg:rounded-xl text-sm lg:text-base font-medium transition-all whitespace-nowrap",
                    activeTab === tab.id
                      ? "bg-blue-50 text-blue-600 shadow-sm"
                      : "text-gray-600 hover:text-gray-900 hover:bg-gray-50",
                  )}
                >
                  <Icon className="w-4 h-4" />
                  <span className="hidden sm:inline">{tab.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Quick Stats - Mobile Horizontal Scroll */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 lg:gap-4">
          <div className="bg-white rounded-xl p-3 lg:p-4 shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs lg:text-sm text-gray-600">مواعيد اليوم</p>
                <p className="text-lg lg:text-2xl font-bold text-gray-900">
                  {mockStats.todayAppointments}
                </p>
              </div>
              <div className="w-8 h-8 lg:w-10 lg:h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                <Calendar className="w-4 h-4 lg:w-5 lg:h-5 text-blue-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-3 lg:p-4 shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs lg:text-sm text-gray-600">
                  طلبات المختبر
                </p>
                <p className="text-lg lg:text-2xl font-bold text-gray-900">
                  {mockStats.activeLabOrders}
                </p>
              </div>
              <div className="w-8 h-8 lg:w-10 lg:h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                <FlaskConical className="w-4 h-4 lg:w-5 lg:h-5 text-purple-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-3 lg:p-4 shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs lg:text-sm text-gray-600">
                  تذكيرات اليوم
                </p>
                <p className="text-lg lg:text-2xl font-bold text-gray-900">
                  {mockStats.todayReminders}
                </p>
              </div>
              <div className="w-8 h-8 lg:w-10 lg:h-10 bg-yellow-100 rounded-lg flex items-center justify-center">
                <Bell className="w-4 h-4 lg:w-5 lg:h-5 text-yellow-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-3 lg:p-4 shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs lg:text-sm text-gray-600">
                  إجمالي المرضى
                </p>
                <p className="text-lg lg:text-2xl font-bold text-gray-900">
                  {mockStats.totalPatients}
                </p>
              </div>
              <div className="w-8 h-8 lg:w-10 lg:h-10 bg-green-100 rounded-lg flex items-center justify-center">
                <Users className="w-4 h-4 lg:w-5 lg:h-5 text-green-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Content Based on Active Tab */}
        {activeTab === "overview" && (
          <div className="space-y-4 lg:space-y-6">
            {/* Lab Orders Overview - Mobile Optimized */}
            <div className="bg-white rounded-xl lg:rounded-2xl p-4 lg:p-6 shadow-sm border border-gray-200">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-base lg:text-lg font-semibold text-gray-900">
                  حالة طلبات المختبر
                </h3>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => setActiveTab("labs")}
                >
                  عرض الكل
                  <ChevronRight className="w-4 h-4 mr-1" />
                </Button>
              </div>

              <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-4">
                <div className="text-center p-3 bg-yellow-50 rounded-lg">
                  <div className="text-lg lg:text-xl font-bold text-yellow-800">
                    {mockStats.pendingLabOrders}
                  </div>
                  <div className="text-xs lg:text-sm text-yellow-600">
                    معلقة
                  </div>
                </div>
                <div className="text-center p-3 bg-blue-50 rounded-lg">
                  <div className="text-lg lg:text-xl font-bold text-blue-800">
                    {mockStats.activeLabOrders - mockStats.pendingLabOrders}
                  </div>
                  <div className="text-xs lg:text-sm text-blue-600">
                    قيد العمل
                  </div>
                </div>
                <div className="text-center p-3 bg-green-50 rounded-lg">
                  <div className="text-lg lg:text-xl font-bold text-green-800">
                    3
                  </div>
                  <div className="text-xs lg:text-sm text-green-600">جاهزة</div>
                </div>
                <div className="text-center p-3 bg-red-50 rounded-lg">
                  <div className="text-lg lg:text-xl font-bold text-red-800">
                    {mockStats.overdueLabOrders}
                  </div>
                  <div className="text-xs lg:text-sm text-red-600">متأخرة</div>
                </div>
              </div>

              {/* Recent Lab Activities - Horizontal Scroll on Mobile */}
              <div className="space-y-3">
                <h4 className="text-sm lg:text-base font-medium text-gray-900">
                  أحدث الأنشطة
                </h4>
                <div className="space-y-2 lg:space-y-3">
                  {mockLabOrders.slice(0, 3).map((order) => (
                    <div
                      key={order.id}
                      className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg"
                    >
                      <div
                        className={cn(
                          "w-2 h-2 rounded-full",
                          getPriorityColor(order.priority),
                        )}
                      ></div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-sm font-medium text-gray-900 truncate">
                            {order.patient.name}
                          </span>
                          <Badge
                            variant="secondary"
                            className={cn(
                              "text-xs",
                              getStatusColor(order.status),
                            )}
                          >
                            {order.status === "pending"
                              ? "معلق"
                              : order.status === "in_progress"
                                ? "قيد العمل"
                                : order.status === "ready"
                                  ? "جاهز"
                                  : order.status === "revision"
                                    ? "مراجعة"
                                    : "مُسلم"}
                          </Badge>
                        </div>
                        <div className="text-xs text-gray-600">
                          {order.treatment} - {order.tooth} | {order.labName}
                        </div>
                      </div>
                      <Button size="sm" variant="ghost">
                        <Eye className="w-4 h-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Active Treatment Steps */}
            <div className="bg-white rounded-xl lg:rounded-2xl p-4 lg:p-6 shadow-sm border border-gray-200">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-base lg:text-lg font-semibold text-gray-900 flex items-center gap-2">
                  <Target className="w-5 h-5 text-purple-600" />
                  تقدم العلاجات النشطة
                </h3>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => navigate("/clinic_old/patients")}
                >
                  عرض الكل
                  <ChevronRight className="w-4 h-4 mr-1" />
                </Button>
              </div>

              <div className="space-y-3">
                {dentalHubSync.getTasksByType("treatment_followup").slice(0, 5).map((task) => (
                  <div
                    key={task.id}
                    className="p-3 bg-gradient-to-r from-purple-50 to-blue-50 rounded-lg border border-purple-100"
                    onClick={() => navigate(`/clinic_old/patients/${task.patientId}`)}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-purple-600 text-white rounded-lg flex items-center justify-center font-bold text-sm">
                          {task.toothNumber || "#"}
                        </div>
                        <span className="font-medium text-gray-900">{task.patientName}</span>
                      </div>
                      <Badge
                        variant="secondary"
                        className={cn(
                          "text-xs",
                          task.completed ? "bg-green-100 text-green-800" : "bg-yellow-100 text-yellow-800"
                        )}
                      >
                        {task.completed ? "مكتمل" : "قيد العمل"}
                      </Badge>
                    </div>
                    <div className="text-sm text-gray-700 mb-2">{task.description}</div>
                    <div className="flex items-center justify-between text-xs text-gray-600">
                      <div className="flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        {new Date(task.dueDate).toLocaleDateString("ar-IQ")}
                      </div>
                      <div className="flex items-center gap-1">
                        <ArrowRight className="w-3 h-3" />
                        عرض التفاصيل
                      </div>
                    </div>
                  </div>
                ))}
                
                {dentalHubSync.getTasksByType("treatment_followup").length === 0 && (
                  <div className="text-center py-8 text-gray-500">
                    <Activity className="w-12 h-12 mx-auto mb-2 text-gray-400" />
                    <p>لا توجد علاجات نشطة حالياً</p>
                  </div>
                )}
              </div>
            </div>

            {/* Today's Reminders */}
            <div className="bg-white rounded-xl lg:rounded-2xl p-4 lg:p-6 shadow-sm border border-gray-200">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-base lg:text-lg font-semibold text-gray-900">
                  تذكيرات اليوم
                </h3>
                <Button size="sm" variant="outline">
                  <Plus className="w-4 h-4 ml-1" />
                  إضافة تذكير
                </Button>
              </div>

              <div className="space-y-3">
                {mockReminders.map((reminder) => (
                  <div
                    key={reminder.id}
                    className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg border border-blue-200"
                  >
                    <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                      <Phone className="w-4 h-4 text-blue-600" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-medium text-gray-900">
                        {reminder.message}
                      </div>
                      <div className="text-xs text-gray-600">
                        {reminder.patient} | {reminder.lab}
                      </div>
                      <div className="text-xs text-blue-600 mt-1">
                        {reminder.scheduledFor}
                      </div>
                    </div>
                    <div className="flex gap-1">
                      <Button
                        size="sm"
                        className="bg-blue-600 hover:bg-blue-700"
                      >
                        <Phone className="w-3 h-3" />
                      </Button>
                      <Button size="sm" variant="outline">
                        <CheckCircle className="w-3 h-3" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === "patients" && (
          <div className="space-y-4 lg:space-y-6">
            {/* Patients Management */}
            <div className="bg-white rounded-xl lg:rounded-2xl p-4 lg:p-6 shadow-sm border border-gray-200">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-base lg:text-lg font-semibold text-gray-900">
                  إدارة المرضى
                </h3>
                <div className="flex gap-2">
                  <Button size="sm" variant="outline">
                    <Search className="w-4 h-4" />
                  </Button>
                  <Button size="sm">
                    <Plus className="w-4 h-4 ml-1" />
                    مريض جديد
                  </Button>
                </div>
              </div>

              {/* Recent Patients */}
              <div className="space-y-3">
                {[
                  {
                    id: "P001",
                    name: "أحمد محمد علي",
                    phone: "07701234567",
                    lastVisit: "2024-01-15",
                    labOrders: 2,
                  },
                  {
                    id: "P002",
                    name: "فاطمة أحمد",
                    phone: "07709876543",
                    lastVisit: "2024-01-10",
                    labOrders: 1,
                  },
                  {
                    id: "P003",
                    name: "محمد سالم",
                    phone: "07701111222",
                    lastVisit: "2024-01-08",
                    labOrders: 1,
                  },
                ].map((patient) => (
                  <div
                    key={patient.id}
                    className="flex items-center gap-4 p-3 lg:p-4 border border-gray-200 rounded-lg hover:shadow-md transition-shadow"
                  >
                    <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                      <User className="w-5 h-5 text-blue-600" />
                    </div>

                    <div className="flex-1">
                      <div className="font-medium text-gray-900">
                        {patient.name}
                      </div>
                      <div className="text-sm text-gray-600">
                        {patient.phone}
                      </div>
                      <div className="text-xs text-gray-500">
                        آخر زيارة: {patient.lastVisit}
                      </div>
                    </div>

                    <div className="text-right">
                      <div className="text-sm text-gray-600">طلبات المختبر</div>
                      <div className="text-lg font-bold text-purple-600">
                        {patient.labOrders}
                      </div>
                    </div>

                    <div className="flex gap-1">
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() =>
                          navigate(`/admin/patients/${patient.id}`)
                        }
                      >
                        <FileText className="w-4 h-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => {
                          setShowNewLabOrder(true);
                          // Pre-select patient if needed
                        }}
                      >
                        <FlaskConical className="w-4 h-4 text-purple-600" />
                      </Button>
                      <Button size="sm" variant="ghost">
                        <Phone className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === "labs" && (
          <div className="space-y-4 lg:space-y-6">
            {/* Lab Orders Management */}
            <div className="bg-white rounded-xl lg:rounded-2xl p-4 lg:p-6 shadow-sm border border-gray-200">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-base lg:text-lg font-semibold text-gray-900">
                  إدارة طلبات المختبر
                </h3>
                <div className="flex gap-2">
                  <Button size="sm" variant="outline">
                    <Search className="w-4 h-4" />
                  </Button>
                  <Button size="sm" onClick={() => setShowNewLabOrder(true)}>
                    <Plus className="w-4 h-4 ml-1" />
                    طلب جديد
                  </Button>
                </div>
              </div>

              {/* Status Filters - Mobile Horizontal Scroll */}
              <div className="flex gap-2 mb-4 overflow-x-auto pb-2">
                {[
                  { id: "all", label: "الكل", count: mockLabOrders.length },
                  {
                    id: "pending",
                    label: "معلقة",
                    count: mockStats.pendingLabOrders,
                  },
                  { id: "in_progress", label: "قيد العمل", count: 3 },
                  { id: "ready", label: "جاهزة", count: 1 },
                  { id: "revision", label: "مراجعة", count: 1 },
                ].map((filter) => (
                  <button
                    key={filter.id}
                    onClick={() => setSelectedLabFilter(filter.id as any)}
                    className={cn(
                      "flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-all whitespace-nowrap",
                      selectedLabFilter === filter.id
                        ? "bg-blue-50 text-blue-600 border border-blue-200"
                        : "bg-gray-50 text-gray-600 hover:bg-gray-100",
                    )}
                  >
                    <span>{filter.label}</span>
                    <Badge variant="secondary" className="text-xs">
                      {filter.count}
                    </Badge>
                  </button>
                ))}
              </div>

              {/* Lab Orders List - Mobile Optimized */}
              <div className="space-y-3">
                {filteredLabOrders.map((order) => (
                  <div
                    key={order.id}
                    className="border border-gray-200 rounded-lg p-3 lg:p-4 hover:shadow-md transition-shadow"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-start gap-3">
                        <div
                          className={cn(
                            "w-2 h-2 rounded-full mt-2",
                            getPriorityColor(order.priority),
                          )}
                        ></div>
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <span className="font-medium text-gray-900">
                              {order.patient.name}
                            </span>
                            <Badge
                              className={cn(
                                "text-xs",
                                getStatusColor(order.status),
                              )}
                            >
                              {getStatusIcon(order.status)}
                              <span className="mr-1">
                                {order.status === "pending"
                                  ? "معلق"
                                  : order.status === "in_progress"
                                    ? "قيد العمل"
                                    : order.status === "ready"
                                      ? "جاهز"
                                      : order.status === "revision"
                                        ? "مراجعة"
                                        : "مُسلم"}
                              </span>
                            </Badge>
                          </div>
                          <div className="text-sm text-gray-600 mb-1">
                            <strong>{order.treatment}</strong> - {order.tooth}
                          </div>
                          <div className="text-xs text-gray-500">
                            {order.labName} | التسليم المتوقع:{" "}
                            {order.expectedDate}
                          </div>
                        </div>
                      </div>
                      <div className="flex flex-col items-end gap-1">
                        <span className="text-sm font-medium text-gray-900">
                          {order.cost} د.ع
                        </span>
                        <div className="flex gap-1">
                          <Button size="sm" variant="ghost">
                            <Phone className="w-3 h-3" />
                          </Button>
                          <Button size="sm" variant="ghost">
                            <Eye className="w-3 h-3" />
                          </Button>
                          <Button size="sm" variant="ghost">
                            <MoreHorizontal className="w-3 h-3" />
                          </Button>
                        </div>
                      </div>
                    </div>

                    {order.notes && (
                      <div className="text-xs text-gray-600 bg-gray-50 p-2 rounded-md">
                        <strong>ملاحظات:</strong> {order.notes}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Quick Actions - Mobile Floating */}
        <div className="fixed bottom-20 left-4 flex flex-col gap-2 lg:hidden">
          <Button
            size="sm"
            className="w-12 h-12 rounded-full shadow-lg"
            onClick={() => setShowNewLabOrder(true)}
          >
            <FlaskConical className="w-5 h-5" />
          </Button>
          <Button
            size="sm"
            variant="secondary"
            className="w-12 h-12 rounded-full shadow-lg"
            onClick={() => setShowNewReminder(true)}
          >
            <Bell className="w-5 h-5" />
          </Button>
        </div>
      </div>

      {/* Modals */}
      <NewLabOrderModal
        isOpen={showNewLabOrder}
        onClose={() => setShowNewLabOrder(false)}
      />

      <NewReminderModal
        isOpen={showNewReminder}
        onClose={() => setShowNewReminder(false)}
      />
    </div>
  );
}
