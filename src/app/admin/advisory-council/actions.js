"use server";

import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";
import { ADMIN_SESSION_COOKIE } from "@/lib/admin-auth";
import { authApiClient } from "@/lib/api/server-client";

const route = "/admin/advisory-council";

async function authHeaders() {
  const token = (await cookies()).get(ADMIN_SESSION_COOKIE)?.value;
  if (!token) throw new Error("Admin session token is missing.");
  return { Authorization: `Bearer ${token}` };
}

function message(error) {
  const errors = error?.details?.errors ?? error?.response?.data?.errors;
  const first = errors && Object.values(errors).flat()[0];
  return String(first ?? error?.message ?? "The request failed.");
}

export async function deleteAdvisoryCouncil(id) {
  try {
    if (!Number.isSafeInteger(id) || id <= 0) throw new Error("Invalid council member ID.");
    await authApiClient.delete(`AdvisoryCouncil/${id}`, { headers: await authHeaders() });
    revalidatePath(route);
    return { success: true };
  } catch (error) {
    return { success: false, error: message(error) };
  }
}
