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
                className="rounded-[2rem] border border-slate-200 bg-slate-50 p-7 shadow-sm shadow-slate-200/70"
              >
                <p className="text-xs font-semibold tracking-[0.24em] text-cyan-700 uppercase">
                  {registration.optionEyebrow}
                </p>
                <h3 className="mt-4 text-2xl font-semibold text-slate-950">
                  {item.title}
                </h3>
                <p className="mt-4 text-sm leading-7 text-slate-600">
                  {item.description}
                </p>
                {item.id === "donor-registration" ? (
                  <button
                    type="button"
                    className="mt-6 inline-flex rounded-full border border-cyan-200 bg-white px-5 py-3 text-sm font-semibold text-cyan-700 transition hover:bg-cyan-50"
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
                    className="mt-6 inline-flex rounded-full border border-cyan-200 bg-white px-5 py-3 text-sm font-semibold text-cyan-700 transition hover:bg-cyan-50"
                  >
                    {registration.continueLabel}
                  </a>
                )}
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
