import { tokens } from "./tokens";
import type {
  ColorScale,
  SpacingScale,
  FontSize,
  FontWeight,
  BorderRadius,
  Shadow,
  Breakpoint,
} from "./tokens";

// ===== DESIGN TOKENS UTILITIES =====

/**
 * Design Tokens Utility Functions
 * Provides easy access to design tokens with type safety
 */

// ===== COLOR UTILITIES =====

export const colors = {
  // Primary color utilities
  primary: (scale: any = 500) => tokens.colors.primary[scale as keyof typeof tokens.colors.primary],
  secondary: (scale: any = 500) => tokens.colors.secondary[scale as keyof typeof tokens.colors.secondary],
  success: (scale: any = 500) => tokens.colors.success[scale as keyof typeof tokens.colors.success],
  warning: (scale: any = 500) => tokens.colors.warning[scale as keyof typeof tokens.colors.warning],
  error: (scale: any = 500) => tokens.colors.error[scale as keyof typeof tokens.colors.error],
  neutral: (scale: any = 500) => tokens.colors.neutral[scale as keyof typeof tokens.colors.neutral],

  // Semantic color utilities
  background: {
    primary: tokens.colors.semantic.background.primary,
    secondary: tokens.colors.semantic.background.secondary,
    tertiary: tokens.colors.semantic.background.tertiary,
    accent: tokens.colors.semantic.background.accent,
  },

  text: {
    primary: tokens.colors.semantic.text.primary,
    secondary: tokens.colors.semantic.text.secondary,
    tertiary: tokens.colors.semantic.text.tertiary,
    disabled: tokens.colors.semantic.text.disabled,
    inverse: tokens.colors.semantic.text.inverse,
  },

  border: {
    primary: tokens.colors.semantic.border.primary,
    secondary: tokens.colors.semantic.border.secondary,
    accent: tokens.colors.semantic.border.accent,
    focus: tokens.colors.semantic.border.focus,
  },

  interactive: {
    hover: tokens.colors.semantic.interactive.hover,
    active: tokens.colors.semantic.interactive.active,
    disabled: tokens.colors.semantic.interactive.disabled,
    focus: tokens.colors.semantic.interactive.focus,
  },

  // Medical specialty colors
  dental: tokens.colors.specialty.dental,
  emergency: tokens.colors.specialty.emergency,
  professional: tokens.colors.specialty.professional,
};

// ===== SPACING UTILITIES =====

export const spacing = {
  // Direct access to spacing scale
  get: (scale: SpacingScale) => tokens.spacing[scale],

  // Common spacing patterns
  none: tokens.spacing[0],
  xs: tokens.spacing[1],
  sm: tokens.spacing[2],
  base: tokens.spacing[4],
  lg: tokens.spacing[6],
  xl: tokens.spacing[8],
  "2xl": tokens.spacing[12],
  "3xl": tokens.spacing[16],

  // Component spacing
  component: {
    padding: {
      sm: tokens.spacing[2],
      base: tokens.spacing[4],
      lg: tokens.spacing[6],
    },
    margin: {
      sm: tokens.spacing[2],
      base: tokens.spacing[4],
      lg: tokens.spacing[6],
    },
    gap: {
      sm: tokens.spacing[2],
      base: tokens.spacing[4],
      lg: tokens.spacing[6],
    },
  },
};

// ===== TYPOGRAPHY UTILITIES =====

