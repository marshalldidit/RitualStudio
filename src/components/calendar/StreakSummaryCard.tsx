import React from "react";
import { View, StyleSheet } from "react-native";
import { RSText } from "@/components/ui/RSText";
import { Card } from "@/components/ui/Card";
import { colors } from "@/theme/colors";
import { spacing } from "@/theme/spacing";
import { fontFamily, fontWeight } from "@/theme/typography";

interface StreakSummaryCardProps {
  currentStreak: number;
  longestStreak: number;
  totalCompleted: number;
}

function StatItem({ value, label }: { value: number; label: string }) {
  return (
    <View style={styles.statItem}>
      <RSText style={styles.statValue}>{value}</RSText>
      <RSText variant="caption" color={colors.dark[500]}>
        {label}
      </RSText>
    </View>
  );
}

export function StreakSummaryCard({
  currentStreak,
  longestStreak,
  totalCompleted,
}: StreakSummaryCardProps) {
  return (
    <Card>
      <View style={styles.row}>
        <StatItem value={currentStreak} label="Current" />
        <View style={styles.divider} />
        <StatItem value={longestStreak} label="Longest" />
        <View style={styles.divider} />
        <StatItem value={totalCompleted} label="Total Days" />
      </View>
    </Card>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-around",
  },
  statItem: {
    alignItems: "center",
    gap: spacing.xs,
  },
  statValue: {
    fontFamily: fontFamily.extraBold,
    fontWeight: fontWeight.extraBold,
    fontSize: 28,
    lineHeight: 34,
    color: colors.dark[900],
  },
  divider: {
    width: 1,
    height: 32,
    backgroundColor: colors.dark[100],
  },
});
