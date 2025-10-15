import React, { useState, useEffect, useRef } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  Search,
  Heart,
  Bell,
  User,
  Menu,
  Settings,
  Home,
  Stethoscope,
  Building2,
  ChevronDown,
  LogOut,
  UserCheck,
  Users,
  Calendar,
  MapPin,
  X,
  ListTodo,
  Clock,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useCart } from "@/contexts/CartContext";
import { useFavorites } from "@/contexts/FavoritesContext";
import { sharedClinicData } from "@/services/sharedClinicData";
import {
  UserRole,
  getUserPermissions,
  getRoleDisplayName,
  isPatient,
} from "@shared/permissions";

interface UnifiedNavigationHeaderProps {
  userRole?: UserRole;
  userName?: string;
  onMenuToggle?: () => void;
}

export default function UnifiedNavigationHeader({
  userRole = "patient",
  userName = "مستخدم",
  onMenuToggle,
}: UnifiedNavigationHeaderProps) {
  const [isSearchExpanded, setIsSearchExpanded] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [notifications, setNotifications] = useState([
    {
      id: 1,
      type: "appointment",
      message: "موعد جديد غداً الساعة 10:00 صباحاً",
      time: "منذ 5 دقائق",
    },
    { id: 2, type: "system", message: "تم تحديث نظام الحجز", time: "منذ ساعة" },
  ]);

  const location = useLocation();
  const navigate = useNavigate();
  const { state: cartState } = useCart();
  const { favorites } = useFavorites();

  const searchRef = useRef<HTMLDivElement>(null);
  const profileRef = useRef<HTMLDivElement>(null);
  const notificationsRef = useRef<HTMLDivElement>(null);

  const permissions = getUserPermissions(userRole);
  const currentUserIsPatient = isPatient(userRole);

  // إغلاق القوائم المنسدلة عند النقر خارجها
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        searchRef.current &&
        !searchRef.current.contains(event.target as Node)
      ) {
        setIsSearchExpanded(false);
      }
      if (
        profileRef.current &&
        !profileRef.current.contains(event.target as Node)
      ) {
        setIsProfileOpen(false);
      }
      if (
        notificationsRef.current &&
        !notificationsRef.current.contains(event.target as Node)
      ) {
        setIsNotificationsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // تحديد الأقسام المسموحة بناءً على الصلاحيات
  const getNavigationSections = () => {
    const sections = [];

    // الصفحة الرئيسية - متاحة للجميع
    if (permissions.canAccessHome) {
      sections.push({
        key: "home",
        path: "/",
        label: "الرئيسية",
        icon: Home,
        isActive: location.pathname === "/" || location.pathname === "/landing",
      });
    }

    // الخدمات الطبية - للمرضى وأصحاب العيادات
    if (permissions.canAccessMedicalServices) {
      sections.push({
        key: "medical-services",
        path: "/medical-services",
        label: "الخدمات الطبية",
        icon: Stethoscope,
        isActive:
          location.pathname.includes("/medical-services") ||
          location.pathname.includes("/clinic") ||
          location.pathname.includes("/booking"),
      });
    }

    // مركز الأطباء - للأطباء والطاقم فقط
    if (permissions.canAccessDentistHub) {
      sections.push({
        key: "dentist-hub",
        path: "/dentist-hub",
        label: "مركز الأطباء",
        icon: UserCheck,
        isActive:
          location.pathname.includes("/dentist-hub") ||
          location.pathname.includes("/admin"),
      });
    }

    return sections;
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
      setIsSearchExpanded(false);
      setSearchQuery("");
    }
  };

  const handleLogout = () => {
    // منطق تسجيل الخروج
    console.log("تسجيل الخروج");
    setIsProfileOpen(false);
  };

  const navigationSections = getNavigationSections();

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-md border-b border-gray-200/50 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* الشعار والتنقل */}
          <div className="flex items-center space-x-8 space-x-reverse">
            {/* زر القائمة للجوال */}
            <button
              onClick={onMenuToggle}
              className="lg:hidden p-2 rounded-xl text-gray-600 hover:text-gray-900 hover:bg-gray-100/50 transition-all"
            >
              <Menu className="w-6 h-6" />
            </button>

            {/* الشعار */}
            <Link
              to="/"
              className="flex items-center space-x-3 space-x-reverse"
            >
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center text-white shadow-lg">
                <Stethoscope className="w-6 h-6" />
              </div>
              <div className="hidden sm:block">
                <div className="text-lg font-bold text-gray-900">
                  منصة طب الأسنان
                </div>
                <div className="text-xs text-gray-500 leading-tight">
                  {currentUserIsPatient
                    ? "الخدمات الطبية المتكاملة"
                    : "إدارة العيادات والخدمات"}
                </div>
              </div>
            </Link>

            {/* أقسام التنقل - سطح المكتب */}
            <nav className="hidden lg:flex items-center space-x-1 space-x-reverse">
              {navigationSections.map((section) => (
                <Link
                  key={section.key}
                  to={section.path}
                  className={cn(
                    "relative px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 flex items-center space-x-2 space-x-reverse group",
                    section.isActive
                      ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg"
                      : "text-gray-600 hover:text-gray-900 hover:bg-gray-100/50",
                  )}
                >
                  <section.icon className="w-4 h-4" />
                  <span>{section.label}</span>
                  {section.isActive && (
                    <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-6 h-1 bg-white rounded-full" />
                  )}
                </Link>
              ))}
            </nav>
          </div>

          {/* الإجراءات */}
          <div className="flex items-center space-x-4 space-x-reverse">
            {/* البحث */}
            <div ref={searchRef} className="relative">
              <form onSubmit={handleSearch} className="flex items-center">
                <div
                  className={cn(
                    "relative transition-all duration-300 ease-in-out",
                    isSearchExpanded ? "w-64" : "w-10",
                  )}
                >
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="بحث..."
                    className={cn(
                      "w-full h-10 bg-gray-100/50 border border-gray-200/50 rounded-xl transition-all duration-300",
                      isSearchExpanded
                        ? "px-4 pr-10 opacity-100"
                        : "px-0 opacity-0 pointer-events-none",
                    )}
                    onFocus={() => setIsSearchExpanded(true)}
                  />
                  <button
                    type="button"
                    onClick={() => setIsSearchExpanded(!isSearchExpanded)}
                    className="absolute right-0 top-0 h-10 w-10 flex items-center justify-center text-gray-600 hover:text-gray-900 transition-colors rounded-xl hover:bg-gray-100/50"
                  >
                    <Search className="w-5 h-5" />
                  </button>
                </div>
              </form>
            </div>

            {/* المفضلة - للمرضى فقط عند حجز المواعيد */}
            {currentUserIsPatient && (
              <Link
                to="/dentist-hub/favorites"
                className="relative p-2 text-gray-600 hover:text-red-500 hover:bg-red-50/50 rounded-xl transition-all group"
              >
                <Heart className="w-6 h-6" />
                {favorites && favorites.length > 0 && (
                  <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center font-medium">
                    {favorites.length}
                  </span>
                )}
              </Link>
            )}

            {/* الإشعارات */}
            <div ref={notificationsRef} className="relative">
              <button
                onClick={() => setIsNotificationsOpen(!isNotificationsOpen)}
                className="relative p-2 text-gray-600 hover:text-blue-500 hover:bg-blue-50/50 rounded-xl transition-all"
              >
                <Bell className="w-6 h-6" />
                {notifications.length > 0 && (
                  <span className="absolute -top-1 -right-1 w-3 h-3 bg-blue-500 rounded-full"></span>
                )}
              </button>

              {/* قائمة الإشعارات */}
              {isNotificationsOpen && (
                <div className="absolute top-12 right-0 w-80 bg-white rounded-2xl shadow-xl border border-gray-200/50 overflow-hidden z-50">
                  <div className="p-4 border-b border-gray-100">
                    <h3 className="font-semibold text-gray-900">الإشعارات</h3>
                  </div>
                  <div className="max-h-64 overflow-y-auto">
                    {notifications.length > 0 ? (
                      notifications.map((notification) => (
                        <div
                          key={notification.id}
                          className="p-4 hover:bg-gray-50 border-b border-gray-100 last:border-b-0"
                        >
                          <div className="flex items-start space-x-3 space-x-reverse">
                            <div
                              className={cn(
                                "w-8 h-8 rounded-full flex items-center justify-center",
                                notification.type === "appointment"
                                  ? "bg-blue-100 text-blue-600"
                                  : "bg-gray-100 text-gray-600",
                              )}
                            >
                              {notification.type === "appointment" ? (
                                <Calendar className="w-4 h-4" />
                              ) : (
                                <Bell className="w-4 h-4" />
                              )}
                            </div>
                            <div className="flex-1">
                              <p className="text-sm text-gray-900">
                                {notification.message}
                              </p>
                              <p className="text-xs text-gray-500 mt-1">
                                {notification.time}
                              </p>
                            </div>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="p-4 text-center text-gray-500">
                        لا توجد إشعارات جديدة
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* قائمة الملف الشخصي */}
            <div ref={profileRef} className="relative">
              <button
                onClick={() => setIsProfileOpen(!isProfileOpen)}
                className="flex items-center space-x-3 space-x-reverse p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100/50 rounded-xl transition-all group"
              >
                <div className="w-8 h-8 bg-gradient-to-br from-gray-400 to-gray-600 rounded-lg flex items-center justify-center text-white">
                  <User className="w-4 h-4" />
                </div>
                <div className="hidden md:block text-right">
                  <div className="text-sm font-medium">{userName}</div>
                  <div className="text-xs text-gray-500">
                    {getRoleDisplayName(userRole)}
                  </div>
                </div>
                <ChevronDown className="w-4 h-4 group-hover:rotate-180 transition-transform" />
              </button>

              {/* قائمة الملف الشخصي المنسدلة */}
              {isProfileOpen && (
                <div className="absolute top-12 right-0 w-72 bg-white rounded-2xl shadow-xl border border-gray-200/50 overflow-hidden z-50">
                  <div className="p-4 border-b border-gray-100">
                    <div className="flex items-center space-x-3 space-x-reverse mb-4">
                      <div className="w-12 h-12 bg-gradient-to-br from-gray-400 to-gray-600 rounded-xl flex items-center justify-center text-white">
                        <User className="w-6 h-6" />
                      </div>
                      <div>
                        <div className="font-semibold text-gray-900">
                          {userName}
                        </div>
                        <div className="text-sm text-gray-500">
                          {getRoleDisplayName(userRole)}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="p-4">
                    {/* نظرة عامة */}
                    <Link
                      to="/dashboard"
                      className="flex items-center space-x-2 space-x-reverse px-3 py-2 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-100/50 rounded-lg transition-all mb-2"
                      onClick={() => setIsProfileOpen(false)}
                    >
                      <Home className="w-4 h-4" />
                      <span>نظرة عامة</span>
                    </Link>

                    {/* الملف الشخصي */}
                    <Link
                      to="/profile"
                      className="flex items-center space-x-2 space-x-reverse px-3 py-2 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-100/50 rounded-lg transition-all mb-2"
                      onClick={() => setIsProfileOpen(false)}
                    >
                      <User className="w-4 h-4" />
                      <span>الملف الشخصي</span>
                    </Link>

                    {/* مشترياتي - للمرضى فقط */}
                    {currentUserIsPatient && (
                      <Link
                        to="/my-bookings"
                        className="flex items-center space-x-2 space-x-reverse px-3 py-2 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-100/50 rounded-lg transition-all mb-2"
                        onClick={() => setIsProfileOpen(false)}
                      >
                        <Calendar className="w-4 h-4" />
                        <span>مواعيدي</span>
                      </Link>
                    )}

                    {/* الإعدادات */}
                    <Link
                      to="/settings"
                      className="flex items-center space-x-2 space-x-reverse px-3 py-2 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-100/50 rounded-lg transition-all mb-4"
                      onClick={() => setIsProfileOpen(false)}
                    >
                      <Settings className="w-4 h-4" />
                      <span>الإعدادات</span>
                    </Link>

                    {/* خط فاصل */}
                    <hr className="my-3" />

                    {/* تسجيل الخروج */}
                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center space-x-2 space-x-reverse px-3 py-2 text-sm text-red-600 hover:text-red-700 hover:bg-red-50/50 rounded-lg transition-all"
                    >
                      <LogOut className="w-4 h-4" />
                      <span>تسجيل الخروج</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