export const typography = {
  // Font families
  fontFamily: {
    sans: tokens.typography.fontFamily.sans.join(", "),
    arabic: tokens.typography.fontFamily.arabic.join(", "),
    mono: tokens.typography.fontFamily.mono.join(", "),
    medical: tokens.typography.fontFamily.medical.join(", "),
  },

  // Font sizes
  fontSize: {
    get: (size: FontSize) => tokens.typography.fontSize[size],
    xs: tokens.typography.fontSize.xs,
    sm: tokens.typography.fontSize.sm,
    base: tokens.typography.fontSize.base,
    lg: tokens.typography.fontSize.lg,
    xl: tokens.typography.fontSize.xl,
    "2xl": tokens.typography.fontSize["2xl"],
    "3xl": tokens.typography.fontSize["3xl"],
    "4xl": tokens.typography.fontSize["4xl"],
    "5xl": tokens.typography.fontSize["5xl"],
  },

  // Font weights
  fontWeight: {
    get: (weight: FontWeight) => tokens.typography.fontWeight[weight],
    light: tokens.typography.fontWeight.light,
    normal: tokens.typography.fontWeight.normal,
    medium: tokens.typography.fontWeight.medium,
    semibold: tokens.typography.fontWeight.semibold,
    bold: tokens.typography.fontWeight.bold,
  },

  // Line heights
  lineHeight: {
    tight: tokens.typography.lineHeight.tight,
    normal: tokens.typography.lineHeight.normal,
    relaxed: tokens.typography.lineHeight.relaxed,
  },

  // Text styles for common use cases
  heading: {
    h1: {
      fontSize: tokens.typography.fontSize["4xl"],
      fontWeight: tokens.typography.fontWeight.bold,
      lineHeight: tokens.typography.lineHeight.tight,
    },
    h2: {
      fontSize: tokens.typography.fontSize["3xl"],
      fontWeight: tokens.typography.fontWeight.bold,
      lineHeight: tokens.typography.lineHeight.tight,
    },
    h3: {
      fontSize: tokens.typography.fontSize["2xl"],
      fontWeight: tokens.typography.fontWeight.semibold,
      lineHeight: tokens.typography.lineHeight.tight,
    },
    h4: {
      fontSize: tokens.typography.fontSize.xl,
      fontWeight: tokens.typography.fontWeight.semibold,
      lineHeight: tokens.typography.lineHeight.snug,
    },
    h5: {
      fontSize: tokens.typography.fontSize.lg,
      fontWeight: tokens.typography.fontWeight.medium,
      lineHeight: tokens.typography.lineHeight.snug,
    },
    h6: {
      fontSize: tokens.typography.fontSize.base,
      fontWeight: tokens.typography.fontWeight.medium,
      lineHeight: tokens.typography.lineHeight.normal,
    },
  },

  body: {
    large: {
      fontSize: tokens.typography.fontSize.lg,
      fontWeight: tokens.typography.fontWeight.normal,
      lineHeight: tokens.typography.lineHeight.relaxed,
    },
    base: {
      fontSize: tokens.typography.fontSize.base,
      fontWeight: tokens.typography.fontWeight.normal,
      lineHeight: tokens.typography.lineHeight.normal,
    },
    small: {
      fontSize: tokens.typography.fontSize.sm,
      fontWeight: tokens.typography.fontWeight.normal,
      lineHeight: tokens.typography.lineHeight.normal,
    },
  },

  caption: {
    fontSize: tokens.typography.fontSize.xs,
    fontWeight: tokens.typography.fontWeight.normal,
    lineHeight: tokens.typography.lineHeight.normal,
  },
};

// ===== LAYOUT UTILITIES =====

export const layout = {
  // Border radius
  borderRadius: {
    get: (radius: BorderRadius) => tokens.borders.radius[radius],
    none: tokens.borders.radius.none,
    sm: tokens.borders.radius.sm,
    base: tokens.borders.radius.base,
    md: tokens.borders.radius.md,
    lg: tokens.borders.radius.lg,
    xl: tokens.borders.radius.xl,
    "2xl": tokens.borders.radius["2xl"],
    "3xl": tokens.borders.radius["3xl"],
    full: tokens.borders.radius.full,
  },

  // Shadows
  shadow: {
    get: (shadow: Shadow) => tokens.shadows[shadow],
    none: tokens.shadows.none,
    sm: tokens.shadows.sm,
    base: tokens.shadows.base,
    md: tokens.shadows.md,
    lg: tokens.shadows.lg,
    xl: tokens.shadows.xl,
    "2xl": tokens.shadows["2xl"],
    inner: tokens.shadows.inner,
    medical: tokens.shadows.medical,
  },

  // Borders
  border: {
    width: tokens.borders.width,
    style: tokens.borders.style,
  },

  // Z-index
  zIndex: tokens.zIndex,
};

