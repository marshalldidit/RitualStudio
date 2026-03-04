// Option definitions for the 6-step onboarding flow.
// Tag values MUST match the personalization algorithm spec and prompt seed data.

export interface OnboardingOption {
  value: string;
  label: string;
  emoji: string;
  description?: string;
}

export interface DurationOption {
  value: number;
  label: string;
  emoji: string;
  description: string;
}

export const GOAL_OPTIONS: OnboardingOption[] = [
  {
    value: "habit",
    label: "Build a daily habit",
    emoji: "\u{1F504}",
    description: "I want to draw every day and stay consistent",
  },
  {
    value: "skills",
    label: "Improve my skills",
    emoji: "\u{1F4C8}",
    description: "I want to get better at specific techniques",
  },
  {
    value: "portfolio",
    label: "Build my portfolio",
    emoji: "\u{1F3A8}",
    description: "I want to create pieces I can share and showcase",
  },
  {
    value: "unstuck",
    label: "Get unstuck creatively",
    emoji: "\u{1F4A1}",
    description: "I have artist\u2019s block and need fresh inspiration",
  },
  {
    value: "return",
    label: "Return to drawing",
    emoji: "\u{1F331}",
    description: "I used to draw and want to start again",
  },
];

export const LEVEL_OPTIONS: OnboardingOption[] = [
  {
    value: "beginner",
    label: "Beginner",
    emoji: "\u{1F331}",
    description: "I\u2019m just starting out or learning the basics",
  },
  {
    value: "intermediate",
    label: "Intermediate",
    emoji: "\u{1F33F}",
    description: "I have some experience and want to grow",
  },
  {
    value: "advanced",
    label: "Advanced",
    emoji: "\u{1F333}",
    description: "I\u2019m experienced and want to push further",
  },
];

// Values must match prompt seed subject_tags
export const SUBJECT_OPTIONS: OnboardingOption[] = [
  { value: "characters_portraits", label: "Characters & Portraits", emoji: "\u{1F464}" },
  { value: "environments_landscapes", label: "Environments & Landscapes", emoji: "\u{1F3DE}\uFE0F" },
  { value: "creatures_fantasy", label: "Creatures & Fantasy", emoji: "\u{1F409}" },
  { value: "everyday_objects", label: "Everyday Objects", emoji: "\u{1F34E}" },
  { value: "fashion_figures", label: "Fashion & Figures", emoji: "\u{1F457}" },
  { value: "story_scenes", label: "Story Scenes", emoji: "\u{1F4D6}" },
  { value: "abstract_experimental", label: "Abstract & Experimental", emoji: "\u{1F536}" },
];

// Values must match prompt seed skill_focus_tags
export const SKILL_OPTIONS: OnboardingOption[] = [
  { value: "anatomy_proportion", label: "Anatomy & Proportion", emoji: "\u{1F4D0}" },
  { value: "perspective", label: "Perspective", emoji: "\u{1F3D7}\uFE0F" },
  { value: "composition", label: "Composition", emoji: "\u{1F5BC}\uFE0F" },
  { value: "lighting_shadow", label: "Lighting & Shadow", emoji: "\u{1F317}" },
  { value: "color_mood", label: "Color & Mood", emoji: "\u{1F3A8}" },
  { value: "gesture_movement", label: "Gesture & Movement", emoji: "\u{1F483}" },
  { value: "visual_storytelling", label: "Visual Storytelling", emoji: "\u{1F4D6}" },
  { value: "speed_efficiency", label: "Speed & Efficiency", emoji: "\u{26A1}" },
  { value: "consistency", label: "Consistency", emoji: "\u{1F3AF}" },
];

export const DURATION_OPTIONS: DurationOption[] = [
  {
    value: 15,
    label: "15 minutes",
    emoji: "\u{26A1}",
    description: "Quick sketch \u2014 perfect for busy days",
  },
  {
    value: 30,
    label: "30 minutes",
    emoji: "\u{23F1}\uFE0F",
    description: "Focused session \u2014 the sweet spot",
  },
  {
    value: 60,
    label: "60 minutes",
    emoji: "\u{1F3AF}",
    description: "Deep dive \u2014 room to explore",
  },
];
