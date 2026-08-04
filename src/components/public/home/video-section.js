"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { useSiteLocale } from "@/components/public/providers/locale-provider";
import { YoutubePlayer } from "@/components/shared/youtube-player";

const VIDEO_URL = "https://youtu.be/fjmA9lTguvc?si=nd12FmKw9L_3C_zT";

function PlayIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className="h-6 w-6 translate-x-0.5 md:h-8 md:w-8" aria-hidden="true">
      <path d="M8 5.14v13.72a1 1 0 0 0 1.53.85l10.72-6.86a1 1 0 0 0 0-1.7L9.53 4.29A1 1 0 0 0 8 5.14Z" />
    </svg>
  );
}

function CloseIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="h-5 w-5" aria-hidden="true">
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
      className="relative overflow-hidden bg-[linear-gradient(180deg,_#ffffff_0%,_#f8fafc_48%,_#ecfeff_100%)] px-6 py-10 md:py-24 lg:px-8"
    >
      <div className="absolute inset-x-0 top-0 h-px bg-[linear-gradient(90deg,_transparent,_rgba(8,145,178,0.35),_transparent)]" />
      <div className="absolute left-[-7rem] top-32 h-64 w-64 rounded-full bg-cyan-100/60 blur-3xl" />
      <div className="absolute bottom-20 right-[-6rem] h-72 w-72 rounded-full bg-amber-100/50 blur-3xl" />

      <div className="relative mx-auto w-full max-w-7xl overflow-hidden rounded-2xl border border-white/70 bg-[linear-gradient(155deg,_rgba(255,255,255,0.98)_0%,_rgba(236,254,255,0.92)_48%,_rgba(255,251,235,0.88)_100%)] shadow-[0_24px_80px_rgba(15,23,42,0.1)] ring-1 ring-white/80 backdrop-blur md:rounded-[2rem] lg:rounded-[2.5rem] lg:shadow-[0_35px_120px_rgba(15,23,42,0.12)]">
        <div className="absolute -right-10 -top-10 h-32 w-32 rounded-full bg-cyan-100/50 blur-3xl lg:h-48 lg:w-48 lg:bg-cyan-200/50" />
        <div className="absolute -bottom-16 -left-12 h-32 w-32 rounded-full bg-amber-100/50 blur-3xl lg:h-40 lg:w-40" />
        <div className="absolute inset-x-0 top-0 h-1.5 bg-[linear-gradient(90deg,_#0f766e,_#06b6d4,_#f59e0b)] opacity-90" />

        <div className="relative grid gap-6 p-5 md:gap-8 md:p-8 lg:grid-cols-[0.95fr_1.05fr] lg:items-center lg:gap-10 lg:p-12">
          {/* Text content */}
          <div className="flex flex-col items-center gap-3 text-center md:gap-4 lg:items-start lg:text-left">
            <span className="inline-flex w-fit shrink-0 items-center justify-center gap-2 rounded-full border border-cyan-200/80 bg-white px-3 py-1.5 text-[0.65rem] font-semibold tracking-[0.28em] text-cyan-700 uppercase shadow-md shadow-cyan-100/70">
              <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-cyan-500" />
              {videoSpeech.badge}
            </span>

            <div className="min-w-0 space-y-2 md:space-y-3">
              <h2
                id="video-section-heading"
                className="text-2xl font-extrabold leading-tight text-slate-900 md:text-3xl lg:text-4xl"
              >
                <span className="bg-[linear-gradient(135deg,_#0f172a_4%,_#0f766e_52%,_#0891b2_100%)] bg-clip-text text-transparent">
                  {videoSpeech.name}
                </span>
              </h2>
              <p className="text-xs font-semibold tracking-[0.06em] text-slate-500 uppercase md:text-sm md:tracking-[0.08em] lg:text-base">
                {videoSpeech.role}
              </p>
              <p className="text-sm leading-7 text-slate-600 lg:max-w-sm">
                {videoSpeech.description}
              </p>

              <div className="flex items-center justify-center gap-3 pt-2 lg:justify-start">
                <span className="hidden h-px w-10 bg-[linear-gradient(90deg,_#d9a441,_transparent)] lg:block" />
                <span className="text-xs font-semibold tracking-[0.24em] text-cyan-700 uppercase">
                  {videoSpeech.tagline}
                </span>
              </div>
            </div>
          </div>

          {/* Video thumbnail */}
          <div className="relative mx-auto w-full max-w-2xl lg:max-w-none">
            <figure className="group relative w-full overflow-hidden rounded-xl border border-white/70 bg-white/90 p-1.5 shadow-[0_35px_120px_rgba(15,23,42,0.14)] ring-1 ring-slate-200/70 transition-all duration-300 ease-out hover:-translate-y-1 hover:shadow-[0_40px_130px_rgba(8,145,178,0.18)] md:rounded-2xl md:p-2 lg:shadow-[0_40px_140px_rgba(8,145,178,0.16)]">
              <button
                ref={playButtonRef}
                type="button"
                onClick={() => setIsOpen(true)}
                aria-label={videoSpeech.playLabel}
                className="group/btn relative block aspect-video w-full overflow-hidden rounded-lg md:rounded-xl"
              >
                <Image
                  src="/mmfaruk.1.png"
                  alt={videoSpeech.imageAlt}
                  fill
                  sizes="(max-width: 672px) 100vw, 672px"
                  className="object-cover transition-transform duration-500 ease-out group-hover/btn:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/5 to-black/20 transition-opacity duration-300 group-hover/btn:from-black/60" />
                <span className="absolute inset-0 flex items-center justify-center">
                  <span className="flex h-14 w-14 items-center justify-center rounded-full bg-white/95 text-cyan-700 shadow-md ring-2 ring-white/30 transition-transform duration-300 ease-out group-hover/btn:scale-110 group-active:scale-95 lg:h-20 lg:w-20">
                    <PlayIcon />
                  </span>
                </span>
              </button>
            </figure>
          </div>
        </div>
      </div>

      {isOpen ? (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={videoSpeech.modalLabel}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm"
          onClick={() => setIsOpen(false)}
        >
          <div className="relative w-full max-w-4xl" onClick={(event) => event.stopPropagation()}>
            <button
              ref={closeButtonRef}
              type="button"
              onClick={() => setIsOpen(false)}
              aria-label={videoSpeech.closeLabel}
              className="absolute -top-10 right-0 flex h-8 w-8 items-center justify-center rounded-full bg-white/10 text-white transition hover:bg-white/20"
            >
              <CloseIcon />
            </button>
            <YoutubePlayer url={VIDEO_URL} title={videoSpeech.videoTitle} />
          </div>
        </div>
      ) : null}
    </section>
  );
}