// ===== COMPONENT UTILITIES =====

export const components = {
  // Button styles
  button: {
    primary: {
      backgroundColor: colors.primary(),
      color: colors.text.inverse,
      padding: tokens.components.button.padding.base,
      borderRadius: tokens.components.button.borderRadius,
      fontWeight: typography.fontWeight.medium,
      transition: tokens.transitions.common.normal,
      border: "none",
      cursor: "pointer",

      "&:hover": {
        backgroundColor: colors.primary("600"),
      },

      "&:focus": {
        outline: `2px solid ${colors.primary("500")}`,
        outlineOffset: "2px",
      },

      "&:disabled": {
        backgroundColor: colors.neutral("300"),
        color: colors.text.disabled,
        cursor: "not-allowed",
      },
    },

    secondary: {
      backgroundColor: "transparent",
      color: colors.primary(),
      padding: tokens.components.button.padding.base,
      borderRadius: tokens.components.button.borderRadius,
      fontWeight: typography.fontWeight.medium,
      transition: tokens.transitions.common.normal,
      border: `1px solid ${colors.border.primary}`,
      cursor: "pointer",

      "&:hover": {
        backgroundColor: colors.interactive.hover,
        borderColor: colors.primary(),
      },

      "&:focus": {
        outline: `2px solid ${colors.primary("500")}`,
        outlineOffset: "2px",
      },
    },

    sizes: {
      sm: {
        height: tokens.components.button.height.sm,
        padding: tokens.components.button.padding.sm,
        fontSize: typography.fontSize.sm,
      },
      base: {
        height: tokens.components.button.height.base,
        padding: tokens.components.button.padding.base,
        fontSize: typography.fontSize.base,
      },
      lg: {
        height: tokens.components.button.height.lg,
        padding: tokens.components.button.padding.lg,
        fontSize: typography.fontSize.lg,
      },
    },
  },

  // Card styles
  card: {
    base: {
      backgroundColor: colors.background.primary,
      borderRadius: tokens.components.card.borderRadius,
      padding: tokens.components.card.padding.base,
      boxShadow: tokens.components.card.shadow,
      border: `1px solid ${colors.border.primary}`,
      transition: tokens.transitions.common.normal,
    },

    interactive: {
      cursor: "pointer",
      "&:hover": {
        boxShadow: layout.shadow.lg,
        transform: "translateY(-2px)",
      },
    },

    medical: {
      boxShadow: layout.shadow.medical.card,
      borderLeft: `4px solid ${colors.primary()}`,
    },
  },

  // Input styles
  input: {
    base: {
      height: tokens.components.input.height.base,
      padding: tokens.components.input.padding.base,
      borderRadius: tokens.components.input.borderRadius,
      border: `1px solid ${colors.border.primary}`,
      fontSize: typography.fontSize.base,
      fontFamily: typography.fontFamily.sans,
      backgroundColor: colors.background.primary,
      color: colors.text.primary,
      transition: tokens.transitions.common.fast,

      "&:focus": {
        outline: "none",
        borderColor: colors.border.focus,
        boxShadow: `0 0 0 3px ${colors.primary("100")}`,
      },

      "&::placeholder": {
        color: colors.text.tertiary,
      },

      "&:disabled": {
        backgroundColor: colors.interactive.disabled,
        color: colors.text.disabled,
        cursor: "not-allowed",
      },
    },

    error: {
      borderColor: colors.error(),
      "&:focus": {
        borderColor: colors.error(),
        boxShadow: `0 0 0 3px ${colors.error("100")}`,
      },
    },

    success: {
      borderColor: colors.success(),
      "&:focus": {
        borderColor: colors.success(),
        boxShadow: `0 0 0 3px ${colors.success("100")}`,
      },
    },
  },
};

