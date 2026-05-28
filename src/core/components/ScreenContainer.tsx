import { Theme } from "@/core/themes";
import React from "react";
import {
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  View,
  ViewStyle,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export interface ScreenContainerProps {
  children: React.ReactNode;
  scrollable?: boolean;
  padding?: boolean;
  paddingHorizontal?: number;
  paddingVertical?: number;
  style?: ViewStyle;
  contentContainerStyle?: ViewStyle;
  statusBarColor?: string;
  barStyle?: "default" | "light-content" | "dark-content";
  hasBottomTabs?: boolean;
  refreshControl?: any;
}

export const ScreenContainer: React.FC<ScreenContainerProps> = ({
  children,
  scrollable = false,
  padding = true,
  paddingHorizontal = Theme.Spacing.marginMobile,
  paddingVertical = Theme.Spacing.md,
  style,
  contentContainerStyle,
  statusBarColor = Theme.Colors.background,
  barStyle = "dark-content",
  hasBottomTabs = false,
  refreshControl,
}) => {
  const insets = useSafeAreaInsets();

  // Calculate bottom tab bar height matching CustomTabBar.tsx exactly
  const bottomTabsPadding = hasBottomTabs
    ? 64 + Math.max(insets.bottom, 12)
    : 0;
  const resolvedBottomPadding =
    (padding ? paddingVertical : 0) + bottomTabsPadding;

  const containerPaddingStyle: ViewStyle = padding
    ? { paddingHorizontal, paddingTop: paddingVertical }
    : {};

  const content = scrollable ? (
    <ScrollView
      showsVerticalScrollIndicator={false}
      keyboardShouldPersistTaps="handled"
      refreshControl={refreshControl}
      contentContainerStyle={[
        styles.scrollContent,
        containerPaddingStyle,
        { paddingBottom: resolvedBottomPadding },
        contentContainerStyle,
      ]}
    >
      {children}
    </ScrollView>
  ) : (
    <View
      style={[
        styles.flexContainer,
        containerPaddingStyle,
        { paddingBottom: resolvedBottomPadding },
        style,
      ]}
    >
      {children}
    </View>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle={barStyle} backgroundColor={statusBarColor} />
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.flexContainer}
      >
        {content}
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: Theme.Colors.background,
  },
  flexContainer: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
  },
});

export default ScreenContainer;
