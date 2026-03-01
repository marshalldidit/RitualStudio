/**
 * Color tokens extracted from the Ritual Studio web design system.
 * Source: Design System Layout Creation/src/app/components/ds/Foundations.tsx
 */

export const colors = {
  // Brand Yellow
  brand: {
    50: '#FFFBEA',
    100: '#FFF3C4',
    200: '#FFE680',
    300: '#FFD84D',
    400: '#F9C01E', // Primary brand color
    500: '#D4A017',
    600: '#D4A017',
    700: '#B8860B',
    800: '#9A7010',
  },

  // Neutral Dark
  dark: {
    50: '#F7F7F5',
    100: '#EEEEEA',
    200: '#DDDDDA',
    300: '#BBBBBA',
    400: '#999996',
    500: '#888886',
    600: '#666664',
    700: '#444442',
    800: '#2A2A28',
    900: '#1A1A1A', // Primary text color
  },

  // Semantic
  success: '#4CAF7D',
  warning: '#F9C01E',
  error: '#E84040',
  info: '#4A90D9',

  // Surfaces
  surface: '#FFFFFF',
  background: '#FAFAF5',

  // Missed state (calendar)
  missed: {
    bg: '#FFF0F0',
    border: '#FFBCBC',
  },

  // Common shorthands
  white: '#FFFFFF',
  black: '#000000',
  transparent: 'transparent',
} as const;

export type ColorToken = typeof colors;
