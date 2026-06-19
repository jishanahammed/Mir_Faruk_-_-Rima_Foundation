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

function formatDate(value) {
  if (!value) return "—";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "—";
  return new Intl.DateTimeFormat("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(date);
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

const AVATAR_GRADIENTS = [
  "from-cyan-400 to-teal-500",
  "from-violet-400 to-purple-500",
  "from-orange-400 to-rose-500",
  "from-emerald-400 to-cyan-500",
  "from-blue-400 to-indigo-500",
  "from-pink-400 to-rose-500",
];

function getAvatarGradient(id) {
  return AVATAR_GRADIENTS[Number(id ?? 0) % AVATAR_GRADIENTS.length];
}

function buildDonorListHref(filters, overrides = {}) {
  const params = new URLSearchParams();
  const nextFilters = {
    search: filters.search ?? "",
    page: filters.page ?? 1,
    pageSize: filters.pageSize ?? DONOR_PAGE_SIZE_OPTIONS[0],
    isPublic: filters.isPublic ?? "",
    ...overrides,
  };
  if (nextFilters.search) params.set("search", nextFilters.search);
  if (nextFilters.isPublic === "true" || nextFilters.isPublic === "false") {
    params.set("isPublic", nextFilters.isPublic);
  }
  params.set("page", String(nextFilters.page));
  params.set("pageSize", String(nextFilters.pageSize));
  return `/admin/donors?${params.toString()}`;
}

function getPaginationItems(pageNumber, totalPages) {
  if (totalPages <= 7) {
    return Array.from({ length: totalPages }, (_, i) => i + 1);
  }
  const items = [1];
  if (pageNumber > 3) items.push("start-ellipsis");
  for (
    let p = Math.max(2, pageNumber - 1);
    p <= Math.min(totalPages - 1, pageNumber + 1);
    p += 1
  ) {
    items.push(p);
  }
  if (pageNumber < totalPages - 2) items.push("end-ellipsis");
  items.push(totalPages);
  return items;
}

function StatCard({ label, value, tone = "slate", icon }) {
  const tones = {
    slate: "from-slate-50 to-slate-100/60 border-slate-200 text-slate-700",
    cyan: "from-cyan-50 to-sky-50 border-cyan-200 text-cyan-700",
    emerald: "from-emerald-50 to-teal-50 border-emerald-200 text-emerald-700",
    amber: "from-amber-50 to-yellow-50 border-amber-200 text-amber-700",
  };
  const valueTones = {
    slate: "text-slate-900",
    cyan: "text-cyan-900",
    emerald: "text-emerald-900",
    amber: "text-amber-900",
  };
  return (
    <div className={`flex items-center gap-3 rounded-2xl border bg-linear-to-br px-4 py-3 ${tones[tone]}`}>
      <div className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-white/80 shadow-sm ${tones[tone]}`}>
        {icon}
      </div>
      <div>
        <p className="text-[11px] font-semibold uppercase tracking-[0.12em] opacity-70">{label}</p>
        <p className={`text-xl font-bold leading-none ${valueTones[tone]}`}>{value}</p>
      </div>
    </div>
  );
}

function ActionIcon({ type }) {
  const icons = {
    approve: <path d="m5 12 4 4L19 6" strokeLinecap="round" strokeLinejoin="round" />,
    unapprove: <path d="m7 7 10 10M17 7 7 17" strokeLinecap="round" strokeLinejoin="round" />,
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
    edit: <path d="M4 20h4.5L19 9.5 14.5 5 4 15.5V20ZM13.5 6 18 10.5" strokeLinecap="round" strokeLinejoin="round" />,
    view: (
      <>
        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
        <circle cx="12" cy="12" r="3" />
      </>
    ),
    search: (
      <>
        <circle cx="11" cy="11" r="6" />
        <path d="m21 21-4.35-4.35" strokeLinecap="round" />
      </>
    ),
    users: (
      <>
        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
        <circle cx="9" cy="7" r="4" />
        <path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" />
      </>
    ),
    check: <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" strokeLinecap="round" strokeLinejoin="round" />,
    clock: (
      <>
        <circle cx="12" cy="12" r="10" />
        <path d="M12 6v6l4 2" strokeLinecap="round" />
      </>
    ),
    globe: (
      <>
        <circle cx="12" cy="12" r="10" />
        <path d="M2 12h20M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
      </>
    ),
  };
  return (
    <svg className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" aria-hidden="true">
      {icons[type]}
    </svg>
  );
}

function Tooltip({ children }) {
  return (
    <span className="pointer-events-none absolute -top-10 left-1/2 z-30 -translate-x-1/2 translate-y-1 whitespace-nowrap rounded-lg bg-slate-900 px-2.5 py-1.5 text-[11px] font-semibold text-white opacity-0 shadow-lg transition-all duration-150 ease-out before:absolute before:left-1/2 before:top-full before:h-1.5 before:w-1.5 before:-translate-x-1/2 before:-translate-y-0.5 before:rotate-45 before:bg-slate-900 group-hover:translate-y-0 group-hover:opacity-100">
      {children}
    </span>
  );
}

function DonorAvatar({ donor, size = "md" }) {
  const sizes = {
    sm: "h-8 w-8 rounded-lg text-[11px]",
    md: "h-10 w-10 rounded-xl text-xs",
    lg: "h-12 w-12 rounded-2xl text-sm",
  };
  return (
    <div
      className={`flex shrink-0 items-center justify-center bg-linear-to-br font-bold text-white shadow-sm ${sizes[size]} ${getAvatarGradient(donor.id)}`}
    >
      {getInitials(donor.fullName)}
    </div>
  );
}

function DonorIdentity({ donor, compact = false }) {
  return (
    <div className={`flex items-center ${compact ? "gap-2.5" : "gap-3"}`}>
      <DonorAvatar donor={donor} size={compact ? "sm" : "md"} />
      <div className="min-w-0">
        <p className={`${compact ? "text-sm" : "text-base"} truncate font-semibold text-slate-900`}>
          {donor.fullName}
        </p>
        <p className={`${compact ? "text-[11px]" : "text-sm"} mt-0.5 truncate text-slate-400`}>
          {donor.email}
        </p>
      </div>
    </div>
  );
}

function StatusBadge({ approved }) {
  return approved ? (
    <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-1 text-[11px] font-semibold text-emerald-700 ring-1 ring-emerald-200">
      <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
      Approved
    </span>
  ) : (
    <span className="inline-flex items-center gap-1 rounded-full bg-amber-50 px-2.5 py-1 text-[11px] font-semibold text-amber-700 ring-1 ring-amber-200">
      <span className="h-1.5 w-1.5 rounded-full bg-amber-400" />
      Pending
    </span>
  );
}

function VisibilityBadge({ isPublic }) {
  return isPublic ? (
    <span className="inline-flex items-center gap-1 rounded-full bg-sky-50 px-2.5 py-1 text-[11px] font-semibold text-sky-700 ring-1 ring-sky-200">
      <svg className="h-3 w-3" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
        <circle cx="12" cy="12" r="10" /><path d="M2 12h20M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
      </svg>
      Public
    </span>
  ) : (
    <span className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-2.5 py-1 text-[11px] font-semibold text-slate-500 ring-1 ring-slate-200">
      <svg className="h-3 w-3" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
        <path d="M7 11V8a5 5 0 0 1 10 0v3" strokeLinecap="round" /><rect x="5" y="11" width="14" height="10" rx="2" />
      </svg>
      Private
    </span>
  );
}

function DonorRowActions({ donor, returnPath }) {
  return (
    <div className="flex items-center gap-1.5">
      <div className="flex items-center divide-x divide-slate-100 overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
        <DonorDetailsModal donor={donor} />

        <form action={updateDonorApprovalAction}>
          <input type="hidden" name="id" value={donor.id} />
          <input type="hidden" name="isApprove" value={String(!donor.isApprove)} />
          <input type="hidden" name="returnPath" value={returnPath} />
          <button
            type="submit"
            className={`group relative inline-flex h-9 w-9 items-center justify-center transition focus:outline-none focus-visible:ring-2 focus-visible:ring-inset ${
              donor.isApprove
                ? "bg-emerald-50 text-emerald-600 hover:bg-emerald-100 focus-visible:ring-emerald-400"
                : "bg-white text-slate-400 hover:bg-emerald-50 hover:text-emerald-600 focus-visible:ring-emerald-400"
            }`}
            aria-label={donor.isApprove ? "Unapprove donor" : "Approve donor"}
          >
            <Tooltip>{donor.isApprove ? "Unapprove" : "Approve"}</Tooltip>
            <ActionIcon type={donor.isApprove ? "unapprove" : "approve"} />
          </button>
        </form>

        <form action={updateDonorVisibilityAction}>
          <input type="hidden" name="id" value={donor.id} />
          <input type="hidden" name="isPublic" value={String(!donor.isPublic)} />
          <input type="hidden" name="returnPath" value={returnPath} />
          <button
            type="submit"
            className={`group relative inline-flex h-9 w-9 items-center justify-center transition focus:outline-none focus-visible:ring-2 focus-visible:ring-inset ${
              donor.isPublic
                ? "bg-sky-50 text-sky-600 hover:bg-sky-100 focus-visible:ring-sky-400"
                : "bg-white text-slate-400 hover:bg-sky-50 hover:text-sky-600 focus-visible:ring-sky-400"
            }`}
            aria-label={donor.isPublic ? "Make private" : "Make public"}
          >
            <Tooltip>{donor.isPublic ? "Make Private" : "Make Public"}</Tooltip>
            <ActionIcon type={donor.isPublic ? "private" : "public"} />
          </button>
        </form>

        <Link
          href={`/admin/donors/${donor.id}/edit`}
          className="group relative inline-flex h-9 w-9 items-center justify-center bg-white text-slate-400 transition hover:bg-cyan-50 hover:text-cyan-600 focus:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-cyan-400"
          aria-label="Edit donor"
        >
          <Tooltip>Edit</Tooltip>
          <ActionIcon type="edit" />
        </Link>
      </div>

      <form action={deleteDonorAction}>
        <input type="hidden" name="id" value={donor.id} />
        <input type="hidden" name="returnPath" value={returnPath} />
        <ConfirmSubmitButton
          confirmMessage="Delete this donor from the active list?"
          className="group relative inline-flex h-9 w-9 items-center justify-center overflow-hidden rounded-xl border border-red-100 bg-white text-red-400 shadow-sm transition hover:border-red-200 hover:bg-red-50 hover:text-red-600 focus:outline-none focus-visible:ring-2 focus-visible:ring-red-400"
          ariaLabel="Delete donor"
          title="Delete"
        >
          <Tooltip>Delete</Tooltip>
          <svg className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" aria-hidden="true">
            <path d="M4 7h16M10 11v6M14 11v6M6 7l1 14h10l1-14M9 7V4h6v3" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </ConfirmSubmitButton>
      </form>
    </div>
  );
}

function MobileDonorCard({ donor }) {
  return (
    <article className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
      <div className="flex items-start justify-between gap-3 border-b border-slate-100 bg-linear-to-r from-slate-50 to-white p-4">
        <DonorIdentity donor={donor} />
        <StatusBadge approved={donor.isApprove} />
      </div>
      <div className="grid gap-4 p-4 sm:grid-cols-2">
        <div className="space-y-1">
          <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Contact</p>
          <p className="text-sm font-semibold text-slate-800">{donor.mobile}</p>
          <p className="text-xs leading-5 text-slate-500">{donor.address || "—"}</p>
        </div>
        <div className="space-y-2">
          <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Details</p>
          <div className="flex flex-wrap gap-1.5">
            {donor.donorType ? (
              <span className="rounded-lg bg-cyan-50 px-2 py-0.5 text-[11px] font-semibold text-cyan-700 ring-1 ring-cyan-200">
                {donor.donorType}
              </span>
            ) : null}
            {donor.frequency ? (
              <span className="rounded-lg bg-slate-100 px-2 py-0.5 text-[11px] font-semibold text-slate-600 ring-1 ring-slate-200">
                {donor.frequency}
              </span>
            ) : null}
            <VisibilityBadge isPublic={donor.isPublic} />
          </div>
          {donor.profession ? (
            <p className="text-xs text-slate-500">{donor.profession}</p>
          ) : null}
        </div>
      </div>
      <div className="flex items-center justify-between border-t border-slate-100 bg-slate-50/60 px-4 py-2.5 text-xs text-slate-500">
        <span>Joined <span className="font-semibold text-slate-700">{formatDate(donor.createdAt)}</span></span>
        <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400">#{donor.id}</span>
      </div>
    </article>
  );
}

function EmptyState({ hasFilters }) {
  return (
    <div className="flex flex-col items-center justify-center px-6 py-20 text-center">
      <div className="relative mx-auto mb-6 flex h-20 w-20 items-center justify-center">
        <div className="absolute inset-0 rounded-3xl bg-linear-to-br from-cyan-100 to-sky-100" />
        <div className="absolute inset-0 rounded-3xl bg-linear-to-br from-cyan-100 to-sky-100 opacity-50 blur-lg" />
        <svg className="relative h-10 w-10 text-cyan-600" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M18 18.72a9.094 9.094 0 0 0 3.741-.479 3 3 0 0 0-4.682-2.72m.94 3.198.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0 1 12 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 0 1 6 18.719m12 0a5.971 5.971 0 0 0-.941-3.197m0 0A5.995 5.995 0 0 0 12 12.75a5.995 5.995 0 0 0-5.058 2.772m0 0a3 3 0 0 0-4.681 2.72 8.986 8.986 0 0 0 3.74.477m.94-3.197a5.971 5.971 0 0 0-.94 3.197M15 6.75a3 3 0 1 1-6 0 3 3 0 0 1 6 0Zm6 3a2.25 2.25 0 1 1-4.5 0 2.25 2.25 0 0 1 4.5 0Zm-13.5 0a2.25 2.25 0 1 1-4.5 0 2.25 2.25 0 0 1 4.5 0Z" />
        </svg>
      </div>
      <h3 className="text-lg font-bold text-slate-900">No donors found</h3>
      <p className="mt-2 max-w-sm text-sm leading-6 text-slate-500">
        {hasFilters
          ? "No donors match the current filters. Try adjusting your search or reset the filters."
          : "No donor registrations yet. They will appear here once donors sign up."}
      </p>
      {hasFilters ? (
        <Link
          href="/admin/donors"
          className="mt-5 inline-flex items-center gap-2 rounded-xl bg-cyan-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-cyan-700"
        >
          Clear filters
        </Link>
      ) : null}
    </div>
  );
}

export function DonorListTable({ donors, filters }) {
  const items = donors.items ?? [];
  const approvedCount = items.filter((d) => d.isApprove).length;
  const pendingCount = items.length - approvedCount;
  const publicCount = items.filter((d) => d.isPublic).length;
  const startItem = donors.totalCount === 0 ? 0 : (donors.pageNumber - 1) * donors.pageSize + 1;
  const endItem = donors.totalCount === 0 ? 0 : Math.min(donors.pageNumber * donors.pageSize, donors.totalCount);
  const paginationItems = getPaginationItems(donors.pageNumber, donors.totalPages);
  const currentListHref = buildDonorListHref(filters, { page: donors.pageNumber });
  const hasFilters = !!(filters.search || filters.isPublic);

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">Donor Directory</h1>
          <p className="mt-0.5 text-sm text-slate-500">Manage and review all registered donors</p>
        </div>
        <div className="flex items-center gap-2">
          <span className="rounded-xl bg-cyan-600 px-3 py-1.5 text-xs font-bold text-white shadow-sm">
            {donors.totalCount} total
          </span>
        </div>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <StatCard
          label="Total Donors"
          value={donors.totalCount}
          tone="cyan"
          icon={<ActionIcon type="users" />}
        />
        <StatCard
          label="Approved"
          value={approvedCount}
          tone="emerald"
          icon={<ActionIcon type="check" />}
        />
        <StatCard
          label="Pending"
          value={pendingCount}
          tone="amber"
          icon={<ActionIcon type="clock" />}
        />
        <StatCard
          label="Public"
          value={publicCount}
          tone="slate"
          icon={<ActionIcon type="globe" />}
        />
      </div>

      {/* Main card */}
      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">

        {/* Filter bar */}
        <div className="border-b border-slate-100 bg-slate-50/80 px-5 py-4">
          <form
            method="get"
            className="flex flex-wrap items-end gap-3"
          >
            <input type="hidden" name="page" value="1" />

            <div className="min-w-0 flex-1 basis-48">
              <label className="block">
                <span className="mb-1.5 block text-[11px] font-bold uppercase tracking-widest text-slate-500">
                  Search
                </span>
                <div className="relative">
                  <span className="pointer-events-none absolute inset-y-0 left-3.5 flex items-center text-slate-400">
                    <ActionIcon type="search" />
                  </span>
                  <input
                    type="search"
                    name="search"
                    defaultValue={filters.search}
                    placeholder="Name, email, mobile..."
                    className="h-10 w-full rounded-xl border border-slate-200 bg-white pl-10 pr-3 text-sm font-medium text-slate-900 outline-none transition placeholder:font-normal placeholder:text-slate-400 focus:border-cyan-400 focus:ring-3 focus:ring-cyan-100"
                  />
                </div>
              </label>
            </div>

            <div className="basis-40">
              <label className="block">
                <span className="mb-1.5 block text-[11px] font-bold uppercase tracking-widest text-slate-500">
                  Visibility
                </span>
                <AutoSubmitSelect
                  name="isPublic"
                  defaultValue={filters.isPublic ?? ""}
                  className="h-10 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm font-medium text-slate-900 outline-none transition focus:border-cyan-400 focus:ring-3 focus:ring-cyan-100"
                >
                  <option value="">All profiles</option>
                  <option value="true">Public only</option>
                  <option value="false">Private only</option>
                </AutoSubmitSelect>
              </label>
            </div>

            <div className="basis-36">
              <label className="block">
                <span className="mb-1.5 block text-[11px] font-bold uppercase tracking-widest text-slate-500">
                  Per page
                </span>
                <AutoSubmitSelect
                  name="pageSize"
                  defaultValue={String(filters.pageSize)}
                  className="h-10 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm font-medium text-slate-900 outline-none transition focus:border-cyan-400 focus:ring-3 focus:ring-cyan-100"
                >
                  {DONOR_PAGE_SIZE_OPTIONS.map((size) => (
                    <option key={size} value={size}>
                      {size} rows
                    </option>
                  ))}
                </AutoSubmitSelect>
              </label>
            </div>

            <button
              type="submit"
              className="h-10 rounded-xl bg-cyan-600 px-5 text-sm font-semibold text-white shadow-sm transition hover:bg-cyan-700 active:scale-95"
            >
              Search
            </button>

            <Link
              href="/admin/donors"
              className="inline-flex h-10 items-center rounded-xl border border-slate-200 bg-white px-4 text-sm font-semibold text-slate-600 transition hover:border-slate-300 hover:bg-slate-50"
            >
              Reset
            </Link>
          </form>
        </div>

        {/* Results bar */}
        <div className="flex items-center justify-between border-b border-slate-100 px-5 py-2.5">
          <p className="text-xs text-slate-500">
            Showing{" "}
            <span className="font-semibold text-slate-800">{startItem}–{endItem}</span>{" "}
            of{" "}
            <span className="font-semibold text-slate-800">{donors.totalCount}</span> donors
          </p>
          <p className="text-xs text-slate-400">
            Page <span className="font-semibold text-slate-600">{donors.pageNumber}</span> / <span className="font-semibold text-slate-600">{donors.totalPages}</span>
          </p>
        </div>

        {/* Mobile cards */}
        {items.length ? (
          <>
            <div className="grid gap-3 p-4 lg:hidden">
              {items.map((item) => (
                <div key={item.id} className="space-y-2">
                  <MobileDonorCard donor={item} />
                  <div className="rounded-xl border border-slate-200 bg-white p-3 shadow-sm">
                    <DonorRowActions donor={item} returnPath={currentListHref} />
                  </div>
                </div>
              ))}
            </div>

            {/* Desktop table */}
            <div className="hidden lg:block">
              <table className="min-w-full text-left text-sm">
                <thead>
                  <tr className="border-b border-slate-100 bg-slate-50/60">
                    <th className="px-5 py-3 text-[11px] font-bold uppercase tracking-widest text-slate-400">Donor</th>
                    <th className="px-5 py-3 text-[11px] font-bold uppercase tracking-widest text-slate-400">Contact</th>
                    <th className="px-5 py-3 text-[11px] font-bold uppercase tracking-widest text-slate-400">Type</th>
                    <th className="px-5 py-3 text-[11px] font-bold uppercase tracking-widest text-slate-400">Status</th>
                    <th className="px-5 py-3 text-[11px] font-bold uppercase tracking-widest text-slate-400">Joined</th>
                    <th className="px-5 py-3 text-[11px] font-bold uppercase tracking-widest text-slate-400">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {items.map((item, index) => (
                    <tr
                      key={item.id}
                      className={`group transition-colors hover:bg-cyan-50/40 ${index % 2 === 0 ? "bg-white" : "bg-slate-50/30"}`}
                    >
                      <td className="px-5 py-3.5">
                        <DonorIdentity donor={item} compact />
                      </td>
                      <td className="px-5 py-3.5">
                        <p className="text-sm font-medium text-slate-800">{item.mobile}</p>
                        <p className="mt-0.5 max-w-50 truncate text-xs text-slate-400">{item.address || "—"}</p>
                      </td>
                      <td className="px-5 py-3.5">
                        {item.donorType ? (
                          <span className="rounded-lg bg-cyan-50 px-2.5 py-1 text-xs font-semibold text-cyan-700 ring-1 ring-cyan-200">
                            {item.donorType}
                          </span>
                        ) : (
                          <span className="text-xs text-slate-400">—</span>
                        )}
                        {item.frequency ? (
                          <p className="mt-1 text-[11px] text-slate-400">{item.frequency}</p>
                        ) : null}
                      </td>
                      <td className="px-5 py-3.5">
                        <div className="flex flex-col gap-1.5">
                          <StatusBadge approved={item.isApprove} />
                          <VisibilityBadge isPublic={item.isPublic} />
                        </div>
                      </td>
                      <td className="px-5 py-3.5">
                        <p className="text-sm font-medium text-slate-700">{formatDate(item.createdAt)}</p>
                        <p className="mt-0.5 text-[11px] text-slate-400">ID #{item.id}</p>
                      </td>
                      <td className="px-5 py-3.5">
                        <DonorRowActions donor={item} returnPath={currentListHref} />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        ) : (
          <EmptyState hasFilters={hasFilters} />
        )}

        {/* Pagination */}
        {items.length ? (
          <div className="flex flex-col gap-3 border-t border-slate-100 px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-xs text-slate-400">
              Showing <span className="font-semibold text-slate-700">{startItem}–{endItem}</span> of <span className="font-semibold text-slate-700">{donors.totalCount}</span>
            </p>
            <div className="flex flex-wrap items-center gap-1.5">
              <Link
                href={buildDonorListHref(filters, { page: Math.max(1, donors.pageNumber - 1) })}
                aria-disabled={!donors.hasPreviousPage}
                className={`inline-flex h-9 items-center gap-1.5 rounded-xl px-3 text-sm font-semibold transition ${
                  donors.hasPreviousPage
                    ? "border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 hover:border-slate-300"
                    : "cursor-not-allowed border border-slate-100 bg-slate-50 text-slate-300"
                }`}
              >
                <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                  <path d="m15 18-6-6 6-6" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                Prev
              </Link>

              {paginationItems.map((item) => {
                if (typeof item !== "number") {
                  return (
                    <span key={item} className="flex h-9 w-6 items-center justify-center text-sm font-semibold text-slate-400">
                      ···
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
                    className={`inline-flex h-9 min-w-9 items-center justify-center rounded-xl px-2.5 text-sm font-semibold transition ${
                      isActive
                        ? "bg-cyan-600 text-white shadow-sm shadow-cyan-200"
                        : "border border-slate-200 bg-white text-slate-700 hover:bg-slate-50"
                    }`}
                  >
                    {item}
                  </Link>
                );
              })}

              <Link
                href={buildDonorListHref(filters, { page: Math.min(donors.totalPages, donors.pageNumber + 1) })}
                aria-disabled={!donors.hasNextPage}
                className={`inline-flex h-9 items-center gap-1.5 rounded-xl px-3 text-sm font-semibold transition ${
                  donors.hasNextPage
                    ? "border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 hover:border-slate-300"
                    : "cursor-not-allowed border border-slate-100 bg-slate-50 text-slate-300"
                }`}
              >
                Next
                <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                  <path d="m9 18 6-6-6-6" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </Link>
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
}
