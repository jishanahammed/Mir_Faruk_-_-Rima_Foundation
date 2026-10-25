import { ChangePasswordForm } from "@/components/donor/change-password-form";
import { getVolunteerProfile } from "@/lib/api/volunteer-portal-service";
import { volunteerErrorMessage } from "@/lib/volunteer-registration";

export const metadata = { title: "Change Password | Mir Faruk & Rima Foundation" };

export default async function VolunteerChangePasswordPage() {
  let profile;
  let error = "";
  try { profile = await getVolunteerProfile(); }
  catch (err) { error = volunteerErrorMessage(err); }

  return <div className="max-w-4xl space-y-6">
    <header><h2 className="text-2xl font-black text-slate-950">Change your password</h2><p className="mt-2 text-sm leading-7 text-slate-600">We will email a verification code to your registered address. Enter the code and your new password to update your login.</p></header>
    {error ? <p role="alert" className="rounded-2xl border border-red-200 bg-red-50 p-5 text-sm text-red-700">Unable to load your account. {error}</p> : profile ? <ChangePasswordForm email={profile.email} /> : null}
  </div>;
}
