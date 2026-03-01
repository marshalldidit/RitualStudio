import React from 'react';
import { View, ViewProps, StyleSheet } from 'react-native';
import { colors } from '@/theme/colors';
import { radius } from '@/theme/radius';
import { spacing } from '@/theme/spacing';
import { lifted, brandGlow } from '@/theme/shadows';

interface CardProps extends ViewProps {
  /** "default" is white surface with subtle shadow. "active" adds brand highlight. */
  variant?: 'default' | 'active';
}

export function Card({
  variant = 'default',
  style,
  children,
  ...props
}: CardProps) {
  return (
    <View
      style={[
        styles.base,
        variant === 'active' ? styles.active : styles.default,
        style,
      ]}
      {...props}
    >
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  base: {
    borderRadius: radius.lg, // 16
    padding: spacing.base,   // 16
    borderWidth: 1,
  },
  default: {
    backgroundColor: colors.surface,
    borderColor: colors.dark[100],
    ...lifted,
  },
  active: {
    backgroundColor: colors.brand[100],
    borderColor: colors.brand[400],
    ...brandGlow,
  },
});
