import React from "react";
import { StyleSheet, View, Dimensions, Pressable, ActivityIndicator, RefreshControl, StatusBar } from "react-native";
import { Theme } from "@/core/themes";
import { Text, ScreenContainer, Card, Skeleton } from "@/core/components";
import Svg, { Path } from "react-native-svg";
import useCollection from "../hooks/useCollection";
import CharacterAvatar from "./CharacterAvatar";

const { width } = Dimensions.get("window");

// Icon components for Collection page
const LockIcon = ({ size = 20, color = Theme.Colors.onSurfaceVariant }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path
      d="M12 17a2 2 0 100-4 2 2 0 000 4z"
      fill={color}
    />
    <Path
      d="M18 8h-1V6c0-2.76-2.24-5-5-5S7 3.24 7 6v2H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2zm-6-5c1.66 0 3 1.34 3 3v2H9V6c0-1.66 1.34-3 3-3zm6 17H6V10h12v10z"
      fill={color}
    />
  </Svg>
);

const CheckIcon = ({ size = 12, color = "#ffffff" }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path
      d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"
      fill={color}
    />
  </Svg>
);

export default function CollectionView() {
  const {
    loading,
    characters,
    unlockedIds,
    activeId,
    loadCollection,
    selectActiveCompanion,
  } = useCollection();

  const handleRefresh = () => {
    loadCollection();
  };

  const handleSelectCompanion = async (companion: any) => {
    await selectActiveCompanion(companion);
  };

  const unlockedCount = characters.filter((c) => unlockedIds.has(c.id)).length;

  if (loading && characters.length === 0) {
    return (
      <ScreenContainer scrollable={false} hasBottomTabs style={styles.container}>
        <StatusBar barStyle="dark-content" backgroundColor={Theme.Colors.background} />
        
        {/* Title area Skeleton */}
        <View style={styles.headerSection}>
          <View style={styles.headerRow}>
            <View style={{ gap: 6 }}>
              <Skeleton width={200} height={26} />
              <Skeleton width={260} height={16} />
            </View>
            <Skeleton width={110} height={28} borderRadius={14} style={{ marginTop: 8 }} />
          </View>
        </View>

        {/* Grid of Companions Skeleton */}
        <View style={styles.gridContainer}>
          {Array.from({ length: 4 }).map((_, index) => (
            <View key={index} style={styles.pressableWrapper}>
              <Card style={[styles.companionCard, { gap: 12 }]}>
                <Skeleton width={76} height={76} borderRadius={38} />
                <Skeleton width={100} height={16} />
                <Skeleton width={80} height={12} />
              </Card>
            </View>
          ))}
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
        <RefreshControl refreshing={loading} onRefresh={handleRefresh} colors={[Theme.Colors.primary]} />
      }
    >
      {/* Title area */}
      <View style={styles.headerSection}>
        <View style={styles.headerRow}>
          <View>
            <Text variant="headline-lg-mobile" color={Theme.Colors.primary} style={styles.title}>
              Claimed Characters
            </Text>
            <Text variant="body-md" color={Theme.Colors.secondary} style={styles.subtitle}>
              Unlock new companions by hitting reading milestones.
            </Text>
          </View>
          <View style={styles.statusBadge}>
            <Text variant="label-sm" color={Theme.Colors.primary} style={styles.statusText}>
              {unlockedCount} / {characters.length} Unlocked
            </Text>
          </View>
        </View>
      </View>

      {/* Grid of Companions */}
      <View style={styles.gridContainer}>
        {characters.map((companion) => {
          const isUnlocked = unlockedIds.has(companion.id);
          const isLocked = !isUnlocked;
          const isActive = companion.id === activeId;

          return (
            <Pressable key={companion.id} onPress={() => handleSelectCompanion(companion)} style={styles.pressableWrapper}>
              <Card
                style={[
                  styles.companionCard,
                  isActive && styles.activeCompanionCard,
                  isLocked && styles.lockedCompanionCard,
                ]}
              >
                {/* Top status tag */}
                {isActive && (
                  <View style={styles.activeTag}>
                    <Text variant="label-sm" color={Theme.Colors.onPrimaryContainer} style={styles.activeTagText}>
                      Active
                    </Text>
                  </View>
                )}

                {/* Unlocked claim checkmark badge at top-right */}
                {isUnlocked && !isActive && (
                  <View style={styles.claimBadge}>
                    <CheckIcon />
                  </View>
                )}

                {/* Avatar circle */}
                <View
                  style={[
                    styles.avatarBg,
                    isLocked && styles.lockedAvatarBg,
                  ]}
                >
                  <CharacterAvatar
                    illustrationUrl={companion.illustration_url}
                    size={76}
                    locked={isLocked}
                  />

                  {/* Overlaid Lock Icon */}
                  {isLocked && (
                    <View style={styles.lockOverlay}>
                      <LockIcon size={22} />
                    </View>
                  )}
                </View>

                {/* Character Details */}
                <View style={styles.cardInfo}>
                  <Text
                    variant="label-md"
                    color={isLocked ? Theme.Colors.onSurfaceVariant : Theme.Colors.onSurface}
                    style={[styles.companionName, isLocked && styles.lockedText]}
                  >
                    {companion.name}
                  </Text>
                  <Text
                    variant="label-sm"
                    color={isActive ? Theme.Colors.primary : Theme.Colors.secondary}
                    style={[styles.milestoneText, isLocked && styles.lockedText]}
                    numberOfLines={2}
                  >
                    {companion.condition_type === "TOTAL_BOOKS_READ"
                      ? companion.condition_value === 0 
                        ? "Starter Companion"
                        : `Read ${companion.condition_value} Books`
                      : `Read ${companion.condition_value} in ${companion.name.includes("Romance") ? "Romance" : "Genre"}`}
                  </Text>
                </View>
              </Card>
            </Pressable>
          );
        })}
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
    marginBottom: Theme.Spacing.md,
  },
  headerRow: {
    flexDirection: "column",
    justifyContent: "space-between",
    alignItems: "flex-start",
    gap: Theme.Spacing.xs,
  },
  title: {
    fontWeight: "700",
    marginBottom: 4,
  },
  subtitle: {
    paddingRight: 60,
  },
  statusBadge: {
    backgroundColor: "rgba(67, 82, 165, 0.08)",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: Theme.Roundness.full,
    marginTop: Theme.Spacing.xs,
    alignSelf: "flex-start",
  },
  statusText: {
    fontWeight: "700",
  },
  gridContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    paddingHorizontal: Theme.Spacing.marginMobile - 6,
    justifyContent: "space-between",
  },
  pressableWrapper: {
    width: (width - Theme.Spacing.marginMobile * 2 - 12) / 2,
    marginBottom: 16,
  },
  companionCard: {
    width: "100%",
    backgroundColor: Theme.Colors.surfaceContainerLowest,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "rgba(198, 197, 211, 0.2)",
    padding: Theme.Spacing.md,
    alignItems: "center",
    position: "relative",
    elevation: 2,
    shadowColor: "#000",
    shadowOpacity: 0.03,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
  },
  activeCompanionCard: {
    borderColor: Theme.Colors.primary,
    borderWidth: 2,
    elevation: 4,
    shadowColor: Theme.Colors.primary,
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  lockedCompanionCard: {
    opacity: 0.6,
    backgroundColor: Theme.Colors.surfaceContainerLow,
    borderColor: "transparent",
  },
  activeTag: {
    position: "absolute",
    top: 10,
    left: 10,
    backgroundColor: "rgba(67, 82, 165, 0.12)",
    borderRadius: Theme.Roundness.full,
    paddingHorizontal: 8,
    paddingVertical: 2,
    zIndex: 10,
  },
  activeTagText: {
    fontSize: 9,
    fontWeight: "700",
    color: Theme.Colors.primary,
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  claimBadge: {
    position: "absolute",
    top: 10,
    right: 10,
    backgroundColor: Theme.Colors.primary,
    borderRadius: Theme.Roundness.full,
    width: 18,
    height: 18,
    alignItems: "center",
    justifyContent: "center",
    zIndex: 10,
  },
  avatarBg: {
    width: 110,
    height: 110,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: Theme.Spacing.sm,
    position: "relative",
  },
  lockedAvatarBg: {
    opacity: 0.5,
  },
  lockOverlay: {
    position: "absolute",
    inset: 0,
    backgroundColor: "rgba(24, 28, 32, 0.05)",
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
  },
  cardInfo: {
    alignItems: "center",
    marginTop: 4,
  },
  companionName: {
    fontWeight: "700",
    fontSize: 14,
    marginBottom: 2,
    textAlign: "center",
  },
  milestoneText: {
    fontSize: 11,
    fontWeight: "600",
    textAlign: "center",
  },
  lockedText: {
    color: Theme.Colors.outline,
  },
});
