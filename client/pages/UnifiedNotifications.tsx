import React, { useState, useEffect } from "react";
import { ArrowLeft, Bell, Search, Settings, Plus, CheckCircle, AlertTriangle, Info, AlertCircle, Calendar, Package, Users, Clock, MessageSquare, X, Star, Eye, EyeOff, Trash2, Zap, CheckCircle2, Sparkles, Flame, DollarSign, User, Send, Mail, MailOpen, MessageCircle, Phone, Briefcase, Building, UserCheck, HeadphonesIcon, Truck, ClipboardList, Wifi, Reply, Forward, Paperclip, Smile, Image as ImageIcon, Video, Mic, MapPin, Stethoscope, Crown, Heart, ThumbsUp, Bookmark, Share2, Download, Filter, MoreHorizontal, ChevronDown, ChevronUp, CircleDot, Archive, FileText, Upload } from "lucide-react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { cn } from "@/lib/utils";
import { useNavigation } from "@/contexts/NavigationContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { notificationsService } from "@/services/notificationsService";
import type { Notification } from "@/services/notificationsService";
import { initializeClinicNotifications } from "@/services/mockClinicNotifications";

// بيانات شاملة للإشعارات من جميع الأقسام
const mockNotifications: Notification[] = [{
  id: "notif1",
  type: "urgent",
  category: "appointment",
  title: "موعد عاجل خلال 5 دقائق!",
  message: "لديك موعد مع د. أحمد العراقي - جراحة زراعة أسنان",
  timestamp: new Date(Date.now() - 2 * 60 * 1000),
  read: false,
  starred: true,
  priority: "urgent",
  actionUrl: "/appointments/123",
  actionText: "انضم الآن",
  avatar: "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=40&h=40&fit=crop&crop=face",
  reactions: 3,
  tags: ["عاجل", "زراعة"],
  sourceSection: "clinic"
}, {
  id: "notif2",
  type: "celebration",
  category: "achievement",
  title: "🎉 تهانينا! وصلت لـ 1000 متابع",
  message: "حسابك في مجتمع أطباء الأسنان حقق إنجازاً رائعاً",
  timestamp: new Date(Date.now() - 15 * 60 * 1000),
  read: false,
  starred: false,
  priority: "medium",
  actionUrl: "/profile",
  actionText: "عرض الملف",
  reactions: 25,
  tags: ["إنجاز", "مجتمع"],
  sourceSection: "community"
}, {
  id: "notif3",
  type: "error",
  category: "inventory",
  title: "نفاد المخزون - تحذير حرج",
  message: "انتهت كمية مادة التخدير الموضعي (Lidocaine) تماماً",
  timestamp: new Date(Date.now() - 30 * 60 * 1000),
  read: false,
  starred: true,
  priority: "high",
  actionUrl: "/inventory/reorder",
  actionText: "اطلب الآن",
  tags: ["مخزون", "حرج"],
  sourceSection: "marketplace"
}, {
  id: "notif4",
  type: "success",
  category: "financial",
  title: "تم استلام دفعة جديدة",
  message: "تم استلام دفعة بمبلغ 15,000 ريال من التأمين الطبي",
  timestamp: new Date(Date.now() - 60 * 60 * 1000),
  read: true,
  starred: false,
  priority: "medium",
  actionUrl: "/financial/transactions",
  actionText: "عرض التفاصيل",
  tags: ["دفعة", "تأمين"],
  sourceSection: "clinic"
}, {
  id: "notif5",
  type: "info",
  category: "community",
  title: "دورة تدريبية جديدة",
  message: "تم إضافة دورة 'تقنيات زراعة الأسنان المتقدمة' للمجتمع",
  timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
  read: false,
  starred: false,
  priority: "low",
  actionUrl: "/community/courses/123",
  actionText: "التسجيل",
  tags: ["دورة", "تدريب"],
  sourceSection: "community"
}, {
  id: "notif6",
  type: "warning",
  category: "system",
  title: "تحديث النظام المطلوب",
  message: "يرجى تحديث النظام للإصدار الأحدث لضمان الأمان والاستقرار",
  timestamp: new Date(Date.now() - 3 * 60 * 60 * 1000),
  read: true,
  starred: false,
  priority: "medium",
  actionUrl: "/settings/updates",
  actionText: "تحديث الآن",
  tags: ["تحديث", "نظام"],
  sourceSection: "system"
}];

