import { notFound } from "next/navigation";
import { BoardMemberForm } from "@/components/admin/Board_Member_Components/board-member-form";
import { getApiErrorMessage } from "@/lib/api/api-error";
import { getAdminBoardMemberById } from "@/lib/api/admin-board-member-service";
import { updateBoardMemberAction } from "@/app/admin/Board_Member_Page/actions";

export const metadata = {
  title: "Edit Board Member | Admin | Mir Faruk & Rima Foundation",
};

function readSingleValue(value, fallback = "") {
  if (Array.isArray(value)) return value[0] ?? fallback;
  return value ?? fallback;
}

export default async function EditBoardMemberPage({ params, searchParams }) {
  const { id: rawId } = await params;
  const resolvedParams = await searchParams;
  const returnTo = String(readSingleValue(resolvedParams.returnTo, "/admin/Board_Member_Page")).trim();
  const safeReturn = returnTo.startsWith("/admin") ? returnTo : "/admin/Board_Member_Page";

  const id = Number.parseInt(String(rawId ?? ""), 10);

  if (!Number.isFinite(id) || id <= 0) {
    notFound();
  }

  let member = null;
  let errorMessage = "";

  try {
    member = await getAdminBoardMemberById(id);
  } catch (error) {
    errorMessage = getApiErrorMessage(error);
  }

  if (!member && !errorMessage) {
    notFound();
  }

  return (
    <div className="space-y-5 xl:space-y-6">
      <div className="flex items-center justify-between gap-4 rounded-[24px] border border-cyan-100 bg-white px-6 py-5 shadow-sm">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.22em] text-cyan-700">
            Board Management
          </p>
          <h1 className="mt-1 text-xl font-bold text-slate-950">
            Edit Board Member
          </h1>
          {member && (
            <p className="mt-1 text-sm text-slate-500">
              Editing: <span className="font-semibold text-slate-700">{member.nameEn}</span>
            </p>
          )}
        </div>
        <a
          href={safeReturn}
          className="inline-flex h-10 items-center rounded-xl border border-slate-200 bg-white px-4 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
        >
          ← Back
        </a>
      </div>

      {errorMessage ? (
        <section className="rounded-[24px] border border-red-200 bg-red-50 px-5 py-4 text-sm text-red-700">
          <strong className="block font-semibold">Unable to load board member</strong>
          {errorMessage}
        </section>
      ) : null}

      {member ? (
        <BoardMemberForm
          member={member}
          action={updateBoardMemberAction}
          returnTo={safeReturn}
        />
      ) : null}
    </div>
  );
}
