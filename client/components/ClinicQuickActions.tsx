import React from "react";
import { useNavigate } from "react-router-dom";
import {
  UserPlus,
  Calendar,
  Stethoscope,
  Package,
  Users,
  DollarSign,
  Building2,
  Settings,
  BarChart3,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface QuickAction {
  id: string;
  label: string;
  icon: React.ElementType;
  color: string;
  bgColor: string;
  hoverColor: string;
  path?: string;
  onClick?: () => void;
}

interface ClinicQuickActionsProps {
  variant?: "full" | "compact";
  onActionClick?: (actionId: string) => void;
}

export default function ClinicQuickActions({
  variant = "full",
  onActionClick,
}: ClinicQuickActionsProps) {
  const navigate = useNavigate();

  const actions: QuickAction[] = [
    {
      id: "new_appointment",
      label: "موعد جديد",
      icon: Calendar,
      color: "text-blue-600",
      bgColor: "bg-blue-50",
      hoverColor: "hover:bg-blue-100",
      path: "/clinic_old/reservations",
    },
    {
      id: "new_patient",
      label: "مريض جديد",
      icon: UserPlus,
      color: "text-emerald-600",
      bgColor: "bg-emerald-50",
      hoverColor: "hover:bg-emerald-100",
      path: "/clinic_old/patients",
    },
    {
      id: "reports",
      label: "التقارير",
      icon: BarChart3,
      color: "text-purple-600",
      bgColor: "bg-purple-50",
      hoverColor: "hover:bg-purple-100",
      path: "/clinic_old/reports",
    },
    {
      id: "stocks",
      label: "المخزون",
      icon: Package,
      color: "text-orange-600",
      bgColor: "bg-orange-50",
      hoverColor: "hover:bg-orange-100",
      path: "/clinic_old/stocks",
    },
    {
      id: "finance",
      label: "المالية",
      icon: DollarSign,
      color: "text-indigo-600",
      bgColor: "bg-indigo-50",
      hoverColor: "hover:bg-indigo-100",
      path: "/clinic_old/finance",
    },
    {
      id: "peripherals",
      label: "الإعدادات",
      icon: Settings,
      color: "text-gray-600",
      bgColor: "bg-gray-50",
      hoverColor: "hover:bg-gray-100",
      path: "/clinic_old/peripherals",
    },
    {
      id: "treatments",
      label: "العلاجات",
      icon: Stethoscope,
      color: "text-cyan-600",
      bgColor: "bg-cyan-50",
      hoverColor: "hover:bg-cyan-100",
      path: "/clinic_old/treatments",
    },
    {
      id: "staff",
      label: "الطاقم الطبي",
      icon: Users,
      color: "text-teal-600",
      bgColor: "bg-teal-50",
      hoverColor: "hover:bg-teal-100",
      path: "/clinic_old/staff",
    },
    {
      id: "lab_order",
      label: "المختبر",
      icon: Building2,
      color: "text-rose-600",
      bgColor: "bg-rose-50",
      hoverColor: "hover:bg-rose-100",
      path: "/clinic_old/lab",
    },
  ];

  const handleActionClick = (action: QuickAction) => {
    if (onActionClick) {
      onActionClick(action.id);
    }
    if (action.path) {
      navigate(action.path);
    }
    if (action.onClick) {
      action.onClick();
    }
  };

  if (variant === "compact") {
    return (
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {actions.slice(0, 4).map((action) => {
          const Icon = action.icon;
          return (
            <button
              key={action.id}
              onClick={() => handleActionClick(action)}
              className={cn(
                "flex items-center gap-3 p-3 rounded-xl transition-all group",
                action.bgColor,
                action.hoverColor
              )}
            >
              <div
                className={cn(
                  "w-10 h-10 rounded-lg flex items-center justify-center",
                  action.color,
                  action.bgColor
                )}
              >
                <Icon className="w-5 h-5" />
              </div>
              <span className={cn("text-sm font-medium", action.color)}>
                {action.label}
              </span>
            </button>
          );
        })}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {actions.map((action) => {
        const Icon = action.icon;
        return (
          <button
            key={action.id}
            onClick={() => handleActionClick(action)}
            className={cn(
              "flex items-center gap-4 p-4 rounded-2xl transition-all group",
              action.bgColor,
              action.hoverColor
            )}
          >
            <div
              className={cn(
                "w-12 h-12 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform",
                action.color.replace("text-", "bg-"),
              )}
            >
              <Icon className="w-6 h-6 text-white" />
            </div>
            <div className="text-right">
              <p className={cn("font-medium", action.color)}>{action.label}</p>
              <p className={cn("text-xs opacity-70", action.color)}>
                إنشاء جديد
              </p>
            </div>
          </button>
        );
      })}
    </div>
  );
}
