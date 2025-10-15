import React, { useState } from "react";
import { Link } from "react-router-dom";
import {
  Menu,
  X,
  Search,
  Bell,
  User,
  Heart,
  ShoppingCart,
  Home,
  Stethoscope,
  BookOpen,
  ChevronDown,
  MapPin,
  Brain,
  Phone,
  Calendar,
  MessageCircle,
  Settings,
  Star,
  Activity,
} from "lucide-react";
import { cn } from "@/lib/utils";
import NotificationBell from "./NotificationBell";

interface MobileOptimizedHeaderProps {
  currentSection?: string;
  compact?: boolean;
  showQuickActions?: boolean;
}

export default function MobileOptimizedHeader({
  currentSection = "medical-services",
  compact = false,
  showQuickActions = true,
}: MobileOptimizedHeaderProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [showNotifications, setShowNotifications] = useState(false);

  const quickActions = [
    {
      id: "emergency",
      icon: Phone,
      label: "طوارئ",
      color: "bg-red-500 text-white",
      href: "tel:911",
    },
    {
      id: "clinic-search",
      icon: MapPin,
      label: "عيادة",
      color: "bg-blue-500 text-white",
      action: () => {
        document.getElementById("emergency-map")?.scrollIntoView({
          behavior: "smooth",
          block: "center",
        });
      },
    },
    {
      id: "ai-diagnosis",
      icon: Brain,
      label: "تشخيص",
      color: "bg-purple-500 text-white",
      href: "/ai-diagnosis",
    },
    {
      id: "appointment",
      icon: Calendar,
      label: "موعد",
      color: "bg-green-500 text-white",
      href: "/simplified-booking/1",
    },
  ];

  const navigationItems = [
    { href: "/", label: "الرئيسية", icon: Home, active: false },
    {
      href: "/medical-services",
      label: "الخدمات",
      icon: Stethoscope,
      active: currentSection === "medical-services",
    },
    { href: "/articles", label: "المقالات", icon: BookOpen, active: false },
  ];

  return (
    <>
      {/* Compact Mobile Header */}
      <header
        className={cn(
          "fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-md border-b border-gray-200/50 shadow-lg transition-all duration-300",
          compact ? "py-2" : "py-3",
        )}
      >
        {/* Gradient accent */}
        <div className="h-1 bg-gradient-to-r from-blue-600 via-purple-600 to-blue-700" />

        <div className="px-4">
          <div
            className={cn(
              "flex items-center justify-between",
              compact ? "h-12" : "h-14",
            )}
          >
            {/* Left: Menu & Logo */}
            <div className="flex items-center gap-3">
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="p-2 rounded-xl text-gray-600 hover:text-gray-900 hover:bg-gray-100/50 transition-all lg:hidden"
              >
                {isMenuOpen ? (
                  <X className="w-5 h-5" />
                ) : (
                  <Menu className="w-5 h-5" />
                )}
              </button>

              <Link to="/" className="flex items-center gap-2">
                <div
                  className={cn(
                    "rounded-xl flex items-center justify-center text-white shadow-lg bg-gradient-to-br from-blue-600 via-purple-600 to-blue-700",
                    compact ? "w-8 h-8" : "w-10 h-10",
                  )}
                >
                  <Stethoscope
                    className={cn(compact ? "w-4 h-4" : "w-5 h-5")}
                  />
                </div>
                <div className="hidden sm:block">
                  <div
                    className={cn(
                      "font-bold text-gray-900",
                      compact ? "text-sm" : "text-base",
                    )}
                  >
                    Medical Services
                  </div>
                </div>
              </Link>
            </div>

            {/* Right: Actions */}
            <div className="flex items-center gap-1">
              {/* Search */}
              <div className="relative">
                <button
                  onClick={() => setIsSearchOpen(!isSearchOpen)}
                  className="p-2 rounded-xl text-gray-600 hover:text-gray-900 hover:bg-gray-100/50 transition-all"
                >
                  <Search className="w-5 h-5" />
                </button>

                {isSearchOpen && (
                  <div className="absolute right-0 top-full mt-2 w-72 bg-white rounded-xl shadow-xl border border-gray-200 p-3 z-50">
                    <input
                      type="text"
                      placeholder="البحث..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      autoFocus
                    />
                  </div>
                )}
              </div>

              {/* Notifications */}
              <NotificationBell onClick={() => setShowNotifications(true)} />

              {/* Favorites */}
              <button className="p-2 rounded-xl text-gray-600 hover:text-red-500 hover:bg-red-50/50 transition-all">
                <Heart className="w-5 h-5" />
              </button>

              {/* Cart */}
              <Link
                to="/cart"
                className="p-2 rounded-xl text-gray-600 hover:text-emerald-500 hover:bg-emerald-50/50 transition-all"
              >
                <ShoppingCart className="w-5 h-5" />
              </Link>

              {/* User */}
              <button className="flex items-center gap-1 p-2 rounded-xl text-gray-600 hover:text-gray-900 hover:bg-gray-100/50 transition-all">
                <div
                  className={cn(
                    "rounded-lg flex items-center justify-center text-white bg-gradient-to-br from-blue-600 via-purple-600 to-blue-700",
                    compact ? "w-6 h-6" : "w-7 h-7",
                  )}
                >
                  <User className="w-3 h-3" />
                </div>
                <ChevronDown className="w-3 h-3 hidden sm:block" />
              </button>
            </div>
          </div>

          {/* Quick Actions Bar (Mobile) */}
          {showQuickActions && !compact && (
            <div className="flex gap-2 py-2 overflow-x-auto scrollbar-none">
              {quickActions.map((action) => (
                <Link
                  key={action.id}
                  to={action.href || "#"}
                  onClick={action.action}
                  className={cn(
                    "flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-medium transition-all duration-200 hover:scale-105 whitespace-nowrap flex-shrink-0",
                    action.color,
                  )}
                >
                  <action.icon className="w-4 h-4" />
                  {action.label}
                </Link>
              ))}
            </div>
          )}
        </div>

        {/* Mobile Menu Overlay */}
        {isMenuOpen && (
          <div className="absolute top-full left-0 right-0 bg-white border-b border-gray-200 shadow-lg lg:hidden">
            <div className="p-4">
              {/* Navigation Items */}
              <nav className="space-y-2 mb-4">
                {navigationItems.map((item) => (
                  <Link
                    key={item.href}
                    to={item.href}
                    onClick={() => setIsMenuOpen(false)}
                    className={cn(
                      "flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200",
                      item.active
                        ? "bg-gradient-to-r from-blue-600 via-purple-600 to-blue-700 text-white shadow-lg"
                        : "text-gray-600 hover:text-gray-900 hover:bg-gray-100/50",
                    )}
                  >
                    <item.icon className="w-5 h-5" />
                    <span className="font-medium">{item.label}</span>
                  </Link>
                ))}
              </nav>

              {/* Quick Stats */}
              <div className="grid grid-cols-2 gap-3 pt-4 border-t border-gray-200">
                <div className="text-center p-3 bg-blue-50 rounded-xl">
                  <div className="text-lg font-bold text-blue-600">50K+</div>
                  <div className="text-xs text-blue-700">مريض سعيد</div>
                </div>
                <div className="text-center p-3 bg-green-50 rounded-xl">
                  <div className="text-lg font-bold text-green-600">200+</div>
                  <div className="text-xs text-green-700">طبيب متخصص</div>
                </div>
              </div>
            </div>
          </div>
        )}
      </header>

      {/* Search Overlay */}
      {isSearchOpen && (
        <div
          className="fixed inset-0 bg-black/20 z-40 lg:hidden"
          onClick={() => setIsSearchOpen(false)}
        />
      )}
    </>
  );
}

