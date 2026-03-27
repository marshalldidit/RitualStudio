import { ScrollView, StyleSheet } from "react-native";
import { useRouter } from "expo-router";
import { Screen } from "@/components/ui/Screen";
import { ProfileHeader } from "@/components/profile/ProfileHeader";
import {
  SettingsSection,
  SettingsRow,
} from "@/components/profile/SettingsRow";
import { useAuth } from "@/providers/AuthProvider";
import { spacing } from "@/theme";
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

function formatTime(time: string | null): string {
  if (!time) return "\u2014";
  try {
    const date = parse(time, "HH:mm", new Date());
    return format(date, "h:mm a");
  } catch {
    return time;
  }
}

export default function ProfileScreen() {
  const router = useRouter();
  const { session, userProfile } = useAuth();

  const email = session?.user?.email ?? "";
  const createdAt = session?.user?.created_at ?? "";

  const goals = userProfile?.user_goal?.split(",").filter(Boolean) ?? [];

  return (
    <Screen>
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <ProfileHeader email={email} createdAt={createdAt} />

        <SettingsSection title="Preferences">
          <SettingsRow
            emoji="🎯"
            label="Goals"
            value={getLabels(GOAL_OPTIONS, goals)}
            onPress={() => router.push("/settings/edit-preferences")}
          />
          <SettingsRow
            emoji="📊"
            label="Level"
            value={getLabel(LEVEL_OPTIONS, userProfile?.difficulty_level ?? null)}
            onPress={() => router.push("/settings/edit-preferences")}
          />
          <SettingsRow
            emoji="🎨"
            label="Subjects"
            value={getLabels(
              SUBJECT_OPTIONS,
              userProfile?.subject_preferences ?? []
            )}
            onPress={() => router.push("/settings/edit-preferences")}
          />
          <SettingsRow
            emoji="✏️"
            label="Skills"
            value={getLabels(
              SKILL_OPTIONS,
              userProfile?.skill_focus_preferences ?? []
            )}
            onPress={() => router.push("/settings/edit-preferences")}
          />
          <SettingsRow
            emoji="⏱️"
            label="Session"
            value={getLabel(
              DURATION_OPTIONS,
              userProfile?.session_duration_minutes ?? null
            )}
            onPress={() => router.push("/settings/edit-preferences")}
          />
          <SettingsRow
            emoji="⏰"
            label="Reminder"
            value={formatTime(userProfile?.reminder_time_local ?? null)}
            onPress={() => router.push("/settings/edit-preferences")}
          />
        </SettingsSection>

        <SettingsSection title="Account">
          <SettingsRow
            emoji="🔑"
            label="Account & Security"
            onPress={() => router.push("/settings/account")}
          />
        </SettingsSection>
      </ScrollView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  scroll: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: spacing.xl,
    paddingBottom: spacing["3xl"],
  },
});
