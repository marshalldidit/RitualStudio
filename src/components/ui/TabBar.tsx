import React from 'react';
import { View, Pressable, StyleSheet, Platform } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import type { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import { colors } from '@/theme/colors';
import { radius } from '@/theme/radius';
import { spacing } from '@/theme/spacing';
import { RSText } from './RSText';

const TAB_ICONS: Record<string, { active: keyof typeof Ionicons.glyphMap; inactive: keyof typeof Ionicons.glyphMap }> = {
  index: { active: 'home', inactive: 'home-outline' },
  calendar: { active: 'calendar', inactive: 'calendar-outline' },
  profile: { active: 'person', inactive: 'person-outline' },
};

const TAB_LABELS: Record<string, string> = {
  index: 'Home',
  calendar: 'Calendar',
  profile: 'Profile',
};

export function TabBar({ state, descriptors, navigation }: BottomTabBarProps) {
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.container, { paddingBottom: Math.max(insets.bottom, spacing.sm) }]}>
      {state.routes.map((route, index) => {
        const isFocused = state.index === index;
        const icons = TAB_ICONS[route.name] ?? { active: 'help', inactive: 'help-outline' };
        const label = TAB_LABELS[route.name] ?? route.name;

        const onPress = () => {
          const event = navigation.emit({
            type: 'tabPress',
            target: route.key,
            canPreventDefault: true,
          });
          if (!isFocused && !event.defaultPrevented) {
            navigation.navigate(route.name);
          }
        };

        return (
          <Pressable
            key={route.key}
            accessibilityRole="button"
            accessibilityState={isFocused ? { selected: true } : {}}
            accessibilityLabel={label}
            onPress={onPress}
            style={styles.tab}
          >
            <View style={[styles.iconContainer, isFocused && styles.iconContainerActive]}>
              <Ionicons
                name={isFocused ? icons.active : icons.inactive}
                size={22}
                color={isFocused ? colors.dark[900] : colors.dark[300]}
              />
            </View>
            <RSText
              variant="caption"
              color={isFocused ? colors.dark[900] : colors.dark[300]}
              style={[
                styles.label,
                isFocused && styles.labelActive,
              ]}
            >
              {label}
            </RSText>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: colors.white,
    borderTopWidth: 1,
    borderTopColor: colors.dark[100],
    paddingTop: spacing.md,
  },
  tab: {
    flex: 1,
    alignItems: 'center',
    gap: 4,
  },
  iconContainer: {
    paddingHorizontal: spacing.base,
    paddingVertical: 4,
    borderRadius: radius.lg,
  },
  iconContainerActive: {
    backgroundColor: colors.brand[100],
  },
  label: {
    fontSize: 10,
    textTransform: 'none',
    letterSpacing: 0,
  },
  labelActive: {
    fontFamily: 'PlusJakartaSans-Bold',
  },
});
