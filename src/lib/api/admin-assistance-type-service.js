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

function normalizeAssistanceType(p) {
  if (!p) return null;
  return {
    id: pick(p, "id", "Id", 0),
    nameEn: pick(p, "nameEn", "NameEn", ""),
    nameBn: pick(p, "nameBn", "NameBn", ""),
    nameDk: pick(p, "nameDk", "NameDk", null),
    descriptionEn: pick(p, "descriptionEn", "DescriptionEn", null),
    descriptionBn: pick(p, "descriptionBn", "DescriptionBn", null),
    descriptionDk: pick(p, "descriptionDk", "DescriptionDk", null),
    isActive: pick(p, "isActive", "IsActive", true),
    sortOrder: pick(p, "sortOrder", "SortOrder", null),
    createdAt: pick(p, "createdAt", "CreatedAt", null),
    updatedAt: pick(p, "updatedAt", "UpdatedAt", null),
  };
}

export async function getAdminAssistanceTypes() {
  const payload = await apiGet("AssistanceTypes", await authConfig());
  const items = Array.isArray(payload) ? payload : [];
  return items.map(normalizeAssistanceType).filter(Boolean);
}

export async function getAdminAssistanceTypeById(id) {
  const payload = await apiGetById("AssistanceTypes", id, await authConfig());
  return normalizeAssistanceType(payload);
}

export async function createAdminAssistanceType(data) {
  const payload = await apiPost("AssistanceTypes", data, await authConfig());
  return normalizeAssistanceType(payload);
}

export async function updateAdminAssistanceType(id, data) {
  const payload = await apiPut(`AssistanceTypes/${id}`, data, await authConfig());
  return normalizeAssistanceType(payload);
}

export async function updateAdminAssistanceTypeStatus(id, isActive) {
  await apiPut(`AssistanceTypes/${id}/status`, { IsActive: isActive }, await authConfig());
}

export async function deleteAdminAssistanceType(id) {
  await apiDelete("AssistanceTypes", id, await authConfig());
}
