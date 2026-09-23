"use client";

import Link from "next/link";
import { useTransition } from "react";
import {
  deleteAccountingEndpointAction,
  toggleAccountingEndpointAction,
} from "@/app/admin/accounting-endpoints/actions";

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

export function AccountingEndpointTable({ items }) {
  const [isPending, startTransition] = useTransition();

  if (items.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-cyan-50">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="h-8 w-8 text-cyan-400">
            <path d="M10 13a5 5 0 0 0 7 0l3-3a5 5 0 0 0-7-7l-1.5 1.5" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M14 11a5 5 0 0 0-7 0l-3 3a5 5 0 0 0 7 7l1.5-1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
        <p className="mt-4 text-sm font-semibold text-slate-700">No endpoints configured</p>
        <p className="mt-1 max-w-md text-xs leading-5 text-slate-400">
          The integration is running on its built-in URLs. Add a row only to point an
          endpoint somewhere else.
        </p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[900px] text-sm">
        <thead>
          <tr className="border-b border-slate-100 bg-slate-50 text-xs font-bold uppercase tracking-wider text-slate-500">
            <th className="px-4 py-3 text-left">Endpoint</th>
            <th className="px-4 py-3 text-left">URL</th>
            <th className="px-4 py-3 text-left">Status</th>
            <th className="px-4 py-3 text-right">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-50">
          {items.map((e) => (
            <tr key={e.id} className="transition-colors hover:bg-slate-50/70">
              <td className="max-w-[240px] px-4 py-3">
                <p className="truncate font-semibold text-slate-800">{e.displayName}</p>
                <p className="mt-0.5 truncate font-mono text-[0.68rem] text-slate-400">{e.endpointKey}</p>
              </td>
              <td className="max-w-[380px] px-4 py-3">
                <a
                  href={e.apiUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  title={e.apiUrl}
                  className="block truncate text-xs text-cyan-700 hover:underline"
                >
                  {e.apiUrl}
                </a>
                {/* Flags a row that has been pointed away from the shipped URL,
                    which is the first thing to check when a call starts failing. */}
                {!e.isDefault && e.defaultUrl ? (
                  <p className="mt-1 truncate text-[0.66rem] text-amber-600" title={e.defaultUrl}>
                    Overrides default: {e.defaultUrl}
                  </p>
                ) : null}
              </td>
              <td className="px-4 py-3">
                <StatusPill isActive={e.isActive} />
              </td>
              <td className="px-4 py-3">
                <div className="flex items-center justify-end gap-2">
                  <Link
                    href={`/admin/accounting-endpoints?edit=${e.id}`}
                    className="inline-flex h-8 items-center rounded-lg border border-cyan-200 bg-white px-3 text-xs font-semibold text-cyan-800 transition hover:bg-cyan-50"
                  >
                    Edit
                  </Link>

                  <form action={(fd) => startTransition(() => toggleAccountingEndpointAction(fd))}>
                    <input type="hidden" name="id" value={e.id} />
                    <input type="hidden" name="isActive" value={e.isActive ? "false" : "true"} />
                    <button
                      type="submit"
                      disabled={isPending}
                      className="inline-flex h-8 items-center rounded-lg border border-slate-200 bg-white px-3 text-xs font-semibold text-slate-600 transition hover:bg-slate-50 disabled:opacity-60"
                    >
                      {e.isActive ? "Deactivate" : "Activate"}
                    </button>
                  </form>

                  <form
                    action={(fd) => startTransition(() => deleteAccountingEndpointAction(fd))}
                    onSubmit={(event) => {
                      if (
                        !window.confirm(
                          `Delete "${e.displayName}"? The integration will fall back to its built-in URL.`,
                        )
                      ) {
                        event.preventDefault();
                      }
                    }}
                  >
                    <input type="hidden" name="id" value={e.id} />
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
