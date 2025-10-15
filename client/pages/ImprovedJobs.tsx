import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  Search,
  MapPin,
  Clock,
  DollarSign,
  Briefcase,
  Filter,
  Star,
  Users,
  Calendar,
  Building,
  Heart,
  MessageCircle,
  Plus,
  Bell,
  User,
  CheckCircle,
  ArrowRight,
  Award,
  TrendingUp,
  Eye,
  Bookmark,
  Send,
  Phone,
  Mail,
  Globe,
  Target,
  Brain,
  Settings,
  Map,
  Navigation,
  Radar,
  ZoomIn,
  ZoomOut,
  Layers,
  Route,
  X,
  ChevronDown,
  Menu,
  Home,
  Grid,
  List,
  Wifi,
} from "lucide-react";
import { cn } from "@/lib/utils";
import UnifiedNavigationHeader from "@/components/UnifiedNavigationHeader";
import FixedBottomNavigation from "@/components/FixedBottomNavigation";
import InteractiveJobsMap from "@/components/InteractiveJobsMap";

// Mock data for job listings
const jobListings = [
  {
    id: 1,
    title: "طبيب أسنان أول",
    company: "مجموعة سمايل تك",
    location: "بغداد، العراق",
    coordinates: { lat: 33.3152, lng: 44.3661 },
    district: "الكرادة",
    type: "دوام كامل",
    experience: "5+ سنوات",
    salary: "5,000 - 7,000 د.ع",
    description:
      "انضم إلى عيادتنا المبتكرة التي تستخدم أحدث تقنيات الذكاء الاصطناعي",
    posted: "منذ يومين",
    applicants: 42,
    featured: true,
    remote: false,
    urgent: false,
    logo: "/placeholder.svg",
    company_rating: 4.8,
    company_size: "50-100",
    distance: "2.3 كم",
  },
  {
    id: 2,
    title: "طبيب أسنان أطفال",
    company: "عيادة الأطفال السعداء",
    location: "البصرة، العراق",
    coordinates: { lat: 30.5085, lng: 47.7804 },
    district: "العشار",
    type: "دوام جزئي",
    experience: "3+ سنوات",
    salary: "3,500 - 4,500 د.ع",
    description: "نبحث عن طبيب أسنان أطفال متفهم للان��مام إلى عيادتنا",
    posted: "منذ أسبوع",
    applicants: 28,
    featured: false,
    remote: false,
    urgent: true,
    logo: "/placeholder.svg",
    company_rating: 4.6,
    company_size: "10-50",
    distance: "456 كم",
  },
  {
    id: 3,
    title: "أخصائي تقويم أسنان",
    company: "شركة التقويم الرقمي",
    location: "عن بُعد",
    coordinates: null,
    district: "العمل من المنزل",
    type: "عقد مؤقت",
    experience: "7+ سنوات",
    salary: "50 - 75 د.ع/ساعة",
    description: "استشارات تقويم أسنان ثورية عن بُعد",
    posted: "منذ 3 أيام",
    applicants: 67,
    featured: true,
    remote: true,
    urgent: false,
    logo: "/placeholder.svg",
    company_rating: 4.9,
    company_size: "100-200",
    distance: "عن بُعد",
  },
  {
    id: 4,
    title: "طبيب أسنان عام",
    company: "عيادة النور الطبية",
    location: "أربيل، العراق",
    coordinates: { lat: 36.19, lng: 44.0092 },
    district: "عنكاوا",
    type: "دوام كامل",
    experience: "2+ سنوات",
    salary: "4,000 - 5,500 د.ع",
    description: "فرصة عمل ممت��زة في عيادة حديثة",
    posted: "منذ 5 أيام",
    applicants: 31,
    featured: false,
    remote: false,
    urgent: false,
    logo: "/placeholder.svg",
    company_rating: 4.5,
    company_size: "20-50",
    distance: "387 كم",
  },
  {
    id: 5,
    title: "جراح فم وأسنان",
    company: "مستشفى الرافدين",
    location: "الموصل، العراق",
    coordinates: { lat: 36.335, lng: 43.1189 },
    district: "الميدان",
    type: "دوام كامل",
    experience: "8+ سنوات",
    salary: "6,000 - 8,500 د.ع",
    description: "نبحث عن جراح فم وأسنان خبير",
    posted: "منذ أسبوع",
    applicants: 19,
    featured: true,
    remote: false,
    urgent: true,
    logo: "/placeholder.svg",
    company_rating: 4.7,
    company_size: "200+",
    distance: "420 كم",
  },
  {
    id: 6,
    title: "استشاري تجميل أسنان",
    company: "عيادة الجمال الذهبي",
    location: "بغداد، العراق",
    coordinates: { lat: 33.3152, lng: 44.3661 },
    district: "المنصور",
    type: "دوام جزئي",
    experience: "10+ سنوات",
    salary: "7,000 - 10,000 د.ع",
    description: "فرصة للعمل مع نخبة من استشاريي تجميل الأسنان",
    posted: "منذ 4 أيام",
    applicants: 54,
    featured: true,
    remote: false,
    urgent: false,
    logo: "/placeholder.svg",
    company_rating: 4.9,
    company_size: "30-50",
    distance: "8.2 كم",
  },
];

