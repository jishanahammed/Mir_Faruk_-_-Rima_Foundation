"use server";

import { revalidatePath } from "next/cache";
import {
  createAdminAssistanceType,
  updateAdminAssistanceType,
  updateAdminAssistanceTypeStatus,
  deleteAdminAssistanceType,
} from "@/lib/api/admin-assistance-type-service";

function str(formData, key) {
  return String(formData.get(key) ?? "").trim();
}

function readId(formData) {
  const id = Number.parseInt(str(formData, "id"), 10);
  if (!Number.isFinite(id) || id <= 0) throw new Error("Valid ID is required.");
  return id;
}

function revalidate() {
  revalidatePath("/admin/assistance-type");
}

export async function createAssistanceTypeAction(formData) {
  const sortRaw = str(formData, "sortOrder");
  await createAdminAssistanceType({
    NameEn: str(formData, "nameEn"),
    NameBn: str(formData, "nameBn"),
    NameDk: str(formData, "nameDk") || null,
    DescriptionEn: str(formData, "descriptionEn") || null,
    DescriptionBn: str(formData, "descriptionBn") || null,
    DescriptionDk: str(formData, "descriptionDk") || null,
    IsActive: formData.get("isActive") !== "false",
    SortOrder: sortRaw ? Number(sortRaw) : null,
  });
  revalidate();
}

export async function updateAssistanceTypeAction(formData) {
  const sortRaw = str(formData, "sortOrder");
  await updateAdminAssistanceType(readId(formData), {
    NameEn: str(formData, "nameEn"),
    NameBn: str(formData, "nameBn"),
    NameDk: str(formData, "nameDk") || null,
    DescriptionEn: str(formData, "descriptionEn") || null,
    DescriptionBn: str(formData, "descriptionBn") || null,
    DescriptionDk: str(formData, "descriptionDk") || null,
    IsActive: formData.get("isActive") !== "false",
    SortOrder: sortRaw ? Number(sortRaw) : null,
  });
  revalidate();
}

export async function updateAssistanceTypeStatusAction(formData) {
  const id = readId(formData);
  const isActive = formData.get("isActive") === "true";
  await updateAdminAssistanceTypeStatus(id, isActive);
  revalidate();
}

export async function deleteAssistanceTypeAction(formData) {
  await deleteAdminAssistanceType(readId(formData));
  revalidate();
}
