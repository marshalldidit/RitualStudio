import { View, StyleSheet } from "react-native";
import { RSText } from "@/components/ui/RSText";
import { colors, spacing } from "@/theme";
import { fontFamily } from "@/theme/typography";
import { format } from "date-fns";

const AVATAR_COLORS = ["#F9C01E", "#FF8C61", "#61C9A8", "#7B8CDE", "#FF6B9D"];

function getInitials(email: string): string {
  const local = email.split("@")[0];
  if (!local) return "?";
  // Try splitting on dots/underscores for two initials
  const parts = local.split(/[._-]/).filter(Boolean);
  if (parts.length >= 2) {
    return (parts[0][0] + parts[1][0]).toUpperCase();
  }
  return local.slice(0, 2).toUpperCase();
}

function getAvatarColor(email: string): string {
  return AVATAR_COLORS[email.charCodeAt(0) % AVATAR_COLORS.length];
}

interface ProfileHeaderProps {
  email: string;
  createdAt: string;
}

export function ProfileHeader({ email, createdAt }: ProfileHeaderProps) {
  const initials = getInitials(email);
  const avatarColor = getAvatarColor(email);
  const memberSince = (() => {
    try {
      return format(new Date(createdAt), "MMMM yyyy");
    } catch {
      return "";
    }
  })();

  return (
    <View style={styles.container}>
      <View style={[styles.avatar, { backgroundColor: avatarColor }]}>
        <RSText variant="h2" color={colors.white} style={styles.initials}>
          {initials}
        </RSText>
      </View>
      <RSText variant="h3" style={styles.email}>
        {email}
      </RSText>
      {memberSince ? (
        <RSText variant="caption" color={colors.dark[500]}>
          Member since {memberSince}
        </RSText>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    paddingVertical: spacing["2xl"],
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 9999,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: spacing.base,
  },
  initials: {
    fontFamily: fontFamily.bold,
  },
  email: {
    marginBottom: spacing.xs,
  },
});
