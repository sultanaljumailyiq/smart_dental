import React, { useState, useMemo } from "react";
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
  Phone,
  LogOut,
  Globe,
  Zap,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useCart } from "@/contexts/CartContext";
import { useFavorites } from "@/contexts/FavoritesContext";
import { useSystemSettings } from "@/contexts/SystemSettingsContext";
import {
  useNavigation,
  useCurrentSection,
  SectionType,
} from "@/contexts/NavigationContext";
import SmartHeaderPopover, {
  QuickSearchPopover,
} from "@/components/SmartHeaderPopover";
import UnifiedNotificationPopup from "@/components/UnifiedNotificationPopup";
import { useStaffPermissions } from "@/hooks/useStaffPermissions";

// User roles
export type UserRole = "dentist" | "supplier" | "admin" | "patient";

interface OptimizedUnifiedHeaderProps {
  customActions?: React.ReactNode;
  showBackButton?: boolean;
  title?: string;
  subtitle?: string;
  onMenuToggle?: () => void;
  showSidebar?: boolean;
  variant?: "default" | "minimal" | "expanded";
}

// Mock user data
const mockUser = {
  name: "د. أحمد محمد",
  role: "dentist" as UserRole,
  avatar:
    "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=40&h=40&fit=crop&crop=face",
  clinic: "عيادة الابتسامة الذهبية",
  permissions: [
    "marketplace",
    "community",
    "jobs",
    "clinic",
    "medical-services",
  ],
};

// Navigation sections - مع إضافة مركز الأطباء
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
    label: "التوظيف",
    path: "/jobs",
    icon: Briefcase,
    color: "green",
    description: "الوظائف والفرص",
  },
  {
    key: "medical-services",
    label: "الخدمات الطبية",
    path: "/medical-services",
    icon: Zap,
    color: "emerald",
    description: "الخدمات والاستشارات",
  },
  {
    key: "dentist-hub",
    label: "مركز الأطباء",
    path: "/dentist-hub",
    icon: Users,
    color: "blue",
    description: "مركز الأطباء والموردين",
  },
];

// Role permissions
const rolePermissions = {
  patient: {
    sections: ["marketplace", "community", "medical-services"],
    canAccessAdmin: false,
    canAccessClinic: false,
  },
  dentist: {
    sections: [
      "marketplace",
      "community",
      "jobs",
      "medical-services",
      "clinic",
    ],
    canAccessAdmin: false,
    canAccessClinic: true,
  },
  supplier: {
    sections: ["marketplace", "community", "jobs", "medical-services"],
    canAccessAdmin: false,
    canAccessClinic: false,
  },
  admin: {
    sections: [
      "marketplace",
      "community",
      "jobs",
      "medical-services",
      "clinic",
    ],
    canAccessAdmin: true,
    canAccessClinic: true,
  },
};

