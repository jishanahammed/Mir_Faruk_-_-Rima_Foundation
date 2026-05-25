import Link from "next/link";
import { AutoSubmitSelect } from "@/components/admin/auto-submit-select";
import { ConfirmSubmitButton } from "@/components/admin/confirm-submit-button";
import { DonorDetailsModal } from "@/components/admin/donor-details-modal";
import {
  deleteDonorAction,
  updateDonorApprovalAction,
  updateDonorVisibilityAction,
} from "@/app/admin/donors/actions";
import { DONOR_PAGE_SIZE_OPTIONS } from "@/lib/api/admin-donor-service";

const approvalClassNames = {
  approved: "border-emerald-200 bg-emerald-50 text-emerald-700",
  pending: "border-amber-200 bg-amber-50 text-amber-700",
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

function getInitials(name) {
  return (
    String(name ?? "")
      .split(" ")
      .filter(Boolean)
      .slice(0, 2)
      .map((part) => part[0]?.toUpperCase())
      .join("") || "DN"
  );
}

function buildDonorListHref(filters, overrides = {}) {
  const params = new URLSearchParams();
  const nextFilters = {
    search: filters.search ?? "",
    page: filters.page ?? 1,
    pageSize: filters.pageSize ?? DONOR_PAGE_SIZE_OPTIONS[0],
    ...overrides,
  };

  if (nextFilters.search) {
    params.set("search", nextFilters.search);
  }

  params.set("page", String(nextFilters.page));
  params.set("pageSize", String(nextFilters.pageSize));

  return `/admin/donors?${params.toString()}`;
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
  };

  return (
    <span
      className={`inline-flex rounded-full border px-3 py-1 text-xs font-semibold ${tones[tone] ?? tones.slate
        }`}
    >
      {children}
    </span>
  );
}

function ActionIcon({ type }) {
  const icons = {
    approve: (
      <path d="m5 12 4 4L19 6" strokeLinecap="round" strokeLinejoin="round" />
    ),
    unapprove: (
      <path d="m7 7 10 10M17 7 7 17" strokeLinecap="round" strokeLinejoin="round" />
    ),
    public: (
      <>
        <circle cx="12" cy="12" r="9" />
        <path d="M3.6 9h16.8M3.6 15h16.8M12 3a14 14 0 0 1 0 18M12 3a14 14 0 0 0 0 18" />
      </>
    ),
    private: (
      <>
        <path d="M7 11V8a5 5 0 0 1 10 0v3" strokeLinecap="round" />
        <rect x="5" y="11" width="14" height="10" rx="2" />
      </>
    ),
    edit: (
      <path d="M4 20h4.5L19 9.5 14.5 5 4 15.5V20ZM13.5 6 18 10.5" strokeLinecap="round" strokeLinejoin="round" />
    ),
  };

  return (
    <svg className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" aria-hidden="true">
      {icons[type]}
    </svg>
  );
}

function ActionTooltip({ children }) {
  return (
    <span className="pointer-events-none absolute -top-10 left-1/2 z-20 -translate-x-1/2 translate-y-1 whitespace-nowrap rounded-xl border border-cyan-200/50 bg-[linear-gradient(135deg,#0f766e,#0891b2)] px-3 py-1.5 text-[11px] font-bold text-white opacity-0 shadow-xl shadow-cyan-950/20 transition duration-200 ease-out before:absolute before:left-1/2 before:top-full before:h-2 before:w-2 before:-translate-x-1/2 before:-translate-y-1 before:rotate-45 before:bg-[#0891b2] group-hover:translate-y-0 group-hover:opacity-100">
      <span className="relative z-10">{children}</span>
    </span>
  );
}

