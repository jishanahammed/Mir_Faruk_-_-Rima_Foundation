import { DashboardChip } from "@/components/admin/ui/dashboard-chip";
import { DashboardPanel } from "@/components/admin/ui/dashboard-panel";
import { formatCompactCurrency, formatCount } from "@/components/admin/dashboard/dashboard-utils";

export function DashboardYearlyDonationChart({ donations }) {
  const maxAmount = Math.max(...donations.yearlyTotals.map((item) => item.totalAmount), 1);

  return (
    <DashboardPanel
      eyebrow="Donation analytics"
      title="Yearly donation trend and quality checks"
      description="Track yearly totals, donation type concentration, payment status, and admin approval flow in one section."
      className="h-full"
    >
      <div className="grid gap-6 xl:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)]">
        <div className="space-y-4">
          {donations.yearlyTotals.map((item) => (
            <div key={item.year} className="rounded-[22px] border border-slate-200 bg-slate-50/70 p-4">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className="text-sm font-semibold text-slate-950">{item.year}</p>
                  <p className="mt-1 text-xs text-slate-500">{formatCount(item.paymentCount)} successful payments</p>
                </div>
                <p className="text-lg font-bold text-slate-950">{formatCompactCurrency(item.totalAmount)}</p>
              </div>
              <div className="mt-4 h-3 rounded-full bg-white">
                <div
                  className="h-3 rounded-full bg-[linear-gradient(90deg,#0f766e,#06b6d4)]"
                  style={{ width: `${Math.max((item.totalAmount / maxAmount) * 100, item.totalAmount ? 10 : 2)}%` }}
                />
              </div>
            </div>
          ))}
        </div>

        <div className="space-y-5">
          <div>
            <p className="text-sm font-semibold text-slate-950">Donation types</p>
            <div className="mt-3 flex flex-wrap gap-2">
              {donations.donationTypeTotals.length ? (
                donations.donationTypeTotals.map((item) => (
                  <DashboardChip key={item.type} tone="cyan">
                    {item.type}: {formatCompactCurrency(item.totalAmount)}
                  </DashboardChip>
                ))
              ) : (
                <DashboardChip tone="slate">No successful donation data yet</DashboardChip>
              )}
            </div>
          </div>

          <div>
            <p className="text-sm font-semibold text-slate-950">Payment status</p>
            <div className="mt-3 flex flex-wrap gap-2">
              {donations.paymentStatusBreakdown.map((item) => (
                <DashboardChip key={item.status} tone={item.status === "Success" ? "emerald" : item.status === "Pending" ? "amber" : "rose"}>
                  {item.status}: {formatCount(item.count)}
                </DashboardChip>
              ))}
            </div>
          </div>

          <div>
            <p className="text-sm font-semibold text-slate-950">Admin approval status</p>
            <div className="mt-3 flex flex-wrap gap-2">
              {donations.approvalStatusBreakdown.map((item) => (
                <DashboardChip key={item.status} tone={item.status === "Approved" ? "emerald" : item.status === "Waiting" ? "amber" : "rose"}>
                  {item.status}: {formatCount(item.count)}
                </DashboardChip>
              ))}
            </div>
          </div>
        </div>
      </div>
    </DashboardPanel>
  );
}
