import React, { useState, useEffect } from "react";
import {
  Calendar,
  Clock,
  MapPin,
  Phone,
  Star,
  Check,
  X,
  Bell,
  Wifi,
  User,
  Stethoscope,
  AlertCircle,
  CheckCircle,
  MessageCircle,
  ArrowRight,
  Filter,
  Search,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface Clinic {
  id: string;
  name: string;
  doctor: string;
  address: string;
  phone: string;
  rating: number;
  reviews: number;
  distance: string;
  image: string;
  availableSlots: TimeSlot[];
  specialties: string[];
  acceptsOnlineBooking: boolean;
  verified: boolean;
}

interface TimeSlot {
  id: string;
  time: string;
  date: string;
  available: boolean;
  isOnline?: boolean;
}

interface Booking {
  id: string;
  clinicId: string;
  clinicName: string;
  doctor: string;
  date: string;
  time: string;
  status: "pending" | "confirmed" | "cancelled" | "completed";
  isOnlineBooking: boolean;
  patientNotes?: string;
  confirmationCode: string;
}

// بيانات تجريبية للعيادات
const mockClinics: Clinic[] = [
  {
    id: "clinic-1",
    name: "عيادة الابتسامة الذهبية",
    doctor: "د. أحمد محمد",
    address: "شارع الملك فهد، الرياض",
    phone: "+966501234567",
    rating: 4.8,
    reviews: 156,
    distance: "2.5 كم",
    image: "/placeholder.svg",
    acceptsOnlineBooking: true,
    verified: true,
    specialties: ["تقويم الأسنان", "زراعة الأسنان", "تجميل الأسنان"],
    availableSlots: [
      {
        id: "slot-1",
        time: "09:00",
        date: "2024-01-20",
        available: true,
        isOnline: true,
      },
      {
        id: "slot-2",
        time: "10:30",
        date: "2024-01-20",
        available: true,
        isOnline: true,
      },
      { id: "slot-3", time: "14:00", date: "2024-01-20", available: true },
      { id: "slot-4", time: "15:30", date: "2024-01-20", available: true },
    ],
  },
  {
    id: "clinic-2",
    name: "مركز الأسنان المتقدم",
    doctor: "د. سارة أحمد",
    address: "طريق العليا، الرياض",
    phone: "+966507654321",
    rating: 4.6,
    reviews: 89,
    distance: "3.8 كم",
    image: "/placeholder.svg",
    acceptsOnlineBooking: true,
    verified: true,
    specialties: ["جراحة الفم", "علاج الجذور", "طب أسنان الأطفال"],
    availableSlots: [
      {
        id: "slot-5",
        time: "09:30",
        date: "2024-01-20",
        available: true,
        isOnline: true,
      },
      { id: "slot-6", time: "11:00", date: "2024-01-20", available: true },
      {
        id: "slot-7",
        time: "16:00",
        date: "2024-01-20",
        available: true,
        isOnline: true,
      },
    ],
  },
];

export default function EnhancedBookingSystem() {
  const [selectedClinic, setSelectedClinic] = useState<Clinic | null>(null);
  const [selectedSlot, setSelectedSlot] = useState<TimeSlot | null>(null);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [showBookingForm, setShowBookingForm] = useState(false);
  const [patientNotes, setPatientNotes] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [filterBy, setFilterBy] = useState("all");
  const [notifications, setNotifications] = useState<any[]>([]);

  // فلترة العيادات
  const filteredClinics = mockClinics.filter((clinic) => {
    const matchesSearch =
      clinic.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      clinic.doctor.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesFilter =
      filterBy === "all" ||
      (filterBy === "online" && clinic.acceptsOnlineBooking) ||
      (filterBy === "verified" && clinic.verified);

    return matchesSearch && matchesFilter;
  });

  // إنشاء حجز جديد
  const createBooking = () => {
    if (!selectedClinic || !selectedSlot) return;

    const newBooking: Booking = {
      id: `booking-${Date.now()}`,
      clinicId: selectedClinic.id,
      clinicName: selectedClinic.name,
      doctor: selectedClinic.doctor,
      date: selectedSlot.date,
      time: selectedSlot.time,
      status: "pending",
      isOnlineBooking: selectedSlot.isOnline || false,
      patientNotes,
      confirmationCode: generateConfirmationCode(),
    };

    setBookings((prev) => [...prev, newBooking]);

    // إضافة إشعار جديد
    const notification = {
      id: Date.now(),
      type: "booking_created",
      title: "تم إنشاء الحجز بنجاح",
      message: `تم حجز موعد في ${selectedClinic.name} يوم ${formatDate(selectedSlot.date)} الساعة ${selectedSlot.time}`,
      timestamp: new Date(),
      isOnline: selectedSlot.isOnline,
    };

    setNotifications((prev) => [notification, ...prev]);

    // إعادة تعيين النموذج
    setShowBookingForm(false);
    setSelectedClinic(null);
    setSelectedSlot(null);
    setPatientNotes("");
  };

  const generateConfirmationCode = () => {
    return Math.random().toString(36).substr(2, 8).toUpperCase();
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString("ar-SA", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  // بطاقة العيادة
  const ClinicCard = ({ clinic }: { clinic: Clinic }) => (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-lg transition-all duration-300">
      {/* صورة العيادة */}
      <div className="relative h-48 bg-gradient-to-br from-blue-50 to-purple-50">
        <img
          src={clinic.image}
          alt={clinic.name}
          className="w-full h-full object-cover"
        />

        {/* شارات */}
        <div className="absolute top-4 right-4 flex gap-2">
          {clinic.verified && (
            <span className="bg-green-500 text-white text-xs px-2 py-1 rounded-full flex items-center gap-1">
              <CheckCircle className="w-3 h-3" />
              معتمد
            </span>
          )}
          {clinic.acceptsOnlineBooking && (
            <span className="bg-blue-500 text-white text-xs px-2 py-1 rounded-full flex items-center gap-1">
              <Wifi className="w-3 h-3" />
              حجز أونلاين
            </span>
          )}
        </div>
      </div>

      {/* معلومات العيادة */}
      <div className="p-6">
        <h3 className="text-lg font-bold text-gray-900 mb-2">{clinic.name}</h3>

        <div className="flex items-center gap-2 text-gray-600 mb-2">
          <User className="w-4 h-4" />
          <span className="text-sm">{clinic.doctor}</span>
        </div>

        <div className="flex items-center gap-2 text-gray-600 mb-2">
          <MapPin className="w-4 h-4" />
          <span className="text-sm">{clinic.address}</span>
          <span className="text-xs text-blue-600 bg-blue-50 px-2 py-1 rounded-full">
            {clinic.distance}
          </span>
        </div>

        <div className="flex items-center gap-2 text-gray-600 mb-4">
          <Phone className="w-4 h-4" />
          <span className="text-sm" dir="ltr">
            {clinic.phone}
          </span>
        </div>

        {/* التقييم */}
        <div className="flex items-center gap-2 mb-4">
          <div className="flex items-center">
            {[1, 2, 3, 4, 5].map((star) => (
              <Star
                key={star}
                className={cn(
                  "w-4 h-4",
                  star <= clinic.rating
                    ? "text-yellow-400 fill-current"
                    : "text-gray-300",
                )}
              />
            ))}
          </div>
          <span className="text-sm text-gray-600">
            {clinic.rating} ({clinic.reviews} تقييم)
          </span>
        </div>

        {/* التخصصات */}
        <div className="flex flex-wrap gap-2 mb-4">
          {clinic.specialties.slice(0, 2).map((specialty) => (
            <span
              key={specialty}
              className="text-xs bg-purple-50 text-purple-600 px-2 py-1 rounded-full"
            >
              {specialty}
            </span>
          ))}
          {clinic.specialties.length > 2 && (
            <span className="text-xs bg-gray-50 text-gray-600 px-2 py-1 rounded-full">
              +{clinic.specialties.length - 2} أخرى
            </span>
          )}
        </div>

        {/* زر الحجز */}
        <button
          onClick={() => {
            setSelectedClinic(clinic);
            setShowBookingForm(true);
          }}
          className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 rounded-xl font-semibold hover:from-blue-700 hover:to-purple-700 transition-all duration-300 flex items-center justify-center gap-2"
        >
          <Calendar className="w-4 h-4" />
          احجز موعداً
        </button>
      </div>
    </div>
  );

  // نموذج الحجز
  const BookingForm = () => {
    if (!selectedClinic) return null;

    return (
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
          {/* رأس النموذج */}
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold text-gray-900">حجز موعد</h2>
              <button
                onClick={() => setShowBookingForm(false)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="mt-4 p-4 bg-blue-50 rounded-xl">
              <h3 className="font-semibold text-blue-900">
                {selectedClinic.name}
              </h3>
              <p className="text-sm text-blue-700">{selectedClinic.doctor}</p>
            </div>
          </div>

          {/* المواعيد المتاحة */}
          <div className="p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              اختر موعداً
            </h3>

            <div className="grid grid-cols-2 gap-3">
              {selectedClinic.availableSlots.map((slot) => (
                <button
                  key={slot.id}
                  onClick={() => setSelectedSlot(slot)}
                  disabled={!slot.available}
                  className={cn(
                    "p-4 rounded-xl border-2 transition-all duration-200 text-center",
                    selectedSlot?.id === slot.id
                      ? "border-blue-500 bg-blue-50"
                      : slot.available
                        ? "border-gray-200 hover:border-blue-300"
                        : "border-gray-100 bg-gray-50 opacity-50 cursor-not-allowed",
                  )}
                >
                  <div className="flex items-center justify-center gap-2 mb-2">
                    <Clock className="w-4 h-4" />
                    <span className="font-semibold">{slot.time}</span>
                    {slot.isOnline && (
                      <Wifi className="w-4 h-4 text-blue-500" />
                    )}
                  </div>

                  {slot.isOnline && (
                    <span className="text-xs bg-blue-100 text-blue-600 px-2 py-1 rounded-full">
                      حجز أونلاين
                    </span>
                  )}
                </button>
              ))}
            </div>

            {/* ملاحظات المريض */}
            <div className="mt-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                ملاحظات إضافية (اختياري)
              </label>
              <textarea
                value={patientNotes}
                onChange={(e) => setPatientNotes(e.target.value)}
                placeholder="اكتب أي ملاحظات أو أعراض تريد إبلاغ الطبيب بها..."
                className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                rows={3}
              />
            </div>

            {/* أزرار الإجراءات */}
            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setShowBookingForm(false)}
                className="flex-1 py-3 border border-gray-200 rounded-xl font-semibold text-gray-700 hover:bg-gray-50 transition-colors"
              >
                إلغاء
              </button>

              <button
                onClick={createBooking}
                disabled={!selectedSlot}
                className={cn(
                  "flex-1 py-3 rounded-xl font-semibold transition-all duration-300 flex items-center justify-center gap-2",
                  selectedSlot
                    ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:from-blue-700 hover:to-purple-700"
                    : "bg-gray-100 text-gray-400 cursor-not-allowed",
                )}
              >
                <Check className="w-4 h-4" />
                تأكيد الحجز
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  // قائمة الحجوزات
  const BookingsList = () => (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">حجوزاتك</h3>

      {bookings.length === 0 ? (
        <div className="text-center py-8">
          <Calendar className="w-12 h-12 text-gray-300 mx-auto mb-3" />
          <p className="text-gray-500">لا توجد حج��زات حتى الآن</p>
        </div>
      ) : (
        <div className="space-y-4">
          {bookings.map((booking) => (
            <div
              key={booking.id}
              className={cn(
                "p-4 rounded-xl border-2 transition-all duration-200",
                booking.isOnlineBooking
                  ? "border-blue-200 bg-blue-50"
                  : "border-gray-200 bg-gray-50",
              )}
            >
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <h4 className="font-semibold text-gray-900">
                      {booking.clinicName}
                    </h4>
                    {booking.isOnlineBooking && (
                      <span className="bg-blue-500 text-white text-xs px-2 py-1 rounded-full flex items-center gap-1">
                        <Wifi className="w-3 h-3" />
                        أونلاين
                      </span>
                    )}
                  </div>

                  <p className="text-sm text-gray-600 mb-1">{booking.doctor}</p>
                  <p className="text-sm text-gray-600">
                    {formatDate(booking.date)} - {booking.time}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    رمز التأكيد: {booking.confirmationCode}
                  </p>
                </div>

                <span
                  className={cn(
                    "text-xs px-2 py-1 rounded-full font-semibold",
                    booking.status === "pending" &&
                      "bg-yellow-100 text-yellow-600",
                    booking.status === "confirmed" &&
                      "bg-green-100 text-green-600",
                    booking.status === "cancelled" && "bg-red-100 text-red-600",
                  )}
                >
                  {booking.status === "pending" && "في الانتظار"}
                  {booking.status === "confirmed" && "مؤكد"}
                  {booking.status === "cancelled" && "ملغي"}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );

  return (
    <div className="space-y-8">
      {/* شريط البحث والفلاتر */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
        <div className="flex flex-col lg:flex-row gap-4">
          {/* البحث */}
          <div className="relative flex-1">
            <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="ابحث عن عيادة أو طبيب..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pr-12 pl-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
            />
          </div>

          {/* الفلاتر */}
          <div className="flex gap-2">
            <button
              onClick={() => setFilterBy("all")}
              className={cn(
                "px-4 py-2 rounded-lg text-sm font-medium transition-colors",
                filterBy === "all"
                  ? "bg-blue-500 text-white"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200",
              )}
            >
              الكل
            </button>
            <button
              onClick={() => setFilterBy("online")}
              className={cn(
                "px-4 py-2 rounded-lg text-sm font-medium transition-colors",
                filterBy === "online"
                  ? "bg-blue-500 text-white"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200",
              )}
            >
              حجز أونلاين
            </button>
            <button
              onClick={() => setFilterBy("verified")}
              className={cn(
                "px-4 py-2 rounded-lg text-sm font-medium transition-colors",
                filterBy === "verified"
                  ? "bg-blue-500 text-white"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200",
              )}
            >
              معتمد
            </button>
          </div>
        </div>
      </div>

      {/* العيادات */}
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-6">
          العيادات المتاحة
        </h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredClinics.map((clinic) => (
            <ClinicCard key={clinic.id} clinic={clinic} />
          ))}
        </div>
      </div>

      {/* الحجوزات */}
      <BookingsList />

      {/* نموذج الحجز */}
      {showBookingForm && <BookingForm />}
    </div>
  );
}
