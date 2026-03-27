import { supabase } from "@/lib/supabase";

export interface CompletionResult {
  previousStreak: number;
  newStreak: number;
  longestStreak: number;
  graceUsed: boolean;
  isNewRecord: boolean;
}

/**
 * Complete a daily ritual: update streak, mark prompt set + history as completed.
 * All three operations are independent — we run them in parallel, but streak
 * result is the one we need for the UI, so we await it explicitly.
 */
export async function completeRitual(
  userId: string,
  promptId: number,
  dateLocal: string
): Promise<CompletionResult> {
  // 1. Read current streak before updating
  const { data: before, error: readErr } = await supabase
    .from("user_streaks")
    .select("*")
    .eq("user_id", userId)
    .single();

  if (readErr || !before) {
    throw new Error(readErr?.message ?? "Could not read streak data.");
  }

  const previousStreak = before.current_streak_days;
  const previousLongest = before.longest_streak_days;
  const previousGrace = before.grace_days_available;

  // 2. Call server-side streak update + mark prompt set/history completed in parallel
  const [streakResult] = await Promise.all([
    supabase.rpc("update_streak_on_completion", {
      p_user_id: userId,
      p_date: dateLocal,
    }),
    supabase
      .from("daily_prompt_sets")
      .update({ status: "completed" as const })
      .eq("user_id", userId)
      .eq("date_local", dateLocal),
    supabase
      .from("user_prompt_history")
      .update({ was_completed: true, completed_at: new Date().toISOString() })
      .eq("user_id", userId)
      .eq("prompt_id", promptId)
      .eq("date_local", dateLocal),
  ]);

  if (streakResult.error) {
    throw new Error(streakResult.error.message);
  }

  // 3. Read updated streak
  const { data: after, error: afterErr } = await supabase
    .from("user_streaks")
    .select("*")
    .eq("user_id", userId)
    .single();

  if (afterErr || !after) {
    throw new Error(afterErr?.message ?? "Could not read updated streak.");
  }

  const newStreak = after.current_streak_days;
  const longestStreak = after.longest_streak_days;

  // Determine if grace was used: grace decreased after update
  const graceUsed = after.grace_days_available < previousGrace;
  const isNewRecord = longestStreak > previousLongest;

  return {
    previousStreak,
    newStreak,
    longestStreak,
    graceUsed,
    isNewRecord,
  };
}
