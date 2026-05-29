import { Theme } from "@/core/themes";
import React from "react";
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StatusBar,
  StyleSheet,
  View,
  ViewStyle,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import AppTopBar from "./AppTopBar";

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
  header?: React.ReactNode | null;
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
  header,
}) => {
  const insets = useSafeAreaInsets();

  // Calculate bottom tab bar height matching CustomTabBar.tsx exactly
  const bottomTabsPadding = hasBottomTabs
    ? 64 + Math.max(insets.bottom, 12)
    : 0;
  const resolvedBottomPadding =
    (padding ? paddingVertical : 0) + bottomTabsPadding;

  // If header is explicitly null, don't show it.
  // If header is undefined, use the default <AppTopBar /> component.
  // Otherwise, use the custom header passed.
  const resolvedHeader = header === null ? null : (header ?? <AppTopBar />);

  const headerSpacing = resolvedHeader ? Theme.Spacing.md : 0;

  const containerPaddingStyle: ViewStyle = padding
    ? { paddingHorizontal, paddingTop: paddingVertical + headerSpacing }
    : { paddingTop: headerSpacing };

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
    <View style={styles.safeArea}>
      <StatusBar
        barStyle={barStyle}
        backgroundColor="transparent"
        translucent
      />
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.flexContainer}
      >
        {resolvedHeader && (
          <View
            style={{
              paddingTop: insets.top,
              backgroundColor: Theme.Colors.appBarBackground,
            }}
          >
            {resolvedHeader}
          </View>
        )}
        {!resolvedHeader && (
          <View
            style={{
              height: insets.top,
              backgroundColor: statusBarColor || Theme.Colors.background,
            }}
          />
        )}
        {content}
      </KeyboardAvoidingView>
    </View>
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
