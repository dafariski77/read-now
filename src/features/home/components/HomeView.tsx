import React, { useState, useEffect, useCallback } from "react";
import {
  StyleSheet,
  View,
  ScrollView,
  SafeAreaView,
  StatusBar,
  Alert,
  Pressable,
  Dimensions,
  ActivityIndicator,
  RefreshControl,
} from "react-native";
import { useRouter } from "expo-router";
import { Theme } from "@/core/themes";
import {
  Text,
  Button,
  Card,
  ProgressCircle,
  Chip,
  Skeleton,
} from "@/core/components";
import { useAuthStore } from "@/features/auth/store/useAuthStore";
import useBookSync, { UserBook, ExternalBook } from "@/features/books/hooks/useBookSync";
import { AuthService } from "@/features/auth/services/AuthService";
import { BookService } from "@/features/books/services/BookService";
import CharacterAvatar from "@/features/collection/components/CharacterAvatar";

import { useProfileQuery } from "@/features/auth/hooks/useProfileQuery";
import { useLibraryQuery } from "@/features/books/hooks/useLibraryQuery";
import { useTodayMinutesQuery } from "@/features/books/hooks/useTodayMinutesQuery";

const { width } = Dimensions.get("window");

interface CuratedBook {
  id: string;
  title: string;
  author: string;
  genre: string;
  coverColor: string;
  pages: number;
}

const RECOMMENDED_BOOKS: CuratedBook[] = [
  { id: "rec1", title: "Meditations", author: "Marcus Aurelius", genre: "Philosophy", coverColor: "#4352a5", pages: 254 },
  { id: "rec2", title: "The Wind-Up Bird Chronicle", author: "Haruki Murakami", genre: "Fiction", coverColor: "#5c6bc0", pages: 607 },
  { id: "rec3", title: "Leaves of Grass", author: "Walt Whitman", genre: "Poetry", coverColor: "#565a5c", pages: 422 },
];

