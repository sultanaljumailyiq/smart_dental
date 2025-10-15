import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Settings,
  Users,
  BarChart3,
  Eye,
  Calendar,
  BookOpen,
  Award,
  Shield,
  Plus,
  Edit,
  Trash2,
  Check,
  X,
  Search,
  Filter,
  Globe,
  Box,
  GraduationCap,
  Link as LinkIcon,
  Image as ImageIcon,
  MapPin,
  ArrowLeft,
  TrendingUp,
  MessageCircle,
  Heart,
  Share2,
  Star,
  AlertTriangle,
  UserCheck,
  Sparkles,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

const IRAQI_PROVINCES = [
  "بغداد", "البصرة", "نينوى", "أربيل", "النجف", "كربلاء", 
  "ديالى", "الأنبار", "صلاح الدين", "ذي قار", "المثنى", "القادسية",
  "بابل", "كركوك", "واسط", "السليمانية", "دهوك", "ميسان"
];

export default function CommunityAdminSettings() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<"stats" | "overview" | "moderators" | "education">("stats");
  const [eduSubTab, setEduSubTab] = useState<"events" | "courses" | "content" | "sources" | "3d">("events");
  const [showModeratorDialog, setShowModeratorDialog] = useState(false);
  const [showEventDialog, setShowEventDialog] = useState(false);
  const [showSourceDialog, setShowSourceDialog] = useState(false);
  const [show3DDialog, setShow3DDialog] = useState(false);

  const tabs = [
    { id: "stats", label: "الإحصائيات", icon: BarChart3 },
    { id: "overview", label: "نظرة عامة", icon: Eye },
    { id: "moderators", label: "المشرفون", icon: Shield },
    { id: "education", label: "التعليم", icon: GraduationCap },
  ];

  const stats = {
    totalMembers: 2847,
    activePosts: 1234,
    totalModerators: 24,
    totalEvents: 18,
    totalEducationalContent: 156,
    totalEngagement: 45623,
  };

  const [moderators, setModerators] = useState([
    {
      id: 1,
      name: "د. سارة أحمد",
      role: "elite",
      province: "بغداد",
      badge: "نخبة بغداد",
      badgeColor: "purple",
      canPublishEducational: true,
      canModerate: true,
      avatar: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=100",
    },
    {
      id: 2,
      name: "د. علي حسين",
      role: "moderator",
      province: "البصرة",
      badge: "مشرف البصرة",
      badgeColor: "blue",
      canPublishEducational: false,
      canModerate: true,
      avatar: "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=100",
    },
  ]);

  const [events, setEvents] = useState([
    {
      id: 1,
      title: "ندوة علاج العصب الحديث",
      arabicTitle: "ندوة علاج العصب الحديث",
      eventType: "webinar",
      isExternal: false,
      startDate: "2025-11-01T10:00",
      platform: "Zoom",
      speaker: "د. محمد علي",
      status: "upcoming",
      attendees: 45,
      maxAttendees: 100,
    },
  ]);

  const [trustedSources, setTrustedSources] = useState([
    {
      id: 1,
      title: "Latest ADA Guidelines 2024",
      arabicTitle: "أحدث إرشادات ADA 2024",
      sourceName: "ADA",
      sourceType: "guideline",
      sourceUrl: "https://ada.org/guidelines",
      isActive: true,
    },
  ]);

  const [models3D, setModels3D] = useState([
    {
      id: 1,
      title: "Dental Anatomy Collection",
      arabicTitle: "مجموعة تشريح الأسنان",
      sketchfabUrl: "https://sketchfab.com/3d-models/...",
      sketchfabType: "collection",
      isActive: true,
    },
  ]);

  const [educationalContent, setEducationalContent] = useState([
    {
      id: 1,
      title: "دليل شامل لزراعة الأسنان",
      author: "د. سارة أحمد",
      status: "approved",
      views: 1234,
      likes: 234,
      isPinned: true,
    },
  ]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50" dir="rtl">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-30 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate("/community")}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <ArrowLeft className="w-6 h-6 text-gray-600" />
            </button>
            <div className="flex-1">
              <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                <Settings className="w-7 h-7 text-blue-600" />
                إعدادات المجتمع
              </h1>
              <p className="text-sm text-gray-600 mt-1">إدارة المجتمع الطبي والتحكم الكامل في المحتوى</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto p-4 pb-20">
        {/* Tabs */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 mb-6 overflow-hidden">
          <div className="grid grid-cols-5 gap-0">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={cn(
                    "p-4 flex flex-col items-center gap-2 transition-all border-b-2",
                    activeTab === tab.id
                      ? "border-blue-600 bg-blue-50"
                      : "border-transparent hover:bg-gray-50"
                  )}
                >
                  <Icon className={cn("w-6 h-6", activeTab === tab.id ? "text-blue-600" : "text-gray-600")} />
                  <span className={cn("text-sm font-medium", activeTab === tab.id ? "text-blue-600" : "text-gray-600")}>
                    {tab.label}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Stats Tab */}
        {activeTab === "stats" && (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
              <BarChart3 className="w-7 h-7 text-blue-600" />
              إحصائيات المجتمع
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card className="border-r-4 border-r-blue-500">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600">إجمالي الأعضاء</p>
                      <p className="text-2xl font-bold text-gray-900">{stats.totalMembers}</p>
                    </div>
                    <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center">
                      <Users className="w-6 h-6 text-blue-600" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-r-4 border-r-purple-500">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600">المشرفون والنخبة</p>
                      <p className="text-2xl font-bold text-gray-900">{stats.totalModerators}</p>
                    </div>
                    <div className="w-12 h-12 rounded-full bg-purple-100 flex items-center justify-center">
                      <Shield className="w-6 h-6 text-purple-600" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-r-4 border-r-green-500">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600">المحتوى التعليمي</p>
                      <p className="text-2xl font-bold text-gray-900">{stats.totalEducationalContent}</p>
                    </div>
                    <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center">
                      <BookOpen className="w-6 h-6 text-green-600" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardContent className="p-6">
                <h3 className="text-lg font-bold text-gray-900 mb-4">تفاصيل الإحصائيات</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="text-center p-4 bg-blue-50 rounded-lg">
                    <MessageCircle className="w-8 h-8 text-blue-600 mx-auto mb-2" />
                    <p className="text-sm text-gray-600">المنشورات النشطة</p>
                    <p className="text-xl font-bold text-gray-900">{stats.activePosts}</p>
                  </div>
                  <div className="text-center p-4 bg-green-50 rounded-lg">
                    <Calendar className="w-8 h-8 text-green-600 mx-auto mb-2" />
                    <p className="text-sm text-gray-600">الندوات</p>
                    <p className="text-xl font-bold text-gray-900">{stats.totalEvents}</p>
                  </div>
                  <div className="text-center p-4 bg-purple-50 rounded-lg">
                    <Heart className="w-8 h-8 text-purple-600 mx-auto mb-2" />
                    <p className="text-sm text-gray-600">التفاعل الكلي</p>
                    <p className="text-xl font-bold text-gray-900">{stats.totalEngagement.toLocaleString()}</p>
                  </div>
                  <div className="text-center p-4 bg-orange-50 rounded-lg">
                    <TrendingUp className="w-8 h-8 text-orange-600 mx-auto mb-2" />
                    <p className="text-sm text-gray-600">معدل النمو</p>
                    <p className="text-xl font-bold text-gray-900">+12%</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Overview Tab */}
        {activeTab === "overview" && (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
              <Eye className="w-7 h-7 text-blue-600" />
              نظرة عامة على المجتمع
            </h2>

            <Card>
              <CardContent className="p-6">
                <h3 className="text-lg font-bold text-gray-900 mb-4">معلومات عامة</h3>
                <p className="text-gray-600">
                  مرحباً بك في لوحة إدارة المجتمع. من هنا يمكنك إدارة جميع جوانب المجتمع بما في ذلك المشرفين والنخبة، الفعاليات والندوات، والمحتوى التعليمي.
                </p>
                <div className="mt-4 space-y-2">
                  <div className="flex items-center gap-2 text-sm text-gray-700">
                    <Shield className="w-4 h-4 text-purple-600" />
                    <span>المشرفون والنخبة: إدارة الأعضاء المميزين بحسب المحافظات</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-700">
                    <Calendar className="w-4 h-4 text-green-600" />
                    <span>الندوات والفعاليات: إدارة الأحداث الداخلية والخارجية</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-700">
                    <GraduationCap className="w-4 h-4 text-blue-600" />
                    <span>التعليم: إدارة المحتوى التعليمي والمصادر الموثوقة</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <h3 className="text-lg font-bold text-gray-900 mb-4">آخر التحديثات</h3>
                <div className="space-y-3">
                  <div className="flex items-start gap-3 p-3 bg-blue-50 rounded-lg">
                    <div className="w-2 h-2 bg-blue-600 rounded-full mt-2"></div>
                    <div>
                      <p className="text-sm font-medium text-gray-900">تمت إضافة مشرف جديد في محافظة بغداد</p>
                      <p className="text-xs text-gray-600">منذ ساعتين</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3 p-3 bg-green-50 rounded-lg">
                    <div className="w-2 h-2 bg-green-600 rounded-full mt-2"></div>
                    <div>
                      <p className="text-sm font-medium text-gray-900">تم نشر ندوة جديدة عن علاج العصب</p>
                      <p className="text-xs text-gray-600">منذ 5 ساعات</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Moderators Tab */}
        {activeTab === "moderators" && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold text-gray-900">إدارة المشرفون والنخبة</h2>
              <Button
                onClick={() => setShowModeratorDialog(true)}
                className="bg-blue-600 hover:bg-blue-700"
              >
                <Plus className="w-4 h-4 ml-2" />
                إضافة مشرف / نخبة
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {moderators.map((mod) => (
                <Card key={mod.id} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-4">
                    <div className="flex items-start gap-3">
                      <img src={mod.avatar} alt={mod.name} className="w-16 h-16 rounded-full object-cover" />
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="font-semibold text-gray-900">{mod.name}</h3>
                          <span className={cn(
                            "text-xs px-2 py-1 rounded-full font-medium",
                            mod.role === "elite" 
                              ? "bg-purple-100 text-purple-700" 
                              : "bg-blue-100 text-blue-700"
                          )}>
                            {mod.role === "elite" ? "نخبة" : "مشرف"}
                          </span>
                        </div>
                        <p className="text-sm text-gray-600 mb-2 flex items-center gap-1">
                          <MapPin className="w-3 h-3" />
                          {mod.province}
                        </p>
                        <div className="flex flex-wrap gap-2 mb-3">
                          {mod.canPublishEducational && (
                            <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full flex items-center gap-1">
                              <BookOpen className="w-3 h-3" />
                              ينشر تعليمي
                            </span>
                          )}
                          {mod.canModerate && (
                            <span className="text-xs bg-orange-100 text-orange-700 px-2 py-1 rounded-full flex items-center gap-1">
                              <Shield className="w-3 h-3" />
                              يشرف
                            </span>
                          )}
                        </div>
                        <div className="flex gap-2">
                          <Button variant="outline" size="sm">
                            <Edit className="w-3 h-3 ml-1" />
                            تعديل
                          </Button>
                          <Button variant="outline" size="sm" className="text-red-600">
                            <Trash2 className="w-3 h-3 ml-1" />
                            حذف
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}


        {/* Education Tab */}
        {activeTab === "education" && (
          <div className="space-y-4">
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="grid grid-cols-5 gap-0 border-b border-gray-200">
                <button
                  onClick={() => setEduSubTab("events")}
                  className={cn(
                    "p-3 text-center font-medium transition-all border-b-2 flex items-center justify-center gap-1",
                    eduSubTab === "events"
                      ? "border-green-600 text-green-600 bg-green-50"
                      : "border-transparent text-gray-600 hover:bg-gray-50"
                  )}
                >
                  <Calendar className="w-4 h-4" />
                  الندوات
                </button>
                <button
                  onClick={() => setEduSubTab("courses")}
                  className={cn(
                    "p-3 text-center font-medium transition-all border-b-2",
                    eduSubTab === "courses"
                      ? "border-blue-600 text-blue-600 bg-blue-50"
                      : "border-transparent text-gray-600 hover:bg-gray-50"
                  )}
                >
                  الدورات
                </button>
                <button
                  onClick={() => setEduSubTab("content")}
                  className={cn(
                    "p-3 text-center font-medium transition-all border-b-2",
                    eduSubTab === "content"
                      ? "border-purple-600 text-purple-600 bg-purple-50"
                      : "border-transparent text-gray-600 hover:bg-gray-50"
                  )}
                >
                  المحتوى
                </button>
                <button
                  onClick={() => setEduSubTab("sources")}
                  className={cn(
                    "p-3 text-center font-medium transition-all border-b-2",
                    eduSubTab === "sources"
                      ? "border-amber-600 text-amber-600 bg-amber-50"
                      : "border-transparent text-gray-600 hover:bg-gray-50"
                  )}
                >
                  المصادر
                </button>
                <button
                  onClick={() => setEduSubTab("3d")}
                  className={cn(
                    "p-3 text-center font-medium transition-all border-b-2",
                    eduSubTab === "3d"
                      ? "border-orange-600 text-orange-600 bg-orange-50"
                      : "border-transparent text-gray-600 hover:bg-gray-50"
                  )}
                >
                  3D
                </button>
              </div>
            </div>

            {/* Events Subsection */}
            {eduSubTab === "events" && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-bold text-gray-900">إدارة الندوات والفعاليات</h3>
                  <Button
                    onClick={() => setShowEventDialog(true)}
                    className="bg-green-600 hover:bg-green-700"
                  >
                    <Plus className="w-4 h-4 ml-2" />
                    إضافة ندوة
                  </Button>
                </div>

                <div className="space-y-3">
                  {events.map((event) => (
                    <Card key={event.id}>
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                          <div className="flex-1">
                            <h3 className="font-semibold text-gray-900 mb-1">{event.arabicTitle}</h3>
                            <div className="flex flex-wrap gap-3 text-sm text-gray-600">
                              <span className="flex items-center gap-1">
                                <Calendar className="w-4 h-4" />
                                {new Date(event.startDate).toLocaleDateString("ar-IQ")}
                              </span>
                              <span className="flex items-center gap-1">
                                <Users className="w-4 h-4" />
                                {event.attendees}/{event.maxAttendees} مشارك
                              </span>
                              <span className={cn(
                                "px-2 py-1 rounded-full text-xs font-medium",
                                event.status === "upcoming" ? "bg-blue-100 text-blue-700" : "bg-green-100 text-green-700"
                              )}>
                                {event.status === "upcoming" ? "قادم" : "منتهي"}
                              </span>
                            </div>
                          </div>
                          <div className="flex gap-2">
                            <Button variant="outline" size="sm">
                              <Edit className="w-3 h-3" />
                            </Button>
                            <Button variant="outline" size="sm" className="text-red-600">
                              <Trash2 className="w-3 h-3" />
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            )}

            {/* Content Subsection */}
            {eduSubTab === "content" && (
              <div className="space-y-4">
                <div className="bg-gradient-to-r from-purple-600 to-pink-600 rounded-xl p-4 text-white">
                  <div className="flex items-center gap-2 mb-2">
                    <Sparkles className="w-5 h-5" />
                    <h3 className="font-bold">المحتوى التعليمي من النخبة</h3>
                  </div>
                  <p className="text-purple-100 text-sm">
                    يمكن فقط لأعضاء النخبة نشر المحتوى التعليمي. يتم مراجعته وتفعيله هنا.
                  </p>
                </div>

                <div className="space-y-3">
                  {educationalContent.map((content) => (
                    <Card key={content.id}>
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <h3 className="font-semibold text-gray-900">{content.title}</h3>
                              {content.isPinned && <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />}
                            </div>
                            <p className="text-sm text-gray-600 mb-2">بواسطة: {content.author}</p>
                            <div className="flex gap-4 text-sm text-gray-600">
                              <span className="flex items-center gap-1">
                                <Eye className="w-4 h-4" />
                                {content.views}
                              </span>
                              <span className="flex items-center gap-1">
                                <Heart className="w-4 h-4" />
                                {content.likes}
                              </span>
                              <span className={cn(
                                "px-2 py-1 rounded-full text-xs font-medium",
                                content.status === "approved" ? "bg-green-100 text-green-700" : "bg-yellow-100 text-yellow-700"
                              )}>
                                {content.status === "approved" ? "معتمد" : "قيد المراجعة"}
                              </span>
                            </div>
                          </div>
                          <div className="flex gap-2">
                            <Button variant="outline" size="sm">
                              <Edit className="w-3 h-3" />
                            </Button>
                            <Button variant="outline" size="sm" className="text-red-600">
                              <Trash2 className="w-3 h-3" />
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            )}

            {/* Sources Subsection */}
            {eduSubTab === "sources" && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-bold text-gray-900">المصادر الموثوقة</h3>
                  <Button
                    onClick={() => setShowSourceDialog(true)}
                    className="bg-green-600 hover:bg-green-700"
                  >
                    <Plus className="w-4 h-4 ml-2" />
                    إضافة مصدر
                  </Button>
                </div>

                <div className="space-y-3">
                  {trustedSources.map((source) => (
                    <Card key={source.id}>
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                          <div className="flex-1">
                            <h3 className="font-semibold text-gray-900 mb-1">{source.arabicTitle}</h3>
                            <p className="text-sm text-gray-600 mb-2">{source.sourceName} - {source.sourceType}</p>
                            <a href={source.sourceUrl} target="_blank" rel="noopener noreferrer" className="text-sm text-blue-600 hover:underline flex items-center gap-1">
                              <Globe className="w-3 h-3" />
                              رابط المصدر
                            </a>
                          </div>
                          <div className="flex gap-2">
                            <Switch checked={source.isActive} />
                            <Button variant="outline" size="sm" className="text-red-600">
                              <Trash2 className="w-3 h-3" />
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            )}

            {/* 3D Subsection */}
            {eduSubTab === "3d" && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-bold text-gray-900">نماذج 3D من Sketchfab</h3>
                  <Button
                    onClick={() => setShow3DDialog(true)}
                    className="bg-orange-600 hover:bg-orange-700"
                  >
                    <Plus className="w-4 h-4 ml-2" />
                    إضافة نموذج 3D
                  </Button>
                </div>

                <div className="bg-blue-50 rounded-xl p-4 border border-blue-200 mb-4">
                  <div className="flex items-start gap-2">
                    <Box className="w-5 h-5 text-blue-600 mt-0.5" />
                    <div>
                      <h4 className="font-semibold text-blue-900 mb-1">عن Sketchfab</h4>
                      <p className="text-sm text-blue-700">
                        يمكنك إضافة روابط من Sketchfab لمجموعات (Collections)، مستخدمين (Users)، أو نماذج فردية (Models).
                        سيتم عرضها كمقالات ثلاثية الأبعاد تفاعلية.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  {models3D.map((model) => (
                    <Card key={model.id}>
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                          <div className="flex-1">
                            <h3 className="font-semibold text-gray-900 mb-1">{model.arabicTitle}</h3>
                            <div className="flex items-center gap-2 text-sm text-gray-600 mb-2">
                              <span className="bg-orange-100 text-orange-700 px-2 py-1 rounded text-xs">
                                {model.sketchfabType === "collection" ? "مجموعة" : model.sketchfabType === "user" ? "مستخدم" : "نموذج"}
                              </span>
                              <a href={model.sketchfabUrl} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline flex items-center gap-1">
                                <LinkIcon className="w-3 h-3" />
                                Sketchfab
                              </a>
                            </div>
                          </div>
                          <div className="flex gap-2">
                            <Switch checked={model.isActive} />
                            <Button variant="outline" size="sm" className="text-red-600">
                              <Trash2 className="w-3 h-3" />
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Moderator Dialog */}
      <Dialog open={showModeratorDialog} onOpenChange={setShowModeratorDialog}>
        <DialogContent className="max-w-2xl" dir="rtl">
          <DialogHeader>
            <DialogTitle>إضافة مشرف / نخبة</DialogTitle>
            <DialogDescription>
              قم بتعيين عضو كمشرف أو من النخبة مع تحديد المحافظة والصلاحيات
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>اختر العضو</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="اختر من القائمة" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1">د. أحمد محمد</SelectItem>
                    <SelectItem value="2">د. فاطمة علي</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <Label>الدور</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="اختر الدور" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="moderator">مشرف</SelectItem>
                    <SelectItem value="elite">نخبة</SelectItem>
                    <SelectItem value="featured">مميز</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div>
              <Label>المحافظة العراقية</Label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="اختر المحافظة" />
                </SelectTrigger>
                <SelectContent>
                  {IRAQI_PROVINCES.map((province) => (
                    <SelectItem key={province} value={province}>{province}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label>الوسم</Label>
              <Input placeholder="مثال: نخبة بغداد" />
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <Label>يمكنه النشر في المحتوى التعليمي</Label>
                <Switch />
              </div>
              <div className="flex items-center justify-between">
                <Label>يمكنه الإشراف على المنشورات</Label>
                <Switch />
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowModeratorDialog(false)}>
              إلغاء
            </Button>
            <Button className="bg-blue-600 hover:bg-blue-700">
              حفظ
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Similar dialogs for Events, Sources, and 3D would go here */}
    </div>
  );
}
