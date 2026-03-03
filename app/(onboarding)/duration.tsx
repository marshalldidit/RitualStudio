import { View, StyleSheet } from "react-native";
import { useRouter } from "expo-router";
import { RSText } from "@/components/ui/RSText";
import { Button } from "@/components/ui/Button";
import { colors, spacing } from "@/theme";

export default function DurationScreen() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <RSText variant="h2">How much time can you dedicate each day?</RSText>
        <RSText variant="body" color={colors.dark[500]} style={styles.description}>
          Duration selection will be implemented in Phase 5.
        </RSText>
      </View>
      <View style={styles.footer}>
        <Button
          label="Back"
          variant="ghost"
          size="md"
          onPress={() => router.back()}
        />
        <Button
          label="Next"
          variant="cta"
          size="lg"
          style={styles.button}
          onPress={() => router.push("/(onboarding)/reminder")}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.xl,
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
