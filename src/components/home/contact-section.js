"use client";

import { useSiteLocale } from "@/components/providers/locale-provider";
import { SectionHeading } from "@/components/ui/section-heading";

export function ContactSection() {
  const { copy } = useSiteLocale();
  const { brand, contact } = copy;

  return (
    <section
      id="contact-us"
      className="relative overflow-hidden bg-[linear-gradient(180deg,_#ffffff_0%,_#f8fafc_48%,_#ecfeff_100%)] px-6 pb-24 pt-20 lg:px-8"
    >
      <div className="absolute inset-x-0 top-0 h-px bg-[linear-gradient(90deg,_transparent,_rgba(8,145,178,0.35),_transparent)]" />
      <div className="absolute right-0 top-12 h-72 w-72 rounded-full bg-cyan-100/50 blur-3xl" />

      <div className="relative mx-auto grid w-full max-w-7xl gap-8 lg:grid-cols-[0.9fr_1.1fr] lg:items-start">
        <div className="rounded-[2rem] border border-slate-200/80 bg-white/90 p-6 shadow-[0_24px_80px_rgba(15,23,42,0.08)] ring-1 ring-white/80 backdrop-blur sm:p-8">
          <SectionHeading
            eyebrow={contact.eyebrow}
            title={contact.title}
            description={contact.description}
          />

          <div className="mt-8 rounded-[1.5rem] border border-cyan-100 bg-cyan-50/70 px-5 py-4">
            <p className="text-sm font-semibold leading-6 text-cyan-950">
              {brand.name}
            </p>
            <p className="mt-1 text-sm leading-6 text-slate-600">
              {contact.summary}
            </p>
          </div>
        </div>

        <div className="grid gap-4">
          {contact.channels.map((item, index) => {
            const content = (
              <>
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border border-cyan-100 bg-cyan-50 text-sm font-semibold text-cyan-800 transition-colors duration-300 group-hover:bg-cyan-700 group-hover:text-white">
                  0{index + 1}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-xs font-semibold tracking-[0.22em] text-cyan-700 uppercase">
                    {item.title}
                  </p>
                  <p className="mt-2 break-words text-xl font-semibold leading-8 text-slate-950">
                    {item.value}
                  </p>
                  <p className="mt-2 text-sm leading-7 text-slate-600">
                    {item.detail}
                  </p>
                </div>
              </>
            );

            const className =
              "group flex gap-4 rounded-[2rem] border border-slate-200 bg-white p-5 shadow-[0_18px_60px_rgba(15,23,42,0.07)] transition-all duration-300 ease-out hover:-translate-y-0.5 hover:border-cyan-200 hover:shadow-[0_24px_80px_rgba(8,145,178,0.14)] sm:p-6";

            return item.href ? (
              <a key={item.title} href={item.href} className={className}>
                {content}
              </a>
            ) : (
              <article key={item.title} className={className}>
                {content}
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
