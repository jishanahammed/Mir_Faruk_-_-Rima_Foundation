"use client";

import { Fragment } from "react";
import Image from "next/image";
import { useSiteLocale } from "@/components/public/providers/locale-provider";

function StepCard({ icon, title, description, index, isLast }) {
  return (
    <div className="relative flex h-full w-full flex-col items-center gap-3 rounded-3xl border border-cyan-100 bg-white p-6 text-center shadow-[0_10px_30px_rgba(15,23,42,0.06)]">
      <span className="flex h-12 w-12 items-center justify-center rounded-full border-2 border-cyan-300/70 bg-[linear-gradient(135deg,#0f172a,#155e75_52%,#0f766e)] text-xl shadow-md">
        {icon}
      </span>

      <span className="flex min-h-7 w-full items-center justify-center rounded-full bg-[linear-gradient(135deg,#0f172a,#155e75_52%,#0f766e)] px-1 py-2 text-center text-sm font-bold leading-5 text-white">
        {index + 1}. {title}
      </span>

      <p className="text-sm leading-6 text-slate-600">{description}</p>

      {!isLast ? (
        <span
          className="absolute left-full top-1/2 z-10 hidden w-12 -translate-y-1/2 items-center justify-center text-2xl font-bold text-cyan-400 lg:flex"
          aria-hidden="true"
        >
          &rarr;
        </span>
      ) : null}
    </div>
  );
}

