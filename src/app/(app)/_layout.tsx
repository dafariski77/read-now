import { Theme } from "@/core/themes";
import { useAuthStore } from "@/features/auth/store/useAuthStore";
import { Redirect, Stack } from "expo-router";
import { ActivityIndicator, View } from "react-native";

export default function AppLayout() {
  const { user, loading } = useAuthStore();

  if (loading) {
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

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="(tabs)" />
    </Stack>
  );
}

