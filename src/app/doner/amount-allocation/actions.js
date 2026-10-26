"use server";

import { revalidatePath } from "next/cache";
import { getApiErrorMessage } from "@/lib/api/api-error";
import { assignDonorAmount, getDonorAssignablePayments, getDonorAvailableAmountSummary, getAllocationOptions, searchAllocationTargets } from "@/lib/api/donor-amount-assignment-service";
import { getCurrentDonorUser } from "@/lib/donor-session";
import { readAllocationFilters } from "@/lib/allocation-filters";

function positiveId(formData, key) {
  const raw = String(formData.get(key) ?? "").trim();
  if (!raw) return null;
  const value = Number(raw);
  return Number.isSafeInteger(value) && value > 0 ? value : null;
}

export async function searchAllocationTargetsAction(formData) {
  const parsed = readAllocationFilters(formData);
  if (parsed.error) return { success: false, message: parsed.error };
  try {
    await getCurrentDonorUser();
    const result = await searchAllocationTargets({ ...parsed.filters,
      search: String(formData.get("search") ?? "").trim().slice(0, 100),
      beneficiaryPage: positiveId(formData, "beneficiaryPage") || 1, assistancePage: positiveId(formData, "assistancePage") || 1,
    });
    return { success: true, result };
  } catch (error) { return { success: false, message: getApiErrorMessage(error) }; }
}

export async function assignAmountAction(formData) {
  const parsed = readAllocationFilters(formData);
  if (parsed.error) return { success: false, message: parsed.error };
  const beneficiaryProfileId = positiveId(formData, "beneficiaryProfileId");
  const projectAssistanceId = positiveId(formData, "projectAssistanceId");
  const paymentHistoryId = positiveId(formData, "paymentHistoryId");
  const amount = Number(formData.get("amount"));
  if (Boolean(beneficiaryProfileId) === Boolean(projectAssistanceId)) return { success: false, message: "Select one beneficiary or project assistance." };
  if (!paymentHistoryId) return { success: false, message: "Select an available payment." };
  if (!Number.isFinite(amount) || amount <= 0 || Math.abs(amount * 100 - Math.round(amount * 100)) > 0.000001) {
    return { success: false, message: "Enter a positive amount with at most two decimal places." };
  }
  try {
    const user = await getCurrentDonorUser();
    const response = await assignDonorAmount(user, { ...parsed.filters, beneficiaryProfileId, projectAssistanceId, paymentHistoryId, amount });
    let payments = null;
    try { payments = await getDonorAssignablePayments(user); } catch { /* Allocation is saved; a payment refresh can be retried safely. */ }
    revalidatePath("/doner/amount-allocation");
    revalidatePath("/doner/payment-history");
    revalidatePath("/admin/amount-assignment");
    return { success: true, ...response, payments, assignedPaymentId: paymentHistoryId,
      warning: payments === null ? "Allocation saved. Refresh payments to load the latest available balance." : "" };
  } catch (error) { return { success: false, message: getApiErrorMessage(error) }; }
}

export async function refreshAllocationDataAction() {
  const user = await getCurrentDonorUser();
  try {
    const [summary, payments, options] = await Promise.all([getDonorAvailableAmountSummary(user), getDonorAssignablePayments(user), getAllocationOptions()]);
    return { success: true, summary, payments, options };
  } catch (error) { return { success: false, message: getApiErrorMessage(error) }; }
}
