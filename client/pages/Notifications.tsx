import React, { useState, useEffect } from "react";
import { Bell, Search, Filter, X, Star, Archive, Trash2, Plus, Calendar, Package, Users, DollarSign, Clock, Stethoscope, ClipboardList, Truck, HeadphonesIcon, UserCheck, Briefcase, Building, Mail, MailOpen, Phone, Send, Reply, Forward, ArrowRight, ArrowLeft, CheckCircle2, AlertTriangle, Info, AlertCircle } from "lucide-react";
import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";
import { useNavigation } from "@/contexts/NavigationContext";

interface Notification {
  id: string;
  type: "success" | "warning" | "info" | "error" | "urgent" | "celebration";
  category: "appointment" | "inventory" | "patient" | "financial" | "system" | "message" | "community" | "marketplace" | "achievement" | "reminder";
  title: string;
  message: string;
  timestamp: Date;
  read: boolean;
  starred: boolean;
  priority: "low" | "medium" | "high" | "urgent";
  actionUrl?: string;
  actionText?: string;
}

interface Message {
  id: string;
  type: "suppliers" | "support" | "staff" | "community" | "jobs";
  senderName: string;
  subject: string;
  message: string;
  timestamp: Date;
  read: boolean;
  starred: boolean;
}

const mockNotifications: Notification[] = [
  {
    id: "1",
    type: "urgent",
    category: "appointment",
    title: "موعد عاجل خلال 5 دقائق!",
    message: "لديك موعد مع المريض أحمد العراقي",
    timestamp: new Date(Date.now() - 2 * 60 * 1000),
    read: false,
    starred: true,
    priority: "urgent",
  },
  {
    id: "2",
    type: "warning",
    category: "inventory",
    title: "نفاد المخزون",
    message: "انتهت كمية مادة التخدير",
    timestamp: new Date(Date.now() - 30 * 60 * 1000),
    read: false,
    starred: false,
    priority: "high",
  },
];

