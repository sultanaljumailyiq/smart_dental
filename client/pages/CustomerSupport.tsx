import React, { useState } from "react";
import {
  MessageCircle,
  Brain,
  Clock,
  CheckCircle,
  AlertCircle,
  User,
  Phone,
  Mail,
  Search,
  Filter,
  Plus,
  Send,
  Paperclip,
  Smile,
  MoreHorizontal,
  Star,
  RefreshCw,
  Zap,
  HeadphonesIcon,
  BookOpen,
  HelpCircle,
  FileText,
  Users,
  TrendingUp,
  Target,
  Award,
  Activity,
  Eye,
  Edit,
  Trash2,
  Flag,
  Calendar,
  BarChart3,
  Headphones,
  MessageSquare,
  ThumbsUp,
  ThumbsDown,
  Timer,
} from "lucide-react";
import { cn } from "@/lib/utils";

const supportTickets = [
  {
    id: "T-001",
    patient: "سارة أحمد",
    subject: "إعادة جدولة الموعد",
    status: "مفتوح",
    priority: "متوسط",
    created: "2024-01-15T10:30:00Z",
    lastUpdate: "2024-01-15T14:20:00Z",
    assignedTo: "��يزا طومسون",
    category: "جدولة",
    aiResolved: false,
    description: "أحتاج إلى تغيير موعدي من الثلاثاء إلى الخميس",
    satisfaction: null,
  },
  {
    id: "T-002",
    patient: "محمد براون",
    subject: "استفسار حول الفاتورة",
    status: "محلول",
    priority: "منخفض",
    created: "2024-01-14T09:15:00Z",
    lastUpdate: "2024-01-14T16:45:00Z",
    assignedTo: "مساعد ذكي",
    category: "فوترة",
    aiResolved: true,
    description: "لديّ سؤال حول رسوم العلاج في فاتورتي الأخيرة",
    satisfaction: 5,
  },
  {
    id: "T-003",
    patient: "فاطمة علي",
    subject: "مشكلة في الدفع الإلكتروني",
    status: "قيد المعالجة",
    priority: "عالي",
    created: "2024-01-13T15:20:00Z",
    lastUpdate: "2024-01-15T11:30:00Z",
    assignedTo: "أحمد سالم",
    category: "دفع",
    aiResolved: false,
    description: "لا أستطيع إكمال الدفع عبر البطاقة الائتمانية",
    satisfaction: null,
  },
  {
    id: "T-004",
    patient: "عمر خالد",
    subject: "تأكيد موعد الجراحة",
    status: "محلول",
    priority: "عالي",
    created: "2024-01-12T08:45:00Z",
    lastUpdate: "2024-01-12T17:20:00Z",
    assignedTo: "د. سارة أحمد",
    category: "طبي",
    aiResolved: false,
    description: "أريد تأكيد تفاصيل عملية زراعة الأسنان المجدولة",
    satisfaction: 5,
  },
  {
    id: "T-005",
    patient: "نور حسين",
    subject: "طلب تقرير طبي",
    status: "مفتوح",
    priority: "متوسط",
    created: "2024-01-11T14:10:00Z",
    lastUpdate: "2024-01-15T09:15:00Z",
    assignedTo: "مساعد ذكي",
    category: "تقارير",
    aiResolved: true,
    description: "أحتاج إلى تقرير طبي لشركة التأمين",
    satisfaction: null,
  },
];

