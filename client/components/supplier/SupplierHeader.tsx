import React from "react";
import { Link, useLocation } from "react-router-dom";
import {
  Package,
  Settings,
  LayoutDashboard,
  BarChart3,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export default function SupplierHeader() {
  const location = useLocation();

  const tabs = [
    {
      label: "مركز الموردين",
      path: "/supplier/dashboard",
      icon: <LayoutDashboard className="w-4 h-4" />,
    },
    {
      label: "إدارة المنتجات",
      path: "/supplier/products",
      icon: <Package className="w-4 h-4" />,
    },
    {
      label: "التحليلات",
      path: "/supplier/analytics",
      icon: <BarChart3 className="w-4 h-4" />,
    },
  ];

  return (
    <div className="sticky top-0 z-40 bg-white border-b border-gray-200 shadow-sm">
      <div className="container mx-auto px-4 py-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-6">
            <h1 className="text-lg font-bold text-gray-900 flex items-center gap-2">
              <Package className="w-5 h-5 text-blue-600" />
              مركز المورد
            </h1>
            <div className="flex items-center gap-1">
              {tabs.map((tab) => (
                <Link key={tab.path} to={tab.path}>
                  <Button
                    variant="ghost"
                    size="sm"
                    className={cn(
                      "gap-2 text-sm h-8",
                      location.pathname === tab.path
                        ? "bg-blue-50 text-blue-600 font-medium"
                        : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                    )}
                  >
                    {tab.icon}
                    {tab.label}
                  </Button>
                </Link>
              ))}
            </div>
          </div>
          <Link to="/supplier/settings">
            <Button variant="outline" size="sm" className="gap-2 h-8">
              <Settings className="w-4 h-4" />
              الإعدادات
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
