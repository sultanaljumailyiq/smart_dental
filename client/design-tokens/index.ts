// Design Tokens System - Main Export
// Central hub for all design tokens and utilities

// Export the main tokens object
export { tokens as default, tokens } from "./tokens";

// Export all type definitions
export type {
  ColorScale,
  SpacingScale,
  FontSize,
  FontWeight,
  BorderRadius,
  Shadow,
  Breakpoint,
} from "./tokens";

// Export utility functions
export {
  getColor,
  getSpacing,
  getFontSize,
  getBorderRadius,
  getShadow,
} from "./tokens";

// Export all utilities
export {
  colors,
  spacing,
  typography,
  layout,
  components,
  responsive,
  animations,
  cssVar,
  responsiveStyles,
  getEmergencyColor,
  getProfessionalStatusColor,
  theme,
} from "./utils";

// Re-export default utility object
export { default as designTokens } from "./utils";

// ===== CONVENIENCE EXPORTS =====

// Most commonly used tokens for quick access
export const dt = {
  // Quick color access
  color: {
    primary: "#3b82f6",
    secondary: "#0ea5e9",
    success: "#22c55e",
    warning: "#f59e0b",
    error: "#ef4444",

    // Semantic colors
    bg: {
      primary: "#ffffff",
      secondary: "#f8fafc",
      accent: "#eff6ff",
    },
    text: {
      primary: "#0f172a",
      secondary: "#334155",
      tertiary: "#64748b",
    },
    border: {
      primary: "#e2e8f0",
      accent: "#bfdbfe",
    },
  },

  // Quick spacing access
  space: {
    xs: "0.25rem", // 4px
    sm: "0.5rem", // 8px
    base: "1rem", // 16px
    lg: "1.5rem", // 24px
    xl: "2rem", // 32px
    "2xl": "3rem", // 48px
  },

  // Quick typography access
  text: {
    xs: "0.75rem",
    sm: "0.875rem",
    base: "1rem",
    lg: "1.125rem",
    xl: "1.25rem",
    "2xl": "1.5rem",
    "3xl": "1.875rem",
  },

  // Quick radius access
  radius: {
    sm: "0.125rem",
    base: "0.25rem",
    md: "0.375rem",
    lg: "0.5rem",
    xl: "0.75rem",
    "2xl": "1rem",
    full: "9999px",
  },

  // Quick shadow access
  shadow: {
    sm: "0 1px 2px 0 rgb(0 0 0 / 0.05)",
    base: "0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)",
    md: "0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)",
    lg: "0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)",
    xl: "0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)",
  },
};

// ===== COMPONENT PRESET STYLES =====

