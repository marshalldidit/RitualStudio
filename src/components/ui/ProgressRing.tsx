import React, { useEffect } from "react";
import { View, StyleSheet } from "react-native";
import Svg, { Circle } from "react-native-svg";
import Animated, {
  useSharedValue,
  useAnimatedProps,
  withTiming,
  Easing,
} from "react-native-reanimated";
import { colors } from "@/theme/colors";

const AnimatedCircle = Animated.createAnimatedComponent(Circle);

interface ProgressRingProps {
  /** Progress from 0 to 1. Capped at 1 (no overfill). */
  progress: number;
  /** Outer size in px. Default 240. */
  size?: number;
  /** Stroke width in px. Default 6. */
  strokeWidth?: number;
  /** Track (background) color. Default dark[700]. */
  trackColor?: string;
  /** Progress stroke color. Default brand[400]. */
  progressColor?: string;
  /** Content rendered in the center of the ring. */
  children?: React.ReactNode;
}

export function ProgressRing({
  progress,
  size = 240,
  strokeWidth = 6,
  trackColor = colors.dark[700],
  progressColor = colors.brand[400],
  children,
}: ProgressRingProps) {
  const clampedProgress = Math.min(Math.max(progress, 0), 1);
  const r = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * r;

  const animatedOffset = useSharedValue(
    circumference * (1 - clampedProgress)
  );

  useEffect(() => {
    animatedOffset.value = withTiming(
      circumference * (1 - clampedProgress),
      { duration: 800, easing: Easing.out(Easing.cubic) }
    );
  }, [clampedProgress, circumference]); // eslint-disable-line react-hooks/exhaustive-deps

  const animatedProps = useAnimatedProps(() => ({
    strokeDashoffset: animatedOffset.value,
  }));

  const center = size / 2;

  return (
    <View style={[styles.container, { width: size, height: size }]}>
      <Svg
        width={size}
        height={size}
        style={{ transform: [{ rotate: "-90deg" }] }}
      >
        {/* Track */}
        <Circle
          cx={center}
          cy={center}
          r={r}
          stroke={trackColor}
          strokeWidth={strokeWidth}
          fill="none"
        />
        {/* Progress */}
        <AnimatedCircle
          cx={center}
          cy={center}
          r={r}
          stroke={progressColor}
          strokeWidth={strokeWidth}
          fill="none"
          strokeDasharray={`${circumference}`}
          strokeLinecap="round"
          animatedProps={animatedProps}
        />
      </Svg>
      {children != null && (
        <View style={[styles.centerContent, { width: size, height: size }]}>
          {children}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: "relative",
  },
  centerContent: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: "center",
    alignItems: "center",
  },
});
