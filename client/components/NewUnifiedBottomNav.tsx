import React from "react";
import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { UserRole } from "@shared/permissions";
import { useNavigationSystem } from "@/hooks/useNavigationSystem";
import {
  Home,
  Package,
  Heart,
  User,
  Plus,
  Briefcase,
  Building2,
  MessageCircle,
} from "lucide-react";

interface NewUnifiedBottomNavProps {
  userRole?: UserRole | null;
  userStats?: Record<string, any>;
  style?: "fixed" | "floating";
  className?: string;
  onQuickAction?: () => void;
}

export const NewUnifiedBottomNav: React.FC<NewUnifiedBottomNavProps> = ({
  userRole = null,
  userStats = {},
  style = "fixed",
  className,
  onQuickAction,
}) => {
  const location = useLocation();
  const navigation = useNavigationSystem(userRole, userStats);

  // العناصر الأساسية للتنقل السفلي
  const getBottomNavItems = () => {
    const baseItems = [
      {
        id: "home",
        label: "الرئيسية",
        path: "/",
        icon: Home,
        description: "الصفحة الرئيسية",
      },
      {
        id: "dental-supply",
        label: "المتجر",
        path: "/dental-supply",
        icon: Package,
        description: "متجر المستلزمات",
        badge: userStats.cartItems || null,
      },
    ];

    // إضافة عناصر خاصة حسب دور المستخدم
    if (userRole) {
      // للأطباء وأصحاب العيادات
      if (["dentist", "clinic_owner", "clinic_staff"].includes(userRole)) {
        baseItems.push({
          id: "dentist-hub",
          label: "المركز",
          path: "/dentist-hub",
          icon: Building2,
          description: "مركز الأطباء",
          badge: userStats.unreadNotifications || null,
        });
      } else {
        // للمرضى
        baseItems.push({
          id: "appointments",
          label: "المواعيد",
          path: "/appointments",
          icon: Building2,
          description: "المواعيد",
          badge: userStats.upcomingAppointments || null,
        });
      }

      baseItems.push({
        id: "favorites",
        label: "المفضلة",
        path: "/favorites",
        icon: Heart,
        description: "العناصر المحفوظة",
      });

      baseItems.push({
        id: "profile",
        label: "الملف",
        path: "/profile",
        icon: User,
        description: "الملف الشخصي",
      });
    } else {
      // للزوار غير المسجلين
      baseItems.push(
        {
          id: "jobs",
          label: "الوظائف",
          path: "/jobs",
          icon: Briefcase,
          description: "فرص العمل",
        },
        {
          id: "login",
          label: "الدخول",
          path: "/login",
          icon: User,
          description: "تسجيل الدخول",
        },
      );
    }

    return baseItems.slice(0, 5); // حد أقصى 5 عناصر
  };

  const bottomNavItems = getBottomNavItems();

  // تحديد العنصر النشط
  const isItemActive = (path: string) => {
    if (path === "/") {
      return location.pathname === "/";
    }
    return location.pathname.startsWith(path);
  };

  // زر الإجراء السريع (لأصحاب العيادات والأطبا��)
  const QuickActionButton = () => {
    if (!userRole || !["dentist", "clinic_owner"].includes(userRole)) {
      return null;
    }

    return (
      <button
        onClick={onQuickAction}
        className="absolute -top-6 left-1/2 transform -translate-x-1/2 w-12 h-12 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-full shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center"
        title="إجراء سريع"
      >
        <Plus className="w-6 h-6" />
      </button>
    );
  };

  return (
    <div
      className={cn(
        "bg-white border-t border-gray-200",
        style === "fixed" && "fixed bottom-0 left-0 right-0 z-40",
        style === "floating" && "mx-4 mb-4 rounded-2xl shadow-lg border",
        className,
      )}
    >
      {style === "floating" && <QuickActionButton />}

      <div className="relative">
        <div className="grid grid-cols-4 md:grid-cols-5">
          {bottomNavItems.map((item, index) => {
            const Icon = item.icon;
            const active = isItemActive(item.path);

            return (
              <Link
                key={item.id}
                to={item.path}
                className={cn(
                  "flex flex-col items-center gap-1 p-3 transition-all duration-200",
                  active
                    ? "text-blue-600"
                    : "text-gray-600 hover:text-gray-900",
                  // إذا كان العنصر الثالث وهناك زر سريع
                  style === "floating" &&
                    index === 2 &&
                    userRole &&
                    ["dentist", "clinic_owner"].includes(userRole) &&
                    "mt-4",
                )}
              >
                <div className="relative">
                  <div
                    className={cn(
                      "p-2 rounded-xl transition-colors",
                      active && "bg-blue-100",
                    )}
                  >
                    <Icon className="w-6 h-6" />
                  </div>

                  {item.badge && (
                    <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                      {item.badge}
                    </span>
                  )}
                </div>

                <span className="text-xs font-medium text-center truncate max-w-16">
                  {item.label}
                </span>
              </Link>
            );
          })}
        </div>

        {/* مؤشر النشاط */}
        {style === "fixed" && (
          <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-blue-600 to-transparent">
            <div
              className="h-full bg-blue-600 transition-all duration-300"
              style={{
                width: `${100 / bottomNavItems.length}%`,
                transform: `translateX(${bottomNavItems.findIndex((item) => isItemActive(item.path)) * 100}%)`,
              }}
            />
          </div>
        )}
      </div>
    </div>
  );
};

