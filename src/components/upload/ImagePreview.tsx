import React from "react";
import { View, Image, StyleSheet, Pressable } from "react-native";
import { Feather } from "@expo/vector-icons";
import { RSText } from "@/components/ui/RSText";
import { colors } from "@/theme/colors";
import { spacing } from "@/theme/spacing";
import { radius } from "@/theme/radius";
import { lifted } from "@/theme/shadows";

interface ImagePreviewProps {
  /** URI of the selected image, or null if none selected. */
  imageUri: string | null;
  /** Called when the user taps to pick an image. */
  onPickImage: () => void;
  /** Called when the user wants to remove the current image. */
  onRemoveImage: () => void;
}

export function ImagePreview({
  imageUri,
  onPickImage,
  onRemoveImage,
}: ImagePreviewProps) {
  if (imageUri) {
    return (
      <View style={styles.previewContainer}>
        <Image source={{ uri: imageUri }} style={styles.image} />
        <Pressable
          onPress={onRemoveImage}
          style={styles.removeButton}
          hitSlop={8}
        >
          <Feather name="x" size={18} color={colors.white} />
        </Pressable>
      </View>
    );
  }

  return (
    <Pressable onPress={onPickImage} style={styles.placeholder}>
      <Feather name="image" size={40} color={colors.dark[300]} />
      <RSText variant="bodyLarge" color={colors.dark[500]} style={styles.placeholderText}>
        Tap to add your drawing
      </RSText>
      <RSText variant="caption" color={colors.dark[300]}>
        Camera or gallery
      </RSText>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  previewContainer: {
    width: "100%",
    aspectRatio: 1,
    borderRadius: radius.lg,
    overflow: "hidden",
    backgroundColor: colors.dark[100],
    ...lifted,
  },
  image: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },
  removeButton: {
    position: "absolute",
    top: spacing.sm,
    right: spacing.sm,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  placeholder: {
    width: "100%",
    aspectRatio: 1,
    borderRadius: radius.lg,
    borderWidth: 2,
    borderColor: colors.dark[100],
    borderStyle: "dashed",
    backgroundColor: colors.white,
    justifyContent: "center",
    alignItems: "center",
    gap: spacing.sm,
  },
  placeholderText: {
    marginTop: spacing.xs,
  },
});
