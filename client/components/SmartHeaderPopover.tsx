import React, { useState } from "react";
import { Link } from "react-router-dom";
import {
  ArrowRight,
  Star,
  Clock,
  Calendar,
  Users,
  MapPin,
  Phone,
  MessageCircle,
  Stethoscope,
  Brain,
  Camera,
  FileText,
  Shield,
  Bookmark,
  Heart,
  Package,
  Building2,
  GraduationCap,
  Briefcase,
  Globe,
  Zap,
  Gift,
  TrendingUp,
  Award,
  Search,
  Plus,
  Activity,
  Settings,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";

interface QuickAction {
  id: string;
  title: string;
  description: string;
  icon: React.ComponentType<any>;
  path: string;
  color: string;
  badge?: string;
  isNew?: boolean;
  isPopular?: boolean;
}

interface PopoverSection {
  id: string;
  title: string;
  description: string;
  icon: React.ComponentType<any>;
  quickActions: QuickAction[];
  mainAction: {
    title: string;
    path: string;
  };
}

const medicalServicesActions: QuickAction[] = [
  {
    id: "ai-diagnosis",
    title: "التشخيص الذكي",
    description: "تشخيص فوري بالذكاء الاصطناعي",
    icon: Brain,
    path: "/ai-diagnosis",
    color: "purple",
    badge: "AI",
    isNew: true,
  },
  {
    id: "smart-chat",
    title: "الاستشارة الذكية",
    description: "دردشة مع مساعد طبي ذكي",
    icon: MessageCircle,
    path: "/smart-chat",
    color: "blue",
    isPopular: true,
  },
  {
    id: "photo-analysis",
    title: "تحليل الصور",
    description: "فحص الأشعة والصور الطبية",
    icon: Camera,
    path: "/photo-analysis",
    color: "green",
  },
  {
    id: "emergency",
    title: "الطوارئ",
    description: "خدمات طوارئ على مدار الساعة",
    icon: Shield,
    path: "/emergency",
    color: "red",
    badge: "24/7",
  },
];

const marketplaceActions: QuickAction[] = [
  {
    id: "dental-supply",
    title: "المتجر الطبي",
    description: "معدات ومستلزمات طبية",
    icon: Package,
    path: "/dental-supply",
    color: "emerald",
    isPopular: true,
  },
  {
    id: "trending",
    title: "الأكثر مبيعاً",
    description: "أشهر المنتجات والمعدات",
    icon: TrendingUp,
    path: "/trending",
    color: "orange",
  },
  {
    id: "offers",
    title: "العروض والخصومات",
    description: "أفضل العروض المتاحة",
    icon: Gift,
    path: "/offers",
    color: "pink",
    badge: "خصم",
  },
  {
    id: "suppliers",
    title: "الموردين",
    description: "شبكة موردين موثقة",
    icon: Building2,
    path: "/suppliers",
    color: "indigo",
  },
];

const communityActions: QuickAction[] = [
  {
    id: "community",
    title: "المجتمع الطبي",
    description: "تواصل مع الأطباء والمختصين",
    icon: Users,
    path: "/community",
    color: "blue",
    isPopular: true,
  },
  {
    id: "education",
    title: "التعليم الطبي",
    description: "دورات ومحتوى تعليمي",
    icon: GraduationCap,
    path: "/education",
    color: "green",
  },
  {
    id: "articles",
    title: "المقالات الطبية",
    description: "أحدث المقالات والنصائح",
    icon: FileText,
    path: "/articles",
    color: "purple",
    isNew: true,
  },
  {
    id: "events",
    title: "الفعاليات",
    description: "مؤتمرات وورش عمل",
    icon: Calendar,
    path: "/community/events",
    color: "amber",
  },
];

const jobsActions: QuickAction[] = [
  {
    id: "jobs",
    title: "الوظائف الطبية",
    description: "فرص عمل في المجال الطبي",
    icon: Briefcase,
    path: "/jobs",
    color: "indigo",
    isPopular: true,
  },
  {
    id: "freelance",
    title: "العمل الحر",
    description: "مشاريع ومهام قصيرة المدى",
    icon: Globe,
    path: "/jobs?tab=freelance",
    color: "teal",
  },
  {
    id: "internships",
    title: "ا��تدريب العملي",
    description: "برامج تدريب للطلاب",
    icon: GraduationCap,
    path: "/jobs?tab=internships",
    color: "cyan",
  },
  {
    id: "consultancy",
    title: "الاستشارات",
    description: "خدمات استشارية متخصصة",
    icon: Star,
    path: "/jobs?tab=consultancy",
    color: "yellow",
  },
];

const popoverSections: PopoverSection[] = [
  {
    id: "medical",
    title: "الخدمات الطبية",
    description: "خدمات طبية متطورة بتقنيات حديثة",
    icon: Stethoscope,
    quickActions: medicalServicesActions,
    mainAction: {
      title: "تصفح جميع الخدمات",
      path: "/medical-services",
    },
  },
  {
    id: "marketplace",
    title: "المتجر الطبي",
    description: "كل ما تحتاجه من معدات ومستلزمات",
    icon: Package,
    quickActions: marketplaceActions,
    mainAction: {
      title: "تصفح المتجر",
      path: "/dental-supply",
    },
  },
  {
    id: "community",
    title: "المجتمع",
    description: "تواصل وتعلم مع المجتمع الطبي",
    icon: Users,
    quickActions: communityActions,
    mainAction: {
      title: "انضم للمجتمع",
      path: "/community",
    },
  },
  {
    id: "jobs",
    title: "الوظائف",
    description: "فرص عمل ومشاريع في المجال الطبي",
    icon: Briefcase,
    quickActions: jobsActions,
    mainAction: {
      title: "تصفح الوظائف",
      path: "/jobs",
    },
  },
];

interface SmartHeaderPopoverProps {
  section: "medical" | "marketplace" | "community" | "jobs";
  trigger: React.ReactNode;
  side?: "top" | "right" | "bottom" | "left";
  align?: "start" | "center" | "end";
}

export default function SmartHeaderPopover({
  section,
  trigger,
  side = "bottom",
  align = "center",
}: SmartHeaderPopoverProps) {
  const [isOpen, setIsOpen] = useState(false);

  const sectionData = popoverSections.find((s) => s.id === section);
  if (!sectionData) return trigger;

  const getColorClasses = (
    color: string,
    variant: "bg" | "text" | "border" = "bg",
  ) => {
    const colors = {
      blue: {
        bg: "bg-blue-100",
        text: "text-blue-600",
        border: "border-blue-200",
      },
      purple: {
        bg: "bg-purple-100",
        text: "text-purple-600",
        border: "border-purple-200",
      },
      green: {
        bg: "bg-green-100",
        text: "text-green-600",
        border: "border-green-200",
      },
      emerald: {
        bg: "bg-emerald-100",
        text: "text-emerald-600",
        border: "border-emerald-200",
      },
      red: {
        bg: "bg-red-100",
        text: "text-red-600",
        border: "border-red-200",
      },
      orange: {
        bg: "bg-orange-100",
        text: "text-orange-600",
        border: "border-orange-200",
      },
      pink: {
        bg: "bg-pink-100",
        text: "text-pink-600",
        border: "border-pink-200",
      },
      indigo: {
        bg: "bg-indigo-100",
        text: "text-indigo-600",
        border: "border-indigo-200",
      },
      teal: {
        bg: "bg-teal-100",
        text: "text-teal-600",
        border: "border-teal-200",
      },
      cyan: {
        bg: "bg-cyan-100",
        text: "text-cyan-600",
        border: "border-cyan-200",
      },
      yellow: {
        bg: "bg-yellow-100",
        text: "text-yellow-600",
        border: "border-yellow-200",
      },
      amber: {
        bg: "bg-amber-100",
        text: "text-amber-600",
        border: "border-amber-200",
      },
    };

    return (
      colors[color as keyof typeof colors]?.[variant] || colors.blue[variant]
    );
  };

  return (
    <HoverCard open={isOpen} onOpenChange={setIsOpen}>
      <HoverCardTrigger asChild>
        <div
          onMouseEnter={() => setIsOpen(true)}
          onMouseLeave={() => setIsOpen(false)}
        >
          {trigger}
        </div>
      </HoverCardTrigger>
      <HoverCardContent
        side={side}
        align={align}
        className="w-96 p-0 border-0 shadow-2xl z-[120]"
        onMouseEnter={() => setIsOpen(true)}
        onMouseLeave={() => setIsOpen(false)}
      >
        <div className="bg-white rounded-2xl overflow-hidden">
          {/* Header */}
          <div className="p-6 border-b border-gray-100 bg-gradient-to-r from-gray-50 to-blue-50">
            <div className="flex items-center gap-3 mb-2">
              <div
                className={cn(
                  "w-10 h-10 rounded-xl flex items-center justify-center",
                  getColorClasses(sectionData.quickActions[0]?.color || "blue"),
                )}
              >
                <sectionData.icon className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-gray-900">{sectionData.title}</h3>
                <p className="text-sm text-gray-600">
                  {sectionData.description}
                </p>
              </div>
            </div>
          </div>

          {/* Quick Actions Grid */}
          <div className="p-6">
            <div className="grid grid-cols-2 gap-3 mb-4">
              {sectionData.quickActions.map((action) => {
                const Icon = action.icon;
                return (
                  <Link
                    key={action.id}
                    to={action.path}
                    className="group p-3 rounded-xl border border-gray-100 hover:border-gray-200 hover:bg-gray-50 transition-all duration-200"
                    onClick={() => setIsOpen(false)}
                  >
                    <div className="flex items-start gap-3">
                      <div
                        className={cn(
                          "w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0",
                          getColorClasses(action.color),
                        )}
                      >
                        <Icon
                          className={cn(
                            "w-4 h-4",
                            getColorClasses(action.color, "text"),
                          )}
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between mb-1">
                          <h4 className="font-medium text-gray-900 text-sm group-hover:text-blue-600 transition-colors">
                            {action.title}
                          </h4>
                          {(action.badge ||
                            action.isNew ||
                            action.isPopular) && (
                            <div className="flex items-center gap-1 ml-1">
                              {action.badge && (
                                <Badge
                                  variant="secondary"
                                  className="text-xs px-1.5 py-0.5"
                                >
                                  {action.badge}
                                </Badge>
                              )}
                              {action.isNew && (
                                <Badge className="text-xs px-1.5 py-0.5 bg-green-500">
                                  جديد
                                </Badge>
                              )}
                              {action.isPopular && (
                                <Badge className="text-xs px-1.5 py-0.5 bg-orange-500">
                                  شائع
                                </Badge>
                              )}
                            </div>
                          )}
                        </div>
                        <p className="text-xs text-gray-600 line-clamp-2">
                          {action.description}
                        </p>
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>

            {/* Main Action Button */}
            <Link
              to={sectionData.mainAction.path}
              className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 px-4 rounded-xl font-medium hover:from-blue-700 hover:to-purple-700 transition-all duration-200 group"
              onClick={() => setIsOpen(false)}
            >
              <span>{sectionData.mainAction.title}</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </div>
      </HoverCardContent>
    </HoverCard>
  );
}

// مكون مخصص للإشعارات السريعة
export function NotificationsQuickPopover({
  trigger,
}: {
  trigger: React.ReactNode;
}) {
  const [isOpen, setIsOpen] = useState(false);

  const quickNotifications = [
    {
      id: "1",
      title: "موعد جديد",
      description: "لديك موعد غداً في الساعة 3:00 مساءً",
      time: "منذ 5 دقائق",
      type: "appointment",
      icon: Calendar,
      color: "blue",
    },
    {
      id: "2",
      title: "رسالة جديدة",
      description: "د. أحمد أرسل لك رسالة",
      time: "منذ 10 دقائق",
      type: "message",
      icon: MessageCircle,
      color: "green",
    },
    {
      id: "3",
      title: "نتائج الفحص",
      description: "نتائج فحص الأشعة متاحة الآن",
      time: "منذ ساعة",
      type: "result",
      icon: FileText,
      color: "purple",
    },
  ];

  return (
    <HoverCard open={isOpen} onOpenChange={setIsOpen}>
      <HoverCardTrigger asChild>
        <div
          onMouseEnter={() => setIsOpen(true)}
          onMouseLeave={() => setIsOpen(false)}
        >
          {trigger}
        </div>
      </HoverCardTrigger>
      <HoverCardContent
        side="bottom"
        align="end"
        className="w-80 p-0 border-0 shadow-2xl z-[120]"
        onMouseEnter={() => setIsOpen(true)}
        onMouseLeave={() => setIsOpen(false)}
      >
        <div className="bg-white rounded-2xl overflow-hidden">
          {/* Header */}
          <div className="p-4 border-b border-gray-100 bg-gradient-to-r from-blue-50 to-purple-50">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-gray-900">الإشعارات</h3>
              <Badge variant="secondary" className="text-xs">
                {quickNotifications.length} جديد
              </Badge>
            </div>
          </div>

          {/* Notifications List */}
          <div className="max-h-64 overflow-y-auto">
            {quickNotifications.map((notification) => {
              const Icon = notification.icon;
              return (
                <div
                  key={notification.id}
                  className="p-4 border-b border-gray-100 last:border-b-0 hover:bg-gray-50 cursor-pointer transition-colors"
                >
                  <div className="flex items-start gap-3">
                    <div
                      className={cn(
                        "w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0",
                        notification.color === "blue" && "bg-blue-100",
                        notification.color === "green" && "bg-green-100",
                        notification.color === "purple" && "bg-purple-100",
                      )}
                    >
                      <Icon
                        className={cn(
                          "w-4 h-4",
                          notification.color === "blue" && "text-blue-600",
                          notification.color === "green" && "text-green-600",
                          notification.color === "purple" && "text-purple-600",
                        )}
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-medium text-gray-900 text-sm">
                        {notification.title}
                      </h4>
                      <p className="text-xs text-gray-600 mt-1 line-clamp-2">
                        {notification.description}
                      </p>
                      <p className="text-xs text-gray-500 mt-2">
                        {notification.time}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Footer */}
          <div className="p-4 bg-gray-50 border-t border-gray-100">
            <Link
              to="/dentist-hub/notifications"
              className="w-full flex items-center justify-center gap-2 text-blue-600 hover:text-blue-700 font-medium text-sm transition-colors"
              onClick={() => setIsOpen(false)}
            >
              <span>عرض جميع الإشعارات</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </HoverCardContent>
    </HoverCard>
  );
}

// مكون البحث السريع
export function QuickSearchPopover({ trigger }: { trigger: React.ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const quickSearchSuggestions = [
    { title: "تشخيص ذكي", path: "/ai-diagnosis", icon: Brain, type: "خدمة" },
    {
      title: "معدات الأسنان",
      path: "/dental-supply",
      icon: Package,
      type: "منتج",
    },
    { title: "مقالات طبية", path: "/articles", icon: FileText, type: "محتوى" },
    { title: "وظائف طبية", path: "/jobs", icon: Briefcase, type: "وظيفة" },
  ];

  return (
    <HoverCard open={isOpen} onOpenChange={setIsOpen}>
      <HoverCardTrigger asChild>
        <div
          onMouseEnter={() => setIsOpen(true)}
          onMouseLeave={() => setIsOpen(false)}
        >
          {trigger}
        </div>
      </HoverCardTrigger>
      <HoverCardContent
        side="bottom"
        align="center"
        className="w-80 p-0 border-0 shadow-2xl z-[120]"
        onMouseEnter={() => setIsOpen(true)}
        onMouseLeave={() => setIsOpen(false)}
      >
        <div className="bg-white rounded-2xl overflow-hidden">
          {/* Search Input */}
          <div className="p-4 border-b border-gray-100">
            <div className="relative">
              <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="ابحث في المنصة..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pr-10 pl-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                autoFocus
              />
            </div>
          </div>

          {/* Quick Suggestions */}
          <div className="p-4">
            <h4 className="text-sm font-medium text-gray-700 mb-3">
              اقتراحات سريعة
            </h4>
            <div className="space-y-2">
              {quickSearchSuggestions.map((suggestion, index) => {
                const Icon = suggestion.icon;
                return (
                  <Link
                    key={index}
                    to={suggestion.path}
                    className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-50 transition-colors group"
                    onClick={() => setIsOpen(false)}
                  >
                    <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center">
                      <Icon className="w-4 h-4 text-gray-600" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-gray-900 group-hover:text-blue-600">
                          {suggestion.title}
                        </span>
                        <Badge variant="outline" className="text-xs">
                          {suggestion.type}
                        </Badge>
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>

          {/* Footer */}
          <div className="p-4 bg-gray-50 border-t border-gray-100">
            <Link
              to="/search"
              className="w-full flex items-center justify-center gap-2 text-blue-600 hover:text-blue-700 font-medium text-sm transition-colors"
              onClick={() => setIsOpen(false)}
            >
              <span>البحث المتقدم</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </HoverCardContent>
    </HoverCard>
  );
}
