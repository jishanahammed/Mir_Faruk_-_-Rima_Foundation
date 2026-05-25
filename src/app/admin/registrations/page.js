import { RegistrationTable } from "@/components/admin/registration-table";
import { recentRegistrations } from "@/lib/admin-data";

export const metadata = {
  title: "Admin Registrations | Mir Faruk & Rima Foundation",
};

export default function AdminRegistrationsPage() {
  return (
    <div className="space-y-6">
      <header className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-cyan-700">
            Registrations
          </p>
          <h1 className="mt-2 text-3xl font-bold tracking-tight text-slate-950">
            Registration review queue
          </h1>
        </div>
        <div className="rounded-xl bg-slate-950 px-4 py-3 text-sm font-semibold text-white">
          {recentRegistrations.length} recent records
        </div>
      </header>

      <RegistrationTable registrations={recentRegistrations} />
    </div>
  );
}
