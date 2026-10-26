import Link from "next/link";

export function QueryStatus({ isSeen }) {
  return <span className={`inline-flex shrink-0 items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-bold ${isSeen ? "border-slate-200 bg-slate-50 text-slate-600" : "border-amber-200 bg-amber-50 text-amber-800"}`}>
    <span aria-hidden="true" className={`h-1.5 w-1.5 rounded-full ${isSeen ? "bg-slate-400" : "bg-amber-500"}`} />{isSeen ? "Seen" : "Unseen"}
  </span>;
}

export function QueryFilters({ basePath, params, admin = false }) {
  return <form key={`${params.search || ""}:${params.status || "all"}`} action={basePath} className="flex flex-col gap-3 sm:flex-row sm:items-end">
    <div className="flex-1"><label htmlFor="query-search" className="mb-1.5 block text-xs font-bold text-slate-600">Search queries</label>
      <input id="query-search" name="search" defaultValue={params.search || ""} maxLength={100} placeholder={admin ? "Subject, message, name, email or phone" : "Search subject or message"} className="h-11 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-100" /></div>
    <div><label htmlFor="query-status" className="mb-1.5 block text-xs font-bold text-slate-600">Status</label>
      <select id="query-status" name="status" defaultValue={params.status || "all"} className="h-11 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm sm:w-36"><option value="all">All queries</option><option value="unseen">Unseen</option><option value="seen">Seen</option></select></div>
    <button type="submit" className="h-11 rounded-xl bg-teal-800 px-5 text-sm font-bold text-white! hover:bg-teal-700">Apply filters</button>
    {params.search || ["seen", "unseen"].includes(params.status) ? <Link href={basePath} className="inline-flex h-11 items-center justify-center rounded-xl border border-slate-200 px-4 text-sm font-bold text-slate-600">Clear</Link> : null}
  </form>;
}

export function QueryPagination({ data, basePath, params }) {
  if (!data || data.total === 0) return null;
  const pages = Math.max(1, Math.ceil(data.total / data.pageSize));
  function href(page) {
    const search = new URLSearchParams();
    if (params.search) search.set("search", params.search);
    if (["seen", "unseen"].includes(params.status)) search.set("status", params.status);
    search.set("page", String(page));
    return `${basePath}?${search}`;
  }
  const buttonClass = "rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-bold text-slate-600 hover:border-teal-300";
  return <nav aria-label="Query pagination" className="flex flex-wrap items-center justify-between gap-3 border-t border-slate-100 pt-4">
    <p className="text-sm text-slate-500">{data.total} {data.total === 1 ? "query" : "queries"} · Page {data.page} of {pages}</p>
    <div className="flex gap-2">{data.page > 1 ? <Link href={href(data.page - 1)} className={buttonClass}>Previous</Link> : null}{data.page < pages ? <Link href={href(data.page + 1)} className={buttonClass}>Next</Link> : null}</div>
  </nav>;
}
