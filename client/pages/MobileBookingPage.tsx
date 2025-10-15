import React, { useState, useEffect } from "react";
import { useParams, useSearchParams, useNavigate } from "react-router-dom";
import {
  Calendar,
  Clock,
  User,
  Phone,
  ChevronLeft,
  CheckCircle,
  AlertCircle,
  Loader2,
  Stethoscope,
  MapPin,
  Star,
  Send,
  X,
} from "lucide-react";

interface Doctor {
  id: string;
  name: string;
  specialties: string[];
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
}

interface TimeSlot {
  time: string;
  available: boolean;
}

// بيانات تجريبية للعيادة
const mockClinic: Clinic = {
  id: "1",
  clinicId: "CL-BAGHDAD-001",
  name: "عيادة الدكتور أحمد للأسنان",
  address: "شارع الكرادة، بغداد",
  phone: "+964 770 123 4567",
  rating: 4.9,
  reviews: 312,
  doctors: [
    {
      id: "doc1",
      name: "د. أحمد الرحمة",
      specialties: ["جراحة الفم والفكين", "زراعة الأسنان"]
    },
    {
      id: "doc2", 
      name: "د. فاطمة النور",
      specialties: ["تقويم الأسنان", "طب أسنان الأطفال"]
    }
  ],
  services: ["زراعة الأسنان", "تبييض الأسنان", "تقويم الأسنان", "علاج العصب", "تنظيف الأسنان"]
};

// مواعيد تجريبية
const mockTimeSlots: TimeSlot[] = [
  { time: "09:00", available: true },
  { time: "09:30", available: false },
  { time: "10:00", available: true },
  { time: "10:30", available: true },
  { time: "11:00", available: false },
  { time: "11:30", available: true },
  { time: "14:00", available: true },
  { time: "14:30", available: true },
  { time: "15:00", available: false },
  { time: "15:30", available: true },
  { time: "16:00", available: true },
];

