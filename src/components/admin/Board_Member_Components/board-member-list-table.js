import Link from "next/link";
import { AutoSubmitSelect } from "@/components/admin/auto-submit-select";
import { updateBoardMemberStatusAction } from "@/app/admin/Board_Member_Page/actions";
import { BoardMemberDeleteButton } from "@/components/admin/Board_Member_Components/board-member-delete-button";
import { BOARD_MEMBER_PAGE_SIZE_OPTIONS } from "@/lib/api/admin-board-member-service";

const avatarGradients = [
  "from-cyan-500 to-teal-600",
  "from-violet-500 to-purple-600",
  "from-rose-500 to-pink-600",
  "from-amber-500 to-orange-600",
  "from-emerald-500 to-green-600",
  "from-sky-500 to-blue-600",
];

function getAvatarGradient(id) {
  return avatarGradients[Number(id) % avatarGradients.length];
}

function getInitials(name) {
  return (
    String(name ?? "")
      .split(" ")
      .filter(Boolean)
      .slice(0, 2)
      .map((part) => part[0]?.toUpperCase())
      .join("") || "BM"
  );
}

function formatDate(value) {
  if (!value) return "—";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "—";
  return new Intl.DateTimeFormat("en-GB", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  })
    .format(date)
    .replaceAll("/", "-");
}

function buildListHref(filters, overrides = {}) {
  const params = new URLSearchParams();
  const next = {
    search: filters.search ?? "",
    page: filters.page ?? 1,
    pageSize: filters.pageSize ?? BOARD_MEMBER_PAGE_SIZE_OPTIONS[0],
    ...overrides,
  };
  if (next.search) params.set("search", next.search);
  params.set("page", String(next.page));
  params.set("pageSize", String(next.pageSize));
  return `/admin/Board_Member_Page?${params.toString()}`;
}

function getPaginationItems(pageNumber, totalPages) {
  if (totalPages <= 7) {
    return Array.from({ length: totalPages }, (_, i) => i + 1);
  }
  const items = [1];
  if (pageNumber > 3) items.push("start-ellipsis");
  for (
    let p = Math.max(2, pageNumber - 1);
    p <= Math.min(totalPages - 1, pageNumber + 1);
    p += 1
  ) {
    items.push(p);
  }
  if (pageNumber < totalPages - 2) items.push("end-ellipsis");
  items.push(totalPages);
  return items;
}

function StatusBadge({ isActive }) {
  return (
    <span
      className={`inline-flex rounded-full border px-3 py-1 text-xs font-semibold ${
        isActive
          ? "border-emerald-200 bg-emerald-50 text-emerald-700"
          : "border-slate-200 bg-slate-100 text-slate-500"
      }`}
    >
      {isActive ? "Active" : "Inactive"}
    </span>
  );
}

function MemberAvatar({ member }) {
  return member.profileImageAbsoluteUrl ? (
    <img
      src={member.profileImageAbsoluteUrl}
      alt={member.nameEn}
      className="h-12 w-12 rounded-2xl object-cover ring-1 ring-slate-200"
    />
  ) : (
    <div
      className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br ${getAvatarGradient(member.id)} text-sm font-bold text-white`}
    >
      {getInitials(member.nameEn)}
    </div>
  );
}

function MemberAvatarCompact({ member }) {
  return member.profileImageAbsoluteUrl ? (
    <img
      src={member.profileImageAbsoluteUrl}
      alt={member.nameEn}
      className="h-9 w-9 rounded-xl object-cover ring-1 ring-slate-200"
    />
  ) : (
    <div
      className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br ${getAvatarGradient(member.id)} text-xs font-bold text-white`}
    >
      {getInitials(member.nameEn)}
    </div>
  );
}

function StatusToggleForm({ member, returnPath }) {
  return (
    <form action={updateBoardMemberStatusAction}>
      <input type="hidden" name="id" value={member.id} />
      <input type="hidden" name="returnPath" value={returnPath} />
      <AutoSubmitSelect
        name="isActive"
        defaultValue={member.isActive ? "true" : "false"}
        className="h-9 w-[120px] rounded-xl border border-slate-200 bg-white px-3 text-xs font-medium text-slate-900 outline-none transition focus:border-cyan-400 focus:ring-4 focus:ring-cyan-100"
      >
        <option value="true">Active</option>
        <option value="false">Inactive</option>
      </AutoSubmitSelect>
    </form>
  );
}


