import { DashboardChip } from "@/components/admin/ui/dashboard-chip";
import { DashboardPanel } from "@/components/admin/ui/dashboard-panel";
import { formatCount } from "@/components/admin/dashboard/dashboard-utils";

function buildChartPoints(items, width, height, padding) {
  const maxApplications = Math.max(...items.map((item) => item.totalApplications), 1);
  const innerWidth = width - padding * 2;
  const innerHeight = height - padding * 2;
  const stepX = items.length > 1 ? innerWidth / (items.length - 1) : innerWidth;

  return items.map((item, index) => {
    const x = padding + index * stepX;
    const y = padding + innerHeight - (item.totalApplications / maxApplications) * innerHeight;

    return {
      ...item,
      x,
      y,
    };
  });
}

function buildLinePath(points) {
  return points
    .map((point, index) => `${index === 0 ? "M" : "L"} ${point.x} ${point.y}`)
    .join(" ");
}

function buildAreaPath(points, height, padding) {
  if (!points.length) {
    return "";
  }

  const firstPoint = points[0];
  const lastPoint = points[points.length - 1];
  const baseline = height - padding;

  return `${buildLinePath(points)} L ${lastPoint.x} ${baseline} L ${firstPoint.x} ${baseline} Z`;
}

export function DashboardBeneficiaryApplicationsChart({ beneficiaries }) {
  const chartWidth = 720;
  const chartHeight = 280;
  const chartPadding = 24;
  const points = buildChartPoints(
    beneficiaries.monthlySeries,
    chartWidth,
    chartHeight,
    chartPadding,
  );
  const linePath = buildLinePath(points);
  const areaPath = buildAreaPath(points, chartHeight, chartPadding);
  const peakMonth = beneficiaries.monthlySeries.reduce(
    (peak, current) =>
      current.totalApplications > peak.totalApplications ? current : peak,
    beneficiaries.monthlySeries[0] ?? { month: "N/A", totalApplications: 0 },
  );
  const averagePerMonth = beneficiaries.monthlySeries.length
    ? Math.round(
        beneficiaries.currentYearApplications / beneficiaries.monthlySeries.length,
      )
    : 0;

  return (
    <DashboardPanel
      eyebrow="Beneficiary applications"
      title={`Current year ${beneficiaries.currentYear} monthly applications`}
      description="This chart shows how many beneficiaries applied in each month of the current year."
      action={
        <span className="text-sm font-semibold text-cyan-700">
          {formatCount(beneficiaries.currentYearApplications)} applications this year
        </span>
      }
      className="h-full"
    >
      <div className="space-y-5">
        <div className="grid gap-4 xl:grid-cols-[minmax(0,1.4fr)_minmax(280px,0.7fr)]">
          <div className="rounded-[24px] border border-emerald-100 bg-[linear-gradient(180deg,#f0fdf4,#ffffff)] p-4">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <p className="text-sm font-semibold text-slate-950">Application trend line</p>
                <p className="mt-1 text-xs text-slate-500">
                  Month-by-month beneficiary application movement for the current year.
                </p>
              </div>
              <DashboardChip tone="emerald">
                Peak: {peakMonth.month} {formatCount(peakMonth.totalApplications)}
              </DashboardChip>
            </div>

            <div className="mt-5 overflow-x-auto">
              <svg
                viewBox={`0 0 ${chartWidth} ${chartHeight}`}
                className="h-72 min-w-[680px] w-full"
                aria-label="Beneficiary applications line chart"
                role="img"
              >
                <defs>
                  <linearGradient id="beneficiary-area-gradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#22c55e" stopOpacity="0.28" />
                    <stop offset="100%" stopColor="#22c55e" stopOpacity="0.03" />
                  </linearGradient>
                </defs>

                {[0, 1, 2, 3].map((level) => {
                  const y =
                    chartPadding +
                    ((chartHeight - chartPadding * 2) / 3) * level;

                  return (
                    <line
                      key={level}
                      x1={chartPadding}
                      y1={y}
                      x2={chartWidth - chartPadding}
                      y2={y}
                      stroke="#dbeafe"
                      strokeDasharray="6 8"
                      strokeWidth="1"
                    />
                  );
                })}

                <path d={areaPath} fill="url(#beneficiary-area-gradient)" />
                <path
                  d={linePath}
                  fill="none"
                  stroke="#15803d"
                  strokeWidth="4"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />

                {points.map((point) => (
                  <g key={point.month}>
                    <circle cx={point.x} cy={point.y} r="6" fill="#ffffff" stroke="#15803d" strokeWidth="3" />
                    <text
                      x={point.x}
                      y={point.y - 14}
                      textAnchor="middle"
                      className="fill-slate-500 text-[11px] font-semibold"
                    >
                      {point.totalApplications}
                    </text>
                    <text
                      x={point.x}
                      y={chartHeight - 6}
                      textAnchor="middle"
                      className="fill-slate-500 text-[11px] font-semibold"
                    >
                      {point.month}
                    </text>
                  </g>
                ))}
              </svg>
            </div>
          </div>

          <div className="space-y-3">
            <div className="rounded-[22px] border border-emerald-100 bg-emerald-50/80 p-4">
              <p className="text-xs font-semibold uppercase tracking-[0.14em] text-emerald-700">
                Total beneficiaries
              </p>
              <p className="mt-3 text-2xl font-bold text-slate-950">
                {formatCount(beneficiaries.totalApplications)}
              </p>
            </div>

            <div className="rounded-[22px] border border-cyan-100 bg-cyan-50/70 p-4">
              <p className="text-xs font-semibold uppercase tracking-[0.14em] text-cyan-700">
                Current year applications
              </p>
              <p className="mt-3 text-2xl font-bold text-slate-950">
                {formatCount(beneficiaries.currentYearApplications)}
              </p>
            </div>

            <div className="rounded-[22px] border border-slate-200 bg-slate-50/80 p-4">
              <p className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-700">
                Average per month
              </p>
              <p className="mt-3 text-2xl font-bold text-slate-950">
                {formatCount(averagePerMonth)}
              </p>
            </div>
          </div>
        </div>

        <div className="grid gap-3 sm:grid-cols-3">
          <div className="rounded-[22px] border border-slate-200 bg-slate-50/80 p-4">
            <p className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-700">
              Status breakdown
            </p>
            <div className="mt-3 flex flex-wrap gap-2">
              {beneficiaries.statusBreakdown.map((item) => (
                <DashboardChip
                  key={item.status}
                  tone={
                    item.status === "Approved"
                      ? "emerald"
                      : item.status === "Pending" || item.status === "UnderReview"
                        ? "amber"
                        : "cyan"
                  }
                >
                  {item.status}: {formatCount(item.count)}
                </DashboardChip>
              ))}
            </div>
          </div>

          <div className="rounded-[22px] border border-lime-100 bg-lime-50/80 p-4">
            <p className="text-xs font-semibold uppercase tracking-[0.14em] text-lime-700">
              Strongest month
            </p>
            <p className="mt-3 text-2xl font-bold text-slate-950">{peakMonth.month}</p>
            <p className="mt-2 text-sm text-slate-600">
              {formatCount(peakMonth.totalApplications)} applications were submitted in the highest month.
            </p>
          </div>

          <div className="rounded-[22px] border border-teal-100 bg-teal-50/80 p-4">
            <p className="text-xs font-semibold uppercase tracking-[0.14em] text-teal-700">
              Year trend
            </p>
            <p className="mt-3 text-2xl font-bold text-slate-950">
              {beneficiaries.currentYearApplications > 0 ? "Active" : "Starting"}
            </p>
            <p className="mt-2 text-sm text-slate-600">
              The chart highlights how beneficiary applications are moving across all 12 months.
            </p>
          </div>
        </div>
      </div>
    </DashboardPanel>
  );
}
