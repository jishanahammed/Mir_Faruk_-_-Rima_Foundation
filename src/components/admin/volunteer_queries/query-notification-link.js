"use client";

import Link from "next/link";

export function QueryNotificationLink({ count, unavailable }) {
  return <Link href="/admin/volunteer-queries?status=unseen" title={unavailable ? "Volunteer query notifications are temporarily unavailable" : "View unseen volunteer queries"} aria-label={`${count == null ? "View" : count} unseen volunteer ${count === 1 ? "query" : "queries"}${unavailable ? "; notifications temporarily unavailable" : ""}`} className="relative flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-cyan-200 bg-cyan-50 text-cyan-800 transition hover:bg-cyan-100 focus:outline-none focus:ring-2 focus:ring-cyan-300">
    <svg aria-hidden="true" className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M18 8a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9M10 21h4" /></svg>
    {count > 0 ? <span className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-amber-500 px-1 text-[10px] font-black text-slate-950 ring-2 ring-white">{count > 99 ? "99+" : count}</span> : unavailable ? <span aria-hidden="true" className="absolute right-0 top-0 h-2 w-2 rounded-full bg-slate-400 ring-2 ring-white" /> : null}
  </Link>;
}