export default function HomeView() {
  const router = useRouter();
  const { user } = useAuthStore();
  const { updateReadingProgress, addBookToLibrary } = useBookSync();

  const dailyGoal = 45;

  // 1. Fetch profile with active companion via React Query
  const { data: profile, isLoading: profileLoading, refetch: refetchProfile } = useProfileQuery(user?.id);

  // 2. Fetch active reading books from synced hooks ViewModel via React Query
  const { data: activeBooks = [], isLoading: libraryLoading, refetch: refetchLibrary } = useLibraryQuery(user?.id, "READING");

  // 3. Fetch today's minutes read estimation via React Query
  const { data: dailyMinutesRead = 0, isLoading: minutesLoading, refetch: refetchMinutes } = useTodayMinutesQuery(user?.id, dailyGoal);

  // Loading state
  const loading = profileLoading || libraryLoading || minutesLoading;

  // Refreshing state mappers
  const [refreshing, setRefreshing] = useState(false);
  const [localMinutesRead, setLocalMinutesRead] = useState<number | null>(null);

  const displayMinutesRead = localMinutesRead !== null ? localMinutesRead : dailyMinutesRead;

  // Sync local minutes state when query data changes
  useEffect(() => {
    setLocalMinutesRead(null);
  }, [dailyMinutesRead]);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await Promise.all([
      refetchProfile(),
      refetchLibrary(),
      refetchMinutes()
    ]);
    setRefreshing(false);
  }, [refetchProfile, refetchLibrary, refetchMinutes]);

  const handleAdjustMinutes = (amount: number) => {
    setLocalMinutesRead((prev) => {
      const current = prev !== null ? prev : dailyMinutesRead;
      return Math.max(0, Math.min(dailyGoal, current + amount));
    });
  };

  const handleAdjustPages = async (userBook: UserBook, amount: number) => {
    const totalPages = userBook.books?.total_pages || 100;
    const newPage = Math.max(0, Math.min(totalPages, userBook.current_page + amount));
    
    // Call sync hook to update database progress and logs (automatically invalidates React Query!)
    const updated = await updateReadingProgress(userBook.id, newPage);
    if (updated) {
      // If book page met total pages, trigger completed celebration
      if (newPage >= totalPages) {
        Alert.alert(
          "🎉 Sanctuary Celebration!",
          `Congratulations on finishing "${userBook.books?.title}"! You have completed a massive reading block and unlocked milestone companions!`,
          [{ text: "Awesome!" }]
        );
      }
    } else {
      Alert.alert("Error", "Could not sync progress, please check database migrations.");
    }
  };

  const handleBookTap = (book: CuratedBook) => {
    const externalBook: ExternalBook = {
      id: book.id,
      title: book.title,
      author: book.author,
      totalPages: book.pages,
      coverImageUrl: `https://images.unsplash.com/photo-1543002588-bfa74002ed7e?auto=format&fit=crop&q=80&w=120`,
      genreName: book.genre,
    };

    Alert.alert(
      "Quiet Reader Library",
      `"${book.title}" by ${book.author}\nGenre: ${book.genre}\nLength: ${book.pages} pages\n\nWould you like to start reading this book?`,
      [
        { text: "Cancel", style: "cancel" },
        { 
          text: "Add to Active Reading", 
          onPress: async () => {
            const added = await addBookToLibrary(externalBook, "READING");
            if (added) {
              Alert.alert("Sanctuary Update", `"${book.title}" is now set as your active reading book!`);
            } else {
              Alert.alert("Sanctuary Update", "Failed to add book. Please make sure database is seeded.");
            }
          } 
        }
      ]
    );
  };

  const dailyProgressRatio = displayMinutesRead / dailyGoal;

  // Primary active reading book
  const activeUserBook = activeBooks.length > 0 ? activeBooks[0] : null;
  const activeBookPagesRead = activeUserBook?.current_page || 0;
  const activeBookTotalPages = activeUserBook?.books?.total_pages || 100;
  const activeProgressRatio = activeBookPagesRead / activeBookTotalPages;

  // Active Companion
  const companionInfo = profile?.characters || {
    name: "Bookish Bloop",
    description: "A cute starter buddy who loves to keep you company. Always unlocked!",
    illustration_url: "bookish_bloop",
  };

  if (loading && !profile) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <StatusBar barStyle="dark-content" backgroundColor={Theme.Colors.background} />
        <ScrollView contentContainerStyle={styles.scrollContainer} showsVerticalScrollIndicator={false}>
          {/* Header Skeleton */}
          <View style={styles.brandHeaderRow}>
            <Skeleton width={44} height={44} borderRadius={12} />
            <View style={[styles.titleWrapper, { gap: 6 }]}>
              <Skeleton width={140} height={20} />
              <Skeleton width={90} height={12} />
            </View>
          </View>

          {/* Greeting Skeleton */}
          <View style={[styles.welcomeSection, { gap: 8, marginTop: 10 }]}>
            <Skeleton width="75%" height={24} />
            <Skeleton width="95%" height={16} />
            <Skeleton width="85%" height={16} />
          </View>

          {/* 1. Daily Reading Goal Card Skeleton */}
          <View style={[styles.dashboardSection, { marginTop: 10 }]}>
            <Skeleton width={120} height={16} style={{ marginBottom: 12 }} />
            <Card bordered surfaceColor="surfaceContainerLowest" style={[styles.dashboardCard, { padding: 16 }]}>
              <View style={styles.goalCardContentRow}>
                <View style={{ flex: 1, gap: 12 }}>
                  <Skeleton width="80%" height={28} />
                  <Skeleton width="95%" height={14} />
                  <View style={{ flexDirection: "row", gap: 8 }}>
                    <Skeleton width={48} height={32} borderRadius={16} />
                    <Skeleton width={48} height={32} borderRadius={16} />
                  </View>
                </View>
                <View style={{ marginLeft: 16 }}>
                  <Skeleton width={92} height={92} borderRadius={46} />
                </View>
              </View>
              <Skeleton width="100%" height={36} borderRadius={8} style={{ marginTop: 12 }} />
            </Card>
          </View>

          {/* 2. Companion Status Skeleton */}
          <Card bordered surfaceColor="surfaceContainerLow" style={[styles.companionCard, { padding: 16 }]}>
            <View style={styles.companionRow}>
              <Skeleton width={48} height={48} borderRadius={24} />
              <View style={{ marginLeft: 16, flex: 1, gap: 8 }}>
                <Skeleton width={100} height={16} />
                <Skeleton width="95%" height={14} />
              </View>
            </View>
          </Card>
        </ScrollView>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor={Theme.Colors.background} />

      <ScrollView 
        contentContainerStyle={styles.scrollContainer} 
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={[Theme.Colors.primary]} />
        }
      >
        
        {/* Serene Brand Top Header */}
        <View style={styles.brandHeaderRow}>
          <View style={styles.logoBadge}>
            <Text variant="label-md" color={Theme.Colors.onPrimary} style={styles.logoText}>
              QR
            </Text>
          </View>
          <View style={styles.titleWrapper}>
            <Text variant="headline-lg-mobile" color={Theme.Colors.primary} style={styles.brandTitle}>
              Quiet Reader
            </Text>
            <Text variant="label-sm" color={Theme.Colors.secondary}>
              Your Serene Sanctuary
            </Text>
          </View>
          <Pressable onPress={() => router.push("/(tabs)/discover" as any)} style={styles.catalogBackBtn}>
            <Text variant="label-sm" color={Theme.Colors.primary}>
              Explore →
            </Text>
          </Pressable>
        </View>

        {/* Editorial Moniker Welcome Greeting */}
        <View style={styles.welcomeSection}>
          <Text variant="headline-md" color={Theme.Colors.onBackground} style={styles.welcomeGreeting}>
            Welcome back, {profile?.moniker || "Reader"}! ✦
          </Text>
          <Text variant="body-md" color={Theme.Colors.secondary} style={styles.sereneQuote}>
            "A room without books is like a body without a soul." Let's enjoy a quiet reading block today.
          </Text>
        </View>

        {/* 1. Daily Reading Goal Card */}
        <View style={styles.dashboardSection}>
          <Text variant="label-md" color={Theme.Colors.primary} style={styles.sectionLabel}>
            HARI INI (TODAY'S TARGET)
          </Text>
          
          <Card bordered surfaceColor="surfaceContainerLowest" elevation="low" style={styles.dashboardCard}>
            <View style={styles.goalCardContentRow}>
              {/* Left stats & controls */}
              <View style={styles.goalLeftColumn}>
                <Text variant="headline-md" color={Theme.Colors.onBackground} style={styles.goalMinutesText}>
                  {displayMinutesRead} of {dailyGoal} Mins
                </Text>
                <Text variant="label-sm" color={Theme.Colors.secondary} style={styles.goalSubText}>
                  Focused reading block goal (linked to pages read)
                </Text>
                
                <View style={styles.manualControlsRow}>
                  <Button
                    title="-"
                    variant="secondary"
                    onPress={() => handleAdjustMinutes(-5)}
                    style={styles.adjustBtn}
                  />
                  <Button
                    title="+"
                    variant="secondary"
                    onPress={() => handleAdjustMinutes(5)}
                    style={styles.adjustBtn}
                  />
                </View>
              </View>

              {/* Right visual progress ring */}
              <View style={styles.goalRightColumn}>
                <ProgressCircle
                  progress={dailyProgressRatio}
                  size={92}
                  strokeWidth={9}
                />
              </View>
            </View>

            <View style={styles.goalFooterBox}>
              <Text variant="body-md" color={Theme.Colors.onSurfaceVariant}>
                {displayMinutesRead >= dailyGoal 
                  ? "✦ Excellent block complete! Your companion is highly impressed." 
                  : `You are ${dailyGoal - displayMinutesRead} minutes away from your serene goal.`}
              </Text>
            </View>
          </Card>
        </View>

        {/* 2. Companion Status encourages Reader */}
        <Card bordered surfaceColor="surfaceContainerLow" elevation="none" style={styles.companionCard}>
          <View style={styles.companionRow}>
            <View style={styles.companionAvatarFrame}>
              <CharacterAvatar
                illustrationUrl={companionInfo.illustration_url}
                size={48}
              />
            </View>
            <View style={styles.companionDialogueBubble}>
              <Text variant="label-md" color={Theme.Colors.onBackground} style={styles.companionName}>
                {companionInfo.name}
              </Text>
              <Text variant="body-md" color={Theme.Colors.onSurfaceVariant}>
                "You are maintaining a great serene library sanctuary! Keep reading to unlock more magical buddies!"
              </Text>
            </View>
          </View>
        </Card>

        {/* 3. Currently Reading ("Sedang Dibaca") Card */}
        <View style={styles.dashboardSection}>
          <Text variant="label-md" color={Theme.Colors.primary} style={styles.sectionLabel}>
            SEDANG DIBACA (CURRENTLY READING)
          </Text>

          {activeUserBook ? (
            <Card bordered surfaceColor="surfaceContainerLowest" elevation="high" style={styles.currentlyReadingCard}>
              <View style={styles.activeBookHeaderRow}>
                <View style={styles.activeBookCoverPlaceholder}>
                  <Text style={styles.coverEmoji}>📖</Text>
                </View>
                <View style={styles.activeBookMeta}>
                  <View style={styles.activeBookBadgeRow}>
                    <Chip label="Currently Reading" selected style={styles.badgeSpacing} />
                    <Chip label={activeUserBook.books?.genres?.name || "General"} style={styles.badgeSpacing} />
                  </View>
                  <Text variant="headline-md" color={Theme.Colors.onBackground} style={styles.activeBookTitle}>
                    {activeUserBook.books?.title}
                  </Text>
                  <Text variant="label-md" color={Theme.Colors.secondary} style={styles.activeBookAuthor}>
                    {activeUserBook.books?.author}
                  </Text>
                </View>
              </View>

              <View style={styles.activeProgressCircleRow}>
                <View style={styles.activeProgressCircleLeft}>
                  <Text variant="label-sm" color={Theme.Colors.secondary} style={styles.activeProgressLabel}>
                    COMPLETION PROGRESSION
                  </Text>
                  <Text variant="headline-md" color={Theme.Colors.onBackground} style={styles.activeProgressCount}>
                    {activeBookPagesRead} of {activeBookTotalPages} pages
                  </Text>
                </View>
                <View style={styles.activeProgressCircleRight}>
                  <ProgressCircle
                    progress={activeProgressRatio}
                    size={68}
                    strokeWidth={7}
                  />
                </View>
              </View>

              <View style={styles.activeManualControls}>
                <Button
                  title="Page back (-15)"
                  variant="ghost"
                  onPress={() => handleAdjustPages(activeUserBook, -15)}
                  style={styles.halfBtn}
                />
                <Button
                  title="Read ahead (+15)"
                  variant="secondary"
                  onPress={() => handleAdjustPages(activeUserBook, 15)}
                  style={styles.halfBtn}
                />
              </View>
            </Card>
          ) : (
            <Card bordered surfaceColor="surfaceContainerLowest" elevation="low" style={styles.emptyBookCard}>
              <Text style={styles.emptyEmoji}>🍃</Text>
              <Text variant="headline-md" color={Theme.Colors.onBackground} align="center" style={styles.emptyTitle}>
                Your sanctuary is calm.
              </Text>
              <Text variant="body-md" color={Theme.Colors.secondary} align="center" style={styles.emptyDesc}>
                You don't have any books currently in active reading. Check out recommendations or explore catalog!
              </Text>
              <Button
                title="Explore Discover"
                variant="primary"
                onPress={() => router.push("/(tabs)/discover" as any)}
                style={styles.exploreBtn}
              />
            </Card>
          )}
        </View>

        {/* 4. Serene Library Recommendation Horizontal Scroll */}
        <View style={styles.librarySection}>
          <Text variant="label-md" color={Theme.Colors.primary} style={styles.sectionLabel}>
            REKOMENDASI BUKU (LIBRARY DISCOVER)
          </Text>

          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.horizontalScrollContent}
          >
            {RECOMMENDED_BOOKS.map((book) => (
              <Pressable
                key={book.id}
                onPress={() => handleBookTap(book)}
                style={styles.bookRecommendationTouch}
              >
                <Card bordered surfaceColor="surfaceContainerLowest" elevation="low" style={styles.recommendedBookCard}>
                  <View style={[styles.bookMiniCover, { backgroundColor: book.coverColor }]}>
                    <Text style={styles.miniCoverLogo}>QR</Text>
                  </View>
                  <Text variant="label-md" color={Theme.Colors.onBackground} numberOfLines={1} style={styles.recommendedTitle}>
                    {book.title}
                  </Text>
                  <Text variant="label-sm" color={Theme.Colors.secondary} numberOfLines={1} style={styles.recommendedAuthor}>
                    {book.author}
                  </Text>
                  <View style={styles.recommendedChipWrapper}>
                    <Chip label={book.genre} />
                  </View>
                </Card>
              </Pressable>
            ))}
          </ScrollView>
        </View>

        {/* Footer */}
        <View style={styles.footer}>
          <Text variant="label-sm" color={Theme.Colors.secondary} align="center">
            Quiet Reader Beranda • Conforming to Stitch Specifications
          </Text>
          <Text variant="label-sm" color={Theme.Colors.outline} align="center" style={styles.footerSub}>
            Distraction-Free Dashboard • Paper & Ink Theme Tokens
          </Text>
        </View>

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
  scrollContainer: {
    paddingHorizontal: Theme.Spacing.marginMobile,
    paddingTop: Theme.Spacing.lg,
    paddingBottom: Theme.Spacing.xl + 80,
  },
  brandHeaderRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: Theme.Spacing.md,
  },
  logoBadge: {
    width: 44,
    height: 44,
    borderRadius: Theme.Roundness.md,
    backgroundColor: Theme.Colors.primary,
    alignItems: "center",
    justifyContent: "center",
  },
  logoText: {
    fontWeight: "700",
    fontSize: 14,
  },
  titleWrapper: {
    marginLeft: Theme.Spacing.sm,
    flex: 1,
  },
  brandTitle: {
    fontWeight: "700",
  },
  catalogBackBtn: {
    paddingVertical: 8,
    paddingHorizontal: 12,
  },
  welcomeSection: {
    marginBottom: Theme.Spacing.lg,
  },
  welcomeGreeting: {
    fontWeight: "700",
    marginBottom: 4,
  },
  sereneQuote: {
    lineHeight: 22,
  },
  dashboardSection: {
    marginBottom: Theme.Spacing.lg,
  },
  sectionLabel: {
    fontWeight: "700",
    letterSpacing: 1.5,
    marginBottom: Theme.Spacing.sm,
    paddingLeft: Theme.Spacing.xs,
  },
  dashboardCard: {
    padding: Theme.Spacing.md,
    borderRadius: Theme.Roundness.lg,
  },
  goalCardContentRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: Theme.Spacing.md,
  },
  goalLeftColumn: {
    flex: 1,
  },
  goalMinutesText: {
    fontWeight: "700",
    marginBottom: 2,
  },
  goalSubText: {
    marginBottom: Theme.Spacing.md,
  },
  goalRightColumn: {
    marginLeft: Theme.Spacing.md,
    justifyContent: "center",
    alignItems: "center",
  },
  activeProgressCircleRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: Theme.Colors.surfaceContainerLow,
    padding: Theme.Spacing.md,
    borderRadius: Theme.Roundness.md,
    marginBottom: Theme.Spacing.md,
  },
  activeProgressCircleLeft: {
    flex: 1,
  },
  activeProgressLabel: {
    fontWeight: "600",
    fontSize: 10,
    letterSpacing: 1.0,
    marginBottom: 4,
  },
  activeProgressCount: {
    fontWeight: "700",
  },
  activeProgressCircleRight: {
    marginLeft: Theme.Spacing.md,
  },
  manualControlsRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  adjustBtn: {
    paddingVertical: 4,
    paddingHorizontal: Theme.Spacing.sm,
    minHeight: 32,
    marginLeft: Theme.Spacing.xs,
  },
  goalFooterBox: {
    backgroundColor: Theme.Colors.surfaceContainerLow,
    padding: Theme.Spacing.sm,
    borderRadius: Theme.Roundness.DEFAULT,
  },
  companionCard: {
    padding: Theme.Spacing.md,
    borderRadius: Theme.Roundness.lg,
    marginBottom: Theme.Spacing.lg,
  },
  companionRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  companionAvatarFrame: {
    width: 48,
    height: 48,
    borderRadius: Theme.Roundness.full,
    backgroundColor: Theme.Colors.primaryContainer,
    alignItems: "center",
    justifyContent: "center",
  },
  companionDialogueBubble: {
    marginLeft: Theme.Spacing.sm,
    flex: 1,
  },
  companionName: {
    fontWeight: "700",
    marginBottom: 2,
  },
  currentlyReadingCard: {
    padding: Theme.Spacing.md,
    borderRadius: Theme.Roundness.lg,
  },
  activeBookHeaderRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: Theme.Spacing.sm,
  },
  activeBookCoverPlaceholder: {
    width: 60,
    height: 80,
    borderRadius: Theme.Roundness.DEFAULT,
    backgroundColor: Theme.Colors.primaryContainer,
    alignItems: "center",
    justifyContent: "center",
  },
  coverEmoji: {
    fontSize: 32,
  },
  activeBookMeta: {
    marginLeft: Theme.Spacing.sm,
    flex: 1,
  },
  activeBookBadgeRow: {
    flexDirection: "row",
    marginBottom: 4,
  },
  badgeSpacing: {
    marginRight: Theme.Spacing.xs,
  },
  activeBookTitle: {
    fontWeight: "700",
    marginBottom: 2,
  },
  activeBookAuthor: {
    fontWeight: "600",
  },
  activeProgressInfo: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: Theme.Spacing.xs,
  },
  activeManualControls: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: Theme.Spacing.sm,
  },
  halfBtn: {
    width: "48%",
  },
  emptyBookCard: {
    padding: Theme.Spacing.xl,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: Theme.Roundness.lg,
  },
  emptyEmoji: {
    fontSize: 48,
    marginBottom: Theme.Spacing.sm,
  },
  emptyTitle: {
    fontWeight: "700",
    marginBottom: 4,
  },
  emptyDesc: {
    lineHeight: 20,
    marginBottom: Theme.Spacing.md,
  },
  exploreBtn: {
    width: "100%",
    height: 48,
  },
  librarySection: {
    marginBottom: Theme.Spacing.xl,
  },
  horizontalScrollContent: {
    paddingRight: Theme.Spacing.marginMobile,
  },
  bookRecommendationTouch: {
    marginRight: Theme.Spacing.sm,
  },
  recommendedBookCard: {
    width: 160,
    padding: Theme.Spacing.sm,
    borderRadius: Theme.Roundness.md,
  },
  bookMiniCover: {
    width: "100%",
    height: 120,
    borderRadius: Theme.Roundness.DEFAULT,
    backgroundColor: Theme.Colors.surfaceContainerLow,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: Theme.Spacing.xs,
  },
  miniCoverLogo: {
    fontSize: 20,
    fontWeight: "700",
    color: "#ffffff",
    opacity: 0.8,
  },
  recommendedTitle: {
    fontWeight: "700",
    fontSize: 13,
    marginBottom: 1,
  },
  recommendedAuthor: {
    fontSize: 11,
    marginBottom: Theme.Spacing.xs,
  },
  recommendedChipWrapper: {
    flexDirection: "row",
  },
  footer: {
    marginTop: Theme.Spacing.lg,
    paddingTop: Theme.Spacing.md,
    borderTopWidth: 1,
    borderTopColor: Theme.Colors.outlineVariant,
    opacity: 0.7,
  },
  footerSub: {
    marginTop: Theme.Spacing.xs,
  },
});
