import React, { useState, useEffect } from "react";
import {
  Bell,
  X,
  Calendar,
  DollarSign,
  AlertCircle,
  Clock,
  User,
  MessageCircle,
  Heart,
  Star,
  CheckCircle,
  Archive,
  Settings,
  Filter,
  Search,
  MoreHorizontal,
  FileText,
  Shield,
  Zap,
  TrendingUp,
  Users,
  Phone,
  Mail,
  MapPin,
  Activity,
  Award,
  Target,
  Bookmark,
  Share2,
  Download,
  Eye,
  EyeOff,
  Trash2,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface Notification {
  id: string;
  title: string;
  message: string;
  time: string;
  timestamp: Date;
  type:
    | "appointment"
    | "payment"
    | "reminder"
    | "emergency"
    | "system"
    | "message"
    | "achievement";
  priority: "low" | "medium" | "high" | "urgent";
  read: boolean;
  category: string;
  icon: React.ComponentType<any>;
  color: string;
  avatar?: string;
  sender?: string;
  attachments?: Array<{
    id: string;
    name: string;
    type: "pdf" | "image" | "document";
    size: string;
    url: string;
  }>;
  actions?: Array<{
    id: string;
    label: string;
    action: () => void;
    variant: "primary" | "secondary" | "danger";
  }>;
  metadata?: {
    patientName?: string;
    appointmentDate?: string;
    amount?: string;
    clinicName?: string;
    doctorName?: string;
  };
}

const sampleNotifications: Notification[] = [
  {
    id: "1",
    title: "موعد جديد مؤكد",
    message:
      "تم تأكيد موعد المريض أحمد محمد للفحص الدوري غداً الساعة 10:00 صباحاً",
    time: "منذ 5 دقائق",
    timestamp: new Date(Date.now() - 5 * 60 * 1000),
    type: "appointment",
    priority: "high",
    read: false,
    category: "المواعيد",
    icon: Calendar,
    color: "blue",
    sender: "نظام المواعيد",
    metadata: {
      patientName: "أحمد محمد",
      appointmentDate: "غداً - 10:00 ص",
      clinicName: "عيادة الدكتور أحمد",
    },
    actions: [
      {
        id: "view",
        label: "عرض التفاصيل",
        action: () => {},
        variant: "primary",
      },
      {
        id: "reschedule",
        label: "إعادة جدولة",
        action: () => {},
        variant: "secondary",
      },
    ],
  },
  {
    id: "2",
    title: "تم استلام دفعة مالية",
    message:
      "تم استلام دفعة بقيمة 250,000 دينار من المريض فاطمة علي عن علاج تقويم الأسنان",
    time: "منذ 15 دقيقة",
    timestamp: new Date(Date.now() - 15 * 60 * 1000),
    type: "payment",
    priority: "medium",
    read: false,
    category: "المالية",
    icon: DollarSign,
    color: "green",
    sender: "النظام المالي",
    metadata: {
      patientName: "فاطمة علي",
      amount: "250,000 دينار",
      clinicName: "عيادة الدكتور أحمد",
    },
    attachments: [
      {
        id: "receipt1",
        name: "إيصال_الدفع_250k.pdf",
        type: "pdf",
        size: "1.2 MB",
        url: "#",
      },
    ],
    actions: [
      {
        id: "download",
        label: "تحميل الإيصال",
        action: () => {},
        variant: "primary",
      },
      { id: "print", label: "طباعة", action: () => {}, variant: "secondary" },
    ],
  },
  {
    id: "3",
    title: "تذكير بموعد مهم",
    message:
      "تذكير: لديك موعد مع المريض سارة ��حمد غداً الساعة 2:00 مساءً لزراعة الأسنان",
    time: "منذ ساعة",
    timestamp: new Date(Date.now() - 60 * 60 * 1000),
    type: "reminder",
    priority: "medium",
    read: true,
    category: "التذكيرات",
    icon: Clock,
    color: "orange",
    sender: "مساعد التذكير",
    metadata: {
      patientName: "سارة أحمد",
      appointmentDate: "غداً - 2:00 م",
      doctorName: "د. أحمد الرحمة",
    },
  },
  {
    id: "4",
    title: "حالة طوارئ",
    message:
      "استدعاء عاجل: المريض محمد خالد يحتاج لتدخل طبي فوري بسبب ألم شديد في الأسنان",
    time: "منذ 2 ساعة",
    timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
    type: "emergency",
    priority: "urgent",
    read: true,
    category: "الطوارئ",
    icon: AlertCircle,
    color: "red",
    sender: "خط الطوارئ",
    metadata: {
      patientName: "محمد خالد",
      clinicName: "عيادة الطوارئ",
    },
    actions: [
      { id: "call", label: "اتصال فوري", action: () => {}, variant: "danger" },
      {
        id: "emergency",
        label: "بروتوكول الطوارئ",
        action: () => {},
        variant: "primary",
      },
    ],
  },
  {
    id: "5",
    title: "رسالة من المريض",
    message:
      '"شكراً لكم على الخدمة الممتازة، أنا راضية جداً عن نتائج التبييض" - ليلى أحمد',
    time: "منذ 3 ساعات",
    timestamp: new Date(Date.now() - 3 * 60 * 60 * 1000),
    type: "message",
    priority: "low",
    read: true,
    category: "الرسائل",
    icon: MessageCircle,
    color: "purple",
    sender: "ليلى أحمد",
    avatar:
      "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=64&h=64&fit=crop&crop=face",
    actions: [
      { id: "reply", label: "رد", action: () => {}, variant: "primary" },
      { id: "save", label: "حفظ", action: () => {}, variant: "secondary" },
    ],
  },
  {
    id: "6",
    title: "إنجاز جديد",
    message:
      "مبروك! لقد حققت هدف 100 مريض راضي هذا الشهر. تم منحك شارة 'طبيب مميز'",
    time: "منذ يوم",
    timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000),
    type: "achievement",
    priority: "low",
    read: true,
    category: "الإنجازات",
    icon: Award,
    color: "yellow",
    sender: "نظام التقييم",
  },
];

