/**
 * Shadow/elevation tokens extracted from the Ritual Studio web design system.
 * Source: Design System Layout Creation/src/app/components/ds/Foundations.tsx
 *
 * React Native shadow properties (iOS) + elevation (Android).
 * Web CSS equivalents noted in comments.
 */
import { Platform, ViewStyle } from 'react-native';

type ShadowStyle = Pick<
  ViewStyle,
  'shadowColor' | 'shadowOffset' | 'shadowOpacity' | 'shadowRadius' | 'elevation'
>;

/** No shadow */
export const flat: ShadowStyle = {
  shadowColor: 'transparent',
  shadowOffset: { width: 0, height: 0 },
  shadowOpacity: 0,
  shadowRadius: 0,
  elevation: 0,
};

/** Subtle lift — cards at rest. CSS: 0 2px 8px rgba(0,0,0,0.06) */
export const lifted: ShadowStyle = {
  shadowColor: '#000000',
  shadowOffset: { width: 0, height: 2 },
  shadowOpacity: 0.06,
  shadowRadius: 8,
  elevation: 2,
};

/** Mid-level — hover / focus. CSS: 0 4px 16px rgba(0,0,0,0.10) */
export const raised: ShadowStyle = {
  shadowColor: '#000000',
  shadowOffset: { width: 0, height: 4 },
  shadowOpacity: 0.10,
  shadowRadius: 16,
  elevation: 4,
};

/** Top-level — modals, FABs. CSS: 0 8px 32px rgba(0,0,0,0.14) */
export const floating: ShadowStyle = {
  shadowColor: '#000000',
  shadowOffset: { width: 0, height: 8 },
  shadowOpacity: 0.14,
  shadowRadius: 32,
  elevation: 8,
};

/** Brand glow — accent cards. CSS: 0 4px 20px rgba(249,192,30,0.30) */
export const brandGlow: ShadowStyle = {
  shadowColor: '#F9C01E',
  shadowOffset: { width: 0, height: 4 },
  shadowOpacity: 0.30,
  shadowRadius: 20,
  elevation: 4,
};

export const shadows = {
  flat,
  lifted,
  raised,
  floating,
  brandGlow,
} as const;
