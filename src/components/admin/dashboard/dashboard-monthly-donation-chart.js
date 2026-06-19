import { DashboardPanel } from "@/components/admin/ui/dashboard-panel";
import {
  formatCompactCurrency,
  formatCurrency,
} from "@/components/admin/dashboard/dashboard-utils";

export function DashboardMonthlyDonationChart({ donations }) {
  const maxAmount = Math.max(...donations.monthlySeries.map((item) => item.totalAmount), 1);

  return (
    <DashboardPanel
      eyebrow="Monthly donation report"
      title={`Year-wise analysis for ${donations.selectedYear}`}
      description="The chart below shows how much donation was recorded in each month so the admin can identify seasonal donation patterns."
      action={<span className="text-sm font-semibold text-cyan-700">{formatCurrency(donations.totalDonationAmount)} total received</span>}
      className="h-full"
    >
      <div className="space-y-5">
        <div className="grid grid-cols-12 items-end gap-2 sm:gap-3">
          {donations.monthlySeries.map((item) => {
            const height = `${Math.max((item.totalAmount / maxAmount) * 100, item.totalAmount ? 16 : 4)}%`;

            return (
              <div key={item.month} className="flex min-w-0 flex-col items-center gap-2">
                <span className="text-[10px] font-semibold text-slate-400 sm:text-xs">
                  {item.totalAmount ? formatCompactCurrency(item.totalAmount) : "0"}
                </span>
                <div className="flex h-52 w-full items-end rounded-full bg-slate-100 px-1 py-1">
                  <div
                    className="w-full rounded-full bg-[linear-gradient(180deg,#06b6d4,#0f766e)] shadow-[0_14px_28px_-18px_rgba(15,118,110,0.9)]"
                    style={{ height }}
                    title={`${item.month}: ${formatCurrency(item.totalAmount)}`}
                  />
                </div>
                <span className="text-xs font-semibold uppercase tracking-[0.12em] text-slate-500">
                  {item.month}
                </span>
              </div>
            );
          })}
        </div>

        <div className="grid gap-3 sm:grid-cols-3">
          <div className="rounded-[22px] border border-cyan-100 bg-cyan-50/70 p-4">
            <p className="text-xs font-semibold uppercase tracking-[0.14em] text-cyan-700">Approved donations</p>
            <p className="mt-3 text-2xl font-bold text-slate-950">{formatCurrency(donations.approvedDonationAmount)}</p>
          </div>
          <div className="rounded-[22px] border border-amber-100 bg-amber-50/80 p-4">
            <p className="text-xs font-semibold uppercase tracking-[0.14em] text-amber-700">Awaiting approval</p>
            <p className="mt-3 text-2xl font-bold text-slate-950">{formatCurrency(donations.waitingApprovalAmount)}</p>
          </div>
          <div className="rounded-[22px] border border-emerald-100 bg-emerald-50/80 p-4">
            <p className="text-xs font-semibold uppercase tracking-[0.14em] text-emerald-700">Payment success rate</p>
            <p className="mt-3 text-2xl font-bold text-slate-950">{donations.paymentSuccessRate}%</p>
          </div>
        </div>
      </div>
    </DashboardPanel>
  );
}
