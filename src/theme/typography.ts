/**
 * Typography tokens extracted from the Ritual Studio web design system.
 * Source: Design System Layout Creation/src/app/components/ds/Foundations.tsx
 *
 * Font: Plus Jakarta Sans (loaded via @expo-google-fonts/plus-jakarta-sans)
 * Registered font names in app/_layout.tsx:
 *   PlusJakartaSans-Regular (400)
 *   PlusJakartaSans-Medium (500)
 *   PlusJakartaSans-SemiBold (600)
 *   PlusJakartaSans-Bold (700)
 *   PlusJakartaSans-ExtraBold (800)
 */

export const fontFamily = {
  regular: 'PlusJakartaSans-Regular',
  medium: 'PlusJakartaSans-Medium',
  semiBold: 'PlusJakartaSans-SemiBold',
  bold: 'PlusJakartaSans-Bold',
  extraBold: 'PlusJakartaSans-ExtraBold',
} as const;

export const fontWeight = {
  regular: '400' as const,
  medium: '500' as const,
  semiBold: '600' as const,
  bold: '700' as const,
  extraBold: '800' as const,
};

/**
 * Typography presets matching the design system scale.
 * Each preset is a complete StyleSheet-compatible text style.
 */
export const typeStyles = {
  display: {
    fontFamily: fontFamily.extraBold,
    fontSize: 48,
    lineHeight: 56,
    fontWeight: fontWeight.extraBold,
  },
  h1: {
    fontFamily: fontFamily.bold,
    fontSize: 32,
    lineHeight: 40,
    fontWeight: fontWeight.bold,
  },
  h2: {
    fontFamily: fontFamily.bold,
    fontSize: 24,
    lineHeight: 32,
    fontWeight: fontWeight.bold,
  },
  h3: {
    fontFamily: fontFamily.bold,
    fontSize: 20,
    lineHeight: 28,
    fontWeight: fontWeight.bold,
  },
  h4: {
    fontFamily: fontFamily.semiBold,
    fontSize: 17,
    lineHeight: 24,
    fontWeight: fontWeight.semiBold,
  },
  bodyLarge: {
    fontFamily: fontFamily.regular,
    fontSize: 16,
    lineHeight: 24,
    fontWeight: fontWeight.regular,
  },
  body: {
    fontFamily: fontFamily.regular,
    fontSize: 14,
    lineHeight: 20,
    fontWeight: fontWeight.regular,
  },
  label: {
    fontFamily: fontFamily.semiBold,
    fontSize: 13,
    lineHeight: 16,
    fontWeight: fontWeight.semiBold,
    textTransform: 'uppercase' as const,
    letterSpacing: 0.78, // 0.06em * 13px
  },
  caption: {
    fontFamily: fontFamily.regular,
    fontSize: 11,
    lineHeight: 14,
    fontWeight: fontWeight.regular,
  },
} as const;

export type TypeStyle = keyof typeof typeStyles;
