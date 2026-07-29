"use client";

import { useTransition } from "react";

const STATUS_STYLES = {
  draft:     { dot: "bg-slate-400",   text: "text-slate-600",   bg: "bg-slate-50",   border: "border-slate-200"  },
  active:    { dot: "bg-emerald-500", text: "text-emerald-700", bg: "bg-emerald-50", border: "border-emerald-200" },
  completed: { dot: "bg-violet-500",  text: "text-violet-700",  bg: "bg-violet-50",  border: "border-violet-200"  },
  cancelled: { dot: "bg-rose-400",    text: "text-rose-700",    bg: "bg-rose-50",    border: "border-rose-200"  },
};

const STATUS_OPTIONS = ["draft", "active", "completed", "cancelled"];

export function EmergencyCampaignStatusBadge({ id, status, action }) {
  const [isPending, startTransition] = useTransition();
  const style = STATUS_STYLES[status] ?? STATUS_STYLES.draft;

  function handleChange(e) {
    const fd = new FormData();
    fd.set("id", id);
    fd.set("status", e.target.value);
    startTransition(async () => { await action(fd); });
  }

  return (
    <div className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 ${style.bg} ${style.border} ${isPending ? "opacity-60" : ""}`}>
      <span className={`h-1.5 w-1.5 rounded-full ${style.dot}`} />
      <select
        value={status}
        onChange={handleChange}
        disabled={isPending}
        className={`border-0 bg-transparent text-xs font-semibold focus:outline-none cursor-pointer ${style.text}`}
      >
        {STATUS_OPTIONS.map((s) => (
          <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>
        ))}
      </select>
    </div>
  );
}
