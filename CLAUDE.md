# Ritual Studio

A habit-forming mobile app for artists and illustrators who want daily drawing discipline. Users receive 3 personalized daily prompts (swipe to choose 1), draw during a timed session, upload their work, and maintain streaks.

## Tech Stack

- **Expo SDK 55** with **Expo Router** (file-based routing, `~55.0.0` version scheme for all expo packages)
- **TypeScript** (strict mode, path alias `@/*` → `./src/*`)
- **NativeWind v4** for Tailwind-based styling in React Native
- **Supabase**: Postgres, Auth (email/password), Storage (image uploads), Edge Functions
- **Zustand** for local UI state
- **react-native-reanimated** for animations
- **date-fns** for timezone-aware date logic
- **Plus Jakarta Sans** font (5 weights: 400, 500, 600, 700, 800) via `@expo-google-fonts/plus-jakarta-sans`

## Project Structure

```
app/                          # Expo Router file-based routes
  _layout.tsx                 # Root layout: font loading, splash screen, providers
  index.tsx                   # Current: design system demo screen
  (auth)/                     # Auth group (sign-in, sign-up) — not yet built
  (onboarding)/               # 6-step onboarding + completion — not yet built
  (tabs)/                     # 3-tab bar (Home, Calendar, Profile) — not yet built
  session/[promptId].tsx      # Drawing timer session — not yet built
  upload/[promptId].tsx       # Image upload — not yet built
  completion.tsx              # Celebration screen — not yet built

src/
  theme/                      # Design tokens (StyleSheet-compatible, NOT NativeWind classes)
    colors.ts                 # Brand Yellow (50-800), Neutral Dark (50-900), semantic
    typography.ts             # fontFamily map, typeStyles presets (display → caption)
    spacing.ts                # 4px grid: xs(4) sm(8) md(12) base(16) lg(20) xl(24) 2xl(32) 3xl(40) 4xl(48)
    radius.ts                 # sm(8) md(12) lg(16) xl(20) 2xl(24) full(9999)
    shadows.ts                # flat, lifted, raised, floating, brandGlow (RN shadow props)
    index.ts                  # Barrel export
  components/ui/              # Core UI primitives (StyleSheet.create, token-based)
    RSText.tsx                # variant prop selects typography preset, color override
    Button.tsx                # 5 variants (primary/cta/outline/ghost/danger), 3 sizes, pill shape
    Card.tsx                  # default (white + lifted) / active (brand highlight + glow)
    Screen.tsx                # SafeAreaView wrapper with background color
    Input.tsx                 # Text input with focus/error/disabled states, password toggle
    StepProgressBar.tsx       # Animated onboarding step indicator dots
    TabBar.tsx                # Bottom tab bar with active pill highlight
  components/                 # Feature components (organized by feature: home/, session/, etc.)
  providers/
    AuthProvider.tsx           # Auth context: session, userProfile, signIn/signUp/signOut/resetPassword/refreshProfile
  hooks/
    useProtectedRoute.ts      # Route guard: no session→auth, !onboarding→onboarding, else→tabs
  stores/                     # Zustand stores
  lib/                        # Utilities (supabase client, image upload, streak manager)
  types/                      # TypeScript type definitions
  constants/                  # Static data and option definitions

supabase/
  migrations/                 # 6 SQL migration files (001–006)
  functions/                  # Edge Functions (prompt generation) — not yet created
```

## Design System

The design system was translated from a web-based Vite/React/Tailwind reference project located at `Design System Layout Creation/`. That folder is excluded from TypeScript compilation (see `tsconfig.json` `exclude`). It serves as a **visual reference only** — do not import from it.

### Two styling approaches coexist

1. **`src/theme/` + `StyleSheet.create`** — Used for reusable UI primitives in `src/components/ui/`. These are the source-of-truth design tokens.
2. **NativeWind/Tailwind classes** — Available for screen layouts and one-off styling in `app/` route files. Token values are duplicated in `tailwind.config.js`.