// ===== RESPONSIVE UTILITIES =====

export const responsive = {
  // Breakpoints
  breakpoints: tokens.breakpoints,

  // Media queries
  mediaQueries: {
    xs: `@media (min-width: ${tokens.breakpoints.xs})`,
    sm: `@media (min-width: ${tokens.breakpoints.sm})`,
    md: `@media (min-width: ${tokens.breakpoints.md})`,
    lg: `@media (min-width: ${tokens.breakpoints.lg})`,
    xl: `@media (min-width: ${tokens.breakpoints.xl})`,
    "2xl": `@media (min-width: ${tokens.breakpoints["2xl"]})`,
  },

  // Mobile-first breakpoint utility
  up: (breakpoint: Breakpoint) =>
    `@media (min-width: ${tokens.breakpoints[breakpoint]})`,
  down: (breakpoint: Breakpoint) => {
    const breakpointValue = parseInt(tokens.breakpoints[breakpoint]);
    return `@media (max-width: ${breakpointValue - 1}px)`;
  },
};

// ===== ANIMATION UTILITIES =====

export const animations = {
  // Transition durations
  duration: tokens.transitions.duration,

  // Timing functions
  timing: tokens.transitions.timing,

  // Common transitions
  transition: {
    fast: tokens.transitions.common.fast,
    normal: tokens.transitions.common.normal,
    slow: tokens.transitions.common.slow,
  },

  // Common animations
  fadeIn: {
    opacity: 0,
    animation: "fadeIn 200ms ease-out forwards",
  },

  slideIn: {
    transform: "translateY(10px)",
    opacity: 0,
    animation: "slideIn 200ms ease-out forwards",
  },

  scaleIn: {
    transform: "scale(0.95)",
    opacity: 0,
    animation: "scaleIn 150ms ease-out forwards",
  },
};

// ===== HELPER FUNCTIONS =====

/**
 * Creates a CSS variable string for use in styles
 */
export const cssVar = (token: string) => `var(--${token})`;

/**
 * Creates responsive styles object
 */
export const responsiveStyles = (styles: Record<Breakpoint | "base", any>) => {
  const result: any = {};

  if (styles.base) {
    Object.assign(result, styles.base);
  }

  Object.entries(styles).forEach(([breakpoint, style]) => {
    if (breakpoint !== "base" && tokens.breakpoints[breakpoint as Breakpoint]) {
      result[responsive.up(breakpoint as Breakpoint)] = style;
    }
  });

  return result;
};

/**
 * Creates medical emergency color based on priority
 */
export const getEmergencyColor = (
  priority: "urgent" | "high" | "medium" | "low",
) => {
  return colors.emergency[priority];
};

/**
 * Creates professional status color
 */
export const getProfessionalStatusColor = (
  status: "verified" | "pending" | "rejected" | "inactive",
) => {
  return colors.professional[status];
};

// ===== THEME UTILITIES =====

export const theme = {
  // Light theme colors
  light: {
    background: colors.background,
    text: colors.text,
    border: colors.border,
    interactive: colors.interactive,
  },

  // Dark theme colors (for future implementation)
  dark: {
    background: {
      primary: colors.neutral("900"),
      secondary: colors.neutral("800"),
      tertiary: colors.neutral("700"),
      accent: colors.primary("900"),
    },
    text: {
      primary: colors.neutral("50"),
      secondary: colors.neutral("200"),
      tertiary: colors.neutral("400"),
      disabled: colors.neutral("600"),
      inverse: colors.neutral("900"),
    },
    border: {
      primary: colors.neutral("700"),
      secondary: colors.neutral("600"),
      accent: colors.primary("700"),
      focus: colors.primary("500"),
    },
    interactive: {
      hover: colors.neutral("800"),
      active: colors.neutral("700"),
      disabled: colors.neutral("900"),
      focus: colors.primary("800"),
    },
  },
};

// Export all utilities as default
export default {
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
  tokens,
};
