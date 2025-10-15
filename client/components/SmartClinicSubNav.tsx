import React from "react";
import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { Home, Bot, BarChart3 } from "lucide-react";

interface TabItem {
  key: string;
  label: string;
  path: string;
  icon: React.ComponentType<any>;
}

const tabs: TabItem[] = [
  {
    key: "main",
    label: "العام",
    path: "/dentist-hub/smart-clinic/main",
    icon: Home,
  },
  {
    key: "ai-assistant",
    label: "المساعد الذكي",
    path: "/dentist-hub/smart-clinic/ai-assistant",
    icon: Bot,
  },
  {
    key: "reports",
    label: "التقارير والإحصائيات",
    path: "/dentist-hub/smart-clinic/reports",
    icon: BarChart3,
  },
];

export default function SmartClinicSubNav() {
  const location = useLocation();
  const pathname = location.pathname;

  const isActive = (path: string) => pathname === path || pathname.startsWith(path + "/");

  return (
    <div className="sticky top-0 z-40 bg-white rounded-xl shadow-sm border border-gray-100 mb-4 sm:mb-6">
      <nav className="flex items-center gap-1 sm:gap-2 overflow-x-auto px-2 sm:px-4 py-2 scrollbar-hide"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
        {tabs.map((item) => {
          const Icon = item.icon;
          const active = isActive(item.path);
          return (
            <Link
              key={item.key}
              to={item.path}
              className={cn(
                "inline-flex items-center gap-1.5 sm:gap-2 px-2 sm:px-3 py-1.5 sm:py-2 rounded-lg text-xs sm:text-sm whitespace-nowrap border transition-colors flex-shrink-0",
                active
                  ? "bg-blue-50 border-blue-200 text-blue-700 font-medium"
                  : "bg-gray-50 hover:bg-gray-100 border-gray-200 text-gray-700",
              )}
            >
              <Icon className={cn("w-3.5 h-3.5 sm:w-4 sm:h-4", active ? "text-blue-600" : "text-gray-500")} />
              <span className="hidden xs:inline">{item.label}</span>
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
