import React from "react";
import { View, Pressable, StyleSheet } from "react-native";
import { RSText } from "@/components/ui/RSText";
import { Button } from "@/components/ui/Button";
import { spacing } from "@/theme/spacing";
import { radius } from "@/theme/radius";
import { colors } from "@/theme/colors";
import type { SessionState } from "@/stores/sessionStore";

interface SessionControlsProps {
  sessionState: SessionState;
  onPause: () => void;
  onResume: () => void;
  onDone: () => void;
}

export function SessionControls({
  sessionState,
  onPause,
  onResume,
  onDone,
}: SessionControlsProps) {
  const isCompleted = sessionState === "completed_active";
  const isPaused = sessionState === "paused";
  const isRunning = sessionState === "running";

  return (
    <View style={styles.container}>
      {/* Pause / Resume — only visible while running or paused */}
      {(isRunning || isPaused) && (
        <Pressable
          onPress={isPaused ? onResume : onPause}
          style={({ pressed }) => [
            styles.pauseButton,
            pressed && styles.pressed,
          ]}
        >
          <RSText variant="body" color={colors.white} style={styles.pauseLabel}>
            {isPaused ? "Resume" : "Pause"}
          </RSText>
        </Pressable>
      )}

      {/* Primary CTA */}
      <Button
        label={isCompleted ? "Upload Your Work" : "I'm Done"}
        variant="cta"
        size="lg"
        onPress={onDone}
        style={styles.doneButton}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: spacing.xl,
    paddingBottom: spacing.xl,
    paddingTop: spacing.base,
    gap: spacing.md,
  },
  pauseButton: {
    alignSelf: "center",
    borderRadius: radius.full,
    borderWidth: 1,
    borderColor: colors.dark[600],
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.sm,
  },
  pauseLabel: {
    fontFamily: "PlusJakartaSans-SemiBold",
    fontWeight: "600",
  },
  pressed: {
    opacity: 0.7,
  },
  doneButton: {
    width: "100%",
  },
});
