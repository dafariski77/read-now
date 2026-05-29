import { Avatar, Card, ChatBubble, Text } from "@/core/components";
import { StyleSheet, View } from "react-native";
import HomeEmptyGoal from "./HomeEmptyGoal";

export default function HomeGoalCard() {
  return (
    <Card elevation="none" bordered={false} surfaceColor="surfaceContainer">
      <Text variant="headline-md">Good Morning, Reader.</Text>
      <Text variant="body-lg">
        You are 15 minutes away from reaching your daily goal.
      </Text>

      <View style={styles.greetingSystemRow}>
        <Avatar size={60} name="admin ganteng" />
        <ChatBubble
          arrowPosition="left-middle"
          elevation="low"
          style={styles.bubbleContainer}
          variant="surfaceDim"
          message='"Ready to start your first chapter today?"'
        />
      </View>

      <HomeEmptyGoal />
    </Card>
  );
}

const styles = StyleSheet.create({
  greetingSystemRow: {
    flexDirection: "row",
    columnGap: 20,
    marginVertical: 20,
    alignItems: "center",
  },
  bubbleContainer: {
    flex: 1,
  },
});