export default function UnifiedNotifications() {
  const { state: navState, goBack } = useNavigation();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const [notifications, setNotifications] = useState<Notification[]>([]);

  // تحميل البيانات من الخدمة والاشتراك في التحديثات
  useEffect(() => {
    // تهيئة البيانات الوهمية عند أول تحميل
    initializeClinicNotifications();
    
    const loadData = () => {
      setNotifications(notificationsService.getNotifications());
    };

    loadData();
    const unsubscribe = notificationsService.subscribe(loadData);

    return () => {
      unsubscribe();
    };
  }, []);
  const [searchQuery, setSearchQuery] = useState("");

  // حسابات الإحصائيات
  const unreadNotifications = notifications.filter(n => !n.read).length;
  const totalUnread = unreadNotifications;

  // تطبيق البحث فقط
  const filteredNotifications = notifications.filter(notification => {
    if (searchQuery && !notification.title.toLowerCase().includes(searchQuery.toLowerCase()) && !notification.message.toLowerCase().includes(searchQuery.toLowerCase())) return false;
    return true;
  });


  // وظائف التفاعل - الإشعارات فقط
  const markAsRead = (id: string) => {
    notificationsService.markNotificationAsRead(id);
  };
  
  const toggleStar = (id: string) => {
    notificationsService.toggleNotificationStar(id);
  };
  
  const markAllAsRead = () => {
    notificationsService.markAllNotificationsAsRead();
  };
  
  const removeItem = (id: string) => {
    notificationsService.deleteNotification(id);
  };

  // دوال المساعدة
  const formatTime = (timestamp: Date) => {
    const now = new Date();
    const diff = now.getTime() - timestamp.getTime();
    const minutes = Math.floor(diff / (1000 * 60));
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    if (minutes < 1) return "الآن";
    if (minutes < 60) return `منذ ${minutes} د`;
    if (hours < 24) return `منذ ${hours} س`;
    return `منذ ${days} يوم`;
  };
  const getIcon = (category: Notification["category"]) => {
    const icons = {
      appointment: Calendar,
      inventory: Package,
      patient: User,
      financial: DollarSign,
      message: MessageSquare,
      community: Users,
      marketplace: Package,
      achievement: Crown,
      reminder: Clock,
      system: Settings
    };
    return icons[category] || Info;
  };
  const getTypeIcon = (type: Notification["type"]) => {
    switch (type) {
      case "success":
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case "warning":
        return <AlertTriangle className="w-4 h-4 text-yellow-500" />;
      case "error":
        return <AlertCircle className="w-4 h-4 text-red-500" />;
      case "urgent":
        return <Zap className="w-4 h-4 text-orange-500 animate-pulse" />;
      case "celebration":
        return <Sparkles className="w-4 h-4 text-purple-500" />;
      default:
        return <Info className="w-4 h-4 text-blue-500" />;
    }
  };
  const getPriorityColor = (priority: "low" | "medium" | "high" | "urgent") => {
    switch (priority) {
      case "urgent":
        return "border-r-4 border-r-red-500 bg-red-50/50";
      case "high":
        return "border-r-4 border-r-orange-500 bg-orange-50/50";
      case "medium":
        return "border-r-4 border-r-blue-500 bg-blue-50/50";
      default:
        return "border-r-4 border-r-gray-300 bg-white";
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-20" dir="rtl">
      {/* Mobile-First Header */}
      <div className="sticky top-0 sm:top-16 z-40 bg-gradient-to-br from-purple-600 to-blue-600 text-white">
        <div className="px-3 sm:px-4 pt-3 sm:pt-4 pb-2">
          {/* العنوان والإحصائيات */}
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2 sm:gap-3">
              <div className="relative">
                <Bell className="w-5 h-5 sm:w-6 sm:h-6" />
                {totalUnread > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] rounded-full w-4 h-4 flex items-center justify-center font-bold">
                    {totalUnread > 9 ? "9+" : totalUnread}
                  </span>
                )}
              </div>
              <div>
                <h1 className="text-base sm:text-lg font-bold">الإشعارات</h1>
                <p className="text-xs text-white/80">{totalUnread} غير مقروء</p>
              </div>
            </div>
            <button 
              onClick={markAllAsRead}
              className="text-xs sm:text-sm bg-white/20 hover:bg-white/30 px-2 sm:px-3 py-1 sm:py-1.5 rounded-lg transition-colors"
            >
              تعليم الكل كمقروء
            </button>
          </div>

          {/* البحث */}
          <div className="relative mb-3">
            <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-white/60" />
            <Input
              placeholder="ابحث في الإشعارات..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pr-10 bg-white/10 border-white/20 text-white placeholder:text-white/60 focus:bg-white/20 text-sm"
            />
          </div>

        </div>
      </div>

      {/* Content */}
      <div className="px-3 sm:px-4 pt-4 space-y-3">
        {/* قسم الإشعارات - Compact Mobile Design */}
        <div className="space-y-2">
          {filteredNotifications.map((notification) => {
            const Icon = getIcon(notification.category);
            return (
              <div
                key={notification.id}
                onClick={() => markAsRead(notification.id)}
                className={cn(
                  "bg-white rounded-xl p-3 shadow-sm cursor-pointer transition-all active:scale-[0.98]",
                  !notification.read && "ring-2 ring-blue-500/20",
                  getPriorityColor(notification.priority)
                )}
              >
                <div className="flex items-start gap-3">
                  {notification.avatar ? (
                    <Avatar className="w-10 h-10 flex-shrink-0">
                      <AvatarImage src={notification.avatar} />
                      <AvatarFallback><User className="w-5 h-5" /></AvatarFallback>
                    </Avatar>
                  ) : (
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center flex-shrink-0">
                      <Icon className="w-5 h-5 text-white" />
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2 mb-1">
                      <h4 className="text-sm font-semibold text-gray-900 leading-tight">{notification.title}</h4>
                      {getTypeIcon(notification.type)}
                    </div>
                    <p className="text-xs text-gray-600 line-clamp-2 mb-2">{notification.message}</p>
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-gray-500">{formatTime(notification.timestamp)}</span>
                      <div className="flex items-center gap-1">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleStar(notification.id);
                          }}
                          className="p-1"
                        >
                          <Star className={cn("w-4 h-4", notification.starred ? "text-yellow-500 fill-yellow-500" : "text-gray-400")} />
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            removeItem(notification.id);
                          }}
                          className="p-1 text-red-500"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Mobile Bottom Action Bar - Hidden on larger screens */}
      <div className="fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-md border-t border-gray-200 p-3 z-50 lg:hidden">
        <div className="flex items-center gap-2">
          <Button
            onClick={markAllAsRead}
            className="flex-1 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 shadow-lg"
            size="sm"
          >
            <CheckCircle2 className="w-4 h-4 mr-1" />
            تعليم الكل كمقروء
          </Button>
          <Button
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            variant="outline"
            size="sm"
            className="flex-1"
          >
            <ArrowLeft className="w-4 h-4 ml-1 rotate-90" />
            للأعلى
          </Button>
        </div>
      </div>
    </div>
  );
}
