"use client";

import { HighlightCard } from "@/components/public/home/highlight-card";
import { SupportModelPanel } from "@/components/public/home/support-model-panel";
import { TopHero } from "@/components/public/home/top-hero";
import { LearnMoreButton, RegistrationButton } from "@/components/public/ui/cta-buttons";
import { useSiteLocale } from "@/components/public/providers/locale-provider";

export function HeroMobile() {
  const { copy } = useSiteLocale();
  const { hero } = copy;

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
              <TopHero />

              <HighlightCard
                label={hero.highlightLabel}
                text={hero.highlightLine}
                tags={hero.trustTags}
                tagDetails={hero.trustTagDetails}
              />

              <div className="flex flex-col gap-4 sm:flex-row">
                <RegistrationButton href={hero.primaryCta.href}>
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
    </section>
  );
}
