import React from "react";
import { StyleSheet, View, ScrollView, Alert, KeyboardAvoidingView, Platform } from "react-native";
import { Theme } from "@/core/themes";
import { Text, Button, Card, InputField } from "@/core/components";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import useAuth from "../hooks/useAuth";

const registerSchema = z.object({
  moniker: z.string().min(1, "Moniker is required").min(2, "Moniker must be at least 2 characters"),
  email: z.string().min(1, "Email is required").email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

type RegisterSchemaType = z.infer<typeof registerSchema>;

interface RegisterViewProps {
  onSuccess: (moniker: string) => void;
  onNavigateToLogin: () => void;
}

export default function RegisterView({ onSuccess, onNavigateToLogin }: RegisterViewProps) {
  const { register, loading, error } = useAuth();

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterSchemaType>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      moniker: "",
      email: "",
      password: "",
    },
  });

  const handleRegister = async (data: RegisterSchemaType) => {
    const success = await register(data.moniker, data.email, data.password);
    if (success) {
      Alert.alert("Sanctuary Opened", `Welcome, ${data.moniker}!`);
      onSuccess(data.moniker);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.keyboardContainer}
    >
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Serene Brand Header */}
        <View style={styles.headerContainer}>
          <View style={styles.logoBadge}>
            <Text variant="headline-md" color={Theme.Colors.onPrimary} style={styles.logoText}>
              QR
            </Text>
          </View>
          <Text variant="display" color={Theme.Colors.primary} align="center" style={styles.title}>
            Quiet Reader
          </Text>
          <Text variant="headline-md" color={Theme.Colors.onBackground} align="center" style={styles.subtitle}>
            Daftar Quiet Reader
          </Text>
          <Text variant="body-md" color={Theme.Colors.secondary} align="center" style={styles.desc}>
            Establish a digital reading profile tailored for you.
          </Text>
        </View>

        {/* Form Container */}
        <Card bordered surfaceColor="surfaceContainerLowest" elevation="low" style={styles.formCard}>
          <Text variant="label-md" color={Theme.Colors.primary} style={styles.formLabel}>
            ESTABLISH MONIKER PROFILE
          </Text>

          <Controller
            control={control}
            name="moniker"
            render={({ field: { onChange, onBlur, value } }) => (
              <InputField
                label="Moniker (Nickname/Reader Name)"
                placeholder="e.g. ReaderOne"
                value={value}
                onChangeText={onChange}
                onBlur={onBlur}
                error={errors.moniker?.message}
                autoCapitalize="words"
              />
            )}
          />

          <Controller
            control={control}
            name="email"
            render={({ field: { onChange, onBlur, value } }) => (
              <InputField
                label="Email Address"
                placeholder="e.g. reader@sanctuary.com"
                value={value}
                onChangeText={onChange}
                onBlur={onBlur}
                error={errors.email?.message}
                autoCapitalize="none"
                keyboardType="email-address"
              />
            )}
          />

          <Controller
            control={control}
            name="password"
            render={({ field: { onChange, onBlur, value } }) => (
              <InputField
                label="Secure Password (6+ characters)"
                placeholder="••••••••"
                value={value}
                onChangeText={onChange}
                onBlur={onBlur}
                error={errors.password?.message}
                secureTextEntry
                autoCapitalize="none"
              />
            )}
          />

          {error && (
            <View style={styles.errorContainer}>
              <Text variant="label-sm" color={Theme.Colors.error} align="center">
                {error}
              </Text>
            </View>
          )}

          <Button
            title="Begin Your Journey"
            variant="primary"
            onPress={handleSubmit(handleRegister)}
            loading={loading}
            fullWidth
            style={styles.actionBtn}
          />
        </Card>

        {/* Footer Navigation Link */}
        <View style={styles.footerLinkWrapper}>
          <Button
            title="Already have a moniker? Sign in"
            variant="ghost"
            onPress={onNavigateToLogin}
            fullWidth
          />
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  keyboardContainer: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: "center",
    paddingHorizontal: Theme.Spacing.marginMobile,
    paddingVertical: Theme.Spacing.lg,
  },
  headerContainer: {
    alignItems: "center",
    marginBottom: Theme.Spacing.lg,
  },
  logoBadge: {
    width: 64,
    height: 64,
    borderRadius: Theme.Roundness.md,
    backgroundColor: Theme.Colors.primary,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: Theme.Spacing.sm,
    shadowColor: Theme.Colors.primary,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
  },
  logoText: {
    fontWeight: "700",
  },
  title: {
    fontWeight: "700",
    marginBottom: 4,
  },
  subtitle: {
    fontWeight: "600",
    marginBottom: Theme.Spacing.xs,
  },
  desc: {
    paddingHorizontal: Theme.Spacing.md,
  },
  formCard: {
    padding: Theme.Spacing.md,
    borderRadius: Theme.Roundness.lg,
  },
  formLabel: {
    fontWeight: "700",
    letterSpacing: 1.5,
    marginBottom: Theme.Spacing.md,
  },
  errorContainer: {
    backgroundColor: Theme.Colors.errorContainer,
    padding: Theme.Spacing.sm,
    borderRadius: Theme.Roundness.DEFAULT,
    marginBottom: Theme.Spacing.sm,
    borderWidth: 1,
    borderColor: Theme.Colors.error,
  },
  actionBtn: {
    height: 52,
    marginTop: Theme.Spacing.xs,
  },
  footerLinkWrapper: {
    marginTop: Theme.Spacing.md,
    alignItems: "center",
  },
});
