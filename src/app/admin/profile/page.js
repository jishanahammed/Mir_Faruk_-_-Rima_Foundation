import { ProfileInformation } from "@/components/admin/profile-information";
import { getCurrentAdminUser } from "@/lib/admin-session";

export const metadata = {
  title: "Admin Profile | Mir Faruk & Rima Foundation",
};

export default async function AdminProfilePage() {
  const user = await getCurrentAdminUser();

  return (
    <div className="space-y-6">
      <header>
        <p className="text-sm font-semibold uppercase tracking-[0.18em] text-cyan-700">
          Profile
        </p>
        <h1 className="mt-2 text-3xl font-bold tracking-tight text-slate-950">
          Admin profile information
        </h1>
      </header>

      <div className="max-w-3xl">
        <ProfileInformation user={user} />
      </div>
    </div>
  );
}
