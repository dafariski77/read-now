import { ScreenContainer } from "@/core/components";
import { Theme } from "@/core/themes";
import { StyleSheet } from "react-native";
import HomeCurrentlyReading from "./HomeCurrentlyReading";
import HomeGoalCard from "./HomeGoalCard";
import HomeUpNext from "./HomeUpNext";

export default function HomeView() {
  return (
    <ScreenContainer
      scrollable={true}
      padding={false}
      contentContainerStyle={styles.scrollContainer}
    >
      <HomeGoalCard />
      <HomeCurrentlyReading />
      <HomeUpNext />
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  scrollContainer: {
    paddingHorizontal: Theme.Spacing.marginMobile,
    paddingBottom: Theme.Spacing.xl + 80,
  },
});