When building new UI primitives, use `StyleSheet.create` with imports from `src/theme/`. When laying out screens, NativeWind classes are fine.

### Key design tokens

**Colors:**
| Token | Hex | Usage |
|---|---|---|
| `brand.400` | `#F9C01E` | Primary brand yellow, CTAs, active states |
| `brand.100` | `#FFF3C4` | Active card/tab backgrounds, completed day cells |
| `dark.900` | `#1A1A1A` | Primary text, primary buttons |
| `dark.500` | `#888886` | Secondary text |
| `dark.100` | `#EEEEEA` | Borders, dividers |
| `background` | `#FAFAF5` | Screen background |
| `surface` | `#FFFFFF` | Card surfaces |
| `error` | `#E84040` | Error states, danger buttons |
| `success` | `#4CAF7D` | Success states |

**Typography scale:** Display (48/800) → H1 (32/700) → H2 (24/700) → H3 (20/700) → H4 (17/600) → Body Large (16/400) → Body (14/400) → Label (13/600 uppercase) → Caption (11/400)

**Shadows:** `lifted` (cards at rest) → `raised` (interactive hover) → `floating` (modals/FABs) → `brandGlow` (accent yellow shadow)

**Radius:** `sm` 8 (chips) → `md` 12 (inputs) → `lg` 16 (cards) → `xl` 20 (large cards) → `2xl` 24 (modals) → `full` 9999 (pill buttons)

### Component patterns from the web design system

When building new RN components, reference these web originals for visual behavior:

| RN Component | Web Reference | Key Details |
|---|---|---|
| Button | `ds/ButtonComponents.tsx` DSButton | 5 variants, 3 sizes, pill (`rounded-full`), disabled opacity 0.4 |
| Input | `ds/FormComponents.tsx` DSInput | 2px border, `rounded-2xl`, yellow focus glow (`rgba(249,192,30,0.15)`), error/success borders |
| SelectionChip | `ds/GoalComponents.tsx` CategoryChip | Active: `bg-brand-400 border-brand-400`, inactive: `bg-white border-dark-100` |
| Card | `ds/CardComponents.tsx` HabitCard | Active state: `bg-brand-100 border-brand-400` |
| StreakBadge | `ds/CalendarComponents.tsx` | `bg-brand-100 border-brand-400` 2px border, fire emoji + count |
| DayCell | `ds/CalendarComponents.tsx` DayPill | 6 states: default, today, active, completed, missed, rest |
| StepProgressBar | `ds/NavigationComponents.tsx` OnboardingSteps | Current dot: 28px wide `bg-brand-400`, completed: 8px `bg-dark-900`, future: 8px `bg-dark-100` |
| TabBar | `ds/NavigationComponents.tsx` BottomTabBar | Active: `bg-brand-100` pill + `dark-900` icon, inactive: `dark-300` icon |
| ProgressRing | `ds/MiscComponents.tsx` | SVG circle, `brand-400` stroke on `dark-100` track |
| Toast | `ds/NavigationComponents.tsx` DSToast | 4 types: success/warning/error/info with semantic colors |

## Database Schema (6 tables)

Defined in `02_data_model_mapping.md`. Not yet implemented as SQL migrations.

1. **`users`** — extends `auth.users` with onboarding preferences (`user_goal`, `difficulty_level`, `subject_preferences[]`, `skill_focus_preferences[]`, `session_duration_minutes`, `reminder_time_local`, `timezone`, `onboarding_completed`)
2. **`prompts`** — curated library with `title`, `description`, `difficulty_level`, `time_required_minutes`, `growth_weight`, `subject_tags[]`, `skill_focus_tags[]`
3. **`daily_prompt_sets`** — `(user_id, date_local)` unique, stores 3 `prompt_ids`, `selected_prompt_id`, `status` (offered/selected/completed/expired)
4. **`user_prompt_history`** — per-prompt tracking: `was_offered`, `was_selected`, `was_completed`
5. **`user_streaks`** — `current_streak_days`, `longest_streak_days`, `last_completed_date_local`, `grace_days_available`
6. **`uploads`** — links drawings to prompts/dates with `storage_path` and optional `caption`

