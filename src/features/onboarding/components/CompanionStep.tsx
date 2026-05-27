import React from "react";
import { StyleSheet, View, ScrollView, Pressable } from "react-native";
import { Theme } from "@/core/themes";
import { Text, InputField } from "@/core/components";

interface Companion {
  id: string;
  emoji: string;
  name: string;
  role: string;
  color: string;
}

interface CompanionStepProps {
  selectedCompanion: string;
  setSelectedCompanion: (companion: string) => void;
  moniker: string;
  setMoniker: (moniker: string) => void;
}

const COMPANIONS: Companion[] = [
  { id: "fennec", emoji: "🦊", name: "Fennec", role: "Philosopher", color: "#E0E3FF" },
  { id: "ollie", emoji: "🦉", name: "Ollie", role: "Scholar", color: "#E2F5EC" },
  { id: "cleo", emoji: "🐱", name: "Cleo", role: "Poet", color: "#FFE8D6" },
  { id: "koa", emoji: "🐨", name: "Koa", role: "Dreamer", color: "#E3F2FD" },
  { id: "pandi", emoji: "🐼", name: "Pandi", role: "Historian", color: "#FFEBEE" },
  { id: "sid", emoji: "🦥", name: "Sid", role: "Thinker", color: "#EDE7F6" },
];

export default function CompanionStep({
  selectedCompanion,
  setSelectedCompanion,
  moniker,
  setMoniker,
}: CompanionStepProps) {
  return (
    <ScrollView
      showsVerticalScrollIndicator={false}
      contentContainerStyle={styles.stepVerticalContent}
    >
      <Text variant="headline-lg" color={Theme.Colors.primary} align="center" style={styles.stepTitle}>
        Choose Your Companion
      </Text>
      <Text variant="body-lg" color={Theme.Colors.secondary} align="center" style={styles.stepSubtitle}>
        Select a silent reading guide and input your moniker.
      </Text>

      <View style={styles.monikerInputWrapper}>
        <InputField
          label="What should Ollie call you?"
          placeholder="Enter your moniker or nickname..."
          value={moniker}
          onChangeText={setMoniker}
        />
      </View>

      <Text variant="label-sm" color={Theme.Colors.secondary} style={styles.gridLabel}>
        SELECT A COMPANION CHARACTER
      </Text>
      <View style={styles.avatarGrid}>
        {COMPANIONS.map((companion) => {
          const isSelected = selectedCompanion === companion.id;
          return (
            <Pressable
              key={companion.id}
              onPress={() => setSelectedCompanion(companion.id)}
              style={[
                styles.avatarCard,
                { backgroundColor: companion.color },
                isSelected && styles.avatarCardSelected,
              ]}
            >
              <View style={styles.avatarEmojiContainer}>
                <Text style={styles.avatarEmoji}>{companion.emoji}</Text>
              </View>
              <Text variant="label-md" color={Theme.Colors.onBackground} style={styles.avatarName}>
                {companion.name}
              </Text>
              <Text variant="label-sm" color={Theme.Colors.secondary} style={styles.avatarRole}>
                {companion.role}
              </Text>
              {isSelected && <View style={styles.selectedIndicatorDot} />}
            </Pressable>
          );
        })}
      </View>
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
  monikerInputWrapper: {
    marginBottom: Theme.Spacing.sm,
  },
  gridLabel: {
    fontWeight: "600",
    letterSpacing: 1.2,
    marginBottom: Theme.Spacing.xs,
    paddingLeft: Theme.Spacing.xs,
  },
  avatarGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  avatarCard: {
    width: "31%",
    aspectRatio: 0.88,
    padding: Theme.Spacing.xs,
    borderRadius: Theme.Roundness.md,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: Theme.Spacing.xs,
    borderWidth: 2,
    borderColor: "transparent",
    position: "relative",
  },
  avatarCardSelected: {
    borderColor: Theme.Colors.primary,
    shadowColor: Theme.Colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 10,
  },
  avatarEmojiContainer: {
    marginBottom: 2,
  },
  avatarEmoji: {
    fontSize: 26,
  },
  avatarName: {
    fontWeight: "700",
    fontSize: 13,
  },
  avatarRole: {
    fontSize: 10,
    marginTop: 1,
  },
  selectedIndicatorDot: {
    position: "absolute",
    top: 6,
    right: 6,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: Theme.Colors.primary,
  },
});
