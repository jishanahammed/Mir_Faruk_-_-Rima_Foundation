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

function normalizeCampaign(p) {
  if (!p) return null;
  return {
    id: pick(p, "id", "Id", 0),
    titleEn: pick(p, "titleEn", "TitleEn", ""),
    titleBn: pick(p, "titleBn", "TitleBn", ""),
    titleDk: pick(p, "titleDk", "TitleDk", null),
    slug: pick(p, "slug", "Slug", ""),
    emergencyCategoryId: pick(p, "emergencyCategoryId", "EmergencyCategoryId", null),
    categoryNameEn: pick(p, "categoryNameEn", "CategoryNameEn", null),
    categoryNameBn: pick(p, "categoryNameBn", "CategoryNameBn", null),
    shortDescriptionEn: pick(p, "shortDescriptionEn", "ShortDescriptionEn", ""),
    shortDescriptionBn: pick(p, "shortDescriptionBn", "ShortDescriptionBn", ""),
    shortDescriptionDk: pick(p, "shortDescriptionDk", "ShortDescriptionDk", null),
    descriptionEn: pick(p, "descriptionEn", "DescriptionEn", ""),
    descriptionBn: pick(p, "descriptionBn", "DescriptionBn", ""),
    descriptionDk: pick(p, "descriptionDk", "DescriptionDk", null),
    targetAmount: pick(p, "targetAmount", "TargetAmount", 0),
    collectedAmount: pick(p, "collectedAmount", "CollectedAmount", 0),
    offlineCollectedAmount: pick(p, "offlineCollectedAmount", "OfflineCollectedAmount", 0),
    totalCollectedAmount: pick(p, "totalCollectedAmount", "TotalCollectedAmount", 0),
    progressPercent: pick(p, "progressPercent", "ProgressPercent", 0),
    beneficiaryName: pick(p, "beneficiaryName", "BeneficiaryName", null),
    hospitalOrInstitutionName: pick(p, "hospitalOrInstitutionName", "HospitalOrInstitutionName", null),
    referenceNumber: pick(p, "referenceNumber", "ReferenceNumber", null),
    coverImageUrl: buildImageUrl(pick(p, "coverImageUrl", "CoverImageUrl", null)),
    isFeatured: pick(p, "isFeatured", "IsFeatured", false),
    isUrgent: pick(p, "isUrgent", "IsUrgent", true),
    isVerified: pick(p, "isVerified", "IsVerified", false),
    status: pick(p, "status", "Status", "active"),
    startDateUtc: pick(p, "startDateUtc", "StartDateUtc", null),
    endDateUtc: pick(p, "endDateUtc", "EndDateUtc", null),
    images: (pick(p, "images", "Images", []) ?? []).map(normalizeImage).filter(Boolean),
  };
}

export async function getAllPublicEmergencyCampaigns(categoryId) {
  try {
    const query = categoryId ? `?categoryId=${encodeURIComponent(categoryId)}` : "";
    const payload = await apiGet(`EmergencyCampaigns/public${query}`);
    const items = Array.isArray(payload) ? payload : [];
    return items.map(normalizeCampaign).filter(Boolean);
  } catch {
    return [];
  }
}

export async function getPublicEmergencyCampaignBySlug(slug) {
  try {
    const p = await apiGet(`EmergencyCampaigns/public/${encodeURIComponent(slug)}`);
    return normalizeCampaign(p);
  } catch {
    return null;
  }
}
