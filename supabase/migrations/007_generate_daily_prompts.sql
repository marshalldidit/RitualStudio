-- ============================================================
-- 007_generate_daily_prompts.sql
-- Personalization algorithm: generates 3 daily prompts per user.
-- Returns existing set if already generated (idempotent).
-- ============================================================

create or replace function public.generate_daily_prompts(
  p_user_id uuid,
  p_date_local date
)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  v_existing_set daily_prompt_sets%rowtype;
  v_user users%rowtype;
  v_primary_goal text;
  v_subject_w numeric;
  v_skill_w numeric;
  v_comfort_id int;
  v_growth_id int;
  v_wildcard_id int;
  v_yesterday_subject text;
  v_new_set_id uuid;
  v_result jsonb;
begin
  -- --------------------------------------------------------
  -- 1. Idempotency: return existing set if already generated
  -- --------------------------------------------------------
  select * into v_existing_set
  from daily_prompt_sets
  where user_id = p_user_id and date_local = p_date_local;

  if found then
    select jsonb_build_object(
      'id', v_existing_set.id,
      'user_id', v_existing_set.user_id,
      'date_local', v_existing_set.date_local,
      'prompt_ids', to_jsonb(v_existing_set.prompt_ids),
      'selected_prompt_id', v_existing_set.selected_prompt_id,
      'status', v_existing_set.status,
      'prompts', (
        select jsonb_agg(
          jsonb_build_object(
            'id', p.id,
            'title', p.title,
            'description', p.description,
            'difficulty_level', p.difficulty_level,
            'time_required_minutes', p.time_required_minutes,
            'growth_weight', p.growth_weight,
            'subject_tags', to_jsonb(p.subject_tags),
            'skill_focus_tags', to_jsonb(p.skill_focus_tags),
            'role', case
              when p.id = v_existing_set.prompt_ids[1] then 'comfort'
              when p.id = v_existing_set.prompt_ids[2] then 'growth'
              else 'wildcard'
            end
          ) order by array_position(v_existing_set.prompt_ids, p.id)
        )
        from prompts p
        where p.id = any(v_existing_set.prompt_ids)
      )
    ) into v_result;

    return v_result;
  end if;

  -- --------------------------------------------------------
  -- 2. Fetch user preferences
  -- --------------------------------------------------------
  select * into v_user from users where id = p_user_id;

  if not found then
    raise exception 'User % not found', p_user_id;
  end if;

  if not v_user.onboarding_completed then
    raise exception 'User % has not completed onboarding', p_user_id;
  end if;

  -- --------------------------------------------------------
  -- 3. Parse primary goal and set weights
  -- --------------------------------------------------------
  v_primary_goal := split_part(coalesce(v_user.user_goal, 'habit'), ',', 1);

  case v_primary_goal
    when 'habit' then     v_subject_w := 1.0; v_skill_w := 0.8;
    when 'skills' then    v_subject_w := 0.8; v_skill_w := 1.2;
    when 'portfolio' then v_subject_w := 1.1; v_skill_w := 1.0;
    when 'unstuck' then   v_subject_w := 1.2; v_skill_w := 0.7;
    when 'return' then    v_subject_w := 1.1; v_skill_w := 0.9;
    else                  v_subject_w := 1.0; v_skill_w := 1.0;
  end case;

  -- --------------------------------------------------------
  -- 4. Get yesterday's selected prompt's primary subject
  --    (for wildcard novelty bonus)
  -- --------------------------------------------------------
  select p.subject_tags[1] into v_yesterday_subject
  from daily_prompt_sets dps
  join prompts p on p.id = dps.selected_prompt_id
  where dps.user_id = p_user_id
    and dps.date_local = p_date_local - 1
    and dps.selected_prompt_id is not null;

  -- --------------------------------------------------------
  -- 5. Select COMFORT prompt (growth_weight <= 0.35)
  -- --------------------------------------------------------
  select e.id into v_comfort_id
  from (
    select p.id, p.growth_weight,
      (
        v_subject_w * least(coalesce(array_length(
          array(select unnest(p.subject_tags) intersect select unnest(v_user.subject_preferences)), 1
        ), 0), 2)
        +
        v_skill_w * least(coalesce(array_length(
          array(select unnest(p.skill_focus_tags) intersect select unnest(v_user.skill_focus_preferences)), 1
        ), 0), 2)
      )
      * case when p.id in (
          select uph.prompt_id from user_prompt_history uph
          where uph.user_id = p_user_id
            and uph.was_offered = true and uph.was_selected = false
            and uph.date_local > p_date_local - 3
        ) then 0.5 else 1.0 end
      + (0.35 - p.growth_weight) * 0.5
      as role_score
    from prompts p
    where p.is_active = true
      and p.difficulty_level = v_user.difficulty_level
      and p.time_required_minutes <= v_user.session_duration_minutes
      and p.subject_tags && v_user.subject_preferences
      and p.growth_weight <= 0.35
      and p.id not in (
        select uph.prompt_id from user_prompt_history uph
        where uph.user_id = p_user_id and uph.was_offered = true
          and uph.date_local > p_date_local - 14
      )
      and p.id not in (
        select uph.prompt_id from user_prompt_history uph
        where uph.user_id = p_user_id and uph.was_offered = true
          and uph.date_local = p_date_local - 1
      )
  ) e
  order by e.role_score desc
  limit 1;

  -- Comfort fallback: relax recency, then relax subject overlap
  if v_comfort_id is null then
    select p.id into v_comfort_id
    from prompts p
    where p.is_active = true
      and p.difficulty_level = v_user.difficulty_level
      and p.time_required_minutes <= v_user.session_duration_minutes
      and p.growth_weight <= 0.35
    order by (
      v_subject_w * least(coalesce(array_length(
        array(select unnest(p.subject_tags) intersect select unnest(v_user.subject_preferences)), 1
      ), 0), 2)
      + v_skill_w * least(coalesce(array_length(
        array(select unnest(p.skill_focus_tags) intersect select unnest(v_user.skill_focus_preferences)), 1
      ), 0), 2)
    ) desc
    limit 1;
  end if;

  -- Last resort: any prompt at user's difficulty
  if v_comfort_id is null then
    select p.id into v_comfort_id
    from prompts p
    where p.is_active = true
      and p.difficulty_level = v_user.difficulty_level
      and p.time_required_minutes <= v_user.session_duration_minutes
    order by p.growth_weight asc
    limit 1;
  end if;

  -- --------------------------------------------------------
  -- 6. Select GROWTH prompt (growth_weight 0.40–0.75)
  -- --------------------------------------------------------
  select e.id into v_growth_id
  from (
    select p.id, p.growth_weight,
      (
        v_subject_w * least(coalesce(array_length(
          array(select unnest(p.subject_tags) intersect select unnest(v_user.subject_preferences)), 1
        ), 0), 2)
        +
        v_skill_w * least(coalesce(array_length(
          array(select unnest(p.skill_focus_tags) intersect select unnest(v_user.skill_focus_preferences)), 1
        ), 0), 2)
      )
      * case when p.id in (
          select uph.prompt_id from user_prompt_history uph
          where uph.user_id = p_user_id
            and uph.was_offered = true and uph.was_selected = false
            and uph.date_local > p_date_local - 3
        ) then 0.5 else 1.0 end
      - abs(p.growth_weight - 0.60) * 0.6
      as role_score
    from prompts p
    where p.is_active = true
      and p.difficulty_level = v_user.difficulty_level
      and p.time_required_minutes <= v_user.session_duration_minutes
      and p.subject_tags && v_user.subject_preferences
      and p.growth_weight >= 0.40 and p.growth_weight <= 0.75
      and p.id != coalesce(v_comfort_id, -1)
      and p.id not in (
        select uph.prompt_id from user_prompt_history uph
        where uph.user_id = p_user_id and uph.was_offered = true
          and uph.date_local > p_date_local - 14
      )
      and p.id not in (
        select uph.prompt_id from user_prompt_history uph
        where uph.user_id = p_user_id and uph.was_offered = true
          and uph.date_local = p_date_local - 1
      )
  ) e
  order by e.role_score desc
  limit 1;

  -- Growth fallback
  if v_growth_id is null then
    select p.id into v_growth_id
    from prompts p
    where p.is_active = true
      and p.difficulty_level = v_user.difficulty_level
      and p.time_required_minutes <= v_user.session_duration_minutes
      and p.growth_weight >= 0.40 and p.growth_weight <= 0.75
      and p.id != coalesce(v_comfort_id, -1)
    order by (
      v_subject_w * least(coalesce(array_length(
        array(select unnest(p.subject_tags) intersect select unnest(v_user.subject_preferences)), 1
      ), 0), 2)
      + v_skill_w * least(coalesce(array_length(
        array(select unnest(p.skill_focus_tags) intersect select unnest(v_user.skill_focus_preferences)), 1
      ), 0), 2)
    ) desc
    limit 1;
  end if;

  -- Last resort: any prompt at user's difficulty (exclude comfort)
  if v_growth_id is null then
    select p.id into v_growth_id
    from prompts p
    where p.is_active = true
      and p.difficulty_level = v_user.difficulty_level
      and p.time_required_minutes <= v_user.session_duration_minutes
      and p.id != coalesce(v_comfort_id, -1)
    order by abs(p.growth_weight - 0.60) asc
    limit 1;
  end if;

  -- --------------------------------------------------------
  -- 7. Select WILDCARD prompt (growth_weight >= 0.60)
  -- --------------------------------------------------------
  select e.id into v_wildcard_id
  from (
    select p.id, p.growth_weight,
      (
        v_subject_w * least(coalesce(array_length(
          array(select unnest(p.subject_tags) intersect select unnest(v_user.subject_preferences)), 1
        ), 0), 2)
        +
        v_skill_w * least(coalesce(array_length(
          array(select unnest(p.skill_focus_tags) intersect select unnest(v_user.skill_focus_preferences)), 1
        ), 0), 2)
      )
      * case when p.id in (
          select uph.prompt_id from user_prompt_history uph
          where uph.user_id = p_user_id
            and uph.was_offered = true and uph.was_selected = false
            and uph.date_local > p_date_local - 3
        ) then 0.5 else 1.0 end
      + (p.growth_weight - 0.50) * 0.4
      + case when p.subject_tags[1] is distinct from v_yesterday_subject then 0.3 else 0.0 end
      as role_score
    from prompts p
    where p.is_active = true
      and p.difficulty_level = v_user.difficulty_level
      and p.time_required_minutes <= v_user.session_duration_minutes
      and p.subject_tags && v_user.subject_preferences
      and p.growth_weight >= 0.60
      and p.id != coalesce(v_comfort_id, -1)
      and p.id != coalesce(v_growth_id, -1)
      and p.id not in (
        select uph.prompt_id from user_prompt_history uph
        where uph.user_id = p_user_id and uph.was_offered = true
          and uph.date_local > p_date_local - 14
      )
      and p.id not in (
        select uph.prompt_id from user_prompt_history uph
        where uph.user_id = p_user_id and uph.was_offered = true
          and uph.date_local = p_date_local - 1
      )
  ) e
  order by e.role_score desc
  limit 1;

  -- Wildcard fallback
  if v_wildcard_id is null then
    select p.id into v_wildcard_id
    from prompts p
    where p.is_active = true
      and p.difficulty_level = v_user.difficulty_level
      and p.time_required_minutes <= v_user.session_duration_minutes
      and p.growth_weight >= 0.60
      and p.id != coalesce(v_comfort_id, -1)
      and p.id != coalesce(v_growth_id, -1)
    order by (
      v_subject_w * least(coalesce(array_length(
        array(select unnest(p.subject_tags) intersect select unnest(v_user.subject_preferences)), 1
      ), 0), 2)
      + v_skill_w * least(coalesce(array_length(
        array(select unnest(p.skill_focus_tags) intersect select unnest(v_user.skill_focus_preferences)), 1
      ), 0), 2)
    ) desc
    limit 1;
  end if;

  -- Last resort: any remaining prompt
  if v_wildcard_id is null then
    select p.id into v_wildcard_id
    from prompts p
    where p.is_active = true
      and p.difficulty_level = v_user.difficulty_level
      and p.time_required_minutes <= v_user.session_duration_minutes
      and p.id != coalesce(v_comfort_id, -1)
      and p.id != coalesce(v_growth_id, -1)
    order by p.growth_weight desc
    limit 1;
  end if;

  -- --------------------------------------------------------
  -- 8. Guard: need at least 1 prompt
  -- --------------------------------------------------------
  if v_comfort_id is null and v_growth_id is null and v_wildcard_id is null then
    raise exception 'No eligible prompts found for user %', p_user_id;
  end if;

  -- --------------------------------------------------------
  -- 9. Insert daily_prompt_sets row
  -- --------------------------------------------------------
  v_new_set_id := gen_random_uuid();

  insert into daily_prompt_sets (id, user_id, date_local, prompt_ids, status)
  values (
    v_new_set_id,
    p_user_id,
    p_date_local,
    array[v_comfort_id, v_growth_id, v_wildcard_id],
    'offered'
  );

  -- --------------------------------------------------------
  -- 10. Insert user_prompt_history rows
  -- --------------------------------------------------------
  insert into user_prompt_history (user_id, date_local, prompt_id, was_offered)
  select p_user_id, p_date_local, unnest(array[v_comfort_id, v_growth_id, v_wildcard_id]), true
  where v_comfort_id is not null;

  -- --------------------------------------------------------
  -- 11. Build and return result
  -- --------------------------------------------------------
  select jsonb_build_object(
    'id', v_new_set_id,
    'user_id', p_user_id,
    'date_local', p_date_local,
    'prompt_ids', to_jsonb(array[v_comfort_id, v_growth_id, v_wildcard_id]),
    'selected_prompt_id', null,
    'status', 'offered',
    'prompts', (
      select jsonb_agg(
        jsonb_build_object(
          'id', p.id,
          'title', p.title,
          'description', p.description,
          'difficulty_level', p.difficulty_level,
          'time_required_minutes', p.time_required_minutes,
          'growth_weight', p.growth_weight,
          'subject_tags', to_jsonb(p.subject_tags),
          'skill_focus_tags', to_jsonb(p.skill_focus_tags),
          'role', case
            when p.id = v_comfort_id then 'comfort'
            when p.id = v_growth_id then 'growth'
            else 'wildcard'
          end
        ) order by array_position(
          array[v_comfort_id, v_growth_id, v_wildcard_id], p.id
        )
      )
      from prompts p
      where p.id in (v_comfort_id, v_growth_id, v_wildcard_id)
    )
  ) into v_result;

  return v_result;
end;
$$;

-- Grant execute to authenticated users
grant execute on function public.generate_daily_prompts(uuid, date) to authenticated;
