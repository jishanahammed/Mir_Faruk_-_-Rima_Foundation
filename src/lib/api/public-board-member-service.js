import "server-only";

import { apiGet } from "@/lib/api/api-service";

function buildAssetUrl(filePath) {
  const rawValue = String(filePath ?? "").trim();
  if (!rawValue) return "";
  const normalizedPath = rawValue
    .replace(/\\/g, "/")
    .replace(/^~\//, "")
    .replace(/^\/+/, "");
  return `/api/asset?path=${encodeURIComponent(normalizedPath)}`;
}

function normalizeMember(payload) {
  if (!payload) return null;
  const profileImageUrl = payload?.profileImageUrl ?? payload?.ProfileImageUrl ?? "";
  return {
    id: payload?.id ?? payload?.Id ?? 0,
    serialNo: Number(payload?.serialNo ?? payload?.SerialNo ?? 0) || 0,
    nameEn: payload?.nameEn ?? payload?.NameEn ?? "",
    nameBn: payload?.nameBn ?? payload?.NameBn ?? "",
    nameDk: payload?.nameDk ?? payload?.NameDk ?? "",
    designationEn: payload?.designationEn ?? payload?.DesignationEn ?? "",
    designationBn: payload?.designationBn ?? payload?.DesignationBn ?? "",
    designationDk: payload?.designationDk ?? payload?.DesignationDk ?? "",
    organizationNameEn: payload?.organizationNameEn ?? payload?.OrganizationNameEn ?? "",
    organizationNameBn: payload?.organizationNameBn ?? payload?.OrganizationNameBn ?? "",
    organizationNameDk: payload?.organizationNameDk ?? payload?.OrganizationNameDk ?? "",
    responsibilityNoteEn: payload?.responsibilityNoteEn ?? payload?.ResponsibilityNoteEn ?? "",
    responsibilityNoteBn: payload?.responsibilityNoteBn ?? payload?.ResponsibilityNoteBn ?? "",
    responsibilityNoteDk: payload?.responsibilityNoteDk ?? payload?.ResponsibilityNoteDk ?? "",
    profileImageUrl,
    profileImageAbsoluteUrl: buildAssetUrl(profileImageUrl),
  };
}

export async function getPublicBoardMembers() {
  try {
    const payload = await apiGet("BoardMembers/public");
    const items = Array.isArray(payload) ? payload : (payload?.items ?? payload?.Items ?? []);
    return items.map(normalizeMember).filter(Boolean);
  } catch {
    return [];
  }
}
