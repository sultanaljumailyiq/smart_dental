import React, { useState } from "react";
import { Link } from "react-router-dom";
import {
  Calendar,
  Clock,
  MapPin,
  Users,
  Star,
  Search,
  Filter,
  Grid3X3,
  List,
  ChevronRight,
  Award,
  Video,
  Globe,
  User,
  Heart,
  Share2,
  BookOpen,
  Mic,
  Presentation,
  GraduationCap,
  Target,
  Zap,
  Plus,
  Bell,
  X,
  CheckCircle,
  AlertCircle,
  Phone,
  Mail,
  Info,
  ExternalLink,
  Download,
  Play,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useI18n } from "@/lib/i18n";
import { useIsMobile } from "@/hooks/use-mobile";

// Mock data for events
const events = [
  {
    id: 1,
    title: "المؤتمر الدولي لطب الأسنان 2024",
    description:
      "��كبر مؤتمر طبي متخصص في طب الأسنان في المنطقة العربية، يجمع أبرز الخبراء والمختصين من جميع أنحاء العالم.",
    fullDescription:
      "ينظم هذا المؤتمر ��نوياً ويعتبر من أهم الفعاليات العلمية في مجال طب الأسنان. يتضمن المؤتمر محاضرات علمية، ورش عمل تطبيقية، ومعارض للتقنيات الحديثة في طب الأسنان.",
    image:
      "https://images.unsplash.com/photo-1576091160399-112ba8d25d1f?w=600&h=300&fit=crop",
    date: "2024-03-15",
    time: "09:00 AM",
    endDate: "2024-03-17",
    endTime: "05:00 PM",
    location: "مركز بغداد الدولي للمؤتمرات",
    city: "بغداد",
    country: "العراق",
    organizer: {
      name: "جمعية أطباء ��لأسنان العر��قية",
      avatar:
        "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=50&h=50&fit=crop&crop=face",
      verified: true,
    },
    speakers: [
      {
        name: "د. سارة الأحمد",
        title: "استشاري جراحة الفم والفكين",
        avatar:
          "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=50&h=50&fit=crop&crop=face",
      },
      {
        name: "د. محمد العراقي",
        title: "أخصائي علاج العصب",
        avatar:
          "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=50&h=50&fit=crop&crop=face",
      },
    ],
    category: "مؤتمر",
    type: "حضوري",
    price: "مجاني",
    originalPrice: "150,000 د.ع",
    capacity: 500,
    registered: 387,
    rating: 4.9,
    reviewsCount: 145,
    tags: ["مؤتمر", "تعليم", "تطوير مهني"],
    agenda: [
      {
        time: "09:00 - 09:30",
        title: "التسجيل واستقبال الضيوف",
        speaker: "فريق التن����م",
      },
      {
        time: "09:30 - 10:30",
        title: "الجلسة الافتتاحية: مستقبل طب الأسنان",
        speaker: "د. سارة الأحمد",
      },
      {
        time: "10:30 - 11:00",
        title: "استراحة وتناول القهوة",
        speaker: "",
      },
      {
        time: "11:00 - 12:00",
        title: "تقنيات علاج العصب الحديثة",
        speaker: "د. محمد الع��اقي",
      },
    ],
    featured: true,
    trending: true,
    status: "upcoming",
    registrationDeadline: "2024-03-10",
    requirements: ["شهادة في طب الأسنان", "خبرة عملية"],
    benefits: ["شهادة حضور ��عتمدة", "نقاط تطوير مهني", "شبكة تواصل مهنية"],
    website: "https://dental-conference.com",
    phone: "+964 770 123 4567",
    email: "info@dental-conference.com",
  },
  {
    id: 2,
    title: "ورشة عمل: زراعة الأسنان المتقدمة",
    description:
      "ورشة عمل تطبيقية متخصصة في أحدث تقنيات زراعة الأسنان مع التدريب العملي على النماذج.",
    fullDescription:
      "ورشة عمل مكثفة ��هدف إلى تطوير مهارات الأطباء في مجال زراعة الأسنان باستخدام أحدث التقنيات والأدوات المتطورة.",
    image:
      "https://images.unsplash.com/photo-1609840114035-3c981b782dfe?w=600&h=300&fit=crop",
    date: "2024-02-20",
    time: "10:00 AM",
    endDate: "2024-02-20",
    endTime: "04:00 PM",
    location: "أكاديمية طب الأسنان",
    city: "بغداد",
    country: "العراق",
    organizer: {
      name: "د. خالد الحسن",
      avatar:
        "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=50&h=50&fit=crop&crop=face",
      verified: true,
    },
    speakers: [
      {
        name: "د. خالد الح��ن",
        title: "استشاري زراعة الأسنان",
        avatar:
          "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=50&h=50&fit=crop&crop=face",
      },
    ],
    category: "ورشة عمل",
    type: "حضوري",
    price: "75,000 د.ع",
    originalPrice: "100,000 د.ع",
    capacity: 25,
    registered: 23,
    rating: 4.8,
    reviewsCount: 67,
    tags: ["ورشة عمل", "زراعة", "تدريب عملي"],
    agenda: [
      {
        time: "10:00 - 10:30",
        title: "مقدمة في زراعة الأسنان",
        speaker: "د. خالد الحسن",
      },
      {
        time: "10:30 - 12:00",
        title: "التطبيق العملي - الجزء الأول",
        speaker: "د. خالد الحسن",
      },
      {
        time: "12:00 - 13:00",
        title: "استراحة الغداء",
        speaker: "",
      },
      {
        time: "13:00 - 16:00",
        title: "التطبيق العملي - الجزء الثاني",
        speaker: "د. خالد الحسن",
      },
    ],
    featured: false,
    trending: true,
    status: "upcoming",
    registrationDeadline: "2024-02-15",
    requirements: ["خبرة أساسية في طب الأسنان"],
    benefits: ["تدريب عملي مكثف", "شهادة حضور", "مواد تدريبية"],
    website: "https://dental-workshop.com",
    phone: "+964 770 234 5678",
    email: "workshop@dental-academy.com",
  },
  {
    id: 3,
    title: "��دوة افتراضية: تقويم الأسنان الحديث",
    description:
      "ندوة علمية افتراضية تناقش أحدث التطورات في مجال تقويم الأسنان والتقنيات الحديثة.",
    fullDescription:
      "��دوة علمية شاملة تغطي آخر التطورا�� في مجال تقويم الأسنان بما في ذلك التقويم الشفاف والتقنيات الرقمية.",
    image:
      "https://images.unsplash.com/photo-1606811971618-4486d14f3f99?w=600&h=300&fit=crop",
    date: "2024-02-10",
    time: "07:00 PM",
    endDate: "2024-02-10",
    endTime: "09:00 PM",
    location: "عبر الإنترنت - Zoom",
    city: "افتراضي",
    country: "عالمي",
    organizer: {
      name: "الجمعية العربية لتقويم الأسنان",
      avatar:
        "https://images.unsplash.com/photo-1594824475386-67eb4d8b5f59?w=50&h=50&fit=crop&crop=face",
      verified: true,
    },
    speakers: [
      {
        name: "د. زينب المحمد",
        title: "أخصائي تقويم الأسنان",
        avatar:
          "https://images.unsplash.com/photo-1594824475386-67eb4d8b5f59?w=50&h=50&fit=crop&crop=face",
      },
    ],
    category: "ندوة",
    type: "افتراضي",
    price: "مجاني",
    originalPrice: null,
    capacity: 1000,
    registered: 756,
    rating: 4.7,
    reviewsCount: 289,
    tags: ["ندوة", "تقويم", "افتراضي"],
    agenda: [
      {
        time: "19:00 - 19:15",
        title: "مقدمة وترحيب",
        speaker: "فريق التنظيم",
      },
      {
        time: "19:15 - 20:00",
        title: "التقويم الشفاف: الثورة الجديدة",
        speaker: "د. زينب المحمد",
      },
      {
        time: "20:00 - 20:30",
        title: "��لسة أسئلة وأجوبة",
        speaker: "د. زينب المحمد",
      },
      {
        time: "20:30 - 21:00",
        title: "الختام والتقييم",
        speaker: "فريق التنظيم",
      },
    ],
    featured: true,
    trending: false,
    status: "upcoming",
    registrationDeadline: "2024-02-09",
    requirements: ["اهتمام بمجال تقويم الأس��ان"],
    benefits: ["حضور مجاني", "تسجيل الجلسة", "شهادة مشاركة"],
    website: "https://orthodontics-webinar.com",
    phone: "+965 555 123 456",
    email: "webinar@orthodontics.org",
  },
  {
    id: 4,
    title: "دورة تدريبية: طب أسنان الأطفال",
    description:
      "دورة تدريبية شاملة في طب أسنا�� الأطفال وإدارة سلو�� الطفل في العيادة.",
    fullDescription:
      "دورة تدريبية متقدمة تغطي جميع جوانب طب أسنان الأطفال من التشخيص إلى العلاج وإ��ارة ��لسلوك.",
    image:
      "https://images.unsplash.com/photo-1576091160549-2173dba999ef?w=600&h=300&fit=crop",
    date: "2024-02-25",
    time: "09:00 AM",
    endDate: "2024-02-27",
    endTime: "05:00 PM",
    location: "مركز ��لتدريب الطبي",
    city: "البصرة",
    country: "العراق",
    organizer: {
      name: "أكاديمية طب الأسنان المتقدمة",
      avatar:
        "https://images.unsplash.com/photo-1582750433449-648ed127bb54?w=50&h=50&fit=crop&crop=face",
      verified: true,
    },
    speakers: [
      {
        name: "د. أحمد الزهر��ني",
        title: "أخصائي طب أسنان الأطفال",
        avatar:
          "https://images.unsplash.com/photo-1582750433449-648ed127bb54?w=50&h=50&fit=crop&crop=face",
      },
    ],
    category: "دورة تدريبية",
    type: "حضوري",
    price: "120,000 د.ع",
    originalPrice: "150,000 د.ع",
    capacity: 30,
    registered: 28,
    rating: 4.9,
    reviewsCount: 134,
    tags: ["دورة", "أطفال", "تدريب"],
    agenda: [
      {
        time: "اليوم الأول",
        title: "أساسيات طب أسنان الأطفال",
        speaker: "د. أحمد الزهراني",
      },
      {
        time: "اليوم الثاني",
        title: "إدارة سلوك الطفل",
        speaker: "د. أحمد الزهراني",
      },
      {
        time: "اليوم الثالث",
        title: "التطبيق العملي وال��الات",
        speaker: "د. أحمد الزهراني",
      },
    ],
    featured: false,
    trending: false,
    status: "upcoming",
    registrationDeadline: "2024-02-20",
    requirements: ["شهادة طب الأسنان", "رغبة في التخصص"],
    benefits: ["شهادة معتمدة", "تدريب عملي", "متابعة ب��د الدورة"],
    website: "https://pediatric-dentistry-course.com",
    phone: "+964 770 345 6789",
    email: "course@dental-academy.com",
  },
];

