import React, { useState } from "react";
import { Link } from "react-router-dom";
import {
  TrendingUp,
  Eye,
  Heart,
  MessageCircle,
  Share2,
  Users,
  Award,
  Target,
  Calendar,
  Clock,
  ArrowLeft,
  BarChart3,
  PieChart,
  Activity,
  Zap,
  Star,
  ThumbsUp,
  BookOpen,
  UserPlus,
} from "lucide-react";
import { cn } from "@/lib/utils";

export default function CommunityStatistics() {
  const [timeRange, setTimeRange] = useState<"week" | "month" | "year">("month");

  const stats = {
    totalPosts: 42,
    totalLikes: 1234,
    totalComments: 567,
    totalShares: 89,
    totalViews: 15678,
    followers: 234,
    following: 156,
    engagement: 8.5, // percentage
  };

  const activityData = [
    { day: "السبت", posts: 3, likes: 45, comments: 12 },
    { day: "الأحد", posts: 5, likes: 67, comments: 23 },
    { day: "الإثنين", posts: 2, likes: 34, comments: 8 },
    { day: "الثلاثاء", posts: 4, likes: 56, comments: 15 },
    { day: "الأربعاء", posts: 6, likes: 89, comments: 34 },
    { day: "الخميس", posts: 3, likes: 45, comments: 19 },
    { day: "الجمعة", posts: 1, likes: 23, comments: 5 },
  ];

  const topPosts = [
    {
      id: 1,
      title: "نهج ثوري لعلاج جذور الأسنان بدون ألم",
      views: 2340,
      likes: 324,
      comments: 42,
      shares: 18,
      date: "منذ 2 أيام",
    },
    {
      id: 2,
      title: "حالة معقدة تم حلها بنجاح - زراعة فورية",
      views: 5234,
      likes: 892,
      comments: 134,
      shares: 45,
      date: "منذ 5 أيام",
    },
    {
      id: 3,
      title: "ما هي أفضل طريقة للتعامل مع قلق الأطفال",
      views: 1567,
      likes: 156,
      comments: 89,
      shares: 12,
      date: "منذ أسبوع",
    },
  ];

  const achievements = [
    { id: 1, title: "كاتب نشط", description: "نشرت 50 منشور", icon: BookOpen, color: "blue", completed: false, progress: 42 },
    { id: 2, title: "محبوب", description: "حصلت على 1000 إعجاب", icon: Heart, color: "red", completed: true, progress: 100 },
    { id: 3, title: "متفاعل", description: "كتبت 500 تعليق", icon: MessageCircle, color: "green", completed: true, progress: 100 },
    { id: 4, title: "مؤثر", description: "100 متابع", icon: Users, color: "purple", completed: true, progress: 100 },
  ];

  const getMaxValue = () => {
    const values = activityData.flatMap((d) => [d.posts, d.likes, d.comments]);
    return Math.max(...values);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50" dir="rtl">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-30 shadow-sm">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <div className="flex items-center gap-4">
            <Link
              to="/community"
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <ArrowLeft className="w-6 h-6 text-gray-600" />
            </Link>
            <div className="flex-1">
              <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                <TrendingUp className="w-7 h-7 text-blue-600" />
                الإحصائيات
              </h1>
              <p className="text-sm text-gray-600 mt-1">تتبع نشاطك وإنجازاتك</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto p-4 pb-20">
        {/* Time Range Selector */}
        <div className="flex gap-2 mb-6">
          {(["week", "month", "year"] as const).map((range) => (
            <button
              key={range}
              onClick={() => setTimeRange(range)}
              className={cn(
                "px-4 py-2 rounded-xl font-medium transition-all",
                timeRange === range
                  ? "bg-blue-600 text-white shadow-lg"
                  : "bg-white text-gray-600 hover:bg-gray-50"
              )}
            >
              {range === "week" ? "أسبوع" : range === "month" ? "شهر" : "سنة"}
            </button>
          ))}
        </div>

        {/* Overview Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between mb-2">
              <div className="p-3 bg-blue-100 rounded-xl">
                <Eye className="w-6 h-6 text-blue-600" />
              </div>
              <span className="text-xs text-gray-500">المشاهدات</span>
            </div>
            <h3 className="text-2xl font-bold text-gray-900">{stats.totalViews.toLocaleString()}</h3>
          </div>

          <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between mb-2">
              <div className="p-3 bg-red-100 rounded-xl">
                <Heart className="w-6 h-6 text-red-600" />
              </div>
              <span className="text-xs text-gray-500">الإعجابات</span>
            </div>
            <h3 className="text-2xl font-bold text-gray-900">{stats.totalLikes.toLocaleString()}</h3>
          </div>

          <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between mb-2">
              <div className="p-3 bg-green-100 rounded-xl">
                <MessageCircle className="w-6 h-6 text-green-600" />
              </div>
              <span className="text-xs text-gray-500">التعليقات</span>
            </div>
            <h3 className="text-2xl font-bold text-gray-900">{stats.totalComments.toLocaleString()}</h3>
          </div>

          <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between mb-2">
              <div className="p-3 bg-purple-100 rounded-xl">
                <Share2 className="w-6 h-6 text-purple-600" />
              </div>
              <span className="text-xs text-gray-500">المشاركات</span>
            </div>
            <h3 className="text-2xl font-bold text-gray-900">{stats.totalShares}</h3>
          </div>
        </div>

        {/* Engagement Rate */}
        <div className="bg-gradient-to-br from-blue-600 to-purple-600 rounded-2xl p-6 mb-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold mb-2">معدل التفاعل</h3>
              <p className="text-blue-100 text-sm">متوسط التفاعل مع منشوراتك</p>
            </div>
            <div className="text-right">
              <div className="text-4xl font-bold">{stats.engagement}%</div>
              <div className="flex items-center gap-1 text-green-300 text-sm mt-1">
                <TrendingUp className="w-4 h-4" />
                <span>+2.3%</span>
              </div>
            </div>
          </div>
        </div>

        {/* Activity Chart */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 mb-6">
          <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-blue-600" />
            النشاط الأسبوعي
          </h3>
          <div className="space-y-3">
            {activityData.map((day) => (
              <div key={day.day} className="space-y-1">
                <div className="flex items-center justify-between text-sm">
                  <span className="font-medium text-gray-700">{day.day}</span>
                  <span className="text-gray-500">{day.posts} منشور</span>
                </div>
                <div className="flex gap-1">
                  <div
                    className="bg-blue-500 h-2 rounded-full transition-all"
                    style={{ width: `${(day.posts / getMaxValue()) * 100}%` }}
                  />
                  <div
                    className="bg-red-500 h-2 rounded-full transition-all"
                    style={{ width: `${(day.likes / getMaxValue()) * 100}%` }}
                  />
                  <div
                    className="bg-green-500 h-2 rounded-full transition-all"
                    style={{ width: `${(day.comments / getMaxValue()) * 100}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
          <div className="flex gap-4 mt-4 text-xs text-gray-600">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-blue-500 rounded-full" />
              <span>منشورات</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-red-500 rounded-full" />
              <span>إعجابات</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-green-500 rounded-full" />
              <span>تعليقات</span>
            </div>
          </div>
        </div>

        {/* Top Posts */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 mb-6">
          <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
            <Star className="w-5 h-5 text-yellow-600" />
            أفضل المنشورات
          </h3>
          <div className="space-y-3">
            {topPosts.map((post, index) => (
              <div
                key={post.id}
                className="flex items-start gap-4 p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors"
              >
                <div className="flex-shrink-0 w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-bold">
                  {index + 1}
                </div>
                <div className="flex-1">
                  <h4 className="font-semibold text-gray-900 mb-2">{post.title}</h4>
                  <div className="flex gap-4 text-sm text-gray-600">
                    <span className="flex items-center gap-1">
                      <Eye className="w-4 h-4" />
                      {post.views.toLocaleString()}
                    </span>
                    <span className="flex items-center gap-1">
                      <Heart className="w-4 h-4" />
                      {post.likes}
                    </span>
                    <span className="flex items-center gap-1">
                      <MessageCircle className="w-4 h-4" />
                      {post.comments}
                    </span>
                  </div>
                  <p className="text-xs text-gray-500 mt-2">{post.date}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Achievements */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
            <Award className="w-5 h-5 text-yellow-600" />
            الإنجازات
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {achievements.map((achievement) => {
              const Icon = achievement.icon;
              return (
                <div
                  key={achievement.id}
                  className={cn(
                    "p-4 rounded-xl border-2 transition-all",
                    achievement.completed
                      ? `border-${achievement.color}-500 bg-${achievement.color}-50`
                      : "border-gray-200 bg-gray-50"
                  )}
                >
                  <div className="flex items-start gap-3">
                    <div
                      className={cn(
                        "p-3 rounded-xl",
                        achievement.completed
                          ? `bg-${achievement.color}-100`
                          : "bg-gray-200"
                      )}
                    >
                      <Icon
                        className={cn(
                          "w-6 h-6",
                          achievement.completed
                            ? `text-${achievement.color}-600`
                            : "text-gray-400"
                        )}
                      />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-semibold text-gray-900 mb-1">
                        {achievement.title}
                      </h4>
                      <p className="text-sm text-gray-600 mb-2">
                        {achievement.description}
                      </p>
                      <div className="relative w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                        <div
                          className={cn(
                            "absolute top-0 left-0 h-full rounded-full transition-all",
                            achievement.completed
                              ? `bg-${achievement.color}-500`
                              : "bg-gray-400"
                          )}
                          style={{ width: `${achievement.progress}%` }}
                        />
                      </div>
                      <p className="text-xs text-gray-500 mt-1">
                        {achievement.progress}%
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
