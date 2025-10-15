import React, { useState } from "react";
import { Link } from "react-router-dom";
import {
  BookOpen,
  Video,
  Users,
  Award,
  Clock,
  Star,
  Download,
  Play,
  FileText,
  Target,
  Brain,
  TrendingUp,
  Calendar,
  Search,
  Filter,
  Grid,
  List,
  User,
  CheckCircle,
  ArrowRight,
  Heart,
  Bookmark,
  Share2,
  Eye,
  MessageCircle,
  Home,
  Bell,
  Settings,
  PlayCircle,
  PauseCircle,
  Volume2,
  VolumeX,
  Maximize,
  RotateCcw,
  FastForward,
  Rewind,
  Monitor,
  Smartphone,
  X,
  ChevronDown,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useI18n } from "@/lib/i18n";

// بيانات التعليم والدورات
const educationData = {
  courses: [
    {
      id: 1,
      title: "أساسيات طب الأسنان الحديث",
      instructor: "د. أحمد الطبيب",
      duration: "8 ساعات",
      lessons: 24,
      students: 1250,
      rating: 4.9,
      price: "150 د.ع",
      level: "مبتدئ",
      category: "أساسيات",
      description: "دورة شاملة تغطي أساسيات طب الأسنان الحديث",
      thumbnail: "/placeholder.svg",
      featured: true,
      completed: false,
      progress: 0,
      tags: ["أساسيات", "تشخيص", "علاج"],
    },
    {
      id: 2,
      title: "تقنيات التصوير الشعاعي المتقدمة",
      instructor: "د. سارة الرادولوجي",
      duration: "6 ساعات",
      lessons: 18,
      students: 890,
      rating: 4.8,
      price: "200 د.ع",
      level: "متقدم",
      category: "تصوير",
      description: "تعلم أحدث تقنيات التصوير الشعاعي في طب الأسنان",
      thumbnail: "/placeholder.svg",
      featured: true,
      completed: false,
      progress: 0,
      tags: ["تصوير", "أشعة", "تشخيص"],
    },
    {
      id: 3,
      title: "جراحة الفم والوجه والفكين",
      instructor: "د. محمد الجراح",
      duration: "12 ساعات",
      lessons: 36,
      students: 567,
      rating: 4.9,
      price: "350 د.ع",
      level: "خبير",
      category: "جراحة",
      description: "دورة متخصصة في جراحة الفم والوجه والفكين",
      thumbnail: "/placeholder.svg",
      featured: false,
      completed: false,
      progress: 0,
      tags: ["جراحة", "فكين", "تخصص"],
    },
    {
      id: 4,
      title: "تقويم الأسنان الرقمي",
      instructor: "د. نورا التقويم",
      duration: "10 ساعات",
      lessons: 30,
      students: 734,
      rating: 4.7,
      price: "280 د.ع",
      level: "متوسط",
      category: "تقويم",
      description: "أحدث تقنيات التقويم الرقمي والذكاء الاصطناعي",
      thumbnail: "/placeholder.svg",
      featured: true,
      completed: false,
      progress: 0,
      tags: ["تقويم", "رقمي", "ذكاء اصطناعي"],
    },
    {
      id: 5,
      title: "طب أسنان الأطفال والسلوكيات",
      instructor: "د. ليلى الأطفال",
      duration: "7 ساعات",
      lessons: 21,
      students: 923,
      rating: 4.8,
      price: "180 د.ع",
      level: "متوسط",
      category: "أطفال",
      description: "التعامل مع أطفال وإدارة السلوكيات في العيادة",
      thumbnail: "/placeholder.svg",
      featured: false,
      completed: false,
      progress: 0,
      tags: ["أطفال", "سلوك", "نفسي"],
    },
    {
      id: 6,
      title: "تجميل وتبييض الأسنان",
      instructor: "د. خالد التجميل",
      duration: "5 ساعات",
      lessons: 15,
      students: 1456,
      rating: 4.6,
      price: "120 د.ع",
      level: "مبتدئ",
      category: "تجميل",
      description: "تقنيات تجميل وتبييض الأسنان الحديثة",
      thumbnail: "/placeholder.svg",
      featured: false,
      completed: false,
      progress: 0,
      tags: ["تجميل", "تبييض", "جمالي"],
    },
  ],
  webinars: [
    {
      id: 1,
      title: "مستقبل طب الأسنان مع الذكاء الاصطناعي",
      speaker: "د. أحمد الذكي",
      date: "2024-02-15",
      time: "19:00",
      duration: "1.5 ساعة",
      attendees: 2340,
      free: true,
      description: "ندوة حول دور الذكاء الاصطناعي في تطوير طب الأسنان",
      status: "upcoming",
    },
    {
      id: 2,
      title: "إدارة العياد�� الناجحة",
      speaker: "د. سارة الإدارة",
      date: "2024-02-20",
      time: "20:00",
      duration: "2 ساعة",
      attendees: 1870,
      free: false,
      price: "50 د.ع",
      description: "استراتيجيات إدارة العيادة وزيادة الربحية",
      status: "upcoming",
    },
  ],
  certifications: [
    {
      id: 1,
      title: "شهادة طب الأسنان الرقمي",
      duration: "3 أشهر",
      price: "500 د.ع",
      modules: 8,
      description: "برنامج شهادة معتمد في طب الأسنان الرقمي",
    },
    {
      id: 2,
      title: "شهادة إدارة العيادات",
      duration: "2 أشهر",
      price: "300 د.ع",
      modules: 6,
      description: "برنامج شهادة في إدارة العيادات الطبية",
    },
  ],
  books: [
    {
      id: 1,
      title: "دليل طب الأسنان الشامل",
      author: "د. محمد المؤلف",
      pages: 450,
      price: "80 د.ع",
      format: "PDF + مطبوع",
      rating: 4.7,
      description: "مرجع شامل في طب الأسنان الحديث",
    },
    {
      id: 2,
      title: "أطلس التشريح الفموي",
      author: "د. فاطمة التشريح",
      pages: 320,
      price: "65 د.ع",
      format: "PDF",
      rating: 4.8,
      description: "دليل مصور لتشريح الفم والأسنان",
    },
  ],
};

