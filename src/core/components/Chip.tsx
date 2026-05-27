import React from "react";
import { StyleSheet, Pressable, ViewStyle, Animated } from "react-native";
import { Theme } from "@/core/themes";
import Text from "./Text";

export interface ChipProps {
  label: string;
  selected?: boolean;
  onPress?: () => void;
  style?: ViewStyle;
}

export const Chip: React.FC<ChipProps> = ({
  label,
  selected = false,
  onPress,
  style,
}) => {
  const containerStyle: ViewStyle = {
    backgroundColor: selected ? Theme.Colors.primary : Theme.Colors.onPrimaryContainer,
    borderRadius: Theme.Roundness.full, // Pill-shaped 9999px
  };

  const textColor = selected ? Theme.Colors.onPrimary : Theme.Colors.primary;

  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.chip,
        containerStyle,
        pressed && styles.pressed,
        style,
      ]}
      disabled={!onPress}
    >
      <Text
        variant="label-sm"
        color={textColor}
        style={styles.label}
      >
        {label}
      </Text>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  chip: {
    paddingVertical: Theme.Spacing.xs + 2, // 6px
    paddingHorizontal: Theme.Spacing.sm + 4, // 16px
    alignSelf: "flex-start",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "transparent",
  },
  label: {
    letterSpacing: 0,
    fontWeight: "600",
  },
  pressed: {
    opacity: 0.8,
  },
});

export default Chip;
