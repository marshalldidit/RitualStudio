import React from 'react';
import { View, StyleSheet } from 'react-native';
import Animated, { useAnimatedStyle, withTiming } from 'react-native-reanimated';
import { colors } from '@/theme/colors';
import { radius } from '@/theme/radius';
import { spacing } from '@/theme/spacing';

interface StepProgressBarProps {
  totalSteps: number;
  /** 0-indexed current step */
  currentStep: number;
}

function Dot({ state }: { state: 'completed' | 'current' | 'future' }) {
  const animatedStyle = useAnimatedStyle(() => ({
    width: withTiming(state === 'current' ? 28 : 8, { duration: 300 }),
  }));

  const backgroundColor =
    state === 'current'
      ? colors.brand[400]
      : state === 'completed'
        ? colors.dark[900]
        : colors.dark[100];

  return (
    <Animated.View
      style={[styles.dot, { backgroundColor }, animatedStyle]}
    />
  );
}

export function StepProgressBar({ totalSteps, currentStep }: StepProgressBarProps) {
  return (
    <View style={styles.container}>
      {Array.from({ length: totalSteps }, (_, i) => {
        const state =
          i < currentStep ? 'completed' : i === currentStep ? 'current' : 'future';
        return <Dot key={i} state={state} />;
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
  },
  dot: {
    height: 8,
    borderRadius: radius.full,
  },
});
