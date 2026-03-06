import React, { useRef, useCallback } from "react";
import {
  FlatList,
  View,
  StyleSheet,
  ViewToken,
  ListRenderItemInfo,
} from "react-native";
import Animated, { useAnimatedStyle, withTiming } from "react-native-reanimated";
import { PromptCard, CARD_WIDTH } from "./PromptCard";
import { DailyPromptWithRole } from "@/types/database";
import { colors } from "@/theme/colors";
import { spacing } from "@/theme/spacing";
import { radius } from "@/theme/radius";

const CARD_MARGIN = spacing.sm;
const SNAP_INTERVAL = CARD_WIDTH + CARD_MARGIN * 2;

interface PromptCarouselProps {
  prompts: DailyPromptWithRole[];
  activeIndex: number;
  onActiveIndexChange: (index: number) => void;
}

function DotIndicator({ state }: { state: "active" | "inactive" }) {
  const animatedStyle = useAnimatedStyle(() => ({
    width: withTiming(state === "active" ? 28 : 8, { duration: 300 }),
  }));

  return (
    <Animated.View
      style={[
        styles.dot,
        {
          backgroundColor:
            state === "active" ? colors.brand[400] : colors.dark[100],
        },
        animatedStyle,
      ]}
    />
  );
}

export function PromptCarousel({
  prompts,
  activeIndex,
  onActiveIndexChange,
}: PromptCarouselProps) {
  const flatListRef = useRef<FlatList>(null);

  const viewabilityConfig = useRef({
    itemVisiblePercentThreshold: 60,
  }).current;

  const onViewableItemsChanged = useRef(
    ({ viewableItems }: { viewableItems: ViewToken[] }) => {
      if (viewableItems.length > 0 && viewableItems[0].index != null) {
        onActiveIndexChange(viewableItems[0].index);
      }
    },
  ).current;

  const renderItem = useCallback(
    ({ item, index }: ListRenderItemInfo<DailyPromptWithRole>) => (
      <View style={styles.cardWrapper}>
        <PromptCard prompt={item} isActive={index === activeIndex} />
      </View>
    ),
    [activeIndex],
  );

  const keyExtractor = useCallback(
    (item: DailyPromptWithRole) => String(item.id),
    [],
  );

  return (
    <View style={styles.container}>
      <FlatList
        ref={flatListRef}
        data={prompts}
        renderItem={renderItem}
        keyExtractor={keyExtractor}
        horizontal
        pagingEnabled={false}
        snapToInterval={SNAP_INTERVAL}
        decelerationRate="fast"
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.listContent}
        viewabilityConfig={viewabilityConfig}
        onViewableItemsChanged={onViewableItemsChanged}
      />

      <View style={styles.dots}>
        {prompts.map((_, i) => (
          <DotIndicator key={i} state={i === activeIndex ? "active" : "inactive"} />
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: spacing.lg,
  },
  listContent: {
    paddingHorizontal: spacing.xl,
  },
  cardWrapper: {
    marginHorizontal: CARD_MARGIN,
  },
  dots: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: spacing.sm,
  },
  dot: {
    height: 8,
    borderRadius: radius.full,
  },
});
