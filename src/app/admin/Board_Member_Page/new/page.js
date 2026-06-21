import { BoardMemberForm } from "@/components/admin/Board_Member_Components/board-member-form";
import { createBoardMemberAction } from "@/app/admin/Board_Member_Page/actions";

export const metadata = {
  title: "Add Board Member | Admin | Mir Faruk & Rima Foundation",
};

export default function NewBoardMemberPage() {
  return (
    <div className="space-y-5 xl:space-y-6">
      <div className="rounded-[24px] border border-cyan-100 bg-white px-6 py-5 shadow-sm">
        <p className="text-xs font-bold uppercase tracking-[0.22em] text-cyan-700">
          Board Management
        </p>
        <h1 className="mt-1 text-xl font-bold text-slate-950">Add New Board Member</h1>
        <p className="mt-1 text-sm text-slate-500">
          Fill in the details below to add a new member to the foundation board.
        </p>
      </div>

      <BoardMemberForm
        member={null}
        action={createBoardMemberAction}
        returnTo="/admin/Board_Member_Page"
      />
    </div>
  );
}
