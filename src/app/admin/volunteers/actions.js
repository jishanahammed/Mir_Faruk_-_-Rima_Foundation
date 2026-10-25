"use server";

import { revalidatePath } from "next/cache";
import { createAdminVolunteer, deleteAdminVolunteer, updateAdminVolunteer, updateAdminVolunteerStatus } from "@/lib/api/admin-volunteer-service";
import { volunteerPayload, volunteerErrorMessage } from "@/lib/volunteer-registration";

async function mutate(id, action) {
  try {
    if (!Number.isSafeInteger(id) || id <= 0) throw new Error("A valid volunteer ID is required.");
    await action();
    revalidatePath("/admin/volunteers");
    return { ok: true };
  } catch (error) { return { ok: false, message: volunteerErrorMessage(error) }; }
}

export async function saveVolunteerAction(id, input) {
  return mutate(id, () => updateAdminVolunteer(id, adminPayload(input)));
}

function adminPayload(input) {
  return { ...volunteerPayload(input), isLeader: input?.isLeader === true,
    ...(typeof input?.password === "string" && input.password ? { password: input.password } : {}) };
}

export async function createVolunteerAction(input) {
  try {
    await createAdminVolunteer(adminPayload(input));
    revalidatePath("/admin/volunteers");
    return { ok: true };
  } catch (error) { return { ok: false, message: volunteerErrorMessage(error) }; }
}

export async function setVolunteerStatusAction(id, key, value) {
  if (!["isApprove", "isActive"].includes(key) || typeof value !== "boolean") {
    return { ok: false, message: "Choose a valid volunteer status." };
  }
  return mutate(id, () => updateAdminVolunteerStatus(id, { [key]: value }));
}

export async function deleteVolunteerAction(id) {
  return mutate(id, () => deleteAdminVolunteer(id));
}