const notificationCategories = [
  { id: "all", label: "الكل", count: sampleNotifications.length },
  {
    id: "المواعيد",
    label: "المواعيد",
    count: sampleNotifications.filter((n) => n.category === "المواعيد").length,
  },
  {
    id: "المالية",
    label: "المالية",
    count: sampleNotifications.filter((n) => n.category === "المالية").length,
  },
  {
    id: "الطوارئ",
    label: "الطوارئ",
    count: sampleNotifications.filter((n) => n.category === "الطوارئ").length,
  },
  {
    id: "الرسائل",
    label: "الرسائل",
    count: sampleNotifications.filter((n) => n.category === "الرسائل").length,
  },
];

interface ComprehensiveNotificationCenterProps {
  isOpen: boolean;
  onClose: () => void;
  notifications?: Notification[];
}

export default function ComprehensiveNotificationCenter({
  isOpen,
  onClose,
  notifications = sampleNotifications,
}: ComprehensiveNotificationCenterProps) {
  const [activeCategory, setActiveCategory] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedNotification, setSelectedNotification] =
    useState<Notification | null>(null);
  const [showFilters, setShowFilters] = useState(false);
  const [sortBy, setSortBy] = useState<"time" | "priority" | "type">("time");

  const filteredNotifications = notifications.filter((notification) => {
    const matchesCategory =
      activeCategory === "all" || notification.category === activeCategory;
    const matchesSearch =
      notification.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      notification.message.toLowerCase().includes(searchQuery.toLowerCase()) ||
      notification.sender?.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const sortedNotifications = [...filteredNotifications].sort((a, b) => {
    switch (sortBy) {
      case "time":
        return b.timestamp.getTime() - a.timestamp.getTime();
      case "priority":
        const priorityOrder = { urgent: 4, high: 3, medium: 2, low: 1 };
        return priorityOrder[b.priority] - priorityOrder[a.priority];
      case "type":
        return a.type.localeCompare(b.type);
      default:
        return 0;
    }
  });

  const unreadCount = notifications.filter((n) => !n.read).length;

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "urgent":
        return "bg-red-100 text-red-700 border-red-200";
      case "high":
        return "bg-orange-100 text-orange-700 border-orange-200";
      case "medium":
        return "bg-yellow-100 text-yellow-700 border-yellow-200";
      case "low":
        return "bg-gray-100 text-gray-700 border-gray-200";
      default:
        return "bg-gray-100 text-gray-700 border-gray-200";
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case "appointment":
        return "text-blue-600 bg-blue-100";
      case "payment":
        return "text-green-600 bg-green-100";
      case "emergency":
        return "text-red-600 bg-red-100";
      case "reminder":
        return "text-orange-600 bg-orange-100";
      case "message":
        return "text-purple-600 bg-purple-100";
      case "achievement":
        return "text-yellow-600 bg-yellow-100";
      default:
        return "text-gray-600 bg-gray-100";
    }
  };

  const markAsRead = (notificationId: string) => {
    // In a real app, this would update the backend
    console.log("Marking notification as read:", notificationId);
  };

  const markAllAsRead = () => {
    notifications.forEach((n) => {
      if (!n.read) markAsRead(n.id);
    });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl h-[90vh] flex flex-col mx-4">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center gap-3">
            <div className="relative">
              <Bell className="w-6 h-6 text-blue-600" />
              {unreadCount > 0 && (
                <div className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {unreadCount}
                </div>
              )}
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900">
                مركز التنبيهات
              </h2>
              <p className="text-sm text-gray-600">
                {unreadCount > 0
                  ? `${unreadCount} تنبيه غير مقروء`
                  : "جميع التنبيهات مقروءة"}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {unreadCount > 0 && (
              <button
                onClick={markAllAsRead}
                className="text-sm text-blue-600 hover:text-blue-800 font-medium"
              >
                تحديد الكل كمقروء
              </button>
            )}
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={cn(
                "p-2 rounded-lg transition-colors",
                showFilters ? "bg-blue-100 text-blue-600" : "hover:bg-gray-100",
              )}
            >
              <Filter className="w-5 h-5" />
            </button>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Filters and Search */}
        <div className="p-4 border-b border-gray-200">
          {/* Search */}
          <div className="relative mb-4">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="البحث في التنبيهات..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          {/* Categories */}
          <div className="flex gap-2 mb-3 overflow-x-auto">
            {notificationCategories.map((category) => (
              <button
                key={category.id}
                onClick={() => setActiveCategory(category.id)}
                className={cn(
                  "px-3 py-2 rounded-lg text-sm font-medium transition-colors whitespace-nowrap flex items-center gap-2",
                  activeCategory === category.id
                    ? "bg-blue-600 text-white"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200",
                )}
              >
                {category.label}
                <span
                  className={cn(
                    "px-2 py-1 rounded-full text-xs",
                    activeCategory === category.id
                      ? "bg-white/20 text-white"
                      : "bg-white text-gray-600",
                  )}
                >
                  {category.count}
                </span>
              </button>
            ))}
          </div>

          {/* Advanced Filters */}
          {showFilters && (
            <div className="flex gap-4 pt-3 border-t border-gray-100">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="px-3 py-2 border border-gray-300 rounded-lg text-sm"
              >
                <option value="time">ترتيب حسب الوقت</option>
                <option value="priority">ترتيب حسب الأولوية</option>
                <option value="type">ترتيب حسب النوع</option>
              </select>
            </div>
          )}
        </div>

        {/* Notifications List */}
        <div className="flex-1 overflow-hidden">
          <div className="h-full overflow-y-auto">
            {sortedNotifications.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-gray-500">
                <Bell className="w-12 h-12 mb-3 opacity-50" />
                <h3 className="text-lg font-medium mb-1">لا توجد تنبيهات</h3>
                <p className="text-sm">لم يتم العثور على تنبيهات تطابق البحث</p>
              </div>
            ) : (
              <div className="space-y-2 p-4">
                {sortedNotifications.map((notification) => (
                  <div
                    key={notification.id}
                    onClick={() => {
                      setSelectedNotification(notification);
                      if (!notification.read) markAsRead(notification.id);
                    }}
                    className={cn(
                      "p-4 rounded-xl border transition-all duration-200 cursor-pointer hover:shadow-md",
                      notification.read
                        ? "bg-white border-gray-200"
                        : "bg-blue-50 border-blue-200 shadow-sm",
                    )}
                  >
                    <div className="flex items-start gap-3">
                      {/* Icon/Avatar */}
                      <div className="flex-shrink-0">
                        {notification.avatar ? (
                          <img
                            src={notification.avatar}
                            alt={notification.sender}
                            className="w-10 h-10 rounded-full object-cover"
                          />
                        ) : (
                          <div
                            className={cn(
                              "w-10 h-10 rounded-full flex items-center justify-center",
                              getTypeColor(notification.type),
                            )}
                          >
                            <notification.icon className="w-5 h-5" />
                          </div>
                        )}
                      </div>

                      {/* Content */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between mb-2">
                          <div className="flex-1">
                            <h4 className="font-semibold text-gray-900 mb-1">
                              {notification.title}
                            </h4>
                            <p className="text-sm text-gray-600 line-clamp-2">
                              {notification.message}
                            </p>
                          </div>
                          <div className="flex flex-col items-end gap-2 ml-3">
                            <span className="text-xs text-gray-500">
                              {notification.time}
                            </span>
                            <span
                              className={cn(
                                "px-2 py-1 rounded-full text-xs font-medium border",
                                getPriorityColor(notification.priority),
                              )}
                            >
                              {notification.priority === "urgent"
                                ? "عاجل"
                                : notification.priority === "high"
                                  ? "عالي"
                                  : notification.priority === "medium"
                                    ? "متوسط"
                                    : "منخفض"}
                            </span>
                          </div>
                        </div>

                        {/* Metadata */}
                        {notification.metadata && (
                          <div className="flex flex-wrap gap-3 text-xs text-gray-500 mb-2">
                            {notification.metadata.patientName && (
                              <div className="flex items-center gap-1">
                                <User className="w-3 h-3" />
                                {notification.metadata.patientName}
                              </div>
                            )}
                            {notification.metadata.appointmentDate && (
                              <div className="flex items-center gap-1">
                                <Calendar className="w-3 h-3" />
                                {notification.metadata.appointmentDate}
                              </div>
                            )}
                            {notification.metadata.amount && (
                              <div className="flex items-center gap-1">
                                <DollarSign className="w-3 h-3" />
                                {notification.metadata.amount}
                              </div>
                            )}
                          </div>
                        )}

                        {/* Actions */}
                        {notification.actions && (
                          <div className="flex gap-2 mt-3">
                            {notification.actions.slice(0, 2).map((action) => (
                              <button
                                key={action.id}
                                onClick={(e) => {
                                  e.stopPropagation();
                                  action.action();
                                }}
                                className={cn(
                                  "px-3 py-1 rounded-lg text-xs font-medium transition-colors",
                                  action.variant === "primary"
                                    ? "bg-blue-600 text-white hover:bg-blue-700"
                                    : action.variant === "danger"
                                      ? "bg-red-600 text-white hover:bg-red-700"
                                      : "bg-gray-100 text-gray-700 hover:bg-gray-200",
                                )}
                              >
                                {action.label}
                              </button>
                            ))}
                          </div>
                        )}

                        {/* Unread indicator */}
                        {!notification.read && (
                          <div className="absolute top-4 right-4 w-2 h-2 bg-blue-500 rounded-full"></div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-gray-200 bg-gray-50">
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600">
              {sortedNotifications.length} من {notifications.length} تنبيه
            </span>
            <div className="flex gap-2">
              <button className="text-sm text-blue-600 hover:text-blue-800 font-medium">
                تصدير التنبيهات
              </button>
              <button className="p-2 hover:bg-gray-200 rounded-lg transition-colors">
                <Settings className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Detailed Notification Modal */}
      {selectedNotification && (
        <div className="fixed inset-0 bg-black/30 z-60 flex items-center justify-center">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl mx-4 max-h-[80vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-start gap-3">
                  <div
                    className={cn(
                      "w-12 h-12 rounded-full flex items-center justify-center",
                      getTypeColor(selectedNotification.type),
                    )}
                  >
                    <selectedNotification.icon className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 mb-1">
                      {selectedNotification.title}
                    </h3>
                    <p className="text-sm text-gray-600 mb-2">
                      من {selectedNotification.sender} •{" "}
                      {selectedNotification.time}
                    </p>
                    <span
                      className={cn(
                        "px-3 py-1 rounded-full text-xs font-medium border",
                        getPriorityColor(selectedNotification.priority),
                      )}
                    >
                      أولوية{" "}
                      {selectedNotification.priority === "urgent"
                        ? "عاجلة"
                        : selectedNotification.priority === "high"
                          ? "عالية"
                          : selectedNotification.priority === "medium"
                            ? "متوسطة"
                            : "منخفضة"}
                    </span>
                  </div>
                </div>
                <button
                  onClick={() => setSelectedNotification(null)}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="prose prose-sm max-w-none mb-6">
                <p className="text-gray-700 leading-relaxed">
                  {selectedNotification.message}
                </p>
              </div>

              {/* Attachments */}
              {selectedNotification.attachments &&
                selectedNotification.attachments.length > 0 && (
                  <div className="mb-6">
                    <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                      <FileText className="w-4 h-4" />
                      المرفقات
                    </h4>
                    <div className="space-y-2">
                      {selectedNotification.attachments.map((attachment) => (
                        <div
                          key={attachment.id}
                          className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg"
                        >
                          <FileText className="w-8 h-8 text-blue-600" />
                          <div className="flex-1">
                            <p className="font-medium text-gray-900">
                              {attachment.name}
                            </p>
                            <p className="text-sm text-gray-600">
                              {attachment.size}
                            </p>
                          </div>
                          <button className="p-2 text-blue-600 hover:bg-blue-100 rounded-lg transition-colors">
                            <Download className="w-4 h-4" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

              {/* Actions */}
              {selectedNotification.actions && (
                <div className="flex gap-3">
                  {selectedNotification.actions.map((action) => (
                    <button
                      key={action.id}
                      onClick={action.action}
                      className={cn(
                        "px-4 py-2 rounded-lg font-medium transition-colors",
                        action.variant === "primary"
                          ? "bg-blue-600 text-white hover:bg-blue-700"
                          : action.variant === "danger"
                            ? "bg-red-600 text-white hover:bg-red-700"
                            : "bg-gray-100 text-gray-700 hover:bg-gray-200",
                      )}
                    >
                      {action.label}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// Export notification bell component
export function NotificationBell({ onClick }: { onClick: () => void }) {
  const unreadCount = sampleNotifications.filter((n) => !n.read).length;

  return (
    <button
      onClick={onClick}
      className="relative p-2 bg-blue-50 rounded-xl hover:bg-blue-100 transition-colors"
    >
      <Bell className="w-5 h-5 text-blue-600" />
      {unreadCount > 0 && (
        <div className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-medium">
          {unreadCount > 9 ? "9+" : unreadCount}
        </div>
      )}
    </button>
  );
}