export default function OptimizedUnifiedHeader({
  customActions,
  showBackButton = false,
  title,
  subtitle,
  onMenuToggle,
  showSidebar = true,
  variant = "default",
}: OptimizedUnifiedHeaderProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [currentUser, setCurrentUser] = useState(mockUser);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);

  const location = useLocation();
  const navigate = useNavigate();
  const { state: cartState } = useCart();
  const { favoritesCount } = useFavorites();
  const { isFeatureEnabled } = useSystemSettings();
  const { section: currentSection, config: sectionConfig } =
    useCurrentSection();
  const { canAccessSection, isStaffMode } = useStaffPermissions();

  const permissions =
    rolePermissions[currentUser?.role] || rolePermissions.dentist;

  // Get available sections based on user role AND staff permissions
  const availableSections = useMemo(() => {
    let sections = NAVIGATION_SECTIONS.filter((section) =>
      permissions.sections.includes(section.key),
    );
    
    // Filter by staff permissions if in staff mode
    if (isStaffMode) {
      sections = sections.filter((section) => {
        if (section.key === 'marketplace') return canAccessSection('marketplace');
        if (section.key === 'community') return canAccessSection('community');
        if (section.key === 'jobs') return canAccessSection('jobs');
        if (section.key === 'dentist-hub') return canAccessSection('dentist-hub');
        if (section.key === 'medical-services') return canAccessSection('education');
        return true; // Keep other sections by default (home, etc.)
      });
    }
    
    return sections;
  }, [permissions, isStaffMode, canAccessSection]);

  // Get current section
  const currentSectionKey = useMemo(() => {
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
    return currentSectionKey === sectionKey;
  };

  return (
    <>
      <header
        className={cn(
          "fixed !top-0 !left-0 !right-0 !z-[120] transition-all duration-300",
          "bg-white/95 backdrop-blur-md shadow-sm border-b border-gray-200/50",
        )}
        style={{ position: 'fixed', top: 0, left: 0, right: 0, zIndex: 120 }}
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

              {/* Desktop Navigation - محسن للشاشات الصغ��رة */}
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
                      {/* إظهار النص فقط للقسم النشط في الشاشات المتوسطة */}
                      <span
                        className={cn(
                          "transition-all duration-200",
                          isActive ? "block" : "hidden xl:block",
                        )}
                      >
                        {section.label}
                      </span>
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
              <button
                onClick={() => setShowNotifications(true)}
                className="relative p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-colors"
                title="الإشعارات"
              >
                <Bell className="w-5 h-5" />
                <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                  5
                </span>
              </button>

              {/* Custom Actions */}
              {customActions}

              {/* User Profile - محسن للاستجابة للتمرير والضغط */}
              <div className="relative">
                <button
                  onClick={() => setShowUserMenu(!showUserMenu)}
                  onMouseEnter={() => setShowUserMenu(true)}
                  className="flex items-center gap-2 p-1 hover:bg-gray-100 rounded-xl transition-colors"
                  title={currentUser.name}
                >
                  <img
                    src={currentUser.avatar}
                    alt="صورة المستخدم"
                    className="w-10 h-10 rounded-full border-2 border-white shadow-sm hover:shadow-md transition-shadow"
                  />
                  {/* إزال�� النص - الاحتفاظ بالصورة فقط */}
                </button>

                {/* User Dropdown Menu */}
                {showUserMenu && (
                  <div
                    className="absolute right-0 top-full mt-2 w-64 max-w-[calc(100vw-2rem)] bg-white rounded-xl shadow-lg border border-gray-200 z-[120]"
                    onMouseLeave={() => setShowUserMenu(false)}
                    style={{
                      right: "0",
                      left: "auto",
                      transform: "translateX(0)",
                    }}
                  >
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

                      {/* Quick Navigation - مقلص للتوفير في المساحة */}
                      <div className="mb-2">
                        <div className="text-xs font-medium text-gray-500 px-3 py-1">
                          وصلات سريعة
                        </div>
                        {availableSections.slice(0, 3).map((section) => (
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

                      {currentUser.role === "supplier" && (
                        <Link
                          to="/supplier/dashboard"
                          className="flex items-center gap-3 px-3 py-2 text-gray-700 hover:bg-gray-50 rounded-lg transition-colors"
                          onClick={() => setShowUserMenu(false)}
                        >
                          <Package className="w-4 h-4" />
                          <span className="text-sm">مركز الموردين</span>
                        </Link>
                      )}

                      {currentUser.role === "dentist" && (
                        <Link
                          to="/dentist-hub/clinics"
                          className="flex items-center gap-3 px-3 py-2 text-gray-700 hover:bg-gray-50 rounded-lg transition-colors"
                          onClick={() => setShowUserMenu(false)}
                        >
                          <Stethoscope className="w-4 h-4" />
                          <span className="text-sm">إدارة العيادات</span>
                        </Link>
                      )}

                      {permissions.canAccessAdmin && (
                        <Link
                          to="/admin/settings"
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
          <div className="fixed top-0 right-0 h-full w-80 bg-white shadow-xl z-[120] lg:hidden">
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

      {/* Unified Notification Popup */}
      <UnifiedNotificationPopup
        isOpen={showNotifications}
        onClose={() => setShowNotifications(false)}
        position="top-right"
      />
    </>
  );
}
