"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
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

export async function reviewAmountAssignmentAction(formData) {
  const id = readId(formData);
  const returnPath = readReturnPath(formData);
  const requested = String(formData.get("assignmentStatus") ?? "").trim();
  const assignmentStatus = ASSIGNMENT_REVIEW_OPTIONS.find(
    (option) => option.toLowerCase() === requested.toLowerCase(),
  );

  if (!assignmentStatus) {
    throw new Error("Assignment status must be Pending, Completed, or Rejected.");
  }

  await reviewAdminAmountAssignment(
    id,
    assignmentStatus,
    String(formData.get("adminRemarks") ?? ""),
  );

  revalidatePath("/admin/amount-assignment");
  redirect(returnPath);
}
