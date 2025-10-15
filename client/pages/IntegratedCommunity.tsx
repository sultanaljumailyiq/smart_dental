import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  MessageCircle,
  Users,
  Calendar,
  BookOpen,
  Heart,
  Share2,
  MessageSquare,
  Eye,
  ThumbsUp,
  Star,
  Award,
  Zap,
  TrendingUp,
  Clock,
  MapPin,
  Phone,
  Video,
  FileText,
  Camera,
  Mic,
  Send,
  Filter,
  Search,
  Plus,
  Globe,
  Lock,
  UserPlus,
  Bell,
  Bookmark,
  MoreHorizontal,
  CheckCircle,
  AlertCircle,
  Info,
  Play,
  Download,
  ExternalLink,
} from "lucide-react";
import { cn } from "@/lib/utils";
import OptimizedUnifiedHeader from "@/components/OptimizedUnifiedHeader";

// Types
interface Post {
  id: string;
  author: {
    name: string;
    title: string;
    avatar: string;
    verified: boolean;
    specialization: string;
  };
  content: string;
  images?: string[];
  video?: string;
  timestamp: string;
  likes: number;
  comments: number;
  shares: number;
  isLiked: boolean;
  isBookmarked: boolean;
  category:
    | "discussion"
    | "case-study"
    | "question"
    | "announcement"
    | "education";
  tags: string[];
}

interface CommunityGroup {
  id: string;
  name: string;
  description: string;
  members: number;
  image: string;
  category: string;
  isJoined: boolean;
  privacy: "public" | "private";
  activity: "high" | "medium" | "low";
}

interface Event {
  id: string;
  title: string;
  description: string;
  date: string;
  time: string;
  location: string;
  type: "webinar" | "workshop" | "conference" | "networking";
  organizer: string;
  attendees: number;
  maxAttendees?: number;
  price?: string;
  image: string;
  isRegistered: boolean;
}

interface Expert {
  id: string;
  name: string;
  title: string;
  specialization: string;
  avatar: string;
  rating: number;
  consultations: number;
  experience: string;
  verified: boolean;
  isOnline: boolean;
}