## Personalization Algorithm

Defined in `01_personalization_algorithm_mvp.md`. Runs as a Supabase Edge Function.

**Core flow:**
1. Filter eligible prompts by: difficulty match, time ≤ session duration, subject tag overlap ≥ 1, not shown in last 14 days, not offered yesterday
2. Score each prompt using goal-weighted tag matching (`base_score = subject_w * subject_score + skill_w * skill_score`)
3. Select 3 prompts with distinct roles:
   - **Comfort** — high match, low growth_weight (≤ 0.35)
   - **Growth** — skill-focused, medium growth_weight (0.40–0.75)
   - **Wildcard** — exploratory, higher growth_weight (≥ 0.60), novelty bonus
4. Unused prompts get 3-day cooldown to prevent repetition

## Streak Logic

1 missed day is forgiven (grace), 2 consecutive missed days resets the streak:

```
daysDiff = today - lastCompletedDate
if daysDiff == 0: no change (already completed today)
if daysDiff == 1: streak + 1, reset grace to 1
if daysDiff == 2 && grace > 0: streak + 1, grace = 0
if daysDiff >= 3, or (daysDiff == 2 && grace == 0): streak resets to 1, grace = 1
```

## Navigation Architecture

Route guard logic in root layout:
- No session → `/(auth)/sign-in`
- Session but `onboarding_completed === false` → `/(onboarding)/goal`
- Session and onboarding complete → `/(tabs)`

**Tab bar:** 3 tabs — Home (daily prompt), Calendar (streak), Profile (settings)

## Onboarding Flow (6 steps + completion)

| Step | Field | Input Type |
|---|---|---|
| 1. "What brings you to Ritual Studio?" | `user_goal` | Multi-select (5 options: habit/skills/portfolio/unstuck/return) — stored as comma-separated string |
| 2. "How would you describe your current level?" | `difficulty_level` | Single select (3: beginner/intermediate/advanced) |
| 3. "What do you want to draw more of?" | `subject_preferences[]` | Multi-select chips (7 subjects) |
| 4. "What would you like to strengthen?" | `skill_focus_preferences[]` | Multi-select chips (9 skills) |
| 5. "How much time can you dedicate each day?" | `session_duration_minutes` | Single select (15/30/60 min) |
| 6. "When should your studio open each day?" | `reminder_time_local`, `timezone` | Time picker + notification permission |

**Completion screen:** "Your Ritual Begins Today" — summary of choices, "Begin Day 1" CTA. Writes all data to `public.users`, sets `onboarding_completed = true`.

## Core User Flow

1. **Home** — "Day X" label, streak indicator, swipe through 3 prompt cards (Comfort/Growth/Wildcard), tap "Begin"
2. **Session** — Dark background, calm circular timer (minutes only, no ticking seconds), "I'm Done" CTA. Timer must feel like protected studio time, not a countdown race.
3. **Upload** — Camera or gallery via `expo-image-picker`, square crop, optional caption, submit to Supabase Storage
4. **Completion** — "Day X Complete" / "You showed up." with streak update, subtle celebration animation, haptic feedback

## Prompt Seed Data

70 existing prompts at 30 min in `prompts_seed_v0.json`. Need expansion:
- ~20-25 new 15-minute prompts (quick sketches, gesture drawings)
- ~15-20 new 60-minute prompts (deeper studies, multi-element compositions)

Filter: `time_required <= session_duration` (15-min users get only 15-min prompts; 60-min users get all)

## Planning Documents

