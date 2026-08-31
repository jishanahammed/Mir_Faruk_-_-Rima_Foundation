"use client";

import Link from "next/link";
import { ProjectBlogToggle } from "./project-blog-toggle";
import { ProjectBlogDeleteButton } from "./project-blog-delete-button";

function Pagination({ totalPages, pageNumber, pageSize, search }) {
  if (totalPages <= 1) return null;

  function href(p) {
    const q = new URLSearchParams();
    if (search) q.set("search", search);
    q.set("page", p);
    q.set("pageSize", pageSize);
    return `?${q}`;
  }

  const pages = [];
  for (let i = 1; i <= totalPages; i++) {
    if (i === 1 || i === totalPages || Math.abs(i - pageNumber) <= 1) pages.push(i);
    else if (pages[pages.length - 1] !== "…") pages.push("…");
  }

  return (
    <div className="flex items-center justify-center gap-1 pt-4">
      {pages.map((p, i) =>
        p === "…" ? (
          <span key={i} className="px-2 text-slate-400">…</span>
        ) : (
          <Link
            key={p}
            href={href(p)}
            className={`flex h-8 w-8 items-center justify-center rounded-lg text-sm font-semibold transition ${
              p === pageNumber
                ? "bg-cyan-600 text-white shadow"
                : "border border-slate-200 text-slate-600 hover:bg-slate-50"
            }`}
          >
            {p}
          </Link>
        )
      )}
    </div>
  );
}

export function ProjectBlogTable({ data, search, updatePublishAction, updateActiveAction, deleteAction }) {
  const { items, totalCount, totalPages, pageNumber, pageSize } = data;

  return (
    <div className="flex flex-col gap-4">
      {/* Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 pb-4">
        <form method="get" className="flex gap-2">
          <input
            name="search"
            defaultValue={search}
            placeholder="Search blogs…"
            className="h-9 rounded-xl border border-slate-200 bg-slate-50 px-3 text-sm text-slate-700 placeholder:text-slate-400 focus:border-cyan-400 focus:outline-none focus:ring-2 focus:ring-cyan-100"
          />
          <button type="submit" className="h-9 rounded-xl bg-cyan-600 px-4 text-sm font-semibold text-white hover:bg-cyan-700">
            Search
          </button>
          {search && (
            <Link href="?" className="flex h-9 items-center rounded-xl border border-slate-200 px-3 text-sm text-slate-500 hover:bg-slate-50">
              Clear
            </Link>
          )}
        </form>
        <div className="flex items-center gap-3">
          <span className="text-xs text-slate-500">{totalCount} blog{totalCount !== 1 ? "s" : ""}</span>
          <form method="get">
            {search && <input type="hidden" name="search" value={search} />}
            <select
              name="pageSize"
              defaultValue={pageSize}
              onChange={(e) => e.currentTarget.form.submit()}
              className="h-9 rounded-xl border border-slate-200 bg-white px-2 text-sm text-slate-700 focus:outline-none"
            >
              {[10, 20, 50].map((n) => <option key={n} value={n}>{n} / page</option>)}
            </select>
          </form>
        </div>
      </div>

      {/* Table */}
      {items.length === 0 ? (
        <div className="py-16 text-center text-sm text-slate-400">No project blogs found.</div>
      ) : (
        <div className="overflow-x-auto rounded-2xl border border-slate-100">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50 text-xs font-bold uppercase tracking-wider text-slate-500">
                <th className="px-4 py-3 text-left">#</th>
                <th className="px-4 py-3 text-left">Cover</th>
                <th className="px-4 py-3 text-left">Title</th>
                <th className="px-4 py-3 text-left">Project</th>
                <th className="px-4 py-3 text-left">Published</th>
                <th className="px-4 py-3 text-left">Active</th>
                <th className="px-4 py-3 text-left">Serial</th>
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {items.map((blog, idx) => (
                <tr key={blog.id} className="group hover:bg-slate-50/60 transition-colors">
                  <td className="px-4 py-3 text-xs text-slate-400 font-mono">
                    {(pageNumber - 1) * pageSize + idx + 1}
                  </td>
                  <td className="px-4 py-3">
                    {blog.coverImage ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={`/api/asset?path=${encodeURIComponent(
                          blog.coverImage.replace(/\\/g, "/").replace(/^~\//, "").replace(/^\/+/, "")
                        )}`}
                        alt={blog.titleEn}
                        className="h-10 w-14 rounded-lg object-cover border border-slate-200"
                      />
                    ) : (
                      <span className="flex h-10 w-14 items-center justify-center rounded-lg border border-dashed border-slate-200 text-[10px] text-slate-300">
                        No image
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-3 max-w-[220px]">
                    <p className="font-semibold text-slate-800 truncate">{blog.titleEn}</p>
                    {blog.shortDescriptionEn && (
                      <p className="text-xs text-slate-400 truncate">{blog.shortDescriptionEn}</p>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    <span className="text-xs text-slate-500">{blog.projectTitleEn ?? "—"}</span>
                  </td>
                  <td className="px-4 py-3">
                    <ProjectBlogToggle
                      id={blog.id}
                      value={blog.isPublished}
                      onLabel="Published"
                      offLabel="Unpublished"
                      fieldName="isPublished"
                      action={updatePublishAction}
                    />
                  </td>
                  <td className="px-4 py-3">
                    <ProjectBlogToggle
                      id={blog.id}
                      value={blog.isActive}
                      onLabel="Active"
                      offLabel="Inactive"
                      fieldName="isActive"
                      action={updateActiveAction}
                    />
                  </td>
                  <td className="px-4 py-3 text-xs text-slate-400 font-mono">{blog.serialNo ?? "—"}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-end gap-2">
                      <Link
                        href={`?edit=${blog.id}`}
                        className="inline-flex items-center gap-1 rounded-lg border border-cyan-200 bg-cyan-50 px-2.5 py-1.5 text-xs font-semibold text-cyan-700 transition hover:bg-cyan-100"
                      >
                        Edit
                      </Link>
                      <ProjectBlogDeleteButton id={blog.id} title={blog.titleEn} action={deleteAction} />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <Pagination totalPages={totalPages} pageNumber={pageNumber} pageSize={pageSize} search={search} />
    </div>
  );
}
