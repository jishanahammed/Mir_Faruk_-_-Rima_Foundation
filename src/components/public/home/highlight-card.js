"use client";

import { useState } from "react";

const TAG_THEMES = [
  {
    text: "text-teal-700",
    chip: "bg-teal-50 ring-teal-200",
    glow: "from-teal-400 to-emerald-500",
    icon: "🤝",
  },
  {
    text: "text-cyan-700",
    chip: "bg-cyan-50 ring-cyan-200",
    glow: "from-cyan-400 to-sky-500",
    icon: "🌱",
  },
  {
    text: "text-amber-700",
    chip: "bg-amber-50 ring-amber-200",
    glow: "from-amber-400 to-orange-500",
    icon: "🔍",
  },
];

// Reusable highlight card in the "Core Purpose" style: an uppercase amber
// label, a highlighted line and optional tag pills. All parts are optional —
// pass only what the page needs. When `tagDetails` provides a description for
// a tag, clicking that tag opens a modal with the fuller explanation.
export function HighlightCard({ label, text, tags = [], tagDetails = {} }) {
  const [activeIndex, setActiveIndex] = useState(null);
  const activeTag = activeIndex === null ? null : tags[activeIndex];
  const activeTheme = activeIndex === null ? TAG_THEMES[0] : TAG_THEMES[activeIndex % 3];

  return (
    <div className="rounded-[2rem] border border-amber-100 bg-[linear-gradient(135deg,_rgba(255,251,235,0.95),_rgba(255,255,255,0.98),_rgba(236,254,255,0.9))] p-5 shadow-lg shadow-amber-100/40">
      {label ? (
        <p className="text-xs font-semibold tracking-[0.28em] text-amber-700 uppercase">
          {label}
        </p>
      ) : null}

      {text ? (
        <p className="mt-3 max-w-2xl text-base font-medium leading-8 text-slate-800 sm:text-lg">
          {text}
        </p>
      ) : null}

      {tags.length > 0 ? (
        <ul className="mt-3 flex list-none flex-wrap items-center gap-x-3 gap-y-1 p-0 text-sm font-semibold">
          {tags.map((tag, index) => {
            const description = tagDetails[tag];
            const theme = TAG_THEMES[index % 3];

            return (
              <li key={tag} className="flex items-center gap-x-3">
                {index > 0 ? (
                  <span className="text-slate-300" aria-hidden="true">
                    •
                  </span>
                ) : null}
                {description ? (
                  <button
                    type="button"
                    onClick={() => setActiveIndex(index)}
                    className={`${theme.text} underline decoration-dotted underline-offset-4 transition hover:opacity-80`}
                  >
                    {tag}
                  </button>
                ) : (
                  <span className={theme.text}>{tag}</span>
                )}
              </li>
            );
          })}
        </ul>
      ) : null}

      {activeTag ? (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 p-4 backdrop-blur-sm animate-[fadeIn_0.2s_ease-out]"
          role="dialog"
          aria-modal="true"
          onClick={() => setActiveIndex(null)}
        >
          <div
            className="relative w-full max-w-md overflow-hidden rounded-3xl bg-white shadow-[0_25px_80px_-15px_rgba(0,0,0,0.35)] ring-1 ring-black/5 animate-[popIn_0.25s_cubic-bezier(0.34,1.56,0.64,1)]"
            onClick={(event) => event.stopPropagation()}
          >
            <div
              className={`h-1.5 w-full bg-linear-to-r ${activeTheme.glow}`}
              aria-hidden="true"
            />

            <div
              className={`absolute -top-16 -right-16 h-40 w-40 rounded-full bg-linear-to-br ${activeTheme.glow} opacity-20 blur-2xl`}
              aria-hidden="true"
            />

            <div className="relative p-7">
              <button
                type="button"
                onClick={() => setActiveIndex(null)}
                aria-label="Close"
                className="absolute right-5 top-5 flex h-8 w-8 items-center justify-center rounded-full bg-slate-100 text-slate-500 transition hover:bg-slate-200 hover:text-slate-700"
              >
                ✕
              </button>

              <div
                className={`flex h-14 w-14 items-center justify-center rounded-2xl bg-linear-to-br ${activeTheme.glow} text-2xl shadow-lg ring-4 ring-white`}
              >
                <span aria-hidden="true">{activeTheme.icon}</span>
              </div>

              <h3 className="mt-4 text-xl font-bold tracking-tight text-slate-900">
                {activeTag}
              </h3>
              <div
                className={`mt-2 h-1 w-12 rounded-full bg-linear-to-r ${activeTheme.glow}`}
                aria-hidden="true"
              />

              <p className="mt-4 text-sm leading-7 text-slate-600">
                {tagDetails[activeTag]}
              </p>

              <button
                type="button"
                onClick={() => setActiveIndex(null)}
                className={`mt-6 w-full rounded-xl bg-linear-to-r ${activeTheme.glow} px-4 py-2.5 text-sm font-semibold text-white shadow-md transition hover:opacity-90`}
              >
                Got it
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
