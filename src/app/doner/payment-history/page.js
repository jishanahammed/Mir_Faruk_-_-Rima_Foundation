import { DonorPortalPaymentHistoryTable } from "@/components/donor/donor-payment-history-table";
import { getApiErrorMessage } from "@/lib/api/api-error";
import {
  DONATION_TYPE_OPTIONS,
  DONOR_PAYMENT_HISTORY_PAGE_SIZE_OPTIONS,
  getDonorPaymentHistoryList,
  PAYMENT_METHOD_OPTIONS,
  PAYMENT_STATUS_OPTIONS,
} from "@/lib/api/donor-portal-service";
import { getDonorAvailableAmountSummary } from "@/lib/api/donor-amount-assignment-service";
import { getCurrentDonorUser } from "@/lib/donor-session";

export const metadata = {
  title: "Doner Payment History | Mir Faruk & Rima Foundation",
};

function readSingleValue(value, fallback = "") {
  if (Array.isArray(value)) {
    return value[0] ?? fallback;
  }

  return value ?? fallback;
}

function normalizePageNumber(value) {
  const parsed = Number.parseInt(String(readSingleValue(value, "")), 10);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : 1;
}

function normalizePageSize(value) {
  const parsed = Number.parseInt(String(readSingleValue(value, "")), 10);
  return DONOR_PAYMENT_HISTORY_PAGE_SIZE_OPTIONS.includes(parsed)
    ? parsed
    : DONOR_PAYMENT_HISTORY_PAGE_SIZE_OPTIONS[0];
}

function normalizeOption(value, options) {
  const normalized = String(readSingleValue(value, "")).trim();

  if (!normalized) {
    return "";
  }

  return (
    options.find((option) => option.toLowerCase() === normalized.toLowerCase()) ?? ""
  );
}

function normalizeDate(value) {
  const normalized = String(readSingleValue(value, "")).trim();
  return /^\d{4}-\d{2}-\d{2}$/.test(normalized) ? normalized : "";
}

export default async function DonerPaymentHistoryPage({ searchParams }) {
  const user = await getCurrentDonorUser();
  const params = await searchParams;
  const filters = {
    search: String(readSingleValue(params.search, "")).trim(),
    paymentStatus: normalizeOption(params.paymentStatus, PAYMENT_STATUS_OPTIONS),
    paymentMethod: normalizeOption(params.paymentMethod, PAYMENT_METHOD_OPTIONS),
    donationType: normalizeOption(params.donationType, DONATION_TYPE_OPTIONS),
    dateFrom: normalizeDate(params.dateFrom),
    dateTo: normalizeDate(params.dateTo),
    page: normalizePageNumber(params.page),
    pageSize: normalizePageSize(params.pageSize),
  };

  let paymentHistories = {
    items: [],
    totalCount: 0,
    totalPages: 1,
    pageNumber: filters.page,
    pageSize: filters.pageSize,
    hasNextPage: false,
    hasPreviousPage: false,
  };
  let errorMessage = "";
  let amountSummary = null;

  try {
    paymentHistories = await getDonorPaymentHistoryList(user, filters);
  } catch (error) {
    errorMessage = getApiErrorMessage(error);
  }

  try {
    amountSummary = await getDonorAvailableAmountSummary(user);
  } catch {
    amountSummary = null;
  }

  return (
    <div className="space-y-5 xl:space-y-6">
      {errorMessage ? (
        <section className="rounded-[24px] border border-red-200 bg-red-50 px-4 py-3 text-sm leading-6 text-red-700 sm:px-5 sm:py-4">
          <strong className="block font-semibold">Unable to load payment history</strong>
          {errorMessage}
        </section>
      ) : null}

      <DonorPortalPaymentHistoryTable
        paymentHistories={paymentHistories}
        filters={filters}
        amountSummary={amountSummary}
      />
    </div>
  );
}
