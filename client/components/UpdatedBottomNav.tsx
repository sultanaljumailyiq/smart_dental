import React, { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  Home,
  Search,
  Heart,
  Bell,
  User,
  ShoppingCart,
  MessageCircle,
  BookOpen,
  Briefcase,
  Store,
  UserCheck,
  Stethoscope,
  Calendar,
  Settings,
  X,
  ChevronUp,
  Package,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useSystemSettings } from "@/contexts/SystemSettingsContext";
import { useFavorites } from "@/contexts/FavoritesContext";
import { useCart } from "@/contexts/CartContext";

type SectionType =
  | "home"
  | "marketplace"
  | "medical-services"
  | "dentist-hub"
  | "community"
  | "jobs"
  | "education"
  | "profile"
  | "clinic-admin"
  | "search"
  | "favorites"
  | "notifications"
  | "cart";

interface NavItem {
  id: string;
  label: string;
  icon: React.ComponentType<any>;
  path?: string;
  action?: () => void;
  color: string;
  gradient: string;
  badge?: number;
  isCenter?: boolean;
}

interface UpdatedBottomNavProps {
  currentSection?: SectionType;
  onSectionChange?: (section: SectionType) => void;
  userRole?:
    | "patient"
    | "clinic_staff"
    | "clinic_employee"
    | "supplier"
    | "clinic_owner"
    | "app_owner";
}

