import Link from "next/link";
import { AmountAssignmentReviewModal } from "@/components/admin/amount-assignment-review-modal";
import {
  AMOUNT_ASSIGNMENT_PAGE_SIZE_OPTIONS,
  ASSIGNMENT_STATUS_OPTIONS,
} from "@/lib/api/admin-amount-assignment-service";

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

function buildHref(filters, overrides = {}) {
  const params = new URLSearchParams();
  const next = {
    search: filters.search ?? "",
    assignmentStatus: filters.assignmentStatus ?? "",
    dateFrom: filters.dateFrom ?? "",
    dateTo: filters.dateTo ?? "",
    page: filters.page ?? 1,
    pageSize: filters.pageSize ?? AMOUNT_ASSIGNMENT_PAGE_SIZE_OPTIONS[0],
    ...overrides,
  };

  ["search", "assignmentStatus", "dateFrom", "dateTo"].forEach((key) => {
    if (next[key]) {
      params.set(key, String(next[key]));
    }
  });

  params.set("page", String(next.page));
  params.set("pageSize", String(next.pageSize));

  return `/admin/amount-assignment?${params.toString()}`;
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

function getStatusTone(value) {
  const normalized = String(value ?? "").toLowerCase();

  if (normalized === "completed") {
    return "border-emerald-200 bg-emerald-50 text-emerald-700";
  }

  if (normalized === "pending") {
    return "border-amber-200 bg-amber-50 text-amber-700";
  }

  if (normalized === "rejected" || normalized === "reversed") {
    return "border-red-200 bg-red-50 text-red-700";
  }

  return "border-slate-200 bg-slate-100 text-slate-700";
}

function StatusBadge({ value }) {
  return (
    <span
      className={`inline-flex rounded-full border px-2.5 py-1 text-[11px] font-bold ${getStatusTone(value)}`}
    >
      {value || "Not set"}
    </span>
  );
}

function EmptyState() {
  return (
    <div className="mx-auto max-w-md px-6 py-16 text-center">
      <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-3xl bg-cyan-50 text-cyan-700 ring-1 ring-cyan-100">
        <svg className="h-8 w-8" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24" aria-hidden="true">
          <path d="M12 3v18M8 7h8M6 12h12M8 17h8" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </div>
      <h3 className="mt-5 text-lg font-black text-slate-950">No amount assignments found</h3>
      <p className="mt-2 text-sm leading-6 text-slate-500">
        Try changing the search, status filter, or date range.
      </p>
    </div>
  );
}

function MobileAssignmentCard({ assignment, serial, returnPath, batchSize }) {
  return (
    <article className="rounded-[24px] border border-slate-200 bg-white p-5 shadow-sm shadow-slate-950/5">
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <p className="text-xs font-bold uppercase tracking-[0.14em] text-slate-400">SL {serial}</p>
          <h3 className="mt-1 truncate text-base font-black text-slate-950">
            {assignment.donorName || `Donor #${assignment.donorId}`}
          </h3>
          <p className="mt-1 text-sm text-slate-500">{formatDate(assignment.assignmentDate)}</p>
        </div>
        <StatusBadge value={assignment.assignmentStatus} />
      </div>

      <div className="mt-4 grid gap-3 text-sm sm:grid-cols-2">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.14em] text-slate-400">Beneficiary</p>
          <p className="mt-1 font-bold text-slate-800">
            {assignment.beneficiaryName || `#${assignment.beneficiaryProfileId}`}
          </p>
        </div>
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.14em] text-slate-400">Amount</p>
          <p className="mt-1 font-black text-slate-950">৳ {formatAmount(assignment.assignedAmount)}</p>
        </div>
      </div>

      <div className="mt-4 flex flex-wrap items-center justify-between gap-2 border-t border-slate-100 pt-4">
        <p className="text-xs font-semibold text-slate-500">{assignment.transactionId}</p>
        <AmountAssignmentReviewModal
          assignment={assignment}
          batchSize={batchSize}
          returnPath={returnPath}
        />
      </div>
    </article>
  );
}

const EMPTY_BATCH_ID = "00000000-0000-0000-0000-000000000000";

function countBatchSiblings(items, assignment) {
  const batchId = assignment.assignmentBatchId;

  if (!batchId || batchId === EMPTY_BATCH_ID) {
    return 1;
  }

  return items.filter(
    (item) =>
      item.assignmentBatchId === batchId &&
      item.assignmentStatus === assignment.assignmentStatus,
  ).length;
}

