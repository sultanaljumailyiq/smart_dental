import React, { useState, useEffect } from "react";
import {
  Palette,
  Type,
  Layout,
  Monitor,
  Bell,
  Zap,
  Save,
  RefreshCw,
  Eye,
  Download,
  Upload,
} from "lucide-react";
import { cn } from "@/lib/utils";

// نظام التحكم في المظهر للمد��ر
// يتضمن: الخطوط، قوالب الألوان، أحجام الصفحة، قوالب الإشعارات والنوافذ المنبثقة

interface AdminThemeControlProps {
  userRole?: string;
  className?: string;
}

export const AdminThemeControl: React.FC<AdminThemeControlProps> = ({
  userRole,
  className,
}) => {
  const [activeTab, setActiveTab] = useState("colors");
  const [selectedColorTheme, setSelectedColorTheme] = useState("medical-blue");
  const [selectedFont, setSelectedFont] = useState("inter");
  const [pageWidth, setPageWidth] = useState(1200);
  const [notificationStyle, setNotificationStyle] = useState("modern");

  // تطبيق التغييرات على النظام فوراً (مبسط)
  const applyTheme = (theme: string) => {
    // فقط حفظ الثيم المختار
    localStorage.setItem("admin-theme", theme);
  };

  // تطبيق الخط (مبسط)
  const applyFont = (font: string) => {
    localStorage.setItem("admin-font", font);
  };

  // تطبيق عرض الصفحة (مبسط)
  const applyPageWidth = (width: number) => {
    localStorage.setItem("admin-page-width", width.toString());
  };

  // تحميل الإعدادات المحفوظة (مبسط)
  useEffect(() => {
    const savedTheme = localStorage.getItem("admin-theme");
    const savedFont = localStorage.getItem("admin-font");
    const savedWidth = localStorage.getItem("admin-page-width");

    if (savedTheme) {
      setSelectedColorTheme(savedTheme);
    }
    if (savedFont) {
      setSelectedFont(savedFont);
    }
    if (savedWidth) {
      const width = parseInt(savedWidth);
      setPageWidth(width);
    }
  }, []);

  // التحقق من صلاحيات المدير
  if (userRole !== "admin") {
    return (
      <div className="p-6 bg-red-50 border border-red-200 rounded-lg">
        <h3 className="text-red-800 font-semibold mb-2">غير مسموح</h3>
        <p className="text-red-600">هذا القسم متاح للمديرين فقط</p>
      </div>
    );
  }

  const tabs = [
    { id: "colors", label: "قوالب الألوان", icon: Palette },
    { id: "fonts", label: "الخطوط", icon: Type },
    { id: "layout", label: "تخطيط الصفحة", icon: Layout },
    { id: "notifications", label: "قوالب الإشعارات", icon: Bell },
    { id: "popups", label: "النوافذ المنبثقة", icon: Zap },
  ];

  // قوالب الألوان
  const colorThemes = [
    {
      id: "medical-blue",
      name: "الأزرق الطبي",
      primary: "#3b82f6",
      secondary: "#0ea5e9",
      accent: "#06b6d4",
      preview: "bg-gradient-to-r from-blue-500 to-blue-600",
    },
    {
      id: "dental-green",
      name: "الأخضر الطبي",
      primary: "#22c55e",
      secondary: "#16a34a",
      accent: "#15803d",
      preview: "bg-gradient-to-r from-green-500 to-green-600",
    },
    {
      id: "professional-purple",
      name: "البنفسجي المهني",
      primary: "#8b5cf6",
      secondary: "#7c3aed",
      accent: "#6d28d9",
      preview: "bg-gradient-to-r from-purple-500 to-purple-600",
    },
    {
      id: "warm-orange",
      name: "البرتقالي الدافئ",
      primary: "#f59e0b",
      secondary: "#d97706",
      accent: "#b45309",
      preview: "bg-gradient-to-r from-orange-500 to-orange-600",
    },
    {
      id: "modern-gray",
      name: "الرمادي العصري",
      primary: "#64748b",
      secondary: "#475569",
      accent: "#334155",
      preview: "bg-gradient-to-r from-gray-500 to-gray-600",
    },
  ];

  // خيارات الخطوط
  const fontOptions = [
    {
      id: "inter",
      name: "Inter",
      sample: "منصة طب الأسنان",
      className: "font-sans",
    },
    {
      id: "cairo",
      name: "Cairo",
      sample: "منصة طب الأسنان",
      className: "font-arabic",
    },
    {
      id: "tajawal",
      name: "Tajawal",
      sample: "منصة طب الأسنان",
      className: "font-arabic",
    },
    {
      id: "roboto",
      name: "Roboto",
      sample: "منصة طب الأسنان",
      className: "font-sans",
    },
    {
      id: "system",
      name: "System Font",
      sample: "منصة طب الأسنان",
      className: "font-system",
    },
  ];

  // أنماط الإشعارات
  const notificationStyles = [
    {
      id: "modern",
      name: "عصري",
      preview: "rounded-xl shadow-lg bg-white border-l-4 border-blue-500",
    },
    {
      id: "minimal",
      name: "بسيط",
      preview: "rounded-lg shadow-sm bg-gray-50 border border-gray-200",
    },
    {
      id: "medical",
      name: "طبي",
      preview:
        "rounded-2xl shadow-xl bg-gradient-to-r from-blue-50 to-indigo-50 border-2 border-blue-200",
    },
    {
      id: "professional",
      name: "مهني",
      preview: "rounded-lg shadow-md bg-white border-t-4 border-indigo-600",
    },
  ];

  const handleSaveTheme = () => {
    // حفظ إعدادات المظهر
    const themeSettings = {
      colorTheme: selectedColorTheme,
      font: selectedFont,
      pageWidth,
      notificationStyle,
      timestamp: new Date().toISOString(),
    };

    localStorage.setItem("adminThemeSettings", JSON.stringify(themeSettings));

    // تطبيق التغييرات على النظام
    document.documentElement.style.setProperty(
      "--page-max-width",
      `${pageWidth}px`,
    );

    alert("تم حفظ إعدادات المظهر بنجاح!");
  };

  const handleExportTheme = () => {
    const themeData = {
      colorTheme: selectedColorTheme,
      font: selectedFont,
      pageWidth,
      notificationStyle,
      exportDate: new Date().toISOString(),
    };

    const blob = new Blob([JSON.stringify(themeData, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "dental-platform-theme.json";
    a.click();
  };

  return (
    <div className={cn("space-y-6", className)}>
      {/* رأس نظام التحكم في المظهر */}
      <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-gray-200/50">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl font-bold text-gray-900">
              نظام التحكم في المظهر
            </h2>
            <p className="text-gray-600">
              تخصيص المظهر العام للمنصة (للمديرين فقط)
            </p>
          </div>

          <div className="flex gap-2">
            <button
              onClick={handleExportTheme}
              className="flex items-center gap-2 px-4 py-2 text-sm bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
            >
              <Download className="w-4 h-4" />
              تصدير
            </button>
            <button
              onClick={handleSaveTheme}
              className="flex items-center gap-2 px-4 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Save className="w-4 h-4" />
              حفظ التغييرات
            </button>
          </div>
        </div>

        {/* تبويبات التحكم */}
        <div className="flex flex-wrap gap-2 mb-6 border-b border-gray-200">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={cn(
                  "flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-t-lg transition-colors",
                  activeTab === tab.id
                    ? "bg-blue-600 text-white"
                    : "text-gray-600 hover:text-gray-900 hover:bg-gray-100",
                )}
              >
                <Icon className="w-4 h-4" />
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* محتوى التبويبات */}
        {activeTab === "colors" && (
          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-gray-900">
              قوالب الألوان
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {colorThemes.map((theme) => (
                <div
                  key={theme.id}
                  onClick={() => {
                    setSelectedColorTheme(theme.id);
                    applyTheme(theme.id);
                  }}
                  className={cn(
                    "p-4 rounded-xl border-2 cursor-pointer transition-all",
                    selectedColorTheme === theme.id
                      ? "border-blue-500 bg-blue-50"
                      : "border-gray-200 hover:border-gray-300",
                  )}
                >
                  <div
                    className={cn("h-20 rounded-lg mb-3", theme.preview)}
                  ></div>
                  <h4 className="font-medium text-gray-900">{theme.name}</h4>
                  <div className="flex gap-1 mt-2">
                    <div
                      className="w-4 h-4 rounded-full"
                      style={{ backgroundColor: theme.primary }}
                    ></div>
                    <div
                      className="w-4 h-4 rounded-full"
                      style={{ backgroundColor: theme.secondary }}
                    ></div>
                    <div
                      className="w-4 h-4 rounded-full"
                      style={{ backgroundColor: theme.accent }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === "fonts" && (
          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-gray-900">
              خيارات الخطوط
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {fontOptions.map((font) => (
                <div
                  key={font.id}
                  onClick={() => {
                    setSelectedFont(font.id);
                    applyFont(font.id);
                  }}
                  className={cn(
                    "p-4 rounded-xl border-2 cursor-pointer transition-all",
                    selectedFont === font.id
                      ? "border-blue-500 bg-blue-50"
                      : "border-gray-200 hover:border-gray-300",
                  )}
                >
                  <h4 className="font-medium text-gray-900 mb-2">
                    {font.name}
                  </h4>
                  <p className={cn("text-2xl", font.className)}>
                    {font.sample}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === "layout" && (
          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-gray-900">
              تخطيط الصفحة
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  عرض الصفحة الأقصى (بكسل)
                </label>
                <div className="space-y-3">
                  <input
                    type="range"
                    min="1000"
                    max="1600"
                    value={pageWidth}
                    onChange={(e) => setPageWidth(Number(e.target.value))}
                    className="w-full"
                  />
                  <div className="flex justify-between text-sm text-gray-600">
                    <span>1000px</span>
                    <span className="font-medium">{pageWidth}px</span>
                    <span>1600px</span>
                  </div>
                </div>
              </div>

              <div className="p-4 bg-gray-50 rounded-lg">
                <h4 className="font-medium text-gray-900 mb-2">معاينة</h4>
                <div
                  className="bg-white border-2 border-gray-300 rounded h-20 mx-auto"
                  style={{ width: `${pageWidth * 0.1}px`, maxWidth: "100%" }}
                ></div>
                <p className="text-center text-sm text-gray-600 mt-2">
                  عرض الصفحة: {pageWidth}px
                </p>
              </div>
            </div>
          </div>
        )}

        {activeTab === "notifications" && (
          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-gray-900">
              قوالب الإشعارات
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {notificationStyles.map((style) => (
                <div
                  key={style.id}
                  onClick={() => setNotificationStyle(style.id)}
                  className={cn(
                    "p-4 rounded-xl border-2 cursor-pointer transition-all",
                    notificationStyle === style.id
                      ? "border-blue-500 bg-blue-50"
                      : "border-gray-200 hover:border-gray-300",
                  )}
                >
                  <h4 className="font-medium text-gray-900 mb-3">
                    {style.name}
                  </h4>
                  <div className={cn("p-3", style.preview)}>
                    <div className="flex items-center gap-2">
                      <Bell className="w-4 h-4 text-blue-600" />
                      <span className="text-sm font-medium">إشعار تجريبي</span>
                    </div>
                    <p className="text-xs text-gray-600 mt-1">
                      هذا مثال على شكل الإشعار
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === "popups" && (
          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-gray-900">
              قوالب النوافذ المنبثقة
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 border-2 border-gray-200 rounded-xl">
                <h4 className="font-medium text-gray-900 mb-3">
                  نافذة كلاسيكية
                </h4>
                <div className="bg-white rounded-lg shadow-lg p-4 border">
                  <div className="flex items-center justify-between mb-2">
                    <h5 className="font-medium">عنوان النافذة</h5>
                    <button className="text-gray-400 hover:text-gray-600">
                      ×
                    </button>
                  </div>
                  <p className="text-sm text-gray-600">
                    محتوى النافذة المنبثقة
                  </p>
                </div>
              </div>

              <div className="p-4 border-2 border-gray-200 rounded-xl">
                <h4 className="font-medium text-gray-900 mb-3">نافذة عصرية</h4>
                <div className="bg-white rounded-2xl shadow-2xl p-4 border border-gray-100">
                  <div className="flex items-center justify-between mb-2">
                    <h5 className="font-medium">عنوان النافذة</h5>
                    <button className="text-gray-400 hover:text-gray-600 w-6 h-6 rounded-full bg-gray-100">
                      ×
                    </button>
                  </div>
                  <p className="text-sm text-gray-600">
                    محتوى النافذة المنبثقة
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* معاينة مباشرة */}
      <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-gray-200/50">
        <div className="flex items-center gap-2 mb-4">
          <Eye className="w-5 h-5 text-blue-600" />
          <h3 className="text-lg font-semibold text-gray-900">معاينة مباشرة</h3>
        </div>

        <div className="p-4 bg-gray-50 rounded-lg">
          <p className="text-sm text-gray-600 mb-4">
            سيتم تطبيق هذه الإعدادات على جميع صفحات المنصة عند الحفظ
          </p>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
            <div>
              <span className="text-gray-500">المظهر:</span>
              <p className="font-medium">
                {colorThemes.find((t) => t.id === selectedColorTheme)?.name}
              </p>
            </div>
            <div>
              <span className="text-gray-500">الخط:</span>
              <p className="font-medium">
                {fontOptions.find((f) => f.id === selectedFont)?.name}
              </p>
            </div>
            <div>
              <span className="text-gray-500">عرض الصفحة:</span>
              <p className="font-medium">{pageWidth}px</p>
            </div>
            <div>
              <span className="text-gray-500">نمط الإشعارات:</span>
              <p className="font-medium">
                {
                  notificationStyles.find((s) => s.id === notificationStyle)
                    ?.name
                }
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminThemeControl;
