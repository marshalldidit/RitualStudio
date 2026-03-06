import { create } from "zustand";
import { DailyPromptsResponse } from "@/types/database";

interface DailyPromptsState {
  promptSet: DailyPromptsResponse | null;
  activeIndex: number;
  isLoading: boolean;
  error: string | null;
}

interface DailyPromptsActions {
  setPromptSet: (set: DailyPromptsResponse) => void;
  setActiveIndex: (index: number) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  selectPrompt: (promptId: number) => void;
  reset: () => void;
}

const initialState: DailyPromptsState = {
  promptSet: null,
  activeIndex: 0,
  isLoading: false,
  error: null,
};

export const useDailyPromptsStore = create<
  DailyPromptsState & DailyPromptsActions
>()((set) => ({
  ...initialState,

  setPromptSet: (promptSet) => set({ promptSet }),

  setActiveIndex: (activeIndex) => set({ activeIndex }),

  setLoading: (isLoading) => set({ isLoading }),

  setError: (error) => set({ error }),

  selectPrompt: (promptId) =>
    set((state) => {
      if (!state.promptSet) return state;
      return {
        promptSet: {
          ...state.promptSet,
          selected_prompt_id: promptId,
          status: "selected" as const,
        },
      };
    }),

  reset: () => set(initialState),
}));
