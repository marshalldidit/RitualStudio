import React, { useEffect, useRef, useCallback } from "react";
import { View, StyleSheet, Alert } from "react-native";
import { useLocalSearchParams, useRouter, useNavigation } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { SafeAreaView } from "react-native-safe-area-context";
import { RSText } from "@/components/ui/RSText";
import { Button } from "@/components/ui/Button";
import { TimerRing } from "@/components/session/TimerRing";
import { PromptDisplay } from "@/components/session/PromptDisplay";
import { SessionControls } from "@/components/session/SessionControls";
import { useSessionTimer } from "@/hooks/useSessionTimer";
import { useSessionStore, ValidDurationSec } from "@/stores/sessionStore";
import { useDailyPromptsStore } from "@/stores/dailyPromptsStore";
import { colors } from "@/theme/colors";
import { spacing } from "@/theme/spacing";

export default function SessionScreen() {
  const { promptId } = useLocalSearchParams<{ promptId: string }>();
  const router = useRouter();
  const navigation = useNavigation();
  const isDoneRef = useRef(false);

  const promptIdNum = promptId ? parseInt(promptId, 10) : NaN;

  // Find the prompt from the daily prompts store
  const promptSet = useDailyPromptsStore((s) => s.promptSet);
  const prompt = promptSet?.prompts.find((p) => p.id === promptIdNum) ?? null;

  // Session store
  const { startSession } = useSessionStore();

  // Start or resume session on mount
  useEffect(() => {
    if (prompt == null || isNaN(promptIdNum)) return;

    const targetSec = prompt.time_required_minutes * 60;
    // Validate duration
    if (targetSec !== 900 && targetSec !== 1800 && targetSec !== 3600) {
      console.warn(
        `[SessionScreen] Prompt duration ${prompt.time_required_minutes}min ` +
          `is not a supported ritual length.`
      );
      return;
    }

    startSession(promptIdNum, targetSec as ValidDurationSec);
  }, [promptIdNum]); // eslint-disable-line react-hooks/exhaustive-deps

  // Timer hook
  const timer = useSessionTimer();

  // Back button / navigation interception
  useEffect(() => {
    const unsubscribe = navigation.addListener("beforeRemove", (e) => {
      // Allow navigation if user explicitly tapped "I'm Done"
      if (isDoneRef.current) return;

      // Allow if session is already ended or no active session
      const state = timer.sessionState?.state;
      if (state == null || state === "ended" || state === "idle") return;

      // Prevent default and show confirmation
      e.preventDefault();

      Alert.alert(
        "Leave session?",
        "This will end your current ritual. If you've drawn for long enough, it will still count as complete.",
        [
          { text: "Continue Ritual", style: "cancel" },
          {
            text: "End Ritual",
            style: "destructive",
            onPress: () => {
              const status = timer.endSession();
              // Allow the navigation to proceed
              navigation.dispatch(e.data.action);
            },
          },
        ]
      );
    });

    return unsubscribe;
  }, [navigation, timer.sessionState?.state]); // eslint-disable-line react-hooks/exhaustive-deps

  // Handle "I'm Done" / "Upload Your Work"
  const handleDone = useCallback(() => {
    isDoneRef.current = true;

    // If not yet completed, end the session (applies threshold logic)
    if (
      timer.sessionState?.state === "running" ||
      timer.sessionState?.state === "paused"
    ) {
      timer.endSession();
    }

    router.replace(`/upload/${promptId}`);
  }, [timer.sessionState?.state, promptId]); // eslint-disable-line react-hooks/exhaustive-deps

  // Error state: prompt not found
  if (prompt == null || isNaN(promptIdNum)) {
    return (
      <SafeAreaView style={styles.container}>
        <StatusBar style="light" />
        <View style={styles.errorContainer}>
          <RSText variant="h4" color={colors.white}>
            Prompt not found
          </RSText>
          <RSText
            variant="body"
            color={colors.dark[400]}
            style={styles.errorMessage}
          >
            The selected prompt could not be loaded.
          </RSText>
          <Button
            label="Go Back"
            variant="outline"
            size="md"
            onPress={() => router.back()}
            style={styles.errorButton}
          />
        </View>
      </SafeAreaView>
    );
  }

  // No active session yet (shouldn't normally happen)
  if (timer.sessionState == null) {
    return (
      <SafeAreaView style={styles.container}>
        <StatusBar style="light" />
        <View style={styles.errorContainer}>
          <RSText variant="body" color={colors.dark[400]}>
            Starting your ritual...
          </RSText>
        </View>
      </SafeAreaView>
    );
  }

  const isCompleted = timer.sessionState.state === "completed_active";

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="light" />

      {/* Prompt info */}
      <PromptDisplay title={prompt.title} role={prompt.role} />

      {/* Completion message */}
      {isCompleted && (
        <RSText
          variant="body"
          color={colors.dark[400]}
          style={styles.completionHint}
        >
          Keep drawing if you're in the flow.
        </RSText>
      )}

      {/* Timer ring — centered */}
      <View style={styles.timerArea}>
        <TimerRing
          displayText={timer.displayText}
          overtimeText={timer.overtimeText}
          ringProgress={timer.ringProgress}
          sessionState={timer.sessionState.state}
        />
      </View>

      {/* Controls */}
      <SessionControls
        sessionState={timer.sessionState.state}
        onPause={timer.pause}
        onResume={timer.resume}
        onDone={handleDone}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.dark[900],
  },
  timerArea: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  completionHint: {
    textAlign: "center",
    marginTop: spacing.sm,
  },
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: spacing.xl,
  },
  errorMessage: {
    marginTop: spacing.sm,
    textAlign: "center",
  },
  errorButton: {
    marginTop: spacing.lg,
    borderColor: colors.dark[400],
  },
});
