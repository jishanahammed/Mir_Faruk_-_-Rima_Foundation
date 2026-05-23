"use client";

import { useSiteLocale } from "@/components/providers/locale-provider";

export function Hero() {
  const { copy } = useSiteLocale();
  const { brand, hero } = copy;
  const isBangla = copy.htmlLang === "bn";
  const foundationNameMatch = brand.name.match(/^(.*)\s+(Foundation|Fonden)$/);
  const brandNameParts = brand.name.trim().split(/\s+/);
  const localizedFoundationTitle =
    isBangla && brandNameParts.length > 1 ? brandNameParts.slice(0, -1).join(" ") : null;
  const localizedFoundationSuffix =
    isBangla && brandNameParts.length > 1 ? brandNameParts.at(-1) : null;
  const brandTitle = foundationNameMatch?.[1] ?? localizedFoundationTitle ?? brand.name;
  const brandSuffix = foundationNameMatch?.[2] ?? localizedFoundationSuffix;

  return (
    <section
      id="home"
      className="relative overflow-hidden px-6 pb-20 pt-10 lg:px-8 lg:pb-28 lg:pt-16"
    >
      <div className="absolute inset-x-0 top-0 h-[34rem] bg-[radial-gradient(circle_at_top,_rgba(8,145,178,0.18),_transparent_55%)]" />
      <div className="absolute left-[-8rem] top-24 h-64 w-64 rounded-full bg-amber-100/55 blur-3xl" />
      <div className="absolute right-[-6rem] top-16 h-72 w-72 rounded-full bg-cyan-200/45 blur-3xl" />

      <div className="relative mx-auto max-w-7xl">
        <div className="overflow-hidden rounded-[2.5rem] border border-white/70 bg-white/78 shadow-[0_35px_120px_rgba(15,23,42,0.14)] ring-1 ring-slate-200/70 backdrop-blur-xl">
          <div className="grid gap-10 px-6 py-8 sm:px-8 lg:grid-cols-[1.08fr_0.92fr] lg:gap-14 lg:px-12 lg:py-12">
            <div className="space-y-8">
              <div className="space-y-5">
                <span className="inline-flex items-center rounded-full border border-cyan-200 bg-white/92 px-4 py-2 text-[0.68rem] font-semibold tracking-[0.3em] text-cyan-800 uppercase shadow-md shadow-cyan-100/70">
                  {hero.tagline}
                </span>

                <div className="space-y-5">
                  <h3 className="mt-4 max-w-4xl text-[1.55rem] font-semibold leading-[1.05] tracking-normal text-slate-950 sm:text-[2.55rem] md:text-[3.35rem] xl:text-[3.9rem]">
                    <span className="inline-block text-center text-balance">
                      <span
                        className={`block whitespace-nowrap ${
                          isBangla
                            ? "text-cyan-950"
                            : "bg-[linear-gradient(135deg,_#0f172a_6%,_#0f766e_48%,_#0891b2_94%)] bg-clip-text text-transparent"
                        }`}
                      >
                        {brandTitle}
                      </span>
                      {brandSuffix ? (
                        <span
                          className={`mx-auto mt-2 block text-center text-[0.66em] font-extrabold uppercase leading-none tracking-[0.18em] sm:text-[0.58em] ${
                            isBangla
                              ? "text-teal-700"
                              : "bg-[linear-gradient(135deg,_#0f766e_0%,_#0891b2_70%,_#f59e0b_100%)] bg-clip-text text-transparent"
                          }`}
                        >
                          {brandSuffix}
                        </span>
                      ) : null}
                    </span>
                    <span className="mt-3 block text-[0.68em] font-medium leading-[1.18] text-slate-600 sm:text-[0.7em]">
                      <span
                        className={
                          isBangla
                            ? "text-teal-700"
                            : "bg-[linear-gradient(135deg,_#334155_0%,_#0f766e_100%)] bg-clip-text text-transparent"
                        }
                      >
                        {hero.headingLines[1]}
                      </span>
                    </span>
                  </h3>
                  <p className="max-w-3xl text-xs leading-6 text-slate-600 sm:text-sm sm:leading-7 md:text-base md:leading-8">
                    {hero.paragraph}
                  </p>
                </div>
              </div>

              <div className="rounded-[2rem] border border-amber-100 bg-[linear-gradient(135deg,_rgba(255,251,235,0.95),_rgba(255,255,255,0.98),_rgba(236,254,255,0.9))] p-5 shadow-lg shadow-amber-100/40">
                <p className="text-xs font-semibold tracking-[0.28em] text-amber-700 uppercase">
                  {hero.highlightLabel}
                </p>
                <p className="mt-3 max-w-2xl text-base font-medium leading-8 text-slate-800 sm:text-lg">
                  {hero.highlightLine}
                </p>
              </div>

              <div className="flex flex-col gap-4 sm:flex-row">
                <a
                  href={hero.primaryCta.href}
                  className="inline-flex items-center justify-center rounded-full border border-transparent bg-[linear-gradient(135deg,_#0f766e,_#0891b2)] px-6 py-3.5 text-sm font-semibold !text-white shadow-lg shadow-cyan-200/80 transition-all duration-300 ease-out visited:!text-white hover:-translate-y-0.5 hover:border-cyan-300 hover:bg-white hover:bg-none hover:!text-cyan-800 hover:shadow-xl hover:shadow-cyan-300/70 focus:!text-white active:!text-white"
                >
                  {hero.primaryCta.label}
                </a>
                <a
                  href={hero.secondaryCta.href}
                  className="inline-flex items-center justify-center rounded-full border border-slate-200 bg-white/90 px-6 py-3.5 text-sm font-semibold text-slate-700 transition-all duration-300 ease-out hover:-translate-y-0.5 hover:border-cyan-200 hover:bg-cyan-50 hover:text-cyan-800"
                >
                  {hero.secondaryCta.label}
                </a>
              </div>

              <div className="flex flex-wrap gap-3">
                {hero.trustTags.map((tag) => (
                  <span
                    key={tag}
                    className="rounded-full border border-slate-200 bg-white/92 px-4 py-2 text-sm font-medium text-slate-600"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>

            <div className="relative">
              <div className="absolute right-4 top-4 h-24 w-24 rounded-full bg-cyan-100/70 blur-2xl" />

              <div className="rounded-[2.25rem] border border-cyan-200/80 bg-white/92 p-6 ring-1 ring-cyan-100/70 sm:p-8 shadow-[0_30px_90px_rgba(14,116,144,0.14)]">
                <div className="absolute inset-x-10 top-0 h-px bg-[linear-gradient(90deg,_transparent,_rgba(8,145,178,0.45),_transparent)]" />
                <div className="relative">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="text-xs font-semibold tracking-[0.28em] text-cyan-700 uppercase">
                        {hero.panelLabel}
                      </p>
                      <h2 className="mt-4 max-w-sm text-xl font-semibold leading-tight text-slate-950 sm:text-[1.7rem]">
                        {hero.panelTitle}
                      </h2>
                    </div>
                  </div>

                  <p className="mt-5 max-w-xl text-sm leading-7 text-slate-600 sm:text-base">
                    {hero.panelText}
                  </p>

                  <div className="mt-8 grid gap-3">
                    {hero.pillars.map((pillar, index) => (
                      <article
                        key={pillar.title}
                        className="rounded-[1.6rem] border border-cyan-100 bg-[linear-gradient(135deg,_rgba(248,250,252,0.98),_rgba(236,254,255,0.78))] px-4 py-4"
                      >
                        <div className="flex items-start gap-4">
                          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-cyan-200 bg-cyan-50 text-sm font-semibold text-cyan-800">
                            0{index + 1}
                          </div>
                          <div>
                            <h3 className="text-base font-semibold text-slate-900">
                              {pillar.title}
                            </h3>
                            <p className="mt-2 text-sm leading-7 text-slate-600">
                              {pillar.description}
                            </p>
                          </div>
                        </div>
                      </article>
                    ))}
                  </div>

                  <div className="mt-8 grid gap-3 sm:grid-cols-3">
                    {hero.metrics.map((metric) => (
                      <div
                        key={metric.label}
                        className="rounded-[1.5rem] border border-cyan-100 bg-cyan-50/70 px-4 py-4"
                      >
                        <p className="text-lg font-semibold text-slate-950">{metric.value}</p>
                        <p className="mt-1 text-sm leading-6 text-slate-600">{metric.label}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