const CustomerSupport = () => {
  const [selectedTicket, setSelectedTicket] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [selectedPriority, setSelectedPriority] = useState("all");

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "مفتوح":
        return (
          <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-700">
            <AlertCircle className="w-3 h-3" />
            مفتوح
          </span>
        );
      case "قيد المعالجة":
        return (
          <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-700">
            <Clock className="w-3 h-3" />
            قيد المعالجة
          </span>
        );
      case "محلول":
        return (
          <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-700">
            <CheckCircle className="w-3 h-3" />
            محلول
          </span>
        );
      default:
        return null;
    }
  };

  const getPriorityBadge = (priority: string) => {
    const priorityConfig = {
      عالي: { color: "bg-red-100 text-red-700", icon: Flag },
      متوسط: { color: "bg-yellow-100 text-yellow-700", icon: Clock },
      منخفض: { color: "bg-green-100 text-green-700", icon: Target },
    };

    const config = priorityConfig[priority as keyof typeof priorityConfig];
    if (!config) return null;

    const IconComponent = config.icon;
    return (
      <span
        className={cn(
          "inline-flex items-center gap-1 px-2 py-1 rounded-lg text-xs font-medium",
          config.color,
        )}
      >
        <IconComponent className="w-3 h-3" />
        {priority}
      </span>
    );
  };

  const filteredTickets = supportTickets.filter((ticket) => {
    const matchesSearch =
      ticket.patient.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ticket.subject.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus =
      selectedStatus === "all" || ticket.status === selectedStatus;
    const matchesPriority =
      selectedPriority === "all" || ticket.priority === selectedPriority;
    return matchesSearch && matchesStatus && matchesPriority;
  });

  const supportStats = {
    total: supportTickets.length,
    open: supportTickets.filter((t) => t.status === "مفتوح").length,
    inProgress: supportTickets.filter((t) => t.status === "قيد المعالجة")
      .length,
    resolved: supportTickets.filter((t) => t.status === "محلول").length,
    aiResolved: supportTickets.filter((t) => t.aiResolved).length,
    avgSatisfaction:
      supportTickets
        .filter((t) => t.satisfaction !== null)
        .reduce((sum, t) => sum + (t.satisfaction || 0), 0) /
        supportTickets.filter((t) => t.satisfaction !== null).length || 0,
  };

  return (
    <div className="space-y-6" dir="rtl">
      {/* Header Section */}
      <div className="bg-gradient-to-r from-green-600 via-teal-600 to-blue-600 rounded-3xl p-8 text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="absolute top-0 right-0 w-40 h-40 bg-white/10 rounded-full -translate-y-16 translate-x-16"></div>
        <div className="absolute bottom-0 left-0 w-32 h-32 bg-white/10 rounded-full translate-y-16 -translate-x-16"></div>
        <div className="relative z-10">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold mb-2">مركز الدعم الفني</h1>
              <p className="text-green-100 text-lg mb-4">
                خدمة عملاء متطورة مع دعم الذكاء الاصطناعي
              </p>
              <p className="text-green-100">
                {supportStats.total} تذكرة، {supportStats.aiResolved} حلها
                الذكاء الاصطناعي، متوسط الرضا:{" "}
                {supportStats.avgSatisfaction.toFixed(1)}/5
              </p>
            </div>
            <div className="flex gap-3">
              <button className="bg-white/20 backdrop-blur-sm px-6 py-3 rounded-xl text-white font-medium hover:bg-white/30 transition-all flex items-center gap-2">
                <BarChart3 className="w-5 h-5" />
                تقرير الأداء
              </button>
              <button className="bg-white text-green-600 px-6 py-3 rounded-xl font-medium hover:bg-green-50 transition-all flex items-center gap-2">
                <Plus className="w-5 h-5" />
                تذكرة جديدة
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Support Overview - Bento Style */}
      <div className="grid grid-cols-12 gap-6">
        {/* Main Support Stats */}
        <div className="col-span-12 lg:col-span-8 bg-white rounded-3xl p-8 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-bold text-gray-900">
              نظرة عامة على الدعم
            </h3>
            <MessageCircle className="w-6 h-6 text-gray-400" />
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div className="text-center p-6 bg-blue-50 rounded-3xl border border-blue-100">
              <div className="w-16 h-16 bg-blue-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <MessageCircle className="w-8 h-8 text-blue-600" />
              </div>
              <p className="text-3xl font-bold text-blue-600 mb-2">
                {supportStats.total}
              </p>
              <p className="text-sm font-medium text-blue-700">
                إجمالي التذاكر
              </p>
            </div>

            <div className="text-center p-6 bg-green-50 rounded-3xl border border-green-100">
              <div className="w-16 h-16 bg-green-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="w-8 h-8 text-green-600" />
              </div>
              <p className="text-3xl font-bold text-green-600 mb-2">
                {supportStats.resolved}
              </p>
              <p className="text-sm font-medium text-green-700">محلولة</p>
            </div>

            <div className="text-center p-6 bg-purple-50 rounded-3xl border border-purple-100">
              <div className="w-16 h-16 bg-purple-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Brain className="w-8 h-8 text-purple-600" />
              </div>
              <p className="text-3xl font-bold text-purple-600 mb-2">
                {supportStats.aiResolved}
              </p>
              <p className="text-sm font-medium text-purple-700">
                ذكاء اصطناعي
              </p>
            </div>

            <div className="text-center p-6 bg-yellow-50 rounded-3xl border border-yellow-100">
              <div className="w-16 h-16 bg-yellow-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Star className="w-8 h-8 text-yellow-600" />
              </div>
              <p className="text-3xl font-bold text-yellow-600 mb-2">
                {supportStats.avgSatisfaction.toFixed(1)}
              </p>
              <p className="text-sm font-medium text-yellow-700">متوسط الرضا</p>
            </div>
          </div>

          {/* Response Time Chart */}
          <div>
            <h4 className="text-lg font-semibold text-gray-800 mb-4">
              أوقات الاستجابة اليومية
            </h4>
            <div className="h-32 bg-gradient-to-r from-green-50 to-blue-50 rounded-2xl p-6">
              <div className="grid grid-cols-7 gap-2 h-full">
                {[12, 8, 15, 6, 20, 10, 14].map((time, index) => (
                  <div
                    key={index}
                    className="flex flex-col items-center justify-end space-y-2"
                  >
                    <div className="text-center">
                      <div className="text-xs text-gray-600 mb-1">{time}د</div>
                      <div
                        className="bg-gradient-to-t from-green-500 to-blue-500 rounded-t-lg w-6 transition-all duration-300"
                        style={{ height: `${(time / 25) * 100}%` }}
                      ></div>
                    </div>
                    <span className="text-xs text-gray-600">
                      {["س", "ح", "ث", "ر", "خ", "ج", "ب"][index]}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* AI Assistant & Quick Actions */}
        <div className="col-span-12 lg:col-span-4 space-y-6">
          {/* AI Assistant */}
          <div className="bg-gradient-to-br from-purple-50 to-blue-50 rounded-3xl p-6 border border-purple-100">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 bg-gradient-to-r from-purple-600 to-blue-600 rounded-2xl flex items-center justify-center">
                <Brain className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-gray-900">
                  المساعد الذكي
                </h3>
                <p className="text-sm text-purple-700">نشط الآن</p>
              </div>
            </div>

            <div className="space-y-3">
              <div className="bg-white rounded-xl p-3 border border-purple-100">
                <p className="text-sm text-purple-800 font-medium">
                  حل {supportStats.aiResolved} تذكرة تلقائياً
                </p>
                <p className="text-xs text-purple-600">
                  توفير 85% من وقت الاستجابة
                </p>
              </div>

              <div className="bg-white rounded-xl p-3 border border-purple-100">
                <p className="text-sm text-purple-800 font-medium">
                  تحليل المشاعر: إيجابي
                </p>
                <p className="text-xs text-purple-600">92% من العملاء راضون</p>
              </div>

              <button className="w-full bg-gradient-to-r from-purple-600 to-blue-600 text-white py-3 rounded-xl font-medium hover:from-purple-700 hover:to-blue-700 transition-all flex items-center justify-center gap-2">
                <Zap className="w-4 h-4" />
                تحسين الأداء
              </button>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100">
            <h3 className="text-lg font-bold text-gray-900 mb-6">
              إجراءات سريعة
            </h3>
            <div className="space-y-4">
              <button className="w-full flex items-center gap-4 p-4 bg-green-50 rounded-2xl hover:bg-green-100 transition-all group">
                <div className="w-12 h-12 bg-green-600 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Plus className="w-6 h-6 text-white" />
                </div>
                <div className="text-right">
                  <p className="font-medium text-green-800">تذكرة جديدة</p>
                  <p className="text-sm text-green-600">إنشاء طلب دعم</p>
                </div>
              </button>

              <button className="w-full flex items-center gap-4 p-4 bg-blue-50 rounded-2xl hover:bg-blue-100 transition-all group">
                <div className="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                  <BookOpen className="w-6 h-6 text-white" />
                </div>
                <div className="text-right">
                  <p className="font-medium text-blue-800">قاعدة المعرفة</p>
                  <p className="text-sm text-blue-600">البحث في الحلول</p>
                </div>
              </button>

              <button className="w-full flex items-center gap-4 p-4 bg-orange-50 rounded-2xl hover:bg-orange-100 transition-all group">
                <div className="w-12 h-12 bg-orange-600 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Headphones className="w-6 h-6 text-white" />
                </div>
                <div className="text-right">
                  <p className="font-medium text-orange-800">مكالمة طوارئ</p>
                  <p className="text-sm text-orange-600">تواصل فوري</p>
                </div>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Search and Filter */}
      <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100">
        <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
          <div className="flex flex-col sm:flex-row gap-4 w-full lg:w-auto">
            <div className="relative">
              <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="البحث في التذاكر..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-4 pr-12 py-3 bg-gray-50 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent w-full sm:w-64"
              />
            </div>

            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="px-4 py-3 bg-gray-50 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
            >
              <option value="all">جميع الحالات</option>
              <option value="مفتوح">مفتوح</option>
              <option value="قيد المعالجة">قيد المعالجة</option>
              <option value="محلول">محلول</option>
            </select>

            <select
              value={selectedPriority}
              onChange={(e) => setSelectedPriority(e.target.value)}
              className="px-4 py-3 bg-gray-50 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
            >
              <option value="all">جميع الأولويات</option>
              <option value="عالي">عالي</option>
              <option value="متوسط">متوسط</option>
              <option value="منخفض">منخفض</option>
            </select>
          </div>
        </div>
      </div>

      {/* Support Tickets */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {filteredTickets.map((ticket) => (
          <div
            key={ticket.id}
            className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 hover:shadow-lg transition-all duration-300 group"
          >
            <div className="flex items-start justify-between mb-4">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-sm font-mono text-gray-500">
                    {ticket.id}
                  </span>
                  {ticket.aiResolved && (
                    <div className="w-6 h-6 bg-purple-100 rounded-lg flex items-center justify-center">
                      <Brain className="w-4 h-4 text-purple-600" />
                    </div>
                  )}
                </div>
                <h3 className="font-bold text-gray-900 group-hover:text-green-600 transition-colors">
                  {ticket.subject}
                </h3>
                <p className="text-sm text-gray-600">{ticket.patient}</p>
                <div className="flex items-center gap-2 mt-2">
                  {getStatusBadge(ticket.status)}
                  {getPriorityBadge(ticket.priority)}
                </div>
              </div>
              <button className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-xl transition-all">
                <MoreHorizontal className="w-5 h-5" />
              </button>
            </div>

            <div className="mb-4">
              <p className="text-sm text-gray-700 leading-relaxed">
                {ticket.description}
              </p>
            </div>

            <div className="space-y-2 mb-4">
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600">الفئة</span>
                <span className="font-semibold text-gray-900">
                  {ticket.category}
                </span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600">المسؤول</span>
                <span className="font-semibold text-gray-900">
                  {ticket.assignedTo}
                </span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600">تاريخ الإنشاء</span>
                <span className="text-gray-700">
                  {new Date(ticket.created).toLocaleDateString("ar-IQ")}
                </span>
              </div>
            </div>

            {/* Satisfaction Rating */}
            {ticket.satisfaction && (
              <div className="bg-yellow-50 rounded-2xl p-3 mb-4 border border-yellow-100">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-yellow-800">
                    تقييم العميل
                  </span>
                  <div className="flex items-center gap-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star
                        key={star}
                        className={cn(
                          "w-4 h-4",
                          star <= ticket.satisfaction!
                            ? "text-yellow-500 fill-current"
                            : "text-gray-300",
                        )}
                      />
                    ))}
                  </div>
                </div>
              </div>
            )}

            <div className="flex items-center justify-between pt-4 border-t border-gray-100">
              <div className="flex gap-2">
                <button className="p-2 text-green-600 hover:bg-green-100 rounded-xl transition-all">
                  <Eye className="w-4 h-4" />
                </button>
                <button className="p-2 text-blue-600 hover:bg-blue-100 rounded-xl transition-all">
                  <MessageSquare className="w-4 h-4" />
                </button>
                <button className="p-2 text-purple-600 hover:bg-purple-100 rounded-xl transition-all">
                  <Edit className="w-4 h-4" />
                </button>
              </div>
              <div className="text-xs text-gray-500">
                آخر تحديث:{" "}
                {new Date(ticket.lastUpdate).toLocaleDateString("ar-IQ")}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CustomerSupport;
