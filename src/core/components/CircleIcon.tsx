import { Theme } from "@/core/themes";
import {
  AntDesign,
  Feather,
  FontAwesome,
  Ionicons,
  MaterialCommunityIcons,
  MaterialIcons,
} from "@expo/vector-icons";
import React from "react";
import {
  Platform,
  Pressable,
  StyleProp,
  StyleSheet,
  View,
  ViewStyle,
} from "react-native";

const IconLibraries = {
  Ionicons,
  Feather,
  MaterialIcons,
  FontAwesome,
  MaterialCommunityIcons,
  AntDesign,
};

export interface CircleIconProps {
  icon?: React.ComponentType<any> | React.ReactNode;
  name?: string;
  library?: keyof typeof IconLibraries;
  size?: number;
  containerSize?: number;
  color?: keyof typeof Theme.Colors | string;
  backgroundColor?: keyof typeof Theme.Colors | string;
  padding?: number;
  elevation?: "none" | "low" | "high";
  bordered?: boolean;
  borderColor?: string;
  onPress?: () => void;
  style?: StyleProp<ViewStyle>;
}

export const CircleIcon: React.FC<CircleIconProps> = ({
  icon,
  name,
  library = "Ionicons",
  size = 24,
  containerSize = 48,
  color = "primary",
  backgroundColor = "surfaceContainer",
  padding,
  elevation = "none",
  bordered = false,
  borderColor = Theme.Colors.outlineVariant,
  onPress,
  style,
}) => {
  // 1. Resolve colors based on dynamic tokens
  const glyphColor = Theme.Colors[color as keyof typeof Theme.Colors] || color;
  const containerBgColor =
    Theme.Colors[backgroundColor as keyof typeof Theme.Colors] ||
    backgroundColor;

  // 2. Enforce geometric circle styles
  const containerStyle: ViewStyle = {
    width: containerSize,
    height: containerSize,
    borderRadius: containerSize / 2,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: containerBgColor,
    overflow: "hidden",
  };

  if (padding !== undefined) {
    containerStyle.padding = padding;
  }

  if (bordered) {
    containerStyle.borderWidth = 1;
    containerStyle.borderColor = borderColor;
  }

  // 3. Resolve vector icon content
  const renderIcon = () => {
    if (!icon) {
      const SelectedIconLib = IconLibraries[library] || Ionicons;
      return <SelectedIconLib name={name as any} size={size} color={glyphColor} />;
    }

    if (React.isValidElement(icon)) {
      return React.cloneElement(icon as React.ReactElement<any>, {
        size: (icon.props as any).size ?? size,
        color: (icon.props as any).color ?? glyphColor,
      });
    }

    const IconComponent = icon as React.ComponentType<any>;
    return <IconComponent name={name} size={size} color={glyphColor} />;
  };

  const WrapperComponent = onPress ? Pressable : View;
  const wrapperProps = onPress ? { onPress, style: styles.pressable } : {};

  return (
    <View style={[containerStyle, styles[elevation], style]}>
      <WrapperComponent {...wrapperProps} style={styles.pressable}>
        {renderIcon()}
      </WrapperComponent>
    </View>
  );
};

const styles = StyleSheet.create({
  pressable: {
    width: "100%",
    height: "100%",
    alignItems: "center",
    justifyContent: "center",
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

export default CircleIcon;
