"use client";

import { useState } from "react";
import { AboutSection } from "@/components/public/home/about-section";
import { CeoBani } from "@/components/public/home/ceo-bani";
import { ContactSection } from "@/components/public/home/contact-section";
import { DonateBankInfoModal } from "@/components/public/donate/donate-bank-info-modal";
import { Hero } from "@/components/public/home/hero";
import { QardHasanahBanner } from "@/components/public/home/qard-hasanah-banner";
import { RegistrationSection } from "@/components/public/home/registration-section";
import { HomeMobile } from "@/components/public/home/home-mobile";
import { useIsMobile } from "@/hooks/use-is-mobile";
import { DonorImpactInfoUpdatePage } from "../goat-farming/donor-impact-info-update";

export function HomePage({ featuredProjects }) {
  const isMobile = useIsMobile();
  const [isDonateModalOpen, setIsDonateModalOpen] = useState(false);

  if (isMobile) {
    return <HomeMobile featuredProjects={featuredProjects} />;
  }

  return (
    <>
      <Hero />
      <CeoBani />


      <AboutSection />

      <RegistrationSection />
      <QardHasanahBanner onCtaClick={() => setIsDonateModalOpen(true)} />

      {featuredProjects}
      <DonorImpactInfoUpdatePage />
      {/* <ContactSection /> */}

      <DonateBankInfoModal
        isOpen={isDonateModalOpen}
        project={null}
        onClose={() => setIsDonateModalOpen(false)}
      />
    </>
  );
}
