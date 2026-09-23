import "server-only";

import { cookies } from "next/headers";
import { ApiError } from "@/lib/api/api-error";
import { apiGet, apiPost, apiPut, apiDelete } from "@/lib/api/api-service";
import { ADMIN_SESSION_COOKIE } from "@/lib/admin-auth";

const BASE = "accounting/settings";

function pick(payload, camelKey, pascalKey, fallback) {
  return payload?.[camelKey] ?? payload?.[pascalKey] ?? fallback;
}

async function authConfig() {
  const cookieStore = await cookies();
  const token = cookieStore.get(ADMIN_SESSION_COOKIE)?.value;
  if (!token) throw new ApiError("Admin session token is missing.");
  return { headers: { Authorization: `Bearer ${token}` } };
}

function normalizeEndpoint(p) {
  if (!p) return null;
  return {
    id: pick(p, "id", "Id", 0),
    endpointKey: pick(p, "endpointKey", "EndpointKey", ""),
    displayName: pick(p, "displayName", "DisplayName", ""),
    apiUrl: pick(p, "apiUrl", "ApiUrl", ""),
    description: pick(p, "description", "Description", ""),
    isActive: Boolean(pick(p, "isActive", "IsActive", true)),
    // The built-in URL, so the screen can show what a delete would fall back to.
    defaultUrl: pick(p, "defaultUrl", "DefaultUrl", ""),
    isDefault: Boolean(pick(p, "isDefault", "IsDefault", false)),
    createdAt: pick(p, "createdAt", "CreatedAt", null),
    updatedAt: pick(p, "updatedAt", "UpdatedAt", null),
  };
}

function normalizeEndpointKey(p) {
  if (!p) return null;
  return {
    key: pick(p, "key", "Key", ""),
    displayName: pick(p, "displayName", "DisplayName", ""),
    defaultUrl: pick(p, "defaultUrl", "DefaultUrl", ""),
    description: pick(p, "description", "Description", ""),
    isConfigured: Boolean(pick(p, "isConfigured", "IsConfigured", false)),
  };
}

function normalizeVoucherSetting(p) {
  if (!p) return null;
  return {
    id: pick(p, "id", "Id", 0),
    purpose: pick(p, "purpose", "Purpose", ""),
    purposeName: pick(p, "purposeName", "PurposeName", ""),
    receiptVoucherTypeId: Number(pick(p, "receiptVoucherTypeId", "ReceiptVoucherTypeId", 0)) || 0,
    receiptVoucherTypeName: pick(p, "receiptVoucherTypeName", "ReceiptVoucherTypeName", ""),
    voucherNoPrefix: pick(p, "voucherNoPrefix", "VoucherNoPrefix", ""),
    fiscalYearId: Number(pick(p, "fiscalYearId", "FiscalYearId", 0)) || 0,
    taxYearId: Number(pick(p, "taxYearId", "TaxYearId", 0)) || 0,
    companyId: Number(pick(p, "companyId", "CompanyId", 0)) || 0,
    fundSourceId: Number(pick(p, "fundSourceId", "FundSourceId", 0)) || 0,
    projectId: Number(pick(p, "projectId", "ProjectId", 0)) || 0,
    isActive: Boolean(pick(p, "isActive", "IsActive", true)),
    updatedAt: pick(p, "updatedAt", "UpdatedAt", null),
  };
}

function normalizeVoucherPurpose(p) {
  if (!p) return null;
  return {
    purpose: pick(p, "purpose", "Purpose", ""),
    displayName: pick(p, "displayName", "DisplayName", ""),
    defaultPrefix: pick(p, "defaultPrefix", "DefaultPrefix", ""),
    description: pick(p, "description", "Description", ""),
    isConfigured: Boolean(pick(p, "isConfigured", "IsConfigured", false)),
  };
}

// ── Endpoints ────────────────────────────────────────────────────────────────

export async function getAccountingEndpoints() {
  const payload = await apiGet(`${BASE}/endpoints`, await authConfig());
  const items = Array.isArray(payload) ? payload : [];
  return items.map(normalizeEndpoint).filter(Boolean);
}

export async function getAccountingEndpointKeys() {
  const payload = await apiGet(`${BASE}/endpoints/keys`, await authConfig());
  const items = Array.isArray(payload) ? payload : [];
  return items.map(normalizeEndpointKey).filter(Boolean);
}

export async function createAccountingEndpoint(data) {
  return normalizeEndpoint(await apiPost(`${BASE}/endpoints`, data, await authConfig()));
}

export async function updateAccountingEndpoint(id, data) {
  return normalizeEndpoint(await apiPut(`${BASE}/endpoints/${id}`, data, await authConfig()));
}

export async function updateAccountingEndpointStatus(id, isActive) {
  await apiPut(`${BASE}/endpoints/${id}/status`, { IsActive: isActive }, await authConfig());
}

export async function deleteAccountingEndpoint(id) {
  await apiDelete(`${BASE}/endpoints`, id, await authConfig());
}

// ── Voucher settings ─────────────────────────────────────────────────────────

export async function getVoucherSettings() {
  const payload = await apiGet(`${BASE}/vouchers`, await authConfig());
  const items = Array.isArray(payload) ? payload : [];
  return items.map(normalizeVoucherSetting).filter(Boolean);
}

export async function getVoucherPurposes() {
  const payload = await apiGet(`${BASE}/vouchers/purposes`, await authConfig());
  const items = Array.isArray(payload) ? payload : [];
  return items.map(normalizeVoucherPurpose).filter(Boolean);
}

export async function createVoucherSetting(data) {
  return normalizeVoucherSetting(await apiPost(`${BASE}/vouchers`, data, await authConfig()));
}

export async function updateVoucherSetting(id, data) {
  return normalizeVoucherSetting(await apiPut(`${BASE}/vouchers/${id}`, data, await authConfig()));
}

export async function updateVoucherSettingStatus(id, isActive) {
  await apiPut(`${BASE}/vouchers/${id}/status`, { IsActive: isActive }, await authConfig());
}

export async function deleteVoucherSetting(id) {
  await apiDelete(`${BASE}/vouchers`, id, await authConfig());
}
