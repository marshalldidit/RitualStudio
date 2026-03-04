import { useState, useEffect } from "react";
import { View, Pressable, Text, Platform, StyleSheet } from "react-native";
import { useRouter } from "expo-router";
import { format, parse } from "date-fns";
import { RSText } from "@/components/ui/RSText";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { colors, spacing } from "@/theme";
import { fontFamily } from "@/theme/typography";
import { useOnboardingStore } from "@/stores/onboardingStore";

function timeStringToDate(timeStr: string): Date {
  return parse(timeStr, "HH:mm", new Date());
}

function NativeTimePicker({
  value,
  onChange,
}: {
  value: Date;
  onChange: (date: Date) => void;
}) {
  // Lazy require to avoid web bundle crash
  const DateTimePicker =
    require("@react-native-community/datetimepicker").default;
  const [showAndroid, setShowAndroid] = useState(false);

  if (Platform.OS === "ios") {
    return (
      <View style={styles.pickerContainer}>
        <DateTimePicker
          value={value}
          mode="time"
          display="spinner"
          onChange={(_e: unknown, date?: Date) => {
            if (date) onChange(date);
          }}
          minuteInterval={15}
        />
      </View>
    );
  }

  // Android: modal
  return (
    <>
      <Pressable onPress={() => setShowAndroid(true)}>
        <RSText variant="body" color={colors.brand[400]} style={styles.changeLink}>
          Change time
        </RSText>
      </Pressable>
      {showAndroid && (
        <DateTimePicker
          value={value}
          mode="time"
          display="default"
          onChange={(_e: unknown, date?: Date) => {
            setShowAndroid(false);
            if (date) onChange(date);
          }}
          minuteInterval={15}
        />
      )}
    </>
  );
}

function WebTimePicker({
  value,
  onChange,
}: {
  value: string;
  onChange: (time: string) => void;
}) {
  return (
    <View style={styles.pickerContainer}>
      <input
        type="time"
        value={value}
        step={900}
        onChange={(e) => onChange(e.target.value)}
        style={{
          fontSize: 18,
          fontFamily: "Plus Jakarta Sans, sans-serif",
          padding: "12px 16px",
          borderRadius: 12,
          border: `2px solid #EEEEEA`,
          backgroundColor: "#FFFFFF",
          color: "#1A1A1A",
          outline: "none",
          width: "100%",
        }}
      />
    </View>
  );
}

export default function ReminderScreen() {
  const router = useRouter();
  const reminderTimeLocal = useOnboardingStore((s) => s.reminderTimeLocal);
  const timezone = useOnboardingStore((s) => s.timezone);
  const setReminderTime = useOnboardingStore((s) => s.setReminderTime);
  const setTimezone = useOnboardingStore((s) => s.setTimezone);

  useEffect(() => {
    try {
      const tz = Intl.DateTimeFormat().resolvedOptions().timeZone;
      setTimezone(tz);
    } catch {
      setTimezone("UTC");
    }
  }, [setTimezone]);

  const dateValue = timeStringToDate(reminderTimeLocal);
  const displayTime = format(dateValue, "h:mm a");

  function handleNativeTimeChange(date: Date) {
    setReminderTime(format(date, "HH:mm"));
  }

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <View style={styles.header}>
          <RSText variant="h2">When should your studio open each day?</RSText>
          <RSText variant="body" color={colors.dark[500]} style={styles.subtitle}>
            We'll send you a gentle reminder.
          </RSText>
        </View>

        <Card>
          <View style={styles.timeRow}>
            <Text style={styles.emoji}>{"\u23F0"}</Text>
            <View style={styles.timeText}>
              <RSText variant="h3">{displayTime}</RSText>
              <RSText variant="caption" color={colors.dark[500]}>
                {timezone}
              </RSText>
            </View>
          </View>
        </Card>

        {Platform.OS === "web" ? (
          <WebTimePicker
            value={reminderTimeLocal}
            onChange={setReminderTime}
          />
        ) : (
          <NativeTimePicker
            value={dateValue}
            onChange={handleNativeTimeChange}
          />
        )}
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
          onPress={() => router.push("/(onboarding)/complete")}
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
  content: {
    flex: 1,
    paddingTop: spacing.lg,
  },
  header: {
    marginBottom: spacing["2xl"],
  },
  subtitle: {
    marginTop: spacing.sm,
  },
  timeRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.md,
  },
  emoji: {
    fontSize: 24,
  },
  timeText: {
    gap: 2,
  },
  pickerContainer: {
    marginTop: spacing.xl,
  },
  changeLink: {
    marginTop: spacing.md,
    fontFamily: fontFamily.semiBold,
  },
  footer: {
    paddingTop: spacing.base,
    gap: spacing.md,
  },
  button: {
    width: "100%",
  },
});
