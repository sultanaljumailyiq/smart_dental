import React, { useState, useEffect, useCallback } from "react";
import { createPortal } from "react-dom";
import {
  X,
  Maximize2,
  Minimize2,
  Move,
  Info,
  AlertTriangle,
  CheckCircle,
  AlertCircle,
  HelpCircle,
  Settings,
  Calendar,
  Phone,
  Mail,
  MessageSquare,
} from "lucide-react";
import { cn } from "@/lib/utils";

// Modal types
export type ModalType =
  | "info"
  | "warning"
  | "success"
  | "error"
  | "question"
  | "custom";
export type ModalSize = "sm" | "md" | "lg" | "xl" | "full";
export type ModalPosition =
  | "center"
  | "top"
  | "bottom"
  | "left"
  | "right"
  | "custom";

// Modal configuration
interface FloatingModalConfig {
  id: string;
  type: ModalType;
  title: string;
  content: React.ReactNode;
  size?: ModalSize;
  position?: ModalPosition;
  customPosition?: { x: number; y: number };
  closable?: boolean;
  draggable?: boolean;
  resizable?: boolean;
  persistent?: boolean;
  backdrop?: boolean;
  backdropClosable?: boolean;
  animation?: "fade" | "slide" | "scale" | "bounce";
  onClose?: () => void;
  onConfirm?: () => void;
  onCancel?: () => void;
  autoClose?: number; // milliseconds
  className?: string;
  buttons?: Array<{
    label: string;
    variant: "primary" | "secondary" | "danger" | "success";
    onClick: () => void;
  }>;
}

// Modal context
interface ModalContextType {
  modals: FloatingModalConfig[];
  openModal: (config: Omit<FloatingModalConfig, "id">) => string;
  closeModal: (id: string) => void;
  closeAllModals: () => void;
  updateModal: (id: string, updates: Partial<FloatingModalConfig>) => void;
}

const ModalContext = React.createContext<ModalContextType | undefined>(
  undefined,
);

