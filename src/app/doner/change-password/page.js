import { ChangePasswordForm } from "@/components/donor/change-password-form";
import { getCurrentDonorUser } from "@/lib/donor-session";

export const metadata = {
  title: "Change Password | Mir Faruk & Rima Foundation",
};

export default async function DonerChangePasswordPage() {
  const user = await getCurrentDonorUser();

  return (
    <div className="space-y-5">
      <header>
        <p className="text-sm font-bold uppercase tracking-[0.18em] text-emerald-700">
          My Account
        </p>
        <h1 className="mt-2 text-3xl font-black tracking-tight text-slate-950">
          Change your password
        </h1>
        <p className="mt-2 max-w-2xl text-sm leading-7 text-slate-600">
          We&apos;ll email a verification code to your registered address. Enter it
          below along with your new password to update your login.
        </p>
      </header>

      <ChangePasswordForm email={user?.email ?? ""} />
    </div>
  );
}
