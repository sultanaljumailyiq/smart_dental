import { useState, useEffect, useCallback, useMemo } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { UserRole } from "@shared/permissions";
import {
  navigationSections,
  quickActions,
  getFilteredNavigation,
  getFilteredQuickActions,
  NavigationItem,
  NavigationSection,
} from "@/config/navigationConfig";

interface NavigationState {
  isMenuOpen: boolean;
  isMobileMenuOpen: boolean;
  isSearchOpen: boolean;
  isNotificationsOpen: boolean;
  activeSection: string | null;
  activeItem: string | null;
}

interface UserStats {
  unreadNotifications?: number;
  cartItems?: number;
  [key: string]: any;
}

export interface UseNavigationSystemReturn {
  // حالة التنقل
  navigationState: NavigationState;

  // البيانات المفلترة
  filteredSections: NavigationSection[];
  filteredQuickActions: typeof quickActions;

  // العنصر النشط
  activeItem: NavigationItem | null;
  activeSection: NavigationSection | null;

  // إجراءات التحكم
  toggleMenu: () => void;
  toggleMobileMenu: () => void;
  toggleSearch: () => void;
  toggleNotifications: () => void;
  closeAllMenus: () => void;

  // التنقل
  navigateToItem: (item: NavigationItem) => void;
  navigateToPath: (path: string) => void;

  // مساعدات
  isItemActive: (item: NavigationItem) => boolean;
  isSectionActive: (section: NavigationSection) => boolean;
  getItemBadge: (item: NavigationItem) => number | string | null;
  getActionBadge: (actionId: string) => number | string | null;
}

export const useNavigationSystem = (
  userRole: UserRole | null = null,
  userStats: UserStats = {},
): UseNavigationSystemReturn => {
  const location = useLocation();
  const navigate = useNavigate();

  // حالة التنقل
  const [navigationState, setNavigationState] = useState<NavigationState>({
    isMenuOpen: false,
    isMobileMenuOpen: false,
    isSearchOpen: false,
    isNotificationsOpen: false,
    activeSection: null,
    activeItem: null,
  });

  // البيانات المفلترة بناءً ��لى دور المستخدم
  const filteredSections = useMemo(
    () => getFilteredNavigation(navigationSections, userRole),
    [userRole],
  );

  const filteredQuickActions = useMemo(
    () => getFilteredQuickActions(quickActions, userRole),
    [userRole],
  );

  // تحديد العنصر والقسم النشط بناءً على المسار الحالي
  const { activeItem, activeSection } = useMemo(() => {
    const currentPath = location.pathname;

    let foundItem: NavigationItem | null = null;
    let foundSection: NavigationSection | null = null;

    for (const section of filteredSections) {
      for (const item of section.items) {
        if (
          currentPath === item.path ||
          (item.path !== "/" && currentPath.startsWith(item.path))
        ) {
          foundItem = item;
          foundSection = section;
          break;
        }
      }
      if (foundItem) break;
    }

    return { activeItem: foundItem, activeSection: foundSection };
  }, [location.pathname, filteredSections]);

  // تحديث حالة العنصر النشط
  useEffect(() => {
    setNavigationState((prev) => ({
      ...prev,
      activeSection: activeSection?.id || null,
      activeItem: activeItem?.id || null,
    }));
  }, [activeItem, activeSection]);

  // إجراءات التحكم في القوائم
  const toggleMenu = useCallback(() => {
    setNavigationState((prev) => ({
      ...prev,
      isMenuOpen: !prev.isMenuOpen,
      isMobileMenuOpen: false,
      isSearchOpen: false,
      isNotificationsOpen: false,
    }));
  }, []);

  const toggleMobileMenu = useCallback(() => {
    setNavigationState((prev) => ({
      ...prev,
      isMobileMenuOpen: !prev.isMobileMenuOpen,
      isMenuOpen: false,
      isSearchOpen: false,
      isNotificationsOpen: false,
    }));
  }, []);

  const toggleSearch = useCallback(() => {
    setNavigationState((prev) => ({
      ...prev,
      isSearchOpen: !prev.isSearchOpen,
      isMenuOpen: false,
      isMobileMenuOpen: false,
      isNotificationsOpen: false,
    }));
  }, []);

  const toggleNotifications = useCallback(() => {
    setNavigationState((prev) => ({
      ...prev,
      isNotificationsOpen: !prev.isNotificationsOpen,
      isMenuOpen: false,
      isMobileMenuOpen: false,
      isSearchOpen: false,
    }));
  }, []);

  const closeAllMenus = useCallback(() => {
    setNavigationState((prev) => ({
      ...prev,
      isMenuOpen: false,
      isMobileMenuOpen: false,
      isSearchOpen: false,
      isNotificationsOpen: false,
    }));
  }, []);

  // إجراءات التنقل
  const navigateToItem = useCallback(
    (item: NavigationItem) => {
      if (item.external) {
        window.open(item.path, "_blank");
      } else {
        navigate(item.path);
      }
      closeAllMenus();
    },
    [navigate, closeAllMenus],
  );

  const navigateToPath = useCallback(
    (path: string) => {
      navigate(path);
      closeAllMenus();
    },
    [navigate, closeAllMenus],
  );

  // مساعدات التحقق من الحالة النشطة
  const isItemActive = useCallback(
    (item: NavigationItem) => {
      return activeItem?.id === item.id;
    },
    [activeItem],
  );

  const isSectionActive = useCallback(
    (section: NavigationSection) => {
      return activeSection?.id === section.id;
    },
    [activeSection],
  );

  // الحصول على شارات العناصر
  const getItemBadge = useCallback(
    (item: NavigationItem) => {
      if (item.badge !== undefined) {
        return item.badge;
      }

      // شارات ديناميكية من إحصائيات المستخدم
      switch (item.id) {
        case "notifications":
          return userStats.unreadNotifications || null;
        case "messages":
          return userStats.unreadMessages || null;
        case "appointments":
          return userStats.pendingAppointments || null;
        default:
          return null;
      }
    },
    [userStats],
  );

  const getActionBadge = useCallback(
    (actionId: string) => {
      const action = filteredQuickActions.find((a) => a.id === actionId);
      if (!action?.badgeKey) return null;

      return userStats[action.badgeKey] || null;
    },
    [filteredQuickActions, userStats],
  );

  // إغلاق القوائم عند تغيير المسار
  useEffect(() => {
    closeAllMenus();
  }, [location.pathname, closeAllMenus]);

  // إغلاق القوائم عند الضغط على Escape
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        closeAllMenus();
      }

      // اختصار البحث
      if ((event.ctrlKey || event.metaKey) && event.key === "k") {
        event.preventDefault();
        toggleSearch();
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [closeAllMenus, toggleSearch]);

  return {
    navigationState,
    filteredSections,
    filteredQuickActions,
    activeItem,
    activeSection,
    toggleMenu,
    toggleMobileMenu,
    toggleSearch,
    toggleNotifications,
    closeAllMenus,
    navigateToItem,
    navigateToPath,
    isItemActive,
    isSectionActive,
    getItemBadge,
    getActionBadge,
  };
};

export default useNavigationSystem;
