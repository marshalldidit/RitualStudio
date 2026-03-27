import { useState } from "react";
import { View, ScrollView, Pressable, Alert, StyleSheet } from "react-native";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { Screen } from "@/components/ui/Screen";
import { RSText } from "@/components/ui/RSText";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import {
  SettingsSection,
  SettingsRow,
} from "@/components/profile/SettingsRow";
import { useAuth } from "@/providers/AuthProvider";
import { supabase } from "@/lib/supabase";
import { colors, spacing } from "@/theme";

export default function AccountScreen() {
  const router = useRouter();
  const { session, signOut } = useAuth();
  const email = session?.user?.email ?? "";

  // Change password state
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const [passwordSuccess, setPasswordSuccess] = useState(false);
  const [isSavingPassword, setIsSavingPassword] = useState(false);

  async function handleChangePassword() {
    setPasswordError(null);
    setPasswordSuccess(false);

    if (newPassword.length < 6) {
      setPasswordError("Password must be at least 6 characters.");
      return;
    }
    if (newPassword !== confirmPassword) {
      setPasswordError("Passwords do not match.");
      return;
    }

    setIsSavingPassword(true);
    const { error } = await supabase.auth.updateUser({
      password: newPassword,
    });

    if (error) {
      setPasswordError(error.message);
      setIsSavingPassword(false);
      return;
    }

    setPasswordSuccess(true);
    setNewPassword("");
    setConfirmPassword("");
    setIsSavingPassword(false);
  }

  function handleSignOut() {
    Alert.alert("Sign Out", "Are you sure you want to sign out?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Sign Out",
        style: "destructive",
        onPress: async () => {
          await signOut();
          // useProtectedRoute will redirect to auth
        },
      },
    ]);
  }

  function handleDeleteAccount() {
    Alert.alert(
      "Delete Account",
      "This will permanently delete your account and all your data. This action cannot be undone.",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            // Account deletion requires a server-side function for security.
            // For now, sign the user out and show a message.
            Alert.alert(
              "Contact Support",
              "To delete your account, please email support. You have been signed out.",
              [
                {
                  text: "OK",
                  onPress: async () => {
                    await signOut();
                  },
                },
              ]
            );
          },
        },
      ]
    );
  }

  return (
    <Screen>
      <View style={styles.header}>
        <Pressable onPress={() => router.back()} hitSlop={12}>
          <Ionicons name="arrow-back" size={24} color={colors.dark[900]} />
        </Pressable>
        <RSText variant="h3">Account</RSText>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        <SettingsSection title="Email">
          <SettingsRow emoji="📧" label={email} hideChevron />
        </SettingsSection>

        <SettingsSection title="Change Password">
          <View style={styles.passwordForm}>
            <Input
              label="New Password"
              placeholder="Enter new password"
              value={newPassword}
              onChangeText={setNewPassword}
              secureTextEntry
              autoCapitalize="none"
            />
            <Input
              label="Confirm Password"
              placeholder="Confirm new password"
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              secureTextEntry
              autoCapitalize="none"
              error={passwordError ?? undefined}
            />
            {passwordSuccess && (
              <RSText variant="body" color={colors.success}>
                Password updated successfully.
              </RSText>
            )}
            <Button
              label={isSavingPassword ? "Updating\u2026" : "Update Password"}
              variant="primary"
              size="md"
              disabled={
                isSavingPassword ||
                newPassword.length === 0 ||
                confirmPassword.length === 0
              }
              onPress={handleChangePassword}
            />
          </View>
        </SettingsSection>

        <SettingsSection>
          <SettingsRow
            emoji="🚪"
            label="Sign Out"
            onPress={handleSignOut}
          />
        </SettingsSection>

        <SettingsSection title="Danger Zone">
          <SettingsRow
            label="Delete Account"
            onPress={handleDeleteAccount}
            danger
          />
        </SettingsSection>
      </ScrollView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.md,
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: spacing.xl,
    paddingBottom: spacing["3xl"],
  },
  passwordForm: {
    padding: spacing.base,
    gap: spacing.md,
  },
});
