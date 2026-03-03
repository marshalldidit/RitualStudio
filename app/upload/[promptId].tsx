import { View, StyleSheet } from "react-native";
import { useLocalSearchParams } from "expo-router";
import { Screen } from "@/components/ui/Screen";
import { RSText } from "@/components/ui/RSText";
import { colors, spacing } from "@/theme";

export default function UploadScreen() {
  const { promptId } = useLocalSearchParams<{ promptId: string }>();

  return (
    <Screen>
      <View style={styles.container}>
        <RSText variant="h1">Upload Your Work</RSText>
        <RSText variant="body" color={colors.dark[500]} style={styles.description}>
          Prompt #{promptId} — Image picker and upload will be implemented in Phase 9.
        </RSText>
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: spacing.xl,
  },
  description: {
    marginTop: spacing.md,
    textAlign: "center",
  },
});
