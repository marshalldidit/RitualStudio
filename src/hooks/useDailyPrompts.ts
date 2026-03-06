import { useEffect, useCallback, useRef } from "react";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/providers/AuthProvider";
import { useDailyPromptsStore } from "@/stores/dailyPromptsStore";
import { DailyPromptsResponse } from "@/types/database";

function getTodayLocal(timezone: string): string {
  try {
    return new Date().toLocaleDateString("sv-SE", { timeZone: timezone });
  } catch {
    return new Date().toLocaleDateString("sv-SE", { timeZone: "UTC" });
  }
}

export function useDailyPrompts() {
  const { session, userProfile } = useAuth();
  const store = useDailyPromptsStore();
  const fetchedRef = useRef<string | null>(null);

  const timezone = userProfile?.timezone ?? "UTC";
  const todayLocal = getTodayLocal(timezone);

  const fetchDailyPrompts = useCallback(async () => {
    if (!session?.user?.id) return;

    store.setLoading(true);
    store.setError(null);

    const { data, error } = await supabase.rpc("generate_daily_prompts", {
      p_user_id: session.user.id,
      p_date_local: todayLocal,
    });

    if (error) {
      store.setError(error.message);
      store.setLoading(false);
      return;
    }

    store.setPromptSet(data as unknown as DailyPromptsResponse);
    store.setLoading(false);
    fetchedRef.current = todayLocal;
  }, [session?.user?.id, todayLocal]);

  useEffect(() => {
    if (!session?.user?.id || !userProfile?.onboarding_completed) return;
    if (fetchedRef.current === todayLocal && store.promptSet?.date_local === todayLocal) return;

    fetchDailyPrompts();
  }, [session?.user?.id, userProfile?.onboarding_completed, todayLocal]);

  const selectPrompt = useCallback(
    async (promptId: number) => {
      if (!store.promptSet || !session?.user?.id) return;

      const { error: setError } = await supabase
        .from("daily_prompt_sets")
        .update({ selected_prompt_id: promptId, status: "selected" as const })
        .eq("id", store.promptSet.id);

      if (setError) {
        console.error("[useDailyPrompts] Failed to update set:", setError.message);
        return;
      }

      await supabase
        .from("user_prompt_history")
        .update({ was_selected: true })
        .eq("user_id", session.user.id)
        .eq("prompt_id", promptId)
        .eq("date_local", todayLocal);

      store.selectPrompt(promptId);
    },
    [store.promptSet, session?.user?.id, todayLocal],
  );

  return {
    prompts: store.promptSet?.prompts ?? [],
    activeIndex: store.activeIndex,
    setActiveIndex: store.setActiveIndex,
    isLoading: store.isLoading,
    error: store.error,
    selectedPromptId: store.promptSet?.selected_prompt_id ?? null,
    selectPrompt,
    refresh: fetchDailyPrompts,
  };
}
