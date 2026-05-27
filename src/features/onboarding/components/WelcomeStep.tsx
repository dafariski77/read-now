import React from "react";
import { StyleSheet, View, ScrollView } from "react-native";
import { Theme } from "@/core/themes";
import { Text, Card } from "@/core/components";

export default function WelcomeStep() {
  return (
    <ScrollView
      showsVerticalScrollIndicator={false}
      contentContainerStyle={styles.stepVerticalContent}
    >
      <View style={styles.logoContainer}>
        <View style={styles.largeLogoBadge}>
          <Text variant="display" color={Theme.Colors.onPrimary}>
            QR
          </Text>
        </View>
      </View>
      <Text variant="display" color={Theme.Colors.primary} align="center" style={styles.editorialTitle}>
        Quiet Reader
      </Text>
      <Text variant="headline-md" color={Theme.Colors.onBackground} align="center" style={styles.tagline}>
        A serene sanctuary for focused minds.
      </Text>
      <Card bordered surfaceColor="surfaceContainerLowest" elevation="low" style={styles.introCard}>
        <Text variant="body-lg" color={Theme.Colors.secondary} align="center" style={styles.introText}>
          Create a quiet digital workspace tailored for long-form reading, tracking milestones, and cultivating peaceful daily habit blocks away from social noise.
        </Text>
      </Card>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  stepVerticalContent: {
    paddingBottom: Theme.Spacing.xl,
    paddingTop: Theme.Spacing.xs,
  },
  logoContainer: {
    alignItems: "center",
    marginBottom: Theme.Spacing.md,
  },
  largeLogoBadge: {
    width: 96,
    height: 96,
    borderRadius: Theme.Roundness.xl,
    backgroundColor: Theme.Colors.primary,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: Theme.Colors.primary,
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.15,
    shadowRadius: 20,
  },
  editorialTitle: {
    fontWeight: "700",
    marginBottom: Theme.Spacing.xs,
  },
  tagline: {
    fontWeight: "600",
    marginBottom: Theme.Spacing.lg,
  },
  introCard: {
    padding: Theme.Spacing.md,
    borderRadius: Theme.Roundness.lg,
  },
  introText: {
    lineHeight: 28,
  },
});
