import { DashboardBeneficiaryApplicationsChart } from "@/components/admin/dashboard/dashboard-beneficiary-applications-chart";
import { DashboardMonthlyDonationChart } from "@/components/admin/dashboard/dashboard-monthly-donation-chart";
import { DashboardSummaryCards } from "@/components/admin/dashboard/dashboard-summary-cards";
import { DashboardYearlyDonationChart } from "@/components/admin/dashboard/dashboard-yearly-donation-chart";

export function AdminDashboardView({ dashboard }) {
  return (
    <div className="space-y-6 lg:space-y-7">
      <DashboardSummaryCards
        summary={dashboard.summary}
        overview={dashboard.overview}
        volunteers={dashboard.volunteers}
        donations={dashboard.donations}
      />

      <div className="grid gap-6 2xl:grid-cols-[minmax(0,1.3fr)_minmax(0,1fr)]">
        <DashboardMonthlyDonationChart donations={dashboard.donations} />
        <DashboardYearlyDonationChart donations={dashboard.donations} />
      </div>

      <DashboardBeneficiaryApplicationsChart beneficiaries={dashboard.beneficiaries} />
    </div>
  );
}
