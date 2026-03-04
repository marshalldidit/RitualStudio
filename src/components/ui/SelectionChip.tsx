import React from "react";
import { Pressable, Text, StyleSheet } from "react-native";
import { colors } from "@/theme/colors";
import { radius } from "@/theme/radius";
import { spacing } from "@/theme/spacing";
import { fontFamily } from "@/theme/typography";

interface SelectionChipProps {
  label: string;
  emoji?: string;
  selected: boolean;
  onPress: () => void;
}

export function SelectionChip({
  label,
  emoji,
  selected,
  onPress,
}: SelectionChipProps) {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.base,
        selected ? styles.selected : styles.unselected,
        pressed && styles.pressed,
      ]}
    >
      {emoji != null && <Text style={styles.emoji}>{emoji}</Text>}
      <Text
        style={[
          styles.label,
          selected ? styles.labelSelected : styles.labelUnselected,
        ]}
      >
        {label}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: radius.full,
    borderWidth: 2,
    paddingHorizontal: spacing.base,
    paddingVertical: spacing.md,
  },
  selected: {
    backgroundColor: colors.brand[400],
    borderColor: colors.brand[400],
  },
  unselected: {
    backgroundColor: colors.surface,
    borderColor: colors.dark[100],
  },
  pressed: {
    opacity: 0.85,
  },
  emoji: {
    fontSize: 16,
    marginRight: spacing.sm,
  },
  label: {
    fontSize: 14,
    color: colors.dark[900],
  },
  labelSelected: {
    fontFamily: fontFamily.bold,
    fontWeight: "700",
  },
  labelUnselected: {
    fontFamily: fontFamily.medium,
    fontWeight: "500",
  },
});
