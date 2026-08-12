import "server-only";

import { cookies } from "next/headers";
import { ApiError } from "@/lib/api/api-error";
import { apiGet, apiGetById, apiPut, apiDelete } from "@/lib/api/api-service";
import { ADMIN_SESSION_COOKIE } from "@/lib/admin-auth";

export const CUSTOMER_FEEDBACK_STATUS_OPTIONS = ["New", "Reviewed", "Published", "Rejected"];

function pick(payload, camelKey, pascalKey, fallback) {
  return payload?.[camelKey] ?? payload?.[pascalKey] ?? fallback;
}

async function authConfig() {
  const cookieStore = await cookies();
  const token = cookieStore.get(ADMIN_SESSION_COOKIE)?.value;
  if (!token) throw new ApiError("Admin session token is missing.");
  return { headers: { Authorization: `Bearer ${token}` } };
}

function normalizeCustomerFeedback(p) {
  if (!p) return null;
  return {
    id: pick(p, "id", "Id", 0),
    googleUserId: pick(p, "googleUserId", "GoogleUserId", ""),
    fullName: pick(p, "fullName", "FullName", ""),
    email: pick(p, "email", "Email", ""),
    profileImageUrl: pick(p, "profileImageUrl", "ProfileImageUrl", null),
    rating: Number(pick(p, "rating", "Rating", 0)) || 0,
    message: pick(p, "message", "Message", ""),
    status: pick(p, "status", "Status", "New"),
    adminRemarks: pick(p, "adminRemarks", "AdminRemarks", null),
    createdAt: pick(p, "createdAt", "CreatedAt", null),
    updatedAt: pick(p, "updatedAt", "UpdatedAt", null),
  };
}

export async function getAdminCustomerFeedbackList(status) {
  const url = status ? `CustomerFeedbacks?status=${encodeURIComponent(status)}` : "CustomerFeedbacks";
  const payload = await apiGet(url, await authConfig());
  const items = Array.isArray(payload) ? payload : [];
  return items.map(normalizeCustomerFeedback).filter(Boolean);
}

export async function getAdminCustomerFeedbackById(id) {
  const payload = await apiGetById("CustomerFeedbacks", id, await authConfig());
  return normalizeCustomerFeedback(payload);
}

export async function updateAdminCustomerFeedbackStatus(id, status, adminRemarks) {
  const payload = await apiPut(
    `CustomerFeedbacks/${id}/status`,
    { Status: status, AdminRemarks: adminRemarks?.trim() || null },
    await authConfig(),
  );
  return normalizeCustomerFeedback(payload);
}

export async function deleteAdminCustomerFeedback(id) {
  await apiDelete("CustomerFeedbacks", id, await authConfig());
}
