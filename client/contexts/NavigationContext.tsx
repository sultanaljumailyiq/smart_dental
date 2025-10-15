import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from "react";
import { useLocation, useNavigate } from "react-router-dom";

// تعريف أنواع الأقسام الرئيسية
export type SectionType =
  | "marketplace"
  | "community"
  | "jobs"
  | "dentist-hub"
  | "clinic"
  | "admin"
  | "articles"
  | "profile"
  | "home"
  | "favorites"
  | "notifications"
  | "search";

// تعريف البيانات الفرعية لكل قسم
export interface SectionContext {
  lastVisitedPage?: string;
  searchQuery?: string;
  filters?: any;
  scrollPosition?: number;
  viewMode?: "grid" | "list" | "cards";
  sortBy?: string;
  category?: string;
  timestamp?: number;
}

// ت��ريف حالة التنقل
export interface NavigationState {
  currentSection: SectionType;
  previousSection: SectionType;
  navigationHistory: SectionType[];
  sectionContexts: {
    [key in SectionType]?: SectionContext;
  };
  breadcrumbs: Array<{
    label: string;
    path: string;
    section: SectionType;
  }>;
  isTransitioning: boolean;
  transitionDirection: "forward" | "backward" | "none";
}

// تعريف خيارات التنقل
export interface NavigationOptions {
  preserveContext?: boolean;
  clearHistory?: boolean;
  forceRefresh?: boolean;
  transitionType?: "slide" | "fade" | "none";
}

// تعريف واجهة NavigationContext
interface NavigationContextType {
  state: NavigationState;
  navigateToSection: (
    section: SectionType,
    path?: string,
    options?: NavigationOptions,
  ) => void;
  goBack: () => void;
  goForward: () => void;
  updateSectionContext: (
    section: SectionType,
    context: Partial<SectionContext>,
  ) => void;
  getSectionContext: (section: SectionType) => SectionContext;
  isComingFromSection: (section: SectionType) => boolean;
  getCurrentSectionConfig: () => SectionConfig;
  getAvailableSections: () => SectionConfig[];
  clearSectionContext: (section: SectionType) => void;
  getBreadcrumbs: () => Array<{
    label: string;
    path: string;
    section: SectionType;
  }>;
  canGoBack: () => boolean;
  canGoForward: () => boolean;
}

// تكوين الأقسام
export interface SectionConfig {
  type: SectionType;
  name: string;
  nameAr: string;
  defaultPath: string;
  icon: string;
  color: string;
  description?: string;
  permissions?: string[];
  isPublic?: boolean;
  hasSubSections?: boolean;
  subSections?: Array<{
    name: string;
    path: string;
    icon: string;
  }>;
}

