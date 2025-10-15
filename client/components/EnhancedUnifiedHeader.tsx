import React, { useState, useMemo, useEffect } from "react";
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
  Star,
  Filter,
  Grid,
  List,
  MoreHorizontal,
  LogOut,
  Phone,
  Globe,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useCart } from "@/contexts/CartContext";
import { useFavorites } from "@/contexts/FavoritesContext";
import { useSystemSettings } from "@/contexts/SystemSettingsContext";
import { notificationsService } from "@/services/notificationsService";

// User roles
export type UserRole = "dentist" | "supplier" | "admin" | "patient";

interface EnhancedUnifiedHeaderProps {
  customActions?: React.ReactNode;
  showBackButton?: boolean;
  title?: string;
  subtitle?: string;
  onMenuToggle?: () => void;
  showSidebar?: boolean;
  variant?: "default" | "minimal" | "expanded";
  transparent?: boolean;
  className?: string;
}

// Mock user data
const mockUser = {
  name: "د. أحمد محمد",
  role: "dentist" as UserRole,
  avatar:
    "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=40&h=40&fit=crop&crop=face",
  clinic: "عيادة الابتسامة الذهبية",
  permissions: ["marketplace", "community", "jobs", "clinic", "articles"],
};

// Navigation sections
const NAVIGATION_SECTIONS = [
  {
    key: "marketplace",
    label: "المتجر",
    path: "/dental-supply",
    icon: Package,
    color: "purple",
    description: "المنتجات الطبية",
  },
  {
    key: "community",
    label: "المجتمع",
    path: "/community",
    icon: MessageCircle,
    color: "blue",
    description: "التواصل مع الأطباء",
  },
  {
    key: "jobs",
    label: "ال��وظيف",
    path: "/jobs",
    icon: Briefcase,
    color: "green",
    description: "الوظائف والفرص",
  },
  {
    key: "clinic",
    label: "العيادة",
    path: "/admin",
    icon: Stethoscope,
    color: "cyan",
    description: "إدارة العيادة",
  },
  {
    key: "articles",
    label: "المقالات",
    path: "/articles",
    icon: FileText,
    color: "emerald",
    description: "المحتوى الطبي",
  },
];

// Role permissions
const rolePermissions = {
  patient: {
    sections: ["marketplace", "community", "articles"],
    canAccessAdmin: false,
    canAccessClinic: false,
  },
  dentist: {
    sections: ["marketplace", "community", "jobs", "clinic", "articles"],
    canAccessAdmin: false,
    canAccessClinic: true,
  },
  supplier: {
    sections: ["marketplace", "community", "jobs", "articles"],
    canAccessAdmin: false,
    canAccessClinic: false,
  },
  admin: {
    sections: ["marketplace", "community", "jobs", "clinic", "articles"],
    canAccessAdmin: true,
    canAccessClinic: true,
  },
};

