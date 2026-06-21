"use server";

import { revalidatePath } from "next/cache";
import {
  createAdminProjectCategory,
  updateAdminProjectCategory,
  updateAdminProjectCategoryStatus,
  deleteAdminProjectCategory,
} from "@/lib/api/admin-project-category-service";

function str(formData, key) {
  return String(formData.get(key) ?? "").trim();
}

function readId(formData) {
  const id = Number.parseInt(str(formData, "id"), 10);
  if (!Number.isFinite(id) || id <= 0) throw new Error("Valid ID is required.");
  return id;
}

function revalidate() {
  revalidatePath("/admin/project-category");
}

export async function createProjectCategoryAction(formData) {
  const sortRaw = str(formData, "sortOrder");
  await createAdminProjectCategory({
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

export async function updateProjectCategoryAction(formData) {
  const sortRaw = str(formData, "sortOrder");
  await updateAdminProjectCategory(readId(formData), {
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

export async function updateProjectCategoryStatusAction(formData) {
  const id = readId(formData);
  const isActive = formData.get("isActive") === "true";
  await updateAdminProjectCategoryStatus(id, isActive);
  revalidate();
}

export async function deleteProjectCategoryAction(formData) {
  await deleteAdminProjectCategory(readId(formData));
  revalidate();
}
