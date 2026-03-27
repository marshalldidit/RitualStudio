import React from "react";
import { View, StyleSheet, Pressable } from "react-native";
import { RSText } from "@/components/ui/RSText";
import { colors } from "@/theme/colors";
import { fontFamily, fontWeight } from "@/theme/typography";

export type DayState =
  | "default"
  | "today"
  | "completed"
  | "missed"
  | "rest"
  | "empty"; // empty = filler cell for grid alignment

interface CalendarDayCellProps {
  date: number;
  state: DayState;
  onPress?: () => void;
}

const stateStyles: Record<
  Exclude<DayState, "empty">,
  { bg: string; border: string; textColor: string }
> = {
  default: {
    bg: colors.dark[50],
    border: colors.transparent,
    textColor: colors.dark[900],
  },
  today: {
    bg: colors.dark[900],
    border: colors.dark[900],
    textColor: colors.white,
  },
  completed: {
    bg: colors.brand[100],
    border: colors.brand[400],
    textColor: colors.dark[900],
  },
  missed: {
    bg: colors.missed.bg,
    border: colors.missed.border,
    textColor: colors.error,
  },
  rest: {
    bg: colors.dark[50],
    border: colors.transparent,
    textColor: colors.dark[300],
  },
};

export function CalendarDayCell({ date, state, onPress }: CalendarDayCellProps) {
  if (state === "empty") {
    return <View style={styles.cell} />;
  }

  const s = stateStyles[state];

  return (
    <Pressable
      onPress={onPress}
      style={[
        styles.cell,
        styles.filled,
        { backgroundColor: s.bg, borderColor: s.border },
      ]}
    >
      <RSText
        style={[
          styles.dateText,
          { color: s.textColor },
          state === "completed" && styles.completedText,
        ]}
      >
        {date}
      </RSText>
      {state === "completed" && (
        <RSText style={styles.checkmark}>{"\u2713"}</RSText>
      )}
    </Pressable>
  );
}

const CELL_SIZE = 40;

const styles = StyleSheet.create({
  cell: {
    width: CELL_SIZE,
    height: CELL_SIZE,
    alignItems: "center",
    justifyContent: "center",
  },
  filled: {
    borderRadius: 12,
    borderWidth: 2,
  },
  dateText: {
    fontFamily: fontFamily.bold,
    fontWeight: fontWeight.bold,
    fontSize: 15,
    lineHeight: 20,
  },
  completedText: {
    fontSize: 13,
    lineHeight: 16,
  },
  checkmark: {
    fontSize: 8,
    lineHeight: 10,
    color: colors.brand[500],
    fontFamily: fontFamily.bold,
    fontWeight: fontWeight.bold,
  },
});
