import "server-only";

import { apiGet } from "@/lib/api/api-service";

function norm(item) {
  if (!item) return null;
  const id   = item.id   ?? item.Id;
  const en   = item.nameEn ?? item.NameEn ?? "";
  const bn   = item.nameBn ?? item.NameBn ?? "";
  const dk   = item.nameDk ?? item.NameDk ?? null;
  return { id, nameEn: en, nameBn: bn, nameDk: dk };
}

async function fetchList(path) {
  try {
    const data = await apiGet(path);
    return Array.isArray(data) ? data.map(norm).filter(Boolean) : [];
  } catch {
    return [];
  }
}

export async function getDivisions()                   { return fetchList("Locations/divisions"); }
export async function getDistricts(divisionId = null)  {
  const qs = divisionId ? `?divisionId=${divisionId}` : "";
  return fetchList(`Locations/districts${qs}`);
}
export async function getUpazilas(districtId = null) {
  const qs = districtId ? `?districtId=${districtId}` : "";
  return fetchList(`Locations/upazilas${qs}`);
}
