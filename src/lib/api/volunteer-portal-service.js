import "server-only";

import { cookies } from "next/headers";
import { ADMIN_SESSION_COOKIE, ADMIN_USER_COOKIE, isVolunteerUser, parseAdminUser } from "@/lib/admin-auth";
import { ApiError } from "@/lib/api/api-error";
import { apiGet, apiPut } from "@/lib/api/api-service";

async function authConfig() {
  const store = await cookies();
  const token = store.get(ADMIN_SESSION_COOKIE)?.value;
  if (!token || !isVolunteerUser(parseAdminUser(store.get(ADMIN_USER_COOKIE)?.value))) {
    throw new ApiError("Please sign in to the volunteer portal.", { status: 401 });
  }
  return { headers: { Authorization: `Bearer ${token}` } };
}

export async function getVolunteerDirectory(params) {
  return apiGet(`VolunteerPortal/volunteers?${new URLSearchParams(params)}`, await authConfig());
}

export async function getVolunteerProfile() {
  return apiGet("VolunteerPortal/me", await authConfig());
}

export async function updateVolunteerProfile(payload) {
  return apiPut("VolunteerPortal/me", payload, await authConfig());
}
