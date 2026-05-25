"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import {
  deleteAdminDonor,
  updateAdminDonor,
  updateAdminDonorApproval,
  updateAdminDonorVisibility,
} from "@/lib/api/admin-donor-service";

function readBoolean(value) {
  return String(value ?? "").toLowerCase() === "true";
}

function readId(formData) {
  const id = Number.parseInt(String(formData.get("id") ?? ""), 10);

  if (!Number.isFinite(id) || id <= 0) {
    throw new Error("Valid donor id is required.");
  }

  return id;
}

function readReturnPath(formData) {
  const returnPath = String(formData.get("returnPath") ?? "/admin/donors");
  return returnPath.startsWith("/admin/donors") ? returnPath : "/admin/donors";
}

export async function updateDonorApprovalAction(formData) {
  await updateAdminDonorApproval(readId(formData), readBoolean(formData.get("isApprove")));
  revalidatePath("/admin/donors");
  redirect(readReturnPath(formData));
}

export async function updateDonorVisibilityAction(formData) {
  await updateAdminDonorVisibility(readId(formData), readBoolean(formData.get("isPublic")));
  revalidatePath("/admin/donors");
  redirect(readReturnPath(formData));
}

export async function deleteDonorAction(formData) {
  await deleteAdminDonor(readId(formData));
  revalidatePath("/admin/donors");
  redirect(readReturnPath(formData));
}

export async function updateDonorAction(formData) {
  const id = readId(formData);

  await updateAdminDonor(id, {
    FullName: String(formData.get("fullName") ?? "").trim(),
    Email: String(formData.get("email") ?? "").trim(),
    Mobile: String(formData.get("mobile") ?? "").trim(),
    Address: String(formData.get("address") ?? "").trim(),
    Profession: String(formData.get("profession") ?? "").trim(),
    DonorType: String(formData.get("donorType") ?? "").trim(),
    Purpose: String(formData.get("purpose") ?? "").trim(),
    Frequency: String(formData.get("frequency") ?? "").trim(),
    ContactFullName: String(formData.get("contactFullName") ?? "").trim(),
    ContactMobile: String(formData.get("contactMobile") ?? "").trim(),
    ContactTelephone: String(formData.get("contactTelephone") ?? "").trim(),
  });

  revalidatePath("/admin/donors");
  redirect("/admin/donors");
}