// Pre-built component styles using design tokens
export const presets = {
  // Button presets
  button: {
    primary: {
      backgroundColor: dt.color.primary,
      color: "white",
      padding: `${dt.space.sm} ${dt.space.base}`,
      borderRadius: dt.radius.md,
      border: "none",
      fontWeight: "500",
      cursor: "pointer",
      transition: "all 200ms ease",

      "&:hover": {
        backgroundColor: "#2563eb",
        transform: "translateY(-1px)",
        boxShadow: dt.shadow.md,
      },
    },

    secondary: {
      backgroundColor: "transparent",
      color: dt.color.primary,
      padding: `${dt.space.sm} ${dt.space.base}`,
      borderRadius: dt.radius.md,
      border: `1px solid ${dt.color.border.primary}`,
      fontWeight: "500",
      cursor: "pointer",
      transition: "all 200ms ease",

      "&:hover": {
        backgroundColor: dt.color.bg.secondary,
        borderColor: dt.color.primary,
      },
    },

    danger: {
      backgroundColor: dt.color.error,
      color: "white",
      padding: `${dt.space.sm} ${dt.space.base}`,
      borderRadius: dt.radius.md,
      border: "none",
      fontWeight: "500",
      cursor: "pointer",
      transition: "all 200ms ease",

      "&:hover": {
        backgroundColor: "#dc2626",
        transform: "translateY(-1px)",
        boxShadow: dt.shadow.md,
      },
    },
  },

  // Card presets
  card: {
    base: {
      backgroundColor: dt.color.bg.primary,
      borderRadius: dt.radius.xl,
      padding: dt.space.lg,
      border: `1px solid ${dt.color.border.primary}`,
      boxShadow: dt.shadow.base,
      transition: "all 200ms ease",
    },

    interactive: {
      backgroundColor: dt.color.bg.primary,
      borderRadius: dt.radius.xl,
      padding: dt.space.lg,
      border: `1px solid ${dt.color.border.primary}`,
      boxShadow: dt.shadow.base,
      transition: "all 200ms ease",
      cursor: "pointer",

      "&:hover": {
        boxShadow: dt.shadow.lg,
        transform: "translateY(-2px)",
        borderColor: dt.color.border.accent,
      },
    },

    medical: {
      backgroundColor: dt.color.bg.primary,
      borderRadius: dt.radius.xl,
      padding: dt.space.lg,
      border: `1px solid ${dt.color.border.primary}`,
      borderLeft: `4px solid ${dt.color.primary}`,
      boxShadow:
        "0 4px 6px -1px rgb(59 130 246 / 0.1), 0 2px 4px -2px rgb(59 130 246 / 0.1)",
      transition: "all 200ms ease",
    },
  },

  // Input presets
  input: {
    base: {
      width: "100%",
      padding: `${dt.space.sm} ${dt.space.base}`,
      borderRadius: dt.radius.md,
      border: `1px solid ${dt.color.border.primary}`,
      fontSize: dt.text.base,
      backgroundColor: dt.color.bg.primary,
      color: dt.color.text.primary,
      transition: "all 150ms ease",

      "&:focus": {
        outline: "none",
        borderColor: dt.color.primary,
        boxShadow: `0 0 0 3px ${dt.color.primary}20`,
      },

      "&::placeholder": {
        color: dt.color.text.tertiary,
      },
    },

    error: {
      width: "100%",
      padding: `${dt.space.sm} ${dt.space.base}`,
      borderRadius: dt.radius.md,
      border: `1px solid ${dt.color.error}`,
      fontSize: dt.text.base,
      backgroundColor: dt.color.bg.primary,
      color: dt.color.text.primary,
      transition: "all 150ms ease",

      "&:focus": {
        outline: "none",
        borderColor: dt.color.error,
        boxShadow: `0 0 0 3px ${dt.color.error}20`,
      },
    },
  },

  // Text presets
  text: {
    heading1: {
      fontSize: dt.text["3xl"],
      fontWeight: "700",
      lineHeight: "1.25",
      color: dt.color.text.primary,
    },

    heading2: {
      fontSize: dt.text["2xl"],
      fontWeight: "600",
      lineHeight: "1.25",
      color: dt.color.text.primary,
    },

    heading3: {
      fontSize: dt.text.xl,
      fontWeight: "600",
      lineHeight: "1.375",
      color: dt.color.text.primary,
    },

    body: {
      fontSize: dt.text.base,
      fontWeight: "400",
      lineHeight: "1.5",
      color: dt.color.text.primary,
    },

    bodyLarge: {
      fontSize: dt.text.lg,
      fontWeight: "400",
      lineHeight: "1.625",
      color: dt.color.text.primary,
    },

    bodySmall: {
      fontSize: dt.text.sm,
      fontWeight: "400",
      lineHeight: "1.5",
      color: dt.color.text.secondary,
    },

    caption: {
      fontSize: dt.text.xs,
      fontWeight: "400",
      lineHeight: "1.5",
      color: dt.color.text.tertiary,
    },
  },
};

// ===== THEME CONFIGURATION =====

export const themeConfig = {
  // Default theme
  default: "light",

  // Available themes
  themes: {
    light: {
      name: "Light Theme",
      colors: dt.color,
    },
    // Dark theme can be added here in the future
  },

  // Medical context colors
  medical: {
    emergency: {
      urgent: "#dc2626",
      high: "#f59e0b",
      medium: "#3b82f6",
      low: "#22c55e",
    },

    status: {
      verified: "#22c55e",
      pending: "#f59e0b",
      rejected: "#dc2626",
      inactive: "#64748b",
    },

    dental: {
      healthy: "#22c55e",
      warning: "#f59e0b",
      critical: "#dc2626",
      neutral: "#64748b",
    },
  },
};

// ===== ACCESSIBILITY HELPERS =====

export const a11y = {
  // Focus styles
  focus: {
    outline: `2px solid ${dt.color.primary}`,
    outlineOffset: "2px",
  },

  // Screen reader only styles
  srOnly: {
    position: "absolute",
    width: "1px",
    height: "1px",
    padding: "0",
    margin: "-1px",
    overflow: "hidden",
    clip: "rect(0, 0, 0, 0)",
    whiteSpace: "nowrap",
    border: "0",
  },

  // High contrast colors for accessibility
  highContrast: {
    text: "#000000",
    background: "#ffffff",
    border: "#000000",
  },
};
