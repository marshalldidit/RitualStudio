import React from "react";
import { View, StyleSheet, Dimensions } from "react-native";
import { RSText } from "@/components/ui/RSText";
import { colors } from "@/theme/colors";
import { spacing } from "@/theme/spacing";
import { radius } from "@/theme/radius";
import { lifted, brandGlow } from "@/theme/shadows";
import { fontFamily } from "@/theme/typography";
import { DailyPromptWithRole, PromptRole } from "@/types/database";

const SCREEN_WIDTH = Dimensions.get("window").width;
export const CARD_WIDTH = SCREEN_WIDTH - spacing.xl * 2;

interface PromptCardProps {
  prompt: DailyPromptWithRole;
  isActive: boolean;
}

const ROLE_STYLES: Record<PromptRole, { bg: string; text: string; label: string }> = {
  comfort: { bg: colors.brand[50], text: colors.dark[700], label: "Comfort" },
  growth: { bg: "#E8F5E9", text: "#2E7D32", label: "Growth" },
  wildcard: { bg: "#FFF3E0", text: "#E65100", label: "Wildcard" },
};

function formatTag(tag: string): string {
  return tag
    .replace(/_/g, " & ")
    .replace(/\b\w/g, (c) => c.toUpperCase());
}

export function PromptCard({ prompt, isActive }: PromptCardProps) {
  const role = ROLE_STYLES[prompt.role];

  return (
    <View style={[styles.card, isActive ? styles.cardActive : styles.cardDefault]}>
      <View style={[styles.roleBadge, { backgroundColor: role.bg }]}>
        <RSText variant="caption" color={role.text} style={styles.roleText}>
          {role.label}
        </RSText>
      </View>

      <RSText variant="h3" style={styles.title}>
        {prompt.title}
      </RSText>

      <RSText
        variant="body"
        color={colors.dark[500]}
        numberOfLines={3}
        style={styles.description}
      >
        {prompt.description}
      </RSText>

      <View style={styles.metaRow}>
        <View style={styles.metaChip}>
          <RSText variant="caption" color={colors.dark[500]}>
            {prompt.time_required_minutes} min
          </RSText>
        </View>
        <View style={styles.metaChip}>
          <RSText variant="caption" color={colors.dark[500]}>
            {prompt.difficulty_level}
          </RSText>
        </View>
      </View>

      {prompt.subject_tags.length > 0 && (
        <View style={styles.tagRow}>
          {prompt.subject_tags.slice(0, 3).map((tag) => (
            <View key={tag} style={styles.tag}>
              <RSText variant="caption" color={colors.dark[700]}>
                {formatTag(tag)}
              </RSText>
            </View>
          ))}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    width: CARD_WIDTH,
    borderRadius: radius.xl,
    padding: spacing.xl,
    borderWidth: 1,
  },
  cardDefault: {
    backgroundColor: colors.surface,
    borderColor: colors.dark[100],
    ...lifted,
  },
  cardActive: {
    backgroundColor: colors.brand[100],
    borderColor: colors.brand[400],
    ...brandGlow,
  },
  roleBadge: {
    alignSelf: "flex-start",
    borderRadius: radius.full,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
  },
  roleText: {
    fontFamily: fontFamily.semiBold,
    textTransform: "capitalize",
  },
  title: {
    marginTop: spacing.base,
  },
  description: {
    marginTop: spacing.sm,
  },
  metaRow: {
    flexDirection: "row",
    gap: spacing.sm,
    marginTop: spacing.base,
  },
  metaChip: {
    backgroundColor: colors.dark[50],
    borderRadius: radius.sm,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
  },
  tagRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: spacing.sm,
    marginTop: spacing.md,
  },
  tag: {
    backgroundColor: colors.brand[50],
    borderRadius: radius.sm,
    paddingHorizontal: spacing.sm,
    paddingVertical: 2,
  },
});
