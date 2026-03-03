import { View, StyleSheet } from "react-native";
import { useRouter } from "expo-router";
import { Screen } from "@/components/ui/Screen";
import { RSText } from "@/components/ui/RSText";
import { Button } from "@/components/ui/Button";
import { colors, spacing } from "@/theme";

export default function SignUpScreen() {
  const router = useRouter();

  return (
    <Screen>
      <View style={styles.container}>
        <View style={styles.content}>
          <RSText variant="h1">Create Account</RSText>
          <RSText variant="bodyLarge" color={colors.dark[500]} style={styles.subtitle}>
            Join Ritual Studio and build your daily drawing habit.
          </RSText>
          <RSText variant="body" color={colors.dark[500]} style={styles.note}>
            Sign up form will be implemented in Phase 4.
          </RSText>
        </View>

        <View style={styles.footer}>
          <Button
            label="Create Account"
            variant="cta"
            size="lg"
            style={styles.button}
            onPress={() => {}}
          />
          <Button
            label="Already have an account? Sign In"
            variant="ghost"
            size="md"
            onPress={() => router.back()}
          />
        </View>
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "space-between",
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing["3xl"],
  },
  content: {
    flex: 1,
    justifyContent: "center",
  },
  subtitle: {
    marginTop: spacing.md,
  },
  note: {
    marginTop: spacing.base,
  },
  footer: {
    gap: spacing.md,
    alignItems: "center",
  },
  button: {
    width: "100%",
  },
});
