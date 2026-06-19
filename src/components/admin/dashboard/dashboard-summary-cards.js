import { DashboardChip } from "@/components/admin/ui/dashboard-chip";
import { formatCompactCurrency, formatCount } from "@/components/admin/dashboard/dashboard-utils";

const cardStyles = [
  {
    accent:
      "from-cyan-600 via-sky-600 to-teal-600",
    ring: "ring-cyan-100",
    chipTone: "cyan",
  },
  {
    accent:
      "from-emerald-600 via-teal-600 to-cyan-600",
    ring: "ring-emerald-100",
    chipTone: "emerald",
  },
  {
    accent:
      "from-amber-500 via-orange-500 to-rose-500",
    ring: "ring-amber-100",
    chipTone: "amber",
  },
  {
    accent:
      "from-slate-900 via-cyan-900 to-slate-800",
    ring: "ring-slate-100",
    chipTone: "slate",
  },
];

export function DashboardSummaryCards({ summary, overview, volunteers, donations }) {
  const cards = [
    {
      label: "Total donors",
      value: formatCount(summary.totalDonors),
      meta: `${formatCount(overview.approvedDonors)} approved profiles`,
      chip: `${overview.pendingApprovals} pending actions`,
    },
    {
      label: "Total beneficiaries",
      value: formatCount(summary.totalBeneficiaries),
      meta: `${formatCount(overview.approvedBeneficiaries)} approved for support`,
      chip: `${formatCount(overview.recentActivitiesCount)} recent activities`,
    },
    {
      label: "Total volunteers",
      value: formatCount(summary.totalVolunteers),
      meta: `${formatCount(volunteers.activeVolunteers)} active across ${formatCount(volunteers.fieldTeams)} teams`,
      chip: `${formatCount(volunteers.availableToday)} available today`,
    },
    {
      label: "Total donations",
      value: formatCompactCurrency(summary.totalDonations),
      meta: `${formatCount(summary.successfulDonationCount)} successful payment records`,
      chip: `${formatCompactCurrency(donations.waitingApprovalAmount)} awaiting approval`,
    },
  ];

  return (
    <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
      {cards.map((card, index) => {
        const style = cardStyles[index] ?? cardStyles[0];

        return (
          <article
            key={card.label}
            className={`relative overflow-hidden rounded-[24px] bg-white p-4 shadow-[0_18px_65px_-45px_rgba(2,132,199,0.45)] ring-1 ${style.ring}`}
          >
            <div className={`absolute inset-x-0 top-0 h-1 bg-gradient-to-r ${style.accent}`} />
            <div className="flex items-start justify-between gap-3">
              <p className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-500">
                {card.label}
              </p>
              <div className="scale-90 origin-top-right">
                <DashboardChip tone={style.chipTone}>{card.chip}</DashboardChip>
              </div>
            </div>
            <p className="mt-6 text-3xl font-bold tracking-tight text-slate-950">{card.value}</p>
            <p className="mt-2 text-xs leading-5 text-slate-600">{card.meta}</p>
          </article>
        );
      })}
    </div>
  );
}
