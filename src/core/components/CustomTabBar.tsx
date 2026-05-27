import React from "react";
import { StyleSheet, View, Pressable, Platform } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Theme } from "@/core/themes";
import { Text } from "@/core/components";
import Svg, { Path, Circle } from "react-native-svg";
export interface BottomTabBarProps {
  state: {
    index: number;
    routes: Array<{
      key: string;
      name: string;
      params?: any;
    }>;
  };
  descriptors: Record<string, {
    options: {
      tabBarAccessibilityLabel?: string;
      tabBarTestID?: string;
      [key: string]: any;
    };
  }>;
  navigation: {
    emit: (event: { type: string; target?: string; canPreventDefault?: boolean }) => any;
    navigate: (name: string, params?: any) => void;
  };
}

// Vector icons specifically tuned to represent our Material Symbol equivalents in Stitch
const HomeIcon = ({ active = false, color = Theme.Colors.secondary, size = 22 }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill={active ? color : "none"}>
    <Path
      d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z"
      stroke={color}
      strokeWidth={active ? 0 : 2}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);

const DiscoverIcon = ({ active = false, color = Theme.Colors.secondary, size = 22 }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill={active ? color : "none"}>
    <Path
      d="M12 2a10 10 0 1010 10A10 10 0 0012 2zm1 11.5l-4.5 4.5 4.5-4.5zm1.5-6.5l-2.75 6.25L5.5 14.5l6.25-2.75L14.5 5.5z"
      stroke={color}
      strokeWidth={active ? 0 : 2}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);

const CollectionIcon = ({ active = false, color = Theme.Colors.secondary, size = 22 }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill={active ? color : "none"}>
    {/* Elegant Star Constellation (representing auto_awesome) */}
    <Path
      d="M9 2L7.17 6.17 3 8l4.17 1.83L9 14l1.83-4.17L15 8l-4.17-1.83L9 2zm10 8l-.92 2.08L16 11l2.08.92L19 14l.92-2.08L22 11l-2.08-.92L19 8zm-3.5-5l-.58 1.42L13.5 5l1.42.58L15.5 7l.58-1.42L17.5 5l-1.42-.58L15.5 3z"
      stroke={color}
      strokeWidth={active ? 0 : 1.5}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);

const ProfileIcon = ({ active = false, color = Theme.Colors.secondary, size = 22 }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill={active ? color : "none"}>
    <Path
      d="M12 12a5 5 0 100-10 5 5 0 000 10zm0 2c-4.42 0-8 3.58-8 8h16c0-4.42-3.58-8-8-8z"
      stroke={color}
      strokeWidth={active ? 0 : 2}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);

export const CustomTabBar: React.FC<any> = ({ state, descriptors, navigation }) => {
  const insets = useSafeAreaInsets();

  return (
    <View
      style={[
        styles.tabBarContainer,
        {
          paddingBottom: Math.max(insets.bottom, 12),
          height: 64 + Math.max(insets.bottom, 12),
        },
      ]}
    >
      <View style={styles.tabBarInner}>
        {state.routes.map((route: any, index: number) => {
          const { options } = descriptors[route.key];
          const isFocused = state.index === index;

          const onPress = () => {
            const event = navigation.emit({
              type: "tabPress",
              target: route.key,
              canPreventDefault: true,
            });

            if (!isFocused && !event.defaultPrevented) {
              navigation.navigate(route.name);
            }
          };

          const onLongPress = () => {
            navigation.emit({
              type: "tabLongPress",
              target: route.key,
            });
          };

          // Icon and Label Mapping
          let iconComponent = null;
          let labelText = "";
          const activeColor = Theme.Colors.primary;
          const inactiveColor = Theme.Colors.onSurfaceVariant;

          switch (route.name) {
            case "home":
              labelText = "Home";
              iconComponent = <HomeIcon active={isFocused} color={isFocused ? activeColor : inactiveColor} />;
              break;
            case "discover":
              labelText = "Discover";
              iconComponent = <DiscoverIcon active={isFocused} color={isFocused ? activeColor : inactiveColor} />;
              break;
            case "collection":
              labelText = "Collection";
              iconComponent = <CollectionIcon active={isFocused} color={isFocused ? activeColor : inactiveColor} />;
              break;
            case "profile":
              labelText = "Profile";
              iconComponent = <ProfileIcon active={isFocused} color={isFocused ? activeColor : inactiveColor} />;
              break;
            default:
              labelText = route.name;
              iconComponent = <HomeIcon active={isFocused} color={isFocused ? activeColor : inactiveColor} />;
          }

          return (
            <Pressable
              key={route.key}
              accessibilityRole="button"
              accessibilityState={isFocused ? { selected: true } : {}}
              accessibilityLabel={options.tabBarAccessibilityLabel}
              testID={options.tabBarTestID}
              onPress={onPress}
              onLongPress={onLongPress}
              style={({ pressed }) => [
                styles.tabItem,
                isFocused && styles.tabItemActive,
                pressed && styles.tabItemPressed,
              ]}
            >
              <View style={styles.iconWrapper}>{iconComponent}</View>
              <Text
                variant="label-sm"
                color={isFocused ? Theme.Colors.primary : Theme.Colors.onSurfaceVariant}
                style={[styles.tabLabel, isFocused && styles.tabLabelActive]}
              >
                {labelText}
              </Text>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  tabBarContainer: {
    backgroundColor: Theme.Colors.surfaceContainerLowest,
    borderTopWidth: 1,
    borderTopColor: "rgba(198, 197, 211, 0.2)",
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    elevation: 12,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: -4 },
    zIndex: 100,
  },
  tabBarInner: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    paddingHorizontal: 12,
    paddingTop: 8,
  },
  tabItem: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 16,
    maxWidth: 90,
  },
  tabItemActive: {
    backgroundColor: "rgba(67, 82, 165, 0.08)", // 8% opacity Indigo container matching Stitch
  },
  tabItemPressed: {
    transform: [{ scale: 0.95 }],
    opacity: 0.85,
  },
  iconWrapper: {
    marginBottom: 4,
    alignItems: "center",
    justifyContent: "center",
    height: 24,
  },
  tabLabel: {
    fontSize: 10,
    fontWeight: "600",
  },
  tabLabelActive: {
    fontWeight: "700",
  },
});

export default CustomTabBar;
