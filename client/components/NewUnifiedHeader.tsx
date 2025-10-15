import React, { useState } from "react";
import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";
import { UserRole } from "@shared/permissions";
import { UnifiedNavigation } from "./UnifiedNavigation";
import {
  NavigationSearch,
  NavigationNotifications,
  NavigationUserMenu,
} from "./NavigationExtensions";
import { Search, Bell, ShoppingCart, Menu, X, Stethoscope } from "lucide-react";

interface NewUnifiedHeaderProps {
  variant?: "full" | "minimal" | "mobile";
  userRole?: UserRole | null;
  user?: {
    name: string;
    email: string;
    avatar: string;
    role: string;
    stats: Record<string, any>;
  };
  className?: string;
  onMenuToggle?: () => void;
}

export const NewUnifiedHeader: React.FC<NewUnifiedHeaderProps> = ({
  variant = "full",
  userRole = null,
  user,
  className,
  onMenuToggle,
}) => {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // إغلاق جميع القوائم
  const closeAllMenus = () => {
    setIsSearchOpen(false);
    setIsNotificationsOpen(false);
    setIsUserMenuOpen(false);
  };

  // شعار التطبيق
  const Logo = () => (
    <Link to="/" className="flex items-center gap-2">
      <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center">
        <Stethoscope className="w-6 h-6 text-white" />
      </div>
      {variant !== "mobile" && (
        <div className="hidden md:block">
          <h1 className="text-xl font-bold text-gray-900">DentalHub</h1>
          <p className="text-xs text-gray-600">منصة طب الأسنان</p>
        </div>
      )}
    </Link>
  );

  // أزرار الأدوات السريعة
  const QuickActions = () => (
    <div className="flex items-center gap-2">
      {/* البحث */}
      <button
        onClick={() => {
          closeAllMenus();
          setIsSearchOpen(true);
        }}
        className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
        title="البحث (Ctrl+K)"
      >
        <Search className="w-5 h-5" />
      </button>

      {/* الإشعارات */}
      {user && (
        <div className="relative">
          <button
            onClick={() => {
              closeAllMenus();
              setIsNotificationsOpen(!isNotificationsOpen);
            }}
            className="relative p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
            title="الإشعارات"
          >
            <Bell className="w-5 h-5" />
            {user.stats?.unreadNotifications > 0 && (
              <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                {user.stats.unreadNotifications}
              </span>
            )}
          </button>

          <NavigationNotifications
            isOpen={isNotificationsOpen}
            onClose={() => setIsNotificationsOpen(false)}
          />
        </div>
      )}

      {/* السلة */}
      {userRole &&
        ["dentist", "clinic_owner", "clinic_staff"].includes(userRole) && (
          <Link
            to="/cart"
            className="relative p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
            title="سلة التسوق"
          >
            <ShoppingCart className="w-5 h-5" />
            {user?.stats?.cartItems > 0 && (
              <span className="absolute -top-1 -right-1 w-5 h-5 bg-blue-500 text-white text-xs rounded-full flex items-center justify-center">
                {user.stats.cartItems}
              </span>
            )}
          </Link>
        )}

      {/* قائمة المستخدم */}
      {user ? (
        <div className="relative">
          <button
            onClick={() => {
              closeAllMenus();
              setIsUserMenuOpen(!isUserMenuOpen);
            }}
            className="flex items-center gap-2 p-1 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <img
              src={user.avatar}
              alt={user.name}
              className="w-8 h-8 rounded-lg object-cover ring-2 ring-blue-500/20"
            />
            {variant === "full" && (
              <div className="hidden md:block text-right">
                <p className="text-sm font-medium text-gray-900">{user.name}</p>
                <p className="text-xs text-gray-600">{user.role}</p>
              </div>
            )}
          </button>

          <NavigationUserMenu
            isOpen={isUserMenuOpen}
            onClose={() => setIsUserMenuOpen(false)}
            user={user}
          />
        </div>
      ) : (
        <div className="flex items-center gap-2">
          <Link
            to="/login"
            className="px-4 py-2 text-sm text-gray-700 hover:text-gray-900 transition-colors"
          >
            تسجيل الدخول
          </Link>
          <Link
            to="/signup"
            className="px-4 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            إنشاء حساب
          </Link>
        </div>
      )}

      {/* زر القائمة للجوال */}
      <button
        onClick={() => {
          setIsMobileMenuOpen(!isMobileMenuOpen);
          onMenuToggle?.();
        }}
        className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors md:hidden"
      >
        {isMobileMenuOpen ? (
          <X className="w-5 h-5" />
        ) : (
          <Menu className="w-5 h-5" />
        )}
      </button>
    </div>
  );

  // أسماكن الأدوات السريعة للجوال
  const MobileQuickActions = () => (
    <div className="flex items-center gap-1">
      <button
        onClick={() => setIsSearchOpen(true)}
        className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
      >
        <Search className="w-5 h-5" />
      </button>

      {user && (
        <button
          onClick={() => setIsNotificationsOpen(!isNotificationsOpen)}
          className="relative p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <Bell className="w-5 h-5" />
          {user.stats?.unreadNotifications > 0 && (
            <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
              {user.stats.unreadNotifications}
            </span>
          )}
        </button>
      )}

      <button
        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
      >
        <Menu className="w-5 h-5" />
      </button>
    </div>
  );

  return (
    <>
      {/* الهيدر الرئيسي */}
      <header
        className={cn(
          "sticky top-0 z-40 bg-white/95 backdrop-blur-lg border-b border-gray-200/50",
          className,
        )}
      >
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            {/* اللوجو */}
            <Logo />

            {/* التنقل الرئيسي (للشاشات الكبيرة) */}
            {variant !== "mobile" && (
              <div className="hidden md:block flex-1 max-w-2xl mx-8">
                <UnifiedNavigation
                  variant="header"
                  style={variant}
                  userRole={userRole}
                  userStats={user?.stats}
                />
              </div>
            )}

            {/* الأدوات السريعة */}
            {variant === "mobile" ? <MobileQuickActions /> : <QuickActions />}
          </div>
        </div>

        {/* القائمة المحمولة */}
        {isMobileMenuOpen && (
          <div className="md:hidden border-t border-gray-200 bg-white">
            <div className="container mx-auto px-4 py-4">
              <UnifiedNavigation
                variant="sidebar"
                style="compact"
                userRole={userRole}
                userStats={user?.stats}
                className="border-none"
              />
            </div>
          </div>
        )}
      </header>

      {/* مكونات الأدوات السريعة */}
      <NavigationSearch
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
      />

      {/* خلفية مظلمة للقوائم المفتوحة */}
      {(isNotificationsOpen || isUserMenuOpen) && (
        <div
          className="fixed inset-0 z-30 bg-black/20"
          onClick={closeAllMenus}
        />
      )}
    </>
  );
};

export default NewUnifiedHeader;
