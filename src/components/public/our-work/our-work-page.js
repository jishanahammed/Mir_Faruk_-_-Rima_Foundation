"use client";

import Image from "next/image";
import { useSiteLocale } from "@/components/public/providers/locale-provider";

const workflowStepStyles = [
  {
    accent: "from-emerald-700 to-emerald-500",
    ring: "border-emerald-200",
    badge: "bg-emerald-50 text-emerald-800",
  },
  {
    accent: "from-sky-700 to-cyan-500",
    ring: "border-sky-200",
    badge: "bg-sky-50 text-sky-800",
  },
  {
    accent: "from-violet-700 to-fuchsia-500",
    ring: "border-violet-200",
    badge: "bg-violet-50 text-violet-800",
  },
  {
    accent: "from-amber-700 to-orange-500",
    ring: "border-amber-200",
    badge: "bg-amber-50 text-amber-800",
  },
  {
    accent: "from-teal-700 to-cyan-500",
    ring: "border-teal-200",
    badge: "bg-teal-50 text-teal-800",
  },
  {
    accent: "from-rose-700 to-orange-500",
    ring: "border-rose-200",
    badge: "bg-rose-50 text-rose-800",
  },
];

export function OurWorkPage() {
  const { copy } = useSiteLocale();
  const { ourWork } = copy;
  const workflowSteps = ourWork.steps.map((step, index) => ({
    ...step,
    ...workflowStepStyles[index],
  }));

  return (
    <section className="relative overflow-hidden bg-[linear-gradient(180deg,_#f8fcff_0%,_#ffffff_30%,_#f4fffb_100%)] px-6 py-16 lg:px-8 lg:py-24">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(6,182,212,0.12),_transparent_28%),radial-gradient(circle_at_bottom_right,_rgba(245,158,11,0.12),_transparent_22%)]" />

      <div className="relative mx-auto w-full max-w-7xl space-y-10">
        <header className="overflow-hidden rounded-[2rem] border border-cyan-100 bg-white/90 p-8 shadow-[0_28px_90px_rgba(8,145,178,0.10)] ring-1 ring-white/80 backdrop-blur sm:p-10">
          <div className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
            <div className="space-y-4">
              <p className="text-xs font-semibold uppercase tracking-[0.34em] text-cyan-700">
                {ourWork.eyebrow}
              </p>
              <h1 className="max-w-3xl text-3xl font-semibold leading-tight text-slate-950 sm:text-4xl lg:text-[3.2rem]">
                {ourWork.brandTitle}
              </h1>
              <p className="inline-flex rounded-full border border-amber-200 bg-amber-50 px-4 py-2 text-sm font-semibold text-amber-800">
                {ourWork.brandSubtitle}
              </p>
              <h2 className="max-w-3xl text-2xl font-semibold leading-tight text-slate-950 sm:text-3xl">
                {ourWork.title}
              </h2>
              <p className="max-w-3xl text-sm leading-8 text-slate-600 sm:text-base">
                {ourWork.description}
              </p>
            </div>

            <div className="rounded-[2rem] border border-emerald-100 bg-[linear-gradient(135deg,_#0f172a,_#115e59_55%,_#0891b2)] p-6 text-white shadow-2xl shadow-cyan-950/10">
              <p className="text-xs font-semibold uppercase tracking-[0.28em] text-cyan-100">
                {ourWork.missionLabel}
              </p>
              <p className="mt-3 text-2xl font-semibold leading-snug">
                {ourWork.missionTitle}
              </p>
              <div className="mt-6 grid gap-3 sm:grid-cols-3">
                {ourWork.metrics.map((metric) => (
                  <div
                    key={metric.label}
                    className="rounded-2xl border border-white/10 bg-white/10 px-4 py-3"
                  >
                    <p className="text-lg font-semibold">{metric.value}</p>
                    <p className="mt-1 text-xs text-cyan-50">{metric.label}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </header>

        <div className="relative overflow-hidden rounded-[2rem] border border-slate-200/80 bg-white/88 p-6 shadow-[0_28px_90px_rgba(15,23,42,0.08)] backdrop-blur sm:p-8 lg:p-10">
          <div className="absolute inset-x-16 top-1/2 hidden h-px -translate-y-1/2 bg-[linear-gradient(90deg,_rgba(16,185,129,0.18),_rgba(8,145,178,0.35),_rgba(245,158,11,0.18))] xl:block" />
          <div className="absolute left-1/2 top-20 hidden h-[calc(100%-10rem)] w-px -translate-x-1/2 bg-[linear-gradient(180deg,_rgba(8,145,178,0.12),_rgba(15,118,110,0.28),_rgba(245,158,11,0.12))] xl:block" />

          <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_21rem_minmax(0,1fr)] xl:items-center">
            <div className="space-y-5">
              {workflowSteps.slice(0, 3).map((step) => (
                <article
                  key={step.number}
                  className={`rounded-[1.75rem] border ${step.ring} bg-white p-5 shadow-[0_18px_50px_rgba(15,23,42,0.06)]`}
                >
                  <div className="flex items-center justify-between gap-4">
                    <span
                      className={`inline-flex rounded-full px-3 py-1 text-xs font-bold tracking-[0.22em] uppercase ${step.badge}`}
                    >
                      {ourWork.stepLabel} {step.number}
                    </span>
                    <span
                      className={`h-2.5 w-16 rounded-full bg-gradient-to-r ${step.accent}`}
                    />
                  </div>
                  <h2 className="mt-4 text-xl font-semibold text-slate-950">
                    {step.title}
                  </h2>
                  <p className="mt-3 text-sm leading-7 text-slate-600">
                    {step.description}
                  </p>
                </article>
              ))}
            </div>

            <div className="relative mx-auto flex w-full max-w-sm items-center justify-center xl:min-h-[44rem]">
              <div className="absolute inset-6 rounded-full border border-dashed border-cyan-200/70 xl:inset-0" />
              <div className="absolute inset-12 rounded-full bg-[radial-gradient(circle,_rgba(6,182,212,0.08),_transparent_68%)] xl:inset-6" />
              <div className="relative flex min-h-[21rem] w-full flex-col items-center justify-center rounded-full border-[3px] border-amber-300 bg-white px-7 py-10 text-center shadow-[0_24px_80px_rgba(8,145,178,0.12)]">
                <div className="flex h-20 w-20 items-center justify-center rounded-full border border-cyan-100 bg-cyan-50 shadow-lg shadow-cyan-100/70">
                  <Image
                    src="/logo.png"
                    alt={copy.brand.name}
                    width={56}
                    height={56}
                    className="h-14 w-14 object-contain"
                  />
                </div>
                <p className="mt-5 text-xs font-semibold uppercase tracking-[0.32em] text-cyan-700">
                  {ourWork.centerBrand}
                </p>
                <h2 className="mt-3 text-2xl font-semibold leading-tight text-slate-950">
                  {ourWork.centerTitle}
                </h2>
                <p className="mt-3 text-sm leading-7 text-slate-600">
                  {ourWork.centerDescription}
                </p>
                <div className="mt-5 flex flex-wrap justify-center gap-2">
                  {ourWork.tags.map((tag) => (
                    <span
                      key={tag}
                      className="rounded-full border border-cyan-100 bg-cyan-50 px-3 py-1 text-[0.68rem] font-semibold uppercase tracking-[0.18em] text-cyan-800"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <div className="space-y-5">
              {workflowSteps.slice(3).map((step) => (
                <article
                  key={step.number}
                  className={`rounded-[1.75rem] border ${step.ring} bg-white p-5 shadow-[0_18px_50px_rgba(15,23,42,0.06)]`}
                >
                  <div className="flex items-center justify-between gap-4">
                    <span
                      className={`inline-flex rounded-full px-3 py-1 text-xs font-bold tracking-[0.22em] uppercase ${step.badge}`}
                    >
                      Step {step.number}
                    </span>
                    <span
                      className={`h-2.5 w-16 rounded-full bg-gradient-to-r ${step.accent}`}
                    />
                  </div>
                  <h2 className="mt-4 text-xl font-semibold text-slate-950">
                    {step.title}
                  </h2>
                  <p className="mt-3 text-sm leading-7 text-slate-600">
                    {step.description}
                  </p>
                </article>
              ))}
            </div>
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
          <section className="rounded-[2rem] border border-emerald-100 bg-[linear-gradient(180deg,_#ffffff_0%,_#f6fffb_100%)] p-7 shadow-[0_22px_80px_rgba(15,23,42,0.07)]">
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-emerald-700">
              {ourWork.monitoringLabel}
            </p>
            <h2 className="mt-3 text-2xl font-semibold text-slate-950">
              {ourWork.monitoringTitle}
            </h2>
            <p className="mt-4 text-sm leading-8 text-slate-600">
              {ourWork.monitoringDescription}
            </p>

            <div className="mt-6 rounded-[1.5rem] border border-emerald-100 bg-white p-5">
              <p className="text-sm leading-7 text-slate-600">
                {ourWork.monitoringNote}
              </p>
            </div>
          </section>

          <section className="rounded-[2rem] border border-cyan-100 bg-white p-7 shadow-[0_22px_80px_rgba(15,23,42,0.07)]">
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-cyan-700">
              {ourWork.valuesLabel}
            </p>
            <div className="mt-5 space-y-4">
              {ourWork.values.map((value, index) => (
                <article
                  key={value.title}
                  className="rounded-[1.5rem] border border-slate-200 bg-slate-50/80 p-4"
                >
                  <div className="flex items-center gap-3">
                    <span className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-slate-950 text-xs font-bold text-white">
                      0{index + 1}
                    </span>
                    <h3 className="text-base font-semibold text-slate-950">
                      {value.title}
                    </h3>
                  </div>
                  <p className="mt-3 text-sm leading-7 text-slate-600">
                    {value.description}
                  </p>
                </article>
              ))}
            </div>
          </section>
        </div>

        <section className="overflow-hidden rounded-[2rem] bg-[linear-gradient(135deg,_#14532d,_#0f766e_48%,_#0f172a)] px-7 py-8 text-white shadow-[0_28px_90px_rgba(15,23,42,0.18)] sm:px-10">
          <p className="text-center text-xs font-semibold uppercase tracking-[0.3em] text-cyan-100">
            {ourWork.summaryLabel}
          </p>
          <p className="mt-4 text-center text-lg font-semibold leading-9 sm:text-xl">
            {ourWork.summaryText}
          </p>
          <p className="mt-5 text-center text-sm font-semibold uppercase tracking-[0.24em] text-amber-100 sm:text-base">
            {ourWork.finalLine}
          </p>
        </section>
      </div>
    </section>
  );
}