const MobileBookingPage: React.FC = () => {
  const { clinicId } = useParams<{ clinicId: string }>();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  // حالات النموذج
  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  // بيانات النموذج
  const [formData, setFormData] = useState({
    patientName: "",
    patientPhone: "",
    selectedDoctor: "",
    selectedService: "",
    selectedDate: "",
    selectedTime: "",
  });

  // بيانات الأطباء والمواعيد
  const [clinic] = useState<Clinic>(mockClinic);
  const [availableDates, setAvailableDates] = useState<string[]>([]);
  const [timeSlots, setTimeSlots] = useState<TimeSlot[]>(mockTimeSlots);

  // توليد التواريخ المتاحة للأسبوع القادم (بدون الجمعة والسبت)
  useEffect(() => {
    const dates = [];
    const today = new Date();
    
    for (let i = 1; i <= 14; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() + i);
      
      // تجنب يوم الجمعة (5) والسبت (6)
      if (date.getDay() !== 5 && date.getDay() !== 6) {
        dates.push(date.toISOString().split('T')[0]);
      }
    }
    
    setAvailableDates(dates);
    if (dates.length > 0) {
      setFormData(prev => ({ ...prev, selectedDate: dates[0] }));
    }
  }, []);

  // تحديث الحقول
  const updateField = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  // التحقق من صحة البيانات
  const isStepValid = (step: number) => {
    switch (step) {
      case 1:
        return formData.patientName.trim() && formData.patientPhone.trim();
      case 2:
        return formData.selectedDoctor && formData.selectedService;
      case 3:
        return formData.selectedDate && formData.selectedTime;
      default:
        return false;
    }
  };

  // الانتقال للخطوة التالية
  const nextStep = () => {
    if (isStepValid(currentStep)) {
      setCurrentStep(prev => prev + 1);
    }
  };

  // الانتقال للخطوة السابقة
  const prevStep = () => {
    setCurrentStep(prev => prev - 1);
  };

  // تأكيد الحجز
  const submitBooking = async () => {
    setLoading(true);
    
    // محاكاة API call
    setTimeout(() => {
      setLoading(false);
      setSuccess(true);
      
      // إشعار للعيادة (محاكاة)
      console.log("إشعار جديد للعيادة:", {
        type: "new_appointment",
        patient: formData.patientName,
        phone: formData.patientPhone,
        doctor: formData.selectedDoctor,
        service: formData.selectedService,
        date: formData.selectedDate,
        time: formData.selectedTime,
        clinicId: clinic.clinicId,
        timestamp: new Date().toISOString()
      });
      
      // العودة للصفحة الرئيسية بعد 3 ثوان
      setTimeout(() => {
        navigate("/");
      }, 3000);
    }, 2000);
  };

  // تنسيق التاريخ للعرض
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("ar-EG", {
      weekday: "long",
      month: "long",
      day: "numeric",
    });
  };

  // في حالة نجاح الحجز
  if (success) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-3xl p-8 shadow-xl text-center max-w-md w-full">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="w-12 h-12 text-green-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-3">
            تم تأكيد حجزك بنجاح!
          </h2>
          <p className="text-gray-600 mb-6 leading-relaxed">
            شكراً {formData.patientName}، تم إرسال تفاصيل موعدك إلى رقم {formData.patientPhone}
          </p>
          
          <div className="bg-gray-50 rounded-2xl p-4 mb-6 text-right">
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">العيادة:</span>
                <span className="font-medium">{clinic.name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">الطبيب:</span>
                <span className="font-medium">{formData.selectedDoctor}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">التاريخ:</span>
                <span className="font-medium">{formatDate(formData.selectedDate)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">الوقت:</span>
                <span className="font-medium">{formData.selectedTime}</span>
              </div>
            </div>
          </div>
          
          <p className="text-sm text-gray-500">
            سيتم توجيهك للصفحة الرئيسية خلال 3 ثوان...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b sticky top-0 z-10">
        <div className="flex items-center justify-between p-4">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          
          <div className="text-center">
            <h1 className="text-lg font-bold text-gray-900">حجز موعد</h1>
            <p className="text-xs text-gray-600">خطوة {currentStep} من 3</p>
          </div>
          
          <div className="w-8"></div>
        </div>
        
        {/* Progress Bar */}
        <div className="px-4 pb-3">
          <div className="flex items-center">
            {[1, 2, 3].map((step) => (
              <React.Fragment key={step}>
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                    currentStep >= step
                      ? "bg-blue-600 text-white"
                      : "bg-gray-200 text-gray-500"
                  }`}
                >
                  {currentStep > step ? <CheckCircle className="w-4 h-4" /> : step}
                </div>
                {step < 3 && (
                  <div
                    className={`flex-1 h-1 mx-2 rounded ${
                      currentStep > step ? "bg-blue-600" : "bg-gray-200"
                    }`}
                  />
                )}
              </React.Fragment>
            ))}
          </div>
        </div>
      </div>

      {/* معلومات العيادة */}
      <div className="bg-white m-4 rounded-2xl shadow-sm p-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-green-600 rounded-xl flex items-center justify-center">
            <Stethoscope className="w-6 h-6 text-white" />
          </div>
          <div className="flex-1">
            <h3 className="font-bold text-gray-900">{clinic.name}</h3>
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <Star className="w-3 h-3 text-yellow-500 fill-current" />
              <span>{clinic.rating}</span>
              <span>({clinic.reviews} مراجعة)</span>
            </div>
          </div>
        </div>
      </div>

      {/* محتوى الخطوات */}
      <div className="p-4">
        {/* الخطوة 1: معلومات المريض */}
        {currentStep === 1 && (
          <div className="bg-white rounded-2xl shadow-sm p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-6">معلومات المريض</h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  اسم المريض
                </label>
                <input
                  type="text"
                  value={formData.patientName}
                  onChange={(e) => updateField("patientName", e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-lg"
                  placeholder="أدخل اسم المريض الكامل"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  رقم الهاتف
                </label>
                <input
                  type="tel"
                  value={formData.patientPhone}
                  onChange={(e) => updateField("patientPhone", e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-lg"
                  placeholder="+964 770 123 4567"
                />
              </div>
            </div>

            <button
              onClick={nextStep}
              disabled={!isStepValid(1)}
              className="w-full mt-8 bg-blue-600 text-white py-4 rounded-xl font-medium text-lg hover:bg-blue-700 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
            >
              التالي
            </button>
          </div>
        )}

        {/* الخطوة 2: اختيار الطبيب والخدمة */}
        {currentStep === 2 && (
          <div className="bg-white rounded-2xl shadow-sm p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-6">اختيار الطبيب والخدمة</h2>
            
            {/* اختيار الطبيب */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-3">
                اختر الطبيب
              </label>
              <div className="space-y-3">
                {clinic.doctors.map((doctor) => (
                  <button
                    key={doctor.id}
                    onClick={() => updateField("selectedDoctor", doctor.name)}
                    className={`w-full p-4 rounded-xl border-2 text-right transition-all ${
                      formData.selectedDoctor === doctor.name
                        ? "border-blue-600 bg-blue-50"
                        : "border-gray-200 hover:border-blue-300"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-green-600 rounded-full flex items-center justify-center">
                        <User className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <h4 className="font-medium text-gray-900">{doctor.name}</h4>
                        <p className="text-sm text-gray-600">{doctor.specialties.join(", ")}</p>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* اختيار الخدمة */}
            <div className="mb-8">
              <label className="block text-sm font-medium text-gray-700 mb-3">
                نوع الخدمة المطلوبة
              </label>
              <select
                value={formData.selectedService}
                onChange={(e) => updateField("selectedService", e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-lg"
              >
                <option value="">اختر نوع الخدمة</option>
                {clinic.services.map((service, index) => (
                  <option key={index} value={service}>
                    {service}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex gap-3">
              <button
                onClick={prevStep}
                className="flex-1 bg-gray-200 text-gray-700 py-4 rounded-xl font-medium text-lg hover:bg-gray-300 transition-colors"
              >
                السابق
              </button>
              <button
                onClick={nextStep}
                disabled={!isStepValid(2)}
                className="flex-1 bg-blue-600 text-white py-4 rounded-xl font-medium text-lg hover:bg-blue-700 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
              >
                التالي
              </button>
            </div>
          </div>
        )}

        {/* الخطوة 3: اختيار التاريخ والوقت */}
        {currentStep === 3 && (
          <div className="bg-white rounded-2xl shadow-sm p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-6">اختيار التاريخ والوقت</h2>
            
            {/* اختيار التاريخ */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-3">
                اختر التاريخ
              </label>
              <div className="grid grid-cols-2 gap-3">
                {availableDates.slice(0, 6).map((date) => (
                  <button
                    key={date}
                    onClick={() => updateField("selectedDate", date)}
                    className={`p-3 rounded-xl border-2 text-center transition-all ${
                      formData.selectedDate === date
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
            <div className="mb-8">
              <label className="block text-sm font-medium text-gray-700 mb-3">
                اختر الوقت
              </label>
              <div className="grid grid-cols-3 gap-3">
                {timeSlots.map((slot) => (
                  <button
                    key={slot.time}
                    onClick={() => slot.available && updateField("selectedTime", slot.time)}
                    disabled={!slot.available}
                    className={`p-3 rounded-xl border-2 text-center transition-all ${
                      formData.selectedTime === slot.time
                        ? "border-blue-600 bg-blue-50 text-blue-700"
                        : slot.available
                        ? "border-gray-200 hover:border-blue-300"
                        : "border-gray-100 bg-gray-50 text-gray-400 cursor-not-allowed"
                    }`}
                  >
                    <div className="text-sm font-medium">{slot.time}</div>
                    {!slot.available && (
                      <div className="text-xs text-gray-400">محجوز</div>
                    )}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={prevStep}
                className="flex-1 bg-gray-200 text-gray-700 py-4 rounded-xl font-medium text-lg hover:bg-gray-300 transition-colors"
              >
                السابق
              </button>
              <button
                onClick={submitBooking}
                disabled={!isStepValid(3) || loading}
                className="flex-1 bg-green-600 text-white py-4 rounded-xl font-medium text-lg hover:bg-green-700 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    جاري الحجز...
                  </>
                ) : (
                  <>
                    <Send className="w-5 h-5" />
                    تأكيد الحجز
                  </>
                )}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MobileBookingPage;
