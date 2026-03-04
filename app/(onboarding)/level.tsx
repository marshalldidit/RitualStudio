import { View, ScrollView, Pressable, Text, StyleSheet } from "react-native";
import { useRouter } from "expo-router";
import { RSText } from "@/components/ui/RSText";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { colors, spacing } from "@/theme";
import { LEVEL_OPTIONS } from "@/constants/onboarding";
import { useOnboardingStore } from "@/stores/onboardingStore";

export default function LevelScreen() {
  const router = useRouter();
  const difficultyLevel = useOnboardingStore((s) => s.difficultyLevel);
  const setDifficultyLevel = useOnboardingStore((s) => s.setDifficultyLevel);

  return (
    <View style={styles.container}>
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        bounces={false}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <RSText variant="h2">How would you describe your current level?</RSText>
          <RSText variant="body" color={colors.dark[500]} style={styles.subtitle}>
            We'll match prompts to your experience.
          </RSText>
        </View>
        <View style={styles.options}>
          {LEVEL_OPTIONS.map((option) => (
            <Pressable
              key={option.value}
              onPress={() => setDifficultyLevel(option.value)}
            >
              <Card variant={difficultyLevel === option.value ? "active" : "default"}>
                <View style={styles.optionRow}>
                  <Text style={styles.emoji}>{option.emoji}</Text>
                  <View style={styles.optionText}>
                    <RSText variant="h4">{option.label}</RSText>
                    <RSText variant="body" color={colors.dark[500]}>
                      {option.description}
                    </RSText>
                  </View>
                </View>
              </Card>
            </Pressable>
          ))}
        </View>
      </ScrollView>
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
          disabled={difficultyLevel == null}
          onPress={() => router.push("/(onboarding)/subjects")}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: spacing.xl,
    paddingBottom: spacing.xl,
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    paddingTop: spacing.lg,
    paddingBottom: spacing.base,
  },
  header: {
    marginBottom: spacing["2xl"],
  },
  subtitle: {
    marginTop: spacing.sm,
  },
  options: {
    gap: spacing.md,
  },
  optionRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.md,
  },
  emoji: {
    fontSize: 24,
  },
  optionText: {
    flex: 1,
    gap: 2,
  },
  footer: {
    paddingTop: spacing.base,
    gap: spacing.md,
  },
  button: {
    width: "100%",
  },
});
