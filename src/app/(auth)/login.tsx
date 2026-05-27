import React from "react";
import { useRouter } from "expo-router";
import { LoginView } from "@/features/auth/components";

export default function LoginRoute() {
  const router = useRouter();

  const handleSuccess = (email: string) => {
    router.replace("/home");
  };

  const handleNavigateToRegister = () => {
    router.push("/register" as any);
  };

  return (
    <LoginView
      onSuccess={handleSuccess}
      onNavigateToRegister={handleNavigateToRegister}
    />
  );
}
