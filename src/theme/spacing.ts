/**
 * Spacing tokens extracted from the Ritual Studio web design system.
 * Source: Design System Layout Creation/src/app/components/ds/Foundations.tsx
 *
 * 4px base grid system.
 */

export const spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  base: 16,
  lg: 20,
  xl: 24,
  '2xl': 32,
  '3xl': 40,
  '4xl': 48,
} as const;

export type SpacingToken = keyof typeof spacing;
