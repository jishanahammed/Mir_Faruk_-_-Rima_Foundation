import "server-only";

import { apiGet } from "@/lib/api/api-service";

function pick(p, k, K, fb) {
  return p?.[k] ?? p?.[K] ?? fb;
}

function buildImageUrl(rawPath) {
  if (!rawPath) return null;
  const clean = String(rawPath).replace(/\\/g, "/").replace(/^~\//, "").replace(/^\/+/, "");
  return `/api/asset?path=${encodeURIComponent(clean)}`;
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
    imageUrl: buildImageUrl(pick(p, "imageUrl", "ImageUrl", null)),
    displayOrder: pick(p, "displayOrder", "DisplayOrder", 0),
  };
}

export async function getPublicEmergencyCategories() {
  try {
    const payload = await apiGet("EmergencyCategories/public");
    const items = Array.isArray(payload) ? payload : [];
    return items.map(normalizeCategory).filter(Boolean);
  } catch {
    return [];
  }
}
