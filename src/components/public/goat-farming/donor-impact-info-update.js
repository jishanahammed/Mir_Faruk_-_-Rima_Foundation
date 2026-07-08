"use client";

import { Fragment, useId } from "react";
import { useSiteLocale } from "@/components/public/providers/locale-provider";

function SectionHeading({ children }) {
  return (
    <h2 className="text-center text-lg font-bold text-emerald-900 sm:text-2xl">
      {children}
    </h2>
  );
}

// Per-stage accent colors for the growth table (same palette/order as the
// goat-farming pages: start, 6mo, 12mo, 18mo, 24mo).
const growthRowThemes = [
  {
    badge: "bg-emerald-800 text-white",
    chip: "bg-emerald-700 text-white",
    total: "bg-emerald-700 text-white",
    accent: "text-emerald-700",
    bar: "bg-emerald-600",
  },
  {
    badge: "bg-sky-700 text-white",
    chip: "bg-sky-600 text-white",
    total: "bg-sky-700 text-white",
    accent: "text-sky-700",
    bar: "bg-sky-500",
  },
  {
    badge: "bg-violet-700 text-white",
    chip: "bg-violet-600 text-white",
    total: "bg-violet-700 text-white",
    accent: "text-violet-700",
    bar: "bg-violet-500",
  },
  {
    badge: "bg-orange-500 text-white",
    chip: "bg-orange-500 text-white",
    total: "bg-orange-500 text-white",
    accent: "text-orange-600",
    bar: "bg-orange-400",
  },
  {
    badge: "bg-emerald-800 text-white",
    chip: "bg-emerald-800 text-white",
    total: "bg-emerald-800 text-white",
    accent: "text-emerald-800",
    bar: "bg-emerald-700",
  },
];

function CheckItem({ children }) {
  return (
    <li className="flex items-start gap-2.5">
      <span
        className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-emerald-100 text-[0.7rem] font-bold text-emerald-700"
        aria-hidden="true"
      >
        ✓
      </span>
      <span className="text-sm leading-7 text-slate-700">{children}</span>
    </li>
  );
}

function FlowArrow({ label }) {
  return (
    <div className="flex shrink-0 flex-col items-center justify-center gap-1 lg:flex-row lg:gap-2">
      {label ? (
        <span className="rounded-full bg-sky-700 px-2.5 py-1 text-[0.6rem] font-bold text-white">
          {label}
        </span>
      ) : null}
      <span className="text-2xl font-bold text-emerald-500 lg:hidden" aria-hidden="true">
        ↓
      </span>
      <span
        className="hidden text-2xl font-bold text-emerald-500 lg:block"
        aria-hidden="true"
      >
        →
      </span>
    </div>
  );
}

function FlowDown() {
  return (
    <span
      className="mx-auto flex h-9 w-9 items-center justify-center rounded-full border border-emerald-200 bg-white text-lg font-bold text-emerald-600 shadow-sm"
      aria-hidden="true"
    >
      ↓
    </span>
  );
}

function StepCard({ icon, heading, items }) {
  return (
    <div className="rounded-[2rem] border border-emerald-100 bg-white p-5 shadow-[0_18px_60px_rgba(6,95,70,0.06)] sm:p-8">
      <div className="text-center">
        <p className="inline-flex items-center gap-2 rounded-full bg-emerald-800 px-5 py-2 text-xs font-bold text-white sm:text-sm">
          <span aria-hidden="true">{icon}</span>
          {heading}
        </p>
      </div>
      <ol className="mt-7 grid gap-x-4 gap-y-7 sm:grid-cols-3">
        {items.map((item, index) => (
          <li
            key={index}
            className="relative rounded-3xl border border-emerald-100 bg-emerald-50/40 px-4 pb-4 pt-6 text-center"
          >
            <span className="absolute -top-3.5 left-1/2 flex h-7 w-7 -translate-x-1/2 items-center justify-center rounded-full bg-emerald-700 text-xs font-bold text-white ring-4 ring-white">
              {index + 1}
            </span>
            <p className="text-sm leading-7 text-slate-600">{item}</p>
          </li>
        ))}
      </ol>
    </div>
  );
}

