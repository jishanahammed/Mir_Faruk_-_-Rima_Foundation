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
    <div className="relative rounded-3xl border border-amber-200/90 bg-[linear-gradient(135deg,_rgba(255,251,235,0.96)_0%,_rgba(255,255,255,0.98)_48%,_rgba(236,254,255,0.94)_100%)] px-3 py-3 text-center shadow-[0_24px_65px_-35px_rgba(8,145,178,0.55)] sm:px-5 sm:py-5">
      <div
        className="pointer-events-none absolute inset-0 overflow-hidden rounded-[inherit]"
        aria-hidden="true"
      >
        <div className="absolute -left-16 -top-20 h-44 w-44 rounded-full bg-amber-200/35 blur-3xl" />
        <div className="absolute -bottom-24 -right-16 h-52 w-52 rounded-full bg-cyan-200/35 blur-3xl" />
        <div className="absolute inset-x-12 top-0 h-20 bg-[radial-gradient(ellipse_at_top,_rgba(251,191,36,0.18),_transparent_72%)]" />
      </div>

      <div className="relative">
        {label ? (
          <div className="flex items-center justify-center gap-2 sm:gap-3">
            <div className="relative hidden h-9 max-w-16 flex-1 sm:block" aria-hidden="true">
              <span className="absolute right-0 top-1/2 h-px w-full bg-linear-to-l from-teal-700 via-cyan-500 to-transparent" />
              <span className="absolute right-1 top-[32%] h-px w-3/4 origin-right rotate-[18deg] bg-linear-to-l from-teal-600 to-transparent" />
              <span className="absolute right-1 top-[68%] h-px w-3/4 origin-right -rotate-[18deg] bg-linear-to-l from-cyan-500 to-transparent" />
            </div>

            <p className="rounded-full border border-cyan-200/80 bg-[linear-gradient(135deg,_#0f766e_0%,_#0891b2_70%,_#f59e0b_100%)] px-3 py-1.5 text-[0.58rem] font-extrabold tracking-[0.18em] text-white uppercase shadow-[0_8px_24px_-8px_rgba(8,145,178,0.75),0_7px_18px_-12px_rgba(245,158,11,0.9),inset_0_1px_0_rgba(255,255,255,0.4)] ring-2 ring-cyan-100/80 [text-shadow:0_1px_1px_rgba(15,118,110,0.6)] sm:px-6 sm:py-2 sm:text-xs sm:tracking-[0.26em] sm:ring-3">
              {label}
            </p>

            <div className="relative hidden h-9 max-w-16 flex-1 sm:block" aria-hidden="true">
              <span className="absolute left-0 top-1/2 h-px w-full bg-linear-to-r from-amber-500 via-cyan-500 to-transparent" />
              <span className="absolute left-1 top-[32%] h-px w-3/4 origin-left -rotate-[18deg] bg-linear-to-r from-amber-400 to-transparent" />
              <span className="absolute left-1 top-[68%] h-px w-3/4 origin-left rotate-[18deg] bg-linear-to-r from-cyan-500 to-transparent" />
            </div>
          </div>
        ) : null}

        {text ? (
          <p className="mx-auto mt-3 max-w-2xl text-[0.8rem] font-medium leading-5 text-slate-800 text-balance sm:mt-5 sm:text-base sm:leading-7 lg:text-lg">
            {text}
          </p>
        ) : null}

        {tags.length > 0 ? (
          <div>
            <div className="mx-auto mt-4 hidden max-w-sm items-center gap-2 sm:flex" aria-hidden="true">
              <span className="h-px flex-1 bg-linear-to-r from-transparent via-amber-300 to-amber-400" />
              <span className="flex h-4 w-4 rotate-45 items-center justify-center rounded-sm border border-amber-300 bg-amber-100 text-amber-500 shadow-sm sm:h-5 sm:w-5 sm:rounded-md">
                <span className="-rotate-45 text-[0.45rem] sm:text-[0.55rem]">{"\u2665"}</span>
              </span>
              <span className="h-px flex-1 bg-linear-to-l from-transparent via-amber-300 to-amber-400" />
            </div>

            <ul className="mx-auto mt-1.5 flex max-w-xl list-none flex-wrap items-center justify-center gap-x-4 gap-y-0 p-0 sm:mt-3 sm:gap-x-6 sm:gap-y-1">
              {tags.map((tag, index) => {
                const description = tagDetails[tag];
                const theme = TAG_THEMES[index % 3];
                const tagContent = (
                  <>
                    <span>{tag}</span>
                    <span className="hidden w-full items-center gap-1.5 sm:mt-1 sm:flex" aria-hidden="true">
                      <span className="h-px flex-1 bg-current opacity-75" />
                      <span className="h-1.5 w-1.5 rounded-full bg-current" />
                      <span className="h-px flex-1 bg-current opacity-75" />
                    </span>
                  </>
                );

                return (
                  <li key={tag} className="flex min-w-0 justify-center">
                    {description ? (
                      <button
                        type="button"
                        onClick={() => setActiveIndex(index)}
                        className={`flex min-h-7 min-w-0 flex-col items-center justify-center px-0 text-center text-[0.7rem] font-bold leading-tight transition duration-200 active:scale-[0.98] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-current sm:min-h-9 sm:rounded-lg sm:px-1.5 sm:text-base sm:hover:-translate-y-0.5 sm:hover:bg-white/70 ${theme.text}`}
                      >
                        {tagContent}
                      </button>
                    ) : (
                      <span className={`flex min-h-7 min-w-0 flex-col items-center justify-center px-0 text-center text-[0.7rem] font-bold leading-tight sm:min-h-9 sm:px-1.5 sm:text-base ${theme.text}`}>
                        {tagContent}
                      </span>
                    )}
                  </li>
                );
              })}
            </ul>
          </div>
        ) : null}
      </div>

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
