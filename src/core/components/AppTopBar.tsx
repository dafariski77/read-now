import { StyleSheet, View } from "react-native";
import { Theme } from "../themes";
import Avatar from "./Avatar";
import Text from "./Text";

export default function AppTopBar() {
  return (
    <View style={styles.appBarContainer}>
      <Text variant="headline-lg-mobile" color={Theme.Colors.primary}>
        Read Quest
      </Text>
      <Avatar />
    </View>
  );
}

const styles = StyleSheet.create({
  appBarContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 12,
    paddingHorizontal: Theme.Spacing.marginMobile,
    backgroundColor: Theme.Colors.appBarBackground,
  },
});
