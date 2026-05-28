import { Theme } from "@/core/themes";
import { useAuthStore } from "@/features/auth/store/useAuthStore";
import { Redirect, Stack, useSegments } from "expo-router";
import { ActivityIndicator, View } from "react-native";

export default function AppLayout() {
  const { user, loading, isProfileSetup } = useAuthStore();
  const segments = useSegments();

  // Show peaceful spinner if auth is initializing or if we're actively checking setup status for logged in users
  if (loading || (user && isProfileSetup === null)) {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: Theme.Colors.background,
        }}
      >
        <ActivityIndicator size="large" color={Theme.Colors.primary} />
      </View>
    );
  }

  // If user is not authenticated, redirect them directly to sign in
  if (!user) {
    return <Redirect href="/login" />;
  }

  const isOnSetupProfile = (segments as string[]).includes("setup-profile");

  // Force setup profile screen if they haven't completed onboarding details
  if (isProfileSetup === false && !isOnSetupProfile) {
    return <Redirect href="/setup-profile" />;
  }

  // If they have already completed profile setup, prevent going back to setup-profile
  if (isProfileSetup === true && isOnSetupProfile) {
    return <Redirect href="/home" />;
  }

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="(tabs)" />
      <Stack.Screen name="setup-profile" />
    </Stack>
  );
}

