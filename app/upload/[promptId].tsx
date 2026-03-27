import React, { useState, useCallback, useEffect } from "react";
import {
  View,
  StyleSheet,
  ScrollView,
  Alert,
  ActionSheetIOS,
  Platform,
  KeyboardAvoidingView,
} from "react-native";
import { useLocalSearchParams, useRouter, useNavigation } from "expo-router";
import { Screen } from "@/components/ui/Screen";
import { RSText } from "@/components/ui/RSText";
import { Button } from "@/components/ui/Button";
import { ImagePreview } from "@/components/upload/ImagePreview";
import { CaptionInput } from "@/components/upload/CaptionInput";
import { useAuth } from "@/providers/AuthProvider";
import { useSessionStore } from "@/stores/sessionStore";
import { useDailyPromptsStore } from "@/stores/dailyPromptsStore";
import {
  pickFromGallery,
  pickFromCamera,
  uploadImage,
  createUploadRecord,
  removeStorageFile,
  PickedImage,
} from "@/lib/imageUpload";
import { colors, spacing, radius } from "@/theme";

export default function UploadScreen() {
  const { promptId } = useLocalSearchParams<{ promptId: string }>();
  const router = useRouter();
  const { session, userProfile } = useAuth();
  const navigation = useNavigation();
  const markUploaded = useSessionStore((s) => s.markUploaded);

  const promptIdNum = promptId ? parseInt(promptId, 10) : NaN;
  const promptSet = useDailyPromptsStore((s) => s.promptSet);
  const prompt = promptSet?.prompts.find((p) => p.id === promptIdNum) ?? null;

  const [image, setImage] = useState<PickedImage | null>(null);
  const [caption, setCaption] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // ---- Block back navigation while uploading ----

  useEffect(() => {
    if (!isUploading) return;

    const unsubscribe = navigation.addListener("beforeRemove", (e) => {
      e.preventDefault();
      Alert.alert(
        "Upload in progress",
        "Please wait for the upload to finish.",
        [{ text: "OK" }]
      );
    });

    return unsubscribe;
  }, [navigation, isUploading]);

  // ---- Image picking ----

  const showPickerOptions = useCallback(() => {
    if (Platform.OS === "ios") {
      ActionSheetIOS.showActionSheetWithOptions(
        {
          options: ["Cancel", "Take Photo", "Choose from Gallery"],
          cancelButtonIndex: 0,
        },
        async (buttonIndex) => {
          if (buttonIndex === 1) {
            const picked = await pickFromCamera();
            if (picked) setImage(picked);
          } else if (buttonIndex === 2) {
            const picked = await pickFromGallery();
            if (picked) setImage(picked);
          }
        }
      );
    } else {
      // Android: use Alert as a simple action sheet
      Alert.alert("Add Drawing", "Choose a source", [
        { text: "Cancel", style: "cancel" },
        {
          text: "Take Photo",
          onPress: async () => {
            const picked = await pickFromCamera();
            if (picked) setImage(picked);
          },
        },
        {
          text: "Choose from Gallery",
          onPress: async () => {
            const picked = await pickFromGallery();
            if (picked) setImage(picked);
          },
        },
      ]);
    }
  }, []);

  const handleRemoveImage = useCallback(() => {
    setImage(null);
    setError(null);
  }, []);

  // ---- Submit ----

  const handleSubmit = useCallback(async () => {
    if (!image || !session?.user?.id || isNaN(promptIdNum)) return;

    setIsUploading(true);
    setError(null);

    try {
      const tz = userProfile?.timezone ?? Intl.DateTimeFormat().resolvedOptions().timeZone;
      const dateLocal = new Date().toLocaleDateString("sv-SE", { timeZone: tz });

      // Upload image to storage
      const { storagePath } = await uploadImage(
        image,
        session.user.id,
        promptIdNum,
        dateLocal
      );

      // Create uploads row — clean up storage file if this fails
      try {
        await createUploadRecord({
          userId: session.user.id,
          promptId: promptIdNum,
          dateLocal,
          storagePath,
          caption: caption.trim() || null,
        });
      } catch (dbError) {
        await removeStorageFile(storagePath).catch(() => {});
        throw dbError;
      }

      // Mark session as uploaded
      markUploaded();

      // Navigate to completion
      router.replace("/completion");
    } catch (err: any) {
      console.error("[UploadScreen] Upload failed:", err);
      setError(err?.message ?? "Upload failed. Please try again.");
    } finally {
      setIsUploading(false);
    }
  }, [image, session, promptIdNum, userProfile, caption, markUploaded, router]);

  // ---- Skip upload ----

  const handleSkip = useCallback(() => {
    if (Platform.OS === "web") {
      const confirmed = window.confirm(
        "Skip upload?\n\nYou can still complete your ritual without uploading a drawing."
      );
      if (confirmed) router.replace("/completion");
    } else {
      Alert.alert(
        "Skip upload?",
        "You can still complete your ritual without uploading a drawing.",
        [
          { text: "Go Back", style: "cancel" },
          {
            text: "Skip",
            onPress: () => router.replace("/completion"),
          },
        ]
      );
    }
  }, [router]);

  return (
    <Screen>
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <ScrollView
          style={styles.flex}
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
        >
          {/* Header */}
          <View style={styles.header}>
            <RSText variant="h2">Upload Your Work</RSText>
            {prompt && (
              <RSText
                variant="body"
                color={colors.dark[500]}
                style={styles.promptTitle}
              >
                {prompt.title}
              </RSText>
            )}
          </View>

          {/* Image preview / picker */}
          <ImagePreview
            imageUri={image?.uri ?? null}
            onPickImage={showPickerOptions}
            onRemoveImage={handleRemoveImage}
          />

          {/* Caption */}
          <View style={styles.captionSection}>
            <CaptionInput value={caption} onChangeText={setCaption} />
          </View>

          {/* Error */}
          {error && (
            <View style={styles.errorBanner}>
              <RSText variant="body" color={colors.error}>
                {error}
              </RSText>
            </View>
          )}
        </ScrollView>

        {/* Bottom actions */}
        <View style={styles.actions}>
          <Button
            label={isUploading ? "Uploading..." : "Submit Drawing"}
            variant="primary"
            size="lg"
            onPress={handleSubmit}
            disabled={!image || isUploading}
            style={styles.submitButton}
          />
          <Button
            label="Skip"
            variant="ghost"
            size="md"
            onPress={handleSkip}
            disabled={isUploading}
          />
        </View>
      </KeyboardAvoidingView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  flex: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: spacing.xl,
    paddingTop: spacing.lg,
    paddingBottom: spacing.base,
  },
  header: {
    marginBottom: spacing.lg,
  },
  promptTitle: {
    marginTop: spacing.xs,
  },
  captionSection: {
    marginTop: spacing.lg,
  },
  errorBanner: {
    marginTop: spacing.md,
    backgroundColor: "#FEE",
    borderRadius: radius.sm,
    paddingHorizontal: spacing.base,
    paddingVertical: spacing.sm,
  },
  actions: {
    paddingHorizontal: spacing.xl,
    paddingTop: spacing.md,
    paddingBottom: spacing.lg,
    gap: spacing.sm,
    alignItems: "center",
  },
  submitButton: {
    width: "100%",
  },
});
