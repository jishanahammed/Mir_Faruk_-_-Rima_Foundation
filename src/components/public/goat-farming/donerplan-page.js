"use client";

import { useSiteLocale } from "@/components/public/providers/locale-provider";

// Presentation-only data, indexed by stage position (same order across locales).
// Text/numbers come from copy.goatFarming.stages.
const stageVisuals = [
  {
    icon: "🕐",
    motherGroups: [2],
    kidGroups: [],
    theme: {
      badge: "bg-emerald-800 text-white",
      chip: "bg-emerald-700 text-white",
      total: "bg-emerald-700 text-white",
      accentText: "text-emerald-700",
      bar: "bg-emerald-600",
      soft: "bg-emerald-50",
      softBorder: "border-emerald-100",
    },
  },
  {
    icon: null,
    motherGroups: [2],
    kidGroups: [4],
    hideKidsPlus: true,
    stack: true,
    theme: {
      badge: "bg-sky-700 text-white",
      chip: "bg-sky-600 text-white",
      total: "bg-sky-700 text-white",
      accentText: "text-sky-700",
      bar: "bg-sky-500",
      soft: "bg-sky-50",
      softBorder: "border-sky-100",
    },
  },
  {
    icon: null,
    motherGroups: [2],
    kidGroups: [
      { count: 4, labelKey: "oldKidLabel" },
      { count: 4, labelKey: "newKidLabel" },
    ],
    stack: true,
    sumLine: {
      parts: [
        { count: 2, labelKey: "motherLabel" },
        { count: 4, labelKey: "oldKidLabel" },
        { count: 4, labelKey: "newKidLabel" },
      ],
      total: 10,
    },
    theme: {
      badge: "bg-violet-700 text-white",
      chip: "bg-violet-600 text-white",
      total: "bg-violet-700 text-white",
      accentText: "text-violet-700",
      bar: "bg-violet-500",
      soft: "bg-violet-50",
      softBorder: "border-violet-100",
    },
  },
  {
    icon: null,
    motherGroups: [
      { count: 2, labelKey: "origMotherLabel" },
      { count: 2, labelKey: "newMotherLabel" },
    ],
    kidGroups: [
      { count: 8, labelKey: "newKidLabel", chunk: 4 },
      { count: 8, labelKey: "oldKidLabel", chunk: 4, noPlus: true },
    ],
    stack: true,
    stackKids: true,
    kidRowLayout: true,
    sumLine: {
      parts: [
        { count: 2, labelKey: "origMotherLabel" },
        { count: 2, labelKey: "newMotherLabel" },
        { count: 8, labelKey: "newKidLabel" },
        { count: 8, labelKey: "oldKidLabel" },
      ],
      total: 18,
    },
    theme: {
      badge: "bg-orange-500 text-white",
      chip: "bg-orange-500 text-white",
      total: "bg-orange-500 text-white",
      accentText: "text-orange-600",
      bar: "bg-orange-400",
      soft: "bg-orange-50",
      softBorder: "border-orange-100",
    },
  },
  {
    icon: "📅",
    motherGroups: [
      { count: 2, labelKey: "origMotherLabel" },
      { count: 2, labelKey: "newMother6Label" },
      { count: 2, labelKey: "newMother12Label" },
    ],
    kidGroups: [
      { count: 12, labelKey: "newKidLabel", chunk: 4 },
      { count: 12, labelKey: "oldKidLabel", chunk: 4, noPlus: true },
    ],
    stack: true,
    stackKids: true,
    kidRowLayout: true,
    sumLine: {
      parts: [
        { count: 2, labelKey: "origMotherLabel" },
        { count: 2, labelKey: "newMother6Label" },
        { count: 2, labelKey: "newMother12Label" },
        { count: 12, labelKey: "newKidLabel" },
        { count: 12, labelKey: "oldKidLabel" },
      ],
      total: 30,
    },
    theme: {
      badge: "bg-emerald-800 text-white",
      chip: "bg-emerald-800 text-white",
      total: "bg-emerald-800 text-white",
      accentText: "text-emerald-800",
      bar: "bg-emerald-700",
      soft: "bg-emerald-50",
      softBorder: "border-emerald-100",
    },
  },
];

