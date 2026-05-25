import React from "react";
import { Text as RNText, TextProps as RNTextProps, StyleSheet, TextStyle } from "react-native";
import { Theme, TypographyVariant } from "./theme";

export interface TextProps extends RNTextProps {
  variant?: TypographyVariant;
  color?: string;
  align?: "auto" | "left" | "right" | "center" | "justify";
  weight?: "normal" | "bold" | "100" | "200" | "300" | "400" | "500" | "600" | "700" | "800" | "900";
}

export const Text: React.FC<TextProps> = ({
  variant = "body-md",
  color = Theme.Colors.onBackground,
  align = "left",
  weight,
  style,
  children,
  ...rest
}) => {
  const fontStyle = Theme.Typography[variant] || Theme.Typography["body-md"];

  const combinedStyles: TextStyle = {
    fontFamily: fontStyle.fontFamily,
    fontSize: fontStyle.fontSize,
    lineHeight: fontStyle.lineHeight,
    letterSpacing: fontStyle.letterSpacing,
    color,
    textAlign: align,
  };

  // Override weight if explicitly specified
  if (weight) {
    combinedStyles.fontWeight = weight;
    // Map weights to custom fonts loaded
    if (weight === "700" || weight === "bold") {
      combinedStyles.fontFamily = "PlusJakartaSans_700Bold";
    } else if (weight === "600") {
      combinedStyles.fontFamily = "PlusJakartaSans_600SemiBold";
    } else if (weight === "500") {
      combinedStyles.fontFamily = "PlusJakartaSans_500Medium";
    } else if (weight === "400" || weight === "normal") {
      combinedStyles.fontFamily = "PlusJakartaSans_400Regular";
    }
  }

  return (
    <RNText style={[combinedStyles, style]} {...rest}>
      {children}
    </RNText>
  );
};

export default Text;