function DonorIdentity({ donor, compact = false }) {
  return (
    <div className={`flex items-start ${compact ? "gap-2" : "gap-3"}`}>
      <div
        className={`flex shrink-0 items-center justify-center bg-cyan-50 font-bold text-cyan-700 ring-1 ring-cyan-100 ${
          compact ? "h-9 w-9 rounded-xl text-xs" : "h-12 w-12 rounded-2xl text-sm"
        }`}
      >
        {getInitials(donor.fullName)}
      </div>
      <div className="min-w-0">
        <p className={`${compact ? "text-sm" : "text-base"} truncate font-semibold text-slate-950`}>
          {donor.fullName}
        </p>
        <p className={`${compact ? "mt-0.5 text-[11px]" : "mt-1 text-sm"} truncate text-slate-500`}>
          {donor.email}
        </p>
      </div>
    </div>
  );
}

function MobileDonorCard({ donor }) {
  return (
    <article className="rounded-[24px] border border-slate-200 bg-white p-5 shadow-sm shadow-cyan-950/5">
      <div className="flex items-start justify-between gap-4">
        <DonorIdentity donor={donor} />
        <span
          className={`inline-flex rounded-full border px-3 py-1 text-xs font-semibold ${donor.isApprove ? approvalClassNames.approved : approvalClassNames.pending
            }`}
        >
          {donor.isApprove ? "Approved" : "Pending"}
        </span>
      </div>

      <div className="mt-4 grid gap-4 sm:grid-cols-2">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-400">
            Contact
          </p>
          <p className="mt-2 text-sm font-medium text-slate-800">{donor.mobile}</p>
          <p className="mt-1 text-sm leading-6 text-slate-500">{donor.address}</p>
        </div>
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-400">
            Donor Details
          </p>
          <div className="mt-2 flex flex-wrap gap-2">
            <MetaPill tone="cyan">{donor.donorType || "General"}</MetaPill>
            <MetaPill>{donor.frequency || "No frequency"}</MetaPill>
            <MetaPill tone={donor.isPublic ? "emerald" : "slate"}>
              {donor.isPublic ? "Public profile" : "Private profile"}
            </MetaPill>
          </div>
          <p className="mt-3 text-sm text-slate-500">{donor.profession || "No profession added"}</p>
          <p className="mt-1 text-sm text-slate-500">{donor.purpose || "No donation purpose added"}</p>
        </div>
      </div>

      <div className="mt-4 border-t border-slate-100 pt-4 text-sm text-slate-500">
        Joined on <span className="font-semibold text-slate-900">{formatDate(donor.createdAt)}</span>
      </div>
    </article>
  );
}