// تكوينات الأقسام المختلفة
const SECTION_CONFIGS: Record<SectionType, SectionConfig> = {
  marketplace: {
    type: "marketplace",
    name: "Marketplace",
    nameAr: "المتجر",
    defaultPath: "/dental-supply",
    icon: "Package",
    color: "purple",
    description: "متجر المعدات الطبية",
    isPublic: true,
    hasSubSections: true,
    subSections: [
      { name: "المنتجات", path: "/dental-supply/products", icon: "Package" },
      { name: "العروض", path: "/dental-supply/offers", icon: "Tag" },
      { name: "الماركات", path: "/dental-supply/brands", icon: "Star" },
    ],
  },
  community: {
    type: "community",
    name: "Community",
    nameAr: "المجتمع",
    defaultPath: "/community",
    icon: "MessageCircle",
    color: "blue",
    description: "مجتمع أطباء الأسنان",
    isPublic: true,
    hasSubSections: true,
    subSections: [
      { name: "المنشورات", path: "/community/posts", icon: "FileText" },
      {
        name: "النقاشا��",
        path: "/community/discussions",
        icon: "MessageSquare",
      },
      { name: "الأحداث", path: "/community/events", icon: "Calendar" },
    ],
  },
  jobs: {
    type: "jobs",
    name: "Jobs",
    nameAr: "التوظيف",
    defaultPath: "/jobs",
    icon: "Briefcase",
    color: "green",
    description: "فرص العمل والوظائف",
    isPublic: true,
    permissions: ["dentist", "supplier"],
  },
  "dentist-hub": {
    type: "dentist-hub",
    name: "Dentist Hub",
    nameAr: "مركز الأطباء",
    defaultPath: "/dentist-hub",
    icon: "UserCheck",
    color: "indigo",
    description: "المركز المتكامل للأطباء",
    permissions: ["dentist", "clinic_owner", "clinic_staff", "admin"],
  },
  clinic: {
    type: "clinic",
    name: "Clinic",
    nameAr: "العيادة",
    defaultPath: "/clinic",
    icon: "Stethoscope",
    color: "cyan",
    description: "إدارة العيادة",
    permissions: ["dentist", "admin"],
    hasSubSections: true,
    subSections: [
      { name: "المرضى", path: "/admin/patients", icon: "Users" },
      { name: "المواعيد", path: "/admin/appointments", icon: "Calendar" },
      { name: "العلاجات", path: "/admin/treatments", icon: "Stethoscope" },
    ],
  },
  admin: {
    type: "admin",
    name: "Admin",
    nameAr: "الإدارة",
    defaultPath: "/admin/dashboard",
    icon: "Settings",
    color: "orange",
    description: "لوحة التحكم الإدارية",
    permissions: ["admin"],
  },
  articles: {
    type: "articles",
    name: "Articles",
    nameAr: "المقالات",
    defaultPath: "/articles",
    icon: "FileText",
    color: "indigo",
    description: "المقالات الطبية",
    isPublic: true,
  },
  profile: {
    type: "profile",
    name: "Profile",
    nameAr: "الملف الشخصي",
    defaultPath: "/profile",
    icon: "User",
    color: "gray",
    description: "الملف الشخصي للمستخدم",
  },
  home: {
    type: "home",
    name: "Home",
    nameAr: "الرئيسية",
    defaultPath: "/",
    icon: "Home",
    color: "blue",
    description: "الصفحة الرئيسية",
    isPublic: true,
  },
  favorites: {
    type: "favorites",
    name: "Favorites",
    nameAr: "المفضلة",
    defaultPath: "/favorites",
    icon: "Heart",
    color: "red",
    description: "العناصر المفضلة",
  },
  notifications: {
    type: "notifications",
    name: "Notifications",
    nameAr: "الإشعارات",
    defaultPath: "/dentist-hub/notifications",
    icon: "Bell",
    color: "yellow",
    description: "الإشعارات والتنبيهات",
  },
  search: {
    type: "search",
    name: "Search",
    nameAr: "البحث",
    defaultPath: "/search",
    icon: "Search",
    color: "purple",
    description: "البحث الشامل",
  },
};

// ربط المسارات بالأقسام
const PATH_TO_SECTION_MAP: Record<string, SectionType> = {
  "/": "home",
  "/dental-supply": "marketplace",
  "/marketplace": "marketplace",
  "/products": "marketplace",
  "/categories": "marketplace",
  "/brands": "marketplace",
  "/offers": "marketplace",
  "/suppliers": "marketplace",
  "/community": "community",
  "/posts": "community",
  "/discussions": "community",
  "/events": "community",
  "/education": "community",
  "/jobs": "jobs",
  "/career": "jobs",
  "/dentist-hub": "dentist-hub",
  "/admin": "clinic",
  "/clinic": "clinic",
  "/patients": "clinic",
  "/appointments": "clinic",
  "/treatments": "clinic",
  "/reservations": "clinic",
  "/admin/dashboard": "admin",
  "/super-admin": "admin",
  "/system": "admin",
  "/articles": "articles",
  "/medical-articles": "articles",
  "/research": "articles",
  "/profile": "profile",
  "/account": "profile",
  "/settings": "profile",
  "/favorites": "favorites",
  "/wishlist": "favorites",
  "/saved": "favorites",
  "/dentist-hub/notifications": "notifications",
  "/notifications": "notifications",
  "/alerts": "notifications",
  "/search": "search",
  "/find": "search",
};

