import { DashboardChip } from "@/components/admin/ui/dashboard-chip";
import { DashboardPanel } from "@/components/admin/ui/dashboard-panel";
import {
  formatDateTime,
  getStatusTone,
} from "@/components/admin/dashboard/dashboard-utils";

export function DashboardRecentActivity({ activities, warnings }) {
  return (
    <DashboardPanel
      eyebrow="Overview summary"
      title="Pending approvals and recent activities"
      description="The admin can quickly review the latest system events, follow-ups, and any partial data issues from the source APIs."
      className="h-full"
    >
      <div className="space-y-4">
        {warnings.length ? (
          <div className="rounded-[22px] border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
            <p className="font-semibold">Some analytical sections are partially unavailable.</p>
            <div className="mt-2 flex flex-wrap gap-2">
              {warnings.map((warning) => (
                <DashboardChip key={warning.section} tone="amber">
                  {warning.section}: {warning.message}
                </DashboardChip>
              ))}
            </div>
          </div>
        ) : null}

        <div className="space-y-3">
          {activities.map((activity) => (
            <article
              key={activity.id}
              className="rounded-[22px] border border-slate-200 bg-slate-50/70 p-4"
            >
              <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <DashboardChip tone="cyan">{activity.type}</DashboardChip>
                    <DashboardChip tone={getStatusTone(activity.status)}>{activity.status}</DashboardChip>
                  </div>
                  <h3 className="mt-3 text-base font-bold text-slate-950">{activity.title}</h3>
                  <p className="mt-1 text-sm font-semibold text-slate-700">{activity.name}</p>
                  <p className="mt-2 text-sm leading-6 text-slate-600">{activity.description}</p>
                </div>
                <p className="shrink-0 text-xs font-semibold uppercase tracking-[0.14em] text-slate-500">
                  {formatDateTime(activity.date)}
                </p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </DashboardPanel>
  );
}
