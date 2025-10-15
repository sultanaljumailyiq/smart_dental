import {
  Home,
  Building2,
  Package,
  Users,
  Briefcase,
  BookOpen,
  MessageCircle,
  Calendar,
  BarChart3,
  Settings,
  Bell,
  Heart,
  User,
  Shield,
  CreditCard,
  Search,
  ShoppingCart,
  Menu,
  ChevronDown,
} from "lucide-react";
import { UserRole } from "@shared/permissions";

export interface NavigationItem {
  id: string;
  label: string;
  path: string;
  icon: React.ComponentType<any>;
  roles?: UserRole[];
  badge?: number | string;
  children?: NavigationItem[];
  external?: boolean;
  description?: string;
}

export interface NavigationSection {
  id: string;
  title: string;
  items: NavigationItem[];
  roles?: UserRole[];
}

// تكوين الأقسام الرئيسية للتنقل
export const navigationSections: NavigationSection[] = [
  {
    id: "main",
    title: "الرئيسية",
    items: [
      {
        id: "home",
        label: "الصفحة الرئيسية",
        path: "/",
        icon: Home,
        description: "العودة للصفحة الرئيسية",
      },
      {
        id: "dentist-hub",
        label: "مركز الأطباء",
        path: "/dentist-hub",
        icon: User,
        roles: ["clinic_owner", "clinic_staff"],
        description: "المركز المتكامل للأطباء",
      },
      {
        id: "supplier-center",
        label: "مركز الموردين",
        path: "/supplier/dashboard",
        icon: Package,
        roles: ["supplier"],
        description: "مركز إدارة الموردين",
      },
    ],
  },
  {
    id: "services",
    title: "الخدمات",
    items: [
      {
        id: "dental-supply",
        label: "متجر المستلزمات",
        path: "/dental-supply",
        icon: Package,
        description: "مستلزمات طب الأسنان والمعدات",
      },
      {
        id: "clinics",
        label: "العيادات",
        path: "/clinics",
        icon: Building2,
        description: "دليل العيادات المعتمدة",
      },
      {
        id: "jobs",
        label: "الوظائف",
        path: "/jobs",
        icon: Briefcase,
        description: "فرص العمل في مجال طب الأسنان",
      },
      {
        id: "articles",
        label: "المقالات",
        path: "/articles",
        icon: BookOpen,
        description: "مقالات ومعلومات طبية",
      },
    ],
  },
  {
    id: "community",
    title: "المجتمع",
    items: [
      {
        id: "community",
        label: "مجتمع الأطباء",
        path: "/community",
        icon: Users,
        description: "تواصل مع أطباء الأسنان",
      },
      {
        id: "messages",
        label: "الرسائل",
        path: "/messages",
        icon: MessageCircle,
        roles: ["clinic_owner", "clinic_staff", "patient"],
        description: "الرسائل والمحادثات",
      },
    ],
  },
  {
    id: "tools",
    title: "الأدوات",
    items: [
      {
        id: "appointments",
        label: "المواعيد",
        path: "/appointments",
        icon: Calendar,
        roles: ["clinic_owner", "clinic_staff", "patient"],
        description: "إدارة وحجز المواعيد",
      },
      {
        id: "analytics",
        label: "التقارير",
        path: "/analytics",
        icon: BarChart3,
        roles: ["clinic_owner"],
        description: "تقارير وإحصائيات",
      },
    ],
  },
  {
    id: "account",
    title: "الحساب",
    items: [
      {
        id: "profile",
        label: "الملف الشخصي",
        path: "/profile",
        icon: User,
        roles: ["clinic_owner", "clinic_staff", "patient"],
        description: "إدارة الملف الشخصي",
      },
      {
        id: "favorites",
        label: "المفضلة",
        path: "/favorites",
        icon: Heart,
        roles: ["clinic_owner", "clinic_staff", "patient"],
        description: "العناصر المحفوظة",
      },
      {
        id: "settings",
        label: "الإعدادات",
        path: "/settings",
        icon: Settings,
        roles: ["clinic_owner", "clinic_staff", "patient"],
        description: "إعدادات الحساب والتطبيق",
      },
    ],
  },
];

// إعدادات الأدوات السريعة (Quick Actions)
export const quickActions = [
  {
    id: "search",
    label: "البحث",
    icon: Search,
    action: "openSearch",
    shortcut: "Ctrl+K",
  },
  {
    id: "notifications",
    label: "الإشعارات",
    icon: Bell,
    action: "openNotifications",
    badgeKey: "unreadNotifications",
  },
  {
    id: "cart",
    label: "السلة",
    icon: ShoppingCart,
    path: "/cart",
    badgeKey: "cartItems",
    roles: ["clinic_owner", "clinic_staff"],
  },
  {
    id: "menu",
    label: "القائمة",
    icon: Menu,
    action: "toggleMenu",
  },
];

// إعدادات مختلف أنواع التنقل
export const navigationVariants = {
  header: {
    full: {
      showLogo: true,
      showSearch: true,
      showQuickActions: true,
      showUserMenu: true,
      maxItems: 8,
    },
    minimal: {
      showLogo: true,
      showSearch: false,
      showQuickActions: true,
      showUserMenu: true,
      maxItems: 4,
    },
    mobile: {
      showLogo: true,
      showSearch: false,
      showQuickActions: true,
      showUserMenu: false,
      maxItems: 0, // فقط الأدوات السريعة
    },
  },
  sidebar: {
    expanded: {
      showSectionTitles: true,
      showIcons: true,
      showDescriptions: true,
      collapsible: true,
    },
    compact: {
      showSectionTitles: false,
      showIcons: true,
      showDescriptions: false,
      collapsible: false,
    },
  },
  bottomNav: {
    fixed: {
      showLabels: true,
      maxItems: 5,
      position: "fixed",
    },
    floating: {
      showLabels: false,
      maxItems: 4,
      position: "floating",
    },
  },
};

// دالة للحصول على العناصر المسموحة حسب الدور
export const getFilteredNavigation = (
  sections: NavigationSection[],
  userRole: UserRole | null,
): NavigationSection[] => {
  if (!userRole) {
    return sections
      .map((section) => ({
        ...section,
        items: section.items.filter(
          (item) => !item.roles || item.roles.length === 0,
        ),
      }))
      .filter((section) => section.items.length > 0);
  }

  return sections
    .map((section) => {
      // تصفية القسم نفسه
      if (section.roles && !section.roles.includes(userRole)) {
        return null;
      }

      // تصفية العناصر داخل القسم
      const filteredItems = section.items.filter(
        (item) => !item.roles || item.roles.includes(userRole),
      );

      return filteredItems.length > 0
        ? {
            ...section,
            items: filteredItems,
          }
        : null;
    })
    .filter(Boolean) as NavigationSection[];
};

// دالة للحصول على الأدوات السريعة المسموحة
export const getFilteredQuickActions = (
  actions: typeof quickActions,
  userRole: UserRole | null,
) => {
  if (!userRole) {
    return actions.filter(
      (action) => !action.roles || action.roles.length === 0,
    );
  }

  return actions.filter(
    (action) => !action.roles || action.roles.includes(userRole),
  );
};

export default {
  navigationSections,
  quickActions,
  navigationVariants,
  getFilteredNavigation,
  getFilteredQuickActions,
};
