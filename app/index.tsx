import { View, ActivityIndicator } from "react-native";
import { colors } from "@/theme";

// Root index — the route guard in _layout.tsx immediately redirects
// to /(auth)/sign-in, /(onboarding)/goal, or /(tabs) based on auth state.
export default function IndexScreen() {
  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: colors.background }}>
      <ActivityIndicator size="large" color={colors.brand[400]} />
    </View>
  );
}
