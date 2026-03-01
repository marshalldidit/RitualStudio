# Ritual Studio — Data Model Mapping (Onboarding → Backend Logic)

This document maps onboarding answers to stored user fields and the backend behaviors they drive.

## Onboarding Questions → Stored Fields

| Onboarding Question | Response Type | Stored Field(s) | Used For (Backend Logic) |
|---|---:|---|---|
| What brings you to Ritual Studio? | single select | `user_goal` | Adjust prompt weighting (subject vs skill focus), tone, and growth vs comfort mix |
| How would you describe your current level? | single select | `difficulty_level` | Hard filter for prompt difficulty; controls progression eligibility |
| What do you want to draw more of? | multi select | `subject_preferences[]` | Hard filter + weighting for subject tags during prompt selection |
| What would you like to strengthen? | multi select | `skill_focus_preferences[]` | Hard filter + weighting for skill_focus tags; drives “growth prompt” selection |
| How much time can you dedicate each day? | single select | `session_duration_minutes` | Hard filter for prompt time_required; timer default duration |
| When should your studio open each day? | time select | `reminder_time_local`, `timezone` | Notification scheduling (local time), “day boundary” calculations |

## Additional runtime fields (not onboarding)

| Field | Stored Where | Used For |
|---|---|---|
| `prompt_history` (offered/selected/completed) | `user_prompt_history` table | Recency filtering, cooldown, anti-repeat rules, analytics |
| `daily_prompt_sets` | `daily_prompt_sets` table | Ensures day-locked prompts; 3 prompts/day; supports swipe selection |
| `streak_state` | `user_streaks` table | Current streak, grace days, last_completed_date; affects messaging and optional difficulty scaling |
| `subscription_status` | `subscriptions` table | Feature gating (later), premium content, etc. |
| `uploads` | `uploads` table + storage | Links completion to streak; personal gallery and calendar |

---

## Suggested Tables (MVP)

### `users`
- `id` (uuid, pk)
- `created_at`
- `timezone`
- `user_goal`
- `difficulty_level`
- `session_duration_minutes`
- `reminder_time_local` (HH:MM)
- `subject_preferences` (text[] or join table)
- `skill_focus_preferences` (text[] or join table)

### `prompts`
- `id` (pk)
- `title`
- `description`
- `difficulty_level`
- `time_required_minutes`
- `growth_weight` (numeric)
- `subject_tags` (text[])
- `skill_focus_tags` (text[])
- (optional) `is_active` (bool)

### `daily_prompt_sets`
- `id` (pk)
- `user_id` (fk users)
- `date_local` (date)  ← day-locked
- `prompt_ids` (int[] or uuid[])
- `selected_prompt_id` (nullable)
- `status` (offered|selected|completed|expired)
- `created_at`

Unique constraint: `(user_id, date_local)`

### `user_prompt_history`
- `id` (pk)
- `user_id`
- `date_local`
- `prompt_id`
- `was_offered` (bool)
- `was_selected` (bool)
- `was_completed` (bool)
- `completed_at` (timestamp, nullable)

### `user_streaks`
- `user_id` (pk)
- `current_streak_days`
- `longest_streak_days`
- `last_completed_date_local` (date, nullable)
- `grace_days_available` (int)  ← used for “not punishing” streak behavior
- `updated_at`

### `uploads`
- `id` (pk)
- `user_id`
- `prompt_id`
- `date_local`
- `storage_path`
- `caption` (nullable)
- `created_at`

---

## Logic Hooks (Where onboarding fields are used)

### Daily prompt generation
Uses:
- `difficulty_level`
- `session_duration_minutes`
- `subject_preferences`
- `skill_focus_preferences`
- `user_goal`
- `user_prompt_history` (recency / cooldown)
Creates/updates:
- `daily_prompt_sets`

### Completion
On upload submit:
- mark `daily_prompt_sets.status = completed`
- update `user_prompt_history.was_completed = true`
- update `user_streaks` (increment, apply grace rules)

### Notifications
Uses:
- `reminder_time_local`
- `timezone`
- `user_streaks.last_completed_date_local` (for gentle reminders / grace warnings)
