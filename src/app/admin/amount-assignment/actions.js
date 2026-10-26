"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { getApiErrorMessage } from "@/lib/api/api-error";
import {
  ASSIGNMENT_REVIEW_OPTIONS,
  reviewAdminAmountAssignment,
} from "@/lib/api/admin-amount-assignment-service";

function readId(formData) {
  const id = Number.parseInt(String(formData.get("id") ?? ""), 10);

  if (!Number.isFinite(id) || id <= 0) {
    throw new Error("Valid amount assignment id is required.");
  }

  return id;
}

function readReturnPath(formData) {
  const returnPath = String(formData.get("returnPath") ?? "/admin/amount-assignment");
  return returnPath.startsWith("/admin/amount-assignment")
    ? returnPath
    : "/admin/amount-assignment";
}

export async function reviewAmountAssignmentAction(_previousState, formData) {
  const id = readId(formData);
  const returnPath = readReturnPath(formData);
  const requested = String(formData.get("assignmentStatus") ?? "").trim();
  const assignmentStatus = ASSIGNMENT_REVIEW_OPTIONS.find(
    (option) => option.toLowerCase() === requested.toLowerCase(),
  );

  if (!assignmentStatus) {
    return { error: "Select a valid assignment status." };
  }

  const bankLedgerId = Number(formData.get("bankLedgerId"));
  if (assignmentStatus === "Completed" && (!Number.isSafeInteger(bankLedgerId) || bankLedgerId <= 0)) {
    return { error: "Select the bank ledger to credit before approving." };
  }

  try {
    await reviewAdminAmountAssignment(
      id,
      assignmentStatus,
      String(formData.get("adminRemarks") ?? ""),
      bankLedgerId,
    );
  } catch (error) {
    return { error: getApiErrorMessage(error) };
  }

  revalidatePath("/admin/amount-assignment");
  revalidatePath("/doner/amount-allocation");
  redirect(returnPath);
}
