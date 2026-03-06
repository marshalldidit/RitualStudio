import { useEffect, useRef, useState, useCallback } from "react";
import { AppState, AppStateStatus } from "react-native";
import * as Haptics from "expo-haptics";
import {
  useSessionStore,
  computeDerived,
  DerivedTimerValues,
  formatMinutesOnly,
  formatOvertime,
  stepProgress,
} from "@/stores/sessionStore";

export interface UseSessionTimerReturn extends DerivedTimerValues {
  /** Current session state. null if no active session. */
  sessionState: ReturnType<typeof useSessionStore.getState>["session"];
  /** Minutes-only display string (e.g. "24", "< 1", "0"). */
  displayText: string;
  /** Formatted overtime string (+M:SS). Empty if not in overtime. */
  overtimeText: string;
  /** Step-based progress for the ring (snaps to whole minutes). */
  ringProgress: number;
  /** Minutes remaining (integer). */
  minutesRemaining: number;
  /** Pause the current session. */
  pause: () => void;
  /** Resume the current session. */
  resume: () => void;
  /** End the session (returns completion status). */
  endSession: () => "complete" | "incomplete";
}

/**
 * Reactive timer hook that reads from the session store and provides
 * derived timer values. Uses setInterval as a re-render trigger and
 * wall-clock timestamps for all calculations.
 *
 * Handles:
 * - Background/foreground transitions (recalculates from timestamps)
 * - Auto-detection of target completion (running → completed_active)
 * - One-time haptic on completion
 * - Duplicate interval prevention
 */
export function useSessionTimer(): UseSessionTimerReturn {
  const session = useSessionStore((s) => s.session);
  const { pause, resume, endSession, markCompleted } = useSessionStore();

  // Force re-render trigger
  const [tick, setTick] = useState(0);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const completionFiredRef = useRef(false);

  // Sync completion-fired flag with session identity
  useEffect(() => {
    if (session == null) {
      completionFiredRef.current = false;
    } else if (
      session.state === "completed_active" &&
      session.completedAt != null
    ) {
      // Restoring into an already-completed session — don't re-fire haptic
      completionFiredRef.current = true;
    }
  }, [session?.sessionId]); // eslint-disable-line react-hooks/exhaustive-deps

  // Interval management
  useEffect(() => {
    const isActive =
      session != null &&
      (session.state === "running" || session.state === "completed_active");

    if (isActive) {
      // Clear any existing interval first (prevent duplicates)
      if (intervalRef.current != null) {
        clearInterval(intervalRef.current);
      }
      intervalRef.current = setInterval(() => {
        setTick((t) => t + 1);
      }, 1000);
    } else {
      if (intervalRef.current != null) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    }

    return () => {
      if (intervalRef.current != null) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [session?.state, session?.sessionId]); // eslint-disable-line react-hooks/exhaustive-deps

  // AppState listener — force re-render on foreground to catch up wall-clock
  useEffect(() => {
    const handleAppState = (nextState: AppStateStatus) => {
      if (nextState === "active") {
        setTick((t) => t + 1);
      }
    };

    const sub = AppState.addEventListener("change", handleAppState);
    return () => sub.remove();
  }, []);

  // Compute derived values from current timestamp
  const now = Date.now();
  const derived: DerivedTimerValues = session
    ? computeDerived(session, now)
    : {
        elapsedActiveMs: 0,
        remainingMs: 0,
        targetDurationMs: 0,
        completionThresholdMs: 0,
        progress: 0,
        qualifiesForEarlyComplete: false,
        reachedTarget: false,
        isComplete: false,
        overtimeMs: 0,
      };

  // Auto-detect completion: running → completed_active
  useEffect(() => {
    if (
      session != null &&
      session.state === "running" &&
      derived.reachedTarget &&
      !completionFiredRef.current
    ) {
      completionFiredRef.current = true;
      markCompleted();
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    }
  }, [derived.reachedTarget, session?.state, session?.sessionId, markCompleted]); // eslint-disable-line react-hooks/exhaustive-deps

  const displayText = session ? formatMinutesOnly(derived.remainingMs) : "";
  const overtimeText =
    session && derived.overtimeMs > 0
      ? formatOvertime(derived.overtimeMs)
      : "";
  const ringProgress = session
    ? stepProgress(derived.elapsedActiveMs, derived.targetDurationMs)
    : 0;
  const minutesRemaining = Math.ceil(derived.remainingMs / 60000);

  const handleEndSession = useCallback(() => {
    return endSession();
  }, [endSession]);

  return {
    sessionState: session,
    displayText,
    overtimeText,
    ringProgress,
    minutesRemaining,
    pause,
    resume,
    endSession: handleEndSession,
    ...derived,
  };
}
