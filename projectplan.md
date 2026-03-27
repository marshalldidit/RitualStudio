# Ritual Studio — Project Plan

Track progress across sessions by checking off completed items.

---

## Phase 1: Project Scaffolding
- [ ] Create projectplan.md (this file)
- [ ] Scaffold Expo project (package.json, app.json, tsconfig.json)
- [ ] Install all dependencies
- [ ] Configure NativeWind (babel.config.js, metro.config.js, tailwind.config.js, global.css)
- [ ] Set up design tokens from Foundations.tsx in tailwind.config.js
- [ ] Download Plus Jakarta Sans fonts (Regular, Medium, SemiBold, Bold, ExtraBold)
- [ ] Create .env.example and .gitignore
- [ ] Create root layout (app/_layout.tsx) with font loading and provider shell
- [ ] Verify `npx expo start` launches without errors

## Phase 2: Supabase Setup
- [ ] Create supabase/migrations/001_create_tables.sql (users, prompts, daily_prompt_sets, user_prompt_history, user_streaks, uploads)
- [ ] Create supabase/migrations/002_rls_policies.sql
- [ ] Create supabase/migrations/003_storage_bucket.sql (drawings bucket)
- [ ] Create supabase/migrations/004_seed_prompts.sql (70 existing + new 15-min and 60-min prompts)
- [ ] Create supabase/migrations/005_auto_create_user_profile.sql (trigger on auth.users insert)
- [ ] Create src/lib/supabase.ts (client singleton with SecureStore adapter)
- [ ] Create src/types/database.ts (TypeScript types for all tables)
- [ ] Run migrations against Supabase project and verify

## Phase 3: Navigation Architecture
- [x] Create app/_layout.tsx root with AuthProvider + route guard
- [x] Create app/(auth)/_layout.tsx
- [x] Create app/(auth)/sign-in.tsx (placeholder)
- [x] Create app/(auth)/sign-up.tsx (placeholder)
- [x] Create app/(onboarding)/_layout.tsx with step progress
- [x] Create onboarding step placeholders (goal, level, subjects, skills, duration, reminder, complete)
- [x] Create app/(tabs)/_layout.tsx with 3-tab bar (Home, Calendar, Profile)
- [x] Create tab screen placeholders (index, calendar, profile)
- [x] Create session/[promptId].tsx placeholder
- [x] Create upload/[promptId].tsx placeholder
- [x] Create completion.tsx placeholder
- [x] Verify route guard logic works (auth → onboarding → tabs)

