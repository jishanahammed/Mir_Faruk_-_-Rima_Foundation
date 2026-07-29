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

function normalizeAssistance(p) {
  if (!p) return null;
  return {
    id: pick(p, "id", "Id", 0),
    projectId: pick(p, "projectId", "ProjectId", 0),
    projectTitleEn: pick(p, "projectTitleEn", "ProjectTitleEn", null),
    assistanceTypeId: pick(p, "assistanceTypeId", "AssistanceTypeId", 0),
    assistanceTypeNameEn: pick(p, "assistanceTypeNameEn", "AssistanceTypeNameEn", null),
    assistanceTypeNameBn: pick(p, "assistanceTypeNameBn", "AssistanceTypeNameBn", null),
    assistanceTypeNameDk: pick(p, "assistanceTypeNameDk", "AssistanceTypeNameDk", null),
    nameEn: pick(p, "nameEn", "NameEn", ""),
    nameBn: pick(p, "nameBn", "NameBn", ""),
    nameDk: pick(p, "nameDk", "NameDk", null),
    descriptionEn: pick(p, "descriptionEn", "DescriptionEn", null),
    descriptionBn: pick(p, "descriptionBn", "DescriptionBn", null),
    descriptionDk: pick(p, "descriptionDk", "DescriptionDk", null),
    targetBeneficiaryType: pick(p, "targetBeneficiaryType", "TargetBeneficiaryType", "Individual"),
    supportMode: pick(p, "supportMode", "SupportMode", "Cash"),
    targetAmount: pick(p, "targetAmount", "TargetAmount", 0),
    collectedAmount: pick(p, "collectedAmount", "CollectedAmount", 0),
    offlineCollectedAmount: pick(p, "offlineCollectedAmount", "OfflineCollectedAmount", 0),
    totalCollectedAmount: pick(p, "totalCollectedAmount", "TotalCollectedAmount", 0),
    progressPercent: pick(p, "progressPercent", "ProgressPercent", 0),
    isActive: pick(p, "isActive", "IsActive", true),
    sortOrder: pick(p, "sortOrder", "SortOrder", null),
    createdAt: pick(p, "createdAt", "CreatedAt", null),
    updatedAt: pick(p, "updatedAt", "UpdatedAt", null),
  };
}

export async function getAdminProjectAssistances() {
  const payload = await apiGet("ProjectAssistances", await authConfig());
  const items = Array.isArray(payload) ? payload : [];
  return items.map(normalizeAssistance).filter(Boolean);
}

export async function getAdminProjectAssistancesByProject(projectId) {
  const payload = await apiGet(`ProjectAssistances/by-project/${projectId}`, await authConfig());
  const items = Array.isArray(payload) ? payload : [];
  return items.map(normalizeAssistance).filter(Boolean);
}

export async function getAdminProjectAssistanceById(id) {
  const payload = await apiGetById("ProjectAssistances", id, await authConfig());
  return normalizeAssistance(payload);
}

export async function createAdminProjectAssistance(data) {
  const payload = await apiPost("ProjectAssistances", data, await authConfig());
  return normalizeAssistance(payload);
}

export async function updateAdminProjectAssistance(id, data) {
  const payload = await apiPut(`ProjectAssistances/${id}`, data, await authConfig());
  return normalizeAssistance(payload);
}

export async function updateAdminProjectAssistanceStatus(id, isActive) {
  await apiPut(`ProjectAssistances/${id}/status`, { IsActive: isActive }, await authConfig());
}

export async function deleteAdminProjectAssistance(id) {
  await apiDelete("ProjectAssistances", id, await authConfig());
}
