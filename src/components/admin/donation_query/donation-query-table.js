"use client";

import { useState, useTransition } from "react";
import {
  openDonationQueryAction,
  setDonationQuerySeenAction,
  deleteDonationQueryAction,
} from "@/app/admin/donation-queries/actions";

function formatDateTime(value) {
  if (!value) return "—";
  const d = new Date(value);
  return Number.isNaN(d.getTime()) ? "—" : d.toLocaleString();
}

function SeenPill({ isSeen }) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[0.62rem] font-bold uppercase tracking-[0.12em] ${isSeen
        ? "border-slate-200 bg-slate-50 text-slate-500"
        : "border-amber-200 bg-amber-50 text-amber-700"
        }`}
    >
      <span className={`h-1.5 w-1.5 rounded-full ${isSeen ? "bg-slate-300" : "bg-amber-500"}`} />
      {isSeen ? "Seen" : "New"}
    </span>
  );
}

function QueryDetail({ query, onClose }) {
  const [isPending, startTransition] = useTransition();

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-slate-900/40 p-4 backdrop-blur-sm sm:items-center sm:p-8"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="relative my-auto w-full max-w-2xl rounded-3xl bg-white shadow-2xl">
        <div className="flex items-start justify-between gap-4 rounded-t-3xl bg-[linear-gradient(135deg,#0f766e,#0891b2)] px-6 py-5">
          <div className="min-w-0">
            <p className="text-xs font-bold uppercase tracking-widest text-cyan-200">Transaction Query</p>
            <h2 className="mt-0.5 truncate text-lg font-extrabold text-white">{query.fullName}</h2>
          </div>
          <button
            onClick={onClose}
            aria-label="Close"
            className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-white/20 text-white transition hover:bg-white/30"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-4 w-4">
              <path d="M18 6 6 18M6 6l12 12" strokeLinecap="round" />
            </svg>
          </button>
        </div>

        <div className="flex flex-col gap-5 p-6">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <p className="text-[0.62rem] font-semibold uppercase tracking-[0.18em] text-slate-400">Email</p>
              <p className="mt-1 break-words text-sm font-semibold text-slate-800">{query.email}</p>
            </div>
            <div>
              <p className="text-[0.62rem] font-semibold uppercase tracking-[0.18em] text-slate-400">Mobile</p>
              <p className="mt-1 text-sm font-semibold text-slate-800">{query.mobile || "—"}</p>
            </div>
          </div>

          {/* Shows whether the report was matched to a donor record, and the
              reference the sender actually typed when it was not. */}
          <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">
            <p className="text-[0.62rem] font-semibold uppercase tracking-[0.18em] text-slate-400">Donor</p>
            {query.isLinked ? (
              <p className="mt-1 text-sm font-semibold text-slate-800">
                {query.donorName}
                <span className="ml-2 rounded-md bg-cyan-50 px-2 py-0.5 font-mono text-xs text-cyan-700">
                  {query.donorId}
                </span>
              </p>
            ) : (
              <p className="mt-1 text-sm text-slate-500">
                Not matched to a registered donor
                {query.donorReference ? (
                  <span className="ml-1">
                    — reference given: <span className="font-mono text-slate-700">{query.donorReference}</span>
                  </span>
                ) : null}
              </p>
            )}
          </div>

          <div>
            <p className="text-[0.62rem] font-semibold uppercase tracking-[0.18em] text-slate-400">
              Transaction Details
            </p>
            <p className="mt-2 whitespace-pre-wrap rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm leading-6 text-slate-700">
              {query.message}
            </p>
          </div>

          <p className="text-xs text-slate-400">Received {formatDateTime(query.createdAt)}</p>

          <div className="flex flex-wrap items-center justify-end gap-3 border-t border-slate-100 pt-4">
            <form
              action={(fd) => startTransition(async () => { await setDonationQuerySeenAction(fd); onClose(); })}
            >
              <input type="hidden" name="id" value={query.id} />
              <input type="hidden" name="isSeen" value="false" />
              <button
                type="submit"
                disabled={isPending}
                className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-2 text-xs font-semibold text-amber-700 transition hover:bg-amber-100 disabled:opacity-60"
              >
                Mark unseen
              </button>
            </form>
            <button
              type="button"
              onClick={onClose}
              className="rounded-xl border border-slate-200 px-5 py-2 text-sm font-semibold text-slate-600 transition hover:bg-slate-50"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export function DonationQueryTable({ items }) {
  const [selected, setSelected] = useState(null);
  const [isPending, startTransition] = useTransition();

  function open(row) {
    // Fetching the detail marks it seen server-side, so the row and the badge
    // both settle from the response rather than an optimistic guess.
    startTransition(async () => {
      const full = await openDonationQueryAction(row.id);
      setSelected(full ?? row);
    });
  }

  if (items.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-cyan-50">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="h-8 w-8 text-cyan-400">
            <path d="M6 3.5h12v17l-2-1.4-2 1.4-2-1.4-2 1.4-2-1.4-2 1.4Z" strokeLinejoin="round" />
            <path d="M9.5 8.5h5M9.5 12h5" strokeLinecap="round" />
          </svg>
        </div>
        <p className="mt-4 text-sm font-semibold text-slate-700">No transaction queries yet</p>
        <p className="mt-1 text-xs text-slate-400">
          Donor submissions from the donation dialog will appear here.
        </p>
      </div>
    );
  }

  return (
    <>
      <div className="overflow-x-auto">
        <table className="w-full min-w-[880px] text-sm">
          <thead>
            <tr className="border-b border-slate-100 bg-slate-50 text-xs font-bold uppercase tracking-wider text-slate-500">
              <th className="px-4 py-3 text-left">Status</th>
              <th className="px-4 py-3 text-left">From</th>
              <th className="px-4 py-3 text-left">Donor</th>
              <th className="px-4 py-3 text-left">Details</th>
              <th className="px-4 py-3 text-left">Received</th>
              <th className="px-4 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {items.map((q) => (
              <tr
                key={q.id}
                onClick={() => open(q)}
                className={`group cursor-pointer transition-colors ${q.isSeen
                  ? "bg-white hover:bg-slate-50/70"
                  : "border-l-[3px] border-l-amber-400 bg-amber-50/40 hover:bg-amber-50/70"
                  }`}
              >
                <td className="px-4 py-3">
                  <SeenPill isSeen={q.isSeen} />
                </td>
                <td className="max-w-[190px] px-4 py-3">
                  <p className={`truncate ${q.isSeen ? "font-medium text-slate-700" : "font-bold text-slate-900"}`}>
                    {q.fullName}
                  </p>
                  <p className="truncate text-xs text-slate-400">{q.email}</p>
                </td>
                <td className="px-4 py-3">
                  {q.isLinked ? (
                    <span className="inline-flex items-center gap-1.5 rounded-md bg-cyan-50 px-2 py-1 font-mono text-xs font-semibold text-cyan-700">
                      {q.donorId}
                    </span>
                  ) : (
                    <span className="text-xs text-slate-300">—</span>
                  )}
                </td>
                <td className="max-w-[260px] px-4 py-3">
                  <p className="truncate text-xs text-slate-600">{q.message}</p>
                </td>
                <td className="px-4 py-3">
                  <p className="text-xs text-slate-500">{formatDateTime(q.createdAt)}</p>
                </td>
                <td className="px-4 py-3" onClick={(e) => e.stopPropagation()}>
                  <div className="flex items-center justify-end gap-2">
                    <button
                      type="button"
                      onClick={() => open(q)}
                      disabled={isPending}
                      className="inline-flex h-8 items-center rounded-lg border border-cyan-200 bg-white px-3 text-xs font-semibold text-cyan-800 transition hover:bg-cyan-50 disabled:opacity-60"
                    >
                      View
                    </button>
                    <form
                      action={(fd) => startTransition(async () => { await deleteDonationQueryAction(fd); })}
                      onSubmit={(e) => {
                        if (!window.confirm(`Delete the query from ${q.fullName}?`)) e.preventDefault();
                      }}
                    >
                      <input type="hidden" name="id" value={q.id} />
                      <button
                        type="submit"
                        className="inline-flex h-8 items-center rounded-lg border border-red-200 bg-white px-3 text-xs font-semibold text-red-600 transition hover:bg-red-50"
                      >
                        Delete
                      </button>
                    </form>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {selected && <QueryDetail query={selected} onClose={() => setSelected(null)} />}
    </>
  );
}
