import { View, StyleSheet } from "react-native";
import { useLocalSearchParams } from "expo-router";
import { RSText } from "@/components/ui/RSText";
import { colors, spacing } from "@/theme";

export default function SessionScreen() {
  const { promptId } = useLocalSearchParams<{ promptId: string }>();

  return (
    <View style={styles.container}>
      <RSText variant="label" color={colors.brand[400]}>Session</RSText>
      <RSText variant="h1" color={colors.white} style={styles.heading}>
        Prompt #{promptId}
      </RSText>
      <RSText variant="body" color={colors.dark[300]} style={styles.description}>
        Calm timer session will be implemented in Phase 8.
      </RSText>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.dark[900],
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: spacing.xl,
  },
  heading: {
    marginTop: spacing.sm,
    textAlign: "center",
  },
  description: {
    marginTop: spacing.md,
    textAlign: "center",
  },
});
