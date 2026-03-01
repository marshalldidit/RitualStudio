/**
 * Border radius tokens extracted from the Ritual Studio web design system.
 * Source: Design System Layout Creation/src/app/components/ds/Foundations.tsx
 */

export const radius = {
  sm: 8,    // Chip
  md: 12,   // Input
  lg: 16,   // Card
  xl: 20,   // Large card
  '2xl': 24, // Modal
  full: 9999, // Pill / button
} as const;

export type RadiusToken = keyof typeof radius;