// مكون بديل للتنقل السفلي مع خيارات متقدمة
interface AdvancedBottomNavProps extends NewUnifiedBottomNavProps {
  showLabels?: boolean;
  centerActionButton?: boolean;
  customActions?: Array<{
    id: string;
    label: string;
    icon: React.ComponentType<any>;
    action: () => void;
  }>;
}

export const AdvancedBottomNav: React.FC<AdvancedBottomNavProps> = ({
  userRole,
  userStats = {},
  style = "fixed",
  className,
  showLabels = true,
  centerActionButton = false,
  customActions = [],
  onQuickAction,
}) => {
  const navigation = useNavigationSystem(userRole, userStats);

  // دمج العناصر الأساسية مع الإجراءات المخصصة
  const allItems = [
    ...navigation.filteredSections
      .flatMap((section) => section.items)
      .slice(0, 4),
    ...customActions,
  ];

  return (
    <div
      className={cn(
        "bg-white/95 backdrop-blur-lg border-t border-gray-200/50",
        style === "fixed" && "fixed bottom-0 left-0 right-0 z-40",
        style === "floating" &&
          "mx-4 mb-4 rounded-2xl shadow-2xl border border-gray-200",
        className,
      )}
    >
      <div className="relative px-4 py-2">
        {/* الزر المركزي */}
        {centerActionButton && onQuickAction && (
          <div className="absolute -top-8 left-1/2 transform -translate-x-1/2">
            <button
              onClick={onQuickAction}
              className="w-16 h-16 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-full shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center"
            >
              <Plus className="w-8 h-8" />
            </button>
          </div>
        )}

        {/* العناصر */}
        <div
          className={cn(
            "grid gap-2",
            centerActionButton
              ? "grid-cols-4"
              : `grid-cols-${Math.min(allItems.length, 5)}`,
          )}
        >
          {allItems.map((item, index) => {
            // تخطي العنصر الأوسط إذا كان هناك زر مركزي
            if (centerActionButton && index === 2) {
              return <div key={`spacer-${index}`} className="w-full" />;
            }

            const Icon = item.icon;
            const isActive = navigation.isItemActive(item as any);
            const badge = navigation.getItemBadge(item as any);

            const handleClick = () => {
              if ("action" in item) {
                item.action();
              } else {
                navigation.navigateToItem(item);
              }
            };

            return (
              <button
                key={item.id}
                onClick={handleClick}
                className={cn(
                  "flex flex-col items-center gap-1 p-3 rounded-xl transition-all duration-200",
                  isActive
                    ? "text-blue-600 bg-blue-50"
                    : "text-gray-600 hover:text-gray-900 hover:bg-gray-50",
                )}
              >
                <div className="relative">
                  <Icon className="w-6 h-6" />
                  {badge && (
                    <span className="absolute -top-2 -right-2 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                      {badge}
                    </span>
                  )}
                </div>

                {showLabels && (
                  <span className="text-xs font-medium text-center truncate max-w-16">
                    {item.label}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default NewUnifiedBottomNav;
