import { Button, Card, InputField, Text, ScreenContainer } from "@/core/components";
import { Theme } from "@/core/themes";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import { Alert, StyleSheet, View } from "react-native";
import * as z from "zod";
import useAuth from "../hooks/useAuth";

const loginSchema = z.object({
  email: z.string().min(1, "Email is required").email("Invalid email address"),
  password: z.string().min(1, "Password is required"),
});

type LoginSchemaType = z.infer<typeof loginSchema>;

interface LoginViewProps {
  onSuccess: (moniker: string) => void;
  onNavigateToRegister: () => void;
}

export default function LoginView({
  onSuccess,
  onNavigateToRegister,
}: LoginViewProps) {
  const { login, loading, error } = useAuth();

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginSchemaType>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const handleLogin = async (data: LoginSchemaType) => {
    const success = await login(data.email, data.password);
    if (success) {
      Alert.alert("Sanctuary Opened", `Welcome back!`);
      onSuccess(data.email);
    }
  };

  return (
    <ScreenContainer
      scrollable={true}
      padding={false}
      contentContainerStyle={styles.scrollContent}
    >
        {/* Serene Brand Header */}
        <View style={styles.headerContainer}>
          <View style={styles.logoBadge}>
            <Text
              variant="headline-md"
              color={Theme.Colors.onPrimary}
              style={styles.logoText}
            >
              QR
            </Text>
          </View>
          <Text
            variant="display"
            color={Theme.Colors.primary}
            align="center"
            style={styles.title}
          >
            Quiet Reader
          </Text>
          <Text
            variant="headline-md"
            color={Theme.Colors.onBackground}
            align="center"
            style={styles.subtitle}
          >
            Masuk ke Quiet Reader
          </Text>
          <Text
            variant="body-md"
            color={Theme.Colors.secondary}
            align="center"
            style={styles.desc}
          >
            Please sign in to resume your reading journey.
          </Text>
        </View>

        {/* Form Container */}
        <Card
          bordered
          surfaceColor="surfaceContainerLowest"
          elevation="low"
          style={styles.formCard}
        >
          <Text
            variant="label-md"
            color={Theme.Colors.primary}
            style={styles.formLabel}
          >
            CREDENTIAL DETAILS
          </Text>

          <Controller
            control={control}
            name="email"
            render={({ field: { onChange, onBlur, value } }) => (
              <InputField
                label="Moniker/Email Address"
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
                label="Secure Password"
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
              <Text
                variant="label-sm"
                color={Theme.Colors.error}
                align="center"
              >
                {error}
              </Text>
            </View>
          )}

          <Button
            title="Enter Sanctuary"
            variant="primary"
            onPress={handleSubmit(handleLogin)}
            loading={loading}
            fullWidth
            style={styles.actionBtn}
          />
        </Card>

        {/* Footer Navigation Link */}
        <View style={styles.footerLinkWrapper}>
          <Button
            title="Don't have a moniker? Sign up"
            variant="ghost"
            onPress={onNavigateToRegister}
            fullWidth
          />
        </View>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
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
