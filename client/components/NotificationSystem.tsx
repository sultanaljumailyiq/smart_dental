import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Bell,
  X,
  CheckCircle,
  AlertTriangle,
  Info,
  AlertCircle,
  Calendar,
  Package,
  Users,
  TrendingUp,
  Clock,
  MessageSquare,
} from "lucide-react";
import { cn } from "@/lib/utils";

export interface Notification {
  id: string;
  type: "success" | "warning" | "info" | "error";
  category:
    | "appointment"
    | "inventory"
    | "patient"
    | "financial"
    | "system"
    | "message";
  title: string;
  message: string;
  timestamp: Date;
  read: boolean;
  priority: "low" | "medium" | "high";
  actionUrl?: string;
  actionText?: string;
}

// Mock notifications data
const mockNotifications: Notification[] = [
  {
    id: "1",
    type: "warning",
    category: "appointment",
    title: "موعد قريب",
    message: "لديك موعد مع المريض أحمد محمد خلال 15 دقيقة",
    timestamp: new Date(Date.now() - 10 * 60 * 1000),
    read: false,
    priority: "high",
    actionUrl: "/admin/reservations",
    actionText: "عرض الموعد",
  },
  {
    id: "2",
    type: "error",
    category: "inventory",
    title: "نفاد المخزون",
    message: "انتهت كمية مادة الت��دير الموضعي من المخزون",
    timestamp: new Date(Date.now() - 30 * 60 * 1000),
    read: false,
    priority: "high",
    actionUrl: "/admin/stocks",
    actionText: "طلب المخزون",
  },
  {
    id: "3",
    type: "success",
    category: "patient",
    title: "مريض جديد",
    message: "تم تسجيل مريض جديد: فاطمة علي",
    timestamp: new Date(Date.now() - 60 * 60 * 1000),
    read: false,
    priority: "medium",
    actionUrl: "/admin/patients",
    actionText: "عرض الملف",
  },
  {
    id: "4",
    type: "info",
    category: "financial",
    title: "تقرير مالي",
    message: "تم إنشاء التق��ير المالي الشهري",
    timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
    read: true,
    priority: "low",
    actionUrl: "/admin/reports",
    actionText: "عرض التقرير",
  },
  {
    id: "5",
    type: "info",
    category: "system",
    title: "تحديث النظام",
    message: "تتوفر ميزات جديدة في النظام",
    timestamp: new Date(Date.now() - 3 * 60 * 60 * 1000),
    read: true,
    priority: "low",
  },
];

interface NotificationSystemProps {
  className?: string;
}

