import { DonorPaymentHistoryTable } from "@/components/admin/donor-payment-history-table";
import { getApiErrorMessage } from "@/lib/api/api-error";
import {
  DONATION_TYPE_OPTIONS,
  DONOR_PAYMENT_HISTORY_PAGE_SIZE_OPTIONS,
  getAdminDonorPaymentHistoryList,
  PAYMENT_METHOD_OPTIONS,
  PAYMENT_STATUS_OPTIONS,
} from "@/lib/api/admin-donor-payment-history-service";
import { getAdminDonorList } from "@/lib/api/admin-donor-service";
import { getPaymentLedgers } from "@/lib/api/admin-accounting-dropdown-service";

export const metadata = {
  title: "Donation / Payment History | Mir Faruk & Rima Foundation",
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
    options.find((option) => option.toLowerCase() === normalized.toLowerCase()) ??
    ""
  );
}

function normalizeDonorId(value) {
  const normalized = String(readSingleValue(value, "")).trim();
  const parsed = Number.parseInt(normalized, 10);

  return Number.isFinite(parsed) && parsed > 0 ? String(parsed) : "";
}

function normalizeDate(value) {
  const normalized = String(readSingleValue(value, "")).trim();
  return /^\d{4}-\d{2}-\d{2}$/.test(normalized) ? normalized : "";
}

export default async function AdminDonerPaymentHistoryPage({ searchParams }) {
  const params = await searchParams;
  const filters = {
    search: String(readSingleValue(params.search, "")).trim(),
    donorId: normalizeDonorId(params.donorId),
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
  let donorOptions = [];
  let donorErrorMessage = "";

  try {
    paymentHistories = await getAdminDonorPaymentHistoryList(filters);
  } catch (error) {
    errorMessage = getApiErrorMessage(error);
  }

  try {
    // Only approved donors that already hold an accounting ledger can take a
    // payment — the ledger is what the money posts against. Filtered in the
    // query rather than here, so a page of 100 is 100 payable donors.
    const donors = await getAdminDonorList({
      page: 1,
      pageSize: 100,
      isApprove: true,
      hasLedger: true,
    });

    donorOptions = donors.items ?? [];
  } catch (error) {
    donorErrorMessage = getApiErrorMessage(error);
  }

  // Never throws: a provider-side failure reports itself so the page still
  // renders with the reason shown instead of an empty dropdown.
  const paymentLedgers = await getPaymentLedgers();

  return (
    <div className="space-y-5 xl:space-y-6">
      {errorMessage ? (
        <section className="rounded-[24px] border border-red-200 bg-red-50 px-4 py-3 text-sm leading-6 text-red-700 sm:px-5 sm:py-4">
          <strong className="block font-semibold">Unable to load payment history</strong>
          {errorMessage}
        </section>
      ) : null}

      {donorErrorMessage ? (
        <section className="rounded-[24px] border border-amber-200 bg-amber-50 px-4 py-3 text-sm leading-6 text-amber-700 sm:px-5 sm:py-4">
          <strong className="block font-semibold">Unable to load donor dropdown</strong>
          {donorErrorMessage}
        </section>
      ) : null}

      {!paymentLedgers.success ? (
        <section className="rounded-[24px] border border-amber-200 bg-amber-50 px-4 py-3 text-sm leading-6 text-amber-700 sm:px-5 sm:py-4">
          <strong className="block font-semibold">Unable to load payment accounts</strong>
          {paymentLedgers.message}
        </section>
      ) : null}

      <DonorPaymentHistoryTable
        paymentHistories={paymentHistories}
        filters={filters}
        donorOptions={donorOptions}
        paymentLedgers={paymentLedgers.list}
      />
    </div>
  );
}
