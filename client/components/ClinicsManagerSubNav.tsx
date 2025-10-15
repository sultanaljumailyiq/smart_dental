import { Link, useLocation, useSearchParams } from "react-router-dom";
import {
  BarChart3,
  Building2,
  Users,
  Calendar,
  FileText,
  Shield,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface Item {
  id: string;
  label: string;
  icon: React.ComponentType<any>;
}

const items: Item[] = [
  { id: "overview", label: "ملخص عام", icon: BarChart3 },
  { id: "list", label: "عياداتي", icon: Building2 },
  { id: "staff", label: "الطاقم", icon: Users },
  { id: "appointments", label: "الحجوزات", icon: Calendar },
  { id: "reports", label: "التقارير", icon: FileText },
  { id: "permissions", label: "الصلاحيات", icon: Shield },
];

export default function ClinicsManagerSubNav() {
  const location = useLocation();
  const [params] = useSearchParams();
  const active = params.get("tab") || "overview";

  const urlFor = (id: string) => {
    const p = new URLSearchParams(location.search);
    p.set("tab", id);
    const base = location.pathname.startsWith("/dentist-hub/clinics")
      ? "/dentist-hub/clinics"
      : "/dentist-hub/clinics"; // Always redirect to dentist-hub/clinics
    return `${base}?${p.toString()}`;
  };

  return (
    <div className="sticky top-0 z-40 bg-white rounded-xl shadow-sm border border-gray-100 mb-4">
      <nav className="flex items-center gap-2 overflow-x-auto -mx-4 px-4 py-2">
        {items.map((item) => {
          const isActive = active === item.id;
          const Icon = item.icon;
          return (
            <Link
              key={item.id}
              to={urlFor(item.id)}
              className={cn(
                "inline-flex items-center gap-2 px-3 py-2 rounded-lg text-sm whitespace-nowrap border transition-colors",
                isActive
                  ? "bg-blue-50 border-blue-200 text-blue-700"
                  : "bg-gray-50 hover:bg-gray-100 border-gray-200 text-gray-700",
              )}
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
