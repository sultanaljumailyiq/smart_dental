import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  Home,
  Heart,
  Calendar,
  TrendingUp,
  Settings,
  MessageCircle,
  Users,
  Store,
  GraduationCap,
  Package,
  ShoppingCart,
  Star,
  Gift,
  Filter,
  Search,
  Tag,
  Truck,
  CreditCard,
  Phone,
  ChevronDown,
  ChevronRight,
  ChevronLeft,
  Menu,
  X,
  Sparkles,
  Award,
  Zap,
  Target,
  Layers,
  Grid3X3,
  BookOpen,
  Building,
  Briefcase,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface SidebarProps {
  className?: string;
  collapsed?: boolean;
  onToggleCollapse?: () => void;
}

const getMenuItems = (pathname: string) => [
  {
    icon: Home,
    label: "الرئيسية",
    href: "/dental-supply",
    active: pathname === "/dental-supply",
    badge: null,
    color: "blue",
  },
  {
    icon: Grid3X3,
    label: "جميع الفئات",
    href: "/categories",
    active: pathname === "/products" || pathname === "/categories",
    badge: "جديد",
    color: "purple",
  },
  {
    icon: TrendingUp,
    label: "الأكثر مبيعاً",
    href: "/trending",
    active: pathname === "/trending",
    badge: "🔥",
    color: "red",
  },
  {
    icon: Star,
    label: "المنتجات المميزة",
    href: "/featured",
    active: pathname === "/featured",
    badge: "⭐",
    color: "yellow",
  },
  {
    icon: Gift,
    label: "العروض الخاصة",
    href: "/offers",
    active: pathname === "/offers",
    badge: "70%",
    color: "green",
  },
  {
    icon: Heart,
    label: "المفضلة",
    href: "/favorites",
    active: pathname === "/favorites",
    badge: null,
    color: "pink",
  },
  {
    icon: ShoppingCart,
    label: "سلة التسوق",
    href: "/cart",
    active: pathname === "/cart",
    badge: "3",
    color: "indigo",
  },
  {
    icon: Building,
    label: "الموردين",
    href: "/suppliers",
    active: pathname.startsWith("/suppliers"),
    badge: null,
    color: "teal",
  },
  {
    icon: Award,
    label: "العلامات التجارية",
    href: "/brands",
    active: pathname.startsWith("/brands"),
    badge: null,
    color: "orange",
  },
  {
    icon: GraduationCap,
    label: "قسم الطلاب",
    href: "/students",
    active: pathname === "/students",
    badge: "خصم",
    color: "cyan",
  },
];

const quickLinks = [
  {
    icon: Zap,
    label: "العروض السريعة",
    href: "/flash-deals",
    color: "bg-gradient-to-r from-yellow-500 to-orange-500",
  },
  {
    icon: Target,
    label: "منتجات مستهدفة",
    href: "/products",
    color: "bg-gradient-to-r from-blue-500 to-indigo-500",
  },
  {
    icon: Sparkles,
    label: "وصل حديثاً",
    href: "/new-arrivals",
    color: "bg-gradient-to-r from-purple-500 to-pink-500",
  },
  {
    icon: BookOpen,
    label: "كتالوج المنتجات",
    href: "/catalog",
    color: "bg-gradient-to-r from-green-500 to-emerald-500",
  },
];

const categories = [
  {
    name: "طب الأسنان العام",
    count: 312,
    icon: "🦷",
    color: "bg-blue-50 text-blue-600",
  },
  {
    name: "طب الأسنا�� التعويضي",
    count: 289,
    icon: "🔧",
    color: "bg-green-50 text-green-600",
  },
  {
    name: "جراحة الفم",
    count: 234,
    icon: "⚕️",
    color: "bg-red-50 text-red-600",
  },
  {
    name: "تقويم الأسنان",
    count: 167,
    icon: "📏",
    color: "bg-purple-50 text-purple-600",
  },
  {
    name: "طب أسنان الأطفال",
    count: 89,
    icon: "👶",
    color: "bg-yellow-50 text-yellow-600",
  },
  {
    name: "أدوات التعقيم",
    count: 45,
    icon: "🧽",
    color: "bg-teal-50 text-teal-600",
  },
];

