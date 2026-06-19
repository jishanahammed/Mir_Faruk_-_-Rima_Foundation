import Link from "next/link";
import { AddDonorPaymentHistoryModal } from "@/components/admin/add-donor-payment-history-modal";
import { AutoSubmitSelect } from "@/components/admin/auto-submit-select";
import { ConfirmSubmitButton } from "@/components/admin/confirm-submit-button";
import { PaymentHistoryStatusModal } from "@/components/admin/payment-history-status-modal";
import { deletePaymentHistoryAction } from "@/app/admin/donersPayment/actions";
import {
  DONATION_TYPE_OPTIONS,
  DONOR_PAYMENT_HISTORY_PAGE_SIZE_OPTIONS,
  PAYMENT_METHOD_OPTIONS,
  PAYMENT_STATUS_OPTIONS,
} from "@/lib/donor-payment-history-options";

function formatLabel(value) {
  const labels = {
    GeneralDonation: "General Donation",
    QardEHasanaFund: "Qard-e-Hasana Fund",
    bKash: "bKash",
  };

  if (labels[value]) {
    return labels[value];
  }

  return String(value ?? "")
    .replace(/([a-z])([A-Z])/g, "$1 $2")
    .trim();
}

function formatDate(value) {
  if (!value) {
    return "Not available";
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "Not available";
  }

  return new Intl.DateTimeFormat("en-GB", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  })
    .format(date)
    .replaceAll("/", "-");
}

