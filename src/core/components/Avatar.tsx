import React, { useState } from "react";
import {
  StyleSheet,
  View,
  StyleProp,
  ViewStyle,
  TextStyle,
  Platform,
  Pressable,
  ImageSourcePropType,
} from "react-native";
import { Image as ExpoImage } from "expo-image";
import { Theme } from "@/core/themes";
import Text from "./Text";

export interface AvatarProps {
  source?: string | ImageSourcePropType | null;
  size?: number;
  name?: string;
  bordered?: boolean;
  borderColor?: string;
  borderWidth?: number;
  elevation?: "none" | "low" | "high";
  style?: StyleProp<ViewStyle>;
  onPress?: () => void;
}

const getInitials = (name?: string): string => {
  if (!name) return "QR";
  const parts = name.trim().split(/\s+/);
  if (parts.length === 0) return "QR";
  if (parts.length === 1) return parts[0].substring(0, 2).toUpperCase();
  return (parts[0].charAt(0) + parts[1].charAt(0)).toUpperCase();
};

export const Avatar: React.FC<AvatarProps> = ({
  source,
  size = 48,
  name,
  bordered = false,
  borderColor = Theme.Colors.outlineVariant,
  borderWidth = 2,
  elevation = "none",
  style,
  onPress,
}) => {
  const [hasError, setHasError] = useState(false);

  const initials = getInitials(name);

  // Define geometric styles dynamically based on size
  const containerStyle: ViewStyle = {
    width: size,
    height: size,
    borderRadius: size / 2,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: Theme.Colors.primary,
    overflow: "hidden",
  };

  if (bordered) {
    containerStyle.borderWidth = borderWidth;
    containerStyle.borderColor = borderColor;
  }

  // Handle shadows based on elevation props matching the Card styles
  const elevationStyle = styles[elevation] || {};

  // Compute text font size based on avatar size
  const textStyle: TextStyle = {
    fontSize: Math.max(10, Math.floor(size * 0.38)),
    fontWeight: "700",
    color: Theme.Colors.onPrimary,
  };

  const renderContent = () => {
    // Show image if source exists and has not failed loading
    if (source && !hasError) {
      const imageSource = typeof source === "string" ? { uri: source } : source;
      return (
        <ExpoImage
          source={imageSource}
          style={styles.image}
          contentFit="cover"
          transition={200}
          onError={() => setHasError(true)}
        />
      );
    }

    // Otherwise render monogram fallback
    return (
      <Text style={textStyle}>
        {initials}
      </Text>
    );
  };

  const WrapperComponent = onPress ? Pressable : View;
  const wrapperProps = onPress ? { onPress, style: styles.pressable } : {};

  return (
    <View style={[containerStyle, elevationStyle, style]}>
      <WrapperComponent {...wrapperProps} style={[styles.innerWrapper, onPress && styles.pressable]}>
        {renderContent()}
      </WrapperComponent>
    </View>
  );
};

const styles = StyleSheet.create({
  innerWrapper: {
    width: "100%",
    height: "100%",
    alignItems: "center",
    justifyContent: "center",
  },
  pressable: {
    width: "100%",
    height: "100%",
    alignItems: "center",
    justifyContent: "center",
  },
  image: {
    width: "100%",
    height: "100%",
  },
  none: {},
  low: {
    ...Platform.select({
      ios: {
        shadowColor: "#000000",
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.04,
        shadowRadius: 6,
      },
      android: {
        elevation: 2,
      },
      web: {
        shadowColor: "#000000",
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.04,
        shadowRadius: 6,
      },
    }),
  },
  high: {
    ...Platform.select({
      ios: {
        shadowColor: "#000000",
        shadowOffset: { width: 0, height: 6 },
        shadowOpacity: 0.08,
        shadowRadius: 10,
      },
      android: {
        elevation: 4,
      },
      web: {
        shadowColor: "#000000",
        shadowOffset: { width: 0, height: 6 },
        shadowOpacity: 0.08,
        shadowRadius: 10,
      },
    }),
  },
});

export default Avatar;
