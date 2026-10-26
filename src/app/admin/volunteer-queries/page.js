import Link from "next/link";
import { RefreshQueryInboxButton, VolunteerQueryTable } from "@/components/admin/volunteer_queries/volunteer-query-table";
import { QueryFilters, QueryPagination } from "@/components/shared/volunteer-query-ui";
import { getAdminVolunteerQueries, getVolunteerQuerySummary } from "@/lib/api/volunteer-query-service";
import { getApiErrorMessage } from "@/lib/api/api-error";
import { queryFilters } from "@/lib/volunteer-query-utils";

export const metadata = { title: "Volunteer Queries | Admin" };

export default async function VolunteerQueriesPage({ searchParams }) {
  const params = await searchParams;
  const results = await Promise.allSettled([getAdminVolunteerQueries(queryFilters(params)), getVolunteerQuerySummary()]);
  const data = results[0].status === "fulfilled" ? results[0].value : null;
  const summary = results[1].status === "fulfilled" ? results[1].value : null;
  const error = results[0].status === "rejected" ? getApiErrorMessage(results[0].reason) : null;
  const cards = [
    { label: "All queries", value: summary?.total, href: "/admin/volunteer-queries", color: "border-cyan-100 bg-cyan-50/70 text-cyan-800" },
    { label: "Unseen", value: summary?.unseen, href: "/admin/volunteer-queries?status=unseen", color: "border-amber-200 bg-amber-50/70 text-amber-800" },
    { label: "Seen", value: summary?.seen, href: "/admin/volunteer-queries?status=seen", color: "border-emerald-100 bg-emerald-50/70 text-emerald-800" },
  ];

  return <div className="space-y-6">
    <div className="flex flex-wrap items-start justify-between gap-4">
      <div><p className="text-xs font-bold uppercase tracking-[0.2em] text-cyan-700">Volunteer support</p><h1 className="mt-2 text-2xl font-black text-slate-950">Volunteer Queries</h1><p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500">Review messages sent by volunteers. Opening a query marks it seen; mark it unseen to keep it in your follow-up queue.</p></div>
      <RefreshQueryInboxButton />
    </div>
    <div className="grid grid-cols-3 gap-3 sm:gap-5">{cards.map((card) => <Link key={card.label} href={card.href} className={`rounded-2xl border p-4 transition hover:shadow-sm sm:p-6 ${card.color}`}><p className="text-xs font-bold sm:text-sm">{card.label}</p><p className="mt-2 text-2xl font-black sm:text-3xl">{card.value == null ? "—" : card.value.toLocaleString("en-GB")}</p></Link>)}</div>
    <section aria-label="Volunteer query inbox" className="space-y-5 rounded-3xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
      <div className="flex flex-wrap items-center justify-between gap-2"><h2 className="text-lg font-black text-slate-900">Query inbox</h2><p className="text-xs text-slate-500">Unseen first · Bangladesh time</p></div>
      <QueryFilters basePath="/admin/volunteer-queries" params={params} admin />
      {error ? <div role="alert" className="rounded-2xl border border-rose-200 bg-rose-50 p-4 text-sm text-rose-700">Unable to load volunteer queries. {error} <Link href="/admin/volunteer-queries" className="font-bold underline">Try again</Link></div>
        : <VolunteerQueryTable items={data?.items || []} filtered={Boolean(params.search || ["seen", "unseen"].includes(params.status))} />}
      <QueryPagination data={data} basePath="/admin/volunteer-queries" params={params} />
    </section>
  </div>;
}
