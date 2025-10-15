import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Bell,
  MessageCircle,
  CheckSquare,
  Clock,
  Calendar,
  DollarSign,
  AlertCircle,
  Users,
  Package,
  TrendingUp,
  Star,
  Award,
  X,
  Filter,
  Search,
  ChevronRight,
} from "lucide-react";
import { cn } from "@/lib/utils";

export type NotificationType = 
  | "message"
  | "task"
  | "reminder"
  | "appointment"
  | "payment"
  | "order"
  | "achievement"
  | "system"
  | "emergency";

export interface NotificationData {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  timestamp: Date;
  read: boolean;
  priority: "low" | "medium" | "high" | "urgent";
  metadata?: {
    // For messages
    senderId?: string;
    senderName?: string;
    senderAvatar?: string;
    messagePreview?: string;
    
    // For tasks
    taskId?: string;
    taskTitle?: string;
    dueDate?: string;
    assignedBy?: string;
    
    // For reminders
    reminderId?: string;
    reminderDate?: string;
    reminderType?: string;
    
    // For appointments
    appointmentId?: string;
    patientName?: string;
    appointmentDate?: string;
    appointmentTime?: string;
    
    // For payments
    paymentId?: string;
    amount?: string;
    paymentType?: string;
    
    // For orders
    orderId?: string;
    orderStatus?: string;
    supplierName?: string;
    
    // Generic
    relatedId?: string;
    relatedName?: string;
    actionUrl?: string;
  };
}

interface NotificationCardProps {
  notification: NotificationData;
  onClick: () => void;
  onMarkAsRead: () => void;
  onDelete?: () => void;
}

const NotificationCard: React.FC<NotificationCardProps> = ({
  notification,
  onClick,
  onMarkAsRead,
  onDelete,
}) => {
  const getIcon = () => {
    switch (notification.type) {
      case "message":
        return <MessageCircle className="w-5 h-5" />;
      case "task":
        return <CheckSquare className="w-5 h-5" />;
      case "reminder":
        return <Clock className="w-5 h-5" />;
      case "appointment":
        return <Calendar className="w-5 h-5" />;
      case "payment":
        return <DollarSign className="w-5 h-5" />;
      case "order":
        return <Package className="w-5 h-5" />;
      case "achievement":
        return <Award className="w-5 h-5" />;
      case "emergency":
        return <AlertCircle className="w-5 h-5" />;
      default:
        return <Bell className="w-5 h-5" />;
    }
  };

  const getColor = () => {
    switch (notification.type) {
      case "message":
        return "bg-blue-100 text-blue-600";
      case "task":
        return "bg-purple-100 text-purple-600";
      case "reminder":
        return "bg-orange-100 text-orange-600";
      case "appointment":
        return "bg-green-100 text-green-600";
      case "payment":
        return "bg-emerald-100 text-emerald-600";
      case "order":
        return "bg-indigo-100 text-indigo-600";
      case "achievement":
        return "bg-yellow-100 text-yellow-600";
      case "emergency":
        return "bg-red-100 text-red-600";
      default:
        return "bg-gray-100 text-gray-600";
    }
  };

  const getPriorityBadge = () => {
    if (notification.priority === "low") return null;
    
    const colors = {
      urgent: "bg-red-500 text-white",
      high: "bg-orange-500 text-white",
      medium: "bg-yellow-500 text-white",
      low: "bg-gray-500 text-white",
    };

    const labels = {
      urgent: "عاجل",
      high: "مهم",
      medium: "متوسط",
      low: "منخفض",
    };

    return (
      <span className={cn("px-2 py-0.5 rounded-full text-xs font-medium", colors[notification.priority])}>
        {labels[notification.priority]}
      </span>
    );
  };

  const getTimeAgo = () => {
    const now = new Date();
    const diff = now.getTime() - notification.timestamp.getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 1) return "الآن";
    if (minutes < 60) return `منذ ${minutes} دقيقة`;
    if (hours < 24) return `منذ ${hours} ساعة`;
    return `منذ ${days} يوم`;
  };

  return (
    <div
      onClick={onClick}
      className={cn(
        "group relative p-4 rounded-xl border-2 transition-all duration-200 cursor-pointer hover:shadow-lg",
        notification.read 
          ? "bg-white border-gray-200 hover:border-gray-300" 
          : "bg-gradient-to-br from-blue-50 to-white border-blue-300 hover:border-blue-400"
      )}
    >
      {/* نقطة غير مقروء */}
      {!notification.read && (
        <div className="absolute top-3 right-3 w-2.5 h-2.5 bg-blue-500 rounded-full animate-pulse" />
      )}

      <div className="flex items-start gap-3">
        {/* أيقونة النوع */}
        <div className={cn("p-2.5 rounded-xl flex-shrink-0", getColor())}>
          {getIcon()}
        </div>

        {/* المحتوى */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2 mb-2">
            <h4 className="font-semibold text-gray-900 text-sm leading-tight">
              {notification.title}
            </h4>
            {getPriorityBadge()}
          </div>

          <p className="text-sm text-gray-600 line-clamp-2 mb-2">
            {notification.message}
          </p>

          {/* معلومات إضافية */}
          {notification.metadata && (
            <div className="flex flex-wrap items-center gap-3 text-xs text-gray-500 mb-2">
              {notification.metadata.senderName && (
                <div className="flex items-center gap-1">
                  <Users className="w-3 h-3" />
                  {notification.metadata.senderName}
                </div>
              )}
              {notification.metadata.patientName && (
                <div className="flex items-center gap-1">
                  <Users className="w-3 h-3" />
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

          {/* الوقت والإجراءات */}
          <div className="flex items-center justify-between">
            <span className="text-xs text-gray-400">{getTimeAgo()}</span>
            
            <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
              {!notification.read && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onMarkAsRead();
                  }}
                  className="text-xs text-blue-600 hover:text-blue-700 font-medium"
                >
                  تحديد كمقروء
                </button>
              )}
              {onDelete && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onDelete();
                  }}
                  className="p-1 text-gray-400 hover:text-red-600 transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>
        </div>

        {/* سهم للإشارة للتنقل */}
        <ChevronRight className="w-5 h-5 text-gray-400 flex-shrink-0 mt-1 group-hover:text-blue-600 transition-colors" />
      </div>
    </div>
  );
};

