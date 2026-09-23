"use client";

import Link from "next/link";
import { useTransition } from "react";
import {
  deleteVoucherSettingAction,
  toggleVoucherSettingAction,
} from "@/app/admin/voucher-settings/actions";

// The donation-receipt row is the one approval actually posts, so it reads
// differently from types that are merely configured.
const PURPOSE_STYLE = {
  DonationReceipt: "border-cyan-200 bg-cyan-50 text-cyan-700",
  Payment: "border-violet-200 bg-violet-50 text-violet-700",
  Journal: "border-amber-200 bg-amber-50 text-amber-700",
};

function PurposeBadge({ purpose, purposeName }) {
  const style = PURPOSE_STYLE[purpose] ?? "border-slate-200 bg-slate-50 text-slate-600";
  return (
    <span
      className={`inline-flex items-center rounded-full border px-2.5 py-1 text-[0.65rem] font-bold uppercase tracking-[0.1em] ${style}`}
    >
      {purposeName || purpose}
    </span>
  );
}

function StatusPill({ isActive }) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[0.62rem] font-bold uppercase tracking-[0.1em] ${
        isActive
          ? "border-teal-200 bg-teal-50 text-teal-700"
          : "border-slate-200 bg-slate-50 text-slate-500"
      }`}
    >
      <span className={`h-1.5 w-1.5 rounded-full ${isActive ? "bg-teal-500" : "bg-slate-300"}`} />
      {isActive ? "Active" : "Inactive"}
    </span>
  );
}

function IdCell({ label, value }) {
  return (
    <span className="flex items-baseline gap-1">
      <span className="text-[0.58rem] font-bold uppercase tracking-[0.06em] text-slate-400">{label}</span>
      <span className={`tabular-nums ${value > 0 ? "text-slate-700" : "text-slate-300"}`}>
        {value > 0 ? value : "—"}
      </span>
    </span>
  );
}

export function VoucherSettingTable({ items }) {
  const [isPending, startTransition] = useTransition();

  if (items.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-cyan-50">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="h-8 w-8 text-cyan-400">
            <path d="M6 3.5h12v17l-2-1.4-2 1.4-2-1.4-2 1.4-2-1.4-2 1.4Z" strokeLinejoin="round" />
            <path d="M9.5 8.5h5M9.5 12h5" strokeLinecap="round" />
          </svg>
        </div>
        <p className="mt-4 text-sm font-semibold text-slate-700">No voucher types configured</p>
        <p className="mt-1 max-w-md text-xs leading-5 text-slate-400">
          Add the donation receipt type so approving a payment can post its voucher.
        </p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[900px] text-sm">
        <thead>
          <tr className="border-b border-slate-100 bg-slate-50 text-xs font-bold uppercase tracking-wider text-slate-500">
            <th className="px-4 py-3 text-left">Used for</th>
            <th className="px-4 py-3 text-left">Voucher type</th>
            <th className="px-4 py-3 text-left">Number format</th>
            <th className="px-4 py-3 text-left">Header ids</th>
            <th className="px-4 py-3 text-left">Status</th>
            <th className="px-4 py-3 text-right">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-50">
          {items.map((v) => (
            <tr key={v.id} className="transition-colors hover:bg-slate-50/70">
              <td className="px-4 py-3">
                <PurposeBadge purpose={v.purpose} purposeName={v.purposeName} />
              </td>
              <td className="px-4 py-3">
                <p className="font-semibold text-slate-800">
                  {v.receiptVoucherTypeName || "—"}
                </p>
                <p className="mt-0.5 font-mono text-[0.68rem] text-slate-400">
                  Id {v.receiptVoucherTypeId}
                </p>
              </td>
              <td className="px-4 py-3">
                <span className="font-mono text-xs text-slate-600">
                  {v.voucherNoPrefix ? `${v.voucherNoPrefix}YYYY/001` : "—"}
                </span>
              </td>
              <td className="px-4 py-3">
                <div className="flex flex-wrap gap-x-3 gap-y-1 text-xs">
                  <IdCell label="FY" value={v.fiscalYearId} />
                  <IdCell label="TY" value={v.taxYearId} />
                  <IdCell label="CO" value={v.companyId} />
                  <IdCell label="FS" value={v.fundSourceId} />
                  <IdCell label="PR" value={v.projectId} />
                </div>
              </td>
              <td className="px-4 py-3">
                <StatusPill isActive={v.isActive} />
              </td>
              <td className="px-4 py-3">
                <div className="flex items-center justify-end gap-2">
                  <Link
                    href={`/admin/voucher-settings?edit=${v.id}`}
                    className="inline-flex h-8 items-center rounded-lg border border-cyan-200 bg-white px-3 text-xs font-semibold text-cyan-800 transition hover:bg-cyan-50"
                  >
                    Edit
                  </Link>

                  <form action={(fd) => startTransition(() => toggleVoucherSettingAction(fd))}>
                    <input type="hidden" name="id" value={v.id} />
                    <input type="hidden" name="isActive" value={v.isActive ? "false" : "true"} />
                    <button
                      type="submit"
                      disabled={isPending}
                      className="inline-flex h-8 items-center rounded-lg border border-slate-200 bg-white px-3 text-xs font-semibold text-slate-600 transition hover:bg-slate-50 disabled:opacity-60"
                    >
                      {v.isActive ? "Deactivate" : "Activate"}
                    </button>
                  </form>

                  <form
                    action={(fd) => startTransition(() => deleteVoucherSettingAction(fd))}
                    onSubmit={(event) => {
                      if (
                        !window.confirm(
                          `Delete the ${v.purposeName || v.purpose} voucher type? ` +
                            "Anything that posts it will fall back to the configured defaults.",
                        )
                      ) {
                        event.preventDefault();
                      }
                    }}
                  >
                    <input type="hidden" name="id" value={v.id} />
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
  );
}
