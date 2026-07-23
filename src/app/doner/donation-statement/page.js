import { getApiErrorMessage } from "@/lib/api/api-error";
import { getAllDonorPaymentHistory } from "@/lib/api/donor-portal-service";
import { getCurrentDonorUser } from "@/lib/donor-session";

export const metadata = {
  title: "Donation Statement | Mir Faruk & Rima Foundation",
};

function formatAmount(amount) {
  const parsed = Number(amount);

  if (!Number.isFinite(parsed)) {
    return "0.00";
  }

  return new Intl.NumberFormat("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(parsed);
}

function isCredited(payment) {
  return (
    String(payment.paymentStatus ?? "").toLowerCase() === "success" &&
    String(payment.adminApprovalStatus ?? "").toLowerCase() === "approved"
  );
}

function isPending(payment) {
  const paymentStatus = String(payment.paymentStatus ?? "").toLowerCase();
  const approvalStatus = String(payment.adminApprovalStatus ?? "").toLowerCase();
  return paymentStatus === "pending" || approvalStatus === "waiting";
}

export default async function DonerDonationStatementPage() {
  const user = await getCurrentDonorUser();

  let items = [];
  let currency = "BDT";
  let errorMessage = "";

  try {
    const result = await getAllDonorPaymentHistory(user);
    items = result.items ?? [];
    currency = items.find((item) => item.currency)?.currency ?? "BDT";
  } catch (error) {
    errorMessage = getApiErrorMessage(error);
  }

  const credited = items.filter(isCredited);
  const pending = items.filter(isPending);
  const totalCredited = credited.reduce((sum, item) => sum + (Number(item.amount) || 0), 0);
  const totalPending = pending.reduce((sum, item) => sum + (Number(item.amount) || 0), 0);

  return (
    <div className="space-y-5">
      <header>
        <p className="text-sm font-bold uppercase tracking-[0.18em] text-emerald-700">
          My Account
        </p>
        <h1 className="mt-2 text-3xl font-black tracking-tight text-slate-950">
          Donation statement
        </h1>
        <p className="mt-2 max-w-2xl text-sm leading-7 text-slate-600">
          Download a professional PDF report of your complete donation history with the
          foundation, ready to save or share.
        </p>
      </header>

      {errorMessage ? (
        <section className="rounded-[24px] border border-red-200 bg-red-50 px-4 py-3 text-sm leading-6 text-red-700 sm:px-5 sm:py-4">
          <strong className="block font-semibold">Unable to load your donation statement</strong>
          {errorMessage}
        </section>
      ) : (
        <section className="overflow-hidden rounded-[28px] border border-emerald-100 bg-white shadow-xl shadow-emerald-950/5">
          <div className="border-b border-emerald-100 bg-[radial-gradient(circle_at_top_left,_rgba(16,185,129,0.18),_transparent_38%),linear-gradient(135deg,#f8fafc,#ecfdf5)] px-6 py-5">
            <p className="text-xs font-black uppercase tracking-[0.2em] text-emerald-700">
              Statement Preview
            </p>
            <p className="mt-2 text-lg font-black text-slate-950">
              {items.length} total transactions on record
            </p>
          </div>

          <div className="grid gap-4 p-6 sm:grid-cols-3">
            <div className="rounded-2xl border border-emerald-100 bg-emerald-50/70 p-4">
              <p className="text-xs font-black uppercase tracking-[0.14em] text-emerald-700">
                Total Credited
              </p>
              <p className="mt-2 text-xl font-black text-emerald-900">
                {formatAmount(totalCredited)} {currency}
              </p>
              <p className="mt-1 text-xs font-semibold text-emerald-700">
                {credited.length} approved transactions
              </p>
            </div>
            <div className="rounded-2xl border border-amber-100 bg-amber-50/70 p-4">
              <p className="text-xs font-black uppercase tracking-[0.14em] text-amber-700">
                Pending Review
              </p>
              <p className="mt-2 text-xl font-black text-amber-900">
                {formatAmount(totalPending)} {currency}
              </p>
              <p className="mt-1 text-xs font-semibold text-amber-700">
                {pending.length} awaiting approval
              </p>
            </div>
            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
              <p className="text-xs font-black uppercase tracking-[0.14em] text-slate-500">
                All-time Transactions
              </p>
              <p className="mt-2 text-xl font-black text-slate-950">{items.length}</p>
              <p className="mt-1 text-xs font-semibold text-slate-500">
                Included in the PDF report
              </p>
            </div>
          </div>

          <div className="flex flex-col gap-4 border-t border-slate-100 px-6 py-5 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-sm text-slate-600">
              The statement includes your donor details, a lifetime summary, and the full
              transaction ledger with dates, methods, amounts, and statuses.
            </p>
            <a
              href="/api/doner/donation-statement"
              target="_blank"
              rel="noreferrer"
              className="inline-flex h-12 shrink-0 items-center justify-center gap-2 rounded-2xl bg-slate-950 px-6 text-sm font-bold !text-white transition hover:bg-emerald-700"
            >
              Download Statement (PDF)
            </a>
          </div>
        </section>
      )}
    </div>
  );
}