// قائمة الأقسام الفرعية للتوظيف
const jobSections = [
  { id: "overview", label: "نظرة عامة", icon: Home, active: true },
  { id: "browse", label: "تصفح الوظائف", icon: Search },
  { id: "freelance", label: "العمل الحر", icon: Clock },
  { id: "professionals", label: "محترفون", icon: Users },
  { id: "my-jobs", label: "طلباتي", icon: Briefcase },
];

// فلاتر أفقية
const quickFilters = [
  { id: "all", label: "الكل", count: jobListings.length },
  {
    id: "featured",
    label: "مميزة",
    count: jobListings.filter((job) => job.featured).length,
  },
  {
    id: "urgent",
    label: "عاجلة",
    count: jobListings.filter((job) => job.urgent).length,
  },
  {
    id: "remote",
    label: "عن بُعد",
    count: jobListings.filter((job) => job.remote).length,
  },
  {
    id: "fulltime",
    label: "دوام كامل",
    count: jobListings.filter((job) => job.type === "دوام كامل").length,
  },
];

export default function ImprovedJobs() {
  const [activeSection, setActiveSection] = useState("overview");
  const [activeFilter, setActiveFilter] = useState("all");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [selectedJob, setSelectedJob] = useState<any>(null);
  const [showMap, setShowMap] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [showApplicationModal, setShowApplicationModal] = useState(false);

  // فلترة الوظائف
  const filteredJobs = jobListings
    .filter((job) => {
      if (activeFilter === "featured") return job.featured;
      if (activeFilter === "urgent") return job.urgent;
      if (activeFilter === "remote") return job.remote;
      if (activeFilter === "fulltime") return job.type === "دوام كامل";
      return true; // all
    })
    .filter(
      (job) =>
        searchQuery === "" ||
        job.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        job.company.toLowerCase().includes(searchQuery.toLowerCase()),
    );

  // بطاقة وظيفة مضغوطة للعرض الشبكي
  const CompactJobCard = ({ job }: { job: any }) => (
    <div
      className={cn(
        "bg-white rounded-xl border transition-all duration-200 cursor-pointer hover:shadow-md",
        job.featured && "ring-2 ring-purple-200",
        selectedJob?.id === job.id && "ring-2 ring-blue-500",
      )}
      onClick={() => setSelectedJob(job)}
    >
      {/* صورة الشركة والشارات */}
      <div className="relative p-3 pb-2">
        <div className="flex items-start gap-3">
          <img
            src={job.logo}
            alt={job.company}
            className="w-10 h-10 rounded-lg object-cover flex-shrink-0"
          />
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-2">
              <h3 className="text-sm font-semibold text-gray-900 line-clamp-2 leading-tight">
                {job.title}
              </h3>
              <div className="flex gap-1 flex-shrink-0">
                {job.featured && (
                  <span className="bg-purple-100 text-purple-600 text-xs px-1.5 py-0.5 rounded-full">
                    ⭐
                  </span>
                )}
                {job.urgent && (
                  <span className="bg-red-100 text-red-600 text-xs px-1.5 py-0.5 rounded-full">
                    🔥
                  </span>
                )}
                {job.remote && (
                  <span className="bg-blue-100 text-blue-600 text-xs px-1.5 py-0.5 rounded-full">
                    <Wifi className="w-3 h-3" />
                  </span>
                )}
              </div>
            </div>
            <p className="text-xs text-gray-600 truncate">{job.company}</p>
          </div>
        </div>
      </div>

      {/* المعلومات الأساسية */}
      <div className="px-3 pb-3 space-y-1.5">
        <div className="flex items-center gap-1 text-xs text-gray-600">
          <MapPin className="w-3 h-3 flex-shrink-0" />
          <span className="truncate">{job.location}</span>
        </div>

        <div className="flex items-center gap-1 text-xs text-gray-600">
          <DollarSign className="w-3 h-3 flex-shrink-0" />
          <span className="truncate">{job.salary}</span>
        </div>

        <div className="flex items-center justify-between text-xs">
          <div className="flex items-center gap-1 text-gray-500">
            <Clock className="w-3 h-3" />
            <span>{job.posted}</span>
          </div>
          <div className="flex items-center gap-1 text-blue-600">
            <Users className="w-3 h-3" />
            <span>{job.applicants}</span>
          </div>
        </div>

        {/* تقييم الشركة */}
        <div className="flex items-center justify-between pt-1">
          <div className="flex items-center gap-1">
            <Star className="w-3 h-3 text-yellow-400 fill-current" />
            <span className="text-xs font-medium">{job.company_rating}</span>
          </div>
          <span className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full">
            {job.type}
          </span>
        </div>
      </div>
    </div>
  );

  // عرض الصفحة العامة مع الملخصات
  const OverviewSection = () => (
    <div className="space-y-6">
      {/* إحصائيات سريعة */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-4 text-center">
          <div className="text-2xl font-bold text-blue-600 mb-1">
            {jobListings.length}
          </div>
          <div className="text-sm text-blue-700">وظائف متاحة</div>
        </div>
        <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-4 text-center">
          <div className="text-2xl font-bold text-green-600 mb-1">
            {jobListings.filter((job) => job.featured).length}
          </div>
          <div className="text-sm text-green-700">وظائف مميزة</div>
        </div>
        <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl p-4 text-center">
          <div className="text-2xl font-bold text-purple-600 mb-1">
            {jobListings.filter((job) => job.remote).length}
          </div>
          <div className="text-sm text-purple-700">عمل عن بُعد</div>
        </div>
        <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-xl p-4 text-center">
          <div className="text-2xl font-bold text-orange-600 mb-1">
            {jobListings.filter((job) => job.urgent).length}
          </div>
          <div className="text-sm text-orange-700">وظائف عاجلة</div>
        </div>
      </div>

      {/* خريطة تفاعلية */}
      <div className="bg-white rounded-xl border">
        <div className="p-4 border-b border-gray-100">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
              <Map className="w-5 h-5" />
              خريطة العيادات والوظائف
            </h2>
            <button
              onClick={() => setShowMap(!showMap)}
              className="text-blue-600 hover:text-blue-700 text-sm font-medium"
            >
              {showMap ? "إخفاء" : "عرض"} الخريطة
            </button>
          </div>
        </div>

        {showMap && (
          <div className="p-4">
            <InteractiveJobsMap
              jobs={jobListings.map(job => ({
                ...job,
                nearbyLandmarks: [],
                requirements: job.description ? [job.description] : [],
                benefits: [],
                commute_time: "غير محدد"
              }))}
              selectedJob={selectedJob}
              onJobSelect={setSelectedJob}
              onJobApply={(jobId) => {
                const job = jobListings.find((j) => j.id === jobId);
                if (job) {
                  setSelectedJob(job);
                  setShowApplicationModal(true);
                }
              }}
            />
          </div>
        )}
      </div>

      {/* أحدث الوظائف - عرض أفقي مضغوط */}
      <div className="bg-white rounded-xl border">
        <div className="p-4 border-b border-gray-100">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-gray-900">
              أحدث الوظائف
            </h2>
            <Link
              to="#"
              onClick={() => setActiveSection("browse")}
              className="text-blue-600 hover:text-blue-700 text-sm font-medium flex items-center gap-1"
            >
              عرض الكل
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>

        <div className="p-4">
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3">
            {jobListings.slice(0, 10).map((job) => (
              <CompactJobCard key={job.id} job={job} />
            ))}
          </div>
        </div>
      </div>

      {/* نصائح سريعة */}
      <div className="grid md:grid-cols-2 gap-6">
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl p-6 text-white">
          <h3 className="text-lg font-semibold mb-3">
            نصائح للباحثين عن العمل
          </h3>
          <ul className="space-y-2 text-sm text-blue-100">
            <li>• حدث سيرتك الذاتية بانتظام</li>
            <li>• استخدم كلمات مفتاحية مناسبة</li>
            <li>• اكتب خطاب تغطية مخصص لكل وظيفة</li>
            <li>• تابع طلباتك وتواصل مع أصحاب العمل</li>
          </ul>
        </div>

        <div className="bg-gradient-to-r from-green-600 to-teal-600 rounded-xl p-6 text-white">
          <h3 className="text-lg font-semibold mb-3">لأصحاب العمل</h3>
          <ul className="space-y-2 text-sm text-green-100">
            <li>• انشر وظائفك مجاناً</li>
            <li>• ابحث عن المواهب المناسبة</li>
            <li>• استخدم أدوات الفلترة المتقدمة</li>
            <li>• تواصل مباشرة مع المرشحين</li>
          </ul>
        </div>
      </div>
    </div>
  );

  // عرض تصفح الوظائف
  const BrowseJobsSection = () => (
    <div className="space-y-4">
      {/* شريط البحث */}
      <div className="bg-white rounded-xl border p-4">
        <div className="relative">
          <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="ابحث عن وظيفة أو شركة..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pr-12 pl-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
      </div>

      {/* فلاتر أفقية */}
      <div className="bg-white rounded-xl border p-4">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-4">
            <span className="text-sm font-medium text-gray-700">الفلاتر:</span>
            <div className="flex gap-2 overflow-x-auto pb-1">
              {quickFilters.map((filter) => (
                <button
                  key={filter.id}
                  onClick={() => setActiveFilter(filter.id)}
                  className={cn(
                    "flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium whitespace-nowrap transition-colors",
                    activeFilter === filter.id
                      ? "bg-blue-500 text-white"
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
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setViewMode("grid")}
              className={cn(
                "p-2 rounded-lg transition-colors",
                viewMode === "grid"
                  ? "bg-blue-100 text-blue-600"
                  : "text-gray-400 hover:text-gray-600",
              )}
            >
              <Grid className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode("list")}
              className={cn(
                "p-2 rounded-lg transition-colors",
                viewMode === "list"
                  ? "bg-blue-100 text-blue-600"
                  : "text-gray-400 hover:text-gray-600",
              )}
            >
              <List className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* النتائج */}
      <div className="bg-white rounded-xl border p-4">
        <div className="mb-4">
          <p className="text-sm text-gray-600">
            تم العثور على{" "}
            <span className="font-semibold text-gray-900">
              {filteredJobs.length}
            </span>{" "}
            وظيفة
          </p>
        </div>

        <div
          className={cn(
            viewMode === "grid"
              ? "grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3"
              : "space-y-3",
          )}
        >
          {filteredJobs.map((job) => (
            <CompactJobCard key={job.id} job={job} />
          ))}
        </div>
      </div>
    </div>
  );

  // تحديد المحتوى حسب القسم النشط
  const renderSectionContent = () => {
    switch (activeSection) {
      case "overview":
        return <OverviewSection />;
      case "browse":
        return <BrowseJobsSection />;
      case "freelance":
        return (
          <div className="bg-white rounded-xl border p-8 text-center">
            <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Clock className="w-8 h-8 text-purple-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              قسم العمل الحر
            </h3>
            <p className="text-gray-600">
              قريباً - منصة للعمل الحر في مجال طب الأسنان
            </p>
          </div>
        );
      case "professionals":
        return (
          <div className="bg-white rounded-xl border p-8 text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Users className="w-8 h-8 text-green-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              قاعدة المحترفين
            </h3>
            <p className="text-gray-600">
              قريباً - دليل المحترفين في مجال طب الأسنان
            </p>
          </div>
        );
      case "my-jobs":
        return (
          <div className="bg-white rounded-xl border p-8 text-center">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Briefcase className="w-8 h-8 text-blue-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">طلباتي</h3>
            <p className="text-gray-600">تتبع طلبات التوظيف التي قدمتها</p>
          </div>
        );
      default:
        return <OverviewSection />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* الشريط العلوي الثابت */}
      <UnifiedNavigationHeader userRole="clinic_owner" userName="د. أحمد محمد" />

      {/* المحتوى الرئيسي */}
      <div className="pt-16 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          {/* رأس الصفحة */}
          <div className="mb-6">
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
              منصة التوظيف في طب الأسنان
            </h1>
            <p className="text-gray-600">
              اكتشف أفضل الفرص المهنية في مجال طب الأسنان
            </p>
          </div>

          {/* أقسام التوظيف الأفقية */}
          <div className="bg-white rounded-xl border mb-6 overflow-hidden">
            <div className="flex overflow-x-auto scrollbar-hide">
              {jobSections.map((section) => (
                <button
                  key={section.id}
                  onClick={() => setActiveSection(section.id)}
                  className={cn(
                    "flex items-center gap-2 px-4 py-3 text-sm font-medium whitespace-nowrap border-b-2 transition-colors min-w-max",
                    activeSection === section.id
                      ? "border-blue-500 text-blue-600 bg-blue-50"
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
          {renderSectionContent()}
        </div>
      </div>

      {/* الشريط السفلي الثابت */}
      <FixedBottomNavigation userRole="clinic_owner" notificationCount={3} />
    </div>
  );
}
