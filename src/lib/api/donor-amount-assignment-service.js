import "server-only";

import { cookies } from "next/headers";
import { ApiError } from "@/lib/api/api-error";
import { apiGet, apiPost } from "@/lib/api/api-service";
import { ADMIN_SESSION_COOKIE, ADMIN_USER_COOKIE, isDonorUser, parseAdminUser } from "@/lib/admin-auth";

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
  const rawUser = cookieStore.get(ADMIN_USER_COOKIE)?.value;

  if (!accessToken || !rawUser || !isDonorUser(parseAdminUser(rawUser))) {
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
    projectId: normalizeNumber(pickValue(payload, "projectId", "ProjectId", 0)),
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
  const summary = await apiGet("AmountAssignments/me/summary", await getDonorAuthConfig());

  return normalizeSummary(summary ?? {});
}

export async function getDonorAssignablePayments(user) {
  const payload = await apiGet("AmountAssignments/me/payments", await getDonorAuthConfig());
  const items = Array.isArray(payload) ? payload : [];
  return items.map((payment) => ({
    id: normalizeNumber(pickValue(payment, "id", "Id", 0)),
    transactionId: pickValue(payment, "transactionId", "TransactionId", ""),
    amount: normalizeNumber(pickValue(payment, "amount", "Amount", 0)),
    currency: pickValue(payment, "currency", "Currency", "BDT"),
    paymentDate: pickValue(payment, "paymentDate", "PaymentDate", null),
  }));
}

export async function getAllocationOptions() {
  const payload = await apiGet("AmountAssignments/me/options", await getDonorAuthConfig());
  const projects = pickValue(payload, "projects", "Projects", []);
  const divisions = pickValue(payload, "divisions", "Divisions", []);
  return {
    projects: projects.map((x) => ({ id: pickValue(x, "id", "Id", 0), projectCode: pickValue(x, "projectCode", "ProjectCode", ""), projectTitleEn: pickValue(x, "projectTitleEn", "ProjectTitleEn", ""), status: pickValue(x, "status", "Status", "") })),
    divisions: divisions.map((x) => ({ id: pickValue(x, "id", "Id", 0), nameEn: pickValue(x, "nameEn", "NameEn", ""), nameBn: pickValue(x, "nameBn", "NameBn", "") })),
  };
}

function normalizePage(payload, normalizeItem) {
  return {
    items: pickValue(payload, "items", "Items", []).map(normalizeItem).filter(Boolean),
    totalCount: normalizeNumber(pickValue(payload, "totalCount", "TotalCount", 0)),
    totalPages: Math.max(1, normalizeNumber(pickValue(payload, "totalPages", "TotalPages", 1))),
    pageNumber: normalizeNumber(pickValue(payload, "pageNumber", "PageNumber", 1), 1),
    pageSize: normalizeNumber(pickValue(payload, "pageSize", "PageSize", 10), 10),
    hasNextPage: Boolean(pickValue(payload, "hasNextPage", "HasNextPage", false)),
    hasPreviousPage: Boolean(pickValue(payload, "hasPreviousPage", "HasPreviousPage", false)),
  };
}

function normalizeAssistance(x) {
  return {
    id: normalizeNumber(pickValue(x, "id", "Id", 0)), projectId: normalizeNumber(pickValue(x, "projectId", "ProjectId", 0)),
    donationCode: pickValue(x, "donationCode", "DonationCode", ""), nameEn: pickValue(x, "nameEn", "NameEn", ""),
    descriptionEn: pickValue(x, "descriptionEn", "DescriptionEn", ""), supportMode: pickValue(x, "supportMode", "SupportMode", ""),
    targetAmount: normalizeNumber(pickValue(x, "targetAmount", "TargetAmount", 0)),
    totalCollectedAmount: normalizeNumber(pickValue(x, "totalCollectedAmount", "TotalCollectedAmount", 0)),
    allocatedAmount: normalizeNumber(pickValue(x, "allocatedAmount", "AllocatedAmount", 0)),
  };
}

export async function searchAllocationTargets(filters) {
  const payload = await apiPost("AmountAssignments/me/search", {
    ProjectId: filters.projectId, DivisionId: filters.divisionId, DistrictId: filters.districtId,
    UpazilaId: filters.upazilaId, UnionParishadorPourashavaId: filters.unionParishadorPourashavaId, WardId: filters.wardId,
    SearchText: filters.search || null, BeneficiaryPage: filters.beneficiaryPage || 1,
    AssistancePage: filters.assistancePage || 1, PageSize: 10,
  }, await getDonorAuthConfig());
  return {
    project: pickValue(payload, "project", "Project", {}),
    beneficiaries: normalizePage(pickValue(payload, "beneficiaries", "Beneficiaries", {}), normalizeBeneficiary),
    projectAssistances: normalizePage(pickValue(payload, "projectAssistances", "ProjectAssistances", {}), normalizeAssistance),
  };
}

export async function assignDonorAmount(user, data) {
  const payload = await apiPost("AmountAssignments/me/assign", {
    ProjectId: data.projectId, DivisionId: data.divisionId, DistrictId: data.districtId,
    UpazilaId: data.upazilaId, UnionParishadorPourashavaId: data.unionParishadorPourashavaId, WardId: data.wardId,
    BeneficiaryProfileId: data.beneficiaryProfileId || null, ProjectAssistanceId: data.projectAssistanceId || null,
    DonorPaymentHistoryId: data.paymentHistoryId, Amount: data.amount,
  }, await getDonorAuthConfig());
  return {
    message: pickValue(payload, "message", "Message", "Amount allocated successfully."),
    summary: normalizeSummary(pickValue(payload, "summary", "Summary", {})),
    assignment: pickValue(payload, "assignment", "Assignment", null),
  };
}
