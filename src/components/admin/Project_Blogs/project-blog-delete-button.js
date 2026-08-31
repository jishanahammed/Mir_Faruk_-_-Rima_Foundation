"use client";

import { useTransition } from "react";

export function ProjectBlogDeleteButton({ id, title, action }) {
  const [isPending, startTransition] = useTransition();

  function handleSubmit(e) {
    e.preventDefault();
    if (!window.confirm(`Delete "${title}"? This cannot be undone.`)) return;
    const fd = new FormData(e.currentTarget);
    startTransition(async () => { await action(fd); });
  }

  return (
    <form onSubmit={handleSubmit}>
      <input type="hidden" name="id" value={id} />
      <button
        type="submit"
        disabled={isPending}
        className="inline-flex items-center gap-1 rounded-lg border border-rose-200 bg-rose-50 px-2.5 py-1.5 text-xs font-semibold text-rose-700 transition hover:bg-rose-100 disabled:opacity-50"
      >
        {isPending ? "…" : "Delete"}
      </button>
    </form>
  );
}
