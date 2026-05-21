"use client";

import { useSiteLocale } from "@/components/providers/locale-provider";
import { SectionHeading } from "@/components/ui/section-heading";

export function AboutSection() {
  const { copy } = useSiteLocale();
  const { about } = copy;

  return (
    <section id="about-us" className="bg-slate-50 px-6 py-20 lg:px-8">
      <div className="mx-auto grid w-full max-w-6xl gap-10 lg:grid-cols-[1fr_1.1fr] lg:items-start">
        <SectionHeading
          eyebrow={about.eyebrow}
          title={about.title}
          description={about.description}
        />

        <div className="grid gap-5 sm:grid-cols-3">
          {about.highlights.map((item) => (
            <article
              key={item.title}
              className="rounded-[2rem] border border-cyan-100/80 bg-white p-6 shadow-xl shadow-cyan-100/50"
            >
              <p className="text-sm font-semibold tracking-[0.2em] text-cyan-700 uppercase">
                {item.title}
              </p>
              <p className="mt-4 text-sm leading-7 text-slate-600">
                {item.description}
              </p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
