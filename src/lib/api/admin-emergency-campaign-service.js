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
    emergencyCampaignId: pick(p, "emergencyCampaignId", "EmergencyCampaignId", 0),
    imagePath: pick(p, "imagePath", "ImagePath", ""),
    sortOrder: pick(p, "sortOrder", "SortOrder", null),
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
    beneficiaryPhone: pick(p, "beneficiaryPhone", "BeneficiaryPhone", null),
    beneficiaryAddressEn: pick(p, "beneficiaryAddressEn", "BeneficiaryAddressEn", null),
    beneficiaryAddressBn: pick(p, "beneficiaryAddressBn", "BeneficiaryAddressBn", null),
    beneficiaryAddressDk: pick(p, "beneficiaryAddressDk", "BeneficiaryAddressDk", null),
    hospitalOrInstitutionName: pick(p, "hospitalOrInstitutionName", "HospitalOrInstitutionName", null),
    referenceNumber: pick(p, "referenceNumber", "ReferenceNumber", null),
    coverImageUrl: pick(p, "coverImageUrl", "CoverImageUrl", null),
    isFeatured: pick(p, "isFeatured", "IsFeatured", false),
    isUrgent: pick(p, "isUrgent", "IsUrgent", true),
    isVerified: pick(p, "isVerified", "IsVerified", false),
    status: pick(p, "status", "Status", "draft"),
    startDateUtc: pick(p, "startDateUtc", "StartDateUtc", null),
    endDateUtc: pick(p, "endDateUtc", "EndDateUtc", null),
    sortOrder: pick(p, "sortOrder", "SortOrder", null),
    images: (pick(p, "images", "Images", []) ?? []).map(normalizeImage).filter(Boolean),
    createdAt: pick(p, "createdAt", "CreatedAt", null),
    updatedAt: pick(p, "updatedAt", "UpdatedAt", null),
  };
}

export async function getAdminEmergencyCampaigns() {
  const payload = await apiGet("EmergencyCampaigns", await authConfig());
  const items = Array.isArray(payload) ? payload : [];
  return items.map(normalizeCampaign).filter(Boolean);
}

export async function getAdminEmergencyCampaignById(id) {
  const payload = await apiGetById("EmergencyCampaigns", id, await authConfig());
  return normalizeCampaign(payload);
}

export async function createAdminEmergencyCampaign(data) {
  const payload = await apiPost("EmergencyCampaigns", data, await authConfig());
  return normalizeCampaign(payload);
}

export async function updateAdminEmergencyCampaign(id, data) {
  const payload = await apiPut(`EmergencyCampaigns/${id}`, data, await authConfig());
  return normalizeCampaign(payload);
}

export async function updateAdminEmergencyCampaignStatus(id, status) {
  await apiPut(`EmergencyCampaigns/${id}/status`, { Status: status }, await authConfig());
}

export async function deleteAdminEmergencyCampaign(id) {
  await apiDelete("EmergencyCampaigns", id, await authConfig());
}
