# Ritual Studio — Personalization Algorithm (MVP)

This MVP algorithm generates **3 personalized prompts per user per day** (swipe to choose 1), using a **curated prompt library** (no AI required).

## Inputs (from onboarding / user profile)

- `user_goal` (single): habit | skills | portfolio | unstuck | return
- `difficulty_level` (single): beginner | intermediate | advanced
- `subject_preferences` (multi): characters_portraits | environments_landscapes | creatures_fantasy | everyday_objects | fashion_figures | story_scenes | abstract_experimental
- `skill_focus_preferences` (multi): anatomy_proportion | perspective | composition | lighting_shadow | color_mood | gesture_movement | visual_storytelling | speed_efficiency | consistency
- `session_duration` (single): 15 | 30 | 60  (minutes)
- `timezone` (string)
- `streak_state` (object): current_streak_days, grace_days_remaining, etc.
- `prompt_history` (list): prompt_ids shown/completed with dates and selected/completed flags

## Prompt metadata requirements

Each prompt must have:
- `id` (string or int)
- `title`
- `description`
- `subject_tags[]` (one or more)
- `skill_focus_tags[]` (one or more)
- `difficulty_level` (one)
- `time_required` (15|30|60)
- `growth_weight` (0.0–1.0)  
  - 0.0–0.3 comfort-oriented  
  - 0.4–0.7 growth-oriented  
  - 0.8–1.0 stretch / wildcard-friendly

## Output (daily)

A `DailyPromptSet` per user/day:
- `date_local` (YYYY-MM-DD in user timezone)
- `prompt_ids[3]` (ordered)
- `selected_prompt_id` (nullable until user chooses)
- `status`: offered | selected | completed | expired

---

## Algorithm Overview

### Eligibility rules (hard filters)

A prompt is eligible for a user on a given day if all are true:

1. `prompt.difficulty_level == user.difficulty_level`
2. `prompt.time_required <= user.session_duration`
3. `overlap(prompt.subject_tags, user.subject_preferences) >= 1`
4. `prompt.id` NOT shown in the last `RECENCY_WINDOW_DAYS` (default 14)
5. `prompt.id` NOT offered yesterday (guards immediate repeats)
6. Optional: avoid repeating the same primary subject tag > `MAX_SAME_SUBJECT_STREAK` days (default 2)

### Daily set composition (3 roles)

Generate exactly 3 prompts with distinct roles:

1) **Comfort**  
- high match to subject + skill_focus
- lower `growth_weight` preferred (<= 0.35)

2) **Growth**  
- high match to skill_focus
- medium `growth_weight` preferred (0.40–0.75)

3) **Wildcard**  
- still within eligibility, but more exploratory  
- either:
  - weaker subject overlap but strong skill_focus overlap, OR
  - adjacent subject (second-highest preference)  
- higher `growth_weight` allowed (>= 0.60)

### Recycling rule (unused prompts)

User selects 1 of 3. The other 2:
- are returned to the eligible pool
- receive a temporary **cooldown** so they are deprioritized for `COOLDOWN_DAYS` (default 3)

This keeps “3 options” from becoming “same options tomorrow”.

---

## Deterministic scoring

### Tag match scores

Define:

- `subject_match = |prompt.subject_tags ∩ user.subject_preferences|`
- `skill_match = |prompt.skill_focus_tags ∩ user.skill_focus_preferences|`

Normalize lightly (cap at 2 for MVP simplicity):
- `subject_score = min(subject_match, 2)`
- `skill_score = min(skill_match, 2)`

### Goal weight (optional MVP tuning)

Depending on `user_goal`, weight the two match scores:

- habit:   subject_w=1.0, skill_w=0.8
- skills:  subject_w=0.8, skill_w=1.2
- portfolio:subject_w=1.1, skill_w=1.0
- unstuck: subject_w=1.2, skill_w=0.7
- return:  subject_w=1.1, skill_w=0.9

### Base score

`base_score = subject_w*subject_score + skill_w*skill_score`

### Role-specific adjustments

Comfort:
- prefer lower growth_weight
- `role_score = base_score + (0.35 - growth_weight)*0.5`

Growth:
- prefer medium growth_weight
- `role_score = base_score - abs(growth_weight - 0.60)*0.6`

Wildcard:
- allow higher growth_weight and novelty
- add novelty bonus if prompt’s primary subject tag differs from yesterday’s
- `role_score = base_score + (growth_weight - 0.50)*0.4 + novelty_bonus`

`novelty_bonus` is typically 0.0 or 0.3.

---

## Pseudocode (MVP)

Constants:
- `RECENCY_WINDOW_DAYS = 14`
- `COOLDOWN_DAYS = 3`
- `MAX_SAME_SUBJECT_STREAK = 2`

```
function generateDailyPromptSet(user, date_local):
  eligible = all_prompts
    .filter(p => p.difficulty_level == user.difficulty_level)
    .filter(p => p.time_required <= user.session_duration)
    .filter(p => overlap(p.subject_tags, user.subject_preferences) >= 1)
    .filter(p => !shownWithin(p.id, user, RECENCY_WINDOW_DAYS))
    .filter(p => !offeredOn(p.id, user, date_local - 1 day))

  eligible = applySubjectRepeatGuard(eligible, user, MAX_SAME_SUBJECT_STREAK)
  eligible = applyCooldownDeprioritization(eligible, user, COOLDOWN_DAYS)

  comfort_candidates = eligible
    .scoreBy(comfortRoleScore(user, p))
    .sortDesc()

  comfort = pickTopNonConflicting(comfort_candidates, alreadySelected=[])

  growth_candidates = eligible
    .exclude(comfort.id)
    .scoreBy(growthRoleScore(user, p))
    .sortDesc()

  growth = pickTopNonConflicting(growth_candidates, alreadySelected=[comfort])

  wildcard_candidates = eligible
    .exclude([comfort.id, growth.id])
    .scoreBy(wildcardRoleScore(user, p, date_local))
    .sortDesc()

  wildcard = pickTopNonConflicting(wildcard_candidates, alreadySelected=[comfort, growth])

  return DailyPromptSet(date_local, [comfort.id, growth.id, wildcard.id], status="offered")
```

Notes:
- `pickTopNonConflicting` can enforce “don’t pick three prompts with identical subject tags” for variety.
- If pools are too small, relax constraints in order:
  1) allow prompts shown within 14 days but not completed
  2) allow time_required == session_duration + 15 (only if you add 45-minute option later)
  3) allow subject overlap >= 0 (true wildcard) — *last resort*

---

## Implementation notes (Supabase / Postgres)

- Store daily sets in a table keyed by `(user_id, date_local)`
- Generate once per day (on first open, or via scheduled job)
- Always generate using user’s timezone so “today” is correct
