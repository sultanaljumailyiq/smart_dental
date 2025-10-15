import React, { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  Home,
  User,
  ShoppingCart,
  MessageCircle,
  UserCheck,
  Stethoscope,
  Calendar,
  Settings,
  X,
  Package,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useCart } from "@/contexts/CartContext";

type SectionType =
  | "home"
  | "medical-services"
  | "dentist-hub"
  | "community"
  | "marketplace"
  | "profile";

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

interface SimplifiedBottomNavProps {
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

export default function SimplifiedBottomNav({
  currentSection = "home",
  onSectionChange,
  userRole = "patient",
}: SimplifiedBottomNavProps) {
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  const location = useLocation();
  const navigate = useNavigate();
  const { state: cartState } = useCart();
  const cart = cartState?.items || [];

  // Determine current section based on path
  const getCurrentSection = (): SectionType => {
    const path = location.pathname;
    if (path === "/" || path === "/landing") return "home";
    if (path.includes("/medical-services")) return "medical-services";
    if (path.includes("/dentist-hub")) return "dentist-hub";
    if (path.includes("/community")) return "community";
    if (path.includes("/dental-supply") || path.includes("/marketplace"))
      return "marketplace";
    if (path.includes("/profile")) return "profile";
    return "home";
  };

  const activeSection = getCurrentSection();

  // Determine nav items based on user role - NO FAVORITES, SEARCH, NOTIFICATIONS
  const getNavItems = (): NavItem[] => {
    const baseItems: NavItem[] = [
      {
        id: "home",
        label: "Home",
        icon: Home,
        path: "/",
        color: "blue",
        gradient: "from-blue-500 to-blue-600",
      },
      {
        id: "medical-services",
        label: "Services",
        icon: Stethoscope,
        path: "/medical-services",
        color: "emerald",
        gradient: "from-emerald-500 to-emerald-600",
      },
    ];

    // Center item - Dentist Hub for non-patients
    if (userRole !== "patient") {
      baseItems.push({
        id: "dentist-hub",
        label: "Hub",
        icon: UserCheck,
        path: "/dentist-hub",
        color: "purple",
        gradient: "from-purple-500 to-purple-600",
        isCenter: true,
      });
    }

    // Side items
    const sideItems: NavItem[] = [];

    if (userRole !== "patient") {
      sideItems.push({
        id: "community",
        label: "Community",
        icon: MessageCircle,
        path: "/community",
        color: "pink",
        gradient: "from-pink-500 to-pink-600",
      });
    }

    if (userRole !== "patient") {
      sideItems.push({
        id: "marketplace",
        label: "Store",
        icon: Package,
        path: "/dental-supply",
        color: "orange",
        gradient: "from-orange-500 to-orange-600",
        badge: cart.length,
      });
    }

    sideItems.push({
      id: "profile",
      label: "Profile",
      icon: User,
      action: () => setIsProfileOpen(true),
      color: "gray",
      gradient: "from-gray-500 to-gray-600",
    });

    // Arrange items: 2 left + center + 2 right for non-patients
    // For patients: 2 left + center (search) + 2 right
    if (userRole === "patient") {
      return [
        baseItems[0], // Home
        baseItems[1], // Medical Services
        {
          id: "profile",
          label: "Profile",
          icon: User,
          action: () => setIsProfileOpen(true),
          color: "indigo",
          gradient: "from-indigo-500 to-indigo-600",
          isCenter: true,
        },
        {
          id: "marketplace",
          label: "Cart",
          icon: ShoppingCart,
          path: "/cart",
          color: "green",
          gradient: "from-green-500 to-green-600",
          badge: cart.length,
        },
        {
          id: "settings",
          label: "Settings",
          icon: Settings,
          path: "/settings",
          color: "gray",
          gradient: "from-gray-500 to-gray-600",
        },
      ];
    }

    return [
      baseItems[0], // Home
      baseItems[1], // Medical Services
      baseItems[2], // Dentist Hub (center)
      sideItems[0], // Community
      sideItems[1], // Marketplace
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

  // Close menus when clicking outside
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
      {/* Bottom Navigation Bar */}
      <div className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-gray-200/50 shadow-lg">
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
                  {/* Icon */}
                  <item.icon
                    className={cn(
                      "transition-all duration-300",
                      isCenter ? "w-8 h-8" : "w-6 h-6",
                      isActive || isCenter
                        ? "text-white"
                        : "text-gray-600 group-hover:text-gray-900",
                    )}
                  />

                  {/* Label */}
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

                  {/* Badge */}
                  {item.badge && item.badge > 0 && (
                    <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center font-medium">
                      {item.badge > 99 ? "99+" : item.badge}
                    </span>
                  )}

                  {/* Active indicator */}
                  {isActive && !isCenter && (
                    <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-6 h-1 bg-white rounded-full" />
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Profile Modal */}
      {isProfileOpen && (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/50">
          <div className="profile-menu w-full max-w-md bg-white rounded-t-3xl shadow-xl transform transition-all duration-300 ease-out">
            {/* Handle */}
            <div className="flex justify-center pt-4 pb-2">
              <div className="w-12 h-1 bg-gray-300 rounded-full" />
            </div>

            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
              <h3 className="text-lg font-semibold text-gray-900">Profile</h3>
              <button
                onClick={() => setIsProfileOpen(false)}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              >
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>

            {/* Content */}
            <div className="px-6 py-4 space-y-4">
              {/* User Info */}
              <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl">
                <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                  <User className="w-6 h-6 text-white" />
                </div>
                <div>
                  <div className="font-semibold text-gray-900">User</div>
                  <div className="text-sm text-gray-500">
                    {userRole === "app_owner"
                      ? "App Owner"
                      : userRole === "clinic_owner"
                        ? "Clinic Owner"
                        : userRole === "clinic_staff"
                          ? "Clinic Staff"
                          : userRole === "clinic_employee"
                            ? "Clinic Employee"
                            : userRole === "supplier"
                              ? "Supplier"
                              : "Patient"}
                  </div>
                </div>
              </div>

              {/* Quick Options */}
              <div className="space-y-2">
                <Link
                  to="/profile"
                  onClick={() => setIsProfileOpen(false)}
                  className="flex items-center gap-3 p-3 hover:bg-gray-50 rounded-xl transition-colors"
                >
                  <User className="w-5 h-5 text-gray-600" />
                  <span className="text-gray-900">View Profile</span>
                </Link>

                <Link
                  to="/settings"
                  onClick={() => setIsProfileOpen(false)}
                  className="flex items-center gap-3 p-3 hover:bg-gray-50 rounded-xl transition-colors"
                >
                  <Settings className="w-5 h-5 text-gray-600" />
                  <span className="text-gray-900">Settings</span>
                </Link>

                {userRole !== "patient" && (
                  <Link
                    to="/dental-supply"
                    onClick={() => setIsProfileOpen(false)}
                    className="flex items-center gap-3 p-3 hover:bg-gray-50 rounded-xl transition-colors"
                  >
                    <Package className="w-5 h-5 text-gray-600" />
                    <span className="text-gray-900">Store</span>
                  </Link>
                )}

                <Link
                  to="/cart"
                  onClick={() => setIsProfileOpen(false)}
                  className="flex items-center gap-3 p-3 hover:bg-gray-50 rounded-xl transition-colors"
                >
                  <ShoppingCart className="w-5 h-5 text-gray-600" />
                  <div className="flex items-center justify-between flex-1">
                    <span className="text-gray-900">Cart</span>
                    {cart.length > 0 && (
                      <span className="bg-emerald-100 text-emerald-700 text-xs px-2 py-1 rounded-full">
                        {cart.length}
                      </span>
                    )}
                  </div>
                </Link>
              </div>

              {/* Logout */}
              <div className="pt-4 border-t border-gray-100">
                <button className="w-full p-3 text-red-600 hover:bg-red-50 rounded-xl transition-colors text-center">
                  Logout
                </button>
              </div>
            </div>

            {/* Space for bottom nav */}
            <div className="pb-20" />
          </div>
        </div>
      )}
    </>
  );
}
