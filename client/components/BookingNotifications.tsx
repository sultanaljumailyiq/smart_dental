import React, { useState, useEffect } from "react";
import {
  Bell,
  Calendar,
  Clock,
  User,
  Phone,
  Stethoscope,
  Check,
  X,
  Eye,
  AlertCircle,
  CheckCircle,
  Edit,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface BookingNotification {
  id: string;
  type: "new_appointment" | "cancelled_appointment" | "rescheduled_appointment";
  patient: string;
  phone: string;
  doctor: string;
  service: string;
  date: string;
  time: string;
  clinicId: string;
  timestamp: string;
  status: "unread" | "read" | "accepted" | "rejected";
  priority: "high" | "medium" | "low";
}

interface BookingNotificationsProps {
  clinicId?: string;
  onNotificationAction?: (
    notificationId: string,
    action: "accept" | "reject" | "view",
  ) => void;
  compact?: boolean;
  maxItems?: number;
  hideHeader?: boolean;
  onEditAppointment?: (notification: BookingNotification) => void;
}

// بيانات تجريبية للإشعارات
const mockNotifications: BookingNotification[] = [
  {
    id: "notif-1",
    type: "new_appointment",
    patient: "أحمد محمد علي",
    phone: "+964 770 123 4567",
    doctor: "د. أحمد الرحمة",
    service: "زراعة الأسنان",
    date: "2024-12-20",
    time: "10:00",
    clinicId: "CL-BAGHDAD-001",
    timestamp: new Date(Date.now() - 5 * 60 * 1000).toISOString(),
    status: "unread",
    priority: "high",
  },
  {
    id: "notif-2",
    type: "new_appointment",
    patient: "فاطمة أحمد",
    phone: "+964 751 987 6543",
    doctor: "د. فاطمة النور",
    service: "تقويم الأسنان",
    date: "2024-12-21",
    time: "14:30",
    clinicId: "CL-BAGHDAD-001",
    timestamp: new Date(Date.now() - 15 * 60 * 1000).toISOString(),
    status: "unread",
    priority: "medium",
  },
  {
    id: "notif-3",
    type: "new_appointment",
    patient: "محمد سالم",
    phone: "+964 772 456 7890",
    doctor: "د. أحمد الرحمة",
    service: "تنظيف الأسنان",
    date: "2024-12-19",
    time: "09:30",
    clinicId: "CL-BAGHDAD-001",
    timestamp: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
    status: "accepted",
    priority: "low",
  },
];

const BookingNotifications: React.FC<BookingNotificationsProps> = ({
  clinicId = "CL-BAGHDAD-001",
  onNotificationAction,
  compact = false,
  maxItems = 3,
  hideHeader = false,
  onEditAppointment,
}) => {
  const [notifications, setNotifications] =
    useState<BookingNotification[]>(mockNotifications);
  const [showAll, setShowAll] = useState(false);

  const filteredNotifications = notifications.filter(
    (notif) => notif.clinicId === clinicId,
  );

  const unreadCount = filteredNotifications.filter(
    (notif) => notif.status === "unread",
  ).length;

  const displayNotifications = showAll
    ? filteredNotifications
    : filteredNotifications.slice(0, maxItems);

  const handleAction = (
    notificationId: string,
    action: "accept" | "reject" | "view",
  ) => {
    setNotifications((prev) =>
      prev.map((notif) =>
        notif.id === notificationId
          ? {
              ...notif,
              status:
                action === "accept"
                  ? "accepted"
                  : action === "reject"
                    ? "rejected"
                    : "read",
            }
          : notif,
      ),
    );

    if (onNotificationAction) {
      onNotificationAction(notificationId, action);
    }
  };

  const getTimeAgo = (timestamp: string) => {
    const now = new Date();
    const notifTime = new Date(timestamp);
    const diffMinutes = Math.floor(
      (now.getTime() - notifTime.getTime()) / (1000 * 60),
    );

    if (diffMinutes < 1) return "الآن";
    if (diffMinutes < 60) return `منذ ${diffMinutes} دقيقة`;
    if (diffMinutes < 1440) return `منذ ${Math.floor(diffMinutes / 60)} ساعة`;
    return `منذ ${Math.floor(diffMinutes / 1440)} يوم`;
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("ar-EG", {
      weekday: "short",
      month: "short",
      day: "numeric",
    });
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case "new_appointment":
        return Calendar;
      case "cancelled_appointment":
        return X;
      case "rescheduled_appointment":
        return Clock;
      default:
        return Bell;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "text-red-600 bg-red-50 border-red-200";
      case "medium":
        return "text-orange-600 bg-orange-50 border-orange-200";
      case "low":
        return "text-green-600 bg-green-50 border-green-200";
      default:
        return "text-gray-600 bg-gray-50 border-gray-200";
    }
  };

  const containerClasses =
    compact && hideHeader
      ? ""
      : "bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden";

  return (
    <div className={containerClasses}>
      {!hideHeader && (
        <div className="p-4 border-b border-gray-100">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                <Bell className="w-4 h-4 text-blue-600" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">
                  طلبات الحجز الجديدة
                </h3>
                <p className="text-xs text-gray-600">
                  {unreadCount > 0
                    ? `${unreadCount} طلب جديد`
                    : "لا توجد طلبات جديدة"}
                </p>
              </div>
            </div>
            {unreadCount > 0 && (
              <div className="w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center text-xs font-medium">
                {unreadCount > 9 ? "9+" : unreadCount}
              </div>
            )}
          </div>
        </div>
      )}

      <div
        className={cn("max-h-96 overflow-y-auto", compact && hideHeader && "")}
      >
        {displayNotifications.length === 0 ? (
          <div className="p-8 text-center text-gray-500">
            <Bell className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <p>لا توجد إشعارات حجز جديدة</p>
          </div>
        ) : compact ? (
          <div className="divide-y divide-gray-100">
            {displayNotifications.map((notification) => {
              const Icon = getNotificationIcon(notification.type);
              const isUnread = notification.status === "unread";
              const isAccepted = notification.status === "accepted";
              const isRejected = notification.status === "rejected";

              return (
                <div
                  key={notification.id}
                  className={cn(
                    "py-2 px-1 flex items-center justify-between text-xs",
                    isUnread && "bg-blue-50/50",
                    isAccepted && "bg-green-50/50",
                    isRejected && "bg-red-50/50",
                  )}
                >
                  <div className="flex items-center gap-2 min-w-0">
                    <div
                      className={cn(
                        "w-6 h-6 rounded-md flex items-center justify-center flex-shrink-0",
                        getPriorityColor(notification.priority),
                      )}
                    >
                      <Icon className="w-3.5 h-3.5" />
                    </div>
                    <div className="truncate">
                      <span className="font-semibold text-gray-900 truncate">
                        {notification.patient}
                      </span>
                      <span className="mx-1 text-gray-400">•</span>
                      <span className="text-gray-700">{notification.time}</span>
                      <span className="mx-1 text-gray-400">•</span>
                      <span className="text-gray-700">
                        {formatDate(notification.date)}
                      </span>
                      <span className="mx-1 text-gray-400">•</span>
                      <span className="text-gray-700 truncate">
                        {notification.service}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-1 flex-shrink-0">
                    {isUnread && (
                      <>
                        <button
                          onClick={() =>
                            handleAction(notification.id, "accept")
                          }
                          className="p-1.5 bg-green-600 text-white rounded-md hover:bg-green-700"
                          title="قبول"
                        >
                          <Check className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() =>
                            handleAction(notification.id, "reject")
                          }
                          className="p-1.5 bg-red-600 text-white rounded-md hover:bg-red-700"
                          title="رفض"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                      </>
                    )}
                    <button
                      onClick={() => onEditAppointment?.(notification)}
                      className="p-1.5 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200"
                      title="تعديل الموعد"
                    >
                      <Edit className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="divide-y divide-gray-100">
            {displayNotifications.map((notification) => {
              const Icon = getNotificationIcon(notification.type);
              const isUnread = notification.status === "unread";
              const isAccepted = notification.status === "accepted";
              const isRejected = notification.status === "rejected";

              return (
                <div
                  key={notification.id}
                  className={cn(
                    "p-4 transition-colors hover:bg-gray-50",
                    isUnread
                      ? "bg-blue-50/50 border-r-4 border-r-blue-500"
                      : "",
                    isAccepted ? "bg-green-50/50" : "",
                    isRejected ? "bg-red-50/50" : "",
                  )}
                >
                  <div className="flex items-start gap-3">
                    <div
                      className={cn(
                        "w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0",
                        getPriorityColor(notification.priority),
                      )}
                    >
                      <Icon className="w-5 h-5" />
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <p className="font-medium text-gray-900 text-sm">
                            طلب حجز جديد من {notification.patient}
                          </p>
                          <p className="text-xs text-gray-600">
                            {getTimeAgo(notification.timestamp)}
                          </p>
                        </div>
                        {isAccepted && (
                          <div className="flex items-center gap-1 text-green-600 text-xs">
                            <CheckCircle className="w-3 h-3" />
                            <span>مقبول</span>
                          </div>
                        )}
                        {isRejected && (
                          <div className="flex items-center gap-1 text-red-600 text-xs">
                            <X className="w-3 h-3" />
                            <span>مرفوض</span>
                          </div>
                        )}
                        {isUnread && (
                          <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                        )}
                      </div>

                      <div className="bg-gray-50 rounded-lg p-3 mb-3">
                        <div className="grid grid-cols-2 gap-2 text-xs">
                          <div className="flex items-center gap-2">
                            <Stethoscope className="w-3 h-3 text-gray-500" />
                            <span className="text-gray-600">الطبيب:</span>
                            <span className="font-medium">
                              {notification.doctor}
                            </span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Calendar className="w-3 h-3 text-gray-500" />
                            <span className="text-gray-600">التاريخ:</span>
                            <span className="font-medium">
                              {formatDate(notification.date)}
                            </span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Clock className="w-3 h-3 text-gray-500" />
                            <span className="text-gray-600">الوقت:</span>
                            <span className="font-medium">
                              {notification.time}
                            </span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Phone className="w-3 h-3 text-gray-500" />
                            <span className="text-gray-600">الهاتف:</span>
                            <span className="font-medium">
                              {notification.phone}
                            </span>
                          </div>
                        </div>
                        <div className="mt-2 pt-2 border-t border-gray-200">
                          <span className="text-gray-600 text-xs">
                            الخدمة:{" "}
                          </span>
                          <span className="font-medium text-xs">
                            {notification.service}
                          </span>
                        </div>
                      </div>

                      {isUnread && (
                        <div className="flex gap-2">
                          <button
                            onClick={() =>
                              handleAction(notification.id, "accept")
                            }
                            className="flex-1 bg-green-600 text-white py-2 px-3 rounded-lg text-xs font-medium hover:bg-green-700 transition-colors flex items-center justify-center gap-1"
                          >
                            <Check className="w-3 h-3" />
                            قبول
                          </button>
                          <button
                            onClick={() =>
                              handleAction(notification.id, "reject")
                            }
                            className="flex-1 bg-red-600 text-white py-2 px-3 rounded-lg text-xs font-medium hover:bg-red-700 transition-colors flex items-center justify-center gap-1"
                          >
                            <X className="w-3 h-3" />
                            رفض
                          </button>
                          <button
                            onClick={() =>
                              handleAction(notification.id, "view")
                            }
                            className="bg-gray-200 text-gray-700 py-2 px-3 rounded-lg text-xs font-medium hover:bg-gray-300 transition-colors flex items-center justify-center"
                          >
                            <Eye className="w-3 h-3" />
                          </button>
                        </div>
                      )}
                    </div>

                    <div className="ml-2">
                      <button
                        onClick={() => onEditAppointment?.(notification)}
                        className="px-3 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 text-xs flex items-center gap-1"
                        title="تعديل الموعد"
                      >
                        <Edit className="w-3.5 h-3.5" />
                        تعديل الموعد
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {!hideHeader && filteredNotifications.length > maxItems && (
        <div className="p-3 border-t border-gray-100">
          <button
            onClick={() => setShowAll(!showAll)}
            className="w-full text-blue-600 hover:text-blue-700 text-sm font-medium py-2 transition-colors"
          >
            {showAll
              ? "عرض أقل"
              : `عرض جميع الإشعارات (${filteredNotifications.length})`}
          </button>
        </div>
      )}
    </div>
  );
};

export default BookingNotifications;
