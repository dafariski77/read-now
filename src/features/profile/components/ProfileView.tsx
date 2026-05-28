import React, { useEffect, useState, useCallback } from "react";
import { StyleSheet, View, Dimensions, Alert, ActivityIndicator, RefreshControl, StatusBar } from "react-native";
import { Theme } from "@/core/themes";
import { Text, ScreenContainer, Card, Button, Skeleton } from "@/core/components";
import { useAuthStore } from "@/features/auth/store/useAuthStore";
import Svg, { Path } from "react-native-svg";
import { AuthService } from "@/features/auth/services/AuthService";
import useBookSync from "@/features/books/hooks/useBookSync";

const { width } = Dimensions.get("window");

// Icons for Profile page
const StatsIcon = ({ name = "book", size = 20, color = Theme.Colors.primary }) => {
  if (name === "library") {
    return (
      <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
        <Path
          d="M4 6H2v14c0 1.1.9 2 2 2h14v-2H4V6zm16-4H8c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm0 14H8V4h12v12z"
          fill={color}
        />
      </Svg>
    );
  }
  if (name === "streak") {
    return (
      <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
        <Path
          d="M12 23a7.5 7.5 0 007.5-7.5c0-2.45-1.57-6.25-7.5-11.5-5.93 5.25-7.5 9.05-7.5 11.5A7.5 7.5 0 0012 23zm-3-8c0-1.66 1.34-3 3-3s3 1.34 3 3-1.34 3-3 3-3-1.34-3-3z"
          fill={color}
        />
      </Svg>
    );
  }
  if (name === "rank") {
    return (
      <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
        <Path
          d="M19 5h-2V3H7v2H5c-1.1 0-2 .9-2 2v3c0 2.44 1.72 4.48 4 4.81V18c0 1.1.9 2 2 2h1v3h4v-3h1c1.1 0 2-.9 2-2v-3.19c2.28-.33 4-2.37 4-4.81V7c0-1.1-.9-2-2-2zM5 10V7h2v3H5zm14 0h-2V7h2v3z"
          fill={color}
        />
      </Svg>
    );
  }
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path
        d="M18 2H6c-1.1 0-2 .9-2 2v16c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zM6 4h5v8l-2.5-1.5L6 12V4z"
        fill={color}
      />
    </Svg>
  );
};

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

import { useProfileQuery } from "@/features/auth/hooks/useProfileQuery";
import { useGenresQuery } from "@/features/auth/hooks/useGenresQuery";
import { useLibraryQuery } from "@/features/books/hooks/useLibraryQuery";

