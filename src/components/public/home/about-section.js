"use client";

import { useSiteLocale } from "@/components/public/providers/locale-provider";

export function AboutSection() {
  const { copy } = useSiteLocale();
  const { about } = copy;

  return (
    <section
      id="about-us"
      className="relative overflow-hidden bg-[linear-gradient(180deg,_#f8fafc_0%,_#ffffff_54%,_#ecfeff_100%)] px-6 py-24 lg:px-8"
    >
      <div className="absolute inset-x-0 top-0 h-px bg-[linear-gradient(90deg,_transparent,_rgba(8,145,178,0.35),_transparent)]" />
      <div className="absolute inset-0 bg-[linear-gradient(115deg,_rgba(255,255,255,0)_0%,_rgba(6,182,212,0.08)_46%,_rgba(245,158,11,0.07)_100%)]" />

      <div className="relative mx-auto grid w-full max-w-7xl gap-8 lg:grid-cols-[0.95fr_1.05fr] lg:items-stretch">
        <div className="flex flex-col justify-between gap-8 rounded-[2rem] border border-slate-200/80 bg-white/90 p-6 shadow-[0_24px_80px_rgba(15,23,42,0.08)] ring-1 ring-white/80 backdrop-blur sm:p-8">
          <div className="max-w-2xl space-y-3">
            <p className="text-xs font-semibold tracking-[0.32em] text-cyan-700 uppercase">
              {about.eyebrow}
            </p>
            <h2 className="max-w-xl text-2xl font-semibold leading-tight sm:text-[1.7rem] md:text-3xl">
              <span className="bg-[linear-gradient(135deg,_#0f172a_0%,_#0f766e_54%,_#0891b2_100%)] bg-clip-text text-transparent">
                {about.title}
              </span>
            </h2>
            <p className="text-sm leading-7 text-slate-600 md:text-base">
              {about.description}
            </p>
          </div>

          <div className="grid gap-3 sm:grid-cols-3 lg:grid-cols-1">
            {about.highlights.map((item, index) => (
              <div
                key={item.title}
                className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-slate-50/80 px-4 py-3"
              >
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-cyan-700 text-xs font-semibold text-white">
                  0{index + 1}
                </span>
                <span className="text-sm font-semibold leading-6 text-slate-800">
                  {item.title}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="grid gap-5 md:grid-cols-3">
          {about.highlights.map((item) => (
            <article
              key={item.title}
              className="group relative overflow-hidden rounded-[2rem] border border-slate-200 bg-white p-6 shadow-[0_18px_60px_rgba(15,23,42,0.08)] transition-all duration-300 ease-out hover:-translate-y-1 hover:border-cyan-200 hover:shadow-[0_24px_80px_rgba(8,145,178,0.14)]"
            >
              <div className="absolute inset-x-0 top-0 h-1 bg-[linear-gradient(90deg,_#0f766e,_#06b6d4,_#f59e0b)] opacity-80" />

              <h3 className="text-lg font-semibold leading-7 text-slate-950">
                {item.title}
              </h3>
              <p className="mt-4 text-sm leading-7 text-slate-600">
                {item.description}
              </p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