function MobileCard({ member, returnPath }) {
  return (
    <article className="rounded-[24px] border border-slate-200 bg-white p-5 shadow-sm shadow-cyan-950/5">
      <div className="flex items-start gap-4">
        <MemberAvatar member={member} />
        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-2">
            <div className="min-w-0">
              <p className="truncate text-base font-semibold text-slate-950">{member.nameEn}</p>
              {member.nameBn && (
                <p className="mt-0.5 truncate text-sm text-slate-500">{member.nameBn}</p>
              )}
            </div>
            <span className="shrink-0 rounded-full border border-slate-200 bg-slate-100 px-2.5 py-0.5 text-xs font-semibold text-slate-600">
              #{member.serialNo}
            </span>
          </div>
          {member.designationEn && (
            <p className="mt-1 text-sm font-medium text-cyan-700">{member.designationEn}</p>
          )}
          {member.organizationNameEn && (
            <p className="mt-0.5 text-xs text-slate-500">{member.organizationNameEn}</p>
          )}
        </div>
      </div>

      <div className="mt-4 flex flex-wrap items-center gap-2">
        <StatusBadge isActive={member.isActive} />
        {member.responsibilityNoteEn && (
          <span className="inline-flex rounded-full border border-cyan-100 bg-cyan-50 px-3 py-1 text-xs text-cyan-700">
            Has note
          </span>
        )}
      </div>

      <div className="mt-4 grid grid-cols-2 gap-2 border-t border-slate-100 pt-4">
        <Link
          href={`/admin/Board_Member_Page/${member.id}?returnTo=${encodeURIComponent(returnPath)}`}
          className="inline-flex h-10 items-center justify-center rounded-xl border border-cyan-200 bg-cyan-50 text-sm font-semibold text-cyan-800 transition hover:bg-cyan-100"
        >
          Edit
        </Link>
        <StatusToggleForm member={member} returnPath={returnPath} />
        <div className="col-span-2">
          <BoardMemberDeleteButton memberId={member.id} memberName={member.nameEn} returnPath={returnPath} />
        </div>
      </div>
    </article>
  );
}

function EmptyState({ hasSearch }) {
  return (
    <div className="mx-auto max-w-md px-6 py-16 text-center">
      <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-3xl bg-cyan-50 text-cyan-700 ring-1 ring-cyan-100">
        <svg
          className="h-8 w-8"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
          viewBox="0 0 24 24"
          aria-hidden="true"
        >
          <path
            d="M17 20a5 5 0 0 0-10 0M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8Z"
            strokeLinecap="round"
          />
        </svg>
      </div>
      <h3 className="mt-5 text-lg font-bold text-slate-950">No board members found</h3>
      <p className="mt-2 text-sm leading-6 text-slate-500">
        {hasSearch
          ? "Try a different search term or reset filters."
          : "Add your first board member using the button above."}
      </p>
    </div>
  );
}

