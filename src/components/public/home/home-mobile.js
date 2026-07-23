"use client";

import { useState } from "react";
import { DonorImpactInfoUpdatePage } from "@/components/public/goat-farming/donor-impact-info-update";
import { AboutSection } from "@/components/public/home/about-section";
import { BankInfo } from "@/components/public/home/bank-info";
import { CeoBani } from "@/components/public/home/ceo-bani";
import { DonorRegistrationModal } from "@/components/public/home/donor-registration-modal";
import { HighlightCard } from "@/components/public/home/highlight-card";
import { RegistrationSection } from "@/components/public/home/registration-section";
import { SupportModelPanel } from "@/components/public/home/support-model-panel";
import { TopHero } from "@/components/public/home/top-hero";
import { LearnMoreButton, RegistrationButton } from "@/components/public/ui/cta-buttons";
import { useSiteLocale } from "@/components/public/providers/locale-provider";

// Mobile-only composition of the home page: the hero is split apart so the
// CEO letter sits right under the heading, followed by the highlight and
// support cards as a single scrollable column with full-width CTAs.
export function HomeMobile() {
  const { copy } = useSiteLocale();
  const { hero } = copy;
  const [isDonorModalOpen, setIsDonorModalOpen] = useState(false);

  return (
    <>
      <section id="home" className="relative overflow-hidden px-5 pb-12 pt-8">
        <div className="absolute inset-x-0 top-0 h-[26rem] bg-[radial-gradient(circle_at_top,_rgba(8,145,178,0.18),_transparent_55%)]" />
        <div className="absolute left-[-6rem] top-20 h-48 w-48 rounded-full bg-amber-100/55 blur-3xl" />
        <div className="absolute right-[-5rem] top-10 h-56 w-56 rounded-full bg-cyan-200/45 blur-3xl" />

        <div className="relative overflow-hidden rounded-[2rem] border border-white/70 bg-white/78 px-5 py-7 shadow-[0_25px_80px_rgba(15,23,42,0.14)] ring-1 ring-slate-200/70 backdrop-blur-xl">
          <TopHero />
        </div>
      </section>

      <CeoBani />

      <section className="relative overflow-hidden px-5 py-12">
        <div className="absolute right-[-5rem] top-8 h-48 w-48 rounded-full bg-cyan-100/60 blur-3xl" />

        <div className="relative space-y-6">
          <HighlightCard
            label={hero.highlightLabel}
            text={hero.highlightLine}
            tags={hero.trustTags}
          />

          <DonorImpactInfoUpdatePage />

          <SupportModelPanel
            label={hero.panelLabel}
            title={hero.panelTitle}
            text={hero.panelText}
            pillars={hero.pillars}
            metrics={hero.metrics}
          />

          <LearnMoreButton
            href={hero.secondaryCta.href}
            className="w-full border-2! border-cyan-400! mt-6"
          >
            {hero.secondaryCta.label}
          </LearnMoreButton>
        </div>
      </section>

      <AboutSection className="pt-6" />

      <section className="px-5 pb-0 pt-12">
        <RegistrationButton onClick={() => setIsDonorModalOpen(true)} className="w-full">
          {hero.primaryCta.label}
        </RegistrationButton>
      </section>

      <RegistrationSection />

      <BankInfo />

      <DonorRegistrationModal
        isOpen={isDonorModalOpen}
        language={copy.htmlLang}
        onClose={() => setIsDonorModalOpen(false)}
      />
    </>
  );
}
