import { notFound } from "next/navigation";
import { BeneficiaryProfileView } from "@/components/admin/beneficiary-profile-view";
import { getApiErrorMessage } from "@/lib/api/api-error";
import { getAdminBeneficiaryById } from "@/lib/api/admin-beneficiary-service";

export const metadata = {
  title: "Beneficiary Details | Mir Faruk & Rima Foundation",
};

function readSingleValue(value, fallback = "") {
  if (Array.isArray(value)) {
    return value[0] ?? fallback;
  }

  return value ?? fallback;
}

function readReturnPath(value) {
  const returnPath = String(readSingleValue(value, "/admin/beneficiaries")).trim();
  return returnPath.startsWith("/admin/beneficiaries")
    ? returnPath
    : "/admin/beneficiaries";
}

export default async function AdminBeneficiaryDetailsPage({ params, searchParams }) {
  const { id } = await params;
  const query = await searchParams;
  const backHref = readReturnPath(query.returnTo);
  const currentPath =
    backHref && backHref !== "/admin/beneficiaries"
      ? `/admin/beneficiaries/${id}?returnTo=${encodeURIComponent(backHref)}`
      : `/admin/beneficiaries/${id}`;

  try {
    const beneficiary = await getAdminBeneficiaryById(id);

    if (!beneficiary) {
      notFound();
    }

    return (
      <BeneficiaryProfileView
        beneficiary={beneficiary}
        backHref={backHref}
        currentPath={currentPath}
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
