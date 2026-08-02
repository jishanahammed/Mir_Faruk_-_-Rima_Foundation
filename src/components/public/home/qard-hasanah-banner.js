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

const TRUST_DOT_COLORS = [
  { active: "text-emerald-600", inactive: "text-emerald-200" },
  { active: "text-sky-600", inactive: "text-sky-200" },
  { active: "text-amber-600", inactive: "text-amber-200" },
  { active: "text-pink-600", inactive: "text-pink-200" },
  { active: "text-indigo-600", inactive: "text-indigo-200" },
  { active: "text-rose-600", inactive: "text-rose-200" },
];

function StepCard({ icon, title, description, isLast }) {
  return (
    <div className="relative h-full w-full">
      <div className="group flex h-full w-full flex-col gap-0 rounded-3xl border border-cyan-100 bg-white p-4 text-left shadow-[0_10px_30px_rgba(15,23,42,0.06)] transition-all duration-300 hover:-translate-y-1 hover:border-cyan-300 hover:shadow-[0_18px_40px_rgba(8,145,178,0.18)] sm:gap-3 sm:p-6 sm:text-center">
        <div className="flex items-start gap-1 sm:flex-col sm:items-center sm:gap-3">
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border-2 border-cyan-300/70 bg-[linear-gradient(135deg,#0f172a,#155e75_52%,#0f766e)] text-lg shadow-md transition-transform duration-300 group-hover:scale-110 sm:h-12 sm:w-12 sm:text-xl">
            {icon}
          </span>

          <span className="flex min-h-0 flex-1 items-center px-2 py-0 text-left text- font-bold leading-4 text-cyan-800 sm:min-h-7 sm:w-full sm:flex-none sm:justify-center sm:rounded-full sm:bg-[linear-gradient(135deg,#0f172a,#155e75_52%,#0f766e)] sm:px-1 sm:py-2 sm:text-center sm:text-sm sm:leading-5 sm:text-white">
            {title}
          </span>
        </div>

        <p className="-mt-4 pl-13 text-xs leading-4 text-slate-600 sm:mt-0 sm:pl-0 sm:text-sm sm:leading-6">{description}</p>
      </div>

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

function TrustStripCard({ item, index, fullWidth = false }) {
  const glow = STEP_GLOWS[index % STEP_GLOWS.length];

  return (
    <article
      className={`overflow-hidden rounded-[1.65rem] border border-cyan-100 bg-white shadow-[0_10px_24px_rgba(8,145,178,0.10)] ${fullWidth ? "w-full max-w-xs sm:max-w-sm" : "w-full max-w-[15rem] sm:max-w-xs"
        }`}
    >
      <div className="h-1.5 w-full bg-[linear-gradient(90deg,#22d3ee,_#38bdf8)]" aria-hidden="true" />
      <div className="p-3 sm:p-3.5">
        <div className="flex items-start gap-3 rounded-[1.35rem] bg-slate-50/90 px-3 py-3 text-left sm:gap-2.5 sm:rounded-2xl sm:px-3 sm:py-3">
          <span
            className={`mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-linear-to-br ${glow} text-base shadow-[0_8px_18px_rgba(56,189,248,0.22)] ring-2 ring-white sm:mt-0 sm:rounded-2xl`}
            aria-hidden="true"
          >
            {item.icon}
          </span>
          <div className="min-w-0 flex-1">
            <h3 className="text-[0.75rem] font-bold tracking-tight text-slate-900 sm:text-[0.95rem]">
              {item.title}
            </h3>
            <p className=" text-[0.72rem] leading-5 text-slate-500 sm:text-[0.82rem] sm:leading-5">
              {item.description}
            </p>
          </div>
        </div>
      </div>
    </article>
  );
}

export function QardHasanahBanner({ onCtaClick }) {
  const { copy } = useSiteLocale();
  const qh = copy.qardHasanahBanner;
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
      <div className="relative mx-auto flex w-full  max-w-7xl flex-col gap-10 overflow-hidden rounded-3xl border border-cyan-100 bg-white shadow-[0_18px_60px_rgba(15,23,42,0.10)]">
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
        <div className="p-2 sm:px-4">
          <p className="inline-flex mb-2 w-full items-center justify-center gap-2 rounded-full bg-[linear-gradient(135deg,#0f172a,#155e75_52%,#0f766e)] px-4 py-4 text-center text-[0.7rem] font-bold text-white sm:text-xs">
            <span aria-hidden="true">🔄</span>
            {qh.processHeading}
          </p>

          <div className="mt-6 mb-0 flex flex-col items-center gap-3 sm:mb-0 lg:flex-row lg:items-stretch lg:justify-center lg:gap-12">
            {qh.steps.map((step, index) => {
              const isLast = index === qh.steps.length - 1;
              return (
                <Fragment key={step.title}>
                  <div className="w-full max-w-sm lg:max-w-none lg:flex-1">
                    <StepCard
                      icon={step.icon}
                      title={step.title}
                      description={step.description}
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

        {/* CTA + trust strip — mobile: stacked single column (order-controlled), sm+: two-column grid */}
        <div className="mt-0 flex flex-col border-t border-cyan-100 sm:mt-2">
          {/* Hadith footer — 1st on mobile via order, sits after the grid on sm+ (order-none) */}
          <div className="order-1 relative m-3 overflow-hidden rounded-3xl border border-amber-200/50 bg-[linear-gradient(180deg,#fffdfa_0%,#ffffff_100%)] px-4 py-5 text-center sm:order-0 sm:mx-8 sm:mb-8 sm:mt-0 sm:bg-[linear-gradient(135deg,#fffbeb,#fefce8_55%,#fff7ed)]">
            {/* subtle Islamic-inspired geometric accent */}
            <div
              className="pointer-events-none absolute inset-0 hidden opacity-[0.05] sm:block"
              aria-hidden="true"
              style={{
                backgroundImage:
                  "repeating-linear-gradient(45deg, rgba(180,131,25,0.6) 0 2px, transparent 2px 18px), repeating-linear-gradient(-45deg, rgba(180,131,25,0.6) 0 2px, transparent 2px 18px)",
              }}
            />
            <div
              className="pointer-events-none absolute -left-10 -top-10 hidden h-40 w-40 rounded-full border border-amber-300/30 sm:block"
              aria-hidden="true"
            />
            <div
              className="pointer-events-none absolute -bottom-12 -right-12 hidden h-48 w-48 rounded-full border border-amber-400/30 sm:block"
              aria-hidden="true"
            />

            <div className="relative mx-auto flex max-w-[17.25rem] items-start justify-center gap-3 text-center sm:max-w-3xl sm:flex-col sm:items-stretch sm:rounded-2xl sm:border sm:border-amber-200/70 sm:bg-white/80 sm:px-8 sm:py-6 sm:shadow-[0_10px_35px_rgba(180,131,25,0.10)] sm:ring-1 sm:ring-amber-100 sm:backdrop-blur-sm">
              <span
                className="mt-1 flex h-12 w-12 shrink-0 items-center justify-center rounded-full border border-amber-300/70 bg-[linear-gradient(135deg,#a8550f,#c26a13_55%,#d97706)] text-base font-serif text-amber-50 shadow-[0_10px_22px_rgba(180,131,25,0.28)] sm:mx-auto sm:mb-3 sm:mt-0 sm:h-11 sm:w-11 sm:text-2xl"
                aria-hidden="true"
              >
                &ldquo;
              </span>

              <div className="min-w-0 flex-1 sm:flex-none">
                <p className="max-w-[13.25rem] text-balance text-left text-[0.8rem] font-black italic leading-7 text-slate-600 sm:mx-auto sm:max-w-none sm:text-center sm:text-base sm:leading-7">
                  &ldquo;{qh.hadith}&rdquo;
                </p>

                <div className="mt-3 flex items-center justify-center gap-2 sm:mx-auto sm:gap-3" aria-hidden="true">
                  <span className="h-px w-8 bg-amber-400/55 sm:w-12" />
                  <span className="h-1.5 w-1.5 rotate-45 bg-amber-500/80" />
                  <span className="h-px w-8 bg-amber-400/55 sm:w-12" />
                </div>

                <p className="mt-3 text-[0.66rem] font-extrabold uppercase tracking-[0.24em] text-[#c96d16] sm:text-xs">
                  {qh.hadithSource}
                </p>
              </div>
            </div>
          </div>

          {/* Trust strip — 2nd on mobile: swipeable carousel (mobile-only, off on desktop) */}
          <div className="order-2 py-6 sm:hidden">
            <div
              ref={trustTrackRef}
              onTouchStart={() => setIsTrustPaused(true)}
              onTouchEnd={() => setIsTrustPaused(false)}
              className="flex w-full snap-x snap-mandatory overflow-x-auto scroll-smooth scrollbar-none [-ms-overflow-style:none]"
            >
              {qh.trustItems.map((item, index) => (
                <div
                  key={item.title}
                  className="flex basis-full shrink-0 grow-0 snap-center items-center justify-center px-4"
                >
                  <TrustStripCard
                    item={item}
                    index={index}
                    fullWidth
                  />
                </div>
              ))}
            </div>

            {trustCount > 1 ? (
              <div className="mt-3 flex items-center justify-center gap-2">
                {qh.trustItems.map((item, index) => {
                  const isActive = index === trustSlideIndex;
                  const dotColor = TRUST_DOT_COLORS[index % TRUST_DOT_COLORS.length];
                  const ringSize = 16;
                  const strokeWidth = 2;
                  const radius = (ringSize - strokeWidth) / 2;
                  const circumference = 2 * Math.PI * radius;
                  const arcLength = circumference * 0.28;

                  return (
                    <button
                      key={item.title}
                      type="button"
                      aria-label={`Show trust item ${index + 1}`}
                      onClick={() => {
                        const track = trustTrackRef.current;
                        if (!track) return;
                        const cardWidth = track.scrollWidth / trustCount;
                        track.scrollTo({ left: cardWidth * index, behavior: "smooth" });
                      }}
                      className={`relative flex items-center justify-center ${isActive ? dotColor.active : dotColor.inactive
                        }`}
                      style={{ width: ringSize, height: ringSize }}
                    >
                      <span className="absolute h-1.5 w-1.5 rounded-full bg-current" />
                      {isActive ? (
                        <svg width={ringSize} height={ringSize} className="absolute">
                          <circle
                            cx={ringSize / 2}
                            cy={ringSize / 2}
                            r={radius}
                            fill="none"
                            stroke="currentColor"
                            strokeWidth={strokeWidth}
                            className="opacity-30"
                          />
                          <circle
                            key={trustSlideIndex}
                            cx={ringSize / 2}
                            cy={ringSize / 2}
                            r={radius}
                            fill="none"
                            stroke="currentColor"
                            strokeWidth={strokeWidth}
                            strokeLinecap="round"
                            strokeDasharray={`${arcLength} ${circumference - arcLength}`}
                            style={{
                              transformOrigin: "50% 50%",
                              animation: "feature-ring-spin 3s linear forwards",
                              animationPlayState: isTrustPaused ? "paused" : "running",
                            }}
                          />
                        </svg>
                      ) : null}
                    </button>
                  );
                })}
              </div>
            ) : null}
          </div>
          {/* Trust row — desktop-only: all items shown in a single row */}
          <div className="order-2 hidden py-6 sm:order-0 sm:flex sm:justify-center sm:gap-4 sm:px-8">
            {qh.trustItems.map((item, index) => (
              <div key={item.title} className="sm:flex-1">
                <TrustStripCard item={item} index={index} fullWidth />
              </div>
            ))}
          </div>

          {/* CTA — 3rd on mobile, full-width below the trust row on desktop */}
          <div className="order-3 relative m-3 overflow-hidden rounded-3xl border border-amber-200/50 bg-[linear-gradient(180deg,#fffdfa_0%,#ffffff_100%)] px-5 py-6 text-center sm:order-0 sm:mx-8 sm:mb-8 sm:mt-0 sm:bg-[linear-gradient(135deg,#fffbeb,#fefce8_55%,#fff7ed)] sm:px-8 sm:py-5">
            <p className="text-[0.65rem] font-bold uppercase tracking-[0.2em] text-amber-700">
              <span aria-hidden="true">🌱</span> {qh.ctaEyebrow}
            </p>
            <p className="mt-1.5 text-lg font-extrabold text-slate-900 sm:text-xl">
              {qh.ctaAmount}
            </p>
            <p className="mt-0.5 text-xs font-semibold leading-5 text-slate-600 sm:text-sm">
              {qh.ctaTitle}
            </p>
            <button
              type="button"
              onClick={onCtaClick}
              className="mt-3 inline-flex items-center gap-2 rounded-full bg-[linear-gradient(135deg,#0f172a,#155e75_52%,#0f766e)] px-5 py-2.5 text-xs font-extrabold text-white shadow-lg shadow-cyan-950/30 ring-2 ring-white/60 transition hover:-translate-y-0.5 hover:shadow-xl hover:shadow-cyan-950/40 sm:text-sm"
            >
              <span aria-hidden="true">🤲</span>
              {qh.ctaButtonLabel}
            </button>
          </div>
        </div>
      </div>

    </section>
  );
}

