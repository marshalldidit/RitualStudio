import { Pressable, View, StyleSheet, Text } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { RSText } from "@/components/ui/RSText";
import { colors, spacing } from "@/theme";
import { radius } from "@/theme/radius";

interface SettingsRowProps {
  emoji?: string;
  label: string;
  value?: string;
  onPress?: () => void;
  /** Render as danger/destructive action */
  danger?: boolean;
  /** Hide the chevron arrow */
  hideChevron?: boolean;
}

export function SettingsRow({
  emoji,
  label,
  value,
  onPress,
  danger,
  hideChevron,
}: SettingsRowProps) {
  return (
    <Pressable
      style={({ pressed }) => [
        styles.row,
        pressed && onPress && styles.pressed,
      ]}
      onPress={onPress}
      disabled={!onPress}
    >
      {emoji ? <Text style={styles.emoji}>{emoji}</Text> : null}
      <View style={styles.content}>
        <RSText
          variant="body"
          color={danger ? colors.error : colors.dark[900]}
        >
          {label}
        </RSText>
      </View>
      {value ? (
        <RSText variant="body" color={colors.dark[500]} style={styles.value}>
          {value}
        </RSText>
      ) : null}
      {onPress && !hideChevron ? (
        <Ionicons
          name="chevron-forward"
          size={18}
          color={danger ? colors.error : colors.dark[400]}
        />
      ) : null}
    </Pressable>
  );
}

interface SettingsSectionProps {
  title?: string;
  children: React.ReactNode;
}

export function SettingsSection({ title, children }: SettingsSectionProps) {
  return (
    <View style={styles.section}>
      {title ? (
        <RSText
          variant="label"
          color={colors.dark[500]}
          style={styles.sectionTitle}
        >
          {title}
        </RSText>
      ) : null}
      <View style={styles.sectionContent}>{children}</View>
    </View>
  );
}

const styles = StyleSheet.create({
  section: {
    marginBottom: spacing.xl,
  },
  sectionTitle: {
    marginBottom: spacing.sm,
    paddingHorizontal: spacing.xs,
  },
  sectionContent: {
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    overflow: "hidden",
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.base,
    gap: spacing.md,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: colors.dark[100],
  },
  pressed: {
    backgroundColor: colors.dark[50],
  },
  emoji: {
    fontSize: 18,
  },
  content: {
    flex: 1,
  },
  value: {
    maxWidth: "50%",
  },
});
