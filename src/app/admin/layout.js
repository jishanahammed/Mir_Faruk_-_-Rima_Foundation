import { AdminShell } from "@/components/admin/admin-shell";
import { getCurrentAdminUser } from "@/lib/admin-session";
import { getDonationTransactionQuerySummary } from "@/lib/api/admin-donation-transaction-query-service";

// The unseen count changes as donors submit and admins read, so this layout
// is re-evaluated per request rather than cached.
export const dynamic = "force-dynamic";

export const metadata = {
  title: "Admin Dashboard | Mir Faruk & Rima Foundation",
};

export default async function AdminLayout({ children }) {
  const user = await getCurrentAdminUser();

  // Drives the sidebar badge. The service swallows its own errors, so a
  // backend hiccup shows no badge rather than breaking every admin page.
  const { unseen } = await getDonationTransactionQuerySummary();

  return (
    <AdminShell user={user} unseenDonationQueries={unseen}>
      {children}
    </AdminShell>
  );
}
