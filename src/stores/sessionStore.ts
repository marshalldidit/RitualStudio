import { create } from "zustand";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export type SessionState =
  | "idle"
  | "running"
  | "paused"
  | "completed_active"
  | "ended";

export type CompletionStatus = "incomplete" | "complete";

export type CompletionMethod =
  | "target_reached"
  | "ended_after_threshold"
  | "uploaded_after_threshold"
  | "ended_before_threshold";

/** Only these three durations are valid. */
const VALID_DURATIONS_SEC = [900, 1800, 3600] as const;
export type ValidDurationSec = (typeof VALID_DURATIONS_SEC)[number];

const EARLY_COMPLETE_RATIO = 0.8;

// ---------------------------------------------------------------------------
// Session data
// ---------------------------------------------------------------------------

export interface SessionData {
  sessionId: string;
  promptId: number;
  targetDurationSec: ValidDurationSec;
  startedAt: number; // Date.now()
  pausedAt: number | null;
  totalPausedMs: number;
  endedAt: number | null;
  completedAt: number | null;
  manuallyEnded: boolean;
  uploadedAt: number | null;
  completionStatus: CompletionStatus;
  state: SessionState;
}

// ---------------------------------------------------------------------------
// Derived values — pure functions, no side effects
// ---------------------------------------------------------------------------

export interface DerivedTimerValues {
  elapsedActiveMs: number;
  remainingMs: number;
  targetDurationMs: number;
  completionThresholdMs: number;
  progress: number; // 0→1, capped at 1
  qualifiesForEarlyComplete: boolean;
  reachedTarget: boolean;
  isComplete: boolean;
  overtimeMs: number;
}

export function computeDerived(
  session: SessionData,
  now: number = Date.now()
): DerivedTimerValues {
  const targetDurationMs = session.targetDurationSec * 1000;
  const completionThresholdMs = targetDurationMs * EARLY_COMPLETE_RATIO;

  let elapsedActiveMs: number;

  if (session.state === "idle" || session.state === "ended") {
    // For ended sessions, freeze at the moment they ended
    if (session.endedAt != null) {
      elapsedActiveMs = session.endedAt - session.startedAt - session.totalPausedMs;
    } else {
      elapsedActiveMs = 0;
    }
  } else if (session.state === "paused" && session.pausedAt != null) {
    elapsedActiveMs = session.pausedAt - session.startedAt - session.totalPausedMs;
  } else {
    // running or completed_active
    elapsedActiveMs = now - session.startedAt - session.totalPausedMs;
  }

  // Guard against negative values (clock adjustments, etc.)
  elapsedActiveMs = Math.max(0, elapsedActiveMs);

  const remainingMs = Math.max(0, targetDurationMs - elapsedActiveMs);
  const progress = Math.min(elapsedActiveMs / targetDurationMs, 1);
  const qualifiesForEarlyComplete = elapsedActiveMs >= completionThresholdMs;
  const reachedTarget = elapsedActiveMs >= targetDurationMs;
  const isComplete =
    session.completionStatus === "complete" || reachedTarget;
  const overtimeMs = Math.max(0, elapsedActiveMs - targetDurationMs);

  return {
    elapsedActiveMs,
    remainingMs,
    targetDurationMs,
    completionThresholdMs,
    progress,
    qualifiesForEarlyComplete,
    reachedTarget,
    isComplete,
    overtimeMs,
  };
}

// ---------------------------------------------------------------------------
// Format helpers
// ---------------------------------------------------------------------------

/** Format remaining ms as minutes-only display. Returns "< 1" when under 1 min. */
export function formatMinutesOnly(ms: number): string {
  if (ms <= 0) return "0";
  const minutes = Math.ceil(ms / 60000);
  if (minutes < 1) return "< 1";
  return `${minutes}`;
}

/** Format overtime ms as +M:SS string. */
export function formatOvertime(ms: number): string {
  const totalSec = Math.floor(ms / 1000);
  const minutes = Math.floor(totalSec / 60);
  const seconds = totalSec % 60;
  return `+${minutes}:${seconds.toString().padStart(2, "0")}`;
}

