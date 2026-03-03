import { useRef, useState } from "react";
import {
  View,
  TextInput,
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

export default function SignUpScreen() {
  const router = useRouter();
  const { signUp } = useAuth();

  const passwordRef = useRef<TextInput>(null);
  const confirmRef = useRef<TextInput>(null);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [confirmError, setConfirmError] = useState("");
  const [generalError, setGeneralError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);

  function validate(): boolean {
    let valid = true;
    setEmailError("");
    setPasswordError("");
    setConfirmError("");
    setGeneralError("");

    const trimmed = email.trim();
    if (!trimmed) {
      setEmailError("Email is required.");
      valid = false;
    } else if (!EMAIL_RE.test(trimmed)) {
      setEmailError("Please enter a valid email address.");
      valid = false;
    }

    if (!password) {
      setPasswordError("Password is required.");
      valid = false;
    } else if (password.length < 6) {
      setPasswordError("Password must be at least 6 characters.");
      valid = false;
    }

    if (!confirmPassword) {
      setConfirmError("Please confirm your password.");
      valid = false;
    } else if (password !== confirmPassword) {
      setConfirmError("Passwords do not match.");
      valid = false;
    }

    return valid;
  }

  async function handleSignUp() {
    if (!validate()) return;
    setIsSubmitting(true);
    setGeneralError("");

    try {
      const { error } = await signUp(email.trim(), password);
      if (error) {
        setGeneralError(error);
      } else {
        // If Supabase requires email confirmation, no session is created yet.
        // Show the confirmation message. If auto-confirm is on, onAuthStateChange
        // will fire and useProtectedRoute will navigate automatically.
        setShowConfirmation(true);
      }
    } catch {
      console.error("[SignUp] Unexpected error");
      setGeneralError("An unexpected error occurred. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  }

  if (showConfirmation) {
    return (
      <Screen>
        <View style={styles.confirmationContainer}>
          <RSText variant="h2" style={styles.confirmationTitle}>
            Check Your Email
          </RSText>
          <RSText
            variant="bodyLarge"
            color={colors.dark[500]}
            style={styles.confirmationText}
          >
            We sent a confirmation link to{" "}
            <RSText variant="bodyLarge" color={colors.dark[900]}>
              {email.trim()}
            </RSText>
            . Tap the link to activate your account, then come back here to sign
            in.
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
            <RSText variant="h1">Create Account</RSText>
            <RSText
              variant="bodyLarge"
              color={colors.dark[500]}
              style={styles.subtitle}
            >
              Join Ritual Studio and build your daily drawing habit.
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
              returnKeyType="next"
              onSubmitEditing={() => passwordRef.current?.focus()}
            />

            <Input
              label="Password"
              placeholder="At least 6 characters"
              value={password}
              onChangeText={(t) => {
                setPassword(t);
                if (passwordError) setPasswordError("");
              }}
              error={passwordError}
              secureTextEntry
              autoCapitalize="none"
              autoComplete="new-password"
              returnKeyType="next"
              onSubmitEditing={() => confirmRef.current?.focus()}
              inputRef={passwordRef}
            />

            <Input
              label="Confirm Password"
              placeholder="Re-enter your password"
              value={confirmPassword}
              onChangeText={(t) => {
                setConfirmPassword(t);
                if (confirmError) setConfirmError("");
              }}
              error={confirmError}
              secureTextEntry
              autoCapitalize="none"
              autoComplete="new-password"
              returnKeyType="go"
              onSubmitEditing={handleSignUp}
              inputRef={confirmRef}
            />

            <Button
              label={isSubmitting ? "Creating Account\u2026" : "Create Account"}
              variant="cta"
              size="lg"
              style={styles.button}
              disabled={isSubmitting}
              onPress={handleSignUp}
            />
          </View>

          <View style={styles.footer}>
            <Button
              label="Already have an account? Sign In"
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
  confirmationTitle: {
    textAlign: "center",
  },
  confirmationText: {
    textAlign: "center",
  },
});
