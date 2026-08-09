import Link from "next/link";
import { LOCAL_GOVERNMENT_TYPE_LABELS } from "@/lib/api/admin-location-service";
import {
  deleteDivisionAction,
  toggleDivisionActiveAction,
  deleteDistrictAction,
  toggleDistrictActiveAction,
  deleteUpazilaAction,
  toggleUpazilaActiveAction,
  deleteLocalGovernmentAction,
  toggleLocalGovernmentActiveAction,
  deleteWardAction,
  toggleWardActiveAction,
} from "@/app/admin/location-page/actions";
import { LocationDeleteButton } from "@/components/admin/location_Component/location-delete-button";
import { LocationActiveToggle } from "@/components/admin/location_Component/location-active-toggle";

const PAGE_SIZE_OPTIONS = [10, 20, 50, 100];

function buildHref(tab, overrides, base = {}) {
  const params = new URLSearchParams();
  params.set("tab", tab);
  const merged = { search: "", page: 1, pageSize: 10, ...base, ...overrides };
  if (merged.search) params.set("search", merged.search);
  if (merged.divisionId) params.set("divisionId", String(merged.divisionId));
  if (merged.districtId) params.set("districtId", String(merged.districtId));
  if (merged.upazilaId) params.set("upazilaId", String(merged.upazilaId));
  if (merged.localGovernmentId) params.set("localGovernmentId", String(merged.localGovernmentId));
  params.set("page", String(merged.page));
  params.set("pageSize", String(merged.pageSize));
  return `/admin/location-page?${params.toString()}`;
}

function getPaginationItems(current, total) {
  if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1);
  const items = [1];
  if (current > 3) items.push("…");
  for (let p = Math.max(2, current - 1); p <= Math.min(total - 1, current + 1); p++) items.push(p);
  if (current < total - 2) items.push("…");
  items.push(total);
  return items;
}

function EmptyState({ hasSearch, label }) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 py-20 text-center">
      <div className="flex h-16 w-16 items-center justify-center rounded-3xl bg-slate-100">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="h-8 w-8 text-slate-400">
          <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1 1 15 0Z" />
          <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
        </svg>
      </div>
      <p className="text-base font-bold text-slate-700">No {label} found</p>
      <p className="text-sm text-slate-400">
        {hasSearch ? "Try a different search term." : `Add your first ${label.toLowerCase()} using the button above.`}
      </p>
    </div>
  );
}

function Pagination({ tab, filters, page, totalPages, hasPrev, hasNext }) {
  const items = getPaginationItems(page, totalPages);
  return (
    <div className="flex flex-col gap-4 border-t border-slate-100 px-6 py-5 sm:flex-row sm:items-center sm:justify-between">
      <p className="text-sm text-slate-500">
        Page <span className="font-semibold text-slate-800">{page}</span> of{" "}
        <span className="font-semibold text-slate-800">{totalPages}</span>
      </p>
      <div className="flex flex-wrap items-center gap-1.5">
        <Link
          href={buildHref(tab, { page: Math.max(1, page - 1) }, filters)}
          aria-disabled={!hasPrev}
          className={`inline-flex h-9 items-center gap-1 rounded-xl px-3 text-sm font-semibold transition ${hasPrev ? "border border-slate-200 bg-white text-slate-700 hover:bg-slate-50" : "cursor-not-allowed border border-slate-100 bg-slate-50 text-slate-300"}`}
        >
          ← Prev
        </Link>
        {items.map((item, i) =>
          typeof item !== "number" ? (
            <span key={`e${i}`} className="px-1 text-sm text-slate-400">…</span>
          ) : (
            <Link
              key={item}
              href={buildHref(tab, { page: item }, filters)}
              aria-current={item === page ? "page" : undefined}
              className={`inline-flex h-9 min-w-9 items-center justify-center rounded-xl px-2.5 text-sm font-semibold transition ${item === page ? "border border-cyan-200 bg-white text-cyan-800 shadow-sm ring-2 ring-cyan-100" : "border border-slate-200 bg-white text-slate-700 hover:bg-slate-50"}`}
            >
              {item}
            </Link>
          )
        )}
        <Link
          href={buildHref(tab, { page: Math.min(totalPages, page + 1) }, filters)}
          aria-disabled={!hasNext}
          className={`inline-flex h-9 items-center gap-1 rounded-xl px-3 text-sm font-semibold transition ${hasNext ? "border border-slate-200 bg-white text-slate-700 hover:bg-slate-50" : "cursor-not-allowed border border-slate-100 bg-slate-50 text-slate-300"}`}
        >
          Next →
        </Link>
      </div>
    </div>
  );
}

