import React from "react";
import { StyleSheet, View, ScrollView } from "react-native";
import { Theme } from "@/core/themes";
import { Text, Card, ProgressBar, Button } from "@/core/components";

interface ProgressStepProps {
  simulatedProgress: number;
  setSimulatedProgress: (progress: number | ((prev: number) => number)) => void;
}

export default function ProgressStep({
  simulatedProgress,
  setSimulatedProgress,
}: ProgressStepProps) {
  return (
    <ScrollView
      showsVerticalScrollIndicator={false}
      contentContainerStyle={styles.stepVerticalContent}
    >
      <Text variant="headline-lg" color={Theme.Colors.primary} align="center" style={styles.stepTitle}>
        Visualize Your Milestones
      </Text>
      <Text variant="body-lg" color={Theme.Colors.secondary} align="center" style={styles.stepSubtitle}>
        Our quiet progress systems help you keep context and celebrate consistency without alerts.
      </Text>

      <Card bordered surfaceColor="surfaceContainerLowest" elevation="low" style={styles.progressInteractiveCard}>
        <View style={styles.simulatedBookRow}>
          <View style={styles.simulatedCover} />
          <View style={styles.simulatedBookMeta}>
            <Text variant="label-md" color={Theme.Colors.onBackground}>
              The Art of Serene Focus
            </Text>
            <Text variant="label-sm" color={Theme.Colors.secondary}>
              Calm Minds Publishing
            </Text>
          </View>
        </View>

        <View style={styles.interactiveProgressHeader}>
          <Text variant="label-sm" color={Theme.Colors.onSurfaceVariant}>
            SIMULATED PROGRESS TRACK
          </Text>
          <Text variant="label-sm" color={Theme.Colors.primary}>
            {Math.round(simulatedProgress * 100)}% Complete
          </Text>
        </View>
        <ProgressBar progress={simulatedProgress} style={styles.animatedProgBar} />

        <View style={styles.progressManualControls}>
          <Button
            title="Reduce Progress (-)"
            variant="ghost"
            onPress={() =>
              setSimulatedProgress((prev) =>
                Math.max(0, parseFloat((prev - 0.05).toFixed(2)))
              )
            }
            style={styles.manualBtn}
          />
          <Button
            title="Advance Progress (+)"
            variant="secondary"
            onPress={() =>
              setSimulatedProgress((prev) =>
                Math.min(1, parseFloat((prev + 0.05).toFixed(2)))
              )
            }
            style={styles.manualBtn}
          />
        </View>
      </Card>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  stepVerticalContent: {
    paddingBottom: Theme.Spacing.xl,
    paddingTop: Theme.Spacing.xs,
  },
  stepTitle: {
    fontWeight: "700",
    marginBottom: Theme.Spacing.xs,
  },
  stepSubtitle: {
    marginBottom: Theme.Spacing.lg,
    lineHeight: 26,
  },
  progressInteractiveCard: {
    padding: Theme.Spacing.md,
    borderRadius: Theme.Roundness.lg,
  },
  simulatedBookRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: Theme.Spacing.md,
  },
  simulatedCover: {
    width: 48,
    height: 64,
    borderRadius: Theme.Roundness.sm,
    backgroundColor: Theme.Colors.primaryContainer,
  },
  simulatedBookMeta: {
    marginLeft: Theme.Spacing.sm,
    flex: 1,
  },
  interactiveProgressHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: Theme.Spacing.xs,
  },
  animatedProgBar: {
    marginBottom: Theme.Spacing.md,
  },
  progressManualControls: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  manualBtn: {
    width: "48%",
  },
});
