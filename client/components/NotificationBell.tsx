import React, { useState } from "react";
import { Bell } from "lucide-react";
import CardBasedNotifications from "./CardBasedNotifications";
import { sampleNotifications } from "@/data/sampleNotifications";

interface NotificationBellProps {
  onClick?: () => void;
  notifications?: any[];
  className?: string;
}

export default function NotificationBell({ 
  onClick, 
  notifications = sampleNotifications,
  className = "" 
}: NotificationBellProps) {
  const [showNotifications, setShowNotifications] = useState(false);
  const unreadCount = notifications.filter((n) => !n.read).length;

  const handleClick = () => {
    if (onClick) {
      onClick();
    } else {
      setShowNotifications(true);
    }
  };

  return (
    <>
      <button
        onClick={handleClick}
        className={`relative p-2 bg-blue-50 rounded-xl hover:bg-blue-100 transition-colors ${className}`}
      >
        <Bell className="w-5 h-5 text-blue-600" />
        {unreadCount > 0 && (
          <div className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-medium animate-pulse">
            {unreadCount > 9 ? "9+" : unreadCount}
          </div>
        )}
      </button>

      {/* نظام الإشعارات Card-Based */}
      <CardBasedNotifications
        isOpen={showNotifications}
        onClose={() => setShowNotifications(false)}
        notifications={notifications}
      />
    </>
  );
}
