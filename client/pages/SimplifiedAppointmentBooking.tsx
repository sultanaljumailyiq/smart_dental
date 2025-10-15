import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Calendar,
  Clock,
  User,
  Phone,
  MapPin,
  Star,
  CheckCircle,
  ArrowLeft,
  ArrowRight,
  Stethoscope,
  Building2,
  ChevronLeft,
  ChevronRight,
  Wifi,
  Car,
  Coffee,
  Shield,
  MessageSquare,
  UserCheck,
  Activity,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface Doctor {
  id: number;
  name: string;
  specialty: string;
  experience: string;
  image: string;
  rating: number;
  available: boolean;
}

interface TimeSlot {
  time: string;
  available: boolean;
}

interface Service {
  id: number;
  name: string;
  duration: string;
  icon: string;
}

interface ClinicInfo {
  id: number;
  name: string;
  description: string;
  address: string;
  phone: string;
  image: string;
  rating: number;
  reviews: number;
  services: Service[];
  doctors: Doctor[];
  timeSlots: TimeSlot[];
  amenities: string[];
}

// بيانات العيادة المبسطة (Default/Fallback)
const defaultClinicData: ClinicInfo = {
  id: 1,
  name: "عيادة الدكتور أحمد للأسنان",
  description: "عيادة متخصصة في طب الأسنان بأحدث التقنيات",
  address: "شارع الكرادة، بناية النور الطبية، الطابق الثالث، بغداد",
  phone: "+964 770 123 4567",
  image:
    "https://images.unsplash.com/photo-1629909613654-28e377c37b09?w=800&h=400&fit=crop",
  rating: 4.9,
  reviews: 312,
  amenities: [
    "موقف سيارات مجاني",
    "واي فاي عالي السرعة",
    "صالة انتظار VIP",
    "تعقيم بالأوزون",
    "خدمة القهوة والشاي",
  ],
  services: [
    { id: 1, name: "زراعة الأسنان", duration: "90 دقيقة", icon: "🦷" },
    { id: 2, name: "تبييض الأسنان", duration: "60 دقيقة", icon: "✨" },
    { id: 3, name: "تقويم الأسنان", duration: "45 دقيقة", icon: "🔧" },
    { id: 4, name: "علاج العصب", duration: "120 دقيقة", icon: "🔬" },
    { id: 5, name: "تنظيف الأسنان", duration: "30 دقيقة", icon: "🧽" },
    { id: 6, name: "حشوات تجميلية", duration: "45 دقيقة", icon: "💎" },
  ],
  doctors: [
    {
      id: 1,
      name: "د. أحمد الرحمة",
      specialty: "استشاري زراعة الأسنان",
      experience: "15 سنة خبرة",
      image:
        "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=300&h=300&fit=crop&crop=face",
      rating: 4.9,
      available: true,
    },
    {
      id: 2,
      name: "د. سارة النور",
      specialty: "أخصائية تقو��م الأسنان",
      experience: "12 سنة خبرة",
      image:
        "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=300&h=300&fit=crop&crop=face",
      rating: 4.8,
      available: true,
    },
    {
      id: 3,
      name: "د. محمد العلي",
      specialty: "أخصائي طب الأسنان التجميلي",
      experience: "10 سنوات خبرة",
      image:
        "https://images.unsplash.com/photo-1582750433449-648ed127bb54?w=300&h=300&fit=crop&crop=face",
      rating: 4.7,
      available: true,
    },
    {
      id: 4,
      name: "د. فاطمة الزهراء",
      specialty: "أخصائية طب أسنان الأطفال",
      experience: "8 سنوات خبرة",
      image:
        "https://images.unsplash.com/photo-1594824720259-6c73a635c9b9?w=300&h=300&fit=crop&crop=face",
      rating: 4.8,
      available: true,
    },
  ],
  timeSlots: [
    { time: "09:00", available: true },
    { time: "09:30", available: true },
    { time: "10:00", available: false },
    { time: "10:30", available: true },
    { time: "11:00", available: true },
    { time: "11:30", available: false },
    { time: "14:00", available: true },
    { time: "14:30", available: true },
    { time: "15:00", available: true },
    { time: "15:30", available: false },
    { time: "16:00", available: true },
    { time: "16:30", available: true },
  ],
};

