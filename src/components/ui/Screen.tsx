import React from 'react';
import { View, ViewProps, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors } from '@/theme/colors';

interface ScreenProps extends ViewProps {
  /** Use safe area insets. Defaults to true. */
  safe?: boolean;
}

export function Screen({
  safe = true,
  style,
  children,
  ...props
}: ScreenProps) {
  const Container = safe ? SafeAreaView : View;
  return (
    <Container style={[styles.container, style]} {...props}>
      {children}
    </Container>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
});
