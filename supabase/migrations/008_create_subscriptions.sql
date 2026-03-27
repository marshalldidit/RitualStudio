-- ============================================================
-- 008_create_subscriptions.sql
-- Subscriptions table (Stripe placeholder) + auto-create on signup
-- ============================================================

create table public.subscriptions (
  user_id     uuid primary key references public.users(id) on delete cascade,
  plan        text not null default 'free' check (plan in ('free', 'pro')),
  status      text not null default 'active' check (status in ('active', 'canceled', 'past_due')),
  stripe_customer_id     text,
  stripe_subscription_id text,
  current_period_end     timestamptz,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

-- RLS: users can only read their own subscription
alter table public.subscriptions enable row level security;

create policy "Users can read own subscription"
  on public.subscriptions for select
  using (auth.uid() = user_id);

-- Update handle_new_user to also create a free subscription row
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.users (id)
  values (new.id);

  insert into public.user_streaks (user_id)
  values (new.id);

  insert into public.subscriptions (user_id)
  values (new.id);

  return new;
end;
$$;

-- Backfill: create free subscription for any existing users
insert into public.subscriptions (user_id)
select id from public.users
where id not in (select user_id from public.subscriptions)
on conflict (user_id) do nothing;
