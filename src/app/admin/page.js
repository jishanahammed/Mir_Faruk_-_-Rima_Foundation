import { ProfileInformation } from "@/components/admin/profile-information";
import { RegistrationTable } from "@/components/admin/registration-table";
import { StatCardGrid } from "@/components/admin/stat-card-grid";
import { TaskList } from "@/components/admin/task-list";
import {
  adminTasks,
  dashboardStats,
  recentRegistrations,
} from "@/lib/admin-data";
import { getCurrentAdminUser } from "@/lib/admin-session";

export default async function AdminDashboardPage() {
  const user = await getCurrentAdminUser();

  return (
    <div className="space-y-6">
      <header className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-cyan-700">
            Admin Dashboard
          </p>
          <h1 className="mt-2 text-3xl font-bold tracking-tight text-slate-950">
            Foundation operations overview
          </h1>
        </div>
        <div className="rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-600 shadow-sm">
          Protected admin area
        </div>
      </header>

      <StatCardGrid stats={dashboardStats} />

      <div className="grid gap-6 xl:grid-cols-[1.35fr_0.65fr]">
        <RegistrationTable registrations={recentRegistrations} />
        <div className="space-y-6">
          <ProfileInformation user={user} />
          <TaskList tasks={adminTasks} />
        </div>
      </div>
    </div>
  );
}