/**
 * Step-based progress: snaps to whole-minute increments for the ring,
 * so it advances once per minute rather than continuously.
 */
export function stepProgress(elapsedMs: number, targetMs: number): number {
  if (targetMs <= 0) return 0;
  const elapsedWholeMinutes = Math.floor(elapsedMs / 60000);
  const targetMinutes = targetMs / 60000;
  return Math.min(elapsedWholeMinutes / targetMinutes, 1);
}

/** Duration bucket label. */
export function durationBucket(sec: number): 15 | 30 | 60 {
  if (sec === 900) return 15;
  if (sec === 1800) return 30;
  return 60;
}

// ---------------------------------------------------------------------------
// Validation
// ---------------------------------------------------------------------------

function isValidDuration(sec: number): sec is ValidDurationSec {
  return (VALID_DURATIONS_SEC as readonly number[]).includes(sec);
}

function generateSessionId(): string {
  return `session_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`;
}

// ---------------------------------------------------------------------------
// Store
// ---------------------------------------------------------------------------

interface SessionStoreState {
  session: SessionData | null;
}

interface SessionStoreActions {
  startSession: (promptId: number, targetDurationSec: number) => void;
  pause: () => void;
  resume: () => void;
  markCompleted: () => void;
  endSession: () => CompletionStatus;
  markUploaded: () => void;
  cancel: () => void;
}

const INITIAL_STATE: SessionStoreState = {
  session: null,
};

export const useSessionStore = create<SessionStoreState & SessionStoreActions>()(
  (set, get) => ({
    ...INITIAL_STATE,

    startSession: (promptId, targetDurationSec) => {
      if (!isValidDuration(targetDurationSec)) {
        console.error(
          `[sessionStore] Invalid duration: ${targetDurationSec}s. ` +
            `Only 900, 1800, 3600 are supported.`
        );
        return;
      }

      // If there is already an active session for this prompt, resume it
      const existing = get().session;
      if (
        existing != null &&
        existing.promptId === promptId &&
        existing.state !== "ended" &&
        existing.state !== "idle"
      ) {
        return;
      }

      const now = Date.now();
      set({
        session: {
          sessionId: generateSessionId(),
          promptId,
          targetDurationSec,
          startedAt: now,
          pausedAt: null,
          totalPausedMs: 0,
          endedAt: null,
          completedAt: null,
          manuallyEnded: false,
          uploadedAt: null,
          completionStatus: "incomplete",
          state: "running",
        },
      });
    },

    pause: () => {
      const session = get().session;
      if (session == null || session.state !== "running") return;

      set({
        session: {
          ...session,
          state: "paused",
          pausedAt: Date.now(),
        },
      });
    },

    resume: () => {
      const session = get().session;
      if (session == null || session.state !== "paused" || session.pausedAt == null) return;

      const now = Date.now();
      const pauseDuration = Math.max(0, now - session.pausedAt);

      set({
        session: {
          ...session,
          state: "running",
          pausedAt: null,
          totalPausedMs: session.totalPausedMs + pauseDuration,
        },
      });
    },

    markCompleted: () => {
      const session = get().session;
      if (session == null) return;
      // Only transition from running → completed_active
      if (session.state !== "running") return;
      // Guard against duplicate completion
      if (session.completedAt != null) return;

      set({
        session: {
          ...session,
          state: "completed_active",
          completedAt: Date.now(),
          completionStatus: "complete",
        },
      });
    },

    endSession: () => {
      const session = get().session;
      if (session == null) return "incomplete";

      const now = Date.now();
      const derived = computeDerived(session, now);
      const status: CompletionStatus =
        derived.qualifiesForEarlyComplete || derived.reachedTarget
          ? "complete"
          : "incomplete";

      set({
        session: {
          ...session,
          state: "ended",
          endedAt: now,
          manuallyEnded: true,
          completionStatus: status,
          completedAt: session.completedAt ?? (status === "complete" ? now : null),
        },
      });

      return status;
    },

    markUploaded: () => {
      const session = get().session;
      if (session == null) return;

      set({
        session: {
          ...session,
          uploadedAt: Date.now(),
        },
      });
    },

    cancel: () => {
      set({ session: null });
    },
  })
);
