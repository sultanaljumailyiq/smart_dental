import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  Home,
  Bell,
  Heart,
  User,
  UserCheck,
  Stethoscope,
  Calendar,
  Settings,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useFavorites } from "@/contexts/FavoritesContext";
import { UserRole, getUserPermissions, isPatient } from "@shared/permissions";

interface FixedBottomNavigationProps {
  userRole?: UserRole;
  notificationCount?: number;
}

export default function FixedBottomNavigation({
  userRole = "patient",
  notificationCount = 0,
}: FixedBottomNavigationProps) {
  const location = useLocation();
  const { favorites } = useFavorites();
  const [activeTab, setActiveTab] = useState("");

  const permissions = getUserPermissions(userRole);
  const currentUserIsPatient = isPatient(userRole);

  // تحديد التبويب النشط بناءً على المسار الحالي
  useEffect(() => {
    const path = location.pathname;

    if (path === "/" || path === "/landing") {
      setActiveTab("home");
    } else if (path.includes("/dentist-hub") || path.includes("/admin")) {
      setActiveTab("dentist-hub");
    } else if (
      path.includes("/dentist-hub/notifications") ||
      path.includes("/notifications")
    ) {
      setActiveTab("notifications");
    } else if (path.includes("/favorites")) {
      setActiveTab("favorites");
    } else if (
      path.includes("/profile") ||
      path.includes("/dashboard") ||
      path.includes("/settings")
    ) {
      setActiveTab("profile");
    } else {
      setActiveTab("");
    }
  }, [location.pathname]);

  // تحديد الأيقونات الثابتة حسب المتطلبات
  const getNavigationItems = () => {
    const items = [];

    // الرئيسية - دائماً موجودة
    items.push({
      key: "home",
      path: "/",
      label: "الرئيسية",
      icon: Home,
      isActive: activeTab === "home",
      color: "blue",
    });

    // مركز الأطباء (في النصف) - للأطباء والطاقم فقط
    if (permissions.canAccessDentistHub) {
      items.push({
        key: "dentist-hub",
        path: "/dentist-hub",
        label: "مركز الأطباء",
        icon: UserCheck,
        isActive: activeTab === "dentist-hub",
        color: "indigo",
        isCenter: true, // عنصر مركزي
      });
    }

    // الإشعارات - دائماً موجودة
    items.push({
      key: "notifications",
      path: "/dentist-hub/notifications",
      label: "الإشعارات",
      icon: Bell,
      isActive: activeTab === "notifications",
      color: "orange",
      hasNotification: notificationCount > 0,
      notificationCount: notificationCount,
    });

    // المفضلة - للمرضى عند حجز المواعيد
    if (currentUserIsPatient) {
      items.push({
        key: "favorites",
        path: "/favorites",
        label: "المفضلة",
        icon: Heart,
        isActive: activeTab === "favorites",
        color: "red",
        hasNotification: favorites && favorites.length > 0,
        notificationCount: favorites ? favorites.length : 0,
      });
    }

    // الملف الشخصي - دائماً موجود
    items.push({
      key: "profile",
      path: "/profile",
      label: "الملف الشخصي",
      icon: User,
      isActive: activeTab === "profile",
      color: "gray",
    });

    return items;
  };

  const navigationItems = getNavigationItems();

  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 bg-white border-t border-gray-200 shadow-lg">
      <div className="safe-area-bottom">
        <div className="max-w-md mx-auto">
          <div className="flex items-center justify-around px-2 py-3">
            {navigationItems.map((item) => (
              <Link
                key={item.key}
                to={item.path}
                className={cn(
                  "relative flex flex-col items-center transition-all duration-300 transform",
                  "hover:scale-105 active:scale-95 px-3 py-2",
                  item.isCenter && "scale-110 -translate-y-1",
                )}
              >
                {/* خلفية مميزة للعنصر المركزي */}
                {item.isCenter && (
                  <div className="absolute inset-0 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl opacity-10" />
                )}

                {/* حاوية الأيقونة */}
                <div
                  className={cn(
                    "relative transition-all duration-300 rounded-xl flex items-center justify-center",
                    item.isCenter
                      ? "w-12 h-12 bg-gradient-to-br from-indigo-500 to-purple-600"
                      : item.isActive
                        ? `w-10 h-10 bg-${item.color}-100`
                        : "w-10 h-10 hover:bg-gray-100",
                  )}
                >
                  {/* الأيقونة */}
                  <item.icon
                    className={cn(
                      "transition-all duration-300",
                      item.isCenter
                        ? "w-6 h-6 text-white"
                        : item.isActive
                          ? `w-5 h-5 text-${item.color}-600`
                          : "w-5 h-5 text-gray-600",
                    )}
                  />

                  {/* مؤشر الإشعارات */}
                  {item.hasNotification && (
                    <div className="absolute -top-1 -right-1 min-w-[18px] h-[18px] bg-red-500 rounded-full flex items-center justify-center px-1">
                      <span className="text-xs text-white font-bold">
                        {item.notificationCount && item.notificationCount > 99
                          ? "99+"
                          : item.notificationCount || "•"}
                      </span>
                    </div>
                  )}

                  {/* مؤثر التوهج للعنصر ��لمركزي */}
                  {item.isCenter && (
                    <div className="absolute inset-0 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl blur opacity-20 animate-pulse" />
                  )}
                </div>

                {/* نص التسمية */}
                <span
                  className={cn(
                    "text-xs font-medium mt-1 transition-colors duration-300 text-center max-w-[60px] truncate",
                    item.isCenter
                      ? "text-indigo-600 font-semibold"
                      : item.isActive
                        ? `text-${item.color}-600 font-semibold`
                        : "text-gray-600",
                  )}
                >
                  {item.label}
                </span>

                {/* مؤشر النشاط */}
                {item.isActive && !item.isCenter && (
                  <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full animate-pulse" />
                )}
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* مؤشر أمان للمنطقة السفلية للهواتف الحديثة */}
      <style>{`
        .safe-area-bottom {
          padding-bottom: env(safe-area-inset-bottom, 0px);
        }
      `}</style>
    </div>
  );
}

// مكون منفصل للدمج مع القائمة الجانبية للملف الشخصي
export function ProfileSidebar({
  isOpen,
  onClose,
  userRole = "patient",
  userName = "مستخدم",
}: {
  isOpen: boolean;
  onClose: () => void;
  userRole?: UserRole;
  userName?: string;
}) {
  const currentUserIsPatient = isPatient(userRole);

  const profileMenuItems = [
    {
      key: "overview",
      path: "/dashboard",
      label: "نظرة عامة",
      icon: Home,
      description: "ملخص النشاط والإحصائيات",
    },
    {
      key: "profile",
      path: "/profile",
      label: "الملف الشخصي",
      icon: User,
      description: "البيانات الشخصية والإعدادات",
    },
    ...(currentUserIsPatient
      ? [
          {
            key: "bookings",
            path: "/my-bookings",
            label: "مواعيدي",
            icon: Calendar,
            description: "مواعيدك وحجوزاتك",
          },
        ]
      : []),
    {
      key: "settings",
      path: "/settings",
      label: "الإعدادات",
      icon: Settings,
      description: "إعدادات التطبيق والخصوصية",
    },
  ];

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="absolute right-0 top-0 h-full w-80 bg-white shadow-2xl transform transition-transform duration-300"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center space-x-4 space-x-reverse">
            <div className="w-16 h-16 bg-gradient-to-br from-gray-400 to-gray-600 rounded-2xl flex items-center justify-center text-white">
              <User className="w-8 h-8" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">
                {userName}
              </h3>
              <p className="text-sm text-gray-500">
                مرحباً بك في منصة طب الأسنان
              </p>
            </div>
          </div>
        </div>

        <div className="p-4">
          <nav className="space-y-2">
            {profileMenuItems.map((item) => (
              <Link
                key={item.key}
                to={item.path}
                onClick={onClose}
                className="flex items-center space-x-4 space-x-reverse p-3 rounded-xl hover:bg-gray-50 transition-colors group"
              >
                <div className="w-10 h-10 bg-gray-100 rounded-xl flex items-center justify-center group-hover:bg-blue-100 transition-colors">
                  <item.icon className="w-5 h-5 text-gray-600 group-hover:text-blue-600" />
                </div>
                <div>
                  <div className="text-sm font-medium text-gray-900">
                    {item.label}
                  </div>
                  <div className="text-xs text-gray-500">
                    {item.description}
                  </div>
                </div>
              </Link>
            ))}
          </nav>

          <div className="mt-8 pt-4 border-t border-gray-200">
            <button
              onClick={onClose}
              className="w-full flex items-center justify-center space-x-2 space-x-reverse p-3 text-red-600 hover:bg-red-50 rounded-xl transition-colors"
            >
              <span className="text-sm font-medium">تسجيل الخروج</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
