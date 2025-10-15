import React, { useState, useEffect } from "react";
import { useParams, useSearchParams, useNavigate } from "react-router-dom";
import {
  Calendar,
  Clock,
  User,
  Phone,
  Mail,
  MapPin,
  Star,
  ChevronLeft,
  ChevronRight,
  CheckCircle,
  AlertCircle,
  Loader2,
  Stethoscope,
  CreditCard,
  Shield,
} from "lucide-react";
import { ClinicService } from "@/services/clinicService";

interface Doctor {
  id: string;
  name: string;
  specialties: string[];
  schedule?: any;
  image?: string;
}

interface Clinic {
  id: string;
  clinicId: string;
  name: string;
  address: string;
  phone: string;
  doctors: Doctor[];
  services: string[];
  rating: number;
  reviews: number;
  priceRange: string;
}

interface TimeSlot {
  time: string;
  available: boolean;
  price?: string;
}

interface BookingFormData {
  patientName: string;
  patientPhone: string;
  patientEmail: string;
  selectedService: string;
  notes: string;
}

const BookingPage: React.FC = () => {
  const { clinicId } = useParams<{ clinicId: string }>();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  // البيانات الأساسية
  const [clinic, setClinic] = useState<Clinic | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // حالة الحجز
  const [selectedDoctor, setSelectedDoctor] = useState<Doctor | null>(null);
  const [selectedDate, setSelectedDate] = useState<string>("");
  const [selectedTime, setSelectedTime] = useState<string>("");
  const [currentStep, setCurrentStep] = useState(1);
  const [bookingForm, setBookingForm] = useState<BookingFormData>({
    patientName: "",
    patientPhone: "",
    patientEmail: "",
    selectedService: "",
    notes: "",
  });

  // بيانات الجدولة
  const [availableDates, setAvailableDates] = useState<string[]>([]);
  const [availableTimeSlots, setAvailableTimeSlots] = useState<TimeSlot[]>([]);
  const [submitting, setSubmitting] = useState(false);

  // تحميل بيانات العيادة
  useEffect(() => {
    const loadClinicData = async () => {
      if (!clinicId) {
        setError("معرف العيادة غير صحيح");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        let clinicData;
        
        // محاولة البحث بالمعرف التعريفي أولاً
        try {
          clinicData = await ClinicService.getClinicByIdentifier(clinicId);
        } catch {
          // إذا فشل، جرب بالمعرف العادي
          clinicData = await ClinicService.getClinicById(clinicId);
        }

        setClinic(clinicData);
        
        // تعيين الطبيب الأول كافتراضي
        if (clinicData.doctors && clinicData.doctors.length > 0) {
          setSelectedDoctor(clinicData.doctors[0]);
        }

        // تعيين الخدمة من URL إذا وجدت
        const serviceFromUrl = searchParams.get("service");
        if (serviceFromUrl && clinicData.services.includes(serviceFromUrl)) {
          setBookingForm(prev => ({ ...prev, selectedService: serviceFromUrl }));
        }

        // توليد التواريخ المتاحة للأسبوع القادم
        generateAvailableDates();
        
      } catch (err) {
        console.error("Error loading clinic:", err);
        setError("فشل في تحميل بيانات العيادة. يرجى المحاولة مرة أخرى.");
      } finally {
        setLoading(false);
      }
    };

    loadClinicData();
  }, [clinicId, searchParams]);

  // توليد التواريخ المتاحة
  const generateAvailableDates = () => {
    const dates = [];
    const today = new Date();
    
    for (let i = 1; i <= 14; i++) { // الأسبوعين القادمين
      const date = new Date(today);
      date.setDate(today.getDate() + i);
      
      // تجنب يوم الجمعة (5) والسبت (6)
      if (date.getDay() !== 5 && date.getDay() !== 6) {
        dates.push(date.toISOString().split('T')[0]);
      }
    }
    
    setAvailableDates(dates);
    if (dates.length > 0) {
      setSelectedDate(dates[0]);
    }
  };

  // توليد الأوقات المتاحة حسب التاريخ المختار
  useEffect(() => {
    if (selectedDate && selectedDoctor) {
      generateTimeSlots();
    }
  }, [selectedDate, selectedDoctor]);

  const generateTimeSlots = () => {
    // مواعيد تجريبية - في التطبيق الحقيقي ستأتي من قاعدة البيانات
    const slots: TimeSlot[] = [
      { time: "09:00", available: true, price: "50,000 د.ع" },
      { time: "09:30", available: true, price: "50,000 د.ع" },
      { time: "10:00", available: false },
      { time: "10:30", available: true, price: "50,000 د.ع" },
      { time: "11:00", available: true, price: "50,000 د.ع" },
      { time: "11:30", available: true, price: "50,000 د.ع" },
      { time: "14:00", available: true, price: "50,000 د.ع" },
      { time: "14:30", available: false },
      { time: "15:00", available: true, price: "50,000 د.ع" },
      { time: "15:30", available: true, price: "50,000 د.ع" },
      { time: "16:00", available: true, price: "50,000 د.ع" },
    ];
    
    setAvailableTimeSlots(slots);
  };

  // تأكيد الحجز
  const handleBookingSubmit = async () => {
    if (!clinic || !selectedDoctor || !selectedDate || !selectedTime) {
      setError("يرجى إكمال جميع البيانات المطلوبة");
      return;
    }

    try {
      setSubmitting(true);
      
      const appointmentData = {
        clinicId: clinic.id,
        clinicIdentifier: clinic.clinicId,
        doctorId: selectedDoctor.id,
        doctorName: selectedDoctor.name,
        patientName: bookingForm.patientName,
        patientPhone: bookingForm.patientPhone,
        patientEmail: bookingForm.patientEmail,
        appointmentDate: selectedDate,
        appointmentTime: selectedTime,
        service: bookingForm.selectedService,
        notes: bookingForm.notes,
        status: "pending",
      };

      const booking = await ClinicService.bookAppointment(appointmentData);
      
      // الانتقال إلى صفحة تأكيد الحجز
      navigate(`/booking/confirmation/${booking.id}`, {
        state: { 
          booking,
          clinic,
          doctor: selectedDoctor 
        }
      });
      
    } catch (err) {
      console.error("Error booking appointment:", err);
      setError("فشل في تأكيد الحجز. يرجى المحاولة مرة أخرى.");
    } finally {
      setSubmitting(false);
    }
  };

  // تنسيق التاريخ للعرض
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("ar-EG", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-blue-600 animate-spin mx-auto mb-4" />
          <h2 className="text-xl font-bold text-gray-900 mb-2">جاري تحميل بيانات العيادة</h2>
          <p className="text-gray-600">يرجى الانتظار...</p>
        </div>
      </div>
    );
  }

  if (error || !clinic) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl p-8 shadow-lg text-center max-w-md">
          <AlertCircle className="w-16 h-16 text-red-600 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-gray-900 mb-2">خطأ في تحميل البيانات</h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <button
            onClick={() => navigate("/")}
            className="bg-blue-600 text-white px-6 py-3 rounded-xl font-medium hover:bg-blue-700 transition-colors"
          >
            العودة للصفحة الرئيسية
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-4xl mx-auto p-4">
          <div className="flex items-center justify-between">
            <button
              onClick={() => navigate(-1)}
              className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
            >
              <ChevronLeft className="w-5 h-5" />
              العودة
            </button>
            
            <div className="text-center">
              <h1 className="text-xl font-bold text-gray-900">حجز موعد</h1>
              <p className="text-sm text-gray-600">{clinic.name}</p>
            </div>
            
            <div></div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto p-4 py-8">
        {/* معلومات العيادة */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
          <div className="flex items-start gap-4">
            <div className="w-16 h-16 bg-gradient-to-r from-blue-600 to-green-600 rounded-xl flex items-center justify-center">
              <Stethoscope className="w-8 h-8 text-white" />
            </div>
            
            <div className="flex-1">
              <h2 className="text-xl font-bold text-gray-900 mb-2">{clinic.name}</h2>
              <div className="flex items-center gap-4 text-sm text-gray-600 mb-3">
                <div className="flex items-center gap-1">
                  <Star className="w-4 h-4 text-yellow-500 fill-current" />
                  <span>{clinic.rating}</span>
                  <span>({clinic.reviews} مراجعة)</span>
                </div>
                <div className="flex items-center gap-1">
                  <MapPin className="w-4 h-4" />
                  <span>{clinic.address}</span>
                </div>
              </div>
              <div className="flex items-center gap-1 text-sm text-gray-600">
                <Phone className="w-4 h-4" />
                <span>{clinic.phone}</span>
              </div>
            </div>
          </div>
        </div>

        {/* خطوات الحجز */}
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
          {/* شريط التقدم */}
          <div className="bg-gray-50 p-4">
            <div className="flex items-center justify-between">
              {[
                { step: 1, title: "اختيار الطبيب والوقت" },
                { step: 2, title: "معلومات المريض" },
                { step: 3, title: "تأكيد الحجز" },
              ].map((item) => (
                <div key={item.step} className="flex items-center">
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                      currentStep >= item.step
                        ? "bg-blue-600 text-white"
                        : "bg-gray-300 text-gray-600"
                    }`}
                  >
                    {currentStep > item.step ? (
                      <CheckCircle className="w-5 h-5" />
                    ) : (
                      item.step
                    )}
                  </div>
                  <span
                    className={`mr-3 text-sm font-medium ${
                      currentStep >= item.step ? "text-blue-600" : "text-gray-500"
                    }`}
                  >
                    {item.title}
                  </span>
                  {item.step < 3 && (
                    <ChevronRight className="w-4 h-4 text-gray-400 mr-4" />
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* محتوى الخطوات */}
          <div className="p-6">
            {/* الخطوة 1: اختيار الطبيب والوقت */}
            {currentStep === 1 && (
              <div className="space-y-6">
                {/* اختيار الطبيب */}
                <div>
                  <h3 className="text-lg font-bold text-gray-900 mb-4">اختيار الطبيب</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {clinic.doctors.map((doctor) => (
                      <div
                        key={doctor.id}
                        onClick={() => setSelectedDoctor(doctor)}
                        className={`p-4 rounded-xl border-2 cursor-pointer transition-all ${
                          selectedDoctor?.id === doctor.id
                            ? "border-blue-600 bg-blue-50"
                            : "border-gray-200 hover:border-blue-300"
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-green-600 rounded-full flex items-center justify-center">
                            <User className="w-6 h-6 text-white" />
                          </div>
                          <div>
                            <h4 className="font-medium text-gray-900">{doctor.name}</h4>
                            <p className="text-sm text-gray-600">
                              {doctor.specialties.join(", ")}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* اختيار التاريخ */}
                <div>
                  <h3 className="text-lg font-bold text-gray-900 mb-4">اختيار التاريخ</h3>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    {availableDates.slice(0, 8).map((date) => (
                      <button
                        key={date}
                        onClick={() => setSelectedDate(date)}
                        className={`p-3 rounded-xl border-2 text-center transition-all ${
                          selectedDate === date
                            ? "border-blue-600 bg-blue-50 text-blue-700"
                            : "border-gray-200 hover:border-blue-300"
                        }`}
                      >
                        <div className="text-sm font-medium">
                          {new Date(date).toLocaleDateString("ar-EG", {
                            weekday: "short",
                            month: "short",
                            day: "numeric",
                          })}
                        </div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* اختيار الوقت */}
                {selectedDate && (
                  <div>
                    <h3 className="text-lg font-bold text-gray-900 mb-4">اختيار الوقت</h3>
                    <div className="grid grid-cols-3 md:grid-cols-6 gap-3">
                      {availableTimeSlots.map((slot) => (
                        <button
                          key={slot.time}
                          onClick={() => slot.available && setSelectedTime(slot.time)}
                          disabled={!slot.available}
                          className={`p-3 rounded-xl border-2 text-center transition-all ${
                            selectedTime === slot.time
                              ? "border-blue-600 bg-blue-50 text-blue-700"
                              : slot.available
                              ? "border-gray-200 hover:border-blue-300"
                              : "border-gray-100 bg-gray-50 text-gray-400 cursor-not-allowed"
                          }`}
                        >
                          <div className="text-sm font-medium">{slot.time}</div>
                          {slot.price && slot.available && (
                            <div className="text-xs text-gray-500">{slot.price}</div>
                          )}
                          {!slot.available && (
                            <div className="text-xs text-gray-400">محجوز</div>
                          )}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* زر المتابعة */}
                <div className="flex justify-end pt-4">
                  <button
                    onClick={() => setCurrentStep(2)}
                    disabled={!selectedDoctor || !selectedDate || !selectedTime}
                    className="bg-blue-600 text-white px-6 py-3 rounded-xl font-medium hover:bg-blue-700 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
                  >
                    التالي
                  </button>
                </div>
              </div>
            )}

            {/* الخطوة 2: معلومات المريض */}
            {currentStep === 2 && (
              <div className="space-y-6">
                <h3 className="text-lg font-bold text-gray-900 mb-4">معلومات المريض</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      اسم المريض *
                    </label>
                    <input
                      type="text"
                      value={bookingForm.patientName}
                      onChange={(e) =>
                        setBookingForm((prev) => ({ ...prev, patientName: e.target.value }))
                      }
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="أدخل اسم المريض الكامل"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      رقم الهاتف *
                    </label>
                    <input
                      type="tel"
                      value={bookingForm.patientPhone}
                      onChange={(e) =>
                        setBookingForm((prev) => ({ ...prev, patientPhone: e.target.value }))
                      }
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="+964 770 123 4567"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      البريد الإلكتروني
                    </label>
                    <input
                      type="email"
                      value={bookingForm.patientEmail}
                      onChange={(e) =>
                        setBookingForm((prev) => ({ ...prev, patientEmail: e.target.value }))
                      }
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="patient@example.com"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      نوع الخدمة المطلوبة
                    </label>
                    <select
                      value={bookingForm.selectedService}
                      onChange={(e) =>
                        setBookingForm((prev) => ({ ...prev, selectedService: e.target.value }))
                      }
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="">اختر نوع الخدمة</option>
                      {clinic.services.map((service, index) => (
                        <option key={index} value={service}>
                          {service}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    ملاحظات إضافية
                  </label>
                  <textarea
                    value={bookingForm.notes}
                    onChange={(e) =>
                      setBookingForm((prev) => ({ ...prev, notes: e.target.value }))
                    }
                    rows={4}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="أي معلومات إضافية تريد مشاركتها مع الطبيب..."
                  />
                </div>

                {/* أزرار التنقل */}
                <div className="flex justify-between pt-4">
                  <button
                    onClick={() => setCurrentStep(1)}
                    className="bg-gray-200 text-gray-700 px-6 py-3 rounded-xl font-medium hover:bg-gray-300 transition-colors"
                  >
                    السابق
                  </button>
                  <button
                    onClick={() => setCurrentStep(3)}
                    disabled={!bookingForm.patientName || !bookingForm.patientPhone}
                    className="bg-blue-600 text-white px-6 py-3 rounded-xl font-medium hover:bg-blue-700 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
                  >
                    التالي
                  </button>
                </div>
              </div>
            )}

            {/* الخطوة 3: تأكيد الحجز */}
            {currentStep === 3 && (
              <div className="space-y-6">
                <h3 className="text-lg font-bold text-gray-900 mb-4">تأكيد الحجز</h3>
                
                {/* ملخص الحجز */}
                <div className="bg-gray-50 rounded-xl p-6">
                  <h4 className="font-medium text-gray-900 mb-4">ملخص الموعد</h4>
                  
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-gray-600">العيادة:</span>
                      <span className="font-medium">{clinic.name}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">الطبيب:</span>
                      <span className="font-medium">{selectedDoctor?.name}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">التاريخ:</span>
                      <span className="font-medium">{formatDate(selectedDate)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">الوقت:</span>
                      <span className="font-medium">{selectedTime}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">المريض:</span>
                      <span className="font-medium">{bookingForm.patientName}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">الهاتف:</span>
                      <span className="font-medium">{bookingForm.patientPhone}</span>
                    </div>
                    {bookingForm.selectedService && (
                      <div className="flex justify-between">
                        <span className="text-gray-600">نوع الخدمة:</span>
                        <span className="font-medium">{bookingForm.selectedService}</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* رسالة تنبيه */}
                <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
                  <div className="flex items-start gap-3">
                    <Shield className="w-5 h-5 text-blue-600 mt-0.5" />
                    <div className="text-sm text-blue-800">
                      <p className="font-medium mb-1">ملاحظة هامة:</p>
                      <p>
                        سيتم إرسال رسالة تأكيد إلى رقم هاتفك. يرجى الحضور قبل 15 دقيقة من موعدك.
                        في حالة عدم التمكن من الحضور، يرجى إلغاء الموعد قبل 24 ساعة على الأقل.
                      </p>
                    </div>
                  </div>
                </div>

                {/* أزرار التنقل */}
                <div className="flex justify-between pt-4">
                  <button
                    onClick={() => setCurrentStep(2)}
                    className="bg-gray-200 text-gray-700 px-6 py-3 rounded-xl font-medium hover:bg-gray-300 transition-colors"
                  >
                    السابق
                  </button>
                  <button
                    onClick={handleBookingSubmit}
                    disabled={submitting}
                    className="bg-green-600 text-white px-8 py-3 rounded-xl font-medium hover:bg-green-700 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed flex items-center gap-2"
                  >
                    {submitting ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        جاري التأكيد...
                      </>
                    ) : (
                      <>
                        <CheckCircle className="w-4 h-4" />
                        تأكيد الحجز
                      </>
                    )}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-xl p-4 mt-6">
            <div className="flex items-center gap-3">
              <AlertCircle className="w-5 h-5 text-red-600" />
              <span className="text-red-800">{error}</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default BookingPage;
