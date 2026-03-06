import React from "react";
import { View, StyleSheet } from "react-native";
import { RSText } from "@/components/ui/RSText";
import { colors } from "@/theme/colors";
import { spacing } from "@/theme/spacing";
import { radius } from "@/theme/radius";
import { fontFamily } from "@/theme/typography";
import type { PromptRole } from "@/types/database";

interface PromptDisplayProps {
  title: string;
  role: PromptRole;
}

const ROLE_LABELS: Record<PromptRole, string> = {
  comfort: "Comfort",
  growth: "Growth",
  wildcard: "Wildcard",
};

export function PromptDisplay({ title, role }: PromptDisplayProps) {
  return (
    <View style={styles.container}>
      <View style={styles.roleBadge}>
        <RSText variant="caption" color={colors.dark[400]} style={styles.roleText}>
          {ROLE_LABELS[role]}
        </RSText>
      </View>
      <RSText variant="h4" color={colors.white} style={styles.title}>
        {title}
      </RSText>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    paddingHorizontal: spacing.xl,
    paddingTop: spacing.base,
  },
  roleBadge: {
    backgroundColor: colors.dark[800],
    borderRadius: radius.full,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
  },
  roleText: {
    fontFamily: fontFamily.semiBold,
    textTransform: "capitalize",
  },
  title: {
    marginTop: spacing.sm,
    textAlign: "center",
  },
});
