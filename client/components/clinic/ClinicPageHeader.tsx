import React from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

interface ClinicPageHeaderProps {
  title: string;
  description?: string;
  icon?: LucideIcon;
  backLink?: string;
  actions?: React.ReactNode;
  breadcrumbs?: Array<{ label: string; href?: string }>;
  className?: string;
}

export function ClinicPageHeader({
  title,
  description,
  icon: Icon,
  backLink,
  actions,
  breadcrumbs,
  className
}: ClinicPageHeaderProps) {
  return (
    <div className={cn("bg-white border-b border-gray-200 -mx-4 -mt-4 px-4 py-4 mb-6 lg:-mx-6 lg:-mt-6 lg:px-6 lg:py-5", className)}>
      {/* Breadcrumbs */}
      {breadcrumbs && breadcrumbs.length > 0 && (
        <div className="flex items-center gap-2 text-sm text-gray-600 mb-3">
          {breadcrumbs.map((crumb, index) => (
            <React.Fragment key={index}>
              {crumb.href ? (
                <Link 
                  to={crumb.href} 
                  className="hover:text-blue-600 transition-colors"
                >
                  {crumb.label}
                </Link>
              ) : (
                <span className="text-gray-900 font-medium">{crumb.label}</span>
              )}
              {index < breadcrumbs.length - 1 && (
                <span className="text-gray-400">/</span>
              )}
            </React.Fragment>
          ))}
        </div>
      )}

      {/* Header Content */}
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-start gap-4 flex-1 min-w-0">
          {backLink && (
            <Link 
              to={backLink}
              className="flex-shrink-0 p-2 hover:bg-gray-100 rounded-lg transition-colors mt-1"
            >
              <ArrowLeft className="w-5 h-5 text-gray-600" />
            </Link>
          )}
          
          <div className="flex items-center gap-3 flex-1 min-w-0">
            {Icon && (
              <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center shadow-sm">
                <Icon className="w-6 h-6 text-white" />
              </div>
            )}
            
            <div className="flex-1 min-w-0">
              <h1 className="text-xl lg:text-2xl font-bold text-gray-900 truncate">
                {title}
              </h1>
              {description && (
                <p className="text-sm text-gray-600 mt-1 line-clamp-2">
                  {description}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Actions */}
        {actions && (
          <div className="flex-shrink-0 flex items-center gap-2">
            {actions}
          </div>
        )}
      </div>
    </div>
  );
}

interface QuickStatsProps {
  stats: Array<{
    label: string;
    value: string | number;
    icon: LucideIcon;
    color?: string;
  }>;
  className?: string;
}

export function QuickStats({ stats, className }: QuickStatsProps) {
  return (
    <div className={cn("grid grid-cols-2 md:grid-cols-4 gap-3 mb-6", className)}>
      {stats.map((stat, index) => {
        const Icon = stat.icon;
        return (
          <div 
            key={index}
            className="bg-white border border-gray-200 rounded-lg p-3 hover:border-blue-300 transition-all duration-200"
          >
            <div className="flex items-center gap-2 mb-2">
              <div className={cn(
                "w-8 h-8 rounded-lg flex items-center justify-center",
                stat.color || "bg-blue-50"
              )}>
                <Icon className={cn(
                  "w-4 h-4",
                  stat.color ? stat.color.replace('bg-', 'text-').replace('-50', '-600') : "text-blue-600"
                )} />
              </div>
              <span className="text-xs text-gray-600 font-medium truncate">
                {stat.label}
              </span>
            </div>
            <p className="text-lg font-bold text-gray-900 truncate">
              {stat.value}
            </p>
          </div>
        );
      })}
    </div>
  );
}