export default function Notifications() {
  const { goBack } = useNavigation();
  const [notifications, setNotifications] = useState<Notification[]>(mockNotifications);
  const [activeTab, setActiveTab] = useState<"notifications" | "messages">("notifications");
  const [filter, setFilter] = useState<"all" | "unread" | "starred">("all");
  const [searchQuery, setSearchQuery] = useState("");

  const filteredNotifications = notifications.filter((n) => {
    if (filter === "unread" && n.read) return false;
    if (filter === "starred" && !n.starred) return false;
    if (searchQuery && !n.title.toLowerCase().includes(searchQuery.toLowerCase()) && !n.message.toLowerCase().includes(searchQuery.toLowerCase())) return false;
    return true;
  });

  const markAsRead = (id: string) => {
    setNotifications(notifications.map(n => n.id === id ? { ...n, read: true } : n));
  };

  const toggleStar = (id: string) => {
    setNotifications(notifications.map(n => n.id === id ? { ...n, starred: !n.starred } : n));
  };

  const deleteNotification = (id: string) => {
    setNotifications(notifications.filter(n => n.id !== id));
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Mobile-Optimized Header */}
      <div className="sticky top-0 z-40 bg-white border-b border-gray-200 shadow-sm">
        <div className="px-3 sm:px-4 py-3">
          <div className="flex items-center gap-2 sm:gap-3">
            <button onClick={goBack} className="p-1.5 sm:p-2 hover:bg-gray-100 rounded-lg">
              <ArrowRight className="w-5 h-5 text-gray-600" />
            </button>
            <div className="flex items-center gap-2 flex-1">
              <Bell className="w-5 h-5 sm:w-6 sm:h-6 text-blue-600" />
              <h1 className="text-lg sm:text-xl font-bold text-gray-900">الإشعارات</h1>
            </div>
          </div>

          {/* Mobile-Optimized Tabs */}
          <div className="flex gap-1 sm:gap-2 mt-3">
            <button
              onClick={() => setActiveTab("notifications")}
              className={cn(
                "flex-1 px-3 py-2 rounded-lg text-xs sm:text-sm font-medium transition-colors",
                activeTab === "notifications" ? "bg-blue-600 text-white" : "bg-gray-100 text-gray-600"
              )}
            >
              الإشعارات ({notifications.length})
            </button>
            <button
              onClick={() => setActiveTab("messages")}
              className={cn(
                "flex-1 px-3 py-2 rounded-lg text-xs sm:text-sm font-medium transition-colors",
                activeTab === "messages" ? "bg-blue-600 text-white" : "bg-gray-100 text-gray-600"
              )}
            >
              الرسائل
            </button>
          </div>
        </div>
      </div>

      {/* Mobile-Optimized Search & Filters */}
      <div className="bg-white border-b border-gray-200 px-3 sm:px-4 py-2 sm:py-3">
        <div className="flex flex-col sm:flex-row gap-2">
          <div className="relative flex-1">
            <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="بحث..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pr-10 pl-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="flex gap-1 sm:gap-2">
            {["all", "unread", "starred"].map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f as any)}
                className={cn(
                  "px-3 py-2 rounded-lg text-xs font-medium transition-colors flex-1 sm:flex-none",
                  filter === f ? "bg-blue-600 text-white" : "bg-gray-100 text-gray-600"
                )}
              >
                {f === "all" ? "الكل" : f === "unread" ? "غير مقروء" : "مميز"}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Mobile-Optimized Notifications List */}
      <div className="px-3 sm:px-4 py-3 sm:py-4 space-y-2 sm:space-y-3">
        {filteredNotifications.map((notif) => (
          <div
            key={notif.id}
            className={cn(
              "bg-white rounded-xl border p-3 sm:p-4 shadow-sm transition-all",
              !notif.read ? "border-blue-200 bg-blue-50/50" : "border-gray-200"
            )}
          >
            <div className="flex gap-2 sm:gap-3">
              <div className={cn(
                "w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center flex-shrink-0",
                notif.priority === "urgent" ? "bg-red-500" : "bg-blue-500"
              )}>
                <Bell className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2 mb-1">
                  <h3 className="font-semibold text-sm sm:text-base text-gray-900 line-clamp-1">
                    {notif.title}
                  </h3>
                  <button onClick={() => toggleStar(notif.id)} className="flex-shrink-0 p-1">
                    <Star className={cn(
                      "w-4 h-4",
                      notif.starred ? "text-yellow-500 fill-current" : "text-gray-400"
                    )} />
                  </button>
                </div>
                <p className="text-xs sm:text-sm text-gray-600 line-clamp-2 mb-2">
                  {notif.message}
                </p>
                <div className="flex flex-wrap items-center gap-2 text-xs text-gray-500">
                  <span>{new Date(notif.timestamp).toLocaleTimeString('ar-IQ', { hour: '2-digit', minute: '2-digit' })}</span>
                  <span className={cn(
                    "px-2 py-0.5 rounded-full text-xs font-medium",
                    notif.priority === "urgent" ? "bg-red-100 text-red-700" : "bg-blue-100 text-blue-700"
                  )}>
                    {notif.priority === "urgent" ? "عاجل" : "عادي"}
                  </span>
                </div>
                <div className="flex gap-1 sm:gap-2 mt-2 sm:mt-3">
                  {!notif.read && (
                    <button
                      onClick={() => markAsRead(notif.id)}
                      className="px-2 sm:px-3 py-1 bg-blue-600 text-white rounded-lg text-xs font-medium hover:bg-blue-700 transition-colors"
                    >
                      وضع علامة مقروء
                    </button>
                  )}
                  <button
                    onClick={() => deleteNotification(notif.id)}
                    className="px-2 sm:px-3 py-1 bg-gray-100 text-gray-600 rounded-lg text-xs font-medium hover:bg-gray-200 transition-colors"
                  >
                    حذف
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
