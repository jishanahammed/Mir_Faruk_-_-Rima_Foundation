"use server";

import { getApiErrorMessage } from "@/lib/api/api-error";
import {
  assignDonorAmount,
  getDonorAvailableAmountSummary,
  searchBeneficiariesByLocation,
} from "@/lib/api/donor-amount-assignment-service";
import { getCurrentDonorUser } from "@/lib/donor-session";

function readNumber(formData, key) {
  const raw = formData.get(key);
  const parsed = Number(raw);
  return Number.isFinite(parsed) ? parsed : null;
}

export async function searchBeneficiariesAction(_prevState, formData) {
  const filters = {
    divisionId: readNumber(formData, "divisionId"),
    districtId: readNumber(formData, "districtId"),
    upazilaId: readNumber(formData, "upazilaId"),
    unionParishadorPourashavaId: readNumber(formData, "unionParishadorPourashavaId"),
    wardId: readNumber(formData, "wardId"),
    search: String(formData.get("search") ?? "").trim(),
    page: readNumber(formData, "page") || 1,
  };

  try {
    const result = await searchBeneficiariesByLocation(filters);
    return { status: "success", result, errorMessage: "" };
  } catch (error) {
    return { status: "error", result: null, errorMessage: getApiErrorMessage(error) };
  }
}

export async function assignAmountAction(_prevState, formData) {
  const beneficiaryProfileId = readNumber(formData, "beneficiaryProfileId");
  const paymentHistoryId = readNumber(formData, "paymentHistoryId");
  const amount = readNumber(formData, "amount");

  if (!beneficiaryProfileId || beneficiaryProfileId <= 0) {
    return { status: "error", errorMessage: "A valid beneficiary is required.", summary: null };
  }

  if (!paymentHistoryId || paymentHistoryId <= 0) {
    return { status: "error", errorMessage: "Select a payment to assign.", summary: null };
  }

  if (!amount || amount <= 0) {
    return { status: "error", errorMessage: "Assign amount must be greater than zero.", summary: null };
  }

  try {
    const user = await getCurrentDonorUser();
    const response = await assignDonorAmount(user, {
      beneficiaryProfileId,
      paymentHistoryId,
      amount,
    });
    return {
      status: "success",
      errorMessage: "",
      message: response.message,
      summary: response.summary,
      assignedPaymentId: paymentHistoryId,
    };
  } catch (error) {
    return { status: "error", errorMessage: getApiErrorMessage(error), summary: null };
  }
}

export async function refreshSummaryAction() {
  const user = await getCurrentDonorUser();
  return getDonorAvailableAmountSummary(user);
}