export default function ModernSidebar({
  className,
  collapsed = false,
  onToggleCollapse,
}: SidebarProps) {
  const location = useLocation();
  const [expandedCategories, setExpandedCategories] = useState<string[]>([]);
  const [showAllCategories, setShowAllCategories] = useState(false);
  const menuItems = getMenuItems(location.pathname);

  const toggleCategory = (categoryName: string) => {
    setExpandedCategories((prev) =>
      prev.includes(categoryName)
        ? prev.filter((name) => name !== categoryName)
        : [...prev, categoryName],
    );
  };

  const getColorClasses = (color: string, active: boolean) => {
    if (active) {
      return (
        {
          blue: "bg-blue-50 text-blue-600 border-blue-200",
          purple: "bg-purple-50 text-purple-600 border-purple-200",
          red: "bg-red-50 text-red-600 border-red-200",
          yellow: "bg-yellow-50 text-yellow-600 border-yellow-200",
          green: "bg-green-50 text-green-600 border-green-200",
          pink: "bg-pink-50 text-pink-600 border-pink-200",
          indigo: "bg-indigo-50 text-indigo-600 border-indigo-200",
          teal: "bg-teal-50 text-teal-600 border-teal-200",
          orange: "bg-orange-50 text-orange-600 border-orange-200",
          cyan: "bg-cyan-50 text-cyan-600 border-cyan-200",
        }[color] || "bg-gray-50 text-gray-600 border-gray-200"
      );
    }
    return "text-gray-600 hover:text-purple-600 hover:bg-purple-50";
  };

  return (
    <div
      className={cn(
        "bg-white border-l border-gray-200 min-h-screen overflow-y-auto transition-all duration-300 relative",
        collapsed ? "w-16" : "w-64",
        className,
      )}
      dir="rtl"
    >
      {/* Toggle Button */}
      <button
        onClick={onToggleCollapse}
        className="absolute -left-3 top-6 z-50 w-6 h-6 bg-white border border-gray-200 rounded-full flex items-center justify-center hover:bg-gray-50 transition-colors shadow-sm"
      >
        {collapsed ? (
          <ChevronRight className="w-3 h-3 text-gray-600" />
        ) : (
          <ChevronLeft className="w-3 h-3 text-gray-600" />
        )}
      </button>

      {/* Header */}
      <div className="p-4 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-purple-50">
        <div className="flex items-center gap-3 relative">
          <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg flex-shrink-0">
            <Package className="w-5 h-5 text-white" />
          </div>
          {!collapsed && (
            <div>
              <h1 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                المتجر الطبي
              </h1>
              <p className="text-xs text-gray-500">متجر أدوات طب الأسنان</p>
            </div>
          )}
        </div>
      </div>

      {/* Search Bar */}
      {!collapsed && (
        <div className="p-4 border-b border-gray-100">
          <div className="relative">
            <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="ابحث عن المنتجات..."
              className="w-full pr-10 pl-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
            />
          </div>
        </div>
      )}

      {/* Navigation Menu */}
      <nav className="p-4 space-y-1">
        {menuItems.map((item, index) => (
          <Link
            key={index}
            to={item.href}
            className={cn(
              "flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 relative group border",
              getColorClasses(item.color, item.active),
              item.active && "shadow-sm scale-105",
            )}
            title={collapsed ? item.label : undefined}
          >
            <item.icon className="w-5 h-5 flex-shrink-0" />
            {!collapsed && (
              <>
                <span className="text-sm font-medium flex-1">{item.label}</span>
                {item.badge && (
                  <span
                    className={cn(
                      "text-xs px-2 py-0.5 rounded-full font-medium",
                      item.active
                        ? "bg-white/80 text-current"
                        : "bg-red-100 text-red-600",
                    )}
                  >
                    {item.badge}
                  </span>
                )}
              </>
            )}
            {collapsed && (
              <div className="absolute right-full mr-2 px-2 py-1 bg-gray-900 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-50">
                {item.label}
              </div>
            )}
          </Link>
        ))}
      </nav>

      {/* Quick Links */}
      {!collapsed && (
        <div className="px-4 py-2">
          <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">
            روابط سريعة
          </h4>
          <div className="grid grid-cols-2 gap-2">
            {quickLinks.map((link, index) => (
              <Link
                key={index}
                to={link.href}
                className={cn(
                  "flex flex-col items-center gap-1 p-3 rounded-xl text-white transition-transform hover:scale-105",
                  link.color,
                )}
              >
                <link.icon className="w-4 h-4" />
                <span className="text-xs font-medium text-center leading-tight">
                  {link.label}
                </span>
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* Categories Section */}
      {!collapsed && (
        <div className="px-4 py-2">
          <div className="flex items-center justify-between mb-3">
            <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
              الفئات الشائعة
            </h4>
            <button
              onClick={() => setShowAllCategories(!showAllCategories)}
              className="text-xs text-blue-600 hover:text-blue-700 font-medium"
            >
              {showAllCategories ? "أقل" : "المزيد"}
            </button>
          </div>
          <div className="space-y-2">
            {(showAllCategories ? categories : categories.slice(0, 4)).map(
              (category, index) => (
                <button
                  key={index}
                  className={cn(
                    "w-full flex items-center gap-3 p-2 rounded-lg transition-colors text-right border",
                    category.color,
                    "hover:shadow-sm",
                  )}
                >
                  <span className="text-lg">{category.icon}</span>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-medium truncate">
                      {category.name}
                    </div>
                    <div className="text-xs opacity-70">
                      {category.count} منتج
                    </div>
                  </div>
                  <ChevronLeft className="w-4 h-4 opacity-50" />
                </button>
              ),
            )}
          </div>
        </div>
      )}

      {/* Help & Support */}
      {!collapsed && (
        <div className="p-4 mt-auto">
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-4 text-center">
            <MessageCircle className="w-8 h-8 text-blue-600 mx-auto mb-2" />
            <h4 className="text-sm font-semibold text-gray-900 mb-1">
              تحتاج مساعدة؟
            </h4>
            <p className="text-xs text-gray-600 mb-3">تواصل مع فريق الدعم</p>
            <button className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg text-xs font-medium hover:bg-blue-700 transition-colors">
              دردشة مباشرة
            </button>
          </div>
        </div>
      )}

      {/* Footer Info */}
      {!collapsed && (
        <div className="p-4 border-t border-gray-100 bg-gray-50">
          <div className="text-center">
            <div className="text-xs text-gray-500 mb-1">آخر تحديث للمنتجات</div>
            <div className="text-xs font-medium text-gray-700">
              اليوم، 2:30 م
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
