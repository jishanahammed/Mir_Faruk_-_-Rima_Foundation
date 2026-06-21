import Link from "next/link";
import { getApiErrorMessage } from "@/lib/api/api-error";
import {
  getAdminDivisions,
  getAdminDistricts,
  getAdminUpazilas,
} from "@/lib/api/admin-location-service";
import { DivisionTable, DistrictTable, UpazilaTable } from "@/components/admin/location_Component/location-table";
import { LocationAddModal } from "@/components/admin/location_Component/location-add-modal";
import {
  createDivisionAction, updateDivisionAction,
  createDistrictAction, updateDistrictAction,
  createUpazilaAction, updateUpazilaAction,
} from "@/app/admin/location-page/actions";

export const metadata = {
  title: "Location Management | Admin | Mir Faruk & Rima Foundation",
};

const PAGE_SIZE_DEFAULT = 10;
const TABS = ["divisions", "districts", "upazilas"];

const TAB_CONFIG = {
  divisions: { label: "Divisions", eyebrow: "Level 1", color: "cyan" },
  districts:  { label: "Districts",  eyebrow: "Level 2", color: "violet" },
  upazilas:   { label: "Upazilas / Thanas", eyebrow: "Level 3", color: "emerald" },
};

function readParam(params, key, fallback = "") {
  const v = params?.[key];
  return Array.isArray(v) ? (v[0] ?? fallback) : (v ?? fallback);
}

function paginate(allItems, page, pageSize, search, searchFn) {
  const filtered = search
    ? allItems.filter((it) => searchFn(it, search.toLowerCase()))
    : allItems;
  const totalCount = filtered.length;
  const totalPages = Math.max(1, Math.ceil(totalCount / pageSize));
  const safePage = Math.min(Math.max(1, page), totalPages);
  const items = filtered.slice((safePage - 1) * pageSize, safePage * pageSize);
  return {
    items,
    totalCount,
    totalPages,
    pageNumber: safePage,
    pageSize,
    hasNextPage: safePage < totalPages,
    hasPreviousPage: safePage > 1,
  };
}

