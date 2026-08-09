import { notFound } from "next/navigation";
import { DonorBeneficiaryProfileView } from "@/components/donor/donor-beneficiary-profile-view";
import { getApiErrorMessage } from "@/lib/api/api-error";
import { getDonorViewBeneficiaryById } from "@/lib/api/admin-beneficiary-service";
import { getCurrentDonorUser } from "@/lib/donor-session";

export const metadata = {
  title: "Beneficiary Profile | Mir Faruk & Rima Foundation",
};

export default async function DonorBeneficiaryDetailsPage({ params }) {
  await getCurrentDonorUser();
  const { id } = await params;

  try {
    const beneficiary = await getDonorViewBeneficiaryById(id);

    if (!beneficiary) {
      notFound();
    }

    return (
      <DonorBeneficiaryProfileView
        beneficiary={beneficiary}
        backHref="/doner/amount-allocation"
      />
    );
  } catch (error) {
    if (error?.status === 404) {
      notFound();
    }

    return (
      <section className="rounded-[28px] border border-red-200 bg-red-50 px-6 py-5 text-sm leading-6 text-red-700">
        <strong className="block font-semibold">Unable to load beneficiary details</strong>
        <span>{getApiErrorMessage(error)}</span>
      </section>
    );
  }
}