export function AmountAssignmentTable({ assignments, filters, returnPath }) {
  const items = assignments.items ?? [];
  const startItem =
    assignments.totalCount === 0 ? 0 : (assignments.pageNumber - 1) * assignments.pageSize + 1;
  const endItem =
    assignments.totalCount === 0
      ? 0
      : Math.min(assignments.pageNumber * assignments.pageSize, assignments.totalCount);
  const paginationItems = getPaginationItems(assignments.pageNumber, assignments.totalPages);

  return (
    <section className="overflow-hidden rounded-[30px] border border-cyan-100 bg-white shadow-xl shadow-slate-950/5">
      <div className="border-b border-cyan-100 bg-[radial-gradient(circle_at_top_left,_rgba(34,211,238,0.18),_transparent_38%),linear-gradient(135deg,#f8fafc,#effcff)] p-6">
        <div className="flex flex-col gap-5">
          <div className="flex flex-col gap-3 xl:flex-row xl:items-end xl:justify-between">
            <div>
              <p className="text-xs font-black uppercase tracking-[0.22em] text-cyan-700">
                Donor Allocations
              </p>
              <h1 className="mt-2 text-2xl font-black tracking-tight text-slate-950">
                Amount assignment
              </h1>
              <p className="mt-2 text-sm leading-6 text-slate-600">
                Review and change the status of amounts donors assigned to beneficiaries.
              </p>
            </div>
            <div className="flex flex-wrap gap-2">
              <span className="inline-flex rounded-full border border-cyan-200 bg-cyan-50 px-2.5 py-1 text-[11px] font-bold text-cyan-700">
                {assignments.totalCount} records
              </span>
            </div>
          </div>

          <form
            method="get"
            className="grid gap-3 rounded-[24px] border border-white/70 bg-white/85 p-4 shadow-sm backdrop-blur lg:grid-cols-5"
          >
            <input type="hidden" name="page" value="1" />

            <label className="block lg:col-span-2">
              <span className="mb-2 block text-xs font-bold uppercase tracking-[0.14em] text-slate-500">
                Search
              </span>
              <input
                type="search"
                name="search"
                defaultValue={filters.search}
                placeholder="Donor, beneficiary or transaction"
                className="h-12 w-full rounded-2xl border border-slate-200 bg-white px-4 text-sm font-medium text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-cyan-400 focus:ring-4 focus:ring-cyan-100"
              />
            </label>

            <label className="block">
              <span className="mb-2 block text-xs font-bold uppercase tracking-[0.14em] text-slate-500">
                Status
              </span>
              <select
                name="assignmentStatus"
                defaultValue={filters.assignmentStatus}
                className="h-12 w-full rounded-2xl border border-slate-200 bg-white px-4 text-sm font-medium text-slate-900 outline-none transition focus:border-cyan-400 focus:ring-4 focus:ring-cyan-100"
              >
                <option value="">All</option>
                {ASSIGNMENT_STATUS_OPTIONS.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            </label>

            <label className="block">
              <span className="mb-2 block text-xs font-bold uppercase tracking-[0.14em] text-slate-500">
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
              <span className="mb-2 block text-xs font-bold uppercase tracking-[0.14em] text-slate-500">
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
              <span className="mb-2 block text-xs font-bold uppercase tracking-[0.14em] text-slate-500">
                Show per page
              </span>
              <select
                name="pageSize"
                defaultValue={String(filters.pageSize)}
                className="h-12 w-full rounded-2xl border border-slate-200 bg-white px-4 text-sm font-medium text-slate-900 outline-none transition focus:border-cyan-400 focus:ring-4 focus:ring-cyan-100"
              >
                {AMOUNT_ASSIGNMENT_PAGE_SIZE_OPTIONS.map((size) => (
                  <option key={size} value={size}>
                    {size} per page
                  </option>
                ))}
              </select>
            </label>

            <button
              type="submit"
              className="inline-flex h-12 items-center justify-center self-end rounded-2xl bg-slate-950 px-5 text-sm font-bold !text-white shadow-lg shadow-cyan-200/60 transition hover:bg-cyan-700"
            >
              Apply
            </button>

            <Link
              href="/admin/amount-assignment"
              className="inline-flex h-12 items-center justify-center self-end rounded-2xl border border-red-500 bg-white px-5 text-sm font-bold !text-red-500 transition hover:bg-red-50 hover:!text-red-600 visited:!text-red-500"
            >
              Reset
            </Link>
          </form>
        </div>
      </div>

      <div className="flex flex-col gap-3 border-b border-slate-100 px-6 py-4 text-sm sm:flex-row sm:items-center sm:justify-between">
        <p className="text-slate-600">
          Showing <span className="font-bold text-slate-950">{startItem}</span> to{" "}
          <span className="font-bold text-slate-950">{endItem}</span> of{" "}
          <span className="font-bold text-slate-950">{assignments.totalCount}</span> assignments
        </p>
        <p className="text-slate-500">
          Page <span className="font-bold text-slate-950">{assignments.pageNumber}</span> of{" "}
          <span className="font-bold text-slate-950">{assignments.totalPages}</span>
        </p>
      </div>

      {items.length ? (
        <>
          <div className="grid gap-4 p-4 xl:hidden">
            {items.map((item, index) => (
              <MobileAssignmentCard
                key={item.id}
                assignment={item}
                serial={(assignments.pageNumber - 1) * assignments.pageSize + index + 1}
                batchSize={countBatchSiblings(items, item)}
                returnPath={returnPath}
              />
            ))}
          </div>

          <div className="hidden overflow-x-auto xl:block">
            <table className="w-full table-auto divide-y divide-slate-200 text-left text-xs">
              <thead className="bg-slate-50/90 text-[11px] font-bold uppercase tracking-[0.12em] text-slate-500">
                <tr>
                  <th className="px-4 py-3">SL</th>
                  <th className="px-4 py-3">Donor</th>
                  <th className="px-4 py-3">Beneficiary</th>
                  <th className="px-4 py-3">Transaction ID</th>
                  <th className="px-4 py-3">Assigned Amount</th>
                  <th className="px-4 py-3">Assignment Date</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3">Reviewed By</th>
                  <th className="px-4 py-3">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 bg-white">
                {items.map((item, index) => {
                  return (
                    <tr key={item.id} className="align-top transition hover:bg-cyan-50/35">
                      <td className="px-4 py-3 font-bold text-slate-500">
                        {(assignments.pageNumber - 1) * assignments.pageSize + index + 1}
                      </td>
                      <td className="px-4 py-3 font-bold text-slate-950">
                        {item.donorName || `#${item.donorId}`}
                      </td>
                      <td className="px-4 py-3 text-slate-700">
                        {item.beneficiaryName || `#${item.beneficiaryProfileId}`}
                      </td>
                      <td className="px-4 py-3 text-slate-600">{item.transactionId || "—"}</td>
                      <td className="px-4 py-3 font-bold text-slate-950">
                        ৳ {formatAmount(item.assignedAmount)}
                      </td>
                      <td className="px-4 py-3 text-slate-600">{formatDate(item.assignmentDate)}</td>
                      <td className="px-4 py-3">
                        <StatusBadge value={item.assignmentStatus} />
                      </td>
                      <td className="px-4 py-3 text-slate-600">
                        {item.approvedBy ? (
                          <>
                            <span className="block font-semibold text-slate-800">{item.approvedBy}</span>
                            <span className="block text-[11px] text-slate-500">
                              {formatDate(item.approvedAt)}
                            </span>
                          </>
                        ) : (
                          "—"
                        )}
                      </td>
                      <td className="px-4 py-3">
                        <AmountAssignmentReviewModal
                          assignment={item}
                          batchSize={countBatchSiblings(items, item)}
                          returnPath={returnPath}
                        />
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </>
      ) : (
        <EmptyState />
      )}

      <div className="flex flex-col gap-4 border-t border-slate-100 px-6 py-5 sm:flex-row sm:items-center sm:justify-between">
        <div className="text-sm text-slate-500">
          Changing status to Rejected releases the donor&apos;s payment; changing it back re-reserves
          that payment when still available.
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <Link
            href={buildHref(filters, { page: Math.max(1, assignments.pageNumber - 1) })}
            aria-disabled={!assignments.hasPreviousPage}
            className={`inline-flex h-10 items-center justify-center rounded-xl px-4 text-sm font-bold transition ${
              assignments.hasPreviousPage
                ? "border border-slate-200 bg-white text-slate-700 hover:bg-slate-50"
                : "cursor-not-allowed border border-slate-100 bg-slate-50 text-slate-300"
            }`}
          >
            Previous
          </Link>

          {paginationItems.map((item) => {
            if (typeof item !== "number") {
              return (
                <span key={item} className="px-2 text-sm font-bold text-slate-400">
                  ...
                </span>
              );
            }

            const isActive = item === assignments.pageNumber;

            return (
              <Link
                key={item}
                href={buildHref(filters, { page: item })}
                prefetch={false}
                aria-current={isActive ? "page" : undefined}
                className={`inline-flex h-10 min-w-10 items-center justify-center rounded-xl px-3 text-sm font-bold transition ${
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
            href={buildHref(filters, {
              page: Math.min(assignments.totalPages, assignments.pageNumber + 1),
            })}
            aria-disabled={!assignments.hasNextPage}
            className={`inline-flex h-10 items-center justify-center rounded-xl px-4 text-sm font-bold transition ${
              assignments.hasNextPage
                ? "border border-slate-200 bg-white text-slate-700 hover:bg-slate-50"
                : "cursor-not-allowed border border-slate-100 bg-slate-50 text-slate-300"
            }`}
          >
            Next
          </Link>
        </div>
      </div>
    </section>
  );
}
