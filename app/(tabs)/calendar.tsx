import { View, StyleSheet, ActivityIndicator } from "react-native";
import { Screen } from "@/components/ui/Screen";
import { RSText } from "@/components/ui/RSText";
import { MonthNavigator } from "@/components/calendar/MonthNavigator";
import { MonthCalendar } from "@/components/calendar/MonthCalendar";
import { StreakSummaryCard } from "@/components/calendar/StreakSummaryCard";
import { StreakBadge } from "@/components/home/StreakBadge";
import { useStreakCalendar } from "@/hooks/useStreakCalendar";
import { colors } from "@/theme/colors";
import { spacing } from "@/theme/spacing";

export default function CalendarScreen() {
  const {
    days,
    monthLabel,
    canGoNext,
    currentStreak,
    longestStreak,
    totalCompleted,
    isLoading,
    goToPrev,
    goToNext,
  } = useStreakCalendar();

  return (
    <Screen>
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <RSText variant="h2">Your Streak</RSText>
          {currentStreak > 0 && <StreakBadge count={currentStreak} />}
        </View>

        {/* Stats */}
        <StreakSummaryCard
          currentStreak={currentStreak}
          longestStreak={longestStreak}
          totalCompleted={totalCompleted}
        />

        {/* Month navigator */}
        <MonthNavigator
          label={monthLabel}
          canGoNext={canGoNext}
          onPrev={goToPrev}
          onNext={goToNext}
        />

        {/* Calendar grid */}
        {isLoading ? (
          <View style={styles.loading}>
            <ActivityIndicator size="large" color={colors.brand[400]} />
          </View>
        ) : (
          <MonthCalendar days={days} />
        )}

        {/* Legend */}
        <View style={styles.legend}>
          <LegendItem color={colors.brand[100]} border={colors.brand[400]} label="Completed" />
          <LegendItem color={colors.missed.bg} border={colors.missed.border} label="Missed" />
          <LegendItem color={colors.dark[900]} border={colors.dark[900]} label="Today" />
        </View>
      </View>
    </Screen>
  );
}

function LegendItem({
  color,
  border,
  label,
}: {
  color: string;
  border: string;
  label: string;
}) {
  return (
    <View style={styles.legendItem}>
      <View
        style={[
          styles.legendDot,
          { backgroundColor: color, borderColor: border },
        ]}
      />
      <RSText variant="caption" color={colors.dark[500]}>
        {label}
      </RSText>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: spacing.xl,
    paddingTop: spacing["2xl"],
    gap: spacing.xl,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  loading: {
    height: 240,
    alignItems: "center",
    justifyContent: "center",
  },
  legend: {
    flexDirection: "row",
    justifyContent: "center",
    gap: spacing.lg,
  },
  legendItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.xs,
  },
  legendDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    borderWidth: 2,
  },
});
