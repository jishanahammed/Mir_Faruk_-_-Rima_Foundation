"use client";

import { AboutSection } from "@/components/public/home/about-section";
import { CeoBani } from "@/components/public/home/ceo-bani";
import { ContactSection } from "@/components/public/home/contact-section";
import { Hero } from "@/components/public/home/hero";
import { RegistrationSection } from "@/components/public/home/registration-section";
import { useIsMobile } from "@/hooks/use-is-mobile";
import { HeroMobile } from "./heroMobile";

export function HomePage() {
  const isMobile = useIsMobile();

  if (isMobile) {
    return (
      <>
        <HeroMobile />
        <AboutSection />
        <RegistrationSection />
      </>
    );
  }

  return (
    <>
      <Hero />
      <CeoBani />
      <AboutSection />
      <RegistrationSection />
      {/* <ContactSection /> */}
    </>
  );
}
