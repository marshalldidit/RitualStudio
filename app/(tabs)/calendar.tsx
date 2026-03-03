import { View, StyleSheet } from "react-native";
import { Screen } from "@/components/ui/Screen";
import { RSText } from "@/components/ui/RSText";
import { colors, spacing } from "@/theme";

export default function CalendarScreen() {
  return (
    <Screen>
      <View style={styles.container}>
        <RSText variant="h1">Calendar</RSText>
        <RSText variant="body" color={colors.dark[500]} style={styles.description}>
          Streak calendar will be implemented in Phase 11.
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
