import "server-only";

import { cookies } from "next/headers";
import { ApiError } from "@/lib/api/api-error";
import { apiGet, apiGetById, apiPost, apiPut } from "@/lib/api/api-service";
import { ADMIN_SESSION_COOKIE } from "@/lib/admin-auth";
import {
  DONATION_TYPE_OPTIONS,
  DONOR_PAYMENT_HISTORY_PAGE_SIZE_OPTIONS,
  PAYMENT_METHOD_OPTIONS,
  PAYMENT_STATUS_OPTIONS,
} from "@/lib/donor-payment-history-options";

export {
  DONATION_TYPE_OPTIONS,
  DONOR_PAYMENT_HISTORY_PAGE_SIZE_OPTIONS,
  PAYMENT_METHOD_OPTIONS,
  PAYMENT_STATUS_OPTIONS,
};

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

function normalizeDonor(payload) {
  if (!payload) {
    return null;
  }

  return {
    id: normalizeNumber(pickValue(payload, "id", "Id", 0)),
    userId: pickValue(payload, "userId", "UserId", ""),
    fullName: pickValue(payload, "fullName", "FullName", ""),
    email: pickValue(payload, "email", "Email", ""),
    mobile: pickValue(payload, "mobile", "Mobile", ""),
    address: pickValue(payload, "address", "Address", ""),
    profession: pickValue(payload, "profession", "Profession", ""),
    donorType: pickValue(payload, "donorType", "DonorType", ""),
    purpose: pickValue(payload, "purpose", "Purpose", ""),
    frequency: pickValue(payload, "frequency", "Frequency", ""),
    contactFullName: pickValue(payload, "contactFullName", "ContactFullName", ""),
    contactMobile: pickValue(payload, "contactMobile", "ContactMobile", ""),
    contactTelephone: pickValue(payload, "contactTelephone", "ContactTelephone", ""),
    isApprove: Boolean(pickValue(payload, "isApprove", "IsApprove", false)),
    isPublic: Boolean(pickValue(payload, "isPublic", "IsPublic", false)),
    createdAt: pickValue(payload, "createdAt", "CreatedAt", null),
    updatedAt: pickValue(payload, "updatedAt", "UpdatedAt", null),
  };
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
    adminApprovalStatus: pickValue(
      payload,
      "adminApprovalStatus",
      "AdminApprovalStatus",
      "",
    ),
    receiptUrl,
    receiptLink: buildAssetUrl(receiptUrl),
    remarks: pickValue(payload, "remarks", "Remarks", ""),
    createdAt: pickValue(payload, "createdAt", "CreatedAt", null),
    updatedAt: pickValue(payload, "updatedAt", "UpdatedAt", null),
  };
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

function extractDonorProfileId(user) {
  return normalizeNumber(
    user?.donorProfileId ??
      user?.raw?.donorProfileId ??
      user?.raw?.DonorProfileId ??
      user?.raw?.donorId ??
      user?.raw?.DonorId,
    0,
  );
}

function getUserId(user) {
  return String(user?.id ?? user?.raw?.userId ?? user?.raw?.UserId ?? "").trim();
}

function findMatchingDonor(items, user) {
  const userId = getUserId(user).toLowerCase();
  const email = String(user?.email ?? "").trim().toLowerCase();

  return (
    items.find((item) => String(item.userId ?? "").trim().toLowerCase() === userId) ??
    items.find((item) => String(item.email ?? "").trim().toLowerCase() === email) ??
    items[0] ??
    null
  );
}

export async function getCurrentDonorProfile(user) {
  const config = await getDonorAuthConfig();
  const profileId = extractDonorProfileId(user);
  const userId = getUserId(user);

  try {
    const donor = normalizeDonor(await apiGet("Donors/me", config));

    if (donor?.id) {
      return donor;
    }
  } catch {
    // Older API builds do not have the donor-owned profile endpoint yet.
  }

  if (profileId) {
    try {
      return normalizeDonor(await apiGetById("Donors", profileId, config));
    } catch {
      // Some login payloads do not include a usable donor profile id.
    }
  }

  if (userId) {
    const userEndpoints = [
      `Donors/user/${encodeURIComponent(userId)}`,
      `Donors/by-user/${encodeURIComponent(userId)}`,
      `Donors/profile/${encodeURIComponent(userId)}`,
    ];

    for (const endpoint of userEndpoints) {
      try {
        const donor = normalizeDonor(await apiGet(endpoint, config));

        if (donor?.id) {
          return donor;
        }
      } catch {
        // Fall through to the next known backend naming pattern.
      }
    }
  }

  const searches = [user?.email, userId].filter(Boolean);

  for (const search of searches) {
    try {
      const payload = await apiPost(
        "Donors/paged",
        {
          PageNumber: 1,
          PageSize: 50,
          SearchText: String(search).trim(),
          UserId: userId || null,
        },
        config,
      );
      const items = pickValue(payload, "items", "Items", []);
      const donors = Array.isArray(items) ? items.map(normalizeDonor).filter(Boolean) : [];
      const donor = findMatchingDonor(donors, user);

      if (donor?.id) {
        return donor;
      }
    } catch {
      // Keep trying available lookup paths before reporting a profile issue.
    }
  }

  throw new ApiError("Unable to find the donor profile for the logged-in user.");
}

function buildPaymentFilterPayload(filters, donor, user) {
  return {
    PageNumber: normalizePageNumber(filters.page),
    PageSize: normalizePageSize(filters.pageSize),
    SearchText: String(filters.search ?? "").trim() || null,
    DonorId: normalizeNumber(donor?.id, 0) || null,
    UserId: getUserId(user) || null,
    PaymentStatus: normalizeOption(filters.paymentStatus, PAYMENT_STATUS_OPTIONS) || null,
    PaymentMethod: normalizeOption(filters.paymentMethod, PAYMENT_METHOD_OPTIONS) || null,
    DonationType: normalizeOption(filters.donationType, DONATION_TYPE_OPTIONS) || null,
    DateFrom: normalizeDateFilter(filters.dateFrom),
    DateTo: normalizeDateFilter(filters.dateTo),
  };
}

export async function getDonorPaymentHistoryList(user, filters = {}) {
  const donor = await getCurrentDonorProfile(user);
  const payload = await apiPost(
    "DonorPaymentHistories/me/paged",
    buildPaymentFilterPayload(filters, donor, user),
    await getDonorAuthConfig(),
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
    donor,
    items: Array.isArray(items) ? items.map(normalizePaymentHistory).filter(Boolean) : [],
    totalCount: Number(totalCount) || 0,
    totalPages: Math.max(1, Number(totalPages) || 0),
    pageNumber: normalizePageNumber(pageNumber),
    pageSize: normalizePageSize(pageSize),
    hasNextPage: Boolean(hasNextPage),
    hasPreviousPage: Boolean(hasPreviousPage),
  };
}

export async function getDonorPaymentHistoryById(user, id) {
  const donor = await getCurrentDonorProfile(user);
  const payment = normalizePaymentHistory(
    await apiGetById("DonorPaymentHistories/me", id, await getDonorAuthConfig()),
  );

  if (!payment || payment.donorId !== donor.id) {
    throw new ApiError("Payment history was not found for this donor.", { status: 404 });
  }

  return payment;
}

export async function updateCurrentDonorProfile(user, data) {
  await getCurrentDonorProfile(user);

  return normalizeDonor(
    await apiPut("Donors/me", data, await getDonorAuthConfig()),
  );
}
