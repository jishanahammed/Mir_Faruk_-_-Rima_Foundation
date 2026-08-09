"use client";

import { useTransition } from "react";

export function LocationActiveToggle({ id, name, isActive, action }) {
  const [isPending, startTransition] = useTransition();

  function handleSubmit(e) {
    e.preventDefault();

    const confirmed = isActive
      ? window.confirm(`Deactivate "${name}"? It will disappear from registration and donor dropdowns.`)
      : window.confirm(`Activate "${name}"? It will become selectable in registration and donor dropdowns.`);

    if (!confirmed) return;

    const fd = new FormData(e.currentTarget);
    startTransition(async () => { await action(fd); });
  }

  return (
    <form onSubmit={handleSubmit}>
      <input type="hidden" name="id" value={id} />
      <input type="hidden" name="isActive" value={String(!isActive)} />
      <button
        type="submit"
        disabled={isPending}
        title={isActive ? "Active — click to deactivate" : "Inactive — click to activate"}
        aria-label={isActive ? "Deactivate" : "Activate"}
        className={`inline-flex h-8 w-8 items-center justify-center rounded-lg border text-sm font-bold transition disabled:opacity-50 ${
          isActive
            ? "border-emerald-200 bg-emerald-50 text-emerald-600 hover:bg-emerald-100"
            : "border-red-200 bg-red-50 text-red-600 hover:bg-red-100"
        }`}
      >
        {isPending ? "…" : isActive ? "✓" : "✕"}
      </button>
    </form>
  );
}
