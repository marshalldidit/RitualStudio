import React, { useEffect } from "react";
import { View, StyleSheet } from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withDelay,
  withSpring,
  withTiming,
  Easing,
} from "react-native-reanimated";
import { RSText } from "@/components/ui/RSText";
import { colors } from "@/theme/colors";
import { spacing } from "@/theme/spacing";
import { radius } from "@/theme/radius";
import { fontFamily } from "@/theme/typography";
import { CompletionResult } from "@/lib/streakManager";

interface StreakUpdateProps {
  result: CompletionResult;
}

export function StreakUpdate({ result }: StreakUpdateProps) {
  const scale = useSharedValue(0.6);
  const opacity = useSharedValue(0);

  useEffect(() => {
    opacity.value = withDelay(400, withTiming(1, { duration: 500 }));
    scale.value = withDelay(
      400,
      withSpring(1, { damping: 12, stiffness: 120 })
    );
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{ scale: scale.value }],
  }));

  const milestoneMessage = getMilestoneMessage(result);

  return (
    <Animated.View style={[styles.container, animatedStyle]}>
      <View style={styles.badge}>
        <RSText style={styles.fireEmoji}>{"\u{1F525}"}</RSText>
        <RSText style={styles.streakCount}>{result.newStreak}</RSText>
      </View>

      <RSText variant="h4" style={styles.label}>
        day streak
      </RSText>

      {result.graceUsed && (
        <RSText variant="caption" color={colors.dark[500]} style={styles.graceNote}>
          Grace day used — keep it going!
        </RSText>
      )}

      {result.isNewRecord && (
        <View style={styles.recordBadge}>
          <RSText variant="label" color={colors.brand[800]}>
            NEW RECORD
          </RSText>
        </View>
      )}

      {milestoneMessage && !result.isNewRecord && (
        <RSText variant="body" color={colors.dark[500]} style={styles.milestone}>
          {milestoneMessage}
        </RSText>
      )}
    </Animated.View>
  );
}

function getMilestoneMessage(result: CompletionResult): string | null {
  const s = result.newStreak;
  if (s === 7) return "One full week!";
  if (s === 14) return "Two weeks strong!";
  if (s === 21) return "Three weeks — habit forming!";
  if (s === 30) return "One month! Incredible.";
  if (s === 50) return "50 days of dedication!";
  if (s === 100) return "100 days. Legendary.";
  if (s > 0 && s % 10 === 0) return `${s} days and counting!`;
  return null;
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
  },
  badge: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sm,
    backgroundColor: colors.brand[100],
    borderColor: colors.brand[400],
    borderWidth: 2,
    borderRadius: radius.full,
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.md,
  },
  fireEmoji: {
    fontSize: 28,
  },
  streakCount: {
    fontSize: 32,
    fontFamily: fontFamily.extraBold,
    fontWeight: "800",
    color: colors.dark[900],
  },
  label: {
    marginTop: spacing.sm,
  },
  graceNote: {
    marginTop: spacing.xs,
  },
  recordBadge: {
    marginTop: spacing.md,
    backgroundColor: colors.brand[200],
    borderRadius: radius.full,
    paddingHorizontal: spacing.base,
    paddingVertical: spacing.xs,
  },
  milestone: {
    marginTop: spacing.sm,
  },
});