export function BoardMemberListTable({ boardMembers, filters }) {
  const items = boardMembers.items ?? [];
  const startItem =
    boardMembers.totalCount === 0
      ? 0
      : (boardMembers.pageNumber - 1) * boardMembers.pageSize + 1;
  const endItem =
    boardMembers.totalCount === 0
      ? 0
      : Math.min(boardMembers.pageNumber * boardMembers.pageSize, boardMembers.totalCount);
  const paginationItems = getPaginationItems(boardMembers.pageNumber, boardMembers.totalPages);
  const currentListHref = buildListHref(filters, { page: boardMembers.pageNumber });

  return (
    <div className="space-y-6">
      <section className="overflow-hidden rounded-[30px] border border-cyan-100 bg-white shadow-xl shadow-cyan-950/5">
        {/* Header */}
        <div className="border-b border-cyan-100 bg-[radial-gradient(circle_at_top_left,_rgba(34,211,238,0.18),_transparent_38%),linear-gradient(135deg,#f8fafc,#effcff)] p-6">
          <div className="flex flex-col gap-6">
            <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.22em] text-cyan-700">
                  Board Member Directory
                </p>
                <p className="mt-1 text-2xl font-bold text-slate-950">Board Members</p>
              </div>

              <div className="flex flex-wrap items-center gap-3">
                <span className="inline-flex rounded-full border border-cyan-200 bg-cyan-50 px-3 py-1 text-xs font-semibold text-cyan-700">
                  {boardMembers.totalCount} total members
                </span>
                <Link
                  href="/admin/Board_Member_Page/new"
                  className="inline-flex h-10 items-center gap-2 rounded-2xl bg-[linear-gradient(135deg,#0f766e,#0891b2)] px-5 text-sm font-semibold text-white shadow-lg shadow-cyan-200/80 transition hover:-translate-y-0.5 hover:shadow-xl hover:shadow-cyan-300/70"
                >
                  <svg
                    className="h-4 w-4"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                  >
                    <path d="M12 5v14M5 12h14" strokeLinecap="round" />
                  </svg>
                  Add Member
                </Link>
              </div>
            </div>

            {/* Search bar */}
            <form
              method="get"
              className="grid gap-3 rounded-[24px] border border-white/70 bg-white/85 p-4 shadow-sm backdrop-blur sm:grid-cols-[minmax(0,1.7fr)_170px_auto_auto]"
            >
              <input type="hidden" name="page" value="1" />

              <label className="block">
                <span className="mb-2 block text-xs font-semibold uppercase tracking-[0.14em] text-slate-500">
                  Search member
                </span>
                <div className="relative">
                  <span className="pointer-events-none absolute inset-y-0 left-4 flex items-center text-slate-400">
                    <svg
                      className="h-4 w-4"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      viewBox="0 0 24 24"
                      aria-hidden="true"
                    >
                      <path d="m21 21-4.35-4.35" strokeLinecap="round" />
                      <circle cx="11" cy="11" r="6" />
                    </svg>
                  </span>
                  <input
                    type="search"
                    name="search"
                    defaultValue={filters.search}
                    placeholder="Search name, designation, organization..."
                    className="h-12 w-full rounded-2xl border border-slate-200 bg-white pl-11 pr-4 text-sm font-medium text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-cyan-400 focus:ring-4 focus:ring-cyan-100"
                  />
                </div>
              </label>

              <button
                type="submit"
                className="inline-flex h-12 items-center justify-center self-end rounded-2xl bg-[linear-gradient(135deg,#0f766e,#0891b2)] px-5 text-sm font-semibold text-white shadow-lg shadow-cyan-200/80 transition hover:-translate-y-0.5"
              >
                Search
              </button>

              <Link
                href="/admin/Board_Member_Page"
                className="inline-flex h-12 items-center justify-center self-end rounded-2xl border border-red-500 bg-white px-5 text-sm font-semibold !text-red-500 transition hover:bg-red-50"
              >
                Reset
              </Link>

              <label className="block">
                <span className="mb-2 block text-xs font-semibold uppercase tracking-[0.14em] text-slate-500">
                  Show per page
                </span>
                <AutoSubmitSelect
                  name="pageSize"
                  defaultValue={String(filters.pageSize)}
                  className="h-12 w-full rounded-2xl border border-slate-200 bg-white px-4 text-sm font-medium text-slate-900 outline-none transition focus:border-cyan-400 focus:ring-4 focus:ring-cyan-100"
                >
                  {BOARD_MEMBER_PAGE_SIZE_OPTIONS.map((size) => (
                    <option key={size} value={size}>
                      {size} per page
                    </option>
                  ))}
                </AutoSubmitSelect>
              </label>
            </form>
          </div>
        </div>

        {/* Count row */}
        <div className="flex flex-col gap-3 border-b border-slate-100 px-6 py-4 text-sm sm:flex-row sm:items-center sm:justify-between">
          <p className="text-slate-600">
            Showing <span className="font-semibold text-slate-950">{startItem}</span> to{" "}
            <span className="font-semibold text-slate-950">{endItem}</span> of{" "}
            <span className="font-semibold text-slate-950">{boardMembers.totalCount}</span> members
          </p>
          <p className="text-slate-500">
            Page <span className="font-semibold text-slate-950">{boardMembers.pageNumber}</span> of{" "}
            <span className="font-semibold text-slate-950">{boardMembers.totalPages}</span>
          </p>
        </div>

        {/* Content */}
        {items.length ? (
          <>
            {/* Mobile cards */}
            <div className="grid gap-4 p-4 lg:hidden">
              {items.map((item) => (
                <MobileCard key={item.id} member={item} returnPath={currentListHref} />
              ))}
            </div>

            {/* Desktop table */}
            <div className="hidden overflow-x-auto lg:block">
              <table className="min-w-full divide-y divide-slate-200 text-left text-xs">
                <thead className="bg-slate-50/90 text-[11px] font-semibold uppercase tracking-[0.12em] text-slate-500">
                  <tr>
                    <th className="px-4 py-3 w-12">#</th>
                    <th className="px-4 py-3">Member</th>
                    <th className="px-4 py-3">Designation</th>
                    <th className="px-4 py-3">Organization</th>
                    <th className="px-4 py-3">Status</th>
                    <th className="px-4 py-3">Added</th>
                    <th className="px-4 py-3">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 bg-white">
                  {items.map((item) => (
                    <tr
                      key={item.id}
                      className="align-top transition hover:bg-cyan-50/35"
                    >
                      <td className="px-4 py-3">
                        <span className="inline-flex h-7 w-7 items-center justify-center rounded-lg bg-slate-100 text-[11px] font-bold text-slate-600">
                          {item.serialNo}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-start gap-3">
                          <MemberAvatarCompact member={item} />
                          <div className="min-w-0">
                            <p className="truncate text-sm font-semibold text-slate-950 max-w-[180px]">
                              {item.nameEn}
                            </p>
                            {item.nameBn && (
                              <p className="mt-0.5 truncate text-[11px] text-slate-500 max-w-[180px]">
                                {item.nameBn}
                              </p>
                            )}
                            {item.nameDk && (
                              <p className="mt-0.5 truncate text-[11px] text-slate-400 max-w-[180px]">
                                {item.nameDk}
                              </p>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <p className="text-sm font-medium text-cyan-700 max-w-[160px] truncate">
                          {item.designationEn || "—"}
                        </p>
                        {item.designationBn && (
                          <p className="mt-0.5 text-[11px] text-slate-500 max-w-[160px] truncate">
                            {item.designationBn}
                          </p>
                        )}
                      </td>
                      <td className="px-4 py-3">
                        <p className="text-sm text-slate-700 max-w-[180px] truncate">
                          {item.organizationNameEn || "—"}
                        </p>
                        {item.organizationNameBn && (
                          <p className="mt-0.5 text-[11px] text-slate-500 max-w-[180px] truncate">
                            {item.organizationNameBn}
                          </p>
                        )}
                      </td>
                      <td className="px-4 py-3">
                        <div className="mb-2">
                          <StatusBadge isActive={item.isActive} />
                        </div>
                        <StatusToggleForm member={item} returnPath={currentListHref} />
                      </td>
                      <td className="px-4 py-3 text-slate-600">
                        {formatDate(item.createdAt)}
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex flex-col gap-2">
                          <Link
                            href={`/admin/Board_Member_Page/${item.id}?returnTo=${encodeURIComponent(currentListHref)}`}
                            className="inline-flex h-9 items-center justify-center gap-1.5 rounded-xl border border-cyan-200 bg-cyan-50 px-3 text-xs font-semibold text-cyan-800 transition hover:bg-cyan-100"
                          >
                            <svg
                              className="h-3.5 w-3.5"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="2"
                              viewBox="0 0 24 24"
                              aria-hidden="true"
                            >
                              <path
                                d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"
                                strokeLinecap="round"
                              />
                              <path
                                d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5Z"
                                strokeLinecap="round"
                              />
                            </svg>
                            Edit
                          </Link>
                          <BoardMemberDeleteButton memberId={item.id} memberName={item.nameEn} returnPath={currentListHref} />
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        ) : (
          <EmptyState hasSearch={Boolean(filters.search)} />
        )}

        {/* Pagination */}
        <div className="flex flex-col gap-4 border-t border-slate-100 px-6 py-5 sm:flex-row sm:items-center sm:justify-between">
          <div className="text-sm text-slate-500">
            Manage foundation board members — add, edit status, or remove entries.
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <Link
              href={buildListHref(filters, { page: Math.max(1, boardMembers.pageNumber - 1) })}
              aria-disabled={!boardMembers.hasPreviousPage}
              className={`inline-flex h-10 items-center justify-center rounded-xl px-4 text-sm font-semibold transition ${
                boardMembers.hasPreviousPage
                  ? "border border-slate-200 bg-white text-slate-700 hover:bg-slate-50"
                  : "cursor-not-allowed border border-slate-100 bg-slate-50 text-slate-300"
              }`}
            >
              Previous
            </Link>

            {paginationItems.map((item) => {
              if (typeof item !== "number") {
                return (
                  <span key={item} className="px-2 text-sm font-semibold text-slate-400">
                    ...
                  </span>
                );
              }

              const isActive = item === boardMembers.pageNumber;

              return (
                <Link
                  key={item}
                  href={buildListHref(filters, { page: item })}
                  prefetch={false}
                  aria-current={isActive ? "page" : undefined}
                  className={`inline-flex h-10 min-w-10 items-center justify-center rounded-xl px-3 text-sm font-semibold transition ${
                    isActive
                      ? "border border-cyan-200 bg-white text-cyan-800 shadow-md shadow-cyan-100/80 ring-2 ring-cyan-100"
                      : "border border-slate-200 bg-white text-slate-700 hover:bg-slate-50"
                  }`}
                >
                  {item}
                </Link>
              );
            })}

            <Link
              href={buildListHref(filters, {
                page: Math.min(boardMembers.totalPages, boardMembers.pageNumber + 1),
              })}
              aria-disabled={!boardMembers.hasNextPage}
              className={`inline-flex h-10 items-center justify-center rounded-xl px-4 text-sm font-semibold transition ${
                boardMembers.hasNextPage
                  ? "border border-slate-200 bg-white text-slate-700 hover:bg-slate-50"
                  : "cursor-not-allowed border border-slate-100 bg-slate-50 text-slate-300"
              }`}
            >
              Next
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
