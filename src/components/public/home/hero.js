"use client";

import { useState } from "react";
import { DonorRegistrationModal } from "@/components/public/home/donor-registration-modal";
import { HighlightCard } from "@/components/public/home/highlight-card";
import { SupportModelPanel } from "@/components/public/home/support-model-panel";
import { LearnMoreButton, RegistrationButton } from "@/components/public/ui/cta-buttons";
import { useSiteLocale } from "@/components/public/providers/locale-provider";

export function Hero() {
  const { copy } = useSiteLocale();
  const { brand, hero } = copy;
  const [isDonorModalOpen, setIsDonorModalOpen] = useState(false);
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
    <section
      id="home"
      className="relative overflow-hidden px-6 pb-20 pt-10 lg:px-8 lg:pb-28 lg:pt-16"
    >
      <div className="absolute inset-x-0 top-0 h-[34rem] bg-[radial-gradient(circle_at_top,_rgba(8,145,178,0.18),_transparent_55%)]" />
      <div className="absolute left-[-8rem] top-24 h-64 w-64 rounded-full bg-amber-100/55 blur-3xl" />
      <div className="absolute right-[-6rem] top-16 h-72 w-72 rounded-full bg-cyan-200/45 blur-3xl" />

      <div className="relative mx-auto max-w-7xl">
        <div className="overflow-hidden rounded-[2.5rem] border border-white/70 bg-white/78 shadow-[0_35px_120px_rgba(15,23,42,0.14)] ring-1 ring-slate-200/70 backdrop-blur-xl">
          <div className="grid gap-10 px-6 py-8 sm:px-8 lg:grid-cols-[1.08fr_0.92fr] lg:gap-14 lg:px-12 lg:py-12">
            <div className="space-y-8">
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

              <HighlightCard
                label={hero.highlightLabel}
                text={hero.highlightLine}
                tags={hero.trustTags}
              />

              <div className="flex flex-col gap-4 sm:flex-row">
                <RegistrationButton onClick={() => setIsDonorModalOpen(true)}>
                  {hero.primaryCta.label}
                </RegistrationButton>
                <LearnMoreButton href={hero.secondaryCta.href}>
                  {hero.secondaryCta.label}
                </LearnMoreButton>
              </div>


            </div>

            <div className="relative">
              <div className="absolute right-4 top-4 h-24 w-24 rounded-full bg-cyan-100/70 blur-2xl" />

              <SupportModelPanel
                label={hero.panelLabel}
                title={hero.panelTitle}
                text={hero.panelText}
                pillars={hero.pillars}
                metrics={hero.metrics}
              />


            </div>


          </div>
        </div>
      </div>

      <DonorRegistrationModal
        isOpen={isDonorModalOpen}
        language={copy.htmlLang}
        onClose={() => setIsDonorModalOpen(false)}
      />
    </section>
  );
}
