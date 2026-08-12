"use server";

import { revalidatePath } from "next/cache";
import {
  CUSTOMER_FEEDBACK_STATUS_OPTIONS,
  updateAdminCustomerFeedbackStatus,
  deleteAdminCustomerFeedback,
} from "@/lib/api/admin-customer-feedback-service";

function str(formData, key) {
  return String(formData.get(key) ?? "").trim();
}

function readId(formData) {
  const id = Number.parseInt(str(formData, "id"), 10);
  if (!Number.isFinite(id) || id <= 0) throw new Error("Valid ID is required.");
  return id;
}

function revalidate() {
  revalidatePath("/admin/customer-feedback");
}

export async function updateCustomerFeedbackStatusAction(formData) {
  const requested = str(formData, "status");
  const status = CUSTOMER_FEEDBACK_STATUS_OPTIONS.find(
    (option) => option.toLowerCase() === requested.toLowerCase(),
  );

  if (!status) {
    throw new Error("A valid feedback status is required.");
  }

  await updateAdminCustomerFeedbackStatus(readId(formData), status, str(formData, "adminRemarks"));
  revalidate();
}

export async function deleteCustomerFeedbackAction(formData) {
  await deleteAdminCustomerFeedback(readId(formData));
  revalidate();
}
