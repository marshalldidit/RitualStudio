import { create } from "zustand";

function getDefaultTimezone(): string {
  try {
    return Intl.DateTimeFormat().resolvedOptions().timeZone;
  } catch {
    return "UTC";
  }
}

interface OnboardingState {
  userGoals: string[];
  difficultyLevel: string | null;
  subjectPreferences: string[];
  skillFocusPreferences: string[];
  sessionDurationMinutes: number | null;
  reminderTimeLocal: string;
  timezone: string;
}

interface OnboardingActions {
  toggleGoal: (goal: string) => void;
  setDifficultyLevel: (level: string) => void;
  toggleSubject: (subject: string) => void;
  toggleSkill: (skill: string) => void;
  setSessionDuration: (minutes: number) => void;
  setReminderTime: (time: string) => void;
  setTimezone: (tz: string) => void;
  reset: () => void;
}

const initialState: OnboardingState = {
  userGoals: [],
  difficultyLevel: null,
  subjectPreferences: [],
  skillFocusPreferences: [],
  sessionDurationMinutes: null,
  reminderTimeLocal: "09:00",
  timezone: getDefaultTimezone(),
};

export const useOnboardingStore = create<OnboardingState & OnboardingActions>()(
  (set) => ({
    ...initialState,

    toggleGoal: (goal) =>
      set((state) => ({
        userGoals: state.userGoals.includes(goal)
          ? state.userGoals.filter((g) => g !== goal)
          : [...state.userGoals, goal],
      })),

    setDifficultyLevel: (level) => set({ difficultyLevel: level }),

    toggleSubject: (subject) =>
      set((state) => ({
        subjectPreferences: state.subjectPreferences.includes(subject)
          ? state.subjectPreferences.filter((s) => s !== subject)
          : [...state.subjectPreferences, subject],
      })),

    toggleSkill: (skill) =>
      set((state) => ({
        skillFocusPreferences: state.skillFocusPreferences.includes(skill)
          ? state.skillFocusPreferences.filter((s) => s !== skill)
          : [...state.skillFocusPreferences, skill],
      })),

    setSessionDuration: (minutes) => set({ sessionDurationMinutes: minutes }),

    setReminderTime: (time) => set({ reminderTimeLocal: time }),

    setTimezone: (tz) => set({ timezone: tz }),

    reset: () => set({ ...initialState, timezone: getDefaultTimezone() }),
  })
);
