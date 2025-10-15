import React, { useState, useEffect } from "react";
import {
  ChevronLeft,
  ChevronRight,
  Calendar,
  Clock,
  User,
  Stethoscope,
  ClipboardList,
  Phone,
  Mail,
  Star,
  AlertCircle,
  CheckCircle,
  Timer,
  ArrowRight,
  ArrowLeft,
  X,
  MapPin,
  Activity,
  Pill,
  Zap,
  Shield,
  Plus,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface Appointment {
  id: number;
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
  treatmentPlan: {
    stage: string;
    stepType: "consultation" | "examination" | "treatment" | "follow-up";
    description: string;
    progress: number;
    nextStep?: string;
  };
}

interface HorizontalInteractiveCalendarProps {
  isOpen: boolean;
  onClose: () => void;
  appointments: Appointment[];
}

const monthNames = [
  "يناير", "فبراير", "مارس", "أبريل", "مايو", "يونيو",
  "يوليو", "أغسطس", "سبتمبر", "أكتوبر", "نوفمبر", "ديسمبر"
];

const dayNames = ["الأحد", "الإثنين", "الثلاثاء", "الأربعاء", "الخميس", "الجمعة", "السبت"];
const dayNamesShort = ["ح", "ن", "ث", "ر", "خ", "ج", "س"];

const treatmentSteps = {
  consultation: { icon: User, color: "bg-blue-500", name: "استشارة" },
  examination: { icon: Stethoscope, color: "bg-green-500", name: "فحص" },
  treatment: { icon: Pill, color: "bg-purple-500", name: "علاج" },
  "follow-up": { icon: Activity, color: "bg-orange-500", name: "متابعة" }
};

const HorizontalInteractiveCalendar: React.FC<HorizontalInteractiveCalendarProps> = ({
  isOpen,
  onClose,
  appointments
}) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [weekOffset, setWeekOffset] = useState(0);

  if (!isOpen) return null;

  // Generate 7 days starting from the current week
  const getWeekDays = () => {
    const today = new Date();
    const startOfWeek = new Date(today);
    startOfWeek.setDate(today.getDate() - today.getDay() + (weekOffset * 7));
    
    const days = [];
    for (let i = 0; i < 7; i++) {
      const day = new Date(startOfWeek);
      day.setDate(startOfWeek.getDate() + i);
      days.push(day);
    }
    return days;
  };

  const getAppointmentsForDate = (date: Date) => {
    const dateStr = date.toDateString();
    return appointments.filter(apt => {
      // For demo purposes, distribute appointments across different dates
      const appointmentDate = new Date();
      appointmentDate.setDate(appointmentDate.getDate() + (apt.id % 10) - 5);
      return appointmentDate.toDateString() === dateStr;
    });
  };

  const hasAppointments = (date: Date) => {
    return getAppointmentsForDate(date).length > 0;
  };

  const navigateWeek = (direction: 'prev' | 'next') => {
    setWeekOffset(prev => direction === 'prev' ? prev - 1 : prev + 1);
  };

  const goToToday = () => {
    setWeekOffset(0);
    setSelectedDate(new Date());
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "confirmed":
        return (
          <span className="inline-flex items-center gap-1 px-2 py-1 rounded-lg text-xs font-medium bg-blue-100 text-blue-700">
            <CheckCircle className="w-3 h-3" />
            مؤكد
          </span>
        );
      case "finished":
        return (
          <span className="inline-flex items-center gap-1 px-2 py-1 rounded-lg text-xs font-medium bg-green-100 text-green-700">
            <CheckCircle className="w-3 h-3" />
            مكتمل
          </span>
        );
      case "in-progress":
        return (
          <span className="inline-flex items-center gap-1 px-2 py-1 rounded-lg text-xs font-medium bg-yellow-100 text-yellow-700">
            <Timer className="w-3 h-3" />
            جاري
          </span>
        );
      case "pending":
        return (
          <span className="inline-flex items-center gap-1 px-2 py-1 rounded-lg text-xs font-medium bg-gray-100 text-gray-700">
            <Clock className="w-3 h-3" />
            انتظار
          </span>
        );
      default:
        return null;
    }
  };

  const getTreatmentIcon = (stepType: string) => {
    const step = treatmentSteps[stepType as keyof typeof treatmentSteps];
    if (!step) return { icon: ClipboardList, color: "bg-gray-500", name: "غير محدد" };
    return step;
  };

  const weekDays = getWeekDays();
  const selectedDateAppointments = getAppointmentsForDate(selectedDate);
  const today = new Date();

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-7xl max-h-[95vh] overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 p-6 text-white relative overflow-hidden">
          <div className="absolute inset-0 bg-black/10"></div>
          <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-16 translate-x-16"></div>
          <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/10 rounded-full translate-y-12 -translate-x-12"></div>
          
          <div className="relative z-10 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center">
                <Calendar className="w-6 h-6" />
              </div>
              <div>
                <h2 className="text-2xl font-bold">التقويم التفاعلي</h2>
                <p className="text-indigo-100">عرض أسبوعي للمواعيد والحجوزات</p>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <button
                onClick={goToToday}
                className="px-4 py-2 bg-white/20 backdrop-blur-sm text-white rounded-xl hover:bg-white/30 transition-all text-sm font-medium"
              >
                اليوم
              </button>
              
              <button
                onClick={onClose}
                className="p-2 hover:bg-white/20 rounded-xl transition-all"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
          </div>
        </div>

        <div className="p-6">
          {/* Week Navigation */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-4">
              <h3 className="text-2xl font-bold text-gray-900">
                الأسبوع {weekDays[0].getDate()} - {weekDays[6].getDate()} {monthNames[weekDays[0].getMonth()]} {weekDays[0].getFullYear()}
              </h3>
              <div className="text-sm text-gray-600 bg-gray-100 px-3 py-1 rounded-lg">
                {selectedDateAppointments.length} موعد في اليوم المحدد
              </div>
            </div>
            
            <div className="flex gap-2">
              <button
                onClick={() => navigateWeek('prev')}
                className="p-2 hover:bg-gray-100 rounded-xl transition-all"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
              <button
                onClick={() => navigateWeek('next')}
                className="p-2 hover:bg-gray-100 rounded-xl transition-all"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Horizontal Days Display */}
          <div className="bg-gray-50 rounded-2xl p-4 mb-6">
            <div className="grid grid-cols-7 gap-2">
              {weekDays.map((day, index) => {
                const isToday = day.toDateString() === today.toDateString();
                const isSelected = day.toDateString() === selectedDate.toDateString();
                const dayAppointments = getAppointmentsForDate(day);
                const hasApts = dayAppointments.length > 0;

                return (
                  <div
                    key={index}
                    onClick={() => setSelectedDate(day)}
                    className={cn(
                      "relative cursor-pointer transition-all duration-300 rounded-2xl p-4 text-center group hover:scale-105",
                      isSelected 
                        ? "bg-gradient-to-br from-indigo-500 to-purple-600 text-white shadow-xl transform scale-105" 
                        : isToday 
                          ? "bg-gradient-to-br from-blue-100 to-indigo-100 text-indigo-700 border-2 border-indigo-200" 
                          : "bg-white text-gray-700 hover:bg-gray-100 border border-gray-200"
                    )}
                  >
                    {/* Day Name */}
                    <div className={cn(
                      "text-xs font-semibold mb-2",
                      isSelected ? "text-white/80" : isToday ? "text-indigo-600" : "text-gray-500"
                    )}>
                      {dayNames[day.getDay()]}
                    </div>
                    
                    {/* Day Number */}
                    <div className={cn(
                      "text-2xl font-bold mb-2",
                      isSelected ? "text-white" : isToday ? "text-indigo-700" : "text-gray-900"
                    )}>
                      {day.getDate()}
                    </div>

                    {/* Appointments Count */}
                    {hasApts && (
                      <div className={cn(
                        "text-xs px-2 py-1 rounded-full font-medium",
                        isSelected 
                          ? "bg-white/20 text-white" 
                          : "bg-indigo-100 text-indigo-700"
                      )}>
                        {dayAppointments.length} موعد
                      </div>
                    )}

                    {/* Appointments Indicator Dots */}
                    {hasApts && (
                      <div className="flex justify-center gap-1 mt-2">
                        {dayAppointments.slice(0, 3).map((_, idx) => (
                          <div
                            key={idx}
                            className={cn(
                              "w-2 h-2 rounded-full",
                              isSelected ? "bg-white/60" : "bg-indigo-400"
                            )}
                          />
                        ))}
                        {dayAppointments.length > 3 && (
                          <div className={cn(
                            "text-xs",
                            isSelected ? "text-white/60" : "text-indigo-400"
                          )}>
                            +{dayAppointments.length - 3}
                          </div>
                        )}
                      </div>
                    )}

                    {/* Today Indicator */}
                    {isToday && !isSelected && (
                      <div className="absolute -top-1 -right-1 w-3 h-3 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full"></div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Daily Agenda */}
          <div className="bg-white rounded-2xl border border-gray-200">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-xl font-bold text-gray-900">
                    أجندة {selectedDate.toLocaleDateString('ar-IQ', { weekday: 'long', day: 'numeric', month: 'long' })}
                  </h3>
                  <p className="text-sm text-gray-600 mt-1">
                    {selectedDateAppointments.length > 0 
                      ? `${selectedDateAppointments.length} موعد مجدول` 
                      : "لا توجد مواعيد مجدولة"
                    }
                  </p>
                </div>
                <button className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition-all">
                  <Plus className="w-4 h-4" />
                  إضافة موعد
                </button>
              </div>
            </div>

            <div className="p-6">
              {selectedDateAppointments.length > 0 ? (
                <div className="space-y-4">
                  {selectedDateAppointments.map((appointment) => (
                    <div key={appointment.id} className="bg-gradient-to-r from-gray-50 to-white rounded-2xl p-6 border border-gray-100 hover:shadow-lg transition-all">
                      {/* Appointment Header */}
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-4">
                          <div className={cn("w-14 h-14 rounded-2xl flex items-center justify-center text-lg font-bold text-white", appointment.color)}>
                            {appointment.avatar}
                          </div>
                          <div>
                            <h4 className="text-lg font-bold text-gray-900">{appointment.patient}</h4>
                            <p className="text-gray-600">{appointment.treatment}</p>
                            <div className="flex items-center gap-4 mt-2">
                              <div className="flex items-center gap-1 text-sm text-gray-500">
                                <Clock className="w-4 h-4" />
                                {appointment.time}
                              </div>
                              <div className="flex items-center gap-1 text-sm text-gray-500">
                                <Timer className="w-4 h-4" />
                                {appointment.duration}
                              </div>
                            </div>
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-3">
                          {getStatusBadge(appointment.status)}
                          <div className="flex gap-2">
                            <button className="p-2 text-indigo-600 hover:bg-indigo-100 rounded-lg transition-all">
                              <Phone className="w-4 h-4" />
                            </button>
                            <button className="p-2 text-green-600 hover:bg-green-100 rounded-lg transition-all">
                              <Mail className="w-4 h-4" />
                            </button>
                            <button className="p-2 text-purple-600 hover:bg-purple-100 rounded-lg transition-all">
                              <ClipboardList className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      </div>

                      {/* Treatment Plan */}
                      <div className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-xl p-4">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            {(() => {
                              const treatmentIcon = getTreatmentIcon(appointment.treatmentPlan.stepType);
                              const IconComponent = treatmentIcon.icon;
                              return (
                                <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center text-white", treatmentIcon.color)}>
                                  <IconComponent className="w-5 h-5" />
                                </div>
                              );
                            })()}
                            <div>
                              <h5 className="font-semibold text-gray-900">{appointment.treatmentPlan.stage}</h5>
                              <p className="text-sm text-gray-600">{appointment.treatmentPlan.description}</p>
                            </div>
                          </div>
                          
                          <div className="text-right">
                            <div className="text-sm text-gray-600 mb-1">التقدم</div>
                            <div className="flex items-center gap-2">
                              <div className="w-24 bg-gray-200 rounded-full h-2">
                                <div 
                                  className="bg-gradient-to-r from-indigo-500 to-purple-500 h-2 rounded-full transition-all"
                                  style={{ width: `${appointment.treatmentPlan.progress}%` }}
                                ></div>
                              </div>
                              <span className="text-sm font-medium text-gray-700">{appointment.treatmentPlan.progress}%</span>
                            </div>
                          </div>
                        </div>

                        {appointment.treatmentPlan.nextStep && (
                          <div className="mt-3 flex items-center gap-2 text-sm text-indigo-700">
                            <ArrowLeft className="w-4 h-4" />
                            <span>التالي: {appointment.treatmentPlan.nextStep}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Calendar className="w-10 h-10 text-gray-400" />
                  </div>
                  <h4 className="text-xl font-semibold text-gray-900 mb-2">لا توجد مواعيد</h4>
                  <p className="text-gray-600 mb-6">لا توجد مواعيد مجدولة في هذا اليوم</p>
                  <button className="flex items-center gap-2 px-6 py-3 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition-all mx-auto">
                    <Plus className="w-4 h-4" />
                    إضافة موعد جديد
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HorizontalInteractiveCalendar;
