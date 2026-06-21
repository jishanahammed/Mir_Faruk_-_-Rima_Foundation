import Link from "next/link";
import { getApiErrorMessage } from "@/lib/api/api-error";
import { getAdminFoundationProjects } from "@/lib/api/admin-foundation-project-service";
import { getAdminProjectCategories } from "@/lib/api/admin-project-category-service";
import { getAdminDivisions, getAdminDistricts, getAdminUpazilas } from "@/lib/api/admin-location-service";
import { FoundationProjectTable } from "@/components/admin/Foundation_Projects/foundation-project-table";
import { FoundationProjectModal } from "@/components/admin/Foundation_Projects/foundation-project-modal";
import { FoundationProjectViewModal } from "@/components/admin/Foundation_Projects/foundation-project-view-modal";
import {
  createFoundationProjectAction,
  updateFoundationProjectAction,
  updateFoundationProjectStatusAction,
  deleteFoundationProjectAction,
  uploadProjectImagesAction,
  deleteProjectImageAction,
} from "@/app/admin/Foundation_Projects/actions";

export const metadata = {
  title: "Foundation Projects | Admin | Mir Faruk & Rima Foundation",
};

const PAGE_SIZES = [10, 20, 50];

function readParam(params, key, fallback = "") {
  const v = params?.[key];
  return Array.isArray(v) ? (v[0] ?? fallback) : (v ?? fallback);
}

function paginate(items, page, pageSize, search) {
  const filtered = search
    ? items.filter((p) =>
        [p.projectTitleEn, p.projectTitleBn, p.projectCode, p.categoryNameEn]
          .join(" ").toLowerCase().includes(search.toLowerCase())
      )
    : items;
  const totalCount = filtered.length;
  const totalPages = Math.max(1, Math.ceil(totalCount / pageSize));
  const safePage = Math.min(Math.max(1, page), totalPages);
  return {
    items: filtered.slice((safePage - 1) * pageSize, safePage * pageSize),
    totalCount,
    totalPages,
    pageNumber: safePage,
    pageSize,
  };
}

export default async function AdminFoundationProjectsPage({ searchParams }) {
  const params = await searchParams;

  const search = readParam(params, "search").trim();
  const page = Math.max(1, Number.parseInt(readParam(params, "page", "1"), 10) || 1);
  const pageSize = PAGE_SIZES.includes(Number(readParam(params, "pageSize", "10")))
    ? Number(readParam(params, "pageSize", "10"))
    : 10;

  let allProjects = [], categories = [], divisions = [], districts = [], upazilas = [], error = null;

  try {
    [allProjects, categories, divisions, districts, upazilas] = await Promise.all([
      getAdminFoundationProjects(),
      getAdminProjectCategories(),
      getAdminDivisions(),
      getAdminDistricts(),
      getAdminUpazilas(),
    ]);
  } catch (err) {
    error = getApiErrorMessage(err);
  }

  const data = paginate(allProjects, page, pageSize, search);

  return (
    <div className="flex flex-col gap-6">
      {/* Page Header */}
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-xs font-bold uppercase tracking-widest text-cyan-600">Projects</p>
          <h1 className="mt-1 text-2xl font-extrabold text-slate-900">Foundation Projects</h1>
          <p className="mt-1 text-sm text-slate-500">
            Manage all foundation project entries — create, update, track status and budget.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <span className="flex h-8 items-center rounded-full border border-cyan-200 bg-cyan-50 px-3 text-xs font-bold text-cyan-700">
            {allProjects.length} project{allProjects.length !== 1 ? "s" : ""}
          </span>
          <Link
            href="?add=1"
            className="inline-flex items-center gap-2 rounded-xl bg-[linear-gradient(135deg,#0f766e,#0891b2)] px-4 py-2 text-sm font-bold text-white shadow-md shadow-cyan-200/60 hover:opacity-90 transition"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="h-4 w-4">
              <path d="M12 5v14M5 12h14" strokeLinecap="round" />
            </svg>
            Add Project
          </Link>
        </div>
      </div>

      {/* Error banner */}
      {error && (
        <div className="rounded-2xl border border-rose-200 bg-rose-50 px-5 py-4 text-sm font-semibold text-rose-700">
          {error}
        </div>
      )}

      {/* Table card */}
      <section className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm shadow-slate-900/4">
        {/* Card header */}
        <div className="bg-[linear-gradient(135deg,#0f766e,#0891b2)] px-6 py-4">
          <h2 className="text-sm font-bold text-white">All Projects</h2>
          <p className="text-xs text-cyan-100/80">Search, filter, update status or edit any project below.</p>
        </div>
        <div className="p-6">
          <FoundationProjectTable
            data={data}
            search={search}
            updateStatusAction={updateFoundationProjectStatusAction}
            deleteAction={deleteFoundationProjectAction}
          />
        </div>
      </section>

      {/* View Modal */}
      <FoundationProjectViewModal params={params} allProjects={allProjects} />

      {/* Add / Edit Modal */}
      <FoundationProjectModal
        params={params}
        allProjects={allProjects}
        categories={categories}
        divisions={divisions}
        districts={districts}
        upazilas={upazilas}
        createAction={createFoundationProjectAction}
        updateAction={updateFoundationProjectAction}
        uploadAction={uploadProjectImagesAction}
        deleteImageAction={deleteProjectImageAction}
      />
    </div>
  );
}
