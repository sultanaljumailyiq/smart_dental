import React, { useState } from "react";
import { Link } from "react-router-dom";
import {
  Search,
  Filter,
  Star,
  Users,
  Award,
  MapPin,
  Calendar,
  MessageCircle,
  ThumbsUp,
  BookOpen,
  Verified,
  Eye,
  Heart,
  Share2,
  UserPlus,
  Grid3X3,
  List,
  TrendingUp,
  Clock,
  Briefcase,
  GraduationCap,
  Phone,
  Mail,
  Globe,
  ChevronRight,
  Badge,
  Target,
  Stethoscope,
  Brain,
  Microscope,
  Video,
  FileText,
  PenTool,
  Lightbulb,
  Zap,
  Flame,
  Camera,
  Podcast,
  Rss,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useI18n } from "@/lib/i18n";
import { useIsMobile } from "@/hooks/use-mobile";
import UnifiedHeader from "@/components/UnifiedHeader";

// Mock data for content creators (previously experts)
const contentCreators = [
  {
    id: 1,
    name: "د. سارة الأحمد",
    title: "صانعة محتوى طبي متخصصة في جرا��ة الفم والفكين",
    bio: "خبيرة في ��نتاج محتوى طبي تعليمي عالي الجودة. متخصصة في تبسيط المواضيع المعقدة ونشر المعرفة الطبية.",
    avatar:
      "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=150&h=150&fit=crop&crop=face",
    coverImage:
      "https://images.unsplash.com/photo-1576091160399-112ba8d25d1f?w=800&h=200&fit=crop",
    specializations: ["جراحة الفم والفكين", "زراعة الأسنان", "التعليم الطبي"],
    location: "بغد��د، العراق",
    workplace: "مستشفى بغداد التخصصي",
    experience: "15+ سنة",
    education: "دكتوراه في طب الأسنان - جامعة بغداد",
    languages: ["العربية", "الإنجليزية", "الفرنسية"],
    verified: true,
    premium: true,
    followers: 25430,
    following: 1250,
    posts: 345,
    articles: 89,
    videos: 67,
    podcasts: 23,
    totalViews: "2.1M",
    monthlyViews: "145K",
    rating: 4.9,
    reviewsCount: 234,
    contentTypes: ["مقالات علمية", "فيديوهات تعليمية", "بودكاست", "إنفوجرافيك"],
    achievements: [
      "أفضل صانع محتوى طبي 2023",
      "عضو ال��معية العالمية لتعليم طب الأسنان",
      "مؤلف 50+ مقال علمي محكم",
    ],
    recentContent: [
      {
        type: "article",
        title: "دليل شامل لزراعة الأسنان: كل ما تحتاج معرفته",
        date: "منذ يومين",
        views: 15600,
        likes: 234,
        comments: 45,
        category: "تعليمي",
      },
      {
        type: "video",
        title: "تقنيات حديثة في جراحة الفم - شرح عملي",
        date: "منذ 4 أيام",
        views: 8900,
        likes: 167,
        comments: 32,
        duration: "15:30",
      },
      {
        type: "podcast",
        title: "مناقشة: مستقبل طب الأسنان الرقمي",
        date: "منذ أسبوع",
        views: 3400,
        likes: 89,
        comments: 23,
        duration: "45:12",
      },
    ],
    tags: ["جراحة", "زراعة", "تعليم", "محتوى علمي"],
    featured: true,
    trending: true,
    contentRating: 4.8,
    collaborations: 12,
    sources: [
      "PubMed",
      "مجلة طب الأسنان العربية",
      "الجمعية الأمريكية لطب الأسنان",
    ],
  },
  {
    id: 2,
    name: "د. محمد العراقي",
    title: "من��ئ محتوى متخصص في علاج العصب والطب التحفظي",
    bio: "خبير في إنتاج محتوى تعليمي حول علاج جذور الأسنان والتقنيات الحديثة. يهدف لنشر المعرفة وتبادل الخبرات.",
    avatar:
      "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=150&h=150&fit=crop&crop=face",
    coverImage:
      "https://images.unsplash.com/photo-1609840114035-3c981b782dfe?w=800&h=200&fit=crop",
    specializations: ["علاج العصب", "طب الأسنان التحفظي", "التعليم الطبي"],
    location: "البصرة، العراق",
    workplace: "مجمع الأسنان المتقدم",
    experience: "12+ سنة",
    education: "ما��ستير في علاج العصب - جامعة البصرة",
    languages: ["العربي��", "الإنجليزية"],
    verified: true,
    premium: false,
    followers: 18920,
    following: 890,
    posts: 278,
    articles: 156,
    videos: 45,
    podcasts: 8,
    totalViews: "1.3M",
    monthlyViews: "89K",
    rating: 4.7,
    reviewsCount: 167,
    contentTypes: ["مقالات تقنية", "دراسات حالة", "فيديوهات قصيرة"],
    achievements: [
      "خبير معتمد في علاج العصب",
      "محاضر في 3 جامعات عراقية",
      "باحث في التقنيات الحديثة",
    ],
    recentContent: [
      {
        type: "article",
        title: "علاج العصب بدون ألم: التقنيات والأساليب الحديثة",
        date: "منذ 3 أيام",
        views: 9800,
        likes: 178,
        comments: 34,
        category: "تقني",
      },
      {
        type: "case-study",
        title: "حالة معقدة: علاج عصب ضرس العقل المدفون",
        date: "منذ أسبوع",
        views: 5600,
        likes: 123,
        comments: 28,
        category: "دراسة حالة",
      },
    ],
    tags: ["علاج العصب", "تقنيات حديثة", "دراسات حالة"],
    featured: false,
    trending: true,
    contentRating: 4.6,
    collaborations: 8,
    sources: ["Journal of Endodontics", "مجلة علاج العصب العربية"],
  },
  {
    id: 3,
    name: "د. فاطمة حسن",
    title: "خبيرة محتوى في طب أسنان الأطفال والوقاية",
    bio: "متخصصة في إنتاج محتوى تعليمي للأمهات وأطباء أسنان الأطفال. تركز على الوقاية والتعليم المبكر.",
    avatar:
      "https://images.unsplash.com/photo-1594824475386-67eb4d8b5f59?w=150&h=150&fit=crop&crop=face",
    coverImage:
      "https://images.unsplash.com/photo-1606811841689-23dfddce3e95?w=800&h=200&fit=crop",
    specializations: ["طب أسنان الأطفال", "الوقاية", "التثقيف الصحي"],
    location: "النجف، العراق",
    workplace: "مركز الأطفال للأسنان",
    experience: "10+ سنوات",
    education: "دبلوم عالي في طب أسنان الأطفال",
    languages: ["العربية", "الإنجليزية"],
    verified: true,
    premium: true,
    followers: 34560,
    following: 567,
    posts: 456,
    articles: 234,
    videos: 89,
    podcasts: 15,
    totalViews: "3.2M",
    monthlyViews: "278K",
    rating: 4.9,
    reviewsCount: 445,
    contentTypes: ["مقالات للأمهات", "فيديوهات تفاعلية", "نصائ�� يومية"],
    achievements: [
      "أفضل محتوى تعليمي للأطفال 2023",
      "خبير معتمد من منظمة الصحة العالمية",
      "مؤلف كتاب أسنان الأطفال",
    ],
    recentContent: [
      {
        type: "article",
        title: "كيف تحمي أسنان طفلك: دليل شامل للأمهات",
        date: "منذ يوم",
        views: 23400,
        likes: 567,
        comments: 89,
        category: "وقاية",
      },
      {
        type: "video",
        title: "أول زيارة لطفلك لطبيب الأسنان",
        date: "منذ 3 أيام",
        views: 18900,
        likes: 423,
        comments: 78,
        duration: "12:45",
      },
    ],
    tags: ["أطفال", "وقاية", "تثقيف", "أمهات"],
    featured: true,
    trending: false,
    contentRating: 4.9,
    collaborations: 15,
    sources: ["AAPD", "مجلة طب أسنان الأطفال", "منظمة الصحة العالمية"],
  },
];

