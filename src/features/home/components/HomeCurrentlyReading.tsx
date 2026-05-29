import { Text } from "@/core/components";
import { StyleSheet } from "react-native";
import HomeEmptyReading from "./HomeEmptyReading";

export default function HomeCurrentlyReading() {
  return (
    <>
      <Text style={styles.title}>Currently Reading</Text>
      <HomeEmptyReading />
    </>
  );
}

const styles = StyleSheet.create({
  title: {
    marginTop: 16,
  },
});
