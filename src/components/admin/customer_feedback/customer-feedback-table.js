import Link from "next/link";
import { CUSTOMER_FEEDBACK_STATUS_OPTIONS } from "@/lib/api/admin-customer-feedback-service";
import { CustomerFeedbackStatusModal } from "@/components/admin/customer_feedback/customer-feedback-status-modal";
import { CustomerFeedbackDeleteButton } from "@/components/admin/customer_feedback/customer-feedback-delete-button";

function formatDate(value) {
  if (!value) return "Not available";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "Not available";
  return new Intl.DateTimeFormat("en-GB", { day: "2-digit", month: "2-digit", year: "numeric" })
    .format(date)
    .replaceAll("/", "-");
}

function getStatusTone(value) {
  const normalized = String(value ?? "").toLowerCase();
  if (normalized === "published") return "border-emerald-200 bg-emerald-50 text-emerald-700";
  if (normalized === "reviewed") return "border-cyan-200 bg-cyan-50 text-cyan-700";
  if (normalized === "rejected") return "border-red-200 bg-red-50 text-red-700";
  return "border-amber-200 bg-amber-50 text-amber-700";
}

function StatusBadge({ value }) {
  return (
    <span className={`inline-flex rounded-full border px-2.5 py-1 text-[11px] font-bold ${getStatusTone(value)}`}>
      {value || "New"}
    </span>
  );
}

function StarDisplay({ rating }) {
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((star) => (
        <svg
          key={star}
          viewBox="0 0 24 24"
          className={`h-3.5 w-3.5 ${star <= rating ? "fill-amber-400 text-amber-400" : "fill-slate-200 text-slate-200"}`}
        >
          <path d="M12 2.5l2.9 6.06 6.6.72-4.9 4.5 1.28 6.55L12 16.9l-5.88 3.43 1.28-6.55-4.9-4.5 6.6-.72L12 2.5Z" />
        </svg>
      ))}
    </div>
  );
}

function EmptyState() {
  return (
    <div className="mx-auto max-w-md px-6 py-16 text-center">
      <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-3xl bg-cyan-50 text-cyan-700 ring-1 ring-cyan-100">
        <svg className="h-8 w-8" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24" aria-hidden="true">
          <path d="M8 10h8M8 14h5M21 12c0 4.42-4.03 8-9 8-1.06 0-2.07-.16-3-.46L3 21l1.55-4.14A7.9 7.9 0 0 1 3 12c0-4.42 4.03-8 9-8s9 3.58 9 8Z" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </div>
      <h3 className="mt-5 text-lg font-black text-slate-950">No feedback found</h3>
      <p className="mt-2 text-sm leading-6 text-slate-500">Try a different status filter.</p>
    </div>
  );
}

function MobileFeedbackCard({ item }) {
  return (
    <article className="rounded-[24px] border border-slate-200 bg-white p-5 shadow-sm shadow-slate-950/5">
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <h3 className="truncate text-base font-black text-slate-950">{item.fullName}</h3>
          <p className="mt-1 truncate text-xs text-slate-500">{item.email}</p>
        </div>
        <StatusBadge value={item.status} />
      </div>
      <div className="mt-3">
        <StarDisplay rating={item.rating} />
      </div>
      <p className="mt-3 line-clamp-3 text-sm leading-6 text-slate-600">{item.message}</p>
      <div className="mt-4 flex flex-wrap items-center justify-between gap-2 border-t border-slate-100 pt-4">
        <p className="text-xs font-semibold text-slate-500">{formatDate(item.createdAt)}</p>
        <div className="flex items-center gap-2">
          <CustomerFeedbackStatusModal feedback={item} />
          <CustomerFeedbackDeleteButton id={item.id} name={item.fullName} />
        </div>
      </div>
    </article>
  );
}

