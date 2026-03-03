-- ============================================================
-- 001_create_tables.sql
-- Core tables for Ritual Studio
-- ============================================================

-- Users (extends auth.users with onboarding preferences)
create table public.users (
  id                        uuid primary key references auth.users(id) on delete cascade,
  created_at                timestamptz not null default now(),
  timezone                  text,
  user_goal                 text,
  difficulty_level          text,
  session_duration_minutes  int,
  reminder_time_local       time,
  subject_preferences       text[] not null default '{}',
  skill_focus_preferences   text[] not null default '{}',
  onboarding_completed      boolean not null default false
);

-- Prompts (curated library)
create table public.prompts (
  id                    serial primary key,
  title                 text not null,
  description           text not null,
  difficulty_level      text not null check (difficulty_level in ('beginner', 'intermediate', 'advanced')),
  time_required_minutes int not null,
  growth_weight         numeric(3,2) not null check (growth_weight >= 0 and growth_weight <= 1),
  subject_tags          text[] not null default '{}',
  skill_focus_tags      text[] not null default '{}',
  is_active             boolean not null default true,
  created_at            timestamptz not null default now()
);

-- Daily prompt sets (3 prompts offered per user per day)
create table public.daily_prompt_sets (
  id                  uuid primary key default gen_random_uuid(),
  user_id             uuid not null references public.users(id) on delete cascade,
  date_local          date not null,
  prompt_ids          int[] not null,
  selected_prompt_id  int references public.prompts(id),
  status              text not null default 'offered' check (status in ('offered', 'selected', 'completed', 'expired')),
  created_at          timestamptz not null default now(),
  unique (user_id, date_local)
);

-- User prompt history (per-prompt tracking for recency / cooldown)
create table public.user_prompt_history (
  id            uuid primary key default gen_random_uuid(),
  user_id       uuid not null references public.users(id) on delete cascade,
  date_local    date not null,
  prompt_id     int not null references public.prompts(id),
  was_offered   boolean not null default false,
  was_selected  boolean not null default false,
  was_completed boolean not null default false,
  completed_at  timestamptz
);

create index on public.user_prompt_history (user_id, date_local);
create index on public.user_prompt_history (user_id, prompt_id);

-- User streaks
create table public.user_streaks (
  user_id                   uuid primary key references public.users(id) on delete cascade,
  current_streak_days       int not null default 0,
  longest_streak_days       int not null default 0,
  last_completed_date_local date,
  grace_days_available      int not null default 1,
  updated_at                timestamptz not null default now()
);

-- Uploads (links drawings to prompts/dates)
create table public.uploads (
  id            uuid primary key default gen_random_uuid(),
  user_id       uuid not null references public.users(id) on delete cascade,
  prompt_id     int not null references public.prompts(id),
  date_local    date not null,
  storage_path  text not null,
  caption       text,
  created_at    timestamptz not null default now()
);

create index on public.uploads (user_id, date_local);
