"use server";

import { revalidatePath } from "next/cache";
import {
  createAdminProjectAssistance,
  updateAdminProjectAssistance,
  updateAdminProjectAssistanceStatus,
  deleteAdminProjectAssistance,
} from "@/lib/api/admin-project-assistance-service";

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
  return {
    ProjectId:              num(fd, "projectId"),
    AssistanceTypeId:       num(fd, "assistanceTypeId"),
    NameEn:                 str(fd, "nameEn"),
    NameBn:                 str(fd, "nameBn"),
    NameDk:                 str(fd, "nameDk") || null,
    DescriptionEn:          str(fd, "descriptionEn") || null,
    DescriptionBn:          str(fd, "descriptionBn") || null,
    DescriptionDk:          str(fd, "descriptionDk") || null,
    TargetBeneficiaryType:  str(fd, "targetBeneficiaryType") || "Individual",
    SupportMode:            str(fd, "supportMode") || "Cash",
    TargetAmount:           num(fd, "targetAmount") ?? 0,
    CollectedAmount:        num(fd, "collectedAmount"),
    OfflineCollectedAmount: num(fd, "offlineCollectedAmount"),
    IsActive:               fd.get("isActive") !== "false",
    SortOrder:              num(fd, "sortOrder"),
  };
}

function revalidate() {
  revalidatePath("/admin/project-assistance");
}

export async function createProjectAssistanceAction(fd) {
  await createAdminProjectAssistance(buildPayload(fd));
  revalidate();
}

export async function updateProjectAssistanceAction(fd) {
  await updateAdminProjectAssistance(readId(fd), buildPayload(fd));
  revalidate();
}

export async function updateProjectAssistanceStatusAction(fd) {
  const id = readId(fd);
  const isActive = fd.get("isActive") === "true";
  await updateAdminProjectAssistanceStatus(id, isActive);
  revalidate();
}

export async function deleteProjectAssistanceAction(fd) {
  await deleteAdminProjectAssistance(readId(fd));
  revalidate();
}
