import { Link, useLocation } from "react-router-dom";
import { Home, Search, Users, Plus, Briefcase } from "lucide-react";
import { cn } from "@/lib/utils";

interface Item {
  id: string;
  label: string;
  path: string;
  icon: React.ComponentType<any>;
}

const items: Item[] = [
  { id: "overview", label: "نظرة عامة", path: "/jobs#overview", icon: Home },
  { id: "browse", label: "تصفح الوظائف", path: "/jobs#browse", icon: Search },
  { id: "dentists", label: "تصفح الأطباء", path: "/jobs/dentists", icon: Users },
  { id: "add-job", label: "إضافة وظيفة جديدة", path: "/jobs#add-job", icon: Plus },
  { id: "my-jobs", label: "طلباتي", path: "/jobs#my-jobs", icon: Briefcase },
];

export default function JobsSubNav({ className }: { className?: string }) {
  const location = useLocation();
  const hash = location.hash?.replace('#', '') || '';

  const isActive = (item: Item) => {
    if (item.id === "dentists") return location.pathname.startsWith("/jobs/dentists");
    if (location.pathname.startsWith("/jobs")) {
      if (!hash && item.id === "overview") return true;
      return hash === item.id;
    }
    return false;
  };

  return (
    <div className={cn("sticky top-0 z-40 bg-white rounded-xl shadow-sm border border-gray-100 mb-3", className)}>
      <nav className="flex items-center gap-2 overflow-x-auto -mx-4 px-4 py-2">
        {items.map((item) => {
          const active = isActive(item);
          const Icon = item.icon;
          return (
            <Link
              key={item.id}
              to={item.path}
              className={cn(
                "inline-flex items-center gap-2 px-3 py-2 rounded-lg text-sm whitespace-nowrap border transition-colors",
                active
                  ? "bg-green-50 border-green-200 text-green-700"
                  : "bg-gray-50 hover:bg-gray-100 border-gray-200 text-gray-700",
              )}
              aria-label={item.label}
            >
              <Icon className="w-4 h-4" />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
