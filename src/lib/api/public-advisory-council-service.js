import "server-only";

import { apiGet } from "@/lib/api/api-service";

function imageUrl(path) {
  const normalized = String(path ?? "")
    .trim()
    .replace(/\\/g, "/")
    .replace(/^~\//, "")
    .replace(/^\/+/, "");

  return normalized ? `/api/asset?path=${encodeURIComponent(normalized)}` : "";
}

export async function getPublicAdvisoryCouncil() {
  try {
    const payload = await apiGet("AdvisoryCouncil/public");
    const items = Array.isArray(payload) ? payload : [];

    return {
      members: items.map((item) => ({
        id: item.id ?? item.Id,
        name: item.name ?? item.Name ?? "",
        designation: item.designation ?? item.Designation ?? "",
        objective: item.objective ?? item.Objective ?? "",
        description: item.description ?? item.Description ?? "",
        orderNo: Number(item.orderNo ?? item.OrderNo ?? 0),
        imageUrl: imageUrl(item.imageUrl ?? item.ImageUrl),
      })).filter((item) => item.name),
      loadError: false,
    };
  } catch {
    return { members: [], loadError: true };
  }
}
