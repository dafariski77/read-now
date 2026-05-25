import React from "react";
import { StyleSheet, View, ViewProps, ViewStyle, Platform } from "react-native";
import { Theme } from "./theme";

export interface CardProps extends ViewProps {
  elevation?: "none" | "low" | "high";
  surfaceColor?: keyof typeof Theme.Colors;
  bordered?: boolean;
}

export const Card: React.FC<CardProps> = ({
  elevation = "low",
  surfaceColor = "surfaceContainerLowest", // White level 1 by default
  bordered = true,
  style,
  children,
  ...rest
}) => {
  const containerStyle: ViewStyle = {
    backgroundColor: Theme.Colors[surfaceColor] || Theme.Colors.surfaceContainerLowest,
    borderRadius: Theme.Roundness.lg, // 16px corner radius per spec
  };

  // Apply borders
  if (bordered) {
    containerStyle.borderWidth = 1;
    containerStyle.borderColor = Theme.Colors.outlineVariant;
  }

  // Combine styles
  return (
    <View style={[styles.baseCard, containerStyle, styles[elevation], style]} {...rest}>
      {children}
    </View>
  );
};

const styles = StyleSheet.create({
  baseCard: {
    padding: Theme.Spacing.md, // 24px default padding
    overflow: "hidden",
  },
  none: {},
  // Very soft diffused shadow (Blur: 12px, Y: 4px, Opacity: 4% (0.04))
  low: {
    ...Platform.select({
      ios: {
        shadowColor: "#000000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.04,
        shadowRadius: 12,
      },
      android: {
        elevation: 2,
      },
      web: {
        shadowColor: "#000000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.04,
        shadowRadius: 12,
      },
    }),
  },
  high: {
    ...Platform.select({
      ios: {
        shadowColor: "#000000",
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.08,
        shadowRadius: 16,
      },
      android: {
        elevation: 4,
      },
      web: {
        shadowColor: "#000000",
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.08,
        shadowRadius: 16,
      },
    }),
  },
});

export default Card;
