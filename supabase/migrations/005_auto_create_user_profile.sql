-- ============================================================
-- 005_auto_create_user_profile.sql
-- Trigger: auto-create public.users + public.user_streaks rows
-- when a new auth.users row is inserted (i.e. on sign-up)
-- ============================================================

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

  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row
  execute procedure public.handle_new_user();
