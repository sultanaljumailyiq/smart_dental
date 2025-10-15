import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Calendar,
  Clock,
  User,
  Phone,
  Mail,
  MapPin,
  Star,
  Shield,
  CheckCircle,
  ArrowLeft,
  Send,
  Stethoscope,
  Heart,
  Award,
  Users,
  ChevronDown,
  ChevronRight,
  MessageSquare,
  CreditCard,
  FileText,
  AlertCircle,
  Check,
  X,
  CalendarDays,
  UserCheck,
  Building2,
  Timer,
  Activity,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface Doctor {
  id: number;
  name: string;
  title: string;
  specialties: string[];
  experience: string;
  image: string;
  rating: number;
  reviews: number;
  available: boolean;
  languages: string[];
  consultationFee: number;
}

interface TimeSlot {
  time: string;
  available: boolean;
  fee?: number;
}

interface Service {
  id: number;
  name: string;
  description: string;
  duration: string;
  price: number;
  category: string;
  icon: string;
}

interface ClinicInfo {
  id: number;
  name: string;
  description: string;
  address: string;
  phone: string;
  email: string;
  image: string;
  rating: number;
  reviews: number;
  services: Service[];
  doctors: Doctor[];
  timeSlots: TimeSlot[];
  workingDays: string[];
  amenities: string[];
  insuranceAccepted: string[];
  paymentMethods: string[];
}

// Enhanced mock clinic data
const clinicData: ClinicInfo = {
  id: 1,
  name: "عيادة الدكتور أحمد للأسنان المتطورة",
  description:
    "عيادة رائدة في طب الأسنان التجميلي والزراعة باستخدام أحدث التقنيات الألمانية والأمريكية",
  address: "شارع الكرادة، بناية النور الطبية، الطابق الثالث، بغداد",
  phone: "+964 770 123 4567",
  email: "info@dr-ahmed-dental.com",
  image:
    "https://images.unsplash.com/photo-1629909613654-28e377c37b09?w=800&h=400&fit=crop",
  rating: 4.9,
  reviews: 312,
  workingDays: ["الأحد", "الاثنين", "الثلاثاء", "الأربعاء", "الخميس"],
  amenities: [
    "موقف سيارات مجاني",
    "واي فاي عالي السرعة",
    "صالة انتظار VIP",
    "تعقيم بالأوزون",
    "خدمة القهوة والشاي",
    "مصعد للمعاقين",
  ],
  insuranceAccepted: [
    "التأمين الصحي الوطني",
    "بوبا",
    "نكست كير",
    "الضمان الصحي",
  ],
  paymentMethods: ["نقداً", "بطاقة ائتمان", "تقسيط", "تحويل بنكي"],
  services: [
    {
      id: 1,
      name: "زراعة الأسنان",
      description: "زراعة أسنان باستخدام التقنيات الألمانية المتطورة",
      duration: "90 دقيقة",
      price: 150000,
      category: "جراحة",
      icon: "🦷",
    },
    {
      id: 2,
      name: "تبييض الأسنان",
      description: "تبييض احترافي بالليزر البارد",
      duration: "60 دقيقة",
      price: 75000,
      category: "تجميل",
      icon: "✨",
    },
    {
      id: 3,
      name: "تقويم الأسنان",
      description: "تقويم شفاف وتقليدي",
      duration: "45 دقيقة",
      price: 50000,
      category: "تقويم",
      icon: "🔧",
    },
    {
      id: 4,
      name: "علاج العصب",
      description: "علاج جذور الأسنان بالمجهر",
      duration: "120 دقيقة",
      price: 100000,
      category: "علاج",
      icon: "🔬",
    },
    {
      id: 5,
      name: "تنظيف الأسنان",
      description: "تنظيف شامل وإزالة الجير",
      duration: "30 دقيقة",
      price: 25000,
      category: "وقاية",
      icon: "🧽",
    },
    {
      id: 6,
      name: "حشوات تجميلية",
      description: "حشوات بيضاء طبيعية اللون",
      duration: "45 دقيقة",
      price: 40000,
      category: "تجميل",
      icon: "💎",
    },
  ],
  doctors: [
    {
      id: 1,
      name: "د. أحمد الرحمة",
      title: "استشاري زراعة الأسنان",
      specialties: ["زراعة الأسنان", "جراحة الفم والفكين", "التقويم الجراحي"],
      experience: "15 سنة خبرة",
      image:
        "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=300&h=300&fit=crop&crop=face",
      rating: 4.9,
      reviews: 156,
      available: true,
      languages: ["العربية", "الإنجليزية", "الألمانية"],
      consultationFee: 30000,
    },
    {
      id: 2,
      name: "د. سارة النور",
      title: "أخصائية تقويم الأسنان",
      specialties: ["تقويم الأسنان", "طب أسنان الأطفال", "التقويم الشفاف"],
      experience: "12 سنة خبرة",
      image:
        "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=300&h=300&fit=crop&crop=face",
      rating: 4.8,
      reviews: 89,
      available: true,
      languages: ["العربية", "الإنجليزية", "الفرنسية"],
      consultationFee: 25000,
    },
    {
      id: 3,
      name: "د. محمد العلي",
      title: "أخصائي طب الأسنان التجميلي",
      specialties: ["طب الأسنان التجميلي", "تبييض الأسنان", "القشور الخزفية"],
      experience: "10 سنوات خبرة",
      image:
        "https://images.unsplash.com/photo-1582750433449-648ed127bb54?w=300&h=300&fit=crop&crop=face",
      rating: 4.7,
      reviews: 234,
      available: true,
      languages: ["العربية", "الإنجليزية"],
      consultationFee: 35000,
    },
  ],
  timeSlots: [
    { time: "09:00", available: true, fee: 0 },
    { time: "09:30", available: true, fee: 0 },
    { time: "10:00", available: false },
    { time: "10:30", available: true, fee: 0 },
    { time: "11:00", available: true, fee: 0 },
    { time: "11:30", available: false },
    { time: "14:00", available: true, fee: 0 },
    { time: "14:30", available: true, fee: 0 },
    { time: "15:00", available: true, fee: 0 },
    { time: "15:30", available: false },
    { time: "16:00", available: true, fee: 0 },
    { time: "16:30", available: true, fee: 0 },
    { time: "17:00", available: true, fee: 5000 }, // رسوم إضافية للمواعيد المسائية
    { time: "17:30", available: true, fee: 5000 },
  ],
};

