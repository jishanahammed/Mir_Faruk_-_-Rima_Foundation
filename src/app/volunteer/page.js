import Link from "next/link";
import { getVolunteerDirectory, getVolunteerProfile } from "@/lib/api/volunteer-portal-service";
import { getCurrentVolunteerUser } from "@/lib/volunteer-session";

export const metadata = { title: "Volunteer Dashboard | Mir Faruk & Rima Foundation" };

const panelClass = "rounded-3xl border border-emerald-100 bg-white p-5 shadow-sm shadow-emerald-950/5 sm:p-6";

function registeredDate(value) {
  if (!value) return "Not available";
  // Registration timestamps are stored in UTC, including API values without an offset.
  const timestamp = /(?:Z|[+-]\d{2}:\d{2})$/i.test(value) ? value : `${value}Z`;
  const date = new Date(timestamp);
  return Number.isNaN(date.getTime()) ? "Not available" : new Intl.DateTimeFormat("en-GB", {
    day: "numeric", month: "short", year: "numeric", timeZone: "Asia/Dhaka",
  }).format(date);
}

function StatCard({ label, value, description }) {
  return <div className={panelClass}>
    <dt className="text-xs font-bold uppercase tracking-[0.14em] text-emerald-700">{label}</dt>
    <dd className="mt-3"><p className="text-3xl font-black tracking-tight text-slate-950">{value == null ? "—" : value.toLocaleString("en-GB")}</p><p className="mt-2 text-sm leading-6 text-slate-500">{value == null ? "Temporarily unavailable" : description}</p></dd>
  </div>;
}

function ProfileDetail({ label, children }) {
  return <div className="min-w-0 rounded-2xl bg-slate-50 p-4">
    <dt className="text-xs font-bold uppercase tracking-wide text-slate-400">{label}</dt>
    <dd className="mt-2 break-words text-sm font-semibold leading-6 text-slate-800">{children || "Not provided"}</dd>
  </div>;
}

