"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { updateAdminBeneficiaryStatus } from "@/lib/api/admin-beneficiary-service";

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
  const returnPath = readReturnPath(formData);
  const revalidateTarget = returnPath.split("?")[0] || "/admin/beneficiaries";

  await updateAdminBeneficiaryStatus(
    readId(formData),
    String(formData.get("status") ?? "").trim(),
  );

  revalidatePath("/admin/beneficiaries");
  revalidatePath(revalidateTarget);
  redirect(returnPath);
}