interface BookingFormData {
  fullName: string;
  phone: string;
  email: string;
  dateOfBirth: string;
  gender: string;
  emergencyContact: string;
  emergencyPhone: string;
  medicalHistory: string;
  currentMedications: string;
  allergies: string;
  insuranceProvider: string;
  insuranceNumber: string;
  paymentMethod: string;
  notes: string;
  isFirstVisit: boolean;
  referredBy: string;
  preferredLanguage: string;
}

export default function ModernAppointmentBooking() {
  const { clinicId } = useParams();
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedDoctor, setSelectedDoctor] = useState<Doctor | null>(null);
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedTime, setSelectedTime] = useState("");
  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);

  const [formData, setFormData] = useState<BookingFormData>({
    fullName: "",
    phone: "",
    email: "",
    dateOfBirth: "",
    gender: "",
    emergencyContact: "",
    emergencyPhone: "",
    medicalHistory: "",
    currentMedications: "",
    allergies: "",
    insuranceProvider: "",
    insuranceNumber: "",
    paymentMethod: "",
    notes: "",
    isFirstVisit: true,
    referredBy: "",
    preferredLanguage: "العربية",
  });

  // Generate next 14 days
  const generateDates = () => {
    const dates = [];
    const today = new Date();
    for (let i = 1; i <= 14; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() + i);
      dates.push({
        value: date.toISOString().split("T")[0],
        label: date.toLocaleDateString("ar-IQ", {
          weekday: "short",
          month: "short",
          day: "numeric",
        }),
        fullDate: date.toLocaleDateString("ar-IQ", {
          weekday: "long",
          year: "numeric",
          month: "long",
          day: "numeric",
        }),
        dayName: date.toLocaleDateString("ar-IQ", { weekday: "long" }),
        isWorkingDay: clinicData.workingDays.includes(
          date.toLocaleDateString("ar-IQ", { weekday: "long" }),
        ),
      });
    }
    return dates.filter((date) => date.isWorkingDay);
  };

  const availableDates = generateDates();

  const calculateTotalCost = () => {
    let total = 0;
    if (selectedService) total += selectedService.price;
    if (selectedDoctor) total += selectedDoctor.consultationFee;
    if (selectedTime) {
      const timeSlot = clinicData.timeSlots.find(
        (slot) => slot.time === selectedTime,
      );
      if (timeSlot?.fee) total += timeSlot.fee;
    }
    return total;
  };

  const handleBooking = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Simulate API call to clinic management system
      await new Promise((resolve) => setTimeout(resolve, 2000));

      // Here you would integrate with the actual clinic management system
      const bookingData = {
        clinic: clinicData.name,
        doctor: selectedDoctor,
        service: selectedService,
        date: selectedDate,
        time: selectedTime,
        patient: formData,
        totalCost: calculateTotalCost(),
        bookingReference: `BK${Date.now()}`,
        status: "pending_confirmation",
        createdAt: new Date().toISOString(),
      };

      console.log("Booking submitted:", bookingData);
      setShowConfirmation(true);
    } catch (error) {
      console.error("Booking error:", error);
      alert("حدث خطأ أثناء الحجز. يرجى المحاولة مرة أخرى.");
    } finally {
      setIsLoading(false);
    }
  };

  const nextStep = () => {
    setCurrentStep((prev) => Math.min(prev + 1, 5));
  };

  const prevStep = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 1));
  };

  const canProceedFromStep = (step: number) => {
    switch (step) {
      case 1:
        return selectedDoctor !== null;
      case 2:
        return selectedService !== null;
      case 3:
        return selectedDate !== "";
      case 4:
        return selectedTime !== "";
      case 5:
        return formData.fullName && formData.phone;
      default:
        return false;
    }
  };

  if (showConfirmation) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white rounded-3xl shadow-2xl p-8 text-center">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="w-12 h-12 text-green-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            تم الحجز بنجاح!
          </h2>
          <p className="text-gray-600 mb-6">
            تم إرسال طلب حجز موعدك بنجاح. سيتم التواصل معك خلال 30 دقيقة لتأكيد
            الموعد.
          </p>
          <div className="bg-gray-50 rounded-xl p-4 mb-6 text-right">
            <div className="text-sm text-gray-600 space-y-1">
              <div>
                رقم المرجع: <span className="font-bold">BK{Date.now()}</span>
              </div>
              <div>
                الطبيب:{" "}
                <span className="font-bold">{selectedDoctor?.name}</span>
              </div>
              <div>
                التاريخ: <span className="font-bold">{selectedDate}</span>
              </div>
              <div>
                الوقت: <span className="font-bold">{selectedTime}</span>
              </div>
            </div>
          </div>
          <button
            onClick={() => navigate("/medical-services")}
            className="w-full bg-blue-600 text-white py-3 rounded-xl hover:bg-blue-700 transition-colors font-medium"
          >
            العودة للخدمات الطبية
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 with-floating-nav">
      {/* Enhanced Header */}
      <div className="bg-white/80 backdrop-blur-lg border-b border-gray-200/50 sticky top-0 z-40">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={() => navigate(-1)}
                className="p-2 hover:bg-gray-100 rounded-xl transition-colors"
              >
                <ArrowLeft className="w-5 h-5 text-gray-600" />
              </button>
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
                  <CalendarDays className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h1 className="text-xl font-bold text-gray-900">
                    حجز موعد متطور
                  </h1>
                  <p className="text-sm text-gray-600">{clinicData.name}</p>
                </div>
              </div>
            </div>

            {/* Progress Indicator */}
            <div className="hidden md:flex items-center gap-2">
              {[1, 2, 3, 4, 5].map((step) => (
                <div key={step} className="flex items-center">
                  <div
                    className={cn(
                      "w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-all",
                      currentStep >= step
                        ? "bg-blue-600 text-white"
                        : "bg-gray-200 text-gray-500",
                    )}
                  >
                    {currentStep > step ? <Check className="w-4 h-4" /> : step}
                  </div>
                  {step < 5 && (
                    <div
                      className={cn(
                        "w-8 h-1 mx-1 rounded-full transition-all",
                        currentStep > step ? "bg-blue-600" : "bg-gray-200",
                      )}
                    />
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-6">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Step 1: Choose Doctor */}
            {currentStep === 1 && (
              <div className="bg-white rounded-3xl shadow-xl overflow-hidden">
                <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-6 text-white">
                  <h2 className="text-2xl font-bold flex items-center gap-3">
                    <UserCheck className="w-8 h-8" />
                    اختر الطبيب المعالج
                  </h2>
                  <p className="mt-2 opacity-90">
                    اختر الطبيب الأنسب لحالتك من فريقنا المتخصص
                  </p>
                </div>

                <div className="p-6 space-y-4">
                  {clinicData.doctors.map((doctor) => (
                    <div
                      key={doctor.id}
                      onClick={() => setSelectedDoctor(doctor)}
                      className={cn(
                        "group p-6 rounded-2xl border-2 cursor-pointer transition-all hover:shadow-lg",
                        selectedDoctor?.id === doctor.id
                          ? "border-blue-500 bg-blue-50 shadow-md"
                          : "border-gray-200 hover:border-blue-300",
                      )}
                    >
                      <div className="flex items-start gap-6">
                        <div className="relative">
                          <img
                            src={doctor.image}
                            alt={doctor.name}
                            className="w-24 h-24 rounded-2xl object-cover"
                          />
                          <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                            <div className="w-3 h-3 bg-white rounded-full"></div>
                          </div>
                        </div>

                        <div className="flex-1">
                          <div className="flex items-start justify-between mb-3">
                            <div>
                              <h3 className="text-xl font-bold text-gray-900">
                                {doctor.name}
                              </h3>
                              <p className="text-blue-600 font-medium">
                                {doctor.title}
                              </p>
                              <p className="text-gray-600 text-sm">
                                {doctor.experience}
                              </p>
                            </div>
                            <div className="text-left">
                              <div className="flex items-center gap-1 mb-1">
                                <Star className="w-4 h-4 text-yellow-400 fill-current" />
                                <span className="font-bold text-gray-900">
                                  {doctor.rating}
                                </span>
                              </div>
                              <p className="text-sm text-gray-500">
                                ({doctor.reviews} تقييم)
                              </p>
                            </div>
                          </div>

                          <div className="grid md:grid-cols-2 gap-4 mb-4">
                            <div>
                              <p className="text-sm font-medium text-gray-700 mb-2">
                                التخصصات:
                              </p>
                              <div className="flex flex-wrap gap-1">
                                {doctor.specialties.map((specialty, idx) => (
                                  <span
                                    key={idx}
                                    className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-lg"
                                  >
                                    {specialty}
                                  </span>
                                ))}
                              </div>
                            </div>
                            <div>
                              <p className="text-sm font-medium text-gray-700 mb-2">
                                اللغات:
                              </p>
                              <div className="flex flex-wrap gap-1">
                                {doctor.languages.map((language, idx) => (
                                  <span
                                    key={idx}
                                    className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded-lg"
                                  >
                                    {language}
                                  </span>
                                ))}
                              </div>
                            </div>
                          </div>

                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <CreditCard className="w-4 h-4 text-gray-500" />
                              <span className="text-sm text-gray-600">
                                رسوم الاستشارة:{" "}
                                <span className="font-bold text-green-600">
                                  {doctor.consultationFee.toLocaleString()} د.ع
                                </span>
                              </span>
                            </div>
                            <ChevronRight
                              className={cn(
                                "w-5 h-5 transition-transform",
                                selectedDoctor?.id === doctor.id
                                  ? "rotate-90 text-blue-600"
                                  : "text-gray-400",
                              )}
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Step 2: Choose Service */}
            {currentStep === 2 && (
              <div className="bg-white rounded-3xl shadow-xl overflow-hidden">
                <div className="bg-gradient-to-r from-green-600 to-teal-600 p-6 text-white">
                  <h2 className="text-2xl font-bold flex items-center gap-3">
                    <Activity className="w-8 h-8" />
                    اختر الخدمة المطلوبة
                  </h2>
                  <p className="mt-2 opacity-90">
                    حدد نوع العلاج أو الخدمة التي تحتاجها
                  </p>
                </div>

                <div className="p-6">
                  <div className="grid md:grid-cols-2 gap-4">
                    {clinicData.services.map((service) => (
                      <div
                        key={service.id}
                        onClick={() => setSelectedService(service)}
                        className={cn(
                          "p-6 rounded-2xl border-2 cursor-pointer transition-all hover:shadow-lg",
                          selectedService?.id === service.id
                            ? "border-green-500 bg-green-50 shadow-md"
                            : "border-gray-200 hover:border-green-300",
                        )}
                      >
                        <div className="flex items-start gap-4">
                          <div className="text-3xl">{service.icon}</div>
                          <div className="flex-1">
                            <h3 className="font-bold text-gray-900 mb-2">
                              {service.name}
                            </h3>
                            <p className="text-gray-600 text-sm mb-3">
                              {service.description}
                            </p>
                            <div className="space-y-2">
                              <div className="flex justify-between text-sm">
                                <span className="text-gray-500">المدة:</span>
                                <span className="font-medium">
                                  {service.duration}
                                </span>
                              </div>
                              <div className="flex justify-between text-sm">
                                <span className="text-gray-500">التكلفة:</span>
                                <span className="font-bold text-green-600">
                                  {service.price.toLocaleString()} د.ع
                                </span>
                              </div>
                              <div className="flex justify-between text-sm">
                                <span className="text-gray-500">الفئة:</span>
                                <span className="font-medium">
                                  {service.category}
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Step 3: Choose Date */}
            {currentStep === 3 && (
              <div className="bg-white rounded-3xl shadow-xl overflow-hidden">
                <div className="bg-gradient-to-r from-purple-600 to-pink-600 p-6 text-white">
                  <h2 className="text-2xl font-bold flex items-center gap-3">
                    <Calendar className="w-8 h-8" />
                    اختر تاريخ الموعد
                  </h2>
                  <p className="mt-2 opacity-90">
                    حدد اليوم المناسب لك من التواريخ المتاحة
                  </p>
                </div>

                <div className="p-6">
                  <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {availableDates.map((date) => (
                      <button
                        key={date.value}
                        onClick={() => setSelectedDate(date.value)}
                        className={cn(
                          "p-4 rounded-2xl text-right border-2 transition-all hover:shadow-lg",
                          selectedDate === date.value
                            ? "border-purple-500 bg-purple-50 shadow-md"
                            : "border-gray-200 hover:border-purple-300 bg-white",
                        )}
                      >
                        <div className="text-lg font-bold text-gray-900 mb-1">
                          {date.dayName}
                        </div>
                        <div className="text-sm text-gray-600">
                          {date.label}
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Step 4: Choose Time */}
            {currentStep === 4 && (
              <div className="bg-white rounded-3xl shadow-xl overflow-hidden">
                <div className="bg-gradient-to-r from-orange-600 to-red-600 p-6 text-white">
                  <h2 className="text-2xl font-bold flex items-center gap-3">
                    <Clock className="w-8 h-8" />
                    اختر وقت الموعد
                  </h2>
                  <p className="mt-2 opacity-90">
                    حدد الوقت المناسب من الأوقات المتاحة
                  </p>
                </div>

                <div className="p-6">
                  <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
                    {clinicData.timeSlots.map((slot) => (
                      <button
                        key={slot.time}
                        onClick={() =>
                          slot.available && setSelectedTime(slot.time)
                        }
                        disabled={!slot.available}
                        className={cn(
                          "p-4 rounded-xl text-center transition-all border-2",
                          selectedTime === slot.time
                            ? "border-orange-500 bg-orange-50 text-orange-700 shadow-md"
                            : slot.available
                              ? "border-gray-200 hover:border-orange-300 bg-white text-gray-700 hover:shadow-lg"
                              : "border-gray-100 bg-gray-50 text-gray-400 cursor-not-allowed opacity-50",
                        )}
                      >
                        <div className="font-bold">{slot.time}</div>
                        {slot.fee && slot.fee > 0 && (
                          <div className="text-xs text-orange-600 mt-1">
                            +{slot.fee.toLocaleString()}
                          </div>
                        )}
                      </button>
                    ))}
                  </div>

                  <div className="mt-6 p-4 bg-blue-50 rounded-xl">
                    <div className="flex items-center gap-2 text-blue-700">
                      <AlertCircle className="w-5 h-5" />
                      <span className="font-medium">ملاحظة:</span>
                    </div>
                    <p className="text-blue-600 text-sm mt-1">
                      المواعيد المسائية (بعد الساعة 5:00 مساءً) تتطلب رسوم
                      إضافية قدرها 5,000 د.ع
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Step 5: Patient Information Form */}
            {currentStep === 5 && (
              <div className="bg-white rounded-3xl shadow-xl overflow-hidden">
                <div className="bg-gradient-to-r from-indigo-600 to-blue-600 p-6 text-white">
                  <h2 className="text-2xl font-bold flex items-center gap-3">
                    <FileText className="w-8 h-8" />
                    معلومات المريض
                  </h2>
                  <p className="mt-2 opacity-90">
                    أدخل معلوماتك الشخصية والطبية لإكمال الحجز
                  </p>
                </div>

                <form onSubmit={handleBooking} className="p-6 space-y-6">
                  {/* Personal Information */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                      <User className="w-5 h-5" />
                      المعلومات الشخصية
                    </h3>

                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          الاسم الكامل *
                        </label>
                        <input
                          type="text"
                          required
                          value={formData.fullName}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              fullName: e.target.value,
                            })
                          }
                          className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                          placeholder="أدخل اسمك الكامل"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          رقم الهاتف *
                        </label>
                        <input
                          type="tel"
                          required
                          value={formData.phone}
                          onChange={(e) =>
                            setFormData({ ...formData, phone: e.target.value })
                          }
                          className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                          placeholder="+964 7XX XXX XXXX"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          البريد الإلكتروني
                        </label>
                        <input
                          type="email"
                          value={formData.email}
                          onChange={(e) =>
                            setFormData({ ...formData, email: e.target.value })
                          }
                          className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                          placeholder="example@email.com"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          تاريخ الميلاد
                        </label>
                        <input
                          type="date"
                          value={formData.dateOfBirth}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              dateOfBirth: e.target.value,
                            })
                          }
                          className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          الجنس
                        </label>
                        <select
                          value={formData.gender}
                          onChange={(e) =>
                            setFormData({ ...formData, gender: e.target.value })
                          }
                          className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                        >
                          <option value="">اختر الجنس</option>
                          <option value="male">ذكر</option>
                          <option value="female">أنثى</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          اللغة المفضلة
                        </label>
                        <select
                          value={formData.preferredLanguage}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              preferredLanguage: e.target.value,
                            })
                          }
                          className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                        >
                          <option value="العربية">العربية</option>
                          <option value="الإنجليزية">الإنجليزية</option>
                          <option value="الكوردية">الكوردية</option>
                        </select>
                      </div>
                    </div>
                  </div>

                  {/* Emergency Contact */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                      <Phone className="w-5 h-5" />
                      جهة الاتصال في حالات الطوارئ
                    </h3>

                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          اسم جهة الاتصال
                        </label>
                        <input
                          type="text"
                          value={formData.emergencyContact}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              emergencyContact: e.target.value,
                            })
                          }
                          className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                          placeholder="اسم جهة الاتصال في الطوارئ"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          رقم هاتف الطوارئ
                        </label>
                        <input
                          type="tel"
                          value={formData.emergencyPhone}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              emergencyPhone: e.target.value,
                            })
                          }
                          className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                          placeholder="+964 7XX XXX XXXX"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Medical Information */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                      <Heart className="w-5 h-5" />
                      المعلومات الطبية
                    </h3>

                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          التاريخ المرضي
                        </label>
                        <textarea
                          rows={3}
                          value={formData.medicalHistory}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              medicalHistory: e.target.value,
                            })
                          }
                          className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                          placeholder="أي أمراض مزمنة أو عمليات جراحية سابقة..."
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          الأدوية الحالية
                        </label>
                        <textarea
                          rows={2}
                          value={formData.currentMedications}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              currentMedications: e.target.value,
                            })
                          }
                          className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                          placeholder="أذكر أي أدوية تتناولها حالياً..."
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          الحساسية
                        </label>
                        <textarea
                          rows={2}
                          value={formData.allergies}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              allergies: e.target.value,
                            })
                          }
                          className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                          placeholder="أي حساسية من أدوية أو مواد معينة..."
                        />
                      </div>
                    </div>
                  </div>

                  {/* Insurance & Payment */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                      <CreditCard className="w-5 h-5" />
                      التأمين وطريقة الدفع
                    </h3>

                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          مقدم التأمين
                        </label>
                        <select
                          value={formData.insuranceProvider}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              insuranceProvider: e.target.value,
                            })
                          }
                          className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                        >
                          <option value="">بدون تأمين</option>
                          {clinicData.insuranceAccepted.map((insurance) => (
                            <option key={insurance} value={insurance}>
                              {insurance}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          رقم بوليصة التأمين
                        </label>
                        <input
                          type="text"
                          value={formData.insuranceNumber}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              insuranceNumber: e.target.value,
                            })
                          }
                          className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                          placeholder="رقم بوليصة التأمين"
                          disabled={!formData.insuranceProvider}
                        />
                      </div>

                      <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          طريقة الدفع
                        </label>
                        <select
                          value={formData.paymentMethod}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              paymentMethod: e.target.value,
                            })
                          }
                          className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                        >
                          <option value="">اختر طريقة الدفع</option>
                          {clinicData.paymentMethods.map((method) => (
                            <option key={method} value={method}>
                              {method}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>
                  </div>

                  {/* Additional Information */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                      <MessageSquare className="w-5 h-5" />
                      معلومات إضافية
                    </h3>

                    <div className="space-y-4">
                      <div className="flex items-center gap-3">
                        <input
                          type="checkbox"
                          id="firstVisit"
                          checked={formData.isFirstVisit}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              isFirstVisit: e.target.checked,
                            })
                          }
                          className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                        />
                        <label
                          htmlFor="firstVisit"
                          className="text-sm text-gray-700"
                        >
                          هذه زيارتي الأولى ل��عيادة
                        </label>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          كيف علمت بنا؟
                        </label>
                        <select
                          value={formData.referredBy}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              referredBy: e.target.value,
                            })
                          }
                          className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                        >
                          <option value="">اختر الإجابة</option>
                          <option value="google">البحث في جوجل</option>
                          <option value="social">
                            وسائل التواصل الاجتماعي
                          </option>
                          <option value="friend">صديق أو قريب</option>
                          <option value="doctor">طبيب آخر</option>
                          <option value="advertisement">إعلان</option>
                          <option value="other">أخرى</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          ملاحظات أو ا��تفسارات إضافية
                        </label>
                        <textarea
                          rows={3}
                          value={formData.notes}
                          onChange={(e) =>
                            setFormData({ ...formData, notes: e.target.value })
                          }
                          className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                          placeholder="أي ملاحظات تود إضافتها أو أسئلة خاصة..."
                        />
                      </div>
                    </div>
                  </div>
                </form>
              </div>
            )}
          </div>

          {/* Sidebar - Booking Summary */}
          <div className="lg:col-span-1">
            <div className="sticky top-24 space-y-6">
              {/* Clinic Card */}
              <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
                <div className="relative h-32">
                  <img
                    src={clinicData.image}
                    alt={clinicData.name}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                  <div className="absolute bottom-3 left-3 right-3">
                    <h3 className="text-white font-bold">{clinicData.name}</h3>
                    <div className="flex items-center gap-2 text-white text-sm">
                      <MapPin className="w-3 h-3" />
                      <span>بغداد، الكرادة</span>
                    </div>
                  </div>
                </div>

                <div className="p-4">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-1">
                      <Star className="w-4 h-4 text-yellow-400 fill-current" />
                      <span className="font-bold">{clinicData.rating}</span>
                      <span className="text-sm text-gray-500">
                        ({clinicData.reviews})
                      </span>
                    </div>
                    <div className="flex items-center gap-1 text-green-600">
                      <div className="w-2 h-2 bg-green-600 rounded-full"></div>
                      <span className="text-sm font-medium">مفتوح الآن</span>
                    </div>
                  </div>

                  <div className="space-y-2 text-sm">
                    <div className="flex items-center gap-2">
                      <Phone className="w-4 h-4 text-gray-400" />
                      <span>{clinicData.phone}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Mail className="w-4 h-4 text-gray-400" />
                      <span>{clinicData.email}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Booking Summary */}
              <div className="bg-white rounded-2xl shadow-lg p-6">
                <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <FileText className="w-5 h-5" />
                  ملخص الحجز
                </h3>

                <div className="space-y-4">
                  <div
                    className={cn(
                      "p-3 rounded-xl border-2 transition-all",
                      selectedDoctor
                        ? "border-green-200 bg-green-50"
                        : "border-gray-200 bg-gray-50",
                    )}
                  >
                    <div className="flex items-center gap-2 mb-2">
                      <UserCheck className="w-4 h-4 text-gray-600" />
                      <span className="font-medium text-gray-700">الطبيب</span>
                    </div>
                    {selectedDoctor ? (
                      <div>
                        <p className="font-bold text-gray-900">
                          {selectedDoctor.name}
                        </p>
                        <p className="text-sm text-gray-600">
                          {selectedDoctor.title}
                        </p>
                        <p className="text-sm text-green-600 font-medium">
                          رسوم الاستشارة:{" "}
                          {selectedDoctor.consultationFee.toLocaleString()} د.ع
                        </p>
                      </div>
                    ) : (
                      <p className="text-gray-500 text-sm">لم يتم الاختيار</p>
                    )}
                  </div>

                  <div
                    className={cn(
                      "p-3 rounded-xl border-2 transition-all",
                      selectedService
                        ? "border-green-200 bg-green-50"
                        : "border-gray-200 bg-gray-50",
                    )}
                  >
                    <div className="flex items-center gap-2 mb-2">
                      <Activity className="w-4 h-4 text-gray-600" />
                      <span className="font-medium text-gray-700">الخدمة</span>
                    </div>
                    {selectedService ? (
                      <div>
                        <p className="font-bold text-gray-900">
                          {selectedService.name}
                        </p>
                        <p className="text-sm text-gray-600">
                          {selectedService.duration}
                        </p>
                        <p className="text-sm text-green-600 font-medium">
                          التكلفة: {selectedService.price.toLocaleString()} د.ع
                        </p>
                      </div>
                    ) : (
                      <p className="text-gray-500 text-sm">لم يتم الاختيار</p>
                    )}
                  </div>

                  <div
                    className={cn(
                      "p-3 rounded-xl border-2 transition-all",
                      selectedDate
                        ? "border-green-200 bg-green-50"
                        : "border-gray-200 bg-gray-50",
                    )}
                  >
                    <div className="flex items-center gap-2 mb-2">
                      <Calendar className="w-4 h-4 text-gray-600" />
                      <span className="font-medium text-gray-700">التاريخ</span>
                    </div>
                    {selectedDate ? (
                      <p className="font-bold text-gray-900">
                        {new Date(selectedDate).toLocaleDateString("ar-IQ", {
                          weekday: "long",
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        })}
                      </p>
                    ) : (
                      <p className="text-gray-500 text-sm">لم يتم الاختيار</p>
                    )}
                  </div>

                  <div
                    className={cn(
                      "p-3 rounded-xl border-2 transition-all",
                      selectedTime
                        ? "border-green-200 bg-green-50"
                        : "border-gray-200 bg-gray-50",
                    )}
                  >
                    <div className="flex items-center gap-2 mb-2">
                      <Clock className="w-4 h-4 text-gray-600" />
                      <span className="font-medium text-gray-700">الوقت</span>
                    </div>
                    {selectedTime ? (
                      <div>
                        <p className="font-bold text-gray-900">
                          {selectedTime}
                        </p>
                        {(() => {
                          const timeSlot = clinicData.timeSlots.find(
                            (slot) => slot.time === selectedTime,
                          );
                          return timeSlot?.fee ? (
                            <p className="text-sm text-orange-600 font-medium">
                              رسوم إضافية: {timeSlot.fee.toLocaleString()} د.ع
                            </p>
                          ) : null;
                        })()}
                      </div>
                    ) : (
                      <p className="text-gray-500 text-sm">لم يتم الاختيار</p>
                    )}
                  </div>
                </div>

                {/* Total Cost */}
                {selectedService && selectedDoctor && (
                  <div className="mt-6 pt-6 border-t border-gray-200">
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>تكلفة الخدمة:</span>
                        <span>
                          {selectedService.price.toLocaleString()} د.ع
                        </span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>رسوم الاستشارة:</span>
                        <span>
                          {selectedDoctor.consultationFee.toLocaleString()} د.ع
                        </span>
                      </div>
                      {(() => {
                        const timeSlot = clinicData.timeSlots.find(
                          (slot) => slot.time === selectedTime,
                        );
                        return timeSlot?.fee ? (
                          <div className="flex justify-between text-sm">
                            <span>رسوم إضافية:</span>
                            <span>{timeSlot.fee.toLocaleString()} د.ع</span>
                          </div>
                        ) : null;
                      })()}
                      <div className="flex justify-between font-bold text-lg border-t border-gray-200 pt-2">
                        <span>المجموع:</span>
                        <span className="text-green-600">
                          {calculateTotalCost().toLocaleString()} د.ع
                        </span>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Amenities */}
              <div className="bg-white rounded-2xl shadow-lg p-6">
                <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <Building2 className="w-5 h-5" />
                  مرافق العيادة
                </h3>
                <div className="space-y-2">
                  {clinicData.amenities.map((amenity, idx) => (
                    <div key={idx} className="flex items-center gap-2 text-sm">
                      <CheckCircle className="w-4 h-4 text-green-600" />
                      <span>{amenity}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Navigation Buttons */}
        <div className="max-w-4xl mx-auto mt-8">
          <div className="flex items-center justify-between gap-4">
            <button
              onClick={prevStep}
              disabled={currentStep === 1}
              className={cn(
                "flex items-center gap-2 px-6 py-3 rounded-xl font-medium transition-all",
                currentStep === 1
                  ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                  : "bg-gray-200 text-gray-700 hover:bg-gray-300",
              )}
            >
              <ArrowLeft className="w-4 h-4" />
              السابق
            </button>

            {currentStep < 5 ? (
              <button
                onClick={nextStep}
                disabled={!canProceedFromStep(currentStep)}
                className={cn(
                  "flex items-center gap-2 px-8 py-3 rounded-xl font-medium transition-all",
                  canProceedFromStep(currentStep)
                    ? "bg-blue-600 text-white hover:bg-blue-700 shadow-lg"
                    : "bg-gray-100 text-gray-400 cursor-not-allowed",
                )}
              >
                التالي
                <ChevronRight className="w-4 h-4" />
              </button>
            ) : (
              <button
                type="submit"
                form="booking-form"
                onClick={handleBooking}
                disabled={!canProceedFromStep(currentStep) || isLoading}
                className={cn(
                  "flex items-center gap-2 px-8 py-3 rounded-xl font-medium transition-all",
                  canProceedFromStep(currentStep) && !isLoading
                    ? "bg-green-600 text-white hover:bg-green-700 shadow-lg"
                    : "bg-gray-100 text-gray-400 cursor-not-allowed",
                )}
              >
                {isLoading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    جاري الحجز...
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4" />
                    تأكيد الحجز
                  </>
                )}
              </button>
            )}
          </div>
        </div>
      </div>

    </div>
  );
}
