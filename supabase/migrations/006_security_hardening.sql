-- ============================================================
-- 006_security_hardening.sql
-- Remove direct user_streaks UPDATE access; add server-side
-- streak update function with proper validation.
-- ============================================================

-- 1. Remove the user-facing UPDATE policy on user_streaks.
--    Users should never directly modify their own streak counts.
drop policy if exists "Users can update their own streak" on public.user_streaks;

-- 2. Create a security-definer function that encapsulates streak logic.
--    Only this function (running as the DB owner) can update user_streaks.
--
--    Streak rules (from project spec):
--      daysDiff == 0  → no change (already completed today)
--      daysDiff == 1  → streak + 1, grace = 1
--      daysDiff == 2 && grace > 0 → streak + 1, grace = 0
--      daysDiff >= 3, or (daysDiff == 2 && grace == 0) → reset to 1, grace = 1
create or replace function public.update_streak_on_completion(p_user_id uuid, p_date date)
returns void
language plpgsql
security definer
set search_path = public
as $$
declare
  v_streak user_streaks%rowtype;
  v_days_diff int;
begin
  select * into v_streak from user_streaks where user_id = p_user_id;

  if not found then
    raise exception 'No streak record found for user %', p_user_id;
  end if;

  -- If no prior completion, treat as first day
  if v_streak.last_completed_date_local is null then
    update user_streaks set
      current_streak_days = 1,
      longest_streak_days = greatest(longest_streak_days, 1),
      last_completed_date_local = p_date,
      grace_days_available = 1,
      updated_at = now()
    where user_id = p_user_id;
    return;
  end if;

  v_days_diff := p_date - v_streak.last_completed_date_local;

  if v_days_diff <= 0 then
    -- Already completed today (or date in the past), no change
    return;
  elsif v_days_diff = 1 then
    update user_streaks set
      current_streak_days = current_streak_days + 1,
      longest_streak_days = greatest(longest_streak_days, current_streak_days + 1),
      last_completed_date_local = p_date,
      grace_days_available = 1,
      updated_at = now()
    where user_id = p_user_id;
  elsif v_days_diff = 2 and v_streak.grace_days_available > 0 then
    update user_streaks set
      current_streak_days = current_streak_days + 1,
      longest_streak_days = greatest(longest_streak_days, current_streak_days + 1),
      last_completed_date_local = p_date,
      grace_days_available = 0,
      updated_at = now()
    where user_id = p_user_id;
  else
    -- Reset streak
    update user_streaks set
      current_streak_days = 1,
      longest_streak_days = greatest(longest_streak_days, 1),
      last_completed_date_local = p_date,
      grace_days_available = 1,
      updated_at = now()
    where user_id = p_user_id;
  end if;
end;
$$;

-- 3. Grant execute to authenticated users so they can call via RPC.
grant execute on function public.update_streak_on_completion(uuid, date) to authenticated;
