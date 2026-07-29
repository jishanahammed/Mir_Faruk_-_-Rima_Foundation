import "server-only";

import { cookies } from "next/headers";
import { ApiError } from "@/lib/api/api-error";
import { apiGet, apiPut } from "@/lib/api/api-service";
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

function normalizeCeoBani(p) {
  if (!p) return null;
  return {
    id: pick(p, "id", "Id", 0),
    messageEn: pick(p, "messageEn", "MessageEn", null),
    messageBn: pick(p, "messageBn", "MessageBn", null),
    messageDk: pick(p, "messageDk", "MessageDk", null),
    imageUrlEn: pick(p, "imageUrlEn", "ImageUrlEn", null),
    imageUrlBn: pick(p, "imageUrlBn", "ImageUrlBn", null),
    imageUrlDk: pick(p, "imageUrlDk", "ImageUrlDk", null),
    createdAt: pick(p, "createdAt", "CreatedAt", null),
    updatedAt: pick(p, "updatedAt", "UpdatedAt", null),
  };
}

export async function getAdminCeoBani() {
  const payload = await apiGet("CeoBani", await authConfig());
  return normalizeCeoBani(payload);
}

export async function updateAdminCeoBani(data) {
  const payload = await apiPut("CeoBani", data, await authConfig());
  return normalizeCeoBani(payload);
}
