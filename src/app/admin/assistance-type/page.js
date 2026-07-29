import Link from "next/link";
import { getApiErrorMessage } from "@/lib/api/api-error";
import { getAdminAssistanceTypes } from "@/lib/api/admin-assistance-type-service";
import { AssistanceTypeTable } from "@/components/admin/assistance_type/assistance-type-table";
import { AssistanceTypeModal } from "@/components/admin/assistance_type/assistance-type-modal";
import {
  createAssistanceTypeAction,
  updateAssistanceTypeAction,
  updateAssistanceTypeStatusAction,
  deleteAssistanceTypeAction,
} from "./actions";

export const metadata = {
  title: "Assistance Types | Admin | Mir Faruk & Rima Foundation",
};

function readParam(params, key, fallback = "") {
  const v = params?.[key];
  return Array.isArray(v) ? (v[0] ?? fallback) : (v ?? fallback);
}

export default async function AdminAssistanceTypePage({ searchParams }) {
  const params = await searchParams;
  const search = readParam(params, "search").trim();
  const page = Math.max(1, Number.parseInt(readParam(params, "page", "1"), 10) || 1);
  const pageSize = [10, 20, 50, 100].includes(Number(readParam(params, "pageSize", "10")))
    ? Number(readParam(params, "pageSize", "10"))
    : 10;

  let allTypes = [];
  let errorMessage = "";

  try {
    allTypes = await getAdminAssistanceTypes();
  } catch (err) {
    errorMessage = getApiErrorMessage(err);
  }

  const filtered = search
    ? allTypes.filter((t) => {
        const q = search.toLowerCase();
        return (
          t.nameEn.toLowerCase().includes(q) ||
          t.nameBn.includes(q) ||
          (t.nameDk ?? "").toLowerCase().includes(q)
        );
      })
    : allTypes;

  const totalCount = filtered.length;
  const totalPages = Math.max(1, Math.ceil(totalCount / pageSize));
  const safePage = Math.min(Math.max(1, page), totalPages);
  const items = filtered.slice((safePage - 1) * pageSize, safePage * pageSize);

  const paginationData = { items, totalCount, totalPages, pageNumber: safePage, pageSize };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-xs font-bold tracking-widest text-cyan-700 uppercase">Projects</p>
          <h1 className="mt-1 text-2xl font-extrabold text-slate-900">Assistance Types</h1>
          <p className="mt-1 text-sm text-slate-500">
            Manage the types of assistance offered under foundation projects.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <span className="rounded-xl border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-600">
            {allTypes.length} total · {allTypes.filter((t) => t.isActive).length} active
          </span>
        </div>
      </div>

      {errorMessage && (
        <div className="rounded-2xl border border-red-200 bg-red-50 px-5 py-4 text-sm text-red-700">
          <strong className="block font-semibold">Failed to load assistance types</strong>
          {errorMessage}
        </div>
      )}

      <section className="overflow-hidden rounded-[28px] border border-slate-200 bg-white shadow-xl shadow-slate-900/5">
        <div className="border-b border-slate-100 bg-[radial-gradient(circle_at_top_left,rgba(34,211,238,0.15),transparent_40%),linear-gradient(135deg,#f8fafc,#f0fdf9)] px-6 py-5">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-xs font-bold tracking-widest text-cyan-700 uppercase">Master Data</p>
              <h2 className="mt-0.5 text-xl font-extrabold text-slate-900">All Assistance Types</h2>
            </div>
            <Link
              href="/admin/assistance-type?add=1"
              className="inline-flex h-10 items-center gap-2 rounded-2xl bg-[linear-gradient(135deg,#0f766e,#0891b2)] px-5 text-sm font-semibold text-white shadow-lg shadow-cyan-200/60 transition hover:-translate-y-0.5 hover:shadow-xl"
            >
              <svg viewBox="0 0 20 20" fill="currentColor" className="h-4 w-4">
                <path d="M10.75 4.75a.75.75 0 0 0-1.5 0v4.5h-4.5a.75.75 0 0 0 0 1.5h4.5v4.5a.75.75 0 0 0 1.5 0v-4.5h4.5a.75.75 0 0 0 0-1.5h-4.5v-4.5Z" />
              </svg>
              Add Assistance Type
            </Link>
          </div>
        </div>

        <AssistanceTypeTable
          data={paginationData}
          search={search}
          updateStatusAction={updateAssistanceTypeStatusAction}
          deleteAction={deleteAssistanceTypeAction}
        />
      </section>

      <AssistanceTypeModal
        params={params}
        allTypes={allTypes}
        createAction={createAssistanceTypeAction}
        updateAction={updateAssistanceTypeAction}
      />
    </div>
  );
}
