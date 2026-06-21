import { BoardMemberListTable } from "@/components/admin/Board_Member_Components/board-member-list-table";
import { getApiErrorMessage } from "@/lib/api/api-error";
import {
  BOARD_MEMBER_PAGE_SIZE_OPTIONS,
  getAdminBoardMemberList,
} from "@/lib/api/admin-board-member-service";

export const metadata = {
  title: "Board Members | Admin | Mir Faruk & Rima Foundation",
};

function readSingleValue(value, fallback = "") {
  if (Array.isArray(value)) return value[0] ?? fallback;
  return value ?? fallback;
}

function normalizePageNumber(value) {
  const parsed = Number.parseInt(String(readSingleValue(value, "")), 10);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : 1;
}

function normalizePageSize(value) {
  const parsed = Number.parseInt(String(readSingleValue(value, "")), 10);
  return BOARD_MEMBER_PAGE_SIZE_OPTIONS.includes(parsed)
    ? parsed
    : BOARD_MEMBER_PAGE_SIZE_OPTIONS[0];
}

export default async function AdminBoardMemberPage({ searchParams }) {
  const params = await searchParams;
  const filters = {
    search: String(readSingleValue(params.search, "")).trim(),
    page: normalizePageNumber(params.page),
    pageSize: normalizePageSize(params.pageSize),
  };

  let boardMembers = {
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
    boardMembers = await getAdminBoardMemberList(filters);
  } catch (error) {
    errorMessage = getApiErrorMessage(error);
  }

  return (
    <div className="space-y-5 xl:space-y-6">
      {errorMessage ? (
        <section className="rounded-[24px] border border-red-200 bg-red-50 px-4 py-3 text-sm leading-6 text-red-700 sm:px-5 sm:py-4">
          <strong className="block font-semibold">Unable to load board members</strong>
          {errorMessage}
        </section>
      ) : null}

      <BoardMemberListTable boardMembers={boardMembers} filters={filters} />
    </div>
  );
}
