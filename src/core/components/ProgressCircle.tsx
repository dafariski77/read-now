import React from "react";
import { StyleSheet, View, ViewStyle } from "react-native";
import Svg, { Circle } from "react-native-svg";
import { Theme } from "@/core/themes";
import { Text } from "./Text";

export interface ProgressCircleProps {
  progress: number; // 0 to 1
  size?: number;
  strokeWidth?: number;
  color?: string;
  trackColor?: string;
  style?: ViewStyle;
  children?: React.ReactNode; // Optional center text overlay
}

export const ProgressCircle: React.FC<ProgressCircleProps> = ({
  progress,
  size = 120,
  strokeWidth = 10,
  color = Theme.Colors.primary,
  trackColor = Theme.Colors.surfaceContainerLow,
  style,
  children,
}) => {
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;

  // Safe progress boundary mapping
  const safeProgress = Math.max(0, Math.min(1, progress));

  // Calculate dash offset representing progression
  const strokeDashoffset = circumference - safeProgress * circumference;

  return (
    <View style={[styles.container, { width: size, height: size }, style]}>
      <Svg width={size} height={size} style={styles.svg}>
        {/* Background Track Circle */}
        <Circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={trackColor}
          strokeWidth={strokeWidth}
          fill="transparent"
        />
        {/* Foreground Progress Circle */}
        <Circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={color}
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          fill="transparent"
          // Rotate SVG to start progress from the top (12 o'clock)
          origin={`${size / 2}, ${size / 2}`}
          rotation="-90"
        />
      </Svg>
      {/* Center text container */}
      <View style={StyleSheet.absoluteFill} pointerEvents="none">
        <View style={styles.centerContainer}>
          {children ? (
            children
          ) : (
            <Text variant="headline-md" color={Theme.Colors.onBackground} style={styles.percentText}>
              {Math.round(safeProgress * 100)}%
            </Text>
          )}
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: "center",
    alignItems: "center",
    position: "relative",
  },
  svg: {
    transform: [{ scaleX: 1 }], // standard drawing format
  },
  centerContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  percentText: {
    fontWeight: "700",
  },
});

export default ProgressCircle;
