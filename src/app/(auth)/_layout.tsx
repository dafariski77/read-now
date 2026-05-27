import React from "react";
import { Redirect, Stack } from "expo-router";
import { useAuthStore } from "@/features/auth/store/useAuthStore";
import { ActivityIndicator, View } from "react-native";
import { Theme } from "@/core/themes";

export default function AuthLayout() {
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

  // If user is already authenticated, redirect them directly to home dashboard
  if (user) {
    return <Redirect href="/home" />;
  }

  return <Stack screenOptions={{ headerShown: false }} />;
}
