import { Check, Package, Warehouse, Truck, MapPin, Home } from "lucide-react";
import { cn } from "@/lib/utils";

export interface OrderStatus {
  id: string;
  label: string;
  description: string;
  icon: React.ElementType;
  completed: boolean;
  current: boolean;
  timestamp?: string;
}

interface OrderTrackingTimelineProps {
  currentStatus: "ordered" | "warehouse" | "shipping_company" | "in_transit" | "delivered";
  orderDate: string;
  warehouseDate?: string;
  shippingDate?: string;
  transitDate?: string;
  deliveredDate?: string;
}

export default function OrderTrackingTimeline({
  currentStatus,
  orderDate,
  warehouseDate,
  shippingDate,
  transitDate,
  deliveredDate,
}: OrderTrackingTimelineProps) {
  const statuses: OrderStatus[] = [
    {
      id: "ordered",
      label: "تم عمل الطلبية",
      description: "تم تأكيد الطلب بنجاح",
      icon: Package,
      completed: true,
      current: currentStatus === "ordered",
      timestamp: orderDate,
    },
    {
      id: "warehouse",
      label: "جاري التجهيز في المستودع",
      description: "جاري تجهيز المنتجات وتعبئتها",
      icon: Warehouse,
      completed: ["warehouse", "shipping_company", "in_transit", "delivered"].includes(currentStatus),
      current: currentStatus === "warehouse",
      timestamp: warehouseDate,
    },
    {
      id: "shipping_company",
      label: "عند شركة الشحن",
      description: "تم تسليم الطلب لشركة التوصيل",
      icon: Truck,
      completed: ["shipping_company", "in_transit", "delivered"].includes(currentStatus),
      current: currentStatus === "shipping_company",
      timestamp: shippingDate,
    },
    {
      id: "in_transit",
      label: "في الطريق",
      description: "الطلب في طريقه إليك",
      icon: MapPin,
      completed: ["in_transit", "delivered"].includes(currentStatus),
      current: currentStatus === "in_transit",
      timestamp: transitDate,
    },
    {
      id: "delivered",
      label: "تم الاستلام",
      description: "تم توصيل الطلب بنجاح",
      icon: Home,
      completed: currentStatus === "delivered",
      current: currentStatus === "delivered",
      timestamp: deliveredDate,
    },
  ];

  const currentIndex = statuses.findIndex((s) => s.id === currentStatus);

  return (
    <div className="relative py-8 px-4" dir="rtl">
      {/* Progress Bar Background */}
      <div className="absolute top-[52px] right-0 left-0 h-1 bg-gray-200 mx-8 md:mx-16" />
      
      {/* Progress Bar Fill */}
      <div
        className="absolute top-[52px] right-0 h-1 bg-gradient-to-r from-purple-600 to-blue-600 mx-8 md:mx-16 transition-all duration-500"
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
                    ? "bg-gradient-to-br from-purple-600 to-blue-600 text-white shadow-lg"
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
                  <div className="w-12 h-12 rounded-full bg-purple-400 animate-ping opacity-75" />
                </div>
              )}

              {/* Label */}
              <div className="text-center max-w-[120px]">
                <p
                  className={cn(
                    "text-sm font-bold mb-1 transition-colors",
                    isCompleted || isCurrent ? "text-purple-600" : "text-gray-400"
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
                  <p className="text-xs text-purple-500 mt-1 font-medium">
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
                className="flex items-center gap-3 p-3 bg-purple-50 rounded-lg"
              >
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-600 to-blue-600 text-white flex items-center justify-center flex-shrink-0">
                  {status.completed && !status.current ? (
                    <Check className="w-5 h-5" />
                  ) : (
                    <StatusIcon className="w-5 h-5" />
                  )}
                </div>
                <div className="flex-1">
                  <p className="text-sm font-bold text-purple-600">{status.label}</p>
                  <p className="text-xs text-gray-600">{status.description}</p>
                </div>
                {status.timestamp && (
                  <p className="text-xs text-purple-500 font-medium">
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
