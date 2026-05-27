import React from "react";
import { StyleSheet, View, ScrollView } from "react-native";
import { Theme } from "@/core/themes";
import { Text, Card, Chip } from "@/core/components";

interface GoalsStepProps {
  readingGoal: string;
  setReadingGoal: (goal: string) => void;
}

const GOALS = ["15 Mins", "30 Mins", "45 Mins", "60 Mins", "90 Mins", "120 Mins"];

export default function GoalsStep({ readingGoal, setReadingGoal }: GoalsStepProps) {
  return (
    <ScrollView
      showsVerticalScrollIndicator={false}
      contentContainerStyle={styles.stepVerticalContent}
    >
      <Text variant="headline-lg" color={Theme.Colors.primary} align="center" style={styles.stepTitle}>
        Set Your Daily Pace
      </Text>
      <Text variant="body-lg" color={Theme.Colors.secondary} align="center" style={styles.stepSubtitle}>
        How long do you intend to pause and read each day?
      </Text>

      <Card bordered surfaceColor="surfaceContainerLowest" elevation="low" style={styles.goalInteractiveCard}>
        <Text variant="label-md" color={Theme.Colors.primary} style={styles.goalLabel}>
          DAILY READING BLOCKS
        </Text>
        
        <View style={styles.durationChipsWrapper}>
          {GOALS.map((duration) => (
            <Chip
              key={duration}
              label={duration}
              selected={readingGoal === duration}
              onPress={() => setReadingGoal(duration)}
              style={styles.durationChip}
            />
          ))}
        </View>

        <View style={styles.goalStatusBox}>
          <Text variant="body-md" color={Theme.Colors.onSurfaceVariant} align="center">
            You are committing to <Text variant="label-md" color={Theme.Colors.primary}>{readingGoal}</Text> of serene reading focus daily. Excellent starting rhythm!
          </Text>
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
  goalInteractiveCard: {
    padding: Theme.Spacing.md,
    borderRadius: Theme.Roundness.lg,
  },
  goalLabel: {
    fontWeight: "700",
    letterSpacing: 1.5,
    marginBottom: Theme.Spacing.sm,
  },
  durationChipsWrapper: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginBottom: Theme.Spacing.md,
  },
  durationChip: {
    marginRight: Theme.Spacing.xs,
    marginBottom: Theme.Spacing.xs,
  },
  goalStatusBox: {
    backgroundColor: Theme.Colors.surfaceContainerLow,
    padding: Theme.Spacing.sm,
    borderRadius: Theme.Roundness.DEFAULT,
  },
});
