import React, { useState, useMemo } from "react";
import {
  Calendar,
  Clock,
  ChevronLeft,
  ChevronRight,
  Check,
  X,
  Edit,
  User,
  Phone,
  Smartphone,
  AlertCircle,
  CheckCircle,
  Timer,
  FileText,
  Mail,
  MapPin,
  Calendar as CalendarIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";

// أنواع المواعيد
type AppointmentType = "online" | "regular";
type AppointmentStatus = "pending" | "confirmed" | "cancelled" | "completed";

interface Appointment {
  id: string;
  patientName: string;
  patientPhone: string;
  patientEmail?: string;
  time: string;
  treatment: string;
  duration: number; // بالدقائق
  type: AppointmentType; // إلكتروني أو عادي
  status: AppointmentStatus;
  notes?: string;
  addedBy: "secretary" | "doctor" | "patient";
  createdAt: Date;
  doctorNotes?: string;
}

// بيانات وهمية للمواعيد
const mockAppointments: Appointment[] = [
  {
    id: "1",
    patientName: "أحمد محمد الكردي",
    patientPhone: "07801234567",
    patientEmail: "ahmed@example.com",
    time: "09:00",
    treatment: "فحص دوري",
    duration: 30,
    type: "online",
    status: "pending",
    notes: "موعد إلكتروني - يحتاج موافقة",
    addedBy: "patient",
    createdAt: new Date(2025, 9, 10),
  },
  {
    id: "2",
    patientName: "فاطمة علي السعد",
    patientPhone: "07709876543",
    time: "10:00",
    treatment: "تنظيف أسنان",
    duration: 45,
    type: "regular",
    status: "confirmed",
    notes: "موعد من السكرتير",
    addedBy: "secretary",
    createdAt: new Date(2025, 9, 10),
  },
  {
    id: "3",
    patientName: "محمد حسين العبيدي",
    patientPhone: "07705555555",
    patientEmail: "mohammed@example.com",
    time: "11:30",
    treatment: "حشو أسنان",
    duration: 60,
    type: "online",
    status: "pending",
    notes: "حجز إلكتروني من المنصة",
    addedBy: "patient",
    createdAt: new Date(2025, 9, 10),
  },
  {
    id: "4",
    patientName: "سارة عبدالله الزهراوي",
    patientPhone: "07803456789",
    time: "14:00",
    treatment: "تقويم أسنان",
    duration: 90,
    type: "regular",
    status: "confirmed",
    addedBy: "secretary",
    createdAt: new Date(2025, 9, 10),
  },
  {
    id: "5",
    patientName: "علي جاسم الموسوي",
    patientPhone: "07901112233",
    patientEmail: "ali@example.com",
    time: "16:00",
    treatment: "زراعة أسنان",
    duration: 120,
    type: "online",
    status: "pending",
    notes: "استشارة أولية - موعد إلكتروني",
    addedBy: "patient",
    createdAt: new Date(2025, 9, 11),
  },
];

const InteractiveClinicCalendar: React.FC = () => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [appointments, setAppointments] = useState<Appointment[]>(mockAppointments);
  const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null);
  const [showActionModal, setShowActionModal] = useState(false);
  const [actionType, setActionType] = useState<"approve" | "edit" | "cancel" | null>(null);
  const [editTime, setEditTime] = useState("");
  const [doctorNotes, setDoctorNotes] = useState("");
  const [showAddModal, setShowAddModal] = useState(false);
  const [newAppointment, setNewAppointment] = useState({
    patientName: "",
    patientPhone: "",
    patientEmail: "",
    time: "",
    treatment: "",
    duration: 30,
    notes: "",
  });

  // الحصول على أيام الأسبوع الحالي
  const getWeekDays = (date: Date) => {
    const week = [];
    const current = new Date(date);
    // البداية من الأحد
    const day = current.getDay();
    const diff = current.getDate() - day;
    const sunday = new Date(current.setDate(diff));

    for (let i = 0; i < 7; i++) {
      const d = new Date(sunday);
      d.setDate(sunday.getDate() + i);
      week.push(d);
    }
    return week;
  };

  const weekDays = useMemo(() => getWeekDays(selectedDate), [selectedDate]);

  // الانتقال للأسبوع التالي/السابق
  const navigateWeek = (direction: "next" | "prev") => {
    const newDate = new Date(selectedDate);
    newDate.setDate(selectedDate.getDate() + (direction === "next" ? 7 : -7));
    setSelectedDate(newDate);
  };

  // الحصول على المواعيد ليوم معين
  const getAppointmentsForDay = (date: Date) => {
    return appointments.filter((apt) => {
      const aptDate = new Date(apt.createdAt);
      return (
        aptDate.getDate() === date.getDate() &&
        aptDate.getMonth() === date.getMonth() &&
        aptDate.getFullYear() === date.getFullYear()
      );
    });
  };

  // المواعيد المحددة لليوم المختار
  const selectedDayAppointments = getAppointmentsForDay(selectedDate);

  // معالجة الموافقة على الموعد
  const handleApprove = (appointment: Appointment) => {
    setAppointments((prev) =>
      prev.map((apt) =>
        apt.id === appointment.id
          ? { ...apt, status: "confirmed" as AppointmentStatus, doctorNotes }
          : apt
      )
    );
    setShowActionModal(false);
    setSelectedAppointment(null);
    setDoctorNotes("");
  };

  // معالجة تعديل الموعد
  const handleEdit = (appointment: Appointment) => {
    if (editTime) {
      setAppointments((prev) =>
        prev.map((apt) =>
          apt.id === appointment.id
            ? { ...apt, time: editTime, status: "confirmed" as AppointmentStatus, doctorNotes }
            : apt
        )
      );
    }
    setShowActionModal(false);
    setSelectedAppointment(null);
    setEditTime("");
    setDoctorNotes("");
  };

  // معالجة إلغاء الموعد
  const handleCancel = (appointment: Appointment) => {
    setAppointments((prev) =>
      prev.map((apt) =>
        apt.id === appointment.id
          ? { ...apt, status: "cancelled" as AppointmentStatus, doctorNotes }
          : apt
      )
    );
    setShowActionModal(false);
    setSelectedAppointment(null);
    setDoctorNotes("");
  };

  // إضافة موعد جديد (من السكرتير)
  const handleAddAppointment = () => {
    const newApt: Appointment = {
      id: String(appointments.length + 1),
      patientName: newAppointment.patientName,
      patientPhone: newAppointment.patientPhone,
      patientEmail: newAppointment.patientEmail || undefined,
      time: newAppointment.time,
      treatment: newAppointment.treatment,
      duration: newAppointment.duration,
      type: "regular",
      status: "pending",
      notes: newAppointment.notes || "موعد من السكرتير - يحتاج موافقة الطبيب",
      addedBy: "secretary",
      createdAt: selectedDate,
    };

    setAppointments((prev) => [...prev, newApt]);
    setShowAddModal(false);
    setNewAppointment({
      patientName: "",
      patientPhone: "",
      patientEmail: "",
      time: "",
      treatment: "",
      duration: 30,
      notes: "",
    });
  };

  // فتح نافذة الإجراء
  const openActionModal = (
    appointment: Appointment,
    action: "approve" | "edit" | "cancel"
  ) => {
    setSelectedAppointment(appointment);
    setActionType(action);
    setEditTime(appointment.time);
    setShowActionModal(true);
  };

  // حساب عدد المواعيد حسب النوع والحالة
  const stats = useMemo(() => {
    const online = appointments.filter((a) => a.type === "online");
    const regular = appointments.filter((a) => a.type === "regular");
    const pending = appointments.filter((a) => a.status === "pending");
    const confirmed = appointments.filter((a) => a.status === "confirmed");

    return {
      onlineTotal: online.length,
      onlinePending: online.filter((a) => a.status === "pending").length,
      regularTotal: regular.length,
      pendingTotal: pending.length,
      confirmedTotal: confirmed.length,
    };
  }, [appointments]);

  return (
    <div className="p-6 space-y-6" dir="rtl">
      {/* الهيدر */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">التقويم التفاعلي</h1>
          <p className="text-gray-600 mt-1">إدارة المواعيد الإلكترونية والعادية</p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all shadow-lg hover:shadow-xl flex items-center gap-2"
        >
          <User className="w-5 h-5" />
          إضافة موعد جديد
        </button>
      </div>

      {/* الإحصائيات */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
        <div className="bg-gradient-to-br from-purple-500 to-purple-600 p-4 rounded-2xl text-white shadow-lg">
          <div className="flex items-center justify-between mb-2">
            <Smartphone className="w-8 h-8 opacity-80" />
            <span className="text-2xl font-bold">{stats.onlineTotal}</span>
          </div>
          <p className="text-sm opacity-90">المواعيد الإلكترونية</p>
        </div>

        <div className="bg-gradient-to-br from-orange-500 to-orange-600 p-4 rounded-2xl text-white shadow-lg">
          <div className="flex items-center justify-between mb-2">
            <AlertCircle className="w-8 h-8 opacity-80" />
            <span className="text-2xl font-bold">{stats.onlinePending}</span>
          </div>
          <p className="text-sm opacity-90">تحتاج موافقة</p>
        </div>

        <div className="bg-gradient-to-br from-blue-500 to-blue-600 p-4 rounded-2xl text-white shadow-lg">
          <div className="flex items-center justify-between mb-2">
            <Calendar className="w-8 h-8 opacity-80" />
            <span className="text-2xl font-bold">{stats.regularTotal}</span>
          </div>
          <p className="text-sm opacity-90">المواعيد العادية</p>
        </div>

        <div className="bg-gradient-to-br from-yellow-500 to-yellow-600 p-4 rounded-2xl text-white shadow-lg">
          <div className="flex items-center justify-between mb-2">
            <Timer className="w-8 h-8 opacity-80" />
            <span className="text-2xl font-bold">{stats.pendingTotal}</span>
          </div>
          <p className="text-sm opacity-90">قيد الانتظار</p>
        </div>

        <div className="bg-gradient-to-br from-green-500 to-green-600 p-4 rounded-2xl text-white shadow-lg">
          <div className="flex items-center justify-between mb-2">
            <CheckCircle className="w-8 h-8 opacity-80" />
            <span className="text-2xl font-bold">{stats.confirmedTotal}</span>
          </div>
          <p className="text-sm opacity-90">مؤكدة</p>
        </div>
      </div>

      {/* التقويم الأسبوعي */}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-purple-50">
          <div className="flex items-center justify-between">
            <button
              onClick={() => navigateWeek("prev")}
              className="p-2 hover:bg-white/80 rounded-xl transition-colors"
            >
              <ChevronRight className="w-5 h-5 text-gray-700" />
            </button>

            <div className="text-center">
              <h3 className="text-lg font-bold text-gray-900">
                {selectedDate.toLocaleDateString("ar-IQ", {
                  month: "long",
                  year: "numeric",
                })}
              </h3>
              <p className="text-sm text-gray-600">
                {weekDays[0].toLocaleDateString("ar-IQ", { day: "numeric" })} -{" "}
                {weekDays[6].toLocaleDateString("ar-IQ", { day: "numeric" })}
              </p>
            </div>

            <button
              onClick={() => navigateWeek("next")}
              className="p-2 hover:bg-white/80 rounded-xl transition-colors"
            >
              <ChevronLeft className="w-5 h-5 text-gray-700" />
            </button>
          </div>
        </div>

        {/* أيام الأسبوع */}
        <div className="grid grid-cols-7 gap-2 p-4">
          {weekDays.map((day, index) => {
            const dayAppointments = getAppointmentsForDay(day);
            const isSelected =
              day.toDateString() === selectedDate.toDateString();
            const isToday = day.toDateString() === new Date().toDateString();
            const onlineCount = dayAppointments.filter(
              (a) => a.type === "online"
            ).length;
            const regularCount = dayAppointments.filter(
              (a) => a.type === "regular"
            ).length;

            return (
              <button
                key={index}
                onClick={() => setSelectedDate(day)}
                className={cn(
                  "p-3 rounded-xl border-2 transition-all hover:scale-105",
                  isSelected
                    ? "border-blue-500 bg-blue-50 shadow-lg"
                    : "border-gray-200 hover:border-blue-300",
                  isToday && !isSelected && "border-green-400 bg-green-50"
                )}
              >
                <div className="text-center">
                  <p className="text-xs text-gray-600 mb-1">
                    {day.toLocaleDateString("ar-IQ", { weekday: "short" })}
                  </p>
                  <p
                    className={cn(
                      "text-xl font-bold mb-2",
                      isSelected ? "text-blue-600" : "text-gray-900"
                    )}
                  >
                    {day.getDate()}
                  </p>
                  {dayAppointments.length > 0 && (
                    <div className="flex flex-col gap-1">
                      {onlineCount > 0 && (
                        <div className="flex items-center justify-center gap-1 bg-purple-100 rounded-full px-2 py-0.5">
                          <Smartphone className="w-3 h-3 text-purple-600" />
                          <span className="text-xs font-medium text-purple-600">
                            {onlineCount}
                          </span>
                        </div>
                      )}
                      {regularCount > 0 && (
                        <div className="flex items-center justify-center gap-1 bg-blue-100 rounded-full px-2 py-0.5">
                          <Calendar className="w-3 h-3 text-blue-600" />
                          <span className="text-xs font-medium text-blue-600">
                            {regularCount}
                          </span>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* المواعيد لليوم المحدد */}
      {selectedDayAppointments.length > 0 ? (
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
            <h3 className="text-lg font-semibold text-gray-900">
              مواعيد يوم{" "}
              {selectedDate.toLocaleDateString("ar-IQ", {
                weekday: "long",
                day: "numeric",
                month: "long",
              })}
            </h3>
          </div>

          <div className="divide-y divide-gray-200">
            {selectedDayAppointments
              .sort((a, b) => a.time.localeCompare(b.time))
              .map((appointment) => (
                <div
                  key={appointment.id}
                  className={cn(
                    "p-6 transition-all",
                    appointment.type === "online"
                      ? "bg-purple-50/30 hover:bg-purple-50"
                      : "bg-blue-50/30 hover:bg-blue-50"
                  )}
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      {/* رأس المعلومات */}
                      <div className="flex items-center gap-3 mb-3">
                        <div className="flex items-center gap-2">
                          <div
                            className={cn(
                              "w-10 h-10 rounded-xl flex items-center justify-center",
                              appointment.type === "online"
                                ? "bg-purple-100"
                                : "bg-blue-100"
                            )}
                          >
                            {appointment.type === "online" ? (
                              <Smartphone
                                className={cn(
                                  "w-5 h-5",
                                  appointment.type === "online"
                                    ? "text-purple-600"
                                    : "text-blue-600"
                                )}
                              />
                            ) : (
                              <Calendar
                                className="w-5 h-5 text-blue-600"
                              />
                            )}
                          </div>
                          <div>
                            <h4 className="font-bold text-gray-900">
                              {appointment.patientName}
                            </h4>
                            <p className="text-xs text-gray-600">
                              {appointment.type === "online"
                                ? "موعد إلكتروني"
                                : "موعد عادي"}
                            </p>
                          </div>
                        </div>

                        <span
                          className={cn(
                            "px-3 py-1 rounded-full text-xs font-medium",
                            appointment.status === "pending"
                              ? "bg-orange-100 text-orange-800"
                              : appointment.status === "confirmed"
                                ? "bg-green-100 text-green-800"
                                : appointment.status === "cancelled"
                                  ? "bg-red-100 text-red-800"
                                  : "bg-gray-100 text-gray-800"
                          )}
                        >
                          {appointment.status === "pending"
                            ? "انتظار موافقة"
                            : appointment.status === "confirmed"
                              ? "مؤكد"
                              : appointment.status === "cancelled"
                                ? "ملغي"
                                : "مكتمل"}
                        </span>
                      </div>

                      {/* التفاصيل */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-4">
                        <div className="flex items-center gap-2 text-sm text-gray-700">
                          <Clock className="w-4 h-4 text-gray-500" />
                          <span>
                            الساعة {appointment.time} - المدة {appointment.duration}{" "}
                            دقيقة
                          </span>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-gray-700">
                          <FileText className="w-4 h-4 text-gray-500" />
                          <span>{appointment.treatment}</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-gray-700">
                          <Phone className="w-4 h-4 text-gray-500" />
                          <span>{appointment.patientPhone}</span>
                        </div>
                        {appointment.patientEmail && (
                          <div className="flex items-center gap-2 text-sm text-gray-700">
                            <Mail className="w-4 h-4 text-gray-500" />
                            <span>{appointment.patientEmail}</span>
                          </div>
                        )}
                      </div>

                      {appointment.notes && (
                        <div className="p-3 bg-white rounded-lg border border-gray-200 mb-3">
                          <p className="text-sm text-gray-700">
                            <strong className="text-gray-900">
                              ملاحظات:{" "}
                            </strong>
                            {appointment.notes}
                          </p>
                        </div>
                      )}

                      {appointment.doctorNotes && (
                        <div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
                          <p className="text-sm text-blue-900">
                            <strong>ملاحظات الطبيب: </strong>
                            {appointment.doctorNotes}
                          </p>
                        </div>
                      )}
                    </div>

                    {/* الإجراءات */}
                    {appointment.status === "pending" && (
                      <div className="flex flex-col gap-2">
                        <button
                          onClick={() => openActionModal(appointment, "approve")}
                          className="px-4 py-2 bg-green-500 text-white rounded-xl hover:bg-green-600 transition-colors flex items-center gap-2"
                        >
                          <Check className="w-4 h-4" />
                          موافقة
                        </button>
                        <button
                          onClick={() => openActionModal(appointment, "edit")}
                          className="px-4 py-2 bg-blue-500 text-white rounded-xl hover:bg-blue-600 transition-colors flex items-center gap-2"
                        >
                          <Edit className="w-4 h-4" />
                          تعديل
                        </button>
                        <button
                          onClick={() => openActionModal(appointment, "cancel")}
                          className="px-4 py-2 bg-red-500 text-white rounded-xl hover:bg-red-600 transition-colors flex items-center gap-2"
                        >
                          <X className="w-4 h-4" />
                          إلغاء
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              ))}
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-12 text-center">
          <CalendarIcon className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            لا توجد مواعيد في هذا اليوم
          </h3>
          <p className="text-gray-600">
            اختر يوماً آخر لعرض المواعيد المحجوزة
          </p>
        </div>
      )}

      {/* نافذة الإجراءات */}
      {showActionModal && selectedAppointment && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[200] flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-purple-50">
              <h3 className="text-xl font-bold text-gray-900">
                {actionType === "approve"
                  ? "الموافقة على الموعد"
                  : actionType === "edit"
                    ? "تعديل الموعد"
                    : "إلغاء الموعد"}
              </h3>
            </div>

            <div className="p-6 space-y-4">
              {/* معلومات المريض */}
              <div className="bg-gray-50 p-4 rounded-xl">
                <h4 className="font-semibold text-gray-900 mb-3">
                  معلومات المريض
                </h4>
                <div className="space-y-2 text-sm">
                  <p>
                    <strong>الاسم:</strong> {selectedAppointment.patientName}
                  </p>
                  <p>
                    <strong>الهاتف:</strong> {selectedAppointment.patientPhone}
                  </p>
                  <p>
                    <strong>العلاج:</strong> {selectedAppointment.treatment}
                  </p>
                  <p>
                    <strong>الوقت الحالي:</strong> {selectedAppointment.time}
                  </p>
                </div>
              </div>

              {/* تعديل الوقت */}
              {actionType === "edit" && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    الوقت الجديد
                  </label>
                  <input
                    type="time"
                    value={editTime}
                    onChange={(e) => setEditTime(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              )}

              {/* ملاحظات الطبيب */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  ملاحظات الطبيب {actionType === "approve" ? "(اختياري)" : ""}
                </label>
                <textarea
                  value={doctorNotes}
                  onChange={(e) => setDoctorNotes(e.target.value)}
                  placeholder={
                    actionType === "cancel"
                      ? "أدخل سبب الإلغاء..."
                      : "أضف ملاحظات إن وجدت..."
                  }
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 min-h-[100px]"
                />
              </div>

              {/* الأزرار */}
              <div className="flex gap-3 pt-4">
                <button
                  onClick={() => {
                    if (actionType === "approve") {
                      handleApprove(selectedAppointment);
                    } else if (actionType === "edit") {
                      handleEdit(selectedAppointment);
                    } else if (actionType === "cancel") {
                      handleCancel(selectedAppointment);
                    }
                  }}
                  className={cn(
                    "flex-1 px-6 py-3 rounded-xl text-white font-medium transition-colors",
                    actionType === "approve"
                      ? "bg-green-500 hover:bg-green-600"
                      : actionType === "edit"
                        ? "bg-blue-500 hover:bg-blue-600"
                        : "bg-red-500 hover:bg-red-600"
                  )}
                >
                  {actionType === "approve"
                    ? "تأكيد الموافقة"
                    : actionType === "edit"
                      ? "حفظ التعديل"
                      : "تأكيد الإلغاء"}
                </button>
                <button
                  onClick={() => {
                    setShowActionModal(false);
                    setSelectedAppointment(null);
                    setEditTime("");
                    setDoctorNotes("");
                  }}
                  className="flex-1 px-6 py-3 bg-gray-200 text-gray-700 rounded-xl hover:bg-gray-300 transition-colors font-medium"
                >
                  إلغاء
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* نافذة إضافة موعد جديد */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[200] flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-purple-50">
              <h3 className="text-xl font-bold text-gray-900">
                إضافة موعد جديد - السكرتير
              </h3>
              <p className="text-sm text-gray-600 mt-1">
                الموعد سيكون بحالة "انتظار موافقة" حتى يوافق عليه الطبيب
              </p>
            </div>

            <div className="p-6 space-y-4">
              {/* معلومات المريض */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    اسم المريض <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <User className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input
                      type="text"
                      value={newAppointment.patientName}
                      onChange={(e) =>
                        setNewAppointment({ ...newAppointment, patientName: e.target.value })
                      }
                      placeholder="أدخل اسم المريض الكامل"
                      className="w-full pr-12 pl-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    رقم الهاتف <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <Phone className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input
                      type="tel"
                      value={newAppointment.patientPhone}
                      onChange={(e) =>
                        setNewAppointment({ ...newAppointment, patientPhone: e.target.value })
                      }
                      placeholder="07XXXXXXXXX"
                      className="w-full pr-12 pl-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    البريد الإلكتروني (اختياري)
                  </label>
                  <div className="relative">
                    <Mail className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input
                      type="email"
                      value={newAppointment.patientEmail}
                      onChange={(e) =>
                        setNewAppointment({ ...newAppointment, patientEmail: e.target.value })
                      }
                      placeholder="example@email.com"
                      className="w-full pr-12 pl-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    نوع العلاج <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <FileText className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <select
                      value={newAppointment.treatment}
                      onChange={(e) =>
                        setNewAppointment({ ...newAppointment, treatment: e.target.value })
                      }
                      className="w-full pr-12 pl-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 appearance-none"
                      required
                    >
                      <option value="">اختر نوع العلاج</option>
                      <option value="فحص دوري">فحص دوري</option>
                      <option value="تنظيف أسنان">تنظيف أسنان</option>
                      <option value="حشو أسنان">حشو أسنان</option>
                      <option value="تقويم أسنان">تقويم أسنان</option>
                      <option value="زراعة أسنان">زراعة أسنان</option>
                      <option value="تبييض أسنان">تبييض أسنان</option>
                      <option value="خلع ضرس">خلع ضرس</option>
                      <option value="علاج عصب">علاج عصب</option>
                      <option value="تركيبات أسنان">تركيبات أسنان</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* معلومات الموعد */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    الوقت <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <Clock className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input
                      type="time"
                      value={newAppointment.time}
                      onChange={(e) =>
                        setNewAppointment({ ...newAppointment, time: e.target.value })
                      }
                      className="w-full pr-12 pl-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    المدة (بالدقائق) <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <Timer className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <select
                      value={newAppointment.duration}
                      onChange={(e) =>
                        setNewAppointment({ ...newAppointment, duration: Number(e.target.value) })
                      }
                      className="w-full pr-12 pl-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 appearance-none"
                      required
                    >
                      <option value={15}>15 دقيقة</option>
                      <option value={30}>30 دقيقة</option>
                      <option value={45}>45 دقيقة</option>
                      <option value={60}>60 دقيقة</option>
                      <option value={90}>90 دقيقة</option>
                      <option value={120}>120 دقيقة</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* ملاحظات */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  ملاحظات إضافية (اختياري)
                </label>
                <textarea
                  value={newAppointment.notes}
                  onChange={(e) =>
                    setNewAppointment({ ...newAppointment, notes: e.target.value })
                  }
                  placeholder="أضف أي ملاحظات مهمة عن حالة المريض أو طلبات خاصة..."
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 min-h-[100px]"
                />
              </div>

              {/* تنبيه */}
              <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4 flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
                <div className="text-sm text-yellow-800">
                  <p className="font-medium mb-1">تنبيه مهم:</p>
                  <p>
                    الموعد سيكون بحالة "انتظار موافقة" وسيحتاج موافقة الطبيب
                    المعالج قبل تأكيده. سيتم إشعار الطبيب بالموعد الجديد.
                  </p>
                </div>
              </div>

              {/* الأزرار */}
              <div className="flex gap-3 pt-4">
                <button
                  onClick={handleAddAppointment}
                  disabled={
                    !newAppointment.patientName ||
                    !newAppointment.patientPhone ||
                    !newAppointment.time ||
                    !newAppointment.treatment
                  }
                  className="flex-1 px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  إضافة الموعد
                </button>
                <button
                  onClick={() => {
                    setShowAddModal(false);
                    setNewAppointment({
                      patientName: "",
                      patientPhone: "",
                      patientEmail: "",
                      time: "",
                      treatment: "",
                      duration: 30,
                      notes: "",
                    });
                  }}
                  className="flex-1 px-6 py-3 bg-gray-200 text-gray-700 rounded-xl hover:bg-gray-300 transition-colors font-medium"
                >
                  إلغاء
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default InteractiveClinicCalendar;
