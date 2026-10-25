import Link from "next/link";
import { getVolunteerDirectory, getVolunteerProfile } from "@/lib/api/volunteer-portal-service";
import { volunteerErrorMessage } from "@/lib/volunteer-registration";

export const metadata = { title: "Volunteer List | Mir Faruk & Rima Foundation" };

function read(params, key) {
  const value = params[key];
  return String(Array.isArray(value) ? value[0] ?? "" : value ?? "");
}

export default async function VolunteerListPage({ searchParams }) {
  const params = await searchParams;
  const filters = { search: read(params, "search").slice(0, 200), pageSize: "20",
    page: String(Math.max(1, Math.min(2147483647, Number.parseInt(read(params, "page"), 10) || 1))) };
  if (["true", "false"].includes(read(params, "isActive"))) filters.isActive = read(params, "isActive");
  const [directoryResult, profileResult] = await Promise.allSettled([
    getVolunteerDirectory(filters), getVolunteerProfile(),
  ]);
  const data = directoryResult.status === "fulfilled" ? directoryResult.value : null;
  const profile = profileResult.status === "fulfilled" ? profileResult.value : null;
  const error = directoryResult.status === "rejected" ? volunteerErrorMessage(directoryResult.reason) : "";
  const location = profile ? [profile.localGovernment, profile.upazila, profile.district, profile.division].filter(Boolean).join(", ") : "";
  const pages = data ? Math.max(1, Math.ceil(data.total / data.pageSize)) : 1;
  const pageHref = (page) => `/volunteer/volunteers?${new URLSearchParams({ ...filters, page: String(page) })}`;
  const inputClass = "mt-2 w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none focus:border-emerald-400 focus:ring-4 focus:ring-emerald-100";

  return <div className="space-y-6">
    <header><h2 className="text-2xl font-black text-slate-950">Volunteers in your Ward</h2><p className="mt-2 text-sm leading-7 text-slate-600">Find volunteers in your assigned Ward by name, contact details or profession.</p>
      {profile ? <div aria-label="Your assigned Ward" className="mt-4 rounded-2xl border border-emerald-100 bg-emerald-50 px-5 py-4"><p className="text-sm font-bold text-emerald-900">{profile.ward}</p><p className="mt-1 text-sm leading-6 text-slate-600">{location}</p></div> : null}
    </header>
    <form action="/volunteer/volunteers" className="grid items-end gap-4 rounded-3xl border border-emerald-100 bg-white p-5 sm:grid-cols-[1fr_11rem_auto]">
      <label className="text-sm font-bold text-slate-700">Search volunteers<input name="search" defaultValue={filters.search} maxLength={200} placeholder="Name, phone, email, profession or location" className={inputClass} /></label>
      <label className="text-sm font-bold text-slate-700">Active status<select name="isActive" defaultValue={filters.isActive || ""} className={inputClass}><option value="">All statuses</option><option value="true">Active</option><option value="false">Inactive</option></select></label>
      <div className="flex h-12 items-center gap-3"><button type="submit" className="h-full rounded-xl bg-slate-950 px-5 text-sm font-bold text-white hover:bg-emerald-700">Search</button><Link href="/volunteer/volunteers" className="text-sm font-semibold text-emerald-800 underline">Reset</Link></div>
    </form>
    {error ? <p role="alert" className="rounded-2xl border border-red-200 bg-red-50 p-5 text-sm text-red-700">Unable to load volunteers. {error}</p> : data ? <>
      <p className="text-sm text-slate-500">{data.total} {data.total === 1 ? "volunteer" : "volunteers"} found</p>
      <div className="overflow-x-auto rounded-3xl border border-emerald-100 bg-white shadow-sm shadow-emerald-950/5">
        <table className="w-full min-w-[850px] text-left text-sm">
          <caption className="sr-only">Volunteer directory</caption>
          <thead className="bg-emerald-50/70 text-xs uppercase tracking-wide text-emerald-900"><tr>{["Volunteer", "Contact", "Location", "Role", "Status"].map((label) => <th key={label} scope="col" className="px-5 py-4">{label}</th>)}</tr></thead>
          <tbody className="divide-y divide-slate-100">{data.items.length ? data.items.map((item) => <tr key={item.id} className="align-top">
            <td className="px-5 py-5"><p className="font-bold text-slate-950">{item.name}</p><p className="mt-1 text-slate-500">{item.profession}</p></td>
            <td className="px-5 py-5"><a href={`tel:${item.phone}`} className="block text-emerald-800 hover:underline">{item.phone}</a><a href={`mailto:${item.email}`} className="mt-1 block break-all text-slate-600 hover:underline">{item.email}</a></td>
            <td className="px-5 py-5 text-slate-600"><p>{item.division} / {item.district}</p><p className="mt-1">{item.upazila}</p><p className="mt-1 text-xs">{item.localGovernment} / {item.ward}</p></td>
            <td className="px-5 py-5"><span className={`rounded-full px-3 py-1 text-xs font-bold ${item.isLeader ? "bg-emerald-50 text-emerald-800" : "bg-slate-100 text-slate-600"}`}>{item.isLeader ? "Leader" : "Volunteer"}</span></td>
            <td className="px-5 py-5"><p className={item.isActive ? "font-semibold text-emerald-800" : "text-slate-500"}>{item.isActive ? "Active" : "Inactive"}</p><p className="mt-1 text-xs text-slate-500">{item.isApprove ? "Approved" : "Pending approval"}</p></td>
          </tr>) : <tr><td colSpan={5} className="px-5 py-14 text-center text-slate-500">No volunteers found. Try changing your search.</td></tr>}</tbody>
        </table>
      </div>
      <nav aria-label="Volunteer list pages" className="flex items-center justify-between gap-3 text-sm"><p className="text-slate-500">Page {data.page} of {pages}</p><div className="flex gap-3">{data.page > 1 ? <Link href={pageHref(data.page - 1)} className="rounded-xl border border-emerald-100 bg-white px-4 py-2 font-semibold text-emerald-800">Previous</Link> : null}{data.page < pages ? <Link href={pageHref(data.page + 1)} className="rounded-xl border border-emerald-100 bg-white px-4 py-2 font-semibold text-emerald-800">Next</Link> : null}</div></nav>
    </> : null}
  </div>;
}
