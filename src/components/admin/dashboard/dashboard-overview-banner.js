import { DashboardChip } from "@/components/admin/ui/dashboard-chip";
import { formatCompactCurrency, formatCount } from "@/components/admin/dashboard/dashboard-utils";

export function DashboardOverviewBanner({ overview, summary, donations, generatedAt, warnings }) {
  const healthItems = [
    {
      label: "Pending approvals",
      value: formatCount(overview.pendingApprovals),
      tone: overview.pendingApprovals > 0 ? "amber" : "emerald",
    },
    {
      label: "Average donation",
      value: formatCompactCurrency(overview.averageDonationAmount),
      tone: "cyan",
    },
    {
      label: "Approved donations",
      value: formatCompactCurrency(donations.approvedDonationAmount),
      tone: "emerald",
    },
  ];

  return (
    <section className="overflow-hidden rounded-[32px] bg-[linear-gradient(135deg,#082f49,#0f766e_48%,#164e63)] text-white shadow-[0_30px_90px_-50px_rgba(8,47,73,0.85)]">
      <div className="grid gap-6 px-6 py-7 lg:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)] lg:px-8">
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <DashboardChip tone="cyan">Protected analytics workspace</DashboardChip>
            <DashboardChip tone="slate">{summary.successfulDonationCount} successful donations tracked</DashboardChip>
            {warnings.length ? (
              <DashboardChip tone="amber">{warnings.length} data source warnings</DashboardChip>
            ) : null}
          </div>
          <h1 className="mt-5 max-w-3xl text-3xl font-bold tracking-tight sm:text-4xl">
            Administrative analytics built for day-to-day monitoring and faster decision-making.
          </h1>
          <p className="mt-4 max-w-2xl text-sm leading-7 text-cyan-50/90 sm:text-base">
            Review donor growth, beneficiary workload, volunteer readiness, and donation performance from one
            operational dashboard after admin login.
          </p>
          <p className="mt-5 text-sm text-cyan-100/85">
            Snapshot generated at {new Intl.DateTimeFormat("en-US", {
              month: "short",
              day: "numeric",
              year: "numeric",
              hour: "numeric",
              minute: "2-digit",
            }).format(new Date(generatedAt))}
          </p>
        </div>

        <div className="grid gap-4 rounded-[28px] border border-white/10 bg-white/8 p-4 backdrop-blur-sm sm:grid-cols-3 lg:grid-cols-1">
          {healthItems.map((item) => (
            <div key={item.label} className="rounded-[24px] border border-white/10 bg-slate-950/10 p-4">
              <DashboardChip tone={item.tone}>{item.label}</DashboardChip>
              <p className="mt-4 text-2xl font-bold">{item.value}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
