import React, { useState, useEffect, useRef } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  Search,
  Heart,
  Bell,
  User,
  Menu,
  Package,
  Settings,
  Home,
  MessageCircle,
  Briefcase,
  ChevronDown,
  ShoppingCart,
  Stethoscope,
  Users,
  FileText,
  Calendar,
  Activity,
  BookOpen,
  Building,
  UserCheck,
  Shield,
  Crown,
  X,
  ArrowLeft,
  Globe,
  MapPin,
  Store,
  Building2,
  Zap,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useCart } from "@/contexts/CartContext";
import { useFavorites } from "@/contexts/FavoritesContext";
import { useSystemSettings } from "@/contexts/SystemSettingsContext";
import { UnifiedNotificationsPopover } from "@/components/UnifiedNotificationsPopover";
import { unifiedNotificationsHub } from "@/services/unifiedNotificationsHub";

// User roles
export type UserRole = "dentist" | "supplier" | "admin" | "patient";

// Section types
export type SectionType =
  | "marketplace"
  | "medical-services"
  | "dentist-hub"
  | "community"
  | "jobs"
  | "admin"
  | "clinic"
  | "articles"
  | "home"
  | "search"
  | "favorites"
  | "notifications"
  | "profile"
  | "about";

interface ModernUnifiedHeaderProps {
  currentSection: SectionType;
  searchPlaceholder?: string;
  onMenuToggle?: () => void;
  showSidebar?: boolean;
  customActions?: React.ReactNode;
  hidden?: boolean;
}

// Section configurations with enhanced styling
const sectionConfigs = {
  marketplace: {
    title: "متجر المس��لزمات الطبية",
    subtitle: "تسوق أفضل المعدات والمستلزمات الطبية",
    icon: Store,
    primaryColor: "emerald",
    secondaryColor: "green",
    gradient: "from-emerald-600 via-green-600 to-emerald-700",
    bgPattern: "marketplace-pattern",
    actions: ["search", "favorites", "cart", "notifications"],
  },
  "medical-services": {
    title: "الخدمات الطبية",
    subtitle: "خدمات طبية شاملة ومتقدمة للمرضى",
    icon: Stethoscope,
    primaryColor: "blue",
    secondaryColor: "purple",
    gradient: "from-blue-600 via-purple-600 to-blue-700",
    bgPattern: "medical-services-pattern",
    actions: ["search", "favorites", "notifications"],
  },
  "dentist-hub": {
    title: "مركز أطباء الأسنان",
    subtitle: "منصة شاملة لإدارة العيادة والتطوير المهني",
    icon: UserCheck,
    primaryColor: "indigo",
    secondaryColor: "purple",
    gradient: "from-indigo-600 via-purple-600 to-indigo-700",
    bgPattern: "dentist-hub-pattern",
    actions: ["search", "notifications", "settings"],
  },
  community: {
    title: "مجتمع أطباء الأسنان",
    subtitle: "تواصل وتبادل الخبرات مع الزملاء",
    icon: MessageCircle,
    primaryColor: "purple",
    secondaryColor: "pink",
    gradient: "from-purple-600 via-pink-600 to-purple-700",
    bgPattern: "community-pattern",
    actions: ["search", "notifications"],
  },
  jobs: {
    title: "الوظائف والفرص",
    subtitle: "اكتشف الفرص المهنية في مجال ��ب الأسنان",
    icon: Briefcase,
    primaryColor: "orange",
    secondaryColor: "amber",
    gradient: "from-orange-600 via-amber-600 to-orange-700",
    bgPattern: "jobs-pattern",
    actions: ["search", "notifications"],
  },
  admin: {
    title: "لوحة التحكم",
    subtitle: "إدارة شاملة للنظام والمستخدمين",
    icon: Shield,
    primaryColor: "red",
    secondaryColor: "rose",
    gradient: "from-red-600 via-rose-600 to-red-700",
    bgPattern: "admin-pattern",
    actions: ["search", "notifications", "settings"],
  },
  clinic: {
    title: "إدارة العيادة",
    subtitle: "نظام متكامل لإدارة عيادة طب الأسنان",
    icon: Building,
    primaryColor: "teal",
    secondaryColor: "cyan",
    gradient: "from-teal-600 via-cyan-600 to-teal-700",
    bgPattern: "clinic-pattern",
    actions: ["search", "notifications", "settings"],
  },
  articles: {
    title: "المقالات والنصائح",
    subtitle: "محتوى طب�� موثوق ونصائح صحية متخصصة",
    icon: BookOpen,
    primaryColor: "violet",
    secondaryColor: "purple",
    gradient: "from-violet-600 via-purple-600 to-violet-700",
    bgPattern: "articles-pattern",
    actions: ["search", "favorites", "notifications"],
  },
  home: {
    title: "الصفحة الرئيسية",
    subtitle: "منصة شاملة لخدمات طب الأسنان",
    icon: Home,
    primaryColor: "slate",
    secondaryColor: "gray",
    gradient: "from-slate-600 via-gray-600 to-slate-700",
    bgPattern: "home-pattern",
    actions: ["search", "notifications"],
  },
};

