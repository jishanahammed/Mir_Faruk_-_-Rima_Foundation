import "server-only";

import { cookies } from "next/headers";
import { ApiError } from "@/lib/api/api-error";
import { apiGetById, apiPost, apiPut } from "@/lib/api/api-service";
import { ADMIN_SESSION_COOKIE } from "@/lib/admin-auth";

export const AMOUNT_ASSIGNMENT_PAGE_SIZE_OPTIONS = [10, 20, 30, 50];
export const ASSIGNMENT_STATUS_OPTIONS = ["Pending", "Completed", "Rejected", "Reversed"];
export const ASSIGNMENT_REVIEW_OPTIONS = ["Pending", "Completed", "Rejected"];

function pickValue(payload, camelKey, pascalKey, fallback) {
  return payload?.[camelKey] ?? payload?.[pascalKey] ?? fallback;
}

function normalizeNumber(value, fallback = 0) {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
}

function normalizePageNumber(value) {
  const parsed = Number.parseInt(String(value ?? ""), 10);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : 1;
}

function normalizePageSize(value) {
  const parsed = Number.parseInt(String(value ?? ""), 10);
  return AMOUNT_ASSIGNMENT_PAGE_SIZE_OPTIONS.includes(parsed)
    ? parsed
    : AMOUNT_ASSIGNMENT_PAGE_SIZE_OPTIONS[0];
}

export function normalizeAssignmentStatus(value, fallback = "") {
  const normalized = String(value ?? "").trim();

  if (!normalized) {
    return fallback;
  }

  return (
    ASSIGNMENT_STATUS_OPTIONS.find(
      (option) => option.toLowerCase() === normalized.toLowerCase(),
    ) ?? fallback
  );
}

function normalizeDateFilter(value) {
  const normalized = String(value ?? "").trim();

  if (!normalized) {
    return null;
  }

  const date = new Date(normalized);
  return Number.isNaN(date.getTime()) ? null : date.toISOString();
}

async function getAdminAuthConfig() {
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

function normalizeAssignment(payload) {
  if (!payload) {
    return null;
  }

  return {
    id: normalizeNumber(pickValue(payload, "id", "Id", 0)),
    assignmentBatchId: pickValue(payload, "assignmentBatchId", "AssignmentBatchId", ""),
    donorId: normalizeNumber(pickValue(payload, "donorId", "DonorId", 0)),
    donorName: pickValue(payload, "donorName", "DonorName", ""),
    paymentHistoryId: normalizeNumber(pickValue(payload, "paymentHistoryId", "PaymentHistoryId", 0)),
    transactionId: pickValue(payload, "transactionId", "TransactionId", ""),
    beneficiaryProfileId: normalizeNumber(
      pickValue(payload, "beneficiaryProfileId", "BeneficiaryProfileId", 0),
    ),
    beneficiaryName: pickValue(payload, "beneficiaryName", "BeneficiaryName", ""),
    assignedAmount: normalizeNumber(pickValue(payload, "assignedAmount", "AssignedAmount", 0)),
    assignmentDate: pickValue(payload, "assignmentDate", "AssignmentDate", null),
    assignedBy: pickValue(payload, "assignedBy", "AssignedBy", ""),
    previousAvailableAmount: normalizeNumber(
      pickValue(payload, "previousAvailableAmount", "PreviousAvailableAmount", 0),
    ),
    remainingAvailableAmount: normalizeNumber(
      pickValue(payload, "remainingAvailableAmount", "RemainingAvailableAmount", 0),
    ),
    assignmentStatus: pickValue(payload, "assignmentStatus", "AssignmentStatus", ""),
    approvedAt: pickValue(payload, "approvedAt", "ApprovedAt", null),
    approvedBy: pickValue(payload, "approvedBy", "ApprovedBy", ""),
    adminRemarks: pickValue(payload, "adminRemarks", "AdminRemarks", ""),
  };
}

function buildFilterPayload(filters = {}) {
  return {
    PageNumber: normalizePageNumber(filters.page),
    PageSize: normalizePageSize(filters.pageSize),
    SearchText: String(filters.search ?? "").trim() || null,
    DonorId: normalizeNumber(filters.donorId, 0) || null,
    BeneficiaryProfileId: normalizeNumber(filters.beneficiaryProfileId, 0) || null,
    AssignmentStatus: normalizeAssignmentStatus(filters.assignmentStatus) || null,
    DateFrom: normalizeDateFilter(filters.dateFrom),
    DateTo: normalizeDateFilter(filters.dateTo),
  };
}

export async function getAdminAmountAssignmentList(filters = {}) {
  const payload = await apiPost(
    "AmountAssignments/paged",
    buildFilterPayload(filters),
    await getAdminAuthConfig(),
  );

  const items = pickValue(payload, "items", "Items", []);

  return {
    items: Array.isArray(items) ? items.map(normalizeAssignment).filter(Boolean) : [],
    totalCount: normalizeNumber(pickValue(payload, "totalCount", "TotalCount", 0)),
    totalPages: Math.max(1, normalizeNumber(pickValue(payload, "totalPages", "TotalPages", 0))),
    pageNumber: normalizePageNumber(pickValue(payload, "pageNumber", "PageNumber", 1)),
    pageSize: normalizePageSize(pickValue(payload, "pageSize", "PageSize", null)),
    hasNextPage: Boolean(pickValue(payload, "hasNextPage", "HasNextPage", false)),
    hasPreviousPage: Boolean(pickValue(payload, "hasPreviousPage", "HasPreviousPage", false)),
  };
}

export async function getAdminAmountAssignmentById(id) {
  return normalizeAssignment(
    await apiGetById("AmountAssignments", id, await getAdminAuthConfig()),
  );
}

export async function reviewAdminAmountAssignment(id, assignmentStatus, adminRemarks = "") {
  return normalizeAssignment(
    await apiPut(
      `AmountAssignments/${id}/review`,
      {
        AssignmentStatus: assignmentStatus,
        AdminRemarks: String(adminRemarks ?? "").trim() || null,
      },
      await getAdminAuthConfig(),
    ),
  );
}
