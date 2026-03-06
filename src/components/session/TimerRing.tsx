import React from "react";
import { View, StyleSheet } from "react-native";
import { RSText } from "@/components/ui/RSText";
import { ProgressRing } from "@/components/ui/ProgressRing";
import { colors } from "@/theme/colors";
import { spacing } from "@/theme/spacing";
import { fontFamily, fontWeight } from "@/theme/typography";
import type { SessionState } from "@/stores/sessionStore";

interface TimerRingProps {
  /** Minutes-only display string (e.g. "24", "< 1", "0"). */
  displayText: string;
  /** Overtime text (+M:SS). Empty if not in overtime. */
  overtimeText: string;
  /** Step-based progress 0→1 (snaps to whole minutes). */
  ringProgress: number;
  /** Current session state. */
  sessionState: SessionState;
}

export function TimerRing({
  displayText,
  overtimeText,
  ringProgress,
  sessionState,
}: TimerRingProps) {
  const isCompleted =
    sessionState === "completed_active" || sessionState === "ended";
  const isPaused = sessionState === "paused";

  return (
    <ProgressRing
      progress={ringProgress}
      size={260}
      strokeWidth={6}
      trackColor={colors.dark[700]}
      progressColor={isCompleted ? colors.success : colors.brand[400]}
    >
      <View style={styles.inner}>
        {isCompleted ? (
          <>
            <RSText style={styles.checkmark} color={colors.success}>
              {"\u2713"}
            </RSText>
            <RSText variant="h3" color={colors.success} style={styles.completeLabel}>
              Ritual Complete
            </RSText>
            {overtimeText !== "" && (
              <RSText style={styles.overtimeText} color={colors.dark[400]}>
                {overtimeText}
              </RSText>
            )}
          </>
        ) : (
          <>
            <RSText style={styles.minuteDisplay} color={colors.white}>
              {displayText}
            </RSText>
            <RSText variant="caption" color={colors.dark[400]}>
              min
            </RSText>
            {isPaused && (
              <RSText
                variant="label"
                color={colors.brand[400]}
                style={styles.pausedLabel}
              >
                PAUSED
              </RSText>
            )}
          </>
        )}
      </View>
    </ProgressRing>
  );
}

const styles = StyleSheet.create({
  inner: {
    alignItems: "center",
    justifyContent: "center",
  },
  minuteDisplay: {
    fontFamily: fontFamily.extraBold,
    fontWeight: fontWeight.extraBold,
    fontSize: 64,
    lineHeight: 72,
  },
  checkmark: {
    fontFamily: fontFamily.extraBold,
    fontSize: 48,
    lineHeight: 56,
  },
  completeLabel: {
    textAlign: "center",
    marginTop: spacing.xs,
  },
  overtimeText: {
    fontFamily: fontFamily.semiBold,
    fontSize: 20,
    lineHeight: 28,
    marginTop: spacing.xs,
  },
  pausedLabel: {
    marginTop: spacing.sm,
  },
});
