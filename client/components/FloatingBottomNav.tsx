import React, { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  Home,
  MessageCircle,
  PlusCircle,
  Search,
  User,
  ShoppingCart,
  Heart,
  BookOpen,
  Briefcase,
  Calendar,
  Award,
  Settings,
  Bell,
  Store,
  Users,
  Layers,
  TrendingUp,
  FileText,
  Building,
  Zap,
  Star,
  Grid3X3,
  Globe,
  Package,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface FloatingBottomNavProps {
  onCreatePost?: () => void;
}

type SectionType =
  | "marketplace"
  | "community"
  | "jobs"
  | "education"
  | "default";

export default function FloatingBottomNav({
  onCreatePost,
}: FloatingBottomNavProps) {
  const location = useLocation();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("");
  const [showMoreMenu, setShowMoreMenu] = useState(false);
  const [currentSection, setCurrentSection] = useState<SectionType>("default");

  // تحديد القسم الحالي تلقائياً
  useEffect(() => {
    const path = location.pathname;
    const urlParams = new URLSearchParams(location.search);
    const sectionParam = urlParams.get("section");

    // إذا كانت صفحة ال��فضلات، استخدم معامل section من URL
    if (path.includes("/favorites") && sectionParam) {
      const validSections: SectionType[] = [
        "marketplace",
        "community",
        "jobs",
        "education",
      ];
      if (validSections.includes(sectionParam as SectionType)) {
        setCurrentSection(sectionParam as SectionType);
      } else {
        setCurrentSection("default");
      }
    } else if (
      path.includes("/dental-supply") ||
      path.includes("/marketplace") ||
      path.includes("/products") ||
      path.includes("/categories") ||
      path.includes("/brands") ||
      path.includes("/suppliers") ||
      path.includes("/cart") ||
      path.includes("/product/")
    ) {
      setCurrentSection("marketplace");
    } else if (path.includes("/community") || path.includes("/articles")) {
      setCurrentSection("community");
    } else if (path.includes("/jobs")) {
      setCurrentSection("jobs");
    } else if (path.includes("/education")) {
      setCurrentSection("education");
    } else {
      setCurrentSection("default");
    }

    // تحديد التبويب النشط
    if (path === "/" || path === "/landing") setActiveTab("home");
    else if (path.includes("/community")) setActiveTab("community");
    else if (path.includes("/search")) setActiveTab("search");
    else if (path.includes("/dental-supply") || path.includes("/marketplace"))
      setActiveTab("marketplace");
    else if (path.includes("/favorites")) setActiveTab("favorites");
    else if (path.includes("/cart")) setActiveTab("cart");
    else if (path.includes("/profile") || path.includes("/dashboard"))
      setActiveTab("profile");
    else if (path.includes("/education")) setActiveTab("education");
    else if (path.includes("/jobs")) setActiveTab("jobs");
    else setActiveTab("");
  }, [location.pathname, location.search]);

  const handleCreatePost = () => {
    if (onCreatePost) {
      onCreatePost();
    }

    window.scrollTo({ top: 0, behavior: "smooth" });

    setTimeout(() => {
      const createPostButton = document.querySelector(
        "[data-create-post]",
      ) as HTMLElement;
      const createPostInput = document.querySelector(
        'textarea[placeholder*="ما الذي تريد مشاركته"]',
      ) as HTMLTextAreaElement;

      if (createPostButton) {
        createPostButton.click();
      } else if (createPostInput) {
        createPostInput.focus();
        createPostInput.scrollIntoView({ behavior: "smooth", block: "center" });
      }
    }, 600);
  };

  // الحصول على التبويبات حسب القسم الحالي
  const getMainTabs = () => {
    switch (currentSection) {
      case "marketplace":
        return [
          {
            id: "marketplace",
            label: "المتجر",
            icon: Store,
            path: "/dental-supply",
            color: "blue",
            gradient: "from-blue-500 to-blue-600",
          },
          {
            id: "search",
            label: "البحث",
            icon: Search,
            path: "/search",
            color: "emerald",
            gradient: "from-emerald-500 to-emerald-600",
          },
          {
            id: "favorites",
            label: "المفضلة",
            icon: Heart,
            path: "/favorites?section=marketplace",
            color: "rose",
            gradient: "from-rose-500 to-rose-600",
          },
          {
            id: "cart",
            label: "السلة",
            icon: ShoppingCart,
            path: "/cart",
            color: "violet",
            gradient: "from-violet-500 to-violet-600",
            special: true,
          },
          {
            id: "more",
            label: "المزيد",
            icon: Grid3X3,
            action: () => setShowMoreMenu(!showMoreMenu),
            isButton: true,
            color: "amber",
            gradient: "from-amber-500 to-amber-600",
          },
        ];

      case "community":
        return [
          {
            id: "community",
            label: "المجتمع",
            icon: Home,
            path: "/community",
            color: "blue",
            gradient: "from-blue-500 to-blue-600",
          },
          {
            id: "education",
            label: "التعليم",
            icon: BookOpen,
            path: "/education",
            color: "emerald",
            gradient: "from-emerald-500 to-emerald-600",
          },
          {
            id: "create",
            label: "إنشاء",
            icon: PlusCircle,
            action: handleCreatePost,
            isButton: true,
            color: "rose",
            gradient: "from-rose-500 via-pink-500 to-violet-500",
            special: true,
          },
          {
            id: "favorites",
            label: "المفضلة",
            icon: Heart,
            path: "/favorites?section=community",
            color: "violet",
            gradient: "from-violet-500 to-violet-600",
          },
          {
            id: "more",
            label: "المزيد",
            icon: Grid3X3,
            action: () => setShowMoreMenu(!showMoreMenu),
            isButton: true,
            color: "amber",
            gradient: "from-amber-500 to-amber-600",
          },
        ];

      case "jobs":
        return [
          {
            id: "jobs",
            label: "الوظائف",
            icon: Briefcase,
            path: "/jobs",
            color: "blue",
            gradient: "from-blue-500 to-blue-600",
          },
          {
            id: "search",
            label: "البحث",
            icon: Search,
            path: "/search",
            color: "emerald",
            gradient: "from-emerald-500 to-emerald-600",
          },
          {
            id: "favorites",
            label: "المفضلة",
            icon: Heart,
            path: "/favorites?section=jobs",
            color: "rose",
            gradient: "from-rose-500 to-rose-600",
          },
          {
            id: "profile",
            label: "السيرة",
            icon: User,
            path: "/profile?section=jobs",
            color: "violet",
            gradient: "from-violet-500 to-violet-600",
            special: true,
          },
          {
            id: "more",
            label: "المزيد",
            icon: Grid3X3,
            action: () => setShowMoreMenu(!showMoreMenu),
            isButton: true,
            color: "amber",
            gradient: "from-amber-500 to-amber-600",
          },
        ];

      case "education":
        return [
          {
            id: "education",
            label: "التعليم",
            icon: BookOpen,
            path: "/education",
            color: "blue",
            gradient: "from-blue-500 to-blue-600",
          },
          {
            id: "search",
            label: "البحث",
            icon: Search,
            path: "/search",
            color: "emerald",
            gradient: "from-emerald-500 to-emerald-600",
          },
          {
            id: "favorites",
            label: "المفضلة",
            icon: Heart,
            path: "/favorites?section=education",
            color: "rose",
            gradient: "from-rose-500 to-rose-600",
          },
          {
            id: "profile",
            label: "ملفي",
            icon: User,
            path: "/profile?section=education",
            color: "violet",
            gradient: "from-violet-500 to-violet-600",
          },
          {
            id: "more",
            label: "المزيد",
            icon: Grid3X3,
            action: () => setShowMoreMenu(!showMoreMenu),
            isButton: true,
            color: "amber",
            gradient: "from-amber-500 to-amber-600",
          },
        ];

      default:
        return [
          {
            id: "home",
            label: "الرئيسية",
            icon: Home,
            path: "/",
            color: "blue",
            gradient: "from-blue-500 to-blue-600",
          },
          {
            id: "community",
            label: "المجتمع",
            icon: MessageCircle,
            path: "/community",
            color: "emerald",
            gradient: "from-emerald-500 to-emerald-600",
          },
          {
            id: "marketplace",
            label: "المتجر",
            icon: Store,
            path: "/dental-supply",
            color: "rose",
            gradient: "from-rose-500 to-rose-600",
          },
          {
            id: "jobs",
            label: "الوظائف",
            icon: Briefcase,
            path: "/jobs",
            color: "violet",
            gradient: "from-violet-500 to-violet-600",
          },
          {
            id: "more",
            label: "المزيد",
            icon: Grid3X3,
            action: () => setShowMoreMenu(!showMoreMenu),
            isButton: true,
            color: "amber",
            gradient: "from-amber-500 to-amber-600",
          },
        ];
    }
  };

  // الحصول على عناصر قائمة المزيد حسب القسم
  const getMoreMenuItems = () => {
    const commonItems = [
      {
        label: "الملف الشخصي",
        icon: User,
        path: `/profile?section=${currentSection}`,
        color: "blue",
        description: `ملفك في قسم ${getSectionName()}`,
      },
      {
        label: "الإعدادات",
        icon: Settings,
        action: () => console.log("فتح الإعدادات"),
        color: "gray",
        description: "إعدادات التطبيق والحساب",
      },
      {
        label: "الإشعارات",
        icon: Bell,
        path: "/dentist-hub/notifications",
        color: "amber",
        description: "إشعاراتك والتحديثات",
      },
    ];

    const quickActions = [
      {
        label: "البحث السريع",
        icon: Search,
        path: "/search",
        color: "emerald",
        description: "ابحث في جميع الأقسام",
      },
      {
        label: "الدعم الفني",
        icon: MessageCircle,
        action: () => console.log("فتح الدعم الفني"),
        color: "purple",
        description: "تواصل مع فريق الدعم",
      },
      {
        label: "الأسئلة الشائعة",
        icon: BookOpen,
        action: () => console.log("فتح الأسئلة الشائع��"),
        color: "indigo",
        description: "إجابات للأسئلة المتكررة",
      },
    ];

    const settingsItems = [
      {
        label: "إعدادات الحساب",
        icon: User,
        action: () => console.log("إعدادات الحساب"),
        color: "blue",
        description: "تحرير بيانات الحساب الشخصي",
      },
      {
        label: "إعدادات الإشعارات",
        icon: Bell,
        action: () => console.log("إعدادات الإشعارات"),
        color: "amber",
        description: "تخصيص الإشعارات والتنبيهات",
      },
      {
        label: "إعدادات الخصوصية",
        icon: Settings,
        action: () => console.log("إعدادات الخصوصية"),
        color: "gray",
        description: "التحكم في خصوصية بياناتك",
      },
      {
        label: "إعدادات اللغة",
        icon: Globe,
        action: () => console.log("إعدادات اللغة"),
        color: "green",
        description: "تغيير لغة التطب��ق",
      },
    ];

    const sectionItems = [
      {
        title: "الأقسام الرئيسية",
        items: [
          {
            label: "المتجر الطبي",
            icon: Store,
            path: "/dental-supply",
            color: "blue",
            description: "متجر المعدا�� والمنتجات الطبية",
            isSection: true,
          },
          {
            label: "مجتمع الأطباء",
            icon: Users,
            path: "/community",
            color: "emerald",
            description: "منصة التواصل والخبرات",
            isSection: true,
          },
          {
            label: "فرص العمل",
            icon: Briefcase,
            path: "/jobs",
            color: "violet",
            description: "الوظائف والفرص المهنية",
            isSection: true,
          },
          {
            label: "التعليم الطبي",
            icon: BookOpen,
            path: "/education",
            color: "rose",
            description: "المحتوى التعليمي والدورات",
            isSection: true,
          },
        ],
      },
      {
        title: "أدوات سريعة",
        items: quickActions,
      },
      {
        title: "أدوات مفيدة",
        items: [
          {
            label: "مفضلاتي",
            icon: Heart,
            path: `/favorites?section=${currentSection}`,
            color: "red",
            description: `مفضلاتك في ${getSectionName()}`,
          },
          {
            label: "السلة",
            icon: ShoppingCart,
            path: "/cart",
            color: "orange",
            description: "عرض سلة التسوق",
          },
          {
            label: "الطلبات",
            icon: Package,
            path: "/orders",
            color: "teal",
            description: "تتبع طلباتك",
          },
        ],
      },
      {
        title: "الإعدادات",
        items: settingsItems,
      },
    ];

    return { commonItems, quickActions, settingsItems, sectionItems };
  };

  const getSectionName = () => {
    switch (currentSection) {
      case "marketplace":
        return "المتجر";
      case "community":
        return "المجتمع";
      case "jobs":
        return "الوظائف";
      case "education":
        return "التعليم";
      default:
        return "ال��طبيق";
    }
  };

  const getSectionColor = () => {
    switch (currentSection) {
      case "marketplace":
        return "from-blue-500 to-cyan-500";
      case "community":
        return "from-emerald-500 to-teal-500";
      case "jobs":
        return "from-violet-500 to-purple-500";
      case "education":
        return "from-rose-500 to-pink-500";
      default:
        return "from-gray-500 to-gray-600";
    }
  };

  const mainTabs = getMainTabs();
  const { commonItems, quickActions, settingsItems, sectionItems } =
    getMoreMenuItems();

  const TabButton = ({
    tab,
    index,
    isDesktop = false,
  }: {
    tab: any;
    index: number;
    isDesktop?: boolean;
  }) => {
    const isActive = activeTab === tab.id;
    const isSpecial = tab.special || tab.id === "create";

    if (tab.isButton && tab.action) {
      return (
        <button
          onClick={tab.action}
          className={cn(
            "relative transition-all duration-300 transform group",
            isDesktop
              ? "flex items-center gap-3 px-4 py-2 rounded-xl"
              : "flex flex-col items-center justify-center p-2",
            isSpecial && !isDesktop && "scale-110 -translate-y-1",
          )}
          style={{
            animationDelay: `${index * 100}ms`,
            animation: "slideUp 0.6s ease-out",
          }}
        >
          <div
            className={cn(
              "relative transition-all duration-300 shadow-lg",
              isDesktop ? "p-2 rounded-xl" : "p-3 rounded-2xl",
              isSpecial
                ? `bg-gradient-to-r ${tab.gradient} group-hover:shadow-xl group-active:scale-95`
                : isActive
                  ? `bg-gradient-to-r ${tab.gradient} shadow-lg`
                  : "bg-white hover:bg-gray-50 group-active:scale-95",
            )}
          >
            {isSpecial && !isDesktop && (
              <>
                <div className="absolute inset-0 bg-gradient-to-r from-rose-500 via-pink-500 to-violet-500 rounded-2xl blur opacity-60 animate-pulse" />
                <div className="absolute -top-1 -right-1 w-3 h-3 bg-yellow-400 rounded-full animate-bounce" />
              </>
            )}
            <tab.icon
              className={cn(
                "relative z-10 transition-all duration-300",
                isDesktop ? "w-5 h-5" : "w-6 h-6",
                isSpecial || isActive
                  ? "text-white"
                  : "text-gray-600 group-hover:text-gray-800",
              )}
            />
          </div>
          {isDesktop ? (
            <span
              className={cn(
                "text-sm font-semibold transition-all duration-300",
                isSpecial || isActive
                  ? "text-transparent bg-clip-text bg-gradient-to-r " +
                      tab.gradient
                  : "text-gray-700",
              )}
            >
              {tab.label}
            </span>
          ) : (
            <span
              className={cn(
                "text-xs font-semibold mt-1 transition-all duration-300 sm:text-sm",
                isSpecial || isActive
                  ? "text-transparent bg-clip-text bg-gradient-to-r " +
                      tab.gradient
                  : "text-gray-600",
              )}
            >
              {tab.label}
            </span>
          )}
        </button>
      );
    }

    return (
      <Link
        to={tab.path}
        className={cn(
          "relative transition-all duration-300 transform group",
          isDesktop
            ? "flex items-center gap-3 px-4 py-2 rounded-xl hover:scale-105 active:scale-95"
            : "flex flex-col items-center justify-center p-2 hover:scale-105 active:scale-95",
        )}
        style={{
          animationDelay: `${index * 100}ms`,
          animation: "slideUp 0.6s ease-out",
        }}
      >
        <div
          className={cn(
            "relative transition-all duration-300",
            isDesktop ? "p-2 rounded-xl" : "p-3 rounded-2xl",
            isActive
              ? `bg-gradient-to-r ${tab.gradient} shadow-lg`
              : "bg-white hover:bg-gray-50 group-hover:shadow-md",
          )}
        >
          <tab.icon
            className={cn(
              "transition-all duration-300",
              isDesktop ? "w-5 h-5" : "w-6 h-6",
              isActive
                ? "text-white"
                : "text-gray-600 group-hover:text-gray-800",
            )}
          />
          {isActive && !isDesktop && (
            <>
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-gradient-to-r from-yellow-400 to-orange-400 rounded-full animate-pulse" />
              <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-white/0 rounded-2xl" />
            </>
          )}
        </div>
        {isDesktop ? (
          <span
            className={cn(
              "text-sm font-semibold transition-all duration-300",
              isActive
                ? "text-transparent bg-clip-text bg-gradient-to-r " +
                    tab.gradient
                : "text-gray-700 group-hover:text-gray-800",
            )}
          >
            {tab.label}
          </span>
        ) : (
          <>
            <span
              className={cn(
                "text-xs font-semibold mt-1 transition-all duration-300 sm:text-sm",
                isActive
                  ? "text-transparent bg-clip-text bg-gradient-to-r " +
                      tab.gradient
                  : "text-gray-600 group-hover:text-gray-800",
              )}
            >
              {tab.label}
            </span>
            {isActive && (
              <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full animate-pulse" />
            )}
          </>
        )}
      </Link>
    );
  };

  const MoreMenu = () => (
    <div
      className={cn(
        "fixed inset-0 bg-black/50 backdrop-blur-sm transition-all duration-300",
        "z-[99998]",
        showMoreMenu ? "opacity-100" : "opacity-0 pointer-events-none",
      )}
      onClick={() => setShowMoreMenu(false)}
    >
      <div
        className={cn(
          "absolute bg-white/95 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 transition-all duration-500 transform",
          "bottom-20 left-4 right-4",
          "sm:bottom-24 sm:left-8 sm:right-8",
          "md:bottom-24 md:left-1/4 md:right-1/4",
          "lg:bottom-20 lg:left-72 lg:right-8",
          "xl:left-80 xl:right-16",
          showMoreMenu ? "translate-y-0 scale-100" : "translate-y-8 scale-95",
        )}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-4 sm:p-6 max-h-[75vh] overflow-y-auto">
          {/* رأس القائمة */}
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-lg sm:text-xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
                المزيد والإعدادات
              </h3>
              <p className="text-sm text-gray-600 mt-1">
                أنت حا��ياً في:{" "}
                <span
                  className={`font-semibold bg-gradient-to-r ${getSectionColor()} bg-clip-text text-transparent`}
                >
                  {getSectionName()}
                </span>
              </p>
            </div>
            <div
              className={`w-6 h-0.5 sm:w-8 sm:h-1 bg-gradient-to-r ${getSectionColor()} rounded-full`}
            />
          </div>

          {/* الأدوات السريعة */}
          <div className="mb-6">
            <div className="flex items-center gap-2 mb-3">
              <Zap className="w-4 h-4 text-emerald-600" />
              <h4 className="text-sm font-semibold text-gray-700">
                أدوات سريعة
              </h4>
            </div>
            <div className="grid grid-cols-3 gap-3">
              {quickActions.map((item, index) => (
                <div key={item.label} className="group">
                  {item.path ? (
                    <Link
                      to={item.path}
                      className="flex flex-col items-center p-3 hover:bg-gradient-to-b hover:from-white hover:to-gray-50 rounded-2xl transition-all duration-300 group-hover:scale-105 hover:shadow-sm border border-transparent hover:border-gray-200"
                      onClick={() => setShowMoreMenu(false)}
                    >
                      <div
                        className={`w-12 h-12 bg-${item.color}-100 rounded-2xl flex items-center justify-center mb-2 group-hover:shadow-lg transition-all duration-300`}
                      >
                        <item.icon
                          className={`w-6 h-6 text-${item.color}-600`}
                        />
                      </div>
                      <span className="text-xs font-semibold text-gray-900 text-center">
                        {item.label}
                      </span>
                    </Link>
                  ) : (
                    <button
                      onClick={() => {
                        item.action?.();
                        setShowMoreMenu(false);
                      }}
                      className="flex flex-col items-center p-3 hover:bg-gradient-to-b hover:from-white hover:to-gray-50 rounded-2xl transition-all duration-300 group-hover:scale-105 hover:shadow-sm border border-transparent hover:border-gray-200 w-full"
                    >
                      <div
                        className={`w-12 h-12 bg-${item.color}-100 rounded-2xl flex items-center justify-center mb-2 group-hover:shadow-lg transition-all duration-300`}
                      >
                        <item.icon
                          className={`w-6 h-6 text-${item.color}-600`}
                        />
                      </div>
                      <span className="text-xs font-semibold text-gray-900 text-center">
                        {item.label}
                      </span>
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* الحساب والملف الشخصي */}
          <div className="mb-6">
            <div className="flex items-center gap-2 mb-3">
              <User className="w-4 h-4 text-blue-600" />
              <h4 className="text-sm font-semibold text-gray-700">
                الحساب والملف الشخصي
              </h4>
            </div>
            <div className="space-y-2">
              {commonItems.map((item, index) => (
                <div key={item.label} className="group">
                  {item.path ? (
                    <Link
                      to={item.path}
                      className="flex items-center gap-4 p-3 hover:bg-gray-50 rounded-xl transition-all duration-300 group-hover:scale-[1.02]"
                      onClick={() => setShowMoreMenu(false)}
                    >
                      <div
                        className={`w-10 h-10 bg-${item.color}-100 rounded-xl flex items-center justify-center group-hover:shadow-md transition-all duration-300`}
                      >
                        <item.icon
                          className={`w-5 h-5 text-${item.color}-600`}
                        />
                      </div>
                      <div className="flex-1">
                        <span className="text-sm font-semibold text-gray-900">
                          {item.label}
                        </span>
                        {item.description && (
                          <p className="text-xs text-gray-500 mt-0.5">
                            {item.description}
                          </p>
                        )}
                      </div>
                    </Link>
                  ) : (
                    <button
                      onClick={() => {
                        item.action?.();
                        setShowMoreMenu(false);
                      }}
                      className="flex items-center gap-4 p-3 hover:bg-gray-50 rounded-xl transition-all duration-300 group-hover:scale-[1.02] w-full"
                    >
                      <div
                        className={`w-10 h-10 bg-${item.color}-100 rounded-xl flex items-center justify-center group-hover:shadow-md transition-all duration-300`}
                      >
                        <item.icon
                          className={`w-5 h-5 text-${item.color}-600`}
                        />
                      </div>
                      <div className="flex-1 text-left">
                        <span className="text-sm font-semibold text-gray-900">
                          {item.label}
                        </span>
                        {item.description && (
                          <p className="text-xs text-gray-500 mt-0.5">
                            {item.description}
                          </p>
                        )}
                      </div>
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* الأقسام الرئيسية */}
          {sectionItems.map((group, groupIndex) => (
            <div key={group.title} className="mb-6">
              <h4 className="text-sm font-semibold text-gray-700 mb-3">
                {group.title}
              </h4>
              <div className="space-y-2">
                {group.items.map((item, index) => (
                  <div key={item.label} className="group">
                    {item.path ? (
                      <Link
                        to={item.path}
                        className={cn(
                          "flex items-center gap-4 p-3 hover:bg-gray-50 rounded-xl transition-all duration-300 group-hover:scale-[1.02]",
                          item.isSection &&
                            currentSection === item.path.split("/")[1] &&
                            "bg-blue-50 border border-blue-200",
                        )}
                        onClick={() => setShowMoreMenu(false)}
                      >
                        <div
                          className={`w-10 h-10 bg-${item.color}-100 rounded-xl flex items-center justify-center group-hover:shadow-md transition-all duration-300`}
                        >
                          <item.icon
                            className={`w-5 h-5 text-${item.color}-600`}
                          />
                        </div>
                        <div className="flex-1">
                          <span className="text-sm font-semibold text-gray-900">
                            {item.label}
                          </span>
                          {item.description && (
                            <p className="text-xs text-gray-500 mt-0.5">
                              {item.description}
                            </p>
                          )}
                        </div>
                        {item.isSection &&
                          currentSection === item.path.split("/")[1] && (
                            <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse" />
                          )}
                      </Link>
                    ) : (
                      <button
                        onClick={() => {
                          item.action?.();
                          setShowMoreMenu(false);
                        }}
                        className="flex items-center gap-4 p-3 hover:bg-gray-50 rounded-xl transition-all duration-300 group-hover:scale-[1.02] w-full"
                      >
                        <div
                          className={`w-10 h-10 bg-${item.color}-100 rounded-xl flex items-center justify-center group-hover:shadow-md transition-all duration-300`}
                        >
                          <item.icon
                            className={`w-5 h-5 text-${item.color}-600`}
                          />
                        </div>
                        <div className="flex-1 text-left">
                          <span className="text-sm font-semibold text-gray-900">
                            {item.label}
                          </span>
                          {item.description && (
                            <p className="text-xs text-gray-500 mt-0.5">
                              {item.description}
                            </p>
                          )}
                        </div>
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>
          ))}

          {/* إعدادات متقدمة */}
          <div className="mt-6 pt-4 border-t border-gray-200">
            <div className="bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl p-4">
              <div className="flex items-center justify-between mb-3">
                <div>
                  <h4 className="text-sm font-semibold text-gray-900">
                    إعدادات متقدمة
                  </h4>
                  <p className="text-xs text-gray-600">
                    المزيد من خيارات التحكم
                  </p>
                </div>
                <Settings className="w-5 h-5 text-gray-400" />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => {
                    console.log("فتح إعدادات المظهر");
                    setShowMoreMenu(false);
                  }}
                  className="flex flex-col items-center p-3 bg-white rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center mb-1">
                    <Star className="w-4 h-4 text-purple-600" />
                  </div>
                  <span className="text-xs font-medium text-gray-900">
                    المظهر
                  </span>
                </button>

                <button
                  onClick={() => {
                    console.log("فتح معلومات التطبيق");
                    setShowMoreMenu(false);
                  }}
                  className="flex flex-col items-center p-3 bg-white rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center mb-1">
                    <Building className="w-4 h-4 text-blue-600" />
                  </div>
                  <span className="text-xs font-medium text-gray-900">
                    عن التطبيق
                  </span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <>
      <div
        id="floating-bottom-nav"
        className={cn(
          "fixed bottom-0 left-0 right-0 z-[99999]",
          "w-full bg-white border-t border-gray-200 shadow-2xl",
          "transition-all duration-300 ease-in-out",
        )}
        style={{
          paddingBottom: "env(safe-area-inset-bottom, 8px)",
          width: "100vw",
          minHeight: "60px",
          position: "fixed",
          bottom: 0,
          left: 0,
          right: 0,
          zIndex: 999999,
          display: "flex",
          visibility: "visible",
          opacity: 1,
        }}
      >
        {/* مؤشر القسم الحالي */}
        <div
          className={cn(
            "absolute -top-0.5 left-1/2 transform -translate-x-1/2 w-16 h-0.5 rounded-full animate-pulse sm:w-20 sm:h-1 lg:hidden",
            `bg-gradient-to-r ${getSectionColor()}`,
          )}
        />

        {/* خلفية متدرجة حسب القسم */}
        <div
          className={cn(
            "absolute inset-0 opacity-10 rounded-t-3xl",
            `bg-gradient-to-t ${getSectionColor()}`,
          )}
        />

        {/* المحتوى ��لرئيسي */}
        <div className="relative">
          {/* للشاشات الصغيرة والمتوسطة */}
          <div className="lg:hidden px-2 py-2 sm:py-3">
            <div className="flex items-center justify-around max-w-lg mx-auto">
              {mainTabs.map((tab, index) => (
                <TabButton key={tab.id} tab={tab} index={index} />
              ))}
            </div>
          </div>

          {/* للشاشات الكبيرة */}
          <div className="hidden lg:flex items-center justify-between px-4 py-2">
            <div className="flex items-center gap-3">
              {mainTabs.slice(0, 4).map((tab, index) => (
                <TabButton key={tab.id} tab={tab} index={index} isDesktop />
              ))}
            </div>

            {/* معلومات القسم */}
            <div className="flex items-center gap-4 text-sm text-gray-600">
              <div className="flex items-center gap-2">
                <div
                  className={cn(
                    "w-2 h-2 rounded-full animate-pulse",
                    `bg-gradient-to-r ${getSectionColor()}`,
                  )}
                ></div>
                <span>{getSectionName()}</span>
              </div>
              <div className="text-xs opacity-60">
                {new Date().toLocaleTimeString("ar-SA", {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* قائمة المزيد */}
      <MoreMenu />
    </>
  );
}