| File | Purpose |
|---|---|
| `projectplan.md` | Phase-by-phase checklist for tracking progress |
| `01_personalization_algorithm_mvp.md` | Complete prompt selection algorithm spec |
| `02_data_model_mapping.md` | Database schema and onboarding-to-backend field mapping |
| `03_curated_prompts_v0.md` | 70 curated drawing prompts (reference) |
| `prompts_seed_v0.json` | Seed data JSON for database insertion |

## Build & Run

```bash
# Load nvm (required on this machine)
export NVM_DIR="$HOME/.nvm" && [ -s "$NVM_DIR/nvm.sh" ] && . "$NVM_DIR/nvm.sh"

# Install dependencies
npm install --legacy-peer-deps

# Type check
npx tsc --noEmit

# Start dev server
npx expo start

# Start with web preview
npx expo start --web
```

Note: `--legacy-peer-deps` is needed due to minor peer dependency version mismatches between react, react-native, and @types/react in the Expo SDK 55 ecosystem.

## Development Guidelines

- **iOS and Android only** — web support is installed for preview convenience but is not a target platform
- **Portrait orientation only** (`app.json`)
- UI primitives go in `src/components/ui/` using `StyleSheet.create` + theme tokens
- Feature components go in `src/components/{feature}/`
- Supabase client will use `expo-secure-store` for session persistence
- All date logic must be timezone-aware (user's `timezone` field + `date-fns`)
- The timer screen should feel calm — no aggressive countdown, no red warnings, minutes-only display
- Haptic feedback via `expo-haptics` for key moments (completion, streak milestones)

## Current Status

**Phase 1: Complete** — Project scaffolded, dependencies installed, NativeWind configured, design tokens translated, Metro bundler verified.

**Phase 2: Complete** — Supabase setup: 5 migrations (tables, RLS, storage, seed data, user trigger), typed client singleton with SecureStore adapter, 105 prompts seeded.

**Phase 3: Complete** — Navigation architecture: route guards (`useProtectedRoute`), auth/onboarding/tabs route groups, tab bar, placeholder screens.

**Phase 4: Complete** — Authentication flow: AuthProvider with signIn/signUp/signOut/resetPassword/refreshProfile + error mapping, Input.tsx component, sign-in/sign-up/forgot-password screens with client validation and error banners, loading guard in root layout, migration 006 (streak security hardening — removed direct user_streaks UPDATE, added server-side `update_streak_on_completion` function).

**Phase 5: Complete** — Onboarding flow: Zustand store (`onboardingStore`), constants (`onboarding.ts`), SelectionChip component, 6-step screens (goal multi-select, level, subjects, skills, duration, reminder with platform-aware time picker), completion screen with summary + edit links + Supabase write + haptic feedback. Fixed `database.ts` types for supabase-js v2.98 (`Relationships` key). Installed `@react-native-community/datetimepicker`.

**Phase 6: Complete** — Daily prompt generation + Home screen: Postgres RPC function `generate_daily_prompts` (migration 007) with full personalization algorithm (eligibility filtering, goal-weighted scoring, comfort/growth/wildcard role selection, cooldown logic, fallback cascade). Added `DailyPromptsResponse`/`DailyPromptWithRole` types, `dailyPromptsStore` (Zustand), `useDailyPrompts` hook. Built `StreakBadge`, `PromptCard` (with role badges), `PromptCarousel` (FlatList snap + animated dot indicators). Home screen with loading/error/empty states, streak display, and "Begin Drawing" CTA that selects prompt and navigates to session.

**Phase 8: Complete** — Active session (calm timer screen): Timestamp-based session engine (`sessionStore`) with explicit state machine (idle/running/paused/completed_active/ended). Only 15/30/60 min durations accepted. Soft completion model with 80% early-complete threshold (12/24/48 min). Wall-clock timer via `useSessionTimer` hook (background-aware, no auto-pause). Reusable `ProgressRing` (SVG + reanimated). Minutes-only display with step-based ring progress. Pause/resume, overtime display (+M:SS), one-time completion haptic, back-button confirmation dialog with threshold-based complete/incomplete logic.

**Next: Phase 9** — Image upload.
