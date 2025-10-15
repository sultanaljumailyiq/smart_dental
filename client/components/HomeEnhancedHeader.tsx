import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Search,
  Heart,
  Bell,
  User,
  Menu,
  Home,
  MessageCircle,
  Briefcase,
  ChevronDown,
  ShoppingCart,
  Stethoscope,
  Settings,
  Shield,
  Crown,
  MapPin,
  Globe,
  Zap,
  Calendar,
  BookOpen,
  Building2,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useCart } from "@/contexts/CartContext";
import { useFavorites } from "@/contexts/FavoritesContext";
import { useSystemSettings } from "@/contexts/SystemSettingsContext";

export type UserRole =
  | "app_owner"
  | "clinic_owner"
  | "clinic_staff"
  | "clinic_employee"
  | "supplier"
  | "patient";

interface HomeEnhancedHeaderProps {
  onMenuToggle?: () => void;
  showSidebar?: boolean;
}

// تكوين الأقسام المحسنة للصفحة الرئيسية
const homeConfig = {
  title: "منصة طب الأسنان الشاملة",
  subtitle: "نحو رعاية صحية أفضل ومستقبل مشرق لطب الأسنان",
  gradient: "from-blue-600 via-purple-600 to-teal-600",
  features: [
    {
      icon: Stethoscope,
      label: "خدمات طبية",
      description: "استشارات ومعاينات",
      color: "blue",
    },
    {
      icon: ShoppingCart,
      label: "متجر المعدات",
      description: "أحدث الأجهزة والمستلزمات",
      color: "emerald",
    },
    {
      icon: MessageCircle,
      label: "مجتمع الأطباء",
      description: "تبادل الخبرات",
      color: "purple",
    },
    {
      icon: Briefcase,
      label: "الفرص المهنية",
      description: "وظائف وتدريب",
      color: "orange",
    },
    {
      icon: BookOpen,
      label: "التعليم المستمر",
      description: "دورات ومؤتمرات",
      color: "violet",
    },
    {
      icon: Building2,
      label: "إدارة العيادات",
      description: "نظام متكامل",
      color: "teal",
    },
  ],
};

// صلاحيات المستخدمين المحدثة
const rolePermissions = {
  patient: {
    canAccessMarketplace: false,
    canAccessCommunity: false,
    canAccessJobs: false,
    canAccessAdmin: false,
    canAccessClinic: false,
    sections: ["medical-services"],
  },
  clinic_staff: {
    canAccessMarketplace: true,
    canAccessCommunity: false,
    canAccessJobs: false,
    canAccessAdmin: false,
    canAccessClinic: true,
    sections: ["medical-services", "marketplace", "clinic"],
  },
  clinic_employee: {
    canAccessMarketplace: true,
    canAccessCommunity: true,
    canAccessJobs: true,
    canAccessAdmin: false,
    canAccessClinic: true,
    sections: [
      "medical-services",
      "marketplace",
      "community",
      "jobs",
      "clinic",
    ],
  },
  supplier: {
    canAccessMarketplace: true,
    canAccessCommunity: true,
    canAccessJobs: true,
    canAccessAdmin: false,
    canAccessClinic: false,
    sections: ["marketplace", "community", "jobs"],
  },
  clinic_owner: {
    canAccessMarketplace: true,
    canAccessCommunity: true,
    canAccessJobs: true,
    canAccessAdmin: true,
    canAccessClinic: true,
    sections: [
      "medical-services",
      "marketplace",
      "community",
      "jobs",
      "clinic",
      "admin",
    ],
  },
  app_owner: {
    canAccessMarketplace: true,
    canAccessCommunity: true,
    canAccessJobs: true,
    canAccessAdmin: true,
    canAccessClinic: true,
    sections: [
      "medical-services",
      "marketplace",
      "community",
      "jobs",
      "clinic",
      "admin",
    ],
  },
};

