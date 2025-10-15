import type { Config } from "tailwindcss";
import tailwindColors from "tailwindcss/colors";

// Remove deprecated alias colors to silence Tailwind warnings (v2.2/v3 renames)
const filteredColors = Object.fromEntries(
  Object.entries(tailwindColors as Record<string, any>).filter(
    ([key]) =>
      !["lightBlue", "warmGray", "trueGray", "coolGray", "blueGray"].includes(
        key,
      ),
  ),
);

// Import tokens statically to avoid circular dependencies
const designTokens = {
  colors: {
    primary: {
      50: "#eff6ff",
      100: "#dbeafe",
      200: "#bfdbfe",
      300: "#93c5fd",
      400: "#60a5fa",
      500: "#3b82f6",
      600: "#2563eb",
      700: "#1d4ed8",
      800: "#1e40af",
      900: "#1e3a8a",
      950: "#172554",
    },
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
  },
  spacing: {
    0: "0",
    px: "1px",
    0.5: "0.125rem",
    1: "0.25rem",
    1.5: "0.375rem",
    2: "0.5rem",
    2.5: "0.625rem",
    3: "0.75rem",
    3.5: "0.875rem",
    4: "1rem",
    5: "1.25rem",
    6: "1.5rem",
    7: "1.75rem",
    8: "2rem",
    9: "2.25rem",
    10: "2.5rem",
    11: "2.75rem",
    12: "3rem",
    14: "3.5rem",
    16: "4rem",
    20: "5rem",
    24: "6rem",
    28: "7rem",
    32: "8rem",
    36: "9rem",
    40: "10rem",
    44: "11rem",
    48: "12rem",
    52: "13rem",
    56: "14rem",
    60: "15rem",
    64: "16rem",
    72: "18rem",
    80: "20rem",
    96: "24rem",
  },
  fontSize: {
    xs: "0.75rem",
    sm: "0.875rem",
    base: "1rem",
    lg: "1.125rem",
    xl: "1.25rem",
    "2xl": "1.5rem",
    "3xl": "1.875rem",
    "4xl": "2.25rem",
    "5xl": "3rem",
    "6xl": "3.75rem",
    "7xl": "4.5rem",
    "8xl": "6rem",
    "9xl": "8rem",
  },
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
  borderRadius: {
    none: "0",
    sm: "0.125rem",
    base: "0.25rem",
    md: "0.375rem",
    lg: "0.5rem",
    xl: "0.75rem",
    "2xl": "1rem",
    "3xl": "1.5rem",
    full: "9999px",
  },
  boxShadow: {
    none: "none",
    sm: "0 1px 2px 0 rgb(0 0 0 / 0.05)",
    base: "0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)",
    md: "0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)",
    lg: "0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)",
    xl: "0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)",
    "2xl": "0 25px 50px -12px rgb(0 0 0 / 0.25)",
    inner: "inset 0 2px 4px 0 rgb(0 0 0 / 0.05)",
  },
};

