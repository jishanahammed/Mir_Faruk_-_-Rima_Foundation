"use client";

import { useEffect, useRef, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { setVolunteerQuerySeenAction } from "@/app/admin/volunteer-queries/actions";
import { QueryStatus } from "@/components/shared/volunteer-query-ui";
import { queryDateTime } from "@/lib/volunteer-query-utils";

function QueryDetail({ query, pending, error, onClose, onMarkUnseen }) {
  const dialogRef = useRef(null);
  useEffect(() => {
    const dialog = dialogRef.current;
    dialog.showModal();
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = previousOverflow; if (dialog.open) dialog.close(); };
  }, []);

  return <dialog ref={dialogRef} aria-labelledby="volunteer-query-detail-title" onClose={onClose} onClick={(event) => {
    if (event.target !== event.currentTarget) return;
    const bounds = event.currentTarget.getBoundingClientRect();
    if (event.clientX < bounds.left || event.clientX > bounds.right || event.clientY < bounds.top || event.clientY > bounds.bottom) dialogRef.current.close();
  }} className="fixed inset-0 m-auto max-h-[90dvh] w-[calc(100%-2rem)] max-w-2xl overflow-y-auto rounded-3xl border-0 bg-white p-0 text-slate-900 shadow-2xl backdrop:bg-slate-950/50">
    <div className="flex items-start justify-between gap-4 bg-[linear-gradient(135deg,#0f766e,#0891b2)] p-6 text-white">
      <div className="min-w-0"><p className="text-xs font-bold uppercase tracking-widest text-cyan-100">Volunteer query #{query.id}</p><h2 id="volunteer-query-detail-title" className="mt-2 break-words text-xl font-black">{query.subject}</h2></div>
      <button type="button" autoFocus aria-label="Close query details" onClick={() => dialogRef.current.close()} className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-white/15 text-xl font-bold hover:bg-white/25">×</button>
    </div>
    <div className="space-y-5 p-6">
      {error ? <p role="alert" className="rounded-xl border border-rose-200 bg-rose-50 p-4 text-sm text-rose-700">{error}</p> : null}
      <div className="flex flex-wrap items-center justify-between gap-3"><p className="text-xs text-slate-500">Sent {queryDateTime(query.createdAt)} (Bangladesh time)</p><QueryStatus isSeen={query.isSeen} /></div>
      <dl className="grid gap-4 rounded-2xl border border-slate-200 bg-slate-50 p-4 sm:grid-cols-2">
        <div><dt className="text-xs font-bold uppercase tracking-wider text-slate-400">Volunteer</dt><dd className="mt-1 break-words text-sm font-bold">{query.senderName}</dd></div>
        <div><dt className="text-xs font-bold uppercase tracking-wider text-slate-400">Phone</dt><dd className="mt-1 break-words text-sm">{query.senderPhone}</dd></div>
        <div className="sm:col-span-2"><dt className="text-xs font-bold uppercase tracking-wider text-slate-400">Email</dt><dd className="mt-1 break-words text-sm">{query.senderEmail}</dd></div>
      </dl>
      <div><h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">Message</h3><p className="mt-3 whitespace-pre-wrap break-words text-sm leading-7 text-slate-700">{query.message}</p></div>
      {query.seenAt ? <p className="text-xs text-slate-500">Seen on {queryDateTime(query.seenAt)}</p> : null}
      <div className="flex flex-wrap justify-end gap-3 border-t border-slate-100 pt-4">
        <button type="button" disabled={pending} onClick={() => onMarkUnseen(query.id)} className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-2.5 text-sm font-bold text-amber-800 hover:bg-amber-100 disabled:opacity-50">{pending ? "Updating..." : "Mark as unseen"}</button>
        <button type="button" onClick={() => dialogRef.current.close()} className="rounded-xl bg-slate-950 px-5 py-2.5 text-sm font-bold text-white!">Close</button>
      </div>
    </div>
  </dialog>;
}

