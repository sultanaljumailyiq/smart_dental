import React, { useState, useEffect } from "react";
import {
  Calendar,
  Clock,
  User,
  Phone,
  MapPin,
  Plus,
  Search,
  Filter,
  MoreVertical,
  CheckCircle,
  XCircle,
  AlertTriangle,
  RefreshCw,
  Bell,
  Users,
  CalendarDays,
  Timer,
  MessageSquare,
  Edit,
  Trash2,
  Copy,
  Eye,
  Star,
  ChevronLeft,
  ChevronRight,
  Download,
  Settings,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { PageHeader } from "@/components/Breadcrumbs";
import {
  LoadingSpinner,
  ButtonLoading,
  DataLoadingStates,
} from "@/components/LoadingIndicators";

interface Appointment {
  id: string;
  patientName: string;
  patientPhone: string;
  patientAge: number;
  appointmentType: "consultation" | "treatment" | "followup" | "emergency";
  treatment: string;
  date: string;
  time: string;
  duration: number;
  status: "confirmed" | "pending" | "cancelled" | "completed" | "no-show";
  notes?: string;
  priority: "low" | "medium" | "high";
  doctorId: string;
  roomId: string;
  reminderSent: boolean;
  paymentStatus: "paid" | "pending" | "partial";
  amount: number;
  createdAt: string;
  isNewPatient: boolean;
  lastVisit?: string;
}

interface TimeSlot {
  time: string;
  available: boolean;
  appointmentId?: string;
  patientName?: string;
  treatment?: string;
  duration?: number;
}

interface Doctor {
  id: string;
  name: string;
  specialization: string;
  avatar: string;
  isAvailable: boolean;
}

interface Room {
  id: string;
  name: string;
  type: "consultation" | "surgery" | "xray" | "cleaning";
  isAvailable: boolean;
}

// Mock data
const mockAppointments: Appointment[] = [
  {
    id: "1",
    patientName: "أحمد محمد علي",
    patientPhone: "+964 770 123 4567",
    patientAge: 35,
    appointmentType: "treatment",
    treatment: "حشو الأسنان",
    date: "2024-01-15",
    time: "09:00",
    duration: 60,
    status: "confirmed",
    priority: "medium",
    doctorId: "dr1",
    roomId: "room1",
    reminderSent: true,
    paymentStatus: "paid",
    amount: 50000,
    createdAt: "2024-01-10",
    isNewPatient: false,
    lastVisit: "2023-12-15",
  },
  {
    id: "2",
    patientName: "فاطمة أحمد",
    patientPhone: "+964 771 987 6543",
    patientAge: 28,
    appointmentType: "consultation",
    treatment: "فحص عام",
    date: "2024-01-15",
    time: "10:30",
    duration: 30,
    status: "pending",
    priority: "low",
    doctorId: "dr1",
    roomId: "room2",
    reminderSent: false,
    paymentStatus: "pending",
    amount: 25000,
    createdAt: "2024-01-14",
    isNewPatient: true,
  },
  {
    id: "3",
    patientName: "محمد عبدالله",
    patientPhone: "+964 772 456 7890",
    patientAge: 42,
    appointmentType: "emergency",
    treatment: "ألم الأسنان الحاد",
    date: "2024-01-15",
    time: "14:00",
    duration: 45,
    status: "confirmed",
    priority: "high",
    doctorId: "dr2",
    roomId: "room1",
    reminderSent: true,
    paymentStatus: "partial",
    amount: 75000,
    createdAt: "2024-01-15",
    isNewPatient: false,
    lastVisit: "2024-01-01",
  },
];

const mockDoctors: Doctor[] = [
  {
    id: "dr1",
    name: "د. أحمد محمد",
    specialization: "طب الأسنان العام",
    avatar:
      "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=200",
    isAvailable: true,
  },
  {
    id: "dr2",
    name: "د. سارة عل��",
    specialization: "جراحة الفم والأسنان",
    avatar: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=200",
    isAvailable: true,
  },
];

const mockRooms: Room[] = [
  { id: "room1", name: "غرفة العلاج 1", type: "consultation" as const, isAvailable: true },
  {
    id: "room2",
    name: "غرفة الفحص 1",
    type: "consultation",
    isAvailable: true,
  },
  { id: "room3", name: "غرفة الأشعة", type: "xray", isAvailable: false },
];

export default function SmartReservations() {
  const [appointments, setAppointments] =
    useState<Appointment[]>(mockAppointments);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [viewMode, setViewMode] = useState<"day" | "week" | "month">("day");
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedAppointment, setSelectedAppointment] =
    useState<Appointment | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [loading, setLoading] = useState(false);

  const filteredAppointments = appointments.filter((apt) => {
    const matchesSearch =
      apt.patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      apt.patientPhone.includes(searchTerm) ||
      apt.treatment.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === "all" || apt.status === filterStatus;
    const matchesDate = apt.date === selectedDate.toISOString().split("T")[0];

    return matchesSearch && matchesStatus && matchesDate;
  });

  const getStatusColor = (status: Appointment["status"]) => {
    switch (status) {
      case "confirmed":
        return "bg-green-100 text-green-700 border-green-200";
      case "pending":
        return "bg-yellow-100 text-yellow-700 border-yellow-200";
      case "cancelled":
        return "bg-red-100 text-red-700 border-red-200";
      case "completed":
        return "bg-blue-100 text-blue-700 border-blue-200";
      case "no-show":
        return "bg-gray-100 text-gray-700 border-gray-200";
      default:
        return "bg-gray-100 text-gray-700 border-gray-200";
    }
  };

  const getStatusIcon = (status: Appointment["status"]) => {
    switch (status) {
      case "confirmed":
        return <CheckCircle className="w-4 h-4" />;
      case "pending":
        return <Clock className="w-4 h-4" />;
      case "cancelled":
        return <XCircle className="w-4 h-4" />;
      case "completed":
        return <CheckCircle className="w-4 h-4" />;
      case "no-show":
        return <AlertTriangle className="w-4 h-4" />;
      default:
        return <Clock className="w-4 h-4" />;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "bg-red-500";
      case "medium":
        return "bg-yellow-500";
      case "low":
        return "bg-green-500";
      default:
        return "bg-gray-500";
    }
  };

  const generateTimeSlots = (): TimeSlot[] => {
    const slots: TimeSlot[] = [];
    const startHour = 9;
    const endHour = 17;

    for (let hour = startHour; hour < endHour; hour++) {
      for (let minute = 0; minute < 60; minute += 30) {
        const timeString = `${hour.toString().padStart(2, "0")}:${minute.toString().padStart(2, "0")}`;
        const appointment = filteredAppointments.find(
          (apt) => apt.time === timeString,
        );

        slots.push({
          time: timeString,
          available: !appointment,
          appointmentId: appointment?.id,
          patientName: appointment?.patientName,
          treatment: appointment?.treatment,
          duration: appointment?.duration,
        });
      }
    }

    return slots;
  };

  const timeSlots = generateTimeSlots();

  const updateAppointmentStatus = (
    id: string,
    newStatus: Appointment["status"],
  ) => {
    setAppointments((prev) =>
      prev.map((apt) => (apt.id === id ? { ...apt, status: newStatus } : apt)),
    );
  };

  const sendReminder = async (appointmentId: string) => {
    setLoading(true);
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setAppointments((prev) =>
      prev.map((apt) =>
        apt.id === appointmentId ? { ...apt, reminderSent: true } : apt,
      ),
    );
    setLoading(false);
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("ar-IQ", {
      style: "currency",
      currency: "IQD",
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("ar-IQ", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <div className="space-y-6" dir="rtl">
      <PageHeader
        title="نظام الحجوزات الذكي"
        description="إدارة متقدمة للمواعيد مع تجنب التضارب والتذكيرات التلقائية"
        actions={
          <div className="flex items-center gap-3">
            <button className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition-colors">
              <Download className="w-4 h-4" />
              تصدير
            </button>
            <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors">
              <Plus className="w-4 h-4" />
              موعد جديد
            </button>
          </div>
        }
      />

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-2xl p-6 border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">مواعيد اليوم</p>
              <p className="text-2xl font-bold text-gray-900">
                {filteredAppointments.length}
              </p>
            </div>
            <div className="w-12 h-12 bg-blue-100 rounded-2xl flex items-center justify-center">
              <Calendar className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">مؤكدة</p>
              <p className="text-2xl font-bold text-green-600">
                {
                  appointments.filter((apt) => apt.status === "confirmed")
                    .length
                }
              </p>
            </div>
            <div className="w-12 h-12 bg-green-100 rounded-2xl flex items-center justify-center">
              <CheckCircle className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">في الانتظار</p>
              <p className="text-2xl font-bold text-yellow-600">
                {appointments.filter((apt) => apt.status === "pending").length}
              </p>
            </div>
            <div className="w-12 h-12 bg-yellow-100 rounded-2xl flex items-center justify-center">
              <Clock className="w-6 h-6 text-yellow-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">الإيرادات اليومية</p>
              <p className="text-2xl font-bold text-purple-600">
                {formatCurrency(
                  appointments.reduce((sum, apt) => sum + apt.amount, 0),
                )}
              </p>
            </div>
            <div className="w-12 h-12 bg-purple-100 rounded-2xl flex items-center justify-center">
              <Star className="w-6 h-6 text-purple-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Controls */}
      <div className="bg-white rounded-2xl border border-gray-100 p-6">
        <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
          {/* Date Navigation */}
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <button
                onClick={() => {
                  const newDate = new Date(selectedDate);
                  newDate.setDate(newDate.getDate() - 1);
                  setSelectedDate(newDate);
                }}
                className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <ChevronRight className="w-4 h-4" />
              </button>

              <div className="text-center">
                <h3 className="font-semibold text-gray-900">
                  {formatDate(selectedDate.toISOString().split("T")[0])}
                </h3>
                <p className="text-sm text-gray-600">
                  {filteredAppointments.length} موعد
                </p>
              </div>

              <button
                onClick={() => {
                  const newDate = new Date(selectedDate);
                  newDate.setDate(newDate.getDate() + 1);
                  setSelectedDate(newDate);
                }}
                className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
            </div>

            <button
              onClick={() => setSelectedDate(new Date())}
              className="px-4 py-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors"
            >
              اليوم
            </button>
          </div>

          {/* Search and Filters */}
          <div className="flex items-center gap-4 w-full lg:w-auto">
            <div className="relative flex-1 lg:w-80">
              <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="البحث عن مريض أو علاج..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pr-10 pl-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">جميع الحالات</option>
              <option value="confirmed">مؤكدة</option>
              <option value="pending">في الانتظار</option>
              <option value="cancelled">ملغية</option>
              <option value="completed">مكتملة</option>
            </select>
          </div>
        </div>
      </div>

      {/* Calendar Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Time Slots */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-2xl border border-gray-100 p-4">
            <h3 className="font-semibold text-gray-900 mb-4">
              الأوقات المتاحة
            </h3>
            <div className="space-y-2 max-h-96 overflow-y-auto">
              {timeSlots.map((slot) => (
                <div
                  key={slot.time}
                  className={cn(
                    "p-3 rounded-lg border transition-colors cursor-pointer",
                    slot.available
                      ? "border-green-200 bg-green-50 hover:bg-green-100"
                      : "border-red-200 bg-red-50",
                  )}
                  onClick={() => slot.available && setShowAddModal(true)}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-medium text-sm">{slot.time}</span>
                    {slot.available ? (
                      <span className="text-xs text-green-600">متاح</span>
                    ) : (
                      <span className="text-xs text-red-600">محجوز</span>
                    )}
                  </div>
                  {!slot.available && (
                    <div className="mt-1">
                      <p className="text-xs text-gray-600">
                        {slot.patientName}
                      </p>
                      <p className="text-xs text-gray-500">{slot.treatment}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Appointments List */}
        <div className="lg:col-span-3">
          <div className="bg-white rounded-2xl border border-gray-100">
            <div className="p-6 border-b border-gray-100">
              <h3 className="font-semibold text-gray-900">مواعيد اليوم</h3>
            </div>

            <div className="divide-y divide-gray-100">
              {filteredAppointments.length === 0 ? (
                <div className="p-8 text-center">
                  <Calendar className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                  <h3 className="text-lg font-medium text-gray-900 mb-1">
                    لا توجد مواعيد
                  </h3>
                  <p className="text-gray-600">
                    لم يتم حجز أي مواعيد لهذا اليوم
                  </p>
                </div>
              ) : (
                filteredAppointments.map((appointment) => (
                  <div
                    key={appointment.id}
                    className="p-6 hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex items-start gap-4 flex-1">
                        {/* Priority Indicator */}
                        <div
                          className={cn(
                            "w-1 h-16 rounded-full",
                            getPriorityColor(appointment.priority),
                          )}
                        />

                        {/* Patient Info */}
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <h4 className="font-semibold text-gray-900">
                              {appointment.patientName}
                            </h4>
                            {appointment.isNewPatient && (
                              <span className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded-full">
                                مريض جديد
                              </span>
                            )}
                            <span
                              className={cn(
                                "px-3 py-1 rounded-full text-xs border flex items-center gap-1",
                                getStatusColor(appointment.status),
                              )}
                            >
                              {getStatusIcon(appointment.status)}
                              {appointment.status === "confirmed" && "مؤكد"}
                              {appointment.status === "pending" &&
                                "في الانتظار"}
                              {appointment.status === "cancelled" && "ملغي"}
                              {appointment.status === "completed" && "مكتمل"}
                              {appointment.status === "no-show" && "لم يحضر"}
                            </span>
                          </div>

                          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 text-sm text-gray-600">
                            <div className="flex items-center gap-2">
                              <Clock className="w-4 h-4" />
                              <span>
                                {appointment.time} ({appointment.duration}{" "}
                                دقيقة)
                              </span>
                            </div>
                            <div className="flex items-center gap-2">
                              <Phone className="w-4 h-4" />
                              <span>{appointment.patientPhone}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <User className="w-4 h-4" />
                              <span>{appointment.treatment}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <Star className="w-4 h-4" />
                              <span>{formatCurrency(appointment.amount)}</span>
                            </div>
                          </div>

                          {appointment.notes && (
                            <div className="mt-2 p-2 bg-gray-50 rounded-lg text-sm text-gray-600">
                              {appointment.notes}
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="flex items-center gap-2">
                        {!appointment.reminderSent &&
                          appointment.status === "confirmed" && (
                            <ButtonLoading
                              loading={loading}
                              onClick={() => sendReminder(appointment.id)}
                              className="text-xs px-3 py-1 bg-yellow-100 text-yellow-700 hover:bg-yellow-200"
                            >
                              <Bell className="w-3 h-3" />
                              تذكير
                            </ButtonLoading>
                          )}

                        {appointment.status === "pending" && (
                          <button
                            onClick={() =>
                              updateAppointmentStatus(
                                appointment.id,
                                "confirmed",
                              )
                            }
                            className="text-xs px-3 py-1 bg-green-100 text-green-700 rounded-lg hover:bg-green-200 transition-colors"
                          >
                            تأكيد
                          </button>
                        )}

                        <div className="relative">
                          <button className="p-2 rounded-lg hover:bg-gray-100 transition-colors">
                            <MoreVertical className="w-4 h-4 text-gray-600" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-2xl border border-gray-100 p-6">
        <h3 className="font-semibold text-gray-900 mb-4">إجراءات سريعة</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <button className="flex flex-col items-center gap-2 p-4 bg-blue-50 rounded-xl hover:bg-blue-100 transition-colors">
            <Plus className="w-6 h-6 text-blue-600" />
            <span className="text-sm font-medium text-blue-700">موعد جديد</span>
          </button>
          <button className="flex flex-col items-center gap-2 p-4 bg-green-50 rounded-xl hover:bg-green-100 transition-colors">
            <Bell className="w-6 h-6 text-green-600" />
            <span className="text-sm font-medium text-green-700">
              إرسال تذكيرات
            </span>
          </button>
          <button className="flex flex-col items-center gap-2 p-4 bg-purple-50 rounded-xl hover:bg-purple-100 transition-colors">
            <CalendarDays className="w-6 h-6 text-purple-600" />
            <span className="text-sm font-medium text-purple-700">
              عرض الأسبوع
            </span>
          </button>
          <button className="flex flex-col items-center gap-2 p-4 bg-orange-50 rounded-xl hover:bg-orange-100 transition-colors">
            <Download className="w-6 h-6 text-orange-600" />
            <span className="text-sm font-medium text-orange-700">
              تصدير التقرير
            </span>
          </button>
        </div>
      </div>
    </div>
  );
}