export default {
  darkMode: ["class"],
  content: ["./client/**/*.{ts,tsx}"],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },

    // Override Tailwind defaults with our design tokens
    screens: {
      xs: "475px",
      sm: "640px",
      md: "768px",
      lg: "1024px",
      xl: "1280px",
      "2xl": "1536px",
    },

    colors: {
      // Keep existing shadcn/ui colors for compatibility
      border: "hsl(var(--border))",
      input: "hsl(var(--input))",
      ring: "hsl(var(--ring))",
      background: "hsl(var(--background))",
      foreground: "hsl(var(--foreground))",
      primary: {
        DEFAULT: "hsl(var(--primary))",
        foreground: "hsl(var(--primary-foreground))",
      },
      secondary: {
        DEFAULT: "hsl(var(--secondary))",
        foreground: "hsl(var(--secondary-foreground))",
      },
      destructive: {
        DEFAULT: "hsl(var(--destructive))",
        foreground: "hsl(var(--destructive-foreground))",
      },
      muted: {
        DEFAULT: "hsl(var(--muted))",
        foreground: "hsl(var(--muted-foreground))",
      },
      accent: {
        DEFAULT: "hsl(var(--accent))",
        foreground: "hsl(var(--accent-foreground))",
      },
      popover: {
        DEFAULT: "hsl(var(--popover))",
        foreground: "hsl(var(--popover-foreground))",
      },
      card: {
        DEFAULT: "hsl(var(--card))",
        foreground: "hsl(var(--card-foreground))",
      },
      sidebar: {
        DEFAULT: "hsl(var(--sidebar-background))",
        foreground: "hsl(var(--sidebar-foreground))",
        primary: "hsl(var(--sidebar-primary))",
        "primary-foreground": "hsl(var(--sidebar-primary-foreground))",
        accent: "hsl(var(--sidebar-accent))",
        "accent-foreground": "hsl(var(--sidebar-accent-foreground))",
        border: "hsl(var(--sidebar-border))",
        ring: "hsl(var(--sidebar-ring))",
      },

      // Add our design tokens colors
      ...designTokens.colors,

      // Medical specialty colors
      dental: {
        tooth: "#ffffff",
        enamel: "#f8f9fa",
        cavity: "#dc2626",
        healthy: "#22c55e",
        filling: "#64748b",
      },
      emergency: {
        urgent: "#dc2626",
        high: "#f59e0b",
        medium: "#3b82f6",
        low: "#22c55e",
      },
      professional: {
        verified: "#22c55e",
        pending: "#f59e0b",
        rejected: "#dc2626",
        inactive: "#64748b",
      },

      // Semantic colors with design tokens
      "dt-bg": {
        primary: "#ffffff",
        secondary: "#f8fafc",
        tertiary: "#f1f5f9",
        accent: "#eff6ff",
      },
      "dt-text": {
        primary: "#0f172a",
        secondary: "#334155",
        tertiary: "#64748b",
        disabled: "#94a3b8",
        inverse: "#ffffff",
      },
      "dt-border": {
        primary: "#e2e8f0",
        secondary: "#cbd5e1",
        accent: "#bfdbfe",
        focus: "#3b82f6",
      },
      "dt-interactive": {
        hover: "#f1f5f9",
        active: "#e2e8f0",
        disabled: "#f8fafc",
        focus: "#eff6ff",
      },

      // Keep legacy zendenta colors for compatibility
      zendenta: {
        primary: "hsl(var(--zendenta-primary))",
        secondary: "hsl(var(--zendenta-secondary))",
        gray: {
          50: "hsl(var(--zendenta-gray-50))",
          100: "hsl(var(--zendenta-gray-100))",
          200: "hsl(var(--zendenta-gray-200))",
          300: "hsl(var(--zendenta-gray-300))",
          400: "hsl(var(--zendenta-gray-400))",
          500: "hsl(var(--zendenta-gray-500))",
          600: "hsl(var(--zendenta-gray-600))",
          700: "hsl(var(--zendenta-gray-700))",
          800: "hsl(var(--zendenta-gray-800))",
          900: "hsl(var(--zendenta-gray-900))",
        },
        success: "hsl(var(--zendenta-success))",
        warning: "hsl(var(--zendenta-warning))",
        error: "hsl(var(--zendenta-error))",
      },
      ...filteredColors,
    },

    // Typography from design tokens
    fontFamily: {
      sans: ["Inter", "system-ui", "sans-serif"],
      arabic: ["Noto Sans Arabic", "system-ui", "sans-serif"],
      mono: ["JetBrains Mono", "Consolas", "monospace"],
      medical: ["Inter", "system-ui", "sans-serif"],
    },
    fontSize: designTokens.fontSize,
    fontWeight: designTokens.fontWeight,
    lineHeight: {
      none: "1",
      tight: "1.25",
      snug: "1.375",
      normal: "1.5",
      relaxed: "1.625",
      loose: "2",
    },
    letterSpacing: {
      tighter: "-0.05em",
      tight: "-0.025em",
      normal: "0em",
      wide: "0.025em",
      wider: "0.05em",
      widest: "0.1em",
    },

    // Spacing from design tokens
    spacing: designTokens.spacing,

    // Border radius from design tokens
    borderRadius: {
      // Keep existing for compatibility
      lg: "var(--radius)",
      md: "calc(var(--radius) - 2px)",
      sm: "calc(var(--radius) - 4px)",
      // Add design tokens
      ...designTokens.borderRadius,
    },

    // Border width from design tokens
    borderWidth: {
      0: "0",
      1: "1px",
      2: "2px",
      4: "4px",
      8: "8px",
    },

    // Box shadows from design tokens
    boxShadow: {
      ...designTokens.boxShadow,
      // Add medical specific shadows
      "medical-card":
        "0 4px 6px -1px rgb(59 130 246 / 0.1), 0 2px 4px -2px rgb(59 130 246 / 0.1)",
      "medical-urgent":
        "0 4px 6px -1px rgb(220 38 38 / 0.2), 0 2px 4px -2px rgb(220 38 38 / 0.2)",
      "medical-success":
        "0 4px 6px -1px rgb(34 197 94 / 0.1), 0 2px 4px -2px rgb(34 197 94 / 0.1)",
    },

    // Z-index from design tokens
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

    // Transitions from design tokens
    transitionDuration: {
      75: "75ms",
      100: "100ms",
      150: "150ms",
      200: "200ms",
      300: "300ms",
      500: "500ms",
      700: "700ms",
      1000: "1000ms",
    },
    transitionTimingFunction: {
      linear: "linear",
      in: "cubic-bezier(0.4, 0, 1, 1)",
      out: "cubic-bezier(0, 0, 0.2, 1)",
      inOut: "cubic-bezier(0.4, 0, 0.2, 1)",
    },

    extend: {
      // Component sizing from design tokens
      height: {
        "component-xs": "1.5rem",
        "component-sm": "2rem",
        "component-base": "2.5rem",
        "component-lg": "3rem",
        "component-xl": "3.5rem",
        "component-2xl": "4rem",
      },

      width: {
        "component-xs": "1.5rem",
        "component-sm": "2rem",
        "component-base": "2.5rem",
        "component-lg": "3rem",
        "component-xl": "3.5rem",
        "component-2xl": "4rem",
      },

      // Icon sizes from design tokens
      fontSize: {
        "icon-xs": "0.75rem",
        "icon-sm": "1rem",
        "icon-base": "1.25rem",
        "icon-lg": "1.5rem",
        "icon-xl": "2rem",
        "icon-2xl": "2.5rem",
      },

      // Medical specific animations
      keyframes: {
        "accordion-down": {
          from: {
            height: "0",
          },
          to: {
            height: "var(--radix-accordion-content-height)",
          },
        },
        "accordion-up": {
          from: {
            height: "var(--radix-accordion-content-height)",
          },
          to: {
            height: "0",
          },
        },
        "pulse-medical": {
          "0%, 100%": {
            opacity: "1",
          },
          "50%": {
            opacity: "0.7",
          },
        },
        "fade-in": {
          "0%": {
            opacity: "0",
          },
          "100%": {
            opacity: "1",
          },
        },
        "slide-in": {
          "0%": {
            transform: "translateY(10px)",
            opacity: "0",
          },
          "100%": {
            transform: "translateY(0)",
            opacity: "1",
          },
        },
        "scale-in": {
          "0%": {
            transform: "scale(0.95)",
            opacity: "0",
          },
          "100%": {
            transform: "scale(1)",
            opacity: "1",
          },
        },
      },

      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        "pulse-medical":
          "pulse-medical 2s cubic-bezier(0.4, 0, 0.6, 1) infinite",
        "fade-in": "fade-in 200ms ease-out",
        "slide-in": "slide-in 200ms ease-out",
        "scale-in": "scale-in 150ms ease-out",
      },

      // Add utility classes for design tokens
      backdropBlur: {
        medical: "8px",
      },

      // Medical gradient backgrounds
      backgroundImage: {
        "gradient-medical": `linear-gradient(135deg, ${designTokens.colors.primary[500]} 0%, ${designTokens.colors.secondary[500]} 100%)`,
        "gradient-success": `linear-gradient(135deg, ${designTokens.colors.success[500]} 0%, ${designTokens.colors.success[400]} 100%)`,
        "gradient-warning": `linear-gradient(135deg, ${designTokens.colors.warning[500]} 0%, ${designTokens.colors.warning[400]} 100%)`,
        "gradient-error": `linear-gradient(135deg, ${designTokens.colors.error[500]} 0%, ${designTokens.colors.error[400]} 100%)`,
      },
    },
  },
  plugins: [
    require("tailwindcss-animate"),
    // Add custom plugin for design tokens utilities
    function ({ addUtilities, theme }: any) {
      addUtilities({
        // Medical specific utilities
        ".medical-card": {
          background: theme("colors.dt-bg.primary"),
          borderRadius: theme("borderRadius.xl"),
          padding: theme("spacing.6"),
          boxShadow: theme("boxShadow.medical-card"),
          border: `1px solid ${theme("colors.dt-border.primary")}`,
          borderLeft: `4px solid ${theme("colors.primary.500")}`,
          transition: theme("transitionDuration.200"),
        },

        ".medical-button": {
          background: theme("colors.primary.500"),
          color: "white",
          padding: `${theme("spacing.2")} ${theme("spacing.4")}`,
          borderRadius: theme("borderRadius.md"),
          fontWeight: theme("fontWeight.medium"),
          transition: "all 200ms ease",
          border: "none",
          cursor: "pointer",

          "&:hover": {
            background: theme("colors.primary.600"),
            transform: "translateY(-1px)",
            boxShadow: theme("boxShadow.md"),
          },
        },

        ".medical-input": {
          width: "100%",
          padding: `${theme("spacing.2")} ${theme("spacing.3")}`,
          borderRadius: theme("borderRadius.md"),
          border: `1px solid ${theme("colors.dt-border.primary")}`,
          fontSize: theme("fontSize.base"),
          background: theme("colors.dt-bg.primary"),
          color: theme("colors.dt-text.primary"),
          transition: theme("transitionDuration.150"),

          "&:focus": {
            outline: "none",
            borderColor: theme("colors.primary.500"),
            boxShadow: `0 0 0 3px ${theme("colors.primary.100")}`,
          },
        },

        // Emergency status utilities
        ".emergency-urgent": {
          borderColor: theme("colors.emergency.urgent"),
          boxShadow: theme("boxShadow.medical-urgent"),
        },

        ".emergency-high": {
          borderColor: theme("colors.emergency.high"),
          boxShadow: `0 4px 6px -1px ${theme("colors.emergency.high")}20`,
        },

        ".emergency-medium": {
          borderColor: theme("colors.emergency.medium"),
          boxShadow: `0 4px 6px -1px ${theme("colors.emergency.medium")}20`,
        },

        ".emergency-low": {
          borderColor: theme("colors.emergency.low"),
          boxShadow: theme("boxShadow.medical-success"),
        },

        // Professional status utilities
        ".status-verified": {
          color: theme("colors.professional.verified"),
          background: `${theme("colors.professional.verified")}10`,
        },

        ".status-pending": {
          color: theme("colors.professional.pending"),
          background: `${theme("colors.professional.pending")}10`,
        },

        ".status-rejected": {
          color: theme("colors.professional.rejected"),
          background: `${theme("colors.professional.rejected")}10`,
        },
      });
    },
  ],
} satisfies Config;
