import { useState, useEffect, useCallback, useMemo } from "react";
import {
  startOfMonth,
  endOfMonth,
  getDay,
  getDaysInMonth,
  format,
  addMonths,
  subMonths,
  isSameMonth,
  isAfter,
  isBefore,
  parseISO,
} from "date-fns";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/providers/AuthProvider";
import type { DayData } from "@/components/calendar/MonthCalendar";
import type { DayState } from "@/components/calendar/CalendarDayCell";

interface StreakCalendarData {
  days: DayData[];
  monthLabel: string;
  canGoNext: boolean;
  currentStreak: number;
  longestStreak: number;
  totalCompleted: number;
  isLoading: boolean;
  goToPrev: () => void;
  goToNext: () => void;
}

/**
 * Get today's date string in the user's timezone (YYYY-MM-DD).
 */
function getTodayLocal(timezone: string | null): string {
  return new Date().toLocaleDateString("sv-SE", {
    timeZone: timezone ?? undefined,
  });
}

export function useStreakCalendar(): StreakCalendarData {
  const { session, userProfile } = useAuth();
  const userId = session?.user?.id;
  const timezone = userProfile?.timezone ?? null;

  const todayStr = getTodayLocal(timezone);
  const todayDate = parseISO(todayStr);

  const [viewMonth, setViewMonth] = useState(() => startOfMonth(todayDate));
  const [completedDates, setCompletedDates] = useState<Set<string>>(new Set());
  const [offeredDates, setOfferedDates] = useState<Set<string>>(new Set());
  const [currentStreak, setCurrentStreak] = useState(0);
  const [longestStreak, setLongestStreak] = useState(0);
  const [totalCompleted, setTotalCompleted] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch prompt sets for the viewed month
  const fetchMonthData = useCallback(
    async (month: Date) => {
      if (!userId) return;

      const monthStart = format(startOfMonth(month), "yyyy-MM-dd");
      const monthEnd = format(endOfMonth(month), "yyyy-MM-dd");

      const { data, error } = await supabase
        .from("daily_prompt_sets")
        .select("date_local, status")
        .eq("user_id", userId)
        .gte("date_local", monthStart)
        .lte("date_local", monthEnd);

      if (error) {
        console.error("[useStreakCalendar] Failed to fetch prompt sets:", error.message);
        return;
      }

      const completed = new Set<string>();
      const offered = new Set<string>();

      for (const row of data ?? []) {
        offered.add(row.date_local);
        if (row.status === "completed") {
          completed.add(row.date_local);
        }
      }

      setCompletedDates(completed);
      setOfferedDates(offered);
    },
    [userId]
  );

  // Fetch streak stats
  const fetchStreakStats = useCallback(async () => {
    if (!userId) return;

    const [streakResult, countResult] = await Promise.all([
      supabase
        .from("user_streaks")
        .select("current_streak_days, longest_streak_days")
        .eq("user_id", userId)
        .single(),
      supabase
        .from("daily_prompt_sets")
        .select("id", { count: "exact", head: true })
        .eq("user_id", userId)
        .eq("status", "completed"),
    ]);

    if (streakResult.data) {
      setCurrentStreak(streakResult.data.current_streak_days);
      setLongestStreak(streakResult.data.longest_streak_days);
    }

    setTotalCompleted(countResult.count ?? 0);
  }, [userId]);

  // Load data when month or user changes
  useEffect(() => {
    if (!userId) return;

    setIsLoading(true);
    Promise.all([fetchMonthData(viewMonth), fetchStreakStats()]).finally(() =>
      setIsLoading(false)
    );
  }, [userId, viewMonth, fetchMonthData, fetchStreakStats]);

  // Navigation
  const canGoNext = !isSameMonth(viewMonth, todayDate);

  const goToPrev = useCallback(() => {
    setViewMonth((prev) => subMonths(prev, 1));
  }, []);

  const goToNext = useCallback(() => {
    if (canGoNext) {
      setViewMonth((prev) => addMonths(prev, 1));
    }
  }, [canGoNext]);

  // Build grid
  const days = useMemo((): DayData[] => {
    const daysInMonth = getDaysInMonth(viewMonth);
    const firstDayOfWeek = getDay(startOfMonth(viewMonth)); // 0 = Sunday

    const grid: DayData[] = [];

    // Leading empties
    for (let i = 0; i < firstDayOfWeek; i++) {
      grid.push({ date: 0, state: "empty" });
    }

    // Actual days
    for (let d = 1; d <= daysInMonth; d++) {
      const dateStr = format(
        new Date(viewMonth.getFullYear(), viewMonth.getMonth(), d),
        "yyyy-MM-dd"
      );
      const state = getDayState(dateStr, todayStr, completedDates, offeredDates);
      grid.push({ date: d, state });
    }

    // Trailing empties to complete last row
    const remainder = grid.length % 7;
    if (remainder > 0) {
      for (let i = 0; i < 7 - remainder; i++) {
        grid.push({ date: 0, state: "empty" });
      }
    }

    return grid;
  }, [viewMonth, todayStr, completedDates, offeredDates]);

  const monthLabel = format(viewMonth, "MMMM yyyy");

  return {
    days,
    monthLabel,
    canGoNext,
    currentStreak,
    longestStreak,
    totalCompleted,
    isLoading,
    goToPrev,
    goToNext,
  };
}

function getDayState(
  dateStr: string,
  todayStr: string,
  completedDates: Set<string>,
  offeredDates: Set<string>
): DayState {
  if (dateStr === todayStr) return "today";
  if (completedDates.has(dateStr)) return "completed";

  // Future day
  if (dateStr > todayStr) return "rest";

  // Past day: was offered but not completed → missed
  if (offeredDates.has(dateStr)) return "missed";

  // Past day: nothing happened
  return "default";
}
