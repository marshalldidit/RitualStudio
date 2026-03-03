import { View, StyleSheet } from "react-native";
import { Screen } from "@/components/ui/Screen";
import { RSText } from "@/components/ui/RSText";
import { colors, spacing } from "@/theme";

export default function HomeScreen() {
  return (
    <Screen>
      <View style={styles.container}>
        <RSText variant="label" color={colors.dark[500]}>Day 1</RSText>
        <RSText variant="h1" style={styles.heading}>Your Daily Ritual</RSText>
        <RSText variant="body" color={colors.dark[500]} style={styles.description}>
          Prompt cards and swipe carousel will be implemented in Phase 7.
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
  heading: {
    marginTop: spacing.sm,
  },
  description: {
    marginTop: spacing.md,
  },
});
