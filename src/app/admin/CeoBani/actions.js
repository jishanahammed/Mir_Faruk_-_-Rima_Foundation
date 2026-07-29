"use server";

import { revalidatePath } from "next/cache";
import { updateAdminCeoBani } from "@/lib/api/admin-ceo-bani-service";
import {
  uploadCeoBaniImage,
  deleteCeoBaniImage,
} from "@/lib/api/admin-ceo-bani-upload-service";

function str(formData, key) {
  return String(formData.get(key) ?? "").trim();
}

function revalidate() {
  revalidatePath("/admin/CeoBani");
}

export async function updateCeoBaniAction(formData) {
  await updateAdminCeoBani({
    MessageEn: str(formData, "messageEn") || null,
    MessageBn: str(formData, "messageBn") || null,
    MessageDk: str(formData, "messageDk") || null,
    ImageUrlEn: str(formData, "imageUrlEn") || null,
    ImageUrlBn: str(formData, "imageUrlBn") || null,
    ImageUrlDk: str(formData, "imageUrlDk") || null,
  });
  revalidate();
}

export async function uploadCeoBaniImageAction(lang, formData) {
  return uploadCeoBaniImage(formData, lang);
}

export async function deleteCeoBaniImageAction(formData) {
  const imagePath = str(formData, "imagePath");
  await deleteCeoBaniImage(imagePath);
}
