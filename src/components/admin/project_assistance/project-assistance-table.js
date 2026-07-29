"use client";

import Link from "next/link";
import { ProjectAssistanceDeleteButton } from "./project-assistance-delete-button";
import { ProjectAssistanceStatusToggle } from "./project-assistance-status-toggle";

function fmt(n) {
  return "৳" + Number(n ?? 0).toLocaleString("en-BD");
}

function Pagination({ pageNumber, totalPages, pageSize, search }) {
  function href(p) {
    const sp = new URLSearchParams();
    if (search) sp.set("search", search);
    sp.set("page", String(p));
    sp.set("pageSize", String(pageSize));
    return `/admin/project-assistance?${sp.toString()}`;
  }

  if (totalPages <= 1) return null;

  const pages = [];
  for (let i = 1; i <= totalPages; i++) {
    if (i === 1 || i === totalPages || Math.abs(i - pageNumber) <= 1) {
      pages.push(i);
    } else if (pages[pages.length - 1] !== "…") {
      pages.push("…");
    }
  }

  return (
    <div className="flex items-center justify-between border-t border-slate-100 px-6 py-4">
      <p className="text-xs text-slate-500">
        Page {pageNumber} of {totalPages}
      </p>
      <div className="flex items-center gap-1">
        {pageNumber > 1 && (
          <Link
            href={href(pageNumber - 1)}
            className="flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 text-slate-600 transition hover:bg-cyan-50 hover:text-cyan-700"
          >
            ‹
          </Link>
        )}
        {pages.map((p, idx) =>
          p === "…" ? (
            <span key={`ellipsis-${idx}`} className="px-1 text-slate-400">…</span>
          ) : (
            <Link
              key={p}
              href={href(p)}
              className={`flex h-8 w-8 items-center justify-center rounded-lg text-xs font-semibold transition ${
                p === pageNumber
                  ? "bg-cyan-700 text-white shadow-sm"
                  : "border border-slate-200 text-slate-600 hover:bg-cyan-50 hover:text-cyan-700"
              }`}
            >
              {p}
            </Link>
          )
        )}
        {pageNumber < totalPages && (
          <Link
            href={href(pageNumber + 1)}
            className="flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 text-slate-600 transition hover:bg-cyan-50 hover:text-cyan-700"
          >
            ›
          </Link>
        )}
      </div>
    </div>
  );
}

export function ProjectAssistanceTable({ data, search, updateStatusAction, deleteAction }) {
  const { items, totalCount, totalPages, pageNumber, pageSize } = data;

  return (
    <div>
      {/* Toolbar */}
      <div className="flex flex-col gap-3 border-b border-slate-100 px-6 py-4 sm:flex-row sm:items-center sm:justify-between">
        <form method="get" action="/admin/project-assistance" className="flex items-center gap-2">
          <div className="relative">
            <svg
              viewBox="0 0 20 20"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.6"
              className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400"
            >
              <circle cx="9" cy="9" r="5.5" />
              <path d="M13.5 13.5 17 17" strokeLinecap="round" />
            </svg>
            <input
              name="search"
              defaultValue={search}
              placeholder="Search assistance records…"
              className="h-9 w-64 rounded-xl border border-slate-200 bg-slate-50 pl-9 pr-3 text-sm text-slate-800 placeholder-slate-400 outline-none focus:border-cyan-400 focus:bg-white focus:ring-2 focus:ring-cyan-100"
            />
          </div>
          <input type="hidden" name="pageSize" value={pageSize} />
          <button
            type="submit"
            className="h-9 rounded-xl border border-slate-200 bg-white px-4 text-xs font-semibold text-slate-700 transition hover:border-cyan-300 hover:text-cyan-700"
          >
            Search
          </button>
          {search && (
            <Link
              href="/admin/project-assistance"
              className="flex h-9 items-center rounded-xl border border-slate-200 bg-white px-4 text-xs font-semibold text-slate-500 transition hover:text-slate-800"
            >
              Clear
            </Link>
          )}
        </form>

        <span className="text-xs text-slate-500">{totalCount} result{totalCount !== 1 ? "s" : ""}</span>
      </div>

      {/* Table */}
      {items.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-cyan-50">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="h-8 w-8 text-cyan-400">
              <path d="M9 5H7a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-2M9 5a2 2 0 0 0 2 2h2a2 2 0 0 0 2-2M9 5a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
          <p className="mt-4 text-sm font-semibold text-slate-700">No assistance records found</p>
          <p className="mt-1 text-xs text-slate-400">
            {search ? "Try a different search term." : "Add the first assistance record to get started."}
          </p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full min-w-[920px] text-sm">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50 text-xs font-bold uppercase tracking-wider text-slate-500">
                <th className="px-4 py-3 text-left">#</th>
                <th className="px-4 py-3 text-left">Name</th>
                <th className="px-4 py-3 text-left">Project</th>
                <th className="px-4 py-3 text-left">Type</th>
                <th className="px-4 py-3 text-left">Beneficiary / Mode</th>
                <th className="px-4 py-3 text-left">Target</th>
                <th className="px-4 py-3 text-left">Collected</th>
                <th className="px-4 py-3 text-left">Status</th>
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {items.map((a, idx) => (
                <tr key={a.id} className="group hover:bg-slate-50/60 transition-colors">
                  <td className="px-4 py-3 text-xs text-slate-400 font-mono">
                    {(pageNumber - 1) * pageSize + idx + 1}
                  </td>
                  <td className="px-4 py-3 max-w-[200px]">
                    <p className="font-semibold text-slate-800 truncate">{a.nameEn}</p>
                    <p className="text-xs text-slate-400 truncate">{a.nameBn}</p>
                  </td>
                  <td className="px-4 py-3 max-w-[160px]">
                    <p className="text-slate-600 truncate">{a.projectTitleEn ?? "—"}</p>
                  </td>
                  <td className="px-4 py-3">
                    <span className="text-xs text-slate-500">{a.assistanceTypeNameEn ?? "—"}</span>
                  </td>
                  <td className="px-4 py-3 text-xs text-slate-500">
                    {a.targetBeneficiaryType} · {a.supportMode}
                  </td>
                  <td className="px-4 py-3 text-xs font-semibold text-slate-700">
                    ৳{Number(a.targetAmount ?? 0).toLocaleString()}
                  </td>
                  <td className="px-4 py-3 text-xs font-semibold text-emerald-700">
                    {fmt(a.totalCollectedAmount)}
                  </td>
                  <td className="px-4 py-3">
                    <ProjectAssistanceStatusToggle
                      id={a.id}
                      isActive={a.isActive}
                      action={updateStatusAction}
                    />
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-end gap-2">
                      <Link
                        href={`/admin/project-assistance?edit=${a.id}`}
                        className="inline-flex h-8 items-center rounded-lg border border-cyan-200 bg-white px-3 text-xs font-semibold text-cyan-800 transition hover:bg-cyan-50"
                      >
                        Edit
                      </Link>
                      <ProjectAssistanceDeleteButton
                        id={a.id}
                        name={a.nameEn}
                        action={deleteAction}
                      />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <Pagination
        pageNumber={pageNumber}
        totalPages={totalPages}
        pageSize={pageSize}
        search={search}
      />
    </div>
  );
}