const categories = [
  { id: "all", name: "الكل", count: events.length },
  {
    id: "مؤتمر",
    name: "مؤتمرات",
    count: events.filter((e) => e.category === "مؤتمر").length,
  },
  {
    id: "ورشة عمل",
    name: "ورش عمل",
    count: events.filter((e) => e.category === "ورشة عمل").length,
  },
  {
    id: "ندوة",
    name: "ندوات",
    count: events.filter((e) => e.category === "ندوة").length,
  },
  {
    id: "دورة تدر��بية",
    name: "دورات تدريبية",
    count: events.filter((e) => e.category === "دورة تدريبية").length,
  },
];

const eventTypes = [
  { id: "all", name: "الكل" },
  { id: "حضوري", name: "حضوري" },
  { id: "افتراضي", name: "افتراضي" },
  { id: "مختلط", name: "مختلط" },
];

export default function CommunityEvents() {
  const { language } = useI18n();
  const isMobile = useIsMobile();
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedType, setSelectedType] = useState("all");
  const [viewMode, setViewMode] = useState("grid");
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("date");
  const [showFilters, setShowFilters] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<any>(null);

  const filteredEvents = events.filter((event) => {
    const matchesCategory =
      selectedCategory === "all" || event.category === selectedCategory;
    const matchesType = selectedType === "all" || event.type === selectedType;
    const matchesSearch =
      event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      event.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      event.tags.some((tag) =>
        tag.toLowerCase().includes(searchQuery.toLowerCase()),
      );
    return matchesCategory && matchesType && matchesSearch;
  });

  const sortedEvents = [...filteredEvents].sort((a, b) => {
    switch (sortBy) {
      case "date":
        return new Date(a.date).getTime() - new Date(b.date).getTime();
      case "featured":
        return (b.featured ? 1 : 0) - (a.featured ? 1 : 0);
      case "rating":
        return b.rating - a.rating;
      case "popular":
        return b.registered - a.registered;
      case "price":
        const priceA =
          a.price === "مجاني" ? 0 : parseInt(a.price.replace(/[^\d]/g, ""));
        const priceB =
          b.price === "مجاني" ? 0 : parseInt(b.price.replace(/[^\d]/g, ""));
        return priceA - priceB;
      default:
        return 0;
    }
  });

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString("ar-EG", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const getEventStatus = (event: any) => {
    const now = new Date();
    const eventDate = new Date(event.date);
    const registrationDeadline = new Date(event.registrationDeadline);

    if (eventDate < now)
      return { status: "انتهى", color: "text-gray-600 bg-gray-100" };
    if (registrationDeadline < now)
      return { status: "مغلق ��لتسجيل", color: "text-red-600 bg-red-100" };
    if (event.registered >= event.capacity)
      return { status: "مكتمل", color: "text-orange-600 bg-orange-100" };
    return { status: "متاح", color: "text-green-600 bg-green-100" };
  };

  const EventCard = ({ event }: { event: any }) => {
    const status = getEventStatus(event);

    return (
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-lg transition-all duration-300 group">
        <div className="relative">
          <img
            src={event.image}
            alt={event.title}
            className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
          />

          {/* Badges */}
          <div className="absolute top-3 right-3 flex flex-col gap-2">
            {event.featured && (
              <span className="bg-yellow-500 text-white px-2 py-1 rounded-full text-xs font-bold flex items-center gap-1">
                <Star className="w-3 h-3 fill-current" />
                مميز
              </span>
            )}
            {event.trending && (
              <span className="bg-red-500 text-white px-2 py-1 rounded-full text-xs font-bold">
                رائج
              </span>
            )}
          </div>

          {/* Status */}
          <div className="absolute bottom-3 left-3">
            <span
              className={cn(
                "px-2 py-1 rounded-full text-xs font-medium",
                status.color,
              )}
            >
              {status.status}
            </span>
          </div>

          {/* Type Badge */}
          <div className="absolute bottom-3 right-3">
            <span className="bg-black/70 text-white px-2 py-1 rounded text-xs flex items-center gap-1">
              {event.type === "افتراضي" ? (
                <Globe className="w-3 h-3" />
              ) : (
                <MapPin className="w-3 h-3" />
              )}
              {event.type}
            </span>
          </div>
        </div>

        <div className="p-4 sm:p-6">
          <div className="flex items-center gap-2 mb-3">
            <span className="bg-blue-100 text-blue-600 px-2 py-1 rounded-full text-xs font-medium">
              {event.category}
            </span>
            <span className="text-gray-400">•</span>
            <span className="text-gray-600 text-xs">
              {formatDate(event.date)}
            </span>
          </div>

          <h3 className="font-bold text-lg text-gray-900 mb-2 line-clamp-2 group-hover:text-blue-600 transition-colors">
            {event.title}
          </h3>
          <p className="text-sm text-gray-600 mb-4 line-clamp-2">
            {event.description}
          </p>

          {/* Event Details */}
          <div className="space-y-2 mb-4 text-sm text-gray-600">
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 flex-shrink-0" />
              <span>
                {formatDate(event.date)} - {formatDate(event.endDate)}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 flex-shrink-0" />
              <span>
                {event.time} - {event.endTime}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4 flex-shrink-0" />
              <span className="truncate">{event.location}</span>
            </div>
            <div className="flex items-center gap-2">
              <Users className="w-4 h-4 flex-shrink-0" />
              <span>
                {event.registered} / {event.capacity} مسجل
              </span>
            </div>
          </div>

          {/* Rating */}
          <div className="flex items-center gap-2 mb-4">
            <div className="flex items-center">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={cn(
                    "w-4 h-4",
                    i < Math.floor(event.rating)
                      ? "text-yellow-400 fill-current"
                      : "text-gray-300",
                  )}
                />
              ))}
            </div>
            <span className="font-semibold text-gray-900">{event.rating}</span>
            <span className="text-sm text-gray-600">
              ({event.reviewsCount})
            </span>
          </div>

          {/* Price */}
          <div className="flex items-center justify-between mb-4">
            <div>
              <span className="text-2xl font-bold text-green-600">
                {event.price}
              </span>
              {event.originalPrice && (
                <span className="text-sm text-gray-500 line-through mr-2">
                  {event.originalPrice}
                </span>
              )}
            </div>
            <div className="text-right">
              <div className="text-xs text-gray-600">التسجيل حتى</div>
              <div className="text-sm font-medium text-gray-900">
                {formatDate(event.registrationDeadline)}
              </div>
            </div>
          </div>

          {/* Tags */}
          <div className="mb-4">
            <div className="flex flex-wrap gap-1">
              {event.tags.slice(0, 3).map((tag: string, index: number) => (
                <span
                  key={index}
                  className="bg-gray-100 text-gray-700 px-2 py-1 rounded text-xs"
                >
                  #{tag}
                </span>
              ))}
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-2">
            <button
              onClick={() => setSelectedEvent(event)}
              className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors font-medium text-sm"
            >
              عرض التفاصيل
            </button>
            <button
              className={cn(
                "flex-1 py-2 px-4 rounded-lg font-medium text-sm transition-colors",
                status.status === "متاح"
                  ? "bg-green-600 text-white hover:bg-green-700"
                  : "bg-gray-300 text-gray-500 cursor-not-allowed",
              )}
              disabled={status.status !== "متاح"}
            >
              {status.status === "متاح" ? "سجل الآن" : status.status}
            </button>
            <button className="px-3 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors">
              <Heart className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    );
  };

  const EventModal = () =>
    selectedEvent && (
      <div className="fixed inset-0 bg-black/50 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4">
        <div className="bg-white rounded-t-2xl sm:rounded-2xl w-full sm:w-[95vw] sm:max-w-4xl max-h-[95vh] overflow-hidden">
          {/* Header */}
          <div className="relative">
            <img
              src={selectedEvent.image}
              alt={selectedEvent.title}
              className="w-full h-48 object-cover"
            />
            <div className="absolute inset-0 bg-black/30" />

            <button
              onClick={() => setSelectedEvent(null)}
              className="absolute top-4 left-4 p-2 bg-white/20 hover:bg-white/30 rounded-full transition-colors backdrop-blur-sm"
            >
              <X className="w-5 h-5 text-white" />
            </button>

            <div className="absolute bottom-4 left-4 right-4">
              <div className="flex items-center gap-2 mb-2">
                <span className="bg-blue-600 text-white px-3 py-1 rounded-full text-sm font-medium">
                  {selectedEvent.category}
                </span>
                <span className="bg-white/20 text-white px-3 py-1 rounded-full text-sm font-medium">
                  {selectedEvent.type}
                </span>
              </div>
              <h2 className="text-2xl font-bold text-white mb-2">
                {selectedEvent.title}
              </h2>
              <p className="text-white/90">{selectedEvent.description}</p>
            </div>
          </div>

          <div className="p-4 sm:p-6 max-h-[60vh] overflow-y-auto">
            <div className="grid lg:grid-cols-3 gap-6">
              {/* Main Content */}
              <div className="lg:col-span-2 space-y-6">
                {/* Event Info */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">
                    تفاصيل الفعالية
                  </h3>
                  <p className="text-gray-700 leading-relaxed">
                    {selectedEvent.fullDescription}
                  </p>
                </div>

                {/* Agenda */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">
                    جدول الأعمال
                  </h3>
                  <div className="space-y-3">
                    {selectedEvent.agenda.map((item: any, index: number) => (
                      <div
                        key={index}
                        className="flex gap-4 p-3 bg-gray-50 rounded-lg"
                      >
                        <div className="w-20 text-sm font-medium text-blue-600 flex-shrink-0">
                          {item.time}
                        </div>
                        <div className="flex-1">
                          <h4 className="font-medium text-gray-900">
                            {item.title}
                          </h4>
                          {item.speaker && (
                            <p className="text-sm text-gray-600">
                              {item.speaker}
                            </p>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Speakers */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">
                    ��لمح��ضر����
                  </h3>
                  <div className="space-y-3">
                    {selectedEvent.speakers.map(
                      (speaker: any, index: number) => (
                        <div key={index} className="flex items-center gap-3">
                          <img
                            src={speaker.avatar}
                            alt={speaker.name}
                            className="w-12 h-12 rounded-full object-cover"
                          />
                          <div>
                            <h4 className="font-medium text-gray-900">
                              {speaker.name}
                            </h4>
                            <p className="text-sm text-gray-600">
                              {speaker.title}
                            </p>
                          </div>
                        </div>
                      ),
                    )}
                  </div>
                </div>

                {/* Requirements & Benefits */}
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-3">
                      ��لمتط��با��
                    </h3>
                    <ul className="space-y-2">
                      {selectedEvent.requirements.map(
                        (req: string, index: number) => (
                          <li key={index} className="flex items-center gap-2">
                            <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
                            <span className="text-gray-700 text-sm">{req}</span>
                          </li>
                        ),
                      )}
                    </ul>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-3">
                      الم��اي��
                    </h3>
                    <ul className="space-y-2">
                      {selectedEvent.benefits.map(
                        (benefit: string, index: number) => (
                          <li key={index} className="flex items-center gap-2">
                            <Star className="w-4 h-4 text-yellow-500 flex-shrink-0" />
                            <span className="text-gray-700 text-sm">
                              {benefit}
                            </span>
                          </li>
                        ),
                      )}
                    </ul>
                  </div>
                </div>
              </div>

              {/* Sidebar */}
              <div className="space-y-6">
                {/* Registration Info */}
                <div className="bg-gradient-to-br from-blue-50 to-green-50 rounded-xl p-4">
                  <h3 className="font-semibold text-gray-900 mb-3">
                    معلومات التسجيل
                  </h3>
                  <div className="space-y-3 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">السعر:</span>
                      <div className="text-right">
                        <span className="font-bold text-green-600">
                          {selectedEvent.price}
                        </span>
                        {selectedEvent.originalPrice && (
                          <div className="text-xs text-gray-500 line-through">
                            {selectedEvent.originalPrice}
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">المسجلين:</span>
                      <span className="font-medium">
                        {selectedEvent.registered} / {selectedEvent.capacity}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">آخر موع��:</span>
                      <span className="font-medium">
                        {formatDate(selectedEvent.registrationDeadline)}
                      </span>
                    </div>
                  </div>

                  <div className="mt-4 space-y-2">
                    <button className="w-full bg-green-600 text-white py-3 px-4 rounded-lg hover:bg-green-700 transition-colors font-medium">
                      سجل ا��آن
                    </button>
                    <button className="w-full bg-gray-100 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-200 transition-colors font-medium">
                      إضافة للمفضلة
                    </button>
                  </div>
                </div>

                {/* Event Details */}
                <div>
                  <h3 className="font-semibold text-gray-900 mb-3">
                    تفاصيل الحدث
                  </h3>
                  <div className="space-y-3 text-sm">
                    <div className="flex items-start gap-2">
                      <Calendar className="w-4 h-4 text-gray-500 mt-0.5 flex-shrink-0" />
                      <div>
                        <div className="font-medium text-gray-900">التاريخ</div>
                        <div className="text-gray-600">
                          {formatDate(selectedEvent.date)} -{" "}
                          {formatDate(selectedEvent.endDate)}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-start gap-2">
                      <Clock className="w-4 h-4 text-gray-500 mt-0.5 flex-shrink-0" />
                      <div>
                        <div className="font-medium text-gray-900">ال����ت</div>
                        <div className="text-gray-600">
                          {selectedEvent.time} - {selectedEvent.endTime}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-start gap-2">
                      <MapPin className="w-4 h-4 text-gray-500 mt-0.5 flex-shrink-0" />
                      <div>
                        <div className="font-medium text-gray-900">ال��كان</div>
                        <div className="text-gray-600">
                          {selectedEvent.location}
                        </div>
                        <div className="text-gray-600">
                          {selectedEvent.city}, {selectedEvent.country}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Organizer */}
                <div>
                  <h3 className="font-semibold text-gray-900 mb-3">المنظم</h3>
                  <div className="flex items-center gap-3">
                    <img
                      src={selectedEvent.organizer.avatar}
                      alt={selectedEvent.organizer.name}
                      className="w-12 h-12 rounded-full object-cover"
                    />
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="font-medium text-gray-900">
                          {selectedEvent.organizer.name}
                        </h4>
                        {selectedEvent.organizer.verified && (
                          <CheckCircle className="w-4 h-4 text-blue-500" />
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Contact */}
                <div>
                  <h3 className="font-semibold text-gray-900 mb-3">
                    معلومات الاتصال
                  </h3>
                  <div className="space-y-2 text-sm">
                    {selectedEvent.website && (
                      <a
                        href={selectedEvent.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 text-blue-600 hover:text-blue-700"
                      >
                        <ExternalLink className="w-4 h-4" />
                        الموقع الرسمي
                      </a>
                    )}
                    {selectedEvent.phone && (
                      <a
                        href={`tel:${selectedEvent.phone}`}
                        className="flex items-center gap-2 text-blue-600 hover:text-blue-700"
                      >
                      <Phone className="w-4 h-4" />
                        {selectedEvent.phone}
                      </a>
                    )}
                    {selectedEvent.email && (
                      <a
                        href={`mailto:${selectedEvent.email}`}
                        className="flex items-center gap-2 text-blue-600 hover:text-blue-700"
                      >
                      <Mail className="w-4 h-4" />
                        {selectedEvent.email}
                      </a>
                    )}
                  </div>
                </div>

                {/* Share */}
                <div className="flex gap-2">
                  <button className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors font-medium flex items-center justify-center gap-2">
                    <Share2 className="w-4 h-4" />
                    مشاركة
                  </button>
                  <button className="flex-1 bg-gray-100 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-200 transition-colors font-medium flex items-center justify-center gap-2">
                    <Download className="w-4 h-4" />
                    تحميل
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );

  return (
    <div
      className="min-h-screen bg-gray-50 with-floating-nav"
      dir={language === "ar" ? "rtl" : "ltr"}
    >
      {/* Header */}
      <div className="sticky top-0 bg-white border-b border-gray-200 z-30">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                  <Calendar className="w-4 h-4 text-white" />
                </div>
                <h1 className="text-xl font-bold text-gray-900">
                  فعاليات المجتمع الطبي
                </h1>
              </div>
            </div>

            <div className="flex items-center gap-3">
              {!isMobile && (
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="text"
                    placeholder="البحث عن فعالية..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10 pr-4 py-2 w-80 text-sm border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              )}

              <Link
                to="/community"
                className="text-blue-600 hover:text-blue-700 text-sm font-medium"
              >
                العودة للمجتمع
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-6">
        {/* Mobile Search */}
        {isMobile && (
          <div className="bg-white rounded-xl border border-gray-200 p-4 mb-6">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="البحث عن فعالية..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>
        )}

        {/* Hero Section */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl text-white p-6 sm:p-8 mb-8">
          <div className="grid lg:grid-cols-2 gap-8 items-center">
            <div>
              <h1 className="text-3xl sm:text-4xl font-bold mb-4">
                اكتشف أحدث الفعاليات الطبية
              </h1>
              <p className="text-lg mb-6 opacity-90">
                انضم إلى مؤتمرات وورش عمل ودورات تدريبية متخصصة في طب الأسنان
                وطور مهاراتك المهنية.
              </p>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div className="bg-white/20 rounded-lg p-3 text-center">
                  <div className="text-2xl font-bold">{events.length}</div>
                  <div className="text-sm opacity-90">فعالية</div>
                </div>
                <div className="bg-white/20 rounded-lg p-3 text-center">
                  <div className="text-2xl font-bold">
                    {categories.length - 1}
                  </div>
                  <div className="text-sm opacity-90">نوع</div>
                </div>
                <div className="bg-white/20 rounded-lg p-3 text-center">
                  <div className="text-2xl font-bold">
                    {events.filter((e) => e.type === "افتراضي").length}
                  </div>
                  <div className="text-sm opacity-90">افتراضي</div>
                </div>
                <div className="bg-white/20 rounded-lg p-3 text-center">
                  <div className="text-2xl font-bold">
                    {events.filter((e) => e.price === "مجاني").length}
                  </div>
                  <div className="text-sm opacity-90">مجاني</div>
                </div>
              </div>
            </div>
            <div className="hidden lg:block">
              <div className="bg-white/10 rounded-2xl p-6 backdrop-blur-sm">
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-white/20 rounded-lg p-4 text-center">
                    <Presentation className="w-8 h-8 mx-auto mb-2" />
                    <p className="text-sm">مؤتمرات علمية</p>
                  </div>
                  <div className="bg-white/20 rounded-lg p-4 text-center">
                    <Target className="w-8 h-8 mx-auto mb-2" />
                    <p className="text-sm">��رش عمل تطبيقية</p>
                  </div>
                  <div className="bg-white/20 rounded-lg p-4 text-center">
                    <GraduationCap className="w-8 h-8 mx-auto mb-2" />
                    <p className="text-sm">دورات تدريبية</p>
                  </div>
                  <div className="bg-white/20 rounded-lg p-4 text-center">
                    <Globe className="w-8 h-8 mx-auto mb-2" />
                    <p className="text-sm">ندوات افتراضية</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Filters and Controls */}
        <div className="bg-white rounded-xl border border-gray-200 p-4 mb-8">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <Filter className="w-4 h-4 text-gray-500" />
                <span className="text-sm font-medium text-gray-700">
                  تصفية:
                </span>
              </div>
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="md:hidden text-blue-600 hover:text-blue-700 text-sm font-medium"
              >
                {showFilters ? "إخفاء" : "إظهار"} المرشحات
              </button>
            </div>

            <div className="flex items-center gap-2">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="text-sm border border-gray-200 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500"
              >
                <option value="date">حسب التاريخ</option>
                <option value="featured">المميز</option>
                <option value="rating">الأعلى تقييماً</option>
                <option value="popular">الأكثر تسجيلاً</option>
                <option value="price">حسب السعر</option>
              </select>

              <button
                onClick={() =>
                  setViewMode(viewMode === "grid" ? "list" : "grid")
                }
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                {viewMode === "grid" ? (
                  <List className="w-4 h-4" />
                ) : (
                  <Grid3X3 className="w-4 h-4" />
                )}
              </button>
            </div>
          </div>

          <div className={cn("space-y-4", !showFilters && "hidden md:block")}>
            {/* Categories */}
            <div>
              <span className="text-sm font-medium text-gray-700 mb-2 block">
                نوع الفعالية:
              </span>
              <div className="flex gap-2 overflow-x-auto scrollbar-hide">
                {categories.map((category) => (
                  <button
                    key={category.id}
                    onClick={() => setSelectedCategory(category.id)}
                    className={cn(
                      "px-3 py-1 rounded-full text-sm font-medium whitespace-nowrap transition-colors",
                      selectedCategory === category.id
                        ? "bg-blue-600 text-white"
                        : "bg-gray-100 text-gray-700 hover:bg-gray-200",
                    )}
                  >
                    {category.name} ({category.count})
                  </button>
                ))}
              </div>
            </div>

            {/* Event Types */}
            <div>
              <span className="text-sm font-medium text-gray-700 mb-2 block">
                طريقة الحضور:
              </span>
              <div className="flex gap-2 overflow-x-auto scrollbar-hide">
                {eventTypes.map((type) => (
                  <button
                    key={type.id}
                    onClick={() => setSelectedType(type.id)}
                    className={cn(
                      "px-3 py-1 rounded-full text-sm font-medium whitespace-nowrap transition-colors",
                      selectedType === type.id
                        ? "bg-blue-600 text-white"
                        : "bg-gray-100 text-gray-700 hover:bg-gray-200",
                    )}
                  >
                    {type.name}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Results */}
        <div className="mb-6">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-gray-900">
              الفعاليات المتاحة
            </h2>
            <span className="text-sm text-gray-600">
              {sortedEvents.length} فعالية
            </span>
          </div>
        </div>

        {/* Events Grid */}
        <div
          className={cn(
            "grid gap-6 mb-8",
            viewMode === "grid"
              ? "grid-cols-1 md:grid-cols-2 lg:grid-cols-3"
              : "grid-cols-1",
          )}
        >
          {sortedEvents.map((event) => (
            <EventCard key={event.id} event={event} />
          ))}
        </div>

        {/* Empty State */}
        {sortedEvents.length === 0 && (
          <div className="text-center py-12">
            <Calendar className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              لا توجد فعاليات
            </h3>
            <p className="text-gray-600">جرب تغيير المرشحات أو كلمات البحث</p>
          </div>
        )}
      </div>

      {/* Event Modal */}
      <EventModal />


      {/* Bottom padding for mobile */}
      {isMobile && <div className="h-20"></div>}
    </div>
  );
}