// Modal provider
export const FloatingModalProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [modals, setModals] = useState<FloatingModalConfig[]>([]);

  const openModal = useCallback((config: Omit<FloatingModalConfig, "id">) => {
    const id = `modal-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    const modal: FloatingModalConfig = {
      id,
      size: "md",
      position: "center",
      closable: true,
      draggable: true,
      resizable: false,
      persistent: false,
      backdrop: true,
      backdropClosable: true,
      animation: "scale",
      ...config,
    };

    setModals((prev) => [...prev, modal]);

    // Auto close if specified
    if (modal.autoClose) {
      setTimeout(() => {
        closeModal(id);
      }, modal.autoClose);
    }

    return id;
  }, []);

  const closeModal = useCallback((id: string) => {
    setModals((prev) => {
      const modal = prev.find((m) => m.id === id);
      if (modal?.onClose) {
        modal.onClose();
      }
      return prev.filter((m) => m.id !== id);
    });
  }, []);

  const closeAllModals = useCallback(() => {
    setModals((prev) => {
      prev.forEach((modal) => {
        if (modal.onClose) modal.onClose();
      });
      return [];
    });
  }, []);

  const updateModal = useCallback(
    (id: string, updates: Partial<FloatingModalConfig>) => {
      setModals((prev) =>
        prev.map((modal) =>
          modal.id === id ? { ...modal, ...updates } : modal,
        ),
      );
    },
    [],
  );

  const value = {
    modals,
    openModal,
    closeModal,
    closeAllModals,
    updateModal,
  };

  return (
    <ModalContext.Provider value={value}>
      {children}
      <FloatingModalRenderer />
    </ModalContext.Provider>
  );
};

// Hook to use modal context
export const useFloatingModal = () => {
  const context = React.useContext(ModalContext);
  if (!context) {
    throw new Error(
      "useFloatingModal must be used within FloatingModalProvider",
    );
  }
  return context;
};

// Modal renderer component
const FloatingModalRenderer: React.FC = () => {
  const { modals } = useFloatingModal();

  if (typeof window === "undefined") return null;

  return createPortal(
    <div className="modal-container">
      {modals.map((modal, index) => (
        <FloatingModalWindow
          key={modal.id}
          modal={modal}
          zIndex={1000 + index}
        />
      ))}
    </div>,
    document.body,
  );
};

// Individual modal window component
const FloatingModalWindow: React.FC<{
  modal: FloatingModalConfig;
  zIndex: number;
}> = ({ modal, zIndex }) => {
  const { closeModal, updateModal } = useFloatingModal();
  const [isDragging, setIsDragging] = useState(false);
  const [isMaximized, setIsMaximized] = useState(false);
  const [position, setPosition] = useState(
    modal.customPosition || { x: 0, y: 0 },
  );
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });

  // Size classes
  const sizeClasses = {
    sm: "w-80 max-w-sm",
    md: "w-96 max-w-md",
    lg: "w-[32rem] max-w-lg",
    xl: "w-[48rem] max-w-2xl",
    full: "w-full h-full max-w-none",
  };

  // Position classes
  const getPositionClasses = () => {
    if (isMaximized) return "inset-4";

    switch (modal.position) {
      case "top":
        return "top-8 left-1/2 transform -translate-x-1/2";
      case "bottom":
        return "bottom-8 left-1/2 transform -translate-x-1/2";
      case "left":
        return "left-8 top-1/2 transform -translate-y-1/2";
      case "right":
        return "right-8 top-1/2 transform -translate-y-1/2";
      case "custom":
        return "";
      default:
        return "top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2";
    }
  };

  // Animation classes
  const animationClasses = {
    fade: "animate-fade-in",
    slide: "animate-slide-in",
    scale: "animate-scale-in",
    bounce: "animate-bounce-in",
  };

  // Icon for modal type
  const getTypeIcon = () => {
    const iconProps = { className: "w-5 h-5" };
    switch (modal.type) {
      case "info":
        return <Info {...iconProps} className="w-5 h-5 text-blue-500" />;
      case "warning":
        return (
          <AlertTriangle {...iconProps} className="w-5 h-5 text-yellow-500" />
        );
      case "success":
        return (
          <CheckCircle {...iconProps} className="w-5 h-5 text-green-500" />
        );
      case "error":
        return <AlertCircle {...iconProps} className="w-5 h-5 text-red-500" />;
      case "question":
        return (
          <HelpCircle {...iconProps} className="w-5 h-5 text-purple-500" />
        );
      default:
        return null;
    }
  };

  // Color classes for modal type
  const getTypeColorClasses = () => {
    switch (modal.type) {
      case "info":
        return "border-blue-200 bg-blue-50/50";
      case "warning":
        return "border-yellow-200 bg-yellow-50/50";
      case "success":
        return "border-green-200 bg-green-50/50";
      case "error":
        return "border-red-200 bg-red-50/50";
      case "question":
        return "border-purple-200 bg-purple-50/50";
      default:
        return "border-gray-200";
    }
  };

  // Handle drag
  const handleMouseDown = (e: React.MouseEvent) => {
    if (!modal.draggable) return;

    setIsDragging(true);
    setDragStart({
      x: e.clientX - position.x,
      y: e.clientY - position.y,
    });
  };

  const handleMouseMove = useCallback(
    (e: MouseEvent) => {
      if (!isDragging || !modal.draggable) return;

      setPosition({
        x: e.clientX - dragStart.x,
        y: e.clientY - dragStart.y,
      });
    },
    [isDragging, dragStart, modal.draggable],
  );

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
  }, []);

  useEffect(() => {
    if (isDragging) {
      document.addEventListener("mousemove", handleMouseMove);
      document.addEventListener("mouseup", handleMouseUp);

      return () => {
        document.removeEventListener("mousemove", handleMouseMove);
        document.removeEventListener("mouseup", handleMouseUp);
      };
    }
  }, [isDragging, handleMouseMove, handleMouseUp]);

  // Handle backdrop click
  const handleBackdropClick = (e: React.MouseEvent) => {
    if (
      e.target === e.currentTarget &&
      modal.backdropClosable &&
      !modal.persistent
    ) {
      closeModal(modal.id);
    }
  };

  // Handle close
  const handleClose = () => {
    if (modal.closable && !modal.persistent) {
      closeModal(modal.id);
    }
  };

  // Toggle maximize
  const toggleMaximize = () => {
    setIsMaximized(!isMaximized);
  };

  return (
    <>
      {/* Backdrop */}
      {modal.backdrop && (
        <div
          className="fixed inset-0 bg-black/20 backdrop-blur-sm animate-fade-in"
          style={{ zIndex: zIndex - 1 }}
          onClick={handleBackdropClick}
        />
      )}

      {/* Modal Window */}
      <div
        className={cn(
          "fixed bg-white rounded-2xl shadow-2xl border",
          sizeClasses[modal.size || "md"],
          getTypeColorClasses(),
          animationClasses[modal.animation || "scale"],
          modal.position === "custom" ? "" : getPositionClasses(),
          modal.className,
          isDragging && "cursor-grabbing",
          isMaximized && "rounded-none",
        )}
        style={{
          zIndex,
          ...(modal.position === "custom" && {
            left: position.x,
            top: position.y,
            transform: "none",
          }),
        }}
      >
        {/* Header */}
        <div
          className={cn(
            "flex items-center justify-between p-4 border-b border-gray-200/50 rounded-t-2xl",
            modal.draggable && "cursor-grab active:cursor-grabbing",
            isMaximized && "rounded-none",
          )}
          onMouseDown={handleMouseDown}
        >
          <div className="flex items-center gap-3">
            {getTypeIcon()}
            <h3 className="text-lg font-semibold text-gray-900">
              {modal.title}
            </h3>
          </div>

          <div className="flex items-center gap-2">
            {/* Minimize/Maximize button */}
            {modal.resizable && (
              <button
                onClick={toggleMaximize}
                className="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                title={isMaximized ? "تصغير" : "تكبير"}
              >
                {isMaximized ? (
                  <Minimize2 className="w-4 h-4" />
                ) : (
                  <Maximize2 className="w-4 h-4" />
                )}
              </button>
            )}

            {/* Draggable indicator */}
            {modal.draggable && (
              <div className="p-1.5 text-gray-400">
                <Move className="w-4 h-4" />
              </div>
            )}

            {/* Close button */}
            {modal.closable && (
              <button
                onClick={handleClose}
                className="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                title="إغلاق"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>

        {/* Content */}
        <div className="p-6">{modal.content}</div>

        {/* Footer with buttons */}
        {modal.buttons && modal.buttons.length > 0 && (
          <div className="flex items-center justify-end gap-3 p-4 border-t border-gray-200/50 bg-gray-50/50 rounded-b-2xl">
            {modal.buttons.map((button, index) => (
              <button
                key={index}
                onClick={button.onClick}
                className={cn(
                  "px-4 py-2 rounded-lg font-medium transition-colors",
                  {
                    "bg-purple-600 text-white hover:bg-purple-700":
                      button.variant === "primary",
                    "bg-gray-200 text-gray-700 hover:bg-gray-300":
                      button.variant === "secondary",
                    "bg-red-600 text-white hover:bg-red-700":
                      button.variant === "danger",
                    "bg-green-600 text-white hover:bg-green-700":
                      button.variant === "success",
                  },
                )}
              >
                {button.label}
              </button>
            ))}
          </div>
        )}
      </div>
    </>
  );
};

// Predefined modal components
export const useModalHelpers = () => {
  const { openModal, closeModal } = useFloatingModal();

  const showAlert = (
    title: string,
    content: React.ReactNode,
    type: ModalType = "info",
  ) => {
    return openModal({
      type,
      title,
      content,
      size: "md",
      buttons: [
        {
          label: "موافق",
          variant: "primary",
          onClick: () => closeModal,
        },
      ],
    });
  };

  const showConfirm = (
    title: string,
    content: React.ReactNode,
    onConfirm: () => void,
    onCancel?: () => void,
  ) => {
    return openModal({
      type: "question",
      title,
      content,
      size: "md",
      buttons: [
        {
          label: "إلغاء",
          variant: "secondary",
          onClick: () => {
            if (onCancel) onCancel();
            closeModal;
          },
        },
        {
          label: "تأكيد",
          variant: "primary",
          onClick: () => {
            onConfirm();
            closeModal;
          },
        },
      ],
    });
  };

  const showSuccess = (
    title: string,
    content: React.ReactNode,
    autoClose = 3000,
  ) => {
    return openModal({
      type: "success",
      title,
      content,
      size: "md",
      autoClose,
      buttons: [
        {
          label: "موافق",
          variant: "success",
          onClick: () => closeModal,
        },
      ],
    });
  };

  const showError = (title: string, content: React.ReactNode) => {
    return openModal({
      type: "error",
      title,
      content,
      size: "md",
      buttons: [
        {
          label: "موافق",
          variant: "danger",
          onClick: () => closeModal,
        },
      ],
    });
  };

  const showLoading = (title: string, content?: React.ReactNode) => {
    return openModal({
      type: "info",
      title,
      content: content || (
        <div className="flex items-center gap-3">
          <div className="w-6 h-6 border-2 border-purple-600 border-t-transparent rounded-full animate-spin"></div>
          <span>جارٍ التحميل...</span>
        </div>
      ),
      size: "sm",
      closable: false,
      backdrop: true,
      backdropClosable: false,
      persistent: true,
    });
  };

  return {
    showAlert,
    showConfirm,
    showSuccess,
    showError,
    showLoading,
    openModal,
    closeModal,
  };
};

// Animation keyframes (add to global CSS)
export const floatingModalStyles = `
  @keyframes fade-in {
    from { opacity: 0; }
    to { opacity: 1; }
  }
  
  @keyframes slide-in {
    from { 
      opacity: 0;
      transform: translateY(-20px);
    }
    to { 
      opacity: 1;
      transform: translateY(0);
    }
  }
  
  @keyframes scale-in {
    from { 
      opacity: 0;
      transform: scale(0.95);
    }
    to { 
      opacity: 1;
      transform: scale(1);
    }
  }
  
  @keyframes bounce-in {
    0% { 
      opacity: 0;
      transform: scale(0.3);
    }
    50% { 
      opacity: 1;
      transform: scale(1.05);
    }
    70% { 
      transform: scale(0.9);
    }
    100% { 
      opacity: 1;
      transform: scale(1);
    }
  }
  
  .animate-fade-in { animation: fade-in 0.2s ease-out; }
  .animate-slide-in { animation: slide-in 0.3s ease-out; }
  .animate-scale-in { animation: scale-in 0.2s ease-out; }
  .animate-bounce-in { animation: bounce-in 0.5s ease-out; }
`;

export default FloatingModalProvider;
