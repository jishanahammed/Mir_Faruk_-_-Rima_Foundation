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

function normalizeCategory(p) {
  if (!p) return null;
  return {
    id: pick(p, "id", "Id", 0),
    nameEn: pick(p, "nameEn", "NameEn", ""),
    nameBn: pick(p, "nameBn", "NameBn", ""),
    nameDk: pick(p, "nameDk", "NameDk", null),
    descriptionEn: pick(p, "descriptionEn", "DescriptionEn", null),
    descriptionBn: pick(p, "descriptionBn", "DescriptionBn", null),
    descriptionDk: pick(p, "descriptionDk", "DescriptionDk", null),
    imageUrl: pick(p, "imageUrl", "ImageUrl", null),
    displayOrder: pick(p, "displayOrder", "DisplayOrder", 0),
    isActive: pick(p, "isActive", "IsActive", true),
    createdAt: pick(p, "createdAt", "CreatedAt", null),
    updatedAt: pick(p, "updatedAt", "UpdatedAt", null),
  };
}

export async function getAdminEmergencyCategories() {
  const payload = await apiGet("EmergencyCategories", await authConfig());
  const items = Array.isArray(payload) ? payload : [];
  return items.map(normalizeCategory).filter(Boolean);
}

export async function getAdminEmergencyCategoryById(id) {
  const payload = await apiGetById("EmergencyCategories", id, await authConfig());
  return normalizeCategory(payload);
}

export async function createAdminEmergencyCategory(data) {
  const payload = await apiPost("EmergencyCategories", data, await authConfig());
  return normalizeCategory(payload);
}

export async function updateAdminEmergencyCategory(id, data) {
  const payload = await apiPut(`EmergencyCategories/${id}`, data, await authConfig());
  return normalizeCategory(payload);
}

export async function updateAdminEmergencyCategoryStatus(id, isActive) {
  await apiPut(`EmergencyCategories/${id}/status`, { IsActive: isActive }, await authConfig());
}

export async function deleteAdminEmergencyCategory(id) {
  await apiDelete("EmergencyCategories", id, await authConfig());
}