export default function UpdatedBottomNav({
  currentSection = "home",
  onSectionChange,
  userRole = "patient",
}: UpdatedBottomNavProps) {
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const location = useLocation();
  const navigate = useNavigate();
  const { settings } = useSystemSettings();
  const { favorites } = useFavorites();
  const { state: cartState } = useCart();
  const cart = cartState?.items || [];

  // تحديد القسم الحالي بناءً على المسار
  const getCurrentSection = (): SectionType => {
    const path = location.pathname;
    if (path === "/" || path === "/landing") return "home";
    if (path.includes("/medical-services")) return "medical-services";
    if (path.includes("/dentist-hub")) return "dentist-hub";
    if (path.includes("/community")) return "community";
    if (path.includes("/jobs")) return "jobs";
    if (path.includes("/dental-supply") || path.includes("/marketplace"))
      return "marketplace";
    if (path.includes("/search")) return "search";
    if (path.includes("/favorites")) return "favorites";
    if (path.includes("/cart")) return "cart";
    if (
      path.includes("/dentist-hub/notifications") ||
      path.includes("/notifications")
    )
      return "notifications";
    if (path.includes("/profile")) return "profile";
    return "home";
  };

  const activeSection = getCurrentSection();

  // تحديد العناصر بناءً ع��ى دور المستخدم
  const getNavItems = (): NavItem[] => {
    const baseItems: NavItem[] = [
      {
        id: "home",
        label: "الرئيسية",
        icon: Home,
        path: "/",
        color: "blue",
        gradient: "from-blue-500 to-blue-600",
      },
      {
        id: "medical-services",
        label: "الخدمات",
        icon: Stethoscope,
        path: "/medical-services",
        color: "emerald",
        gradient: "from-emerald-500 to-emerald-600",
      },
    ];

    // مركز الأطباء - العنصر المركزي
    if (userRole !== "patient") {
      baseItems.push({
        id: "dentist-hub",
        label: "مركز الأطباء",
        icon: UserCheck,
        path: "/dentist-hub",
        color: "purple",
        gradient: "from-purple-500 to-purple-600",
        isCenter: true,
      });
    }

    // العناصر الجانبية
    const sideItems: NavItem[] = [];

    if (userRole !== "patient") {
      sideItems.push({
        id: "community",
        label: "المجتمع",
        icon: MessageCircle,
        path: "/community",
        color: "pink",
        gradient: "from-pink-500 to-pink-600",
      });
    }

    sideItems.push({
      id: "favorites",
      label: "المفضلة",
      icon: Heart,
      path: "/favorites",
      color: "red",
      gradient: "from-red-500 to-red-600",
      badge: favorites?.length || 0,
    });

    // ترتيب العناصر: عنصرين على اليسار + مركزي + عنصرين على اليمين
    if (userRole === "patient") {
      return [
        baseItems[0], // الرئيسية
        baseItems[1], // الخدمات الطبية
        {
          id: "search",
          label: "البحث",
          icon: Search,
          path: "/search",
          color: "indigo",
          gradient: "from-indigo-500 to-indigo-600",
          isCenter: true,
        },
        sideItems[0], // ال��فضلة
        {
          id: "profile",
          label: "الملف الشخصي",
          icon: User,
          action: () => setIsProfileOpen(true),
          color: "gray",
          gradient: "from-gray-500 to-gray-600",
        },
      ];
    }

    return [
      baseItems[0], // الرئيسية
      baseItems[1], // الخدمات الطبية
      baseItems[2], // مركز الأطباء (مركزي)
      sideItems[0], // المجتمع
      {
        id: "profile",
        label: "الملف الشخصي",
        icon: User,
        action: () => setIsProfileOpen(true),
        color: "gray",
        gradient: "from-gray-500 to-gray-600",
      },
    ];
  };

  const navItems = getNavItems();

  const handleNavClick = (item: NavItem) => {
    if (item.action) {
      item.action();
    } else if (item.path) {
      navigate(item.path);
    }

    if (onSectionChange) {
      onSectionChange(item.id as SectionType);
    }
  };

  // إغلاق القوائم عند النقر خارجها
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Element;
      if (
        !target.closest(".profile-menu") &&
        !target.closest(".profile-button")
      ) {
        setIsProfileOpen(false);
      }
    };

    if (isProfileOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      return () =>
        document.removeEventListener("mousedown", handleClickOutside);
    }
  }, [isProfileOpen]);

  return (
    <>
      {/* الشريط السفلي */}
      <div
        className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-gray-200/50 shadow-lg"
        dir="rtl"
      >
        <div className="max-w-md mx-auto px-4 py-2">
          <div className="flex items-center justify-between">
            {navItems.map((item, index) => {
              const isActive = activeSection === item.id;
              const isCenter = item.isCenter;

              return (
                <button
                  key={item.id}
                  onClick={() => handleNavClick(item)}
                  className={cn(
                    "relative flex flex-col items-center justify-center transition-all duration-300 group",
                    isCenter
                      ? "w-16 h-16 -mt-6 rounded-full shadow-lg"
                      : "w-12 h-12 rounded-xl",
                    isActive && !isCenter && "transform -translate-y-1",
                    isCenter && `bg-gradient-to-r ${item.gradient}`,
                    !isCenter &&
                      isActive &&
                      `bg-gradient-to-r ${item.gradient}`,
                    !isCenter && !isActive && "hover:bg-gray-100",
                  )}
                >
                  {/* أيقونة */}
                  <item.icon
                    className={cn(
                      "transition-all duration-300",
                      isCenter ? "w-8 h-8" : "w-6 h-6",
                      isActive || isCenter
                        ? "text-white"
                        : "text-gray-600 group-hover:text-gray-900",
                    )}
                  />

                  {/* التسمية */}
                  {!isCenter && (
                    <span
                      className={cn(
                        "text-xs mt-1 transition-all duration-300 font-medium",
                        isActive
                          ? "text-white"
                          : "text-gray-600 group-hover:text-gray-900",
                      )}
                    >
                      {item.label}
                    </span>
                  )}

                  {/* شارة العدد */}
                  {item.badge && item.badge > 0 && (
                    <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center font-medium">
                      {item.badge > 99 ? "99+" : item.badge}
                    </span>
                  )}

                  {/* مؤشر النشاط */}
                  {isActive && !isCenter && (
                    <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-6 h-1 bg-white rounded-full" />
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* قائم�� الملف الشخصي المنبثقة */}
      {isProfileOpen && (
        <div
          className="fixed inset-0 z-50 flex items-end justify-center bg-black/50"
          dir="rtl"
        >
          <div className="profile-menu w-full max-w-md bg-white rounded-t-3xl shadow-xl transform transition-all duration-300 ease-out">
            {/* المقبض */}
            <div className="flex justify-center pt-4 pb-2">
              <div className="w-12 h-1 bg-gray-300 rounded-full" />
            </div>

            {/* الرأس */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
              <h3 className="text-lg font-semibold text-gray-900">
                الملف الشخصي
              </h3>
              <button
                onClick={() => setIsProfileOpen(false)}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              >
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>

            {/* المحتوى */}
            <div className="px-6 py-4 space-y-4">
              {/* معلومات المستخدم */}
              <div className="flex items-center space-x-4 space-x-reverse p-4 bg-gray-50 rounded-xl">
                <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                  <User className="w-6 h-6 text-white" />
                </div>
                <div>
                  <div className="font-semibold text-gray-900">المستخدم</div>
                  <div className="text-sm text-gray-500">
                    {userRole === "app_owner"
                      ? "مالك التطبيق"
                      : userRole === "clinic_owner"
                        ? "مالك العيادة"
                        : userRole === "clinic_staff"
                          ? "موظف العيادة"
                          : userRole === "clinic_employee"
                            ? "عامل العيادة"
                            : userRole === "supplier"
                              ? "مورد"
                              : "مريض"}
                  </div>
                </div>
              </div>

              {/* خيارات سريعة */}
              <div className="space-y-2">
                <Link
                  to="/profile"
                  onClick={() => setIsProfileOpen(false)}
                  className="flex items-center space-x-3 space-x-reverse p-3 hover:bg-gray-50 rounded-xl transition-colors"
                >
                  <User className="w-5 h-5 text-gray-600" />
                  <span className="text-gray-900">عرض الملف الشخصي</span>
                </Link>

                <Link
                  to="/settings"
                  onClick={() => setIsProfileOpen(false)}
                  className="flex items-center space-x-3 space-x-reverse p-3 hover:bg-gray-50 rounded-xl transition-colors"
                >
                  <Settings className="w-5 h-5 text-gray-600" />
                  <span className="text-gray-900">الإعدادات</span>
                </Link>

                <Link
                  to="/dentist-hub/notifications"
                  onClick={() => setIsProfileOpen(false)}
                  className="flex items-center space-x-3 space-x-reverse p-3 hover:bg-gray-50 rounded-xl transition-colors"
                >
                  <Bell className="w-5 h-5 text-gray-600" />
                  <span className="text-gray-900">��لإشعارات</span>
                </Link>

                {userRole !== "patient" && (
                  <Link
                    to="/dental-supply"
                    onClick={() => setIsProfileOpen(false)}
                    className="flex items-center space-x-3 space-x-reverse p-3 hover:bg-gray-50 rounded-xl transition-colors"
                  >
                    <Package className="w-5 h-5 text-gray-600" />
                    <span className="text-gray-900">المتجر</span>
                  </Link>
                )}

                <Link
                  to="/cart"
                  onClick={() => setIsProfileOpen(false)}
                  className="flex items-center space-x-3 space-x-reverse p-3 hover:bg-gray-50 rounded-xl transition-colors"
                >
                  <ShoppingCart className="w-5 h-5 text-gray-600" />
                  <div className="flex items-center justify-between flex-1">
                    <span className="text-gray-900">العربة</span>
                    {cart.length > 0 && (
                      <span className="bg-emerald-100 text-emerald-700 text-xs px-2 py-1 rounded-full">
                        {cart.length}
                      </span>
                    )}
                  </div>
                </Link>
              </div>

              {/* تسجيل الخروج */}
              <div className="pt-4 border-t border-gray-100">
                <button className="w-full p-3 text-red-600 hover:bg-red-50 rounded-xl transition-colors text-center">
                  تسجيل خروج
                </button>
              </div>
            </div>

            {/* مساحة للشريط السفلي */}
            <div className="pb-20" />
          </div>
        </div>
      )}
    </>
  );
}
