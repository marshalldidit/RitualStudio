import { View, ScrollView, StyleSheet } from "react-native";
import { useRouter } from "expo-router";
import { RSText } from "@/components/ui/RSText";
import { Button } from "@/components/ui/Button";
import { SelectionChip } from "@/components/ui/SelectionChip";
import { colors, spacing } from "@/theme";
import { SKILL_OPTIONS } from "@/constants/onboarding";
import { useOnboardingStore } from "@/stores/onboardingStore";

export default function SkillsScreen() {
  const router = useRouter();
  const skillFocusPreferences = useOnboardingStore((s) => s.skillFocusPreferences);
  const toggleSkill = useOnboardingStore((s) => s.toggleSkill);

  return (
    <View style={styles.container}>
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        bounces={false}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <RSText variant="h2">What would you like to strengthen?</RSText>
          <RSText variant="body" color={colors.dark[500]} style={styles.subtitle}>
            Pick at least one. We'll focus your growth prompts here.
          </RSText>
        </View>
        <View style={styles.chips}>
          {SKILL_OPTIONS.map((option) => (
            <SelectionChip
              key={option.value}
              label={option.label}
              emoji={option.emoji}
              selected={skillFocusPreferences.includes(option.value)}
              onPress={() => toggleSkill(option.value)}
            />
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
          disabled={skillFocusPreferences.length === 0}
          onPress={() => router.push("/(onboarding)/duration")}
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
  chips: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: spacing.sm,
  },
  footer: {
    paddingTop: spacing.base,
    gap: spacing.md,
  },
  button: {
    width: "100%",
  },
});
