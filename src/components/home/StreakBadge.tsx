import React from "react";
import { View, StyleSheet } from "react-native";
import { RSText } from "@/components/ui/RSText";
import { colors } from "@/theme/colors";
import { spacing } from "@/theme/spacing";
import { radius } from "@/theme/radius";
import { fontFamily } from "@/theme/typography";

interface StreakBadgeProps {
  count: number;
}

export function StreakBadge({ count }: StreakBadgeProps) {
  return (
    <View style={styles.container}>
      <RSText style={styles.emoji}>{"\u{1F525}"}</RSText>
      <RSText variant="bodyLarge" style={styles.count}>
        {count}
      </RSText>
      <RSText variant="caption" color={colors.dark[500]}>
        day streak
      </RSText>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sm,
    backgroundColor: colors.brand[100],
    borderColor: colors.brand[400],
    borderWidth: 2,
    borderRadius: radius.full,
    paddingHorizontal: spacing.base,
    paddingVertical: spacing.sm,
  },
  emoji: {
    fontSize: 16,
  },
  count: {
    fontFamily: fontFamily.extraBold,
    fontWeight: "800",
  },
});
