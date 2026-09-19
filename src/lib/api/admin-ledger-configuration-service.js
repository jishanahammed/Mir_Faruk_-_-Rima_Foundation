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

function normalizeConfiguration(p) {
  if (!p) return null;
  return {
    id: pick(p, "id", "Id", 0),
    groupId: pick(p, "groupId", "GroupId", 0),
    ledgerType: pick(p, "ledgerType", "LedgerType", ""),
    groupCode: pick(p, "groupCode", "GroupCode", ""),
    natureId: pick(p, "natureId", "NatureId", 0),
    groupName: pick(p, "groupName", "GroupName", null),
    addApiUrl: pick(p, "addApiUrl", "AddApiUrl", null),
    updateApiUrl: pick(p, "updateApiUrl", "UpdateApiUrl", null),
    isActive: pick(p, "isActive", "IsActive", true),
    createdAt: pick(p, "createdAt", "CreatedAt", null),
    updatedAt: pick(p, "updatedAt", "UpdatedAt", null),
  };
}

function normalizeAccountGroup(p) {
  if (!p) return null;
  return {
    id: pick(p, "id", "Id", 0),
    // Each group carries its own nature, so one selection fills both fields.
    natureId: pick(p, "natureId", "NatureId", 0),
    groupCode: pick(p, "groupCode", "GroupCode", ""),
    groupName: pick(p, "groupName", "GroupName", ""),
    groupNameBN: pick(p, "groupNameBN", "GroupNameBN", null),
  };
}

export async function getLedgerConfigurations() {
  const payload = await apiGet("LedgerConfiguration", await authConfig());
  const items = Array.isArray(payload) ? payload : [];
  return items.map(normalizeConfiguration).filter(Boolean);
}

export async function getLedgerTypes() {
  const payload = await apiGet("LedgerConfiguration/ledger-types", await authConfig());
  return Array.isArray(payload) ? payload : [];
}

/**
 * Account groups come from the accounting system, so a provider-side failure is
 * reported rather than thrown — the screen still renders without the dropdown.
 */
export async function getAccountGroups() {
  try {
    const payload = await apiGet("LedgerConfiguration/account-groups", await authConfig());
    const list = pick(payload, "list", "List", []);
    return {
      success: pick(payload, "success", "Success", false),
      message: pick(payload, "message", "Message", ""),
      list: (Array.isArray(list) ? list : []).map(normalizeAccountGroup).filter(Boolean),
    };
  } catch (err) {
    return { success: false, message: err?.message ?? "Could not load account groups.", list: [] };
  }
}

export async function createLedgerConfiguration(data) {
  const payload = await apiPost("LedgerConfiguration", data, await authConfig());
  return normalizeConfiguration(payload);
}

export async function updateLedgerConfiguration(id, data) {
  const payload = await apiPut(`LedgerConfiguration/${id}`, data, await authConfig());
  return normalizeConfiguration(payload);
}

export async function updateLedgerConfigurationStatus(id, isActive) {
  await apiPut(`LedgerConfiguration/${id}/status`, { IsActive: isActive }, await authConfig());
}

export async function deleteLedgerConfiguration(id) {
  await apiDelete("LedgerConfiguration", id, await authConfig());
}
