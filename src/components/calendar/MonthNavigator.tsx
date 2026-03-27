import React from "react";
import { View, Pressable, StyleSheet } from "react-native";
import { RSText } from "@/components/ui/RSText";
import { colors } from "@/theme/colors";
import { spacing } from "@/theme/spacing";
import { fontFamily, fontWeight } from "@/theme/typography";

interface MonthNavigatorProps {
  /** Month label, e.g. "March 2026" */
  label: string;
  canGoNext: boolean;
  onPrev: () => void;
  onNext: () => void;
}

export function MonthNavigator({
  label,
  canGoNext,
  onPrev,
  onNext,
}: MonthNavigatorProps) {
  return (
    <View style={styles.container}>
      <Pressable onPress={onPrev} hitSlop={12} style={styles.arrow}>
        <RSText style={styles.arrowText}>{"\u2039"}</RSText>
      </Pressable>

      <RSText style={styles.label}>{label}</RSText>

      <Pressable
        onPress={onNext}
        hitSlop={12}
        style={[styles.arrow, !canGoNext && styles.disabled]}
        disabled={!canGoNext}
      >
        <RSText
          style={[styles.arrowText, !canGoNext && styles.disabledText]}
        >
          {"\u203A"}
        </RSText>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: spacing.xs,
  },
  arrow: {
    width: 36,
    height: 36,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 18,
    backgroundColor: colors.dark[50],
  },
  arrowText: {
    fontSize: 22,
    lineHeight: 26,
    color: colors.dark[900],
    fontFamily: fontFamily.bold,
    fontWeight: fontWeight.bold,
  },
  disabled: {
    opacity: 0.3,
  },
  disabledText: {
    color: colors.dark[300],
  },
  label: {
    fontFamily: fontFamily.bold,
    fontWeight: fontWeight.bold,
    fontSize: 18,
    lineHeight: 24,
    color: colors.dark[900],
  },
});
