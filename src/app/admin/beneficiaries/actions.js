"use server";

import { revalidatePath } from "next/cache";
import { updateAdminBeneficiaryStatus, approveAdminBeneficiary } from "@/lib/api/admin-beneficiary-service";
import { getApiErrorMessage } from "@/lib/api/api-error";

function readId(formData) {
  const id = Number.parseInt(String(formData.get("id") ?? ""), 10);

  if (!Number.isFinite(id) || id <= 0) {
    throw new Error("Valid beneficiary id is required.");
  }

  return id;
}

function readReturnPath(formData) {
  const returnPath = String(formData.get("returnPath") ?? "/admin/beneficiaries");
  return returnPath.startsWith("/admin/beneficiaries")
    ? returnPath
    : "/admin/beneficiaries";
}

export async function updateBeneficiaryStatusAction(formData) {
  try {
    const id = readId(formData);
    const status = String(formData.get("status") ?? "").trim();
    if (!["Pending", "UnderReview", "Approved", "Rejected"].includes(status)) {
      return { success: false, message: "Select a valid beneficiary status." };
    }
    const beneficiary = await updateAdminBeneficiaryStatus(id, status);
    revalidateBeneficiary(id);
    revalidatePath(readReturnPath(formData).split("?")[0]);
    return { success: true, beneficiary, message: status === "Approved" ? "Beneficiary approved and accounting ledger linked." : "Beneficiary status updated." };
  } catch (error) {
    return { success: false, message: getApiErrorMessage(error) };
  }
}

function revalidateBeneficiary(id) {
  revalidatePath("/admin/beneficiaries");
  revalidatePath(`/admin/beneficiaries/${id}`);
  revalidatePath("/admin");
}

export async function approveBeneficiaryAction(id) {
  if (!Number.isSafeInteger(id) || id <= 0) return { success: false, message: "Valid beneficiary id is required." };
  try {
    const beneficiary = await approveAdminBeneficiary(id);
    revalidateBeneficiary(id);
    return { success: true, beneficiary, message: "Beneficiary approved and accounting ledger linked." };
  } catch (error) {
    return { success: false, message: getApiErrorMessage(error) };
  }
}
