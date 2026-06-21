"use server";

import { revalidatePath } from "next/cache";
import {
  createAdminFoundationProject,
  updateAdminFoundationProject,
  updateAdminFoundationProjectStatus,
  deleteAdminFoundationProject,
} from "@/lib/api/admin-foundation-project-service";
import { uploadProjectImages, deleteProjectImage } from "@/lib/api/admin-upload-service";

function str(fd, key) {
  return String(fd.get(key) ?? "").trim();
}

function num(fd, key) {
  const v = str(fd, key);
  return v ? Number(v) : null;
}

function readId(fd) {
  const id = Number.parseInt(str(fd, "id"), 10);
  if (!Number.isFinite(id) || id <= 0) throw new Error("Valid ID is required.");
  return id;
}

function buildPayload(fd) {
  const imagePaths = fd.getAll("imagePaths").map((v) => String(v).trim()).filter(Boolean);
  return {
    ProjectCode:        str(fd, "projectCode"),
    ProjectCategoryId:  Number(str(fd, "projectCategoryId")) || 0,
    ProjectTitleEn:     str(fd, "projectTitleEn"),
    ProjectTitleBn:     str(fd, "projectTitleBn"),
    ProjectTitleDk:     str(fd, "projectTitleDk") || null,
    ShortDescriptionEn: str(fd, "shortDescriptionEn") || null,
    ShortDescriptionBn: str(fd, "shortDescriptionBn") || null,
    ShortDescriptionDk: str(fd, "shortDescriptionDk") || null,
    FullDescriptionEn:  str(fd, "fullDescriptionEn") || null,
    FullDescriptionBn:  str(fd, "fullDescriptionBn") || null,
    FullDescriptionDk:  str(fd, "fullDescriptionDk") || null,
    ObjectiveEn:        str(fd, "objectiveEn") || null,
    ObjectiveBn:        str(fd, "objectiveBn") || null,
    ObjectiveDk:        str(fd, "objectiveDk") || null,
    TargetBeneficiary:  str(fd, "targetBeneficiary") || null,
    ProjectLocationEn:  str(fd, "projectLocationEn") || null,
    ProjectLocationBn:  str(fd, "projectLocationBn") || null,
    ProjectLocationDk:  str(fd, "projectLocationDk") || null,
    DivisionId:         num(fd, "divisionId"),
    DistrictId:         num(fd, "districtId"),
    UpazilaId:          num(fd, "upazilaId"),
    EstimatedBudget:    num(fd, "estimatedBudget"),
    CollectedAmount:    num(fd, "collectedAmount"),
    DistributedAmount:  num(fd, "distributedAmount"),
    ThumbnailImage:     str(fd, "thumbnailImage") || null,
    Status:             str(fd, "status") || "draft",
    SortOrder:          num(fd, "sortOrder"),
    ImagePaths:         imagePaths,
  };
}

function revalidate() {
  revalidatePath("/admin/Foundation_Projects");
}

export async function createFoundationProjectAction(fd) {
  await createAdminFoundationProject(buildPayload(fd));
  revalidate();
}

export async function updateFoundationProjectAction(fd) {
  await updateAdminFoundationProject(readId(fd), buildPayload(fd));
  revalidate();
}

export async function updateFoundationProjectStatusAction(fd) {
  const id = readId(fd);
  const status = str(fd, "status");
  await updateAdminFoundationProjectStatus(id, status);
  revalidate();
}

export async function deleteFoundationProjectAction(fd) {
  await deleteAdminFoundationProject(readId(fd));
  revalidate();
}

export async function uploadProjectImagesAction(fd) {
  return uploadProjectImages(fd);
}

export async function deleteProjectImageAction(fd) {
  const imagePath = str(fd, "imagePath");
  await deleteProjectImage(imagePath);
}
