import React, { useState } from "react";
import {
  StyleSheet,
  View,
  ScrollView,
  SafeAreaView,
  StatusBar,
  Alert,
  Pressable,
  Dimensions,
} from "react-native";
import { useRouter } from "expo-router";
import { Theme } from "@/core/themes";
import {
  Text,
  Button,
  Card,
  ProgressCircle,
  Chip,
} from "@/core/components";

const { width } = Dimensions.get("window");

interface Book {
  id: string;
  title: string;
  author: string;
  genre: string;
  coverColor: string;
  pages: number;
}

const RECOMMENDED_BOOKS: Book[] = [
  { id: "1", title: "Meditations", author: "Marcus Aurelius", genre: "Philosophy", coverColor: "#4352a5", pages: 254 },
  { id: "2", title: "The Wind-Up Bird Chronicle", author: "Haruki Murakami", genre: "Fiction", coverColor: "#5c6bc0", pages: 607 },
  { id: "3", title: "Leaves of Grass", author: "Walt Whitman", genre: "Poetry", coverColor: "#565a5c", pages: 422 },
];

export default function HomeView() {
  const router = useRouter();
  
  // Interactive goals & progress states
  const [dailyMinutesRead, setDailyMinutesRead] = useState(25);
  const dailyGoal = 45;
  
  const [activeBookPagesRead, setActiveBookPagesRead] = useState(219);
  const activeBookTotalPages = 487;

  const handleAdjustMinutes = (amount: number) => {
    setDailyMinutesRead((prev) => Math.max(0, Math.min(dailyGoal, prev + amount)));
  };

  const handleAdjustPages = (amount: number) => {
    setActiveBookPagesRead((prev) => Math.max(0, Math.min(activeBookTotalPages, prev + amount)));
  };

  const handleBookTap = (book: Book) => {
    Alert.alert(
      "Quiet Reader Library",
      `"${book.title}" by ${book.author}\nGenre: ${book.genre}\nLength: ${book.pages} pages\n\nWould you like to start reading this book?`,
      [
        { text: "Cancel", style: "cancel" },
        { text: "Add to Active Reading", onPress: () => Alert.alert("Sanctuary Update", `"${book.title}" is now set as your active book!`) }
      ]
    );
  };

  const activeProgressRatio = activeBookPagesRead / activeBookTotalPages;
  const dailyProgressRatio = dailyMinutesRead / dailyGoal;

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor={Theme.Colors.background} />

      <ScrollView contentContainerStyle={styles.scrollContainer} showsVerticalScrollIndicator={false}>
        
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
          <Pressable onPress={() => router.push("/" as any)} style={styles.catalogBackBtn}>
            <Text variant="label-sm" color={Theme.Colors.primary}>
              Catalog →
            </Text>
          </Pressable>
        </View>

        {/* Editorial Moniker Welcome Greeting */}
        <View style={styles.welcomeSection}>
          <Text variant="headline-md" color={Theme.Colors.onBackground} style={styles.welcomeGreeting}>
            Welcome back, Reader! ✦
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
                  {dailyMinutesRead} of {dailyGoal} Mins
                </Text>
                <Text variant="label-sm" color={Theme.Colors.secondary} style={styles.goalSubText}>
                  Focused reading block goal
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
                {dailyMinutesRead >= dailyGoal 
                  ? "✦ Excellent block complete! Ollie is highly impressed." 
                  : `You are ${dailyGoal - dailyMinutesRead} minutes away from your serene goal.`}
              </Text>
            </View>
          </Card>
        </View>

        {/* 2. Companion Status encourages Reader */}
        <Card bordered surfaceColor="surfaceContainerLow" elevation="none" style={styles.companionCard}>
          <View style={styles.companionRow}>
            <View style={styles.companionAvatarFrame}>
              <Text style={styles.companionAvatarEmoji}>🦉</Text>
            </View>
            <View style={styles.companionDialogueBubble}>
              <Text variant="label-md" color={Theme.Colors.onBackground} style={styles.companionName}>
                Ollie the Scholar
              </Text>
              <Text variant="body-md" color={Theme.Colors.onSurfaceVariant}>
                "You've maintained your serene daily reading blocks for 12 straight days! Keep the focus block quiet today."
              </Text>
            </View>
          </View>
        </Card>

        {/* 3. Currently Reading ("Sedang Dibaca") Card */}
        <View style={styles.dashboardSection}>
          <Text variant="label-md" color={Theme.Colors.primary} style={styles.sectionLabel}>
            SEDANG DIBACA (CURRENTLY READING)
          </Text>

          <Card bordered surfaceColor="surfaceContainerLowest" elevation="high" style={styles.currentlyReadingCard}>
            <View style={styles.activeBookHeaderRow}>
              <View style={styles.activeBookCoverPlaceholder}>
                <Text style={styles.coverEmoji}>📖</Text>
              </View>
              <View style={styles.activeBookMeta}>
                <View style={styles.activeBookBadgeRow}>
                  <Chip label="Currently Reading" selected style={styles.badgeSpacing} />
                  <Chip label="Fiction" style={styles.badgeSpacing} />
                </View>
                <Text variant="headline-md" color={Theme.Colors.onBackground} style={styles.activeBookTitle}>
                  The Shadow of the Wind
                </Text>
                <Text variant="label-md" color={Theme.Colors.secondary} style={styles.activeBookAuthor}>
                  Carlos Ruiz Zafón
                </Text>
              </View>
            </View>

            <Text variant="body-md" color={Theme.Colors.onSurfaceVariant} style={styles.activeBookDesc}>
              A gorgeous journey into Barcelona's mysterious "Cemetery of Forgotten Books," where a young boy adopts a book that plunges him into a dark web of secrets.
            </Text>

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
                onPress={() => handleAdjustPages(-15)}
                style={styles.halfBtn}
              />
              <Button
                title="Read ahead (+15)"
                variant="secondary"
                onPress={() => handleAdjustPages(15)}
                style={styles.halfBtn}
              />
            </View>

            <Button
              title="Lanjutkan Membaca (Continue Reading)"
              variant="primary"
              onPress={() => Alert.alert("Sanctuary Opened", "Opening Reader view in distraction-free full-screen...")}
              style={styles.continueReadButton}
            />
          </Card>
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
    alignItems: "flex-start",
  },
  companionAvatarFrame: {
    width: 48,
    height: 48,
    borderRadius: Theme.Roundness.full,
    backgroundColor: Theme.Colors.primaryContainer,
    alignItems: "center",
    justifyContent: "center",
  },
  companionAvatarEmoji: {
    fontSize: 24,
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
  activeBookDesc: {
    lineHeight: 22,
    marginBottom: Theme.Spacing.md,
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
  continueReadButton: {
    marginTop: Theme.Spacing.xs,
    height: 52,
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
