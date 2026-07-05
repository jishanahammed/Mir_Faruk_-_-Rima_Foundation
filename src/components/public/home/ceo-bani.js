"use client";

import Image from "next/image";
import { useSiteLocale } from "@/components/public/providers/locale-provider";

const letterImages = {
  BN: { src: "/bng-b.png", width: 2208, height: 2996 },
  EN: { src: "/eng-b.png", width: 2200, height: 3000 },
  DK: { src: "/dk-b.png", width: 2204, height: 2789 },
};

export function CeoBani() {
  const { copy, locale } = useSiteLocale();
  const { ceoMessage } = copy;
  const letter = letterImages[locale] ?? letterImages.EN;

  return (
    <section
      id="ceo-message"
      className="relative overflow-hidden bg-[linear-gradient(180deg,_#ffffff_0%,_#f8fafc_48%,_#ecfeff_100%)] px-6 py-20 lg:px-8 lg:py-24"
    >
      <div className="absolute inset-x-0 top-0 h-px bg-[linear-gradient(90deg,_transparent,_rgba(8,145,178,0.35),_transparent)]" />
      <div className="absolute left-[-7rem] top-32 h-64 w-64 rounded-full bg-cyan-100/60 blur-3xl" />
      <div className="absolute bottom-20 right-[-6rem] h-72 w-72 rounded-full bg-amber-100/50 blur-3xl" />

      <div className="relative mx-auto max-w-7xl">
        <div className="mx-auto max-w-2xl space-y-3 text-center">
          <p className="text-xs font-semibold tracking-[0.32em] text-cyan-700 uppercase">
            {ceoMessage.eyebrow}
          </p>
          <p className="text-sm leading-7 text-slate-600 md:text-base">
            {ceoMessage.description}
          </p>
        </div>

        <div className="mx-auto mt-12 max-w-2xl">
          <figure className="group relative overflow-hidden rounded-[2.5rem] border border-white/70 bg-white/90 p-3 shadow-[0_35px_120px_rgba(15,23,42,0.14)] ring-1 ring-slate-200/70 backdrop-blur-xl transition-all duration-300 ease-out hover:-translate-y-1 hover:shadow-[0_40px_130px_rgba(8,145,178,0.18)] sm:p-4">
            <div className="absolute inset-x-0 top-0 h-1 bg-[linear-gradient(90deg,_#0f766e,_#06b6d4,_#f59e0b)] opacity-80" />
            <Image
              key={letter.src}
              src={letter.src}
              alt={ceoMessage.imageAlt}
              width={letter.width}
              height={letter.height}
              quality={90}
              sizes="(max-width: 672px) 100vw, 672px"
              className="h-auto w-full rounded-[2rem] object-contain"
            />

          </figure>
        </div>
      </div>
    </section>
  );
}
