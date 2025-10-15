import { Link, useLocation } from "react-router-dom";
import { Users, Calendar, Package, Stethoscope, BarChart3, Building2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface Item {
  id: string;
  label: string;
  path: string;
  icon: React.ComponentType<any>;
}

const items: Item[] = [
  { id: "dashboard", label: "لوحة التحكم", path: "/clinic", icon: Building2 },
  { id: "patients", label: "المرضى", path: "/clinic/patients", icon: Users },
  { id: "reservations", label: "الحجوزات", path: "/clinic/reservations", icon: Calendar },
  { id: "lab", label: "المختبر", path: "/clinic/lab", icon: Package },
  { id: "treatments", label: "العلاجات", path: "/clinic/treatments", icon: Stethoscope },
  { id: "reports", label: "التقارير", path: "/clinic/reports", icon: BarChart3 },
];

export default function ClinicSubNav() {
  const location = useLocation();

  const isActive = (path: string) => {
    if (path === "/clinic") return location.pathname === "/clinic";
    return location.pathname.startsWith(path);
  };

  return (
    <div className="sticky top-0 z-40 bg-white rounded-xl shadow-sm border border-gray-100 mb-6">
      <nav className="flex items-center gap-2 overflow-x-auto -mx-4 px-4 py-2">
        {items.map((item) => {
          const active = isActive(item.path);
          return (
            <Link
              key={item.id}
              to={item.path}
              className={cn(
                "inline-flex items-center gap-2 px-3 py-2 rounded-lg text-sm whitespace-nowrap border transition-colors",
                active
                  ? "bg-blue-50 border-blue-200 text-blue-700"
                  : "bg-gray-50 hover:bg-gray-100 border-gray-200 text-gray-700",
              )}
            >
              <item.icon className="w-4 h-4" />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