// Compact Hero Section for Mobile
export function CompactHeroSection({
  title = "منصتك الطبية الشاملة",
  subtitle = "احصل على أفضل الخدمات الطبية",
  showStats = true,
  quickActions = true,
}: {
  title?: string;
  subtitle?: string;
  showStats?: boolean;
  quickActions?: boolean;
}) {
  const stats = [
    { value: "50K+", label: "مريض", color: "text-blue-600" },
    { value: "200+", label: "طبيب", color: "text-green-600" },
    { value: "150+", label: "عيادة", color: "text-purple-600" },
    { value: "98%", label: "رضا", color: "text-orange-600" },
  ];

  const actions = [
    {
      icon: Brain,
      label: "تشخيص ذكي",
      href: "/ai-diagnosis",
      color: "bg-white text-blue-600",
    },
    {
      icon: MapPin,
      label: "ابحث عن عيادة",
      action: () => {},
      color: "border border-white/30 text-white",
    },
    {
      icon: Phone,
      label: "طوارئ",
      href: "/emergency",
      color: "bg-red-500 text-white",
    },
  ];

  return (
    <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 text-white py-6">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center">
          <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold mb-2">
            {title}
          </h1>
          <p className="text-blue-100 text-sm sm:text-base max-w-xl mx-auto mb-4">
            {subtitle}
          </p>

          {quickActions && (
            <div className="flex flex-wrap justify-center gap-2 mb-4">
              {actions.map((action, index) => (
                <Link
                  key={index}
                  to={action.href || "#"}
                  onClick={action.action}
                  className={cn(
                    "px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 hover:scale-105 flex items-center gap-2",
                    action.color,
                  )}
                >
                  <action.icon className="w-4 h-4" />
                  {action.label}
                </Link>
              ))}
            </div>
          )}

          {showStats && (
            <div className="grid grid-cols-4 gap-2 sm:gap-4">
              {stats.map((stat, index) => (
                <div
                  key={index}
                  className="bg-white/10 backdrop-blur-sm rounded-lg p-2 sm:p-3"
                >
                  <div className="text-base sm:text-lg font-bold">
                    {stat.value}
                  </div>
                  <div className="text-blue-100 text-xs">{stat.label}</div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// Widget-based Category Navigation
export function CompactCategoryNav({
  categories,
  activeCategory,
  onCategoryChange,
}: {
  categories: Array<{
    id: string;
    title: string;
    icon: React.ComponentType<any>;
    gradient: string;
    count?: number;
  }>;
  activeCategory: string;
  onCategoryChange: (id: string) => void;
}) {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-3 mb-4">
      <div className="grid grid-cols-3 gap-2">
        {categories.map((category) => {
          const isActive = activeCategory === category.id;
          return (
            <button
              key={category.id}
              onClick={() => onCategoryChange(category.id)}
              className={cn(
                "p-3 rounded-xl transition-all duration-300 text-center relative overflow-hidden",
                isActive
                  ? `bg-gradient-to-r ${category.gradient} text-white shadow-lg scale-105`
                  : "text-gray-600 hover:text-gray-900 hover:bg-gray-50 border border-gray-200",
              )}
            >
              <div className="flex flex-col items-center gap-2">
                <category.icon
                  className={cn(
                    "w-5 h-5 transition-transform",
                    isActive && "scale-110",
                  )}
                />
                <div>
                  <h3 className="font-bold text-xs leading-tight line-clamp-2">
                    {category.title}
                  </h3>
                  {category.count && (
                    <div
                      className={cn(
                        "text-xs mt-1 px-2 py-0.5 rounded-full",
                        isActive ? "bg-white/20" : "bg-gray-100 text-gray-600",
                      )}
                    >
                      {category.count}
                    </div>
                  )}
                </div>
              </div>
              {isActive && (
                <div className="absolute inset-0 bg-white/10 rounded-xl animate-pulse" />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
