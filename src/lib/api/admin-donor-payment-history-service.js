import "server-only";

import { cookies } from "next/headers";
import { ApiError } from "@/lib/api/api-error";
import { apiDelete, apiGetById, apiPost, apiPut } from "@/lib/api/api-service";
import { ADMIN_SESSION_COOKIE } from "@/lib/admin-auth";
import {
  ADMIN_APPROVAL_STATUS_OPTIONS,
  DONATION_TYPE_OPTIONS,
  DONOR_PAYMENT_HISTORY_PAGE_SIZE_OPTIONS,
  PAYMENT_METHOD_OPTIONS,
  PAYMENT_STATUS_OPTIONS,
} from "@/lib/donor-payment-history-options";

export {
  ADMIN_APPROVAL_STATUS_OPTIONS,
  DONATION_TYPE_OPTIONS,
  DONOR_PAYMENT_HISTORY_PAGE_SIZE_OPTIONS,
  PAYMENT_METHOD_OPTIONS,
  PAYMENT_STATUS_OPTIONS,
};

function pickValue(payload, camelKey, pascalKey, fallback) {
  return payload?.[camelKey] ?? payload?.[pascalKey] ?? fallback;
}

function normalizePageNumber(value) {
  const parsed = Number.parseInt(String(value ?? ""), 10);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : 1;
}

function normalizePageSize(value) {
  const parsed = Number.parseInt(String(value ?? ""), 10);
  return DONOR_PAYMENT_HISTORY_PAGE_SIZE_OPTIONS.includes(parsed)
    ? parsed
    : DONOR_PAYMENT_HISTORY_PAGE_SIZE_OPTIONS[0];
}

function normalizeOption(value, options, fallback = "") {
  const normalized = String(value ?? "").trim();

  if (!normalized) {
    return fallback;
  }

  return (
    options.find((option) => option.toLowerCase() === normalized.toLowerCase()) ??
    fallback
  );
}

function normalizeNumber(value, fallback = 0) {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
}

function normalizeDateFilter(value) {
  const normalized = String(value ?? "").trim();

  if (!normalized) {
    return null;
  }

  return /^\d{4}-\d{2}-\d{2}$/.test(normalized) ? normalized : null;
}

