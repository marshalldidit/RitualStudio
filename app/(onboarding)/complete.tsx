import { useState } from "react";
import { View, ScrollView, Pressable, Text, StyleSheet } from "react-native";
import { useRouter } from "expo-router";
import * as Haptics from "expo-haptics";
import { RSText } from "@/components/ui/RSText";
import { Button } from "@/components/ui/Button";
import { colors, spacing } from "@/theme";
import { fontFamily } from "@/theme/typography";
import { useAuth } from "@/providers/AuthProvider";
import { supabase } from "@/lib/supabase";
import { useOnboardingStore } from "@/stores/onboardingStore";
import { scheduleDailyReminder } from "@/lib/notifications";
import {
  GOAL_OPTIONS,
  LEVEL_OPTIONS,
  SUBJECT_OPTIONS,
  SKILL_OPTIONS,
  DURATION_OPTIONS,
} from "@/constants/onboarding";
import { format, parse } from "date-fns";

function getLabel(
  options: { value: string | number; label: string }[],
  value: string | number | null
): string {
  return options.find((o) => o.value === value)?.label ?? "\u2014";
}

function getLabels(
  options: { value: string; label: string }[],
  values: string[]
): string {
  return (
    values
      .map((v) => options.find((o) => o.value === v)?.label)
      .filter(Boolean)
      .join(", ") || "\u2014"
  );
}

function SummaryRow({
  emoji,
  label,
  value,
  onEdit,
}: {
  emoji: string;
  label: string;
  value: string;
  onEdit: () => void;
}) {
  return (
    <View style={styles.summaryRow}>
      <Text style={styles.summaryEmoji}>{emoji}</Text>
      <View style={styles.summaryContent}>
        <RSText variant="caption" color={colors.dark[500]}>
          {label}
        </RSText>
        <RSText variant="body">{value}</RSText>
      </View>
      <Pressable onPress={onEdit} hitSlop={8}>
        <RSText variant="body" color={colors.brand[400]} style={styles.editLink}>
          Edit
        </RSText>
      </Pressable>
    </View>
  );
}

export default function CompleteScreen() {
  const router = useRouter();
  const { session, refreshProfile } = useAuth();
  const store = useOnboardingStore();

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const formattedTime = (() => {
    try {
      const date = parse(store.reminderTimeLocal, "HH:mm", new Date());
      return format(date, "h:mm a");
    } catch {
      return store.reminderTimeLocal;
    }
  })();

  async function handleComplete() {
    if (!session) return;

    setIsSubmitting(true);
    setError(null);

    const { error: updateError } = await supabase
      .from("users")
      .update({
        user_goal: store.userGoals.join(","),
        difficulty_level: store.difficultyLevel,
        subject_preferences: store.subjectPreferences,
        skill_focus_preferences: store.skillFocusPreferences,
        session_duration_minutes: store.sessionDurationMinutes,
        reminder_time_local: store.reminderTimeLocal,
        timezone: store.timezone,
        onboarding_completed: true,
      })
      .eq("id", session.user.id);

    if (updateError) {
      setError("Something went wrong. Please try again.");
      setIsSubmitting(false);
      return;
    }

    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    await scheduleDailyReminder(store.reminderTimeLocal);
    await refreshProfile();
    store.reset();
    // useProtectedRoute will auto-redirect to /(tabs)
  }

  return (
    <View style={styles.container}>
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        bounces={false}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <RSText variant="display">Your Ritual{"\n"}Begins Today</RSText>
          <RSText variant="bodyLarge" color={colors.dark[500]} style={styles.subtitle}>
            Here's what we've set up for you.
          </RSText>
        </View>

        <View style={styles.summary}>
          <SummaryRow
            emoji={"\u{1F3AF}"}
            label="GOALS"
            value={getLabels(GOAL_OPTIONS, store.userGoals)}
            onEdit={() => router.push("/(onboarding)/goal")}
          />
          <SummaryRow
            emoji={"\u{1F4CA}"}
            label="LEVEL"
            value={getLabel(LEVEL_OPTIONS, store.difficultyLevel)}
            onEdit={() => router.push("/(onboarding)/level")}
          />
          <SummaryRow
            emoji={"\u{1F3A8}"}
            label="SUBJECTS"
            value={getLabels(SUBJECT_OPTIONS, store.subjectPreferences)}
            onEdit={() => router.push("/(onboarding)/subjects")}
          />
          <SummaryRow
            emoji={"\u{270F}\uFE0F"}
            label="SKILLS"
            value={getLabels(SKILL_OPTIONS, store.skillFocusPreferences)}
            onEdit={() => router.push("/(onboarding)/skills")}
          />
          <SummaryRow
            emoji={"\u{23F1}\uFE0F"}
            label="SESSION"
            value={getLabel(DURATION_OPTIONS, store.sessionDurationMinutes)}
            onEdit={() => router.push("/(onboarding)/duration")}
          />
          <SummaryRow
            emoji={"\u{23F0}"}
            label="REMINDER"
            value={`${formattedTime} (${store.timezone})`}
            onEdit={() => router.push("/(onboarding)/reminder")}
          />
        </View>
      </ScrollView>

      <View style={styles.footer}>
        {error != null && (
          <View style={styles.errorBanner}>
            <RSText variant="body" color={colors.error}>
              {error}
            </RSText>
          </View>
        )}
        <Button
          label={isSubmitting ? "Setting up\u2026" : "Begin Day 1"}
          variant="cta"
          size="lg"
          style={styles.button}
          disabled={isSubmitting}
          onPress={handleComplete}
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
    paddingTop: spacing["3xl"],
    paddingBottom: spacing.base,
  },
  header: {
    marginBottom: spacing["3xl"],
  },
  subtitle: {
    marginTop: spacing.md,
  },
  summary: {
    gap: spacing.lg,
  },
  summaryRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: spacing.md,
  },
  summaryEmoji: {
    fontSize: 20,
    marginTop: 2,
  },
  summaryContent: {
    flex: 1,
    gap: 2,
  },
  editLink: {
    fontFamily: fontFamily.semiBold,
    marginTop: 2,
  },
  footer: {
    paddingTop: spacing.base,
    gap: spacing.md,
  },
  errorBanner: {
    backgroundColor: "rgba(232, 64, 64, 0.08)",
    borderRadius: 12,
    paddingHorizontal: spacing.base,
    paddingVertical: spacing.md,
  },
  button: {
    width: "100%",
  },
});
