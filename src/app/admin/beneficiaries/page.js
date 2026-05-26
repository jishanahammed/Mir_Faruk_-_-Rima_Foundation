import { BeneficiaryListTable } from "@/components/admin/beneficiary-list-table";
import { getApiErrorMessage } from "@/lib/api/api-error";
import {
  BENEFICIARY_PAGE_SIZE_OPTIONS,
  getAdminBeneficiaryList,
} from "@/lib/api/admin-beneficiary-service";

export const metadata = {
  title: "Admin Beneficiary List | Mir Faruk & Rima Foundation",
};

function readSingleValue(value, fallback = "") {
  if (Array.isArray(value)) {
    return value[0] ?? fallback;
  }

  return value ?? fallback;
}

function normalizePageNumber(value) {
  const parsed = Number.parseInt(String(readSingleValue(value, "")), 10);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : 1;
}

function normalizePageSize(value) {
  const parsed = Number.parseInt(String(readSingleValue(value, "")), 10);
  return BENEFICIARY_PAGE_SIZE_OPTIONS.includes(parsed)
    ? parsed
    : BENEFICIARY_PAGE_SIZE_OPTIONS[0];
}

export default async function AdminBeneficiariesPage({ searchParams }) {
  const params = await searchParams;
  const filters = {
    search: String(readSingleValue(params.search, "")).trim(),
    page: normalizePageNumber(params.page),
    pageSize: normalizePageSize(params.pageSize),
  };

  let beneficiaries = {
    items: [],
    totalCount: 0,
    totalPages: 1,
    pageNumber: filters.page,
    pageSize: filters.pageSize,
    hasNextPage: false,
    hasPreviousPage: false,
  };
  let errorMessage = "";

  try {
    beneficiaries = await getAdminBeneficiaryList(filters);
  } catch (error) {
    errorMessage = getApiErrorMessage(error);
  }

  return (
    <div className="space-y-5 xl:space-y-6">
      {errorMessage ? (
        <section className="rounded-[24px] border border-red-200 bg-red-50 px-4 py-3 text-sm leading-6 text-red-700 sm:px-5 sm:py-4">
          <strong className="block font-semibold">Unable to load beneficiary list</strong>
          {errorMessage}
        </section>
      ) : null}

      <BeneficiaryListTable beneficiaries={beneficiaries} filters={filters} />
    </div>
  );
}