export function CustomerFeedbackTable({ items, status }) {
  return (
    <section className="overflow-hidden rounded-[30px] border border-cyan-100 bg-white shadow-xl shadow-slate-950/5">
      <div className="border-b border-cyan-100 bg-[radial-gradient(circle_at_top_left,rgba(34,211,238,0.18),transparent_38%),linear-gradient(135deg,#f8fafc,#effcff)] p-6">
        <div className="flex flex-col gap-5">
          <div className="flex flex-col gap-3 xl:flex-row xl:items-end xl:justify-between">
            <div>
              <p className="text-xs font-black uppercase tracking-[0.22em] text-cyan-700">Visitor Voices</p>
              <h1 className="mt-2 text-2xl font-black tracking-tight text-slate-950">Customer Feedback</h1>
              <p className="mt-2 text-sm leading-6 text-slate-600">
                Review feedback submitted through the public site and publish the ones you want to showcase.
              </p>
            </div>
            <span className="inline-flex w-fit rounded-full border border-cyan-200 bg-cyan-50 px-2.5 py-1 text-[11px] font-bold text-cyan-700">
              {items.length} records
            </span>
          </div>

          <form method="get" className="flex flex-wrap items-end gap-2">
            <label className="block">
              <span className="mb-2 block text-xs font-bold uppercase tracking-[0.14em] text-slate-500">
                Status
              </span>
              <select
                name="status"
                defaultValue={status}
                className="h-12 rounded-2xl border border-slate-200 bg-white px-4 text-sm font-medium text-slate-900 outline-none transition focus:border-cyan-400 focus:ring-4 focus:ring-cyan-100"
              >
                <option value="">All</option>
                {CUSTOMER_FEEDBACK_STATUS_OPTIONS.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            </label>
            <button
              type="submit"
              className="inline-flex h-12 items-center justify-center rounded-2xl bg-slate-950 px-5 text-sm font-bold text-white shadow-lg shadow-cyan-200/60 transition hover:bg-cyan-700"
            >
              Apply
            </button>
            <Link
              href="/admin/customer-feedback"
              className="inline-flex h-12 items-center justify-center rounded-2xl border border-red-500 bg-white px-5 text-sm font-bold text-red-500 transition hover:bg-red-50 hover:text-red-600"
            >
              Reset
            </Link>
          </form>
        </div>
      </div>

      {items.length ? (
        <>
          <div className="grid gap-4 p-4 xl:hidden">
            {items.map((item) => (
              <MobileFeedbackCard key={item.id} item={item} />
            ))}
          </div>

          <div className="hidden overflow-x-auto xl:block">
            <table className="w-full table-auto divide-y divide-slate-200 text-left text-xs">
              <thead className="bg-slate-50/90 text-[11px] font-bold uppercase tracking-[0.12em] text-slate-500">
                <tr>
                  <th className="px-4 py-3">Name</th>
                  <th className="px-4 py-3">Email</th>
                  <th className="px-4 py-3">Rating</th>
                  <th className="px-4 py-3">Message</th>
                  <th className="px-4 py-3">Submitted</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 bg-white">
                {items.map((item) => (
                  <tr key={item.id} className="align-top transition hover:bg-cyan-50/35">
                    <td className="px-4 py-3 font-bold text-slate-950">{item.fullName}</td>
                    <td className="px-4 py-3 text-slate-600">{item.email}</td>
                    <td className="px-4 py-3">
                      <StarDisplay rating={item.rating} />
                    </td>
                    <td className="max-w-xs px-4 py-3 text-slate-700">
                      <p className="line-clamp-2">{item.message}</p>
                    </td>
                    <td className="px-4 py-3 text-slate-600">{formatDate(item.createdAt)}</td>
                    <td className="px-4 py-3">
                      <StatusBadge value={item.status} />
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <CustomerFeedbackStatusModal feedback={item} />
                        <CustomerFeedbackDeleteButton id={item.id} name={item.fullName} />
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      ) : (
        <EmptyState />
      )}
    </section>
  );
}
