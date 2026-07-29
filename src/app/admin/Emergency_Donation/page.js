import Link from "next/link";
import { getApiErrorMessage } from "@/lib/api/api-error";
import { getAdminEmergencyCampaigns } from "@/lib/api/admin-emergency-campaign-service";
import { getAdminEmergencyCategories } from "@/lib/api/admin-emergency-category-service";
import { EmergencyCampaignTable } from "@/components/admin/Emergency_Donation/emergency-campaign-table";
import { EmergencyCampaignModal } from "@/components/admin/Emergency_Donation/emergency-campaign-modal";
import { EmergencyCampaignViewModal } from "@/components/admin/Emergency_Donation/emergency-campaign-view-modal";
import {
  createEmergencyCampaignAction,
  updateEmergencyCampaignAction,
  updateEmergencyCampaignStatusAction,
  deleteEmergencyCampaignAction,
  uploadEmergencyImagesAction,
  deleteEmergencyImageAction,
} from "@/app/admin/Emergency_Donation/actions";

export const metadata = {
  title: "Emergency Donation | Admin | Mir Faruk & Rima Foundation",
};

const PAGE_SIZES = [10, 20, 50];

function readParam(params, key, fallback = "") {
  const v = params?.[key];
  return Array.isArray(v) ? (v[0] ?? fallback) : (v ?? fallback);
}

function paginate(items, page, pageSize, search) {
  const filtered = search
    ? items.filter((c) =>
        [c.titleEn, c.titleBn, c.slug, c.beneficiaryName, c.referenceNumber]
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

export default async function AdminEmergencyDonationPage({ searchParams }) {
  const params = await searchParams;

  const search = readParam(params, "search").trim();
  const page = Math.max(1, Number.parseInt(readParam(params, "page", "1"), 10) || 1);
  const pageSize = PAGE_SIZES.includes(Number(readParam(params, "pageSize", "10")))
    ? Number(readParam(params, "pageSize", "10"))
    : 10;

  let allCampaigns = [], categories = [], error = null;

  try {
    [allCampaigns, categories] = await Promise.all([
      getAdminEmergencyCampaigns(),
      getAdminEmergencyCategories(),
    ]);
  } catch (err) {
    error = getApiErrorMessage(err);
  }

  const data = paginate(allCampaigns, page, pageSize, search);

  return (
    <div className="flex flex-col gap-6">
      {/* Page Header */}
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-xs font-bold uppercase tracking-widest text-cyan-600">Emergency</p>
          <h1 className="mt-1 text-2xl font-extrabold text-slate-900">Emergency Donation Campaigns</h1>
          <p className="mt-1 text-sm text-slate-500">
            Manage emergency appeals — create, update, verify and track donation progress.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <span className="flex h-8 items-center rounded-full border border-cyan-200 bg-cyan-50 px-3 text-xs font-bold text-cyan-700">
            {allCampaigns.length} campaign{allCampaigns.length !== 1 ? "s" : ""}
          </span>
          <Link
            href="?add=1"
            className="inline-flex items-center gap-2 rounded-xl bg-[linear-gradient(135deg,#0f766e,#0891b2)] px-4 py-2 text-sm font-bold text-white shadow-md shadow-cyan-200/60 hover:opacity-90 transition"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="h-4 w-4">
              <path d="M12 5v14M5 12h14" strokeLinecap="round" />
            </svg>
            Add Campaign
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
        <div className="bg-[linear-gradient(135deg,#0f766e,#0891b2)] px-6 py-4">
          <h2 className="text-sm font-bold text-white">All Campaigns</h2>
          <p className="text-xs text-cyan-100/80">Search, filter, update status or edit any campaign below.</p>
        </div>
        <div className="p-6">
          <EmergencyCampaignTable
            data={data}
            search={search}
            updateStatusAction={updateEmergencyCampaignStatusAction}
            deleteAction={deleteEmergencyCampaignAction}
          />
        </div>
      </section>

      {/* View Modal */}
      <EmergencyCampaignViewModal params={params} allCampaigns={allCampaigns} />

      {/* Add / Edit Modal */}
      <EmergencyCampaignModal
        params={params}
        allCampaigns={allCampaigns}
        categories={categories}
        createAction={createEmergencyCampaignAction}
        updateAction={updateEmergencyCampaignAction}
        uploadAction={uploadEmergencyImagesAction}
        deleteImageAction={deleteEmergencyImageAction}
      />
    </div>
  );
}
