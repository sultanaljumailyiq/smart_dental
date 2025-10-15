import React, { useState } from "react";
import { Link } from "react-router-dom";
import {
  Users,
  Plus,
  Search,
  Filter,
  Star,
  MapPin,
  Calendar,
  Lock,
  Globe,
  TrendingUp,
  MessageCircle,
  Eye,
  UserPlus,
  Settings,
  Bell,
  Crown,
  Shield,
  Award,
  ChevronRight,
  Hash,
  Image as ImageIcon,
  Video,
  FileText,
  Heart,
  Share2,
  Bookmark,
  MoreHorizontal,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useI18n } from "@/lib/i18n";
import { useIsMobile } from "@/hooks/use-mobile";

const groups = [
  {
    id: 1,
    name: "أطباء الأسنان العراقيين",
    description: "مجتمع لأطباء الأسنان في العراق لتبادل الخبرات والمعرفة",
    members: 2340,
    posts: 156,
    image:
      "https://images.unsplash.com/photo-1576091160399-112ba8d25d1f?w=300&h=200&fit=crop",
    cover:
      "https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=800&h=200&fit=crop",
    privacy: "public",
    category: "مهني",
    location: "العراق",
    joined: true,
    role: "member",
    activity: "نشط",
    tags: ["أسنان", "طب", "عراق"],
  },
  {
    id: 2,
    name: "تقويم الأسنان المتقدم",
    description: "مناقشات حول أحدث تقنيات تقويم الأسنان و��لحالات المعقدة",
    members: 1567,
    posts: 89,
    image:
      "https://images.unsplash.com/photo-1606811971618-4486d14f3f99?w=300&h=200&fit=crop",
    cover:
      "https://images.unsplash.com/photo-1576091160549-2173dba999ef?w=800&h=200&fit=crop",
    privacy: "private",
    category: "تخصصي",
    location: "عالمي",
    joined: true,
    role: "admin",
    activity: "نشط جداً",
    tags: ["تقويم", "أسنان", "تخصص"],
  },
  {
    id: 3,
    name: "جراحة الفم والوجه والفكين",
    description: "للجراحين المتخصصين في جراحة الفم والوجه والفكين",
    members: 890,
    posts: 234,
    image:
      "https://images.unsplash.com/photo-1609840114035-3c981b782dfe?w=300&h=200&fit=crop",
    cover:
      "https://images.unsplash.com/photo-1551601651-2a8555f1a136?w=800&h=200&fit=crop",
    privacy: "private",
    category: "تخصصي",
    location: "عالمي",
    joined: false,
    role: null,
    activity: "نشط",
    tags: ["جراحة", "فم", "فكين"],
  },
  {
    id: 4,
    name: "طب أسنان الأطفال والمراهقين",
    description: "مجتمع متخصص في طب أسنان الأطفال وإدارة سلوكهم",
    members: 1234,
    posts: 67,
    image:
      "https://images.unsplash.com/photo-1582750433449-648ed127bb54?w=300&h=200&fit=crop",
    cover:
      "https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=800&h=200&fit=crop",
    privacy: "public",
    category: "تخصصي",
    location: "عالمي",
    joined: false,
    role: null,
    activity: "متوسط",
    tags: ["أطفال", "أسنان", "سلوك"],
  },
  {
    id: 5,
    name: "أطباء الأسنان الشباب",
    description: "منصة للأطباء الجدد لطرح الأسئلة والحصول على النصائح",
    members: 3456,
    posts: 445,
    image:
      "https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=300&h=200&fit=crop",
    cover:
      "https://images.unsplash.com/photo-1576091160399-112ba8d25d1f?w=800&h=200&fit=crop",
    privacy: "public",
    category: "تعليمي",
    location: "عالمي",
    joined: true,
    role: "moderator",
    activity: "نشط جداً",
    tags: ["شباب", "تعليم", "نصائح"],
  },
];

const recentActivity = [
  {
    id: 1,
    groupId: 1,
    groupName: "أطباء الأسنان العراقيين",
    type: "post",
    author: "د. سارة أحمد",
    content: "مشاركة حالة معقدة لعلاج جذ��ر الأسنان",
    timestamp: "منذ ساعتين",
    engagement: { likes: 45, comments: 12 },
  },
  {
    id: 2,
    groupId: 2,
    groupName: "تقويم الأسنان المتقدم",
    type: "discussion",
    author: "د. محمد حسن",
    content: "نقاش حول استخدام التقويم الشفاف في الحالات المعقدة",
    timestamp: "منذ 4 ساعات",
    engagement: { likes: 23, comments: 8 },
  },
  {
    id: 3,
    groupId: 5,
    groupName: "أطباء الأسنان الشباب",
    type: "question",
    author: "د. أحمد عل��",
    content: "سؤال حول إدارة المريض القلق",
    timestamp: "منذ 6 ساعات",
    engagement: { likes: 15, comments: 25 },
  },
];

