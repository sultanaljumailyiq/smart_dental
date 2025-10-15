import React from "react";
import { Link, useLocation } from "react-router-dom";
import { Shield, Crown, Building, Map, Settings, Package, Users, Headphones } from "lucide-react";
import { cn } from "@/lib/utils";

export default function AdminTopNavbar() {
  const location = useLocation();

  const navItems = [
    {
      id: "system",
      label: "إدارة النظام",
      path: "/admin/dashboard",
      icon: Settings,
    },
    {
      id: "platform",
      label: "إدارة المنصة",
      path: "/admin/platform-admin",
      icon: Shield,
    },
    {
      id: "platform-settings",
      label: "إعدادات المنصة",
      path: "/admin/platform-settings",
      icon: Settings,
    },
    {
      id: "community-settings",
      label: "إعدادات المجتمع",
      path: "/admin/community-settings",
      icon: Users,
    },
    {
      id: "suppliers",
      label: "إدارة الموردين",
      path: "/admin/suppliers",
      icon: Package,
    },
    {
      id: "subscriptions",
      label: "إدارة الاشتراكات",
      path: "/settings/subscription-management",
      icon: Crown,
    },
    {
      id: "clinics",
      label: "إدارة العيادات",
      path: "/settings/clinics",
      icon: Building,
    },
    {
      id: "maps",
      label: "إدارة الخرائط",
      path: "/settings/maps",
      icon: Map,
    },
    {
      id: "technical-support",
      label: "الدعم الفني",
      path: "/settings/technical-support",
      icon: Headphones,
    },
  ];

  return (
    <div className="bg-gradient-to-r from-blue-600 to-purple-600 border-b border-blue-700">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center gap-2 overflow-x-auto scrollbar-none py-3">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            
            return (
              <Link
                key={item.id}
                to={item.path}
                className={cn(
                  "flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all whitespace-nowrap",
                  isActive
                    ? "bg-white text-blue-600 shadow-lg"
                    : "text-white hover:bg-white/20"
                )}
              >
                <Icon className="w-4 h-4" />
                {item.label}
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}
