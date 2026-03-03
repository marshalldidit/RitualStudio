import { View, StyleSheet } from "react-native";
import { Screen } from "@/components/ui/Screen";
import { RSText } from "@/components/ui/RSText";
import { colors, spacing } from "@/theme";

export default function ProfileScreen() {
  return (
    <Screen>
      <View style={styles.container}>
        <RSText variant="h1">Profile</RSText>
        <RSText variant="body" color={colors.dark[500]} style={styles.description}>
          Profile and settings will be implemented in Phase 12.
        </RSText>
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: spacing.xl,
    paddingTop: spacing["2xl"],
  },
  description: {
    marginTop: spacing.md,
  },
});
