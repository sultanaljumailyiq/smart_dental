import React, { useMemo } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  Home,
  Stethoscope,
  MessageCircle,
  Briefcase,
  Package,
  Settings,
  User,
  UserCheck,
  Heart,
  Search,
  FileText,
} from "lucide-react";
import { cn } from "@/lib/utils";
import {
  useNavigation,
  useCurrentSection,
  SectionType,
} from "@/contexts/NavigationContext";
import { useStaffPermissions } from "@/hooks/useStaffPermissions";

interface FinalUnifiedBottomNavProps {
  userRole?:
    | "dentist"
    | "clinic_owner"
    | "clinic_staff"
    | "patient"
    | "admin"
    | "supplier"
    | null;
  className?: string;
  maxItems?: number;
}

// تعريف العناصر المتاحة للشريط السفلي
const BOTTOM_NAV_ITEMS = {
  home: {
    id: "home",
    label: "الرئيسية",
    icon: Home,
    color: "blue",
    section: "home" as SectionType,
    path: "/",
    priority: 10,
    isPublic: true,
  },
  marketplace: {
    id: "marketplace",
    label: "المتجر",
    icon: Package,
    color: "purple",
    section: "marketplace" as SectionType,
    path: "/dental-supply",
    priority: 9,
    isPublic: true,
  },
  community: {
    id: "community",
    label: "المجتمع",
    icon: MessageCircle,
    color: "blue",
    section: "community" as SectionType,
    path: "/community",
    priority: 8,
    isPublic: true,
  },
  jobs: {
    id: "jobs",
    label: "الوظائف",
    icon: Briefcase,
    color: "green",
    section: "jobs" as SectionType,
    path: "/jobs",
    priority: 7,
    permissions: ["dentist", "supplier", "admin"],
  },
  dentistHub: {
    id: "dentist-hub",
    label: "مركز الأطباء",
    icon: UserCheck,
    color: "indigo",
    section: "dentist-hub" as SectionType,
    path: "/dentist-hub",
    priority: 9,
    permissions: ["dentist", "clinic_owner", "clinic_staff", "admin"],
  },
  clinic: {
    id: "clinic",
    label: "العيادة",
    icon: Stethoscope,
    color: "cyan",
    section: "dentist-hub" as SectionType,
    path: "/dentist-hub/clinics",
    priority: 6,
    permissions: ["dentist", "clinic_owner", "clinic_staff", "admin"],
  },
  articles: {
    id: "articles",
    label: "المقالات",
    icon: FileText,
    color: "indigo",
    section: "articles" as SectionType,
    path: "/articles",
    priority: 5,
    isPublic: true,
  },
  profile: {
    id: "profile",
    label: "الملف",
    icon: User,
    color: "gray",
    section: "profile" as SectionType,
    path: "/profile",
    priority: 4,
  },
  favorites: {
    id: "favorites",
    label: "ا��مفضلة",
    icon: Heart,
    color: "red",
    section: "favorites" as SectionType,
    path: "/favorites",
    priority: 3,
  },
  search: {
    id: "search",
    label: "البحث",
    icon: Search,
    color: "purple",
    section: "search" as SectionType,
    path: "/search",
    priority: 2,
    isPublic: true,
  },
};

// ألوان الأقسام
const SECTION_COLORS = {
  blue: {
    text: "text-blue-600",
    bg: "bg-blue-100",
    indicator: "bg-blue-500",
  },
  purple: {
    text: "text-purple-600",
    bg: "bg-purple-100",
    indicator: "bg-purple-500",
  },
  green: {
    text: "text-green-600",
    bg: "bg-green-100",
    indicator: "bg-green-500",
  },
  cyan: {
    text: "text-cyan-600",
    bg: "bg-cyan-100",
    indicator: "bg-cyan-500",
  },
  indigo: {
    text: "text-indigo-600",
    bg: "bg-indigo-100",
    indicator: "bg-indigo-500",
  },
  red: {
    text: "text-red-600",
    bg: "bg-red-100",
    indicator: "bg-red-500",
  },
  gray: {
    text: "text-gray-600",
    bg: "bg-gray-100",
    indicator: "bg-gray-500",
  },
};

import { createPortal } from "react-dom";
import { useEffect, useState } from "react";

