import { View, ScrollView, StyleSheet } from "react-native";
import { useRouter } from "expo-router";
import { RSText } from "@/components/ui/RSText";
import { Button } from "@/components/ui/Button";
import { SelectionChip } from "@/components/ui/SelectionChip";
import { colors, spacing } from "@/theme";
import { SUBJECT_OPTIONS } from "@/constants/onboarding";
import { useOnboardingStore } from "@/stores/onboardingStore";

export default function SubjectsScreen() {
  const router = useRouter();
  const subjectPreferences = useOnboardingStore((s) => s.subjectPreferences);
  const toggleSubject = useOnboardingStore((s) => s.toggleSubject);

  return (
    <View style={styles.container}>
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        bounces={false}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <RSText variant="h2">What do you want to draw more of?</RSText>
          <RSText variant="body" color={colors.dark[500]} style={styles.subtitle}>
            Pick at least one. You can change these later.
          </RSText>
        </View>
        <View style={styles.chips}>
          {SUBJECT_OPTIONS.map((option) => (
            <SelectionChip
              key={option.value}
              label={option.label}
              emoji={option.emoji}
              selected={subjectPreferences.includes(option.value)}
              onPress={() => toggleSubject(option.value)}
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
          disabled={subjectPreferences.length === 0}
          onPress={() => router.push("/(onboarding)/skills")}
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
