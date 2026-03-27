import React from "react";
import { View, StyleSheet } from "react-native";
import { RSText } from "@/components/ui/RSText";
import { CalendarDayCell, DayState } from "./CalendarDayCell";
import { colors } from "@/theme/colors";
import { spacing } from "@/theme/spacing";
import { fontFamily, fontWeight } from "@/theme/typography";

const WEEKDAY_LABELS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

export interface DayData {
  date: number;
  state: DayState;
}

interface MonthCalendarProps {
  /** Grid of days: includes leading/trailing empties for alignment */
  days: DayData[];
}

export function MonthCalendar({ days }: MonthCalendarProps) {
  // Split days into rows of 7
  const rows: DayData[][] = [];
  for (let i = 0; i < days.length; i += 7) {
    rows.push(days.slice(i, i + 7));
  }

  return (
    <View style={styles.container}>
      {/* Weekday header */}
      <View style={styles.row}>
        {WEEKDAY_LABELS.map((label) => (
          <View key={label} style={styles.headerCell}>
            <RSText style={styles.headerText}>{label}</RSText>
          </View>
        ))}
      </View>

      {/* Day rows */}
      {rows.map((row, rowIndex) => (
        <View key={rowIndex} style={styles.row}>
          {row.map((day, colIndex) => (
            <CalendarDayCell
              key={`${rowIndex}-${colIndex}`}
              date={day.date}
              state={day.state}
            />
          ))}
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: spacing.sm,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
  },
  headerCell: {
    width: 40,
    alignItems: "center",
  },
  headerText: {
    fontFamily: fontFamily.medium,
    fontWeight: fontWeight.medium,
    fontSize: 11,
    lineHeight: 14,
    color: colors.dark[400],
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
});