// نموذج بيانات الحجز المبسط
interface BookingFormData {
  fullName: string;
  phone: string;
  additionalPhone: string;
  isFirstVisit: boolean;
  howDidYouKnow: string;
  notes: string;
}

const steps = [
  { id: 1, title: "الخدمة", icon: Stethoscope },
  { id: 2, title: "الطبيب", icon: UserCheck },
  { id: 3, title: "التاريخ والوقت", icon: Calendar },
  { id: 4, title: "معلومات المريض", icon: User },
  { id: 5, title: "تأكيد الحجز", icon: CheckCircle },
];

const amenityIcons: { [key: string]: any } = {
  "موقف سيارات مجاني": Car,
  "واي فاي عالي السرعة": Wifi,
  "صالة انتظار VIP": Building2,
  "تعقيم بالأوزون": Shield,
  "خدمة القهوة والشاي": Coffee,
};

export default function SimplifiedAppointmentBooking() {
  const { clinicId } = useParams();
  const navigate = useNavigate();

  const [currentStep, setCurrentStep] = useState(1);
  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const [selectedDoctor, setSelectedDoctor] = useState<Doctor | null>(null);
  const [selectedDate, setSelectedDate] = useState<string>("");
  const [selectedTime, setSelectedTime] = useState<string>("");
  const [currentDoctorIndex, setCurrentDoctorIndex] = useState(0);
  const [clinic, setClinic] = useState<ClinicInfo>(defaultClinicData);
  const [isLoadingClinic, setIsLoadingClinic] = useState(false);

  const [formData, setFormData] = useState<BookingFormData>({
    fullName: "",
    phone: "",
    additionalPhone: "",
    isFirstVisit: true,
    howDidYouKnow: "",
    notes: "",
  });

  // Load clinic data based on clinicId
  useEffect(() => {
    const loadClinicData = async () => {
      if (!clinicId) {
        setClinic(defaultClinicData);
        return;
      }

      setIsLoadingClinic(true);
      try {
        const response = await fetch(`/api/clinics/${clinicId}`);
        if (response.ok) {
          const data = await response.json();
          // Transform API data to match ClinicInfo interface
          setClinic({
            id: data.id,
            name: data.arabicName || data.name,
            description: data.description || "عيادة متخصصة في طب الأسنان",
            address: data.arabicAddress || data.address,
            phone: data.phone,
            image: data.image || defaultClinicData.image,
            rating: parseFloat(data.rating) || 4.5,
            reviews: data.reviewCount || 0,
            services: data.arabicServices?.map((service: string, index: number) => ({
              id: index + 1,
              name: service,
              duration: "45 دقيقة",
              icon: "🦷"
            })) || defaultClinicData.services,
            doctors: defaultClinicData.doctors, // Use default doctors for now
            timeSlots: defaultClinicData.timeSlots,
            amenities: defaultClinicData.amenities
          });
        } else {
          console.error('Failed to load clinic data');
          setClinic(defaultClinicData);
        }
      } catch (error) {
        console.error('Error loading clinic:', error);
        setClinic(defaultClinicData);
      } finally {
        setIsLoadingClinic(false);
      }
    };

    loadClinicData();
  }, [clinicId]);

  // توليد تواريخ للأسبوع القادم
  const generateDates = () => {
    const dates = [];
    const today = new Date();
    for (let i = 0; i < 7; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() + i);
      dates.push({
        date: date.toISOString().split("T")[0],
        dayName: date.toLocaleDateString("ar-IQ", { weekday: "short" }),
        dayNumber: date.getDate(),
      });
    }
    return dates;
  };

  const availableDates = generateDates();
  const doctorsPerPage = 2;
  const totalPages = Math.ceil(clinic.doctors.length / doctorsPerPage);

  const handleNext = () => {
    if (currentStep < steps.length) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleFormSubmit = () => {
    // مع��لجة إرسال النموذج
    console.log("Booking submitted:", {
      service: selectedService,
      doctor: selectedDoctor,
      date: selectedDate,
      time: selectedTime,
      formData,
    });
    alert("تم إرسال طلب الحجز بنجاح!");
  };

  const getCurrentDoctors = () => {
    const startIndex = currentDoctorIndex * doctorsPerPage;
    return clinic.doctors.slice(startIndex, startIndex + doctorsPerPage);
  };

  const canProceed = () => {
    switch (currentStep) {
      case 1:
        return selectedService !== null;
      case 2:
        return selectedDoctor !== null;
      case 3:
        return selectedDate && selectedTime;
      case 4:
        return formData.fullName && formData.phone;
      case 5:
        return true;
      default:
        return false;
    }
  };

  const renderClinicInfo = () => {
    if (currentStep > 2) return null;

    return (
      <div className="bg-white rounded-xl shadow-lg p-4 md:p-6 mb-6">
        <div className="flex flex-col md:flex-row gap-6">
          <img
            src={clinic.image}
            alt={clinic.name}
            className="w-full md:w-64 h-48 object-cover rounded-lg"
          />
          <div className="flex-1">
            <h1 className="text-xl md:text-2xl font-bold text-gray-900 mb-2">
              {clinic.name}
            </h1>
            <p className="text-gray-600 mb-3">{clinic.description}</p>
            <div className="flex items-center gap-4 mb-3">
              <div className="flex items-center gap-1">
                <Star className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                <span className="font-semibold">{clinic.rating}</span>
                <span className="text-gray-500">
                  ({clinic.reviews} تقييم)
                </span>
              </div>
            </div>
            <div className="flex items-center gap-2 text-gray-600 mb-4">
              <MapPin className="w-4 h-4" />
              <span className="text-sm">{clinic.address}</span>
            </div>
            <div className="flex items-center gap-2 text-gray-600">
              <Phone className="w-4 h-4" />
              <span className="text-sm">{clinic.phone}</span>
            </div>
          </div>
        </div>

        {/* مرافق العيادة */}
        <div className="mt-6 pt-6 border-t border-gray-200">
          <h3 className="text-base md:text-lg font-semibold text-gray-900 mb-4">
            مرافق العيادة
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
            {clinic.amenities.map((amenity, index) => {
              const IconComponent = amenityIcons[amenity] || Building2;
              return (
                <div
                  key={index}
                  className="flex items-center gap-2 p-3 bg-blue-50 rounded-lg"
                >
                  <IconComponent className="w-4 h-4 text-blue-600" />
                  <span className="text-sm text-gray-700">{amenity}</span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    );
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-4">
            <h2 className="text-xl font-bold text-gray-900 mb-6">
              اختر الخدمة المطلوبة
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {clinic.services.map((service) => (
                <button
                  key={service.id}
                  onClick={() => setSelectedService(service)}
                  className={cn(
                    "p-3 md:p-4 rounded-lg border-2 text-right transition-all",
                    selectedService?.id === service.id
                      ? "border-blue-500 bg-blue-50"
                      : "border-gray-200 hover:border-gray-300 bg-white",
                  )}
                >
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{service.icon}</span>
                    <div>
                      <h3 className="font-semibold text-gray-900">
                        {service.name}
                      </h3>
                      <p className="text-sm text-gray-500">
                        {service.duration}
                      </p>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            <h2 className="text-lg md:text-xl font-bold text-gray-900">اختر الطبيب</h2>

            {/* بطاقات الأطباء - بطاقتين أفقيتين */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {getCurrentDoctors().map((doctor) => (
                <button
                  key={doctor.id}
                  onClick={() => setSelectedDoctor(doctor)}
                  className={cn(
                    "p-3 md:p-4 rounded-lg border-2 text-right transition-all",
                    selectedDoctor?.id === doctor.id
                      ? "border-blue-500 bg-blue-50"
                      : "border-gray-200 hover:border-gray-300 bg-white",
                  )}
                >
                  <div className="flex items-center gap-4">
                    <img
                      src={doctor.image}
                      alt={doctor.name}
                      className="w-16 h-16 rounded-full object-cover"
                    />
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900">
                        {doctor.name}
                      </h3>
                      <p className="text-sm text-gray-600">
                        {doctor.specialty}
                      </p>
                      <div className="flex items-center gap-2 mt-1">
                        <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                        <span className="text-sm text-gray-700">
                          {doctor.rating}
                        </span>
                      </div>
                    </div>
                  </div>
                </button>
              ))}
            </div>

            {/* شريط التنقل بين الأطباء */}
            {totalPages > 1 && (
              <div className="flex justify-center items-center gap-4 mt-6">
                <button
                  onClick={() =>
                    setCurrentDoctorIndex(Math.max(0, currentDoctorIndex - 1))
                  }
                  disabled={currentDoctorIndex === 0}
                  className="p-2 rounded-lg bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
                <span className="text-sm text-gray-600">
                  {currentDoctorIndex + 1} من {totalPages}
                </span>
                <button
                  onClick={() =>
                    setCurrentDoctorIndex(
                      Math.min(totalPages - 1, currentDoctorIndex + 1),
                    )
                  }
                  disabled={currentDoctorIndex === totalPages - 1}
                  className="p-2 rounded-lg bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
              </div>
            )}
          </div>
        );

      case 3:
        return (
          <div className="space-y-6">
            <h2 className="text-lg md:text-xl font-bold text-gray-900">
              اختر التاريخ والوقت
            </h2>

            {/* التاريخ */}
            <div>
              <h3 className="text-base md:text-lg font-semibold text-gray-900 mb-4">
                التاريخ
              </h3>
              <div className="grid grid-cols-7 gap-2">
                {availableDates.map((dateInfo) => (
                  <button
                    key={dateInfo.date}
                    onClick={() => setSelectedDate(dateInfo.date)}
                    className={cn(
                      "p-2 rounded-lg text-center transition-all",
                      selectedDate === dateInfo.date
                        ? "bg-blue-500 text-white"
                        : "bg-gray-100 hover:bg-gray-200 text-gray-700",
                    )}
                  >
                    <div className="text-xs">{dateInfo.dayName}</div>
                    <div className="text-sm font-semibold">
                      {dateInfo.dayNumber}
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* الوقت */}
            {selectedDate && (
              <div>
                <h3 className="text-base md:text-lg font-semibold text-gray-900 mb-4">
                  الوقت المتاح
                </h3>
                <div className="grid grid-cols-3 md:grid-cols-4 gap-3">
                  {clinic.timeSlots.map((slot) => (
                    <button
                      key={slot.time}
                      onClick={() =>
                        slot.available && setSelectedTime(slot.time)
                      }
                      disabled={!slot.available}
                      className={cn(
                        "p-2 rounded-lg text-center transition-all",
                        !slot.available &&
                          "opacity-50 cursor-not-allowed bg-gray-100",
                        slot.available &&
                          selectedTime === slot.time &&
                          "bg-blue-500 text-white",
                        slot.available &&
                          selectedTime !== slot.time &&
                          "bg-gray-100 hover:bg-gray-200",
                      )}
                    >
                      {slot.time}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        );

      case 4:
        return (
          <div className="space-y-6">
            <h2 className="text-lg md:text-xl font-bold text-gray-900">معلومات المريض</h2>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  الاسم الكامل *
                </label>
                <input
                  type="text"
                  value={formData.fullName}
                  onChange={(e) =>
                    setFormData({ ...formData, fullName: e.target.value })
                  }
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="أدخل اسمك الكامل"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  رقم الهاتف *
                </label>
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) =>
                    setFormData({ ...formData, phone: e.target.value })
                  }
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="07XX XXX XXXX"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  رقم هاتف إضافي (اختياري)
                </label>
                <input
                  type="tel"
                  value={formData.additionalPhone}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      additionalPhone: e.target.value,
                    })
                  }
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="07XX XXX XXXX"
                />
              </div>

              <div>
                <label className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    checked={formData.isFirstVisit}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        isFirstVisit: e.target.checked,
                      })
                    }
                    className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                  />
                  <span className="text-sm text-gray-700">
                    هذه زيارتي الأولى للعيادة
                  </span>
                </label>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  كيف علمت بنا؟
                </label>
                <select
                  value={formData.howDidYouKnow}
                  onChange={(e) =>
                    setFormData({ ...formData, howDidYouKnow: e.target.value })
                  }
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">اختر...</option>
                  <option value="google">جوجل</option>
                  <option value="facebook">فيسبوك</option>
                  <option value="friend">صديق أو قريب</option>
                  <option value="ad">إعلان</option>
                  <option value="other">أخرى</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  ملاحظات
                </label>
                <textarea
                  value={formData.notes}
                  onChange={(e) =>
                    setFormData({ ...formData, notes: e.target.value })
                  }
                  rows={3}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="أي ملاحظات إضافية..."
                />
              </div>
            </div>
          </div>
        );

      case 5:
        return (
          <div className="space-y-6">
            <h2 className="text-lg md:text-xl font-bold text-gray-900">تأكيد الحجز</h2>

            <div className="bg-gray-50 rounded-lg p-4 md:p-6 space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-gray-600">الخدمة:</span>
                <span className="font-semibold">{selectedService?.name}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">الطبيب:</span>
                <span className="font-semibold">{selectedDoctor?.name}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">التاريخ:</span>
                <span className="font-semibold">{selectedDate}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">الوقت:</span>
                <span className="font-semibold">{selectedTime}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">اسم المريض:</span>
                <span className="font-semibold">{formData.fullName}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">رقم الهاتف:</span>
                <span className="font-semibold">{formData.phone}</span>
              </div>
            </div>

            <button
              onClick={handleFormSubmit}
              className="w-full bg-blue-600 text-white py-2.5 md:py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
            >
              تأكيد الحجز
            </button>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 with-floating-nav">
      {/* العودة للخلف */}
      <div className="bg-white border-b border-gray-200 p-4">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>العودة</span>
        </button>
      </div>

      <div className="max-w-4xl mx-auto p-4 pb-32">
        {/* معلومات العيادة */}
        {renderClinicInfo()}

        {/* شريط التقدم */}
        <div className="bg-white rounded-xl shadow-lg p-4 md:p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            {steps.map((step, index) => (
              <div key={step.id} className="flex items-center">
                <div
                  className={cn(
                    "w-10 h-10 rounded-full flex items-center justify-center transition-all",
                    currentStep >= step.id
                      ? "bg-blue-600 text-white"
                      : "bg-gray-200 text-gray-400",
                  )}
                >
                  <step.icon className="w-5 h-5" />
                </div>
                {index < steps.length - 1 && (
                  <div
                    className={cn(
                      "w-12 h-1 mx-2 transition-all",
                      currentStep > step.id ? "bg-blue-600" : "bg-gray-200",
                    )}
                  />
                )}
              </div>
            ))}
          </div>
          <div className="text-center">
            <h3 className="font-semibold text-gray-900">
              {steps[currentStep - 1]?.title}
            </h3>
          </div>
        </div>

        {/* محتوى الخطوة */}
        <div className="bg-white rounded-xl shadow-lg p-4 md:p-6 mb-6">
          {renderStepContent()}
        </div>

        {/* أزرار التنقل */}
        <div className="fixed bottom-20 left-0 right-0 bg-white border-t border-gray-200 p-4">
          <div className="max-w-4xl mx-auto flex justify-between gap-4">
            <button
              onClick={handlePrevious}
              disabled={currentStep === 1}
              className="flex items-center gap-2 px-4 md:px-6 py-2.5 md:py-3 bg-gray-100 text-gray-700 rounded-lg font-semibold disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-200 transition-colors"
            >
              <ArrowRight className="w-5 h-5" />
              السابق
            </button>

            <button
              onClick={handleNext}
              disabled={!canProceed() || currentStep === steps.length}
              className="flex items-center gap-2 px-4 md:px-6 py-2.5 md:py-3 bg-blue-600 text-white rounded-lg font-semibold disabled:opacity-50 disabled:cursor-not-allowed hover:bg-blue-700 transition-colors"
            >
              التالي
              <ArrowLeft className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

    </div>
  );
}
