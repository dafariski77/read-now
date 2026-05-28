import { Button, Card, Text, Skeleton } from "@/core/components";
import { supabase } from "@/core/libs/supabase";
import { Theme } from "@/core/themes";
import { AuthService } from "@/features/auth/services/AuthService";
import { useAuthStore } from "@/features/auth/store/useAuthStore";
import CharacterAvatar from "@/features/collection/components/CharacterAvatar";
import { CollectionRepository } from "@/features/collection/repositories/CollectionRepository";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Dimensions,
  Pressable,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  View,
} from "react-native";

const { width } = Dimensions.get("window");

interface Genre {
  id: number;
  name: string;
}

const getGenreEmoji = (genreName: string) => {
  const name = genreName.toLowerCase();
  if (name.includes("sci-fi") || name.includes("fantasy")) return "🚀";
  if (name.includes("philosophy")) return "🧠";
  if (name.includes("non-fiction")) return "💡";
  if (name.includes("romance")) return "💖";
  if (name.includes("biography")) return "📜";
  if (name.includes("poetry")) return "✍️";
  if (name.includes("self-help")) return "🌱";
  if (name.includes("mystery") || name.includes("thriller")) return "🕵️";
  return "📖";
};

export default function SetupProfileScreen() {
  const router = useRouter();
  const { user } = useAuthStore();
  const queryClient = useQueryClient();
  const [currentStep, setCurrentStep] = useState(0); // 0 = Genres, 1 = Companion Claim

  // User selections
  const [selectedGenres, setSelectedGenres] = useState<number[]>([]);
  const [selectedCompanionId, setSelectedCompanionId] = useState<string>("");

  // 1. Fetch master genres
  const { data: genres = [], isLoading: genresLoading } = useQuery({
    queryKey: ["masterGenres"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("genres")
        .select("*")
        .order("id", { ascending: true });
      if (error) throw error;
      return data || [];
    },
  });

  // 2. Fetch characters
  const { data: companions = [], isLoading: companionsLoading } = useQuery({
    queryKey: ["allCompanions"],
    queryFn: () => CollectionRepository.fetchAllCharacters(),
  });

  // Set default companion selection once companions are loaded
  useEffect(() => {
    if (companions.length > 0 && !selectedCompanionId) {
      const starter = companions.find((c) => c.is_default) || companions[0];
      setSelectedCompanionId(starter.id);
    }
  }, [companions, selectedCompanionId]);

  // 3. Complete setup mutation
  const completeSetupMutation = useMutation({
    mutationFn: async ({
      genreIds,
      companionId,
    }: {
      genreIds: number[];
      companionId: string;
    }) => {
      if (!user) throw new Error("User not logged in.");
      return await AuthService.completeProfileSetup(
        user.id,
        genreIds,
        companionId,
      );
    },
    onSuccess: () => {
      // Invalidate everything to refresh active state instantly
      queryClient.invalidateQueries({ queryKey: ["userProfile", user?.id] });
      queryClient.invalidateQueries({ queryKey: ["userGenres", user?.id] });
      queryClient.invalidateQueries({ queryKey: ["userCollection", user?.id] });
      useAuthStore.getState().setProfileSetupComplete();

      Alert.alert(
        "🎉 Welcome to Your Sanctuary!",
        "Your reading sanctuary profile has been configured successfully. Start enjoying peaceful reading blocks! ✦",
        [
          {
            text: "Enter Sanctuary",
            onPress: () => {
              router.replace("/home");
            },
          },
        ],
      );
    },
    onError: (err: any) => {
      Alert.alert(
        "Setup Error",
        "Failed to save profile preferences: " + err.message,
      );
    },
  });

  const handleToggleGenre = (genreId: number) => {
    setSelectedGenres((prev) => {
      if (prev.includes(genreId)) {
        return prev.filter((id) => id !== genreId);
      } else {
        if (prev.length >= 3) {
          Alert.alert(
            "Limit Reached",
            "You can choose up to 3 favorite genres.",
          );
          return prev;
        }
        return [...prev, genreId];
      }
    });
  };

  const handleNextStep = () => {
    if (selectedGenres.length === 0) {
      Alert.alert(
        "Genres Required",
        "Please select at least 1 favorite genre to shape your digital library.",
      );
      return;
    }
    setCurrentStep(1);
  };

  const handleCompleteSetup = async () => {
    if (!selectedCompanionId) {
      Alert.alert(
        "Companion Required",
        "Please select a companion buddy to keep you focused.",
      );
      return;
    }
    await completeSetupMutation.mutateAsync({
      genreIds: selectedGenres,
      companionId: selectedCompanionId,
    });
  };

  const loading = genresLoading || companionsLoading;
  const submitting = completeSetupMutation.isPending;

  if (loading) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <StatusBar barStyle="dark-content" backgroundColor={Theme.Colors.background} />
        <View style={styles.header}>
          <Skeleton width={200} height={26} style={{ marginBottom: 4 }} />
          <Skeleton width={120} height={14} />
          <View style={styles.progressContainer}>
            <View style={[styles.progressBar, { width: "50%" }]} />
          </View>
        </View>

        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          <View style={styles.stepContainer}>
            <Skeleton width={180} height={22} style={{ marginBottom: 8 }} />
            <Skeleton width="95%" height={16} />
            <Skeleton width="85%" height={16} style={{ marginBottom: 24 }} />

            <View style={styles.genresGrid}>
              {Array.from({ length: 9 }).map((_, index) => (
                <Skeleton
                  key={index}
                  width={index % 2 === 0 ? 110 : 140}
                  height={44}
                  borderRadius={22}
                />
              ))}
            </View>

            <Skeleton width="100%" height={52} borderRadius={16} style={{ marginTop: 24 }} />
          </View>
        </ScrollView>
      </SafeAreaView>
    );
  }

  const selectedCompanion = companions.find(
    (c) => c.id === selectedCompanionId,
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar
        barStyle="dark-content"
        backgroundColor={Theme.Colors.background}
      />

      {/* Top Header Step Indicators */}
      <View style={styles.header}>
        <Text
          variant="headline-lg-mobile"
          color={Theme.Colors.primary}
          style={styles.headerTitle}
        >
          Setup Reading Sanctuary
        </Text>
        <Text variant="label-sm" color={Theme.Colors.secondary}>
          {currentStep === 0
            ? "Step 1 of 2: Favorite Realms"
            : "Step 2 of 2: Claim Companion"}
        </Text>

        <View style={styles.progressContainer}>
          <View
            style={[
              styles.progressBar,
              { width: currentStep === 0 ? "50%" : "100%" },
            ]}
          />
        </View>
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {currentStep === 0 ? (
          /* Step 1: Select Realms (Genres) */
          <View style={styles.stepContainer}>
            <Text
              variant="headline-md"
              color={Theme.Colors.onBackground}
              style={styles.stepTitle}
            >
              Select Favorite Realms
            </Text>
            <Text
              variant="body-md"
              color={Theme.Colors.secondary}
              style={styles.stepDesc}
            >
              Choose 1 to 3 literary realms you love. We will customize your
              serene beranda with matching curations!
            </Text>

            <View style={styles.genresGrid}>
              {genres.map((genre) => {
                const isSelected = selectedGenres.includes(genre.id);
                return (
                  <Pressable
                    key={genre.id}
                    onPress={() => handleToggleGenre(genre.id)}
                    style={[
                      styles.genrePill,
                      isSelected && styles.genrePillSelected,
                    ]}
                  >
                    <Text
                      variant="label-md"
                      color={
                        isSelected
                          ? Theme.Colors.primary
                          : Theme.Colors.onBackground
                      }
                    >
                      {getGenreEmoji(genre.name)} {genre.name}
                    </Text>
                  </Pressable>
                );
              })}
            </View>

            <Button
              title="Next: Claim Companion →"
              variant="primary"
              onPress={handleNextStep}
              style={styles.actionBtn}
              fullWidth
            />
          </View>
        ) : (
          /* Step 2: Claim Companion Character */
          <View style={styles.stepContainer}>
            <Text
              variant="headline-md"
              color={Theme.Colors.onBackground}
              style={styles.stepTitle}
            >
              Claim Your Starter Companion 🎉
            </Text>
            <Text
              variant="body-md"
              color={Theme.Colors.secondary}
              style={styles.stepDesc}
            >
              Meet your silent reading buddy! They will keep you focused and
              grow as you complete your books.
            </Text>

            {/* Curated Buddy Preview Frame */}
            {selectedCompanion && (
              <Card
                bordered
                surfaceColor="surfaceContainerLow"
                elevation="none"
                style={styles.buddyPreviewCard}
              >
                <View style={styles.buddyAvatarBg}>
                  <CharacterAvatar
                    illustrationUrl={selectedCompanion.illustration_url}
                    size={90}
                  />
                </View>
                <Text
                  variant="headline-md"
                  color={Theme.Colors.primary}
                  style={styles.buddyName}
                >
                  {selectedCompanion.name}
                </Text>
                <Text
                  variant="label-sm"
                  color={Theme.Colors.secondary}
                  style={styles.buddyType}
                >
                  {selectedCompanion.is_default
                    ? "Default Starter Buddy"
                    : "Milestone Buddy"}
                </Text>
                <Text
                  variant="body-md"
                  color={Theme.Colors.onSurfaceVariant}
                  align="center"
                  style={styles.buddyDesc}
                >
                  "
                  {selectedCompanion.description ||
                    "A silent companion eager to join your digital sanctuary."}
                  "
                </Text>
              </Card>
            )}

            {/* List Selection Frame */}
            <Text
              variant="label-sm"
              color={Theme.Colors.secondary}
              style={styles.subGridLabel}
            >
              CHOOSE A STARTING COMPANION
            </Text>

            <View style={styles.companionsRow}>
              {companions.map((companion) => {
                const isSelected = selectedCompanionId === companion.id;
                return (
                  <Pressable
                    key={companion.id}
                    onPress={() => setSelectedCompanionId(companion.id)}
                    style={[
                      styles.companionItemCard,
                      isSelected && styles.companionItemCardSelected,
                    ]}
                  >
                    <CharacterAvatar
                      illustrationUrl={companion.illustration_url}
                      size={48}
                    />
                    <Text
                      variant="label-sm"
                      align="center"
                      numberOfLines={1}
                      style={styles.companionItemName}
                    >
                      {companion.name}
                    </Text>
                  </Pressable>
                );
              })}
            </View>

            <View style={styles.actionRow}>
              <Button
                title="← Back"
                variant="ghost"
                onPress={() => setCurrentStep(0)}
                style={styles.backBtn}
              />
              <Button
                title="Claim & Enter Sanctuary"
                variant="primary"
                loading={submitting}
                onPress={handleCompleteSetup}
                style={styles.claimBtn}
              />
            </View>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: Theme.Colors.background,
  },
  centerContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: Theme.Colors.background,
  },
  loadingText: {
    marginTop: Theme.Spacing.md,
    color: Theme.Colors.secondary,
  },
  header: {
    paddingHorizontal: Theme.Spacing.marginMobile,
    paddingTop: Theme.Spacing.md,
    paddingBottom: Theme.Spacing.sm,
    backgroundColor: Theme.Colors.background,
  },
  headerTitle: {
    fontWeight: "700",
    marginBottom: 2,
  },
  progressContainer: {
    width: "100%",
    height: 4,
    backgroundColor: Theme.Colors.surfaceContainerLow,
    borderRadius: 2,
    marginTop: Theme.Spacing.sm,
    overflow: "hidden",
  },
  progressBar: {
    height: "100%",
    backgroundColor: Theme.Colors.primary,
    borderRadius: 2,
  },
  scrollContent: {
    paddingHorizontal: Theme.Spacing.marginMobile,
    paddingBottom: Theme.Spacing.xl,
  },
  stepContainer: {
    paddingTop: Theme.Spacing.sm,
  },
  stepTitle: {
    fontWeight: "700",
    marginBottom: Theme.Spacing.xs,
  },
  stepDesc: {
    lineHeight: 22,
    marginBottom: Theme.Spacing.lg,
  },
  genresGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
    marginBottom: Theme.Spacing.xl,
  },
  genrePill: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: Theme.Roundness.full,
    borderWidth: 1.5,
    borderColor: "rgba(198, 197, 211, 0.3)",
    backgroundColor: Theme.Colors.surfaceContainerLowest,
  },
  genrePillSelected: {
    borderColor: Theme.Colors.primary,
    backgroundColor: "rgba(67, 82, 165, 0.08)",
  },
  actionBtn: {
    height: 52,
    borderRadius: 16,
  },
  buddyPreviewCard: {
    padding: Theme.Spacing.md,
    borderRadius: 24,
    alignItems: "center",
    marginBottom: Theme.Spacing.lg,
    borderWidth: 1,
    borderColor: "rgba(198, 197, 211, 0.2)",
  },
  buddyAvatarBg: {
    width: 130,
    height: 130,
    borderRadius: 65,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: Theme.Colors.surfaceContainerLowest,
    marginBottom: Theme.Spacing.sm,
    shadowColor: "#000",
    shadowOpacity: 0.03,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 3 },
  },
  buddyName: {
    fontWeight: "700",
    marginBottom: 2,
  },
  buddyType: {
    textTransform: "uppercase",
    fontSize: 9,
    letterSpacing: 1.0,
    fontWeight: "700",
    color: Theme.Colors.primary,
    marginBottom: Theme.Spacing.sm,
  },
  buddyDesc: {
    lineHeight: 20,
    fontStyle: "italic",
  },
  subGridLabel: {
    fontWeight: "600",
    letterSpacing: 1.2,
    marginBottom: Theme.Spacing.sm,
    paddingLeft: Theme.Spacing.xs,
  },
  companionsRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    gap: 8,
    marginBottom: Theme.Spacing.xl,
  },
  companionItemCard: {
    width: "31%",
    padding: Theme.Spacing.xs,
    borderRadius: Theme.Roundness.md,
    backgroundColor: Theme.Colors.surfaceContainerLowest,
    borderWidth: 2,
    borderColor: "transparent",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 8,
    elevation: 2,
    shadowColor: "#000",
    shadowOpacity: 0.02,
    shadowRadius: 2,
    shadowOffset: { width: 0, height: 1 },
  },
  companionItemCardSelected: {
    borderColor: Theme.Colors.primary,
    backgroundColor: "rgba(67, 82, 165, 0.03)",
  },
  companionItemName: {
    fontSize: 10,
    fontWeight: "600",
    marginTop: 4,
    color: Theme.Colors.onBackground,
  },
  actionRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  backBtn: {
    width: "28%",
    height: 52,
  },
  claimBtn: {
    width: "68%",
    height: 52,
    borderRadius: 16,
  },
});
