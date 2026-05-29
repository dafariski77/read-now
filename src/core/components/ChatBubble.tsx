import { Theme } from "@/core/themes";
import React, { ReactNode } from "react";
import {
  Platform,
  StyleProp,
  StyleSheet,
  TextStyle,
  View,
  ViewStyle,
} from "react-native";
import Text from "./Text";

export interface ChatBubbleProps {
  children?: ReactNode;
  message?: string;
  variant?: keyof typeof Theme.Colors;
  textColor?: keyof typeof Theme.Colors | string;
  arrowPosition?: "left" | "right" | "left-middle" | "right-middle" | "none";
  elevation?: "none" | "low" | "high";
  style?: StyleProp<ViewStyle>;
  textStyle?: StyleProp<TextStyle>;
}

const getOnColor = (
  variant: keyof typeof Theme.Colors,
): keyof typeof Theme.Colors => {
  if (variant === "primary") return "onPrimary";
  if (variant === "primaryContainer") return "onPrimaryContainer";
  if (variant === "secondary") return "onSecondary";
  if (variant === "secondaryContainer") return "onSecondaryContainer";
  if (variant === "tertiary") return "onTertiary";
  if (variant === "tertiaryContainer") return "onTertiaryContainer";
  if (variant === "error") return "onError";
  if (variant === "errorContainer") return "onErrorContainer";

  if (variant.startsWith("surface")) {
    if (variant === "surfaceVariant") return "onSurfaceVariant";
    return "onSurface";
  }

  return "onSurface";
};

export const ChatBubble: React.FC<ChatBubbleProps> = ({
  children,
  message,
  variant = "primary",
  textColor,
  arrowPosition = "left",
  elevation = "none",
  style,
  textStyle,
}) => {
  // 1. Determine background color dynamically from Colors theme
  const backgroundColor = Theme.Colors[variant] || Theme.Colors.primary;

  // 2. Determine text color dynamically with high-contrast fallbacks
  let finalTextColor: string;
  if (textColor) {
    finalTextColor =
      Theme.Colors[textColor as keyof typeof Theme.Colors] || textColor;
  } else {
    const onColorKey = getOnColor(variant);
    finalTextColor = Theme.Colors[onColorKey];
  }

  // 3. Base bubble container style
  const bubbleStyle: ViewStyle = {
    backgroundColor,
    paddingVertical: Theme.Spacing.sm + 2,
    paddingHorizontal: Theme.Spacing.sm + 6,
    borderRadius: Theme.Roundness.lg,
    position: "relative",
  };

  // 4. Asymmetric corners to simulate speech flow
  if (arrowPosition === "left") {
    bubbleStyle.borderTopLeftRadius = 4;
  } else if (arrowPosition === "right") {
    bubbleStyle.borderTopRightRadius = 4;
  }

  // 5. Elevation shadow styles
  const elevationStyle = styles[elevation] || {};

  // 6. Detect flex in style props to make ChatBubble highly responsive in flexboxes
  const flatStyle = style ? StyleSheet.flatten(style) : {};
  const hasFlex =
    flatStyle.flex !== undefined ||
    flatStyle.flexGrow !== undefined ||
    flatStyle.flexShrink !== undefined;

  const mergedContainerStyle = [
    styles.container,
    hasFlex && { alignSelf: undefined, maxWidth: undefined },
    style,
  ];

  return (
    <View style={mergedContainerStyle}>
      <View style={[bubbleStyle, elevationStyle, hasFlex && { width: "100%" }]}>
        {/* Render classical tiny speech tail */}
        {(arrowPosition === "left" || arrowPosition === "left-middle") && (
          <View
            style={[
              styles.tailLeft,
              arrowPosition === "left-middle" && styles.tailMiddle,
              { borderRightColor: backgroundColor },
            ]}
          />
        )}
        {(arrowPosition === "right" || arrowPosition === "right-middle") && (
          <View
            style={[
              styles.tailRight,
              arrowPosition === "right-middle" && styles.tailMiddle,
              { borderLeftColor: backgroundColor },
            ]}
          />
        )}

        {/* Content rendering */}
        {children ? (
          children
        ) : (
          <Text
            variant="body-md"
            weight="600"
            style={[styles.messageText, { color: finalTextColor }, textStyle]}
          >
            {message}
          </Text>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignSelf: "flex-start",
    maxWidth: "85%",
  },
  messageText: {
    lineHeight: 24,
  },
  // Tiny speech bubble triangular tails
  tailLeft: {
    position: "absolute",
    left: -8,
    top: 12,
    width: 0,
    height: 0,
    backgroundColor: "transparent",
    borderStyle: "solid",
    borderTopWidth: 6,
    borderRightWidth: 8,
    borderBottomWidth: 6,
    borderTopColor: "transparent",
    borderBottomColor: "transparent",
  },
  tailRight: {
    position: "absolute",
    right: -8,
    top: 12,
    width: 0,
    height: 0,
    backgroundColor: "transparent",
    borderStyle: "solid",
    borderTopWidth: 6,
    borderLeftWidth: 8,
    borderBottomWidth: 6,
    borderTopColor: "transparent",
    borderBottomColor: "transparent",
  },
  tailMiddle: {
    top: "50%",
  },
  none: {},
  low: {
    ...Platform.select({
      ios: {
        shadowColor: "#000000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.04,
        shadowRadius: 4,
      },
      android: {
        elevation: 1,
      },
      web: {
        shadowColor: "#000000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.04,
        shadowRadius: 4,
      },
    }),
  },
  high: {
    ...Platform.select({
      ios: {
        shadowColor: "#000000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.08,
        shadowRadius: 8,
      },
      android: {
        elevation: 3,
      },
      web: {
        shadowColor: "#000000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.08,
        shadowRadius: 8,
      },
    }),
  },
});

export default ChatBubble;
