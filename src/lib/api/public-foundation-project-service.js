import "server-only";

import { apiGet } from "@/lib/api/api-service";

function pick(p, k, K, fb) {
  return p?.[k] ?? p?.[K] ?? fb;
}

function buildImageUrl(rawPath) {
  if (!rawPath) return null;
  const clean = String(rawPath).replace(/\\/g, "/").replace(/^~\//, "").replace(/^\/+/, "");
  return `/api/asset?path=${encodeURIComponent(clean)}`;
}

function normalizeImage(img) {
  if (!img) return null;
  return {
    id: pick(img, "id", "Id", 0),
    imagePath: pick(img, "imagePath", "ImagePath", ""),
    imageUrl: buildImageUrl(pick(img, "imagePath", "ImagePath", "")),
    sortOrder: pick(img, "sortOrder", "SortOrder", null),
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
    objectiveEn: pick(p, "objectiveEn", "ObjectiveEn", null),
    objectiveBn: pick(p, "objectiveBn", "ObjectiveBn", null),
    objectiveDk: pick(p, "objectiveDk", "ObjectiveDk", null),
    targetBeneficiary: pick(p, "targetBeneficiary", "TargetBeneficiary", null),
    projectLocationEn: pick(p, "projectLocationEn", "ProjectLocationEn", null),
    projectLocationBn: pick(p, "projectLocationBn", "ProjectLocationBn", null),
    projectLocationDk: pick(p, "projectLocationDk", "ProjectLocationDk", null),
    estimatedBudget: pick(p, "estimatedBudget", "EstimatedBudget", null),
    collectedAmount: pick(p, "collectedAmount", "CollectedAmount", null),
    distributedAmount: pick(p, "distributedAmount", "DistributedAmount", null),
    status: pick(p, "status", "Status", "active"),
    sortOrder: pick(p, "sortOrder", "SortOrder", null),
    images: (pick(p, "images", "Images", []) ?? []).map(normalizeImage).filter(Boolean),
  };
}

export async function getPublicProjectsByCategory(categoryId) {
  try {
    const payload = await apiGet(`FoundationProjects/public?categoryId=${categoryId}`);
    const items = Array.isArray(payload) ? payload : [];
    return items.map(normalizeProject).filter(Boolean);
  } catch {
    return [];
  }
}
