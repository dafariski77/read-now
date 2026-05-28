import React from "react";
import { StyleSheet, View, ScrollView, Pressable } from "react-native";
import { Theme } from "@/core/themes";
import { Text } from "@/core/components";

interface GenreOption {
  id: number;
  name: string;
  emoji: string;
}

const ONBOARDING_GENRES: GenreOption[] = [
  { id: 1, name: "Fiction", emoji: "📖" },
  { id: 2, name: "Sci-Fi & Fantasy", emoji: "🪐" },
  { id: 3, name: "Philosophy", emoji: "🏛️" },
  { id: 4, name: "Non-Fiction", emoji: "💡" },
  { id: 5, name: "Romance", emoji: "💖" },
  { id: 6, name: "Biography", emoji: "👤" },
  { id: 7, name: "Poetry", emoji: "✒️" },
  { id: 8, name: "Self-Help", emoji: "🧠" },
  { id: 9, name: "Mystery & Thriller", emoji: "🕵️" },
];

interface GenresStepProps {
  selectedGenres: number[];
  setSelectedGenres: (genres: number[] | ((prev: number[]) => number[])) => void;
}

export default function GenresStep({ selectedGenres, setSelectedGenres }: GenresStepProps) {
  const handleToggleGenre = (genreId: number) => {
    setSelectedGenres((prev) => {
      if (prev.includes(genreId)) {
        return prev.filter((id) => id !== genreId);
      }
      
      // Limit to max 3 genres selected
      if (prev.length >= 3) {
        return prev;
      }
      
      return [...prev, genreId];
    });
  };

  return (
    <ScrollView
      showsVerticalScrollIndicator={false}
      contentContainerStyle={styles.stepVerticalContent}
    >
      <Text variant="headline-lg" color={Theme.Colors.primary} align="center" style={styles.stepTitle}>
        Select Your Realms
      </Text>
      <Text variant="body-lg" color={Theme.Colors.secondary} align="center" style={styles.stepSubtitle}>
        Choose 1 to 3 favorite genres. This customizes your recommendations and unlocks companion bonuses.
      </Text>

      <View style={styles.genresGrid}>
        {ONBOARDING_GENRES.map((genre) => {
          const isSelected = selectedGenres.includes(genre.id);
          
          return (
            <Pressable
              key={genre.id}
              onPress={() => handleToggleGenre(genre.id)}
              style={({ pressed }) => [
                styles.genrePill,
                isSelected && styles.genrePillSelected,
                pressed && styles.genrePillPressed,
              ]}
            >
              <Text style={styles.emojiText}>{genre.emoji}</Text>
              <Text
                variant="label-md"
                color={isSelected ? Theme.Colors.onPrimary : Theme.Colors.onSurface}
                style={[styles.genreText, isSelected && styles.genreTextSelected]}
              >
                {genre.name}
              </Text>
            </Pressable>
          );
        })}
      </View>
      
      <Text variant="label-sm" color={Theme.Colors.secondary} align="center" style={styles.selectionCounter}>
        {selectedGenres.length} of 3 Selected
      </Text>
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
  genresGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    gap: 12,
    paddingHorizontal: 8,
  },
  genrePill: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Theme.Colors.surfaceContainerLow,
    borderWidth: 1,
    borderColor: "rgba(198, 197, 211, 0.4)",
    borderRadius: Theme.Roundness.full,
    paddingVertical: 10,
    paddingHorizontal: 16,
    elevation: 1,
    shadowColor: "#000",
    shadowOpacity: 0.02,
    shadowRadius: 2,
    shadowOffset: { width: 0, height: 1 },
  },
  genrePillSelected: {
    backgroundColor: Theme.Colors.primary,
    borderColor: Theme.Colors.primary,
    elevation: 3,
    shadowColor: Theme.Colors.primary,
    shadowOpacity: 0.1,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
  },
  genrePillPressed: {
    transform: [{ scale: 0.96 }],
    opacity: 0.9,
  },
  emojiText: {
    fontSize: 18,
    marginRight: 6,
  },
  genreText: {
    fontWeight: "600",
  },
  genreTextSelected: {
    fontWeight: "700",
  },
  selectionCounter: {
    marginTop: Theme.Spacing.lg,
    fontWeight: "600",
  },
});