export default async function VolunteerDashboardPage() {
  const user = await getCurrentVolunteerUser();
  const results = await Promise.allSettled([
    getVolunteerProfile(),
    getVolunteerDirectory({ page: "1", pageSize: "5" }),
    getVolunteerDirectory({ page: "1", pageSize: "1", isActive: "true" }),
    getVolunteerDirectory({ page: "1", pageSize: "1", isApprove: "true" }),
  ]);
  const [profile, directory, active, approved] = results.map((result) => result.status === "fulfilled" ? result.value : null);
  const total = directory?.total ?? null;
  const activeCount = active?.total ?? null;
  const approvedCount = approved?.total ?? null;
  const pendingCount = total != null && approvedCount != null ? Math.max(0, total - approvedCount) : null;
  const hasError = results.some((result) => result.status === "rejected");
  const location = profile ? [profile.localGovernment, profile.upazila, profile.district, profile.division].filter(Boolean).join(", ") : "";

  return <section aria-label="Volunteer dashboard" className="space-y-6">
    <div className="relative overflow-hidden rounded-[32px] border border-emerald-100 bg-[radial-gradient(circle_at_top_left,_rgba(16,185,129,0.18),_transparent_45%),linear-gradient(135deg,#ecfdf5,#ffffff)] p-6 shadow-sm shadow-emerald-950/5 sm:p-8">
      <div aria-hidden="true" className="absolute right-0 top-0 h-36 w-36 rounded-bl-full bg-emerald-100/50" />
      <div className="relative flex flex-col gap-6 xl:flex-row xl:items-center xl:justify-between">
        <div className="min-w-0">
          <p className="text-xs font-black uppercase tracking-[0.22em] text-emerald-700">Your Ward overview</p>
          <h2 className="mt-3 break-words text-2xl font-black tracking-tight text-slate-950 sm:text-3xl">Welcome back, {profile?.name || user.name}.</h2>
          <p className="mt-3 max-w-xl text-sm leading-7 text-slate-600">Follow volunteer activity and registrations in your assigned Ward.</p>
          {profile ? <div aria-label="Your assigned Ward" className="mt-4 border-l-2 border-emerald-400 pl-4"><p className="text-sm font-bold text-emerald-900">{profile.ward}</p><p className="mt-1 max-w-xl text-sm leading-6 text-slate-600">{location}</p></div> : null}
        </div>
        <div className="flex shrink-0 flex-wrap gap-3">
          <Link href="/volunteer/volunteers" className="rounded-2xl bg-emerald-800 px-5 py-3 text-sm font-bold text-white! transition hover:bg-emerald-700">View volunteers</Link>
          <Link href="/volunteer/profile" className="rounded-2xl border border-emerald-200 bg-white px-5 py-3 text-sm font-bold text-emerald-800 transition hover:bg-emerald-50">Update my profile</Link>
        </div>
      </div>
    </div>

    {hasError ? <div role="alert" className="rounded-2xl border border-amber-200 bg-amber-50 px-5 py-4 text-sm leading-6 text-amber-900">Some dashboard information could not be loaded. Refresh the page to try again.</div> : null}

    <section aria-label="Volunteer statistics">
      <dl className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Total volunteers" value={total} description="All registered volunteers in your Ward." />
        <StatCard label="Active volunteers" value={activeCount} description="Volunteers marked as active in your Ward." />
        <StatCard label="Approved volunteers" value={approvedCount} description="Approved registrations in your Ward." />
        <StatCard label="Pending approval" value={pendingCount} description="Ward registrations awaiting review." />
      </dl>
    </section>

    <div className="grid items-start gap-6 xl:grid-cols-2">
      <section aria-labelledby="volunteer-profile-heading" className={panelClass}>
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div><p className="text-xs font-bold uppercase tracking-[0.18em] text-emerald-700">My profile</p><h2 id="volunteer-profile-heading" className="mt-2 text-xl font-black text-slate-950">Your volunteer information</h2></div>
          {profile ? <span className="rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-xs font-bold text-emerald-800">{profile.isLeader ? "Volunteer leader" : "Volunteer"}</span> : null}
        </div>
        {profile ? <>
          <dl className="mt-5 grid gap-3 sm:grid-cols-2">
            <ProfileDetail label="Email"><a href={`mailto:${profile.email}`} className="break-all text-emerald-800 hover:underline">{profile.email}</a></ProfileDetail>
            <ProfileDetail label="Mobile"><a href={`tel:${profile.phone}`} className="text-emerald-800 hover:underline">{profile.phone}</a></ProfileDetail>
            <ProfileDetail label="Profession">{profile.profession}</ProfileDetail>
            <ProfileDetail label="Registered on">{registeredDate(profile.createdAt)}</ProfileDetail>
          </dl>
          <div className="mt-4 rounded-2xl border border-emerald-100 bg-emerald-50/50 p-4"><p className="text-xs font-bold uppercase tracking-wide text-emerald-700">My volunteer location</p><p className="mt-2 text-sm font-semibold leading-7 text-slate-800">{location || "Not provided"}{profile.ward ? <span className="block text-slate-500">{profile.ward}</span> : null}</p></div>
          <div className="mt-5 flex flex-wrap gap-2" aria-label="My account status">
            <span className={`rounded-full px-3 py-1 text-xs font-bold ${profile.isActive ? "bg-emerald-50 text-emerald-800" : "bg-slate-100 text-slate-600"}`}>{profile.isActive ? "Active account" : "Inactive account"}</span>
            <span className={`rounded-full px-3 py-1 text-xs font-bold ${profile.isApprove ? "bg-cyan-50 text-cyan-800" : "bg-amber-50 text-amber-800"}`}>{profile.isApprove ? "Profile approved" : "Profile pending approval"}</span>
          </div>
        </> : <p className="mt-5 text-sm leading-7 text-slate-500">Your profile information is temporarily unavailable.</p>}
        <Link href="/volunteer/profile" className="mt-5 inline-flex text-sm font-bold text-emerald-800 hover:underline">Manage my profile <span aria-hidden="true" className="ml-2">→</span></Link>
      </section>

      <section aria-labelledby="recent-volunteers-heading" className={panelClass}>
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div><p className="text-xs font-bold uppercase tracking-[0.18em] text-emerald-700">Volunteer network</p><h2 id="recent-volunteers-heading" className="mt-2 text-xl font-black text-slate-950">Recent volunteers</h2></div>
          <Link href="/volunteer/volunteers" className="text-sm font-bold text-emerald-800 hover:underline">View all <span aria-hidden="true">→</span></Link>
        </div>
        <p className="mt-2 text-sm leading-6 text-slate-500">Latest volunteer registrations in your Ward.</p>
        {directory ? directory.items.length ? <ul className="mt-4 divide-y divide-slate-100">
          {directory.items.map((item) => <li key={item.id} className="flex items-start gap-3 py-4">
            <div aria-hidden="true" className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-emerald-50 text-sm font-black text-emerald-800">{item.name?.trim().slice(0, 1).toUpperCase() || "V"}</div>
            <div className="min-w-0 flex-1"><p className="break-words text-sm font-bold text-slate-950">{item.name}</p><p className="mt-1 break-words text-xs leading-5 text-slate-500">{[item.profession, item.district].filter(Boolean).join(" · ")}</p>{item.isLeader ? <p className="mt-1 text-xs font-semibold text-emerald-700">Volunteer leader</p> : null}</div>
            <span className={`shrink-0 rounded-full px-2.5 py-1 text-xs font-semibold ${item.isActive ? "bg-emerald-50 text-emerald-800" : "bg-slate-100 text-slate-500"}`}>{item.isActive ? "Active" : "Inactive"}</span>
          </li>)}
        </ul> : <p className="mt-5 rounded-2xl bg-slate-50 p-5 text-sm leading-7 text-slate-500">No volunteer registrations in your Ward yet.</p> : <p className="mt-5 text-sm leading-7 text-slate-500">Recent volunteers are temporarily unavailable.</p>}
      </section>
    </div>

    <section className="flex flex-col items-start justify-between gap-4 rounded-3xl border border-emerald-100 bg-white p-5 sm:flex-row sm:items-center sm:p-6">
      <div><h2 className="text-base font-bold text-slate-950">Keep your account secure</h2><p className="mt-1 text-sm leading-6 text-slate-500">Update your password using a verification code sent to your registered email.</p></div>
      <Link href="/volunteer/change-password" className="shrink-0 rounded-2xl border border-emerald-200 px-5 py-3 text-sm font-bold text-emerald-800 transition hover:bg-emerald-50">Change my password</Link>
    </section>
  </section>;
}
