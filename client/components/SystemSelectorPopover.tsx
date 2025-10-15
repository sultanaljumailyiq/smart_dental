import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Settings,
  Monitor,
  Smartphone,
  Check,
  Building2,
  User,
  Shield,
  ChevronRight,
  Palette,
  Globe,
  Bell,
  Lock,
  HelpCircle,
  LogOut,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { sharedClinicData } from "@/services/sharedClinicData";

interface SystemSelectorPopoverProps {
  isOpen: boolean;
  onClose: () => void;
  userRole: "admin" | "dentist" | "patient" | "supplier";
  userName: string;
  userEmail: string;
}

const SystemSelectorPopover: React.FC<SystemSelectorPopoverProps> = ({
  isOpen,
  onClose,
  userRole,
  userName,
  userEmail,
}) => {
  const navigate = useNavigate();
  const [currentSystem, setCurrentSystem] = useState<"new" | "old">("new");
  const [isSystemAdmin, setIsSystemAdmin] = useState(false);

  useEffect(() => {
    // Load current system preference
    const loadSystemConfig = async () => {
      try {
        const config = await sharedClinicData.getSystemConfig();
        setCurrentSystem(config.defaultClinicSystem);
      } catch (error) {
        console.error("Failed to load system config:", error);
      }
    };

    loadSystemConfig();
    setIsSystemAdmin(userRole === "admin");
  }, [userRole]);

  const handleSystemChange = async (system: "new" | "old") => {
    try {
      await sharedClinicData.setSystemConfig({ defaultClinicSystem: system });
      setCurrentSystem(system);

      // Navigate to the selected system
      if (system === "new") {
        navigate("/clinic");
      } else {
        navigate("/clinic_old");
      }

      onClose();
    } catch (error) {
      console.error("Failed to update system config:", error);
    }
  };

  const menuItems = [
    {
      id: "profile",
      title: "الملف الشخصي",
      icon: User,
      action: () => navigate("/profile"),
      show: true,
    },
    {
      id: "system-admin",
      title: "��دارة النظام",
      icon: Shield,
      action: () => navigate("/admin"),
      show: isSystemAdmin,
      description: "لوحة تحكم النظام العامة",
    },
    {
      id: "clinic-new",
      title: "إدارة العيادة (الجديد)",
      icon: Smartphone,
      action: () => handleSystemChange("new"),
      show: userRole === "dentist" || isSystemAdmin,
      description: "نظام محسن للهاتف",
      isActive: currentSystem === "new",
    },
    {
      id: "clinic-old",
      title: "إدارة العيادة (التقليدي)",
      icon: Monitor,
      action: () => handleSystemChange("old"),
      show: userRole === "dentist" || isSystemAdmin,
      description: "النظام التقليدي",
      isActive: currentSystem === "old",
    },
    {
      id: "store",
      title: "المتجر",
      icon: Building2,
      action: () => navigate("/dental-supply"),
      show: true,
    },
    {
      id: "community",
      title: "المجتمع الطبي",
      icon: Globe,
      action: () => navigate("/community"),
      show: true,
    },
    {
      id: "jobs",
      title: "التوظيف",
      icon: User,
      action: () => navigate("/jobs"),
      show: true,
    },
    {
      id: "notifications",
      title: "الإشعارات",
      icon: Bell,
      action: () => navigate("/dentist-hub/notifications"),
      show: true,
    },
    {
      id: "settings",
      title: "إعدادات النظام",
      icon: Settings,
      action: () => navigate("/admin/settings"),
      show: true,
    },
    {
      id: "help",
      title: "المساعدة",
      icon: HelpCircle,
      action: () => navigate("/help"),
      show: true,
    },
  ];

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50" onClick={onClose}>
      <div
        className="absolute top-16 left-4 w-80 bg-white rounded-2xl shadow-2xl border border-gray-200 overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* User Info Header */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-6 text-white">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
              <User className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-bold">{userName}</h3>
              <p className="text-blue-100 text-sm">{userEmail}</p>
              <div className="flex items-center gap-2 mt-1">
                <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                <span className="text-blue-100 text-xs">
                  {userRole === "admin"
                    ? "مدير النظام"
                    : userRole === "dentist"
                      ? "طبيب أسنان"
                      : userRole === "supplier"
                        ? "مورد"
                        : "مريض"}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* System Selection (Only for dentists and admins) */}
        {(userRole === "dentist" || isSystemAdmin) && (
          <div className="p-4 border-b border-gray-100">
            <h4 className="text-sm font-medium text-gray-900 mb-3">
              نظام إدارة العيادة
            </h4>
            <div className="space-y-2">
              <button
                onClick={() => handleSystemChange("new")}
                className={cn(
                  "w-full flex items-center gap-3 p-3 rounded-lg transition-colors text-right",
                  currentSystem === "new"
                    ? "bg-blue-50 border-2 border-blue-200 text-blue-900"
                    : "hover:bg-gray-50 border-2 border-transparent",
                )}
              >
                <Smartphone className="w-5 h-5" />
                <div className="flex-1">
                  <p className="font-medium">النظام المحسن</p>
                  <p className="text-xs text-gray-600">
                    مناسب للهاتف والجهاز اللوحي
                  </p>
                </div>
                {currentSystem === "new" && (
                  <Check className="w-5 h-5 text-blue-600" />
                )}
              </button>

              <button
                onClick={() => handleSystemChange("old")}
                className={cn(
                  "w-full flex items-center gap-3 p-3 rounded-lg transition-colors text-right",
                  currentSystem === "old"
                    ? "bg-blue-50 border-2 border-blue-200 text-blue-900"
                    : "hover:bg-gray-50 border-2 border-transparent",
                )}
              >
                <Monitor className="w-5 h-5" />
                <div className="flex-1">
                  <p className="font-medium">النظام التقليدي</p>
                  <p className="text-xs text-gray-600">مناسب للحاسوب المكتبي</p>
                </div>
                {currentSystem === "old" && (
                  <Check className="w-5 h-5 text-blue-600" />
                )}
              </button>
            </div>
          </div>
        )}

        {/* Menu Items */}
        <div className="py-2">
          {menuItems
            .filter((item) => item.show)
            .map((item) => (
              <button
                key={item.id}
                onClick={item.action}
                className={cn(
                  "w-full flex items-center gap-3 px-4 py-3 hover:bg-gray-50 transition-colors text-right",
                  item.isActive && "bg-blue-50 text-blue-900",
                )}
              >
                <item.icon
                  className={cn(
                    "w-5 h-5",
                    item.isActive ? "text-blue-600" : "text-gray-600",
                  )}
                />
                <div className="flex-1">
                  <p
                    className={cn(
                      "font-medium",
                      item.isActive ? "text-blue-900" : "text-gray-900",
                    )}
                  >
                    {item.title}
                  </p>
                  {item.description && (
                    <p className="text-xs text-gray-600">{item.description}</p>
                  )}
                </div>
                <ChevronRight className="w-4 h-4 text-gray-400" />
              </button>
            ))}
        </div>

        {/* System Info (Only for admins) */}
        {isSystemAdmin && (
          <div className="border-t border-gray-100 p-4">
            <div className="bg-gray-50 rounded-lg p-3">
              <div className="flex items-center gap-2 mb-2">
                <Shield className="w-4 h-4 text-gray-600" />
                <span className="text-sm font-medium text-gray-900">
                  إعدادات النظام
                </span>
              </div>
              <p className="text-xs text-gray-600">
                النظام الحالي: {currentSystem === "new" ? "المحسن" : "التقليدي"}
              </p>
              <p className="text-xs text-gray-600">
                يمكن للأطباء اختيار النظام المفضل
              </p>
            </div>
          </div>
        )}

        {/* Logout */}
        <div className="border-t border-gray-100 p-2">
          <button
            onClick={() => {
              // Handle logout
              navigate("/signin");
              onClose();
            }}
            className="w-full flex items-center gap-3 px-4 py-3 hover:bg-red-50 text-red-600 transition-colors text-right"
          >
            <LogOut className="w-5 h-5" />
            <span className="font-medium">تسجيل الخروج</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default SystemSelectorPopover;
