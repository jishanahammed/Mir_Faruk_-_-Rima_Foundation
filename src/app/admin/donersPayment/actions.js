"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { getApiErrorMessage } from "@/lib/api/api-error";
import {
  addAdminDonorPaymentHistory,
  ADMIN_APPROVAL_STATUS_OPTIONS,
  deleteAdminDonorPaymentHistory,
  DONATION_TYPE_OPTIONS,
  PAYMENT_METHOD_OPTIONS,
  PAYMENT_STATUS_OPTIONS,
  updateAdminDonorPaymentApprovalStatus,
  updateAdminDonorPaymentStatus,
} from "@/lib/api/admin-donor-payment-history-service";

function readId(formData) {
  const id = Number.parseInt(String(formData.get("id") ?? ""), 10);

  if (!Number.isFinite(id) || id <= 0) {
    throw new Error("Valid payment history id is required.");
  }

  return id;
}

function readReturnPath(formData) {
  const returnPath = String(formData.get("returnPath") ?? "/admin/donersPayment");
  return returnPath.startsWith("/admin/donersPayment")
    ? returnPath
    : "/admin/donersPayment";
}

function readRequiredText(formData, name, label) {
  const value = String(formData.get(name) ?? "").trim();

  if (!value) {
    return { error: `${label} is required.` };
  }

  return { value };
}

function readRequiredOption(formData, name, label, options) {
  const value = String(formData.get(name) ?? "").trim();
  const match = options.find((option) => option.toLowerCase() === value.toLowerCase());

  if (!match) {
    return { error: `Valid ${label} is required.` };
  }

  return { value: match };
}

function readRequiredPositiveNumber(formData, name, label) {
  const value = Number(formData.get(name));

  if (!Number.isFinite(value) || value <= 0) {
    return { error: `${label} must be greater than zero.` };
  }

  return { value };
}

function readRequiredDate(formData, name, label) {
  const value = String(formData.get(name) ?? "").trim();
  const date = new Date(value);

  if (!value || Number.isNaN(date.getTime())) {
    return { error: `Valid ${label} is required.` };
  }

  return { value };
}

export async function addPaymentHistoryAction(_state, formData) {
  const donorId = readRequiredPositiveNumber(formData, "donorId", "Donor");
  const transactionId = readRequiredText(formData, "transactionId", "Transaction ID");
  const donationType = readRequiredOption(
    formData,
    "donationType",
    "donation type",
    DONATION_TYPE_OPTIONS,
  );
  const paymentMethod = readRequiredOption(
    formData,
    "paymentMethod",
    "payment method",
    PAYMENT_METHOD_OPTIONS,
  );
  const paymentDate = readRequiredDate(formData, "paymentDate", "payment date");
  const amount = readRequiredPositiveNumber(formData, "amount", "Amount");
  const currency = readRequiredText(formData, "currency", "Currency");
  const paymentStatus = readRequiredOption(
    formData,
    "paymentStatus",
    "payment status",
    PAYMENT_STATUS_OPTIONS,
  );
  const adminApprovalStatus = readRequiredOption(
    formData,
    "adminApprovalStatus",
    "admin approval status",
    ADMIN_APPROVAL_STATUS_OPTIONS,
  );

  const validationError = [
    donorId,
    transactionId,
    donationType,
    paymentMethod,
    paymentDate,
    amount,
    currency,
    paymentStatus,
    adminApprovalStatus,
  ].find((item) => item.error);

  if (validationError) {
    return { message: validationError.error };
  }

  try {
    const result = await addAdminDonorPaymentHistory({
      DonorId: donorId.value,
      TransactionId: transactionId.value,
      DonationType: donationType.value,
      PaymentMethod: paymentMethod.value,
      PaymentDate: paymentDate.value,
      Amount: amount.value,
      Currency: currency.value.toUpperCase(),
      PaymentStatus: paymentStatus.value,
      AdminApprovalStatus: adminApprovalStatus.value,
      ReceiptUrl: String(formData.get("receiptUrl") ?? "").trim(),
      Remarks: String(formData.get("remarks") ?? "").trim(),
    });

    revalidatePath("/admin/donersPayment");

    return {
      success: true,
      message: result.message,
    };
  } catch (error) {
    return {
      message: getApiErrorMessage(error),
    };
  }
}

export async function updatePaymentStatusAction(formData) {
  const returnPath = readReturnPath(formData);

  await updateAdminDonorPaymentStatus(
    readId(formData),
    String(formData.get("paymentStatus") ?? "").trim(),
  );

  revalidatePath("/admin/donersPayment");
  redirect(returnPath);
}

export async function updateAdminApprovalStatusAction(formData) {
  const returnPath = readReturnPath(formData);

  await updateAdminDonorPaymentApprovalStatus(
    readId(formData),
    String(formData.get("adminApprovalStatus") ?? "").trim(),
  );

  revalidatePath("/admin/donersPayment");
  redirect(returnPath);
}

export async function updatePaymentHistoryStatusesAction(formData) {
  const id = readId(formData);
  const returnPath = readReturnPath(formData);
  const paymentStatus = readRequiredOption(
    formData,
    "paymentStatus",
    "payment status",
    PAYMENT_STATUS_OPTIONS,
  );
  const adminApprovalStatus = readRequiredOption(
    formData,
    "adminApprovalStatus",
    "admin approval status",
    ADMIN_APPROVAL_STATUS_OPTIONS,
  );
  const validationError = [paymentStatus, adminApprovalStatus].find((item) => item.error);

  if (validationError) {
    throw new Error(validationError.error);
  }

  await updateAdminDonorPaymentStatus(id, paymentStatus.value);
  await updateAdminDonorPaymentApprovalStatus(id, adminApprovalStatus.value);

  revalidatePath("/admin/donersPayment");
  redirect(returnPath);
}

export async function deletePaymentHistoryAction(formData) {
  const returnPath = readReturnPath(formData);

  await deleteAdminDonorPaymentHistory(readId(formData));

  revalidatePath("/admin/donersPayment");
  redirect(returnPath);
}
