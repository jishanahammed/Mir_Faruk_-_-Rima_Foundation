import "server-only";

import { cookies } from "next/headers";
import { ApiError } from "@/lib/api/api-error";
import { apiDelete, apiGetById, apiPost, apiPut } from "@/lib/api/api-service";
import { ADMIN_SESSION_COOKIE } from "@/lib/admin-auth";

export const BOARD_MEMBER_PAGE_SIZE_OPTIONS = [10, 20, 30, 50, 80, 100];

function pickValue(payload, camelKey, pascalKey, fallback) {
  return payload?.[camelKey] ?? payload?.[pascalKey] ?? fallback;
}

function normalizePageNumber(value) {
  const parsed = Number.parseInt(String(value ?? ""), 10);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : 1;
}

function normalizePageSize(value) {
  const parsed = Number.parseInt(String(value ?? ""), 10);
  return BOARD_MEMBER_PAGE_SIZE_OPTIONS.includes(parsed)
    ? parsed
    : BOARD_MEMBER_PAGE_SIZE_OPTIONS[0];
}

function normalizeSearchText(value) {
  return String(value ?? "").trim();
}

function buildAssetUrl(filePath) {
  const rawValue = String(filePath ?? "").trim();

  if (!rawValue) {
    return "";
  }

  // Route through the Next.js proxy so the browser never hits the self-signed backend directly
  const normalizedPath = rawValue.replace(/\\/g, "/").replace(/^~\//, "").replace(/^\/+/, "");
  return `/api/asset?path=${encodeURIComponent(normalizedPath)}`;
}

function normalizeBoardMember(payload) {
  if (!payload) {
    return null;
  }

  const profileImageUrl = pickValue(payload, "profileImageUrl", "ProfileImageUrl", "");

  return {
    id: pickValue(payload, "id", "Id", 0),
    serialNo: Number(pickValue(payload, "serialNo", "SerialNo", 0)) || 0,
    nameEn: pickValue(payload, "nameEn", "NameEn", ""),
    nameBn: pickValue(payload, "nameBn", "NameBn", ""),
    nameDk: pickValue(payload, "nameDk", "NameDk", ""),
    designationEn: pickValue(payload, "designationEn", "DesignationEn", ""),
    designationBn: pickValue(payload, "designationBn", "DesignationBn", ""),
    designationDk: pickValue(payload, "designationDk", "DesignationDk", ""),
    organizationNameEn: pickValue(payload, "organizationNameEn", "OrganizationNameEn", ""),
    organizationNameBn: pickValue(payload, "organizationNameBn", "OrganizationNameBn", ""),
    organizationNameDk: pickValue(payload, "organizationNameDk", "OrganizationNameDk", ""),
    responsibilityNoteEn: pickValue(payload, "responsibilityNoteEn", "ResponsibilityNoteEn", ""),
    responsibilityNoteBn: pickValue(payload, "responsibilityNoteBn", "ResponsibilityNoteBn", ""),
    responsibilityNoteDk: pickValue(payload, "responsibilityNoteDk", "ResponsibilityNoteDk", ""),
    profileImageUrl,
    profileImageAbsoluteUrl: buildAssetUrl(profileImageUrl),
    isActive: Boolean(pickValue(payload, "isActive", "IsActive", true)),
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

export async function getAdminBoardMemberList(filters = {}) {
  const payload = await apiPost(
    "BoardMembers/paged",
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
  const pageSize = pickValue(payload, "pageSize", "PageSize", BOARD_MEMBER_PAGE_SIZE_OPTIONS[0]);
  const hasNextPage = pickValue(payload, "hasNextPage", "HasNextPage", false);
  const hasPreviousPage = pickValue(payload, "hasPreviousPage", "HasPreviousPage", false);

  return {
    items: Array.isArray(items) ? items.map(normalizeBoardMember).filter(Boolean) : [],
    totalCount: Number(totalCount) || 0,
    totalPages: Math.max(1, Number(totalPages) || 0),
    pageNumber: normalizePageNumber(pageNumber),
    pageSize: normalizePageSize(pageSize),
    hasNextPage: Boolean(hasNextPage),
    hasPreviousPage: Boolean(hasPreviousPage),
  };
}

export async function getAdminBoardMemberById(id) {
  return normalizeBoardMember(
    await apiGetById("BoardMembers", id, await getAdminAuthConfig()),
  );
}

export async function updateAdminBoardMemberStatus(id, isActive) {
  return normalizeBoardMember(
    await apiPut(
      `BoardMembers/${id}/status`,
      { IsActive: Boolean(isActive) },
      await getAdminAuthConfig(),
    ),
  );
}

export async function deleteAdminBoardMember(id) {
  await apiDelete("BoardMembers", id, await getAdminAuthConfig());
}
