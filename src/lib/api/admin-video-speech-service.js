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

function normalizeVideoSpeech(p) {
  if (!p) return null;
  return {
    id: pick(p, "id", "Id", 0),
    nameEn: pick(p, "nameEn", "NameEn", ""),
    nameBn: pick(p, "nameBn", "NameBn", ""),
    nameDk: pick(p, "nameDk", "NameDk", null),
    roleEn: pick(p, "roleEn", "RoleEn", ""),
    roleBn: pick(p, "roleBn", "RoleBn", ""),
    roleDk: pick(p, "roleDk", "RoleDk", null),
    descriptionEn: pick(p, "descriptionEn", "DescriptionEn", null),
    descriptionBn: pick(p, "descriptionBn", "DescriptionBn", null),
    descriptionDk: pick(p, "descriptionDk", "DescriptionDk", null),
    videoId: pick(p, "videoId", "VideoId", ""),
    backgroundImageUrl: pick(p, "backgroundImageUrl", "BackgroundImageUrl", null),
    isPublished: pick(p, "isPublished", "IsPublished", false),
    sortOrder: pick(p, "sortOrder", "SortOrder", 0),
    createdAt: pick(p, "createdAt", "CreatedAt", null),
    updatedAt: pick(p, "updatedAt", "UpdatedAt", null),
  };
}

export async function getAdminVideoSpeeches() {
  const payload = await apiGet("VideoSpeeches", await authConfig());
  const items = Array.isArray(payload) ? payload : [];
  return items.map(normalizeVideoSpeech).filter(Boolean);
}

export async function getAdminVideoSpeechById(id) {
  const payload = await apiGetById("VideoSpeeches", id, await authConfig());
  return normalizeVideoSpeech(payload);
}

export async function createAdminVideoSpeech(data) {
  const payload = await apiPost("VideoSpeeches", data, await authConfig());
  return normalizeVideoSpeech(payload);
}

export async function updateAdminVideoSpeech(id, data) {
  const payload = await apiPut(`VideoSpeeches/${id}`, data, await authConfig());
  return normalizeVideoSpeech(payload);
}

export async function updateAdminVideoSpeechPublish(id, isPublished) {
  await apiPut(`VideoSpeeches/${id}/publish`, { IsPublished: isPublished }, await authConfig());
}

export async function deleteAdminVideoSpeech(id) {
  await apiDelete("VideoSpeeches", id, await authConfig());
}
