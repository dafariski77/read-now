/**
 * Quiet Reader - Typography Design Tokens
 */
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
