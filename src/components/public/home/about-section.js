"use client";

import { useSiteLocale } from "@/components/public/providers/locale-provider";

const HIGHLIGHT_THEMES = [
  { icon: "🕌", glow: "from-teal-400 to-emerald-500", ring: "ring-teal-100" },
  { icon: "🌱", glow: "from-cyan-400 to-sky-500", ring: "ring-cyan-100" },
  { icon: "🔍", glow: "from-amber-400 to-orange-500", ring: "ring-amber-100" },
];

export function AboutSection({ className = "" }) {
  const { copy } = useSiteLocale();
  const { about } = copy;

  return (
    <section
      id="about-us"
      className={`relative overflow-hidden bg-[linear-gradient(180deg,_#f8fafc_0%,_#ffffff_54%,_#ecfeff_100%)] px-6 py-10 sm:py-24 lg:px-8 ${className}`}
    >
      <div className="absolute inset-x-0 top-0 h-px bg-[linear-gradient(90deg,_transparent,_rgba(8,145,178,0.35),_transparent)]" />
      <div className="absolute inset-0 bg-[linear-gradient(115deg,_rgba(255,255,255,0)_0%,_rgba(6,182,212,0.08)_46%,_rgba(245,158,11,0.07)_100%)]" />

      <div className="relative mx-auto grid w-full max-w-7xl gap-8 lg:grid-cols-[0.95fr_1.05fr] lg:items-stretch">
        <div className="flex flex-col justify-between gap-8 rounded-[2rem] border border-slate-200/80 bg-white/90 p-6 shadow-[0_24px_80px_rgba(15,23,42,0.08)] ring-1 ring-white/80 backdrop-blur sm:p-8">
          <div className="mx-auto flex max-w-2xl flex-col items-center space-y-2.5 text-center sm:mx-0 sm:items-start sm:space-y-3 sm:text-left">
            <p className="inline-flex items-center gap-2 rounded-full bg-cyan-50 px-3 py-1 text-[11px] font-bold tracking-[0.22em] text-cyan-700 uppercase sm:bg-transparent sm:px-0 sm:py-0 sm:text-xs sm:tracking-[0.32em]">
              {about.eyebrow}
            </p>
            <h2 className="mx-auto max-w-xl text-xl font-bold leading-[1.2] sm:mx-0 sm:text-[1.7rem] sm:font-semibold sm:leading-tight md:text-3xl">
              <span className="bg-[linear-gradient(135deg,_#0f172a_0%,_#0f766e_54%,_#0891b2_100%)] bg-clip-text text-transparent">
                {about.title}
              </span>
            </h2>
            <p className="text-[0.9rem] leading-6 text-slate-600 sm:text-sm sm:leading-7 md:text-base">
              {about.description}
            </p>
          </div>

        </div>

        <div className="grid gap-5 md:grid-cols-3">
          {about.highlights.map((item, index) => {
            const theme = HIGHLIGHT_THEMES[index % HIGHLIGHT_THEMES.length];
            return (
              <article
                key={item.title}
                className="group relative overflow-hidden rounded-[2rem] border border-slate-200 bg-white p-4 shadow-[0_18px_60px_rgba(15,23,42,0.08)] transition-all duration-300 ease-out hover:-translate-y-2 hover:border-transparent hover:shadow-[0_28px_90px_rgba(8,145,178,0.22)] sm:p-6"
              >
                <div className="absolute inset-x-0 top-0 h-1.5 bg-linear-to-r from-teal-500 via-cyan-500 to-amber-500 opacity-90" />

                <div
                  className={`pointer-events-none absolute -top-10 -right-10 h-32 w-32 rounded-full bg-linear-to-br ${theme.glow} opacity-0 blur-2xl transition-opacity duration-500 group-hover:opacity-20`}
                  aria-hidden="true"
                />

                <div className="relative flex items-start gap-2 sm:block">
                  <span
                    className={`relative flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-linear-to-br ${theme.glow} text-xl shadow-lg ring-4 ${theme.ring} transition-transform duration-300 group-hover:scale-110 group-hover:rotate-3 sm:h-14 sm:w-14 sm:text-2xl`}
                  >
                    <span aria-hidden="true">{theme.icon}</span>
                  </span>

                  <div className="min-w-0 flex-1 sm:block">
                    <h3 className="relative text-base font-bold leading-6 text-slate-950 sm:mt-5 sm:text-lg sm:leading-7">
                      {item.title}
                    </h3>

                    <p className="relative mt-0.5 text-xs leading-5 text-slate-600 sm:mt-4 sm:text-sm sm:leading-7">
                      {item.description}
                    </p>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
