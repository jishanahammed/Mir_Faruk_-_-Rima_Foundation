import { getApiErrorMessage } from "@/lib/api/api-error";
import { getAdminCeoBani } from "@/lib/api/admin-ceo-bani-service";
import { CeoBaniForm } from "@/components/admin/CeoBani/ceo-bani-form";
import {
  updateCeoBaniAction,
  uploadCeoBaniImageAction,
  deleteCeoBaniImageAction,
} from "./actions";

export const metadata = {
  title: "CEO Bani | Admin | Mir Faruk & Rima Foundation",
};

export default async function AdminCeoBaniPage() {
  let ceoBani = null;
  let errorMessage = "";

  try {
    ceoBani = await getAdminCeoBani();
  } catch (err) {
    errorMessage = getApiErrorMessage(err);
  }

  const uploadEnAction = uploadCeoBaniImageAction.bind(null, "en");
  const uploadBnAction = uploadCeoBaniImageAction.bind(null, "bn");
  const uploadDkAction = uploadCeoBaniImageAction.bind(null, "dk");

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-xs font-bold uppercase tracking-widest text-cyan-600">Content</p>
          <h1 className="mt-1 text-2xl font-extrabold text-slate-900">CEO Bani</h1>
          <p className="mt-1 text-sm text-slate-500">
            Manage the CEO&apos;s message and per-language images shown on the public site.
          </p>
        </div>
      </div>

      {errorMessage && (
        <div className="rounded-2xl border border-rose-200 bg-rose-50 px-5 py-4 text-sm font-semibold text-rose-700">
          {errorMessage}
        </div>
      )}

      <section className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm shadow-slate-900/4">
        <div className="bg-[linear-gradient(135deg,#0f766e,#0891b2)] px-6 py-4">
          <h2 className="text-sm font-bold text-white">CEO Message & Images</h2>
          <p className="text-xs text-cyan-100/80">Update the message text and image for each language.</p>
        </div>
        <CeoBaniForm
          ceoBani={ceoBani}
          updateAction={updateCeoBaniAction}
          uploadEnAction={uploadEnAction}
          uploadBnAction={uploadBnAction}
          uploadDkAction={uploadDkAction}
          deleteImageAction={deleteCeoBaniImageAction}
        />
      </section>
    </div>
  );
}