export function NotificationSystem({ className }: NotificationSystemProps) {
  const navigate = useNavigate();
  const [notifications, setNotifications] =
    useState<Notification[]>(mockNotifications);
  const [isOpen, setIsOpen] = useState(false);
  const [filter, setFilter] = useState<"all" | "unread" | "high">("all");

  const unreadCount = notifications.filter((n) => !n.read).length;
  const highPriorityCount = notifications.filter(
    (n) => n.priority === "high" && !n.read,
  ).length;

  const filteredNotifications = notifications.filter((notification) => {
    if (filter === "unread") return !notification.read;
    if (filter === "high") return notification.priority === "high";
    return true;
  });

  const markAsRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n)),
    );
  };

  const markAllAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  const removeNotification = (id: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  };

  const getIcon = (category: Notification["category"]) => {
    switch (category) {
      case "appointment":
        return <Calendar className="w-4 h-4" />;
      case "inventory":
        return <Package className="w-4 h-4" />;
      case "patient":
        return <Users className="w-4 h-4" />;
      case "financial":
        return <TrendingUp className="w-4 h-4" />;
      case "message":
        return <MessageSquare className="w-4 h-4" />;
      default:
        return <Info className="w-4 h-4" />;
    }
  };

  const getTypeIcon = (type: Notification["type"]) => {
    switch (type) {
      case "success":
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case "warning":
        return <AlertTriangle className="w-4 h-4 text-yellow-500" />;
      case "error":
        return <AlertCircle className="w-4 h-4 text-red-500" />;
      default:
        return <Info className="w-4 h-4 text-blue-500" />;
    }
  };

  const formatTime = (timestamp: Date) => {
    const now = new Date();
    const diff = now.getTime() - timestamp.getTime();
    const minutes = Math.floor(diff / (1000 * 60));
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));

    if (minutes < 1) return "الآن";
    if (minutes < 60) return `منذ ${minutes} دقيقة`;
    if (hours < 24) return `منذ ${hours} ساعة`;
    return `منذ ${days} يوم`;
  };

  return (
    <div className={cn("relative", className)}>
      {/* Notification Bell */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          "relative p-3 rounded-xl transition-all duration-300 transform",
          "hover:bg-gradient-to-r hover:from-blue-50 hover:to-purple-50 focus:outline-none focus:ring-2 focus:ring-blue-500",
          "hover:scale-110 hover:shadow-lg",
          isOpen
            ? "bg-gradient-to-r from-blue-50 to-purple-50 text-blue-600 scale-110 shadow-lg"
            : "text-gray-600 hover:text-blue-600",
        )}
      >
        <Bell className="w-5 h-5" />
        {unreadCount > 0 && (
          <div className="absolute -top-1 -right-1 min-w-[18px] h-[18px] bg-red-500 text-white text-xs rounded-full flex items-center justify-center font-medium">
            {unreadCount > 99 ? "99+" : unreadCount}
          </div>
        )}
        {highPriorityCount > 0 && (
          <div className="absolute -top-0.5 -right-0.5 w-2 h-2 bg-orange-500 rounded-full animate-pulse" />
        )}
      </button>

      {/* Notification Panel */}
      {isOpen && (
        <>
          <div
            className="fixed inset-0 z-[9998] bg-black/30 backdrop-blur-sm"
            onClick={() => setIsOpen(false)}
          />
          <div
            className={cn(
              "fixed bg-white rounded-3xl shadow-2xl border border-gray-200 z-[9999] max-h-[85vh] flex flex-col",
              "w-[420px] max-w-[95vw] max-sm:w-[90vw] max-sm:mx-4",
              "top-16 right-4 md:top-[10vh] md:left-1/2 md:-translate-x-1/2 md:right-auto",
              "backdrop-blur-xl bg-white/95 border-2",
              "transform transition-all duration-300 ease-out",
              "animate-in fade-in-0 zoom-in-95 slide-in-from-top-4",
            )}
          >
            {/* Header */}
            <div className="p-6 bg-gradient-to-r from-blue-50 to-purple-50 border-b border-gray-100">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl flex items-center justify-center">
                    <Bell className="w-4 h-4 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900">الإشعارات</h3>
                </div>
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-2 rounded-xl hover:bg-white/50 transition-all duration-200 hover:rotate-90"
                >
                  <X className="w-5 h-5 text-gray-500" />
                </button>
              </div>

              {/* Filters */}
              <div className="flex gap-3">
                <button
                  onClick={() => setFilter("all")}
                  className={cn(
                    "px-4 py-2 text-sm rounded-xl font-medium transition-all duration-200",
                    filter === "all"
                      ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg scale-105"
                      : "bg-white text-gray-600 hover:bg-gray-50 hover:scale-105 shadow-sm",
                  )}
                >
                  الكل ({notifications.length})
                </button>
                <button
                  onClick={() => setFilter("unread")}
                  className={cn(
                    "px-4 py-2 text-sm rounded-xl font-medium transition-all duration-200",
                    filter === "unread"
                      ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg scale-105"
                      : "bg-white text-gray-600 hover:bg-gray-50 hover:scale-105 shadow-sm",
                  )}
                >
                  غير مقروءة ({unreadCount})
                </button>
                <button
                  onClick={() => setFilter("high")}
                  className={cn(
                    "px-4 py-2 text-sm rounded-xl font-medium transition-all duration-200",
                    filter === "high"
                      ? "bg-gradient-to-r from-red-600 to-orange-600 text-white shadow-lg scale-105"
                      : "bg-white text-gray-600 hover:bg-gray-50 hover:scale-105 shadow-sm",
                  )}
                >
                  عاجلة ({highPriorityCount})
                </button>
              </div>

              {unreadCount > 0 && (
                <button
                  onClick={markAllAsRead}
                  className="mt-3 text-sm text-blue-600 hover:text-blue-700 font-medium"
                >
                  تعيين الكل كمقروء
                </button>
              )}
            </div>

            {/* Notifications List */}
            <div className="flex-1 overflow-y-auto">
              {filteredNotifications.length === 0 ? (
                <div className="p-8 text-center">
                  <Bell className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                  <p className="text-gray-500">لا توجد إشعارات</p>
                </div>
              ) : (
                <div className="p-2">
                  {filteredNotifications.map((notification) => (
                    <div
                      key={notification.id}
                      className={cn(
                        "p-3 rounded-xl mb-2 border transition-all duration-200 hover:shadow-sm",
                        notification.read
                          ? "bg-gray-50 border-gray-100"
                          : "bg-blue-50 border-blue-100",
                        notification.priority === "high" &&
                          !notification.read &&
                          "ring-2 ring-orange-200",
                      )}
                      onClick={() => markAsRead(notification.id)}
                    >
                      <div className="flex items-start gap-3">
                        <div
                          className={cn(
                            "p-2 rounded-lg flex-shrink-0",
                            notification.type === "success" &&
                              "bg-green-100 text-green-600",
                            notification.type === "warning" &&
                              "bg-yellow-100 text-yellow-600",
                            notification.type === "error" &&
                              "bg-red-100 text-red-600",
                            notification.type === "info" &&
                              "bg-blue-100 text-blue-600",
                          )}
                        >
                          {getIcon(notification.category)}
                        </div>

                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <h4
                              className={cn(
                                "text-sm font-medium",
                                notification.read
                                  ? "text-gray-700"
                                  : "text-gray-900",
                              )}
                            >
                              {notification.title}
                            </h4>
                            {getTypeIcon(notification.type)}
                            {notification.priority === "high" &&
                              !notification.read && (
                                <div className="w-2 h-2 bg-orange-500 rounded-full animate-pulse" />
                              )}
                          </div>

                          <p
                            className={cn(
                              "text-sm mb-2",
                              notification.read
                                ? "text-gray-500"
                                : "text-gray-600",
                            )}
                          >
                            {notification.message}
                          </p>

                          <div className="flex items-center justify-between">
                            <span className="text-xs text-gray-500 flex items-center gap-1">
                              <Clock className="w-3 h-3" />
                              {formatTime(notification.timestamp)}
                            </span>

                            {notification.actionUrl && (
                              <a
                                href={notification.actionUrl}
                                className="text-xs text-blue-600 hover:text-blue-700 font-medium"
                                onClick={(e) => e.stopPropagation()}
                              >
                                {notification.actionText}
                              </a>
                            )}
                          </div>
                        </div>

                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            removeNotification(notification.id);
                          }}
                          className="p-1 rounded-lg hover:bg-white/50 transition-colors flex-shrink-0"
                        >
                          <X className="w-3 h-3 text-gray-400" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="p-3 border-t border-gray-100">
              <button
                onClick={() => {
                  setIsOpen(false);
                  navigate("/dentist-hub/notifications");
                }}
                className="w-full text-sm text-blue-600 hover:text-blue-700 font-medium py-2 hover:bg-blue-50 rounded-lg transition-colors"
              >
                عرض جميع الإشعارات
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

export default NotificationSystem;
