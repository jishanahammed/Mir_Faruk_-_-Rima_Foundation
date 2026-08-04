"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { useSiteLocale } from "@/components/public/providers/locale-provider";

const VIDEO_ID = "fjmA9lTguvc";
const THUMBNAIL_SRC = "/mir-mohammad-faruk-motivational-video.webp";

function PlayIcon() {
  return (
    <svg
      viewBox="0 0 24 28"
      fill="none"
      className="h-6 w-5 translate-x-[2px] md:h-7 md:w-6 lg:h-8 lg:w-7"
      aria-hidden="true"
    >
      <path
        d="M22.2 11.82a2.5 2.5 0 0 1 0 4.36L4.25 26.54A2.5 2.5 0 0 1 .5 24.37V3.63a2.5 2.5 0 0 1 3.75-2.17L22.2 11.82Z"
        fill="white"
      />
    </svg>
  );
}

function CloseIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      className="h-5 w-5"
      aria-hidden="true"
    >
      <path strokeLinecap="round" d="M6 6l12 12M18 6L6 18" />
    </svg>
  );
}

export function VideoSection() {
  const { copy } = useSiteLocale();
  const { videoSpeech } = copy;
  const [isOpen, setIsOpen] = useState(false);
  const closeButtonRef = useRef(null);
  const playButtonRef = useRef(null);
  const embedSrc = `https://www.youtube-nocookie.com/embed/${VIDEO_ID}?autoplay=1&rel=0&modestbranding=1&playsinline=1`;

  useEffect(() => {
    if (!isOpen) return;

    const { style } = document.body;
    const previousOverflow = style.overflow;
    style.overflow = "hidden";

    const handleKeyDown = (event) => {
      if (event.key === "Escape") setIsOpen(false);
    };

    document.addEventListener("keydown", handleKeyDown);
    closeButtonRef.current?.focus();

    return () => {
      style.overflow = previousOverflow;
      document.removeEventListener("keydown", handleKeyDown);
      playButtonRef.current?.focus();
    };
  }, [isOpen]);

  return (
    <section
      id="video"
      aria-labelledby="video-section-heading"
      className="relative overflow-hidden bg-[linear-gradient(180deg,_#f8fafc_0%,_#ffffff_54%,_#ecfeff_100%)] px-4 py-8 sm:px-6 sm:py-24 lg:px-8"
    >
      <div className="absolute inset-x-0 top-0 h-px bg-[linear-gradient(90deg,_transparent,_rgba(8,145,178,0.35),_transparent)]" />
      <div className="absolute inset-0 bg-[linear-gradient(115deg,_rgba(255,255,255,0)_0%,_rgba(6,182,212,0.08)_46%,_rgba(245,158,11,0.07)_100%)]" />

      <div className="relative mx-auto grid w-full max-w-7xl items-center gap-6 rounded-2xl border border-slate-200/80 bg-white/90 p-4 shadow-[0_24px_80px_rgba(15,23,42,0.08)] ring-1 ring-white/80 backdrop-blur sm:gap-8 sm:rounded-[2rem] sm:p-8 lg:grid-cols-[0.95fr_1.05fr]">
        <div className="absolute inset-x-8 top-0 h-[5px] rounded-full bg-[linear-gradient(90deg,_#0f766e_0%,_#0891b2_48%,_#70b7ad_76%,_#d9a441_100%)]" />

        <svg
          className="pointer-events-none absolute bottom-0 left-0 h-[34%] w-[58%] text-cyan-300/20"
          viewBox="0 0 820 210"
          preserveAspectRatio="none"
          aria-hidden="true"
        >
          <path
            d="M0 115C134 154 230 178 368 165C514 151 617 74 820 96V210H0V115Z"
            fill="currentColor"
          />
          <path
            d="M0 140C150 178 268 198 407 178C560 156 645 105 820 118V210H0V140Z"
            fill="rgba(20,184,166,0.12)"
          />
          <path
            d="M0 160C148 194 286 207 444 188C596 169 685 130 820 139V210H0V160Z"
            fill="rgba(255,255,255,0.56)"
          />
          <path
            d="M0 155C170 196 332 203 488 176C625 152 710 109 820 110"
            fill="none"
            stroke="#d9a441"
            strokeOpacity="0.34"
            strokeWidth="1.4"
          />
        </svg>

        <div
          className="pointer-events-none absolute bottom-10 left-[47%] hidden h-44 w-40 opacity-100 lg:block"
          style={{
            backgroundImage:
              "radial-gradient(circle, rgba(8,145,178,0.26) 1.3px, transparent 1.5px)",
            backgroundSize: "15px 15px",
          }}
          aria-hidden="true"
        />

        <div className="relative z-10 flex flex-col items-center text-center lg:max-w-[520px] lg:items-start lg:text-left">
          <span className="inline-flex items-center gap-1.5 rounded-full border border-[rgba(8,145,178,0.22)] bg-white/80 px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.16em] text-[#187b99] shadow-[0_8px_20px_rgba(8,145,178,0.14),inset_0_1px_0_rgba(255,255,255,0.90)] backdrop-blur-[10px] sm:gap-2 sm:px-4 sm:py-2 sm:text-[11px] sm:tracking-[0.2em]">
            <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-[#0891b2] sm:h-[7px] sm:w-[7px]" />
            {videoSpeech.badge}
          </span>

          <h2
            id="video-section-heading"
            className="mb-2 mt-4 max-w-full text-[20px] font-bold leading-[1.15] tracking-[-0.01em] sm:mt-5 sm:text-[32px] md:text-[38px] lg:text-[44px]"
          >
            <span className="bg-[linear-gradient(90deg,_#102a43_0%,_#0f766e_58%,_#0891b2_100%)] bg-clip-text text-transparent">
              {videoSpeech.name}
            </span>
          </h2>

          <p className="mb-3 text-xs font-bold uppercase tracking-[0.05em] text-[#718096] sm:mb-4 sm:text-base lg:text-lg">
            {videoSpeech.role}
          </p>

          <p className="mb-5 max-w-[440px] text-xs leading-5 text-[#53657d] sm:mb-6 sm:text-[15px] sm:leading-7 lg:text-base">
            {videoSpeech.description}
          </p>

          <div className="flex max-w-full items-center justify-center gap-2 sm:gap-4 lg:justify-start">
            <span className="h-px w-5 shrink-0 bg-[linear-gradient(90deg,_#0891b2,_#d9a441)] sm:w-9" />
            <p className="min-w-0 text-[10px] font-bold uppercase tracking-[0.1em] text-[#1384a0] sm:text-sm sm:tracking-[0.18em]">
              {videoSpeech.tagline}
            </p>
          </div>
        </div>

        <div className="relative z-10 w-full">
          <figure className="relative aspect-video w-full overflow-hidden rounded-2xl border-[5px] border-white/95 bg-white shadow-[0_22px_55px_rgba(15,118,110,0.18),0_6px_18px_rgba(15,23,42,0.08)] sm:rounded-[20px] sm:border-[7px] md:rounded-[24px] md:border-[8px] lg:rounded-[28px] lg:border-[10px]">
            <Image
              src={THUMBNAIL_SRC}
              alt={videoSpeech.imageAlt}
              fill
              loading="lazy"
              sizes="(max-width: 767px) calc(100vw - 72px), (max-width: 1599px) 51vw, 770px"
              className="object-cover object-center"
            />
            <div className="absolute inset-0 bg-[linear-gradient(180deg,_rgba(15,23,42,0.02)_0%,_rgba(15,23,42,0.08)_100%)]" />
            <button
              ref={playButtonRef}
              type="button"
              onClick={() => setIsOpen(true)}
              aria-label={videoSpeech.playLabel}
              className="group/play absolute left-1/2 top-1/2 grid aspect-square w-12 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full bg-white/25 p-0 ring-4 ring-white/70 backdrop-blur-sm transition-transform duration-200 ease-out hover:scale-105 focus:outline-none focus-visible:ring-cyan-300/80 sm:w-16 sm:ring-[6px] lg:w-20"
            >
              <span className="grid h-full w-full place-items-center rounded-full bg-[#0d7fa0] shadow-[0_8px_24px_rgba(8,145,178,0.45)]">
                <PlayIcon />
              </span>
            </button>
          </figure>
        </div>
      </div>

      {isOpen ? (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={videoSpeech.modalLabel}
          className="fixed inset-0 z-50 flex items-center justify-center bg-[rgba(2,6,23,0.86)] p-4 backdrop-blur-[7px]"
          onClick={() => setIsOpen(false)}
        >
          <div
            className="relative w-[min(1100px,calc(100vw_-_32px))]"
            onClick={(event) => event.stopPropagation()}
          >
            <button
              ref={closeButtonRef}
              type="button"
              onClick={() => setIsOpen(false)}
              aria-label={videoSpeech.closeLabel}
              className="absolute -top-12 right-0 grid h-10 w-10 place-items-center rounded-full bg-white/10 text-white shadow-lg transition hover:bg-white/20 focus:outline-none focus-visible:ring-4 focus-visible:ring-cyan-300/80"
            >
              <CloseIcon />
            </button>
            <div className="aspect-video overflow-hidden rounded-[22px] bg-black shadow-[0_30px_100px_rgba(0,0,0,0.45)] ring-1 ring-white/10">
              <iframe
                src={embedSrc}
                title={videoSpeech.videoTitle}
                className="h-full w-full"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
              />
            </div>
          </div>
        </div>
      ) : null}
    </section>
  );
}
