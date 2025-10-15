import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Bell,
  MessageCircle,
  Clock,
  X,
  ChevronLeft,
  ChevronRight,
  Calendar,
  User,
  Building2,
  AlertCircle,
  CheckCircle,
  Info,
  Star,
  Heart,
  Settings,
  Archive,
  Trash2,
  MoreHorizontal,
  Filter,
  Search,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";

interface NotificationItem {
  id: string;
  type: "reminder" | "notification" | "message";
  title: string;
  content: string;
  time: string;
  isRead: boolean;
  priority: "low" | "medium" | "high";
  category?: string;
  avatar?: string;
  sender?: string;
  actions?: Array<{
    label: string;
    action: () => void;
    variant?: "primary" | "secondary" | "danger";
  }>;
}

interface UnifiedNotificationPopupProps {
  isOpen: boolean;
  onClose: () => void;
  position?: "top-right" | "top-left" | "center";
}

// Mock data
const mockData: NotificationItem[] = [
  // Reminders
  {
    id: "r1",
    type: "reminder",
    title: "موعد مع د. أحمد محمد",
    content: "موعد في العيادة اليوم الساعة 3:00 مساءً",
    time: "منذ 30 دقيقة",
    isRead: false,
    priority: "high",
    category: "appointment",
    actions: [
      { label: "تأكيد", action: () => {}, variant: "primary" },
      { label: "إلغاء", action: () => {}, variant: "danger" },
    ],
  },
  {
    id: "r2",
    type: "reminder",
    title: "تجديد الاشتراك",
    content: "ينتهي اشتراكك في 3 أيام",
    time: "منذ ساعة",
    isRead: false,
    priority: "medium",
    category: "subscription",
  },
  {
    id: "r3",
    type: "reminder",
    title: "فحص دوري",
    content: "حان موعد الفحص الدوري الشهري",
    time: "منذ 2 ساعة",
    isRead: true,
    priority: "medium",
    category: "health",
  },

  // Notifications
  {
    id: "n1",
    type: "notification",
    title: "طلب جديد في المتجر",
    content: "تم استلام طلب جديد من العميل أحمد سالم",
    time: "منذ 15 دقيقة",
    isRead: false,
    priority: "high",
    category: "order",
  },
  {
    id: "n2",
    type: "notification",
    title: "تحديث النظام",
    content: "تم تحديث النظام بنجاح إلى الإصدار 2.1.0",
    time: "منذ ساعة",
    isRead: false,
    priority: "low",
    category: "system",
  },
  {
    id: "n3",
    type: "notification",
    title: "تقييم جديد",
    content: "حصلت على تقييم 5 نجوم من المريض سارة أحمد",
    time: "منذ 3 ساعات",
    isRead: true,
    priority: "medium",
    category: "review",
  },

  // Messages
  {
    id: "m1",
    type: "message",
    title: "د. فاطمة محمد",
    content: "مرحباً، أريد استشارة حول حالة المريض",
    time: "منذ 10 دقائق",
    isRead: false,
    priority: "high",
    sender: "د. فاطمة محمد",
    avatar: "/api/placeholder/32/32",
  },
  {
    id: "m2",
    type: "message",
    title: "مدير العيادة",
    content: "تم تحديث جدول المواعيد لهذا الأسبوع",
    time: "منذ 45 دقيقة",
    isRead: false,
    priority: "medium",
    sender: "مدير العيادة",
    avatar: "/api/placeholder/32/32",
  },
  {
    id: "m3",
    type: "message",
    title: "فريق الدعم",
    content: "شكراً لتواصلك معنا، تم حل المشكلة",
    time: "منذ ساعتين",
    isRead: true,
    priority: "low",
    sender: "فريق الدعم",
    avatar: "/api/placeholder/32/32",
  },
];

type TabType = "reminders" | "notifications" | "messages";

const tabs: Array<{
  id: TabType;
  label: string;
  icon: React.ComponentType<any>;
  color: string;
}> = [
  { id: "reminders", label: "التذكيرات", icon: Clock, color: "blue" },
  { id: "notifications", label: "الإشعارات", icon: Bell, color: "purple" },
  { id: "messages", label: "الرسائل", icon: MessageCircle, color: "green" },
];

