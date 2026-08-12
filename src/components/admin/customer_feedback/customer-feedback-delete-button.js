"use client";

import { useTransition } from "react";
import { deleteCustomerFeedbackAction } from "@/app/admin/customer-feedback/actions";

export function CustomerFeedbackDeleteButton({ id, name }) {
  const [isPending, startTransition] = useTransition();

  function handleSubmit(event) {
    event.preventDefault();
    if (!window.confirm(`Delete feedback from "${name}"? This cannot be undone.`)) return;
    const fd = new FormData(event.currentTarget);
    startTransition(async () => {
      await deleteCustomerFeedbackAction(fd);
    });
  }

  return (
    <form onSubmit={handleSubmit}>
      <input type="hidden" name="id" value={id} />
      <button
        type="submit"
        disabled={isPending}
        className="inline-flex h-8 items-center rounded-lg border border-red-200 bg-white px-3 text-xs font-semibold text-red-600 transition hover:bg-red-50 disabled:opacity-50"
      >
        {isPending ? "…" : "Delete"}
      </button>
    </form>
  );
}
