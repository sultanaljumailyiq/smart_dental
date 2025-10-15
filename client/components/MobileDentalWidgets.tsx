import React, { useState } from "react";
import {
  Calendar,
  Clock,
  Heart,
  Users,
  TrendingUp,
  Activity,
  MapPin,
  Phone,
  Stethoscope,
  Shield,
  Star,
  ChevronRight,
  Bell,
  User,
  CheckCircle,
  AlertCircle,
  Zap,
  Target,
  Award,
  DollarSign,
  BarChart3,
  PieChart,
  Timer,
  BookOpen,
  MessageCircle,
  Camera,
  Settings,
  Plus,
  Filter,
  Search,
  X,
  Sparkles,
  FileText,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface QuickStatWidget {
  id: string;
  title: string;
  value: string;
  change?: string;
  changeType?: "increase" | "decrease" | "neutral";
  icon: React.ComponentType<any>;
  color: string;
  bgColor: string;
  action?: () => void;
}

interface CompactCard {
  id: string;
  title: string;
  subtitle?: string;
  value?: string;
  icon: React.ComponentType<any>;
  color: string;
  bgGradient: string;
  status?: "active" | "pending" | "completed";
  progress?: number;
  actions?: Array<{
    label: string;
    action: () => void;
    variant: "primary" | "secondary";
  }>;
}

interface TimelineEvent {
  id: string;
  time: string;
  title: string;
  type: "appointment" | "treatment" | "checkup" | "break";
  status: "completed" | "current" | "upcoming";
  duration: string;
  patient?: string;
  icon: React.ComponentType<any>;
  color: string;
}

interface NotificationItem {
  id: string;
  title: string;
  message: string;
  time: string;
  type: "appointment" | "payment" | "reminder" | "emergency";
  read: boolean;
  icon: React.ComponentType<any>;
  color: string;
}

const quickStats: QuickStatWidget[] = [
  {
    id: "patients",
    title: "مرضى اليوم",
    value: "24",
    change: "+12%",
    changeType: "increase",
    icon: Users,
    color: "text-blue-600",
    bgColor: "bg-blue-100",
  },
  {
    id: "revenue",
    title: "الإيرادات",
    value: "2.5M",
    change: "+8%",
    changeType: "increase",
    icon: DollarSign,
    color: "text-green-600",
    bgColor: "bg-green-100",
  },
  {
    id: "appointments",
    title: "المواعيد",
    value: "18",
    change: "-3%",
    changeType: "decrease",
    icon: Calendar,
    color: "text-purple-600",
    bgColor: "bg-purple-100",
  },
  {
    id: "satisfaction",
    title: "معدل الرضا",
    value: "98%",
    change: "+2%",
    changeType: "increase",
    icon: Heart,
    color: "text-red-600",
    bgColor: "bg-red-100",
  },
];

const compactCards: CompactCard[] = [
  {
    id: "emergency",
    title: "حالات الطوارئ",
    subtitle: "3 حالات نشطة",
    icon: AlertCircle,
    color: "text-red-600",
    bgGradient: "from-red-500 to-red-600",
    status: "active",
    actions: [
      { label: "عرض", action: () => {}, variant: "primary" },
      { label: "إضافة", action: () => {}, variant: "secondary" },
    ],
  },
  {
    id: "treatments",
    title: "خطط العلاج",
    subtitle: "12 خطة نشطة",
    value: "85%",
    icon: Activity,
    color: "text-blue-600",
    bgGradient: "from-blue-500 to-indigo-600",
    status: "active",
    progress: 85,
  },
  {
    id: "appointments",
    title: "المواعيد القادمة",
    subtitle: "5 مواعيد اليوم",
    icon: Calendar,
    color: "text-purple-600",
    bgGradient: "from-purple-500 to-purple-600",
    status: "pending",
  },
  {
    id: "reports",
    title: "التقارير",
    subtitle: "تقرير أسبوعي",
    icon: BarChart3,
    color: "text-green-600",
    bgGradient: "from-green-500 to-emerald-600",
    status: "completed",
  },
];

const timelineEvents: TimelineEvent[] = [
  {
    id: "1",
    time: "09:00",
    title: "فحص دوري",
    type: "checkup",
    status: "completed",
    duration: "30 دقيقة",
    patient: "أحمد محمد",
    icon: Stethoscope,
    color: "green",
  },
  {
    id: "2",
    time: "09:30",
    title: "علاج عصب",
    type: "treatment",
    status: "current",
    duration: "45 دقيقة",
    patient: "فاطمة علي",
    icon: Activity,
    color: "blue",
  },
  {
    id: "3",
    time: "10:15",
    title: "استراحة",
    type: "break",
    status: "upcoming",
    duration: "15 دقيقة",
    icon: Timer,
    color: "gray",
  },
  {
    id: "4",
    time: "10:30",
    title: "تبييض أسنان",
    type: "appointment",
    status: "upcoming",
    duration: "60 دقيقة",
    patient: "سارة أحمد",
    icon: Sparkles,
    color: "purple",
  },
];

const notifications: NotificationItem[] = [
  {
    id: "1",
    title: "موعد جديد",
    message: "تم حجز موعد مع المريض أحمد محمد",
    time: "منذ 5 دقائق",
    type: "appointment",
    read: false,
    icon: Calendar,
    color: "blue",
  },
  {
    id: "2",
    title: "دفعة مالية",
    message: "تم استلام دفعة بقيمة 250 ألف دينار",
    time: "منذ 15 دقيقة",
    type: "payment",
    read: false,
    icon: DollarSign,
    color: "green",
  },
  {
    id: "3",
    title: "تذكير",
    message: "موعد المريض سارة أحمد غداً الساعة 10:00",
    time: "منذ ساعة",
    type: "reminder",
    read: true,
    icon: Bell,
    color: "orange",
  },
];

export default function MobileDentalWidgets() {
  const [selectedWidget, setSelectedWidget] = useState<string | null>(null);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showTimeline, setShowTimeline] = useState(false);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "text-green-600 bg-green-100";
      case "current":
        return "text-blue-600 bg-blue-100";
      case "upcoming":
        return "text-gray-600 bg-gray-100";
      case "active":
        return "text-red-600 bg-red-100";
      case "pending":
        return "text-yellow-600 bg-yellow-100";
      default:
        return "text-gray-600 bg-gray-100";
    }
  };

  const getTimelineColor = (color: string) => {
    switch (color) {
      case "green":
        return "bg-green-500";
      case "blue":
        return "bg-blue-500";
      case "purple":
        return "bg-purple-500";
      case "gray":
        return "bg-gray-400";
      default:
        return "bg-blue-500";
    }
  };

  const QuickStatsGrid = () => (
    <div className="grid grid-cols-2 gap-3 mb-4">
      {quickStats.map((stat) => (
        <div
          key={stat.id}
          className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 hover:shadow-md transition-all duration-300"
          onClick={stat.action}
        >
          <div className="flex items-center justify-between mb-3">
            <div
              className={cn(
                "w-10 h-10 rounded-xl flex items-center justify-center",
                stat.bgColor,
              )}
            >
              <stat.icon className={cn("w-5 h-5", stat.color)} />
            </div>
            {stat.change && (
              <div
                className={cn(
                  "text-xs font-medium px-2 py-1 rounded-full",
                  stat.changeType === "increase"
                    ? "text-green-600 bg-green-50"
                    : stat.changeType === "decrease"
                      ? "text-red-600 bg-red-50"
                      : "text-gray-600 bg-gray-50",
                )}
              >
                {stat.change}
              </div>
            )}
          </div>
          <div className="text-2xl font-bold text-gray-900 mb-1">
            {stat.value}
          </div>
          <div className="text-sm text-gray-600">{stat.title}</div>
        </div>
      ))}
    </div>
  );

  const CompactCardsGrid = () => (
    <div className="grid grid-cols-2 gap-3 mb-4">
      {compactCards.map((card) => (
        <div
          key={card.id}
          className="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100 hover:shadow-md transition-all duration-300"
          onClick={() =>
            setSelectedWidget(selectedWidget === card.id ? null : card.id)
          }
        >
          {/* Gradient Header */}
          <div
            className={cn(
              "bg-gradient-to-r p-4 text-white relative",
              card.bgGradient,
            )}
          >
            <div className="flex items-center justify-between mb-2">
              <card.icon className="w-6 h-6" />
              <div
                className={cn(
                  "px-2 py-1 rounded-full text-xs font-medium bg-white/20",
                )}
              >
                {card.status === "active"
                  ? "نشط"
                  : card.status === "pending"
                    ? "قيد الانتظار"
                    : "مكتمل"}
              </div>
            </div>
            <h3 className="font-bold text-sm">{card.title}</h3>
            <p className="text-white/80 text-xs">{card.subtitle}</p>
            {card.progress && (
              <div className="mt-2">
                <div className="bg-white/20 rounded-full h-2">
                  <div
                    className="bg-white rounded-full h-2 transition-all duration-500"
                    style={{ width: `${card.progress}%` }}
                  />
                </div>
                <div className="text-right text-xs mt-1">{card.progress}%</div>
              </div>
            )}
          </div>

          {/* Expanded Content */}
          {selectedWidget === card.id && (
            <div className="p-4 border-t">
              {card.actions && (
                <div className="flex gap-2">
                  {card.actions.map((action, index) => (
                    <button
                      key={index}
                      onClick={(e) => {
                        e.stopPropagation();
                        action.action();
                      }}
                      className={cn(
                        "px-3 py-2 rounded-lg text-xs font-medium transition-colors",
                        action.variant === "primary"
                          ? "bg-blue-600 text-white hover:bg-blue-700"
                          : "bg-gray-100 text-gray-700 hover:bg-gray-200",
                      )}
                    >
                      {action.label}
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      ))}
    </div>
  );

  const TimelineWidget = () => (
    <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 mb-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-bold text-gray-900 flex items-center gap-2">
          <Clock className="w-5 h-5 text-blue-600" />
          جدول اليوم
        </h3>
        <button
          onClick={() => setShowTimeline(!showTimeline)}
          className="text-blue-600 text-sm font-medium flex items-center gap-1"
        >
          {showTimeline ? "إخفاء" : "عرض الكل"}
          <ChevronRight
            className={cn(
              "w-4 h-4 transition-transform",
              showTimeline && "rotate-90",
            )}
          />
        </button>
      </div>

      <div className="space-y-3">
        {(showTimeline ? timelineEvents : timelineEvents.slice(0, 2)).map(
          (event, index) => (
            <div key={event.id} className="flex items-center gap-3">
              {/* Timeline dot */}
              <div className="flex flex-col items-center">
                <div
                  className={cn(
                    "w-10 h-10 rounded-full flex items-center justify-center text-white shadow-sm",
                    getTimelineColor(event.color),
                  )}
                >
                  <event.icon className="w-4 h-4" />
                </div>
                {index < (showTimeline ? timelineEvents.length - 1 : 1) && (
                  <div className="w-px h-8 bg-gray-200 mt-2" />
                )}
              </div>

              {/* Event details */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-1">
                  <h4 className="font-medium text-gray-900 text-sm">
                    {event.title}
                  </h4>
                  <span className="text-xs text-gray-500">{event.time}</span>
                </div>
                {event.patient && (
                  <p className="text-xs text-gray-600 mb-1">{event.patient}</p>
                )}
                <div className="flex items-center justify-between">
                  <span className="text-xs text-gray-500">
                    {event.duration}
                  </span>
                  <span
                    className={cn(
                      "text-xs px-2 py-1 rounded-full",
                      getStatusColor(event.status),
                    )}
                  >
                    {event.status === "completed"
                      ? "مكتمل"
                      : event.status === "current"
                        ? "حالي"
                        : "قادم"}
                  </span>
                </div>
              </div>
            </div>
          ),
        )}
      </div>
    </div>
  );

  const NotificationWidget = () => (
    <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 mb-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-bold text-gray-900 flex items-center gap-2">
          <Bell className="w-5 h-5 text-blue-600" />
          التنبيهات
          {notifications.filter((n) => !n.read).length > 0 && (
            <span className="bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
              {notifications.filter((n) => !n.read).length}
            </span>
          )}
        </h3>
        <button
          onClick={() => setShowNotifications(!showNotifications)}
          className="text-blue-600 text-sm font-medium"
        >
          {showNotifications ? "إخفاء" : "عرض الكل"}
        </button>
      </div>

      <div className="space-y-3">
        {(showNotifications ? notifications : notifications.slice(0, 2)).map(
          (notification) => (
            <div
              key={notification.id}
              className={cn(
                "flex items-start gap-3 p-3 rounded-lg transition-colors",
                notification.read
                  ? "bg-gray-50"
                  : "bg-blue-50 border border-blue-100",
              )}
            >
              <div
                className={cn(
                  "w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0",
                  notification.color === "blue"
                    ? "bg-blue-100 text-blue-600"
                    : notification.color === "green"
                      ? "bg-green-100 text-green-600"
                      : notification.color === "orange"
                        ? "bg-orange-100 text-orange-600"
                        : "bg-gray-100 text-gray-600",
                )}
              >
                <notification.icon className="w-4 h-4" />
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="font-medium text-gray-900 text-sm mb-1">
                  {notification.title}
                </h4>
                <p className="text-xs text-gray-600 mb-1">
                  {notification.message}
                </p>
                <span className="text-xs text-gray-500">
                  {notification.time}
                </span>
              </div>
              {!notification.read && (
                <div className="w-2 h-2 bg-blue-500 rounded-full flex-shrink-0 mt-2" />
              )}
            </div>
          ),
        )}
      </div>
    </div>
  );

  const QuickActionsWidget = () => (
    <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 mb-4">
      <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
        <Zap className="w-5 h-5 text-blue-600" />
        إجراءات سريعة
      </h3>
      <div className="grid grid-cols-3 gap-3">
        {[
          { icon: Plus, label: "موعد جديد", color: "blue" },
          { icon: Camera, label: "تصوير أشعة", color: "purple" },
          { icon: MessageCircle, label: "رسالة", color: "green" },
          { icon: FileText, label: "تقرير", color: "orange" },
          { icon: Settings, label: "إعدادات", color: "gray" },
          { icon: Search, label: "بحث", color: "indigo" },
        ].map((action, index) => (
          <button
            key={index}
            className={cn(
              "flex flex-col items-center gap-2 p-3 rounded-xl transition-all duration-200 hover:scale-105",
              action.color === "blue"
                ? "bg-blue-50 text-blue-600 hover:bg-blue-100"
                : action.color === "purple"
                  ? "bg-purple-50 text-purple-600 hover:bg-purple-100"
                  : action.color === "green"
                    ? "bg-green-50 text-green-600 hover:bg-green-100"
                    : action.color === "orange"
                      ? "bg-orange-50 text-orange-600 hover:bg-orange-100"
                      : action.color === "gray"
                        ? "bg-gray-50 text-gray-600 hover:bg-gray-100"
                        : "bg-indigo-50 text-indigo-600 hover:bg-indigo-100",
            )}
          >
            <action.icon className="w-5 h-5" />
            <span className="text-xs font-medium">{action.label}</span>
          </button>
        ))}
      </div>
    </div>
  );

  return (
    <div className="space-y-4 p-4 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold text-gray-900">مرحباً، د. أحمد</h1>
            <p className="text-sm text-gray-600">لديك 5 مواعيد اليوم</p>
          </div>
          <div className="flex items-center gap-2">
            <button className="relative p-2 bg-blue-50 rounded-xl">
              <Bell className="w-5 h-5 text-blue-600" />
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full"></div>
            </button>
            <div className="w-8 h-8 bg-blue-600 rounded-xl flex items-center justify-center">
              <User className="w-4 h-4 text-white" />
            </div>
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      <QuickStatsGrid />

      {/* Compact Cards */}
      <CompactCardsGrid />

      {/* Timeline Widget */}
      <TimelineWidget />

      {/* Notifications Widget */}
      <NotificationWidget />

      {/* Quick Actions */}
      <QuickActionsWidget />

      {/* Performance Chart Widget */}
      <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
        <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
          <TrendingUp className="w-5 h-5 text-blue-600" />
          الأداء الشهري
        </h3>
        <div className="h-32 bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl flex items-end justify-center p-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-gray-900">+15%</div>
            <div className="text-sm text-gray-600">زيادة في الإيرادات</div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Export individual widget components for use in other parts of the app
// Export components
