import Link from "next/link";
import { SendQueryForm } from "@/components/volunteer/send-query-form";
import { QueryFilters, QueryPagination, QueryStatus } from "@/components/shared/volunteer-query-ui";
import { getMyVolunteerQueries } from "@/lib/api/volunteer-query-service";
import { getApiErrorMessage } from "@/lib/api/api-error";
import { getCurrentVolunteerUser } from "@/lib/volunteer-session";
import { queryDateTime, queryFilters } from "@/lib/volunteer-query-utils";

export const metadata = { title: "Send Query | Volunteer Portal" };

export default async function SendQueryPage({ searchParams }) {
  await getCurrentVolunteerUser();
  const params = await searchParams;
  let data = null;
  let error = null;
  try { data = await getMyVolunteerQueries(queryFilters(params)); }
  catch (err) { error = getApiErrorMessage(err); }

  return <div className="space-y-6">
    <div className="rounded-3xl border border-emerald-100 bg-[linear-gradient(135deg,#ecfdf5,#fff)] p-6 sm:p-8">
      <p className="text-xs font-bold uppercase tracking-[0.2em] text-emerald-700">Volunteer support</p>
      <h2 className="mt-2 text-2xl font-black text-slate-950">Send a query to our team</h2>
      <p className="mt-2 max-w-2xl text-sm leading-7 text-slate-600">Have a question, need assistance, or want to share an update? Send your message directly to the foundation admin team.</p>
    </div>
    <section aria-labelledby="new-query-title" className="rounded-3xl border border-emerald-100 bg-white p-5 shadow-sm sm:p-7">
      <h3 id="new-query-title" className="text-lg font-black text-slate-900">New query</h3>
      <p className="mb-6 mt-1 text-sm text-slate-500">Give your query a clear subject and include the relevant details.</p>
      <SendQueryForm />
    </section>
    <section aria-labelledby="query-history-title" className="space-y-5 rounded-3xl border border-slate-200 bg-white p-5 shadow-sm sm:p-7">
      <div><h3 id="query-history-title" className="text-lg font-black text-slate-900">My sent queries</h3><p className="mt-1 text-sm text-slate-500">Your message history and admin read status. Times are shown in Bangladesh time.</p></div>
      <QueryFilters basePath="/volunteer/send-query" params={params} />
      {error ? <div role="alert" className="rounded-2xl border border-rose-200 bg-rose-50 p-4 text-sm text-rose-700">Unable to load your sent queries. {error} <Link href="/volunteer/send-query" className="font-bold underline">Try again</Link></div>
        : data?.items?.length ? <div className="space-y-3">{data.items.map((query) => <details key={query.id} className="group rounded-2xl border border-slate-200 p-4 open:bg-slate-50/70">
          <summary className="flex cursor-pointer list-none flex-wrap items-start justify-between gap-3 rounded-lg focus-visible:outline-2 focus-visible:outline-emerald-600">
            <div className="min-w-0 flex-1"><p className="break-words text-sm font-bold text-slate-900">{query.subject}</p><p className="mt-1 text-xs text-slate-500">#{query.id} · {queryDateTime(query.createdAt)}</p></div><QueryStatus isSeen={query.isSeen} />
          </summary>
          <p className="mt-4 whitespace-pre-wrap break-words border-t border-slate-200 pt-4 text-sm leading-7 text-slate-700">{query.message}</p>
          {query.seenAt ? <p className="mt-3 text-xs font-semibold text-emerald-700">Seen by admin on {queryDateTime(query.seenAt)}</p> : <p className="mt-3 text-xs text-slate-500">Waiting for an admin to view this query.</p>}
        </details>)}</div> : <div className="rounded-2xl border border-dashed border-slate-200 p-8 text-center"><p className="text-sm font-bold text-slate-700">{params.search || ["seen", "unseen"].includes(params.status) ? "No queries match your filters." : "You haven’t sent any queries yet."}</p><p className="mt-2 text-sm text-slate-500">Send a query using the form above or change your filters.</p></div>}
      <QueryPagination data={data} basePath="/volunteer/send-query" params={params} />
    </section>
  </div>;
}
