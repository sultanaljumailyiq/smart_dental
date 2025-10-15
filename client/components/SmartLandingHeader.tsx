import React, { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { 
  Search, 
  Menu, 
  X, 
  Package,
  MessageCircle,
  Briefcase,
  Zap,
  Stethoscope
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/contexts/AuthContext";

interface SmartLandingHeaderProps {
  type: "dental" | "supplier";
}

export default function SmartLandingHeader({ type }: SmartLandingHeaderProps) {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();
  const [searchQuery, setSearchQuery] = useState("");
  const [showMobileMenu, setShowMobileMenu] = useState(false);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery)}`);
    }
  };

  // Configuration based on type
  const config = {
    dental: {
      roleText: "هل أنت مورد؟",
      roleLink: "/supplier",
      roleIcon: Package,
      loginText: "تسجيل الدخول",
      loginLink: "/dental/auth",
      gradientClasses: "from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700",
      roleGradient: "from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700",
    },
    supplier: {
      roleText: "هل أنت طبيب أسنان؟",
      roleLink: "/dental",
      roleIcon: Stethoscope,
      loginText: "تسجيل الدخول",
      loginLink: "/supplier/auth",
      gradientClasses: "from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700",
      roleGradient: "from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700",
    },
  };

  const currentConfig = config[type];
  const RoleIcon = currentConfig.roleIcon;

  // Navigation sections - same as unified header
  const NAVIGATION_SECTIONS = [
    {
      key: "marketplace",
      label: "المتجر",
      path: "/dental-supply",
      icon: Package,
      color: "purple",
      description: "المنتجات الطبية",
    },
    {
      key: "community",
      label: "المجتمع",
      path: "/community",
      icon: MessageCircle,
      color: "blue",
      description: "التواصل مع الأطباء",
    },
    {
      key: "jobs",
      label: "التوظيف",
      path: "/jobs",
      icon: Briefcase,
      color: "green",
      description: "الوظائف والفرص",
    },
    {
      key: "medical-services",
      label: "الخدمات الطبية",
      path: "/medical-services",
      icon: Zap,
      color: "emerald",
      description: "الخدمات والاستشارات",
    },
  ];

  // Check if section is active
  const isSectionActive = (path: string) => {
    return location.pathname.startsWith(path);
  };

  // Get active classes based on color
  const getActiveClasses = (color: string) => {
    const colorMap: Record<string, string> = {
      purple: "bg-purple-100 text-purple-700",
      blue: "bg-blue-100 text-blue-700",
      green: "bg-green-100 text-green-700",
      emerald: "bg-emerald-100 text-emerald-700",
      orange: "bg-orange-100 text-orange-700",
      red: "bg-red-100 text-red-700",
    };
    return colorMap[color] || "bg-gray-100 text-gray-700";
  };

  // Get indicator color based on section color
  const getIndicatorClass = (color: string) => {
    const indicatorMap: Record<string, string> = {
      purple: "bg-purple-600",
      blue: "bg-blue-600",
      green: "bg-green-600",
      emerald: "bg-emerald-600",
      orange: "bg-orange-600",
      red: "bg-red-600",
    };
    return indicatorMap[color] || "bg-gray-600";
  };

  // Determine dashboard route based on type and user role
  const getDashboardRoute = () => {
    if (!user) return type === "dental" ? "/dental/auth" : "/supplier/auth";
    if (type === "dental") return "/dentist-hub";
    return "/supplier/dashboard";
  };

  return (
    <>
      <header
        className={cn(
          "fixed !top-0 !left-0 !right-0 !z-[120] transition-all duration-300",
          "bg-white/95 backdrop-blur-md shadow-sm border-b border-gray-200/50"
        )}
        style={{ position: "fixed", top: 0, left: 0, right: 0, zIndex: 110 }}
      >
        <div className="px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Left Section - Logo & Navigation */}
            <div className="flex items-center gap-4">
              {/* Mobile menu button */}
              <button
                onClick={() => setShowMobileMenu(!showMobileMenu)}
                className="lg:hidden p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-xl transition-colors"
                aria-label="فتح القائمة"
              >
                <Menu className="w-6 h-6" />
              </button>

              {/* Logo/Brand */}
              <Link to="/" className="flex items-center gap-3">
                <div className="w-8 h-8 bg-gradient-to-r from-purple-600 to-blue-600 rounded-xl flex items-center justify-center shadow-lg">
                  <div className="w-4 h-4 bg-white rounded-sm"></div>
                </div>
                <div className="hidden sm:block">
                  <h1 className="text-lg font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
                    Smart
                  </h1>
                </div>
              </Link>

              {/* Desktop Navigation Icons */}
              <nav className="hidden lg:flex items-center gap-1">
                {NAVIGATION_SECTIONS.map((section) => {
                  const isActive = isSectionActive(section.path);

                  return (
                    <Link
                      key={section.key}
                      to={section.path}
                      className={cn(
                        "relative flex items-center gap-2 px-4 py-2 rounded-xl transition-all duration-200",
                        "text-sm font-medium group shadow-sm",
                        isActive
                          ? getActiveClasses(section.color)
                          : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
                      )}
                      title={section.description}
                    >
                      <section.icon className="w-4 h-4" />
                      <span className="hidden xl:inline">{section.label}</span>
                      {isActive && (
                        <div
                          className={cn(
                            "absolute bottom-0 left-1/2 transform -translate-x-1/2 w-1 h-1 rounded-full",
                            getIndicatorClass(section.color)
                          )}
                        />
                      )}
                    </Link>
                  );
                })}
              </nav>
            </div>

            {/* Center - Search Bar */}
            <div className="flex-1 max-w-md mx-4 hidden md:block">
              <form onSubmit={handleSearch} className="relative">
                <Search className="absolute right-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="ابحث..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pr-12 pl-4 py-2 bg-gray-50 border-0 rounded-xl focus:ring-2 focus:ring-purple-500 focus:bg-white transition-all text-right backdrop-blur-sm text-sm"
                />
                {searchQuery && (
                  <button
                    type="button"
                    onClick={() => setSearchQuery("")}
                    className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </form>
            </div>

            {/* Right Section - Role Switch & Login */}
            <div className="flex items-center gap-2">
              {/* Role Switch Button */}
              <Link to={currentConfig.roleLink}>
                <button className={cn(
                  "flex items-center gap-2 px-4 py-2 text-white rounded-xl font-medium transition-all shadow-sm hover:shadow-md bg-gradient-to-r",
                  currentConfig.roleGradient
                )}>
                  <RoleIcon className="w-4 h-4" />
                  <span className="hidden md:inline">{currentConfig.roleText}</span>
                  <span className="md:hidden">{type === "dental" ? "مورد؟" : "طبيب؟"}</span>
                </button>
              </Link>

              {/* Login/Profile Button */}
              {user ? (
                <Link
                  to={type === "dental" ? "/dentist-hub" : "/supplier/dashboard"}
                  className={cn(
                    "flex items-center gap-2 px-4 py-2 text-white rounded-xl font-medium transition-all shadow-sm hover:shadow-md bg-gradient-to-r",
                    currentConfig.gradientClasses
                  )}
                >
                  <span className="hidden sm:inline">لوحة التحكم</span>
                  <span className="sm:hidden">حسابي</span>
                </Link>
              ) : (
                <Link
                  to={currentConfig.loginLink}
                  className={cn(
                    "flex items-center gap-2 px-4 py-2 text-white rounded-xl font-medium transition-all shadow-sm hover:shadow-md bg-gradient-to-r",
                    currentConfig.gradientClasses
                  )}
                >
                  <span className="hidden sm:inline">{currentConfig.loginText}</span>
                  <span className="sm:hidden">دخول</span>
                </Link>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Menu Overlay */}
      {showMobileMenu && (
        <div
          className="fixed inset-0 z-[105] bg-black/50 backdrop-blur-sm lg:hidden"
          onClick={() => setShowMobileMenu(false)}
        >
          <div
            className="absolute right-0 top-16 bottom-0 w-64 bg-white shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-4">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-bold text-gray-900">القائمة</h2>
                <button
                  onClick={() => setShowMobileMenu(false)}
                  className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-xl"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Mobile Search */}
              <div className="mb-4 md:hidden">
                <form onSubmit={handleSearch} className="relative">
                  <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="text"
                    placeholder="ابحث..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pr-10 pl-3 py-2 bg-gray-50 border-0 rounded-xl focus:ring-2 focus:ring-purple-500 focus:bg-white transition-all text-right text-sm"
                  />
                </form>
              </div>

              <nav className="space-y-1">
                {NAVIGATION_SECTIONS.map((section) => {
                  const isActive = isSectionActive(section.path);

                  return (
                    <Link
                      key={section.key}
                      to={section.path}
                      onClick={() => setShowMobileMenu(false)}
                      className={cn(
                        "flex items-center gap-3 px-4 py-3 rounded-xl transition-colors",
                        isActive
                          ? getActiveClasses(section.color)
                          : "text-gray-600 hover:bg-gray-100"
                      )}
                    >
                      <section.icon className="w-5 h-5" />
                      <div>
                        <div className="font-medium">{section.label}</div>
                        <div className="text-xs opacity-75">
                          {section.description}
                        </div>
                      </div>
                    </Link>
                  );
                })}
              </nav>

              <div className="mt-4 pt-4 border-t border-gray-200 space-y-2">
                {/* Role Switch in Mobile */}
                <Link
                  to={currentConfig.roleLink}
                  onClick={() => setShowMobileMenu(false)}
                  className={cn(
                    "w-full flex items-center justify-center gap-2 px-4 py-3 text-white rounded-xl font-medium transition-all bg-gradient-to-r",
                    currentConfig.roleGradient
                  )}
                >
                  <RoleIcon className="w-5 h-5" />
                  {currentConfig.roleText}
                </Link>

                {/* Login/Profile in Mobile */}
                {user ? (
                  <Link
                    to={type === "dental" ? "/dentist-hub" : "/supplier/dashboard"}
                    onClick={() => setShowMobileMenu(false)}
                    className={cn(
                      "w-full flex items-center justify-center gap-2 px-4 py-3 text-white rounded-xl font-medium transition-all bg-gradient-to-r",
                      currentConfig.gradientClasses
                    )}
                  >
                    لوحة التحكم
                  </Link>
                ) : (
                  <Link
                    to={currentConfig.loginLink}
                    onClick={() => setShowMobileMenu(false)}
                    className={cn(
                      "w-full flex items-center justify-center gap-2 px-4 py-3 text-white rounded-xl font-medium transition-all bg-gradient-to-r",
                      currentConfig.gradientClasses
                    )}
                  >
                    {currentConfig.loginText}
                  </Link>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