function ActiveBadge({ isActive }) {
  return (
    <span
      className={`rounded-full border px-2.5 py-0.5 text-xs font-semibold ${
        isActive
          ? "border-emerald-200 bg-emerald-50 text-emerald-700"
          : "border-slate-200 bg-slate-100 text-slate-500"
      }`}
    >
      {isActive ? "Active" : "Inactive"}
    </span>
  );
}

// ── Division table ─────────────────────────────────────────────────────────────

export function DivisionTable({ data, filters, createFormNode }) {
  const { items = [], totalCount = 0, pageNumber = 1, totalPages = 1, hasNextPage, hasPreviousPage } = data;
  const start = totalCount === 0 ? 0 : (pageNumber - 1) * filters.pageSize + 1;
  const end = Math.min(pageNumber * filters.pageSize, totalCount);

  return (
    <div className="space-y-0">
      {/* Toolbar */}
      <div className="border-b border-slate-100 bg-slate-50/60 px-6 py-4">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <form method="get" className="flex flex-1 items-end gap-2">
            <input type="hidden" name="tab" value="divisions" />
            <input type="hidden" name="page" value="1" />
            <div className="flex-1">
              <label className="mb-1.5 block text-xs font-semibold text-slate-500">Search</label>
              <div className="relative">
                <svg viewBox="0 0 20 20" fill="currentColor" className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400">
                  <path fillRule="evenodd" d="M9 3.5a5.5 5.5 0 1 0 0 11 5.5 5.5 0 0 0 0-11ZM2 9a7 7 0 1 1 12.452 4.391l3.328 3.329a.75.75 0 1 1-1.06 1.06l-3.329-3.328A7 7 0 0 1 2 9Z" clipRule="evenodd" />
                </svg>
                <input
                  type="search"
                  name="search"
                  defaultValue={filters.search}
                  placeholder="Search divisions…"
                  className="h-10 w-full rounded-xl border border-slate-200 bg-white pl-9 pr-3 text-sm text-slate-900 placeholder-slate-400 outline-none focus:border-cyan-400 focus:ring-2 focus:ring-cyan-100"
                />
              </div>
            </div>
            <div>
              <label className="mb-1.5 block text-xs font-semibold text-slate-500">Per page</label>
              <select name="pageSize" defaultValue={filters.pageSize} className="h-10 rounded-xl border border-slate-200 bg-white px-3 text-sm text-slate-900 outline-none focus:border-cyan-400">
                {PAGE_SIZE_OPTIONS.map((s) => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
            <button type="submit" className="h-10 rounded-xl bg-cyan-700 px-4 text-sm font-semibold text-white hover:bg-cyan-800">Search</button>
            <Link href="/admin/location-page?tab=divisions" className="flex h-10 items-center rounded-xl border border-slate-200 bg-white px-4 text-sm font-semibold text-slate-600 hover:bg-slate-50">Reset</Link>
          </form>
          {createFormNode}
        </div>
      </div>

      {/* Count row */}
      <div className="flex items-center justify-between border-b border-slate-100 bg-white px-6 py-3 text-xs text-slate-500">
        <span>Showing <strong className="text-slate-800">{start}–{end}</strong> of <strong className="text-slate-800">{totalCount}</strong> divisions</span>
      </div>

      {/* Table */}
      {items.length ? (
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-slate-100 text-sm">
            <thead className="bg-slate-50 text-xs font-semibold uppercase tracking-wide text-slate-500">
              <tr>
                <th className="w-12 px-4 py-3">#</th>
                <th className="px-4 py-3 text-left">English</th>
                <th className="px-4 py-3 text-left">বাংলা</th>
                <th className="px-4 py-3 text-left">Dansk</th>
                <th className="px-4 py-3 text-left">Status</th>
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 bg-white">
              {items.map((item, idx) => (
                <tr key={item.id} className="transition hover:bg-cyan-50/40">
                  <td className="px-4 py-3 text-center">
                    <span className="inline-flex h-7 w-7 items-center justify-center rounded-lg bg-slate-100 text-xs font-bold text-slate-600">
                      {start + idx}
                    </span>
                  </td>
                  <td className="px-4 py-3 font-semibold text-slate-900">{item.nameEn}</td>
                  <td className="px-4 py-3 text-slate-600">{item.nameBn || "—"}</td>
                  <td className="px-4 py-3 text-slate-500">{item.nameDk || "—"}</td>
                  <td className="px-4 py-3"><ActiveBadge isActive={item.isActive} /></td>
                  <td className="px-4 py-3 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <LocationActiveToggle
                        id={item.id}
                        name={item.nameEn}
                        isActive={item.isActive}
                        action={toggleDivisionActiveAction}
                      />
                      <Link
                        href={`/admin/location-page?tab=divisions&edit=${item.id}`}
                        className="inline-flex h-8 items-center gap-1.5 rounded-lg border border-cyan-200 bg-cyan-50 px-3 text-xs font-semibold text-cyan-700 transition hover:bg-cyan-100"
                      >
                        Edit
                      </Link>
                      <LocationDeleteButton id={item.id} name={item.nameEn} action={deleteDivisionAction} />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <EmptyState hasSearch={Boolean(filters.search)} label="Divisions" />
      )}

      <Pagination tab="divisions" filters={filters} page={pageNumber} totalPages={totalPages} hasPrev={hasPreviousPage} hasNext={hasNextPage} />
    </div>
  );
}

// ── District table ─────────────────────────────────────────────────────────────

export function DistrictTable({ data, filters, divisions, createFormNode }) {
  const { items = [], totalCount = 0, pageNumber = 1, totalPages = 1, hasNextPage, hasPreviousPage } = data;
  const start = totalCount === 0 ? 0 : (pageNumber - 1) * filters.pageSize + 1;
  const end = Math.min(pageNumber * filters.pageSize, totalCount);

  return (
    <div className="space-y-0">
      <div className="border-b border-slate-100 bg-slate-50/60 px-6 py-4">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <form method="get" className="flex flex-1 flex-wrap items-end gap-2">
            <input type="hidden" name="tab" value="districts" />
            <input type="hidden" name="page" value="1" />
            <div className="flex-1 min-w-[160px]">
              <label className="mb-1.5 block text-xs font-semibold text-slate-500">Search</label>
              <div className="relative">
                <svg viewBox="0 0 20 20" fill="currentColor" className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400">
                  <path fillRule="evenodd" d="M9 3.5a5.5 5.5 0 1 0 0 11 5.5 5.5 0 0 0 0-11ZM2 9a7 7 0 1 1 12.452 4.391l3.328 3.329a.75.75 0 1 1-1.06 1.06l-3.329-3.328A7 7 0 0 1 2 9Z" clipRule="evenodd" />
                </svg>
                <input type="search" name="search" defaultValue={filters.search} placeholder="Search districts…" className="h-10 w-full rounded-xl border border-slate-200 bg-white pl-9 pr-3 text-sm placeholder-slate-400 outline-none focus:border-cyan-400 focus:ring-2 focus:ring-cyan-100" />
              </div>
            </div>
            <div>
              <label className="mb-1.5 block text-xs font-semibold text-slate-500">Division</label>
              <select name="divisionId" defaultValue={filters.divisionId ?? ""} className="h-10 rounded-xl border border-slate-200 bg-white px-3 text-sm outline-none focus:border-cyan-400">
                <option value="">All</option>
                {divisions.map((d) => <option key={d.id} value={d.id}>{d.nameEn}</option>)}
              </select>
            </div>
            <div>
              <label className="mb-1.5 block text-xs font-semibold text-slate-500">Per page</label>
              <select name="pageSize" defaultValue={filters.pageSize} className="h-10 rounded-xl border border-slate-200 bg-white px-3 text-sm outline-none focus:border-cyan-400">
                {PAGE_SIZE_OPTIONS.map((s) => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
            <button type="submit" className="h-10 rounded-xl bg-cyan-700 px-4 text-sm font-semibold text-white hover:bg-cyan-800">Search</button>
            <Link href="/admin/location-page?tab=districts" className="flex h-10 items-center rounded-xl border border-slate-200 bg-white px-4 text-sm font-semibold text-slate-600 hover:bg-slate-50">Reset</Link>
          </form>
          {createFormNode}
        </div>
      </div>

      <div className="flex items-center justify-between border-b border-slate-100 bg-white px-6 py-3 text-xs text-slate-500">
        <span>Showing <strong className="text-slate-800">{start}–{end}</strong> of <strong className="text-slate-800">{totalCount}</strong> districts</span>
      </div>

      {items.length ? (
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-slate-100 text-sm">
            <thead className="bg-slate-50 text-xs font-semibold uppercase tracking-wide text-slate-500">
              <tr>
                <th className="w-12 px-4 py-3">#</th>
                <th className="px-4 py-3 text-left">English</th>
                <th className="px-4 py-3 text-left">বাংলা</th>
                <th className="px-4 py-3 text-left">Dansk</th>
                <th className="px-4 py-3 text-left">Division</th>
                <th className="px-4 py-3 text-left">Status</th>
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 bg-white">
              {items.map((item, idx) => {
                const div = divisions.find((d) => d.id === item.divisionId);
                return (
                  <tr key={item.id} className="transition hover:bg-violet-50/30">
                    <td className="px-4 py-3 text-center">
                      <span className="inline-flex h-7 w-7 items-center justify-center rounded-lg bg-slate-100 text-xs font-bold text-slate-600">{start + idx}</span>
                    </td>
                    <td className="px-4 py-3 font-semibold text-slate-900">{item.nameEn}</td>
                    <td className="px-4 py-3 text-slate-600">{item.nameBn || "—"}</td>
                    <td className="px-4 py-3 text-slate-500">{item.nameDk || "—"}</td>
                    <td className="px-4 py-3">
                      <span className="rounded-full border border-violet-200 bg-violet-50 px-2.5 py-0.5 text-xs font-semibold text-violet-700">
                        {div?.nameEn ?? "—"}
                      </span>
                    </td>
                    <td className="px-4 py-3"><ActiveBadge isActive={item.isActive} /></td>
                    <td className="px-4 py-3 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <LocationActiveToggle
                          id={item.id}
                          name={item.nameEn}
                          isActive={item.isActive}
                          action={toggleDistrictActiveAction}
                        />
                        <Link href={`/admin/location-page?tab=districts&edit=${item.id}`} className="inline-flex h-8 items-center gap-1.5 rounded-lg border border-cyan-200 bg-cyan-50 px-3 text-xs font-semibold text-cyan-700 transition hover:bg-cyan-100">Edit</Link>
                        <LocationDeleteButton id={item.id} name={item.nameEn} action={deleteDistrictAction} />
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      ) : (
        <EmptyState hasSearch={Boolean(filters.search)} label="Districts" />
      )}

      <Pagination tab="districts" filters={filters} page={pageNumber} totalPages={totalPages} hasPrev={hasPreviousPage} hasNext={hasNextPage} />
    </div>
  );
}

// ── Upazila table ──────────────────────────────────────────────────────────────

export function UpazilaTable({ data, filters, districts, createFormNode }) {
  const { items = [], totalCount = 0, pageNumber = 1, totalPages = 1, hasNextPage, hasPreviousPage } = data;
  const start = totalCount === 0 ? 0 : (pageNumber - 1) * filters.pageSize + 1;
  const end = Math.min(pageNumber * filters.pageSize, totalCount);

  return (
    <div className="space-y-0">
      <div className="border-b border-slate-100 bg-slate-50/60 px-6 py-4">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <form method="get" className="flex flex-1 flex-wrap items-end gap-2">
            <input type="hidden" name="tab" value="upazilas" />
            <input type="hidden" name="page" value="1" />
            <div className="flex-1 min-w-[160px]">
              <label className="mb-1.5 block text-xs font-semibold text-slate-500">Search</label>
              <div className="relative">
                <svg viewBox="0 0 20 20" fill="currentColor" className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400">
                  <path fillRule="evenodd" d="M9 3.5a5.5 5.5 0 1 0 0 11 5.5 5.5 0 0 0 0-11ZM2 9a7 7 0 1 1 12.452 4.391l3.328 3.329a.75.75 0 1 1-1.06 1.06l-3.329-3.328A7 7 0 0 1 2 9Z" clipRule="evenodd" />
                </svg>
                <input type="search" name="search" defaultValue={filters.search} placeholder="Search upazilas…" className="h-10 w-full rounded-xl border border-slate-200 bg-white pl-9 pr-3 text-sm placeholder-slate-400 outline-none focus:border-cyan-400 focus:ring-2 focus:ring-cyan-100" />
              </div>
            </div>
            <div>
              <label className="mb-1.5 block text-xs font-semibold text-slate-500">District</label>
              <select name="districtId" defaultValue={filters.districtId ?? ""} className="h-10 rounded-xl border border-slate-200 bg-white px-3 text-sm outline-none focus:border-cyan-400">
                <option value="">All</option>
                {districts.map((d) => <option key={d.id} value={d.id}>{d.nameEn}</option>)}
              </select>
            </div>
            <div>
              <label className="mb-1.5 block text-xs font-semibold text-slate-500">Per page</label>
              <select name="pageSize" defaultValue={filters.pageSize} className="h-10 rounded-xl border border-slate-200 bg-white px-3 text-sm outline-none focus:border-cyan-400">
                {PAGE_SIZE_OPTIONS.map((s) => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
            <button type="submit" className="h-10 rounded-xl bg-cyan-700 px-4 text-sm font-semibold text-white hover:bg-cyan-800">Search</button>
            <Link href="/admin/location-page?tab=upazilas" className="flex h-10 items-center rounded-xl border border-slate-200 bg-white px-4 text-sm font-semibold text-slate-600 hover:bg-slate-50">Reset</Link>
          </form>
          {createFormNode}
        </div>
      </div>

      <div className="flex items-center justify-between border-b border-slate-100 bg-white px-6 py-3 text-xs text-slate-500">
        <span>Showing <strong className="text-slate-800">{start}–{end}</strong> of <strong className="text-slate-800">{totalCount}</strong> upazilas</span>
      </div>

      {items.length ? (
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-slate-100 text-sm">
            <thead className="bg-slate-50 text-xs font-semibold uppercase tracking-wide text-slate-500">
              <tr>
                <th className="w-12 px-4 py-3">#</th>
                <th className="px-4 py-3 text-left">English</th>
                <th className="px-4 py-3 text-left">বাংলা</th>
                <th className="px-4 py-3 text-left">Dansk</th>
                <th className="px-4 py-3 text-left">District</th>
                <th className="px-4 py-3 text-left">Status</th>
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 bg-white">
              {items.map((item, idx) => {
                const dist = districts.find((d) => d.id === item.districtId);
                return (
                  <tr key={item.id} className="transition hover:bg-emerald-50/30">
                    <td className="px-4 py-3 text-center">
                      <span className="inline-flex h-7 w-7 items-center justify-center rounded-lg bg-slate-100 text-xs font-bold text-slate-600">{start + idx}</span>
                    </td>
                    <td className="px-4 py-3 font-semibold text-slate-900">{item.nameEn}</td>
                    <td className="px-4 py-3 text-slate-600">{item.nameBn || "—"}</td>
                    <td className="px-4 py-3 text-slate-500">{item.nameDk || "—"}</td>
                    <td className="px-4 py-3">
                      <span className="rounded-full border border-emerald-200 bg-emerald-50 px-2.5 py-0.5 text-xs font-semibold text-emerald-700">
                        {dist?.nameEn ?? "—"}
                      </span>
                    </td>
                    <td className="px-4 py-3"><ActiveBadge isActive={item.isActive} /></td>
                    <td className="px-4 py-3 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <LocationActiveToggle
                          id={item.id}
                          name={item.nameEn}
                          isActive={item.isActive}
                          action={toggleUpazilaActiveAction}
                        />
                        <Link href={`/admin/location-page?tab=upazilas&edit=${item.id}`} className="inline-flex h-8 items-center gap-1.5 rounded-lg border border-cyan-200 bg-cyan-50 px-3 text-xs font-semibold text-cyan-700 transition hover:bg-cyan-100">Edit</Link>
                        <LocationDeleteButton id={item.id} name={item.nameEn} action={deleteUpazilaAction} />
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      ) : (
        <EmptyState hasSearch={Boolean(filters.search)} label="Upazilas" />
      )}

      <Pagination tab="upazilas" filters={filters} page={pageNumber} totalPages={totalPages} hasPrev={hasPreviousPage} hasNext={hasNextPage} />
    </div>
  );
}

// ── Union Parishad / Pourashava table ──────────────────────────────────────────

export function LocalGovernmentTable({ data, filters, upazilas, createFormNode }) {
  const { items = [], totalCount = 0, pageNumber = 1, totalPages = 1, hasNextPage, hasPreviousPage } = data;
  const start = totalCount === 0 ? 0 : (pageNumber - 1) * filters.pageSize + 1;
  const end = Math.min(pageNumber * filters.pageSize, totalCount);

  return (
    <div className="space-y-0">
      <div className="border-b border-slate-100 bg-slate-50/60 px-6 py-4">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <form method="get" className="flex flex-1 flex-wrap items-end gap-2">
            <input type="hidden" name="tab" value="local-governments" />
            <input type="hidden" name="page" value="1" />
            <div className="flex-1 min-w-[160px]">
              <label className="mb-1.5 block text-xs font-semibold text-slate-500">Search</label>
              <div className="relative">
                <svg viewBox="0 0 20 20" fill="currentColor" className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400">
                  <path fillRule="evenodd" d="M9 3.5a5.5 5.5 0 1 0 0 11 5.5 5.5 0 0 0 0-11ZM2 9a7 7 0 1 1 12.452 4.391l3.328 3.329a.75.75 0 1 1-1.06 1.06l-3.329-3.328A7 7 0 0 1 2 9Z" clipRule="evenodd" />
                </svg>
                <input type="search" name="search" defaultValue={filters.search} placeholder="Search union parishads / pourashavas…" className="h-10 w-full rounded-xl border border-slate-200 bg-white pl-9 pr-3 text-sm placeholder-slate-400 outline-none focus:border-cyan-400 focus:ring-2 focus:ring-cyan-100" />
              </div>
            </div>
            <div>
              <label className="mb-1.5 block text-xs font-semibold text-slate-500">Upazila</label>
              <select name="upazilaId" defaultValue={filters.upazilaId ?? ""} className="h-10 rounded-xl border border-slate-200 bg-white px-3 text-sm outline-none focus:border-cyan-400">
                <option value="">All</option>
                {upazilas.map((u) => <option key={u.id} value={u.id}>{u.nameEn}</option>)}
              </select>
            </div>
            <div>
              <label className="mb-1.5 block text-xs font-semibold text-slate-500">Per page</label>
              <select name="pageSize" defaultValue={filters.pageSize} className="h-10 rounded-xl border border-slate-200 bg-white px-3 text-sm outline-none focus:border-cyan-400">
                {PAGE_SIZE_OPTIONS.map((s) => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
            <button type="submit" className="h-10 rounded-xl bg-cyan-700 px-4 text-sm font-semibold text-white hover:bg-cyan-800">Search</button>
            <Link href="/admin/location-page?tab=local-governments" className="flex h-10 items-center rounded-xl border border-slate-200 bg-white px-4 text-sm font-semibold text-slate-600 hover:bg-slate-50">Reset</Link>
          </form>
          {createFormNode}
        </div>
      </div>

      <div className="flex items-center justify-between border-b border-slate-100 bg-white px-6 py-3 text-xs text-slate-500">
        <span>Showing <strong className="text-slate-800">{start}–{end}</strong> of <strong className="text-slate-800">{totalCount}</strong> union parishads / pourashavas</span>
      </div>

      {items.length ? (
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-slate-100 text-sm">
            <thead className="bg-slate-50 text-xs font-semibold uppercase tracking-wide text-slate-500">
              <tr>
                <th className="w-12 px-4 py-3">#</th>
                <th className="px-4 py-3 text-left">English</th>
                <th className="px-4 py-3 text-left">বাংলা</th>
                <th className="px-4 py-3 text-left">Dansk</th>
                <th className="px-4 py-3 text-left">Type</th>
                <th className="px-4 py-3 text-left">Upazila</th>
                <th className="px-4 py-3 text-left">Status</th>
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 bg-white">
              {items.map((item, idx) => {
                const upazila = upazilas.find((u) => u.id === item.upazilaId);
                return (
                  <tr key={item.id} className="transition hover:bg-amber-50/30">
                    <td className="px-4 py-3 text-center">
                      <span className="inline-flex h-7 w-7 items-center justify-center rounded-lg bg-slate-100 text-xs font-bold text-slate-600">{start + idx}</span>
                    </td>
                    <td className="px-4 py-3 font-semibold text-slate-900">{item.nameEn}</td>
                    <td className="px-4 py-3 text-slate-600">{item.nameBn || "—"}</td>
                    <td className="px-4 py-3 text-slate-500">{item.nameDk || "—"}</td>
                    <td className="px-4 py-3">
                      <span className="rounded-full border border-amber-200 bg-amber-50 px-2.5 py-0.5 text-xs font-semibold text-amber-700">
                        {LOCAL_GOVERNMENT_TYPE_LABELS[item.type] ?? item.type ?? "—"}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-slate-600">{upazila?.nameEn ?? "—"}</td>
                    <td className="px-4 py-3"><ActiveBadge isActive={item.isActive} /></td>
                    <td className="px-4 py-3 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <LocationActiveToggle
                          id={item.id}
                          name={item.nameEn}
                          isActive={item.isActive}
                          action={toggleLocalGovernmentActiveAction}
                        />
                        <Link href={`/admin/location-page?tab=wards&localGovernmentId=${item.id}`} className="inline-flex h-8 items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 text-xs font-semibold text-slate-600 transition hover:bg-slate-50">Wards</Link>
                        <Link href={`/admin/location-page?tab=local-governments&edit=${item.id}`} className="inline-flex h-8 items-center gap-1.5 rounded-lg border border-cyan-200 bg-cyan-50 px-3 text-xs font-semibold text-cyan-700 transition hover:bg-cyan-100">Edit</Link>
                        <LocationDeleteButton id={item.id} name={item.nameEn} action={deleteLocalGovernmentAction} />
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      ) : (
        <EmptyState hasSearch={Boolean(filters.search)} label="Union Parishads / Pourashavas" />
      )}

      <Pagination tab="local-governments" filters={filters} page={pageNumber} totalPages={totalPages} hasPrev={hasPreviousPage} hasNext={hasNextPage} />
    </div>
  );
}

// ── Ward table ─────────────────────────────────────────────────────────────────

export function WardTable({ data, filters, localGovernments, createFormNode }) {
  const { items = [], totalCount = 0, pageNumber = 1, totalPages = 1, hasNextPage, hasPreviousPage } = data;
  const start = totalCount === 0 ? 0 : (pageNumber - 1) * filters.pageSize + 1;
  const end = Math.min(pageNumber * filters.pageSize, totalCount);

  return (
    <div className="space-y-0">
      <div className="border-b border-slate-100 bg-slate-50/60 px-6 py-4">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <form method="get" className="flex flex-1 flex-wrap items-end gap-2">
            <input type="hidden" name="tab" value="wards" />
            <input type="hidden" name="page" value="1" />
            <div className="flex-1 min-w-[160px]">
              <label className="mb-1.5 block text-xs font-semibold text-slate-500">Search</label>
              <div className="relative">
                <svg viewBox="0 0 20 20" fill="currentColor" className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400">
                  <path fillRule="evenodd" d="M9 3.5a5.5 5.5 0 1 0 0 11 5.5 5.5 0 0 0 0-11ZM2 9a7 7 0 1 1 12.452 4.391l3.328 3.329a.75.75 0 1 1-1.06 1.06l-3.329-3.328A7 7 0 0 1 2 9Z" clipRule="evenodd" />
                </svg>
                <input type="search" name="search" defaultValue={filters.search} placeholder="Search wards…" className="h-10 w-full rounded-xl border border-slate-200 bg-white pl-9 pr-3 text-sm placeholder-slate-400 outline-none focus:border-cyan-400 focus:ring-2 focus:ring-cyan-100" />
              </div>
            </div>
            <div>
              <label className="mb-1.5 block text-xs font-semibold text-slate-500">Union / Pourashava</label>
              <select name="localGovernmentId" defaultValue={filters.localGovernmentId ?? ""} className="h-10 rounded-xl border border-slate-200 bg-white px-3 text-sm outline-none focus:border-cyan-400">
                <option value="">All</option>
                {localGovernments.map((lg) => <option key={lg.id} value={lg.id}>{lg.nameEn}</option>)}
              </select>
            </div>
            <div>
              <label className="mb-1.5 block text-xs font-semibold text-slate-500">Per page</label>
              <select name="pageSize" defaultValue={filters.pageSize} className="h-10 rounded-xl border border-slate-200 bg-white px-3 text-sm outline-none focus:border-cyan-400">
                {PAGE_SIZE_OPTIONS.map((s) => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
            <button type="submit" className="h-10 rounded-xl bg-cyan-700 px-4 text-sm font-semibold text-white hover:bg-cyan-800">Search</button>
            <Link href="/admin/location-page?tab=wards" className="flex h-10 items-center rounded-xl border border-slate-200 bg-white px-4 text-sm font-semibold text-slate-600 hover:bg-slate-50">Reset</Link>
          </form>
          {createFormNode}
        </div>
      </div>

      <div className="flex items-center justify-between border-b border-slate-100 bg-white px-6 py-3 text-xs text-slate-500">
        <span>Showing <strong className="text-slate-800">{start}–{end}</strong> of <strong className="text-slate-800">{totalCount}</strong> wards</span>
      </div>

      {items.length ? (
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-slate-100 text-sm">
            <thead className="bg-slate-50 text-xs font-semibold uppercase tracking-wide text-slate-500">
              <tr>
                <th className="w-12 px-4 py-3">#</th>
                <th className="px-4 py-3 text-left">Ward No.</th>
                <th className="px-4 py-3 text-left">English</th>
                <th className="px-4 py-3 text-left">বাংলা</th>
                <th className="px-4 py-3 text-left">Dansk</th>
                <th className="px-4 py-3 text-left">Union / Pourashava</th>
                <th className="px-4 py-3 text-left">Status</th>
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 bg-white">
              {items.map((item, idx) => {
                const parent = localGovernments.find((lg) => lg.id === item.localGovernmentId);
                return (
                  <tr key={item.id} className="transition hover:bg-sky-50/30">
                    <td className="px-4 py-3 text-center">
                      <span className="inline-flex h-7 w-7 items-center justify-center rounded-lg bg-slate-100 text-xs font-bold text-slate-600">{start + idx}</span>
                    </td>
                    <td className="px-4 py-3">
                      <span className="rounded-full border border-sky-200 bg-sky-50 px-2.5 py-0.5 text-xs font-bold text-sky-700">
                        {item.wardNo}
                      </span>
                    </td>
                    <td className="px-4 py-3 font-semibold text-slate-900">{item.nameEn}</td>
                    <td className="px-4 py-3 text-slate-600">{item.nameBn || "—"}</td>
                    <td className="px-4 py-3 text-slate-500">{item.nameDk || "—"}</td>
                    <td className="px-4 py-3 text-slate-600">{parent?.nameEn ?? "—"}</td>
                    <td className="px-4 py-3"><ActiveBadge isActive={item.isActive} /></td>
                    <td className="px-4 py-3 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <LocationActiveToggle
                          id={item.id}
                          name={`Ward ${item.wardNo}`}
                          isActive={item.isActive}
                          action={toggleWardActiveAction}
                        />
                        <Link href={`/admin/location-page?tab=wards&edit=${item.id}`} className="inline-flex h-8 items-center gap-1.5 rounded-lg border border-cyan-200 bg-cyan-50 px-3 text-xs font-semibold text-cyan-700 transition hover:bg-cyan-100">Edit</Link>
                        <LocationDeleteButton id={item.id} name={`Ward ${item.wardNo}`} action={deleteWardAction} />
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      ) : (
        <EmptyState hasSearch={Boolean(filters.search)} label="Wards" />
      )}

      <Pagination tab="wards" filters={filters} page={pageNumber} totalPages={totalPages} hasPrev={hasPreviousPage} hasNext={hasNextPage} />
    </div>
  );
}
