import React, { useState, useEffect, useRef } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  Search,
  Heart,
  Bell,
  User,
  Menu,
  Home,
  MessageCircle,
  Briefcase,
  ChevronDown,
  ShoppingCart,
  Stethoscope,
  Settings,
  Shield,
  BookOpen,
  Building2,
  UserCheck,
  Package,
  X,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useCart } from "@/contexts/CartContext";
import { useFavorites } from "@/contexts/FavoritesContext";

export type UserRole =
  | "app_owner"
  | "clinic_owner"
  | "clinic_staff"
  | "clinic_employee"
  | "supplier"
  | "patient";

export type SectionType =
  | "home"
  | "marketplace"
  | "medical-services"
  | "dentist-hub"
  | "community"
  | "jobs"
  | "admin"
  | "clinic"
  | "articles"
  | "search"
  | "favorites"
  | "notifications"
  | "profile"
  | "about";

interface SimplifiedHeaderProps {
  currentSection?: SectionType;
  searchPlaceholder?: string;
  onMenuToggle?: () => void;
  showSidebar?: boolean;
  customActions?: React.ReactNode;
}

// Section configurations
const sectionConfigs = {
  home: {
    title: "Dental Platform",
    subtitle: "Comprehensive dental services platform",
    icon: Home,
    primaryColor: "blue",
    gradient: "from-blue-600 via-purple-600 to-teal-600",
  },
  marketplace: {
    title: "Medical Supplies",
    subtitle: "Best medical equipment and supplies",
    icon: Package,
    primaryColor: "emerald",
    gradient: "from-emerald-600 via-green-600 to-emerald-700",
  },
  "medical-services": {
    title: "Medical Services",
    subtitle: "Comprehensive and advanced medical services",
    icon: Stethoscope,
    primaryColor: "blue",
    gradient: "from-blue-600 via-purple-600 to-blue-700",
  },
  "dentist-hub": {
    title: "Dentist Hub",
    subtitle: "Comprehensive platform for doctors",
    icon: UserCheck,
    primaryColor: "indigo",
    gradient: "from-indigo-600 via-purple-600 to-indigo-700",
  },
  community: {
    title: "Community",
    subtitle: "Connect and share experiences",
    icon: MessageCircle,
    primaryColor: "purple",
    gradient: "from-purple-600 via-pink-600 to-purple-700",
  },
  jobs: {
    title: "Jobs",
    subtitle: "Career opportunities in dentistry",
    icon: Briefcase,
    primaryColor: "orange",
    gradient: "from-orange-600 via-amber-600 to-orange-700",
  },
  admin: {
    title: "Admin Panel",
    subtitle: "System administration",
    icon: Shield,
    primaryColor: "red",
    gradient: "from-red-600 via-rose-600 to-red-700",
  },
  clinic: {
    title: "Clinic Management",
    subtitle: "Integrated clinic management system",
    icon: Building2,
    primaryColor: "teal",
    gradient: "from-teal-600 via-cyan-600 to-teal-700",
  },
  articles: {
    title: "Articles",
    subtitle: "Reliable medical content and tips",
    icon: BookOpen,
    primaryColor: "violet",
    gradient: "from-violet-600 via-purple-600 to-violet-700",
  },
};

// User permissions
const rolePermissions = {
  patient: {
    sections: ["medical-services"],
  },
  clinic_staff: {
    sections: ["medical-services", "marketplace", "clinic"],
  },
  clinic_employee: {
    sections: [
      "medical-services",
      "marketplace",
      "community",
      "jobs",
      "clinic",
    ],
  },
  supplier: {
    sections: ["marketplace", "community", "jobs"],
  },
  clinic_owner: {
    sections: [
      "medical-services",
      "marketplace",
      "community",
      "jobs",
      "clinic",
      "admin",
    ],
  },
  app_owner: {
    sections: [
      "medical-services",
      "marketplace",
      "community",
      "jobs",
      "clinic",
      "admin",
    ],
  },
};

