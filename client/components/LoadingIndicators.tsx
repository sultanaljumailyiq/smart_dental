import React from "react";
import {
  Loader2,
  Package,
  Calendar,
  Users,
  TrendingUp,
  Clock,
  CheckCircle,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface LoadingSpinnerProps {
  size?: "sm" | "md" | "lg";
  className?: string;
}

export function LoadingSpinner({
  size = "md",
  className,
}: LoadingSpinnerProps) {
  const sizeClasses = {
    sm: "w-4 h-4",
    md: "w-6 h-6",
    lg: "w-8 h-8",
  };

  return (
    <Loader2
      className={cn("animate-spin text-blue-600", sizeClasses[size], className)}
    />
  );
}

interface ButtonLoadingProps {
  loading?: boolean;
  children: React.ReactNode;
  className?: string;
  disabled?: boolean;
  onClick?: () => void;
}

export function ButtonLoading({
  loading = false,
  children,
  className,
  disabled,
  onClick,
}: ButtonLoadingProps) {
  return (
    <button
      onClick={onClick}
      disabled={disabled || loading}
      className={cn(
        "inline-flex items-center justify-center gap-2 px-4 py-2 rounded-xl font-medium transition-all duration-200",
        "bg-blue-600 text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500",
        "disabled:opacity-50 disabled:cursor-not-allowed",
        className,
      )}
    >
      {loading && <LoadingSpinner size="sm" className="text-white" />}
      {children}
    </button>
  );
}

interface CardSkeletonProps {
  className?: string;
}

export function CardSkeleton({ className }: CardSkeletonProps) {
  return (
    <div
      className={cn(
        "bg-white rounded-2xl border border-gray-200 p-6 animate-pulse",
        className,
      )}
    >
      <div className="flex items-center gap-4 mb-4">
        <div className="w-12 h-12 bg-gray-200 rounded-2xl"></div>
        <div className="flex-1">
          <div className="h-4 bg-gray-200 rounded-lg w-3/4 mb-2"></div>
          <div className="h-3 bg-gray-200 rounded-lg w-1/2"></div>
        </div>
      </div>
      <div className="space-y-2">
        <div className="h-3 bg-gray-200 rounded-lg w-full"></div>
        <div className="h-3 bg-gray-200 rounded-lg w-2/3"></div>
      </div>
    </div>
  );
}

interface TableSkeletonProps {
  rows?: number;
  columns?: number;
  className?: string;
}

export function TableSkeleton({
  rows = 5,
  columns = 4,
  className,
}: TableSkeletonProps) {
  return (
    <div
      className={cn(
        "bg-white rounded-2xl border border-gray-200 overflow-hidden",
        className,
      )}
    >
      {/* Header */}
      <div className="px-6 py-4 border-b border-gray-200 animate-pulse">
        <div className="grid grid-cols-4 gap-4">
          {Array.from({ length: columns }).map((_, i) => (
            <div key={i} className="h-4 bg-gray-200 rounded-lg"></div>
          ))}
        </div>
      </div>

      {/* Rows */}
      <div className="divide-y divide-gray-200">
        {Array.from({ length: rows }).map((_, rowIndex) => (
          <div key={rowIndex} className="px-6 py-4 animate-pulse">
            <div className="grid grid-cols-4 gap-4">
              {Array.from({ length: columns }).map((_, colIndex) => (
                <div
                  key={colIndex}
                  className="h-4 bg-gray-200 rounded-lg"
                ></div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

interface PageLoadingProps {
  message?: string;
  className?: string;
}

export function PageLoading({
  message = "جاري التحميل...",
  className,
}: PageLoadingProps) {
  return (
    <div
      className={cn(
        "min-h-screen flex items-center justify-center bg-gray-50",
        className,
      )}
    >
      <div className="text-center">
        <div className="w-16 h-16 bg-blue-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
          <LoadingSpinner size="lg" />
        </div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">
          يرجى الانتظار
        </h3>
        <p className="text-gray-600">{message}</p>
      </div>
    </div>
  );
}

interface ProgressBarProps {
  progress: number;
  className?: string;
  showPercentage?: boolean;
  color?: "blue" | "green" | "yellow" | "red";
}

export function ProgressBar({
  progress,
  className,
  showPercentage = true,
  color = "blue",
}: ProgressBarProps) {
  const colorClasses = {
    blue: "bg-blue-600",
    green: "bg-green-600",
    yellow: "bg-yellow-600",
    red: "bg-red-600",
  };

  return (
    <div className={cn("w-full", className)}>
      <div className="flex items-center justify-between mb-2">
        <span className="text-sm font-medium text-gray-700">التقدم</span>
        {showPercentage && (
          <span className="text-sm text-gray-500">{Math.round(progress)}%</span>
        )}
      </div>
      <div className="w-full bg-gray-200 rounded-full h-2">
        <div
          className={cn(
            "h-2 rounded-full transition-all duration-300",
            colorClasses[color],
          )}
          style={{ width: `${Math.min(100, Math.max(0, progress))}%` }}
        />
      </div>
    </div>
  );
}

interface DataLoadingStatesProps {
  type: "patients" | "appointments" | "inventory" | "reports" | "financial";
  className?: string;
}

export function DataLoadingStates({ type, className }: DataLoadingStatesProps) {
  const getIcon = () => {
    switch (type) {
      case "patients":
        return <Users className="w-8 h-8 text-blue-600" />;
      case "appointments":
        return <Calendar className="w-8 h-8 text-purple-600" />;
      case "inventory":
        return <Package className="w-8 h-8 text-green-600" />;
      case "reports":
        return <TrendingUp className="w-8 h-8 text-orange-600" />;
      case "financial":
        return <TrendingUp className="w-8 h-8 text-green-600" />;
      default:
        return <Package className="w-8 h-8 text-blue-600" />;
    }
  };

  const getMessage = () => {
    switch (type) {
      case "patients":
        return "جاري تحميل بيانات المرضى...";
      case "appointments":
        return "جاري تحميل المواعيد...";
      case "inventory":
        return "جاري تحميل بيانات المخزون...";
      case "reports":
        return "جاري إنشاء التقارير...";
      case "financial":
        return "جاري تحميل البيانات المالية...";
      default:
        return "جاري التحميل...";
    }
  };

  return (
    <div
      className={cn(
        "bg-white rounded-2xl border border-gray-200 p-8 text-center",
        className,
      )}
    >
      <div className="w-16 h-16 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
        {getIcon()}
      </div>
      <h3 className="text-lg font-medium text-gray-900 mb-2">يرجى الانتظار</h3>
      <p className="text-gray-600 mb-4">{getMessage()}</p>
      <div className="flex items-center justify-center">
        <LoadingSpinner />
      </div>
    </div>
  );
}

interface SuccessStateProps {
  message: string;
  description?: string;
  className?: string;
  onContinue?: () => void;
}

export function SuccessState({
  message,
  description,
  className,
  onContinue,
}: SuccessStateProps) {
  return (
    <div
      className={cn(
        "bg-white rounded-2xl border border-gray-200 p-8 text-center",
        className,
      )}
    >
      <div className="w-16 h-16 bg-green-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
        <CheckCircle className="w-8 h-8 text-green-600" />
      </div>
      <h3 className="text-lg font-medium text-gray-900 mb-2">{message}</h3>
      {description && <p className="text-gray-600 mb-4">{description}</p>}
      {onContinue && (
        <button
          onClick={onContinue}
          className="px-6 py-2 bg-green-600 text-white rounded-xl hover:bg-green-700 transition-colors"
        >
          متابعة
        </button>
      )}
    </div>
  );
}

interface ErrorStateProps {
  message: string;
  description?: string;
  className?: string;
  onRetry?: () => void;
}

export function ErrorState({
  message,
  description,
  className,
  onRetry,
}: ErrorStateProps) {
  return (
    <div
      className={cn(
        "bg-white rounded-2xl border border-gray-200 p-8 text-center",
        className,
      )}
    >
      <div className="w-16 h-16 bg-red-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
        <Clock className="w-8 h-8 text-red-600" />
      </div>
      <h3 className="text-lg font-medium text-gray-900 mb-2">{message}</h3>
      {description && <p className="text-gray-600 mb-4">{description}</p>}
      {onRetry && (
        <button
          onClick={onRetry}
          className="px-6 py-2 bg-red-600 text-white rounded-xl hover:bg-red-700 transition-colors"
        >
          إعادة المحاولة
        </button>
      )}
    </div>
  );
}

// Hook for managing loading states
export function useLoadingState() {
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [success, setSuccess] = React.useState<string | null>(null);

  const startLoading = () => {
    setLoading(true);
    setError(null);
    setSuccess(null);
  };

  const stopLoading = () => {
    setLoading(false);
  };

  const setErrorState = (message: string) => {
    setLoading(false);
    setError(message);
    setSuccess(null);
  };

  const setSuccessState = (message: string) => {
    setLoading(false);
    setError(null);
    setSuccess(message);
  };

  const reset = () => {
    setLoading(false);
    setError(null);
    setSuccess(null);
  };

  return {
    loading,
    error,
    success,
    startLoading,
    stopLoading,
    setErrorState,
    setSuccessState,
    reset,
  };
}
