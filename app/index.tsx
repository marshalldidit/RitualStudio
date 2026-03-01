import React from 'react';
import { ScrollView, View, StyleSheet } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { Screen } from '@/components/ui/Screen';
import { RSText } from '@/components/ui/RSText';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { colors } from '@/theme/colors';
import { spacing } from '@/theme/spacing';

export default function DesignSystemDemo() {
  return (
    <Screen>
      <StatusBar style="dark" />
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.content}
      >
        {/* Typography */}
        <RSText variant="label" color={colors.dark[500]}>Typography</RSText>
        <View style={styles.section}>
          <RSText variant="display">Display</RSText>
          <RSText variant="h1">Heading 1</RSText>
          <RSText variant="h2">Heading 2</RSText>
          <RSText variant="h3">Heading 3</RSText>
          <RSText variant="h4">Heading 4</RSText>
          <RSText variant="bodyLarge">Body Large — Your daily drawing ritual begins here.</RSText>
          <RSText variant="body">Body — Consistent practice builds creative confidence.</RSText>
          <RSText variant="label">Label Text</RSText>
          <RSText variant="caption" color={colors.dark[500]}>Caption — 11px secondary info</RSText>
        </View>

        {/* Buttons */}
        <RSText variant="label" color={colors.dark[500]}>Buttons</RSText>
        <View style={styles.section}>
          <Button label="Primary" variant="primary" />
          <Button label="Begin Day 1" variant="cta" />
          <Button label="Outline" variant="outline" />
          <Button label="Ghost" variant="ghost" />
          <Button label="Delete Account" variant="danger" />
          <Button label="Disabled" variant="primary" disabled />
        </View>

        {/* Button Sizes */}
        <RSText variant="label" color={colors.dark[500]}>Button Sizes</RSText>
        <View style={styles.section}>
          <Button label="Small" variant="cta" size="sm" />
          <Button label="Medium" variant="cta" size="md" />
          <Button label="Large" variant="cta" size="lg" />
        </View>

        {/* Cards */}
        <RSText variant="label" color={colors.dark[500]}>Cards</RSText>
        <View style={styles.section}>
          <Card>
            <RSText variant="h3">Default Card</RSText>
            <RSText variant="body" color={colors.dark[500]}>
              White surface, subtle border, lifted shadow.
            </RSText>
          </Card>
          <Card variant="active">
            <RSText variant="h3">Active Card</RSText>
            <RSText variant="body" color={colors.dark[700]}>
              Brand highlight with warm glow.
            </RSText>
          </Card>
        </View>

        {/* Color Palette */}
        <RSText variant="label" color={colors.dark[500]}>Brand Colors</RSText>
        <View style={styles.section}>
          <View style={styles.swatchRow}>
            {([50, 100, 200, 300, 400, 500, 600, 700, 800] as const).map((shade) => (
              <View
                key={shade}
                style={[
                  styles.swatch,
                  { backgroundColor: colors.brand[shade] },
                ]}
              />
            ))}
          </View>
          <RSText variant="caption" color={colors.dark[500]}>
            Brand 50–800
          </RSText>
        </View>

        <RSText variant="label" color={colors.dark[500]}>Neutral Colors</RSText>
        <View style={styles.section}>
          <View style={styles.swatchRow}>
            {([50, 100, 200, 300, 400, 500, 600, 700, 800, 900] as const).map((shade) => (
              <View
                key={shade}
                style={[
                  styles.swatch,
                  { backgroundColor: colors.dark[shade] },
                ]}
              />
            ))}
          </View>
          <RSText variant="caption" color={colors.dark[500]}>
            Dark 50–900
          </RSText>
        </View>

        <RSText variant="label" color={colors.dark[500]}>Semantic Colors</RSText>
        <View style={styles.section}>
          <View style={styles.swatchRow}>
            <View style={[styles.swatch, { backgroundColor: colors.success }]} />
            <View style={[styles.swatch, { backgroundColor: colors.warning }]} />
            <View style={[styles.swatch, { backgroundColor: colors.error }]} />
            <View style={[styles.swatch, { backgroundColor: colors.info }]} />
          </View>
          <RSText variant="caption" color={colors.dark[500]}>
            Success · Warning · Error · Info
          </RSText>
        </View>
      </ScrollView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  scroll: {
    flex: 1,
  },
  content: {
    padding: spacing.xl,
    paddingBottom: spacing['4xl'],
    gap: spacing.sm,
  },
  section: {
    gap: spacing.md,
    marginBottom: spacing.xl,
  },
  swatchRow: {
    flexDirection: 'row',
    gap: spacing.xs,
  },
  swatch: {
    width: 28,
    height: 28,
    borderRadius: 6,
  },
});
