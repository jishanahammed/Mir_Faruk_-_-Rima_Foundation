import Link from "next/link";
import { VolunteerTable } from "@/components/admin/volunteers/volunteer-table";
import { getAdminVolunteers } from "@/lib/api/admin-volunteer-service";
import { volunteerErrorMessage } from "@/lib/volunteer-registration";

export const metadata = { title: "Volunteers | Mir Faruk & Rima Foundation" };

function read(params, key) { const value = params[key]; return String(Array.isArray(value) ? value[0] ?? "" : value ?? ""); }

export default async function AdminVolunteersPage({ searchParams }) {
  const params = await searchParams;
  const filters = { search: read(params, "search").slice(0, 200), page: String(Math.max(1, Math.min(2147483647, Number.parseInt(read(params, "page"), 10) || 1))), pageSize: "20" };
  for (const key of ["isApprove", "isActive"]) {
    const value = read(params, key);
    if (["true", "false"].includes(value)) filters[key] = value;
  }
  let data = { items: [], total: 0, page: 1, pageSize: 20 };
  let error = "";
  try { data = await getAdminVolunteers(filters); }
  catch (err) { error = volunteerErrorMessage(err); }
  const pages = Math.max(1, Math.ceil(data.total / data.pageSize));
  function pageHref(page) { return `/admin/volunteers?${new URLSearchParams({ ...filters, page: String(page) })}`; }
  const selectClass = "w-full rounded-xl border border-slate-300 bg-white px-3 py-2.5 text-sm";

  return (
    <div className="space-y-6">
      <section className="flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-cyan-100 bg-cyan-50 p-5 sm:p-6">
        <div><h1 className="text-2xl font-bold text-slate-900">Volunteer registrations</h1><p className="mt-2 text-sm text-slate-600">Review applications, update contact details and manage approval and active status.</p></div>
        <Link href="/register/volunteer" target="_blank" rel="noopener noreferrer" className="rounded-full bg-cyan-700 px-5 py-3 text-sm font-semibold text-white!">Open registration form ↗</Link>
      </section>
      <form action="/admin/volunteers" className="grid items-end gap-4 rounded-2xl border border-slate-200 bg-white p-5 sm:grid-cols-2 xl:grid-cols-[2fr_1fr_1fr_auto]">
        <label className="space-y-2 text-sm font-semibold text-slate-700"><span>Search volunteers</span><input className={selectClass} name="search" defaultValue={filters.search} maxLength={200} placeholder="Name, phone, email, profession or location" /></label>
        <label className="space-y-2 text-sm font-semibold text-slate-700"><span>Approval</span><select className={selectClass} name="isApprove" defaultValue={filters.isApprove || ""}><option value="">All approvals</option><option value="true">Approved</option><option value="false">Pending</option></select></label>
        <label className="space-y-2 text-sm font-semibold text-slate-700"><span>Active status</span><select className={selectClass} name="isActive" defaultValue={filters.isActive || ""}><option value="">All statuses</option><option value="true">Active</option><option value="false">Inactive</option></select></label>
        <div className="flex items-center gap-3"><button type="submit" className="rounded-xl bg-slate-900 px-5 py-2.5 text-sm font-semibold text-white!">Search</button><Link href="/admin/volunteers" className="text-sm text-slate-600 underline">Reset</Link></div>
      </form>
      {error ? <p role="alert" className="rounded-xl border border-red-200 bg-red-50 p-5 text-sm text-red-700">Unable to load volunteers. {error}</p> : <>
        <p className="text-sm text-slate-500">{data.total} {data.total === 1 ? "registration" : "registrations"} found</p>
        <VolunteerTable items={data.items} />
        <nav aria-label="Volunteer pages" className="flex items-center justify-between text-sm">
          <p className="text-slate-500">Page {data.page} of {pages}</p><div className="flex gap-3">
            {data.page > 1 ? <Link href={pageHref(data.page - 1)} className="rounded-lg border border-slate-200 bg-white px-4 py-2">Previous</Link> : null}
            {data.page < pages ? <Link href={pageHref(data.page + 1)} className="rounded-lg border border-slate-200 bg-white px-4 py-2">Next</Link> : null}
          </div>
        </nav>
      </>}
    </div>
  );
}
