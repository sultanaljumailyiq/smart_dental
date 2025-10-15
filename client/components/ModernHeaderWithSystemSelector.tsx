import React, { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import {
  Bell,
  MessageSquare,
  Search,
  User,
  Menu,
  X,
  Building2,
  ShoppingCart,
  Globe,
  Briefcase,
  Settings,
} from "lucide-react";
import { cn } from "@/lib/utils";
import SystemSelectorPopover from "./SystemSelectorPopover";

interface ModernHeaderWithSystemSelectorProps {
  userRole?: "admin" | "dentist" | "patient" | "supplier";
  userName?: string;
  userEmail?: string;
  showSearch?: boolean;
  currentSection?: string;
}

const ModernHeaderWithSystemSelector: React.FC<
  ModernHeaderWithSystemSelectorProps
> = ({
  userRole = "dentist",
  userName = "د. أحمد الطبيب",
  userEmail = "dr.ahmed@clinic.com",
  showSearch = true,
  currentSection = "",
}) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  // Navigation items based on user role
  const navigationItems = [
    {
      id: "medical-services",
      title: "الخدمات الطبية",
      path: "/medical-services",
      show: true,
    },
    {
      id: "clinic",
      title: "إدارة العيادة",
      path: "/clinic",
      show: userRole === "dentist" || userRole === "admin",
    },
    {
      id: "store",
      title: "المتجر",
      path: "/dental-supply",
      icon: ShoppingCart,
      show: true,
    },
    {
      id: "community",
      title: "المجتمع",
      path: "/community",
      icon: Globe,
      show: true,
    },
    {
      id: "jobs",
      title: "التوظيف",
      path: "/jobs",
      icon: Briefcase,
      show: true,
    },
    {
      id: "admin",
      title: "إدارة النظام",
      path: "/admin",
      icon: Settings,
      show: userRole === "admin",
    },
  ];

  const isActive = (path: string) => {
    return location.pathname.startsWith(path);
  };

  return (
    <>
      <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link
              to="/"
              className="flex items-center gap-3 font-bold text-xl text-gray-900"
            >
              <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center">
                <Building2 className="w-5 h-5 text-white" />
              </div>
              <span className="hidden md:block">عيادتي</span>
            </Link>

            {/* Navigation - Desktop */}
            <nav className="hidden md:flex items-center space-x-8 space-x-reverse">
              {navigationItems
                .filter((item) => item.show)
                .map((item) => (
                  <Link
                    key={item.id}
                    to={item.path}
                    className={cn(
                      "px-3 py-2 rounded-lg text-sm font-medium transition-colors",
                      isActive(item.path)
                        ? "bg-blue-100 text-blue-700"
                        : "text-gray-600 hover:text-gray-900 hover:bg-gray-100",
                    )}
                  >
                    {item.title}
                  </Link>
                ))}
            </nav>

            {/* Search - Desktop */}
            {showSearch && (
              <div className="hidden md:flex flex-1 max-w-md mx-8">
                <div className="relative w-full">
                  <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="text"
                    placeholder="البحث..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pr-10 pl-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>
            )}

            {/* Right Actions */}
            <div className="flex items-center gap-3">
              {/* Notifications */}
              <button className="relative p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors">
                <Bell className="w-5 h-5" />
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  3
                </span>
              </button>

              {/* Messages */}
              <button className="relative p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors">
                <MessageSquare className="w-5 h-5" />
                <span className="absolute -top-1 -right-1 bg-blue-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  2
                </span>
              </button>

              {/* Profile */}
              <button
                onClick={() => setIsProfileOpen(!isProfileOpen)}
                className="flex items-center gap-2 p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                  <User className="w-5 h-5 text-blue-600" />
                </div>
                <span className="hidden md:block text-sm font-medium">
                  {userName}
                </span>
              </button>

              {/* Mobile Menu Button */}
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="md:hidden p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
              >
                {isMobileMenuOpen ? (
                  <X className="w-5 h-5" />
                ) : (
                  <Menu className="w-5 h-5" />
                )}
              </button>
            </div>
          </div>

          {/* Mobile Search */}
          {showSearch && isMobileMenuOpen && (
            <div className="md:hidden py-4 border-t border-gray-200">
              <div className="relative">
                <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="البحث..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pr-10 pl-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>
          )}

          {/* Mobile Navigation */}
          {isMobileMenuOpen && (
            <div className="md:hidden py-4 border-t border-gray-200">
              <nav className="space-y-2">
                {navigationItems
                  .filter((item) => item.show)
                  .map((item) => (
                    <Link
                      key={item.id}
                      to={item.path}
                      onClick={() => setIsMobileMenuOpen(false)}
                      className={cn(
                        "flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors",
                        isActive(item.path)
                          ? "bg-blue-100 text-blue-700"
                          : "text-gray-600 hover:text-gray-900 hover:bg-gray-100",
                      )}
                    >
                      {item.icon && <item.icon className="w-4 h-4" />}
                      {item.title}
                    </Link>
                  ))}
              </nav>
            </div>
          )}
        </div>
      </header>

      {/* System Selector Popover */}
      <SystemSelectorPopover
        isOpen={isProfileOpen}
        onClose={() => setIsProfileOpen(false)}
        userRole={userRole}
        userName={userName}
        userEmail={userEmail}
      />
    </>
  );
};

export default ModernHeaderWithSystemSelector;
