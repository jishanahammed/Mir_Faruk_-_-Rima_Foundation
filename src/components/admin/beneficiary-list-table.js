import Link from "next/link";
import { AutoSubmitSelect } from "@/components/admin/auto-submit-select";
import { updateBeneficiaryStatusAction } from "@/app/admin/beneficiaries/actions";
import {
  BENEFICIARY_PAGE_SIZE_OPTIONS,
  BENEFICIARY_STATUS_OPTIONS,
} from "@/lib/api/admin-beneficiary-service";

const statusClassNames = {
  Pending: "border-amber-200 bg-amber-50 text-amber-700",
  UnderReview: "border-cyan-200 bg-cyan-50 text-cyan-700",
  Approved: "border-emerald-200 bg-emerald-50 text-emerald-700",
  Rejected: "border-red-200 bg-red-50 text-red-700",
};

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

function formatCurrency(value) {
  const amount = Number(value ?? 0);

  if (!Number.isFinite(amount)) {
    return "0";
  }

  return new Intl.NumberFormat("en-BD", {
    maximumFractionDigits: 0,
  }).format(amount);
}

function getInitials(name) {
  return (
    String(name ?? "")
      .split(" ")
      .filter(Boolean)
      .slice(0, 2)
      .map((part) => part[0]?.toUpperCase())
      .join("") || "BF"
  );
}

function buildBeneficiaryListHref(filters, overrides = {}) {
  const params = new URLSearchParams();
  const nextFilters = {
    search: filters.search ?? "",
    page: filters.page ?? 1,
    pageSize: filters.pageSize ?? BENEFICIARY_PAGE_SIZE_OPTIONS[0],
    ...overrides,
  };

  if (nextFilters.search) {
    params.set("search", nextFilters.search);
  }

  params.set("page", String(nextFilters.page));
  params.set("pageSize", String(nextFilters.pageSize));

  return `/admin/beneficiaries?${params.toString()}`;
}

