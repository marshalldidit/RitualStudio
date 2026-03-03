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
- [ ] Create src/stores/onboardingStore.ts (Zustand)
- [ ] Create src/constants/onboarding.ts (option definitions)
- [ ] Build src/components/ui/SelectionChip.tsx (from CategoryChip)
- [ ] Build src/components/ui/SingleSelectCard.tsx
- [ ] Build src/components/ui/StepProgressBar.tsx (from OnboardingSteps)
- [ ] Implement goal.tsx — "What brings you to Ritual Studio?"
- [ ] Implement level.tsx — "How would you describe your current level?"
- [ ] Implement subjects.tsx — "What do you want to draw more of?" (multi-select)
- [ ] Implement skills.tsx — "What would you like to strengthen?" (multi-select)
- [ ] Implement duration.tsx — "How much time can you dedicate each day?"
- [ ] Implement reminder.tsx — "When should your studio open each day?"
- [ ] Implement complete.tsx — "Your Ritual Begins Today" summary + "Begin Day 1"
- [ ] Verify: complete onboarding → users row updated, redirected to home

## Phase 6: Daily Prompt Generation
- [ ] Create src/types/prompts.ts
- [ ] Implement supabase/functions/generate-daily-prompts/index.ts (Edge Function)
- [ ] Implement prompt eligibility filtering (difficulty, time, subject overlap, recency)
- [ ] Implement scoring (comfort, growth, wildcard roles with goal weights)
- [ ] Implement unused prompt cooldown logic
- [ ] Create src/hooks/useDailyPrompts.ts (client hook)
- [ ] Verify: Edge Function generates 3 prompts, caches in daily_prompt_sets

## Phase 7: Home Screen
- [ ] Build src/components/home/GreetingHeader.tsx
- [ ] Build src/components/home/PromptCard.tsx
- [ ] Build src/components/home/PromptCarousel.tsx (horizontal swipe)
- [ ] Build src/components/home/PromptRoleBadge.tsx
- [ ] Build src/components/home/StreakBadgeInline.tsx
- [ ] Build src/components/ui/Badge.tsx, SkeletonLoader.tsx, EmptyState.tsx, StreakBadge.tsx
- [ ] Implement app/(tabs)/index.tsx — Day X, streak, cards, Begin button
- [ ] Verify: prompts display, swipe works, Begin navigates to session

## Phase 8: Active Session (Calm Timer)
- [ ] Build src/components/session/TimerRing.tsx (smooth circular countdown)
- [ ] Build src/components/session/PromptDisplay.tsx
- [ ] Build src/components/session/SessionControls.tsx
- [ ] Implement src/hooks/useTimer.ts (background-aware, minutes-only display)
- [ ] Build src/components/ui/ProgressRing.tsx
- [ ] Implement app/session/[promptId].tsx — dark bg, calm timer, "I'm Done"
- [ ] Verify: timer runs smoothly, handles background, "I'm Done" → upload

## Phase 9: Image Upload
- [ ] Build src/components/upload/ImagePreview.tsx
- [ ] Build src/components/upload/CaptionInput.tsx
- [ ] Implement src/lib/imageUpload.ts (pick, compress, upload to Supabase Storage)
- [ ] Implement app/upload/[promptId].tsx — camera/gallery, preview, caption, submit
- [ ] Verify: image uploads to Supabase Storage, uploads row created

## Phase 10: Completion + Streak Update
- [ ] Implement src/lib/streakManager.ts (grace day logic)
- [ ] Build src/components/completion/CelebrationAnimation.tsx
- [ ] Build src/components/completion/StreakUpdate.tsx
- [ ] Implement app/completion.tsx — "Day X Complete" / "You showed up."
- [ ] Verify: streak increments, grace days work, celebration displays

## Phase 11: Streak Calendar
- [ ] Build src/components/calendar/MonthCalendar.tsx
- [ ] Build src/components/calendar/CalendarDayCell.tsx (6 DayPill states)
- [ ] Build src/components/calendar/StreakSummaryCard.tsx
- [ ] Build src/components/calendar/MonthNavigator.tsx
- [ ] Build src/components/ui/StatCard.tsx, DayCell.tsx
- [ ] Implement src/hooks/useStreakCalendar.ts
- [ ] Implement app/(tabs)/calendar.tsx
- [ ] Verify: calendar shows correct day states, month navigation works

## Phase 12: Profile / Settings
- [ ] Build src/components/profile/ProfileHeader.tsx
- [ ] Build src/components/profile/SettingsSection.tsx, SettingsRow.tsx
- [ ] Build src/components/ui/Avatar.tsx, Toggle.tsx
- [ ] Implement app/(tabs)/profile.tsx
- [ ] Implement app/settings/edit-preferences.tsx (reuses onboarding components)
- [ ] Implement app/settings/account.tsx (change password, sign out, delete)
- [ ] Verify: preferences editable, sign out works, next prompt set uses new prefs

## Phase 13: Stripe Placeholder
- [ ] Create supabase/migrations/006_create_subscriptions.sql
- [ ] Create src/lib/payments.ts (PaymentService interface)
- [ ] Create src/types/subscription.ts
- [ ] Verify: subscriptions table exists, all users default to "free"