function formatAmount(amount) {
  const parsed = Number(amount);

  if (!Number.isFinite(parsed)) {
    return "0.00";
  }

  return new Intl.NumberFormat("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(parsed);
}

function buildPaymentHistoryHref(filters, overrides = {}) {
  const params = new URLSearchParams();
  const nextFilters = {
    search: filters.search ?? "",
    donorId: filters.donorId ?? "",
    paymentStatus: filters.paymentStatus ?? "",
    paymentMethod: filters.paymentMethod ?? "",
    donationType: filters.donationType ?? "",
    dateFrom: filters.dateFrom ?? "",
    dateTo: filters.dateTo ?? "",
    page: filters.page ?? 1,
    pageSize: filters.pageSize ?? DONOR_PAYMENT_HISTORY_PAGE_SIZE_OPTIONS[0],
    ...overrides,
  };

  [
    "search",
    "donorId",
    "paymentStatus",
    "paymentMethod",
    "donationType",
    "dateFrom",
    "dateTo",
  ].forEach((key) => {
    if (nextFilters[key]) {
      params.set(key, String(nextFilters[key]));
    }
  });

  params.set("page", String(nextFilters.page));
  params.set("pageSize", String(nextFilters.pageSize));

  return `/admin/donersPayment?${params.toString()}`;
}

function getPaginationItems(pageNumber, totalPages) {
  if (totalPages <= 7) {
    return Array.from({ length: totalPages }, (_, index) => index + 1);
  }

  const items = [1];

  if (pageNumber > 3) {
    items.push("start-ellipsis");
  }

  for (
    let page = Math.max(2, pageNumber - 1);
    page <= Math.min(totalPages - 1, pageNumber + 1);
    page += 1
  ) {
    items.push(page);
  }

  if (pageNumber < totalPages - 2) {
    items.push("end-ellipsis");
  }

  items.push(totalPages);

  return items;
}

function Badge({ children, className }) {
  return (
    <span className={`inline-flex rounded-full border px-2.5 py-1 text-[11px] font-semibold ${className}`}>
      {children}
    </span>
  );
}

function FilterSelect({ name, label, value, options }) {
  return (
    <label className="block">
      <span className="mb-2 block text-xs font-semibold uppercase tracking-[0.14em] text-slate-500">
        {label}
      </span>
      <select
        name={name}
        defaultValue={value}
        className="h-12 w-full rounded-2xl border border-slate-200 bg-white px-4 text-sm font-medium text-slate-900 outline-none transition focus:border-cyan-400 focus:ring-4 focus:ring-cyan-100"
      >
        <option value="">All</option>
        {options.map((option) => (
          <option key={option} value={option}>
            {formatLabel(option)}
          </option>
        ))}
      </select>
    </label>
  );
}

function InvoiceAction({ payment }) {
  return (
    <Link
      href={`/api/admin/payment-invoice/${payment.id}`}
      target="_blank"
      rel="noreferrer"
      className="inline-flex h-9 w-9 items-center justify-center rounded-xl border border-emerald-200 bg-emerald-50 !text-emerald-700 transition hover:bg-emerald-100 visited:!text-emerald-700"
      aria-label="View payment invoice PDF"
      title="View invoice PDF"
    >
      <svg className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" aria-hidden="true">
        <path d="M7 3h7l5 5v13H7z" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M14 3v5h5M9 14h6M9 17h4" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </Link>
  );
}

function RowActions({ payment, returnPath }) {
  const isApproved = payment.adminApprovalStatus === "Approved";

  return (
    <div className="flex flex-wrap gap-2">
      <InvoiceAction payment={payment} />
      <PaymentHistoryStatusModal payment={payment} returnPath={returnPath} />

      <form action={deletePaymentHistoryAction}>
        <input type="hidden" name="id" value={payment.id} />
        <input type="hidden" name="returnPath" value={returnPath} />
        <ConfirmSubmitButton
          confirmMessage="Delete this payment history record?"
          className={`inline-flex h-9 w-9 items-center justify-center rounded-xl border transition ${
            isApproved
              ? "cursor-not-allowed border-slate-100 bg-slate-50 !text-slate-300"
              : "border-red-200 bg-white !text-red-600 hover:bg-red-50"
          }`}
          ariaLabel={
            isApproved
              ? "Delete disabled because admin approval is approved"
              : "Delete payment history"
          }
          title={isApproved ? "Approved payments cannot be deleted" : "Delete"}
          disabled={isApproved}
        >
          <svg className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" aria-hidden="true">
            <path d="M4 7h16M10 11v6M14 11v6M6 7l1 14h10l1-14M9 7V5h6v2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </ConfirmSubmitButton>
      </form>
    </div>
  );
}

function MobilePaymentCard({ payment, serial, returnPath }) {
  return (
    <article className="rounded-[24px] border border-slate-200 bg-white p-5 shadow-sm shadow-cyan-950/5">
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-400">
            SL {serial}
          </p>
          <h3 className="mt-1 truncate text-base font-bold text-slate-950">
            {payment.transactionId}
          </h3>
          <p className="mt-1 text-sm text-slate-500">{formatDate(payment.paymentDate)}</p>
        </div>
      </div>

      <div className="mt-4 grid gap-3 text-sm sm:grid-cols-2">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-400">
            Donation
          </p>
          <p className="mt-1 font-semibold text-slate-800">{formatLabel(payment.donationType)}</p>
          <p className="mt-1 text-slate-500">{formatLabel(payment.paymentMethod)}</p>
        </div>
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-400">
            Amount
          </p>
          <p className="mt-1 font-semibold text-slate-950">
            {formatAmount(payment.amount)} {payment.currency}
          </p>
        </div>
      </div>

      <div className="mt-4 flex flex-col gap-4 border-t border-slate-100 pt-4 sm:flex-row sm:items-start sm:justify-end">
        <RowActions payment={payment} returnPath={returnPath} />
      </div>
    </article>
  );
}

function EmptyState() {
  return (
    <div className="mx-auto max-w-md px-6 py-16 text-center">
      <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-3xl bg-cyan-50 text-cyan-700 ring-1 ring-cyan-100">
        <svg className="h-8 w-8" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24" aria-hidden="true">
          <path d="M4 7h16M5 7l1.5 13h11L19 7M9 7V5a3 3 0 0 1 6 0v2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </div>
      <h3 className="mt-5 text-lg font-bold text-slate-950">No payment history found</h3>
      <p className="mt-2 text-sm leading-6 text-slate-500">
        Try changing the transaction search, filters, or date range.
      </p>
    </div>
  );
}

export function DonorPaymentHistoryTable({ paymentHistories, filters, donorOptions = [] }) {
  const items = paymentHistories.items ?? [];
  const startItem =
    paymentHistories.totalCount === 0
      ? 0
      : (paymentHistories.pageNumber - 1) * paymentHistories.pageSize + 1;
  const endItem =
    paymentHistories.totalCount === 0
      ? 0
      : Math.min(paymentHistories.pageNumber * paymentHistories.pageSize, paymentHistories.totalCount);
  const paginationItems = getPaginationItems(
    paymentHistories.pageNumber,
    paymentHistories.totalPages,
  );
  const currentListHref = buildPaymentHistoryHref(filters, {
    page: paymentHistories.pageNumber,
  });

  return (
    <div className="space-y-6">
      <section className="overflow-hidden rounded-[30px] border border-cyan-100 bg-white shadow-xl shadow-cyan-950/5">
        <div className="border-b border-cyan-100 bg-[radial-gradient(circle_at_top_left,_rgba(34,211,238,0.18),_transparent_38%),linear-gradient(135deg,#f8fafc,#effcff)] p-6">
          <div className="flex flex-col gap-5">
            <div className="flex flex-col gap-3 xl:flex-row xl:items-end xl:justify-between">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.22em] text-cyan-700">
                  Donor Payments
                </p>
                <h1 className="mt-2 text-2xl font-bold tracking-tight text-slate-950">
                  Donation / Payment History
                </h1>
                <p className="mt-2 text-sm leading-6 text-slate-600">
                  Track all your donations and payment records.
                </p>
              </div>
              <div className="flex flex-wrap gap-2">
                <Badge className="border-cyan-200 bg-cyan-50 text-cyan-700">
                  {paymentHistories.totalCount} records
                </Badge>
                <Badge className="border-slate-200 bg-slate-100 text-slate-700">
                  Payment date descending
                </Badge>
                <AddDonorPaymentHistoryModal donors={donorOptions} />
              </div>
            </div>

            <form
              method="get"
              className="grid gap-3 rounded-[24px] border border-white/70 bg-white/85 p-4 shadow-sm backdrop-blur lg:grid-cols-6"
            >
              <input type="hidden" name="page" value="1" />

              <label className="block lg:col-span-2">
                <span className="mb-2 block text-xs font-semibold uppercase tracking-[0.14em] text-slate-500">
                  Search transaction
                </span>
                <input
                  type="search"
                  name="search"
                  defaultValue={filters.search}
                  placeholder="Transaction ID"
                  className="h-12 w-full rounded-2xl border border-slate-200 bg-white px-4 text-sm font-medium text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-cyan-400 focus:ring-4 focus:ring-cyan-100"
                />
              </label>

              <label className="block">
                <span className="mb-2 block text-xs font-semibold uppercase tracking-[0.14em] text-slate-500">
                  Donor ID
                </span>
                <input
                  type="number"
                  min="1"
                  name="donorId"
                  defaultValue={filters.donorId}
                  placeholder="Optional"
                  className="h-12 w-full rounded-2xl border border-slate-200 bg-white px-4 text-sm font-medium text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-cyan-400 focus:ring-4 focus:ring-cyan-100"
                />
              </label>

              <FilterSelect
                name="paymentStatus"
                label="Payment Status"
                value={filters.paymentStatus}
                options={PAYMENT_STATUS_OPTIONS}
              />
              <FilterSelect
                name="paymentMethod"
                label="Payment Method"
                value={filters.paymentMethod}
                options={PAYMENT_METHOD_OPTIONS}
              />
              <FilterSelect
                name="donationType"
                label="Donation Type"
                value={filters.donationType}
                options={DONATION_TYPE_OPTIONS}
              />

              <label className="block">
                <span className="mb-2 block text-xs font-semibold uppercase tracking-[0.14em] text-slate-500">
                  Date from
                </span>
                <input
                  type="date"
                  name="dateFrom"
                  defaultValue={filters.dateFrom}
                  className="h-12 w-full rounded-2xl border border-slate-200 bg-white px-4 text-sm font-medium text-slate-900 outline-none transition focus:border-cyan-400 focus:ring-4 focus:ring-cyan-100"
                />
              </label>

              <label className="block">
                <span className="mb-2 block text-xs font-semibold uppercase tracking-[0.14em] text-slate-500">
                  Date to
                </span>
                <input
                  type="date"
                  name="dateTo"
                  defaultValue={filters.dateTo}
                  className="h-12 w-full rounded-2xl border border-slate-200 bg-white px-4 text-sm font-medium text-slate-900 outline-none transition focus:border-cyan-400 focus:ring-4 focus:ring-cyan-100"
                />
              </label>

              <label className="block">
                <span className="mb-2 block text-xs font-semibold uppercase tracking-[0.14em] text-slate-500">
                  Show per page
                </span>
                <AutoSubmitSelect
                  name="pageSize"
                  defaultValue={String(filters.pageSize)}
                  className="h-12 w-full rounded-2xl border border-slate-200 bg-white px-4 text-sm font-medium text-slate-900 outline-none transition focus:border-cyan-400 focus:ring-4 focus:ring-cyan-100"
                >
                  {DONOR_PAYMENT_HISTORY_PAGE_SIZE_OPTIONS.map((size) => (
                    <option key={size} value={size}>
                      {size} per page
                    </option>
                  ))}
                </AutoSubmitSelect>
              </label>

              <button
                type="submit"
                className="inline-flex h-12 items-center justify-center self-end rounded-2xl bg-[linear-gradient(135deg,#0f766e,#0891b2)] px-5 text-sm font-semibold !text-white shadow-lg shadow-cyan-200/80 transition hover:-translate-y-0.5 hover:shadow-xl hover:shadow-cyan-300/70"
              >
                Apply
              </button>

              <Link
                href="/admin/donersPayment"
                className="inline-flex h-12 items-center justify-center self-end rounded-2xl border border-red-500 bg-white px-5 text-sm font-semibold !text-red-500 transition hover:bg-red-50 hover:!text-red-600 visited:!text-red-500"
              >
                Reset
              </Link>
            </form>
          </div>
        </div>

        <div className="flex flex-col gap-3 border-b border-slate-100 px-6 py-4 text-sm sm:flex-row sm:items-center sm:justify-between">
          <p className="text-slate-600">
            Showing <span className="font-semibold text-slate-950">{startItem}</span> to{" "}
            <span className="font-semibold text-slate-950">{endItem}</span> of{" "}
            <span className="font-semibold text-slate-950">{paymentHistories.totalCount}</span> payment records
          </p>
          <p className="text-slate-500">
            Page <span className="font-semibold text-slate-950">{paymentHistories.pageNumber}</span> of{" "}
            <span className="font-semibold text-slate-950">{paymentHistories.totalPages}</span>
          </p>
        </div>

        {items.length ? (
          <>
            <div className="grid gap-4 p-4 xl:hidden">
              {items.map((item, index) => (
                <MobilePaymentCard
                  key={item.id}
                  payment={item}
                  serial={(paymentHistories.pageNumber - 1) * paymentHistories.pageSize + index + 1}
                  returnPath={currentListHref}
                />
              ))}
            </div>

            <div className="hidden overflow-x-auto xl:block">
              <table className="w-full table-auto divide-y divide-slate-200 text-left text-xs">
                <thead className="bg-slate-50/90 text-[11px] font-semibold uppercase tracking-[0.12em] text-slate-500">
                  <tr>
                    <th className="px-4 py-3">SL</th>
                    <th className="px-4 py-3">Transaction ID</th>
                    <th className="px-4 py-3">Payment Date</th>
                    <th className="px-4 py-3">Donation Type</th>
                    <th className="px-4 py-3">Payment Method</th>
                    <th className="px-4 py-3">Amount</th>
                    <th className="px-4 py-3">Currency</th>
                    <th className="px-4 py-3">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 bg-white">
                  {items.map((item, index) => (
                    <tr key={item.id} className="align-top transition hover:bg-cyan-50/35">
                      <td className="px-4 py-3 font-semibold text-slate-500">
                        {(paymentHistories.pageNumber - 1) * paymentHistories.pageSize + index + 1}
                      </td>
                      <td className="px-4 py-3">
                        <p className="font-semibold text-slate-950">{item.transactionId}</p>
                        {item.donorName ? (
                          <p className="mt-1 text-[11px] text-slate-500">{item.donorName}</p>
                        ) : null}
                      </td>
                      <td className="px-4 py-3 text-slate-600">{formatDate(item.paymentDate)}</td>
                      <td className="px-4 py-3 text-slate-700">{formatLabel(item.donationType)}</td>
                      <td className="px-4 py-3 text-slate-700">{formatLabel(item.paymentMethod)}</td>
                      <td className="px-4 py-3 font-semibold text-slate-950">{formatAmount(item.amount)}</td>
                      <td className="px-4 py-3 text-slate-700">{item.currency}</td>
                      <td className="px-4 py-3">
                        <RowActions payment={item} returnPath={currentListHref} />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        ) : (
          <EmptyState />
        )}

        <div className="flex flex-col gap-4 border-t border-slate-100 px-6 py-5 sm:flex-row sm:items-center sm:justify-between">
          <div className="text-sm text-slate-500">
            Search by transaction id or combine filters for a narrower review queue.
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <Link
              href={buildPaymentHistoryHref(filters, {
                page: Math.max(1, paymentHistories.pageNumber - 1),
              })}
              aria-disabled={!paymentHistories.hasPreviousPage}
              className={`inline-flex h-10 items-center justify-center rounded-xl px-4 text-sm font-semibold transition ${
                paymentHistories.hasPreviousPage
                  ? "border border-slate-200 bg-white text-slate-700 hover:bg-slate-50"
                  : "cursor-not-allowed border border-slate-100 bg-slate-50 text-slate-300"
              }`}
            >
              Previous
            </Link>

            {paginationItems.map((item) => {
              if (typeof item !== "number") {
                return (
                  <span key={item} className="px-2 text-sm font-semibold text-slate-400">
                    ...
                  </span>
                );
              }

              const isActive = item === paymentHistories.pageNumber;

              return (
                <Link
                  key={item}
                  href={buildPaymentHistoryHref(filters, { page: item })}
                  prefetch={false}
                  aria-current={isActive ? "page" : undefined}
                  className={`inline-flex h-10 min-w-10 items-center justify-center rounded-xl px-3 text-sm font-semibold transition ${
                    isActive
                      ? "border border-cyan-200 bg-white text-cyan-800 shadow-md shadow-cyan-100/80 ring-2 ring-cyan-100"
                      : "border border-slate-200 bg-white text-slate-700 hover:bg-slate-50"
                  }`}
                >
                  {item}
                </Link>
              );
            })}

            <Link
              href={buildPaymentHistoryHref(filters, {
                page: Math.min(paymentHistories.totalPages, paymentHistories.pageNumber + 1),
              })}
              aria-disabled={!paymentHistories.hasNextPage}
              className={`inline-flex h-10 items-center justify-center rounded-xl px-4 text-sm font-semibold transition ${
                paymentHistories.hasNextPage
                  ? "border border-slate-200 bg-white text-slate-700 hover:bg-slate-50"
                  : "cursor-not-allowed border border-slate-100 bg-slate-50 text-slate-300"
              }`}
            >
              Next
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
