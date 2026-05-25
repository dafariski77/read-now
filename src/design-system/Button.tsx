import React, { useRef } from "react";
import { Pressable, StyleSheet, Animated, ViewStyle, ActivityIndicator } from "react-native";
import { Theme } from "./theme";
import Text from "./Text";

export type ButtonVariant = "primary" | "secondary" | "ghost";

export interface ButtonProps {
  onPress?: () => void;
  title: string;
  variant?: ButtonVariant;
  disabled?: boolean;
  loading?: boolean;
  style?: ViewStyle;
  fullWidth?: boolean;
}

export const Button: React.FC<ButtonProps> = ({
  onPress,
  title,
  variant = "primary",
  disabled = false,
  loading = false,
  style,
  fullWidth = false,
}) => {
  const scaleAnim = useRef(new Animated.Value(1)).current;

  const handlePressIn = () => {
    if (disabled || loading) return;
    Animated.spring(scaleAnim, {
      toValue: 0.96,
      useNativeDriver: true,
      speed: 40,
      bounciness: 4,
    }).start();
  };

  const handlePressOut = () => {
    if (disabled || loading) return;
    Animated.spring(scaleAnim, {
      toValue: 1,
      useNativeDriver: true,
      speed: 40,
      bounciness: 4,
    }).start();
  };

  // Variant Styles
  let buttonStyle: ViewStyle = {};
  let textColor = Theme.Colors.onPrimary;

  switch (variant) {
    case "primary":
      buttonStyle = {
        backgroundColor: Theme.Colors.primary,
      };
      textColor = Theme.Colors.onPrimary;
      break;
    case "secondary":
      buttonStyle = {
        backgroundColor: "transparent",
        borderWidth: 1,
        borderColor: Theme.Colors.outlineVariant,
      };
      textColor = Theme.Colors.primary;
      break;
    case "ghost":
      buttonStyle = {
        backgroundColor: "transparent",
      };
      textColor = Theme.Colors.secondary;
      break;
  }

  // Disabled states
  if (disabled) {
    buttonStyle = {
      ...buttonStyle,
      opacity: 0.5,
    };
  }

  return (
    <Animated.View
      style={[
        styles.animatedContainer,
        fullWidth && styles.fullWidth,
        { transform: [{ scale: scaleAnim }] },
      ]}
    >
      <Pressable
        onPress={disabled || loading ? undefined : onPress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        style={({ pressed }) => [
          styles.button,
          buttonStyle,
          pressed && variant === "ghost" && styles.ghostPressed,
          style,
        ]}
        accessibilityRole="button"
        accessibilityState={{ disabled, busy: loading }}
      >
        {loading ? (
          <ActivityIndicator
            color={variant === "primary" ? Theme.Colors.onPrimary : Theme.Colors.primary}
            size="small"
          />
        ) : (
          <Text
            variant="label-md"
            color={textColor}
            style={styles.text}
            align="center"
          >
            {title}
          </Text>
        )}
      </Pressable>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  animatedContainer: {
    alignSelf: "flex-start",
  },
  fullWidth: {
    alignSelf: "stretch",
    width: "100%",
  },
  button: {
    paddingVertical: Theme.Spacing.sm, // 12px
    paddingHorizontal: Theme.Spacing.md, // 24px
    borderRadius: Theme.Roundness.DEFAULT, // 8px
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
    minHeight: 48,
  },
  text: {
    letterSpacing: 0.14,
  },
  ghostPressed: {
    backgroundColor: Theme.Colors.surfaceContainerLow,
  },
});

export default Button;