// أقسام التعليم
const educationSections = [
  { id: "overview", label: "نظرة عامة", icon: Home },
  { id: "courses", label: "الدورات", icon: BookOpen },
  { id: "webinars", label: "الندوات المباشرة", icon: Video },
  { id: "certifications", label: "الشهادات", icon: Award },
  { id: "books", label: "الكتب والمراجع", icon: FileText },
  { id: "my-learning", label: "تعليمي", icon: User },
];

// فلاتر أفقية للدورات
const courseFilters = [
  { id: "all", label: "الكل", count: educationData.courses.length },
  {
    id: "featured",
    label: "مميزة",
    count: educationData.courses.filter((c) => c.featured).length,
  },
  {
    id: "beginner",
    label: "مبتدئ",
    count: educationData.courses.filter((c) => c.level === "مبتدئ").length,
  },
  {
    id: "intermediate",
    label: "متوسط",
    count: educationData.courses.filter((c) => c.level === "متوسط").length,
  },
  {
    id: "advanced",
    label: "متقدم",
    count: educationData.courses.filter((c) => c.level === "��تقدم").length,
  },
];

export default function Education() {
  const { language } = useI18n();
  const [activeSection, setActiveSection] = useState("overview");
  const [activeFilter, setActiveFilter] = useState("all");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCourse, setSelectedCourse] = useState<any>(null);
  const [showCourseDetails, setShowCourseDetails] = useState(false);

  // فلترة الدورات
  const filteredCourses = educationData.courses
    .filter((course) => {
      if (activeFilter === "featured") return course.featured;
      if (activeFilter === "beginner") return course.level === "مبتدئ";
      if (activeFilter === "intermediate") return course.level === "متوسط";
      if (activeFilter === "advanced") return course.level === "متقدم";
      return true;
    })
    .filter(
      (course) =>
        searchQuery === "" ||
        course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        course.instructor.toLowerCase().includes(searchQuery.toLowerCase()),
    );

  // بطاقة دورة مضغوطة
  const CompactCourseCard = ({ course }: { course: any }) => (
    <div
      className={cn(
        "bg-white rounded-lg border transition-all duration-200 cursor-pointer hover:shadow-md overflow-hidden",
        course.featured && "ring-1 ring-purple-200 bg-purple-50/20",
      )}
      onClick={() => {
        setSelectedCourse(course);
        setShowCourseDetails(true);
      }}
    >
      {/* صورة الدورة */}
      <div className="relative">
        <img
          src={course.thumbnail}
          alt={course.title}
          className="w-full h-24 sm:h-28 object-cover"
        />
        {course.featured && (
          <div className="absolute top-2 right-2">
            <span className="bg-purple-500 text-white text-xs px-2 py-1 rounded-full">
              مميزة
            </span>
          </div>
        )}
        <div className="absolute bottom-2 left-2">
          <span className="bg-black/70 text-white text-xs px-2 py-1 rounded-full">
            {course.duration}
          </span>
        </div>
      </div>

      {/* محتوى البطاقة */}
      <div className="p-3">
        <h3 className="text-sm font-semibold text-gray-900 line-clamp-2 mb-2 leading-tight">
          {course.title}
        </h3>

        <p className="text-xs text-gray-600 mb-2">{course.instructor}</p>

        <div className="flex items-center justify-between text-xs text-gray-500 mb-2">
          <div className="flex items-center gap-3">
            <span>{course.lessons} درس</span>
            <span>{course.students} طالب</span>
          </div>
          <div className="flex items-center gap-1">
            <Star className="w-3 h-3 text-yellow-400 fill-current" />
            <span className="font-medium">{course.rating}</span>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <span
            className={cn(
              "text-xs px-2 py-1 rounded-full",
              course.level === "مبتدئ" && "bg-green-100 text-green-600",
              course.level === "متوسط" && "bg-blue-100 text-blue-600",
              course.level === "متقدم" && "bg-red-100 text-red-600",
            )}
          >
            {course.level}
          </span>
          <span className="text-sm font-bold text-purple-600">
            {course.price}
          </span>
        </div>
      </div>
    </div>
  );

  // صفحة النظرة العامة
  const OverviewSection = () => (
    <div className="space-y-4">
      {/* إحصائيات التعليم */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg p-3 text-center">
          <div className="text-xl font-bold text-purple-600">
            {educationData.courses.length}
          </div>
          <div className="text-xs text-purple-700">دورات تدريبية</div>
        </div>
        <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-3 text-center">
          <div className="text-xl font-bold text-blue-600">
            {educationData.webinars.length}
          </div>
          <div className="text-xs text-blue-700">ندوات مباشرة</div>
        </div>
        <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-lg p-3 text-center">
          <div className="text-xl font-bold text-green-600">
            {educationData.certifications.length}
          </div>
          <div className="text-xs text-green-700">برامج شهادات</div>
        </div>
        <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-lg p-3 text-center">
          <div className="text-xl font-bold text-orange-600">
            {educationData.books.length}
          </div>
          <div className="text-xs text-orange-700">كتب ومراجع</div>
        </div>
      </div>

      {/* الدورات المميزة */}
      <div className="bg-white rounded-lg border">
        <div className="p-3 border-b border-gray-100">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-semibold text-gray-900">
              الدورات المميزة
            </h2>
            <button
              onClick={() => setActiveSection("courses")}
              className="text-purple-600 hover:text-purple-700 text-sm font-medium flex items-center gap-1"
            >
              عرض الكل
              <ArrowRight className="w-3 h-3" />
            </button>
          </div>
        </div>

        <div className="p-3">
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
            {educationData.courses
              .filter((course) => course.featured)
              .map((course) => (
                <CompactCourseCard key={course.id} course={course} />
              ))}
          </div>
        </div>
      </div>

      {/* الندوات القادمة */}
      <div className="bg-white rounded-lg border">
        <div className="p-3 border-b border-gray-100">
          <h2 className="text-base font-semibold text-gray-900">
            الندوات القادمة
          </h2>
        </div>

        <div className="p-3 space-y-3">
          {educationData.webinars.map((webinar) => (
            <div
              key={webinar.id}
              className="border border-gray-200 rounded-lg p-3"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h3 className="text-sm font-semibold text-gray-900 mb-1">
                    {webinar.title}
                  </h3>
                  <p className="text-xs text-gray-600 mb-2">
                    {webinar.speaker}
                  </p>
                  <div className="flex items-center gap-3 text-xs text-gray-500">
                    <div className="flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      {webinar.date}
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {webinar.time}
                    </div>
                    <div className="flex items-center gap-1">
                      <Users className="w-3 h-3" />
                      {webinar.attendees} مشارك
                    </div>
                  </div>
                </div>
                <div className="text-left">
                  {webinar.free ? (
                    <span className="text-green-600 text-sm font-semibold">
                      مجاني
                    </span>
                  ) : (
                    <span className="text-purple-600 text-sm font-semibold">
                      {webinar.price}
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* نصائح سري��ة */}
      <div className="grid md:grid-cols-2 gap-4">
        <div className="bg-gradient-to-r from-purple-600 to-blue-600 rounded-lg p-4 text-white">
          <h3 className="text-base font-semibold mb-2">نصائح للتعلم الفعال</h3>
          <ul className="space-y-1 text-sm text-purple-100">
            <li>• حدد هدفاً واضحاً قبل البدء</li>
            <li>• خصص وقتاً يومياً للتعلم</li>
            <li>• طبق ما تعلمته عملياً</li>
            <li>• شارك في المناقشات والتفاعل</li>
          </ul>
        </div>

        <div className="bg-gradient-to-r from-green-600 to-teal-600 rounded-lg p-4 text-white">
          <h3 className="text-base font-semibold mb-2">برامج الشهادات</h3>
          <ul className="space-y-1 text-sm text-green-100">
            <li>• شهادات معتمدة دولياً</li>
            <li>• مناهج محدثة بأحدث التقنيات</li>
            <li>• متابعة شخصية من المدربين</li>
            <li>• فرص توظيف بعد التخرج</li>
          </ul>
        </div>
      </div>
    </div>
  );

  // صفحة الدورات
  const CoursesSection = () => (
    <div className="space-y-4">
      {/* البحث والفلاتر */}
      <div className="bg-white rounded-lg border p-3">
        <div className="space-y-3">
          <div className="relative">
            <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="ابحث عن دورة أو مدرب..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pr-10 pl-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-sm"
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="flex gap-2 overflow-x-auto pb-1">
              {courseFilters.map((filter) => (
                <button
                  key={filter.id}
                  onClick={() => setActiveFilter(filter.id)}
                  className={cn(
                    "flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium whitespace-nowrap transition-colors",
                    activeFilter === filter.id
                      ? "bg-purple-500 text-white"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200",
                  )}
                >
                  {filter.label}
                  <span
                    className={cn(
                      "px-1.5 py-0.5 rounded-full text-xs",
                      activeFilter === filter.id
                        ? "bg-white/20 text-white"
                        : "bg-white text-gray-600",
                    )}
                  >
                    {filter.count}
                  </span>
                </button>
              ))}
            </div>

            <div className="flex items-center gap-1">
              <button
                onClick={() => setViewMode("grid")}
                className={cn(
                  "p-1.5 rounded transition-colors",
                  viewMode === "grid"
                    ? "bg-purple-100 text-purple-600"
                    : "text-gray-400",
                )}
              >
                <Grid className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode("list")}
                className={cn(
                  "p-1.5 rounded transition-colors",
                  viewMode === "list"
                    ? "bg-purple-100 text-purple-600"
                    : "text-gray-400",
                )}
              >
                <List className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* النتائج */}
      <div className="bg-white rounded-lg border p-3">
        <div className="mb-3">
          <p className="text-sm text-gray-600">
            <span className="font-semibold text-gray-900">
              {filteredCourses.length}
            </span>{" "}
            دورة متاحة
          </p>
        </div>

        <div
          className={cn(
            viewMode === "grid"
              ? "grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3"
              : "space-y-3",
          )}
        >
          {filteredCourses.map((course) => (
            <CompactCourseCard key={course.id} course={course} />
          ))}
        </div>
      </div>
    </div>
  );

  // عرض المحتوى حسب القسم
  const renderContent = () => {
    switch (activeSection) {
      case "overview":
        return <OverviewSection />;
      case "courses":
        return <CoursesSection />;
      case "webinars":
        return (
          <div className="bg-white rounded-lg border p-8 text-center">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Video className="w-8 h-8 text-blue-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              الندوات المباشرة
            </h3>
            <p className="text-gray-600">
              شاهد وشارك في الندوات التعليمية المباشرة
            </p>
          </div>
        );
      case "certifications":
        return (
          <div className="bg-white rounded-lg border p-8 text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Award className="w-8 h-8 text-green-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              برامج الشهادات
            </h3>
            <p className="text-gray-600">
              احصل على شهادات معتمدة في تخصصات طب الأسنان
            </p>
          </div>
        );
      case "books":
        return (
          <div className="bg-white rounded-lg border p-8 text-center">
            <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <FileText className="w-8 h-8 text-orange-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              الكتب والمراجع
            </h3>
            <p className="text-gray-600">
              مكتبة شاملة من الكتب والمراجع الطبية
            </p>
          </div>
        );
      case "my-learning":
        return (
          <div className="bg-white rounded-lg border p-8 text-center">
            <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <User className="w-8 h-8 text-purple-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              رحلتي التعليمية
            </h3>
            <p className="text-gray-600">تتبع تقدمك والدورات التي التحقت بها</p>
          </div>
        );
      default:
        return <OverviewSection />;
    }
  };

  return (
    <div
      className="min-h-screen bg-gray-50"
      dir={language === "ar" ? "rtl" : "ltr"}
    >
      {/* شريط علوي ثابت */}
      <div className="fixed top-0 left-0 right-0 z-50 bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-14">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-purple-600 to-blue-600 flex items-center justify-center text-white">
                <BookOpen className="w-4 h-4" />
              </div>
              <div>
                <h1 className="text-base font-bold text-gray-900">
                  قسم التطوير
                </h1>
                <p className="text-xs text-gray-500">التعليم والتطوير المهني</p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button className="p-2 text-gray-600 hover:text-purple-600 rounded-lg hover:bg-purple-50 transition-colors">
                <Search className="w-4 h-4" />
              </button>
              <button className="p-2 text-gray-600 hover:text-purple-600 rounded-lg hover:bg-purple-50 transition-colors">
                <Bell className="w-4 h-4" />
              </button>
              <button className="p-2 text-gray-600 hover:text-purple-600 rounded-lg hover:bg-purple-50 transition-colors">
                <User className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* المحتوى الرئيسي */}
      <div className="pt-14 pb-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          {/* أقسام التطوير */}
          <div className="bg-white rounded-lg border mb-4 overflow-hidden">
            <div className="flex overflow-x-auto scrollbar-hide">
              {educationSections.map((section) => (
                <button
                  key={section.id}
                  onClick={() => setActiveSection(section.id)}
                  className={cn(
                    "flex items-center gap-2 px-4 py-3 text-sm font-medium whitespace-nowrap border-b-2 transition-colors min-w-max",
                    activeSection === section.id
                      ? "border-purple-500 text-purple-600 bg-purple-50"
                      : "border-transparent text-gray-600 hover:text-gray-900 hover:bg-gray-50",
                  )}
                >
                  <section.icon className="w-4 h-4" />
                  {section.label}
                </button>
              ))}
            </div>
          </div>

          {/* محتوى القسم */}
          {renderContent()}
        </div>
      </div>

      {/* شريط سفلي ثابت */}
      <div className="fixed bottom-0 left-0 right-0 z-40 bg-white border-t border-gray-200 shadow-lg">
        <div className="max-w-md mx-auto">
          <div className="flex items-center justify-around px-2 py-2">
            <Link
              to="/"
              className="flex flex-col items-center p-2 text-gray-600 hover:text-purple-600"
            >
              <Home className="w-5 h-5" />
              <span className="text-xs mt-1">الرئيسية</span>
            </Link>
            <button className="flex flex-col items-center p-2 text-purple-600">
              <BookOpen className="w-5 h-5" />
              <span className="text-xs mt-1">التطوير</span>
            </button>
            <button className="flex flex-col items-center p-2 text-gray-600 hover:text-purple-600">
              <Bell className="w-5 h-5" />
              <span className="text-xs mt-1">الإشعارات</span>
            </button>
            <button className="flex flex-col items-center p-2 text-gray-600 hover:text-purple-600">
              <Heart className="w-5 h-5" />
              <span className="text-xs mt-1">المفضلة</span>
            </button>
            <button className="flex flex-col items-center p-2 text-gray-600 hover:text-purple-600">
              <User className="w-5 h-5" />
              <span className="text-xs mt-1">الملف</span>
            </button>
          </div>
        </div>
      </div>

      {/* تفاصيل الدورة */}
      {showCourseDetails && selectedCourse && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-end justify-center p-4 lg:items-center">
          <div className="bg-white rounded-t-3xl lg:rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-gray-200 p-4 rounded-t-3xl lg:rounded-t-2xl">
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-3">
                  <img
                    src={selectedCourse.thumbnail}
                    alt={selectedCourse.title}
                    className="w-16 h-16 rounded-lg object-cover"
                  />
                  <div>
                    <h2 className="text-lg font-bold text-gray-900">
                      {selectedCourse.title}
                    </h2>
                    <p className="text-gray-700">{selectedCourse.instructor}</p>
                    <div className="flex items-center gap-3 text-sm text-gray-600 mt-1">
                      <div className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {selectedCourse.duration}
                      </div>
                      <div className="flex items-center gap-1">
                        <BookOpen className="w-3 h-3" />
                        {selectedCourse.lessons} درس
                      </div>
                      <div className="flex items-center gap-1">
                        <Star className="w-3 h-3 text-yellow-400 fill-current" />
                        {selectedCourse.rating}
                      </div>
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => setShowCourseDetails(false)}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            <div className="p-4 space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-purple-50 rounded-lg p-3">
                  <div className="flex items-center gap-2 mb-1">
                    <Users className="w-4 h-4 text-purple-600" />
                    <span className="text-sm font-medium text-purple-900">
                      الطلاب
                    </span>
                  </div>
                  <p className="text-base font-bold text-purple-900">
                    {selectedCourse.students}
                  </p>
                </div>

                <div className="bg-green-50 rounded-lg p-3">
                  <div className="flex items-center gap-2 mb-1">
                    <Target className="w-4 h-4 text-green-600" />
                    <span className="text-sm font-medium text-green-900">
                      المستوى
                    </span>
                  </div>
                  <p className="text-base font-bold text-green-900">
                    {selectedCourse.level}
                  </p>
                </div>
              </div>

              <div>
                <h3 className="text-base font-semibold text-gray-900 mb-2">
                  وصف الدورة
                </h3>
                <p className="text-gray-700 text-sm leading-relaxed">
                  {selectedCourse.description}
                </p>
              </div>

              <div>
                <h3 className="text-base font-semibold text-gray-900 mb-2">
                  المواضيع
                </h3>
                <div className="flex flex-wrap gap-2">
                  {selectedCourse.tags.map((tag: string, index: number) => (
                    <span
                      key={index}
                      className="bg-blue-100 text-blue-700 text-xs px-2 py-1 rounded-full"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>

              <div className="flex gap-3 pt-2">
                <button className="flex-1 bg-gradient-to-r from-purple-600 to-blue-600 text-white py-3 rounded-lg font-semibold hover:from-purple-700 hover:to-blue-700 transition-all duration-300 flex items-center justify-center gap-2">
                  <PlayCircle className="w-4 h-4" />
                  ابدأ الدورة - {selectedCourse.price}
                </button>

                <button className="px-4 py-3 border border-gray-200 rounded-lg font-semibold text-gray-700 hover:bg-gray-50 transition-colors">
                  <Heart className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
