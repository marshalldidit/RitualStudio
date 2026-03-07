import * as ImagePicker from "expo-image-picker";
import { supabase } from "@/lib/supabase";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface PickedImage {
  uri: string;
  width: number;
  height: number;
  mimeType: string;
  fileName: string;
}

export interface UploadResult {
  storagePath: string;
}

// ---------------------------------------------------------------------------
// Image picker helpers
// ---------------------------------------------------------------------------

async function ensureCameraPermission(): Promise<boolean> {
  const { status } = await ImagePicker.requestCameraPermissionsAsync();
  return status === "granted";
}

const PICKER_OPTIONS: ImagePicker.ImagePickerOptions = {
  mediaTypes: ["images"],
  allowsEditing: true,
  aspect: [1, 1],
  quality: 0.8,
};

export async function pickFromGallery(): Promise<PickedImage | null> {
  const result = await ImagePicker.launchImageLibraryAsync(PICKER_OPTIONS);
  if (result.canceled || result.assets.length === 0) return null;
  return assetToPicked(result.assets[0]);
}

export async function pickFromCamera(): Promise<PickedImage | null> {
  const granted = await ensureCameraPermission();
  if (!granted) return null;

  const result = await ImagePicker.launchCameraAsync(PICKER_OPTIONS);
  if (result.canceled || result.assets.length === 0) return null;
  return assetToPicked(result.assets[0]);
}

function assetToPicked(asset: ImagePicker.ImagePickerAsset): PickedImage {
  const ext = (asset.mimeType ?? "image/jpeg").split("/")[1] ?? "jpeg";
  const fileName = asset.fileName ?? `drawing_${Date.now()}.${ext}`;
  return {
    uri: asset.uri,
    width: asset.width,
    height: asset.height,
    mimeType: asset.mimeType ?? "image/jpeg",
    fileName,
  };
}

// ---------------------------------------------------------------------------
// Upload to Supabase Storage
// ---------------------------------------------------------------------------

/**
 * Upload an image to the `drawings` bucket.
 * Path: `{userId}/{dateLocal}_{promptId}_{timestamp}.{ext}`
 */
export async function uploadImage(
  image: PickedImage,
  userId: string,
  promptId: number,
  dateLocal: string
): Promise<UploadResult> {
  const ext = image.mimeType.split("/")[1] ?? "jpeg";
  const storagePath = `${userId}/${dateLocal}_${promptId}_${Date.now()}.${ext}`;

  // Fetch image as blob
  const response = await fetch(image.uri);
  const blob = await response.blob();

  const { error } = await supabase.storage
    .from("drawings")
    .upload(storagePath, blob, {
      contentType: image.mimeType,
      upsert: false,
    });

  if (error) throw error;

  return { storagePath };
}

// ---------------------------------------------------------------------------
// Create uploads table row
// ---------------------------------------------------------------------------

export async function createUploadRecord(params: {
  userId: string;
  promptId: number;
  dateLocal: string;
  storagePath: string;
  caption: string | null;
}): Promise<void> {
  const { error } = await supabase.from("uploads").insert({
    user_id: params.userId,
    prompt_id: params.promptId,
    date_local: params.dateLocal,
    storage_path: params.storagePath,
    caption: params.caption,
  });

  if (error) throw error;
}

// ---------------------------------------------------------------------------
// Cleanup helper — remove an orphaned storage file
// ---------------------------------------------------------------------------

export async function removeStorageFile(storagePath: string): Promise<void> {
  await supabase.storage.from("drawings").remove([storagePath]);
}