export function DonorPlanPage() {
  const { copy } = useSiteLocale();
  const gf = copy.goatFarming;

  const stages = gf.stages.map((stage, index) => ({
    ...stage,
    ...stageVisuals[index],
  }));

  return (
    <section className="relative overflow-hidden bg-[linear-gradient(180deg,_#f4fbf4_0%,_#ffffff_35%,_#f4fffb_100%)] px-4 py-14 sm:px-6 lg:px-8 lg:py-20">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(16,122,87,0.10),_transparent_28%),radial-gradient(circle_at_bottom_right,_rgba(245,158,11,0.10),_transparent_24%)]" />

      <div className="relative mx-auto w-full max-w-6xl">
        {/* Header */}
        <header className="overflow-hidden rounded-t-[2rem] border border-emerald-100 bg-white px-4 py-7 text-center shadow-[0_28px_90px_rgba(6,95,70,0.10)] sm:px-10 sm:py-8">
          <h1 className="text-xl font-bold leading-snug text-emerald-900 sm:text-3xl lg:text-4xl">
            <span aria-hidden="true" className="text-emerald-600">
              🌿
            </span>{" "}
            {gf.title}{" "}
            <span aria-hidden="true" className="text-emerald-600">
              🌿
            </span>
          </h1>
          <p className="mt-3 text-sm text-slate-600 sm:text-base">{gf.subtitle}</p>
        </header>

        {/* Desktop table */}
        <div className="hidden overflow-hidden border-x border-emerald-100 bg-white lg:block">
          <table className="w-full table-fixed border-collapse text-sm">
            <thead>
              <tr className="bg-emerald-800 text-white">
                <th className="w-[20%] border-r border-emerald-700/40 px-4 py-4 text-left font-semibold">
                  {gf.columns.period}
                </th>
                <th className="border-r border-emerald-700/40 px-4 py-4 text-left font-semibold">
                  {gf.columns.explanation}
                </th>
                <th className="w-[16%] border-r border-emerald-700/40 px-4 py-4 text-center font-semibold">
                  {gf.columns.newborns}
                </th>
                <th className="w-[16%] px-4 py-4 text-center font-semibold">
                  {gf.columns.total}
                </th>
              </tr>
            </thead>
            <tbody>
              {stages.map((stage) => (
                <tr
                  key={stage.period}
                  className="border-t border-emerald-100 align-middle"
                >
                  <td className="border-r border-emerald-100 px-4 py-6">
                    <span
                      className={`inline-flex flex-col items-center gap-1 rounded-2xl px-4 py-2 text-center text-base font-bold ${stage.theme.badge}`}
                    >
                      <span>{stage.period}</span>
                      {stage.periodNote ? (
                        <span className="text-xs font-medium opacity-90">
                          {stage.periodNote}
                        </span>
                      ) : null}
                    </span>
                    {stage.icon ? (
                      <div className="mt-2 text-xl" aria-hidden="true">
                        {stage.icon}
                      </div>
                    ) : null}
                  </td>
                  <td className="border-r border-emerald-100 px-4 py-6 text-[0.95rem] leading-7 text-slate-700">
                    {stage.explanation.map((line, index) => (
                      <p key={index} className={index > 0 ? "mt-1" : ""}>
                        {line}
                      </p>
                    ))}
                  </td>
                  <td className="border-r border-emerald-100 px-4 py-6 text-center">
                    <span
                      className={`inline-flex h-14 w-14 items-center justify-center rounded-full text-xl font-bold ${stage.theme.chip}`}
                    >
                      {stage.newborns}
                    </span>
                    <div className={`mt-1 text-sm font-semibold ${stage.theme.accentText}`}>
                      {gf.unit}
                    </div>
                  </td>
                  <td className="px-4 py-6 text-center">
                    <span
                      className={`inline-flex min-w-[3.5rem] flex-col items-center rounded-2xl px-3 py-3 text-2xl font-bold ${stage.theme.total}`}
                    >
                      <span>{stage.total}</span>
                      <span className="text-sm font-semibold">{gf.unit}</span>
                      {stage.totalNote ? (
                        <span className="mt-1 text-[0.65rem] font-medium opacity-90">
                          {stage.totalNote}
                        </span>
                      ) : null}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Mobile stacked cards */}
        <div className="border-x border-emerald-100 bg-white px-3 py-5 sm:px-5 lg:hidden">
          <ol className="relative space-y-5 pl-9">
            {/* timeline spine */}
            <span
              className="absolute bottom-4 left-[0.9375rem] top-4 w-0.5 rounded-full bg-emerald-100"
              aria-hidden="true"
            />

            {stages.map((stage) => (
              <li key={stage.period} className="relative">
                {/* timeline node */}
                <span
                  className={`absolute -left-9 top-4 flex h-8 w-8 items-center justify-center rounded-full text-sm font-bold text-white shadow-md ring-4 ring-white ${stage.theme.bar}`}
                  aria-hidden="true"
                >
                  {stage.icon ?? "🐐"}
                </span>

                <article className="overflow-hidden rounded-3xl border border-slate-100 bg-white shadow-[0_10px_30px_rgba(15,23,42,0.06)]">
                  {/* accent bar */}
                  <span className={`block h-1.5 w-full ${stage.theme.bar}`} aria-hidden="true" />

                  <div className="p-4">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p className="text-base font-bold text-slate-900">
                          {stage.icon ? (
                            <span className="mr-1" aria-hidden="true">
                              {stage.icon}
                            </span>
                          ) : null}
                          {stage.period}
                        </p>
                        {stage.periodNote ? (
                          <p className="text-xs font-medium text-slate-500">
                            {stage.periodNote}
                          </p>
                        ) : null}
                      </div>
                      <span
                        className={`inline-flex flex-col items-center rounded-2xl px-4 py-2 text-center leading-tight text-white ${stage.theme.total}`}
                      >
                        <span className="text-xl font-extrabold">
                          {stage.total}
                        </span>
                        <span className="text-[0.6rem] font-medium opacity-90">
                          {gf.columns.total} ({gf.unit})
                        </span>
                      </span>
                    </div>

                    {/* explanation */}
                    <div className="mt-4 space-y-1 text-[0.9rem] leading-7 text-slate-600">
                      {stage.explanation.map((line, index) => (
                        <p key={index}>{line}</p>
                      ))}
                    </div>

                    {/* newborn stat */}
                    <div className="mt-4 flex items-center gap-2 border-t border-slate-100 pt-3 text-sm">
                      <span className="font-semibold text-slate-500">
                        {gf.columns.newborns}
                      </span>
                      <span
                        className={`ml-auto inline-flex h-9 min-w-9 items-center justify-center rounded-full px-2.5 text-sm font-bold text-white ${stage.theme.chip}`}
                      >
                        {stage.newborns}
                      </span>
                      <span className={`font-semibold ${stage.theme.accentText}`}>
                        {gf.unit}
                      </span>
                    </div>
                  </div>
                </article>
              </li>
            ))}
          </ol>
        </div>

        {/* Summary strip */}
        <div className="rounded-b-[2rem] border border-emerald-100 bg-emerald-50/70 px-4 py-6 shadow-[0_28px_90px_rgba(6,95,70,0.06)] sm:px-10">
          <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:gap-8">
            <div className="flex shrink-0 items-center justify-center gap-3 lg:justify-start">
              <span className="text-3xl" aria-hidden="true">
                📈
              </span>
              <div className="text-center lg:text-left">
                <p className="text-lg font-bold text-emerald-900">
                  {gf.summaryLabel}
                </p>
                <p className="text-xs text-slate-600">{gf.summaryNote}</p>
              </div>
            </div>

            <div className="flex flex-1 flex-wrap items-stretch justify-center gap-2 sm:gap-3 lg:justify-between">
              {stages.map((stage, index) => (
                <div key={stage.period} className="flex items-center gap-2 sm:gap-3">
                  <div
                    className={`flex min-w-[5.5rem] flex-col items-center rounded-2xl border bg-white px-3 py-2 text-center shadow-sm ${stage.theme.softBorder}`}
                  >
                    <p className="text-[0.65rem] font-medium leading-tight text-slate-500">
                      {stage.period}
                      {stage.periodNote ? ` ${stage.periodNote}` : ""}
                    </p>
                    <p className={`text-lg font-extrabold ${stage.theme.accentText}`}>
                      {stage.total} {gf.unit}
                    </p>
                    {stage.totalNote ? (
                      <p className="text-[0.55rem] leading-tight text-slate-400">
                        {stage.totalNote}
                      </p>
                    ) : null}
                  </div>
                  {index < stages.length - 1 ? (
                    <span
                      className="text-xl font-bold text-emerald-400 sm:text-2xl"
                      aria-hidden="true"
                    >
                      →
                    </span>
                  ) : null}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Footer banner */}
        <div className="mt-6 rounded-2xl bg-emerald-800 px-6 py-4 text-center text-sm font-semibold text-white sm:text-base">
          <span aria-hidden="true">⭐</span> {gf.footer}{" "}
          <span aria-hidden="true">🌱</span>
        </div>
      </div>
    </section>
  );
}
