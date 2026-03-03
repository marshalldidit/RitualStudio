import React, { useState } from 'react';
import {
  View,
  TextInput,
  TextInputProps,
  StyleSheet,
  Pressable,
  Platform,
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import { RSText } from './RSText';
import { colors } from '@/theme/colors';
import { fontFamily } from '@/theme/typography';
import { spacing } from '@/theme/spacing';
import { radius } from '@/theme/radius';

interface InputProps extends Omit<TextInputProps, 'style'> {
  /** Label displayed above the input. */
  label?: string;
  /** Error message. When set, the input shows error styling. */
  error?: string;
  /** Whether the input is disabled. */
  disabled?: boolean;
  /** Ref forwarded to the underlying TextInput. */
  inputRef?: React.RefObject<TextInput | null>;
}

export function Input({
  label,
  error,
  disabled,
  secureTextEntry,
  inputRef,
  onFocus,
  onBlur,
  ...props
}: InputProps) {
  const [isFocused, setIsFocused] = useState(false);
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);

  const borderColor = error
    ? colors.error
    : isFocused
      ? colors.brand[400]
      : colors.dark[100];

  const focusShadow =
    isFocused && !error
      ? styles.focusShadow
      : isFocused && error
        ? styles.errorShadow
        : undefined;

  const labelNode = label ? (
    <RSText variant="body" style={styles.label}>
      {label}
    </RSText>
  ) : null;

  const eyeNode = secureTextEntry ? (
    <Pressable
      onPress={() => setIsPasswordVisible((v) => !v)}
      hitSlop={8}
      style={styles.eyeButton}
    >
      <Feather
        name={isPasswordVisible ? 'eye' : 'eye-off'}
        size={20}
        color={isFocused ? colors.brand[400] : colors.dark[300]}
      />
    </Pressable>
  ) : null;

  const errorNode = error ? (
    <RSText variant="caption" color={colors.error}>
      {error}
    </RSText>
  ) : null;

  return (
    <View style={styles.wrapper}>
      {labelNode}
      <View
        style={[
          styles.container,
          { borderColor },
          disabled && styles.containerDisabled,
          focusShadow,
        ]}
      >
        <TextInput
          ref={inputRef}
          style={styles.input}
          placeholderTextColor={colors.dark[300]}
          editable={!disabled}
          secureTextEntry={secureTextEntry && !isPasswordVisible}
          onFocus={(e) => {
            setIsFocused(true);
            onFocus?.(e);
          }}
          onBlur={(e) => {
            setIsFocused(false);
            onBlur?.(e);
          }}
          {...props}
        />{eyeNode}
      </View>
      {errorNode}
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    gap: spacing.xs,
  },
  label: {
    fontFamily: fontFamily.semiBold,
    fontWeight: '600',
    fontSize: 13,
    color: colors.dark[700],
  },
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 2,
    borderRadius: radius.md,
    paddingHorizontal: spacing.base,
    backgroundColor: colors.white,
  },
  containerDisabled: {
    backgroundColor: colors.dark[50],
  },
  input: {
    flex: 1,
    fontFamily: fontFamily.regular,
    fontSize: 14,
    lineHeight: 20,
    color: colors.dark[900],
    paddingVertical: Platform.OS === 'ios' ? spacing.md : spacing.sm,
  },
  eyeButton: {
    marginLeft: spacing.sm,
  },
  focusShadow: {
    shadowColor: '#F9C01E',
    shadowOpacity: 0.15,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 0 },
    elevation: 2,
  },
  errorShadow: {
    shadowColor: '#E84040',
    shadowOpacity: 0.1,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 0 },
    elevation: 2,
  },
});
