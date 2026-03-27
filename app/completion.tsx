import React, { useEffect, useState, useCallback, useRef } from "react";
import { View, StyleSheet, ActivityIndicator, Pressable } from "react-native";
import { useRouter } from "expo-router";
import * as Haptics from "expo-haptics";
import { Screen } from "@/components/ui/Screen";
import { RSText } from "@/components/ui/RSText";
import { Button } from "@/components/ui/Button";
import { CelebrationAnimation } from "@/components/completion/CelebrationAnimation";
import { StreakUpdate } from "@/components/completion/StreakUpdate";
import { useAuth } from "@/providers/AuthProvider";
import { useSessionStore } from "@/stores/sessionStore";
import { useDailyPromptsStore } from "@/stores/dailyPromptsStore";
import { completeRitual, CompletionResult } from "@/lib/streakManager";
import { colors, spacing } from "@/theme";

export default function CompletionScreen() {
  const router = useRouter();
  const { session, userProfile } = useAuth();
  const sessionData = useSessionStore((s) => s.session);
  const cancelSession = useSessionStore((s) => s.cancel);
  const resetPrompts = useDailyPromptsStore((s) => s.reset);

  const [result, setResult] = useState<CompletionResult | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const completedRef = useRef(false);

  const promptId = sessionData?.promptId ?? null;
  const wasComplete = sessionData?.completionStatus === "complete";

  const runCompletion = useCallback(async () => {
    if (!session?.user?.id || !promptId) {
      setError("Session data is missing. Please try again from home.");
      setIsLoading(false);
      return;
    }

    // Only run streak update for completed sessions
    if (!wasComplete) {
      setIsLoading(false);
      return;
    }

    // Prevent duplicate calls
    if (completedRef.current) return;
    completedRef.current = true;

    setIsLoading(true);
    setError(null);

    try {
      const tz =
        userProfile?.timezone ??
        Intl.DateTimeFormat().resolvedOptions().timeZone;
      const dateLocal = new Date().toLocaleDateString("sv-SE", {
        timeZone: tz,
      });

      const completionResult = await completeRitual(
        session.user.id,
        promptId,
        dateLocal
      );
      setResult(completionResult);

      // Haptic feedback on success
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    } catch (err: any) {
      console.error("[CompletionScreen] Streak update failed:", err);
      setError(err?.message ?? "Failed to update your streak. Don't worry — your drawing is saved.");
      completedRef.current = false; // Allow retry
    } finally {
      setIsLoading(false);
    }
  }, [session?.user?.id, promptId, wasComplete, userProfile]);

  useEffect(() => {
    runCompletion();
  }, [runCompletion]);

  function handleGoHome() {
    // Clean up session and prompt state so home screen re-fetches
    cancelSession();
    resetPrompts();
    router.replace("/(tabs)");
  }

  // --- Loading state ---
  if (isLoading) {
    return (
      <Screen>
        <View style={styles.centered}>
          <ActivityIndicator size="large" color={colors.brand[400]} />
          <RSText
            variant="body"
            color={colors.dark[500]}
            style={styles.loadingText}
          >
            Updating your streak...
          </RSText>
        </View>
      </Screen>
    );
  }

  // --- Error state ---
  if (error) {
    return (
      <Screen>
        <View style={styles.centered}>
          <RSText variant="h2" style={styles.errorTitle}>
            Something went wrong
          </RSText>
          <RSText
            variant="body"
            color={colors.dark[500]}
            style={styles.errorMessage}
          >
            {error}
          </RSText>
          <Button
            label="Try Again"
            variant="outline"
            size="md"
            onPress={runCompletion}
            style={styles.retryButton}
          />
          <Pressable onPress={handleGoHome} style={styles.skipLink}>
            <RSText variant="body" color={colors.dark[500]}>
              Go home anyway
            </RSText>
          </Pressable>
        </View>
      </Screen>
    );
  }

  // --- Incomplete session (skipped / ended early) ---
  if (!wasComplete) {
    return (
      <Screen>
        <View style={styles.centered}>
          <RSText variant="display" style={styles.headingCenter}>
            See You{"\n"}Tomorrow
          </RSText>
          <RSText
            variant="h3"
            color={colors.dark[500]}
            style={styles.subtitle}
          >
            Every start counts.
          </RSText>
          <View style={styles.footer}>
            <Button
              label="Back to Home"
              variant="primary"
              size="lg"
              onPress={handleGoHome}
              style={styles.ctaButton}
            />
          </View>
        </View>
      </Screen>
    );
  }

  // --- Success state ---
  return (
    <Screen>
      <CelebrationAnimation />
      <View style={styles.centered}>
        <RSText variant="display" style={styles.headingCenter}>
          Day {result?.newStreak ?? 1}
          {"\n"}Complete
        </RSText>
        <RSText variant="h3" color={colors.dark[500]} style={styles.subtitle}>
          You showed up.
        </RSText>

        {result && <View style={styles.streakSection}><StreakUpdate result={result} /></View>}

        <View style={styles.footer}>
          <Button
            label="Back to Home"
            variant="primary"
            size="lg"
            onPress={handleGoHome}
            style={styles.ctaButton}
          />
        </View>
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  centered: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: spacing.xl,
  },
  headingCenter: {
    textAlign: "center",
  },
  subtitle: {
    marginTop: spacing.base,
    textAlign: "center",
  },
  streakSection: {
    marginTop: spacing["2xl"],
  },
  loadingText: {
    marginTop: spacing.base,
  },
  errorTitle: {
    textAlign: "center",
  },
  errorMessage: {
    marginTop: spacing.sm,
    textAlign: "center",
  },
  retryButton: {
    marginTop: spacing.lg,
  },
  skipLink: {
    marginTop: spacing.base,
    padding: spacing.sm,
  },
  footer: {
    position: "absolute",
    bottom: spacing.xl,
    left: spacing.xl,
    right: spacing.xl,
  },
  ctaButton: {
    width: "100%",
  },
});
