import { AboutSection } from "@/components/public/home/about-section";
import { CeoBani } from "@/components/public/home/ceo-bani";
import { ContactSection } from "@/components/public/home/contact-section";
import { Hero } from "@/components/public/home/hero";
import { RegistrationSection } from "@/components/public/home/registration-section";

export function HomePage() {
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