function buildAssetUrl(filePath) {
  const rawValue = String(filePath ?? "").trim();

  if (!rawValue) {
    return "";
  }

  if (/^https?:\/\//i.test(rawValue)) {
    return rawValue;
  }

  const normalizedPath = rawValue.replace(/\\/g, "/").replace(/^~\//, "").replace(/^\/+/, "");
  const baseUrl = process.env.AUTH_API_BASE_URL;

  if (!baseUrl) {
    return `/${normalizedPath}`;
  }

  try {
    const origin = new URL(baseUrl).origin;
    return new URL(normalizedPath, `${origin}/`).toString();
  } catch {
    return `/${normalizedPath}`;
  }
}

function normalizePaymentHistory(payload) {
  if (!payload) {
    return null;
  }

  const receiptUrl = pickValue(payload, "receiptUrl", "ReceiptUrl", "");

  return {
    id: normalizeNumber(pickValue(payload, "id", "Id", 0)),
    donorId: normalizeNumber(pickValue(payload, "donorId", "DonorId", 0)),
    donorName: pickValue(payload, "donorName", "DonorName", ""),
    donorMobile: pickValue(payload, "donorMobile", "DonorMobile", ""),
    donorType: pickValue(payload, "donorType", "DonorType", ""),
    donorAddress: pickValue(payload, "donorAddress", "DonorAddress", ""),
    transactionId: pickValue(payload, "transactionId", "TransactionId", ""),
    donationType: normalizeOption(
      pickValue(payload, "donationType", "DonationType", DONATION_TYPE_OPTIONS[0]),
      DONATION_TYPE_OPTIONS,
      DONATION_TYPE_OPTIONS[0],
    ),
    paymentMethod: normalizeOption(
      pickValue(payload, "paymentMethod", "PaymentMethod", PAYMENT_METHOD_OPTIONS[0]),
      PAYMENT_METHOD_OPTIONS,
      PAYMENT_METHOD_OPTIONS[0],
    ),
    paymentDate: pickValue(payload, "paymentDate", "PaymentDate", null),
    amount: normalizeNumber(pickValue(payload, "amount", "Amount", 0)),
    currency: pickValue(payload, "currency", "Currency", "BDT"),
    paymentStatus: normalizeOption(
      pickValue(payload, "paymentStatus", "PaymentStatus", PAYMENT_STATUS_OPTIONS[0]),
      PAYMENT_STATUS_OPTIONS,
      PAYMENT_STATUS_OPTIONS[0],
    ),
    adminApprovalStatus: normalizeOption(
      pickValue(
        payload,
        "adminApprovalStatus",
        "AdminApprovalStatus",
        ADMIN_APPROVAL_STATUS_OPTIONS[0],
      ),
      ADMIN_APPROVAL_STATUS_OPTIONS,
      ADMIN_APPROVAL_STATUS_OPTIONS[0],
    ),
    receiptUrl,
    receiptLink: buildAssetUrl(receiptUrl),
    remarks: pickValue(payload, "remarks", "Remarks", ""),
    createdAt: pickValue(payload, "createdAt", "CreatedAt", null),
    updatedAt: pickValue(payload, "updatedAt", "UpdatedAt", null),
  };
}

async function getAdminAuthConfig() {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get(ADMIN_SESSION_COOKIE)?.value;

  if (!accessToken) {
    throw new ApiError("Admin session token is missing.");
  }

  return {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  };
}

function buildFilterPayload(filters = {}) {
  return {
    PageNumber: normalizePageNumber(filters.page),
    PageSize: normalizePageSize(filters.pageSize),
    SearchText: String(filters.search ?? "").trim() || null,
    DonorId: normalizeNumber(filters.donorId, 0) || null,
    PaymentStatus: normalizeOption(filters.paymentStatus, PAYMENT_STATUS_OPTIONS) || null,
    PaymentMethod: normalizeOption(filters.paymentMethod, PAYMENT_METHOD_OPTIONS) || null,
    DonationType: normalizeOption(filters.donationType, DONATION_TYPE_OPTIONS) || null,
    DateFrom: normalizeDateFilter(filters.dateFrom),
    DateTo: normalizeDateFilter(filters.dateTo),
  };
}

export async function getAdminDonorPaymentHistoryList(filters = {}) {
  const payload = await apiPost(
    "DonorPaymentHistories/paged",
    buildFilterPayload(filters),
    await getAdminAuthConfig(),
  );

  const items = pickValue(payload, "items", "Items", []);
  const totalCount = pickValue(payload, "totalCount", "TotalCount", 0);
  const totalPages = pickValue(payload, "totalPages", "TotalPages", 0);
  const pageNumber = pickValue(payload, "pageNumber", "PageNumber", 1);
  const pageSize = pickValue(
    payload,
    "pageSize",
    "PageSize",
    DONOR_PAYMENT_HISTORY_PAGE_SIZE_OPTIONS[0],
  );
  const hasNextPage = pickValue(payload, "hasNextPage", "HasNextPage", false);
  const hasPreviousPage = pickValue(payload, "hasPreviousPage", "HasPreviousPage", false);

  return {
    items: Array.isArray(items) ? items.map(normalizePaymentHistory).filter(Boolean) : [],
    totalCount: Number(totalCount) || 0,
    totalPages: Math.max(1, Number(totalPages) || 0),
    pageNumber: normalizePageNumber(pageNumber),
    pageSize: normalizePageSize(pageSize),
    hasNextPage: Boolean(hasNextPage),
    hasPreviousPage: Boolean(hasPreviousPage),
  };
}

export async function getAdminDonorPaymentHistoryById(id) {
  return normalizePaymentHistory(
    await apiGetById("DonorPaymentHistories", id, await getAdminAuthConfig()),
  );
}

export async function addAdminDonorPaymentHistory(data) {
  const payload = await apiPost(
    "DonorPaymentHistories",
    data,
    await getAdminAuthConfig(),
  );

  return {
    message:
      pickValue(payload, "message", "Message", "") ||
      "Thank you for your donation. Your payment has been received successfully and is currently waiting for administrator approval.",
    paymentHistory: normalizePaymentHistory(
      pickValue(payload, "paymentHistory", "PaymentHistory", null),
    ),
  };
}

export async function updateAdminDonorPaymentStatus(id, paymentStatus) {
  return normalizePaymentHistory(
    await apiPut(
      `DonorPaymentHistories/${id}/payment-status`,
      { PaymentStatus: normalizeOption(paymentStatus, PAYMENT_STATUS_OPTIONS, PAYMENT_STATUS_OPTIONS[0]) },
      await getAdminAuthConfig(),
    ),
  );
}

export async function updateAdminDonorPaymentApprovalStatus(id, adminApprovalStatus) {
  return normalizePaymentHistory(
    await apiPut(
      `DonorPaymentHistories/${id}/admin-approval`,
      {
        AdminApprovalStatus: normalizeOption(
          adminApprovalStatus,
          ADMIN_APPROVAL_STATUS_OPTIONS,
          ADMIN_APPROVAL_STATUS_OPTIONS[0],
        ),
      },
      await getAdminAuthConfig(),
    ),
  );
}

export async function deleteAdminDonorPaymentHistory(id) {
  await apiDelete("DonorPaymentHistories", id, await getAdminAuthConfig());
}
