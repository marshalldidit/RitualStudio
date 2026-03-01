import React from 'react';
import { Text, TextProps, StyleSheet } from 'react-native';
import { colors } from '@/theme/colors';
import { typeStyles, TypeStyle } from '@/theme/typography';

interface RSTextProps extends TextProps {
  /** Typography preset from the design system scale. Defaults to "body". */
  variant?: TypeStyle;
  /** Override the default text color. Defaults to dark.900. */
  color?: string;
}

export function RSText({
  variant = 'body',
  color,
  style,
  ...props
}: RSTextProps) {
  return (
    <Text
      style={[
        styles.base,
        typeStyles[variant],
        color ? { color } : undefined,
        style,
      ]}
      {...props}
    />
  );
}

const styles = StyleSheet.create({
  base: {
    color: colors.dark[900],
  },
});