export default function FinalUnifiedBottomNav({
  userRole = null,
  className,
  maxItems = 6,
}: FinalUnifiedBottomNavProps) {
  const location = useLocation();
  const { state, navigateToSection } = useNavigation();
  const { section: currentSection } = useCurrentSection();
  const { canAccessSection, isStaffMode } = useStaffPermissions();

  // تحديد العناصر المتاحة بناءً على دور المستخدم
  const availableItems = useMemo(() => {
    return Object.values(BOTTOM_NAV_ITEMS)
      .filter((item) => {
        // إذا كان العنصر عام
        if ('isPublic' in item && item.isPublic) return true;

        // إذا لم يكن هناك مستخدم مسجل ولا يتطلب صلاحيات
        if (!userRole && !('permissions' in item)) return true;

        // إذا كان يتطلب صلاحيات محددة
        if ('permissions' in item && item.permissions) {
          return userRole && item.permissions.includes(userRole);
        }

        return true;
      })
      .filter((item) => {
        // Filter by staff permissions if in staff mode
        if (!isStaffMode) return true;
        
        if (item.id === 'marketplace') return canAccessSection('marketplace');
        if (item.id === 'community') return canAccessSection('community');
        if (item.id === 'jobs') return canAccessSection('jobs');
        if (item.id === 'clinic') return canAccessSection('clinic_old');
        if (item.id === 'dentist-hub') return canAccessSection('dentist-hub');
        
        return true;
      })
      .sort((a, b) => b.priority - a.priority)
      .slice(0, maxItems);
  }, [userRole, maxItems, isStaffMode, canAccessSection]);

  // تحديد العنصر النشط
  const getActiveItemIndex = () => {
    return availableItems.findIndex(
      (item) =>
        item.section === currentSection ||
        location.pathname.startsWith(item.path),
    );
  };

  // معالجة النقر على عنصر
  const handleItemClick = (item: typeof BOTTOM_NAV_ITEMS.home) => {
    navigateToSection(item.section, item.path, { preserveContext: true });
  };

  // تحديد إذا كان العنصر نشط
  const isItemActive = (item: typeof BOTTOM_NAV_ITEMS.home) => {
    if (item.path === "/") {
      return location.pathname === "/";
    }
    return (
      currentSection === item.section || location.pathname.startsWith(item.path)
    );
  };

  const activeIndex = getActiveItemIndex();

  const [mounted, setMounted] = useState(false);
  useEffect(() => { setMounted(true); }, []);

  const navContent = (
    <nav
      className={cn(
        "fixed !bottom-0 !left-0 !right-0 !z-[70]",
        "bg-white/95 backdrop-blur-md border-t border-gray-200/50 shadow-lg",
        "safe-area-inset-bottom",
        className,
      )}
      style={{ position: 'fixed', bottom: 0, left: 0, right: 0, zIndex: 70 }}
    >
      {/* مؤش�� النشاط العلوي */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-gray-200 to-transparent">
        {activeIndex >= 0 && (
          <div
            className={cn(
              "h-full transition-all duration-300 ease-in-out rounded-full",
              SECTION_COLORS[availableItems[activeIndex]?.color]?.indicator ||
                "bg-blue-500",
            )}
            style={{
              width: `${100 / availableItems.length}%`,
              transform: `translateX(${activeIndex * 100}%)`,
            }}
          />
        )}
      </div>

      {/* عناصر التنقل */}
      <div
        className={cn(
          "flex items-center justify-around",
          "px-2 py-1",
          "max-w-md mx-auto",
        )}
      >
        {availableItems.map((item, index) => {
          const Icon = item.icon;
          const isActive = isItemActive(item as any);
          const colors = SECTION_COLORS[item.color] || SECTION_COLORS.blue;

          return (
            <button
              key={item.id}
              onClick={() => handleItemClick(item as any)}
              className={cn(
                "flex flex-col items-center gap-1 p-3 rounded-xl transition-all duration-200",
                "min-w-0 flex-1 max-w-[80px]",
                "touch-manipulation active:scale-95",
                isActive
                  ? cn(
                      colors.bg,
                      colors.text,
                      "shadow-sm transform -translate-y-0.5",
                    )
                  : "text-gray-500 hover:text-gray-700 hover:bg-gray-50",
              )}
              aria-label={item.label}
            >
              {/* الأيقونة */}
              <div
                className={cn(
                  "relative p-1 rounded-lg transition-all duration-200",
                  isActive && "bg-white/80 shadow-sm",
                )}
              >
                <Icon
                  className={cn(
                    "w-5 h-5 transition-all duration-200",
                    isActive && "scale-110",
                  )}
                />

                {/* نقطة النشاط */}
                {isActive && (
                  <div
                    className={cn(
                      "absolute -top-1 -right-1 w-2 h-2 rounded-full",
                      colors.indicator,
                    )}
                  />
                )}
              </div>

              {/* النص */}
              <span
                className={cn(
                  "text-xs font-medium text-center leading-tight",
                  "truncate w-full",
                  isActive && "font-semibold",
                )}
              >
                {item.label}
              </span>
            </button>
          );
        })}
      </div>

      {/* تأثير الانتقال */}
      {state.isTransitioning && (
        <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-blue-500 to-purple-500 animate-pulse" />
      )}
    </nav>
  );

  // Render via portal on client to avoid stacking-context issues
  if (typeof document !== "undefined" && mounted) {
    return createPortal(navContent, document.body);
  }

  return navContent;
}

// مكون مساعد لعرض نقاط الإشعارات
export function NavBadge({
  count,
  maxCount = 99,
}: {
  count: number;
  maxCount?: number;
}) {
  if (count <= 0) return null;

  return (
    <div className="absolute -top-1 -right-1 min-w-[18px] h-[18px] bg-red-500 text-white text-xs rounded-full flex items-center justify-center font-medium">
      {count > maxCount ? `${maxCount}+` : count}
    </div>
  );
}
