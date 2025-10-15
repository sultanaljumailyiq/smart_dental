// تهيئة الثيم عند تحميل التطبيق
export const initializeTheme = () => {
  // تحميل الإعدادات المحفوظة
  const savedTheme = localStorage.getItem("admin-theme");
  const savedFont = localStorage.getItem("admin-font");
  const savedWidth = localStorage.getItem("admin-page-width");

  // قوالب الألوان المتاحة
  const colorThemes = {
    "medical-blue": {
      primary: "#3b82f6",
      secondary: "#0ea5e9",
      accent: "#06b6d4",
    },
    "dental-green": {
      primary: "#22c55e",
      secondary: "#16a34a",
      accent: "#15803d",
    },
    "professional-purple": {
      primary: "#8b5cf6",
      secondary: "#7c3aed",
      accent: "#6d28d9",
    },
    "warm-orange": {
      primary: "#f59e0b",
      secondary: "#d97706",
      accent: "#b45309",
    },
    "modern-gray": {
      primary: "#64748b",
      secondary: "#475569",
      accent: "#334155",
    },
  };

  // تطبيق الثيم
  if (savedTheme && colorThemes[savedTheme as keyof typeof colorThemes]) {
    const theme = colorThemes[savedTheme as keyof typeof colorThemes];
    document.documentElement.style.setProperty(
      "--theme-primary",
      theme.primary,
    );
    document.documentElement.style.setProperty(
      "--theme-secondary",
      theme.secondary,
    );
    document.documentElement.style.setProperty("--theme-accent", theme.accent);
  }

  // تطبيق الخط
  if (savedFont) {
    document.documentElement.style.setProperty("--font-primary", savedFont);
  }

  // تطبيق عرض الصفحة
  if (savedWidth) {
    document.documentElement.style.setProperty(
      "--page-max-width",
      `${savedWidth}px`,
    );
  }
};

// تشغيل التهيئة عند تحميل الصفحة
if (typeof window !== "undefined") {
  document.addEventListener("DOMContentLoaded", initializeTheme);
}
