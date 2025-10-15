import React, { useState, useEffect } from "react";
import {
  Calendar,
  Clock,
  Search,
  Filter,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  MoreHorizontal,
  User,
  CheckCircle,
  AlertCircle,
  Plus,
  UserPlus,
  Brain,
  Stethoscope,
  ClipboardList,
  Phone,
  MapPin,
  Mail,
  Eye,
  Edit,
  Trash2,
  CalendarDays,
  Timer,
  Users,
  TrendingUp,
  Activity,
  Star,
  Badge,
  Bell,
  Settings,
  X,
  Save,
  FileText,
  MessageSquare,
  AlarmClock,
  Repeat,
  Volume2,
  Smartphone,
  Calendar as CalendarIcon,
  Info,
  Download,
  Upload,
  Filter as FilterIcon,
  SortAsc,
  SortDesc,
  RotateCcw,
  Loader2,
  Globe,
  Building2,
} from "lucide-react";
import { cn } from "@/lib/utils";
import InteractiveCalendar from "../components/InteractiveCalendar";
import ModernMedicalCheckupModal from "../components/ModernMedicalCheckupModal";
import BookingNotifications from "@/components/BookingNotifications";
import { sharedClinicData, Appointment, Patient } from "@/services/sharedClinicData";

interface ExtendedAppointment {
  id: string | number;
  date: string;
  time: string;
  patient: string;
  treatment: string;
  duration: string;
  status: "confirmed" | "finished" | "in-progress" | "pending";
  avatar: string;
  color: string;
  phone: string;
  email: string;
  priority: string;
  source?: "manual" | "online_booking";
  treatmentPlan?: {
    stage: string;
    stepType: "treatment" | "consultation" | "examination" | "follow-up";
    description: string;
    progress: number;
    nextStep?: string;
  };
}

const getAvatarColor = (name: string): string => {
  const colors = [
    "bg-purple-100 text-purple-700",
    "bg-blue-100 text-blue-700",
    "bg-green-100 text-green-700",
    "bg-pink-100 text-pink-700",
    "bg-indigo-100 text-indigo-700",
    "bg-yellow-100 text-yellow-700",
  ];
  const hash = name.split("").reduce((acc, char) => acc + char.charCodeAt(0), 0);
  return colors[hash % colors.length];
};

const adaptAppointmentForReservations = (
  appointment: Appointment,
  patientData?: Patient
): ExtendedAppointment => {
  const statusMap: Record<string, "confirmed" | "finished" | "in-progress" | "pending"> = {
    scheduled: "pending",
    confirmed: "confirmed",
    in_progress: "in-progress",
    completed: "finished",
    cancelled: "pending",
  };

  const priorityMap: Record<string, string> = {
    normal: "عادي",
    high: "عاجل",
    urgent: "عاجل",
  };

  return {
    id: appointment.id,
    date: appointment.date,
    time: appointment.time,
    patient: appointment.patientName,
    treatment: appointment.treatment,
    duration: `${appointment.duration} دقيقة`,
    status: statusMap[appointment.status] || "pending",
    avatar: appointment.patientName.substring(0, 2),
    color: getAvatarColor(appointment.patientName),
    phone: patientData?.phone || "غير متوفر",
    email: patientData?.email || "غير متوفر",
    priority: priorityMap[patientData?.priority || "normal"] || "عادي",
    source: appointment.source,
    treatmentPlan: {
      stage: appointment.status === "completed" ? "العلاج المكتمل" : "مرحلة العلاج",
      stepType: "treatment",
      description: appointment.notes || "لا توجد ملاحظات",
      progress:
        appointment.status === "completed"
          ? 100
          : appointment.status === "in_progress"
            ? 60
            : 25,
      nextStep: appointment.status === "completed" ? undefined : "الخطوة التالية",
    },
  };
};

// Mock clinics data
const mockClinics = [
  { id: "clinic-1", name: "عيادة النجمة لطب الأسنان", location: "بغداد - الكرادة" },
  { id: "clinic-2", name: "عيادة الابتسامة الذكية", location: "بغداد - المنصور" },
  { id: "clinic-3", name: "مركز الأسنان المتقدم", location: "بغداد - الجادرية" },
];

