/**
 * Quiet Reader - Design System Theme Tokens
 * Fully compliant with the Stitch MCP specifications.
 */

export const Colors = {
  // Base Colors
  background: "#f7f9ff",
  onBackground: "#181c20",

  // Primary (Soft Indigo)
  primary: "#4352a5",
  primaryContainer: "#5c6bc0",
  onPrimary: "#ffffff",
  onPrimaryContainer: "#f8f6ff",
  inversePrimary: "#bac3ff",

  // Secondary
  secondary: "#5c5f60",
  onSecondary: "#ffffff",
  secondaryContainer: "#e1e3e4",
  onSecondaryContainer: "#626566",

  // Tertiary
  tertiary: "#565a5c",
  onTertiary: "#ffffff",
  tertiaryContainer: "#6e7275",
  onTertiaryContainer: "#f5f8fb",

  // Error
  error: "#ba1a1a",
  onError: "#ffffff",
  errorContainer: "#ffdad6",
  onErrorContainer: "#93000a",

  // Outline
  outline: "#767683",
  outlineVariant: "#c6c5d3",

  // Surface Tiers (Tonal Layers)
  surface: "#f7f9ff",
  surfaceDim: "#d7dadf",
  surfaceBright: "#f7f9ff",
  surfaceContainerLowest: "#ffffff",
  surfaceContainerLow: "#f1f4f9",
  surfaceContainer: "#ebeef3",
  surfaceContainerHigh: "#e5e8ee",
  surfaceContainerHighest: "#e0e3e8",
  onSurface: "#181c20",
  onSurfaceVariant: "#454651",
  inverseSurface: "#2d3135",
  inverseOnSurface: "#eef1f6",
  surfaceTint: "#4858ab",
  surfaceVariant: "#e0e3e8",
};

export const Spacing = {
  xs: 4,
  base: 8,
  sm: 12,
  md: 24,
  lg: 40,
  xl: 64,
  gutter: 24,
  marginMobile: 16,
};

export const Roundness = {
  sm: 4,
  DEFAULT: 8,
  md: 12,
  lg: 16, // Cards and large containers
  xl: 24,
  full: 9999,
};

export type TypographyVariant =
  | "display"
  | "headline-lg"
  | "headline-lg-mobile"
  | "headline-md"
  | "body-lg"
  | "body-md"
  | "label-md"
  | "label-sm";

export interface FontStyle {
  fontFamily: string;
  fontSize: number;
  fontWeight: "400" | "500" | "600" | "700";
  lineHeight: number;
  letterSpacing?: number;
}

export const Typography: Record<TypographyVariant, FontStyle> = {
  display: {
    fontFamily: "PlusJakartaSans_700Bold",
    fontSize: 40,
    fontWeight: "700",
    lineHeight: 48,
    letterSpacing: -0.8, // 40 * -0.02em = -0.8
  },
  "headline-lg": {
    fontFamily: "PlusJakartaSans_700Bold",
    fontSize: 32,
    fontWeight: "700",
    lineHeight: 40,
    letterSpacing: -0.64, // 32 * -0.02em = -0.64
  },
  "headline-lg-mobile": {
    fontFamily: "PlusJakartaSans_700Bold",
    fontSize: 24,
    fontWeight: "700",
    lineHeight: 32,
  },
  "headline-md": {
    fontFamily: "PlusJakartaSans_600SemiBold",
    fontSize: 24,
    fontWeight: "600",
    lineHeight: 32,
  },
  "body-lg": {
    fontFamily: "PlusJakartaSans_400Regular",
    fontSize: 18,
    fontWeight: "400",
    lineHeight: 28,
  },
  "body-md": {
    fontFamily: "PlusJakartaSans_400Regular",
    fontSize: 16,
    fontWeight: "400",
    lineHeight: 24,
  },
  "label-md": {
    fontFamily: "PlusJakartaSans_600SemiBold",
    fontSize: 14,
    fontWeight: "600",
    lineHeight: 20,
    letterSpacing: 0.14, // 14 * 0.01em = 0.14
  },
  "label-sm": {
    fontFamily: "PlusJakartaSans_500Medium",
    fontSize: 12,
    fontWeight: "500",
    lineHeight: 16,
  },
};

export const Theme = {
  Colors,
  Spacing,
  Roundness,
  Typography,
};

export default Theme;
