import { Card, Text } from "@/core/components";
import { Theme } from "@/core/themes";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { StyleSheet } from "react-native";

export default function HomeEmptyUpNext() {
  return (
    <Card
      elevation="none"
      bordered
      surfaceColor="surfaceContainer"
      style={styles.emptyUpNextCard}
    >
      <MaterialCommunityIcons
        name="plus-box-multiple-outline"
        size={32}
        color={Theme.Colors.tertiary}
      />
      <Text variant="label-md">Belum ada antrean</Text>
    </Card>
  );
}

const styles = StyleSheet.create({
  emptyUpNextCard: {
    marginTop: 20,
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "column",
    rowGap: 12,
  },
});
