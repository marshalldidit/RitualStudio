import React, { useEffect } from "react";
import { View, StyleSheet, Dimensions } from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withDelay,
  withTiming,
  withSequence,
  Easing,
  interpolate,
} from "react-native-reanimated";
import { colors } from "@/theme/colors";

const { width: SCREEN_WIDTH } = Dimensions.get("window");

interface Particle {
  x: number;
  y: number;
  size: number;
  color: string;
  delay: number;
  drift: number;
}

const PARTICLE_COLORS = [
  colors.brand[400],
  colors.brand[300],
  colors.brand[200],
  colors.dark[900],
  colors.dark[300],
];

function generateParticles(count: number): Particle[] {
  const particles: Particle[] = [];
  for (let i = 0; i < count; i++) {
    particles.push({
      x: Math.random() * SCREEN_WIDTH,
      y: -20 - Math.random() * 100,
      size: 6 + Math.random() * 8,
      color: PARTICLE_COLORS[i % PARTICLE_COLORS.length],
      delay: Math.random() * 600,
      drift: (Math.random() - 0.5) * 80,
    });
  }
  return particles;
}

const PARTICLES = generateParticles(24);

function ConfettiParticle({ particle }: { particle: Particle }) {
  const progress = useSharedValue(0);

  useEffect(() => {
    progress.value = withDelay(
      particle.delay,
      withSequence(
        withTiming(1, { duration: 1400, easing: Easing.out(Easing.quad) }),
        withTiming(0, { duration: 600, easing: Easing.in(Easing.quad) })
      )
    );
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const animatedStyle = useAnimatedStyle(() => {
    const translateY = interpolate(progress.value, [0, 1], [0, 500]);
    const translateX = interpolate(progress.value, [0, 1], [0, particle.drift]);
    const opacity = interpolate(progress.value, [0, 0.2, 0.8, 1], [0, 1, 1, 0]);
    const rotate = interpolate(progress.value, [0, 1], [0, 360]);

    return {
      transform: [
        { translateY },
        { translateX },
        { rotate: `${rotate}deg` },
      ],
      opacity,
    };
  });

  return (
    <Animated.View
      style={[
        styles.particle,
        {
          left: particle.x,
          top: particle.y,
          width: particle.size,
          height: particle.size,
          borderRadius: particle.size / 2,
          backgroundColor: particle.color,
        },
        animatedStyle,
      ]}
    />
  );
}

export function CelebrationAnimation() {
  return (
    <View style={styles.container} pointerEvents="none">
      {PARTICLES.map((p, i) => (
        <ConfettiParticle key={i} particle={p} />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    overflow: "hidden",
  },
  particle: {
    position: "absolute",
  },
});
