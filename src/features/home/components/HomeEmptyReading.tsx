import { Button, Card, Text } from "@/core/components";
import { Theme } from "@/core/themes";
import { Octicons } from "@expo/vector-icons";
import { StyleSheet, View } from "react-native";

export default function HomeEmptyReading() {
  return (
    <Card
      elevation="none"
      bordered
      surfaceColor="surfaceContainer"
      style={styles.cardCurrentlyReading}
    >
      <Text variant="headline-md" align="center">
        Mulai
      </Text>
      <Text variant="headline-md" align="center">
        Petualanganmu
      </Text>
      <Text variant="body-md" align="center">
        Kamu belum memiliki buku yang sedang dibaca. Mari cari buku menarik
        untuk menemani harimu.
      </Text>
      <View style={styles.buttonContainer}>
        <Button
          title="Tambah Buku"
          leftIcon={
            <Octicons name="plus" size={16} color={Theme.Colors.onPrimary} />
          }
        />
      </View>
    </Card>
  );
}

const styles = StyleSheet.create({
  cardCurrentlyReading: {
    marginTop: 20,
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
  },
  buttonContainer: {
    marginTop: 24,
  },
});
