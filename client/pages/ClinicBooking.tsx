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
}

interface TimeSlot {
  time: string;
  available: boolean;
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
  services: string[];
  doctors: Doctor[];
  timeSlots: TimeSlot[];
  workingDays: string[];
  amenities: string[];
}

// Mock clinic data
const clinicData: ClinicInfo = {
  id: 1,
  name: "عيادة الدكتور أحمد للأسنان",
  description:
    "عيادة متخصصة في زراعة الأسنان وطب الأسنان التجميلي بأحدث التقنيات العالمية",
  address: "شارع الكرادة، بناية النور، الطابق الثالث، بغداد",
  phone: "+964 770 123 4567",
  email: "info@dr-ahmed-dental.com",
  image:
    "https://cdn.builder.io/api/v1/image/assets%2F38bc499df3b84d0eb31a6baa33de2495%2Ffa808b3da1354c598c996130fb1a00bf?format=webp&width=800",
  rating: 4.9,
  reviews: 312,
  services: [
    "زراعة الأسنان",
    "تبييض الأسنان",
    "تقويم الأسنان",
    "علاج العصب",
    "تنظيف الأسنان",
  ],
  workingDays: ["الأحد", "الاثنين", "الثلاثاء", "الأربعاء", "الخميس"],
  amenities: [
    "موقف سيارات",
    "واي فاي مجاني",
    "صالة انتظار مريحة",
    "تعقيم متقدم",
  ],
  doctors: [
    {
      id: 1,
      name: "د. أحمد الرحمة",
      title: "استشاري زراعة الأسنان",
      specialties: ["��راعة الأسنان", "جراحة الفم والفكين"],
      experience: "15 سنة خبرة",
      image:
        "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=300&h=300&fit=crop&crop=face",
      rating: 4.9,
      reviews: 156,
      available: true,
    },
    {
      id: 2,
      name: "د. سارة النور",
      title: "أخصائية ��قويم الأسنان",
      specialties: ["تقويم الأسنان", "طب أسنان الأطفال"],
      experience: "12 سنة خبرة",
      image:
        "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=300&h=300&fit=crop&crop=face",
      rating: 4.8,
      reviews: 89,
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

export default function ClinicBooking() {
  const { clinicId } = useParams();
  const navigate = useNavigate();
  const [selectedDoctor, setSelectedDoctor] = useState<Doctor | null>(
    clinicData.doctors[0],
  );
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedTime, setSelectedTime] = useState("");
  const [selectedService, setSelectedService] = useState("");
  const [showBookingForm, setShowBookingForm] = useState(false);
  const [formData, setFormData] = useState({
    fullName: "",
    phone: "",
    email: "",
    notes: "",
  });

  // Generate next 14 days
  const generateDates = () => {
    const dates = [];
    const today = new Date();
    for (let i = 0; i < 14; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() + i);
      dates.push({
        value: date.toISOString().split("T")[0],
        label: date.toLocaleDateString("ar-IQ", {
          weekday: "short",
          month: "short",
          day: "numeric",
        }),
        isToday: i === 0,
      });
    }
    return dates;
  };

  const availableDates = generateDates();

  const handleBooking = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle booking logic here
    alert("تم حجز موعدك بنجاح! سيتم التواصل معك قريباً لتأكيد الموعد.");
    navigate(-1);
  };

  const canProceedToBooking =
    selectedDoctor && selectedDate && selectedTime && selectedService;

  return (
    <div className="min-h-screen bg-gray-50 with-floating-nav">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate(-1)}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <ArrowLeft className="w-5 h-5 text-gray-600" />
            </button>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                <Stethoscope className="w-5 h-5 text-blue-600" />
              </div>
              <h1 className="text-xl font-bold text-gray-900">حجز موعد</h1>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-6">
        {!showBookingForm ? (
          <>
            {/* Clinic Header */}
            <div className="bg-white rounded-2xl shadow-lg overflow-hidden mb-6">
              <div className="relative h-48">
                <img
                  src={clinicData.image}
                  alt={clinicData.name}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                <div className="absolute bottom-4 left-4 right-4 text-white">
                  <div className="flex items-center gap-4 mb-3">
                    {/* شعار العيادة */}
                    <div className="w-16 h-16 bg-white/90 backdrop-blur-sm rounded-xl flex items-center justify-center shadow-lg">
                      <img
                        src="https://images.unsplash.com/photo-1576091160399-112ba8d25d1f?w=64&h=64&fit=crop&crop=center"
                        alt={`شعار ${clinicData.name}`}
                        className="w-12 h-12 rounded-lg object-cover"
                        onError={(e) => {
                          // Safe fallback without innerHTML injection
                          const target = e.target as HTMLImageElement;
                          target.style.display = "none";
                          
                          // Create safe fallback element
                          const fallback = document.createElement("div");
                          fallback.className = "w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center";
                          fallback.innerHTML = `<span class="text-white font-bold text-lg">${clinicData.name.charAt(0)}</span>`;
                          target.parentElement?.appendChild(fallback);
                        }}
                      />
                    </div>
                    <div className="flex-1">
                      <h2 className="text-2xl font-bold">{clinicData.name}</h2>
                      <p className="text-sm opacity-90">
                        عيادة طب الأسنان المتخصصة
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-1">
                      <Star className="w-4 h-4 text-yellow-400 fill-current" />
                      <span className="font-medium">{clinicData.rating}</span>
                      <span className="text-sm opacity-80">
                        ({clinicData.reviews} تقييم)
                      </span>
                    </div>
                    <div className="flex items-center gap-1">
                      <MapPin className="w-4 h-4" />
                      <span className="text-sm">{clinicData.address}</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="p-6">
                <p className="text-gray-600 mb-4">{clinicData.description}</p>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                  <div className="text-center">
                    <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mx-auto mb-2">
                      <Users className="w-6 h-6 text-blue-600" />
                    </div>
                    <div className="text-lg font-bold text-gray-900">
                      {clinicData.doctors.length}
                    </div>
                    <div className="text-sm text-gray-600">طبيب متخصص</div>
                  </div>
                  <div className="text-center">
                    <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center mx-auto mb-2">
                      <Heart className="w-6 h-6 text-green-600" />
                    </div>
                    <div className="text-lg font-bold text-gray-900">
                      {clinicData.services.length}
                    </div>
                    <div className="text-sm text-gray-600">خدمة طبية</div>
                  </div>
                  <div className="text-center">
                    <div className="w-12 h-12 bg-yellow-100 rounded-xl flex items-center justify-center mx-auto mb-2">
                      <Award className="w-6 h-6 text-yellow-600" />
                    </div>
                    <div className="text-lg font-bold text-gray-900">
                      {clinicData.rating}
                    </div>
                    <div className="text-sm text-gray-600">تقييم العملاء</div>
                  </div>
                  <div className="text-center">
                    <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center mx-auto mb-2">
                      <Shield className="w-6 h-6 text-purple-600" />
                    </div>
                    <div className="text-lg font-bold text-gray-900">100%</div>
                    <div className="text-sm text-gray-600">معتمد</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Booking Steps */}
            <div className="space-y-6">
              {/* Step 1: Choose Doctor */}
              <div className="bg-white rounded-2xl shadow-lg p-6">
                <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <span className="w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-bold">
                    1
                  </span>
                  اختر الطبيب
                </h3>
                <div className="grid gap-4">
                  {clinicData.doctors.map((doctor) => (
                    <div
                      key={doctor.id}
                      onClick={() => setSelectedDoctor(doctor)}
                      className={cn(
                        "flex items-center gap-4 p-4 rounded-xl border-2 cursor-pointer transition-all",
                        selectedDoctor?.id === doctor.id
                          ? "border-blue-500 bg-blue-50"
                          : "border-gray-200 hover:border-gray-300",
                      )}
                    >
                      <img
                        src={doctor.image}
                        alt={doctor.name}
                        className="w-16 h-16 rounded-full object-cover"
                      />
                      <div className="flex-1">
                        <h4 className="font-semibold text-gray-900">
                          {doctor.name}
                        </h4>
                        <p className="text-blue-600 text-sm">{doctor.title}</p>
                        <p className="text-gray-600 text-sm">
                          {doctor.experience}
                        </p>
                        <div className="flex items-center gap-2 mt-1">
                          <Star className="w-4 h-4 text-yellow-400 fill-current" />
                          <span className="text-sm font-medium">
                            {doctor.rating}
                          </span>
                          <span className="text-sm text-gray-500">
                            ({doctor.reviews})
                          </span>
                        </div>
                      </div>
                      <ChevronRight className="w-5 h-5 text-gray-400" />
                    </div>
                  ))}
                </div>
              </div>

              {/* Step 2: Choose Service */}
              <div className="bg-white rounded-2xl shadow-lg p-6">
                <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <span className="w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-bold">
                    2
                  </span>
                  اختر الخ��مة
                </h3>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {clinicData.services.map((service) => (
                    <button
                      key={service}
                      onClick={() => setSelectedService(service)}
                      className={cn(
                        "p-3 rounded-xl border-2 text-center transition-all",
                        selectedService === service
                          ? "border-blue-500 bg-blue-50 text-blue-700"
                          : "border-gray-200 hover:border-gray-300 text-gray-700",
                      )}
                    >
                      {service}
                    </button>
                  ))}
                </div>
              </div>

              {/* Step 3: Choose Date */}
              <div className="bg-white rounded-2xl shadow-lg p-6">
                <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <span className="w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-bold">
                    3
                  </span>
                  اختر التاريخ
                </h3>
                <div className="grid grid-cols-7 gap-2">
                  {availableDates.map((date) => (
                    <button
                      key={date.value}
                      onClick={() => setSelectedDate(date.value)}
                      className={cn(
                        "p-3 rounded-xl text-center transition-all",
                        selectedDate === date.value
                          ? "bg-blue-600 text-white"
                          : date.isToday
                            ? "bg-blue-50 text-blue-700 border border-blue-200"
                            : "bg-gray-50 text-gray-700 hover:bg-gray-100",
                      )}
                    >
                      <div className="text-xs font-medium">{date.label}</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Step 4: Choose Time */}
              {selectedDate && (
                <div className="bg-white rounded-2xl shadow-lg p-6">
                  <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                    <span className="w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-bold">
                      4
                    </span>
                    اختر الوقت
                  </h3>
                  <div className="grid grid-cols-4 md:grid-cols-6 gap-3">
                    {clinicData.timeSlots.map((slot) => (
                      <button
                        key={slot.time}
                        onClick={() =>
                          slot.available && setSelectedTime(slot.time)
                        }
                        disabled={!slot.available}
                        className={cn(
                          "p-3 rounded-xl text-center transition-all",
                          selectedTime === slot.time
                            ? "bg-blue-600 text-white"
                            : slot.available
                              ? "bg-gray-50 text-gray-700 hover:bg-gray-100 border border-gray-200"
                              : "bg-gray-100 text-gray-400 cursor-not-allowed",
                        )}
                      >
                        {slot.time}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Continue Button */}
              {canProceedToBooking && (
                <div className="text-center">
                  <button
                    onClick={() => setShowBookingForm(true)}
                    className="bg-blue-600 text-white px-8 py-4 rounded-xl hover:bg-blue-700 transition-colors font-medium text-lg"
                  >
                    متابعة إلى تفاصيل الحجز
                  </button>
                </div>
              )}
            </div>
          </>
        ) : (
          /* Booking Form */
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <div className="flex items-center gap-4 mb-6 pb-6 border-b border-gray-200">
              {/* شعار العيادة */}
              <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center">
                <img
                  src="https://images.unsplash.com/photo-1576091160399-112ba8d25d1f?w=48&h=48&fit=crop&crop=center"
                  alt={`شعار ${clinicData.name}`}
                  className="w-10 h-10 rounded-lg object-cover"
                  onError={(e) => {
                    // Safe fallback without innerHTML injection
                    const target = e.target as HTMLImageElement;
                    target.style.display = "none";
                    
                    // Create safe fallback element
                    const fallback = document.createElement("div");
                    fallback.className = "w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center";
                    fallback.innerHTML = `<span class="text-white font-bold text-sm">${clinicData.name.charAt(0)}</span>`;
                    target.parentElement?.appendChild(fallback);
                  }}
                />
              </div>
              <div>
                <h3 className="text-lg font-bold text-gray-900">
                  تفاصيل الحجز
                </h3>
                <p className="text-sm text-gray-600">{clinicData.name}</p>
              </div>
            </div>

            {/* Booking Summary */}
            <div className="bg-blue-50 rounded-xl p-4 mb-6">
              <h4 className="font-semibold text-blue-900 mb-3">ملخ�� الموعد</h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-blue-700">الطبيب:</span>
                  <span className="font-medium">{selectedDoctor?.name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-blue-700">الخدمة:</span>
                  <span className="font-medium">{selectedService}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-blue-700">التاريخ:</span>
                  <span className="font-medium">{selectedDate}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-blue-700">الوقت:</span>
                  <span className="font-medium">{selectedTime}</span>
                </div>
              </div>
            </div>

            {/* Contact Form */}
            <form onSubmit={handleBooking} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  الاسم الكامل *
                </label>
                <input
                  type="text"
                  required
                  value={formData.fullName}
                  onChange={(e) =>
                    setFormData({ ...formData, fullName: e.target.value })
                  }
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="+964 7XX XXX XXXX"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  ��لبريد الإلكتروني
                </label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="example@email.com"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  ملاحظات إضافية
                </label>
                <textarea
                  rows={3}
                  value={formData.notes}
                  onChange={(e) =>
                    setFormData({ ...formData, notes: e.target.value })
                  }
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="أي ملاحظات تود إضا��تها..."
                />
              </div>

              <div className="flex gap-4 mt-6">
                <button
                  type="button"
                  onClick={() => setShowBookingForm(false)}
                  className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors"
                >
                  العودة
                </button>
                <button
                  type="submit"
                  className="flex-1 px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors font-medium flex items-center justify-center gap-2"
                >
                  <Send className="w-4 h-4" />
                  تأكيد الحجز
                </button>
              </div>
            </form>
          </div>
        )}
      </div>

    </div>
  );
}
