import React from "react";
import { cn } from "@/lib/utils";
import { LucideIcon } from "lucide-react";

interface ClinicCardProps {
  children: React.ReactNode;
  className?: string;
  padding?: "sm" | "md" | "lg";
  variant?: "default" | "elevated" | "bordered";
}

export function ClinicCard({ 
  children, 
  className, 
  padding = "md",
  variant = "default" 
}: ClinicCardProps) {
  const paddingClasses = {
    sm: "p-3",
    md: "p-4",
    lg: "p-6"
  };

  const variantClasses = {
    default: "bg-white border border-gray-200",
    elevated: "bg-white shadow-sm border border-gray-100",
    bordered: "bg-white border-2 border-gray-200"
  };

  return (
    <div className={cn(
      "rounded-xl transition-all duration-200",
      paddingClasses[padding],
      variantClasses[variant],
      className
    )}>
      {children}
    </div>
  );
}

interface ClinicCardHeaderProps {
  title: string;
  subtitle?: string;
  icon?: LucideIcon;
  action?: React.ReactNode;
  className?: string;
}

export function ClinicCardHeader({ 
  title, 
  subtitle, 
  icon: Icon, 
  action,
  className 
}: ClinicCardHeaderProps) {
  return (
    <div className={cn("flex items-start justify-between mb-4", className)}>
      <div className="flex items-center gap-3 flex-1 min-w-0">
        {Icon && (
          <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center">
            <Icon className="w-5 h-5 text-white" />
          </div>
        )}
        <div className="flex-1 min-w-0">
          <h3 className="text-base font-bold text-gray-900 truncate">{title}</h3>
          {subtitle && (
            <p className="text-sm text-gray-600 truncate mt-0.5">{subtitle}</p>
          )}
        </div>
      </div>
      {action && <div className="flex-shrink-0 ml-3">{action}</div>}
    </div>
  );
}

interface ClinicStatCardProps {
  label: string;
  value: string | number;
  icon: LucideIcon;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  color?: "blue" | "green" | "purple" | "red" | "orange" | "indigo";
  className?: string;
}

export function ClinicStatCard({ 
  label, 
  value, 
  icon: Icon, 
  trend,
  color = "blue",
  className 
}: ClinicStatCardProps) {
  const colorClasses = {
    blue: "from-blue-500 to-blue-600",
    green: "from-green-500 to-green-600",
    purple: "from-purple-500 to-purple-600",
    red: "from-red-500 to-red-600",
    orange: "from-orange-500 to-orange-600",
    indigo: "from-indigo-500 to-indigo-600"
  };

  return (
    <div className={cn(
      "bg-gradient-to-br text-white rounded-xl p-5 transition-all duration-200 hover:shadow-lg",
      colorClasses[color],
      className
    )}>
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1">
          <p className="text-white/80 text-sm font-medium mb-1">{label}</p>
          <p className="text-2xl font-bold">{value}</p>
        </div>
        <div className="bg-white/20 p-2.5 rounded-lg backdrop-blur-sm">
          <Icon className="w-5 h-5" />
        </div>
      </div>
      {trend && (
        <div className={cn(
          "flex items-center gap-1 text-xs",
          trend.isPositive ? "text-white/90" : "text-white/70"
        )}>
          <span>{trend.isPositive ? "↑" : "↓"}</span>
          <span>{Math.abs(trend.value)}%</span>
          <span className="text-white/60">من الشهر الماضي</span>
        </div>
      )}
    </div>
  );
}

interface ClinicBadgeProps {
  children: React.ReactNode;
  variant?: "success" | "warning" | "danger" | "info" | "neutral";
  size?: "sm" | "md";
  className?: string;
}

export function ClinicBadge({ 
  children, 
  variant = "neutral",
  size = "md",
  className 
}: ClinicBadgeProps) {
  const variantClasses = {
    success: "bg-green-100 text-green-700 border-green-200",
    warning: "bg-yellow-100 text-yellow-700 border-yellow-200",
    danger: "bg-red-100 text-red-700 border-red-200",
    info: "bg-blue-100 text-blue-700 border-blue-200",
    neutral: "bg-gray-100 text-gray-700 border-gray-200"
  };

  const sizeClasses = {
    sm: "text-xs px-2 py-0.5",
    md: "text-sm px-3 py-1"
  };

  return (
    <span className={cn(
      "inline-flex items-center gap-1 font-medium rounded-full border",
      variantClasses[variant],
      sizeClasses[size],
      className
    )}>
      {children}
    </span>
  );
}
