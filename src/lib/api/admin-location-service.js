import "server-only";

import { cookies } from "next/headers";
import { ApiError } from "@/lib/api/api-error";
import { apiGet, apiPost, apiPut, apiDelete } from "@/lib/api/api-service";
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

function normalizeDivision(p) {
  if (!p) return null;
  return {
    id: pick(p, "id", "Id", 0),
    nameEn: pick(p, "nameEn", "NameEn", ""),
    nameBn: pick(p, "nameBn", "NameBn", ""),
    nameDk: pick(p, "nameDk", "NameDk", ""),
  };
}

function normalizeDistrict(p) {
  if (!p) return null;
  return {
    id: pick(p, "id", "Id", 0),
    divisionId: pick(p, "divisionId", "DivisionId", 0),
    nameEn: pick(p, "nameEn", "NameEn", ""),
    nameBn: pick(p, "nameBn", "NameBn", ""),
    nameDk: pick(p, "nameDk", "NameDk", ""),
  };
}

function normalizeUpazila(p) {
  if (!p) return null;
  return {
    id: pick(p, "id", "Id", 0),
    districtId: pick(p, "districtId", "DistrictId", 0),
    nameEn: pick(p, "nameEn", "NameEn", ""),
    nameBn: pick(p, "nameBn", "NameBn", ""),
    nameDk: pick(p, "nameDk", "NameDk", ""),
  };
}

function normalizeList(payload, normalizer) {
  const items = Array.isArray(payload) ? payload : [];
  return items.map(normalizer).filter(Boolean);
}

// ── Divisions ────────────────────────────────────────────────────────────────
export async function getAdminDivisions() {
  const payload = await apiGet("Locations/divisions", await authConfig());
  return normalizeList(payload, normalizeDivision);
}

export async function createAdminDivision(data) {
  const payload = await apiPost("Locations/divisions", data, await authConfig());
  return normalizeDivision(payload);
}

export async function updateAdminDivision(id, data) {
  const payload = await apiPut(`Locations/divisions/${id}`, data, await authConfig());
  return normalizeDivision(payload);
}

export async function deleteAdminDivision(id) {
  await apiDelete("Locations/divisions", id, await authConfig());
}

// ── Districts ────────────────────────────────────────────────────────────────
export async function getAdminDistricts(divisionId) {
  const url = divisionId ? `Locations/districts?divisionId=${divisionId}` : "Locations/districts";
  const payload = await apiGet(url, await authConfig());
  return normalizeList(payload, normalizeDistrict);
}

export async function createAdminDistrict(data) {
  const payload = await apiPost("Locations/districts", data, await authConfig());
  return normalizeDistrict(payload);
}

export async function updateAdminDistrict(id, data) {
  const payload = await apiPut(`Locations/districts/${id}`, data, await authConfig());
  return normalizeDistrict(payload);
}

export async function deleteAdminDistrict(id) {
  await apiDelete("Locations/districts", id, await authConfig());
}

// ── Upazilas ─────────────────────────────────────────────────────────────────
export async function getAdminUpazilas(districtId) {
  const url = districtId ? `Locations/upazilas?districtId=${districtId}` : "Locations/upazilas";
  const payload = await apiGet(url, await authConfig());
  return normalizeList(payload, normalizeUpazila);
}

export async function createAdminUpazila(data) {
  const payload = await apiPost("Locations/upazilas", data, await authConfig());
  return normalizeUpazila(payload);
}

export async function updateAdminUpazila(id, data) {
  const payload = await apiPut(`Locations/upazilas/${id}`, data, await authConfig());
  return normalizeUpazila(payload);
}

export async function deleteAdminUpazila(id) {
  await apiDelete("Locations/upazilas", id, await authConfig());
}
