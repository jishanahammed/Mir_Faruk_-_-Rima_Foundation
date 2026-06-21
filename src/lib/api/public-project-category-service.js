import "server-only";

import { apiGet } from "@/lib/api/api-service";

function normalizeCategory(p) {
  if (!p) return null;
  return {
    id: p?.id ?? p?.Id ?? 0,
    nameEn: p?.nameEn ?? p?.NameEn ?? "",
    nameBn: p?.nameBn ?? p?.NameBn ?? "",
    nameDk: p?.nameDk ?? p?.NameDk ?? "",
    descriptionEn: p?.descriptionEn ?? p?.DescriptionEn ?? null,
    descriptionBn: p?.descriptionBn ?? p?.DescriptionBn ?? null,
    descriptionDk: p?.descriptionDk ?? p?.DescriptionDk ?? null,
    isActive: p?.isActive ?? p?.IsActive ?? false,
    sortOrder: p?.sortOrder ?? p?.SortOrder ?? null,
  };
}

export async function getPublicProjectCategories() {
  try {
    const payload = await apiGet("ProjectCategories/public");
    const items = Array.isArray(payload) ? payload : [];
    return items.map(normalizeCategory).filter(Boolean);
  } catch {
    return [];
  }
}