interface CardBasedNotificationsProps {
  isOpen: boolean;
  onClose: () => void;
  notifications?: NotificationData[];
}

export default function CardBasedNotifications({
  isOpen,
  onClose,
  notifications = [],
}: CardBasedNotificationsProps) {
  const navigate = useNavigate();
  const [activeFilter, setActiveFilter] = useState<"all" | NotificationType>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [showOnlyUnread, setShowOnlyUnread] = useState(false);

  // تنقل ذكي حسب نوع الإشعار
  const handleNotificationClick = (notification: NotificationData) => {
    // تحديد كمقروء
    markAsRead(notification.id);

    // التنقل حسب النوع
    switch (notification.type) {
      case "message":
        if (notification.metadata?.senderId) {
          navigate(`/clinic-messages?chat=${notification.metadata.senderId}`);
        } else {
          navigate("/clinic-messages");
        }
        break;

      case "task":
        if (notification.metadata?.taskId) {
          navigate(`/clinic-tasks?task=${notification.metadata.taskId}`);
        } else {
          navigate("/clinic-tasks");
        }
        break;

      case "reminder":
        if (notification.metadata?.reminderId) {
          navigate(`/clinic-tasks?reminder=${notification.metadata.reminderId}`);
        } else {
          navigate("/clinic-tasks?view=reminders");
        }
        break;

      case "appointment":
        if (notification.metadata?.appointmentId) {
          navigate(`/dentist-hub?section=appointments&id=${notification.metadata.appointmentId}`);
        } else {
          navigate("/dentist-hub?section=appointments");
        }
        break;

      case "payment":
        if (notification.metadata?.paymentId) {
          navigate(`/dentist-hub?section=payments&id=${notification.metadata.paymentId}`);
        } else {
          navigate("/dentist-hub?section=payments");
        }
        break;

      case "order":
        if (notification.metadata?.orderId) {
          navigate(`/dentist-hub?section=orders&id=${notification.metadata.orderId}`);
        } else {
          navigate("/dentist-hub?section=orders");
        }
        break;

      case "achievement":
        navigate("/dentist-hub?section=achievements");
        break;

      case "emergency":
        if (notification.metadata?.patientName) {
          navigate(`/dentist-hub?section=patients&emergency=${notification.metadata.relatedId}`);
        }
        break;

      default:
        if (notification.metadata?.actionUrl) {
          navigate(notification.metadata.actionUrl);
        }
    }

    onClose();
  };

  const markAsRead = (notificationId: string) => {
    console.log("Marking as read:", notificationId);
    // في التطبيق الحقيقي، سيتم تحديث الحالة في الـ backend
  };

  const markAllAsRead = () => {
    notifications.forEach(n => {
      if (!n.read) markAsRead(n.id);
    });
  };

  const deleteNotification = (notificationId: string) => {
    console.log("Deleting notification:", notificationId);
    // في التطبيق الحقيقي، سيتم الحذف من الـ backend
  };

  // فلترة الإشعارات
  const filteredNotifications = notifications.filter(notification => {
    const matchesFilter = activeFilter === "all" || notification.type === activeFilter;
    const matchesSearch = 
      notification.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      notification.message.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesReadStatus = !showOnlyUnread || !notification.read;
    
    return matchesFilter && matchesSearch && matchesReadStatus;
  });

  const unreadCount = notifications.filter(n => !n.read).length;

  const notificationTypes = [
    { id: "all", label: "الكل", icon: Bell, count: notifications.length },
    { id: "message", label: "الرسائل", icon: MessageCircle, count: notifications.filter(n => n.type === "message").length },
    { id: "task", label: "المهام", icon: CheckSquare, count: notifications.filter(n => n.type === "task").length },
    { id: "reminder", label: "التذكيرات", icon: Clock, count: notifications.filter(n => n.type === "reminder").length },
    { id: "appointment", label: "المواعيد", icon: Calendar, count: notifications.filter(n => n.type === "appointment").length },
    { id: "payment", label: "المدفوعات", icon: DollarSign, count: notifications.filter(n => n.type === "payment").length },
  ];

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-5xl h-[85vh] flex flex-col">
        {/* الرأس */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center gap-3">
            <div className="relative">
              <Bell className="w-7 h-7 text-blue-600" />
              {unreadCount > 0 && (
                <div className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold">
                  {unreadCount > 9 ? "9+" : unreadCount}
                </div>
              )}
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900">الإشعارات</h2>
              <p className="text-sm text-gray-600">
                {unreadCount > 0 ? `${unreadCount} إشعار غير مقروء` : "جميع الإشعارات مقروءة"}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {unreadCount > 0 && (
              <button
                onClick={markAllAsRead}
                className="text-sm text-blue-600 hover:text-blue-700 font-medium px-4 py-2 rounded-lg hover:bg-blue-50 transition-colors"
              >
                تحديد الكل كمقروء
              </button>
            )}
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* البحث والفلاتر */}
        <div className="p-4 border-b border-gray-200 space-y-4">
          {/* البحث */}
          <div className="relative">
            <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="ابحث في الإشعارات..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pr-10 pl-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          {/* تصنيفات الإشعارات */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2">
            {notificationTypes.map((type) => {
              const Icon = type.icon;
              return (
                <button
                  key={type.id}
                  onClick={() => setActiveFilter(type.id as any)}
                  className={cn(
                    "flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all whitespace-nowrap",
                    activeFilter === type.id
                      ? "bg-blue-600 text-white shadow-lg shadow-blue-600/30"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  )}
                >
                  <Icon className="w-4 h-4" />
                  {type.label}
                  {type.count > 0 && (
                    <span
                      className={cn(
                        "px-2 py-0.5 rounded-full text-xs font-bold",
                        activeFilter === type.id
                          ? "bg-white/20 text-white"
                          : "bg-white text-gray-600"
                      )}
                    >
                      {type.count}
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          {/* فلتر غير مقروء */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowOnlyUnread(!showOnlyUnread)}
              className={cn(
                "flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors",
                showOnlyUnread
                  ? "bg-blue-100 text-blue-700"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              )}
            >
              <Filter className="w-4 h-4" />
              غير مقروء فقط
            </button>
            <span className="text-sm text-gray-500">
              {filteredNotifications.length} من {notifications.length} إشعار
            </span>
          </div>
        </div>

        {/* قائمة الإشعارات */}
        <div className="flex-1 overflow-y-auto p-4">
          {filteredNotifications.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-gray-500">
              <Bell className="w-16 h-16 mb-4 opacity-30" />
              <h3 className="text-lg font-semibold mb-2">لا توجد إشعارات</h3>
              <p className="text-sm">لم يتم العثور على إشعارات تطابق البحث</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {filteredNotifications.map((notification) => (
                <NotificationCard
                  key={notification.id}
                  notification={notification}
                  onClick={() => handleNotificationClick(notification)}
                  onMarkAsRead={() => markAsRead(notification.id)}
                  onDelete={() => deleteNotification(notification.id)}
                />
              ))}
            </div>
          )}
        </div>

        {/* تذييل */}
        <div className="p-4 border-t border-gray-200 bg-gray-50">
          <div className="flex items-center justify-between">
            <p className="text-sm text-gray-600">
              اضغط على أي إشعار للانتقال إلى القسم المرتبط به
            </p>
            <button className="text-sm text-blue-600 hover:text-blue-700 font-medium">
              إعدادات الإشعارات
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
