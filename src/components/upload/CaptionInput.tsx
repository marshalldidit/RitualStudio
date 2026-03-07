import React from "react";
import { View, TextInput, StyleSheet, Platform } from "react-native";
import { RSText } from "@/components/ui/RSText";
import { colors } from "@/theme/colors";
import { fontFamily } from "@/theme/typography";
import { spacing } from "@/theme/spacing";
import { radius } from "@/theme/radius";

interface CaptionInputProps {
  value: string;
  onChangeText: (text: string) => void;
  maxLength?: number;
}

export function CaptionInput({
  value,
  onChangeText,
  maxLength = 200,
}: CaptionInputProps) {
  return (
    <View style={styles.wrapper}>
      <RSText variant="label" color={colors.dark[500]} style={styles.label}>
        Caption (optional)
      </RSText>
      <TextInput
        style={styles.input}
        value={value}
        onChangeText={onChangeText}
        placeholder="Add a note about today's drawing..."
        placeholderTextColor={colors.dark[300]}
        maxLength={maxLength}
        multiline
        numberOfLines={3}
        textAlignVertical="top"
      />
      <RSText variant="caption" color={colors.dark[300]} style={styles.counter}>
        {value.length}/{maxLength}
      </RSText>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    gap: spacing.xs,
  },
  label: {
    marginBottom: 2,
  },
  input: {
    fontFamily: fontFamily.regular,
    fontSize: 14,
    lineHeight: 20,
    color: colors.dark[900],
    backgroundColor: colors.white,
    borderWidth: 2,
    borderColor: colors.dark[100],
    borderRadius: radius.md,
    paddingHorizontal: spacing.base,
    paddingTop: Platform.OS === "ios" ? spacing.md : spacing.sm,
    paddingBottom: Platform.OS === "ios" ? spacing.md : spacing.sm,
    minHeight: 80,
  },
  counter: {
    textAlign: "right",
  },
});
