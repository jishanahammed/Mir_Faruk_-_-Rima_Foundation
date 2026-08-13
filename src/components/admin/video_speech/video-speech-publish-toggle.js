"use client";

import { useTransition } from "react";

export function VideoSpeechPublishToggle({ id, isPublished, action }) {
  const [isPending, startTransition] = useTransition();

  function handleChange(e) {
    const newStatus = e.target.checked;
    const fd = new FormData();
    fd.set("id", id);
    fd.set("isPublished", String(newStatus));
    startTransition(async () => { await action(fd); });
  }

  return (
    <label className="inline-flex cursor-pointer items-center gap-2">
      <div className="relative">
        <input
          type="checkbox"
          className="sr-only"
          checked={isPublished}
          disabled={isPending}
          onChange={handleChange}
        />
        <div
          className={`h-5 w-9 rounded-full transition-colors duration-200 ${
            isPublished ? "bg-emerald-500" : "bg-slate-200"
          } ${isPending ? "opacity-50" : ""}`}
        />
        <div
          className={`absolute top-0.5 left-0.5 h-4 w-4 rounded-full bg-white shadow transition-transform duration-200 ${
            isPublished ? "translate-x-4" : "translate-x-0"
          }`}
        />
      </div>
      <span className={`text-xs font-semibold ${isPublished ? "text-emerald-700" : "text-slate-400"}`}>
        {isPending ? "…" : isPublished ? "Published" : "Draft"}
      </span>
    </label>
  );
}
