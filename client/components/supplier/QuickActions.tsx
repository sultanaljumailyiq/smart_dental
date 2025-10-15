import React from "react";
import { Link } from "react-router-dom";
import {
  MessageSquare,
  Clock,
  Truck,
  RotateCcw,
  AlertCircle,
  Bell,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

export interface QuickActionCard {
  id: string;
  titleArabic: string;
  icon: React.ReactNode;
  count: number;
  color: string;
  link: string;
  urgent?: boolean;
}

interface QuickActionsProps {
  actions: QuickActionCard[];
}

export default function QuickActions({ actions }: QuickActionsProps) {

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-2">
      {actions.map((action) => (
        <Link key={action.id} to={action.link} className="group">
          <Card
            className={cn(
              "hover:shadow-md transition-all duration-200 cursor-pointer border relative",
              action.urgent ? "border-red-200 bg-red-50" : "border-gray-200 hover:border-gray-300"
            )}
          >
            <CardContent className="p-3">
              <div className="flex flex-col items-center text-center space-y-1.5">
                <div className={cn("w-8 h-8 rounded-full flex items-center justify-center text-white relative", action.color)}>
                  {action.icon}
                  {action.urgent && (
                    <div className="absolute -top-0.5 -right-0.5 w-2 h-2 bg-red-500 rounded-full border border-white animate-pulse" />
                  )}
                </div>
                <div className="space-y-0.5">
                  <p className="text-lg font-bold text-gray-900">{action.count}</p>
                  <p className="text-[10px] font-medium text-gray-600 leading-tight">{action.titleArabic}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </Link>
      ))}
    </div>
  );
}
