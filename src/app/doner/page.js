import Link from "next/link";
import { getApiErrorMessage } from "@/lib/api/api-error";
import {
  getCurrentDonorProfile,
  getDonorPaymentHistoryList,
} from "@/lib/api/donor-portal-service";
import { getCurrentDonorUser } from "@/lib/donor-session";

export const metadata = {
  title: "Doner Dashboard | Mir Faruk & Rima Foundation",
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

function StatCard({ label, value, helper }) {
  return (
    <div className="rounded-[26px] border border-emerald-100 bg-white p-5 shadow-sm shadow-emerald-950/5">
      <p className="text-xs font-bold uppercase tracking-[0.18em] text-emerald-700">
        {label}
      </p>
      <p className="mt-3 text-1xl font-black tracking-tight text-slate-950">{value}</p>
      <p className="mt-2 text-sm leading-6 text-slate-500">{helper}</p>
    </div>
  );
}

export default async function DonerDashboardPage() {
  const user = await getCurrentDonorUser();
  let donor = null;
  let paymentHistories = null;
  let errorMessage = "";

  try {
    donor = await getCurrentDonorProfile(user);
    paymentHistories = await getDonorPaymentHistoryList(user, {
      page: 1,
      pageSize: 10,
    });
  } catch (error) {
    errorMessage = getApiErrorMessage(error);
  }

  const items = paymentHistories?.items ?? [];
  const totalAmount = items.reduce((total, item) => total + Number(item.amount || 0), 0);
  const lastPayment = items[0] ?? null;

  return (
    <div className="space-y-6">
      <section className="overflow-hidden rounded-[32px] border border-emerald-100 bg-white shadow-xl shadow-emerald-950/5">
        <div className="relative overflow-hidden bg-[radial-gradient(circle_at_top_left,_rgba(16,185,129,0.22),_transparent_36%),linear-gradient(135deg,#ecfdf5,#f8fafc)] p-6 sm:p-8">
          <div className="absolute right-0 top-0 h-40 w-40 rounded-bl-full bg-emerald-100/70" />
          <div className="relative flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <p className="text-xs font-black uppercase tracking-[0.24em] text-emerald-700">
                Doner Dashboard
              </p>
              <h1 className="mt-3 max-w-2xl text-3xl font-black tracking-tight text-slate-950 sm:text-4xl">
                Welcome back, {donor?.fullName || user.name}.
              </h1>
              <p className="mt-3 max-w-2xl text-sm leading-7 text-slate-600">
                Review your donation records, download invoices, and keep your donor
                profile information up to date.
              </p>
            </div>
            <div className="flex flex-wrap gap-3">
              <Link
                href="/doner/payment-history"
                className="inline-flex h-12 items-center justify-center rounded-2xl bg-emerald-800 px-5 text-sm font-bold !text-white shadow-lg shadow-emerald-200 transition hover:bg-emerald-700 hover:!text-white visited:!text-white focus-visible:!text-white active:!text-white"
              >
                View payment history
              </Link>
              <Link
                href="/doner/profile"
                className="inline-flex h-12 items-center justify-center rounded-2xl border border-emerald-200 bg-white px-5 text-sm font-bold text-emerald-800 transition hover:bg-emerald-50"
              >
                Update profile
              </Link>
            </div>
          </div>
        </div>
      </section>

      {errorMessage ? (
        <section className="rounded-[24px] border border-red-200 bg-red-50 px-5 py-4 text-sm leading-6 text-red-700">
          <strong className="block font-semibold">Unable to load donor dashboard</strong>
          {errorMessage}
        </section>
      ) : null}

      <div className="grid gap-4 md:grid-cols-3">
        <StatCard
          label="Total Records"
          value={paymentHistories?.totalCount ?? 0}
          helper="Payment history records connected to your donor profile."
        />
        <StatCard
          label="Recent Page Total"
          value={`${formatAmount(totalAmount)} ${lastPayment?.currency ?? "BDT"}`}
          helper="Total from the latest records currently loaded on the dashboard."
        />
        <StatCard
          label="Last Payment"
          value={formatDate(lastPayment?.paymentDate)}
          helper={lastPayment?.transactionId || "No payment record found yet."}
        />
      </div>

      <section className="rounded-[28px] border border-emerald-100 bg-white p-5 shadow-sm shadow-emerald-950/5">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-emerald-700">
              Profile Snapshot
            </p>
            <h2 className="mt-2 text-xl font-black text-slate-950">
              {donor?.fullName || "Donor profile"}
            </h2>
          </div>
          <span className="inline-flex rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-xs font-bold text-emerald-700">
            {donor?.isApprove ? "Approved donor" : "Pending approval"}
          </span>
        </div>
        <div className="mt-5 grid gap-3 md:grid-cols-3">
          <div className="rounded-2xl border border-slate-100 bg-slate-50 p-4">
            <p className="text-xs font-bold uppercase tracking-[0.14em] text-slate-400">
              Email
            </p>
            <p className="mt-2 break-words text-sm font-bold text-slate-900">
              {donor?.email || user.email}
            </p>
          </div>
          <div className="rounded-2xl border border-slate-100 bg-slate-50 p-4">
            <p className="text-xs font-bold uppercase tracking-[0.14em] text-slate-400">
              Mobile
            </p>
            <p className="mt-2 text-sm font-bold text-slate-900">
              {donor?.mobile || "Not provided"}
            </p>
          </div>
          <div className="rounded-2xl border border-slate-100 bg-slate-50 p-4">
            <p className="text-xs font-bold uppercase tracking-[0.14em] text-slate-400">
              Donor Type
            </p>
            <p className="mt-2 text-sm font-bold text-slate-900">
              {donor?.donorType || "General"}
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
