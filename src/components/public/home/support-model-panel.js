"use client";

import { useId } from "react";

// Reusable panel card in the "Sustainable Support Model" style: an uppercase
// label, a title, an intro text, numbered pillar rows and a metrics grid.
// All sections are optional — pass only what the page needs.
//
// SEO / accessibility:
// - renders as a <section> labelled by its heading (aria-labelledby)
// - pillars are a real <ul> list, metrics a <dl> definition list
// - purely decorative elements are hidden from assistive tech
export function SupportModelPanel({ label, title, text, pillars = [], metrics = [] }) {
  const headingId = useId();

  return (
    <section
      aria-labelledby={title ? headingId : undefined}
      className="relative rounded-[2.25rem] border border-cyan-200/80 bg-white/92 p-6 ring-1 ring-cyan-100/70 sm:p-8 shadow-[0_30px_90px_rgba(14,116,144,0.14)]"
    >
      <div
        className="absolute inset-x-10 top-0 h-px bg-[linear-gradient(90deg,_transparent,_rgba(8,145,178,0.45),_transparent)]"
        aria-hidden="true"
      />
      <div className="relative">
        <div className="flex items-start justify-between gap-4">
          <div className="mx-auto flex flex-col items-center text-center sm:mx-0 sm:items-start sm:text-left">
            {label ? (
              <p className="inline-flex items-center rounded-full bg-cyan-50 px-3 py-1 text-[11px] font-bold tracking-[0.22em] text-cyan-700 uppercase sm:bg-transparent sm:px-0 sm:py-0 sm:text-xs sm:tracking-[0.28em]">
                {label}
              </p>
            ) : null}
            {title ? (
              <h2
                id={headingId}
                className="mx-auto mt-3 max-w-sm text-xl font-bold leading-tight text-slate-950 sm:mx-0 sm:mt-4 sm:text-[1.7rem] sm:font-semibold"
              >
                {title}
              </h2>
            ) : null}
          </div>
        </div>

        {text ? (
          <p className="mt-5 max-w-xl text-sm leading-7 text-slate-600 sm:text-base">
            {text}
          </p>
        ) : null}

        {pillars.length > 0 ? (
          <ul className="mt-8 grid list-none gap-3 p-0">
            {pillars.map((pillar, index) => (
              <li
                key={pillar.title}
                className="rounded-[1.6rem] border border-cyan-100 bg-[linear-gradient(135deg,_rgba(248,250,252,0.98),_rgba(236,254,255,0.78))] px-4 py-4"
              >
                <div className="flex items-start gap-4">
                  <div
                    className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-cyan-200 bg-cyan-50 text-sm font-semibold text-cyan-800"
                    aria-hidden="true"
                  >
                    0{index + 1}
                  </div>
                  <div>
                    <h3 className="text-base font-semibold text-slate-900">
                      {pillar.title}
                    </h3>
                    <p className="mt-2 text-sm leading-7 text-slate-600">
                      {pillar.description}
                    </p>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        ) : null}

        {metrics.length > 0 ? (
          <dl className="mt-8 grid gap-3 sm:grid-cols-3">
            {metrics.map((metric) => (
              <div
                key={metric.label}
                className="rounded-[1.5rem] border border-cyan-100 bg-cyan-50/70 px-4 py-4"
              >
                <dd className="text-lg font-semibold text-slate-950">
                  {metric.value}
                </dd>
                <dt className="mt-1 text-sm leading-6 text-slate-600">
                  {metric.label}
                </dt>
              </div>
            ))}
          </dl>
        ) : null}
      </div>
    </section>
  );
}
