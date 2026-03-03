import { useState } from "react";
import {
  View,
  KeyboardAvoidingView,
  ScrollView,
  Platform,
  StyleSheet,
} from "react-native";
import { useRouter } from "expo-router";
import { Screen } from "@/components/ui/Screen";
import { RSText } from "@/components/ui/RSText";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { useAuth } from "@/providers/AuthProvider";
import { colors, spacing, radius } from "@/theme";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function ForgotPasswordScreen() {
  const router = useRouter();
  const { resetPassword } = useAuth();

  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState("");
  const [generalError, setGeneralError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);

  function validate(): boolean {
    setEmailError("");
    setGeneralError("");

    const trimmed = email.trim();
    if (!trimmed) {
      setEmailError("Email is required.");
      return false;
    }
    if (!EMAIL_RE.test(trimmed)) {
      setEmailError("Please enter a valid email address.");
      return false;
    }

    return true;
  }

  async function handleResetPassword() {
    if (!validate()) return;
    setIsSubmitting(true);
    setGeneralError("");

    try {
      const { error } = await resetPassword(email.trim());
      if (error) {
        setGeneralError(error);
      } else {
        setShowConfirmation(true);
      }
    } catch {
      console.error("[ForgotPassword] Unexpected error");
      setGeneralError("An unexpected error occurred. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  }

  if (showConfirmation) {
    return (
      <Screen>
        <View style={styles.confirmationContainer}>
          <RSText variant="h2" style={styles.centered}>
            Check Your Email
          </RSText>
          <RSText
            variant="bodyLarge"
            color={colors.dark[500]}
            style={styles.centered}
          >
            We sent a password reset link to{" "}
            <RSText variant="bodyLarge" color={colors.dark[900]}>
              {email.trim()}
            </RSText>
            . Follow the link to set a new password.
          </RSText>
          <Button
            label="Back to Sign In"
            variant="primary"
            size="lg"
            style={styles.button}
            onPress={() => router.replace("/(auth)/sign-in")}
          />
        </View>
      </Screen>
    );
  }

  return (
    <Screen>
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
          bounces={false}
        >
          <View style={styles.header}>
            <RSText variant="h1">Reset Password</RSText>
            <RSText
              variant="bodyLarge"
              color={colors.dark[500]}
              style={styles.subtitle}
            >
              Enter your email and we'll send you a link to reset your password.
            </RSText>
          </View>

          <View style={styles.form}>
            {generalError !== "" && (
              <View style={styles.errorBanner}>
                <RSText variant="body" color={colors.error}>
                  {generalError}
                </RSText>
              </View>
            )}

            <Input
              label="Email"
              placeholder="you@example.com"
              value={email}
              onChangeText={(t) => {
                setEmail(t);
                if (emailError) setEmailError("");
              }}
              error={emailError}
              keyboardType="email-address"
              autoCapitalize="none"
              autoComplete="email"
              returnKeyType="go"
              onSubmitEditing={handleResetPassword}
            />

            <Button
              label={isSubmitting ? "Sending\u2026" : "Send Reset Link"}
              variant="primary"
              size="lg"
              style={styles.button}
              disabled={isSubmitting}
              onPress={handleResetPassword}
            />
          </View>

          <View style={styles.footer}>
            <Button
              label="Back to Sign In"
              variant="ghost"
              size="md"
              onPress={() => router.back()}
            />
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  flex: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: "space-between",
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing["3xl"],
  },
  header: {
    marginBottom: spacing["2xl"],
  },
  subtitle: {
    marginTop: spacing.md,
  },
  form: {
    gap: spacing.base,
  },
  errorBanner: {
    backgroundColor: colors.missed.bg,
    borderWidth: 1,
    borderColor: colors.missed.border,
    borderRadius: radius.md,
    paddingHorizontal: spacing.base,
    paddingVertical: spacing.md,
  },
  button: {
    width: "100%",
    marginTop: spacing.sm,
  },
  footer: {
    alignItems: "center",
    marginTop: spacing["2xl"],
  },
  confirmationContainer: {
    flex: 1,
    justifyContent: "center",
    paddingHorizontal: spacing.xl,
    gap: spacing.lg,
  },
  centered: {
    textAlign: "center",
  },
});
