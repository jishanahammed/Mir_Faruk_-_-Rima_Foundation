import { DashboardPanel } from "@/components/admin/ui/dashboard-panel";
import { formatCount, formatPercent } from "@/components/admin/dashboard/dashboard-utils";

export function DashboardSectionAnalytics({ sections }) {
  const averagePerformance = sections.length
    ? Math.round(
        sections.reduce((total, section) => total + (Number(section.percentage) || 0), 0) /
          sections.length,
      )
    : 0;

  return (
    <DashboardPanel
      eyebrow="Section-wise analytics"
      title="Operational performance by section"
      description="A cleaner operational snapshot of donor, beneficiary, volunteer, and donation performance."
      className="h-full"
    >
      <div className="space-y-5">
        <div className="grid gap-3 rounded-[24px] border border-cyan-100 bg-[linear-gradient(135deg,#ecfeff,#f8fafc)] p-4 sm:grid-cols-3">
          <div className="rounded-[20px] border border-white/80 bg-white/80 p-4">
            <p className="text-xs font-semibold uppercase tracking-[0.14em] text-cyan-700">
              Tracked sections
            </p>
            <p className="mt-2 text-2xl font-bold text-slate-950">{formatCount(sections.length)}</p>
          </div>
          <div className="rounded-[20px] border border-white/80 bg-white/80 p-4">
            <p className="text-xs font-semibold uppercase tracking-[0.14em] text-cyan-700">
              Average performance
            </p>
            <p className="mt-2 text-2xl font-bold text-slate-950">{formatPercent(averagePerformance)}</p>
          </div>
          <div className="rounded-[20px] border border-white/80 bg-white/80 p-4">
            <p className="text-xs font-semibold uppercase tracking-[0.14em] text-cyan-700">
              Dashboard focus
            </p>
            <p className="mt-2 text-sm font-semibold leading-6 text-slate-700">
              Balanced view across registration, approval, field capacity, and donation flow.
            </p>
          </div>
        </div>

        <div className="grid gap-4 xl:grid-cols-2">
          {sections.map((section, index) => (
            <article
              key={section.label}
              className="flex h-full flex-col rounded-[24px] border border-slate-200 bg-[linear-gradient(180deg,#ffffff,#f8fafc)] p-5 shadow-[0_16px_45px_-40px_rgba(15,23,42,0.35)]"
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-400">
                    Section {index + 1}
                  </p>
                  <p className="mt-2 text-base font-bold text-slate-950">{section.label}</p>
                </div>
                <div className="rounded-full border border-cyan-200 bg-cyan-50 px-3 py-1 text-xs font-semibold text-cyan-800">
                  {formatPercent(section.percentage)}
                </div>
              </div>

              <div className="mt-5 flex items-end justify-between gap-3">
                <div>
                  <p className="text-3xl font-bold tracking-tight text-slate-950">
                    {formatCount(section.total)}
                  </p>
                  <p className="mt-2 text-sm font-semibold text-slate-700">{section.accent}</p>
                </div>
              </div>

              <div className="mt-4 h-2 rounded-full bg-slate-100">
                <div
                  className="h-2 rounded-full bg-[linear-gradient(90deg,#155e75,#06b6d4)]"
                  style={{ width: `${Math.max(Math.min(section.percentage, 100), 8)}%` }}
                />
              </div>

              <div className="mt-4 rounded-[18px] border border-slate-100 bg-white/80 p-4">
                <p className="text-sm leading-6 text-slate-600">{section.note}</p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </DashboardPanel>
  );
}
