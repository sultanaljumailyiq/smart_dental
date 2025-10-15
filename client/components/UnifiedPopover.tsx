import React, { useState, useRef, useEffect } from "react";
import { cn } from "@/lib/utils";
import { X, ChevronUp, ChevronDown } from "lucide-react";

interface PopoverPosition {
  top?: number;
  bottom?: number;
  left?: number;
  right?: number;
}

interface UnifiedPopoverProps {
  trigger: React.ReactNode;
  children: React.ReactNode;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  className?: string;
  contentClassName?: string;
  placement?: "auto" | "top" | "bottom" | "left" | "right";
  showArrow?: boolean;
  showCloseButton?: boolean;
  closeOnClickOutside?: boolean;
  offset?: number;
  title?: string;
}

export default function UnifiedPopover({
  trigger,
  children,
  isOpen,
  onOpenChange,
  className = "",
  contentClassName = "",
  placement = "auto",
  showArrow = true,
  showCloseButton = false,
  closeOnClickOutside = true,
  offset = 8,
  title,
}: UnifiedPopoverProps) {
  const triggerRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const [position, setPosition] = useState<PopoverPosition>({});
  const [finalPlacement, setFinalPlacement] = useState<
    "top" | "bottom" | "left" | "right"
  >("bottom");

  // حساب الموضع الأمثل للنافذة المنبثقة
  const calculatePosition = () => {
    if (!triggerRef.current || !contentRef.current) return;

    const triggerRect = triggerRef.current.getBoundingClientRect();
    const contentRect = contentRef.current.getBoundingClientRect();
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;
    const scrollY = window.scrollY;
    const scrollX = window.scrollX;

    let bestPlacement: "top" | "bottom" | "left" | "right" = "bottom";
    let newPosition: PopoverPosition = {};

    // تحديد أفضل موضع حسب المساحة المتاحة
    if (placement === "auto") {
      const spaceAbove = triggerRect.top;
      const spaceBelow = viewportHeight - triggerRect.bottom;
      const spaceLeft = triggerRect.left;
      const spaceRight = viewportWidth - triggerRect.right;

      // اختيار أفضل موضع حسب المساحة المتاحة
      if (spaceBelow >= contentRect.height + offset) {
        bestPlacement = "bottom";
      } else if (spaceAbove >= contentRect.height + offset) {
        bestPlacement = "top";
      } else if (spaceRight >= contentRect.width + offset) {
        bestPlacement = "right";
      } else if (spaceLeft >= contentRect.width + offset) {
        bestPlacement = "left";
      } else {
        // استخدام الموضع الذي يوفر أكبر مساحة
        const maxSpace = Math.max(
          spaceAbove,
          spaceBelow,
          spaceLeft,
          spaceRight,
        );
        if (maxSpace === spaceBelow) bestPlacement = "bottom";
        else if (maxSpace === spaceAbove) bestPlacement = "top";
        else if (maxSpace === spaceRight) bestPlacement = "right";
        else bestPlacement = "left";
      }
    } else {
      bestPlacement = placement;
    }

    // حساب الإحداثيات حسب الموضع المختار
    switch (bestPlacement) {
      case "top":
        newPosition = {
          bottom: viewportHeight - triggerRect.top + offset + scrollY,
          left: Math.max(
            8,
            Math.min(
              triggerRect.left +
                triggerRect.width / 2 -
                contentRect.width / 2 +
                scrollX,
              viewportWidth - contentRect.width - 8,
            ),
          ),
        };
        break;

      case "bottom":
        newPosition = {
          top: triggerRect.bottom + offset + scrollY,
          left: Math.max(
            8,
            Math.min(
              triggerRect.left +
                triggerRect.width / 2 -
                contentRect.width / 2 +
                scrollX,
              viewportWidth - contentRect.width - 8,
            ),
          ),
        };
        break;

      case "left":
        newPosition = {
          top: Math.max(
            8,
            Math.min(
              triggerRect.top +
                triggerRect.height / 2 -
                contentRect.height / 2 +
                scrollY,
              viewportHeight - contentRect.height - 8,
            ),
          ),
          right: viewportWidth - triggerRect.left + offset,
        };
        break;

      case "right":
        newPosition = {
          top: Math.max(
            8,
            Math.min(
              triggerRect.top +
                triggerRect.height / 2 -
                contentRect.height / 2 +
                scrollY,
              viewportHeight - contentRect.height - 8,
            ),
          ),
          left: triggerRect.right + offset + scrollX,
        };
        break;
    }

    setPosition(newPosition);
    setFinalPlacement(bestPlacement);
  };

  // إعادة حساب الموضع عند فتح النافذة
  useEffect(() => {
    if (isOpen) {
      // تأخير قصير للسماح للعنصر بالظهور
      const timer = setTimeout(calculatePosition, 10);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  // إعادة حساب الموضع عند تغيير حجم النافذة أو التمرير
  useEffect(() => {
    if (!isOpen) return;

    const handleResize = () => calculatePosition();
    const handleScroll = () => calculatePosition();

    window.addEventListener("resize", handleResize);
    window.addEventListener("scroll", handleScroll, true);

    return () => {
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("scroll", handleScroll, true);
    };
  }, [isOpen]);

  // إغلاق النافذة عند الضغط خارجها
  useEffect(() => {
    if (!isOpen || !closeOnClickOutside) return;

    const handleClickOutside = (event: MouseEvent) => {
      if (
        contentRef.current &&
        triggerRef.current &&
        !contentRef.current.contains(event.target as Node) &&
        !triggerRef.current.contains(event.target as Node)
      ) {
        onOpenChange(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen, closeOnClickOutside, onOpenChange]);

  // إغلاق النافذة عند الضغط على ESC
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onOpenChange(false);
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onOpenChange]);

  const getArrowStyles = () => {
    const arrowSize = 8;
    const baseStyles = "absolute w-0 h-0 border-solid";

    switch (finalPlacement) {
      case "top":
        return cn(
          baseStyles,
          "top-full left-1/2 -translate-x-1/2",
          "border-l-transparent border-r-transparent border-b-0",
          `border-l-[${arrowSize}px] border-r-[${arrowSize}px] border-t-[${arrowSize}px]`,
          "border-t-white",
        );
      case "bottom":
        return cn(
          baseStyles,
          "bottom-full left-1/2 -translate-x-1/2",
          "border-l-transparent border-r-transparent border-t-0",
          `border-l-[${arrowSize}px] border-r-[${arrowSize}px] border-b-[${arrowSize}px]`,
          "border-b-white",
        );
      case "left":
        return cn(
          baseStyles,
          "left-full top-1/2 -translate-y-1/2",
          "border-t-transparent border-b-transparent border-r-0",
          `border-t-[${arrowSize}px] border-b-[${arrowSize}px] border-l-[${arrowSize}px]`,
          "border-l-white",
        );
      case "right":
        return cn(
          baseStyles,
          "right-full top-1/2 -translate-y-1/2",
          "border-t-transparent border-b-transparent border-l-0",
          `border-t-[${arrowSize}px] border-b-[${arrowSize}px] border-r-[${arrowSize}px]`,
          "border-r-white",
        );
      default:
        return "";
    }
  };

  return (
    <div className={cn("relative inline-block", className)}>
      {/* العنصر المحفز */}
      <div
        ref={triggerRef}
        onClick={() => onOpenChange(!isOpen)}
        className="cursor-pointer"
      >
        {trigger}
      </div>

      {/* النافذة المنبثقة */}
      {isOpen && (
        <>
          {/* Backdrop للجوال */}
          <div className="fixed inset-0 z-40 bg-black/20 md:hidden" />

          {/* المحتوى */}
          <div
            ref={contentRef}
            style={position}
            className={cn(
              "fixed z-50 bg-white rounded-2xl shadow-xl border border-gray-200/50 backdrop-blur-lg",
              "transition-all duration-200 ease-out",
              "max-w-[calc(100vw-16px)] max-h-[calc(100vh-16px)] overflow-auto",
              contentClassName,
            )}
          >
            {/* السهم */}
            {showArrow && <div className={getArrowStyles()} />}

            {/* الرأس مع عنوان وزر إغلاق */}
            {(title || showCloseButton) && (
              <div className="flex items-center justify-between p-4 border-b border-gray-100">
                {title && (
                  <h3 className="text-lg font-semibold text-gray-900">
                    {title}
                  </h3>
                )}
                {showCloseButton && (
                  <button
                    onClick={() => onOpenChange(false)}
                    className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </button>
                )}
              </div>
            )}

            {/* المحتوى */}
            <div className={cn("p-4", (title || showCloseButton) && "pt-0")}>
              {children}
            </div>
          </div>
        </>
      )}
    </div>
  );
}

// مكون خاص للإشعارات
interface NotificationPopoverProps {
  trigger: React.ReactNode;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  notifications: any[];
  className?: string;
}

export function NotificationPopover({
  trigger,
  isOpen,
  onOpenChange,
  notifications,
  className = "",
}: NotificationPopoverProps) {
  const [activeTab, setActiveTab] = useState<"all" | "unread" | "messages">(
    "all",
  );

  const filteredNotifications = notifications.filter((notification) => {
    switch (activeTab) {
      case "unread":
        return !notification.read;
      case "messages":
        return notification.category === "message";
      default:
        return true;
    }
  });

  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <UnifiedPopover
      trigger={trigger}
      isOpen={isOpen}
      onOpenChange={onOpenChange}
      className={className}
      contentClassName="w-96"
      title="الإشعارات"
      showCloseButton
    >
      {/* تبويبات الإشعارات */}
      <div className="flex space-x-1 mb-4 bg-gray-100 rounded-lg p-1">
        {[
          { id: "all", label: "الكل", count: notifications.length },
          { id: "unread", label: "غير مقروءة", count: unreadCount },
          {
            id: "messages",
            label: "الرسائل",
            count: notifications.filter((n) => n.category === "message").length,
          },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={cn(
              "flex-1 px-3 py-2 text-sm font-medium rounded-md transition-colors",
              activeTab === tab.id
                ? "bg-white text-blue-600 shadow-sm"
                : "text-gray-600 hover:text-gray-900 hover:bg-gray-50",
            )}
          >
            {tab.label}
            {tab.count > 0 && (
              <span
                className={cn(
                  "ml-2 px-2 py-0.5 text-xs rounded-full",
                  activeTab === tab.id
                    ? "bg-blue-100 text-blue-600"
                    : "bg-gray-200 text-gray-600",
                )}
              >
                {tab.count}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* قائمة الإشعارات */}
      <div className="space-y-2 max-h-96 overflow-y-auto">
        {filteredNotifications.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <div className="w-16 h-16 mx-auto mb-3 bg-gray-100 rounded-full flex items-center justify-center">
              <i className="text-2xl">🔔</i>
            </div>
            <p>لا توجد إشعارات</p>
          </div>
        ) : (
          filteredNotifications.map((notification) => (
            <div
              key={notification.id}
              className={cn(
                "p-3 rounded-lg border transition-colors cursor-pointer",
                notification.read
                  ? "bg-gray-50 border-gray-200"
                  : "bg-blue-50 border-blue-200",
              )}
            >
              <div className="flex items-start gap-3">
                <div
                  className={cn(
                    "w-2 h-2 rounded-full mt-2",
                    notification.read ? "bg-gray-400" : "bg-blue-600",
                  )}
                />
                <div className="flex-1 min-w-0">
                  <h4 className="font-medium text-gray-900 truncate">
                    {notification.title}
                  </h4>
                  <p className="text-sm text-gray-600 mt-1">
                    {notification.message}
                  </p>
                  <p className="text-xs text-gray-500 mt-2">
                    {notification.timestamp}
                  </p>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* إجراءات سريعة */}
      {notifications.length > 0 && (
        <div className="mt-4 pt-4 border-t border-gray-100 flex justify-between">
          <button className="text-sm text-blue-600 hover:text-blue-700 font-medium">
            تحديد الكل كمقروء
          </button>
          <button className="text-sm text-gray-600 hover:text-gray-700 font-medium">
            عرض جميع الإشعارات
          </button>
        </div>
      )}
    </UnifiedPopover>
  );
}

// مكون خاص للملف الشخصي
interface ProfilePopoverProps {
  trigger: React.ReactNode;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  user: any;
  className?: string;
}

export function ProfilePopover({
  trigger,
  isOpen,
  onOpenChange,
  user,
  className = "",
}: ProfilePopoverProps) {
  return (
    <UnifiedPopover
      trigger={trigger}
      isOpen={isOpen}
      onOpenChange={onOpenChange}
      className={className}
      contentClassName="w-80"
    >
      {/* معلومات المستخدم */}
      <div className="flex items-center gap-3 mb-4">
        <img
          src={user.avatar}
          alt={user.name}
          className="w-12 h-12 rounded-xl object-cover ring-2 ring-blue-500/20"
        />
        <div>
          <h3 className="font-semibold text-gray-900">{user.name}</h3>
          <p className="text-sm text-gray-600">{user.email}</p>
        </div>
      </div>

      {/* روابط سريعة */}
      <div className="space-y-1">
        {[
          {
            label: "الملف الشخصي",
            href: "/dentist-hub?section=profile",
            icon: "👤",
          },
          {
            label: "الإعدادات",
            href: "/dentist-hub?section=settings",
            icon: "⚙️",
          },
          { label: "المساعدة", href: "/support", icon: "❓" },
        ].map((item) => (
          <a
            key={item.label}
            href={item.href}
            className="flex items-center gap-3 px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
            onClick={() => onOpenChange(false)}
          >
            <span>{item.icon}</span>
            <span>{item.label}</span>
          </a>
        ))}
      </div>

      {/* زر تسجيل الخروج */}
      <div className="mt-4 pt-4 border-t border-gray-100">
        <button className="w-full px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg transition-colors text-left">
          🚪 تسجيل الخروج
        </button>
      </div>
    </UnifiedPopover>
  );
}