function buildBeneficiaryDetailsHref(id, returnPath) {
  const params = new URLSearchParams();

  if (returnPath) {
    params.set("returnTo", returnPath);
  }

  const query = params.toString();
  return `/admin/beneficiaries/${id}${query ? `?${query}` : ""}`;
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

function MetaPill({ children, tone = "slate" }) {
  const tones = {
    slate: "border-slate-200 bg-slate-100 text-slate-700",
    cyan: "border-cyan-200 bg-cyan-50 text-cyan-700",
    emerald: "border-emerald-200 bg-emerald-50 text-emerald-700",
    amber: "border-amber-200 bg-amber-50 text-amber-700",
  };

  return (
    <span
      className={`inline-flex rounded-full border px-3 py-1 text-xs font-semibold ${
        tones[tone] ?? tones.slate
      }`}
    >
      {children}
    </span>
  );
}

function BeneficiaryIdentity({ beneficiary, compact = false }) {
  return (
    <div className={`flex items-start ${compact ? "gap-2" : "gap-3"}`}>
      <div
        className={`flex shrink-0 items-center justify-center bg-cyan-50 font-bold text-cyan-700 ring-1 ring-cyan-100 ${
          compact ? "h-9 w-9 rounded-xl text-xs" : "h-12 w-12 rounded-2xl text-sm"
        }`}
      >
        {getInitials(beneficiary.fullName)}
      </div>
      <div className="min-w-0">
        <p className={`${compact ? "text-sm" : "text-base"} truncate font-semibold text-slate-950`}>
          {beneficiary.fullName}
        </p>
        <p className={`${compact ? "mt-0.5 text-[11px]" : "mt-1 text-sm"} truncate text-slate-500`}>
          {beneficiary.nidOrBirthNumber}
        </p>
      </div>
    </div>
  );
}

function BeneficiaryStatusForm({ beneficiary, returnPath, compact = false }) {
  return (
    <form action={updateBeneficiaryStatusAction} className={compact ? "space-y-2" : "space-y-1"}>
      <input type="hidden" name="id" value={beneficiary.id} />
      <input type="hidden" name="returnPath" value={returnPath} />
      <AutoSubmitSelect
        name="status"
        defaultValue={beneficiary.status}
        className={`rounded-xl border border-slate-200 bg-white px-3 text-sm font-medium text-slate-900 outline-none transition focus:border-cyan-400 focus:ring-4 focus:ring-cyan-100 ${
          compact ? "h-11 w-full" : "h-9 w-[150px]"
        }`}
      >
        {BENEFICIARY_STATUS_OPTIONS.map((status) => (
          <option key={status} value={status}>
            {status}
          </option>
        ))}
      </AutoSubmitSelect>
    </form>
  );
}

function ViewDetailsLink({ beneficiaryId, returnPath, compact = false }) {
  return (
    <Link
      href={buildBeneficiaryDetailsHref(beneficiaryId, returnPath)}
      prefetch={false}
      className={`inline-flex items-center justify-center gap-2 rounded-xl border border-cyan-200 bg-cyan-50 font-semibold text-cyan-800 transition hover:border-cyan-300 hover:bg-cyan-100 ${
        compact ? "h-11 w-full px-4 text-sm" : "h-9 px-3 text-xs"
      }`}
    >
      <svg
        className={compact ? "h-4 w-4" : "h-3.5 w-3.5"}
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        viewBox="0 0 24 24"
        aria-hidden="true"
      >
        <path
          d="M2.25 12s3.5-6.75 9.75-6.75S21.75 12 21.75 12s-3.5 6.75-9.75 6.75S2.25 12 2.25 12Z"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <circle cx="12" cy="12" r="2.75" />
      </svg>
      <span>View</span>
    </Link>
  );
}

function MobileBeneficiaryCard({ beneficiary, returnPath }) {
  return (
    <article className="rounded-[24px] border border-slate-200 bg-white p-5 shadow-sm shadow-cyan-950/5">
      <div className="flex items-start justify-between gap-4">
        <BeneficiaryIdentity beneficiary={beneficiary} />
        <span
          className={`inline-flex rounded-full border px-3 py-1 text-xs font-semibold ${
            statusClassNames[beneficiary.status] ?? statusClassNames.Pending
          }`}
        >
          {beneficiary.status}
        </span>
      </div>

      <div className="mt-4 grid gap-4 sm:grid-cols-2">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-400">
            Contact
          </p>
          <p className="mt-2 text-sm font-medium text-slate-800">{beneficiary.mobile}</p>
          <p className="mt-1 text-sm text-slate-500">
            {beneficiary.district}, {beneficiary.upazila}
          </p>
          <p className="mt-1 text-sm text-slate-500">
            {beneficiary.email || "No email provided"}
          </p>
        </div>
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-400">
            Assistance
          </p>
          <div className="mt-2 flex flex-wrap gap-2">
            <MetaPill tone="cyan">{beneficiary.assistanceType || "Not specified"}</MetaPill>
            <MetaPill tone="amber">{beneficiary.documentCount} documents</MetaPill>
          </div>
          <p className="mt-3 text-sm text-slate-500">
            Guarantor: {beneficiary.guarantorName || "Not available"}
          </p>
          <p className="mt-1 text-sm text-slate-500">
            Income: {formatCurrency(beneficiary.monthlyIncome)}
          </p>
        </div>
      </div>

      <div className="mt-4 border-t border-slate-100 pt-4">
        <div className="mb-3 text-sm text-slate-500">
          Submitted on{" "}
          <span className="font-semibold text-slate-900">
            {formatDate(beneficiary.submittedAt || beneficiary.createdAt)}
          </span>
        </div>
        <div className="mb-3">
          <ViewDetailsLink
            beneficiaryId={beneficiary.id}
            returnPath={returnPath}
            compact
          />
        </div>
        <BeneficiaryStatusForm beneficiary={beneficiary} returnPath={returnPath} compact />
      </div>
    </article>
  );
}

function EmptyState() {
  return (
    <div className="mx-auto max-w-md px-6 py-16 text-center">
      <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-3xl bg-cyan-50 text-cyan-700 ring-1 ring-cyan-100">
        <svg
          className="h-8 w-8"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
          viewBox="0 0 24 24"
          aria-hidden="true"
        >
          <path d="M17 17H7a4 4 0 1 1 0-8 5 5 0 0 1 9.8-1.5A3.5 3.5 0 1 1 17 17Z" />
        </svg>
      </div>
      <h3 className="mt-5 text-lg font-bold text-slate-950">No beneficiaries found</h3>
      <p className="mt-2 text-sm leading-6 text-slate-500">
        Try a different search term or reset the filters to view all beneficiary registrations.
      </p>
    </div>
  );
}

export function BeneficiaryListTable({ beneficiaries, filters }) {
  const items = beneficiaries.items ?? [];
  const startItem =
    beneficiaries.totalCount === 0
      ? 0
      : (beneficiaries.pageNumber - 1) * beneficiaries.pageSize + 1;
  const endItem =
    beneficiaries.totalCount === 0
      ? 0
      : Math.min(
          beneficiaries.pageNumber * beneficiaries.pageSize,
          beneficiaries.totalCount,
        );
  const paginationItems = getPaginationItems(
    beneficiaries.pageNumber,
    beneficiaries.totalPages,
  );
  const currentListHref = buildBeneficiaryListHref(filters, {
    page: beneficiaries.pageNumber,
  });

  const statusCounts = BENEFICIARY_STATUS_OPTIONS.reduce((accumulator, status) => {
    accumulator[status] = items.filter((item) => item.status === status).length;
    return accumulator;
  }, {});

  return (
    <div className="space-y-6">
      <section className="overflow-hidden rounded-[30px] border border-cyan-100 bg-white shadow-xl shadow-cyan-950/5">
        <div className="border-b border-cyan-100 bg-[radial-gradient(circle_at_top_left,_rgba(34,211,238,0.18),_transparent_38%),linear-gradient(135deg,#f8fafc,#effcff)] p-6">
          <div className="flex flex-col gap-6">
            <div className="flex flex-col gap-4 xl:flex-row xl:items-start xl:justify-between">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.22em] text-cyan-700">
                  Beneficiary Directory
                </p>
              </div>

              <div className="flex flex-wrap gap-2">
                <MetaPill tone="cyan">{beneficiaries.totalCount} total beneficiaries</MetaPill>
                <MetaPill>{beneficiaries.pageSize} per page</MetaPill>
                <MetaPill tone="emerald">{statusCounts.Approved ?? 0} approved on screen</MetaPill>
              </div>
            </div>

            <form
              method="get"
              className="grid gap-3 rounded-[24px] border border-white/70 bg-white/85 p-4 shadow-sm backdrop-blur sm:grid-cols-[minmax(0,1.7fr)_170px_auto_auto]"
            >
              <input type="hidden" name="page" value="1" />

              <label className="block">
                <span className="mb-2 block text-xs font-semibold uppercase tracking-[0.14em] text-slate-500">
                  Search beneficiary
                </span>
                <div className="relative">
                  <span className="pointer-events-none absolute inset-y-0 left-4 flex items-center text-slate-400">
                    <svg
                      className="h-4 w-4"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      viewBox="0 0 24 24"
                      aria-hidden="true"
                    >
                      <path d="m21 21-4.35-4.35" strokeLinecap="round" />
                      <circle cx="11" cy="11" r="6" />
                    </svg>
                  </span>
                  <input
                    type="search"
                    name="search"
                    defaultValue={filters.search}
                    placeholder="Search name, NID, mobile, district, status..."
                    className="h-12 w-full rounded-2xl border border-slate-200 bg-white pl-11 pr-4 text-sm font-medium text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-cyan-400 focus:ring-4 focus:ring-cyan-100"
                  />
                </div>
              </label>
              <button
                type="submit"
                className="inline-flex h-12 items-center justify-center self-end rounded-2xl bg-[linear-gradient(135deg,#0f766e,#0891b2)] px-5 text-sm font-semibold text-white shadow-lg shadow-cyan-200/80 transition hover:-translate-y-0.5 hover:shadow-xl hover:shadow-cyan-300/70"
              >
                Search
              </button>

              <Link
                href="/admin/beneficiaries"
                className="inline-flex h-12 items-center justify-center self-end rounded-2xl border border-red-500 bg-white px-5 text-sm font-semibold !text-red-500 transition hover:bg-red-50 hover:!text-red-600 visited:!text-red-500"
              >
                Reset
              </Link>
              <label className="block">
                <span className="mb-2 block text-xs font-semibold uppercase tracking-[0.14em] text-slate-500">
                  Show per page
                </span>
                <AutoSubmitSelect
                  name="pageSize"
                  defaultValue={String(filters.pageSize)}
                  className="h-12 w-full rounded-2xl border border-slate-200 bg-white px-4 text-sm font-medium text-slate-900 outline-none transition focus:border-cyan-400 focus:ring-4 focus:ring-cyan-100"
                >
                  {BENEFICIARY_PAGE_SIZE_OPTIONS.map((size) => (
                    <option key={size} value={size}>
                      {size} per page
                    </option>
                  ))}
                </AutoSubmitSelect>
              </label>
            </form>
          </div>
        </div>

        <div className="flex flex-col gap-3 border-b border-slate-100 px-6 py-4 text-sm sm:flex-row sm:items-center sm:justify-between">
          <p className="text-slate-600">
            Showing <span className="font-semibold text-slate-950">{startItem}</span> to{" "}
            <span className="font-semibold text-slate-950">{endItem}</span> of{" "}
            <span className="font-semibold text-slate-950">{beneficiaries.totalCount}</span>{" "}
            beneficiaries
          </p>
          <p className="text-slate-500">
            Page <span className="font-semibold text-slate-950">{beneficiaries.pageNumber}</span>{" "}
            of <span className="font-semibold text-slate-950">{beneficiaries.totalPages}</span>
          </p>
        </div>

        {items.length ? (
          <>
            <div className="grid gap-4 p-4 lg:hidden">
              {items.map((item) => (
                <MobileBeneficiaryCard
                  key={item.id}
                  beneficiary={item}
                  returnPath={currentListHref}
                />
              ))}
            </div>

            <div className="hidden overflow-x-auto lg:block">
              <table className="min-w-full divide-y divide-slate-200 text-left text-xs">
                <thead className="bg-slate-50/90 text-[11px] font-semibold uppercase tracking-[0.12em] text-slate-500">
                  <tr>
                    <th className="px-4 py-3">Beneficiary</th>
                    <th className="px-4 py-3">Contact</th>
                    <th className="px-4 py-3">Assistance</th>
                    <th className="px-4 py-3">Status</th>
                    <th className="px-4 py-3">Submitted</th>
                    <th className="px-4 py-3">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 bg-white">
                  {items.map((item) => (
                    <tr key={item.id} className="align-top transition hover:bg-cyan-50/35">
                      <td className="px-4 py-3">
                        <BeneficiaryIdentity beneficiary={item} compact />
                        <p className="mt-1 text-[11px] text-slate-500">{item.guarantorName}</p>
                      </td>
                      <td className="px-4 py-3">
                        <p className="font-medium text-slate-800">{item.mobile}</p>
                        <p className="mt-0.5 max-w-[220px] truncate text-[11px] text-slate-500">
                          {item.district}, {item.upazila}
                        </p>
                        <p className="mt-0.5 max-w-[220px] truncate text-[11px] text-slate-500">
                          {item.email || "No email"}
                        </p>
                      </td>
                      <td className="px-4 py-3">
                        <MetaPill tone="cyan">{item.assistanceType || "Not specified"}</MetaPill>
                        <div className="mt-1.5">
                          <MetaPill tone="amber">{item.documentCount} documents</MetaPill>
                        </div>
                        <p className="mt-1.5 text-[11px] text-slate-500">
                          Income: {formatCurrency(item.monthlyIncome)}
                        </p>
                      </td>
                      <td className="px-4 py-3">
                        <span
                          className={`mb-2 inline-flex rounded-full border px-2.5 py-0.5 text-[11px] font-semibold ${
                            statusClassNames[item.status] ?? statusClassNames.Pending
                          }`}
                        >
                          {item.status}
                        </span>
                        <BeneficiaryStatusForm
                          beneficiary={item}
                          returnPath={currentListHref}
                        />
                      </td>
                      <td className="px-4 py-3 text-slate-600">
                        {formatDate(item.submittedAt || item.createdAt)}
                      </td>
                      <td className="px-4 py-3">
                        <ViewDetailsLink
                          beneficiaryId={item.id}
                          returnPath={currentListHref}
                        />
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
            Search and page-size controls help you review incoming beneficiary registrations quickly.
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <Link
              href={buildBeneficiaryListHref(filters, {
                page: Math.max(1, beneficiaries.pageNumber - 1),
              })}
              aria-disabled={!beneficiaries.hasPreviousPage}
              className={`inline-flex h-10 items-center justify-center rounded-xl px-4 text-sm font-semibold transition ${
                beneficiaries.hasPreviousPage
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

              const isActive = item === beneficiaries.pageNumber;

              return (
                <Link
                  key={item}
                  href={buildBeneficiaryListHref(filters, { page: item })}
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
              href={buildBeneficiaryListHref(filters, {
                page: Math.min(beneficiaries.totalPages, beneficiaries.pageNumber + 1),
              })}
              aria-disabled={!beneficiaries.hasNextPage}
              className={`inline-flex h-10 items-center justify-center rounded-xl px-4 text-sm font-semibold transition ${
                beneficiaries.hasNextPage
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
