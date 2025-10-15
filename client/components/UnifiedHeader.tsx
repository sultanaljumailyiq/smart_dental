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
  NotificationsQuickPopover,
  QuickSearchPopover,
} from "@/components/SmartHeaderPopover";

// User roles
export type UserRole = "dentist" | "supplier" | "admin" | "patient";

interface UnifiedHeaderProps {
  customActions?: React.ReactNode;
  showBackButton?: boolean;
  title?: string;
  subtitle?: string;
  onMenuToggle?: () => void;
  showSidebar?: boolean;
  variant?: "default" | "minimal" | "expanded";
  currentSection?: string;
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

// Role permissions
const rolePermissions = {
  patient: {
    sections: ["marketplace", "community", "articles", "profile", "favorites"],
    canAccessAdmin: false,
    canAccessClinic: false,
  },
  dentist: {
    sections: [
      "marketplace",
      "community",
      "jobs",
      "clinic",
      "articles",
      "profile",
      "favorites",
    ],
    canAccessAdmin: false,
    canAccessClinic: true,
  },
  supplier: {
    sections: [
      "marketplace",
      "community",
      "jobs",
      "articles",
      "profile",
      "favorites",
    ],
    canAccessAdmin: false,
    canAccessClinic: false,
  },
  admin: {
    sections: [
      "marketplace",
      "community",
      "jobs",
      "clinic",
      "admin",
      "articles",
      "profile",
      "favorites",
    ],
    canAccessAdmin: true,
    canAccessClinic: true,
  },
};

// Section icon mapping
const SectionIcons = {
  marketplace: Package,
  community: MessageCircle,
  jobs: Briefcase,
  clinic: Stethoscope,
  admin: Settings,
  articles: FileText,
  profile: User,
  home: Home,
  favorites: Heart,
  notifications: Bell,
  search: Search,
};

export default function UnifiedHeader({
  customActions,
  showBackButton = false,
  title,
  subtitle,
  onMenuToggle,
  showSidebar = true,
  variant = "default",
}: UnifiedHeaderProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [currentUser, setCurrentUser] = useState(mockUser);
  const [showMobileMenu, setShowMobileMenu] = useState(false);

  const location = useLocation();
  const navigate = useNavigate();
  const { state: cartState } = useCart();
  const { favoritesCount } = useFavorites();
  const { isFeatureEnabled } = useSystemSettings();
  const {
    state: navState,
    navigateToSection,
    goBack,
    canGoBack,
    getCurrentSectionConfig,
    getAvailableSections,
    getBreadcrumbs,
  } = useNavigation();
  const {
    section: currentSection,
    config: sectionConfig,
    isTransitioning,
  } = useCurrentSection();

  const permissions =
    rolePermissions[currentUser?.role] || rolePermissions.dentist;
  const breadcrumbs = getBreadcrumbs();

  // Get available sections based on user role
  const availableSections = useMemo(() => {
    return getAvailableSections().filter(
      (section) =>
        permissions.sections.includes(section.type) &&
        (section.isPublic ||
          currentUser.permissions.includes(section.type) ||
          (section.type === "admin" && permissions.canAccessAdmin) ||
          (section.type === "clinic" && permissions.canAccessClinic)),
    );
  }, [permissions, currentUser.permissions, getAvailableSections]);

  // Role switching functionality
  const switchRole = (newRole: UserRole) => {
    setCurrentUser((prev) => ({ ...prev, role: newRole }));
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
  const handleSectionClick = (sectionType: SectionType) => {
    navigateToSection(sectionType, undefined, { preserveContext: true });
    setShowMobileMenu(false);
  };

  // Check if section is active
  const isSectionActive = (sectionType: SectionType) => {
    return currentSection === sectionType;
  };

  // Render navigation sections
  const renderNavigationSections = () => (
    <div className="flex items-center gap-1 lg:gap-2">
      {availableSections.slice(0, 5).map((section) => {
        const IconComponent = SectionIcons[section.type] || Package;
        const isActive = isSectionActive(section.type);

        return (
          <button
            key={section.type}
            onClick={() => handleSectionClick(section.type)}
            className={cn(
              "relative flex items-center gap-2 px-3 py-2 rounded-xl transition-all duration-200",
              "text-sm font-medium",
              isActive
                ? `bg-${section.color}-100 text-${section.color}-700 shadow-sm`
                : "text-gray-600 hover:text-gray-900 hover:bg-gray-100",
            )}
            title={section.nameAr}
          >
            <IconComponent className="w-4 h-4" />
            <span className="hidden sm:inline">{section.nameAr}</span>
            {isActive && (
              <div
                className={`absolute bottom-0 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-${section.color}-600 rounded-full`}
              />
            )}
          </button>
        );
      })}

      {availableSections.length > 5 && (
        <div className="relative group">
          <button className="flex items-center gap-1 px-2 py-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-xl transition-colors">
            <MoreHorizontal className="w-4 h-4" />
          </button>

          <div className="absolute top-full left-0 mt-2 w-48 bg-white rounded-xl shadow-lg border border-gray-200 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
            <div className="p-2">
              {availableSections.slice(5).map((section) => {
                const IconComponent = SectionIcons[section.type] || Package;
                return (
                  <button
                    key={section.type}
                    onClick={() => handleSectionClick(section.type)}
                    className="w-full flex items-center gap-3 px-3 py-2 text-gray-700 hover:bg-gray-50 rounded-lg transition-colors text-right"
                  >
                    <IconComponent className="w-4 h-4" />
                    <span className="text-sm">{section.nameAr}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );

  // Render breadcrumbs
  const renderBreadcrumbs = () => {
    if (breadcrumbs.length <= 1) return null;

    return (
      <nav className="flex items-center gap-2 text-sm text-gray-600">
        {breadcrumbs.map((crumb, index) => (
          <React.Fragment key={crumb.path}>
            {index > 0 && <ChevronDown className="w-3 h-3 rotate-[-90deg]" />}
            <Link
              to={crumb.path}
              className={cn(
                "hover:text-gray-900 transition-colors",
                index === breadcrumbs.length - 1 && "text-gray-900 font-medium",
              )}
            >
              {crumb.label}
            </Link>
          </React.Fragment>
        ))}
      </nav>
    );
  };

  // Render search bar
  const renderSearchBar = () => (
    <div className="flex-1 max-w-2xl mx-4">
      <div className="relative">
        <Search className="absolute right-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
        <input
          type="text"
          placeholder={
            sectionConfig?.description
              ? `ابحث في ${sectionConfig.nameAr}...`
              : "ابحث..."
          }
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pr-12 pl-4 py-3 bg-gray-50 border-0 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all text-right backdrop-blur-sm"
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
  );

  // Render action buttons
  const renderActionButtons = () => (
    <div className="flex items-center gap-2">
      {/* المفضلة */}
      {isFeatureEnabled("favorites") && (
        <Link
          to="/dentist-hub/favorites"
          className="relative p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-xl transition-colors"
        >
          <Heart className="w-5 h-5" />
          {favoritesCount > 0 && (
            <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
              {favoritesCount > 99 ? "99+" : favoritesCount}
            </span>
          )}
        </Link>
      )}

      {/* السلة */}
      {(currentSection === "marketplace" || isFeatureEnabled("cart")) && (
        <Link
          to="/cart"
          className="relative p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-colors"
        >
          <ShoppingCart className="w-5 h-5" />
          {cartState.totalItems > 0 && (
            <span className="absolute -top-1 -right-1 w-4 h-4 bg-blue-500 text-white text-xs rounded-full flex items-center justify-center">
              {cartState.totalItems > 99 ? "99+" : cartState.totalItems}
            </span>
          )}
        </Link>
      )}

      {/* الإشعارات */}
      <NotificationsQuickPopover
        trigger={
          <button className="relative p-2 text-gray-600 hover:text-yellow-600 hover:bg-yellow-50 rounded-xl transition-colors">
            <Bell className="w-5 h-5" />
            <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
              3
            </span>
          </button>
        }
      />

      {/* Custom Actions */}
      {customActions}
    </div>
  );

  // Render user menu
  const renderUserMenu = () => (
    <div className="relative group">
      <button className="flex items-center gap-3 px-3 py-2 bg-gray-50 hover:bg-gray-100 rounded-xl transition-colors">
        <img
          src={currentUser.avatar}
          alt="User"
          className="w-8 h-8 rounded-full border-2 border-white shadow-sm"
        />
        <div className="text-right hidden lg:block">
          <div className="text-sm font-medium text-gray-900">
            {currentUser.name}
          </div>
          <div className="text-xs text-gray-500">{roleInfo.label}</div>
        </div>
        <ChevronDown className="w-4 h-4 text-gray-400 hidden lg:block" />
      </button>

      {/* Dropdown Menu */}
      <div className="absolute left-0 top-full mt-2 w-64 bg-white rounded-xl shadow-lg border border-gray-200 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
        <div className="p-2">
          {/* Profile Info */}
          <div className="px-3 py-2 border-b border-gray-100 mb-2">
            <div className="text-sm font-medium text-gray-900">
              {currentUser.name}
            </div>
            <div className="text-xs text-gray-500">{currentUser.clinic}</div>
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
            {availableSections.slice(0, 4).map((section) => {
              const IconComponent = SectionIcons[section.type] || Package;
              return (
                <button
                  key={section.type}
                  onClick={() => handleSectionClick(section.type)}
                  className="w-full flex items-center gap-3 px-3 py-2 text-gray-700 hover:bg-gray-50 rounded-lg transition-colors"
                >
                  <IconComponent className="w-4 h-4" />
                  <span className="text-sm">{section.nameAr}</span>
                </button>
              );
            })}
          </div>

          {/* Role Switching */}
          <div className="mb-2">
            <div className="text-xs font-medium text-gray-500 px-3 py-1">
              تبديل الدور
            </div>
            {(["dentist", "supplier", "admin"] as UserRole[]).map((role) => {
              const info = getRoleInfo(role);
              const Icon = info?.icon || User;
              return (
                <button
                  key={role}
                  onClick={() => switchRole(role)}
                  className={cn(
                    "w-full flex items-center gap-3 px-3 py-2 text-sm rounded-lg transition-colors",
                    currentUser.role === role
                      ? "bg-blue-50 text-blue-600"
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
            })}
          </div>

          <hr className="my-2" />

          {/* Profile Actions */}
          <Link
            to="/profile"
            className="flex items-center gap-3 px-3 py-2 text-gray-700 hover:bg-gray-50 rounded-lg transition-colors"
          >
            <User className="w-4 h-4" />
            <span className="text-sm">الملف الشخصي</span>
          </Link>

          {permissions.canAccessAdmin && (
            <Link
              to="/admin/dashboard"
              className="flex items-center gap-3 px-3 py-2 text-gray-700 hover:bg-gray-50 rounded-lg transition-colors"
            >
              <Settings className="w-4 h-4" />
              <span className="text-sm">إعدادات النظام</span>
            </Link>
          )}

          <hr className="my-2" />

          <button className="w-full flex items-center gap-3 px-3 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors">
            <span className="text-sm">تسجيل الخروج</span>
          </button>
        </div>
      </div>
    </div>
  );

  // Mobile menu
  const renderMobileMenu = () => (
    <div
      className={cn(
        "fixed inset-0 z-50 lg:hidden",
        showMobileMenu ? "block" : "hidden",
      )}
    >
      <div
        className="fixed inset-0 bg-black/20 backdrop-blur-sm"
        onClick={() => setShowMobileMenu(false)}
      />
      <div className="fixed top-0 right-0 h-full w-80 bg-white shadow-xl">
        <div className="p-4">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-bold">القائمة</h2>
            <button
              onClick={() => setShowMobileMenu(false)}
              className="p-2 text-gray-600 hover:text-gray-900 rounded-lg"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="space-y-2">
            {availableSections.map((section) => {
              const IconComponent = SectionIcons[section.type] || Package;
              const isActive = isSectionActive(section.type);

              return (
                <button
                  key={section.type}
                  onClick={() => handleSectionClick(section.type)}
                  className={cn(
                    "w-full flex items-center gap-3 px-3 py-3 rounded-lg transition-colors",
                    isActive
                      ? `bg-${section.color}-100 text-${section.color}-700`
                      : "text-gray-700 hover:bg-gray-100",
                  )}
                >
                  <IconComponent className="w-5 h-5" />
                  <span>{section.nameAr}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <>
      <header
        className={cn(
          "fixed top-0 left-0 right-0 z-[110] bg-white/95 backdrop-blur-md border-b border-gray-200/50 shadow-sm transition-all duration-300",
          isTransitioning && "border-blue-200/50",
          variant === "minimal" && "bg-white/80",
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
                >
                  <Menu className="w-6 h-6" />
                </button>
              )}

              {/* Back button */}
              {(showBackButton || canGoBack()) && (
                <button
                  onClick={goBack}
                  className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-xl transition-colors"
                >
                  <ArrowLeft className="w-5 h-5" />
                </button>
              )}

              {/* Navigation sections */}
              <div className="hidden lg:block">
                {renderNavigationSections()}
              </div>

              {/* Custom title or breadcrumbs */}
              {variant !== "minimal" && (
                <div className="hidden md:block">
                  {title ? (
                    <div>
                      <h1 className="text-lg font-bold text-gray-900">
                        {title}
                      </h1>
                      {subtitle && (
                        <p className="text-sm text-gray-500">{subtitle}</p>
                      )}
                    </div>
                  ) : (
                    renderBreadcrumbs()
                  )}
                </div>
              )}
            </div>

            {/* Center Section - Search */}
            {variant !== "minimal" && renderSearchBar()}

            {/* Right Section - Actions */}
            <div className="flex items-center gap-2">
              {renderActionButtons()}
              {renderUserMenu()}
            </div>
          </div>

          {/* Secondary header for mobile breadcrumbs */}
          {breadcrumbs.length > 1 && (
            <div className="pb-3 lg:hidden">{renderBreadcrumbs()}</div>
          )}
        </div>
      </header>

      {/* Mobile menu */}
      {renderMobileMenu()}
    </>
  );
}
