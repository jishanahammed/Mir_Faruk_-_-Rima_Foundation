"use server";

import { revalidatePath } from "next/cache";
import {
  createAdminVideoSpeech,
  updateAdminVideoSpeech,
  updateAdminVideoSpeechPublish,
  deleteAdminVideoSpeech,
} from "@/lib/api/admin-video-speech-service";
import {
  uploadVideoSpeechImage,
  deleteVideoSpeechImage,
} from "@/lib/api/admin-video-speech-upload-service";

function str(formData, key) {
  return String(formData.get(key) ?? "").trim();
}

function readId(formData) {
  const id = Number.parseInt(str(formData, "id"), 10);
  if (!Number.isFinite(id) || id <= 0) throw new Error("Valid ID is required.");
  return id;
}

function revalidate() {
  revalidatePath("/admin/video-speech");
  revalidatePath("/");
}

export async function createVideoSpeechAction(formData) {
  const sortRaw = str(formData, "sortOrder");
  await createAdminVideoSpeech({
    NameEn: str(formData, "nameEn"),
    NameBn: str(formData, "nameBn"),
    NameDk: str(formData, "nameDk") || null,
    RoleEn: str(formData, "roleEn"),
    RoleBn: str(formData, "roleBn"),
    RoleDk: str(formData, "roleDk") || null,
    DescriptionEn: str(formData, "descriptionEn") || null,
    DescriptionBn: str(formData, "descriptionBn") || null,
    DescriptionDk: str(formData, "descriptionDk") || null,
    VideoId: str(formData, "videoId"),
    BackgroundImageUrl: str(formData, "backgroundImageUrl") || null,
    IsPublished: formData.get("isPublished") === "true",
    SortOrder: sortRaw ? Number(sortRaw) : 0,
  });
  revalidate();
}

export async function updateVideoSpeechAction(formData) {
  const sortRaw = str(formData, "sortOrder");
  await updateAdminVideoSpeech(readId(formData), {
    NameEn: str(formData, "nameEn"),
    NameBn: str(formData, "nameBn"),
    NameDk: str(formData, "nameDk") || null,
    RoleEn: str(formData, "roleEn"),
    RoleBn: str(formData, "roleBn"),
    RoleDk: str(formData, "roleDk") || null,
    DescriptionEn: str(formData, "descriptionEn") || null,
    DescriptionBn: str(formData, "descriptionBn") || null,
    DescriptionDk: str(formData, "descriptionDk") || null,
    VideoId: str(formData, "videoId"),
    BackgroundImageUrl: str(formData, "backgroundImageUrl") || null,
    IsPublished: formData.get("isPublished") === "true",
    SortOrder: sortRaw ? Number(sortRaw) : 0,
  });
  revalidate();
}

export async function updateVideoSpeechPublishAction(formData) {
  const id = readId(formData);
  const isPublished = formData.get("isPublished") === "true";
  await updateAdminVideoSpeechPublish(id, isPublished);
  revalidate();
}

export async function deleteVideoSpeechAction(formData) {
  await deleteAdminVideoSpeech(readId(formData));
  revalidate();
}

export async function uploadVideoSpeechImageAction(formData) {
  return uploadVideoSpeechImage(formData);
}

export async function deleteVideoSpeechImageAction(formData) {
  const imagePath = String(formData.get("imagePath") ?? "");
  if (!imagePath) return;
  await deleteVideoSpeechImage(imagePath);
}
