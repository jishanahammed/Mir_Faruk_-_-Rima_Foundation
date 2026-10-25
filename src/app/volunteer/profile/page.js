import { VolunteerProfileForm } from "@/components/volunteer/volunteer-profile-form";
import { getVolunteerProfile } from "@/lib/api/volunteer-portal-service";
import { volunteerErrorMessage } from "@/lib/volunteer-registration";

export const metadata = { title: "My Profile | Mir Faruk & Rima Foundation" };

export default async function VolunteerProfilePage() {
  let profile;
  let error = "";
  try { profile = await getVolunteerProfile(); }
  catch (err) { error = volunteerErrorMessage(err); }

  return <div className="max-w-4xl space-y-6">
    <header><h2 className="text-2xl font-black text-slate-950">Your volunteer details</h2><p className="mt-2 text-sm leading-7 text-slate-600">Keep your contact information, profession and volunteer location up to date. Your email address is also used to sign in.</p></header>
    {error ? <p role="alert" className="rounded-2xl border border-red-200 bg-red-50 p-5 text-sm text-red-700">Unable to load your profile. {error}</p> : profile ? <VolunteerProfileForm profile={profile} /> : null}
  </div>;
}
