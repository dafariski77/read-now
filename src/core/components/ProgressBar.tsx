import React, { useEffect, useRef } from "react";
import { StyleSheet, View, Animated, ViewStyle } from "react-native";
import { Theme } from "@/core/themes";

export interface ProgressBarProps {
  progress: number; // 0 to 1
  animated?: boolean;
  style?: ViewStyle;
}

export const ProgressBar: React.FC<ProgressBarProps> = ({
  progress,
  animated = true,
  style,
}) => {
  // Constrain progress between 0 and 1
  const clampedProgress = Math.max(0, Math.min(1, progress));
  
  const animatedValue = useRef(new Animated.Value(clampedProgress)).current;

  useEffect(() => {
    if (animated) {
      Animated.spring(animatedValue, {
        toValue: clampedProgress,
        useNativeDriver: false, // width style animation doesn't support native driver
        tension: 40,
        friction: 7,
      }).start();
    } else {
      animatedValue.setValue(clampedProgress);
    }
  }, [clampedProgress, animated]);

  // Interpolate progress to percentage width
  const widthPercent = animatedValue.interpolate({
    inputRange: [0, 1],
    outputRange: ["0%", "100%"],
  });

  return (
    <View style={[styles.track, style]}>
      <Animated.View
        style={[
          styles.fill,
          {
            width: widthPercent,
          },
        ]}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  track: {
    height: 8, // Thick 8px track per spec
    backgroundColor: Theme.Colors.surfaceContainerHighest, // unfilled portion
    borderRadius: Theme.Roundness.full, // Terminate ends with full rounding (9999px)
    overflow: "hidden",
    width: "100%",
  },
  fill: {
    height: "100%",
    backgroundColor: Theme.Colors.primary, // Primary Indigo filled portion
    borderRadius: Theme.Roundness.full,
  },
});

export default ProgressBar;