function DonorRowActions({ donor, returnPath }) {
  return (
    <div className="flex flex-wrap gap-1.5">
      <DonorDetailsModal donor={donor} />

      <form action={updateDonorApprovalAction}>
        <input type="hidden" name="id" value={donor.id} />
        <input type="hidden" name="isApprove" value={String(!donor.isApprove)} />
        <input type="hidden" name="returnPath" value={returnPath} />
        <button
          type="submit"
          className={`group relative inline-flex h-8 w-8 items-center justify-center rounded-lg border text-xs font-semibold transition ${donor.isApprove
            ? "border-amber-200 bg-amber-50 text-amber-700 hover:bg-amber-100"
            : "border-emerald-200 bg-emerald-50 text-emerald-700 hover:bg-emerald-100"
            }`}
          aria-label={donor.isApprove ? "Unapprove donor" : "Approve donor"}
          title={donor.isApprove ? "Unapprove" : "Approve"}
        >
          <ActionTooltip>{donor.isApprove ? "Unapprove" : "Approve"}</ActionTooltip>
          <ActionIcon type={donor.isApprove ? "unapprove" : "approve"} />
        </button>
      </form>

      <form action={updateDonorVisibilityAction}>
        <input type="hidden" name="id" value={donor.id} />
        <input type="hidden" name="isPublic" value={String(!donor.isPublic)} />
        <input type="hidden" name="returnPath" value={returnPath} />
        <button
          type="submit"
          className={`group relative inline-flex h-8 w-8 items-center justify-center rounded-lg border text-xs font-semibold transition ${donor.isPublic
            ? "border-slate-200 bg-slate-50 text-slate-700 hover:bg-slate-100"
            : "border-cyan-200 bg-cyan-50 text-cyan-700 hover:bg-cyan-100"
            }`}
          aria-label={donor.isPublic ? "Make donor profile private" : "Make donor profile public"}
          title={donor.isPublic ? "Make Private" : "Make Public"}
        >
          <ActionTooltip>{donor.isPublic ? "Private" : "Public"}</ActionTooltip>
          <ActionIcon type={donor.isPublic ? "private" : "public"} />
        </button>
      </form>

      <Link
        href={`/admin/donors/${donor.id}/edit`}
        className="group relative inline-flex h-8 w-8 items-center justify-center rounded-lg border border-cyan-200 bg-white text-xs font-semibold text-cyan-700 transition hover:bg-cyan-50"
        aria-label="Edit donor"
        title="Edit"
      >
        <ActionTooltip>Edit</ActionTooltip>
        <ActionIcon type="edit" />
      </Link>

      <form action={deleteDonorAction}>
        <input type="hidden" name="id" value={donor.id} />
        <input type="hidden" name="returnPath" value={returnPath} />
        <ConfirmSubmitButton
          confirmMessage="Delete this donor from the active list?"
          className="group relative inline-flex h-8 w-8 items-center justify-center rounded-lg border border-red-200 bg-white text-xs font-semibold !text-red-500 transition hover:bg-red-50"
          ariaLabel="Delete donor"
          title="Delete"
        >
          <ActionTooltip>Delete</ActionTooltip>
          <svg className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" aria-hidden="true">
            <path d="M4 7h16M10 11v6M14 11v6M6 7l1 14h10l1-14M9 7V4h6v3" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </ConfirmSubmitButton>
      </form>
    </div>
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
      <h3 className="mt-5 text-lg font-bold text-slate-950">No donors found</h3>
      <p className="mt-2 text-sm leading-6 text-slate-500">
        Try a different search term or reset the filters to view all donor registrations.
      </p>
    </div>
  );
}