export function QardHasanahBanner({ onCtaClick }) {
  const { copy } = useSiteLocale();
  const qh = copy.qardHasanahBanner;

  if (!qh) {
    return null;
  }

  return (
    <section className="bg-white px-4 py-12 sm:px-6 sm:py-16 lg:px-8 lg:py-20">
      <div className="relative mx-auto flex w-full max-w-7xl flex-col gap-10 overflow-hidden rounded-3xl border border-cyan-100 bg-white shadow-[0_18px_60px_rgba(15,23,42,0.10)]">
        {/* Hero */}
        <div className="relative grid gap-5 overflow-hidden bg-[linear-gradient(135deg,#0f172a,#155e75_52%,#0f766e)] px-5 py-6 sm:px-8 lg:grid-cols-[1.3fr_1fr] lg:items-center lg:py-8">
          <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
            <div className="absolute -top-16 -right-16 h-48 w-48 rounded-full border border-cyan-400/20" />
            <div className="absolute bottom-0 left-0 h-40 w-40 -translate-x-1/2 translate-y-1/2 rounded-full border border-cyan-500/20" />
          </div>

          <div className="relative text-center lg:text-left">
            <span className="inline-flex items-center gap-2 rounded-full border border-cyan-400/30 bg-cyan-400/10 px-3 py-1 text-[0.65rem] font-bold uppercase tracking-widest text-cyan-300">
              {qh.eyebrow}
            </span>
            <p className="mt-3 text-sm font-semibold text-cyan-100">{qh.yourWord}</p>
            <p className="mt-1 text-3xl font-extrabold text-white sm:text-4xl">
              {qh.amount}
              <span className="ml-2 text-lg font-bold text-cyan-100 sm:text-xl">{qh.amountUnit}</span>
            </p>
            <h2 className="mt-1 text-2xl font-extrabold leading-tight text-white sm:text-3xl">
              {qh.title}
            </h2>
            <p className="mt-2 text-sm font-semibold leading-relaxed text-cyan-100 sm:text-base">
              {qh.subtitle}
            </p>

            <div className="mx-auto mt-4 inline-flex items-center gap-2 rounded-full border-2 border-cyan-300/70 bg-white/5 px-4 py-2 backdrop-blur-sm lg:mx-0">
              <span className="text-lg" aria-hidden="true">🐐</span>
              <p className="text-xs font-bold text-cyan-100 sm:text-sm">{qh.pledgeText}</p>
            </div>
          </div>

          <div className="flex flex-col gap-3">
            <div className="relative overflow-hidden rounded-2xl border border-white/10 shadow-xl shadow-slate-950/40">
              <Image
                src="/d-3.png"
                alt="A donation cycle: from a seedling to goats to a self-reliant family"
                width={1536}
                height={1024}
                className="h-full w-full object-cover"
              />
            </div>

            <figure className="relative overflow-hidden rounded-2xl border border-white/10 bg-white/5 p-4 text-center shadow-lg shadow-slate-950/30 backdrop-blur-sm">
              <div className="relative space-y-0.5">
                {qh.quote.map((line, index) => (
                  <p key={index} className="text-xs font-semibold leading-5 text-cyan-100 sm:text-sm">
                    {line}
                  </p>
                ))}
              </div>
            </figure>
          </div>
        </div>

        {/* Process steps */}
        <div className=" sm:px-4">
          <p className="inline-flex mb-2 w-full items-center justify-center gap-2 rounded-full bg-[linear-gradient(135deg,#0f172a,#155e75_52%,#0f766e)] px-4 py-4 text-center text-[0.7rem] font-bold text-white sm:text-xs">
            <span aria-hidden="true">🔄</span>
            {qh.processHeading}
          </p>

          <div className="mt-5 mb-7 flex flex-col items-center gap-3 lg:flex-row lg:items-stretch lg:justify-center lg:gap-12">
            {qh.steps.map((step, index) => {
              const isLast = index === qh.steps.length - 1;
              return (
                <Fragment key={step.title}>
                  <div className="w-full max-w-sm lg:max-w-none lg:flex-1">
                    <StepCard
                      icon={step.icon}
                      title={step.title}
                      description={step.description}
                      index={index}
                      isLast={isLast}
                    />
                  </div>
                  {!isLast ? (
                    <span
                      className="text-2xl font-bold leading-none text-cyan-400 lg:hidden"
                      aria-hidden="true"
                    >
                      &darr;
                    </span>
                  ) : null}
                </Fragment>
              );
            })}
          </div>
        </div>

        {/* CTA + trust strip */}
        <div className="-mt-10 grid gap-0 border-t border-cyan-100 lg:grid-cols-[1fr_1.2fr]">
          <div className="flex flex-wrap items-center justify-center gap-2 bg-cyan-50/60 px-5 py-4 sm:gap-3 sm:px-8">
            {qh.trustItems.map((item) => (
              <span
                key={item.title}
                className="flex items-center gap-1.5 rounded-full border border-cyan-100 bg-white px-2.5 py-1 text-[0.62rem] font-semibold text-slate-700 shadow-sm"
              >
                <span aria-hidden="true">{item.icon}</span>
                {item.title}
              </span>
            ))}
          </div>

          <div className="relative overflow-hidden bg-[linear-gradient(135deg,#0f172a,#155e75_52%,#0f766e)] px-5 py-5 text-center sm:px-8">
            <p className="text-[0.65rem] font-bold uppercase tracking-[0.2em] text-cyan-300">
              <span aria-hidden="true">🌱</span> {qh.ctaEyebrow}
            </p>
            <p className="mt-1.5 text-lg font-extrabold text-white sm:text-xl">
              {qh.ctaAmount}
            </p>
            <p className="mt-0.5 text-xs font-semibold leading-5 text-cyan-100 sm:text-sm">
              {qh.ctaTitle}
            </p>
            <button
              type="button"
              onClick={onCtaClick}
              className="mt-3 inline-flex items-center gap-2 rounded-full bg-white px-5 py-2.5 text-xs font-extrabold text-cyan-800 shadow-lg shadow-cyan-950/30 ring-2 ring-white/60 transition hover:-translate-y-0.5 hover:shadow-xl hover:shadow-cyan-950/40 sm:text-sm"
            >
              <span aria-hidden="true">🤲</span>
              {qh.ctaButtonLabel}
            </button>
          </div>
        </div>

        {/* Hadith footer */}
        <div className="border-t border-cyan-100 bg-white px-5 py-3 text-center sm:px-8">
          <p className="text-xs font-semibold italic leading-5 text-slate-800">
            &ldquo;{qh.hadith}&rdquo;
          </p>
          <p className="mt-0.5 text-[0.65rem] font-semibold text-cyan-700">{qh.hadithSource}</p>
        </div>
      </div>
    </section>
  );
}