function CycleCard({ icon, title, description, highlight }) {
  return (
    <div
      className={`flex w-full max-w-xs flex-col items-center gap-1.5 rounded-3xl border px-4 py-4 text-center shadow-sm lg:w-40 ${highlight
        ? "border-emerald-200 bg-emerald-800 text-white"
        : "border-emerald-100 bg-white"
        }`}
    >
      <span className="text-2xl" aria-hidden="true">
        {icon}
      </span>
      <p
        className={`text-sm font-bold ${highlight ? "text-white" : "text-slate-900"}`}
      >
        {title}
      </p>
      <p
        className={`text-[0.68rem] leading-5 ${highlight ? "text-emerald-100" : "text-slate-500"
          }`}
      >
        {description}
      </p>
    </div>
  );
}

// Growth table (same design as the goat-farming donor-plan page): reads the
// goat-farming stage copy so the numbers/wording stay in sync.
function GrowthTable({ gf, note, heading, variant }) {
  const cardsOnly = variant === "cards";
  return (
    <div className="flex h-full flex-col overflow-hidden rounded-[2rem] border border-emerald-100 bg-white shadow-[0_18px_60px_rgba(6,95,70,0.06)]">
      <p className="bg-emerald-800 px-5 py-3 text-center text-sm font-bold leading-5 text-white">
        {(Array.isArray(heading) ? heading : [heading]).map((line, index) => (
          <span key={index} className="block">
            {line}
          </span>
        ))}
      </p>

      {/* Desktop table (hidden in cards-only mode) */}
      <table
        className={`w-full table-fixed border-collapse text-sm ${cardsOnly ? "hidden" : "hidden sm:table"
          }`}
      >
        <thead>
          <tr className="bg-emerald-800 text-white">
            <th className="w-[20%] border-r border-emerald-700/40 px-4 py-4 text-left font-semibold">
              {gf.columns.period}
            </th>
            <th className="border-r border-emerald-700/40 px-4 py-4 text-left font-semibold">
              {gf.columns.explanation}
            </th>
            <th className="w-[17%] border-r border-emerald-700/40 px-4 py-4 text-center font-semibold">
              {gf.columns.newborns}
            </th>
            <th className="w-[17%] px-4 py-4 text-center font-semibold">
              {gf.columns.total}
            </th>
          </tr>
        </thead>
        <tbody>
          {gf.stages.map((stage, index) => (
            <tr key={stage.period} className="border-t border-emerald-100 align-middle">
              <td className="border-r border-emerald-100 px-4 py-5">
                <span
                  className={`inline-flex flex-col items-center gap-1 rounded-2xl px-4 py-2 text-center text-sm font-bold ${growthRowThemes[index].badge}`}
                >
                  <span>{stage.period}</span>
                  {stage.periodNote ? (
                    <span className="text-xs font-medium opacity-90">
                      {stage.periodNote}
                    </span>
                  ) : null}
                </span>
              </td>
              <td className="border-r border-emerald-100 px-4 py-5 text-[0.88rem] leading-7 text-slate-700">
                {stage.explanation.map((line, lineIndex) => (
                  <p key={lineIndex} className={lineIndex > 0 ? "mt-1" : ""}>
                    {line}
                  </p>
                ))}
              </td>
              <td className="border-r border-emerald-100 px-4 py-5 text-center">
                <span
                  className={`inline-flex h-12 w-12 items-center justify-center rounded-full text-base font-bold ${growthRowThemes[index].chip}`}
                >
                  {stage.newborns}
                </span>
                <div className={`mt-1 text-xs font-semibold ${growthRowThemes[index].accent}`}>
                  {gf.unit}
                </div>
              </td>
              <td className="px-4 py-5 text-center">
                <span
                  className={`inline-flex min-w-[3.5rem] flex-col items-center rounded-2xl px-3 py-2.5 text-xl font-bold ${growthRowThemes[index].total}`}
                >
                  <span>{stage.total}</span>
                  <span className="text-xs font-semibold">{gf.unit}</span>
                  {stage.totalNote ? (
                    <span className="mt-1 text-[0.6rem] font-medium opacity-90">
                      {stage.totalNote}
                    </span>
                  ) : null}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Stacked cards (always shown in cards-only mode; else mobile-only) */}
      <div className={`space-y-2.5 p-3 ${cardsOnly ? "" : "sm:hidden"}`}>
        {gf.stages.map((stage, index) => (
          <article
            key={stage.period}
            className="overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-[0_6px_18px_rgba(15,23,42,0.05)]"
          >
            <div className="p-3">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <p className="text-sm font-bold text-slate-900">{stage.period}</p>
                  {stage.periodNote ? (
                    <p className="text-[0.7rem] font-medium text-slate-500">
                      {stage.periodNote}
                    </p>
                  ) : null}
                </div>
                <span
                  className={`inline-flex flex-col items-center rounded-lg px-2 py-1 text-center leading-tight ${growthRowThemes[index].total}`}
                >
                  <span className="text-xs font-bold">
                    {stage.total} {gf.unit}
                  </span>
                  <span className="text-[0.5rem] font-medium opacity-90">
                    {gf.columns.total}
                  </span>
                </span>
              </div>

              <div className="mt-2 space-y-0.5 text-[0.8rem] leading-5 text-slate-600">
                {stage.explanation.map((line, lineIndex) => (
                  <p key={lineIndex}>{line}</p>
                ))}
              </div>

              <div className="mt-2 flex items-center gap-2 border-t border-slate-100 pt-2 text-[0.8rem]">
                <span className="font-semibold text-slate-500">
                  {gf.columns.newborns}
                </span>
                <span
                  className={`ml-auto inline-flex h-7 min-w-7 items-center justify-center rounded-full px-2 text-[0.8rem] font-bold ${growthRowThemes[index].chip}`}
                >
                  {stage.newborns}
                </span>
                <span className={`font-semibold ${growthRowThemes[index].accent}`}>
                  {gf.unit}
                </span>
              </div>
            </div>
          </article>
        ))}
      </div>

      {note ? (
        <p className="border-t border-emerald-100 bg-emerald-50/50 px-5 py-3 text-[0.68rem] leading-5 text-slate-500">
          {note}
        </p>
      ) : null}
    </div>
  );
}

// Professional flow arrow between chain cards: red gradient block arrow with
// rounded corners, a soft shadow and the white label locked to the centre of
// the arrow body. Points right on desktop, down on mobile. Caption below.
function RedArrow({ label, caption }) {
  const gradientId = useId();
  return (
    <div className="flex shrink-0 flex-col items-center justify-center gap-2.5 self-center py-3 lg:w-25 lg:py-0">
      {/* Mobile: label shown as a pill above the down-arrow (the vertical
          arrow is too narrow to hold horizontal text). Desktop: text lives
          inside the arrow body instead. */}
      <span className="rounded-full bg-gradient-to-r from-red-500 to-red-700 px-3.5 py-1 text-[0.7rem] font-bold text-white shadow-sm lg:hidden">
        {label}
      </span>
      <svg
        viewBox="0 0 220 84"
        className="my-7 w-20 rotate-90 drop-shadow-[0_6px_12px_rgba(185,28,28,0.30)] sm:my-9 sm:w-28 lg:my-0 lg:rotate-0"
      >
        <defs>
          <linearGradient id={gradientId} x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#ef4444" />
            <stop offset="100%" stopColor="#b91c1c" />
          </linearGradient>
        </defs>
        {/* stroke in the same gradient rounds the corners of the shape */}
        <polygon
          points="8,28 158,28 158,10 214,42 158,74 158,56 8,56"
          fill={`url(#${gradientId})`}
          stroke={`url(#${gradientId})`}
          strokeWidth="8"
          strokeLinejoin="round"
        />
        <text
          x="83"
          y="42"
          dy="0.35em"
          textAnchor="middle"
          fontSize="20"
          fontWeight="700"
          letterSpacing="0.4"
          fill="#ffffff"
          className="hidden lg:block"
        >
          {label}
        </text>
      </svg>
      {caption ? (
        <p className="max-w-[11rem] text-center text-[0.7rem] font-bold leading-5 text-blue-700 sm:text-xs">
          {(Array.isArray(caption) ? caption : [caption]).map((line, index) => (
            <span key={index} className="block">
              {line}
            </span>
          ))}
        </p>
      ) : null}
    </div>
  );
}

export function DonorImpactInfoUpdatePage() {
  const { copy } = useSiteLocale();
  const di = copy.donorImpact;
  // Growth table reuses the goat-farming chart copy so the numbers stay in sync.
  const gf = copy.goatFarming;

  return (
    <section className="relative overflow-hidden bg-[linear-gradient(180deg,_#f4fbf4_0%,_#ffffff_35%,_#f4fffb_100%)] px-4 py-14 sm:px-6 lg:px-8 lg:py-20">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(16,122,87,0.10),_transparent_28%),radial-gradient(circle_at_bottom_right,_rgba(245,158,11,0.10),_transparent_24%)]" />

      <div className="relative mx-auto flex w-full max-w-6xl flex-col gap-8">
        {/* ── Hero ─────────────────────────────────────────────────────── */}
        <header className="overflow-hidden rounded-[2rem] border border-emerald-100 bg-white shadow-[0_28px_90px_rgba(6,95,70,0.10)]">
          {/* top accent line */}
          <span
            className="block h-1.5 w-full bg-[linear-gradient(90deg,_#065f46,_#0d9488_45%,_#f59e0b)]"
            aria-hidden="true"
          />

          <div className="grid gap-8 px-6 py-10 sm:px-10 lg:grid-cols-[1.4fr_1fr] lg:items-center lg:py-12">
            <div className="text-center lg:text-left">
              <p className="inline-flex items-center gap-2 text-[0.65rem] font-semibold uppercase tracking-[0.3em] text-emerald-700 sm:text-xs">
                <span
                  className="hidden h-px w-8 bg-emerald-300 lg:inline-block"
                  aria-hidden="true"
                />
                {copy.brand.name}
              </p>
              <h1 className="mt-3 text-3xl font-bold leading-tight tracking-tight text-emerald-950 sm:text-4xl lg:text-[2.75rem]">
                {di.title}
              </h1>
              <span
                className="mx-auto mt-4 block h-1 w-16 rounded-full bg-[linear-gradient(90deg,_#059669,_#f59e0b)] lg:mx-0"
                aria-hidden="true"
              />
              <p className="mt-4 inline-flex max-w-xl rounded-full border border-emerald-200 bg-emerald-50/70 px-5 py-2 text-xs font-semibold leading-6 text-emerald-900 sm:text-sm">
                {di.subtitle}
              </p>
            </div>

            {/* Hadith quote */}
            <figure className="relative overflow-hidden rounded-3xl bg-[linear-gradient(140deg,_#052e22,_#064e3b_45%,_#047857)] p-6 text-center text-white shadow-2xl shadow-emerald-950/20 ring-1 ring-white/10 sm:p-7">
              <span
                className="pointer-events-none absolute -right-6 -top-10 text-[7rem] font-serif leading-none text-white/[0.06]"
                aria-hidden="true"
              >
                ❝
              </span>
              <span
                className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(255,255,255,0.10),_transparent_45%)]"
                aria-hidden="true"
              />
              <div className="relative">
                <p className="text-xl leading-10 sm:text-[1.35rem]" dir="rtl" lang="ar">
                  {di.quote.arabic}
                </p>
                <span
                  className="mx-auto my-3 flex w-24 items-center gap-2"
                  aria-hidden="true"
                >
                  <span className="h-px flex-1 bg-emerald-400/40" />
                  <span className="h-1.5 w-1.5 rotate-45 bg-amber-400/80" />
                  <span className="h-px flex-1 bg-emerald-400/40" />
                </span>
                <blockquote className="text-xs italic leading-6 text-emerald-50 sm:text-sm">
                  {di.quote.text}
                </blockquote>
                <figcaption className="mt-3 text-[0.62rem] font-semibold uppercase tracking-[0.18em] text-amber-300/90">
                  {di.quote.source}
                </figcaption>
              </div>
            </figure>
          </div>

          {/* Feature strip */}
          <div className="flex flex-wrap items-stretch justify-center gap-2 border-t border-emerald-100 bg-emerald-50/60 px-4 py-4 sm:gap-3 sm:px-8">
            {di.features.map((feature) => (
              <span
                key={feature.label}
                className="flex items-center gap-2 rounded-full border border-emerald-100 bg-white px-3 py-1.5 text-[0.68rem] font-semibold text-slate-700 shadow-sm sm:text-xs"
              >
                <span aria-hidden="true">{feature.icon}</span>
                {feature.label}
              </span>
            ))}
          </div>
        </header>

        {/* ── Mission ──────────────────────────────────────────────────── */}
        <div className="rounded-[2rem] border border-emerald-100 bg-white p-5 shadow-[0_18px_60px_rgba(6,95,70,0.06)] sm:p-8">
          <SectionHeading>{di.mission.heading}</SectionHeading>
          <div className="mx-auto mt-4 max-w-3xl space-y-3">
            {di.mission.paragraphs.map((paragraph, index) => (
              <p key={index} className="text-sm leading-8 text-slate-600 sm:text-[0.95rem]">
                {paragraph}
              </p>
            ))}
          </div>
        </div>

        {/* ── Step 1 → Chain flow → Step 2 ─────────────────────────────── */}
        <div className="flex flex-col gap-5">
          {/* Step 1 */}
          <StepCard
            icon="🤲"
            heading={di.step1.heading}
            items={di.step1.items}
          />

          <FlowDown />

          {/* Growth — 3 chain cards with red arrows + captions between them */}
          <div className="flex flex-col items-stretch gap-2 lg:flex-row lg:items-start lg:justify-center">
            {di.chain.cardTitles.map((cardTitle, index) => (
              <Fragment key={index}>
                <div className="flex flex-1 flex-col">
                  <GrowthTable
                    variant="cards"
                    gf={gf}
                    heading={cardTitle}
                    note={di.growth.note}
                  />
                </div>
                {di.chain.arrows[index] ? (
                  <RedArrow
                    label={di.chain.arrows[index].label}
                    caption={di.chain.arrows[index].caption}
                  />
                ) : null}
              </Fragment>
            ))}
          </div>

          <FlowDown />

          {/* Step 2 */}
          <StepCard
            icon="🔄"
            heading={di.step2.heading}
            items={di.step2.items}
          />
        </div>

        {/* ── Continuous cycle ─────────────────────────────────────────── */}
        <div className="rounded-[2rem] border border-emerald-100 bg-white p-5 shadow-[0_18px_60px_rgba(6,95,70,0.06)] sm:p-8">
          <SectionHeading>{di.cycle.heading}</SectionHeading>
          <p className="mt-1 text-center text-xs text-slate-500">
            {di.cycle.subheading}
          </p>

          <div className="mt-6 flex flex-col items-center gap-3 lg:flex-row lg:flex-wrap lg:items-stretch lg:justify-center">
            <CycleCard
              icon="🤲"
              title={di.cycle.donorTitle}
              description={di.cycle.donorDesc}
              highlight
            />
            {[1, 2, 3, 4].map((receiverNumber) => (
              <Fragment key={receiverNumber}>
                <FlowArrow
                  label={receiverNumber > 1 ? di.cycle.afterLabel : undefined}
                />
                <CycleCard
                  icon="🏠"
                  title={`${di.cycle.receiverTitle} ${receiverNumber}`}
                  description={
                    receiverNumber === 1 ? di.cycle.receiveDesc : di.cycle.giveDesc
                  }
                />
              </Fragment>
            ))}
          </div>

          <p className="mx-auto mt-6 max-w-2xl rounded-2xl border border-dashed border-emerald-300 bg-emerald-50/70 px-4 py-3 text-center text-xs font-semibold leading-6 text-emerald-900 sm:text-sm">
            ♾️ {di.cycle.infinity}
          </p>
        </div>

        {/* ── Example timeline ─────────────────────────────────────────── */}
        <div className="rounded-[2rem] border border-emerald-100 bg-white p-5 shadow-[0_18px_60px_rgba(6,95,70,0.06)] sm:p-8">
          <SectionHeading>{di.example.heading}</SectionHeading>
          <div className="mt-6 grid gap-4 lg:grid-cols-3">
            {di.example.phases.map((phase, index) => (
              <div
                key={phase.year}
                className="rounded-3xl border border-emerald-100 bg-emerald-50/40 p-4"
              >
                <span
                  className={`inline-flex rounded-full px-3.5 py-1 text-xs font-bold text-white ${["bg-emerald-700", "bg-sky-700", "bg-orange-500"][index] ??
                    "bg-emerald-700"
                    }`}
                >
                  {phase.year}
                </span>
                <ul className="mt-3 space-y-2">
                  {phase.lines.map((line, lineIndex) => (
                    <li
                      key={lineIndex}
                      className="flex items-start gap-2 text-[0.82rem] leading-6 text-slate-600"
                    >
                      <span className="mt-0.5 text-emerald-500" aria-hidden="true">
                        ▸
                      </span>
                      {line}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          <p className="mx-auto mt-5 max-w-3xl text-center text-sm leading-7 text-slate-600">
            {di.example.closing}
          </p>
        </div>

        {/* ── Why exceptional ──────────────────────────────────────────── */}
        <div className="rounded-[2rem] border border-emerald-100 bg-white p-5 shadow-[0_18px_60px_rgba(6,95,70,0.06)] sm:p-8">
          <SectionHeading>{di.why.heading}</SectionHeading>
          <ul className="mt-5 grid gap-x-6 gap-y-3 sm:grid-cols-2 lg:grid-cols-4">
            {di.why.items.map((item) => (
              <CheckItem key={item}>{item}</CheckItem>
            ))}
          </ul>
        </div>

        {/* ── Donor view + Commitment ──────────────────────────────────── */}
        <div className="grid gap-6 lg:grid-cols-2">
          <div className="rounded-[2rem] border border-emerald-100 bg-white p-5 shadow-[0_18px_60px_rgba(6,95,70,0.06)] sm:p-8">
            <h2 className="flex items-center gap-2 text-lg font-bold text-emerald-900 sm:text-xl">
              <span aria-hidden="true">🖥️</span> {di.donorView.heading}
            </h2>
            <p className="mt-3 text-sm leading-7 text-slate-600">
              {di.donorView.intro}
            </p>
            <ul className="mt-4 space-y-2.5">
              {di.donorView.items.map((item) => (
                <CheckItem key={item}>{item}</CheckItem>
              ))}
            </ul>
            <p className="mt-4 rounded-2xl bg-emerald-50/70 px-4 py-3 text-xs font-semibold leading-6 text-emerald-900">
              {di.donorView.closing}
            </p>
          </div>

          <div className="rounded-[2rem] border border-emerald-100 bg-white p-5 shadow-[0_18px_60px_rgba(6,95,70,0.06)] sm:p-8">
            <h2 className="flex items-center gap-2 text-lg font-bold text-emerald-900 sm:text-xl">
              <span aria-hidden="true">🛡️</span> {di.commitment.heading}
            </h2>
            <ul className="mt-4 space-y-2.5">
              {di.commitment.items.map((item) => (
                <CheckItem key={item}>{item}</CheckItem>
              ))}
            </ul>
          </div>
        </div>

        {/* ── Belief banner ────────────────────────────────────────────── */}
        <div className="rounded-[2rem] bg-[linear-gradient(135deg,_#064e3b,_#065f46_60%,_#047857)] px-6 py-8 text-center text-white shadow-xl shadow-emerald-950/10 sm:px-12">
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-emerald-200">
            {di.belief.heading}
          </p>
          <div className="mx-auto mt-4 max-w-3xl space-y-2">
            {di.belief.lines.map((line, index) => (
              <p
                key={index}
                className={
                  index === di.belief.lines.length - 1
                    ? "text-sm font-semibold leading-8 text-emerald-50 sm:text-base"
                    : "text-sm leading-8 text-emerald-100"
                }
              >
                {line}
              </p>
            ))}
          </div>
          <span className="mt-4 inline-block text-xl" aria-hidden="true">
            🌱
          </span>
        </div>
      </div>
    </section>
  );
}
