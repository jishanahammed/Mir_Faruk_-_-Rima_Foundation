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

function normalizeCredential(p) {
  if (!p) return null;
  return {
    id: pick(p, "id", "Id", 0),
    name: pick(p, "name", "Name", ""),
    userName: pick(p, "userName", "UserName", ""),
    password: pick(p, "password", "Password", ""),
    hasPassword: pick(p, "hasPassword", "HasPassword", false),
    loginApiUrl: pick(p, "loginApiUrl", "LoginApiUrl", ""),
    notes: pick(p, "notes", "Notes", null),
    isActive: pick(p, "isActive", "IsActive", true),
    createdAt: pick(p, "createdAt", "CreatedAt", null),
    updatedAt: pick(p, "updatedAt", "UpdatedAt", null),
  };
}

/**
 * Returns the single saved credential, or null before any have been entered.
 * The API answers 204 in that case, which arrives here as an empty body.
 */
export async function getAdminAccountingCredential() {
  const payload = await apiGet("AccountingCredentials", await authConfig());
  return normalizeCredential(payload);
}

/** Creates the record on first save, updates it thereafter. */
export async function saveAdminAccountingCredential(data) {
  const payload = await apiPut("AccountingCredentials", data, await authConfig());
  return normalizeCredential(payload);
}
