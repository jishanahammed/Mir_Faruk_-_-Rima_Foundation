import { AdminShell } from "@/components/admin/admin-shell";
import { getCurrentAdminUser } from "@/lib/admin-session";
import { getDonationTransactionQuerySummary } from "@/lib/api/admin-donation-transaction-query-service";
import { getVolunteerQuerySummary } from "@/lib/api/volunteer-query-service";

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
  const [donationSummary, volunteerSummary] = await Promise.allSettled([
    getDonationTransactionQuerySummary(),
    getVolunteerQuerySummary(),
  ]);
  const unseen = donationSummary.status === "fulfilled" ? donationSummary.value.unseen : 0;
  const volunteerUnseen = volunteerSummary.status === "fulfilled" ? volunteerSummary.value.unseen : null;

  return (
    <AdminShell user={user} unseenDonationQueries={unseen} initialVolunteerQueryCount={volunteerUnseen}>
      {children}
    </AdminShell>
  );
}
