import React, { useEffect, useRef } from "react";
import { X, LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

interface ClinicModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  description?: string;
  icon?: LucideIcon;
  children: React.ReactNode;
  footer?: React.ReactNode;
  size?: "sm" | "md" | "lg" | "xl" | "full";
  className?: string;
}

export function ClinicModal({
  isOpen,
  onClose,
  title,
  description,
  icon: Icon,
  children,
  footer,
  size = "md",
  className
}: ClinicModalProps) {
  const modalRef = useRef<HTMLDivElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const previousActiveElementRef = useRef<HTMLElement | null>(null);

  // Focus management and accessibility
  useEffect(() => {
    if (isOpen) {
      // Store the currently focused element
      previousActiveElementRef.current = document.activeElement as HTMLElement;
      
      // Focus the modal content on open
      setTimeout(() => {
        if (closeButtonRef.current) {
          closeButtonRef.current.focus();
        } else if (modalRef.current) {
          modalRef.current.focus();
        }
      }, 100);
    } else {
      // Restore focus to the previously focused element when closing
      if (previousActiveElementRef.current) {
        previousActiveElementRef.current.focus();
      }
    }
  }, [isOpen]);

  // Focus trap - keep focus within modal
  useEffect(() => {
    if (!isOpen) return;

    const handleTabKey = (e: KeyboardEvent) => {
      if (e.key !== "Tab" || !modalRef.current) return;

      const focusableElements = modalRef.current.querySelectorAll(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      );
      const firstElement = focusableElements[0] as HTMLElement;
      const lastElement = focusableElements[focusableElements.length - 1] as HTMLElement;

      if (e.shiftKey && document.activeElement === firstElement) {
        e.preventDefault();
        lastElement?.focus();
      } else if (!e.shiftKey && document.activeElement === lastElement) {
        e.preventDefault();
        firstElement?.focus();
      }
    };

    document.addEventListener("keydown", handleTabKey);
    return () => document.removeEventListener("keydown", handleTabKey);
  }, [isOpen]);

  // Close on escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };

    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [isOpen, onClose]);

  // Prevent body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const sizeClasses = {
    sm: "max-w-md",
    md: "max-w-2xl",
    lg: "max-w-4xl",
    xl: "max-w-6xl",
    full: "max-w-[95vw]"
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
      aria-describedby={description ? "modal-description" : undefined}
    >
      <div
        ref={modalRef}
        className={cn(
          "bg-white rounded-2xl shadow-2xl w-full max-h-[90vh] flex flex-col animate-in zoom-in-95 duration-200",
          sizeClasses[size],
          className
        )}
        onClick={(e) => e.stopPropagation()}
        tabIndex={-1}
      >
        {/* Header */}
        <div className="flex items-start gap-4 p-6 border-b border-gray-200">
          {Icon && (
            <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center">
              <Icon className="w-6 h-6 text-white" />
            </div>
          )}
          
          <div className="flex-1 min-w-0">
            <h2 id="modal-title" className="text-xl font-bold text-gray-900 truncate">{title}</h2>
            {description && (
              <p id="modal-description" className="text-sm text-gray-600 mt-1 line-clamp-2">{description}</p>
            )}
          </div>

          <button
            ref={closeButtonRef}
            onClick={onClose}
            className="flex-shrink-0 p-2 hover:bg-gray-100 rounded-lg transition-colors"
            aria-label="Close modal"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto p-6">
          {children}
        </div>

        {/* Footer */}
        {footer && (
          <div className="border-t border-gray-200 px-6 py-4 flex items-center justify-end gap-3 bg-gray-50 rounded-b-2xl">
            {footer}
          </div>
        )}
      </div>
    </div>
  );
}

interface ConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  description: string;
  confirmText?: string;
  cancelText?: string;
  variant?: "danger" | "warning" | "info";
}

export function ConfirmModal({
  isOpen,
  onClose,
  onConfirm,
  title,
  description,
  confirmText = "تأكيد",
  cancelText = "إلغاء",
  variant = "info"
}: ConfirmModalProps) {
  const variantConfig = {
    danger: {
      color: "from-red-500 to-red-600",
      buttonClass: "bg-red-600 hover:bg-red-700"
    },
    warning: {
      color: "from-yellow-500 to-yellow-600",
      buttonClass: "bg-yellow-600 hover:bg-yellow-700"
    },
    info: {
      color: "from-blue-500 to-blue-600",
      buttonClass: "bg-blue-600 hover:bg-blue-700"
    }
  };

  const config = variantConfig[variant];

  return (
    <ClinicModal
      isOpen={isOpen}
      onClose={onClose}
      title={title}
      description={description}
      size="sm"
      footer={
        <>
          <Button
            variant="outline"
            onClick={onClose}
          >
            {cancelText}
          </Button>
          <Button
            onClick={() => {
              onConfirm();
              onClose();
            }}
            className={config.buttonClass}
          >
            {confirmText}
          </Button>
        </>
      }
    >
      <p className="text-gray-700">{description}</p>
    </ClinicModal>
  );
}
