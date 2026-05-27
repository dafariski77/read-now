import React from "react";
import { StyleSheet, View, Dimensions } from "react-native";
import { Theme } from "@/core/themes";
import { Text, ScreenContainer, Card } from "@/core/components";
import Svg, { Path, Circle } from "react-native-svg";

const { width } = Dimensions.get("window");

interface Companion {
  id: string;
  name: string;
  milestone: string;
  unlocked: boolean;
  active?: boolean;
  color: string;
  avatarSvg: (activeColor: string) => React.ReactNode;
}

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

// We draw beautiful inline SVGs for our characters so they load instantly and look premium!
const drawBloop = (color: string) => (
  <Svg width={70} height={70} viewBox="0 0 100 100" fill="none">
    {/* Body */}
    <Circle cx="50" cy="50" r="40" fill={color} />
    {/* Eyes */}
    <Circle cx="38" cy="45" r="5" fill="#181c20" />
    <Circle cx="62" cy="45" r="5" fill="#181c20" />
    <Circle cx="36" cy="43" r="1.5" fill="#ffffff" />
    <Circle cx="60" cy="43" r="1.5" fill="#ffffff" />
    {/* Cheeks */}
    <Circle cx="30" cy="52" r="4" fill="#ff8a80" opacity="0.6" />
    <Circle cx="70" cy="52" r="4" fill="#ff8a80" opacity="0.6" />
    {/* Smile */}
    <Path d="M44 56q6 4 12 0" stroke="#181c20" strokeWidth="3" strokeLinecap="round" />
    {/* Small Book in hand */}
    <Path d="M42 66h16a2 2 0 012 2v10a2 2 0 01-2 2H42a2 2 0 01-2-2V68a2 2 0 012-2z" fill="#4352a5" />
    <Path d="M50 66v14" stroke="#ffffff" strokeWidth="1.5" />
  </Svg>
);

const drawSpecter = (color: string) => (
  <Svg width={70} height={70} viewBox="0 0 100 100" fill="none">
    {/* Body - Ghost shape */}
    <Path d="M20 50 C20 30, 80 30, 80 50 C80 70, 75 80, 70 80 C60 80, 55 70, 50 80 C45 70, 40 80, 30 80 C25 80, 20 70, 20 50 Z" fill={color} />
    {/* Big Spectacles */}
    <Circle cx="36" cy="46" r="10" stroke="#181c20" strokeWidth="3" fill="#ffffff" fillOpacity="0.3" />
    <Circle cx="64" cy="46" r="10" stroke="#181c20" strokeWidth="3" fill="#ffffff" fillOpacity="0.3" />
    <Path d="M46 46h8" stroke="#181c20" strokeWidth="3" />
    {/* Eyes */}
    <Circle cx="36" cy="46" r="3" fill="#181c20" />
    <Circle cx="64" cy="46" r="3" fill="#181c20" />
    {/* Small mouth */}
    <Circle cx="50" cy="60" r="4" fill="#181c20" />
  </Svg>
);

const drawPages = (color: string) => (
  <Svg width={70} height={70} viewBox="0 0 100 100" fill="none">
    {/* Book Cover on Head shape */}
    <Path d="M25 65V35c0-5 4-9 9-9h32c5 0 9 4 9 9v30c0 5-4 9-9 9H34c-5 0-9-4-9-9z" fill={color} />
    {/* Inner Pages */}
    <Path d="M30 65V38c0-3 2-5 5-5h30c3 0 5 2 5 5v27c0 3-2 5-5 5H35c-3 0-5-2-5-5z" fill="#ffffff" />
    {/* Book Spine Center */}
    <Path d="M50 33v37" stroke={color} strokeWidth="2" />
    {/* Eyes on page */}
    <Path d="M40 45q3-3 6 0" stroke="#181c20" strokeWidth="2.5" strokeLinecap="round" />
    <Path d="M54 45q3-3 6 0" stroke="#181c20" strokeWidth="2.5" strokeLinecap="round" />
    {/* Cute smile */}
    <Path d="M48 55q2 2 4 0" stroke="#181c20" strokeWidth="2.5" strokeLinecap="round" />
  </Svg>
);

const drawStacker = (color: string) => (
  <Svg width={70} height={70} viewBox="0 0 100 100" fill="none">
    {/* Stacking circles representing stack of books buddy */}
    <Path d="M20 70h60v10H20z" fill={color} />
    <Path d="M25 55h50v12H25z" fill={color} opacity="0.8" />
    <Path d="M30 40h40v12H30z" fill={color} opacity="0.6" />
    {/* Animated eyes on top book */}
    <Circle cx="44" cy="46" r="3" fill="#181c20" />
    <Circle cx="56" cy="46" r="3" fill="#181c20" />
  </Svg>
);

const COMPANIONS: Companion[] = [
  {
    id: "c1",
    name: "Bookish Bloop",
    milestone: "Starter Companion",
    unlocked: true,
    color: "#e8efff",
    avatarSvg: (c) => drawBloop(c),
  },
  {
    id: "c2",
    name: "Specs Specter",
    milestone: "Read 10 Books",
    unlocked: true,
    color: "#f6eeff",
    avatarSvg: (c) => drawSpecter(c),
  },
  {
    id: "c3",
    name: "Pages",
    milestone: "Read 25 Books",
    unlocked: true,
    active: true,
    color: "#fff5eb",
    avatarSvg: (c) => drawPages(c),
  },
  {
    id: "c4",
    name: "Stacker",
    milestone: "Read 50 Books",
    unlocked: false,
    color: "#eef1f6",
    avatarSvg: (c) => drawStacker(c),
  },
  {
    id: "c5",
    name: "Romance Reader",
    milestone: "Read 10 Romance",
    unlocked: false,
    color: "#eef1f6",
    avatarSvg: (c) => drawBloop(c),
  },
  {
    id: "c6",
    name: "Dreamer",
    milestone: "100 Days Streak",
    unlocked: false,
    color: "#eef1f6",
    avatarSvg: (c) => drawSpecter(c),
  },
];

export default function CollectionView() {
  return (
    <ScreenContainer scrollable padding={false} hasBottomTabs style={styles.container}>
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
              3 / 6 Unlocked
            </Text>
          </View>
        </View>
      </View>

      {/* Grid of Companions */}
      <View style={styles.gridContainer}>
        {COMPANIONS.map((companion) => {
          const isLocked = !companion.unlocked;
          const isActive = companion.active;

          return (
            <Card
              key={companion.id}
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
              {companion.unlocked && !isActive && (
                <View style={styles.claimBadge}>
                  <CheckIcon />
                </View>
              )}

              {/* Avatar circle */}
              <View
                style={[
                  styles.avatarBg,
                  { backgroundColor: isLocked ? "#ebeef3" : companion.color },
                  isLocked && styles.lockedAvatarBg,
                ]}
              >
                {companion.avatarSvg(
                  isLocked
                    ? Theme.Colors.outline
                    : companion.id === "c1"
                    ? "#5c6bc0"
                    : companion.id === "c2"
                    ? "#ab47bc"
                    : "#ff9800"
                )}

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
                >
                  {companion.milestone}
                </Text>
              </View>
            </Card>
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
  companionCard: {
    width: (width - Theme.Spacing.marginMobile * 2 - 12) / 2,
    backgroundColor: Theme.Colors.surfaceContainerLowest,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "rgba(198, 197, 211, 0.2)",
    padding: Theme.Spacing.md,
    alignItems: "center",
    marginBottom: 16,
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
  },
  lockedText: {
    color: Theme.Colors.outline,
  },
});
