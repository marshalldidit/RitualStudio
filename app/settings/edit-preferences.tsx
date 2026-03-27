import { useState, useEffect } from "react";
import {
  View,
  ScrollView,
  Pressable,
  Text,
  StyleSheet,
  Platform,
  ActivityIndicator,
} from "react-native";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { Screen } from "@/components/ui/Screen";
import { RSText } from "@/components/ui/RSText";
import { Button } from "@/components/ui/Button";
import { SelectionChip } from "@/components/ui/SelectionChip";
import { colors, spacing } from "@/theme";
import { fontFamily } from "@/theme/typography";
import { radius } from "@/theme/radius";
import { useAuth } from "@/providers/AuthProvider";
import { supabase } from "@/lib/supabase";
import {
  GOAL_OPTIONS,
  LEVEL_OPTIONS,
  SUBJECT_OPTIONS,
  SKILL_OPTIONS,
  DURATION_OPTIONS,
} from "@/constants/onboarding";
import { format, parse } from "date-fns";
import { scheduleDailyReminder } from "@/lib/notifications";

export default function EditPreferencesScreen() {
  const router = useRouter();
  const { session, userProfile, refreshProfile } = useAuth();

  // Local editing state, initialized from profile
  const [goals, setGoals] = useState<string[]>([]);
  const [level, setLevel] = useState<string | null>(null);
  const [subjects, setSubjects] = useState<string[]>([]);
  const [skills, setSkills] = useState<string[]>([]);
  const [duration, setDuration] = useState<number | null>(null);
  const [reminderTime, setReminderTime] = useState("09:00");
  const [timezone, setTimezone] = useState("UTC");

  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showTimePicker, setShowTimePicker] = useState(Platform.OS === "ios");

  // Hydrate from profile
  useEffect(() => {
    if (!userProfile) return;
    setGoals(userProfile.user_goal?.split(",").filter(Boolean) ?? []);
    setLevel(userProfile.difficulty_level ?? null);
    setSubjects(userProfile.subject_preferences ?? []);
    setSkills(userProfile.skill_focus_preferences ?? []);
    setDuration(userProfile.session_duration_minutes ?? null);
    setReminderTime(userProfile.reminder_time_local ?? "09:00");
    setTimezone(userProfile.timezone ?? "UTC");
  }, [userProfile]);

  function toggleGoal(value: string) {
    setGoals((prev) =>
      prev.includes(value) ? prev.filter((g) => g !== value) : [...prev, value]
    );
  }

  function toggleSubject(value: string) {
    setSubjects((prev) =>
      prev.includes(value) ? prev.filter((s) => s !== value) : [...prev, value]
    );
  }

  function toggleSkill(value: string) {
    setSkills((prev) =>
      prev.includes(value) ? prev.filter((s) => s !== value) : [...prev, value]
    );
  }

  const canSave =
    goals.length > 0 &&
    level !== null &&
    subjects.length > 0 &&
    skills.length > 0 &&
    duration !== null;

  async function handleSave() {
    if (!session || !canSave) return;
    setIsSaving(true);
    setError(null);

    const { error: updateError } = await supabase
      .from("users")
      .update({
        user_goal: goals.join(","),
        difficulty_level: level,
        subject_preferences: subjects,
        skill_focus_preferences: skills,
        session_duration_minutes: duration,
        reminder_time_local: reminderTime,
        timezone,
      })
      .eq("id", session.user.id);

    if (updateError) {
      setError("Something went wrong. Please try again.");
      setIsSaving(false);
      return;
    }

    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    await scheduleDailyReminder(reminderTime);
    await refreshProfile();
    router.back();
  }

  // Time picker helpers
  const timeAsDate = (() => {
    try {
      return parse(reminderTime, "HH:mm", new Date());
    } catch {
      return new Date();
    }
  })();

  const formattedTime = (() => {
    try {
      return format(timeAsDate, "h:mm a");
    } catch {
      return reminderTime;
    }
  })();

  function onTimeChange(_event: unknown, selectedDate?: Date) {
    if (Platform.OS === "android") setShowTimePicker(false);
    if (selectedDate) {
      const h = String(selectedDate.getHours()).padStart(2, "0");
      const m = String(selectedDate.getMinutes()).padStart(2, "0");
      setReminderTime(`${h}:${m}`);
    }
  }

  // Lazy-load DateTimePicker to avoid web bundle crash
  let DateTimePicker: React.ComponentType<any> | null = null;
  if (Platform.OS !== "web") {
    DateTimePicker =
      require("@react-native-community/datetimepicker").default;
  }

  return (
    <Screen>
      <View style={styles.header}>
        <Pressable onPress={() => router.back()} hitSlop={12}>
          <Ionicons name="arrow-back" size={24} color={colors.dark[900]} />
        </Pressable>
        <RSText variant="h3">Edit Preferences</RSText>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        {/* Goals */}
        <View style={styles.section}>
          <RSText variant="label" color={colors.dark[500]}>
            GOALS
          </RSText>
          <View style={styles.chipGrid}>
            {GOAL_OPTIONS.map((opt) => (
              <SelectionChip
                key={opt.value}
                label={`${opt.emoji} ${opt.label}`}
                selected={goals.includes(opt.value)}
                onPress={() => toggleGoal(opt.value)}
              />
            ))}
          </View>
        </View>

        {/* Level */}
        <View style={styles.section}>
          <RSText variant="label" color={colors.dark[500]}>
            LEVEL
          </RSText>
          <View style={styles.chipGrid}>
            {LEVEL_OPTIONS.map((opt) => (
              <SelectionChip
                key={opt.value}
                label={`${opt.emoji} ${opt.label}`}
                selected={level === opt.value}
                onPress={() => setLevel(opt.value)}
              />
            ))}
          </View>
        </View>

        {/* Subjects */}
        <View style={styles.section}>
          <RSText variant="label" color={colors.dark[500]}>
            SUBJECTS
          </RSText>
          <View style={styles.chipGrid}>
            {SUBJECT_OPTIONS.map((opt) => (
              <SelectionChip
                key={opt.value}
                label={`${opt.emoji} ${opt.label}`}
                selected={subjects.includes(opt.value)}
                onPress={() => toggleSubject(opt.value)}
              />
            ))}
          </View>
        </View>

        {/* Skills */}
        <View style={styles.section}>
          <RSText variant="label" color={colors.dark[500]}>
            SKILLS
          </RSText>
          <View style={styles.chipGrid}>
            {SKILL_OPTIONS.map((opt) => (
              <SelectionChip
                key={opt.value}
                label={`${opt.emoji} ${opt.label}`}
                selected={skills.includes(opt.value)}
                onPress={() => toggleSkill(opt.value)}
              />
            ))}
          </View>
        </View>

        {/* Duration */}
        <View style={styles.section}>
          <RSText variant="label" color={colors.dark[500]}>
            SESSION DURATION
          </RSText>
          <View style={styles.chipGrid}>
            {DURATION_OPTIONS.map((opt) => (
              <SelectionChip
                key={opt.value}
                label={`${opt.emoji} ${opt.label}`}
                selected={duration === opt.value}
                onPress={() => setDuration(opt.value)}
              />
            ))}
          </View>
        </View>

        {/* Reminder */}
        <View style={styles.section}>
          <RSText variant="label" color={colors.dark[500]}>
            DAILY REMINDER
          </RSText>

          {Platform.OS === "web" ? (
            <input
              type="time"
              value={reminderTime}
              step={900}
              onChange={(e) => setReminderTime(e.target.value)}
              style={{
                fontFamily: "Plus Jakarta Sans, sans-serif",
                fontSize: 16,
                padding: 12,
                borderRadius: 12,
                border: `2px solid ${colors.dark[100]}`,
                backgroundColor: colors.surface,
                marginTop: 8,
              }}
            />
          ) : Platform.OS === "android" ? (
            <>
              <Pressable
                style={styles.timeButton}
                onPress={() => setShowTimePicker(true)}
              >
                <RSText variant="bodyLarge">{formattedTime}</RSText>
                <RSText variant="caption" color={colors.dark[500]}>
                  Tap to change
                </RSText>
              </Pressable>
              {showTimePicker && DateTimePicker && (
                <DateTimePicker
                  value={timeAsDate}
                  mode="time"
                  display="default"
                  minuteInterval={15}
                  onChange={onTimeChange}
                />
              )}
            </>
          ) : DateTimePicker ? (
            <DateTimePicker
              value={timeAsDate}
              mode="time"
              display="spinner"
              minuteInterval={15}
              onChange={onTimeChange}
              style={styles.iosPicker}
            />
          ) : null}
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
          label={isSaving ? "Saving\u2026" : "Save Changes"}
          variant="cta"
          size="lg"
          style={styles.button}
          disabled={isSaving || !canSave}
          onPress={handleSave}
        />
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.md,
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: spacing.xl,
    paddingBottom: spacing.base,
  },
  section: {
    marginBottom: spacing.xl,
  },
  chipGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: spacing.sm,
    marginTop: spacing.sm,
  },
  timeButton: {
    backgroundColor: colors.surface,
    borderWidth: 2,
    borderColor: colors.dark[100],
    borderRadius: radius.md,
    paddingHorizontal: spacing.base,
    paddingVertical: spacing.md,
    marginTop: spacing.sm,
    gap: 2,
  },
  iosPicker: {
    height: 150,
    marginTop: spacing.sm,
  },
  footer: {
    paddingHorizontal: spacing.xl,
    paddingTop: spacing.base,
    paddingBottom: spacing.xl,
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
