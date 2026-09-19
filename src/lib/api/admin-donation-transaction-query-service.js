import "server-only";

import { cookies } from "next/headers";
import { ApiError } from "@/lib/api/api-error";
import { apiGet, apiGetById, apiPut, apiDelete } from "@/lib/api/api-service";
import { ADMIN_SESSION_COOKIE } from "@/lib/admin-auth";

function pick(p, camel, pascal, fallback) {
  return p?.[camel] ?? p?.[pascal] ?? fallback;
}

async function authConfig() {
  const cookieStore = await cookies();
  const token = cookieStore.get(ADMIN_SESSION_COOKIE)?.value;
  if (!token) throw new ApiError("Admin session token is missing.");
  return { headers: { Authorization: `Bearer ${token}` } };
}

function normalizeQuery(p) {
  if (!p) return null;
  return {
    id: pick(p, "id", "Id", 0),
    fullName: pick(p, "fullName", "FullName", ""),
    email: pick(p, "email", "Email", ""),
    mobile: pick(p, "mobile", "Mobile", null),
    donorReference: pick(p, "donorReference", "DonorReference", null),
    message: pick(p, "message", "Message", ""),
    donorProfileId: pick(p, "donorProfileId", "DonorProfileId", null),
    donorName: pick(p, "donorName", "DonorName", null),
    donorId: pick(p, "donorId", "DonorId", null),
    isLinked: Boolean(pick(p, "isLinked", "IsLinked", false)),
    isSeen: Boolean(pick(p, "isSeen", "IsSeen", false)),
    seenAt: pick(p, "seenAt", "SeenAt", null),
    adminRemarks: pick(p, "adminRemarks", "AdminRemarks", null),
    createdAt: pick(p, "createdAt", "CreatedAt", null),
  };
}

export async function getDonationTransactionQueries() {
  const payload = await apiGet("DonationTransactionQueries", await authConfig());
  const items = Array.isArray(payload) ? payload : [];
  return items.map(normalizeQuery).filter(Boolean);
}

/** Drives the unseen badge in the admin sidebar. */
export async function getDonationTransactionQuerySummary() {
  try {
    const payload = await apiGet("DonationTransactionQueries/summary", await authConfig());
    return {
      total: pick(payload, "total", "Total", 0),
      unseen: pick(payload, "unseen", "Unseen", 0),
    };
  } catch {
    // The badge must never take the dashboard down.
    return { total: 0, unseen: 0 };
  }
}

/** Fetching a single query marks it seen server-side. */
export async function getDonationTransactionQueryById(id) {
  const payload = await apiGetById("DonationTransactionQueries", id, await authConfig());
  return normalizeQuery(payload);
}

export async function updateDonationTransactionQueryStatus(id, isSeen, adminRemarks) {
  await apiPut(
    `DonationTransactionQueries/${id}/status`,
    { IsSeen: isSeen, AdminRemarks: adminRemarks ?? null },
    await authConfig(),
  );
}

export async function deleteDonationTransactionQuery(id) {
  await apiDelete("DonationTransactionQueries", id, await authConfig());
}