export default function EnhancedUnifiedHeader({
  customActions,
  showBackButton = false,
  title,
  subtitle,
  onMenuToggle,
  showSidebar = true,
  variant = "default",
  transparent = false,
  className,
}: EnhancedUnifiedHeaderProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [currentUser, setCurrentUser] = useState(mockUser);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const [recentNotifications, setRecentNotifications] = useState<any[]>([]);

  const location = useLocation();
  const navigate = useNavigate();
  const { state: cartState } = useCart();
  const { favoritesCount } = useFavorites();
  const { isFeatureEnabled } = useSystemSettings();

  // Subscribe to notification updates
  useEffect(() => {
    const updateNotifications = () => {
      const notifications = notificationsService.getNotifications();
      const messages = notificationsService.getMessages();
      const unreadNotifs = notifications.filter(n => !n.read).length;
      const unreadMsgs = messages.filter(m => !m.read).length;
      
      setUnreadCount(unreadNotifs + unreadMsgs);
      setRecentNotifications(notifications.slice(0, 3));
    };

    updateNotifications();
    const unsubscribe = notificationsService.subscribe(updateNotifications);
    return () => {
      unsubscribe();
    };
  }, []);

  const permissions =
    rolePermissions[currentUser?.role] || rolePermissions.dentist;

  // Handle scroll for transparent variant
  useEffect(() => {
    if (!transparent) return;

    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [transparent]);

  // Get available sections based on user role
  const availableSections = useMemo(() => {
    return NAVIGATION_SECTIONS.filter((section) =>
      permissions.sections.includes(section.key),
    );
  }, [permissions]);

  // Get current section
  const currentSection = useMemo(() => {
    return (
      availableSections.find((section) =>
        location.pathname.startsWith(section.path),
      )?.key || "home"
    );
  }, [location.pathname, availableSections]);

  // Role switching functionality
  const switchRole = (newRole: UserRole) => {
    setCurrentUser((prev) => ({ ...prev, role: newRole }));
    setShowUserMenu(false);
  };

  // Get role display info
  const getRoleInfo = (role: UserRole) => {
    const roleMap = {
      dentist: {
        label: "طبيب أسنان",
        icon: Stethoscope,
        color: "text-blue-600",
      },
      supplier: { label: "مورد", icon: Building, color: "text-green-600" },
      admin: { label: "مدير", icon: Shield, color: "text-red-600" },
      patient: { label: "مريض", icon: User, color: "text-gray-600" },
    };
    return roleMap[role];
  };

  const roleInfo = getRoleInfo(currentUser?.role);
  const RoleIcon = roleInfo?.icon || User;

  // Handle section navigation
  const handleSectionClick = (section: (typeof NAVIGATION_SECTIONS)[0]) => {
    navigate(section.path);
    setShowMobileMenu(false);
  };

  // Check if section is active
  const isSectionActive = (sectionKey: string) => {
    return currentSection === sectionKey;
  };

  // Close menus when clicking outside
  useEffect(() => {
    const handleClickOutside = () => {
      setShowUserMenu(false);
      setShowNotifications(false);
    };

    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, []);

  // Header background class
  const headerBgClass = transparent
    ? scrolled
      ? "bg-white/95 backdrop-blur-lg shadow-lg"
      : "bg-transparent"
    : "bg-white/95 backdrop-blur-md shadow-sm";

  return (
    <>
      <header
        className={cn(
          "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
          headerBgClass,
          "border-b border-gray-200/50",
          className,
        )}
      >
        <div className="px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Left Section */}
            <div className="flex items-center gap-4">
              {/* Mobile menu button */}
              {showSidebar && (
                <button
                  onClick={() => setShowMobileMenu(!showMobileMenu)}
                  className="lg:hidden p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-xl transition-colors"
                  aria-label="فتح القائمة"
                >
                  <Menu className="w-6 h-6" />
                </button>
              )}

              {/* Back button */}
              {showBackButton && (
                <button
                  onClick={() => navigate(-1)}
                  className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-xl transition-colors"
                  aria-label="العودة"
                >
                  <ArrowLeft className="w-5 h-5" />
                </button>
              )}

              {/* Logo/Brand */}
              <Link to="/" className="flex items-center gap-3">
                <div className="w-8 h-8 bg-gradient-to-r from-purple-600 to-blue-600 rounded-xl flex items-center justify-center shadow-lg">
                  <div className="w-4 h-4 bg-white rounded-sm"></div>
                </div>
                <div className="hidden sm:block">
                  <h1 className="text-lg font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
                    Smart
                  </h1>
                </div>
              </Link>

              {/* Desktop Navigation */}
              <nav className="hidden lg:flex items-center gap-1">
                {availableSections.map((section) => {
                  const isActive = isSectionActive(section.key);

                  return (
                    <button
                      key={section.key}
                      onClick={() => handleSectionClick(section)}
                      className={cn(
                        "relative flex items-center gap-2 px-4 py-2 rounded-xl transition-all duration-200",
                        "text-sm font-medium group",
                        isActive
                          ? `bg-${section.color}-100 text-${section.color}-700 shadow-sm`
                          : "text-gray-600 hover:text-gray-900 hover:bg-gray-100",
                      )}
                      title={section.description}
                    >
                      <section.icon className="w-4 h-4" />
                      <span>{section.label}</span>
                      {isActive && (
                        <div
                          className={`absolute bottom-0 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-${section.color}-600 rounded-full`}
                        />
                      )}
                    </button>
                  );
                })}
              </nav>
            </div>

            {/* Center - Search Bar */}
            {variant !== "minimal" && (
              <div className="flex-1 max-w-2xl mx-4">
                <div className="relative">
                  <Search className="absolute right-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    placeholder="ابحث..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pr-12 pl-4 py-3 bg-gray-50 border-0 rounded-2xl focus:ring-2 focus:ring-purple-500 focus:bg-white transition-all text-right backdrop-blur-sm text-sm"
                  />
                  {searchQuery && (
                    <button
                      onClick={() => setSearchQuery("")}
                      className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>
            )}

            {/* Right Section - Actions */}
            <div className="flex items-center gap-2">
              {/* Favorites */}
              {isFeatureEnabled("favorites") && (
                <Link
                  to="/dentist-hub/favorites"
                  className="relative p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-xl transition-colors"
                  title="المفضلة"
                >
                  <Heart className="w-5 h-5" />
                  {favoritesCount > 0 && (
                    <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                      {favoritesCount > 99 ? "99+" : favoritesCount}
                    </span>
                  )}
                </Link>
              )}

              {/* Cart */}
              <Link
                to="/cart"
                className="relative p-2 text-gray-600 hover:text-purple-600 hover:bg-purple-50 rounded-xl transition-colors"
                title="السلة"
              >
                <ShoppingCart className="w-5 h-5" />
                {cartState.totalItems > 0 && (
                  <span className="absolute -top-1 -right-1 w-4 h-4 bg-purple-500 text-white text-xs rounded-full flex items-center justify-center">
                    {cartState.totalItems > 99 ? "99+" : cartState.totalItems}
                  </span>
                )}
              </Link>

              {/* Notifications */}
              <div className="relative">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setShowNotifications(!showNotifications);
                    setShowUserMenu(false);
                  }}
                  className="relative p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-colors"
                  title="الإشعارات"
                >
                  <Bell className="w-5 h-5" />
                  {unreadCount > 0 && (
                    <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                      {unreadCount > 99 ? "99+" : unreadCount}
                    </span>
                  )}
                </button>

                {/* Notifications Dropdown */}
                {showNotifications && (
                  <div className="absolute left-0 top-full mt-2 w-80 bg-white rounded-xl shadow-lg border border-gray-200 z-50">
                    <div className="p-4">
                      <h3 className="text-lg font-semibold text-gray-900 mb-3">
                        الإشعارات
                      </h3>
                      <div className="space-y-3">
                        {recentNotifications.map((notification) => {
                          const bgColorMap = {
                            success: "bg-green-50",
                            warning: "bg-yellow-50",
                            info: "bg-blue-50",
                            error: "bg-red-50",
                            urgent: "bg-red-50",
                            celebration: "bg-purple-50"
                          };
                          const textColorMap = {
                            success: "text-green-900",
                            warning: "text-yellow-900",
                            info: "text-blue-900",
                            error: "text-red-900",
                            urgent: "text-red-900",
                            celebration: "text-purple-900"
                          };
                          const descColorMap = {
                            success: "text-green-700",
                            warning: "text-yellow-700",
                            info: "text-blue-700",
                            error: "text-red-700",
                            urgent: "text-red-700",
                            celebration: "text-purple-700"
                          };
                          
                          return (
                            <div key={notification.id} className={`p-3 rounded-lg ${bgColorMap[notification.type]}`}>
                              <div className={`text-sm font-medium ${textColorMap[notification.type]}`}>
                                {notification.title}
                              </div>
                              <div className={`text-xs ${descColorMap[notification.type]}`}>
                                {notification.message}
                              </div>
                            </div>
                          );
                        })}
                        {recentNotifications.length === 0 && (
                          <div className="text-center text-gray-500 py-4">
                            لا توجد إشعارات جديدة
                          </div>
                        )}
                      </div>
                      <Link
                        to="/dentist-hub/notifications"
                        className="block mt-3 text-center text-sm text-blue-600 hover:text-blue-700"
                        onClick={() => setShowNotifications(false)}
                      >
                        عرض جميع الإشعارات
                      </Link>
                    </div>
                  </div>
                )}
              </div>

              {/* Custom Actions */}
              {customActions}

              {/* User Menu */}
              <div className="relative">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setShowUserMenu(!showUserMenu);
                    setShowNotifications(false);
                  }}
                  className="flex items-center gap-3 px-3 py-2 bg-gray-50 hover:bg-gray-100 rounded-xl transition-colors"
                >
                  <img
                    src={currentUser.avatar}
                    alt="صورة المستخدم"
                    className="w-8 h-8 rounded-full border-2 border-white shadow-sm"
                  />
                  <div className="text-right hidden lg:block">
                    <div className="text-sm font-medium text-gray-900">
                      {currentUser.name}
                    </div>
                    <div className="text-xs text-gray-500">
                      {roleInfo.label}
                    </div>
                  </div>
                  <ChevronDown className="w-4 h-4 text-gray-400 hidden lg:block" />
                </button>

                {/* User Dropdown Menu */}
                {showUserMenu && (
                  <div className="absolute left-0 top-full mt-2 w-64 bg-white rounded-xl shadow-lg border border-gray-200 z-50">
                    <div className="p-2">
                      {/* Profile Info */}
                      <div className="px-3 py-2 border-b border-gray-100 mb-2">
                        <div className="text-sm font-medium text-gray-900">
                          {currentUser.name}
                        </div>
                        <div className="text-xs text-gray-500">
                          {currentUser.clinic}
                        </div>
                        <div
                          className={cn(
                            "text-xs flex items-center gap-1 mt-1",
                            roleInfo.color,
                          )}
                        >
                          <RoleIcon className="w-3 h-3" />
                          {roleInfo.label}
                        </div>
                      </div>

                      {/* Quick Navigation */}
                      <div className="mb-2">
                        <div className="text-xs font-medium text-gray-500 px-3 py-1">
                          التنقل السريع
                        </div>
                        {availableSections.slice(0, 4).map((section) => (
                          <button
                            key={section.key}
                            onClick={() => handleSectionClick(section)}
                            className="w-full flex items-center gap-3 px-3 py-2 text-gray-700 hover:bg-gray-50 rounded-lg transition-colors"
                          >
                            <section.icon className="w-4 h-4" />
                            <span className="text-sm">{section.label}</span>
                          </button>
                        ))}
                      </div>

                      {/* Role Switching */}
                      <div className="mb-2">
                        <div className="text-xs font-medium text-gray-500 px-3 py-1">
                          تبديل الدور
                        </div>
                        {(["dentist", "supplier", "admin"] as UserRole[]).map(
                          (role) => {
                            const info = getRoleInfo(role);
                            const Icon = info?.icon || User;
                            return (
                              <button
                                key={role}
                                onClick={() => switchRole(role)}
                                className={cn(
                                  "w-full flex items-center gap-3 px-3 py-2 text-sm rounded-lg transition-colors",
                                  currentUser.role === role
                                    ? "bg-purple-50 text-purple-600"
                                    : "text-gray-700 hover:bg-gray-50",
                                )}
                              >
                                <Icon className="w-4 h-4" />
                                <span>{info.label}</span>
                                {currentUser.role === role && (
                                  <Crown className="w-3 h-3 ml-auto" />
                                )}
                              </button>
                            );
                          },
                        )}
                      </div>

                      <hr className="my-2" />

                      {/* Profile Actions */}
                      <Link
                        to="/profile"
                        className="flex items-center gap-3 px-3 py-2 text-gray-700 hover:bg-gray-50 rounded-lg transition-colors"
                        onClick={() => setShowUserMenu(false)}
                      >
                        <User className="w-4 h-4" />
                        <span className="text-sm">الملف الشخصي</span>
                      </Link>

                      {permissions.canAccessAdmin && (
                        <Link
                          to="/admin/dashboard"
                          className="flex items-center gap-3 px-3 py-2 text-gray-700 hover:bg-gray-50 rounded-lg transition-colors"
                          onClick={() => setShowUserMenu(false)}
                        >
                          <Settings className="w-4 h-4" />
                          <span className="text-sm">إعدادات النظام</span>
                        </Link>
                      )}

                      <hr className="my-2" />

                      <button className="w-full flex items-center gap-3 px-3 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors">
                        <LogOut className="w-4 h-4" />
                        <span className="text-sm">تسجيل الخروج</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Navigation Menu */}
      {showMobileMenu && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 z-40 bg-black/20 backdrop-blur-sm lg:hidden"
            onClick={() => setShowMobileMenu(false)}
          />

          {/* Mobile Menu */}
          <div className="fixed top-0 right-0 h-full w-80 bg-white shadow-xl z-50 lg:hidden">
            <div className="p-4">
              {/* Header */}
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-bold">القائمة الرئيسية</h2>
                <button
                  onClick={() => setShowMobileMenu(false)}
                  className="p-2 text-gray-600 hover:text-gray-900 rounded-lg"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* User Info */}
              <div className="bg-gray-50 rounded-xl p-4 mb-6">
                <div className="flex items-center gap-3">
                  <img
                    src={currentUser.avatar}
                    alt="صورة المستخدم"
                    className="w-12 h-12 rounded-full border-2 border-white shadow-sm"
                  />
                  <div>
                    <div className="text-sm font-medium text-gray-900">
                      {currentUser.name}
                    </div>
                    <div className="text-xs text-gray-500">
                      {currentUser.clinic}
                    </div>
                    <div
                      className={cn(
                        "text-xs flex items-center gap-1 mt-1",
                        roleInfo.color,
                      )}
                    >
                      <RoleIcon className="w-3 h-3" />
                      {roleInfo.label}
                    </div>
                  </div>
                </div>
              </div>

              {/* Navigation Sections */}
              <div className="space-y-2 mb-6">
                {availableSections.map((section) => {
                  const isActive = isSectionActive(section.key);

                  return (
                    <button
                      key={section.key}
                      onClick={() => handleSectionClick(section)}
                      className={cn(
                        "w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-colors text-right",
                        isActive
                          ? `bg-${section.color}-100 text-${section.color}-700`
                          : "text-gray-700 hover:bg-gray-100",
                      )}
                    >
                      <section.icon className="w-5 h-5" />
                      <div className="flex-1">
                        <div className="font-medium">{section.label}</div>
                        <div
                          className={cn(
                            "text-xs",
                            isActive
                              ? `text-${section.color}-600`
                              : "text-gray-500",
                          )}
                        >
                          {section.description}
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>

              {/* Quick Actions */}
              <div className="space-y-2">
                <Link
                  to="/dentist-hub/favorites"
                  className="flex items-center gap-3 px-4 py-2 text-gray-700 hover:bg-gray-50 rounded-lg transition-colors"
                  onClick={() => setShowMobileMenu(false)}
                >
                  <Heart className="w-4 h-4" />
                  <span className="text-sm">المفضلة</span>
                  {favoritesCount > 0 && (
                    <span className="ml-auto bg-red-500 text-white text-xs px-2 py-1 rounded-full">
                      {favoritesCount}
                    </span>
                  )}
                </Link>

                <Link
                  to="/cart"
                  className="flex items-center gap-3 px-4 py-2 text-gray-700 hover:bg-gray-50 rounded-lg transition-colors"
                  onClick={() => setShowMobileMenu(false)}
                >
                  <ShoppingCart className="w-4 h-4" />
                  <span className="text-sm">السلة</span>
                  {cartState.totalItems > 0 && (
                    <span className="ml-auto bg-purple-500 text-white text-xs px-2 py-1 rounded-full">
                      {cartState.totalItems}
                    </span>
                  )}
                </Link>

                <Link
                  to="/dentist-hub/notifications"
                  className="flex items-center gap-3 px-4 py-2 text-gray-700 hover:bg-gray-50 rounded-lg transition-colors"
                  onClick={() => setShowMobileMenu(false)}
                >
                  <Bell className="w-4 h-4" />
                  <span className="text-sm">��لإشعارات</span>
                  <span className="ml-auto bg-red-500 text-white text-xs px-2 py-1 rounded-full">
                    3
                  </span>
                </Link>

                <Link
                  to="/profile"
                  className="flex items-center gap-3 px-4 py-2 text-gray-700 hover:bg-gray-50 rounded-lg transition-colors"
                  onClick={() => setShowMobileMenu(false)}
                >
                  <User className="w-4 h-4" />
                  <span className="text-sm">الملف الشخصي</span>
                </Link>
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
}
