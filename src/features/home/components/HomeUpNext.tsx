import { Text } from "@/core/components";
import { StyleSheet } from "react-native";
import HomeEmptyUpNext from "./HomeEmptyUpNext";

export default function HomeUpNext() {
  return (
    <>
      <Text style={styles.title}>Up Next</Text>
      <HomeEmptyUpNext />
    </>
  );
}

const styles = StyleSheet.create({
  title: {
    marginTop: 16,
  },
});
