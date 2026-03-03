import { View, StyleSheet } from "react-native";
import { useRouter } from "expo-router";
import { RSText } from "@/components/ui/RSText";
import { Button } from "@/components/ui/Button";
import { colors, spacing } from "@/theme";

export default function CompleteScreen() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <RSText variant="display">Your Ritual{"\n"}Begins Today</RSText>
        <RSText variant="bodyLarge" color={colors.dark[500]} style={styles.description}>
          Summary of your choices and database write will be implemented in Phase 5.
        </RSText>
      </View>
      <View style={styles.footer}>
        <Button
          label="Begin Day 1"
          variant="cta"
          size="lg"
          style={styles.button}
          onPress={() => router.replace("/(tabs)")}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing["3xl"],
    justifyContent: "space-between",
  },
  content: {
    flex: 1,
    justifyContent: "center",
  },
  description: {
    marginTop: spacing.md,
  },
  footer: {
    gap: spacing.md,
  },
  button: {
    width: "100%",
  },
});
