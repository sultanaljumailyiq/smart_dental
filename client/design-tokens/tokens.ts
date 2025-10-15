// Design Tokens System for DentalHub Platform
// This file contains all the design tokens used throughout the application

export const tokens = {
  // ===== COLORS =====
  colors: {
    // Primary Colors - Medical Theme
    primary: {
      50: "#eff6ff",
      100: "#dbeafe",
      200: "#bfdbfe",
      300: "#93c5fd",
      400: "#60a5fa",
      500: "#3b82f6", // Main brand color
      600: "#2563eb",
      700: "#1d4ed8",
      800: "#1e40af",
      900: "#1e3a8a",
      950: "#172554",
    },

    // Secondary Colors - Dental Professional
    secondary: {
      50: "#f0f9ff",
      100: "#e0f2fe",
      200: "#bae6fd",
      300: "#7dd3fc",
      400: "#38bdf8",
      500: "#0ea5e9",
      600: "#0284c7",
      700: "#0369a1",
      800: "#075985",
      900: "#0c4a6e",
      950: "#082f49",
    },

    // Success Colors - Health & Wellness
    success: {
      50: "#f0fdf4",
      100: "#dcfce7",
      200: "#bbf7d0",
      300: "#86efac",
      400: "#4ade80",
      500: "#22c55e",
      600: "#16a34a",
      700: "#15803d",
      800: "#166534",
      900: "#14532d",
      950: "#052e16",
    },

    // Warning Colors - Medical Alerts
    warning: {
      50: "#fffbeb",
      100: "#fef3c7",
      200: "#fde68a",
      300: "#fcd34d",
      400: "#fbbf24",
      500: "#f59e0b",
      600: "#d97706",
      700: "#b45309",
      800: "#92400e",
      900: "#78350f",
      950: "#451a03",
    },

    // Error Colors - Critical Medical Issues
    error: {
      50: "#fef2f2",
      100: "#fee2e2",
      200: "#fecaca",
      300: "#fca5a5",
      400: "#f87171",
      500: "#ef4444",
      600: "#dc2626",
      700: "#b91c1c",
      800: "#991b1b",
      900: "#7f1d1d",
      950: "#450a0a",
    },

    // Neutral Colors - UI Elements
    neutral: {
      50: "#f8fafc",
      100: "#f1f5f9",
      200: "#e2e8f0",
      300: "#cbd5e1",
      400: "#94a3b8",
      500: "#64748b",
      600: "#475569",
      700: "#334155",
      800: "#1e293b",
      900: "#0f172a",
      950: "#020617",
    },

    // Specialty Colors for Medical Context
    specialty: {
      // Dental specific colors
      dental: {
        tooth: "#ffffff",
        enamel: "#f8f9fa",
        cavity: "#dc2626",
        healthy: "#22c55e",
        filling: "#64748b",
      },

      // Medical emergency colors
      emergency: {
        urgent: "#dc2626",
        high: "#f59e0b",
        medium: "#3b82f6",
        low: "#22c55e",
      },

      // Professional status colors
      professional: {
        verified: "#22c55e",
        pending: "#f59e0b",
        rejected: "#dc2626",
        inactive: "#64748b",
      },
    },

    // Semantic Colors
    semantic: {
      background: {
        primary: "#ffffff",
        secondary: "#f8fafc",
        tertiary: "#f1f5f9",
        accent: "#eff6ff",
      },

      text: {
        primary: "#0f172a",
        secondary: "#334155",
        tertiary: "#64748b",
        disabled: "#94a3b8",
        inverse: "#ffffff",
      },

      border: {
        primary: "#e2e8f0",
        secondary: "#cbd5e1",
        accent: "#bfdbfe",
        focus: "#3b82f6",
      },

      interactive: {
        hover: "#f1f5f9",
        active: "#e2e8f0",
        disabled: "#f8fafc",
        focus: "#eff6ff",
      },
    },
  },

  // ===== TYPOGRAPHY =====
  typography: {
    // Font Families
    fontFamily: {
      sans: ["Inter", "system-ui", "sans-serif"],
      arabic: ["Noto Sans Arabic", "system-ui", "sans-serif"],
      mono: ["JetBrains Mono", "Consolas", "monospace"],
      medical: ["Inter", "system-ui", "sans-serif"], // Professional medical font
    },

    // Font Sizes
    fontSize: {
      xs: "0.75rem", // 12px
      sm: "0.875rem", // 14px
      base: "1rem", // 16px
      lg: "1.125rem", // 18px
      xl: "1.25rem", // 20px
      "2xl": "1.5rem", // 24px
      "3xl": "1.875rem", // 30px
      "4xl": "2.25rem", // 36px
      "5xl": "3rem", // 48px
      "6xl": "3.75rem", // 60px
      "7xl": "4.5rem", // 72px
      "8xl": "6rem", // 96px
      "9xl": "8rem", // 128px
    },

    // Font Weights
    fontWeight: {
      thin: "100",
      extralight: "200",
      light: "300",
      normal: "400",
      medium: "500",
      semibold: "600",
      bold: "700",
      extrabold: "800",
      black: "900",
    },

    // Line Heights
    lineHeight: {
      none: "1",
      tight: "1.25",
      snug: "1.375",
      normal: "1.5",
      relaxed: "1.625",
      loose: "2",
    },

    // Letter Spacing
    letterSpacing: {
      tighter: "-0.05em",
      tight: "-0.025em",
      normal: "0em",
      wide: "0.025em",
      wider: "0.05em",
      widest: "0.1em",
    },
  },

  // ===== SPACING =====
  spacing: {
    // Base spacing scale (rem units)
    0: "0",
    px: "1px",
    0.5: "0.125rem", // 2px
    1: "0.25rem", // 4px
    1.5: "0.375rem", // 6px
    2: "0.5rem", // 8px
    2.5: "0.625rem", // 10px
    3: "0.75rem", // 12px
    3.5: "0.875rem", // 14px
    4: "1rem", // 16px
    5: "1.25rem", // 20px
    6: "1.5rem", // 24px
    7: "1.75rem", // 28px
    8: "2rem", // 32px
    9: "2.25rem", // 36px
    10: "2.5rem", // 40px
    11: "2.75rem", // 44px
    12: "3rem", // 48px
    14: "3.5rem", // 56px
    16: "4rem", // 64px
    20: "5rem", // 80px
    24: "6rem", // 96px
    28: "7rem", // 112px
    32: "8rem", // 128px
    36: "9rem", // 144px
    40: "10rem", // 160px
    44: "11rem", // 176px
    48: "12rem", // 192px
    52: "13rem", // 208px
    56: "14rem", // 224px
    60: "15rem", // 240px
    64: "16rem", // 256px
    72: "18rem", // 288px
    80: "20rem", // 320px
    96: "24rem", // 384px
  },

  // ===== SIZING =====
  sizing: {
    // Component sizes
    component: {
      xs: "1.5rem", // 24px
      sm: "2rem", // 32px
      base: "2.5rem", // 40px
      lg: "3rem", // 48px
      xl: "3.5rem", // 56px
      "2xl": "4rem", // 64px
    },

    // Icon sizes
    icon: {
      xs: "0.75rem", // 12px
      sm: "1rem", // 16px
      base: "1.25rem", // 20px
      lg: "1.5rem", // 24px
      xl: "2rem", // 32px
      "2xl": "2.5rem", // 40px
    },

    // Avatar sizes
    avatar: {
      xs: "1.5rem", // 24px
      sm: "2rem", // 32px
      base: "2.5rem", // 40px
      lg: "3rem", // 48px
      xl: "4rem", // 64px
      "2xl": "5rem", // 80px
    },
  },

  // ===== BORDERS =====
  borders: {
    // Border Widths
    width: {
      0: "0",
      1: "1px",
      2: "2px",
      4: "4px",
      8: "8px",
    },

    // Border Radius
    radius: {
      none: "0",
      sm: "0.125rem", // 2px
      base: "0.25rem", // 4px
      md: "0.375rem", // 6px
      lg: "0.5rem", // 8px
      xl: "0.75rem", // 12px
      "2xl": "1rem", // 16px
      "3xl": "1.5rem", // 24px
      full: "9999px",
    },

    // Border Styles
    style: {
      solid: "solid",
      dashed: "dashed",
      dotted: "dotted",
      double: "double",
      none: "none",
    },
  },

  // ===== SHADOWS =====
  shadows: {
    none: "none",
    sm: "0 1px 2px 0 rgb(0 0 0 / 0.05)",
    base: "0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)",
    md: "0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)",
    lg: "0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)",
    xl: "0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)",
    "2xl": "0 25px 50px -12px rgb(0 0 0 / 0.25)",
    inner: "inset 0 2px 4px 0 rgb(0 0 0 / 0.05)",

    // Medical specific shadows
    medical: {
      card: "0 4px 6px -1px rgb(59 130 246 / 0.1), 0 2px 4px -2px rgb(59 130 246 / 0.1)",
      urgent:
        "0 4px 6px -1px rgb(220 38 38 / 0.2), 0 2px 4px -2px rgb(220 38 38 / 0.2)",
      success:
        "0 4px 6px -1px rgb(34 197 94 / 0.1), 0 2px 4px -2px rgb(34 197 94 / 0.1)",
    },
  },

  // ===== TRANSITIONS =====
  transitions: {
    // Duration
    duration: {
      75: "75ms",
      100: "100ms",
      150: "150ms",
      200: "200ms",
      300: "300ms",
      500: "500ms",
      700: "700ms",
      1000: "1000ms",
    },

    // Timing Functions
    timing: {
      linear: "linear",
      in: "cubic-bezier(0.4, 0, 1, 1)",
      out: "cubic-bezier(0, 0, 0.2, 1)",
      inOut: "cubic-bezier(0.4, 0, 0.2, 1)",
    },

    // Common transitions
    common: {
      fast: "all 150ms cubic-bezier(0.4, 0, 0.2, 1)",
      normal: "all 200ms cubic-bezier(0.4, 0, 0.2, 1)",
      slow: "all 300ms cubic-bezier(0.4, 0, 0.2, 1)",
    },
  },

  // ===== BREAKPOINTS =====
  breakpoints: {
    xs: "475px",
    sm: "640px",
    md: "768px",
    lg: "1024px",
    xl: "1280px",
    "2xl": "1536px",
  },

  // ===== Z-INDEX =====
  zIndex: {
    auto: "auto",
    0: "0",
    10: "10",
    20: "20",
    30: "30",
    40: "40",
    50: "50",
    modal: "1000",
    popover: "1010",
    overlay: "1020",
    max: "9999",
  },

  // ===== COMPONENT TOKENS =====
  components: {
    // Button variants
    button: {
      height: {
        sm: "2rem",
        base: "2.5rem",
        lg: "3rem",
      },
      padding: {
        sm: "0.5rem 0.75rem",
        base: "0.625rem 1rem",
        lg: "0.75rem 1.5rem",
      },
      borderRadius: "0.375rem",
    },

    // Card variants
    card: {
      padding: {
        sm: "1rem",
        base: "1.5rem",
        lg: "2rem",
      },
      borderRadius: "0.75rem",
      shadow:
        "0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)",
    },

    // Input variants
    input: {
      height: {
        sm: "2rem",
        base: "2.5rem",
        lg: "3rem",
      },
      padding: {
        sm: "0.5rem 0.75rem",
        base: "0.625rem 1rem",
        lg: "0.75rem 1rem",
      },
      borderRadius: "0.375rem",
    },
  },
} as const;

// Type definitions for better TypeScript support
export type ColorScale = keyof typeof tokens.colors.primary;
export type SpacingScale = keyof typeof tokens.spacing;
export type FontSize = keyof typeof tokens.typography.fontSize;
export type FontWeight = keyof typeof tokens.typography.fontWeight;
export type BorderRadius = keyof typeof tokens.borders.radius;
export type Shadow = keyof typeof tokens.shadows;
export type Breakpoint = keyof typeof tokens.breakpoints;

// Helper functions for accessing tokens
export const getColor = (color: string, scale?: ColorScale) => {
  const colorPath = color.split(".");
  let result: any = tokens.colors;

  for (const path of colorPath) {
    result = result[path];
    if (!result) return undefined;
  }

  if (scale && typeof result === "object") {
    return result[scale];
  }

  return result;
};

export const getSpacing = (scale: SpacingScale) => tokens.spacing[scale];
export const getFontSize = (size: FontSize) => tokens.typography.fontSize[size];
export const getBorderRadius = (radius: BorderRadius) =>
  tokens.borders.radius[radius];
export const getShadow = (shadow: Shadow) => tokens.shadows[shadow];

export default tokens;