export function VolunteerQueryTable({ items, filtered }) {
  const router = useRouter();
  const [active, setActive] = useState(null);
  const [error, setError] = useState(null);
  const [notice, setNotice] = useState(null);
  const [pendingId, setPendingId] = useState(null);
  const [pending, startTransition] = useTransition();

  function update(id, isSeen, open = false) {
    setError(null);
    setNotice(null);
    setPendingId(id);
    startTransition(async () => {
      try {
        const result = await setVolunteerQuerySeenAction(id, isSeen);
        if (!result.success) { setError(result.message); return; }
        if (open) setActive(result.query);
        else {
          setActive(null);
          setNotice(`Query #${id} marked as ${isSeen ? "seen" : "unseen"}.`);
        }
        window.dispatchEvent(new Event("volunteer-queries-updated"));
        router.refresh();
      } catch { setError("Unable to update this query. Please try again."); }
      finally { setPendingId(null); }
    });
  }

  return <div className="space-y-4" aria-busy={pending}>
    {error && !active ? <p role="alert" className="rounded-xl border border-rose-200 bg-rose-50 p-4 text-sm text-rose-700">{error}</p> : null}
    {notice ? <p role="status" className="rounded-xl border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-800">{notice}</p> : null}
    {items.length === 0 ? <div className="rounded-2xl border border-dashed border-slate-200 px-5 py-12 text-center"><p className="text-base font-bold text-slate-700">{filtered ? "No queries match your filters." : "No volunteer queries yet."}</p><p className="mt-2 text-sm text-slate-500">{filtered ? "Try another search or choose a different status." : "New messages from the Volunteer portal will appear here."}</p></div>
      : <div className="space-y-3">{items.map((query) => <article key={query.id} className={`rounded-2xl border p-4 transition sm:p-5 ${query.isSeen ? "border-slate-200 bg-white" : "border-amber-200 bg-amber-50/40"}`}>
        <div className="flex flex-col gap-4 xl:flex-row xl:items-center">
          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-2"><span className="text-xs font-semibold text-slate-400">#{query.id}</span><QueryStatus isSeen={query.isSeen} /><span className="text-xs text-slate-500">{queryDateTime(query.createdAt)}</span></div>
            <h3 className="mt-3 break-words text-base font-bold text-slate-900">{query.subject}</h3>
            <p className="mt-1 line-clamp-2 break-words text-sm leading-6 text-slate-500">{query.message}</p>
            <p className="mt-3 break-words text-xs text-slate-500"><span className="font-bold text-slate-700">{query.senderName}</span> · {query.senderEmail} · {query.senderPhone}</p>
          </div>
          <div className="flex shrink-0 flex-wrap gap-2">
            <button type="button" disabled={pending} onClick={() => update(query.id, true, true)} className="rounded-xl bg-teal-800 px-4 py-2.5 text-sm font-bold text-white! hover:bg-teal-700 disabled:opacity-50">{pendingId === query.id ? "Updating..." : "View query"}</button>
            <button type="button" disabled={pending} onClick={() => update(query.id, !query.isSeen)} className="rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-bold text-slate-600 hover:border-teal-300 disabled:opacity-50">Mark {query.isSeen ? "unseen" : "seen"}</button>
          </div>
        </div>
      </article>)}</div>}
    {active ? <QueryDetail query={active} pending={pending} error={error} onClose={() => setActive(null)} onMarkUnseen={(id) => update(id, false)} /> : null}
  </div>;
}

export function RefreshQueryInboxButton() {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  return <button type="button" disabled={pending} onClick={() => {
    window.dispatchEvent(new Event("volunteer-queries-updated"));
    startTransition(() => router.refresh());
  }} className="rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-bold text-slate-600 hover:border-cyan-300 disabled:opacity-50">{pending ? "Refreshing..." : "Refresh inbox"}</button>;
}
