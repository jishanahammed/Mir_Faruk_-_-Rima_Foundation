"use client";

import Link from "next/link";
import { LedgerConfigurationDeleteButton } from "./ledger-configuration-delete-button";
import { LedgerConfigurationStatusToggle } from "./ledger-configuration-status-toggle";

// Each people type gets its own tint so a row's purpose reads at a glance.
const LEDGER_TYPE_STYLE = {
  Donor:       "border-cyan-200 bg-cyan-50 text-cyan-700",
  Beneficiary: "border-teal-200 bg-teal-50 text-teal-700",
  Volunteer:   "border-violet-200 bg-violet-50 text-violet-700",
  Staff:       "border-amber-200 bg-amber-50 text-amber-700",
  General:     "border-slate-300 bg-slate-100 text-slate-700",
};

function LedgerTypeBadge({ type }) {
  const style = LEDGER_TYPE_STYLE[type] ?? "border-slate-200 bg-slate-50 text-slate-600";
  return (
    <span className={`inline-flex items-center rounded-full border px-2.5 py-1 text-[0.65rem] font-bold uppercase tracking-[0.1em] ${style}`}>
      {type}
    </span>
  );
}

function ApiUrlLine({ label, url }) {
  return (
    <span className="flex items-baseline gap-1.5">
      <span className="w-11 shrink-0 text-[0.58rem] font-bold uppercase tracking-[0.08em] text-slate-400">
        {label}
      </span>
      {url ? (
        <a
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          title={url}
          className="min-w-0 flex-1 truncate text-xs text-cyan-700 hover:underline"
        >
          {url}
        </a>
      ) : (
        <span className="text-xs text-slate-300">&mdash;</span>
      )}
    </span>
  );
}

export function LedgerConfigurationTable({ items, updateStatusAction, deleteAction }) {
  if (items.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-cyan-50">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="h-8 w-8 text-cyan-400">
            <rect x="4" y="3.5" width="16" height="17" rx="2" />
            <path d="M8 8h8M8 12h8M8 16h5" strokeLinecap="round" />
          </svg>
        </div>
        <p className="mt-4 text-sm font-semibold text-slate-700">No ledger configuration yet</p>
        <p className="mt-1 text-xs text-slate-400">
          Map each people type to its accounting group to get started.
        </p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[1000px] text-sm">
        <thead>
          <tr className="border-b border-slate-100 bg-slate-50 text-xs font-bold uppercase tracking-wider text-slate-500">
            <th className="px-4 py-3 text-left">Ledger Type</th>
            <th className="px-4 py-3 text-left">Group ID</th>
            <th className="px-4 py-3 text-left">Group Code</th>
            <th className="px-4 py-3 text-left">Account Group</th>
            <th className="px-4 py-3 text-left">API URLs</th>
            <th className="px-4 py-3 text-left">Status</th>
            <th className="px-4 py-3 text-right">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-50">
          {items.map((c) => (
            <tr key={c.id} className="group transition-colors hover:bg-slate-50/60">
              <td className="px-4 py-3">
                <LedgerTypeBadge type={c.ledgerType} />
              </td>
              <td className="px-4 py-3">
                <span className="font-mono text-xs tabular-nums text-slate-700">{c.groupId}</span>
              </td>
              <td className="px-4 py-3">
                <span className="font-mono text-xs font-semibold text-slate-800">{c.groupCode}</span>
              </td>
              <td className="max-w-[220px] px-4 py-3">
                <p className="truncate font-semibold text-slate-800">{c.groupName || "—"}</p>
                <p className="font-mono text-[0.62rem] text-slate-400">Nature {c.natureId}</p>
              </td>
              <td className="max-w-[240px] px-4 py-3">
                {c.addApiUrl || c.updateApiUrl ? (
                  <div className="flex flex-col gap-1">
                    <ApiUrlLine label="Add" url={c.addApiUrl} />
                    <ApiUrlLine label="Update" url={c.updateApiUrl} />
                  </div>
                ) : (
                  <span className="text-xs text-slate-300">&mdash;</span>
                )}
              </td>
              <td className="px-4 py-3">
                <LedgerConfigurationStatusToggle
                  id={c.id}
                  isActive={c.isActive}
                  action={updateStatusAction}
                />
              </td>
              <td className="px-4 py-3">
                <div className="flex items-center justify-end gap-2">
                  <Link
                    href={`/admin/ledger-configuration?edit=${c.id}`}
                    className="inline-flex h-8 items-center rounded-lg border border-cyan-200 bg-white px-3 text-xs font-semibold text-cyan-800 transition hover:bg-cyan-50"
                  >
                    Edit
                  </Link>
                  <LedgerConfigurationDeleteButton
                    id={c.id}
                    name={c.ledgerType}
                    action={deleteAction}
                  />
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
