"use client";

import { Fragment, useEffect, useRef, useState } from "react";
import Image from "next/image";
import { useSiteLocale } from "@/components/public/providers/locale-provider";

const STEP_GLOWS = [
  "from-teal-400 to-emerald-500",
  "from-cyan-400 to-sky-500",
  "from-amber-400 to-orange-500",
  "from-fuchsia-400 to-pink-500",
  "from-violet-400 to-indigo-500",
  "from-rose-400 to-red-500",
];

function StepCard({ icon, title, description, index, isLast, onOpen }) {
  return (
    <div className="relative h-full w-full">
      <button
        type="button"
        onClick={onOpen}
        className="group flex h-full w-full flex-col items-center gap-3 rounded-3xl border border-cyan-100 bg-white p-6 text-center shadow-[0_10px_30px_rgba(15,23,42,0.06)] transition-all duration-300 hover:-translate-y-1 hover:border-cyan-300 hover:shadow-[0_18px_40px_rgba(8,145,178,0.18)]"
      >
        <span className="flex h-12 w-12 items-center justify-center rounded-full border-2 border-cyan-300/70 bg-[linear-gradient(135deg,#0f172a,#155e75_52%,#0f766e)] text-xl shadow-md transition-transform duration-300 group-hover:scale-110">
          {icon}
        </span>

        <span className="flex min-h-7 w-full items-center justify-center rounded-full bg-[linear-gradient(135deg,#0f172a,#155e75_52%,#0f766e)] px-1 py-2 text-center text-sm font-bold leading-5 text-white">
          {index + 1}. {title}
        </span>

        <p className="text-sm leading-6 text-slate-600">{description}</p>

        <span className="mt-1 inline-flex items-center gap-1 text-xs font-bold text-cyan-600 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
          Tap for details <span aria-hidden="true">&rarr;</span>
        </span>
      </button>

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

function StepDetailModal({ step, index, onClose, eyebrow }) {
  if (!step) return null;
  const glow = STEP_GLOWS[index % STEP_GLOWS.length];

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 p-4 backdrop-blur-sm animate-[fadeIn_0.2s_ease-out]"
      role="dialog"
      aria-modal="true"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-md overflow-hidden rounded-3xl bg-white shadow-[0_25px_80px_-15px_rgba(0,0,0,0.35)] ring-1 ring-black/5 animate-[popIn_0.25s_cubic-bezier(0.34,1.56,0.64,1)]"
        onClick={(event) => event.stopPropagation()}
      >
        <div className={`h-1.5 w-full bg-linear-to-r ${glow}`} aria-hidden="true" />

        <div
          className={`absolute -top-16 -right-16 h-40 w-40 rounded-full bg-linear-to-br ${glow} opacity-20 blur-2xl`}
          aria-hidden="true"
        />

        <div className="relative p-7">
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="absolute right-5 top-5 flex h-8 w-8 items-center justify-center rounded-full bg-slate-100 text-slate-500 transition hover:bg-slate-200 hover:text-slate-700"
          >
            ✕
          </button>

          <div
            className={`flex h-14 w-14 items-center justify-center rounded-2xl bg-linear-to-br ${glow} text-2xl shadow-lg ring-4 ring-white`}
          >
            <span aria-hidden="true">{step.icon}</span>
          </div>

          <p className="mt-4 text-xs font-bold uppercase tracking-widest text-cyan-600">
            {eyebrow ?? `Step ${index + 1}`}
          </p>
          <h3 className="mt-1 text-xl font-bold tracking-tight text-slate-900">
            {step.title}
          </h3>
          <div className={`mt-2 h-1 w-12 rounded-full bg-linear-to-r ${glow}`} aria-hidden="true" />

          <p className="mt-4 text-sm leading-7 text-slate-600">{step.description}</p>

          <button
            type="button"
            onClick={onClose}
            className={`mt-6 w-full rounded-xl bg-linear-to-r ${glow} px-4 py-2.5 text-sm font-semibold text-white shadow-md transition hover:opacity-90`}
          >
            Got it
          </button>
        </div>
      </div>
    </div>
  );
}

export function QardHasanahBanner({ onCtaClick }) {
  const { copy } = useSiteLocale();
  const qh = copy.qardHasanahBanner;
  const [activeStepIndex, setActiveStepIndex] = useState(null);
  const [activeTrustIndex, setActiveTrustIndex] = useState(null);
  const [trustSlideIndex, setTrustSlideIndex] = useState(0);
  const [isTrustPaused, setIsTrustPaused] = useState(false);
  const trustTrackRef = useRef(null);
  const trustCount = qh?.trustItems?.length ?? 0;

  useEffect(() => {
    const track = trustTrackRef.current;
    if (!track) return undefined;

    let frame = null;
    const handleScroll = () => {
      if (frame) return;
      frame = requestAnimationFrame(() => {
        frame = null;
        const cardWidth = track.scrollWidth / trustCount;
        const index = Math.round(track.scrollLeft / cardWidth);
        setTrustSlideIndex(Math.min(trustCount - 1, Math.max(0, index)));
      });
    };

    track.addEventListener("scroll", handleScroll, { passive: true });
    return () => {
      track.removeEventListener("scroll", handleScroll);
      if (frame) cancelAnimationFrame(frame);
    };
  }, [trustCount]);

  useEffect(() => {
    if (trustCount <= 1 || isTrustPaused) return undefined;
    const id = setInterval(() => {
      const track = trustTrackRef.current;
      if (!track) return;
      const cardWidth = track.scrollWidth / trustCount;
      const nextIndex = (trustSlideIndex + 1) % trustCount;
      track.scrollTo({ left: cardWidth * nextIndex, behavior: "smooth" });
    }, 3000);
    return () => clearInterval(id);
  }, [trustCount, isTrustPaused, trustSlideIndex]);

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

          <div className="mt-5 mb-0 flex flex-col items-center gap-3 sm:mb-7 lg:flex-row lg:items-stretch lg:justify-center lg:gap-12">
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
                      onOpen={() => setActiveStepIndex(index)}
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

        {/* CTA + trust strip — mobile: stacked single column (order-controlled), sm+: two-column grid */}
        <div className="mt-0 flex flex-col border-t border-cyan-100 sm:mt-6 sm:grid sm:grid-cols-[1fr_1.2fr]">
          {/* Hadith footer — 1st on mobile via order, sits after the grid on sm+ (order-none) */}
          <div className="order-1 border-t border-cyan-100 bg-white px-5 py-3 text-center sm:order-0 sm:col-span-2 sm:border-t-0 sm:px-8">
            <p className="text-xs font-semibold italic leading-5 text-slate-800">
              &ldquo;{qh.hadith}&rdquo;
            </p>
            <p className="mt-0.5 text-[0.65rem] font-semibold text-cyan-700">{qh.hadithSource}</p>
          </div>

          {/* Trust strip — 2nd on mobile: swipeable carousel; wrapped row from sm+ */}
          <div className="order-2 bg-cyan-50/60 py-6 sm:order-0 sm:hidden">
            <div
              ref={trustTrackRef}
              onTouchStart={() => setIsTrustPaused(true)}
              onTouchEnd={() => setIsTrustPaused(false)}
              className="flex w-full snap-x snap-mandatory overflow-x-auto scroll-smooth scrollbar-none [-ms-overflow-style:none]"
            >
              {qh.trustItems.map((item, index) => (
                <div
                  key={item.title}
                  className="flex basis-full shrink-0 grow-0 snap-center items-center justify-center px-6"
                >
                  <button
                    type="button"
                    onClick={() => setActiveTrustIndex(index)}
                    className="flex items-center gap-1.5 rounded-full border border-cyan-100 bg-white px-3 py-1.5 text-[0.68rem] font-semibold text-slate-700 shadow-sm"
                  >
                    <span aria-hidden="true">{item.icon}</span>
                    {item.title}
                  </button>
                </div>
              ))}
            </div>
          </div>
          {/* slider */}
          <div className="order-2 hidden flex-wrap items-center justify-center gap-2 bg-cyan-50/60 px-5 py-4 sm:order-0 sm:flex sm:gap-2 sm:px-6 sm:py-4">
            {qh.trustItems.map((item, index) => (
              <button
                key={item.title}
                type="button"
                onClick={() => setActiveTrustIndex(index)}
                className="group flex items-center gap-1.5 rounded-full border border-cyan-100 bg-white px-2.5 py-1 text-[0.62rem] font-semibold text-slate-700 shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:border-cyan-300 hover:shadow-md"
              >
                <span aria-hidden="true">{item.icon}</span>
                {item.title}
                <span
                  aria-hidden="true"
                  className="text-cyan-400 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
                >
                  &rarr;
                </span>
              </button>
            ))}
          </div>

          {/* CTA — 3rd on mobile */}
          <div className="order-3 relative m-3 overflow-hidden rounded-3xl bg-[linear-gradient(135deg,#0f172a,#155e75_52%,#0f766e)] px-5 py-6 text-center sm:order-0 sm:px-8 sm:py-5">
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
      </div>

      {activeStepIndex !== null ? (
        <StepDetailModal
          step={qh.steps[activeStepIndex]}
          index={activeStepIndex}
          onClose={() => setActiveStepIndex(null)}
        />
      ) : null}

      {activeTrustIndex !== null ? (
        <StepDetailModal
          step={qh.trustItems[activeTrustIndex]}
          index={activeTrustIndex}
          eyebrow="Our Promise"
          onClose={() => setActiveTrustIndex(null)}
        />
      ) : null}
    </section>
  );
}
