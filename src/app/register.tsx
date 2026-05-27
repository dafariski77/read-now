import React from "react";
import { useRouter } from "expo-router";
import { RegisterView } from "@/features/auth/components";

export default function RegisterRoute() {
  const router = useRouter();

  const handleSuccess = (moniker: string) => {
    // Navigate home after successful sign-up
    router.replace("/home");
  };

  const handleNavigateToLogin = () => {
    // Navigate to login screen
    router.push("/login" as any);
  };

  return (
    <RegisterView
      onSuccess={handleSuccess}
      onNavigateToLogin={handleNavigateToLogin}
    />
  );
}
