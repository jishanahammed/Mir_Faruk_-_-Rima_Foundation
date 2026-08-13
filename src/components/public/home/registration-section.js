"use client";

import { useState } from "react";
import { DonorRegistrationModal } from "@/components/public/home/donor-registration-modal";
import { useSiteLocale } from "@/components/public/providers/locale-provider";
import { SectionHeading } from "@/components/public/ui/section-heading";

export function RegistrationSection() {
  const { copy } = useSiteLocale();
  const { registration } = copy;
  const [isDonorModalOpen, setIsDonorModalOpen] = useState(false);

  return (
    <>
      <section id="registration" className="bg-white px-6 py-20 lg:px-8">
        <div className="mx-auto flex w-full max-w-6xl flex-col gap-10">
          <SectionHeading
            eyebrow={registration.eyebrow}
            title={registration.title}
            description={registration.description}
          />

          <div className="grid gap-6 lg:grid-cols-3">
            {registration.options.map((item) => (
              <article
                key={item.id}
                id={item.id}
                className="relative overflow-hidden rounded-[2rem] border border-slate-200/80 bg-white p-6 shadow-[0_20px_45px_-30px_rgba(15,23,42,0.4)] lg:bg-slate-50 lg:p-7"
              >
                <div
                  aria-hidden="true"
                  className="absolute inset-x-0 top-0 h-24 bg-[radial-gradient(circle_at_top,rgba(34,211,238,0.22),transparent_72%)] lg:hidden"
                />
                <div className="relative flex h-full flex-col items-center text-center sm:items-start sm:text-left">
                  <p className="inline-flex rounded-full border border-cyan-100 bg-cyan-50 px-3 py-1 text-[0.65rem] font-bold tracking-[0.22em] text-cyan-800 uppercase">
                    {registration.optionEyebrow}
                  </p>
                  <h3 className="mt-4 text-xl font-semibold leading-tight text-slate-950 sm:text-2xl">
                    {item.title}
                  </h3>
                  <p className="mt-3 text-sm leading-6 text-slate-600 sm:leading-7">
                    {item.description}
                  </p>
                  {item.id === "donor-registration" ? (
                    <button
                      type="button"
                      className="mt-5 inline-flex items-center justify-center rounded-full border-0 bg-[linear-gradient(135deg,#0e7490,#06b6d4_50%,#0d9488)] px-6 py-2.5 text-sm font-extrabold text-white! shadow-lg shadow-cyan-500/40 ring-2 ring-cyan-300/60 transition hover:scale-105 hover:shadow-xl hover:shadow-cyan-500/50 hover:brightness-110 lg:mt-6"
                      onClick={() => setIsDonorModalOpen(true)}
                    >
                      {registration.continueLabel}
                    </button>
                  ) : (
                    <a
                      href={
                        item.id === "beneficiary-registration"
                          ? "/register/beneficiary"
                          : "/contact"
                      }
                      className="mt-5 inline-flex items-center justify-center rounded-full bg-[linear-gradient(135deg,#0e7490,#06b6d4_50%,#0d9488)] px-6 py-2.5 text-sm font-extrabold text-white! shadow-lg shadow-cyan-500/40 ring-2 ring-cyan-300/60 transition hover:scale-105 hover:shadow-xl hover:shadow-cyan-500/50 hover:brightness-110 lg:mt-6"
                    >
                      {registration.continueLabel}
                    </a>
                  )}
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <DonorRegistrationModal
        isOpen={isDonorModalOpen}
        language={copy.htmlLang}
        onClose={() => setIsDonorModalOpen(false)}
      />

    </>
  );
}