## Phase 4: Authentication Flow
- [x] Harden src/providers/AuthProvider.tsx (error handling, signIn/signUp/signOut/refreshProfile)
- [x] Build src/components/ui/Input.tsx (from DSInput pattern)
- [x] Build src/components/ui/Button.tsx (from DSButton pattern) — already done in Phase 1
- [x] Add loading guard in app/_layout.tsx RootNavigator (prevent blank screen flash)
- [x] Implement app/(auth)/sign-in.tsx (email/password, validation, error banners)
- [x] Implement app/(auth)/sign-up.tsx (email/password/confirm, email confirmation flow)
- [x] Create supabase/migrations/006_security_hardening.sql (streak cheating fix)
- [ ] Run migration 006 against Supabase project
- [ ] Verify: sign up creates user + streak rows, sign in persists across restart
- [ ] Verify: cross-user data isolation (RLS blocks queries to other users' data)

## Phase 5: Onboarding Flow
- [x] Create src/stores/onboardingStore.ts (Zustand)
- [x] Create src/constants/onboarding.ts (option definitions)
- [x] Build src/components/ui/SelectionChip.tsx (from CategoryChip)
- [x] Build src/components/ui/StepProgressBar.tsx (from OnboardingSteps) — done in Phase 3
- [x] Install @react-native-community/datetimepicker
- [x] Implement goal.tsx — "What brings you to Ritual Studio?"
- [x] Implement level.tsx — "How would you describe your current level?"
- [x] Implement subjects.tsx — "What do you want to draw more of?" (multi-select)
- [x] Implement skills.tsx — "What would you like to strengthen?" (multi-select)
- [x] Implement duration.tsx — "How much time can you dedicate each day?"
- [x] Implement reminder.tsx — "When should your studio open each day?"
- [x] Implement complete.tsx — "Your Ritual Begins Today" summary + DB write
- [x] Fix database.ts types (add Relationships for supabase-js v2.98 compat)
- [x] Verify: complete onboarding → users row updated, redirected to home

## Phase 6: Daily Prompt Generation + Home Screen
- [x] Create migration 007: `generate_daily_prompts` Postgres RPC function (personalization algorithm)
- [x] Implement prompt eligibility filtering (difficulty, time, subject overlap, recency)
- [x] Implement scoring (comfort, growth, wildcard roles with goal weights)
- [x] Implement unused prompt cooldown logic + fallback cascade
- [x] Add RPC function + response types to `src/types/database.ts`
- [x] Create `src/stores/dailyPromptsStore.ts` (Zustand store)
- [x] Create `src/hooks/useDailyPrompts.ts` (client hook calling RPC)
- [x] Build `src/components/home/StreakBadge.tsx`
- [x] Build `src/components/home/PromptCard.tsx` with role badges
- [x] Build `src/components/home/PromptCarousel.tsx` (horizontal swipe + dot indicators)
- [x] Implement `app/(tabs)/index.tsx` — Day X, streak, prompt cards, loading/error/empty states, Begin button
- [ ] Verify: prompts display, swipe works, Begin navigates to session

## Phase 8: Active Session (Calm Timer)
- [x] Create src/stores/sessionStore.ts (timestamp-based session engine with state machine)
- [x] Create src/hooks/useSessionTimer.ts (wall-clock timer, background-aware, auto-completion)
- [x] Build src/components/ui/ProgressRing.tsx (reusable SVG ring with reanimated)
- [x] Build src/components/session/TimerRing.tsx (minutes-only display, step-based ring)
- [x] Build src/components/session/PromptDisplay.tsx (role badge + title)
- [x] Build src/components/session/SessionControls.tsx (pause/resume + done CTA)
- [x] Implement app/session/[promptId].tsx — dark bg, calm timer, pause, "I'm Done", back confirmation
- [x] State machine: idle → running → paused → completed_active → ended
- [x] Soft completion: 80% threshold (12/24/48 min), overtime display (+M:SS)
- [x] Duration guard: only 15/30/60 min accepted
- [ ] Verify: timer runs smoothly, handles background, pause/resume, completion, "I'm Done" → upload

## Phase 9: Image Upload
- [x] Build src/components/upload/ImagePreview.tsx
- [x] Build src/components/upload/CaptionInput.tsx
- [x] Implement src/lib/imageUpload.ts (pick, compress, upload to Supabase Storage)
- [x] Implement app/upload/[promptId].tsx — camera/gallery, preview, caption, submit
- [ ] Verify: image uploads to Supabase Storage, uploads row created

## Phase 10: Completion + Streak Update
- [x] Implement src/lib/streakManager.ts (completeRitual: RPC streak update + mark prompt set/history completed)
- [x] Build src/components/completion/CelebrationAnimation.tsx (confetti particles with reanimated)
- [x] Build src/components/completion/StreakUpdate.tsx (streak badge, grace note, milestone messages, new record badge)
- [x] Implement app/completion.tsx — loading/error/incomplete/success states, celebration, haptic feedback, "Back to Home"
- [ ] Verify: streak increments, grace days work, celebration displays

## Phase 11: Streak Calendar
- [x] Build src/components/calendar/CalendarDayCell.tsx (6 states: default, today, completed, missed, rest, empty)
- [x] Build src/components/calendar/MonthNavigator.tsx (prev/next arrows, month/year label)
- [x] Build src/components/calendar/MonthCalendar.tsx (7-column grid with weekday headers)
- [x] Build src/components/calendar/StreakSummaryCard.tsx (current/longest/total stats)
- [x] Implement src/hooks/useStreakCalendar.ts (fetch prompt sets + streak stats, day state logic)
- [x] Implement app/(tabs)/calendar.tsx (header, streak badge, summary card, calendar grid, legend)
- [ ] Verify: calendar shows correct day states, month navigation works

## Phase 12: Profile / Settings
- [x] Build src/components/profile/ProfileHeader.tsx (initials avatar, email, member-since)
- [x] Build src/components/profile/SettingsRow.tsx (SettingsSection + SettingsRow)
- [x] Implement app/(tabs)/profile.tsx (header, preferences summary, account link)
- [x] Implement app/settings/edit-preferences.tsx (reuses onboarding constants, saves to Supabase)
- [x] Implement app/settings/account.tsx (change password, sign out, delete account)
- [x] Upgrade root layout from Slot to Stack for proper back navigation
- [ ] Verify: preferences editable, sign out works, next prompt set uses new prefs

## Phase 13: Stripe Placeholder
- [x] Create supabase/migrations/008_create_subscriptions.sql (table, RLS, trigger update, backfill)
- [x] Create src/types/subscription.ts (SubscriptionPlan, SubscriptionStatus)
- [x] Update src/types/database.ts (subscriptions table + SubscriptionRow)
- [x] Create src/lib/payments.ts (getSubscription, isPro)
- [ ] Verify: subscriptions table exists, all users default to "free"