export default function HomeEnhancedHeader({
  onMenuToggle,
  showSidebar,
}: HomeEnhancedHeaderProps) {
  const [isSearchExpanded, setIsSearchExpanded] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState<{
    role: UserRole;
    name: string;
  }>({
    role: "patient",
    name: "محمد أحمد",
  });

  const navigate = useNavigate();
  const { state: cartState } = useCart();
  const cart = cartState?.items || [];
  const { favorites: favoritesData } = useFavorites();
  const favorites = favoritesData || [];
  const { settings } = useSystemSettings();

  const searchRef = useRef<HTMLDivElement>(null);
  const profileRef = useRef<HTMLDivElement>(null);
  const notificationsRef = useRef<HTMLDivElement>(null);

  const permissions = rolePermissions[currentUser.role];

  // إ��شاء قائمة التنقل بناءً على الصلاحيات
  const getNavigationSections = () => {
    const sections = [];

    // الخدمات الطبية - متاحة لجميع المرضى
    if (
      currentUser.role === "patient" ||
      permissions.sections.includes("medical-services")
    ) {
      sections.push({
        key: "medical-services",
        path: "/medical-services",
        label: "الخدمات الطبية",
        icon: Stethoscope,
        color: "blue",
      });
    }

    if (permissions.canAccessMarketplace) {
      sections.push({
        key: "marketplace",
        path: "/dental-supply",
        label: "المتجر",
        icon: ShoppingCart,
        color: "emerald",
      });
    }

    if (permissions.canAccessCommunity) {
      sections.push({
        key: "community",
        path: "/community",
        label: "المجتمع الطبي",
        icon: MessageCircle,
        color: "purple",
      });
    }

    if (permissions.canAccessJobs) {
      sections.push({
        key: "jobs",
        path: "/jobs",
        label: "الوظائف",
        icon: Briefcase,
        color: "orange",
      });
    }

    if (permissions.canAccessClinic) {
      sections.push({
        key: "clinic",
        path: "/clinic/admin",
        label: "إدارة العيادة",
        icon: Building2,
        color: "teal",
      });
    }

    if (permissions.canAccessAdmin) {
      sections.push({
        key: "admin",
        path: "/admin",
        label: "الإدارة",
        icon: Shield,
        color: "red",
      });
    }

    return sections;
  };

  // إغلاق القوائم عند النقر خارجها
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        searchRef.current &&
        !searchRef.current.contains(event.target as Node)
      ) {
        setIsSearchExpanded(false);
      }
      if (
        profileRef.current &&
        !profileRef.current.contains(event.target as Node)
      ) {
        setIsProfileOpen(false);
      }
      if (
        notificationsRef.current &&
        !notificationsRef.current.contains(event.target as Node)
      ) {
        setIsNotificationsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
      setIsSearchExpanded(false);
      setSearchQuery("");
    }
  };

  const switchRole = (newRole: UserRole) => {
    setCurrentUser((prev) => ({ ...prev, role: newRole }));
    setIsProfileOpen(false);
  };

  const navigationSections = getNavigationSections();

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-md border-b border-gray-200/50 shadow-lg">
      {/* شريط ملون علوي */}
      <div className={cn("h-1 bg-gradient-to-r", homeConfig.gradient)} />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* اللوجو والتنقل */}
          <div className="flex items-center space-x-8 space-x-reverse">
            {/* زر القائمة للجوال */}
            <button
              onClick={onMenuToggle}
              className="lg:hidden p-3 rounded-xl text-gray-600 hover:text-gray-900 hover:bg-gray-100/50 transition-all"
            >
              <Menu className="w-6 h-6" />
            </button>

            {/* اللوجو المحسن */}
            <Link
              to="/"
              className="flex items-center space-x-4 space-x-reverse"
            >
              <div
                className={cn(
                  "w-14 h-14 rounded-2xl flex items-center justify-center text-white shadow-xl",
                  `bg-gradient-to-br ${homeConfig.gradient}`,
                )}
              >
                <Home className="w-8 h-8" />
              </div>
              <div className="hidden sm:block">
                <div className="text-xl font-bold text-gray-900 leading-tight">
                  {homeConfig.title}
                </div>
                <div className="text-sm text-gray-600 leading-tight">
                  {homeConfig.subtitle}
                </div>
              </div>
            </Link>

            {/* التنقل السريع - سطح المكتب */}
            <nav className="hidden xl:flex items-center space-x-2 space-x-reverse">
              {navigationSections.slice(0, 4).map((section) => (
                <Link
                  key={section.key}
                  to={section.path}
                  className={cn(
                    "relative px-6 py-3 rounded-xl text-sm font-medium transition-all duration-200 flex items-center space-x-3 space-x-reverse group hover:scale-105",
                    `text-${section.color}-600 hover:text-white hover:bg-${section.color}-500 hover:shadow-lg`,
                  )}
                >
                  <section.icon className="w-5 h-5" />
                  <span>{section.label}</span>
                </Link>
              ))}
            </nav>
          </div>

          {/* الإجراءات */}
          <div className="flex items-center space-x-4 space-x-reverse">
            {/* البحث المحسن */}
            <div ref={searchRef} className="relative">
              <form onSubmit={handleSearch} className="flex items-center">
                <div
                  className={cn(
                    "relative transition-all duration-300 ease-in-out",
                    isSearchExpanded ? "w-80" : "w-12",
                  )}
                >
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="ابحث عن خدمة، طبيب، أو منتج..."
                    className={cn(
                      "w-full h-12 bg-gray-100/50 border border-gray-200/50 rounded-xl transition-all duration-300 text-right",
                      isSearchExpanded
                        ? "px-5 pr-12 opacity-100 shadow-md"
                        : "px-0 opacity-0 pointer-events-none",
                    )}
                    onFocus={() => setIsSearchExpanded(true)}
                  />
                  <button
                    type="button"
                    onClick={() => setIsSearchExpanded(!isSearchExpanded)}
                    className="absolute right-0 top-0 h-12 w-12 flex items-center justify-center text-gray-600 hover:text-gray-900 transition-colors rounded-xl hover:bg-gray-100/50"
                  >
                    <Search className="w-6 h-6" />
                  </button>
                </div>
              </form>
            </div>

            {/* المفضلة */}
            <Link
              to="/dentist-hub/favorites"
              className="relative p-3 text-gray-600 hover:text-red-500 hover:bg-red-50/50 rounded-xl transition-all group"
            >
              <Heart className="w-6 h-6" />
              {favorites.length > 0 && (
                <span className="absolute -top-1 -right-1 w-6 h-6 bg-red-500 text-white text-xs rounded-full flex items-center justify-center font-medium">
                  {favorites.length}
                </span>
              )}
            </Link>

            {/* العربة */}
            <Link
              to="/cart"
              className="relative p-3 text-gray-600 hover:text-emerald-500 hover:bg-emerald-50/50 rounded-xl transition-all group"
            >
              <ShoppingCart className="w-6 h-6" />
              {cart.length > 0 && (
                <span className="absolute -top-1 -right-1 w-6 h-6 bg-emerald-500 text-white text-xs rounded-full flex items-center justify-center font-medium">
                  {cart.length}
                </span>
              )}
            </Link>

            {/* الإشعارات */}
            <div ref={notificationsRef} className="relative">
              <button
                onClick={() => setIsNotificationsOpen(!isNotificationsOpen)}
                className="relative p-3 text-gray-600 hover:text-blue-500 hover:bg-blue-50/50 rounded-xl transition-all"
              >
                <Bell className="w-6 h-6" />
                <span className="absolute -top-1 -right-1 w-4 h-4 bg-blue-500 rounded-full animate-pulse"></span>
              </button>

              {/* قائمة الإشعارات */}
              {isNotificationsOpen && (
                <div className="absolute top-14 right-0 w-96 bg-white rounded-2xl shadow-xl border border-gray-200/50 overflow-hidden z-50">
                  <div className="p-6 border-b border-gray-100">
                    <h3 className="font-bold text-gray-900 text-lg">
                      الإشعارات
                    </h3>
                  </div>
                  <div className="max-h-80 overflow-y-auto">
                    <div className="p-6 text-center text-gray-500">
                      <Bell className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                      <p>لا توجد إشعارات جديدة</p>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* قائمة الملف الشخصي */}
            <div ref={profileRef} className="relative">
              <button
                onClick={() => setIsProfileOpen(!isProfileOpen)}
                className="flex items-center space-x-3 space-x-reverse p-3 text-gray-600 hover:text-gray-900 hover:bg-gray-100/50 rounded-xl transition-all group"
              >
                <div
                  className={cn(
                    "w-10 h-10 rounded-xl flex items-center justify-center text-white",
                    `bg-gradient-to-br ${homeConfig.gradient}`,
                  )}
                >
                  <User className="w-5 h-5" />
                </div>
                <div className="hidden md:block text-right">
                  <div className="text-sm font-semibold">
                    {currentUser.name}
                  </div>
                  <div className="text-xs text-gray-500">
                    {currentUser.role === "app_owner"
                      ? "مالك التطبيق"
                      : currentUser.role === "clinic_owner"
                        ? "مالك العيادة"
                        : currentUser.role === "clinic_staff"
                          ? "موظف العيادة"
                          : currentUser.role === "clinic_employee"
                            ? "عامل العيادة"
                            : currentUser.role === "supplier"
                              ? "مورد"
                              : "مريض"}
                  </div>
                </div>
                <ChevronDown className="w-5 h-5 group-hover:rotate-180 transition-transform" />
              </button>

              {/* قائمة الملف الشخصي */}
              {isProfileOpen && (
                <div className="absolute top-14 right-0 w-80 bg-white rounded-2xl shadow-xl border border-gray-200/50 overflow-hidden z-50">
                  <div className="p-6 border-b border-gray-100">
                    <div className="flex items-center space-x-4 space-x-reverse mb-4">
                      <div
                        className={cn(
                          "w-16 h-16 rounded-2xl flex items-center justify-center text-white",
                          `bg-gradient-to-br ${homeConfig.gradient}`,
                        )}
                      >
                        <User className="w-8 h-8" />
                      </div>
                      <div>
                        <div className="font-bold text-gray-900 text-lg">
                          {currentUser.name}
                        </div>
                        <div className="text-sm text-gray-600">
                          {currentUser.role === "app_owner"
                            ? "مالك التطبيق"
                            : currentUser.role === "clinic_owner"
                              ? "مالك العيادة"
                              : currentUser.role === "clinic_staff"
                                ? "مو��ف العيادة"
                                : currentUser.role === "clinic_employee"
                                  ? "عامل العيادة"
                                  : currentUser.role === "supplier"
                                    ? "مورد"
                                    : "مريض"}
                        </div>
                      </div>
                    </div>

                    {/* مبدل الأدوار */}
                    <div className="space-y-3">
                      <div className="text-sm font-semibold text-gray-700 mb-3">
                        تبديل الدور:
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        {(
                          [
                            "patient",
                            "clinic_staff",
                            "clinic_employee",
                            "supplier",
                            "clinic_owner",
                            "app_owner",
                          ] as UserRole[]
                        ).map((role) => (
                          <button
                            key={role}
                            onClick={() => switchRole(role)}
                            className={cn(
                              "px-3 py-2 text-xs rounded-lg transition-all text-center",
                              currentUser.role === role
                                ? "bg-blue-100 text-blue-700 font-semibold"
                                : "bg-gray-100 text-gray-600 hover:bg-gray-200",
                            )}
                          >
                            {role === "app_owner"
                              ? "مالك التطبيق"
                              : role === "clinic_owner"
                                ? "مالك العيادة"
                                : role === "clinic_staff"
                                  ? "موظف العيادة"
                                  : role === "clinic_employee"
                                    ? "عامل العيادة"
                                    : role === "supplier"
                                      ? "مورد"
                                      : "مريض"}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="p-6">
                    {/* إجراءات سريعة */}
                    <div className="grid grid-cols-2 gap-3 mb-4">
                      <Link
                        to="/profile"
                        className="flex items-center space-x-2 space-x-reverse px-4 py-3 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-100/50 rounded-lg transition-all"
                        onClick={() => setIsProfileOpen(false)}
                      >
                        <User className="w-4 h-4" />
                        <span>الملف الشخصي</span>
                      </Link>
                      <Link
                        to="/settings"
                        className="flex items-center space-x-2 space-x-reverse px-4 py-3 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-100/50 rounded-lg transition-all"
                        onClick={() => setIsProfileOpen(false)}
                      >
                        <Settings className="w-4 h-4" />
                        <span>الإعدادات</span>
                      </Link>
                    </div>

                    {/* تسجيل الخروج */}
                    <button className="w-full px-4 py-3 text-sm text-red-600 hover:text-red-700 hover:bg-red-50/50 rounded-lg transition-all text-center font-medium">
                      تسجيل خروج
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* شريط الميزات السريعة */}
        <div className="hidden lg:flex items-center justify-center space-x-8 space-x-reverse py-4 border-t border-gray-100/50">
          {homeConfig.features.map((feature, index) => (
            <div
              key={index}
              className={cn(
                "flex items-center space-x-3 space-x-reverse px-4 py-2 rounded-lg hover:bg-gray-50/50 transition-all cursor-pointer group",
                `hover:text-${feature.color}-600`,
              )}
            >
              <feature.icon
                className={cn("w-5 h-5", `text-${feature.color}-500`)}
              />
              <div>
                <div className="text-sm font-medium">{feature.label}</div>
                <div className="text-xs text-gray-500">
                  {feature.description}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </header>
  );
}
