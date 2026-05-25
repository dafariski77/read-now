import React, { useState } from "react";
import {
  StyleSheet,
  View,
  ScrollView,
  SafeAreaView,
  StatusBar,
  Alert,
} from "react-native";
import {
  Theme,
  Text,
  Button,
  Card,
  ProgressBar,
  InputField,
  Chip,
} from "../design-system";

export default function DesignSystemCatalog() {
  // State for interactive features
  const [progressVal, setProgressVal] = useState(0.45);
  const [searchText, setSearchText] = useState("");
  const [selectedGenres, setSelectedGenres] = useState<string[]>(["Biography"]);
  const [isFavorited, setIsFavorited] = useState(false);

  const availableGenres = ["Biography", "Fiction", "History", "Sci-Fi", "Poetry"];

  const toggleGenre = (genre: string) => {
    if (selectedGenres.includes(genre)) {
      setSelectedGenres(selectedGenres.filter((g) => g !== genre));
    } else {
      setSelectedGenres([...selectedGenres, genre]);
    }
  };

  const handleAdjustProgress = (amount: number) => {
    setProgressVal((prev) => Math.max(0, Math.min(1, parseFloat((prev + amount).toFixed(2)))));
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor={Theme.Colors.background} />
      <ScrollView contentContainerStyle={styles.scrollContainer} showsVerticalScrollIndicator={false}>
        
        {/* Serene Brand Header */}
        <View style={styles.header}>
          <View style={styles.logoBadge}>
            <Text variant="label-md" color={Theme.Colors.onPrimary} style={styles.logoText}>
              QR
            </Text>
          </View>
          <Text variant="headline-lg-mobile" color={Theme.Colors.primary} style={styles.title}>
            Quiet Reader
          </Text>
          <Text variant="body-md" color={Theme.Colors.secondary} align="center">
            A serene digital sanctuary for focused minds. Created based on your Stitch Design System.
          </Text>
        </View>

        {/* Section 1: Color Architecture */}
        <View style={styles.section}>
          <Text variant="label-md" color={Theme.Colors.primary} style={styles.sectionHeader}>
            COLOR PALETTE
          </Text>
          <Card bordered surfaceColor="surfaceContainerLowest" elevation="none" style={styles.gridCard}>
            <View style={styles.colorGrid}>
              <View style={styles.colorSwatchContainer}>
                <View style={[styles.swatch, { backgroundColor: Theme.Colors.primary }]} />
                <Text variant="label-sm">Primary</Text>
                <Text variant="label-sm" color={Theme.Colors.secondary}>#4352A5</Text>
              </View>
              <View style={styles.colorSwatchContainer}>
                <View style={[styles.swatch, { backgroundColor: Theme.Colors.primaryContainer }]} />
                <Text variant="label-sm">Container</Text>
                <Text variant="label-sm" color={Theme.Colors.secondary}>#5C6BC0</Text>
              </View>
              <View style={styles.colorSwatchContainer}>
                <View style={[styles.swatch, { backgroundColor: Theme.Colors.onBackground, borderWidth: 1, borderColor: Theme.Colors.outlineVariant }]} />
                <Text variant="label-sm">Ink / Charcoal</Text>
                <Text variant="label-sm" color={Theme.Colors.secondary}>#181C20</Text>
              </View>
              <View style={styles.colorSwatchContainer}>
                <View style={[styles.swatch, { backgroundColor: Theme.Colors.surfaceContainerLow, borderWidth: 1, borderColor: Theme.Colors.outlineVariant }]} />
                <Text variant="label-sm">Surface Low</Text>
                <Text variant="label-sm" color={Theme.Colors.secondary}>#F1F4F9</Text>
              </View>
            </View>
          </Card>
        </View>

        {/* Section 2: Typography Scale */}
        <View style={styles.section}>
          <Text variant="label-md" color={Theme.Colors.primary} style={styles.sectionHeader}>
            TYPOGRAPHY SCALE
          </Text>
          <Card bordered surfaceColor="surfaceContainerLowest" elevation="none">
            <View style={styles.typoRow}>
              <Text variant="label-sm" color={Theme.Colors.secondary}>display</Text>
              <Text variant="display">Quiet</Text>
            </View>
            <View style={styles.typoDivider} />
            <View style={styles.typoRow}>
              <Text variant="label-sm" color={Theme.Colors.secondary}>headline-lg</Text>
              <Text variant="headline-lg-mobile">Serene Sanctuary</Text>
            </View>
            <View style={styles.typoDivider} />
            <View style={styles.typoRow}>
              <Text variant="label-sm" color={Theme.Colors.secondary}>headline-md</Text>
              <Text variant="headline-md">Weekly Progress</Text>
            </View>
            <View style={styles.typoDivider} />
            <View style={styles.typoRow}>
              <Text variant="label-sm" color={Theme.Colors.secondary}>body-lg</Text>
              <Text variant="body-lg">"Reading gives us someplace to go when we have to stay where we are."</Text>
            </View>
            <View style={styles.typoDivider} />
            <View style={styles.typoRow}>
              <Text variant="label-sm" color={Theme.Colors.secondary}>body-md</Text>
              <Text variant="body-md">Plus Jakarta Sans provides high legibility for long-form reading comfort.</Text>
            </View>
            <View style={styles.typoDivider} />
            <View style={styles.typoRow}>
              <Text variant="label-sm" color={Theme.Colors.secondary}>label-md</Text>
              <Text variant="label-md">CONTINUE READING</Text>
            </View>
          </Card>
        </View>

        {/* Section 3: Interactive Playground */}
        <View style={styles.section}>
          <Text variant="label-md" color={Theme.Colors.primary} style={styles.sectionHeader}>
            INTERACTIVE PLAYGROUND
          </Text>
          
          {/* Card containing dynamic slider and components */}
          <Card bordered surfaceColor="surfaceContainerLowest" elevation="low" style={styles.playgroundCard}>
            
            {/* Dynamic Progress Controller */}
            <Text variant="label-md" color={Theme.Colors.onBackground} style={styles.playgroundTitle}>
              Dynamic Progress Bar
            </Text>
            <View style={styles.progressHeader}>
              <Text variant="body-md" color={Theme.Colors.onSurfaceVariant}>
                Reading progress: <Text variant="label-md" color={Theme.Colors.primary}>{Math.round(progressVal * 100)}%</Text>
              </Text>
              <View style={styles.controlsRow}>
                <Button
                  title="-"
                  variant="secondary"
                  onPress={() => handleAdjustProgress(-0.1)}
                  style={styles.adjustBtn}
                />
                <Button
                  title="+"
                  variant="secondary"
                  onPress={() => handleAdjustProgress(0.1)}
                  style={styles.adjustBtn}
                />
              </View>
            </View>
            <ProgressBar progress={progressVal} style={styles.playgroundProgress} />

            <View style={styles.playgroundDivider} />

            {/* Dynamic Genre Chips Selection */}
            <Text variant="label-md" color={Theme.Colors.onBackground} style={styles.playgroundTitle}>
              Interactive Genre Selection (Multi-select)
            </Text>
            <View style={styles.chipWrapper}>
              {availableGenres.map((genre) => (
                <Chip
                  key={genre}
                  label={genre}
                  selected={selectedGenres.includes(genre)}
                  onPress={() => toggleGenre(genre)}
                  style={styles.genreChip}
                />
              ))}
            </View>

            <View style={styles.playgroundDivider} />

            {/* Interactive Inputs */}
            <Text variant="label-md" color={Theme.Colors.onBackground} style={styles.playgroundTitle}>
              Animated Focus Text Input
            </Text>
            <InputField
              label="Explore Library"
              placeholder="Search books by author, title, genre..."
              value={searchText}
              onChangeText={setSearchText}
            />

            <View style={styles.playgroundDivider} />

            {/* Buttons Showcase */}
            <Text variant="label-md" color={Theme.Colors.onBackground} style={styles.playgroundTitle}>
              Premium Buttons (Primary, Secondary, Ghost)
            </Text>
            <View style={styles.buttonShowcaseRow}>
              <Button
                title="Primary Action"
                variant="primary"
                onPress={() => Alert.alert("Quiet Reader", "Primary indigo button pressed")}
              />
              <Button
                title="Secondary Border"
                variant="secondary"
                onPress={() => Alert.alert("Quiet Reader", "Secondary outlined button pressed")}
              />
            </View>
            <Button
              title="Ghost Button Option"
              variant="ghost"
              onPress={() => Alert.alert("Quiet Reader", "Ghost button pressed")}
              style={styles.fullGhostBtn}
            />
          </Card>
        </View>

        {/* Section 4: Premium Book Card Integration Showcase */}
        <View style={styles.section}>
          <Text variant="label-md" color={Theme.Colors.primary} style={styles.sectionHeader}>
            PREMIUM DEMONSTRATION CARD
          </Text>
          
          <Card bordered surfaceColor="surfaceContainerLowest" elevation="high" style={styles.bookCard}>
            
            {/* Top row with book metadata */}
            <View style={styles.bookHeaderRow}>
              <View style={styles.bookDetails}>
                <View style={styles.chipRow}>
                  <Chip label="Currently Reading" selected style={styles.statusBadge} />
                  <Chip label="Fiction" style={styles.statusBadge} />
                </View>
                <Text variant="headline-md" color={Theme.Colors.onBackground} style={styles.bookTitle}>
                  The Shadow of the Wind
                </Text>
                <Text variant="label-md" color={Theme.Colors.secondary} style={styles.bookAuthor}>
                  Carlos Ruiz Zafón
                </Text>
              </View>
            </View>

            {/* Narrative quote / description */}
            <Text variant="body-md" color={Theme.Colors.onSurfaceVariant} style={styles.bookDesc}>
              A gorgeous journey into Barcelona's mysterious "Cemetery of Forgotten Books," where a young boy adopts a book that plunges him into a dark web of secrets and murder.
            </Text>

            {/* Beautiful Progress Track in Card */}
            <View style={styles.bookProgressSection}>
              <View style={styles.bookProgressInfo}>
                <Text variant="label-sm" color={Theme.Colors.onSurfaceVariant}>
                  Completion
                </Text>
                <Text variant="label-sm" color={Theme.Colors.primary}>
                  {Math.round(progressVal * 487)} of 487 pages ({Math.round(progressVal * 100)}%)
                </Text>
              </View>
              <ProgressBar progress={progressVal} />
            </View>

            {/* Action buttons inside Card */}
            <View style={styles.bookCardActions}>
              <Button
                title={isFavorited ? "♥ Favorited" : "♡ Favorite"}
                variant="secondary"
                onPress={() => setIsFavorited(!isFavorited)}
                style={styles.favoriteButton}
              />
              <Button
                title="Continue Reading"
                variant="primary"
                onPress={() => Alert.alert("Quiet Reader", "Opening Reader view...")}
                style={styles.readButton}
              />
            </View>
          </Card>
        </View>

        {/* Serene Footer */}
        <View style={styles.footer}>
          <Text variant="label-sm" color={Theme.Colors.secondary} align="center">
            Quiet Reader Design System • Built with React Native & Expo
          </Text>
          <Text variant="label-sm" color={Theme.Colors.outline} align="center" style={styles.footerSub}>
            Tonal Surface Tiers conform to Paper & Ink philosophy
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
    paddingBottom: Theme.Spacing.xl,
  },
  header: {
    alignItems: "center",
    marginBottom: Theme.Spacing.lg,
  },
  logoBadge: {
    width: 48,
    height: 48,
    borderRadius: Theme.Roundness.md,
    backgroundColor: Theme.Colors.primary,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: Theme.Spacing.sm,
  },
  logoText: {
    fontWeight: "700",
    letterSpacing: 1,
  },
  title: {
    marginBottom: Theme.Spacing.xs,
    fontWeight: "700",
  },
  section: {
    marginBottom: Theme.Spacing.lg,
  },
  sectionHeader: {
    fontWeight: "700",
    letterSpacing: 1.5,
    marginBottom: Theme.Spacing.sm,
    paddingLeft: Theme.Spacing.xs,
  },
  gridCard: {
    padding: Theme.Spacing.sm,
  },
  colorGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  colorSwatchContainer: {
    width: "47%",
    marginBottom: Theme.Spacing.sm,
    alignItems: "flex-start",
  },
  swatch: {
    width: "100%",
    height: 50,
    borderRadius: Theme.Roundness.DEFAULT,
    marginBottom: Theme.Spacing.xs,
  },
  typoRow: {
    paddingVertical: Theme.Spacing.sm,
  },
  typoDivider: {
    height: 1,
    backgroundColor: Theme.Colors.outlineVariant,
    opacity: 0.5,
  },
  playgroundCard: {
    padding: Theme.Spacing.md,
  },
  playgroundTitle: {
    fontWeight: "600",
    marginBottom: Theme.Spacing.sm,
  },
  progressHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: Theme.Spacing.sm,
  },
  controlsRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  adjustBtn: {
    paddingVertical: Theme.Spacing.xs,
    paddingHorizontal: Theme.Spacing.sm,
    minHeight: 32,
    marginLeft: Theme.Spacing.xs,
  },
  playgroundProgress: {
    marginBottom: Theme.Spacing.sm,
  },
  playgroundDivider: {
    height: 1,
    backgroundColor: Theme.Colors.outlineVariant,
    marginVertical: Theme.Spacing.md,
    opacity: 0.5,
  },
  chipWrapper: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginBottom: Theme.Spacing.xs,
  },
  genreChip: {
    marginRight: Theme.Spacing.xs,
    marginBottom: Theme.Spacing.xs,
  },
  buttonShowcaseRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: Theme.Spacing.sm,
  },
  fullGhostBtn: {
    alignSelf: "stretch",
  },
  bookCard: {
    padding: Theme.Spacing.md,
  },
  bookHeaderRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: Theme.Spacing.sm,
  },
  bookDetails: {
    flex: 1,
  },
  chipRow: {
    flexDirection: "row",
    marginBottom: Theme.Spacing.xs,
  },
  statusBadge: {
    marginRight: Theme.Spacing.xs,
  },
  bookTitle: {
    fontWeight: "700",
    marginBottom: 2,
  },
  bookAuthor: {
    fontWeight: "600",
  },
  bookDesc: {
    lineHeight: 22,
    marginBottom: Theme.Spacing.md,
  },
  bookProgressSection: {
    marginBottom: Theme.Spacing.md,
  },
  bookProgressInfo: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: Theme.Spacing.xs,
  },
  bookCardActions: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  favoriteButton: {
    width: "35%",
  },
  readButton: {
    width: "60%",
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
