import "server-only";

import { cookies } from "next/headers";
import { ApiError } from "@/lib/api/api-error";
import { apiDelete, apiGetById, apiPost, apiPut } from "@/lib/api/api-service";
import { ADMIN_SESSION_COOKIE } from "@/lib/admin-auth";

export const DONOR_PAGE_SIZE_OPTIONS = [10, 20, 30, 50, 80, 100];

function pickValue(payload, camelKey, pascalKey, fallback) {
  return payload?.[camelKey] ?? payload?.[pascalKey] ?? fallback;
}

function normalizePageNumber(value) {
  const parsed = Number.parseInt(String(value ?? ""), 10);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : 1;
}

function normalizePageSize(value) {
  const parsed = Number.parseInt(String(value ?? ""), 10);
  return DONOR_PAGE_SIZE_OPTIONS.includes(parsed) ? parsed : DONOR_PAGE_SIZE_OPTIONS[0];
}

function normalizeSearchText(value) {
  return String(value ?? "").trim();
}

function normalizeDonor(payload) {
  if (!payload) {
    return null;
  }

  return {
    id: pickValue(payload, "id", "Id", 0),
    userId: pickValue(payload, "userId", "UserId", ""),
    fullName: pickValue(payload, "fullName", "FullName", ""),
    email: pickValue(payload, "email", "Email", ""),
    mobile: pickValue(payload, "mobile", "Mobile", ""),
    address: pickValue(payload, "address", "Address", ""),
    profession: pickValue(payload, "profession", "Profession", ""),
    donorType: pickValue(payload, "donorType", "DonorType", ""),
    purpose: pickValue(payload, "purpose", "Purpose", ""),
    frequency: pickValue(payload, "frequency", "Frequency", ""),
    contactFullName: pickValue(payload, "contactFullName", "ContactFullName", ""),
    contactMobile: pickValue(payload, "contactMobile", "ContactMobile", ""),
    contactTelephone: pickValue(payload, "contactTelephone", "ContactTelephone", ""),
    isApprove: Boolean(pickValue(payload, "isApprove", "IsApprove", false)),
    isPublic: Boolean(pickValue(payload, "isPublic", "IsPublic", false)),
    createdAt: pickValue(payload, "createdAt", "CreatedAt", null),
    updatedAt: pickValue(payload, "updatedAt", "UpdatedAt", null),
  };
}

async function getAdminAuthConfig() {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get(ADMIN_SESSION_COOKIE)?.value;

  if (!accessToken) {
    throw new ApiError("Admin session token is missing.");
  }

  return {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  };
}

export async function getAdminDonorList(filters = {}) {
  const payload = await apiPost(
    "Donors/paged",
    {
      PageNumber: normalizePageNumber(filters.page),
      PageSize: normalizePageSize(filters.pageSize),
      SearchText: normalizeSearchText(filters.search) || null,
    },
    await getAdminAuthConfig(),
  );

  const items = pickValue(payload, "items", "Items", []);
  const totalCount = pickValue(payload, "totalCount", "TotalCount", 0);
  const totalPages = pickValue(payload, "totalPages", "TotalPages", 0);
  const pageNumber = pickValue(payload, "pageNumber", "PageNumber", 1);
  const pageSize = pickValue(payload, "pageSize", "PageSize", DONOR_PAGE_SIZE_OPTIONS[0]);
  const hasNextPage = pickValue(payload, "hasNextPage", "HasNextPage", false);
  const hasPreviousPage = pickValue(payload, "hasPreviousPage", "HasPreviousPage", false);

  return {
    items: Array.isArray(items) ? items.map(normalizeDonor).filter(Boolean) : [],
    totalCount: Number(totalCount) || 0,
    totalPages: Math.max(1, Number(totalPages) || 0),
    pageNumber: normalizePageNumber(pageNumber),
    pageSize: normalizePageSize(pageSize),
    hasNextPage: Boolean(hasNextPage),
    hasPreviousPage: Boolean(hasPreviousPage),
  };
}

export async function getAdminDonorById(id) {
  return normalizeDonor(await apiGetById("Donors", id, await getAdminAuthConfig()));
}

export async function updateAdminDonor(id, data) {
  return normalizeDonor(await apiPut(`Donors/${id}`, data, await getAdminAuthConfig()));
}

export async function updateAdminDonorApproval(id, isApprove) {
  return normalizeDonor(await apiPut(`Donors/${id}/approval`, { IsApprove: isApprove }, await getAdminAuthConfig()));
}

export async function updateAdminDonorVisibility(id, isPublic) {
  return normalizeDonor(await apiPut(`Donors/${id}/visibility`, { IsPublic: isPublic }, await getAdminAuthConfig()));
}

export async function deleteAdminDonor(id) {
  await apiDelete("Donors", id, await getAdminAuthConfig());
}
