import { DonorProfileForm } from "@/components/donor/donor-profile-form";
import { getApiErrorMessage } from "@/lib/api/api-error";
import { getCurrentDonorProfile } from "@/lib/api/donor-portal-service";
import { getCurrentDonorUser } from "@/lib/donor-session";

export const metadata = {
  title: "Doner Profile Update | Mir Faruk & Rima Foundation",
};

export default async function DonerProfilePage() {
  const user = await getCurrentDonorUser();
  let donor = null;
  let errorMessage = "";

  try {
    donor = await getCurrentDonorProfile(user);
  } catch (error) {
    errorMessage = getApiErrorMessage(error);
  }

  return (
    <div className="space-y-5">
      <header>
        <p className="text-sm font-bold uppercase tracking-[0.18em] text-emerald-700">
          Doner Profile
        </p>
        <h1 className="mt-2 text-3xl font-black tracking-tight text-slate-950">
          Update your donor information
        </h1>
        <p className="mt-2 max-w-2xl text-sm leading-7 text-slate-600">
          Keep your contact details current so the foundation can maintain accurate
          donation records and communication.
        </p>
      </header>

      {errorMessage ? (
        <section className="rounded-[24px] border border-red-200 bg-red-50 px-4 py-3 text-sm leading-6 text-red-700 sm:px-5 sm:py-4">
          <strong className="block font-semibold">Unable to load donor profile</strong>
          {errorMessage}
        </section>
      ) : null}

      {donor ? <DonorProfileForm donor={donor} /> : null}
    </div>
  );
}
