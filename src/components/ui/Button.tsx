import React from 'react';
import {
  Pressable,
  PressableProps,
  StyleSheet,
  ViewStyle,
  TextStyle,
} from 'react-native';
import { RSText } from './RSText';
import { colors } from '@/theme/colors';
import { radius } from '@/theme/radius';
import { spacing } from '@/theme/spacing';

type ButtonVariant = 'primary' | 'cta' | 'outline' | 'ghost' | 'danger';
type ButtonSize = 'sm' | 'md' | 'lg';

interface ButtonProps extends Omit<PressableProps, 'style'> {
  /** Visual variant. Defaults to "primary". */
  variant?: ButtonVariant;
  /** Size preset. Defaults to "md". */
  size?: ButtonSize;
  /** Button label text. */
  label: string;
  /** Additional style applied to the outer Pressable. */
  style?: ViewStyle;
}

export function Button({
  variant = 'primary',
  size = 'md',
  label,
  disabled,
  style,
  ...props
}: ButtonProps) {
  const variantStyle = variantStyles[variant];
  const sizeStyle = sizeStyles[size];
  const textVariantStyle = textVariantStyles[variant];
  const textSizeStyle = textSizeStyles[size];

  return (
    <Pressable
      style={({ pressed }) => [
        styles.base,
        variantStyle,
        sizeStyle,
        pressed && styles.pressed,
        disabled && styles.disabled,
        style,
      ]}
      disabled={disabled}
      {...props}
    >
      <RSText
        variant="body"
        style={[styles.label, textVariantStyle, textSizeStyle]}
      >
        {label}
      </RSText>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: {
    borderRadius: radius.full,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
  },
  label: {
    fontFamily: 'PlusJakartaSans-SemiBold',
    fontWeight: '600',
  },
  pressed: {
    opacity: 0.85,
  },
  disabled: {
    opacity: 0.4,
  },
});

const variantStyles = StyleSheet.create({
  primary: {
    backgroundColor: colors.dark[900],
  },
  cta: {
    backgroundColor: colors.brand[400],
  },
  outline: {
    backgroundColor: colors.transparent,
    borderWidth: 2,
    borderColor: colors.dark[900],
  },
  ghost: {
    backgroundColor: colors.transparent,
  },
  danger: {
    backgroundColor: colors.error,
  },
});

const textVariantStyles = StyleSheet.create({
  primary: {
    color: colors.white,
  },
  cta: {
    color: colors.dark[900],
  },
  outline: {
    color: colors.dark[900],
  },
  ghost: {
    color: colors.dark[900],
  },
  danger: {
    color: colors.white,
  },
});

const sizeStyles = StyleSheet.create({
  sm: {
    paddingHorizontal: spacing.base, // 16
    paddingVertical: spacing.sm,     // 8
  },
  md: {
    paddingHorizontal: spacing.xl,   // 24
    paddingVertical: spacing.md,     // 12
  },
  lg: {
    paddingHorizontal: spacing['2xl'], // 32
    paddingVertical: spacing.base,     // 16
  },
});

const textSizeStyles = StyleSheet.create({
  sm: {
    fontSize: 13,
    lineHeight: 16,
  },
  md: {
    fontSize: 14,
    lineHeight: 20,
  },
  lg: {
    fontSize: 16,
    lineHeight: 24,
  },
});
