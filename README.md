# Ritual Studio

A habit-forming mobile app for artists and illustrators who want daily drawing discipline. Build a consistent creative practice through personalized daily prompts, timed drawing sessions, and streak tracking.

## How It Works

1. **Personalized prompts** — Each day, receive 3 drawing prompts tailored to your skill level, interests, and goals. Swipe to choose one.
2. **Timed sessions** — Draw in a calm, focused timer environment designed to feel like protected studio time.
3. **Upload & track** — Photograph or upload your drawing to log your session and build your personal gallery.
4. **Maintain streaks** — Stay consistent and watch your streak grow. Miss a day? One grace day keeps your streak alive.

## Tech Stack

- **React Native** (Expo SDK 55) with Expo Router
- **TypeScript**
- **NativeWind v4** (Tailwind CSS for React Native)
- **Supabase** (Postgres, Auth, Storage, Edge Functions)
- **Zustand** for state management
- **react-native-reanimated** for animations

## Getting Started

### Prerequisites

- Node.js 18+
- npm
- [Expo Go](https://expo.dev/go) on your iOS or Android device (for development)

### Setup

```bash
# Install dependencies
npm install --legacy-peer-deps

# Copy environment variables
cp .env.example .env
# Fill in your Supabase URL and anon key in .env

# Start the dev server
npx expo start
```

Scan the QR code with Expo Go to run on your device, or press `i` for iOS simulator / `a` for Android emulator.

### Scripts

| Command | Description |
|---|---|
| `npm start` | Start Expo dev server |
| `npm run ios` | Start on iOS simulator |
| `npm run android` | Start on Android emulator |
| `npm run web` | Start web preview |
| `npm run ts:check` | Run TypeScript type checking |

## Project Structure

```
app/                    Expo Router file-based routes
src/
  theme/                Design tokens (colors, typography, spacing, radius, shadows)
  components/ui/        Core UI primitives (RSText, Button, Card, Screen)
  components/           Feature-specific components
  hooks/                Custom React hooks
  lib/                  Utilities (Supabase client, image upload, etc.)
  stores/               Zustand state stores
  providers/            React context providers
  types/                TypeScript type definitions
  constants/            Static data and option definitions
supabase/               Database migrations and Edge Functions (coming soon)
```

## Design System

The app uses a custom design system built on **Plus Jakarta Sans** with a warm yellow brand palette. Design tokens are defined in `src/theme/` and used throughout via `StyleSheet.create`. The original web-based design system reference lives in `Design System Layout Creation/`.

## Status

**In development** — Project scaffolding and design system translation are complete. Currently building out Supabase integration, authentication, and core app flows.

## License

Private — All rights reserved.