// Role-based permissions
const rolePermissions = {
  patient: {
    canAccessMarketplace: true,
    canAccessCommunity: false,
    canAccessJobs: false,
    canAccessAdmin: false,
    canAccessClinic: false,
    sections: ["medical-services", "articles"],
  },
  dentist: {
    canAccessMarketplace: true,
    canAccessCommunity: true,
    canAccessJobs: true,
    canAccessAdmin: false,
    canAccessClinic: true,
    sections: [
      "medical-services",
      "dentist-hub",
      "community",
      "jobs",
      "clinic",
      "articles",
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
  admin: {
    canAccessMarketplace: true,
    canAccessCommunity: true,
    canAccessJobs: true,
    canAccessAdmin: true,
    canAccessClinic: true,
    sections: [
      "admin",
      "medical-services",
      "marketplace",
      "community",
      "jobs",
      "clinic",
      "articles",
    ],
  },
};

export default function ModernUnifiedHeader({
  currentSection,
  searchPlaceholder,
  onMenuToggle,
  showSidebar,
  customActions,
  hidden = false,
}: ModernUnifiedHeaderProps) {
  const [isSearchExpanded, setIsSearchExpanded] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [notificationsCount, setNotificationsCount] = useState(0);
  const [currentUser, setCurrentUser] = useState<{
    role: UserRole;
    name: string;
    id?: string;
  }>({
    role: "patient" as UserRole,
    name: "محمد أحمد",
  });

  const location = useLocation();
  const navigate = useNavigate();
  const { state: cartState } = useCart();
  const cart = cartState?.items || [];
  const { favorites: favoritesData } = useFavorites();
  const favorites = favoritesData || [];
  const { settings } = useSystemSettings();

  const searchRef = useRef<HTMLDivElement>(null);
  const profileRef = useRef<HTMLDivElement>(null);
  const notificationsRef = useRef<HTMLDivElement>(null);

  const config = sectionConfigs[currentSection] || sectionConfigs.home;
  const permissions = rolePermissions[currentUser.role];

  // Load user from localStorage
  useEffect(() => {
    try {
      const userData = localStorage.getItem("user_data");
      if (userData) {
        const user = JSON.parse(userData);
        setCurrentUser({
          role: user.role || "patient",
          name: user.name || user.username || "مستخدم",
          id: user.id,
        });
      }
    } catch (error) {
      console.error("Error loading user data:", error);
    }
  }, []);

  // Generate navigation sections based on permissions and settings
  const getNavigationSections = () => {
    const sections = [];

    // For Supplier: Show Supplier Hub, Market, Community, and Job Posting
    if (currentUser?.role === "supplier") {
      sections.push({
        key: "supplier-hub",
        path: "/supplier/dashboard",
        label: "مركز الموردين",
        icon: Store,
      });
      if (settings.marketplace || settings.dentalSupply) {
        sections.push({
          key: "marketplace",
          path: "/dental-supply",
          label: "المتجر",
          icon: Package,
        });
      }
      if (permissions.canAccessCommunity && settings.community) {
        sections.push({
          key: "community",
          path: "/community",
          label: "التواصل",
          icon: MessageCircle,
        });
      }
      if (settings.jobs) {
        sections.push({
          key: "jobs",
          path: "/jobs/post",
          label: "نشر وظيفة",
          icon: Briefcase,
        });
      }
      return sections;
    }

    // For Dentist: Show Dental Hub first, above other sections
    if (currentUser?.role === "dentist" as UserRole) {
      if (settings.clinicAdmin) {
        sections.push({
          key: "dentist-hub",
          path: "/dentist-hub",
          label: "مركز الأطباء",
          icon: UserCheck,
        });
      }
    }

    // الخدمات الطبية - متاحة للجميع (except suppliers)
    if (settings.medicalServices && currentUser?.role !== ("supplier" as UserRole)) {
      sections.push({
        key: "medical-services",
        path: "/medical-services",
        label: "الخدمات الطبية",
        icon: Stethoscope,
      });
    }

    if (permissions.canAccessMarketplace && (settings.marketplace || settings.dentalSupply)) {
      sections.push({
        key: "marketplace",
        path: "/dental-supply",
        label: "المتجر",
        icon: Package,
      });
    }
    if (permissions.canAccessCommunity && settings.community) {
      sections.push({
        key: "community",
        path: "/community",
        label: "التواصل",
        icon: MessageCircle,
      });
    }
    if (permissions.canAccessJobs && settings.jobs && currentUser?.role !== ("supplier" as UserRole)) {
      sections.push({
        key: "jobs",
        path: "/jobs",
        label: "الوظائف",
        icon: Briefcase,
      });
    }

    // المقالات - متاحة للجميع
    if (settings.articles) {
      sections.push({
        key: "articles",
        path: "/articles",
        label: "المقالات",
        icon: BookOpen,
      });
    }

    if (permissions.canAccessAdmin) {
      sections.push({
        key: "admin",
        path: "/admin",
        label: "الإدارة",
        icon: Shield,
      });
    }
    if (permissions.canAccessClinic && settings.clinicAdmin) {
      sections.push({
        key: "clinic",
        path: "/clinic/admin",
        label: "إدارة العيادة",
        icon: Building,
      });
    }

    return sections;
  };

  // Load notifications count
  useEffect(() => {
    const loadNotificationsCount = async () => {
      // Guard: Only load if user is logged in (has id)
      if (!currentUser.id) {
        setNotificationsCount(0);
        return;
      }
      
      try {
        const stats = await unifiedNotificationsHub.getStats(undefined, currentUser.id);
        setNotificationsCount(stats.unread);
      } catch (error) {
        console.error('Error loading notifications count:', error);
        setNotificationsCount(0);
      }
    };
    
    loadNotificationsCount();
    
    // Subscribe to updates
    const unsubscribe = unifiedNotificationsHub.subscribe(() => {
      loadNotificationsCount();
    });
    
    return unsubscribe;
  }, [currentUser.id]);

  // Close dropdowns when clicking outside
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
    // Here you would typically call an API to switch user context
  };

  const navigationSections = getNavigationSections();

  if (hidden) {
    return null;
  }

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-md border-b border-gray-200/50 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo and Navigation */}
          <div className="flex items-center space-x-8 space-x-reverse">
            {/* Mobile Menu Button */}
            <button
              onClick={onMenuToggle}
              className="lg:hidden p-2 rounded-xl text-gray-600 hover:text-gray-900 hover:bg-gray-100/50 transition-all"
            >
              <Menu className="w-6 h-6" />
            </button>

            {/* Logo */}
            <Link
              to="/"
              className="flex items-center space-x-3 space-x-reverse"
            >
              <div
                className={cn(
                  "w-10 h-10 rounded-xl flex items-center justify-center text-white shadow-lg",
                  `bg-gradient-to-br ${config.gradient}`,
                )}
              >
                <config.icon className="w-6 h-6" />
              </div>
              <div className="hidden sm:block">
                <div className="text-lg font-bold text-gray-900">
                  منصة طب الأسنان
                </div>
                <div className="text-xs text-gray-500 leading-tight">
                  {config.subtitle}
                </div>
              </div>
            </Link>

            {/* Navigation Sections - Desktop */}
            <nav className="hidden lg:flex items-center space-x-1 space-x-reverse">
              {navigationSections.map((section) => {
                const isActive =
                  location.pathname === section.path ||
                  (section.path === "/medical-services" &&
                    (location.pathname.includes("/medical-services") ||
                      location.pathname.includes("/marketplace"))) ||
                  (section.path === "/dentist-hub" &&
                    location.pathname.includes("/dentist-hub")) ||
                  (section.path === "/dental-supply" &&
                    location.pathname.includes("/dental-supply")) ||
                  (section.path === "/community" &&
                    location.pathname.includes("/community")) ||
                  (section.path === "/jobs" &&
                    location.pathname.includes("/jobs")) ||
                  (section.path === "/clinic/admin" &&
                    location.pathname.includes("/clinic/admin")) ||
                  (section.path === "/admin" &&
                    location.pathname.includes("/admin"));
                return (
                  <Link
                    key={section.key}
                    to={section.path}
                    className={cn(
                      "relative px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 flex items-center space-x-2 space-x-reverse group",
                      isActive
                        ? `bg-gradient-to-r ${config.gradient} text-white shadow-lg`
                        : "text-gray-600 hover:text-gray-900 hover:bg-gray-100/50",
                    )}
                  >
                    <section.icon className="w-4 h-4" />
                    <span>{section.label}</span>
                    {isActive && (
                      <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-6 h-1 bg-white rounded-full" />
                    )}
                  </Link>
                );
              })}
            </nav>
          </div>

          {/* Actions */}
          <div className="flex items-center space-x-4 space-x-reverse">
            {/* Search */}
            <div ref={searchRef} className="relative">
              <form onSubmit={handleSearch} className="flex items-center">
                <div
                  className={cn(
                    "relative transition-all duration-300 ease-in-out",
                    isSearchExpanded ? "w-64" : "w-10",
                  )}
                >
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder={searchPlaceholder || "بحث..."}
                    className={cn(
                      "w-full h-10 bg-gray-100/50 border border-gray-200/50 rounded-xl transition-all duration-300",
                      isSearchExpanded
                        ? "px-4 pr-10 opacity-100"
                        : "px-0 opacity-0 pointer-events-none",
                    )}
                    onFocus={() => setIsSearchExpanded(true)}
                  />
                  <button
                    type="button"
                    onClick={() => setIsSearchExpanded(!isSearchExpanded)}
                    className="absolute right-0 top-0 h-10 w-10 flex items-center justify-center text-gray-600 hover:text-gray-900 transition-colors rounded-xl hover:bg-gray-100/50"
                  >
                    <Search className="w-5 h-5" />
                  </button>
                </div>
              </form>
            </div>

            {/* Favorites - only show if enabled */}
            {config.actions?.includes("favorites") && settings.favorites && (
              <Link
                to="/dentist-hub/favorites"
                className="relative p-2 text-gray-600 hover:text-red-500 hover:bg-red-50/50 rounded-xl transition-all group"
              >
                <Heart className="w-6 h-6" />
                {favorites.length > 0 && (
                  <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center font-medium">
                    {favorites.length}
                  </span>
                )}
              </Link>
            )}

            {/* Cart - only show if enabled */}
            {config.actions?.includes("cart") && settings.cart && (
              <Link
                to="/cart"
                className="relative p-2 text-gray-600 hover:text-emerald-500 hover:bg-emerald-50/50 rounded-xl transition-all group"
              >
                <ShoppingCart className="w-6 h-6" />
                {cart.length > 0 && (
                  <span className="absolute -top-1 -right-1 w-5 h-5 bg-emerald-500 text-white text-xs rounded-full flex items-center justify-center font-medium">
                    {cart.length}
                  </span>
                )}
              </Link>
            )}

            {/* Unified Notifications */}
            <div ref={notificationsRef} className="relative">
              <button
                onClick={() => setIsNotificationsOpen(!isNotificationsOpen)}
                className="relative p-2 text-gray-600 hover:text-blue-500 hover:bg-blue-50/50 rounded-xl transition-all"
              >
                <Bell className="w-6 h-6" />
                {notificationsCount > 0 && (
                  <span className="absolute -top-1 -right-1 min-w-[20px] h-5 bg-gradient-to-r from-blue-500 to-purple-500 text-white text-xs rounded-full flex items-center justify-center font-medium px-1.5">
                    {notificationsCount > 99 ? '99+' : notificationsCount}
                  </span>
                )}
              </button>

              {/* Unified Notifications Popover */}
              <UnifiedNotificationsPopover
                isOpen={isNotificationsOpen}
                onClose={() => setIsNotificationsOpen(false)}
                userId={currentUser.id}
              />
            </div>

            {/* Profile Menu */}
            <div ref={profileRef} className="relative">
              <button
                onClick={() => setIsProfileOpen(!isProfileOpen)}
                className="flex items-center space-x-3 space-x-reverse p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100/50 rounded-xl transition-all group"
              >
                <div className="w-8 h-8 bg-gradient-to-br from-gray-400 to-gray-600 rounded-lg flex items-center justify-center text-white">
                  <User className="w-4 h-4" />
                </div>
                <div className="hidden md:block text-right">
                  <div className="text-sm font-medium">{currentUser.name}</div>
                  <div className="text-xs text-gray-500">
                    {currentUser.role === "dentist"
                      ? "طبيب أسنان"
                      : currentUser.role === "supplier"
                        ? "مورد"
                        : currentUser.role === "admin"
                          ? "مدير"
                          : "مريض"}
                  </div>
                </div>
                <ChevronDown className="w-4 h-4 group-hover:rotate-180 transition-transform" />
              </button>

              {/* Profile Dropdown */}
              {isProfileOpen && (
                <div className="absolute top-12 right-0 w-72 bg-white rounded-2xl shadow-xl border border-gray-200/50 overflow-hidden z-50">
                  <div className="p-4 border-b border-gray-100">
                    <div className="flex items-center space-x-3 space-x-reverse mb-4">
                      <div className="w-12 h-12 bg-gradient-to-br from-gray-400 to-gray-600 rounded-xl flex items-center justify-center text-white">
                        <User className="w-6 h-6" />
                      </div>
                      <div>
                        <div className="font-semibold text-gray-900">
                          {currentUser.name}
                        </div>
                        <div className="text-sm text-gray-500">
                          {currentUser.role === "dentist"
                            ? "طبيب أسنان"
                            : currentUser.role === "supplier"
                              ? "مورد"
                              : currentUser.role === "admin"
                                ? "مدير"
                                : "مريض"}
                        </div>
                      </div>
                    </div>

                    {/* Role Switcher - Only for Platform Admin */}
                    {currentUser.role === "admin" && (
                      <div className="space-y-2">
                        <div className="text-sm font-medium text-gray-700 mb-2">
                          تبديل الدور:
                        </div>
                        <div className="grid grid-cols-2 gap-2">
                          {(
                            [
                              "patient",
                              "dentist",
                              "supplier",
                              "admin",
                            ] as UserRole[]
                          ).map((role) => (
                            <button
                              key={role}
                              onClick={() => switchRole(role)}
                              className={cn(
                                "px-3 py-2 text-xs rounded-lg transition-all",
                                currentUser.role === role
                                  ? "bg-blue-100 text-blue-700"
                                  : "bg-gray-100 text-gray-600 hover:bg-gray-200",
                              )}
                            >
                              {role === "dentist"
                                ? "طبيب أسنان"
                                : role === "supplier"
                                  ? "مورد"
                                  : role === "admin"
                                    ? "مدير"
                                    : "مريض"}
                            </button>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="p-4">
                    {/* Quick Actions */}
                    <div className="grid grid-cols-2 gap-2 mb-4">
                      {currentUser.role === "supplier" && (
                        <Link
                          to="/supplier/dashboard"
                          className="flex items-center space-x-2 space-x-reverse px-3 py-2 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-100/50 rounded-lg transition-all"
                          onClick={() => setIsProfileOpen(false)}
                        >
                          <Store className="w-4 h-4" />
                          <span>مركز الموردين</span>
                        </Link>
                      )}
                      <Link
                        to="/profile"
                        className="flex items-center space-x-2 space-x-reverse px-3 py-2 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-100/50 rounded-lg transition-all"
                        onClick={() => setIsProfileOpen(false)}
                      >
                        <User className="w-4 h-4" />
                        <span>الملف الشخصي</span>
                      </Link>
                      <Link
                        to="/settings"
                        className="flex items-center space-x-2 space-x-reverse px-3 py-2 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-100/50 rounded-lg transition-all"
                        onClick={() => setIsProfileOpen(false)}
                      >
                        <Settings className="w-4 h-4" />
                        <span>الإعدادات</span>
                      </Link>
                    </div>

                    {/* Logout */}
                    <button className="w-full px-4 py-2 text-sm text-red-600 hover:text-red-700 hover:bg-red-50/50 rounded-lg transition-all text-center">
                      تسجي�� خروج
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Custom Actions */}
            {customActions}
          </div>
        </div>
      </div>
    </header>
  );
}