// Content categories for filtering
const contentCategories = [
  {
    id: "all",
    label: "جميع التخصصات",
    icon: Grid3X3,
    count: contentCreators.length,
  },
  { id: "surgery", label: "جراحة الفم والفكين", icon: Stethoscope, count: 5 },
  { id: "endodontics", label: "علاج العصب", icon: Target, count: 8 },
  { id: "pediatric", label: "طب أسنان الأطفال", icon: Heart, count: 12 },
  { id: "orthodontics", label: "تقويم الأسنان", icon: Zap, count: 6 },
  { id: "prevention", label: "الوقاية والتثقيف", icon: Award, count: 15 },
];

// Content types for filtering
const contentTypes = [
  { id: "articles", label: "المقالات", icon: FileText },
  { id: "videos", label: "الفيديوهات", icon: Video },
  { id: "podcasts", label: "البودكاست", icon: Podcast },
  { id: "case-studies", label: "دراسا�� الحالة", icon: Microscope },
  { id: "infographics", label: "الإنفوجرافيك", icon: PenTool },
];

export default function CommunityExperts() {
  const { language } = useI18n();
  const isMobile = useIsMobile();
  const [selectedSpecialization, setSelectedSpecialization] = useState("all");
  const [selectedContentType, setSelectedContentType] = useState("all");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("popularity");

  const filteredCreators = contentCreators.filter((creator) => {
    const matchesSearch =
      searchQuery === "" ||
      creator.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      creator.specializations.some((spec) => spec.includes(searchQuery)) ||
      creator.contentTypes.some((type) => type.includes(searchQuery));

    const matchesSpecialization =
      selectedSpecialization === "all" ||
      creator.specializations.some((spec) => {
        switch (selectedSpecialization) {
          case "surgery":
            return spec.includes("جراحة");
          case "endodontics":
            return spec.includes("علاج العصب");
          case "pediatric":
            return spec.includes("أطفال");
          case "orthodontics":
            return spec.includes("تقويم");
          case "prevention":
            return spec.includes("وقاية") || spec.includes("تثقيف");
          default:
            return true;
        }
      });

    return matchesSearch && matchesSpecialization;
  });

  const ContentCreatorCard = ({ creator }: { creator: any }) => (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 hover:shadow-lg transition-all duration-300 overflow-hidden">
      {/* Cover Image */}
      <div className="relative h-32 sm:h-40 bg-gradient-to-r from-blue-500 to-purple-600">
        <img
          src={creator.coverImage}
          alt={creator.name}
          className="w-full h-full object-cover opacity-80"
        />
        <div className="absolute top-3 right-3 flex gap-2">
          {creator.premium && (
            <div className="bg-yellow-500 text-white px-2 py-1 rounded-full text-xs font-medium flex items-center gap-1">
              <Badge className="w-3 h-3" />
              مميز
            </div>
          )}
          {creator.trending && (
            <div className="bg-red-500 text-white px-2 py-1 rounded-full text-xs font-medium flex items-center gap-1">
              <Flame className="w-3 h-3" />
              الأكثر مشاهدة
            </div>
          )}
        </div>
      </div>

      {/* Profile Section */}
      <div className="relative px-4 sm:px-6 pb-6">
        {/* Avatar */}
        <div className="flex items-start gap-4 -mt-8 mb-4">
          <div className="relative">
            <img
              src={creator.avatar}
              alt={creator.name}
              className="w-16 h-16 sm:w-20 sm:h-20 rounded-xl object-cover border-4 border-white shadow-lg"
            />
            {creator.verified && (
              <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
                <Verified className="w-4 h-4 text-white fill-current" />
              </div>
            )}
          </div>

          <div className="flex-1 pt-8">
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-bold text-lg text-gray-900">
                {creator.name}
              </h3>
              <div className="flex items-center gap-1">
                <Star className="w-4 h-4 text-yellow-500 fill-current" />
                <span className="text-sm font-medium">
                  {creator.contentRating}
                </span>
              </div>
            </div>
            <p className="text-sm text-gray-600 mb-1">{creator.title}</p>
            <div className="flex items-center gap-2 text-xs text-gray-500">
              <MapPin className="w-3 h-3" />
              {creator.location}
            </div>
          </div>
        </div>

        {/* Bio */}
        <p className="text-sm text-gray-700 mb-4 line-clamp-2">{creator.bio}</p>

        {/* Specializations */}
        <div className="flex flex-wrap gap-1 mb-4">
          {creator.specializations
            .slice(0, 3)
            .map((spec: string, index: number) => (
              <span
                key={index}
                className="bg-blue-50 text-blue-700 px-2 py-1 rounded-full text-xs font-medium"
              >
                {spec}
              </span>
            ))}
          {creator.specializations.length > 3 && (
            <span className="text-xs text-gray-500">
              +{creator.specializations.length - 3}
            </span>
          )}
        </div>

        {/* Stats */}
        <div className="grid grid-cols-4 gap-3 mb-4 text-center">
          <div>
            <div className="text-sm font-bold text-gray-900">
              {creator.followers.toLocaleString()}
            </div>
            <div className="text-xs text-gray-600">متابع</div>
          </div>
          <div>
            <div className="text-sm font-bold text-gray-900">
              {creator.articles}
            </div>
            <div className="text-xs text-gray-600">مقال</div>
          </div>
          <div>
            <div className="text-sm font-bold text-gray-900">
              {creator.videos}
            </div>
            <div className="text-xs text-gray-600">فيديو</div>
          </div>
          <div>
            <div className="text-sm font-bold text-gray-900">
              {creator.monthlyViews}
            </div>
            <div className="text-xs text-gray-600">مشاهدة/شهر</div>
          </div>
        </div>

        {/* Content Types */}
        <div className="flex flex-wrap gap-2 mb-4">
          {creator.contentTypes.map((type: string, index: number) => (
            <div
              key={index}
              className="flex items-center gap-1 bg-gray-100 px-2 py-1 rounded-full text-xs"
            >
              {type.includes("مقالات") && <FileText className="w-3 h-3" />}
              {type.includes("فيديو") && <Video className="w-3 h-3" />}
              {type.includes("بودكاست") && <Podcast className="w-3 h-3" />}
              {type.includes("إنفوجرافيك") && <PenTool className="w-3 h-3" />}
              <span>{type}</span>
            </div>
          ))}
        </div>

        {/* Recent Content Preview */}
        <div className="border-t pt-4 mb-4">
          <h4 className="text-sm font-semibold text-gray-900 mb-2">
            أحدث المحتوى
          </h4>
          <div className="space-y-2">
            {creator.recentContent
              .slice(0, 2)
              .map((content: any, index: number) => (
                <div key={index} className="flex items-center gap-2 text-xs">
                  {content.type === "article" && (
                    <FileText className="w-3 h-3 text-blue-600" />
                  )}
                  {content.type === "video" && (
                    <Video className="w-3 h-3 text-red-600" />
                  )}
                  {content.type === "podcast" && (
                    <Podcast className="w-3 h-3 text-purple-600" />
                  )}
                  <span className="flex-1 text-gray-700 line-clamp-1">
                    {content.title}
                  </span>
                  <span className="text-gray-500">
                    {content.views.toLocaleString()} مشاهدة
                  </span>
                </div>
              ))}
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-2">
          <button className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors">
            متابعة
          </button>
          <button className="flex-1 bg-gray-100 text-gray-700 py-2 px-4 rounded-lg text-sm font-medium hover:bg-gray-200 transition-colors">
            عرض المحتوى
          </button>
          <button className="p-2 text-gray-400 hover:text-red-500 border border-gray-300 rounded-lg hover:border-red-300 transition-colors">
            <Heart className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );

  const ContentCreatorListItem = ({ creator }: { creator: any }) => (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 hover:shadow-lg transition-all duration-300 p-4 sm:p-6">
      <div className="flex items-start gap-4">
        <div className="relative flex-shrink-0">
          <img
            src={creator.avatar}
            alt={creator.name}
            className="w-16 h-16 sm:w-20 sm:h-20 rounded-xl object-cover"
          />
          {creator.verified && (
            <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center">
              <Verified className="w-3 h-3 text-white fill-current" />
            </div>
          )}
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between mb-2">
            <div>
              <h3 className="font-bold text-lg text-gray-900 mb-1">
                {creator.name}
              </h3>
              <p className="text-sm text-gray-600 mb-2">{creator.title}</p>
              <div className="flex items-center gap-4 text-xs text-gray-500 mb-2">
                <div className="flex items-center gap-1">
                  <MapPin className="w-3 h-3" />
                  {creator.location}
                </div>
                <div className="flex items-center gap-1">
                  <Users className="w-3 h-3" />
                  {creator.followers.toLocaleString()} متابع
                </div>
                <div className="flex items-center gap-1">
                  <Star className="w-3 h-3 text-yellow-500 fill-current" />
                  {creator.contentRating}
                </div>
              </div>
            </div>
            <div className="flex gap-2">
              {creator.premium && <Badge className="w-5 h-5 text-yellow-500" />}
              {creator.trending && (
                <TrendingUp className="w-5 h-5 text-red-500" />
              )}
            </div>
          </div>

          <p className="text-sm text-gray-700 mb-3 line-clamp-2">
            {creator.bio}
          </p>

          <div className="flex flex-wrap gap-1 mb-3">
            {creator.specializations.map((spec: string, index: number) => (
              <span
                key={index}
                className="bg-blue-50 text-blue-700 px-2 py-1 rounded-full text-xs font-medium"
              >
                {spec}
              </span>
            ))}
          </div>

          <div className="grid grid-cols-4 sm:grid-cols-6 gap-2 text-center mb-4">
            <div>
              <div className="text-sm font-bold text-gray-900">
                {creator.articles}
              </div>
              <div className="text-xs text-gray-600">مقال</div>
            </div>
            <div>
              <div className="text-sm font-bold text-gray-900">
                {creator.videos}
              </div>
              <div className="text-xs text-gray-600">فيديو</div>
            </div>
            <div>
              <div className="text-sm font-bold text-gray-900">
                {creator.podcasts}
              </div>
              <div className="text-xs text-gray-600">بودكاست</div>
            </div>
            <div>
              <div className="text-sm font-bold text-gray-900">
                {creator.totalViews}
              </div>
              <div className="text-xs text-gray-600">إجمالي مشاهدات</div>
            </div>
            <div className="hidden sm:block">
              <div className="text-sm font-bold text-gray-900">
                {creator.collaborations}
              </div>
              <div className="text-xs text-gray-600">تعاون</div>
            </div>
            <div className="hidden sm:block">
              <div className="text-sm font-bold text-gray-900">
                {creator.sources.length}
              </div>
              <div className="text-xs text-gray-600">مصدر</div>
            </div>
          </div>

          <div className="flex gap-2">
            <button className="bg-blue-600 text-white py-2 px-4 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors">
              متابعة
            </button>
            <button className="bg-gray-100 text-gray-700 py-2 px-4 rounded-lg text-sm font-medium hover:bg-gray-200 transition-colors">
              عرض المحتوى
            </button>
            <button className="p-2 text-gray-400 hover:text-red-500 border border-gray-300 rounded-lg hover:border-red-300 transition-colors">
              <Heart className="w-4 h-4" />
            </button>
            <button className="p-2 text-gray-400 hover:text-blue-500 border border-gray-300 rounded-lg hover:border-blue-300 transition-colors">
              <Share2 className="w-4 h-4" />
            </button>
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
      <UnifiedHeader />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pt-20">
        {/* Page Header */}
        <div className="bg-white rounded-xl shadow-sm p-6 mb-8">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              صناع المحتوى الطبي
            </h1>
            <p className="text-gray-600 max-w-2xl mx-auto">
              ��كتشف أفضل منشئي المحتوى الطبي في مجال طب الأسنان. تابع خبراء
              متخصصين ينشرون محتوى تعليمي وعلمي عالي الجودة
            </p>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">
                {contentCreators.length}
              </div>
              <div className="text-sm text-gray-600">صانع محتوى</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">1,250+</div>
              <div className="text-sm text-gray-600">مقال علمي</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">450+</div>
              <div className="text-sm text-gray-600">فيديو تعليمي</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-orange-600">7.8M</div>
              <div className="text-sm text-gray-600">مشاهدة شهرية</div>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="space-y-6">
              {/* Search */}
              <div className="bg-white rounded-xl shadow-sm p-4">
                <div className="relative">
                  <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    placeholder="ابحث عن صناع المحتوى..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pr-10 pl-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>

              {/* Content Categories */}
              <div className="bg-white rounded-xl shadow-sm overflow-hidden">
                <div className="p-4 border-b border-gray-200">
                  <h3 className="font-semibold text-gray-900 flex items-center gap-2">
                    <Filter className="w-4 h-4" />
                    التخصصات
                  </h3>
                </div>
                <div className="p-2">
                  {contentCategories.map((category) => (
                    <button
                      key={category.id}
                      onClick={() => setSelectedSpecialization(category.id)}
                      className={cn(
                        "w-full flex items-center justify-between px-3 py-2 text-sm font-medium rounded-lg transition-colors",
                        selectedSpecialization === category.id
                          ? "bg-blue-50 text-blue-700"
                          : "text-gray-700 hover:bg-gray-50",
                      )}
                    >
                      <div className="flex items-center gap-2">
                        <category.icon className="w-4 h-4" />
                        {category.label}
                      </div>
                      <span className="text-xs bg-gray-100 px-2 py-1 rounded-full">
                        {category.count}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Content Types */}
              <div className="bg-white rounded-xl shadow-sm overflow-hidden">
                <div className="p-4 border-b border-gray-200">
                  <h3 className="font-semibold text-gray-900">أنواع المحتوى</h3>
                </div>
                <div className="p-2">
                  {contentTypes.map((type) => (
                    <button
                      key={type.id}
                      onClick={() => setSelectedContentType(type.id)}
                      className={cn(
                        "w-full flex items-center gap-2 px-3 py-2 text-sm font-medium rounded-lg transition-colors",
                        selectedContentType === type.id
                          ? "bg-blue-50 text-blue-700"
                          : "text-gray-700 hover:bg-gray-50",
                      )}
                    >
                      <type.icon className="w-4 h-4" />
                      {type.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Top Content */}
              <div className="bg-white rounded-xl shadow-sm p-4">
                <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <TrendingUp className="w-4 h-4" />
                  المحتوى ال��كثر مشاهدة
                </h3>
                <div className="space-y-3">
                  {contentCreators.slice(0, 3).map((creator, index) => (
                    <div key={creator.id} className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-sm">
                        {index + 1}
                      </div>
                      <img
                        src={creator.avatar}
                        alt={creator.name}
                        className="w-10 h-10 rounded-full object-cover"
                      />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 truncate">
                          {creator.name}
                        </p>
                        <p className="text-xs text-gray-500">
                          {creator.monthlyViews} مشاهدة/شهر
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            {/* Controls */}
            <div className="bg-white rounded-xl shadow-sm p-4 mb-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <span className="text-sm text-gray-600">
                    {filteredCreators.length} صانع محتوى
                  </span>
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="text-sm border border-gray-200 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="popularity">الأكثر شعبية</option>
                    <option value="newest">الأحدث</option>
                    <option value="rating">الأعلى تقييماً</option>
                    <option value="followers">الأكثر متابعة</option>
                  </select>
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
                    <Grid3X3 className="w-4 h-4" />
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

            {/* Content Creators Grid/List */}
            {viewMode === "grid" ? (
              <div className="grid md:grid-cols-2 gap-6">
                {filteredCreators.map((creator) => (
                  <ContentCreatorCard key={creator.id} creator={creator} />
                ))}
              </div>
            ) : (
              <div className="space-y-4">
                {filteredCreators.map((creator) => (
                  <ContentCreatorListItem key={creator.id} creator={creator} />
                ))}
              </div>
            )}

            {filteredCreators.length === 0 && (
              <div className="text-center py-12">
                <Brain className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  لم يتم العثور على صناع محتوى
                </h3>
                <p className="text-gray-600">
                  جرب تغيير معايير البحث أو الفلترة
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

    </div>
  );
}