export default async function AdminLocationPage({ searchParams }) {
  const params = await searchParams;

  const activeTab = TABS.includes(readParam(params, "tab")) ? readParam(params, "tab") : "divisions";
  const search = readParam(params, "search").trim();
  const page = Math.max(1, Number.parseInt(readParam(params, "page", "1"), 10) || 1);
  const pageSize = [10, 20, 50, 100].includes(Number(readParam(params, "pageSize", "10")))
    ? Number(readParam(params, "pageSize", "10"))
    : PAGE_SIZE_DEFAULT;
  const divisionId = readParam(params, "divisionId") ? Number(readParam(params, "divisionId")) : null;
  const districtId = readParam(params, "districtId") ? Number(readParam(params, "districtId")) : null;

  let allDivisions = [], allDistricts = [], allUpazilas = [];
  let errorMessage = "";

  try {
    [allDivisions, allDistricts, allUpazilas] = await Promise.all([
      getAdminDivisions(),
      getAdminDistricts(),
      getAdminUpazilas(),
    ]);
  } catch (err) {
    errorMessage = getApiErrorMessage(err);
  }

  const filters = { search, page, pageSize, divisionId, districtId };

  const divisionData = paginate(
    allDivisions,
    page, pageSize, search,
    (it, q) => it.nameEn.toLowerCase().includes(q) || it.nameBn.includes(q) || (it.nameDk ?? "").toLowerCase().includes(q),
  );

  const districtPool = divisionId ? allDistricts.filter((d) => d.divisionId === divisionId) : allDistricts;
  const districtData = paginate(
    districtPool,
    page, pageSize, search,
    (it, q) => it.nameEn.toLowerCase().includes(q) || it.nameBn.includes(q) || (it.nameDk ?? "").toLowerCase().includes(q),
  );

  const upazilaPool = districtId ? allUpazilas.filter((u) => u.districtId === districtId) : allUpazilas;
  const upazilaData = paginate(
    upazilaPool,
    page, pageSize, search,
    (it, q) => it.nameEn.toLowerCase().includes(q) || it.nameBn.includes(q) || (it.nameDk ?? "").toLowerCase().includes(q),
  );

  const tabCounts = {
    divisions: allDivisions.length,
    districts: allDistricts.length,
    upazilas: allUpazilas.length,
  };

  const tabColors = {
    divisions: { active: "border-cyan-500 text-cyan-700 bg-cyan-50", dot: "bg-cyan-500", count: "bg-cyan-100 text-cyan-700" },
    districts:  { active: "border-violet-500 text-violet-700 bg-violet-50", dot: "bg-violet-500", count: "bg-violet-100 text-violet-700" },
    upazilas:   { active: "border-emerald-500 text-emerald-700 bg-emerald-50", dot: "bg-emerald-500", count: "bg-emerald-100 text-emerald-700" },
  };

  return (
    <div className="space-y-6">
      {/* Page header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-xs font-bold tracking-widest text-cyan-700 uppercase">Master Data</p>
          <h1 className="mt-1 text-2xl font-extrabold text-slate-900">Location Management</h1>
          <p className="mt-1 text-sm text-slate-500">
            Manage the Division → District → Upazila hierarchy used in registration forms.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <span className="rounded-xl border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-600">
            {allDivisions.length} Div · {allDistricts.length} Dist · {allUpazilas.length} Upa
          </span>
        </div>
      </div>

      {errorMessage && (
        <div className="rounded-2xl border border-red-200 bg-red-50 px-5 py-4 text-sm text-red-700">
          <strong className="block font-semibold">Failed to load location data</strong>
          {errorMessage}
        </div>
      )}

      {/* Main card */}
      <section className="overflow-hidden rounded-[28px] border border-slate-200 bg-white shadow-xl shadow-slate-900/5">
        {/* Gradient header */}
        <div className="border-b border-slate-100 bg-[radial-gradient(circle_at_top_left,rgba(34,211,238,0.15),transparent_40%),linear-gradient(135deg,#f8fafc,#f0fdf9)] px-6 py-5">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-xs font-bold tracking-widest text-cyan-700 uppercase">
                {TAB_CONFIG[activeTab].eyebrow}
              </p>
              <h2 className="mt-0.5 text-xl font-extrabold text-slate-900">
                {TAB_CONFIG[activeTab].label}
              </h2>
            </div>
            {/* Add button → opens modal via URL param */}
            <Link
              href={`/admin/location-page?tab=${activeTab}&add=1`}
              className="inline-flex h-10 items-center gap-2 rounded-2xl bg-[linear-gradient(135deg,#0f766e,#0891b2)] px-5 text-sm font-semibold text-white shadow-lg shadow-cyan-200/60 transition hover:-translate-y-0.5 hover:shadow-xl"
            >
              <svg viewBox="0 0 20 20" fill="currentColor" className="h-4 w-4">
                <path d="M10.75 4.75a.75.75 0 0 0-1.5 0v4.5h-4.5a.75.75 0 0 0 0 1.5h4.5v4.5a.75.75 0 0 0 1.5 0v-4.5h4.5a.75.75 0 0 0 0-1.5h-4.5v-4.5Z" />
              </svg>
              Add {TAB_CONFIG[activeTab].label.split(" ")[0]}
            </Link>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-1 border-b border-slate-200 bg-white px-4 pt-3">
          {TABS.map((tab) => {
            const isActive = tab === activeTab;
            const c = tabColors[tab];
            return (
              <Link
                key={tab}
                href={`/admin/location-page?tab=${tab}`}
                className={`flex items-center gap-2 rounded-t-xl border-b-2 px-4 pb-3 pt-2 text-sm font-semibold transition ${
                  isActive
                    ? `${c.active} border-current`
                    : "border-transparent text-slate-500 hover:text-slate-800"
                }`}
              >
                {isActive && <span className={`h-1.5 w-1.5 rounded-full ${c.dot}`} />}
                {TAB_CONFIG[tab].label}
                <span className={`rounded-full px-2 py-0.5 text-xs font-bold ${isActive ? c.count : "bg-slate-100 text-slate-500"}`}>
                  {tabCounts[tab]}
                </span>
              </Link>
            );
          })}
        </div>

        {/* Tab content */}
        {activeTab === "divisions" && (
          <DivisionTable
            data={divisionData}
            filters={filters}
          />
        )}
        {activeTab === "districts" && (
          <DistrictTable
            data={districtData}
            filters={filters}
            divisions={allDivisions}
          />
        )}
        {activeTab === "upazilas" && (
          <UpazilaTable
            data={upazilaData}
            filters={filters}
            districts={allDistricts}
          />
        )}
      </section>

      {/* Add/Edit modal — rendered server-side via URL param */}
      <LocationAddModal
        tab={activeTab}
        params={params}
        divisions={allDivisions}
        districts={allDistricts}
        allDivisions={allDivisions}
        allDistricts={allDistricts}
        allUpazilas={allUpazilas}
        createDivisionAction={createDivisionAction}
        updateDivisionAction={updateDivisionAction}
        createDistrictAction={createDistrictAction}
        updateDistrictAction={updateDistrictAction}
        createUpazilaAction={createUpazilaAction}
        updateUpazilaAction={updateUpazilaAction}
      />
    </div>
  );
}