export default function UnifiedNotificationPopup({
  isOpen,
  onClose,
  position = "top-right",
}: UnifiedNotificationPopupProps) {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<TabType>("reminders");
  const [searchTerm, setSearchTerm] = useState("");
  const [filterRead, setFilterRead] = useState<"all" | "unread" | "read">(
    "all",
  );
  // إدارة البيانات في state بدلاً من استخدام mockData مباشرة
  const [notificationData, setNotificationData] = useState<NotificationItem[]>(mockData);

  // تحويل التبويب إلى نوع البيانات (إزالة s من الجمع)
  const getDataType = (tab: TabType): "reminder" | "notification" | "message" => {
    if (tab === "reminders") return "reminder";
    if (tab === "notifications") return "notification";
    return "message";
  };

  // التنقل إلى القسم المناسب عند الضغط على الإشعار
  const handleItemClick = (item: NotificationItem) => {
    // تحديد العنصر كمقروء (تحديث في state)
    if (!item.isRead) {
      setNotificationData(prev => 
        prev.map(dataItem => 
          dataItem.id === item.id 
            ? { ...dataItem, isRead: true }
            : dataItem
        )
      );
    }
    
    // تحديد وجهة التنقل حسب نوع الإشعار
    if (item.type === "reminder") {
      navigate("/dentist-hub/tasks-reminders");
    } else if (item.type === "notification") {
      navigate("/dentist-hub/notifications");
    } else if (item.type === "message") {
      navigate("/dentist-hub/messages");
    }
    
    // إغلاق النافذة المنبثقة
    onClose();
  };

  // Filter data based on active tab and filters
  const filteredData = notificationData
    .filter((item) => item.type === getDataType(activeTab))
    .filter((item) => {
      if (filterRead === "unread") return !item.isRead;
      if (filterRead === "read") return item.isRead;
      return true;
    })
    .filter(
      (item) =>
        item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.content.toLowerCase().includes(searchTerm.toLowerCase()),
    );

  // Get counts for tabs
  const getCounts = () => {
    return tabs.reduce(
      (acc, tab) => {
        acc[tab.id] = notificationData.filter(
          (item) => item.type === getDataType(tab.id) && !item.isRead,
        ).length;
        return acc;
      },
      {} as Record<TabType, number>,
    );
  };

  const counts = getCounts();

  // Close on escape
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };

    if (isOpen) {
      document.addEventListener("keydown", handleEscape);
      return () => document.removeEventListener("keydown", handleEscape);
    }
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const positionClasses = {
    "top-right": "top-16 sm:right-4 right-0",
    "top-left": "top-16 sm:left-4 left-0",
    center: "top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2",
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "border-red-200 bg-red-50";
      case "medium":
        return "border-yellow-200 bg-yellow-50";
      default:
        return "border-gray-200 bg-white";
    }
  };

  const getPriorityDot = (priority: string) => {
    switch (priority) {
      case "high":
        return "bg-red-500";
      case "medium":
        return "bg-yellow-500";
      default:
        return "bg-gray-400";
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/20 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Popup */}
      <div
        className={cn(
          "absolute w-full bg-white rounded-2xl shadow-2xl border border-gray-200 flex flex-col",
          // Mobile: full width with margins, Desktop: fixed width
          "max-w-[calc(100vw-2rem)] h-[90vh] mx-4",
          "sm:max-w-md sm:h-[600px] sm:max-h-[90vh] sm:mx-0",
          positionClasses[position],
        )}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <h2 className="text-lg font-bold text-gray-900">الإشعارات</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-gray-200">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={cn(
                  "flex-1 flex items-center justify-center gap-2 py-3 px-2 text-sm font-medium transition-colors relative",
                  activeTab === tab.id
                    ? tab.color === "blue"
                      ? "text-blue-600 border-b-2 border-blue-500"
                      : tab.color === "purple"
                        ? "text-purple-600 border-b-2 border-purple-500"
                        : "text-green-600 border-b-2 border-green-500"
                    : "text-gray-600 hover:text-gray-900",
                )}
              >
                <Icon className="w-4 h-4" />
                <span className="hidden sm:inline">{tab.label}</span>
                {counts[tab.id] > 0 && (
                  <Badge
                    variant="destructive"
                    className="text-xs px-1.5 py-0.5 min-w-[20px] h-5"
                  >
                    {counts[tab.id]}
                  </Badge>
                )}
              </button>
            );
          })}
        </div>

        {/* Search and Filters */}
        <div className="p-4 border-b border-gray-200 space-y-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="بحث..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
            />
          </div>

          <div className="flex gap-2">
            {(["all", "unread", "read"] as const).map((filter) => (
              <button
                key={filter}
                onClick={() => setFilterRead(filter)}
                className={cn(
                  "px-3 py-1 text-xs rounded-full transition-colors",
                  filterRead === filter
                    ? "bg-blue-100 text-blue-700"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200",
                )}
              >
                {filter === "all"
                  ? "الكل"
                  : filter === "unread"
                    ? "غير مقروءة"
                    : "مقروءة"}
              </button>
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto">
          {filteredData.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-gray-500">
              <Bell className="w-12 h-12 mb-2 opacity-50" />
              <p className="text-sm">لا توجد عناصر</p>
            </div>
          ) : (
            <div className="p-4 space-y-3">
              {filteredData.map((item) => (
                <div
                  key={item.id}
                  onClick={() => handleItemClick(item)}
                  className={cn(
                    "p-3 rounded-lg border transition-all cursor-pointer hover:shadow-md",
                    getPriorityColor(item.priority),
                    !item.isRead && "border-l-4 border-l-blue-500",
                  )}
                >
                  <div className="flex items-start gap-3">
                    {/* Avatar or Icon */}
                    <div className="flex-shrink-0">
                      {item.avatar ? (
                        <img
                          src={item.avatar}
                          alt={item.sender}
                          className="w-8 h-8 rounded-full"
                        />
                      ) : (
                        <div
                          className={cn(
                            "w-8 h-8 rounded-full flex items-center justify-center",
                            item.type === "reminder"
                              ? "bg-blue-100"
                              : item.type === "notification"
                                ? "bg-purple-100"
                                : "bg-green-100",
                          )}
                        >
                          {item.type === "reminder" && (
                            <Clock className="w-4 h-4 text-blue-600" />
                          )}
                          {item.type === "notification" && (
                            <Bell className="w-4 h-4 text-purple-600" />
                          )}
                          {item.type === "message" && (
                            <MessageCircle className="w-4 h-4 text-green-600" />
                          )}
                        </div>
                      )}
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between">
                        <h4 className="text-sm font-medium text-gray-900 truncate">
                          {item.title}
                        </h4>
                        <div className="flex items-center gap-1 ml-2">
                          <div
                            className={cn(
                              "w-2 h-2 rounded-full",
                              getPriorityDot(item.priority),
                            )}
                          />
                          <span className="text-xs text-gray-500">
                            {item.time}
                          </span>
                        </div>
                      </div>
                      <p className="text-xs text-gray-600 mt-1 line-clamp-2">
                        {item.content}
                      </p>

                      {/* Actions */}
                      {item.actions && (
                        <div className="flex gap-2 mt-2">
                          {item.actions.map((action, index) => (
                            <button
                              key={index}
                              onClick={(e) => {
                                e.stopPropagation(); // منع انتشار الحدث للبطاقة الرئيسية
                                action.action();
                              }}
                              className={cn(
                                "px-3 py-1 text-xs rounded-md transition-colors",
                                action.variant === "primary" &&
                                  "bg-blue-100 text-blue-700 hover:bg-blue-200",
                                action.variant === "danger" &&
                                  "bg-red-100 text-red-700 hover:bg-red-200",
                                !action.variant &&
                                  "bg-gray-100 text-gray-700 hover:bg-gray-200",
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
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="border-t border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <span className="text-xs text-gray-500">
              {filteredData.filter((item) => !item.isRead).length} غير مقروءة من{" "}
              {filteredData.length}
            </span>
            <div className="flex gap-2">
              <button className="text-xs text-blue-600 hover:text-blue-700">
                تحديد الكل كمقروء
              </button>
              <button className="text-xs text-gray-600 hover:text-gray-700">
                إعدادات
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
