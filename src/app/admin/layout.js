import { AdminShell } from "@/components/admin/admin-shell";
import { getCurrentAdminUser } from "@/lib/admin-session";

export const metadata = {
  title: "Admin Dashboard | Mir Faruk & Rima Foundation",
};

export default async function AdminLayout({ children }) {
  const user = await getCurrentAdminUser();

  return <AdminShell user={user}>{children}</AdminShell>;
}
