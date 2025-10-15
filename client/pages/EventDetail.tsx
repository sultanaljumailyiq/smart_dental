import React, { useState } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import {
  ArrowRight,
  Calendar,
  Clock,
  MapPin,
  Users,
  Star,
  Heart,
  Share2,
  User,
  Award,
  Video,
  Globe,
  Phone,
  Mail,
  Download,
  ExternalLink,
  CheckCircle,
  Bell,
  Mic,
  GraduationCap,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

// Mock event data - will be replaced with API
const getEventById = (id: string) => ({
  id: parseInt(id),
  title: "المؤتمر الدولي لطب الأسنان 2025",
  arabicTitle: "المؤتمر الدولي لطب الأسنان 2025",
  description: "أكبر مؤتمر طبي متخصص في طب الأسنان في المنطقة العربية، يجمع أبرز الخبراء والمختصين من جميع أنحاء العالم",
  fullDescription: "ينظم هذا المؤتمر سنوياً ويعتبر من أهم الفعاليات العلمية في مجال طب الأسنان. يتضمن المؤتمر محاضرات علمية، ورش عمل تطبيقية، ومعارض للتقنيات الحديثة في طب الأسنان. سيشارك في المؤتمر نخبة من الأطباء والمتخصصين من مختلف أنحاء العالم.",
  image: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800",
  date: "2025-11-15",
  startTime: "09:00 AM",
  endDate: "2025-11-17",
  endTime: "05:00 PM",
  location: "مركز بغداد الدولي للمؤتمرات",
  city: "بغداد",
  country: "العراق",
  type: "conference",
  isOnline: false,
  isPaid: true,
  price: 50000,
  currency: "IQD",
  capacity: 500,
  registered: 342,
  organizer: {
    id: 1,
    name: "جمعية أطباء الأسنان العراقية",
    arabicName: "جمعية أطباء الأسنان العراقية",
    avatar: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=100",
    verified: true,
  },
  speakers: [
    {
      id: 1,
      name: "د. سارة أحمد",
      title: "استشاري جراحة الفم والفكين",
      avatar: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=100",
      bio: "خبرة 15 سنة في جراحة الفم والفكين"
    },
    {
      id: 2,
      name: "د. محمد العلي",
      title: "أخصائي علاج العصب",
      avatar: "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=100",
      bio: "متخصص في العلاج بدون ألم"
    },
  ],
  agenda: [
    {
      time: "09:00 - 10:00",
      title: "الافتتاح والكلمات الترحيبية",
      speaker: "د. سارة أحمد",
    },
    {
      time: "10:00 - 11:30",
      title: "أحدث تقنيات زراعة الأسنان",
      speaker: "د. محمد العلي",
    },
    {
      time: "11:30 - 12:00",
      title: "استراحة وشبكة علاقات",
      speaker: null,
    },
    {
      time: "12:00 - 13:30",
      title: "ورشة عمل: العلاج بدون ألم",
      speaker: "د. سارة أحمد",
    },
  ],
  tags: ["مؤتمر", "طب الأسنان", "تعليم مستمر", "شهادة معتمدة"],
  certificate: true,
  cmeCredits: 10,
});

const EventDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [isRegistered, setIsRegistered] = useState(false);
  const [isFavorited, setIsFavorited] = useState(false);

  if (!id) {
    return <div>Event ID not found</div>;
  }

  const event = getEventById(id);

  const handleRegister = () => {
    setIsRegistered(true);
    toast.success("تم التسجيل في الحدث بنجاح!");
  };

  const handleToggleFavorite = () => {
    setIsFavorited(!isFavorited);
    toast.success(isFavorited ? "تم إلغاء الحفظ" : "تم حفظ الحدث");
  };

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    toast.success("تم نسخ الرابط");
  };

  const availableSeats = event.capacity - event.registered;
  const progressPercentage = (event.registered / event.capacity) * 100;

  return (
    <div className="min-h-screen bg-gray-50" dir="rtl">
      {/* Header */}
      <div className="bg-white border-b sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900"
          >
            <ArrowRight className="w-5 h-5" />
            <span>رجوع</span>
          </button>
          <div className="flex items-center gap-2">
            <button
              onClick={handleToggleFavorite}
              className={cn(
                "p-2 rounded-full transition-colors",
                isFavorited ? "bg-red-50 text-red-600" : "hover:bg-gray-100"
              )}
            >
              <Heart className={cn("w-5 h-5", isFavorited && "fill-red-600")} />
            </button>
            <button
              onClick={handleShare}
              className="p-2 rounded-full hover:bg-gray-100"
            >
              <Share2 className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid md:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="md:col-span-2 space-y-6">
            {/* Event Image */}
            <div className="rounded-2xl overflow-hidden shadow-lg">
              <img
                src={event.image}
                alt={event.arabicTitle}
                className="w-full h-96 object-cover"
              />
            </div>

            {/* Event Info */}
            <div className="bg-white rounded-2xl p-6 shadow-sm">
              {/* Type Badge */}
              <div className="flex items-center gap-2 mb-4">
                <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-medium">
                  {event.type === 'conference' ? 'مؤتمر' : 'ندوة'}
                </span>
                {event.certificate && (
                  <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-medium flex items-center gap-1">
                    <Award className="w-4 h-4" />
                    شهادة معتمدة
                  </span>
                )}
                {event.cmeCredits && (
                  <span className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm font-medium">
                    {event.cmeCredits} ساعة CME
                  </span>
                )}
              </div>

              <h1 className="text-3xl font-bold text-gray-900 mb-4">
                {event.arabicTitle}
              </h1>

              <p className="text-gray-600 text-lg leading-relaxed mb-6">
                {event.description}
              </p>

              {/* Event Details Grid */}
              <div className="grid md:grid-cols-2 gap-4 mb-6">
                <div className="flex items-start gap-3">
                  <Calendar className="w-5 h-5 text-blue-600 mt-0.5" />
                  <div>
                    <p className="text-sm text-gray-500">التاريخ</p>
                    <p className="font-semibold">
                      {new Date(event.date).toLocaleDateString('ar-IQ')} - {new Date(event.endDate).toLocaleDateString('ar-IQ')}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Clock className="w-5 h-5 text-blue-600 mt-0.5" />
                  <div>
                    <p className="text-sm text-gray-500">الوقت</p>
                    <p className="font-semibold">
                      {event.startTime} - {event.endTime}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <MapPin className="w-5 h-5 text-blue-600 mt-0.5" />
                  <div>
                    <p className="text-sm text-gray-500">الموقع</p>
                    <p className="font-semibold">{event.location}</p>
                    <p className="text-sm text-gray-500">{event.city}, {event.country}</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Users className="w-5 h-5 text-blue-600 mt-0.5" />
                  <div>
                    <p className="text-sm text-gray-500">المقاعد المتاحة</p>
                    <p className="font-semibold">{availableSeats} / {event.capacity}</p>
                  </div>
                </div>
              </div>

              {/* Registration Progress */}
              <div className="mb-6">
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-gray-600">نسبة التسجيل</span>
                  <span className="font-semibold text-blue-600">{Math.round(progressPercentage)}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-blue-600 h-2 rounded-full transition-all"
                    style={{ width: `${progressPercentage}%` }}
                  />
                </div>
              </div>

              {/* Full Description */}
              <div className="border-t pt-6">
                <h2 className="text-xl font-bold mb-4">عن الحدث</h2>
                <p className="text-gray-700 leading-relaxed whitespace-pre-line">
                  {event.fullDescription}
                </p>
              </div>
            </div>

            {/* Agenda */}
            <div className="bg-white rounded-2xl p-6 shadow-sm">
              <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                <Clock className="w-6 h-6 text-blue-600" />
                جدول الفعاليات
              </h2>
              <div className="space-y-4">
                {event.agenda.map((item, index) => (
                  <div key={index} className="flex gap-4 pb-4 border-b last:border-0">
                    <div className="flex-shrink-0 w-28">
                      <span className="text-sm font-semibold text-blue-600">{item.time}</span>
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900 mb-1">{item.title}</h3>
                      {item.speaker && (
                        <p className="text-sm text-gray-500 flex items-center gap-1">
                          <Mic className="w-4 h-4" />
                          {item.speaker}
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Speakers */}
            <div className="bg-white rounded-2xl p-6 shadow-sm">
              <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                <Users className="w-6 h-6 text-blue-600" />
                المتحدثون
              </h2>
              <div className="grid md:grid-cols-2 gap-4">
                {event.speakers.map((speaker) => (
                  <div key={speaker.id} className="flex items-start gap-3 p-4 rounded-xl bg-gray-50">
                    <img
                      src={speaker.avatar}
                      alt={speaker.name}
                      className="w-16 h-16 rounded-full object-cover"
                    />
                    <div>
                      <h3 className="font-semibold text-gray-900">{speaker.name}</h3>
                      <p className="text-sm text-gray-600 mb-1">{speaker.title}</p>
                      <p className="text-xs text-gray-500">{speaker.bio}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Organizer Card */}
            <div className="bg-white rounded-2xl p-6 shadow-sm sticky top-24">
              <h3 className="text-lg font-bold mb-4">المنظم</h3>
              <div className="flex items-center gap-3 mb-4">
                <img
                  src={event.organizer.avatar}
                  alt={event.organizer.arabicName}
                  className="w-12 h-12 rounded-full"
                />
                <div>
                  <div className="flex items-center gap-1">
                    <p className="font-semibold">{event.organizer.arabicName}</p>
                    {event.organizer.verified && (
                      <CheckCircle className="w-4 h-4 text-blue-600" />
                    )}
                  </div>
                </div>
              </div>

              {/* Price */}
              {event.isPaid && (
                <div className="mb-6 p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl">
                  <p className="text-sm text-gray-600 mb-1">رسوم التسجيل</p>
                  <p className="text-3xl font-bold text-gray-900">
                    {event.price.toLocaleString()} <span className="text-lg">{event.currency}</span>
                  </p>
                </div>
              )}

              {/* Registration Button */}
              {!isRegistered ? (
                <button
                  onClick={handleRegister}
                  disabled={availableSeats === 0}
                  className={cn(
                    "w-full py-3 rounded-xl font-semibold transition-all flex items-center justify-center gap-2",
                    availableSeats === 0
                      ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                      : "bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:shadow-lg"
                  )}
                >
                  {availableSeats === 0 ? (
                    <>المقاعد ممتلئة</>
                  ) : (
                    <>
                      <Bell className="w-5 h-5" />
                      سجل الآن
                    </>
                  )}
                </button>
              ) : (
                <div className="p-4 bg-green-50 rounded-xl flex items-center gap-2 justify-center text-green-700 font-semibold">
                  <CheckCircle className="w-5 h-5" />
                  تم التسجيل بنجاح
                </div>
              )}

              {/* Contact Info */}
              <div className="mt-6 pt-6 border-t space-y-3">
                <h4 className="font-semibold text-gray-900 mb-3">معلومات التواصل</h4>
                <button className="w-full flex items-center gap-2 text-gray-600 hover:text-blue-600 transition-colors">
                  <Phone className="w-4 h-4" />
                  <span>+964 770 123 4567</span>
                </button>
                <button className="w-full flex items-center gap-2 text-gray-600 hover:text-blue-600 transition-colors">
                  <Mail className="w-4 h-4" />
                  <span>events@iraqidental.com</span>
                </button>
                <button className="w-full flex items-center gap-2 text-gray-600 hover:text-blue-600 transition-colors">
                  <Globe className="w-4 h-4" />
                  <span>الموقع الرسمي</span>
                  <ExternalLink className="w-4 h-4 mr-auto" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Related Events */}
        <div className="mt-12">
          <h2 className="text-2xl font-bold mb-6">فعاليات مشابهة</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <Link
                key={i}
                to={`/community/event/${i + 1}`}
                className="bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow"
              >
                <img
                  src={`https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=400`}
                  alt="Event"
                  className="w-full h-48 object-cover"
                />
                <div className="p-4">
                  <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2">
                    ورشة عمل: التقنيات الحديثة في علاج العصب
                  </h3>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Calendar className="w-4 h-4" />
                    <span>25 نوفمبر 2025</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventDetail;
