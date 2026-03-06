import { useState, useEffect } from "react";
import { View, StyleSheet, ActivityIndicator } from "react-native";
import { useRouter } from "expo-router";
import { Screen } from "@/components/ui/Screen";
import { RSText } from "@/components/ui/RSText";
import { Button } from "@/components/ui/Button";
import { StreakBadge } from "@/components/home/StreakBadge";
import { PromptCarousel } from "@/components/home/PromptCarousel";
import { useDailyPrompts } from "@/hooks/useDailyPrompts";
import { useAuth } from "@/providers/AuthProvider";
import { supabase } from "@/lib/supabase";
import { UserStreakRow } from "@/types/database";
import { colors, spacing } from "@/theme";

export default function HomeScreen() {
  const router = useRouter();
  const { session } = useAuth();
  const {
    prompts,
    activeIndex,
    setActiveIndex,
    isLoading,
    error,
    selectedPromptId,
    selectPrompt,
    refresh,
  } = useDailyPrompts();

  const [streak, setStreak] = useState<UserStreakRow | null>(null);

  useEffect(() => {
    if (!session?.user?.id) return;

    supabase
      .from("user_streaks")
      .select("*")
      .eq("user_id", session.user.id)
      .single()
      .then(({ data }) => {
        if (data) setStreak(data as UserStreakRow);
      });
  }, [session?.user?.id]);

  const streakCount = streak?.current_streak_days ?? 0;
  const hasPrompts = prompts.length > 0;
  const activePrompt = hasPrompts ? prompts[activeIndex] : null;
  const isSelected = selectedPromptId != null;

  async function handleBegin() {
    if (!activePrompt) return;

    if (!isSelected) {
      await selectPrompt(activePrompt.id);
    }

    router.push(`/session/${activePrompt.id}`);
  }

  return (
    <Screen>
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <RSText variant="label" color={colors.dark[500]}>
            DAY {streakCount + 1}
          </RSText>
          <StreakBadge count={streakCount} />
        </View>

        <RSText variant="h1" style={styles.title}>
          Your Daily Ritual
        </RSText>

        {/* Loading state */}
        {isLoading && (
          <View style={styles.centered}>
            <ActivityIndicator size="large" color={colors.brand[400]} />
            <RSText variant="body" color={colors.dark[500]} style={styles.loadingText}>
              Preparing your prompts...
            </RSText>
          </View>
        )}

        {/* Error state */}
        {!isLoading && error != null && (
          <View style={styles.centered}>
            <RSText variant="h4" style={styles.errorTitle}>
              Couldn't load your prompts
            </RSText>
            <RSText variant="body" color={colors.dark[500]} style={styles.errorMessage}>
              {error}
            </RSText>
            <Button
              label="Try Again"
              variant="outline"
              size="md"
              onPress={refresh}
              style={styles.retryButton}
            />
          </View>
        )}

        {/* Prompt carousel */}
        {!isLoading && error == null && hasPrompts && (
          <>
            <RSText variant="body" color={colors.dark[500]} style={styles.subtitle}>
              Swipe to explore your prompts
            </RSText>

            <View style={styles.carouselArea}>
              <PromptCarousel
                prompts={prompts}
                activeIndex={activeIndex}
                onActiveIndexChange={setActiveIndex}
              />
            </View>
          </>
        )}

        {/* Empty state */}
        {!isLoading && error == null && !hasPrompts && (
          <View style={styles.centered}>
            <RSText variant="h4">No prompts available</RSText>
            <RSText variant="body" color={colors.dark[500]} style={styles.errorMessage}>
              Try adjusting your preferences in Profile.
            </RSText>
          </View>
        )}

        {/* Bottom CTA */}
        {!isLoading && error == null && hasPrompts && (
          <View style={styles.footer}>
            <Button
              label={isSelected ? "Continue Drawing" : "Begin Drawing"}
              variant="cta"
              size="lg"
              style={styles.ctaButton}
              onPress={handleBegin}
            />
          </View>
        )}
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: spacing.xl,
    paddingTop: spacing.base,
  },
  title: {
    paddingHorizontal: spacing.xl,
    marginTop: spacing.sm,
  },
  subtitle: {
    paddingHorizontal: spacing.xl,
    marginTop: spacing.xs,
  },
  carouselArea: {
    flex: 1,
    justifyContent: "center",
    marginTop: spacing.lg,
  },
  centered: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: spacing.xl,
  },
  loadingText: {
    marginTop: spacing.base,
  },
  errorTitle: {
    textAlign: "center",
  },
  errorMessage: {
    marginTop: spacing.sm,
    textAlign: "center",
  },
  retryButton: {
    marginTop: spacing.lg,
  },
  footer: {
    paddingHorizontal: spacing.xl,
    paddingBottom: spacing.xl,
    paddingTop: spacing.base,
  },
  ctaButton: {
    width: "100%",
  },
});
