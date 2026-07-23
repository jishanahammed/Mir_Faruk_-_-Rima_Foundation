"use client";

import { AboutSection } from "@/components/public/home/about-section";
import { BankInfo } from "@/components/public/home/bank-info";
import { CeoBani } from "@/components/public/home/ceo-bani";
import { ContactSection } from "@/components/public/home/contact-section";
import { Hero } from "@/components/public/home/hero";
import { RegistrationSection } from "@/components/public/home/registration-section";
import { HomeMobile } from "@/components/public/home/home-mobile";
import { useIsMobile } from "@/hooks/use-is-mobile";

export function HomePage({ featuredProjects }) {
  const isMobile = useIsMobile();

  if (isMobile) {
    return <HomeMobile featuredProjects={featuredProjects} />;
  }

  return (
    <>
      <Hero />
      <CeoBani />

      <AboutSection />
      <RegistrationSection />
      {featuredProjects}
      <BankInfo />
      {/* <ContactSection /> */}
    </>
  );
}
