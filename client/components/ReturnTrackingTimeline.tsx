import { Check, FileText, CheckCircle, Package, Search, DollarSign } from "lucide-react";
import { cn } from "@/lib/utils";

export interface ReturnStatus {
  id: string;
  label: string;
  description: string;
  icon: React.ElementType;
  completed: boolean;
  current: boolean;
  timestamp?: string;
}

interface ReturnTrackingTimelineProps {
  currentStatus: "requested" | "approved" | "picked_up" | "inspected" | "refunded";
  requestDate: string;
  approvedDate?: string;
  pickedUpDate?: string;
  inspectedDate?: string;
  refundedDate?: string;
  returnReason?: string;
}

export default function ReturnTrackingTimeline({
  currentStatus,
  requestDate,
  approvedDate,
  pickedUpDate,
  inspectedDate,
  refundedDate,
  returnReason,
}: ReturnTrackingTimelineProps) {
  const statuses: ReturnStatus[] = [
    {
      id: "requested",
      label: "طلب الإرجاع",
      description: "تم إرسال طلب الإرجاع",
      icon: FileText,
      completed: true,
      current: currentStatus === "requested",
      timestamp: requestDate,
    },
    {
      id: "approved",
      label: "موافقة المورد",
      description: "تمت الموافقة على الإرجاع",
      icon: CheckCircle,
      completed: ["approved", "picked_up", "inspected", "refunded"].includes(currentStatus),
      current: currentStatus === "approved",
      timestamp: approvedDate,
    },
    {
      id: "picked_up",
      label: "استلام المنتج",
      description: "تم استلام المنتج من الطبيب",
      icon: Package,
      completed: ["picked_up", "inspected", "refunded"].includes(currentStatus),
      current: currentStatus === "picked_up",
      timestamp: pickedUpDate,
    },
    {
      id: "inspected",
      label: "فحص المنتج",
      description: "تم فحص المنتج والتأكد من سلامته",
      icon: Search,
      completed: ["inspected", "refunded"].includes(currentStatus),
      current: currentStatus === "inspected",
      timestamp: inspectedDate,
    },
    {
      id: "refunded",
      label: "استرجاع المبلغ",
      description: "تم إرجاع المبلغ بنجاح",
      icon: DollarSign,
      completed: currentStatus === "refunded",
      current: currentStatus === "refunded",
      timestamp: refundedDate,
    },
  ];

  const currentIndex = statuses.findIndex((s) => s.id === currentStatus);

  return (
    <div className="relative py-8 px-4" dir="rtl">
      {/* Return Reason Banner */}
      {returnReason && (
        <div className="mb-6 p-4 bg-orange-50 border border-orange-200 rounded-lg">
          <p className="text-sm font-semibold text-orange-800 mb-1">سبب الإرجاع:</p>
          <p className="text-sm text-orange-700">{returnReason}</p>
        </div>
      )}

      {/* Progress Bar Background */}
      <div className="absolute top-[52px] right-0 left-0 h-1 bg-gray-200 mx-8 md:mx-16" />
      
      {/* Progress Bar Fill */}
      <div
        className="absolute top-[52px] right-0 h-1 bg-gradient-to-r from-orange-600 to-red-600 mx-8 md:mx-16 transition-all duration-500"
        style={{
          width: currentIndex >= 0 ? `${(currentIndex / (statuses.length - 1)) * 100}%` : "0%",
        }}
      />

      {/* Status Steps */}
      <div className="relative flex justify-between items-start">
        {statuses.map((status, index) => {
          const StatusIcon = status.icon;
          const isCompleted = status.completed;
          const isCurrent = status.current;

          return (
            <div
              key={status.id}
              className="flex flex-col items-center flex-1 relative"
            >
              {/* Icon Circle */}
              <div
                className={cn(
                  "w-12 h-12 rounded-full flex items-center justify-center mb-3 transition-all duration-300 relative z-10",
                  isCompleted || isCurrent
                    ? "bg-gradient-to-br from-orange-600 to-red-600 text-white shadow-lg"
                    : "bg-gray-200 text-gray-400"
                )}
              >
                {isCompleted && !isCurrent ? (
                  <Check className="w-6 h-6" />
                ) : (
                  <StatusIcon className="w-6 h-6" />
                )}
              </div>

              {/* Current Status Pulse */}
              {isCurrent && (
                <div className="absolute top-0 right-1/2 translate-x-1/2">
                  <div className="w-12 h-12 rounded-full bg-orange-400 animate-ping opacity-75" />
                </div>
              )}

              {/* Label */}
              <div className="text-center max-w-[120px]">
                <p
                  className={cn(
                    "text-sm font-bold mb-1 transition-colors",
                    isCompleted || isCurrent ? "text-orange-600" : "text-gray-400"
                  )}
                >
                  {status.label}
                </p>
                <p
                  className={cn(
                    "text-xs transition-colors hidden md:block",
                    isCompleted || isCurrent ? "text-gray-600" : "text-gray-400"
                  )}
                >
                  {status.description}
                </p>
                {status.timestamp && (isCompleted || isCurrent) && (
                  <p className="text-xs text-orange-500 mt-1 font-medium">
                    {new Date(status.timestamp).toLocaleDateString("ar-IQ", {
                      day: "numeric",
                      month: "short",
                    })}
                  </p>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Mobile View - Simplified */}
      <div className="md:hidden mt-6 space-y-2">
        {statuses
          .filter((s) => s.completed || s.current)
          .reverse()
          .map((status) => {
            const StatusIcon = status.icon;
            return (
              <div
                key={status.id}
                className="flex items-center gap-3 p-3 bg-orange-50 rounded-lg"
              >
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-orange-600 to-red-600 text-white flex items-center justify-center flex-shrink-0">
                  {status.completed && !status.current ? (
                    <Check className="w-5 h-5" />
                  ) : (
                    <StatusIcon className="w-5 h-5" />
                  )}
                </div>
                <div className="flex-1">
                  <p className="text-sm font-bold text-orange-600">{status.label}</p>
                  <p className="text-xs text-gray-600">{status.description}</p>
                </div>
                {status.timestamp && (
                  <p className="text-xs text-orange-500 font-medium">
                    {new Date(status.timestamp).toLocaleDateString("ar-IQ", {
                      day: "numeric",
                      month: "short",
                    })}
                  </p>
                )}
              </div>
            );
          })}
      </div>
    </div>
  );
}
