import { Button, Card, CircleIcon, Text } from "@/core/components";
import { Octicons } from "@expo/vector-icons";
import { StyleSheet } from "react-native";

export default function HomeEmptyGoal() {
  return (
    <Card elevation="none" borderRadius="md" style={styles.cardNoGoalSet}>
      <Text variant="label-md" align="center">
        GOAL BELUM DIATUR
      </Text>
      <CircleIcon
        icon={Octicons}
        name="goal"
        size={30}
        containerSize={72}
        color="primary"
        backgroundColor="surfaceDim"
      />
      <Text variant="body-md" align="center">
        Tantang dirimu dengan target membaca harian.
      </Text>
      <Button title="Atur Target Harian" fullWidth />
    </Card>
  );
}

const styles = StyleSheet.create({
  cardNoGoalSet: {
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    rowGap: 16,
  },
});
