"use client";

import { useTransition } from "react";

export function ProjectBlogToggle({ id, value, onLabel, offLabel, fieldName, action }) {
  const [isPending, startTransition] = useTransition();

  function handleClick() {
    const fd = new FormData();
    fd.set("id", id);
    fd.set(fieldName, String(!value));
    startTransition(async () => { await action(fd); });
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={isPending}
      className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-semibold transition disabled:opacity-50 ${
        value
          ? "border-emerald-200 bg-emerald-50 text-emerald-700 hover:bg-emerald-100"
          : "border-slate-200 bg-slate-50 text-slate-500 hover:bg-slate-100"
      }`}
    >
      <span className={`h-1.5 w-1.5 rounded-full ${value ? "bg-emerald-500" : "bg-slate-400"}`} />
      {isPending ? "…" : value ? onLabel : offLabel}
    </button>
  );
}