export default function ProfileView() {
  const { user, logout } = useAuthStore();

  const { data: profile, isLoading: profileLoading, refetch: refetchProfile } = useProfileQuery(user?.id);
  const { data: genres = [], isLoading: genresLoading, refetch: refetchGenres } = useGenresQuery(user?.id);
  const { data: allBooks = [], isLoading: libraryLoading, refetch: refetchLibrary } = useLibraryQuery(user?.id);

  const loading = profileLoading || genresLoading || libraryLoading;
  const [refreshing, setRefreshing] = useState(false);

  // Compute stats on pure selector values dynamically
  const finishedCount = allBooks.filter((ub) => ub.status === "COMPLETED").length;
  const totalPages = allBooks.reduce((sum, ub) => sum + (ub.current_page || 0), 0);

  // Compute simple rank and streak increments based on completed books
  const calculatedStreak = finishedCount > 0 ? 12 + finishedCount : 0;
  const calculatedRank = 
    finishedCount > 15 ? "Top 1%" : finishedCount > 5 ? "Top 5%" : "Top 15%";

  const stats = {
    booksFinished: finishedCount,
    pagesRead: totalPages,
    streak: calculatedStreak,
    rank: calculatedRank,
  };

  const handleRefresh = useCallback(async () => {
    setRefreshing(true);
    await Promise.all([
      refetchProfile(),
      refetchGenres(),
      refetchLibrary()
    ]);
    setRefreshing(false);
  }, [refetchProfile, refetchGenres, refetchLibrary]);

  const handleSignOut = () => {
    Alert.alert(
      "Quiet Sign Out",
      "Are you sure you want to log out of your peaceful reading sanctuary?",
      [
        { text: "Cancel", style: "cancel" },
        { text: "Sign Out", style: "destructive", onPress: logout },
      ]
    );
  };

  // Get user profile metadata
  const userName = profile?.moniker || user?.user_metadata?.moniker || user?.email?.split("@")[0] || "Serene Reader";
  const userInitials = userName.substring(0, 2).toUpperCase();
  const companionName = profile?.characters?.name || "Bookish Bloop";

  if (loading && !profile) {
    return (
      <ScreenContainer scrollable={false} hasBottomTabs style={styles.container}>
        <StatusBar barStyle="dark-content" backgroundColor={Theme.Colors.background} />
        
        {/* Profile Header Block Skeleton */}
        <View style={styles.headerSection}>
          <Card style={styles.profileHeroCard}>
            <View style={styles.avatarContainer}>
              <Skeleton width={90} height={90} borderRadius={45} />
            </View>

            <View style={[styles.profileMeta, { gap: 8, alignItems: "center" }]}>
              <Skeleton width={180} height={24} />
              <Skeleton width={240} height={14} />
              <View style={[styles.chipsRow, { marginTop: 8 }]}>
                <Skeleton width={100} height={28} borderRadius={14} />
                <Skeleton width={100} height={28} borderRadius={14} />
              </View>
            </View>
          </Card>
        </View>

        {/* Reading Statistics Bento Grid Skeleton */}
        <View style={styles.statsSection}>
          <Skeleton width={160} height={22} style={{ marginBottom: 16 }} />

          <View style={styles.statsGrid}>
            <Card style={styles.statBox}>
              <Skeleton width={36} height={36} borderRadius={8} style={{ marginBottom: 8 }} />
              <Skeleton width={60} height={32} style={{ marginBottom: 6 }} />
              <Skeleton width={100} height={12} />
            </Card>

            <Card style={styles.statBox}>
              <Skeleton width={36} height={36} borderRadius={8} style={{ marginBottom: 8 }} />
              <Skeleton width={80} height={32} style={{ marginBottom: 6 }} />
              <Skeleton width={80} height={12} />
            </Card>

            <Card style={styles.statBox}>
              <Skeleton width={36} height={36} borderRadius={8} style={{ marginBottom: 8 }} />
              <Skeleton width={50} height={32} style={{ marginBottom: 6 }} />
              <Skeleton width={80} height={12} />
            </Card>

            <Card style={[styles.statBox, { backgroundColor: Theme.Colors.primary }]}>
              <Skeleton width={36} height={36} borderRadius={8} style={{ marginBottom: 8, backgroundColor: "rgba(255,255,255,0.2)" }} />
              <Skeleton width={90} height={28} style={{ marginBottom: 6, backgroundColor: "rgba(255,255,255,0.2)" }} />
              <Skeleton width={70} height={12} style={{ backgroundColor: "rgba(255,255,255,0.2)" }} />
            </Card>
          </View>
        </View>
      </ScreenContainer>
    );
  }

  return (
    <ScreenContainer 
      scrollable 
      padding={false} 
      hasBottomTabs 
      style={styles.container}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} colors={[Theme.Colors.primary]} />
      }
    >
      {/* Profile Header Block */}
      <View style={styles.headerSection}>
        <Card style={styles.profileHeroCard}>
          <View style={styles.avatarContainer}>
            <View style={styles.avatarCircle}>
              <Text variant="headline-lg" color={Theme.Colors.onPrimary}>
                {userInitials}
              </Text>
            </View>
          </View>

          <View style={styles.profileMeta}>
            <Text variant="headline-md" color={Theme.Colors.onSurface} style={styles.profileName}>
              {userName}
            </Text>
            <Text variant="label-sm" color={Theme.Colors.secondary} style={styles.profileSub}>
              Active Companion: {companionName} • Level {Math.max(1, Math.floor(stats.booksFinished / 3) + 1)}
            </Text>

            {/* Favorite Genre Chips */}
            <View style={styles.chipsRow}>
              {genres.length > 0 ? (
                genres.map((genre, idx) => (
                  <View key={idx} style={styles.genreChip}>
                    <Text variant="label-sm" color={Theme.Colors.primary}>
                      {getGenreEmoji(genre)} {genre}
                    </Text>
                  </View>
                ))
              ) : (
                <View style={styles.genreChip}>
                  <Text variant="label-sm" color={Theme.Colors.primary}>
                    📖 Serene Reading
                  </Text>
                </View>
              )}
            </View>
          </View>
        </Card>
      </View>

      {/* Reading Statistics Bento Grid */}
      <View style={styles.statsSection}>
        <Text variant="headline-md" color={Theme.Colors.onSurface} style={styles.statsTitle}>
          Your Reading Stats
        </Text>

        <View style={styles.statsGrid}>
          {/* Stat 1 */}
          <Card style={styles.statBox}>
            <View style={[styles.statIconContainer, { backgroundColor: "rgba(67, 82, 165, 0.08)" }]}>
              <StatsIcon name="library" color={Theme.Colors.primary} />
            </View>
            <Text variant="display" color={Theme.Colors.onSurface} style={styles.statVal}>
              {stats.booksFinished}
            </Text>
            <Text variant="label-sm" color={Theme.Colors.secondary} style={styles.statLabel}>
              Books Finished
            </Text>
          </Card>

          {/* Stat 2 */}
          <Card style={styles.statBox}>
            <View style={[styles.statIconContainer, { backgroundColor: "rgba(86, 90, 92, 0.08)" }]}>
              <StatsIcon name="book" color={Theme.Colors.tertiary} />
            </View>
            <Text variant="display" color={Theme.Colors.onSurface} style={styles.statVal}>
              {stats.pagesRead}
            </Text>
            <Text variant="label-sm" color={Theme.Colors.secondary} style={styles.statLabel}>
              Pages Read
            </Text>
          </Card>

          {/* Stat 3 */}
          <Card style={styles.statBox}>
            <View style={[styles.statIconContainer, { backgroundColor: "rgba(255, 152, 0, 0.08)" }]}>
              <StatsIcon name="streak" color="#ff9800" />
            </View>
            <Text variant="display" color={Theme.Colors.onSurface} style={styles.statVal}>
              {stats.streak}
            </Text>
            <Text variant="label-sm" color={Theme.Colors.secondary} style={styles.statLabel}>
              Day Streak
            </Text>
          </Card>

          {/* Stat 4 - Top Rank Card */}
          <Card style={[styles.statBox, styles.rankBox]}>
            <View style={styles.rankBadgeBg}>
              <StatsIcon name="rank" color="#ffffff" size={32} />
            </View>
            <Text variant="headline-lg" color="#ffffff" style={styles.rankVal}>
              {stats.rank}
            </Text>
            <Text variant="label-sm" color="rgba(255, 255, 255, 0.85)" style={styles.statLabel}>
              Global Rank
            </Text>
          </Card>
        </View>
      </View>

      {/* Settings / Actions */}
      <View style={styles.actionsSection}>
        <Button
          title="Sign Out Sanctuary"
          variant="ghost"
          style={StyleSheet.flatten([styles.actionBtn, styles.logoutBtn])}
          onPress={handleSignOut}
        />
      </View>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: Theme.Colors.background,
    paddingBottom: 40,
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
  headerSection: {
    paddingHorizontal: Theme.Spacing.marginMobile,
    paddingTop: Theme.Spacing.md,
    marginBottom: Theme.Spacing.lg,
  },
  profileHeroCard: {
    padding: Theme.Spacing.md,
    backgroundColor: Theme.Colors.surfaceContainerLow,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: "rgba(198, 197, 211, 0.3)",
    alignItems: "center",
    elevation: 3,
    shadowColor: "#000",
    shadowOpacity: 0.04,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 3 },
  },
  avatarContainer: {
    position: "relative",
    marginBottom: Theme.Spacing.md,
  },
  avatarCircle: {
    width: 90,
    height: 90,
    borderRadius: 45,
    backgroundColor: Theme.Colors.primary,
    alignItems: "center",
    justifyContent: "center",
    elevation: 4,
    shadowColor: Theme.Colors.primary,
    shadowOpacity: 0.15,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
  },
  profileMeta: {
    alignItems: "center",
  },
  profileName: {
    fontWeight: "700",
    fontSize: 22,
    marginBottom: 4,
  },
  profileSub: {
    marginBottom: Theme.Spacing.md,
    textAlign: "center",
  },
  chipsRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    justifyContent: "center",
  },
  genreChip: {
    backgroundColor: "rgba(67, 82, 165, 0.08)",
    borderRadius: Theme.Roundness.full,
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderWidth: 1,
    borderColor: "rgba(67, 82, 165, 0.12)",
  },
  statsSection: {
    paddingHorizontal: Theme.Spacing.marginMobile,
    marginBottom: Theme.Spacing.lg,
  },
  statsTitle: {
    fontWeight: "700",
    marginBottom: Theme.Spacing.md,
  },
  statsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    gap: 12,
  },
  statBox: {
    width: (width - Theme.Spacing.marginMobile * 2 - 12) / 2,
    backgroundColor: Theme.Colors.surfaceContainerLowest,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "rgba(198, 197, 211, 0.2)",
    padding: Theme.Spacing.md,
    alignItems: "flex-start",
    position: "relative",
    elevation: 2,
    shadowColor: "#000",
    shadowOpacity: 0.03,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
  },
  rankBox: {
    backgroundColor: Theme.Colors.primary,
    borderColor: "transparent",
    elevation: 4,
    shadowColor: Theme.Colors.primary,
    shadowOpacity: 0.1,
    shadowRadius: 6,
  },
  statIconContainer: {
    padding: 8,
    borderRadius: 12,
    marginBottom: Theme.Spacing.xs,
  },
  rankBadgeBg: {
    padding: 8,
    borderRadius: 12,
    marginBottom: Theme.Spacing.xs,
    backgroundColor: "rgba(255, 255, 255, 0.2)",
  },
  statVal: {
    fontSize: 28,
    fontWeight: "700",
    marginBottom: 2,
  },
  rankVal: {
    fontSize: 24,
    fontWeight: "700",
    marginBottom: 2,
  },
  statLabel: {
    fontSize: 11,
    fontWeight: "600",
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  actionsSection: {
    paddingHorizontal: Theme.Spacing.marginMobile,
    gap: Theme.Spacing.sm,
    marginTop: Theme.Spacing.xs,
  },
  actionBtn: {
    width: "100%",
    borderRadius: 16,
    height: 48,
  },
  logoutBtn: {
    backgroundColor: "rgba(186, 26, 26, 0.08)",
    borderWidth: 1,
    borderColor: "rgba(186, 26, 26, 0.15)",
  },
});
