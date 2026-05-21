"use client";

import { useSiteLocale } from "@/components/providers/locale-provider";
import { SectionHeading } from "@/components/ui/section-heading";

export function ContactSection() {
  const { copy } = useSiteLocale();
  const { contact } = copy;

  return (
    <section id="contact-us" className="bg-slate-50 px-6 pb-24 pt-20 lg:px-8">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-10">
        <SectionHeading
          eyebrow={contact.eyebrow}
          title={contact.title}
          description={contact.description}
        />

        <div className="grid gap-5 md:grid-cols-3">
          {contact.channels.map((item) => (
            <article
              key={item.title}
              className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm shadow-slate-200/70"
            >
              <p className="text-sm font-semibold tracking-[0.2em] text-cyan-700 uppercase">
                {item.title}
              </p>
              <p className="mt-4 text-xl font-semibold text-slate-950">{item.value}</p>
              <p className="mt-3 text-sm leading-7 text-slate-600">
                {item.detail}
              </p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
