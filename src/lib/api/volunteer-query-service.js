import "server-only";

import { cookies } from "next/headers";
import { ADMIN_SESSION_COOKIE, ADMIN_USER_COOKIE, isAdminUser, isVolunteerUser, parseAdminUser } from "@/lib/admin-auth";
import { ApiError } from "@/lib/api/api-error";
import { apiGet, apiPost, apiPut } from "@/lib/api/api-service";

async function authConfig(role) {
  const store = await cookies();
  const token = store.get(ADMIN_SESSION_COOKIE)?.value;
  const rawUser = store.get(ADMIN_USER_COOKIE)?.value;
  if (!token || !rawUser) throw new ApiError("Please sign in to continue.", { status: 401 });
  const user = parseAdminUser(rawUser);
  if (!(role === "admin" ? isAdminUser(user) : isVolunteerUser(user))) {
    throw new ApiError("You do not have access to these queries.", { status: 403 });
  }
  return { headers: { Authorization: `Bearer ${token}` } };
}

export async function createVolunteerQuery(payload) {
  return apiPost("VolunteerQueries", payload, await authConfig("volunteer"));
}

export async function getMyVolunteerQueries(filters) {
  return apiGet(`VolunteerQueries/mine?${new URLSearchParams(filters)}`, await authConfig("volunteer"));
}

export async function getAdminVolunteerQueries(filters) {
  return apiGet(`VolunteerQueries?${new URLSearchParams(filters)}`, await authConfig("admin"));
}

export async function getVolunteerQuerySummary() {
  return apiGet("VolunteerQueries/summary", await authConfig("admin"));
}

export async function setVolunteerQuerySeen(id, isSeen) {
  if (!Number.isSafeInteger(id) || id <= 0 || typeof isSeen !== "boolean") {
    throw new ApiError("A valid query and status are required.", { status: 400 });
  }
  return apiPut(`VolunteerQueries/${id}/status`, { isSeen }, await authConfig("admin"));
}
