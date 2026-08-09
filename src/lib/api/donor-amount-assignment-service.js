import "server-only";

import { cookies } from "next/headers";
import { ApiError } from "@/lib/api/api-error";
import { apiGet, apiPost } from "@/lib/api/api-service";
import { ADMIN_SESSION_COOKIE } from "@/lib/admin-auth";
import { getAllDonorPaymentHistory, getCurrentDonorProfile } from "@/lib/api/donor-portal-service";

export const AMOUNT_ASSIGNMENT_HISTORY_PAGE_SIZE_OPTIONS = [10, 20, 30, 50];
export const BENEFICIARY_SEARCH_PAGE_SIZE_OPTIONS = [10, 20, 30, 50];

function pickValue(payload, camelKey, pascalKey, fallback) {
  return payload?.[camelKey] ?? payload?.[pascalKey] ?? fallback;
}

function normalizeNumber(value, fallback = 0) {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
}

async function getDonorAuthConfig() {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get(ADMIN_SESSION_COOKIE)?.value;

  if (!accessToken) {
    throw new ApiError("Session token is missing. Please sign in again.");
  }

  return {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  };
}

function normalizeSummary(payload) {
  return {
    donorId: normalizeNumber(pickValue(payload, "donorId", "DonorId", 0)),
    totalPaymentAmount: normalizeNumber(pickValue(payload, "totalPaymentAmount", "TotalPaymentAmount", 0)),
    totalAssignedAmount: normalizeNumber(pickValue(payload, "totalAssignedAmount", "TotalAssignedAmount", 0)),
    totalPendingAmount: normalizeNumber(pickValue(payload, "totalPendingAmount", "TotalPendingAmount", 0)),
    totalApprovedAmount: normalizeNumber(pickValue(payload, "totalApprovedAmount", "TotalApprovedAmount", 0)),
    totalAvailableAmount: normalizeNumber(pickValue(payload, "totalAvailableAmount", "TotalAvailableAmount", 0)),
  };
}

function normalizeBeneficiary(payload) {
  if (!payload) {
    return null;
  }

  return {
    id: normalizeNumber(pickValue(payload, "id", "Id", 0)),
    fullName: pickValue(payload, "fullName", "FullName", ""),
    mobile: pickValue(payload, "mobile", "Mobile", ""),
    division: pickValue(payload, "division", "Division", ""),
    district: pickValue(payload, "district", "District", ""),
    upazila: pickValue(payload, "upazila", "Upazila", ""),
    unionParishadorPourashava: pickValue(
      payload,
      "unionParishadorPourashava",
      "UnionParishadorPourashava",
      "",
    ),
    ward: pickValue(payload, "ward", "Ward", ""),
    assistanceType: pickValue(payload, "assistanceType", "AssistanceType", ""),
    status: pickValue(payload, "status", "Status", ""),
  };
}

export async function getDonorAvailableAmountSummary(user) {
  const donor = await getCurrentDonorProfile(user);
  const summary = await apiGet("AmountAssignments/me/summary", await getDonorAuthConfig());

  return normalizeSummary(summary ?? { donorId: donor.id });
}

function isApprovedPayment(payment) {
  return String(payment?.adminApprovalStatus ?? "").trim().toLowerCase() === "approved";
}

export async function getDonorAssignablePayments(user) {
  const { items } = await getAllDonorPaymentHistory(user);

  return items
    .filter((payment) => !payment.isAssigned && isApprovedPayment(payment) && payment.amount > 0)
    .map((payment) => ({
      id: payment.id,
      transactionId: payment.transactionId,
      amount: payment.amount,
      currency: payment.currency,
      paymentDate: payment.paymentDate,
      donationType: payment.donationType,
    }));
}

export async function searchBeneficiariesByLocation(filters = {}) {
  const config = await getDonorAuthConfig();
  const payload = await apiPost(
    "Beneficiaries/paged",
    {
      PageNumber: normalizeNumber(filters.page, 1) || 1,
      PageSize: normalizeNumber(filters.pageSize, BENEFICIARY_SEARCH_PAGE_SIZE_OPTIONS[0]),
      DivisionId: normalizeNumber(filters.divisionId, 0) || null,
      DistrictId: normalizeNumber(filters.districtId, 0) || null,
      UpazilaId: normalizeNumber(filters.upazilaId, 0) || null,
      UnionParishadorPourashavaId:
        normalizeNumber(filters.unionParishadorPourashavaId, 0) || null,
      WardId: normalizeNumber(filters.wardId, 0) || null,
      Status: "Approved",
      SearchText: String(filters.search ?? "").trim() || null,
    },
    config,
  );

  const items = pickValue(payload, "items", "Items", []);

  return {
    items: Array.isArray(items) ? items.map(normalizeBeneficiary).filter(Boolean) : [],
    totalCount: normalizeNumber(pickValue(payload, "totalCount", "TotalCount", 0)),
    totalPages: Math.max(1, normalizeNumber(pickValue(payload, "totalPages", "TotalPages", 0))),
    pageNumber: normalizeNumber(pickValue(payload, "pageNumber", "PageNumber", 1), 1),
    pageSize: normalizeNumber(
      pickValue(payload, "pageSize", "PageSize", BENEFICIARY_SEARCH_PAGE_SIZE_OPTIONS[0]),
      BENEFICIARY_SEARCH_PAGE_SIZE_OPTIONS[0],
    ),
    hasNextPage: Boolean(pickValue(payload, "hasNextPage", "HasNextPage", false)),
    hasPreviousPage: Boolean(pickValue(payload, "hasPreviousPage", "HasPreviousPage", false)),
  };
}

export async function assignDonorAmount(user, { beneficiaryProfileId, paymentHistoryId, amount }) {
  const config = await getDonorAuthConfig();
  const payload = await apiPost(
    "AmountAssignments/me/assign",
    {
      BeneficiaryProfileId: normalizeNumber(beneficiaryProfileId, 0),
      DonorPaymentHistoryId: normalizeNumber(paymentHistoryId, 0) || null,
      Amount: normalizeNumber(amount, 0),
    },
    config,
  );

  return {
    message: pickValue(payload, "message", "Message", "Amount assigned successfully."),
    summary: normalizeSummary(pickValue(payload, "summary", "Summary", {})),
  };
}
