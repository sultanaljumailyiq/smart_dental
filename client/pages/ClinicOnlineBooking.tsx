import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Calendar, Clock, MapPin, Phone, Mail, CheckCircle, ArrowRight, Star, Award } from "lucide-react";
import { cn } from "@/lib/utils";
import { sharedClinicData, Clinic, TimeSlot } from "@/services/sharedClinicData";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

export default function ClinicOnlineBooking() {
  const { clinicId } = useParams<{ clinicId: string }>();
  const navigate = useNavigate();
  
  const [clinic, setClinic] = useState<Clinic | null>(null);
  const [selectedDate, setSelectedDate] = useState<string>("");
  const [selectedTime, setSelectedTime] = useState<string>("");
  const [timeSlots, setTimeSlots] = useState<TimeSlot[]>([]);
  const [loading, setLoading] = useState(true);
  const [bookingStep, setBookingStep] = useState<"date" | "time" | "info" | "confirm">("date");
  
  const [formData, setFormData] = useState({
    patientName: "",
    patientPhone: "",
    patientEmail: "",
    treatment: "",
  });

  useEffect(() => {
    const loadClinic = async () => {
      if (!clinicId) return;
      try {
        const clinicData = await sharedClinicData.getClinic(clinicId);
        setClinic(clinicData);
        setLoading(false);
      } catch (error) {
        console.error("Error loading clinic:", error);
        setLoading(false);
      }
    };
    loadClinic();
  }, [clinicId]);

  useEffect(() => {
    const loadTimeSlots = async () => {
      if (!clinicId || !selectedDate) return;
      try {
        const slots = await sharedClinicData.getAvailableTimeSlots(clinicId, selectedDate);
        setTimeSlots(slots);
      } catch (error) {
        console.error("Error loading time slots:", error);
      }
    };
    loadTimeSlots();
  }, [clinicId, selectedDate]);

  const handleDateSelect = (date: string) => {
    setSelectedDate(date);
    setSelectedTime("");
    setBookingStep("time");
  };

  const handleTimeSelect = (time: string) => {
    setSelectedTime(time);
    setBookingStep("info");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!clinicId || !selectedDate || !selectedTime) {
      toast.error("الرجاء اختيار التاريخ والوقت");
      return;
    }

    if (!formData.patientName || !formData.patientPhone || !formData.treatment) {
      toast.error("الرجاء إكمال جميع الحقول المطلوبة");
      return;
    }

    try {
      const appointment = await sharedClinicData.createOnlineBooking({
        clinicId,
        patientName: formData.patientName,
        patientPhone: formData.patientPhone,
        patientEmail: formData.patientEmail,
        date: selectedDate,
        time: selectedTime,
        treatment: formData.treatment,
      });

      if (appointment) {
        setBookingStep("confirm");
        toast.success("تم حجز الموعد بنجاح!");
      } else {
        toast.error("عذراً، الموعد المحدد غير متاح");
      }
    } catch (error) {
      console.error("Error creating booking:", error);
      toast.error("حدث خطأ أثناء الحجز");
    }
  };

  const getNextWeekDates = () => {
    const dates = [];
    const today = new Date();
    for (let i = 0; i < 7; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() + i);
      dates.push({
        value: date.toISOString().split('T')[0],
        label: date.toLocaleDateString('ar-IQ', { weekday: 'short', day: 'numeric', month: 'short' }),
        dayName: date.toLocaleDateString('ar-IQ', { weekday: 'long' }),
      });
    }
    return dates;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">جاري التحميل...</p>
        </div>
      </div>
    );
  }

  if (!clinic || !clinic.onlineBookingEnabled) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-6">
        <div className="bg-white rounded-2xl p-8 max-w-md text-center shadow-xl">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Calendar className="w-8 h-8 text-red-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">الحجز غير متاح</h2>
          <p className="text-gray-600">عذراً، الحجز الإلكتروني غير متاح لهذه العيادة حالياً</p>
        </div>
      </div>
    );
  }

  if (bookingStep === "confirm") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 flex items-center justify-center p-6">
        <div className="bg-white rounded-2xl p-8 max-w-2xl text-center shadow-xl">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="w-12 h-12 text-green-600" />
          </div>
          <h2 className="text-3xl font-bold text-gray-900 mb-4">تم تأكيد الحجز!</h2>
          <p className="text-gray-600 mb-6">تم حجز موعدك بنجاح. سيتم التواصل معك قريباً.</p>
          
          <div className="bg-gray-50 rounded-xl p-6 mb-6 text-right">
            <h3 className="font-bold text-lg mb-4">تفاصيل الموعد:</h3>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-600">العيادة:</span>
                <span className="font-semibold">{clinic.nameAr}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">التاريخ:</span>
                <span className="font-semibold">{new Date(selectedDate).toLocaleDateString('ar-IQ')}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">الوقت:</span>
                <span className="font-semibold">{selectedTime}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">العلاج:</span>
                <span className="font-semibold">{formData.treatment}</span>
              </div>
            </div>
          </div>

          <Button onClick={() => navigate("/")} className="w-full bg-green-600 hover:bg-green-700">
            العودة للصفحة الرئيسية
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100" dir="rtl">
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        <div className="bg-white rounded-3xl shadow-2xl overflow-hidden">
          <div className="bg-gradient-to-r from-blue-600 to-indigo-700 p-8 text-white">
            <div className="flex items-start gap-4">
              <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center backdrop-blur-sm">
                <Calendar className="w-8 h-8" />
              </div>
              <div className="flex-1">
                <h1 className="text-3xl font-bold mb-2">{clinic.nameAr}</h1>
                <div className="flex flex-wrap gap-4 text-sm opacity-90">
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4" />
                    <span>{clinic.address}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Phone className="w-4 h-4" />
                    <span>{clinic.phone}</span>
                  </div>
                  {clinic.email && (
                    <div className="flex items-center gap-2">
                      <Mail className="w-4 h-4" />
                      <span>{clinic.email}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          <div className="p-8">
            <div className="flex items-center justify-center mb-8">
              <div className="flex items-center gap-2">
                <div className={cn(
                  "w-8 h-8 rounded-full flex items-center justify-center font-bold",
                  bookingStep === "date" ? "bg-blue-600 text-white" : "bg-gray-200 text-gray-600"
                )}>1</div>
                <span className="text-sm font-medium">التاريخ</span>
                <ArrowRight className="w-4 h-4 text-gray-400 mx-2" />
                
                <div className={cn(
                  "w-8 h-8 rounded-full flex items-center justify-center font-bold",
                  bookingStep === "time" ? "bg-blue-600 text-white" : "bg-gray-200 text-gray-600"
                )}>2</div>
                <span className="text-sm font-medium">الوقت</span>
                <ArrowRight className="w-4 h-4 text-gray-400 mx-2" />
                
                <div className={cn(
                  "w-8 h-8 rounded-full flex items-center justify-center font-bold",
                  bookingStep === "info" ? "bg-blue-600 text-white" : "bg-gray-200 text-gray-600"
                )}>3</div>
                <span className="text-sm font-medium">البيانات</span>
              </div>
            </div>

            {bookingStep === "date" && (
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-6">اختر التاريخ المناسب</h2>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {getNextWeekDates().map((date) => (
                    <button
                      key={date.value}
                      onClick={() => handleDateSelect(date.value)}
                      className={cn(
                        "p-4 rounded-xl border-2 transition-all text-center",
                        selectedDate === date.value
                          ? "border-blue-600 bg-blue-50 shadow-md"
                          : "border-gray-200 hover:border-blue-300 hover:bg-blue-50/50"
                      )}
                    >
                      <div className="font-bold text-lg">{date.label}</div>
                      <div className="text-sm text-gray-600 mt-1">{date.dayName}</div>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {bookingStep === "time" && (
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-6">اختر الوقت المناسب</h2>
                <div className="grid grid-cols-3 md:grid-cols-5 gap-3">
                  {timeSlots.map((slot) => (
                    <button
                      key={slot.time}
                      onClick={() => slot.available && handleTimeSelect(slot.time)}
                      disabled={!slot.available}
                      className={cn(
                        "p-3 rounded-lg border-2 transition-all font-semibold",
                        selectedTime === slot.time
                          ? "border-blue-600 bg-blue-600 text-white"
                          : slot.available
                          ? "border-gray-300 hover:border-blue-400 hover:bg-blue-50"
                          : "border-gray-200 bg-gray-100 text-gray-400 cursor-not-allowed"
                      )}
                    >
                      {slot.time}
                    </button>
                  ))}
                </div>
                {timeSlots.length === 0 && (
                  <p className="text-center text-gray-500 py-8">لا توجد مواعيد متاحة في هذا اليوم</p>
                )}
              </div>
            )}

            {bookingStep === "info" && (
              <form onSubmit={handleSubmit} className="space-y-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">أدخل بياناتك</h2>
                
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <Label htmlFor="patientName" className="text-right block mb-2">الاسم الكامل *</Label>
                    <Input
                      id="patientName"
                      value={formData.patientName}
                      onChange={(e) => setFormData({ ...formData, patientName: e.target.value })}
                      className="text-right"
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="patientPhone" className="text-right block mb-2">رقم الهاتف *</Label>
                    <Input
                      id="patientPhone"
                      type="tel"
                      value={formData.patientPhone}
                      onChange={(e) => setFormData({ ...formData, patientPhone: e.target.value })}
                      className="text-right"
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="patientEmail" className="text-right block mb-2">البريد الإلكتروني</Label>
                    <Input
                      id="patientEmail"
                      type="email"
                      value={formData.patientEmail}
                      onChange={(e) => setFormData({ ...formData, patientEmail: e.target.value })}
                      className="text-right"
                    />
                  </div>

                  <div>
                    <Label htmlFor="treatment" className="text-right block mb-2">نوع العلاج *</Label>
                    <select
                      id="treatment"
                      value={formData.treatment}
                      onChange={(e) => setFormData({ ...formData, treatment: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md text-right"
                      required
                    >
                      <option value="">اختر العلاج</option>
                      {clinic.acceptedTreatments.map((treatment) => (
                        <option key={treatment} value={treatment}>{treatment}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="bg-blue-50 rounded-xl p-4 border border-blue-200">
                  <h3 className="font-bold mb-2">ملخص الموعد:</h3>
                  <div className="space-y-1 text-sm">
                    <p><span className="text-gray-600">التاريخ:</span> <span className="font-semibold">{new Date(selectedDate).toLocaleDateString('ar-IQ')}</span></p>
                    <p><span className="text-gray-600">الوقت:</span> <span className="font-semibold">{selectedTime}</span></p>
                  </div>
                </div>

                <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-lg py-6">
                  تأكيد الحجز
                </Button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