export default function CommunityGroups() {
  const { language } = useI18n();
  const isMobile = useIsMobile();
  const [activeTab, setActiveTab] = useState("my-groups");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [showCreateGroup, setShowCreateGroup] = useState(false);

  const categories = ["all", "مهني", "تخصصي", "تعليمي", "عام"];

  const filteredGroups = groups.filter((group) => {
    const matchesSearch =
      group.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      group.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory =
      selectedCategory === "all" || group.category === selectedCategory;
    const matchesTab = activeTab === "my-groups" ? group.joined : true;

    return matchesSearch && matchesCategory && matchesTab;
  });

  const GroupCard = ({ group }: { group: any }) => (
    <div className="bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-lg transition-all duration-300 w-full">
      {/* Cover Image */}
      <div className="relative h-24 sm:h-32 bg-gradient-to-r from-blue-500 to-purple-600">
        <img
          src={group.cover}
          alt={group.name}
          className="w-full h-full object-cover"
        />
        <div className="absolute top-2 right-2 flex items-center gap-1 sm:gap-2">
          {group.privacy === "private" ? (
            <div className="bg-black/50 text-white px-2 py-1 rounded-full text-xs flex items-center gap-1">
              <Lock className="w-3 h-3" />
              خاص
            </div>
          ) : (
            <div className="bg-black/50 text-white px-2 py-1 rounded-full text-xs flex items-center gap-1">
              <Globe className="w-3 h-3" />
              عام
            </div>
          )}
          {group.role === "admin" && (
            <div className="bg-yellow-500 text-white px-2 py-1 rounded-full text-xs flex items-center gap-1">
              <Crown className="w-3 h-3" />
              مدير
            </div>
          )}
          {group.role === "moderator" && (
            <div className="bg-green-500 text-white px-2 py-1 rounded-full text-xs flex items-center gap-1">
              <Shield className="w-3 h-3" />
              مشرف
            </div>
          )}
        </div>
      </div>

      {/* Group Info */}
      <div className="p-3 sm:p-4">
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center gap-2 sm:gap-3 flex-1 min-w-0">
            <img
              src={group.image}
              alt={group.name}
              className="w-10 h-10 sm:w-12 sm:h-12 rounded-lg object-cover border-2 border-white -mt-6 sm:-mt-8 relative z-10 flex-shrink-0"
            />
            <div className="flex-1 min-w-0">
              <h3 className="font-bold text-gray-900 mb-1 text-sm sm:text-base truncate">
                {group.name}
              </h3>
              <div className="flex items-center gap-1 sm:gap-2 text-xs sm:text-sm text-gray-600">
                <Users className="w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0" />
                <span>{group.members.toLocaleString()} عضو</span>
                <span className="hidden sm:inline">·</span>
                <span className="hidden sm:inline">{group.posts} منشور</span>
              </div>
            </div>
          </div>
        </div>

        <p className="text-gray-700 text-xs sm:text-sm mb-3 line-clamp-2 leading-relaxed">
          {group.description}
        </p>

        {/* Tags */}
        <div className="flex flex-wrap gap-1 mb-3">
          {group.tags
            .slice(0, isMobile ? 2 : 3)
            .map((tag: string, index: number) => (
              <span
                key={index}
                className="bg-gray-100 text-gray-700 px-2 py-1 rounded-full text-xs"
              >
                #{tag}
              </span>
            ))}
          {group.tags.length > (isMobile ? 2 : 3) && (
            <span className="bg-gray-100 text-gray-700 px-2 py-1 rounded-full text-xs">
              +{group.tags.length - (isMobile ? 2 : 3)}
            </span>
          )}
        </div>

        {/* Activity & Location - Mobile optimized */}
        <div className="flex items-center justify-between text-xs text-gray-600 mb-4">
          <div className="flex items-center gap-1">
            <TrendingUp className="w-3 h-3 flex-shrink-0" />
            <span className="truncate">{group.activity}</span>
          </div>
          <div className="flex items-center gap-1">
            <MapPin className="w-3 h-3 flex-shrink-0" />
            <span className="truncate">{group.location}</span>
          </div>
        </div>

        {/* Action Buttons - Mobile optimized */}
        <div className="flex gap-2">
          <Link
            to={`/community/groups/${group.id}`}
            className="flex-1 bg-gray-100 text-gray-700 py-2 px-3 sm:px-4 rounded-lg text-xs sm:text-sm font-medium hover:bg-gray-200 transition-colors text-center touch-target"
          >
            {isMobile ? "عرض" : "عرض المجموعة"}
          </Link>
          <button
            className={cn(
              "flex-1 py-2 px-3 sm:px-4 rounded-lg text-xs sm:text-sm font-medium transition-colors touch-target",
              group.joined
                ? "bg-green-100 text-green-700 hover:bg-green-200"
                : "bg-blue-600 text-white hover:bg-blue-700",
            )}
          >
            {group.joined ? "عضو" : "انضم"}
          </button>
        </div>
      </div>
    </div>
  );

  const ActivityCard = ({ activity }: { activity: any }) => (
    <div className="bg-white rounded-lg border border-gray-200 p-4 hover:border-gray-300 transition-colors">
      <div className="flex items-start justify-between mb-2">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
          <span className="text-sm font-medium text-blue-600">
            {activity.groupName}
          </span>
        </div>
        <span className="text-xs text-gray-500">{activity.timestamp}</span>
      </div>

      <div className="mb-2">
        <p className="text-sm text-gray-900 mb-1">
          <span className="font-medium">{activity.author}</span> نشر{" "}
          {activity.type === "post"
            ? "منشوراً"
            : activity.type === "discussion"
              ? "نقاشاً"
              : "سؤالاً"}
        </p>
        <p className="text-sm text-gray-700">{activity.content}</p>
      </div>

      <div className="flex items-center gap-4 text-xs text-gray-600">
        <div className="flex items-center gap-1">
          <Heart className="w-3 h-3" />
          <span>{activity.engagement.likes}</span>
        </div>
        <div className="flex items-center gap-1">
          <MessageCircle className="w-3 h-3" />
          <span>{activity.engagement.comments}</span>
        </div>
      </div>
    </div>
  );

  const CreateGroupModal = () => (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl w-full max-w-md max-h-[90vh] overflow-hidden">
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <h2 className="text-lg font-bold">إنشاء مجموعة جديدة</h2>
          <button
            onClick={() => setShowCreateGroup(false)}
            className="w-8 h-8 hover:bg-gray-100 rounded-full flex items-center justify-center transition-colors"
          >
            <Plus className="w-5 h-5 rotate-45" />
          </button>
        </div>

        <div className="p-4 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              اسم المجموعة
            </label>
            <input
              type="text"
              placeholder="أدخل اسم المجموعة"
              className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              الوصف
            </label>
            <textarea
              placeholder="����كتب وصفاً مختصراً للمجموعة"
              className="w-full p-3 border border-gray-200 rounded-lg resize-none h-20 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              نوع الخصوصية
            </label>
            <select className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
              <option value="public">عام - يمكن لأي شخص الانضمام</option>
              <option value="private">خا�� - يتطلب موافقة للانضمام</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              الفئة
            </label>
            <select className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
              <option value="مهني">مهني</option>
              <option value="تخصصي">تخصصي</option>
              <option value="تعليمي">تعليمي</option>
              <option value="عام">عام</option>
            </select>
          </div>

          <div className="flex gap-3 pt-4">
            <button
              onClick={() => setShowCreateGroup(false)}
              className="flex-1 bg-gray-100 text-gray-700 py-3 px-4 rounded-lg font-medium hover:bg-gray-200 transition-colors"
            >
              إلغاء
            </button>
            <button className="flex-1 bg-blue-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-blue-700 transition-colors">
              إنشاء المجموعة
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
      <div className="sticky top-0 bg-white border-b border-gray-200 z-30">
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-4">
              <Link to="/community" className="flex items-center gap-2">
                <Users className="w-6 h-6 text-blue-600" />
                <span className="text-xl font-bold text-gray-900">
                  المجموعات
                </span>
              </Link>
            </div>

            <div className="flex items-center gap-3">
              {!isMobile && (
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="text"
                    placeholder="البحث في المجموعات..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10 pr-4 py-2 w-80 text-sm border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              )}

              <button
                onClick={() => setShowCreateGroup(true)}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
              >
                <Plus className="w-4 h-4" />
                {!isMobile && "إنشاء مجموعة"}
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-6">
        <div className="flex gap-6">
          {/* Sidebar - Desktop only */}
          {!isMobile && (
            <div className="w-64 space-y-6">
              {/* Navigation */}
              <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                <nav className="p-2">
                  {[
                    { id: "my-groups", label: "مجموعاتي", icon: Users },
                    { id: "discover", label: "اكتشاف", icon: Search },
                    { id: "trending", label: "الشائعة", icon: TrendingUp },
                    { id: "recent", label: "حديثة", icon: Calendar },
                  ].map((item) => (
                    <button
                      key={item.id}
                      onClick={() => setActiveTab(item.id)}
                      className={cn(
                        "w-full flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-xl transition-colors",
                        activeTab === item.id
                          ? "bg-blue-50 text-blue-700"
                          : "text-gray-700 hover:bg-gray-50",
                      )}
                    >
                      <item.icon className="w-5 h-5" />
                      {item.label}
                    </button>
                  ))}
                </nav>
              </div>

              {/* Quick Stats */}
              <div className="bg-white rounded-xl border border-gray-200 p-4">
                <h3 className="font-bold text-gray-900 mb-4">إحصائيات سريعة</h3>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">
                      المجموعات المنضم إليها
                    </span>
                    <span className="font-semibold text-blue-600">3</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">مجموع الأعضاء</span>
                    <span className="font-semibold text-green-600">5,141</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">
                      الم��اركا�� الشهرية
                    </span>
                    <span className="font-semibold text-purple-600">234</span>
                  </div>
                </div>
              </div>

              {/* Recent Activity */}
              <div className="bg-white rounded-xl border border-gray-200 p-4">
                <h3 className="font-bold text-gray-900 mb-4">النشاط الأخير</h3>
                <div className="space-y-3">
                  {recentActivity.map((activity) => (
                    <ActivityCard key={activity.id} activity={activity} />
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Main Content */}
          <div className="flex-1">
            {/* Mobile Search & Filters */}
            {isMobile && (
              <div className="bg-white rounded-xl border border-gray-200 p-4 mb-6">
                <div className="relative mb-4">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="text"
                    placeholder="البحث في المجموعات..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div className="flex gap-2 overflow-x-auto pb-2">
                  {[
                    { id: "my-groups", label: "مجموعاتي" },
                    { id: "discover", label: "اكتشاف" },
                    { id: "trending", label: "الشائعة" },
                  ].map((tab) => (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={cn(
                        "px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors",
                        activeTab === tab.id
                          ? "bg-blue-600 text-white"
                          : "bg-gray-100 text-gray-700 hover:bg-gray-200",
                      )}
                    >
                      {tab.label}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Filters */}
            <div className="bg-white rounded-xl border border-gray-200 p-4 mb-6">
              <div className="flex items-center gap-4 overflow-x-auto pb-2">
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Filter className="w-4 h-4" />
                  <span>تصفية:</span>
                </div>
                {categories.map((category) => (
                  <button
                    key={category}
                    onClick={() => setSelectedCategory(category)}
                    className={cn(
                      "px-3 py-1 rounded-full text-sm font-medium whitespace-nowrap transition-colors",
                      selectedCategory === category
                        ? "bg-blue-600 text-white"
                        : "bg-gray-100 text-gray-700 hover:bg-gray-200",
                    )}
                  >
                    {category === "all" ? "ال��ل" : category}
                  </button>
                ))}
              </div>
            </div>

            {/* Groups Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-4 sm:gap-6">
              {filteredGroups.map((group) => (
                <GroupCard key={group.id} group={group} />
              ))}
            </div>

            {/* Empty State */}
            {filteredGroups.length === 0 && (
              <div className="text-center py-12">
                <Users className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  لا توجد مجموعات
                </h3>
                <p className="text-gray-600 mb-6">
                  جرب تغيير المرشحات أو إنشاء مجموعة جديدة
                </p>
                <button
                  onClick={() => setShowCreateGroup(true)}
                  className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  إنشاء مجموعة جديدة
                </button>
              </div>
            )}
          </div>
        </div>
      </div>


      {/* Create Group Modal */}
      {showCreateGroup && <CreateGroupModal />}

      {/* Bottom padding for mobile */}
      {isMobile && <div className="h-20"></div>}
    </div>
  );
}
