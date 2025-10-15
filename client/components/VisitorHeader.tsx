import React, { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { Search, Menu, X, Stethoscope, Zap } from "lucide-react";
import { cn } from "@/lib/utils";

export function VisitorHeader() {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchQuery, setSearchQuery] = useState("");
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  
  // Debug log
  React.useEffect(() => {
    console.log("VisitorHeader rendered on:", location.pathname);
  }, [location.pathname]);

  // Navigation section - فقط الخدمات الطبية للزوار
  const VISITOR_SECTIONS = [
    {
      key: "medical-services",
      label: "الخدمات الطبية",
      path: "/medical-services",
      icon: Stethoscope,
      color: "emerald",
      description: "الخدمات والاستشارات",
    },
  ];

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery)}`);
    }
  };

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

  return (
    <>
      <header
        className={cn(
          "fixed !top-0 !left-0 !right-0 !z-[120] transition-all duration-300",
          "bg-white/95 backdrop-blur-md shadow-sm border-b border-gray-200/50"
        )}
        style={{ position: "fixed", top: 0, left: 0, right: 0, zIndex: 120 }}
      >
        <div className="px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Left Section */}
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

              {/* Desktop Navigation */}
              <nav className="hidden lg:flex items-center gap-1">
                {VISITOR_SECTIONS.map((section) => {
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
                      <span>{section.label}</span>
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
            <div className="flex-1 max-w-2xl mx-4">
              <form onSubmit={handleSearch} className="relative">
                <Search className="absolute right-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="ابحث عن المنتجات، الخدمات..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pr-12 pl-4 py-3 bg-gray-50 border-0 rounded-2xl focus:ring-2 focus:ring-purple-500 focus:bg-white transition-all text-right backdrop-blur-sm text-sm"
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

            {/* Right Section - هل أنت طبيب أسنان؟ */}
            <div className="flex items-center gap-2">
              <Link to="/dental">
                <button className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white rounded-xl font-medium transition-all shadow-sm hover:shadow-md">
                  <Stethoscope className="w-4 h-4" />
                  <span className="hidden sm:inline">هل أنت طبيب أسنان؟</span>
                  <span className="sm:hidden">طبيب؟</span>
                </button>
              </Link>
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

              <nav className="space-y-1">
                {VISITOR_SECTIONS.map((section) => {
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

              <div className="mt-4 pt-4 border-t border-gray-200">
                <Link
                  to="/dental"
                  onClick={() => setShowMobileMenu(false)}
                  className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white rounded-xl font-medium transition-all"
                >
                  <Stethoscope className="w-5 h-5" />
                  هل أنت طبيب أسنان؟
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