// إنشاء السياق
const NavigationContext = createContext<NavigationContextType | undefined>(
  undefined,
);

// مزود السياق
export const NavigationProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const location = useLocation();
  const navigate = useNavigate();

  // الحالة الرئيسية
  const [state, setState] = useState<NavigationState>({
    currentSection: "home",
    previousSection: "home",
    navigationHistory: [],
    sectionContexts: {},
    breadcrumbs: [],
    isTransitioning: false,
    transitionDirection: "none",
  });

  // تحديد القسم من المسار
  const getSectionFromPath = useCallback((pathname: string): SectionType => {
    // البحث المباشر
    if (PATH_TO_SECTION_MAP[pathname]) {
      return PATH_TO_SECTION_MAP[pathname];
    }

    // البحث بالبادئة
    for (const path in PATH_TO_SECTION_MAP) {
      if (pathname.startsWith(path) && path !== "/") {
        return PATH_TO_SECTION_MAP[path];
      }
    }

    return "home"; // افتراضي
  }, []);

  // إنشاء مسار التنقل (breadcrumbs)
  const generateBreadcrumbs = useCallback(
    (pathname: string, section: SectionType) => {
      const breadcrumbs = [];
      const config = SECTION_CONFIGS[section];

      // الصفحة الرئيسية
      if (pathname !== "/") {
        breadcrumbs.push({
          label: "الرئيسية",
          path: "/",
          section: "home" as SectionType,
        });
      }

      // القسم الحالي
      if (section !== "home") {
        breadcrumbs.push({
          label: config.nameAr,
          path: config.defaultPath,
          section: section,
        });
      }

      // الصفحات الفرعية
      if (pathname !== config.defaultPath && pathname !== "/") {
        const pathSegments = pathname.split("/").filter(Boolean);
        let currentPath = "";

        pathSegments.forEach((segment, index) => {
          currentPath += `/${segment}`;
          if (currentPath !== config.defaultPath && index > 0) {
            breadcrumbs.push({
              label: segment.charAt(0).toUpperCase() + segment.slice(1),
              path: currentPath,
              section: section,
            });
          }
        });
      }

      return breadcrumbs;
    },
    [],
  );

  // تحديث الحالة عند تغيير المسار
  useEffect(() => {
    const newSection = getSectionFromPath(location.pathname);
    const breadcrumbs = generateBreadcrumbs(location.pathname, newSection);

    setState((prev) => {
      const isNewSection = newSection !== prev.currentSection;
      const newHistory = isNewSection
        ? [...prev.navigationHistory.slice(-9), newSection]
        : prev.navigationHistory;

      return {
        ...prev,
        previousSection: prev.currentSection,
        currentSection: newSection,
        navigationHistory: newHistory,
        breadcrumbs,
        isTransitioning: isNewSection,
        transitionDirection: isNewSection ? "forward" : "none",
      };
    });

    // إيقاف حالة الانتقال بعد 300ms
    if (newSection !== state.currentSection) {
      setTimeout(() => {
        setState((prev) => ({
          ...prev,
          isTransitioning: false,
          transitionDirection: "none",
        }));
      }, 300);
    }
  }, [
    location.pathname,
    getSectionFromPath,
    generateBreadcrumbs,
    state.currentSection,
  ]);

  // التنقل لقسم محدد
  const navigateToSection = useCallback(
    (section: SectionType, path?: string, options: NavigationOptions = {}) => {
      const config = SECTION_CONFIGS[section];
      const targetPath = path || config.defaultPath;

      // حفظ سياق القسم الحالي إذا مطلوب
      if (options.preserveContext) {
        updateSectionContext(state.currentSection, {
          lastVisitedPage: location.pathname,
          scrollPosition: window.scrollY,
          timestamp: Date.now(),
        });
      }

      // مسح التاريخ إذا مطلوب
      if (options.clearHistory) {
        setState((prev) => ({
          ...prev,
          navigationHistory: [section],
        }));
      }

      navigate(targetPath);
    },
    [state.currentSection, location.pathname, navigate],
  );

  // العودة للخلف
  const goBack = useCallback(() => {
    if (state.navigationHistory.length > 1) {
      const history = [...state.navigationHistory];
      history.pop(); // إزالة القسم الحالي
      const previousSection = history[history.length - 1];

      setState((prev) => ({
        ...prev,
        transitionDirection: "backward",
      }));

      navigateToSection(previousSection);
    } else {
      navigateToSection("home");
    }
  }, [state.navigationHistory, navigateToSection]);

  // التقدم للأمام (إذا كان متاحاً)
  const goForward = useCallback(() => {
    // يمكن تنفيذ هذا إذا احتج��ا للتنقل للأمام
    window.history.forward();
  }, []);

  // تحديث سياق القسم
  const updateSectionContext = useCallback(
    (section: SectionType, context: Partial<SectionContext>) => {
      setState((prev) => ({
        ...prev,
        sectionContexts: {
          ...prev.sectionContexts,
          [section]: {
            ...prev.sectionContexts[section],
            ...context,
            timestamp: Date.now(),
          },
        },
      }));
    },
    [],
  );

  // الحصول على سياق القسم
  const getSectionContext = useCallback(
    (section: SectionType): SectionContext => {
      return state.sectionContexts[section] || {};
    },
    [state.sectionContexts],
  );

  // التحقق من القدوم من قسم معين
  const isComingFromSection = useCallback(
    (section: SectionType): boolean => {
      return state.previousSection === section;
    },
    [state.previousSection],
  );

  // الحصول على تكوين القسم الحالي
  const getCurrentSectionConfig = useCallback(() => {
    return SECTION_CONFIGS[state.currentSection];
  }, [state.currentSection]);

  // الحصول على الأقسام المتاحة
  const getAvailableSections = useCallback((): SectionConfig[] => {
    // هنا يمكن إضافة منطق للصلاحيات
    return Object.values(SECTION_CONFIGS);
  }, []);

  // مسح سياق القسم
  const clearSectionContext = useCallback((section: SectionType) => {
    setState((prev) => {
      const newContexts = { ...prev.sectionContexts };
      delete newContexts[section];
      return {
        ...prev,
        sectionContexts: newContexts,
      };
    });
  }, []);

  // الحصول على مسار التنقل
  const getBreadcrumbs = useCallback(() => {
    return state.breadcrumbs;
  }, [state.breadcrumbs]);

  // التحقق من إمكانية العودة
  const canGoBack = useCallback(() => {
    return state.navigationHistory.length > 1;
  }, [state.navigationHistory]);

  // التحقق من إمكانية التقدم
  const canGoForward = useCallback(() => {
    return window.history.length > 1;
  }, []);

  const value: NavigationContextType = {
    state,
    navigateToSection,
    goBack,
    goForward,
    updateSectionContext,
    getSectionContext,
    isComingFromSection,
    getCurrentSectionConfig,
    getAvailableSections,
    clearSectionContext,
    getBreadcrumbs,
    canGoBack,
    canGoForward,
  };

  return (
    <NavigationContext.Provider value={value}>
      {children}
    </NavigationContext.Provider>
  );
};

// خطاف استخدام السياق
export const useNavigation = () => {
  const context = useContext(NavigationContext);
  if (context === undefined) {
    throw new Error("useNavigation must be used within a NavigationProvider");
  }
  return context;
};

// خطاف للحصول على القسم الحالي
export const useCurrentSection = () => {
  const { state } = useNavigation();
  return {
    section: state.currentSection,
    config: SECTION_CONFIGS[state.currentSection],
    isTransitioning: state.isTransitioning,
  };
};

// خطاف لسياق القسم
export const useSectionContext = (section?: SectionType) => {
  const { state, updateSectionContext, getSectionContext } = useNavigation();
  const targetSection = section || state.currentSection;

  return {
    context: getSectionContext(targetSection),
    updateContext: (newContext: Partial<SectionContext>) =>
      updateSectionContext(targetSection, newContext),
    section: targetSection,
  };
};

export default NavigationContext;
