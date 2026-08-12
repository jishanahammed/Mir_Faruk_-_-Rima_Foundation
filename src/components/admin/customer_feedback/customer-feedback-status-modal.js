"use client";

import { useEffect, useId, useState } from "react";
import { updateCustomerFeedbackStatusAction } from "@/app/admin/customer-feedback/actions";

// Mirrors CUSTOMER_FEEDBACK_STATUS_OPTIONS in the admin service, which is
// server-only and therefore cannot be imported into this client component.
const CUSTOMER_FEEDBACK_STATUS_OPTIONS = ["New", "Reviewed", "Published", "Rejected"];

function StarDisplay({ rating }) {
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((star) => (
        <svg
          key={star}
          viewBox="0 0 24 24"
          className={`h-4 w-4 ${star <= rating ? "fill-amber-400 text-amber-400" : "fill-slate-200 text-slate-200"}`}
        >
          <path d="M12 2.5l2.9 6.06 6.6.72-4.9 4.5 1.28 6.55L12 16.9l-5.88 3.43 1.28-6.55-4.9-4.5 6.6-.72L12 2.5Z" />
        </svg>
      ))}
    </div>
  );
}

function formatDate(value) {
  if (!value) return "Not available";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "Not available";
  return new Intl.DateTimeFormat("en-GB", { day: "2-digit", month: "2-digit", year: "numeric" })
    .format(date)
    .replaceAll("/", "-");
}

export function CustomerFeedbackStatusModal({ feedback }) {
  const [isOpen, setIsOpen] = useState(false);
  const [status, setStatus] = useState(feedback.status);
  const titleId = useId();

  useEffect(() => {
    if (!isOpen) {
      setStatus(feedback.status);
      return undefined;
    }

    function handleKeyDown(event) {
      if (event.key === "Escape") setIsOpen(false);
    }

    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, feedback.status]);

  return (
    <>
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        className="inline-flex h-8 items-center rounded-lg border border-cyan-200 bg-cyan-50 px-3 text-xs font-semibold text-cyan-700 transition hover:bg-cyan-100"
      >
        View / Review
      </button>

      {isOpen ? (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/55 px-4 py-6 backdrop-blur-sm"
          role="dialog"
          aria-modal="true"
          aria-labelledby={titleId}
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) setIsOpen(false);
          }}
        >
          <div className="w-full max-w-xl overflow-hidden rounded-[30px] border border-white/70 bg-white shadow-2xl shadow-slate-950/25">
            <div className="border-b border-cyan-100 bg-[radial-gradient(circle_at_top_left,rgba(34,211,238,0.2),transparent_35%),linear-gradient(135deg,#f8fafc,#effcff)] p-6">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-xs font-bold uppercase tracking-[0.2em] text-cyan-700">
                    Customer Feedback
                  </p>
                  <h2 id={titleId} className="mt-2 text-2xl font-black tracking-tight text-slate-950">
                    {feedback.fullName}
                  </h2>
                  <p className="mt-1 text-sm font-medium text-slate-500">
                    {feedback.email} · {formatDate(feedback.createdAt)}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border border-slate-200 bg-white text-slate-500 shadow-sm transition hover:border-red-200 hover:bg-red-50 hover:text-red-500"
                  aria-label="Close"
                >
                  <svg className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path d="m6 6 12 12M18 6 6 18" strokeLinecap="round" />
                  </svg>
                </button>
              </div>
            </div>

            <form action={updateCustomerFeedbackStatusAction} className="p-6">
              <input type="hidden" name="id" value={feedback.id} />

              <StarDisplay rating={feedback.rating} />

              <p className="mt-4 whitespace-pre-wrap rounded-2xl border border-slate-100 bg-slate-50 p-4 text-sm leading-6 text-slate-700">
                {feedback.message}
              </p>

              <label className="mt-5 block">
                <span className="mb-2 block text-xs font-semibold uppercase tracking-[0.14em] text-slate-500">
                  Status
                </span>
                <select
                  name="status"
                  value={status}
                  onChange={(event) => setStatus(event.target.value)}
                  required
                  className="h-12 w-full rounded-2xl border border-slate-200 bg-white px-4 text-sm font-semibold text-slate-900 outline-none transition focus:border-cyan-400 focus:ring-4 focus:ring-cyan-100"
                >
                  {CUSTOMER_FEEDBACK_STATUS_OPTIONS.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              </label>

              <label className="mt-5 block">
                <span className="mb-2 block text-xs font-semibold uppercase tracking-[0.14em] text-slate-500">
                  Admin remarks
                </span>
                <textarea
                  name="adminRemarks"
                  rows={3}
                  maxLength={500}
                  defaultValue={feedback.adminRemarks ?? ""}
                  placeholder="Optional internal note"
                  className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-medium text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-cyan-400 focus:ring-4 focus:ring-cyan-100"
                />
              </label>

              {status === "Published" ? (
                <p className="mt-4 rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-xs font-semibold leading-5 text-emerald-800">
                  Publishing makes this feedback visible on the public feedback list.
                </p>
              ) : null}

              <div className="mt-6 flex flex-col-reverse gap-3 border-t border-slate-100 pt-5 sm:flex-row sm:items-center sm:justify-end">
                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  className="inline-flex h-11 items-center justify-center rounded-xl border border-slate-200 bg-white px-4 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="inline-flex h-11 items-center justify-center rounded-xl bg-cyan-700 px-5 text-sm font-bold text-white transition hover:bg-cyan-800"
                >
                  Save status
                </button>
              </div>
            </form>
          </div>
        </div>
      ) : null}
    </>
  );
}