const Reservations = () => {
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const [isMedicalModalOpen, setIsMedicalModalOpen] = useState(false);
  const [selectedView, setSelectedView] = useState<"grid" | "list">("grid");
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [selectedPatient, setSelectedPatient] = useState<any>(null);
  const [isNewPatientModalOpen, setIsNewPatientModalOpen] = useState(false);
  const [isNewAppointmentModalOpen, setIsNewAppointmentModalOpen] = useState(false);
  const [isAdvancedSchedulingOpen, setIsAdvancedSchedulingOpen] = useState(false);
  const [isRemindersModalOpen, setIsRemindersModalOpen] = useState(false);
  const [activeReminderTab, setActiveReminderTab] = useState("personal");
  const [expandedRequestId, setExpandedRequestId] = useState<string | number | null>(null);
  const [actionNotes, setActionNotes] = useState("");
  const [showNotesModal, setShowNotesModal] = useState(false);
  const [selectedActionType, setSelectedActionType] = useState<"approve" | "reject" | null>(null);
  const [selectedRequestId, setSelectedRequestId] = useState<string | number | null>(null);
  const [selectedClinic, setSelectedClinic] = useState(mockClinics[0]);
  const [isClinicDropdownOpen, setIsClinicDropdownOpen] = useState(false);
  const [weekOffset, setWeekOffset] = useState(0);
  const [selectedDay, setSelectedDay] = useState<Date | null>(null);
  const [showDayDetailsModal, setShowDayDetailsModal] = useState(false);
  
  const [newPatientData, setNewPatientData] = useState({
    firstName: "",
    lastName: "",
    phone: "",
    email: "",
    birthDate: "",
    gender: "",
    address: "",
    medicalHistory: "",
    emergencyContact: "",
    emergencyPhone: "",
    notes: "",
  });

  const [newAppointmentData, setNewAppointmentData] = useState({
    patientId: "",
    patientName: "",
    date: "",
    time: "",
    duration: "30",
    treatment: "",
    doctorId: "1",
    doctorName: "د. أحمد محمد",
    notes: "",
  });

  const [appointments, setAppointments] = useState<ExtendedAppointment[]>([]);
  const [patients, setPatients] = useState<Patient[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setIsLoading(true);
      const [appointmentsData, patientsData] = await Promise.all([
        sharedClinicData.getAppointments(),
        sharedClinicData.getPatients(),
      ]);

      const patientsMap = new Map<string, Patient>();
      patientsData.forEach((patient) => {
        patientsMap.set(patient.id, patient);
      });

      const extendedAppointments = appointmentsData.map((appointment) => {
        const patient = patientsMap.get(appointment.patientId);
        return adaptAppointmentForReservations(appointment, patient);
      });

      setAppointments(extendedAppointments);
      setPatients(patientsData);
    } catch (error) {
      console.error("Error loading data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSaveNewPatient = async () => {
    try {
      const fullName = `${newPatientData.firstName} ${newPatientData.lastName}`;
      const birthYear = newPatientData.birthDate ? new Date(newPatientData.birthDate).getFullYear() : new Date().getFullYear() - 30;
      const age = new Date().getFullYear() - birthYear;

      const newPatient: Omit<Patient, 'id'> = {
        name: fullName,
        age: age,
        phone: newPatientData.phone,
        email: newPatientData.email,
        address: newPatientData.address,
        lastVisit: new Date().toISOString().split('T')[0],
        nextAppointment: null,
        treatment: "فحص أولي",
        status: "active",
        priority: "normal",
        totalVisits: 0,
        totalSpent: 0,
        notes: newPatientData.notes,
        medicalHistory: newPatientData.medicalHistory ? [newPatientData.medicalHistory] : [],
        birthDate: newPatientData.birthDate,
        gender: newPatientData.gender as "male" | "female" | undefined,
        emergencyContact: newPatientData.emergencyContact,
        emergencyPhone: newPatientData.emergencyPhone,
      };

      const savedPatient = await sharedClinicData.addPatient(newPatient);
      
      setIsNewPatientModalOpen(false);
      setNewPatientData({
        firstName: "",
        lastName: "",
        phone: "",
        email: "",
        birthDate: "",
        gender: "",
        address: "",
        medicalHistory: "",
        emergencyContact: "",
        emergencyPhone: "",
        notes: "",
      });
      
      await loadData();
    } catch (error) {
      console.error("Error saving patient:", error);
    }
  };

  const handleSaveNewAppointment = async () => {
    try {
      if (!newAppointmentData.patientId || !newAppointmentData.date || !newAppointmentData.time) {
        alert("الرجاء ملء جميع الحقول المطلوبة");
        return;
      }

      const newAppointment: Omit<Appointment, 'id'> = {
        patientId: newAppointmentData.patientId,
        patientName: newAppointmentData.patientName,
        date: newAppointmentData.date,
        time: newAppointmentData.time,
        duration: parseInt(newAppointmentData.duration),
        treatment: newAppointmentData.treatment || "فحص عام",
        doctorId: newAppointmentData.doctorId,
        doctorName: newAppointmentData.doctorName,
        status: "scheduled",
        notes: newAppointmentData.notes,
        reminder: true,
        source: "manual",
      };

      await sharedClinicData.addAppointment(newAppointment);
      
      setIsNewAppointmentModalOpen(false);
      setNewAppointmentData({
        patientId: "",
        patientName: "",
        date: "",
        time: "",
        duration: "30",
        treatment: "",
        doctorId: "1",
        doctorName: "د. أحمد محمد",
        notes: "",
      });
      
      await loadData();
    } catch (error) {
      console.error("Error saving appointment:", error);
    }
  };

  const handleOpenNotesModal = (requestId: string | number, actionType: "approve" | "reject") => {
    setSelectedRequestId(requestId);
    setSelectedActionType(actionType);
    setActionNotes("");
    setShowNotesModal(true);
  };
  
  const handleConfirmAction = async () => {
    if (!selectedRequestId || !selectedActionType) return;
    
    try {
      const status = selectedActionType === "approve" ? "confirmed" : "cancelled";
      const updates: any = { status };
      if (actionNotes.trim()) {
        updates.notes = actionNotes;
      }
      
      await sharedClinicData.updateAppointment(selectedRequestId.toString(), updates);
      await loadData();
      setShowNotesModal(false);
      setActionNotes("");
      setSelectedRequestId(null);
      setSelectedActionType(null);
    } catch (error) {
      console.error("Error processing request:", error);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "confirmed":
        return (
          <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-700">
            <CheckCircle className="w-3 h-3" />
            مؤكد
          </span>
        );
      case "finished":
        return (
          <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-700">
            <CheckCircle className="w-3 h-3" />
            مكتمل
          </span>
        );
      case "in-progress":
        return (
          <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-700">
            <Timer className="w-3 h-3" />
            جاري
          </span>
        );
      case "pending":
        return (
          <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-700">
            <Clock className="w-3 h-3" />
            في الانتظار
          </span>
        );
      default:
        return null;
    }
  };

  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case "عاجل":
        return (
          <span className="inline-flex items-center gap-1 px-2 py-1 rounded-lg text-xs font-medium bg-red-100 text-red-700">
            <AlertCircle className="w-3 h-3" />
            عاجل
          </span>
        );
      case "عادي":
        return (
          <span className="inline-flex items-center gap-1 px-2 py-1 rounded-lg text-xs font-medium bg-green-100 text-green-700">
            <Badge className="w-3 h-3" />
            عادي
          </span>
        );
      default:
        return null;
    }
  };

  const filteredAppointments = appointments.filter((appointment) => {
    const matchesSearch =
      appointment.patient.toLowerCase().includes(searchTerm.toLowerCase()) ||
      appointment.treatment.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus =
      selectedStatus === "all" || appointment.status === selectedStatus;
    return matchesSearch && matchesStatus;
  });

  const todayStats = {
    total: appointments.length,
    confirmed: appointments.filter((a) => a.status === "confirmed").length,
    finished: appointments.filter((a) => a.status === "finished").length,
    pending: appointments.filter((a) => a.status === "pending").length,
    inProgress: appointments.filter((a) => a.status === "in-progress").length,
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen" dir="rtl">
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-indigo-600 animate-spin mx-auto mb-4" />
          <p className="text-xl font-semibold text-gray-700 mb-2">جاري تحميل الحجوزات</p>
          <p className="text-sm text-gray-500">الرجاء الانتظار...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6" dir="rtl">
      {/* Header Section */}
      <div className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 rounded-3xl p-8 text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="absolute top-0 right-0 w-40 h-40 bg-white/10 rounded-full -translate-y-16 translate-x-16"></div>
        <div className="absolute bottom-0 left-0 w-32 h-32 bg-white/10 rounded-full translate-y-16 -translate-x-16"></div>
        <div className="relative z-10">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold mb-2">إدارة الحجوزات</h1>
              <p className="text-indigo-100 text-lg mb-4">
                {new Date().toLocaleDateString("ar-IQ", {
                  weekday: "long",
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </p>
              <p className="text-indigo-100">
                لديك {todayStats.total} موعد اليوم، {todayStats.confirmed} مؤكد
                و {todayStats.pending} في الانتظار
              </p>
            </div>
          </div>

          {/* Clinic Selector & Action Buttons */}
          <div className="flex flex-wrap items-center gap-3">
            {/* Clinic Selector */}
            <div className="relative">
              <button
                onClick={() => setIsClinicDropdownOpen(!isClinicDropdownOpen)}
                className="bg-white/20 backdrop-blur-sm text-white px-4 py-3 rounded-xl font-medium hover:bg-white/30 transition-all flex items-center gap-3 min-w-[280px]"
              >
                <div className="w-10 h-10 bg-white/30 rounded-lg flex items-center justify-center">
                  <Building2 className="w-5 h-5" />
                </div>
                <div className="flex-1 text-right">
                  <p className="text-sm font-semibold">{selectedClinic.name}</p>
                  <p className="text-xs text-indigo-100">{selectedClinic.location}</p>
                </div>
                <ChevronDown className={cn(
                  "w-5 h-5 transition-transform",
                  isClinicDropdownOpen && "rotate-180"
                )} />
              </button>

              {/* Dropdown Menu */}
              {isClinicDropdownOpen && (
                <div className="absolute top-full left-0 mt-2 w-full bg-white rounded-xl shadow-xl overflow-hidden z-50">
                  {mockClinics.map((clinic) => (
                    <button
                      key={clinic.id}
                      onClick={() => {
                        setSelectedClinic(clinic);
                        setIsClinicDropdownOpen(false);
                      }}
                      className={cn(
                        "w-full px-4 py-3 text-right hover:bg-indigo-50 transition-all flex items-center gap-3",
                        selectedClinic.id === clinic.id && "bg-indigo-50"
                      )}
                    >
                      <div className={cn(
                        "w-8 h-8 rounded-lg flex items-center justify-center",
                        selectedClinic.id === clinic.id ? "bg-indigo-600 text-white" : "bg-gray-100 text-gray-600"
                      )}>
                        <Building2 className="w-4 h-4" />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-semibold text-gray-900">{clinic.name}</p>
                        <p className="text-xs text-gray-500">{clinic.location}</p>
                      </div>
                      {selectedClinic.id === clinic.id && (
                        <CheckCircle className="w-5 h-5 text-indigo-600" />
                      )}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* عرض المواعيد Button */}
            <button
              onClick={() => setIsCalendarOpen(true)}
              className="bg-white/20 backdrop-blur-sm text-white px-6 py-3 rounded-xl font-medium hover:bg-white/30 transition-all flex items-center gap-2"
            >
              <Calendar className="w-5 h-5" />
              عرض المواعيد
            </button>

            {/* موعد جديد Button */}
            <button
              onClick={() => setIsNewAppointmentModalOpen(true)}
              className="bg-white text-indigo-600 px-6 py-3 rounded-xl font-medium hover:bg-indigo-50 transition-all flex items-center gap-2"
            >
              <Plus className="w-5 h-5" />
              موعد جديد
            </button>
          </div>
        </div>
      </div>

      {/* Enhanced Interactive Calendar */}
      <div className="bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 rounded-3xl p-8 shadow-lg border border-indigo-100">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-2xl font-bold text-gray-900 flex items-center gap-3 mb-2">
              <div className="w-12 h-12 bg-indigo-600 rounded-2xl flex items-center justify-center">
                <Calendar className="w-7 h-7 text-white" />
              </div>
              التقويم التفاعلي
            </h3>
            <p className="text-gray-600">عرض سريع للحجوزات على مدار الأسبوع</p>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => setWeekOffset(prev => prev - 1)}
              className="p-2 bg-white text-indigo-600 rounded-xl hover:bg-indigo-100 transition-all"
              title="الأسبوع السابق"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
            <button
              onClick={() => {
                setWeekOffset(0);
              }}
              className="px-4 py-2 bg-white text-indigo-600 rounded-xl hover:bg-indigo-100 transition-all text-sm font-medium"
            >
              اليوم
            </button>
            <button
              onClick={() => setWeekOffset(prev => prev + 1)}
              className="p-2 bg-white text-indigo-600 rounded-xl hover:bg-indigo-100 transition-all"
              title="الأسبوع التالي"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              onClick={() => setIsCalendarOpen(true)}
              className="px-6 py-3 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition-all flex items-center gap-2 shadow-sm"
            >
              <Calendar className="w-5 h-5" />
              التقويم الكامل
            </button>
          </div>
        </div>
        
        <div className="grid grid-cols-7 gap-3">
          {(() => {
            const today = new Date();
            today.setHours(0, 0, 0, 0);
            const weekStart = new Date(today);
            weekStart.setDate(today.getDate() - today.getDay() + (weekOffset * 7));
            const weekDays = ["الأحد", "الاثنين", "الثلاثاء", "الأربعاء", "الخميس", "الجمعة", "السبت"];
            
            return [...Array(7)].map((_, i) => {
              const date = new Date(weekStart.getTime());
              date.setDate(weekStart.getDate() + i);
              const dayNum = date.getDate();
              const dayMonth = date.getMonth();
              const dayYear = date.getFullYear();
              const dayName = weekDays[date.getDay()];
              const isToday = date.toDateString() === today.toDateString();
              
              const dayAppointments = appointments.filter(apt => {
                if (!apt.date) return false;
                const aptDate = new Date(apt.date);
                return (
                  aptDate.getDate() === dayNum &&
                  aptDate.getMonth() === dayMonth &&
                  aptDate.getFullYear() === dayYear
                );
              });
              
              return (
                <div 
                  key={i} 
                  onClick={() => {
                    setSelectedDay(date);
                    setShowDayDetailsModal(true);
                  }}
                  className={cn(
                    "relative group cursor-pointer transition-all duration-300",
                    isToday ? "transform scale-105" : "hover:scale-105"
                  )}
                >
                  <div className={cn(
                    "text-center p-5 rounded-2xl transition-all",
                    isToday 
                      ? "bg-indigo-600 text-white shadow-lg" 
                      : "bg-white hover:bg-indigo-50 hover:shadow-md"
                  )}>
                    <p className={cn(
                      "text-xs font-medium mb-2",
                      isToday ? "text-indigo-100" : "text-gray-600"
                    )}>
                      {dayName}
                    </p>
                    <p className={cn(
                      "text-3xl font-bold mb-3",
                      isToday ? "text-white" : "text-gray-900"
                    )}>
                      {dayNum}
                    </p>
                    
                    {dayAppointments.length > 0 ? (
                      <div className="space-y-1">
                        <div className="flex items-center justify-center gap-1 mb-1">
                          {dayAppointments.slice(0, 3).map((apt, idx) => (
                            <div 
                              key={idx} 
                              className={cn(
                                "w-2 h-2 rounded-full",
                                apt.status === "confirmed" ? "bg-blue-400" :
                                apt.status === "pending" ? "bg-yellow-400" :
                                apt.status === "finished" ? "bg-green-400" :
                                "bg-orange-400"
                              )}
                            />
                          ))}
                          {dayAppointments.length > 3 && (
                            <span className={cn(
                              "text-xs font-medium",
                              isToday ? "text-indigo-100" : "text-gray-500"
                            )}>
                              +{dayAppointments.length - 3}
                            </span>
                          )}
                        </div>
                        <p className={cn(
                          "text-xs font-medium",
                          isToday ? "text-indigo-100" : "text-gray-600"
                        )}>
                          {dayAppointments.length} حجز
                        </p>
                      </div>
                    ) : (
                      <p className={cn(
                        "text-xs",
                        isToday ? "text-indigo-200" : "text-gray-400"
                      )}>
                        لا توجد حجوزات
                      </p>
                    )}
                  </div>
                  
                  {isToday && (
                    <div className="absolute -top-2 -right-2">
                      <div className="w-6 h-6 bg-pink-500 rounded-full flex items-center justify-center">
                        <CheckCircle className="w-4 h-4 text-white" />
                      </div>
                    </div>
                  )}
                </div>
              );
            });
          })()}
        </div>
        
        <div className="mt-6 flex items-center justify-center gap-6 text-sm">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-blue-400 rounded-full"></div>
            <span className="text-gray-700">مؤكد</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-yellow-400 rounded-full"></div>
            <span className="text-gray-700">قيد الانتظار</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-green-400 rounded-full"></div>
            <span className="text-gray-700">مكتمل</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-orange-400 rounded-full"></div>
            <span className="text-gray-700">جاري</span>
          </div>
        </div>
      </div>

      {/* Fast Actions - Horizontal and Small */}
      <div className="bg-white rounded-3xl p-4 shadow-sm border border-gray-100">
        <div className="flex items-center gap-3 overflow-x-auto">
          <button
            onClick={() => setIsNewAppointmentModalOpen(true)}
            className="flex items-center gap-2 px-4 py-2 bg-blue-50 text-blue-700 rounded-xl hover:bg-blue-100 transition-all whitespace-nowrap"
          >
            <Plus className="w-4 h-4" />
            <span className="text-sm font-medium">حجز جديد</span>
          </button>

          <button
            onClick={() => setIsNewPatientModalOpen(true)}
            className="flex items-center gap-2 px-4 py-2 bg-green-50 text-green-700 rounded-xl hover:bg-green-100 transition-all whitespace-nowrap"
          >
            <UserPlus className="w-4 h-4" />
            <span className="text-sm font-medium">مريض جديد</span>
          </button>

          <button
            onClick={() => setIsAdvancedSchedulingOpen(true)}
            className="flex items-center gap-2 px-4 py-2 bg-purple-50 text-purple-700 rounded-xl hover:bg-purple-100 transition-all whitespace-nowrap"
          >
            <Calendar className="w-4 h-4" />
            <span className="text-sm font-medium">جدولة متقدمة</span>
          </button>

          <button
            onClick={() => setIsRemindersModalOpen(true)}
            className="flex items-center gap-2 px-4 py-2 bg-orange-50 text-orange-700 rounded-xl hover:bg-orange-100 transition-all whitespace-nowrap"
          >
            <Bell className="w-4 h-4" />
            <span className="text-sm font-medium">التذكيرات</span>
          </button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-bold text-gray-900">
            نظرة عامة على اليوم
          </h3>
          <CalendarDays className="w-6 h-6 text-gray-400" />
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="text-center p-6 bg-blue-50 rounded-3xl border border-blue-100">
            <div className="w-16 h-16 bg-blue-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="w-8 h-8 text-blue-600" />
            </div>
            <p className="text-3xl font-bold text-blue-600 mb-2">
              {todayStats.confirmed}
            </p>
            <p className="text-sm font-medium text-blue-700">مؤكدة</p>
          </div>

          <div className="text-center p-6 bg-green-50 rounded-3xl border border-green-100">
            <div className="w-16 h-16 bg-green-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="w-8 h-8 text-green-600" />
            </div>
            <p className="text-3xl font-bold text-green-600 mb-2">
              {todayStats.finished}
            </p>
            <p className="text-sm font-medium text-green-700">مكتملة</p>
          </div>

          <div className="text-center p-6 bg-yellow-50 rounded-3xl border border-yellow-100">
            <div className="w-16 h-16 bg-yellow-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Timer className="w-8 h-8 text-yellow-600" />
            </div>
            <p className="text-3xl font-bold text-yellow-600 mb-2">
              {todayStats.inProgress}
            </p>
            <p className="text-sm font-medium text-yellow-700">جارية</p>
          </div>

          <div className="text-center p-6 bg-gray-50 rounded-3xl border border-gray-100">
            <div className="w-16 h-16 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Clock className="w-8 h-8 text-gray-600" />
            </div>
            <p className="text-3xl font-bold text-gray-600 mb-2">
              {todayStats.pending}
            </p>
            <p className="text-sm font-medium text-gray-700">في الانتظار</p>
          </div>
        </div>
      </div>

      {/* طلبات الحجز الجديدة - New Booking Requests */}
      {(() => {
        const newBookingRequests = appointments.filter(
          apt => apt.source === "online_booking" && apt.status === "pending"
        );
        
        if (newBookingRequests.length === 0) return null;
        
        return (
          <div className="bg-gradient-to-r from-amber-50 to-orange-50 rounded-3xl p-8 shadow-lg border border-amber-200">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-amber-500 rounded-2xl flex items-center justify-center">
                  <Bell className="w-7 h-7 text-white" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-gray-900">طلبات الحجز الجديدة</h3>
                  <p className="text-amber-700">لديك {newBookingRequests.length} طلب حجز جديد يحتاج موافقة</p>
                </div>
              </div>
              <div className="w-8 h-8 bg-amber-500 text-white rounded-full flex items-center justify-center font-bold">
                {newBookingRequests.length}
              </div>
            </div>
            
            <div className="space-y-4">
              {newBookingRequests.map((request) => {
                const isExpanded = expandedRequestId === request.id;
                
                return (
                  <div 
                    key={request.id} 
                    className="bg-white rounded-2xl border-2 border-amber-200 hover:border-amber-300 transition-all group overflow-hidden"
                  >
                    <div className="p-6">
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex items-start gap-4 flex-1">
                          <div className={cn("w-14 h-14 rounded-2xl flex items-center justify-center font-semibold text-lg", request.color)}>
                            {request.avatar}
                          </div>
                          
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-2">
                              <h4 className="text-lg font-bold text-gray-900">{request.patient}</h4>
                              <span className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-xs font-medium flex items-center gap-1">
                                <Globe className="w-3 h-3" />
                                حجز إلكتروني
                              </span>
                            </div>
                            
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-3">
                              <div className="flex items-center gap-2 text-sm text-gray-600">
                                <Clock className="w-4 h-4 text-amber-600" />
                                <span>{request.time}</span>
                              </div>
                              <div className="flex items-center gap-2 text-sm text-gray-600">
                                <Stethoscope className="w-4 h-4 text-amber-600" />
                                <span>{request.treatment}</span>
                              </div>
                              <div className="flex items-center gap-2 text-sm text-gray-600">
                                <Timer className="w-4 h-4 text-amber-600" />
                                <span>{request.duration}</span>
                              </div>
                              <div className="flex items-center gap-2 text-sm text-gray-600">
                                <Phone className="w-4 h-4 text-amber-600" />
                                <span>{request.phone}</span>
                              </div>
                            </div>
                            
                            <div className="flex items-center gap-3">
                              {request.priority === "عاجل" && (
                                <div className="inline-flex items-center gap-1 px-3 py-1 bg-red-100 text-red-700 rounded-lg text-xs font-medium">
                                  <AlertCircle className="w-3 h-3" />
                                  حالة عاجلة
                                </div>
                              )}
                              <button
                                onClick={() => setExpandedRequestId(isExpanded ? null : request.id)}
                                className="text-sm text-amber-600 hover:text-amber-700 font-medium flex items-center gap-1"
                              >
                                {isExpanded ? "إخفاء التفاصيل" : "عرض المزيد"}
                                <ChevronDown className={cn("w-4 h-4 transition-transform", isExpanded && "rotate-180")} />
                              </button>
                            </div>
                          </div>
                        </div>
                        
                        <div className="flex flex-col gap-2">
                          <button
                            onClick={() => handleOpenNotesModal(request.id, "approve")}
                            className="px-6 py-2 bg-green-600 text-white rounded-xl hover:bg-green-700 hover:scale-105 transition-all flex items-center gap-2 text-sm font-medium shadow-md"
                          >
                            <CheckCircle className="w-4 h-4" />
                            قبول
                          </button>
                          <button
                            onClick={() => {
                              setSelectedPatient({
                                name: request.patient,
                                id: request.id,
                                avatar: request.avatar,
                                age: 30,
                                phone: request.phone,
                                email: request.email,
                              });
                              setIsMedicalModalOpen(true);
                            }}
                            className="px-6 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 hover:scale-105 transition-all flex items-center gap-2 text-sm font-medium shadow-md"
                          >
                            <Edit className="w-4 h-4" />
                            تعديل
                          </button>
                          <button
                            onClick={() => handleOpenNotesModal(request.id, "reject")}
                            className="px-6 py-2 bg-red-600 text-white rounded-xl hover:bg-red-700 hover:scale-105 transition-all flex items-center gap-2 text-sm font-medium shadow-md"
                          >
                            <X className="w-4 h-4" />
                            رفض
                          </button>
                        </div>
                      </div>
                    </div>
                    
                    {/* Expanded Details */}
                    {isExpanded && (
                      <div className="px-6 pb-6 pt-0 border-t border-amber-100">
                        <div className="bg-amber-50 rounded-xl p-4 mt-4">
                          <h5 className="font-semibold text-gray-900 mb-3">معلومات إضافية</h5>
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <p className="text-sm text-gray-600">البريد الإلكتروني</p>
                              <p className="font-medium text-gray-900">{request.email}</p>
                            </div>
                            <div>
                              <p className="text-sm text-gray-600">الأولوية</p>
                              <p className="font-medium text-gray-900">{request.priority}</p>
                            </div>
                            {request.treatmentPlan && (
                              <>
                                <div>
                                  <p className="text-sm text-gray-600">مرحلة العلاج</p>
                                  <p className="font-medium text-gray-900">{request.treatmentPlan.stage}</p>
                                </div>
                                <div>
                                  <p className="text-sm text-gray-600">الوصف</p>
                                  <p className="font-medium text-gray-900">{request.treatmentPlan.description}</p>
                                </div>
                              </>
                            )}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        );
      })()}

      {/* Search and Filter */}
      <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100">
        <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
          <div className="flex flex-col sm:flex-row gap-4 w-full lg:w-auto">
            <div className="relative">
              <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="البحث عن موعد..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-4 pr-12 py-3 bg-gray-50 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent w-full sm:w-64"
              />
            </div>

            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="px-4 py-3 bg-gray-50 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            >
              <option value="all">جميع الحالات</option>
              <option value="confirmed">مؤكد</option>
              <option value="finished">مكتمل</option>
              <option value="in-progress">جاري</option>
              <option value="pending">في الانتظار</option>
            </select>
          </div>
        </div>
      </div>

      {/* Appointments List */}
      <div className="grid gap-6">
        {filteredAppointments.length === 0 ? (
          <div className="bg-white rounded-3xl p-12 text-center">
            <Calendar className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-gray-900 mb-2">لا توجد مواعيد</h3>
            <p className="text-gray-600 mb-6">ابدأ بإضافة موعد جديد</p>
            <button
              onClick={() => setIsNewAppointmentModalOpen(true)}
              className="bg-indigo-600 text-white px-6 py-3 rounded-xl font-medium hover:bg-indigo-700 transition-all inline-flex items-center gap-2"
            >
              <Plus className="w-5 h-5" />
              إضافة موعد
            </button>
          </div>
        ) : (
          filteredAppointments.map((appointment) => (
            <div
              key={appointment.id}
              className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 hover:shadow-lg transition-all group"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4 flex-1">
                  <div
                    className={cn(
                      "w-16 h-16 rounded-2xl flex items-center justify-center font-semibold text-lg",
                      appointment.color
                    )}
                  >
                    {appointment.avatar}
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-bold text-gray-900 mb-1">
                      {appointment.patient}
                    </h3>
                    <div className="flex items-center gap-3 text-sm text-gray-600">
                      <span className="flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        {appointment.time}
                      </span>
                      <span>•</span>
                      <span>{appointment.treatment}</span>
                      <span>•</span>
                      <span>{appointment.duration}</span>
                    </div>
                    <div className="flex items-center gap-2 mt-2">
                      {getStatusBadge(appointment.status)}
                      {getPriorityBadge(appointment.priority)}
                      {appointment.source === "online_booking" && (
                        <span className="inline-flex items-center gap-1 px-2 py-1 rounded-lg text-xs font-medium bg-purple-100 text-purple-700">
                          <Globe className="w-3 h-3" />
                          حجز إلكتروني
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => {
                      setSelectedPatient({
                        name: appointment.patient,
                        id: appointment.id,
                        avatar: appointment.avatar,
                        age: 30,
                        phone: appointment.phone,
                        email: appointment.email,
                      });
                      setIsMedicalModalOpen(true);
                    }}
                    className="p-2 text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-xl transition-all"
                  >
                    <Eye className="w-5 h-5" />
                  </button>
                  <button className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-xl transition-all">
                    <MoreHorizontal className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Calendar Modal */}
      <InteractiveCalendar
        isOpen={isCalendarOpen}
        onClose={() => setIsCalendarOpen(false)}
        appointments={filteredAppointments.map((apt, index) => ({
          id: typeof apt.id === 'number' ? apt.id : index + 1,
          date: apt.date,
          time: apt.time,
          patient: apt.patient,
          treatment: apt.treatment,
          duration: apt.duration,
          status: apt.status,
          avatar: apt.avatar,
          color: apt.color,
          phone: apt.phone,
          email: apt.email,
          priority: apt.priority,
          source: apt.source,
          treatmentPlan: apt.treatmentPlan || {
            stage: "مرحلة العلاج",
            stepType: "treatment" as "treatment" | "consultation" | "examination" | "follow-up",
            description: "لا توجد ملاحظات",
            progress: 25,
          }
        }))}
        onAddAppointment={(date) => {
          setIsCalendarOpen(false);
          setNewAppointmentData(prev => ({
            ...prev,
            date: date ? date.toISOString().split('T')[0] : ""
          }));
          setIsNewAppointmentModalOpen(true);
        }}
      />

      {/* Medical Checkup Modal */}
      <ModernMedicalCheckupModal
        isOpen={isMedicalModalOpen}
        onClose={() => {
          setIsMedicalModalOpen(false);
          setSelectedPatient(null);
        }}
        patient={selectedPatient}
      />

      {/* New Appointment Modal */}
      {isNewAppointmentModalOpen && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50"
          dir="rtl"
        >
          <div className="bg-white rounded-3xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl border border-gray-200">
            <div className="sticky top-0 bg-gradient-to-r from-blue-600 to-indigo-600 p-6 rounded-t-3xl text-white z-10">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-bold mb-2">إضافة موعد جديد</h2>
                  <p className="text-blue-100">
                    جدولة موعد جديد للمريض
                  </p>
                </div>
                <button
                  onClick={() => setIsNewAppointmentModalOpen(false)}
                  className="p-2 hover:bg-white/20 rounded-xl transition-all"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
            </div>

            <div className="p-8">
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    المريض *
                  </label>
                  <select
                    value={newAppointmentData.patientId}
                    onChange={(e) => {
                      const patient = patients.find(p => p.id === e.target.value);
                      setNewAppointmentData({
                        ...newAppointmentData,
                        patientId: e.target.value,
                        patientName: patient?.name || "",
                      });
                    }}
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">اختر المريض</option>
                    {patients.map((patient) => (
                      <option key={patient.id} value={patient.id}>
                        {patient.name} - {patient.phone}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      التاريخ *
                    </label>
                    <input
                      type="date"
                      value={newAppointmentData.date}
                      onChange={(e) =>
                        setNewAppointmentData({
                          ...newAppointmentData,
                          date: e.target.value,
                        })
                      }
                      className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      الوقت *
                    </label>
                    <input
                      type="time"
                      value={newAppointmentData.time}
                      onChange={(e) =>
                        setNewAppointmentData({
                          ...newAppointmentData,
                          time: e.target.value,
                        })
                      }
                      className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      نوع العلاج
                    </label>
                    <input
                      type="text"
                      value={newAppointmentData.treatment}
                      onChange={(e) =>
                        setNewAppointmentData({
                          ...newAppointmentData,
                          treatment: e.target.value,
                        })
                      }
                      className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="فحص عام، تنظيف..."
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      المدة (دقيقة)
                    </label>
                    <select
                      value={newAppointmentData.duration}
                      onChange={(e) =>
                        setNewAppointmentData({
                          ...newAppointmentData,
                          duration: e.target.value,
                        })
                      }
                      className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="15">15 دقيقة</option>
                      <option value="30">30 دقيقة</option>
                      <option value="45">45 دقيقة</option>
                      <option value="60">60 دقيقة</option>
                      <option value="90">90 دقيقة</option>
                      <option value="120">120 دقيقة</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    ملاحظات
                  </label>
                  <textarea
                    value={newAppointmentData.notes}
                    onChange={(e) =>
                      setNewAppointmentData({
                        ...newAppointmentData,
                        notes: e.target.value,
                      })
                    }
                    rows={3}
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                    placeholder="ملاحظات خاصة بالموعد..."
                  />
                </div>
              </div>

              <div className="flex gap-4 mt-8 pt-6 border-t border-gray-200">
                <button
                  onClick={handleSaveNewAppointment}
                  className="flex-1 bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-3 px-6 rounded-xl font-medium hover:from-blue-700 hover:to-indigo-700 transition-all flex items-center justify-center gap-2"
                >
                  <Save className="w-5 h-5" />
                  حفظ الموعد
                </button>
                <button
                  onClick={() => setIsNewAppointmentModalOpen(false)}
                  className="flex-1 bg-gray-500 text-white py-3 px-6 rounded-xl font-medium hover:bg-gray-600 transition-all"
                >
                  إلغاء
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* New Patient Modal */}
      {isNewPatientModalOpen && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50"
          dir="rtl"
        >
          <div className="bg-white rounded-3xl w-full max-w-4xl max-h-[90vh] overflow-y-auto shadow-2xl border border-gray-200">
            <div className="sticky top-0 bg-gradient-to-r from-green-600 to-emerald-600 p-6 rounded-t-3xl text-white z-10">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-bold mb-2">تسجيل مريض جديد</h2>
                  <p className="text-green-100">
                    إضافة بيانات مريض جديد إلى النظام
                  </p>
                </div>
                <button
                  onClick={() => setIsNewPatientModalOpen(false)}
                  className="p-2 hover:bg-white/20 rounded-xl transition-all"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
            </div>

            <div className="p-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Personal Information */}
                <div className="space-y-6">
                  <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                    <User className="w-5 h-5 text-green-600" />
                    المعلومات الشخصية
                  </h3>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        الاسم الأول
                      </label>
                      <input
                        type="text"
                        value={newPatientData.firstName}
                        onChange={(e) =>
                          setNewPatientData({
                            ...newPatientData,
                            firstName: e.target.value,
                          })
                        }
                        className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500"
                        placeholder="أدخل الاسم الأول"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        اسم العائلة
                      </label>
                      <input
                        type="text"
                        value={newPatientData.lastName}
                        onChange={(e) =>
                          setNewPatientData({
                            ...newPatientData,
                            lastName: e.target.value,
                          })
                        }
                        className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500"
                        placeholder="أدخل اسم العائلة"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      رقم الهاتف
                    </label>
                    <input
                      type="tel"
                      value={newPatientData.phone}
                      onChange={(e) =>
                        setNewPatientData({
                          ...newPatientData,
                          phone: e.target.value,
                        })
                      }
                      className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500"
                      placeholder="07801234567"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      البريد الإلكتروني
                    </label>
                    <input
                      type="email"
                      value={newPatientData.email}
                      onChange={(e) =>
                        setNewPatientData({
                          ...newPatientData,
                          email: e.target.value,
                        })
                      }
                      className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500"
                      placeholder="example@email.com"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        تاريخ الميلاد
                      </label>
                      <input
                        type="date"
                        value={newPatientData.birthDate}
                        onChange={(e) =>
                          setNewPatientData({
                            ...newPatientData,
                            birthDate: e.target.value,
                          })
                        }
                        className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        الجنس
                      </label>
                      <select
                        value={newPatientData.gender}
                        onChange={(e) =>
                          setNewPatientData({
                            ...newPatientData,
                            gender: e.target.value,
                          })
                        }
                        className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500"
                      >
                        <option value="">اختر الجنس</option>
                        <option value="male">ذكر</option>
                        <option value="female">أنثى</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      العنوان
                    </label>
                    <input
                      type="text"
                      value={newPatientData.address}
                      onChange={(e) =>
                        setNewPatientData({
                          ...newPatientData,
                          address: e.target.value,
                        })
                      }
                      className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500"
                      placeholder="العنوان كاملاً"
                    />
                  </div>
                </div>

                {/* Medical Information */}
                <div className="space-y-6">
                  <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                    <Stethoscope className="w-5 h-5 text-green-600" />
                    المعلومات الطبية
                  </h3>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      التاريخ المرضي
                    </label>
                    <textarea
                      value={newPatientData.medicalHistory}
                      onChange={(e) =>
                        setNewPatientData({
                          ...newPatientData,
                          medicalHistory: e.target.value,
                        })
                      }
                      rows={4}
                      className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 resize-none"
                      placeholder="أمراض سابقة، حساسية، أدوية..."
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      جهة الاتصال الطارئة
                    </label>
                    <input
                      type="text"
                      value={newPatientData.emergencyContact}
                      onChange={(e) =>
                        setNewPatientData({
                          ...newPatientData,
                          emergencyContact: e.target.value,
                        })
                      }
                      className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500"
                      placeholder="اسم جهة الاتصال"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      رقم هاتف الطوارئ
                    </label>
                    <input
                      type="tel"
                      value={newPatientData.emergencyPhone}
                      onChange={(e) =>
                        setNewPatientData({
                          ...newPatientData,
                          emergencyPhone: e.target.value,
                        })
                      }
                      className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500"
                      placeholder="07801234567"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      ملاحظات إضافية
                    </label>
                    <textarea
                      value={newPatientData.notes}
                      onChange={(e) =>
                        setNewPatientData({
                          ...newPatientData,
                          notes: e.target.value,
                        })
                      }
                      rows={4}
                      className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 resize-none"
                      placeholder="ملاحظات خاصة بالمريض..."
                    />
                  </div>
                </div>
              </div>

              <div className="flex gap-4 mt-8 pt-6 border-t border-gray-200">
                <button
                  onClick={handleSaveNewPatient}
                  className="flex-1 bg-gradient-to-r from-green-600 to-emerald-600 text-white py-3 px-6 rounded-xl font-medium hover:from-green-700 hover:to-emerald-700 transition-all flex items-center justify-center gap-2"
                >
                  <Save className="w-5 h-5" />
                  حفظ المريض
                </button>
                <button
                  onClick={() => setIsNewPatientModalOpen(false)}
                  className="flex-1 bg-gray-500 text-white py-3 px-6 rounded-xl font-medium hover:bg-gray-600 transition-all"
                >
                  إلغاء
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Advanced Scheduling Modal */}
      {isAdvancedSchedulingOpen && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50"
          dir="rtl"
          onClick={() => setIsAdvancedSchedulingOpen(false)}
        >
          <div className="bg-white rounded-3xl w-full max-w-6xl max-h-[90vh] overflow-y-auto shadow-2xl border border-gray-200" onClick={(e) => e.stopPropagation()}>
            <div className="sticky top-0 bg-gradient-to-r from-purple-600 to-indigo-600 p-6 rounded-t-3xl text-white z-10">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-bold mb-2">الجدولة المتقدمة</h2>
                  <p className="text-purple-100">
                    إدارة المواعيد والجدول الزمني للعيادة
                  </p>
                </div>
                <button
                  onClick={() => setIsAdvancedSchedulingOpen(false)}
                  className="p-2 hover:bg-white/20 rounded-xl transition-all"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
            </div>

            <div className="p-8">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
                <div className="bg-gradient-to-br from-blue-50 to-indigo-50 p-6 rounded-2xl border border-blue-100">
                  <div className="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center mb-4">
                    <CalendarIcon className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-lg font-bold text-gray-900 mb-2">
                    جدولة سريعة
                  </h3>
                  <p className="text-gray-600 text-sm mb-4">
                    إنشاء مواعيد جديدة بسرعة
                  </p>
                  <button
                    onClick={() => {
                      setIsAdvancedSchedulingOpen(false);
                      setIsNewAppointmentModalOpen(true);
                    }}
                    className="w-full bg-blue-600 text-white py-2 px-4 rounded-xl hover:bg-blue-700 transition-all"
                  >
                    بدء الجدولة
                  </button>
                </div>

                <div className="bg-gradient-to-br from-green-50 to-emerald-50 p-6 rounded-2xl border border-green-100">
                  <div className="w-12 h-12 bg-green-600 rounded-xl flex items-center justify-center mb-4">
                    <Repeat className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-lg font-bold text-gray-900 mb-2">
                    المواعيد المتكررة
                  </h3>
                  <p className="text-gray-600 text-sm mb-4">
                    جدولة مواعيد دورية للعلاج الطويل
                  </p>
                  <button className="w-full bg-green-600 text-white py-2 px-4 rounded-xl hover:bg-green-700 transition-all">
                    إعداد تكرار
                  </button>
                </div>

                <div className="bg-gradient-to-br from-purple-50 to-pink-50 p-6 rounded-2xl border border-purple-100">
                  <div className="w-12 h-12 bg-purple-600 rounded-xl flex items-center justify-center mb-4">
                    <Settings className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-lg font-bold text-gray-900 mb-2">
                    إعدادات الجدول
                  </h3>
                  <p className="text-gray-600 text-sm mb-4">
                    تخصيص أوقات العمل والفترات
                  </p>
                  <button className="w-full bg-purple-600 text-white py-2 px-4 rounded-xl hover:bg-purple-700 transition-all">
                    إدارة الإعدادات
                  </button>
                </div>
              </div>

              <div className="bg-gray-50 rounded-2xl p-6 mb-6">
                <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <Clock className="w-5 h-5 text-purple-600" />
                  إدارة الفترات الزمنية
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-7 gap-4">
                  {["الأحد", "الاثنين", "الثلاثاء", "الأربعاء", "الخميس", "الجمعة", "السبت"].map((day, index) => (
                    <div
                      key={index}
                      className="bg-white p-4 rounded-xl border border-gray-200"
                    >
                      <h4 className="font-semibold text-gray-900 mb-3 text-center">
                        {day}
                      </h4>
                      <div className="space-y-2">
                        <div className="flex items-center justify-between text-xs">
                          <span>الفترة الصباحية</span>
                          <span className="text-green-600">8:00 - 12:00</span>
                        </div>
                        <div className="flex items-center justify-between text-xs">
                          <span>الفترة المسائية</span>
                          <span className="text-blue-600">14:00 - 18:00</span>
                        </div>
                        <button className="w-full text-xs text-purple-600 hover:text-purple-800 transition-all">
                          تعديل الأوقات
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-white border border-gray-200 rounded-2xl p-6">
                <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <FileText className="w-5 h-5 text-purple-600" />
                  قوالب المواعيد السريعة
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {[
                    { name: "فحص عام", duration: "30 دقيقة", desc: "فحص روتيني شامل للأسنان", color: "blue" },
                    { name: "تنظيف الأسنان", duration: "45 دقيقة", desc: "تنظيف وتلميع الأسنان", color: "green" },
                    { name: "زراعة الأسنان", duration: "120 دقيقة", desc: "عملية زراعة كاملة", color: "purple" },
                  ].map((template, index) => (
                    <div key={index} className={`p-4 bg-${template.color}-50 rounded-xl border border-${template.color}-100`}>
                      <h4 className={`font-semibold text-${template.color}-900 mb-2`}>
                        {template.name}
                      </h4>
                      <p className={`text-sm text-${template.color}-700 mb-2`}>{template.duration}</p>
                      <p className={`text-xs text-${template.color}-600`}>
                        {template.desc}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Reminders Modal */}
      {isRemindersModalOpen && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50"
          dir="rtl"
          onClick={() => setIsRemindersModalOpen(false)}
        >
          <div className="bg-white rounded-3xl w-full max-w-5xl max-h-[90vh] overflow-y-auto shadow-2xl border border-gray-200" onClick={(e) => e.stopPropagation()}>
            <div className="sticky top-0 bg-gradient-to-r from-orange-600 to-red-600 p-6 rounded-t-3xl text-white z-10">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-bold mb-2">إدارة التذكيرات</h2>
                  <p className="text-orange-100">
                    تنظيم وإرسال التنبيهات للمرضى والطاقم الطبي
                  </p>
                </div>
                <button
                  onClick={() => setIsRemindersModalOpen(false)}
                  className="p-2 hover:bg-white/20 rounded-xl transition-all"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
            </div>

            <div className="p-8">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-4 rounded-2xl border border-blue-200">
                  <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center mb-3">
                    <MessageSquare className="w-5 h-5 text-white" />
                  </div>
                  <h3 className="font-semibold text-blue-900 mb-1">
                    رسائل نصية
                  </h3>
                  <p className="text-xs text-blue-700">تذكيرات عبر SMS</p>
                </div>

                <div className="bg-gradient-to-br from-green-50 to-green-100 p-4 rounded-2xl border border-green-200">
                  <div className="w-10 h-10 bg-green-600 rounded-xl flex items-center justify-center mb-3">
                    <Phone className="w-5 h-5 text-white" />
                  </div>
                  <h3 className="font-semibold text-green-900 mb-1">
                    مكالمات هاتفية
                  </h3>
                  <p className="text-xs text-green-700">تذكيرات صوتية</p>
                </div>

                <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-4 rounded-2xl border border-purple-200">
                  <div className="w-10 h-10 bg-purple-600 rounded-xl flex items-center justify-center mb-3">
                    <Mail className="w-5 h-5 text-white" />
                  </div>
                  <h3 className="font-semibold text-purple-900 mb-1">
                    بريد إلكتروني
                  </h3>
                  <p className="text-xs text-purple-700">تذكيرات مفصلة</p>
                </div>

                <div className="bg-gradient-to-br from-orange-50 to-orange-100 p-4 rounded-2xl border border-orange-200">
                  <div className="w-10 h-10 bg-orange-600 rounded-xl flex items-center justify-center mb-3">
                    <Smartphone className="w-5 h-5 text-white" />
                  </div>
                  <h3 className="font-semibold text-orange-900 mb-1">
                    إشعارات التطبيق
                  </h3>
                  <p className="text-xs text-orange-700">تنبيهات فورية</p>
                </div>
              </div>

              <div className="bg-gray-50 rounded-2xl p-6 mb-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                    <AlarmClock className="w-5 h-5 text-orange-600" />
                    التذكيرات المجدولة
                  </h3>
                  <button className="bg-orange-600 text-white px-4 py-2 rounded-xl hover:bg-orange-700 transition-all flex items-center gap-2">
                    <Plus className="w-4 h-4" />
                    تذكير جديد
                  </button>
                </div>

                <div className="space-y-4">
                  {filteredAppointments.filter(apt => apt.status !== "finished").slice(0, 3).map((apt, index) => (
                    <div key={index} className="bg-white p-4 rounded-xl border border-gray-200 flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                          <MessageSquare className="w-6 h-6 text-blue-600" />
                        </div>
                        <div>
                          <h4 className="font-semibold text-gray-900">
                            تذكير موعد - {apt.patient}
                          </h4>
                          <p className="text-sm text-gray-600">
                            موعد {apt.treatment} - {apt.time}
                          </p>
                          <p className="text-xs text-blue-600">
                            سيتم الإرسال قبل 24 ساعة
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-medium">
                          مجدول
                        </span>
                        <button className="p-2 text-gray-400 hover:text-gray-600 rounded-lg">
                          <Edit className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-white border border-gray-200 rounded-2xl p-6">
                  <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                    <Settings className="w-5 h-5 text-orange-600" />
                    إعدادات التذكيرات
                  </h3>

                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
                      <div>
                        <p className="font-medium text-gray-900">التذكير التلقائي</p>
                        <p className="text-xs text-gray-600">إرسال تذكيرات تلقائية للمواعيد</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input type="checkbox" className="sr-only peer" defaultChecked />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-orange-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-orange-600"></div>
                      </label>
                    </div>

                    <div className="p-3 bg-gray-50 rounded-xl">
                      <p className="font-medium text-gray-900 mb-2">وقت الإرسال</p>
                      <select className="w-full px-4 py-2 bg-white border border-gray-200 rounded-lg">
                        <option>24 ساعة قبل الموعد</option>
                        <option>12 ساعة قبل الموعد</option>
                        <option>6 ساعات قبل الموعد</option>
                        <option>ساعة واحدة قبل الموعد</option>
                      </select>
                    </div>
                  </div>
                </div>

                <div className="bg-white border border-gray-200 rounded-2xl p-6">
                  <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                    <Bell className="w-5 h-5 text-orange-600" />
                    قوالب الرسائل
                  </h3>

                  <div className="space-y-3">
                    <div className="p-3 bg-blue-50 rounded-xl border border-blue-100">
                      <p className="text-sm font-medium text-blue-900 mb-1">تذكير موعد عام</p>
                      <p className="text-xs text-blue-700">
                        "عزيزي/عزيزتي [الاسم]، نذكركم بموعدكم غداً الساعة [الوقت] لـ [العلاج]"
                      </p>
                    </div>

                    <div className="p-3 bg-green-50 rounded-xl border border-green-100">
                      <p className="text-sm font-medium text-green-900 mb-1">تأكيد الحضور</p>
                      <p className="text-xs text-green-700">
                        "الرجاء تأكيد حضوركم للموعد المحدد أو الاتصال لإعادة الجدولة"
                      </p>
                    </div>

                    <div className="p-3 bg-purple-50 rounded-xl border border-purple-100">
                      <p className="text-sm font-medium text-purple-900 mb-1">تذكير متابعة</p>
                      <p className="text-xs text-purple-700">
                        "حان موعد جلسة المتابعة بعد [العلاج]. الرجاء حجز موعد"
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Notes Modal for Approve/Reject */}
      {showNotesModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50" dir="rtl">
          <div className="bg-white rounded-3xl w-full max-w-lg shadow-2xl border border-gray-200 overflow-hidden">
            <div className={cn(
              "p-6 text-white",
              selectedActionType === "approve" 
                ? "bg-gradient-to-r from-green-600 to-emerald-600" 
                : "bg-gradient-to-r from-red-600 to-rose-600"
            )}>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  {selectedActionType === "approve" ? (
                    <CheckCircle className="w-8 h-8" />
                  ) : (
                    <X className="w-8 h-8" />
                  )}
                  <div>
                    <h3 className="text-xl font-bold">
                      {selectedActionType === "approve" ? "تأكيد الموافقة" : "تأكيد الرفض"}
                    </h3>
                    <p className="text-sm opacity-90">
                      {selectedActionType === "approve" 
                        ? "يمكنك إضافة ملاحظات للموعد المؤكد (اختياري)" 
                        : "يرجى توضيح سبب الرفض (اختياري)"}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => {
                    setShowNotesModal(false);
                    setActionNotes("");
                    setSelectedRequestId(null);
                    setSelectedActionType(null);
                  }}
                  className="p-2 hover:bg-white/20 rounded-xl transition-all"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {selectedActionType === "approve" ? "ملاحظات الموافقة" : "سبب الرفض"}
                </label>
                <textarea
                  value={actionNotes}
                  onChange={(e) => setActionNotes(e.target.value)}
                  placeholder={selectedActionType === "approve" 
                    ? "أضف أي ملاحظات للموعد..." 
                    : "اكتب سبب رفض الطلب..."}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent resize-none"
                  rows={4}
                />
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => {
                    setShowNotesModal(false);
                    setActionNotes("");
                    setSelectedRequestId(null);
                    setSelectedActionType(null);
                  }}
                  className="flex-1 px-6 py-3 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition-all font-medium"
                >
                  إلغاء
                </button>
                <button
                  onClick={handleConfirmAction}
                  className={cn(
                    "flex-1 px-6 py-3 text-white rounded-xl transition-all font-medium flex items-center justify-center gap-2",
                    selectedActionType === "approve"
                      ? "bg-green-600 hover:bg-green-700"
                      : "bg-red-600 hover:bg-red-700"
                  )}
                >
                  {selectedActionType === "approve" ? (
                    <>
                      <CheckCircle className="w-5 h-5" />
                      تأكيد الموافقة
                    </>
                  ) : (
                    <>
                      <X className="w-5 h-5" />
                      تأكيد الرفض
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Day Details Modal */}
      {showDayDetailsModal && selectedDay && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={() => setShowDayDetailsModal(false)}>
          <div className="bg-white rounded-3xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden" onClick={(e) => e.stopPropagation()}>
            {/* Header */}
            <div className="bg-gradient-to-r from-indigo-600 to-purple-600 p-6 text-white">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center">
                    <Calendar className="w-7 h-7" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold">
                      {selectedDay.toLocaleDateString('ar-IQ', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
                    </h3>
                    <p className="text-indigo-100 mt-1">
                      {(() => {
                        const dayAppointments = appointments.filter(apt => {
                          if (!apt.date) return false;
                          const aptDate = new Date(apt.date);
                          return aptDate.toDateString() === selectedDay.toDateString();
                        });
                        return dayAppointments.length > 0 
                          ? `${dayAppointments.length} موعد مجدول` 
                          : "لا توجد مواعيد";
                      })()}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setShowDayDetailsModal(false)}
                  className="p-2 hover:bg-white/20 rounded-xl transition-all"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
            </div>

            {/* Content */}
            <div className="p-6 overflow-y-auto max-h-[calc(90vh-180px)]">
              {(() => {
                const dayAppointments = appointments.filter(apt => {
                  if (!apt.date) return false;
                  const aptDate = new Date(apt.date);
                  return aptDate.toDateString() === selectedDay.toDateString();
                });

                if (dayAppointments.length === 0) {
                  return (
                    <div className="text-center py-12">
                      <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Calendar className="w-10 h-10 text-gray-400" />
                      </div>
                      <h4 className="text-xl font-semibold text-gray-900 mb-2">لا توجد مواعيد</h4>
                      <p className="text-gray-600 mb-6">لا توجد مواعيد مجدولة في هذا اليوم</p>
                      <button
                        onClick={() => {
                          setShowDayDetailsModal(false);
                          setIsNewAppointmentModalOpen(true);
                        }}
                        className="px-6 py-3 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition-all flex items-center gap-2 mx-auto"
                      >
                        <Plus className="w-4 h-4" />
                        إضافة موعد جديد
                      </button>
                    </div>
                  );
                }

                return (
                  <div className="space-y-4">
                    <div className="flex items-center justify-between mb-4">
                      <h4 className="text-lg font-semibold text-gray-900">المواعيد المجدولة</h4>
                      <button
                        onClick={() => {
                          setShowDayDetailsModal(false);
                          setIsNewAppointmentModalOpen(true);
                        }}
                        className="px-4 py-2 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition-all flex items-center gap-2 text-sm"
                      >
                        <Plus className="w-4 h-4" />
                        إضافة موعد
                      </button>
                    </div>

                    {dayAppointments.map((apt) => (
                      <div key={apt.id} className="bg-gradient-to-r from-gray-50 to-white rounded-2xl p-5 border border-gray-100 hover:shadow-lg transition-all">
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex items-center gap-4">
                            <div className={cn("w-12 h-12 rounded-2xl flex items-center justify-center text-white font-bold", apt.color)}>
                              {apt.avatar}
                            </div>
                            <div>
                              <h5 className="font-semibold text-gray-900">{apt.patient}</h5>
                              <p className="text-sm text-gray-600">{apt.treatment}</p>
                            </div>
                          </div>
                          <div className={cn(
                            "px-3 py-1 rounded-lg text-xs font-medium flex items-center gap-1",
                            apt.status === "confirmed" ? "bg-blue-100 text-blue-700" :
                            apt.status === "pending" ? "bg-yellow-100 text-yellow-700" :
                            apt.status === "finished" ? "bg-green-100 text-green-700" :
                            "bg-orange-100 text-orange-700"
                          )}>
                            {apt.status === "confirmed" && <CheckCircle className="w-3 h-3" />}
                            {apt.status === "pending" && <Clock className="w-3 h-3" />}
                            {apt.status === "finished" && <CheckCircle className="w-3 h-3" />}
                            {apt.status === "in-progress" && <Timer className="w-3 h-3" />}
                            {apt.status === "confirmed" ? "مؤكد" :
                             apt.status === "pending" ? "قيد الانتظار" :
                             apt.status === "finished" ? "مكتمل" : "جاري"}
                          </div>
                        </div>
                        <div className="flex items-center gap-6 text-sm text-gray-600">
                          <div className="flex items-center gap-2">
                            <Clock className="w-4 h-4" />
                            <span>{apt.time}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Timer className="w-4 h-4" />
                            <span>{apt.duration}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Phone className="w-4 h-4" />
                            <span>{apt.phone}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                );
              })()}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Reservations;
