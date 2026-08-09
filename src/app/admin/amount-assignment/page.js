import { AmountAssignmentTable } from "@/components/admin/amount-assignment-table";
import { getApiErrorMessage } from "@/lib/api/api-error";
import {
  AMOUNT_ASSIGNMENT_PAGE_SIZE_OPTIONS,
  getAdminAmountAssignmentList,
  normalizeAssignmentStatus,
} from "@/lib/api/admin-amount-assignment-service";

export const metadata = {
  title: "Amount Assignment | Mir Faruk & Rima Foundation",
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
  return AMOUNT_ASSIGNMENT_PAGE_SIZE_OPTIONS.includes(parsed)
    ? parsed
    : AMOUNT_ASSIGNMENT_PAGE_SIZE_OPTIONS[0];
}

function normalizeDate(value) {
  const normalized = String(readSingleValue(value, "")).trim();
  return /^\d{4}-\d{2}-\d{2}$/.test(normalized) ? normalized : "";
}

function buildReturnPath(filters) {
  const params = new URLSearchParams();

  ["search", "assignmentStatus", "dateFrom", "dateTo"].forEach((key) => {
    if (filters[key]) {
      params.set(key, String(filters[key]));
    }
  });

  params.set("page", String(filters.page));
  params.set("pageSize", String(filters.pageSize));

  return `/admin/amount-assignment?${params.toString()}`;
}

export default async function AdminAmountAssignmentPage({ searchParams }) {
  const params = await searchParams;
  const filters = {
    search: String(readSingleValue(params.search, "")).trim(),
    assignmentStatus: normalizeAssignmentStatus(readSingleValue(params.assignmentStatus, "")),
    dateFrom: normalizeDate(params.dateFrom),
    dateTo: normalizeDate(params.dateTo),
    page: normalizePageNumber(params.page),
    pageSize: normalizePageSize(params.pageSize),
  };

  let assignments = {
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
    assignments = await getAdminAmountAssignmentList(filters);
  } catch (error) {
    errorMessage = getApiErrorMessage(error);
  }

  return (
    <div className="space-y-5 xl:space-y-6">
      {errorMessage ? (
        <section className="rounded-[24px] border border-red-200 bg-red-50 px-4 py-3 text-sm leading-6 text-red-700 sm:px-5 sm:py-4">
          <strong className="block font-semibold">Unable to load amount assignments</strong>
          {errorMessage}
        </section>
      ) : null}

      <AmountAssignmentTable
        assignments={assignments}
        filters={filters}
        returnPath={buildReturnPath(filters)}
      />
    </div>
  );
}
