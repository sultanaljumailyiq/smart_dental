import React, { useEffect, useRef } from "react";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";

interface EnhancedModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  size?: "sm" | "md" | "lg" | "xl" | "full";
  position?: "center" | "top" | "bottom";
  showCloseButton?: boolean;
  preventBackdropClose?: boolean;
  className?: string;
  backdropClassName?: string;
}

const sizeClasses = {
  sm: "max-w-sm",
  md: "max-w-md",
  lg: "max-w-lg",
  xl: "max-w-xl",
  full: "max-w-full mx-4",
};

const positionClasses = {
  center: "items-center justify-center",
  top: "items-start justify-center pt-20",
  bottom: "items-end justify-center pb-20",
};

export default function EnhancedModal({
  isOpen,
  onClose,
  title,
  children,
  size = "md",
  position = "center",
  showCloseButton = true,
  preventBackdropClose = false,
  className = "",
  backdropClassName = "",
}: EnhancedModalProps) {
  const modalRef = useRef<HTMLDivElement>(null);
  const previousActiveElement = useRef<HTMLElement | null>(null);

  // حفظ العنصر النشط السابق وتركيز Modal عند فتحه
  useEffect(() => {
    if (isOpen) {
      previousActiveElement.current = document.activeElement as HTMLElement;

      // تأخير بسيط للسماح للعنصر بالظهور أولاً
      const timer = setTimeout(() => {
        if (modalRef.current) {
          modalRef.current.focus();
        }
      }, 100);

      // منع التمرير في الخلفية
      document.body.style.overflow = "hidden";

      return () => {
        clearTimeout(timer);
        document.body.style.overflow = "unset";
      };
    } else {
      // إعادة التركيز للعنصر السابق عند الإغلاق
      if (previousActiveElement.current) {
        previousActiveElement.current.focus();
      }
      document.body.style.overflow = "unset";
    }
  }, [isOpen]);

  // إغلاق عند الضغط على Escape
  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape" && isOpen) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener("keydown", handleEscape);
      return () => document.removeEventListener("keydown", handleEscape);
    }
  }, [isOpen, onClose]);

  // إغلاق عند النقر على الخلفية
  const handleBackdropClick = (event: React.MouseEvent) => {
    if (!preventBackdropClose && event.target === event.currentTarget) {
      onClose();
    }
  };

  if (!isOpen) {
    return null;
  }

  return (
    <div
      className={cn(
        "fixed inset-0 z-50 flex transition-all duration-300 ease-out",
        positionClasses[position],
        backdropClassName,
      )}
      onClick={handleBackdropClick}
      dir="rtl"
    >
      {/* خلفية مظلمة */}
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm animate-in fade-in-0 duration-300" />

      {/* المحتوى */}
      <div
        ref={modalRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={title ? "modal-title" : undefined}
        tabIndex={-1}
        className={cn(
          "relative bg-white rounded-2xl shadow-2xl transform transition-all duration-300 ease-out animate-in zoom-in-95 slide-in-from-bottom-4",
          "max-h-[90vh] overflow-hidden flex flex-col",
          sizeClasses[size],
          className,
        )}
        onClick={(e) => e.stopPropagation()}
      >
        {/* رأس Modal */}
        {(title || showCloseButton) && (
          <div className="flex items-center justify-between p-6 border-b border-gray-200">
            {title && (
              <h2 id="modal-title" className="text-xl font-bold text-gray-900">
                {title}
              </h2>
            )}
            {showCloseButton && (
              <button
                onClick={onClose}
                className="p-2 hover:bg-gray-100 rounded-xl transition-colors"
                aria-label="إغلاق النافذة"
              >
                <X className="w-5 h-5 text-gray-500" />
              </button>
            )}
          </div>
        )}

        {/* محتوى Modal */}
        <div className="flex-1 overflow-y-auto p-6">{children}</div>
      </div>
    </div>
  );
}

// Hook لإدارة حالة Modal
export function useModal() {
  const [isOpen, setIsOpen] = React.useState(false);

  const openModal = React.useCallback(() => setIsOpen(true), []);
  const closeModal = React.useCallback(() => setIsOpen(false), []);
  const toggleModal = React.useCallback(() => setIsOpen((prev) => !prev), []);

  return {
    isOpen,
    openModal,
    closeModal,
    toggleModal,
  };
}

// مكون Confirm Dialog
interface ConfirmDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  variant?: "danger" | "warning" | "info";
}

export function ConfirmDialog({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = "تأكيد",
  cancelText = "إلغاء",
  variant = "info",
}: ConfirmDialogProps) {
  const variantStyles = {
    danger: {
      button: "bg-red-600 hover:bg-red-700 text-white",
      icon: "text-red-600",
    },
    warning: {
      button: "bg-yellow-600 hover:bg-yellow-700 text-white",
      icon: "text-yellow-600",
    },
    info: {
      button: "bg-blue-600 hover:bg-blue-700 text-white",
      icon: "text-blue-600",
    },
  };

  const handleConfirm = () => {
    onConfirm();
    onClose();
  };

  return (
    <EnhancedModal
      isOpen={isOpen}
      onClose={onClose}
      title={title}
      size="sm"
      showCloseButton={false}
    >
      <div className="text-center">
        <p className="text-gray-600 mb-6">{message}</p>

        <div className="flex gap-3 justify-center">
          <button
            onClick={onClose}
            className="px-6 py-2 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors"
          >
            {cancelText}
          </button>
          <button
            onClick={handleConfirm}
            className={cn(
              "px-6 py-2 rounded-xl font-medium transition-colors",
              variantStyles[variant].button,
            )}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </EnhancedModal>
  );
}
