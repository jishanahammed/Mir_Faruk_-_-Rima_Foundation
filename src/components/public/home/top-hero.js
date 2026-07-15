"use client";

import { useSiteLocale } from "@/components/public/providers/locale-provider";

export function TopHero() {
  const { copy } = useSiteLocale();
  const { brand, hero } = copy;
  const isBangla = copy.htmlLang === "bn";
  const foundationNameMatch = brand.name.match(/^(.*)\s+(Foundation|Fonden)$/);
  const brandNameParts = brand.name.trim().split(/\s+/);
  const localizedFoundationTitle =
    isBangla && brandNameParts.length > 1 ? brandNameParts.slice(0, -1).join(" ") : null;
  const localizedFoundationSuffix =
    isBangla && brandNameParts.length > 1 ? brandNameParts.at(-1) : null;
  const brandTitle = foundationNameMatch?.[1] ?? localizedFoundationTitle ?? brand.name;
  const brandSuffix = foundationNameMatch?.[2] ?? localizedFoundationSuffix;

  return (
    <div className="space-y-5">
      <span className="inline-flex items-center rounded-full border border-cyan-200 bg-white/92 px-4 py-2 text-[0.68rem] font-semibold tracking-[0.3em] text-cyan-800 uppercase shadow-md shadow-cyan-100/70">
        {hero.tagline}
      </span>

      <div className="space-y-5">
        <h3 className="mt-4 max-w-4xl text-[1.55rem] font-semibold leading-[1.05] tracking-normal text-slate-950 sm:text-[2.55rem] md:text-[3.35rem] xl:text-[3.9rem]">
          <span className="inline-block text-center text-balance">
            <span
              className={`block whitespace-nowrap ${isBangla
                ? "text-cyan-950"
                : "bg-[linear-gradient(135deg,_#0f172a_6%,_#0f766e_48%,_#0891b2_94%)] bg-clip-text text-transparent"
                }`}
            >
              {brandTitle}
            </span>
            {brandSuffix ? (
              <span
                className={`mx-auto mt-2 block text-center text-[0.66em] font-extrabold uppercase leading-none tracking-[0.18em] sm:text-[0.58em] ${isBangla
                  ? "text-teal-700"
                  : "bg-[linear-gradient(135deg,_#0f766e_0%,_#0891b2_70%,_#f59e0b_100%)] bg-clip-text text-transparent"
                  }`}
              >
                {brandSuffix}
              </span>
            ) : null}
          </span>
          <span className="mt-3 block text-[0.68em] font-medium leading-[1.18] text-slate-600 sm:text-[0.7em]">
            <span
              className={
                isBangla
                  ? "text-teal-700"
                  : "bg-[linear-gradient(135deg,_#334155_0%,_#0f766e_100%)] bg-clip-text text-transparent"
              }
            >
              {hero.headingLines[1]}
            </span>
          </span>
        </h3>
        <p className="max-w-3xl text-xs leading-6 text-slate-600 sm:text-sm sm:leading-7 md:text-base md:leading-8">
          {hero.paragraph}
        </p>
      </div>
    </div>
  );
}