export default function IntegratedCommunity() {
  const [activeTab, setActiveTab] = useState<
    "feed" | "groups" | "events" | "experts"
  >("feed");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [newPost, setNewPost] = useState("");
  const [showNewPostModal, setShowNewPostModal] = useState(false);

  // Mock data
  const posts: Post[] = [
    {
      id: "1",
      author: {
        name: "د. أحمد العراقي",
        title: "استشاري طب الأسنان",
        avatar:
          "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=100&h=100&fit=crop&crop=face",
        verified: true,
        specialization: "جراحة الفم والأسنان",
      },
      content:
        "ما رأيكم في استخدام تقنية الليزر الجديدة في علاج اللثة؟ لاحظت نتائج ممتازة مع مرضاي خلال الشهر الماضي. هل لديكم تجارب مشابهة؟",
      images: [
        "https://images.unsplash.com/photo-1606811841689-23dfddce3e95?w=500&h=300&fit=crop",
      ],
      timestamp: "منذ ساعتين",
      likes: 24,
      comments: 8,
      shares: 3,
      isLiked: false,
      isBookmarked: true,
      category: "discussion",
      tags: ["ليزر", "جراحة", "تقنيات حديثة"],
    },
    {
      id: "2",
      author: {
        name: "د. فاطمة محمد",
        title: "أخصائية تقويم الأسنان",
        avatar:
          "https://images.unsplash.com/photo-1594824804732-ca8db6bf5b7d?w=100&h=100&fit=crop&crop=face",
        verified: true,
        specialization: "تقويم الأسنان",
      },
      content:
        "حالة معقدة لمريض عمره 16 سنة مع تشوهات فكية شديدة. استغرق العلاج 18 شهر وهذه النتيجة النهائية. الحمد لله النتائج ممتازة!",
      images: [
        "https://images.unsplash.com/photo-1588776814546-1ffcf47267a5?w=500&h=300&fit=crop",
        "https://images.unsplash.com/photo-1582750433449-648ed127bb54?w=500&h=300&fit=crop",
      ],
      timestamp: "منذ 4 ساعات",
      likes: 156,
      comments: 23,
      shares: 12,
      isLiked: true,
      isBookmarked: false,
      category: "case-study",
      tags: ["تقويم", "حالة نادرة", "نتائج ممتازة"],
    },
    {
      id: "3",
      author: {
        name: "د. محمد السعيد",
        title: "طبيب أسنان عام",
        avatar:
          "https://images.unsplash.com/photo-1582750433449-648ed127bb54?w=100&h=100&fit=crop&crop=face",
        verified: false,
        specialization: "طب الأسنان العام",
      },
      content:
        "سؤال للزملاء: ما هو أفضل مادة حشو للأسنان الخلفية؟ أتردد بين الكومبوزيت والأما��جام. أريد آراءكم بناءً على خبرتكم.",
      timestamp: "منذ 6 ساعات",
      likes: 12,
      comments: 15,
      shares: 2,
      isLiked: false,
      isBookmarked: false,
      category: "question",
      tags: ["حشوات", "مواد طبية", "استشارة"],
    },
  ];

  const communityGroups: CommunityGroup[] = [
    {
      id: "1",
      name: "جراحو الفم والأسنان",
      description:
        "مجتمع متخصص لجراحي الفم والأسنان لتبادل الخبرات والحالات المعقدة",
      members: 2847,
      image:
        "https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=300&h=200&fit=crop",
      category: "تخصصي",
      isJoined: true,
      privacy: "private",
      activity: "high",
    },
    {
      id: "2",
      name: "تقويم الأسنان المتقدم",
      description: "كل ما يخص تقنيات تقويم الأسنان الحديثة والحالات المعقدة",
      members: 1923,
      image:
        "https://images.unsplash.com/photo-1588776814546-1ffcf47267a5?w=300&h=200&fit=crop",
      category: "تخصصي",
      isJoined: false,
      privacy: "public",
      activity: "high",
    },
    {
      id: "3",
      name: "أطباء الأسنان الجدد",
      description: "مجتمع داعم للأطباء الجدد لتبادل التجارب والنصائح",
      members: 892,
      image:
        "https://images.unsplash.com/photo-1551601651-2a8555f1a136?w=300&h=200&fit=crop",
      category: "عام",
      isJoined: true,
      privacy: "public",
      activity: "medium",
    },
  ];

  const events: Event[] = [
    {
      id: "1",
      title: "ورشة الليزر في طب الأسنان",
      description:
        "ورشة تدريبية شاملة حول استخدام الليزر في علاجات الأسنان المختلفة",
      date: "2024-02-15",
      time: "09:00 - 17:00",
      location: "مركز الرياض للمؤتمرات",
      type: "workshop",
      organizer: "الجمعية السعودية لطب الأسنان",
      attendees: 156,
      maxAttendees: 200,
      price: "500 ر.س",
      image:
        "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=400&h=250&fit=crop",
      isRegistered: false,
    },
    {
      id: "2",
      title: "ندوة الذكاء الاصطناعي في التشخيص",
      description:
        "ندوة علمية حول دور الذكاء الاصطناعي في تشخيص أمراض الفم والأس��ان",
      date: "2024-02-20",
      time: "19:00 - 21:00",
      location: "عبر الإنترنت",
      type: "webinar",
      organizer: "د. أحمد العراقي",
      attendees: 423,
      price: "مجاني",
      image:
        "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=250&fit=crop",
      isRegistered: true,
    },
  ];

  const experts: Expert[] = [
    {
      id: "1",
      name: "د. سارة الأحمد",
      title: "استشارية تجميل الأسنان",
      specialization: "تجميل وتبييض الأسنان",
      avatar:
        "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=100&h=100&fit=crop&crop=face",
      rating: 4.9,
      consultations: 1247,
      experience: "15 سنة خبرة",
      verified: true,
      isOnline: true,
    },
    {
      id: "2",
      name: "د. خالد المطيري",
      title: "استشاري زراعة الأسنان",
      specialization: "زراعة وتركيبات الأسنان",
      avatar:
        "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=100&h=100&fit=crop&crop=face",
      rating: 4.8,
      consultations: 892,
      experience: "12 سنة خبرة",
      verified: true,
      isOnline: false,
    },
  ];

  const categories = [
    { key: "all", label: "الكل", icon: Globe },
    { key: "discussion", label: "نقاشات", icon: MessageCircle },
    { key: "case-study", label: "حالات دراسية", icon: FileText },
    { key: "question", label: "أسئلة", icon: Info },
    { key: "education", label: "تعليمي", icon: BookOpen },
    { key: "announcement", label: "إعلانات", icon: Bell },
  ];

  // Render post component
  const renderPost = (post: Post) => (
    <div
      key={post.id}
      className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-4"
    >
      {/* Post Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <img
            src={post.author.avatar}
            alt={post.author.name}
            className="w-12 h-12 rounded-full border-2 border-white shadow-md"
          />
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-bold text-gray-900">{post.author.name}</h3>
              {post.author.verified && (
                <CheckCircle className="w-4 h-4 text-blue-500" />
              )}
            </div>
            <p className="text-sm text-gray-600">{post.author.title}</p>
            <p className="text-xs text-gray-500">{post.timestamp}</p>
          </div>
        </div>
        <button className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg">
          <MoreHorizontal className="w-5 h-5" />
        </button>
      </div>

      {/* Post Content */}
      <div className="mb-4">
        <p className="text-gray-800 leading-relaxed mb-3">{post.content}</p>

        {/* Tags */}
        <div className="flex flex-wrap gap-2 mb-3">
          {post.tags.map((tag, index) => (
            <span
              key={index}
              className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded-full"
            >
              #{tag}
            </span>
          ))}
        </div>

        {/* Images */}
        {post.images && (
          <div
            className={cn(
              "grid gap-2 rounded-lg overflow-hidden",
              post.images.length === 1 ? "grid-cols-1" : "grid-cols-2",
            )}
          >
            {post.images.map((image, index) => (
              <img
                key={index}
                src={image}
                alt=""
                className="w-full h-64 object-cover hover:scale-105 transition-transform cursor-pointer"
              />
            ))}
          </div>
        )}
      </div>

      {/* Post Actions */}
      <div className="flex items-center justify-between pt-4 border-t border-gray-100">
        <div className="flex items-center gap-6">
          <button
            className={cn(
              "flex items-center gap-2 px-3 py-1.5 rounded-lg transition-colors",
              post.isLiked
                ? "text-red-600 bg-red-50"
                : "text-gray-600 hover:text-red-600 hover:bg-red-50",
            )}
          >
            <Heart className={cn("w-4 h-4", post.isLiked && "fill-current")} />
            <span className="text-sm font-medium">{post.likes}</span>
          </button>

          <button className="flex items-center gap-2 px-3 py-1.5 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
            <MessageSquare className="w-4 h-4" />
            <span className="text-sm font-medium">{post.comments}</span>
          </button>

          <button className="flex items-center gap-2 px-3 py-1.5 text-gray-600 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors">
            <Share2 className="w-4 h-4" />
            <span className="text-sm font-medium">{post.shares}</span>
          </button>
        </div>

        <button
          className={cn(
            "p-2 rounded-lg transition-colors",
            post.isBookmarked
              ? "text-yellow-600 bg-yellow-50"
              : "text-gray-400 hover:text-yellow-600 hover:bg-yellow-50",
          )}
        >
          <Bookmark
            className={cn("w-4 h-4", post.isBookmarked && "fill-current")}
          />
        </button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <OptimizedUnifiedHeader />

      <div className="pt-20 pb-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Hero Section */}
          <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 rounded-2xl text-white p-8 mb-8">
            <div className="text-center">
              <h1 className="text-3xl font-bold mb-4">مجتمع أطباء الأسنان</h1>
              <p className="text-blue-100 text-lg mb-6">
                تواصل، تعلم، وشارك خبراتك مع أكثر من 15,000 طبيب أسنان
              </p>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center">
                  <div className="text-2xl font-bold">15,247</div>
                  <div className="text-blue-200 text-sm">طبيب مسجل</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold">8,934</div>
                  <div className="text-blue-200 text-sm">منشور</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold">156</div>
                  <div className="text-blue-200 text-sm">مجموعة</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold">42</div>
                  <div className="text-blue-200 text-sm">فعالية شهرية</div>
                </div>
              </div>
            </div>
          </div>

          {/* Main Navigation Tabs */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 mb-6 overflow-hidden">
            <div className="flex">
              {[
                { key: "feed", label: "التغذية الرئيسية", icon: MessageCircle },
                { key: "groups", label: "المجموعات", icon: Users },
                { key: "events", label: "الفعاليات", icon: Calendar },
                { key: "experts", label: "الخبراء", icon: Award },
              ].map((tab) => (
                <button
                  key={tab.key}
                  onClick={() => setActiveTab(tab.key as any)}
                  className={cn(
                    "flex-1 flex items-center justify-center gap-2 py-4 px-6 transition-colors",
                    activeTab === tab.key
                      ? "bg-blue-50 text-blue-700 border-b-2 border-blue-600"
                      : "text-gray-600 hover:text-gray-900 hover:bg-gray-50",
                  )}
                >
                  <tab.icon className="w-5 h-5" />
                  <span className="font-medium hidden sm:block">
                    {tab.label}
                  </span>
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            {/* Sidebar */}
            <div className="lg:col-span-1">
              <div className="space-y-6">
                {/* Quick Actions */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                  <h3 className="text-lg font-bold text-gray-900 mb-4">
                    إجراءات سريعة
                  </h3>
                  <div className="space-y-3">
                    <button
                      onClick={() => setShowNewPostModal(true)}
                      className="w-full flex items-center gap-3 p-3 bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100 transition-colors"
                    >
                      <Plus className="w-5 h-5" />
                      <span className="font-medium">منشور جديد</span>
                    </button>
                    <Link
                      to="/community/create-event"
                      className="w-full flex items-center gap-3 p-3 bg-green-50 text-green-700 rounded-lg hover:bg-green-100 transition-colors"
                    >
                      <Calendar className="w-5 h-5" />
                      <span className="font-medium">إنشاء فعالية</span>
                    </Link>
                    <Link
                      to="/community/join-groups"
                      className="w-full flex items-center gap-3 p-3 bg-purple-50 text-purple-700 rounded-lg hover:bg-purple-100 transition-colors"
                    >
                      <UserPlus className="w-5 h-5" />
                      <span className="font-medium">انضم لمجموعة</span>
                    </Link>
                  </div>
                </div>

                {/* Categories Filter */}
                {activeTab === "feed" && (
                  <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                    <h3 className="text-lg font-bold text-gray-900 mb-4">
                      التصنيفات
                    </h3>
                    <div className="space-y-2">
                      {categories.map((category) => (
                        <button
                          key={category.key}
                          onClick={() => setSelectedCategory(category.key)}
                          className={cn(
                            "w-full flex items-center gap-3 p-2 rounded-lg transition-colors text-right",
                            selectedCategory === category.key
                              ? "bg-blue-50 text-blue-700"
                              : "text-gray-600 hover:bg-gray-50",
                          )}
                        >
                          <category.icon className="w-4 h-4" />
                          <span className="text-sm">{category.label}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Trending Topics */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                  <h3 className="text-lg font-bold text-gray-900 mb-4">
                    مواضيع رائجة
                  </h3>
                  <div className="space-y-3">
                    {[
                      "تقنيات الليزر",
                      "زراعة الأسنان",
                      "تقويم الأسنان",
                      "تجميل الأسنان",
                      "طب الأطفال",
                    ].map((topic, index) => (
                      <div key={index} className="flex items-center gap-2">
                        <TrendingUp className="w-4 h-4 text-green-500" />
                        <span className="text-sm text-gray-700">#{topic}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Main Content */}
            <div className="lg:col-span-3">
              {/* Feed Tab */}
              {activeTab === "feed" && (
                <div className="space-y-6">
                  {/* Create Post Box */}
                  <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                    <div className="flex items-center gap-4">
                      <img
                        src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=50&h=50&fit=crop&crop=face"
                        alt="Your Avatar"
                        className="w-12 h-12 rounded-full border-2 border-white shadow-md"
                      />
                      <button
                        onClick={() => setShowNewPostModal(true)}
                        className="flex-1 text-right px-4 py-3 bg-gray-50 rounded-xl text-gray-500 hover:bg-gray-100 transition-colors"
                      >
                        ما الذي تريد مشاركته مع المجتمع؟
                      </button>
                    </div>
                    <div className="flex items-center gap-4 mt-4 pt-4 border-t border-gray-100">
                      <button className="flex items-center gap-2 px-4 py-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                        <Camera className="w-4 h-4" />
                        <span className="text-sm">صورة</span>
                      </button>
                      <button className="flex items-center gap-2 px-4 py-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors">
                        <Video className="w-4 h-4" />
                        <span className="text-sm">فيديو</span>
                      </button>
                      <button className="flex items-center gap-2 px-4 py-2 text-purple-600 hover:bg-purple-50 rounded-lg transition-colors">
                        <Calendar className="w-4 h-4" />
                        <span className="text-sm">فعالية</span>
                      </button>
                    </div>
                  </div>

                  {/* Posts */}
                  {posts.map(renderPost)}
                </div>
              )}

              {/* Groups Tab */}
              {activeTab === "groups" && (
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <h2 className="text-2xl font-bold text-gray-900">
                      المجموعات
                    </h2>
                    <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                      إنشاء مجموعة
                    </button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {communityGroups.map((group) => (
                      <div
                        key={group.id}
                        className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden"
                      >
                        <img
                          src={group.image}
                          alt={group.name}
                          className="w-full h-32 object-cover"
                        />
                        <div className="p-4">
                          <div className="flex items-start justify-between mb-2">
                            <h3 className="font-bold text-gray-900">
                              {group.name}
                            </h3>
                            <div className="flex items-center gap-1">
                              {group.privacy === "private" ? (
                                <Lock className="w-4 h-4 text-gray-400" />
                              ) : (
                                <Globe className="w-4 h-4 text-gray-400" />
                              )}
                            </div>
                          </div>
                          <p className="text-sm text-gray-600 mb-3">
                            {group.description}
                          </p>
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-4 text-sm text-gray-500">
                              <span>{group.members.toLocaleString()} عضو</span>
                              <span
                                className={cn(
                                  "px-2 py-1 rounded-full text-xs",
                                  group.activity === "high"
                                    ? "bg-green-100 text-green-700"
                                    : group.activity === "medium"
                                      ? "bg-yellow-100 text-yellow-700"
                                      : "bg-gray-100 text-gray-700",
                                )}
                              >
                                {group.activity === "high"
                                  ? "نشاط عالي"
                                  : group.activity === "medium"
                                    ? "نشاط متوسط"
                                    : "نشاط قليل"}
                              </span>
                            </div>
                            <button
                              className={cn(
                                "px-4 py-2 rounded-lg font-medium transition-colors",
                                group.isJoined
                                  ? "bg-green-100 text-green-700 hover:bg-green-200"
                                  : "bg-blue-600 text-white hover:bg-blue-700",
                              )}
                            >
                              {group.isJoined ? "منضم" : "انضم"}
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Events Tab */}
              {activeTab === "events" && (
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <h2 className="text-2xl font-bold text-gray-900">
                      الفعاليات القادمة
                    </h2>
                    <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                      إنشاء فعالية
                    </button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {events.map((event) => (
                      <div
                        key={event.id}
                        className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden"
                      >
                        <img
                          src={event.image}
                          alt={event.title}
                          className="w-full h-48 object-cover"
                        />
                        <div className="p-6">
                          <div className="flex items-start justify-between mb-3">
                            <h3 className="font-bold text-gray-900 text-lg">
                              {event.title}
                            </h3>
                            <span
                              className={cn(
                                "px-2 py-1 rounded-full text-xs font-medium",
                                event.type === "webinar"
                                  ? "bg-blue-100 text-blue-700"
                                  : event.type === "workshop"
                                    ? "bg-green-100 text-green-700"
                                    : event.type === "conference"
                                      ? "bg-purple-100 text-purple-700"
                                      : "bg-orange-100 text-orange-700",
                              )}
                            >
                              {event.type === "webinar"
                                ? "ندوة"
                                : event.type === "workshop"
                                  ? "ورشة"
                                  : event.type === "conference"
                                    ? "مؤتمر"
                                    : "تواصل"}
                            </span>
                          </div>
                          <p className="text-gray-600 text-sm mb-4">
                            {event.description}
                          </p>

                          <div className="space-y-2 mb-4">
                            <div className="flex items-center gap-2 text-sm text-gray-600">
                              <Calendar className="w-4 h-4" />
                              <span>{event.date}</span>
                            </div>
                            <div className="flex items-center gap-2 text-sm text-gray-600">
                              <Clock className="w-4 h-4" />
                              <span>{event.time}</span>
                            </div>
                            <div className="flex items-center gap-2 text-sm text-gray-600">
                              <MapPin className="w-4 h-4" />
                              <span>{event.location}</span>
                            </div>
                          </div>

                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-4 text-sm text-gray-500">
                              <span>{event.attendees} مسجل</span>
                              <span className="font-medium text-green-600">
                                {event.price}
                              </span>
                            </div>
                            <button
                              className={cn(
                                "px-4 py-2 rounded-lg font-medium transition-colors",
                                event.isRegistered
                                  ? "bg-green-100 text-green-700 hover:bg-green-200"
                                  : "bg-blue-600 text-white hover:bg-blue-700",
                              )}
                            >
                              {event.isRegistered ? "مسجل" : "سجل الآن"}
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Experts Tab */}
              {activeTab === "experts" && (
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <h2 className="text-2xl font-bold text-gray-900">
                      الخبراء المتاحون
                    </h2>
                    <Link
                      to="/community/become-expert"
                      className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
                    >
                      كن خبيراً
                    </Link>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {experts.map((expert) => (
                      <div
                        key={expert.id}
                        className="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
                      >
                        <div className="flex items-center gap-4 mb-4">
                          <div className="relative">
                            <img
                              src={expert.avatar}
                              alt={expert.name}
                              className="w-16 h-16 rounded-full border-2 border-white shadow-md"
                            />
                            {expert.isOnline && (
                              <div className="absolute bottom-1 right-1 w-4 h-4 bg-green-500 border-2 border-white rounded-full"></div>
                            )}
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center gap-2">
                              <h3 className="font-bold text-gray-900">
                                {expert.name}
                              </h3>
                              {expert.verified && (
                                <CheckCircle className="w-4 h-4 text-blue-500" />
                              )}
                            </div>
                            <p className="text-sm text-gray-600">
                              {expert.title}
                            </p>
                            <p className="text-xs text-gray-500">
                              {expert.specialization}
                            </p>
                          </div>
                        </div>

                        <div className="grid grid-cols-3 gap-4 mb-4 text-center">
                          <div>
                            <div className="flex items-center justify-center gap-1">
                              <Star className="w-4 h-4 text-yellow-400 fill-current" />
                              <span className="font-bold text-gray-900">
                                {expert.rating}
                              </span>
                            </div>
                            <p className="text-xs text-gray-500">التقييم</p>
                          </div>
                          <div>
                            <div className="font-bold text-gray-900">
                              {expert.consultations}
                            </div>
                            <p className="text-xs text-gray-500">استشارة</p>
                          </div>
                          <div>
                            <div className="font-bold text-gray-900">
                              {expert.experience}
                            </div>
                            <p className="text-xs text-gray-500">خبرة</p>
                          </div>
                        </div>

                        <div className="flex gap-2">
                          <button className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                            <MessageCircle className="w-4 h-4" />
                            <span>استشارة نصية</span>
                          </button>
                          <button className="flex items-center justify-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
                            <Video className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* New Post Modal */}
      {showNewPostModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen px-4">
            <div
              className="fixed inset-0 bg-black opacity-50"
              onClick={() => setShowNewPostModal(false)}
            ></div>
            <div className="relative bg-white rounded-xl shadow-xl max-w-2xl w-full p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold text-gray-900">منشور جديد</h3>
                <button
                  onClick={() => setShowNewPostModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  ❌
                </button>
              </div>

              <div className="mb-4">
                <textarea
                  value={newPost}
                  onChange={(e) => setNewPost(e.target.value)}
                  placeholder="شارك خبرتك أو اطرح سؤالاً على المجتمع..."
                  className="w-full h-32 p-4 border border-gray-200 rounded-lg resize-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="flex gap-2">
                  <button className="flex items-center gap-2 px-3 py-2 text-blue-600 hover:bg-blue-50 rounded-lg">
                    <Camera className="w-4 h-4" />
                    <span className="text-sm">صورة</span>
                  </button>
                  <button className="flex items-center gap-2 px-3 py-2 text-green-600 hover:bg-green-50 rounded-lg">
                    <Video className="w-4 h-4" />
                    <span className="text-sm">فيديو</span>
                  </button>
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={() => setShowNewPostModal(false)}
                    className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg"
                  >
                    إلغاء
                  </button>
                  <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                    نشر
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
