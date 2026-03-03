-- ============================================================
-- 002_rls_policies.sql
-- Row-level security for all tables
-- ============================================================

-- Enable RLS on all tables
alter table public.users enable row level security;
alter table public.prompts enable row level security;
alter table public.daily_prompt_sets enable row level security;
alter table public.user_prompt_history enable row level security;
alter table public.user_streaks enable row level security;
alter table public.uploads enable row level security;

-- ---- users ----
create policy "Users can read their own profile"
  on public.users for select
  using (auth.uid() = id);

create policy "Users can update their own profile"
  on public.users for update
  using (auth.uid() = id);

-- ---- prompts ----
-- Public read (all authenticated users can browse prompts)
create policy "Authenticated users can read prompts"
  on public.prompts for select
  to authenticated
  using (is_active = true);

-- ---- daily_prompt_sets ----
create policy "Users can read their own prompt sets"
  on public.daily_prompt_sets for select
  using (auth.uid() = user_id);

create policy "Users can insert their own prompt sets"
  on public.daily_prompt_sets for insert
  with check (auth.uid() = user_id);

create policy "Users can update their own prompt sets"
  on public.daily_prompt_sets for update
  using (auth.uid() = user_id);

-- ---- user_prompt_history ----
create policy "Users can read their own prompt history"
  on public.user_prompt_history for select
  using (auth.uid() = user_id);

create policy "Users can insert their own prompt history"
  on public.user_prompt_history for insert
  with check (auth.uid() = user_id);

create policy "Users can update their own prompt history"
  on public.user_prompt_history for update
  using (auth.uid() = user_id);

-- ---- user_streaks ----
create policy "Users can read their own streak"
  on public.user_streaks for select
  using (auth.uid() = user_id);

create policy "Users can update their own streak"
  on public.user_streaks for update
  using (auth.uid() = user_id);

-- ---- uploads ----
create policy "Users can read their own uploads"
  on public.uploads for select
  using (auth.uid() = user_id);

create policy "Users can insert their own uploads"
  on public.uploads for insert
  with check (auth.uid() = user_id);
