"use client";

import { deleteBoardMemberAction } from "@/app/admin/Board_Member_Page/actions";

export function BoardMemberDeleteButton({ memberId, memberName, returnPath }) {
  return (
    <form
      action={deleteBoardMemberAction}
      onSubmit={(e) => {
        if (!window.confirm(`Delete "${memberName}"? This cannot be undone.`)) {
          e.preventDefault();
        }
      }}
    >
      <input type="hidden" name="id" value={memberId} />
      <input type="hidden" name="returnPath" value={returnPath} />
      <button
        type="submit"
        className="inline-flex h-9 w-full items-center justify-center rounded-xl border border-red-200 bg-red-50 px-3 text-xs font-semibold text-red-700 transition hover:border-red-300 hover:bg-red-100"
      >
        Delete
      </button>
    </form>
  );
}