export default function SimplifiedHeader({
  currentSection = "home",
  searchPlaceholder,
  onMenuToggle,
  showSidebar,
  customActions,
}: SimplifiedHeaderProps) {
  const [isSearchExpanded, setIsSearchExpanded] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [isFavoritesOpen, setIsFavoritesOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState<{ role: UserRole }>({
    role: "patient",
  });

  const location = useLocation();
  const navigate = useNavigate();
  const { state: cartState } = useCart();
  const cart = cartState?.items || [];
  const { favorites: favoritesData } = useFavorites();
  const favorites = favoritesData || [];

  const searchRef = useRef<HTMLDivElement>(null);
  const profileRef = useRef<HTMLDivElement>(null);
  const notificationsRef = useRef<HTMLDivElement>(null);
  const favoritesRef = useRef<HTMLDivElement>(null);

  const config = sectionConfigs[currentSection] || sectionConfigs.home;
  const permissions = rolePermissions[currentUser.role];

  // Generate navigation sections based on permissions
  const getNavigationSections = () => {
    const sections = [];

    // Home page
    sections.push({
      key: "home",
      path: "/",
      label: "Home",
      icon: Home,
      color: "blue",
    });

    // Medical services - available for everyone
    if (
      currentUser.role === "patient" ||
      permissions.sections.includes("medical-services")
    ) {
      sections.push({
        key: "medical-services",
        path: "/medical-services",
        label: "Services",
        icon: Stethoscope,
        color: "blue",
      });
    }

    // Dentist hub - for doctors and specialists
    if (currentUser.role !== "patient") {
      sections.push({
        key: "dentist-hub",
        path: "/dentist-hub",
        label: "Hub",
        icon: UserCheck,
        color: "indigo",
      });
    }

    if (permissions.sections.includes("marketplace")) {
      sections.push({
        key: "marketplace",
        path: "/dental-supply",
        label: "Store",
        icon: Package,
        color: "emerald",
      });
    }

    if (permissions.sections.includes("community")) {
      sections.push({
        key: "community",
        path: "/community",
        label: "Community",
        icon: MessageCircle,
        color: "purple",
      });
    }

    if (permissions.sections.includes("jobs")) {
      sections.push({
        key: "jobs",
        path: "/jobs",
        label: "Jobs",
        icon: Briefcase,
        color: "orange",
      });
    }

    // Articles - available for everyone
    sections.push({
      key: "articles",
      path: "/articles",
      label: "Articles",
      icon: BookOpen,
      color: "violet",
    });

    return sections;
  };

  // Close dropdowns when clicking outside
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
      if (
        favoritesRef.current &&
        !favoritesRef.current.contains(event.target as Node)
      ) {
        setIsFavoritesOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
      setIsSearchExpanded(false);
      setSearchQuery("");
    }
  };

  const switchRole = (newRole: UserRole) => {
    setCurrentUser({ role: newRole });
    setIsProfileOpen(false);
  };

  const navigationSections = getNavigationSections();

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-md border-b border-gray-200/50 shadow-lg">
      {/* Colored top bar */}
      <div className={cn("h-1 bg-gradient-to-r", config.gradient)} />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo and navigation */}
          <div className="flex items-center space-x-8">
            {/* Mobile menu button */}
            <button
              onClick={onMenuToggle}
              className="lg:hidden p-2 rounded-xl text-gray-600 hover:text-gray-900 hover:bg-gray-100/50 transition-all"
            >
              <Menu className="w-6 h-6" />
            </button>

            {/* Logo */}
            <Link to="/" className="flex items-center space-x-3">
              <div
                className={cn(
                  "w-10 h-10 rounded-xl flex items-center justify-center text-white shadow-lg",
                  `bg-gradient-to-br ${config.gradient}`,
                )}
              >
                <config.icon className="w-6 h-6" />
              </div>
              <div className="hidden sm:block">
                <div className="text-lg font-bold text-gray-900">
                  {config.title}
                </div>
                <div className="text-xs text-gray-500 leading-tight">
                  {config.subtitle}
                </div>
              </div>
            </Link>

            {/* Quick navigation - desktop */}
            <nav className="hidden xl:flex items-center space-x-2">
              {navigationSections.slice(0, 5).map((section) => {
                const isActive =
                  location.pathname === section.path ||
                  (section.path === "/medical-services" &&
                    (location.pathname.includes("/medical-services") ||
                      location.pathname.includes("/marketplace"))) ||
                  (section.path === "/dentist-hub" &&
                    location.pathname.includes("/dentist-hub")) ||
                  (section.path === "/dental-supply" &&
                    location.pathname.includes("/dental-supply")) ||
                  (section.path === "/community" &&
                    location.pathname.includes("/community")) ||
                  (section.path === "/jobs" &&
                    location.pathname.includes("/jobs")) ||
                  (section.path === "/articles" &&
                    location.pathname.includes("/articles"));
                return (
                  <Link
                    key={section.key}
                    to={section.path}
                    className={cn(
                      "relative px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 flex items-center space-x-2 group",
                      isActive
                        ? `bg-gradient-to-r ${config.gradient} text-white shadow-lg`
                        : "text-gray-600 hover:text-gray-900 hover:bg-gray-100/50",
                    )}
                  >
                    <section.icon className="w-4 h-4" />
                    <span>{section.label}</span>
                    {isActive && (
                      <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-6 h-1 bg-white rounded-full" />
                    )}
                  </Link>
                );
              })}
            </nav>
          </div>

          {/* Actions */}
          <div className="flex items-center space-x-4">
            {/* Search */}
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
                    placeholder={searchPlaceholder || "Search..."}
                    className={cn(
                      "w-full h-10 bg-gray-100/50 border border-gray-200/50 rounded-xl transition-all duration-300",
                      isSearchExpanded
                        ? "px-4 pl-10 opacity-100"
                        : "px-0 opacity-0 pointer-events-none",
                    )}
                    onFocus={() => setIsSearchExpanded(true)}
                  />
                  <button
                    type="button"
                    onClick={() => setIsSearchExpanded(!isSearchExpanded)}
                    className="absolute left-0 top-0 h-10 w-10 flex items-center justify-center text-gray-600 hover:text-gray-900 transition-colors rounded-xl hover:bg-gray-100/50"
                  >
                    <Search className="w-5 h-5" />
                  </button>
                </div>
              </form>
            </div>

            {/* Favorites */}
            <div ref={favoritesRef} className="relative">
              <button
                onClick={() => setIsFavoritesOpen(!isFavoritesOpen)}
                className="relative p-2 text-gray-600 hover:text-red-500 hover:bg-red-50/50 rounded-xl transition-all group"
              >
                <Heart className="w-6 h-6" />
                {favorites.length > 0 && (
                  <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center font-medium">
                    {favorites.length}
                  </span>
                )}
              </button>

              {/* Favorites dropdown */}
              {isFavoritesOpen && (
                <div className="absolute top-12 right-0 w-80 bg-white rounded-2xl shadow-xl border border-gray-200/50 overflow-hidden z-50">
                  <div className="p-4 border-b border-gray-100">
                    <div className="flex items-center justify-between">
                      <h3 className="font-semibold text-gray-900">Favorites</h3>
                      <button
                        onClick={() => setIsFavoritesOpen(false)}
                        className="p-1 hover:bg-gray-100 rounded-lg transition-colors"
                      >
                        <X className="w-4 h-4 text-gray-500" />
                      </button>
                    </div>
                  </div>
                  <div className="max-h-64 overflow-y-auto">
                    {favorites.length > 0 ? (
                      <div className="p-4">
                        {favorites.map((item, index) => (
                          <div
                            key={index}
                            className="flex items-center gap-3 p-2 hover:bg-gray-50 rounded-lg"
                          >
                            <Heart className="w-4 h-4 text-red-500 fill-current" />
                            <div className="flex-1">
                              <div className="text-sm font-medium text-gray-900">
                                {item.name}
                              </div>
                              <div className="text-xs text-gray-500">
                                {item.category}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="p-4 text-center text-gray-500">
                        <Heart className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                        <p>No favorites yet</p>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Cart */}
            <Link
              to="/cart"
              className="relative p-2 text-gray-600 hover:text-emerald-500 hover:bg-emerald-50/50 rounded-xl transition-all group"
            >
              <ShoppingCart className="w-6 h-6" />
              {cart.length > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-emerald-500 text-white text-xs rounded-full flex items-center justify-center font-medium">
                  {cart.length}
                </span>
              )}
            </Link>

            {/* Notifications */}
            <div ref={notificationsRef} className="relative">
              <button
                onClick={() => setIsNotificationsOpen(!isNotificationsOpen)}
                className="relative p-2 text-gray-600 hover:text-blue-500 hover:bg-blue-50/50 rounded-xl transition-all"
              >
                <Bell className="w-6 h-6" />
                <span className="absolute -top-1 -right-1 w-3 h-3 bg-blue-500 rounded-full"></span>
              </button>

              {/* Notifications dropdown */}
              {isNotificationsOpen && (
                <div className="absolute top-12 right-0 w-80 bg-white rounded-2xl shadow-xl border border-gray-200/50 overflow-hidden z-50">
                  <div className="p-4 border-b border-gray-100">
                    <div className="flex items-center justify-between">
                      <h3 className="font-semibold text-gray-900">
                        Notifications
                      </h3>
                      <button
                        onClick={() => setIsNotificationsOpen(false)}
                        className="p-1 hover:bg-gray-100 rounded-lg transition-colors"
                      >
                        <X className="w-4 h-4 text-gray-500" />
                      </button>
                    </div>
                  </div>
                  <div className="max-h-64 overflow-y-auto">
                    <div className="p-4 text-center text-gray-500">
                      <Bell className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                      <p>No new notifications</p>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Profile menu */}
            <div ref={profileRef} className="relative">
              <button
                onClick={() => setIsProfileOpen(!isProfileOpen)}
                className="flex items-center space-x-3 p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100/50 rounded-xl transition-all group"
              >
                <div
                  className={cn(
                    "w-8 h-8 rounded-lg flex items-center justify-center text-white",
                    `bg-gradient-to-br ${config.gradient}`,
                  )}
                >
                  <User className="w-4 h-4" />
                </div>
                <ChevronDown className="w-4 h-4 group-hover:rotate-180 transition-transform" />
              </button>

              {/* Profile dropdown */}
              {isProfileOpen && (
                <div className="absolute top-12 right-0 w-72 bg-white rounded-2xl shadow-xl border border-gray-200/50 overflow-hidden z-50">
                  <div className="p-4 border-b border-gray-100">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center space-x-3">
                        <div
                          className={cn(
                            "w-12 h-12 rounded-xl flex items-center justify-center text-white",
                            `bg-gradient-to-br ${config.gradient}`,
                          )}
                        >
                          <User className="w-6 h-6" />
                        </div>
                        <div>
                          <div className="font-semibold text-gray-900">
                            User
                          </div>
                          <div className="text-sm text-gray-500">
                            {currentUser.role === "app_owner"
                              ? "App Owner"
                              : currentUser.role === "clinic_owner"
                                ? "Clinic Owner"
                                : currentUser.role === "clinic_staff"
                                  ? "Clinic Staff"
                                  : currentUser.role === "clinic_employee"
                                    ? "Clinic Employee"
                                    : currentUser.role === "supplier"
                                      ? "Supplier"
                                      : "Patient"}
                          </div>
                        </div>
                      </div>
                      <button
                        onClick={() => setIsProfileOpen(false)}
                        className="p-1 hover:bg-gray-100 rounded-lg transition-colors"
                      >
                        <X className="w-4 h-4 text-gray-500" />
                      </button>
                    </div>

                    {/* Role switcher */}
                    <div className="space-y-2">
                      <div className="text-sm font-medium text-gray-700 mb-2">
                        Switch Role:
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        {(
                          [
                            "patient",
                            "clinic_staff",
                            "clinic_employee",
                            "supplier",
                            "clinic_owner",
                            "app_owner",
                          ] as UserRole[]
                        ).map((role) => (
                          <button
                            key={role}
                            onClick={() => switchRole(role)}
                            className={cn(
                              "px-3 py-2 text-xs rounded-lg transition-all",
                              currentUser.role === role
                                ? "bg-blue-100 text-blue-700"
                                : "bg-gray-100 text-gray-600 hover:bg-gray-200",
                            )}
                          >
                            {role === "app_owner"
                              ? "App Owner"
                              : role === "clinic_owner"
                                ? "Clinic Owner"
                                : role === "clinic_staff"
                                  ? "Clinic Staff"
                                  : role === "clinic_employee"
                                    ? "Clinic Employee"
                                    : role === "supplier"
                                      ? "Supplier"
                                      : "Patient"}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="p-4">
                    {/* Quick actions */}
                    <div className="grid grid-cols-2 gap-2 mb-4">
                      <Link
                        to="/profile"
                        className="flex items-center space-x-2 px-3 py-2 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-100/50 rounded-lg transition-all"
                        onClick={() => setIsProfileOpen(false)}
                      >
                        <User className="w-4 h-4" />
                        <span>Profile</span>
                      </Link>
                      <Link
                        to="/settings"
                        className="flex items-center space-x-2 px-3 py-2 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-100/50 rounded-lg transition-all"
                        onClick={() => setIsProfileOpen(false)}
                      >
                        <Settings className="w-4 h-4" />
                        <span>Settings</span>
                      </Link>
                    </div>

                    {/* Logout */}
                    <button className="w-full px-4 py-2 text-sm text-red-600 hover:text-red-700 hover:bg-red-50/50 rounded-lg transition-all text-center">
                      Logout
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Custom actions */}
            {customActions}
          </div>
        </div>
      </div>
    </header>
  );
}