export function DonorListTable({ donors, filters }) {
  const items = donors.items ?? [];
  const approvedCount = items.filter((item) => item.isApprove).length;
  const pendingCount = items.length - approvedCount;
  const startItem = donors.totalCount === 0 ? 0 : (donors.pageNumber - 1) * donors.pageSize + 1;
  const endItem =
    donors.totalCount === 0 ? 0 : Math.min(donors.pageNumber * donors.pageSize, donors.totalCount);
  const paginationItems = getPaginationItems(donors.pageNumber, donors.totalPages);
  const currentListHref = buildDonorListHref(filters, { page: donors.pageNumber });

  return (
    <div className="space-y-6">
      <section className="overflow-hidden rounded-[30px] border border-cyan-100 bg-white shadow-xl shadow-cyan-950/5">
        <div className="border-b border-cyan-100 bg-[radial-gradient(circle_at_top_left,_rgba(34,211,238,0.18),_transparent_38%),linear-gradient(135deg,#f8fafc,#effcff)] p-6">
          <div className="flex flex-col gap-6">
            <div className="flex flex-col gap-4 xl:flex-row xl:items-start xl:justify-between">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.22em] text-cyan-700">
                  Donor Directory
                </p>
              </div>

              <div className="flex flex-wrap gap-2">
                <MetaPill tone="cyan">{donors.totalCount} total donors</MetaPill>
                <MetaPill>{donors.pageSize} per page</MetaPill>
                <MetaPill tone="emerald">{approvedCount} approved on screen</MetaPill>
              </div>
            </div>

            <form
              method="get"
              className="grid gap-3 rounded-[24px] border border-white/70 bg-white/85 p-4 shadow-sm backdrop-blur sm:grid-cols-[minmax(0,1.7fr)_170px_auto_auto]"
            >
              <input type="hidden" name="page" value="1" />

              <label className="block">
                <span className="mb-2 block text-xs font-semibold uppercase tracking-[0.14em] text-slate-500">
                  Search donor
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
                    placeholder="Search name, email, mobile, donor type..."
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
                href="/admin/donors"
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
                  {DONOR_PAGE_SIZE_OPTIONS.map((size) => (
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
            <span className="font-semibold text-slate-950">{donors.totalCount}</span> donors
          </p>
          <p className="text-slate-500">
            Page <span className="font-semibold text-slate-950">{donors.pageNumber}</span> of{" "}
            <span className="font-semibold text-slate-950">{donors.totalPages}</span>
          </p>
        </div>

        {items.length ? (
          <>
            <div className="grid gap-4 p-4 lg:hidden">
              {items.map((item) => (
                <div key={item.id} className="space-y-3">
                  <MobileDonorCard donor={item} />
                  <div className="rounded-[18px] border border-slate-200 bg-white p-3">
                    <DonorRowActions donor={item} returnPath={currentListHref} />
                  </div>
                </div>
              ))}
            </div>

            <div className="hidden overflow-x-auto lg:block">
              <table className="min-w-full divide-y divide-slate-200 text-left text-xs">
                <thead className="bg-slate-50/90 text-[11px] font-semibold uppercase tracking-[0.12em] text-slate-500">
                  <tr>
                    <th className="px-4 py-3">Donor</th>
                    <th className="px-4 py-3">Contact</th>
                    <th className="px-4 py-3">Approval</th>
                    <th className="px-4 py-3">Joined</th>
                    <th className="px-4 py-3">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 bg-white">
                  {items.map((item) => (
                    <tr key={item.id} className="align-top transition hover:bg-cyan-50/35">
                      <td className="px-4 py-3">
                        <DonorIdentity donor={item} compact />
                      </td>
                      <td className="px-4 py-3">
                        <p className="font-medium text-slate-800">{item.mobile}</p>
                        <p className="mt-0.5 max-w-[220px] truncate text-[11px] text-slate-500">{item.address}</p>
                      </td>
                      <td className="px-4 py-3">
                        <span
                          className={`inline-flex rounded-full border px-2.5 py-0.5 text-[11px] font-semibold ${item.isApprove ? approvalClassNames.approved : approvalClassNames.pending
                            }`}
                        >
                          {item.isApprove ? "Approved" : "Pending"}
                        </span>
                        <div className="mt-1.5">
                          <MetaPill tone={item.isPublic ? "emerald" : "slate"}>
                            {item.isPublic ? "Public" : "Private"}
                          </MetaPill>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-slate-600">{formatDate(item.createdAt)}</td>
                      <td className="px-4 py-3">
                        <DonorRowActions donor={item} returnPath={currentListHref} />
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
            Use the search and page-size controls above to refine the donor review queue.
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <Link
              href={buildDonorListHref(filters, {
                page: Math.max(1, donors.pageNumber - 1),
              })}
              aria-disabled={!donors.hasPreviousPage}
              className={`inline-flex h-10 items-center justify-center rounded-xl px-4 text-sm font-semibold transition ${donors.hasPreviousPage
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

              const isActive = item === donors.pageNumber;

              return (
                <Link
                  key={item}
                  href={buildDonorListHref(filters, { page: item })}
                  prefetch={false}
                  aria-current={isActive ? "page" : undefined}
                  className={`inline-flex h-10 min-w-10 items-center justify-center rounded-xl px-3 text-sm font-semibold transition ${isActive
                    ? "border border-cyan-200 bg-white text-cyan-800 shadow-md shadow-cyan-100/80 ring-2 ring-cyan-100"
                    : "border border-slate-200 bg-white text-slate-700 hover:bg-slate-50"
                    }`}
                >
                  {item}
                </Link>
              );
            })}

            <Link
              href={buildDonorListHref(filters, {
                page: Math.min(donors.totalPages, donors.pageNumber + 1),
              })}
              aria-disabled={!donors.hasNextPage}
              className={`inline-flex h-10 items-center justify-center rounded-xl px-4 text-sm font-semibold transition ${donors.hasNextPage
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
