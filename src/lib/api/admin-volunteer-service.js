import "server-only";

import { cookies } from "next/headers";
import { ADMIN_SESSION_COOKIE, ADMIN_USER_COOKIE, isAdminUser, parseAdminUser } from "@/lib/admin-auth";
import { ApiError } from "@/lib/api/api-error";
import { apiGet, apiPost, apiPut, apiDelete } from "@/lib/api/api-service";

async function authConfig() {
  const store = await cookies();
  const token = store.get(ADMIN_SESSION_COOKIE)?.value;
  const user = parseAdminUser(store.get(ADMIN_USER_COOKIE)?.value);
  if (!token || !isAdminUser(user)) throw new ApiError("Please sign in as an administrator.", { status: 401 });
  return { headers: { Authorization: `Bearer ${token}` } };
}

export async function getAdminVolunteers(params) {
  return apiGet(`Volunteers?${new URLSearchParams(params)}`, await authConfig());
}

export async function createAdminVolunteer(payload) {
  return apiPost("Volunteers", payload, await authConfig());
}

export async function updateAdminVolunteer(id, payload) {
  return apiPut(`Volunteers/${id}`, payload, await authConfig());
}

export async function updateAdminVolunteerStatus(id, payload) {
  return apiPut(`Volunteers/${id}/status`, payload, await authConfig());
}

export async function deleteAdminVolunteer(id) {
  return apiDelete("Volunteers", id, await authConfig());
}
