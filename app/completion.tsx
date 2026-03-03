import { View, StyleSheet } from "react-native";
import { Screen } from "@/components/ui/Screen";
import { RSText } from "@/components/ui/RSText";
import { colors, spacing } from "@/theme";

export default function CompletionScreen() {
  return (
    <Screen>
      <View style={styles.container}>
        <RSText variant="display">Day 1{"\n"}Complete</RSText>
        <RSText variant="h3" color={colors.dark[500]} style={styles.subtitle}>
          You showed up.
        </RSText>
        <RSText variant="body" color={colors.dark[500]} style={styles.description}>
          Celebration animation and streak update will be implemented in Phase 10.
        </RSText>
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: spacing.xl,
  },
  subtitle: {
    marginTop: spacing.base,
  },
  description: {
    marginTop: spacing.md,
    textAlign: "center",
  },
});
