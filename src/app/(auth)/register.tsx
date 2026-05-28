import React from "react";
import { useRouter } from "expo-router";
import { RegisterView } from "@/features/auth/components";

export default function RegisterRoute() {
  const router = useRouter();

  const handleSuccess = (moniker: string) => {
    router.replace("/setup-profile" as any);
  };

  const handleNavigateToLogin = () => {
    router.push("/login" as any);
  };

  return (
    <RegisterView
      onSuccess={handleSuccess}
      onNavigateToLogin={handleNavigateToLogin}
    />
  );
}
