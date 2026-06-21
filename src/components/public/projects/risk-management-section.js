"use client";

import { useSiteLocale } from "@/components/public/providers/locale-provider";

const RISK_ICONS = [
  // shield-check — verification
  <svg key="0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="h-5 w-5" aria-hidden="true">
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10Z" strokeLinecap="round" strokeLinejoin="round" />
    <path d="m9 12 2 2 4-4" strokeLinecap="round" strokeLinejoin="round" />
  </svg>,
  // heart-pulse — health
  <svg key="1" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="h-5 w-5" aria-hidden="true">
    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78Z" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M8 12h2l1.5-3L13 15l1.5-3H17" strokeLinecap="round" strokeLinejoin="round" />
  </svg>,
  // alert-triangle — misuse
  <svg key="2" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="h-5 w-5" aria-hidden="true">
    <path d="M10.29 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0Z" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M12 9v4M12 17h.01" strokeLinecap="round" strokeLinejoin="round" />
  </svg>,
  // refresh-cw — repayment
  <svg key="3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="h-5 w-5" aria-hidden="true">
    <path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M21 3v5h-5" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M8 16H3v5" strokeLinecap="round" strokeLinejoin="round" />
  </svg>,
  // book-open — shariah
  <svg key="4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="h-5 w-5" aria-hidden="true">
    <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2Z" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7Z" strokeLinecap="round" strokeLinejoin="round" />
  </svg>,
  // users — donor trust
  <svg key="5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="h-5 w-5" aria-hidden="true">
    <path d="M16 19a4 4 0 0 0-8 0" strokeLinecap="round" />
    <circle cx="12" cy="11" r="3" />
    <path d="M5 19a3 3 0 0 1 2-2.82M19 19a3 3 0 0 0-2-2.82" strokeLinecap="round" />
    <path d="M7 10a2.5 2.5 0 1 1 0-5M17 10a2.5 2.5 0 1 0 0-5" strokeLinecap="round" />
  </svg>,
  // eye — monitoring
  <svg key="6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="h-5 w-5" aria-hidden="true">
    <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" strokeLinecap="round" strokeLinejoin="round" />
    <circle cx="12" cy="12" r="3" />
  </svg>,
  // file-text — documentation
  <svg key="7" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="h-5 w-5" aria-hidden="true">
    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8Z" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M14 2v6h6M16 13H8M16 17H8M10 9H8" strokeLinecap="round" strokeLinejoin="round" />
  </svg>,
];

const RISK_COLORS = [
  { bg: "bg-cyan-50", text: "text-cyan-700", border: "border-cyan-100", num: "text-cyan-400" },
  { bg: "bg-emerald-50", text: "text-emerald-700", border: "border-emerald-100", num: "text-emerald-400" },
  { bg: "bg-amber-50", text: "text-amber-700", border: "border-amber-100", num: "text-amber-400" },
  { bg: "bg-violet-50", text: "text-violet-700", border: "border-violet-100", num: "text-violet-400" },
  { bg: "bg-teal-50", text: "text-teal-700", border: "border-teal-100", num: "text-teal-400" },
  { bg: "bg-sky-50", text: "text-sky-700", border: "border-sky-100", num: "text-sky-400" },
  { bg: "bg-rose-50", text: "text-rose-700", border: "border-rose-100", num: "text-rose-400" },
  { bg: "bg-slate-100", text: "text-slate-700", border: "border-slate-200", num: "text-slate-400" },
];

export function RiskManagementSection() {
  const { copy } = useSiteLocale();
  const rm = copy.projects.riskManagement;

  return (
    <section className="bg-[#f8fafb] border-t border-slate-100">
      <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:px-8">

        {/* Section header */}
        <div className="mb-12 text-center">
          <span className="inline-block rounded-full border border-cyan-200 bg-cyan-50 px-4 py-1.5 text-xs font-bold uppercase tracking-widest text-cyan-700">
            {rm.eyebrow}
          </span>
          <h2 className="mt-4 text-3xl font-extrabold text-slate-900">{rm.title}</h2>
          <p className="mx-auto mt-4 max-w-3xl text-sm leading-relaxed text-slate-500">
            {rm.summary}
          </p>

          {/* Reserve fund highlight */}
          <div className="mx-auto mt-6 flex max-w-2xl items-start gap-3 rounded-2xl border border-amber-200 bg-amber-50 px-5 py-4 text-left">
            <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-amber-100 text-amber-600">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="h-4 w-4" aria-hidden="true">
                <circle cx="12" cy="12" r="10" />
                <path d="M12 8v4M12 16h.01" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
            <p className="text-sm font-semibold leading-relaxed text-amber-800">{rm.reserveFundNote}</p>
          </div>
        </div>

        {/* Risk cards grid */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {rm.risks.map((risk, idx) => {
            const color = RISK_COLORS[idx % RISK_COLORS.length];
            const icon = RISK_ICONS[idx % RISK_ICONS.length];
            return (
              <div
                key={idx}
                className={`relative flex flex-col rounded-2xl border bg-white p-5 shadow-sm shadow-slate-900/4 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md ${color.border}`}
              >
                {/* Number badge */}
                <span className={`absolute right-4 top-4 text-xs font-black tracking-widest ${color.num}`}>
                  {risk.number}
                </span>

                {/* Icon */}
                <div className={`mb-4 flex h-10 w-10 items-center justify-center rounded-xl ${color.bg} ${color.text}`}>
                  {icon}
                </div>

                {/* Title */}
                <h3 className="mb-2 text-sm font-bold leading-snug text-slate-800">{risk.title}</h3>

                {/* Description */}
                <p className="text-xs leading-relaxed text-slate-500">{risk.description}</p>
              </div>
            );
          })}
        </div>

        {/* Risk control process */}
        <div className="mt-14">
          <div className="mb-6 flex items-center gap-4">
            <span className="h-px flex-1 bg-slate-200" />
            <h3 className="text-xs font-bold uppercase tracking-widest text-slate-400">{rm.processTitle}</h3>
            <span className="h-px flex-1 bg-slate-200" />
          </div>

          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
            {rm.steps.map((step, idx) => (
              <div key={idx} className="flex items-start gap-3 rounded-xl border border-slate-100 bg-white px-4 py-3 shadow-sm shadow-slate-900/3">
                <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-cyan-600 text-[10px] font-black text-white">
                  {idx + 1}
                </span>
                <p className="text-xs leading-snug text-slate-600">{step}</p>
              </div>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
}
