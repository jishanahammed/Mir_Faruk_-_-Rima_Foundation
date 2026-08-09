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

function appendQuery(url, params) {
  const query = Object.entries(params)
    .filter(([, value]) => value !== undefined && value !== null && value !== "")
    .map(([key, value]) => `${key}=${encodeURIComponent(value)}`)
    .join("&");

  if (!query) return url;
  return url.includes("?") ? `${url}&${query}` : `${url}?${query}`;
}

function normalizeDivision(p) {
  if (!p) return null;
  return {
    id: pick(p, "id", "Id", 0),
    nameEn: pick(p, "nameEn", "NameEn", ""),
    nameBn: pick(p, "nameBn", "NameBn", ""),
    nameDk: pick(p, "nameDk", "NameDk", ""),
    isActive: Boolean(pick(p, "isActive", "IsActive", false)),
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
    isActive: Boolean(pick(p, "isActive", "IsActive", false)),
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
    isActive: Boolean(pick(p, "isActive", "IsActive", false)),
  };
}

export const LOCAL_GOVERNMENT_TYPE_OPTIONS = ["UnionParishad", "Pourashava"];

export const LOCAL_GOVERNMENT_TYPE_LABELS = {
  UnionParishad: "Union Parishad",
  Pourashava: "Pourashava",
};

function normalizeLocalGovernment(p) {
  if (!p) return null;
  return {
    id: pick(p, "id", "Id", 0),
    upazilaId: pick(p, "upazilaId", "UpazilaId", 0),
    nameEn: pick(p, "nameEn", "NameEn", ""),
    nameBn: pick(p, "nameBn", "NameBn", ""),
    nameDk: pick(p, "nameDk", "NameDk", ""),
    type: pick(p, "type", "Type", ""),
    isActive: Boolean(pick(p, "isActive", "IsActive", false)),
  };
}

function normalizeWard(p) {
  if (!p) return null;
  return {
    id: pick(p, "id", "Id", 0),
    localGovernmentId: pick(p, "localGovernmentId", "LocalGovernmentId", 0),
    wardNo: Number(pick(p, "wardNo", "WardNo", 0)) || 0,
    nameEn: pick(p, "nameEn", "NameEn", ""),
    nameBn: pick(p, "nameBn", "NameBn", ""),
    nameDk: pick(p, "nameDk", "NameDk", ""),
    isActive: Boolean(pick(p, "isActive", "IsActive", false)),
  };
}

function normalizeList(payload, normalizer) {
  const items = Array.isArray(payload) ? payload : [];
  return items.map(normalizer).filter(Boolean);
}

// ── Divisions ────────────────────────────────────────────────────────────────
// The admin list management page needs to see inactive rows too (so it can
// activate them), so every admin read here requests activeOnly=false.
export async function getAdminDivisions() {
  const payload = await apiGet(
    appendQuery("Locations/divisions", { activeOnly: false }),
    await authConfig(),
  );
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

export async function setAdminDivisionActiveStatus(id, isActive) {
  const payload = await apiPut(
    `Locations/divisions/${id}/active-status`,
    { IsActive: isActive },
    await authConfig(),
  );
  return normalizeDivision(payload);
}

export async function deleteAdminDivision(id) {
  await apiDelete("Locations/divisions", id, await authConfig());
}

// ── Districts ────────────────────────────────────────────────────────────────
export async function getAdminDistricts(divisionId) {
  const url = appendQuery("Locations/districts", { divisionId, activeOnly: false });
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

export async function setAdminDistrictActiveStatus(id, isActive) {
  const payload = await apiPut(
    `Locations/districts/${id}/active-status`,
    { IsActive: isActive },
    await authConfig(),
  );
  return normalizeDistrict(payload);
}

export async function deleteAdminDistrict(id) {
  await apiDelete("Locations/districts", id, await authConfig());
}

// ── Upazilas ─────────────────────────────────────────────────────────────────
export async function getAdminUpazilas(districtId) {
  const url = appendQuery("Locations/upazilas", { districtId, activeOnly: false });
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

export async function setAdminUpazilaActiveStatus(id, isActive) {
  const payload = await apiPut(
    `Locations/upazilas/${id}/active-status`,
    { IsActive: isActive },
    await authConfig(),
  );
  return normalizeUpazila(payload);
}

export async function deleteAdminUpazila(id) {
  await apiDelete("Locations/upazilas", id, await authConfig());
}

// ── Union Parishads / Pourashavas ────────────────────────────────────────────
export async function getAdminLocalGovernments(upazilaId) {
  const url = appendQuery("Locations/local-governments", { upazilaId, activeOnly: false });
  const payload = await apiGet(url, await authConfig());
  return normalizeList(payload, normalizeLocalGovernment);
}

export async function createAdminLocalGovernment(data) {
  const payload = await apiPost("Locations/local-governments", data, await authConfig());
  return normalizeLocalGovernment(payload);
}

export async function updateAdminLocalGovernment(id, data) {
  const payload = await apiPut(`Locations/local-governments/${id}`, data, await authConfig());
  return normalizeLocalGovernment(payload);
}

export async function setAdminLocalGovernmentActiveStatus(id, isActive) {
  const payload = await apiPut(
    `Locations/local-governments/${id}/active-status`,
    { IsActive: isActive },
    await authConfig(),
  );
  return normalizeLocalGovernment(payload);
}

export async function deleteAdminLocalGovernment(id) {
  await apiDelete("Locations/local-governments", id, await authConfig());
}

// ── Wards ────────────────────────────────────────────────────────────────────
export async function getAdminWards(localGovernmentId) {
  const url = appendQuery("Locations/wards", { localGovernmentId, activeOnly: false });
  const payload = await apiGet(url, await authConfig());
  return normalizeList(payload, normalizeWard);
}

export async function createAdminWard(data) {
  const payload = await apiPost("Locations/wards", data, await authConfig());
  return normalizeWard(payload);
}

export async function updateAdminWard(id, data) {
  const payload = await apiPut(`Locations/wards/${id}`, data, await authConfig());
  return normalizeWard(payload);
}

export async function setAdminWardActiveStatus(id, isActive) {
  const payload = await apiPut(
    `Locations/wards/${id}/active-status`,
    { IsActive: isActive },
    await authConfig(),
  );
  return normalizeWard(payload);
}

export async function deleteAdminWard(id) {
  await apiDelete("Locations/wards", id, await authConfig());
}
