import { Slot, usePathname } from "expo-router";
import { View, StyleSheet } from "react-native";
import { Screen } from "@/components/ui/Screen";
import { StepProgressBar } from "@/components/ui/StepProgressBar";
import { spacing } from "@/theme";

const STEP_ROUTES = ["goal", "level", "subjects", "skills", "duration", "reminder"];

export default function OnboardingLayout() {
  const pathname = usePathname();
  const currentSegment = pathname.split("/").pop();
  const stepIndex = STEP_ROUTES.indexOf(currentSegment ?? "");
  const showProgress = stepIndex >= 0;

  return (
    <Screen>
      {showProgress && (
        <View style={styles.progressContainer}>
          <StepProgressBar totalSteps={6} currentStep={stepIndex} />
        </View>
      )}
      <Slot />
    </Screen>
  );
}

const styles = StyleSheet.create({
  progressContainer: {
    paddingHorizontal: spacing.xl,
    paddingTop: spacing.base,
    paddingBottom: spacing.sm,
  },
});
