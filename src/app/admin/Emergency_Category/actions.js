"use server";

import { revalidatePath } from "next/cache";
import {
  createAdminEmergencyCategory,
  updateAdminEmergencyCategory,
  updateAdminEmergencyCategoryStatus,
  deleteAdminEmergencyCategory,
} from "@/lib/api/admin-emergency-category-service";
import {
  uploadEmergencyCategoryImage,
  deleteEmergencyCategoryImage,
} from "@/lib/api/admin-emergency-category-upload-service";

function str(formData, key) {
  return String(formData.get(key) ?? "").trim();
}

function readId(formData) {
  const id = Number.parseInt(str(formData, "id"), 10);
  if (!Number.isFinite(id) || id <= 0) throw new Error("Valid ID is required.");
  return id;
}

function revalidate() {
  revalidatePath("/admin/Emergency_Category");
}

export async function createEmergencyCategoryAction(formData) {
  const orderRaw = str(formData, "displayOrder");
  await createAdminEmergencyCategory({
    NameEn: str(formData, "nameEn"),
    NameBn: str(formData, "nameBn"),
    NameDk: str(formData, "nameDk") || null,
    DescriptionEn: str(formData, "descriptionEn") || null,
    DescriptionBn: str(formData, "descriptionBn") || null,
    DescriptionDk: str(formData, "descriptionDk") || null,
    ImageUrl: str(formData, "imageUrl") || null,
    DisplayOrder: orderRaw ? Number(orderRaw) : 0,
    IsActive: formData.get("isActive") !== "false",
  });
  revalidate();
}

export async function updateEmergencyCategoryAction(formData) {
  const orderRaw = str(formData, "displayOrder");
  await updateAdminEmergencyCategory(readId(formData), {
    NameEn: str(formData, "nameEn"),
    NameBn: str(formData, "nameBn"),
    NameDk: str(formData, "nameDk") || null,
    DescriptionEn: str(formData, "descriptionEn") || null,
    DescriptionBn: str(formData, "descriptionBn") || null,
    DescriptionDk: str(formData, "descriptionDk") || null,
    ImageUrl: str(formData, "imageUrl") || null,
    DisplayOrder: orderRaw ? Number(orderRaw) : 0,
    IsActive: formData.get("isActive") !== "false",
  });
  revalidate();
}

export async function updateEmergencyCategoryStatusAction(formData) {
  const id = readId(formData);
  const isActive = formData.get("isActive") === "true";
  await updateAdminEmergencyCategoryStatus(id, isActive);
  revalidate();
}

export async function deleteEmergencyCategoryAction(formData) {
  await deleteAdminEmergencyCategory(readId(formData));
  revalidate();
}

export async function uploadEmergencyCategoryImageAction(formData) {
  return uploadEmergencyCategoryImage(formData);
}

export async function deleteEmergencyCategoryImageAction(formData) {
  const imagePath = str(formData, "imagePath");
  await deleteEmergencyCategoryImage(imagePath);
}
