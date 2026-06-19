import { AdminDashboardView } from "@/components/admin/dashboard/admin-dashboard-view";
import { getAdminDashboardData } from "@/lib/api/admin-dashboard-service";

export const metadata = {
  title: "Admin Dashboard | Mir Faruk & Rima Foundation",
};

export default async function AdminDashboardPage() {
  const dashboard = await getAdminDashboardData();

  return <AdminDashboardView dashboard={dashboard} />;
}
