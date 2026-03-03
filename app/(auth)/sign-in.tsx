import { View, StyleSheet } from "react-native";
import { useRouter } from "expo-router";
import { Screen } from "@/components/ui/Screen";
import { RSText } from "@/components/ui/RSText";
import { Button } from "@/components/ui/Button";
import { colors, spacing } from "@/theme";

export default function SignInScreen() {
  const router = useRouter();

  return (
    <Screen>
      <View style={styles.container}>
        <View style={styles.content}>
          <RSText variant="display">Ritual{"\n"}Studio</RSText>
          <RSText variant="bodyLarge" color={colors.dark[500]} style={styles.subtitle}>
            Your daily drawing discipline starts here.
          </RSText>
        </View>

        <View style={styles.footer}>
          <RSText variant="body" color={colors.dark[500]} style={styles.note}>
            Sign in will be implemented in Phase 4.
          </RSText>
          <Button
            label="Sign In"
            variant="primary"
            size="lg"
            style={styles.button}
            onPress={() => {}}
          />
          <Button
            label="Create Account"
            variant="ghost"
            size="md"
            onPress={() => router.push("/(auth)/sign-up")}
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
  footer: {
    gap: spacing.md,
    alignItems: "center",
  },
  note: {
    textAlign: "center",
    marginBottom: spacing.sm,
  },
  button: {
    width: "100%",
  },
});
