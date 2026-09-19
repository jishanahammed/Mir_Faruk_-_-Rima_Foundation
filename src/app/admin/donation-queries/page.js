import { getApiErrorMessage } from "@/lib/api/api-error";
import {
  getDonationTransactionQueries,
  getDonationTransactionQuerySummary,
} from "@/lib/api/admin-donation-transaction-query-service";
import { DonationQueryTable } from "@/components/admin/donation_query/donation-query-table";

export const metadata = {
  title: "Donation Queries | Admin | Mir Faruk & Rima Foundation",
};

export default async function AdminDonationQueriesPage() {
  let queries = [], summary = { total: 0, unseen: 0 }, error = null;

  try {
    [queries, summary] = await Promise.all([
      getDonationTransactionQueries(),
      getDonationTransactionQuerySummary(),
    ]);
  } catch (err) {
    error = getApiErrorMessage(err);
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-xs font-bold uppercase tracking-widest text-cyan-600">Donors</p>
          <h1 className="mt-1 text-2xl font-extrabold text-slate-900">Donation Queries</h1>
          <p className="mt-1 text-sm text-slate-500">
            Transaction details donors sent after giving. Open one to review and mark it seen.
          </p>
        </div>
        <div className="flex items-center gap-3">
          {summary.unseen > 0 && (
            <span className="flex h-8 items-center gap-2 rounded-full border border-amber-200 bg-amber-50 px-3 text-xs font-bold text-amber-700">
              <span className="h-2 w-2 animate-pulse rounded-full bg-amber-500" />
              {summary.unseen} unseen
            </span>
          )}
          <span className="flex h-8 items-center rounded-full border border-cyan-200 bg-cyan-50 px-3 text-xs font-bold text-cyan-700">
            {summary.total} total
          </span>
        </div>
      </div>

      {error && (
        <div className="rounded-2xl border border-rose-200 bg-rose-50 px-5 py-4 text-sm font-semibold text-rose-700">
          {error}
        </div>
      )}

      <section className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm shadow-slate-900/4">
        <div className="bg-[linear-gradient(135deg,#0f766e,#0891b2)] px-6 py-4">
          <h2 className="text-sm font-bold text-white">All Queries</h2>
          <p className="text-xs text-cyan-100/80">Unseen submissions are highlighted and listed first.</p>
        </div>
        <div className="p-6">
          <DonationQueryTable items={queries} />
        </div>
      </section>
    </div>
  );
}
