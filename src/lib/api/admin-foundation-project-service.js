import "server-only";

import { cookies } from "next/headers";
import { ApiError } from "@/lib/api/api-error";
import { apiGet, apiGetById, apiPost, apiPut, apiDelete } from "@/lib/api/api-service";
import { ADMIN_SESSION_COOKIE } from "@/lib/admin-auth";

function pick(payload, camelKey, pascalKey, fallback) {
  return payload?.[camelKey] ?? payload?.[pascalKey] ?? fallback;
}

async function authConfig() {
  const cookieStore = await cookies();
  const token = cookieStore.get(ADMIN_SESSION_COOKIE)?.value;
  if (!token) throw new ApiError("Admin session token is missing.");
  return { headers: { Authorization: `Bearer ${token}` } };
}

function normalizeImage(p) {
  if (!p) return null;
  return {
    id: pick(p, "id", "Id", 0),
    projectId: pick(p, "projectId", "ProjectId", 0),
    imagePath: pick(p, "imagePath", "ImagePath", ""),
    sortOrder: pick(p, "sortOrder", "SortOrder", null),
  };
}

function normalizeProject(p) {
  if (!p) return null;
  return {
    id: pick(p, "id", "Id", 0),
    projectCode: pick(p, "projectCode", "ProjectCode", ""),
    projectCategoryId: pick(p, "projectCategoryId", "ProjectCategoryId", 0),
    categoryNameEn: pick(p, "categoryNameEn", "CategoryNameEn", null),
    projectTitleEn: pick(p, "projectTitleEn", "ProjectTitleEn", ""),
    projectTitleBn: pick(p, "projectTitleBn", "ProjectTitleBn", ""),
    projectTitleDk: pick(p, "projectTitleDk", "ProjectTitleDk", null),
    shortDescriptionEn: pick(p, "shortDescriptionEn", "ShortDescriptionEn", null),
    shortDescriptionBn: pick(p, "shortDescriptionBn", "ShortDescriptionBn", null),
    shortDescriptionDk: pick(p, "shortDescriptionDk", "ShortDescriptionDk", null),
    fullDescriptionEn: pick(p, "fullDescriptionEn", "FullDescriptionEn", null),
    fullDescriptionBn: pick(p, "fullDescriptionBn", "FullDescriptionBn", null),
    fullDescriptionDk: pick(p, "fullDescriptionDk", "FullDescriptionDk", null),
    objectiveEn: pick(p, "objectiveEn", "ObjectiveEn", null),
    objectiveBn: pick(p, "objectiveBn", "ObjectiveBn", null),
    objectiveDk: pick(p, "objectiveDk", "ObjectiveDk", null),
    targetBeneficiary: pick(p, "targetBeneficiary", "TargetBeneficiary", null),
    projectLocationEn: pick(p, "projectLocationEn", "ProjectLocationEn", null),
    projectLocationBn: pick(p, "projectLocationBn", "ProjectLocationBn", null),
    projectLocationDk: pick(p, "projectLocationDk", "ProjectLocationDk", null),
    divisionId: pick(p, "divisionId", "DivisionId", null),
    districtId: pick(p, "districtId", "DistrictId", null),
    upazilaId: pick(p, "upazilaId", "UpazilaId", null),
    estimatedBudget: pick(p, "estimatedBudget", "EstimatedBudget", null),
    collectedAmount: pick(p, "collectedAmount", "CollectedAmount", null),
    distributedAmount: pick(p, "distributedAmount", "DistributedAmount", null),
    thumbnailImage: pick(p, "thumbnailImage", "ThumbnailImage", null),
    status: pick(p, "status", "Status", "draft"),
    sortOrder: pick(p, "sortOrder", "SortOrder", null),
    images: (pick(p, "images", "Images", []) ?? []).map(normalizeImage).filter(Boolean),
    createdAt: pick(p, "createdAt", "CreatedAt", null),
    updatedAt: pick(p, "updatedAt", "UpdatedAt", null),
  };
}

export async function getAdminFoundationProjects() {
  const payload = await apiGet("FoundationProjects", await authConfig());
  const items = Array.isArray(payload) ? payload : [];
  return items.map(normalizeProject).filter(Boolean);
}

export async function getAdminFoundationProjectById(id) {
  const payload = await apiGetById("FoundationProjects", id, await authConfig());
  return normalizeProject(payload);
}

export async function createAdminFoundationProject(data) {
  const payload = await apiPost("FoundationProjects", data, await authConfig());
  return normalizeProject(payload);
}

export async function updateAdminFoundationProject(id, data) {
  const payload = await apiPut(`FoundationProjects/${id}`, data, await authConfig());
  return normalizeProject(payload);
}

export async function updateAdminFoundationProjectStatus(id, status) {
  await apiPut(`FoundationProjects/${id}/status`, { Status: status }, await authConfig());
}

export async function deleteAdminFoundationProject(id) {
  await apiDelete("FoundationProjects", id, await authConfig());
}
