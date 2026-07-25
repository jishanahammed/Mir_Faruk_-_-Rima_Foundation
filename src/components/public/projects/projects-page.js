"use client";

import Link from "next/link";
import { useSiteLocale } from "@/components/public/providers/locale-provider";
import { RiskManagementSection } from "@/components/public/projects/risk-management-section";

function pick(en, bn, dk, locale) {
  if (locale === "BN") return bn || en;
  if (locale === "DK") return dk || en;
  return en;
}


// keyword → icon mapping — matches against the English name (lowercase)
const KEYWORD_ICON_MAP = [
  {
    keys: ["livestock", "animal", "cattle", "goat", "cow", "পশু", "গরু", "ছাগল", "husdyr"],
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="h-6 w-6" aria-hidden="true">
        <path d="M19 9a7 7 0 1 0-13.6 2.4L3 14l2 1 1 3h3l1-2h4l1 2h3l1-3 2-1-2.4-2.6A7 7 0 0 0 19 9Z" strokeLinecap="round" strokeLinejoin="round" />
        <circle cx="9" cy="9" r="1" fill="currentColor" />
        <circle cx="15" cy="9" r="1" fill="currentColor" />
      </svg>
    ),
    color: "text-amber-700",
  },
  {
    keys: ["health", "medical", "চিকিৎসা", "স্বাস্থ্য", "sundhed", "veterinar", "ভেটেরিনারি"],
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="h-6 w-6" aria-hidden="true">
        <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78Z" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
    color: "text-rose-700",
  },
  {
    keys: ["education", "school", "training", "শিক্ষা", "uddannelse", "প্রশিক্ষণ"],
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="h-6 w-6" aria-hidden="true">
        <path d="M22 10v6M2 10l10-5 10 5-10 5-10-5Z" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M6 12v5c3 3 9 3 12 0v-5" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
    color: "text-violet-700",
  },
  {
    keys: ["livelihood", "income", "জীবিকা", "আয়", "levebrød", "indkomst", "employment", "কর্মসংস্থান"],
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="h-6 w-6" aria-hidden="true">
        <rect x="2" y="7" width="20" height="14" rx="2" />
        <path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2M12 12v4M10 14h4" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
    color: "text-emerald-700",
  },
  {
    keys: ["food", "nutrition", "খাদ্য", "পুষ্টি", "mad", "ernæring", "agriculture", "কৃষি", "landbrug"],
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="h-6 w-6" aria-hidden="true">
        <path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10Z" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
    color: "text-green-700",
  },
  {
    keys: ["community", "social", "সমাজ", "কমিউনিটি", "samfund", "welfare", "কল্যাণ"],
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="h-6 w-6" aria-hidden="true">
        <path d="M16 19a4 4 0 0 0-8 0" strokeLinecap="round" />
        <circle cx="12" cy="11" r="3" />
        <path d="M5 19a3 3 0 0 1 2-2.82M19 19a3 3 0 0 0-2-2.82" strokeLinecap="round" />
        <path d="M7 10a2.5 2.5 0 1 1 0-5M17 10a2.5 2.5 0 1 0 0-5" strokeLinecap="round" />
      </svg>
    ),
    color: "text-sky-700",
  },
  {
    keys: ["qard", "loan", "finance", "fund", "ঋণ", "অর্থ", "তহবিল", "lån", "finans", "donation", "দান"],
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="h-6 w-6" aria-hidden="true">
        <path d="M12 2v20M17 5H9.5a3.5 3.5 0 1 0 0 7h5a3.5 3.5 0 1 1 0 7H6" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
    color: "text-teal-700",
  },
  {
    keys: ["monitor", "report", "মনিটরিং", "প্রতিবেদন", "monitorering", "transparency", "স্বচ্ছতা"],
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="h-6 w-6" aria-hidden="true">
        <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" strokeLinecap="round" strokeLinejoin="round" />
        <circle cx="12" cy="12" r="3" />
      </svg>
    ),
    color: "text-cyan-700",
  },
  {
    keys: ["risk", "ঝুঁকি", "risiko"],
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="h-6 w-6" aria-hidden="true">
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10Z" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M12 8v4M12 16h.01" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
    color: "text-orange-700",
  },
];

// Fallback icons cycling for unmatched names
const FALLBACK_ICONS = [
  { icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="h-6 w-6" aria-hidden="true"><path d="M9 5H7a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-2" strokeLinecap="round" strokeLinejoin="round" /><rect x="9" y="3" width="6" height="4" rx="1" /><path d="M9 12h6M9 16h4" strokeLinecap="round" /></svg>, color: "text-cyan-700" },
  { icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="h-6 w-6" aria-hidden="true"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" strokeLinecap="round" strokeLinejoin="round" /></svg>, color: "text-violet-700" },
  { icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="h-6 w-6" aria-hidden="true"><circle cx="12" cy="12" r="10" /><path d="M2 12h20M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10Z" strokeLinecap="round" /></svg>, color: "text-sky-700" },
];

function resolveIcon(nameEn = "", nameBn = "", index) {
  const haystack = (nameEn + " " + nameBn).toLowerCase();
  for (const entry of KEYWORD_ICON_MAP) {
    if (entry.keys.some((k) => haystack.includes(k.toLowerCase()))) {
      return { icon: entry.icon, color: entry.color };
    }
  }
  const fb = FALLBACK_ICONS[index % FALLBACK_ICONS.length];
  return { icon: fb.icon, color: fb.color };
}

function CategoryCard({ category, index, locale }) {
  const { icon, color } = resolveIcon(category.nameEn, category.nameBn, index);
  const name = pick(category.nameEn, category.nameBn, category.nameDk, locale);

  return (
    <Link
      href={`/projects/${category.id}`}
      className="group flex items-center gap-4 rounded-2xl border border-slate-200 bg-[#f7f7f7] px-5 py-5 transition-all duration-200 hover:border-slate-300 hover:bg-white hover:shadow-md hover:shadow-slate-900/8"
    >
      {/* Icon */}
      <div className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-white shadow-sm shadow-slate-200 ${color}`}>
        {icon}
      </div>

      {/* Name */}
      <span className="flex-1 text-[15px] font-bold text-slate-800 leading-snug group-hover:text-cyan-700 transition-colors">
        {name}
      </span>

      {/* Arrow */}
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-5 w-5 shrink-0 text-slate-400 transition-transform duration-200 group-hover:translate-x-1 group-hover:text-cyan-600" aria-hidden="true">
        <path d="M5 12h14M13 6l6 6-6 6" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </Link>
  );
}

function EmptyState({ title, text }) {
  return (
    <div className="flex flex-col items-center justify-center py-24 text-center">
      <div className="flex h-20 w-20 items-center justify-center rounded-3xl bg-cyan-50">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" className="h-10 w-10 text-cyan-400" aria-hidden="true">
          <path d="M9 5H7a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-2" strokeLinecap="round" strokeLinejoin="round" />
          <rect x="9" y="3" width="6" height="4" rx="1" />
          <path d="M9 12h6M9 16h4" strokeLinecap="round" />
        </svg>
      </div>
      <p className="mt-5 text-lg font-bold text-slate-800">{title}</p>
      <p className="mt-2 max-w-sm text-sm leading-relaxed text-slate-500">{text}</p>
    </div>
  );
}

export function ProjectsPage({ categories = [] }) {
  const { copy, locale } = useSiteLocale();
  const { projects } = copy;

  return (
    <div className="min-h-screen bg-white">
      {/* Hero header */}
      <section className="relative overflow-hidden bg-[linear-gradient(135deg,#0f172a,#155e75_52%,#0f766e)] px-4 py-16 sm:px-6 lg:px-8">
        <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
          <div className="absolute -top-32 -right-32 h-96 w-96 rounded-full border border-cyan-500/20" />
          <div className="absolute -top-16 -right-16 h-64 w-64 rounded-full border border-cyan-400/15" />
          <div className="absolute bottom-0 left-0 h-64 w-64 -translate-x-1/2 translate-y-1/2 rounded-full border border-cyan-600/20" />
        </div>
        <div className="relative mx-auto max-w-4xl text-center">
          <span className="inline-block rounded-full border border-cyan-400/30 bg-cyan-400/10 px-4 py-1.5 text-xs font-bold uppercase tracking-widest text-cyan-300">
            {projects.eyebrow}
          </span>
          <h1 className="mt-5 text-4xl font-extrabold leading-tight text-white sm:text-5xl">
            {projects.heroTitle}
          </h1>
          <p className="mx-auto mt-5 max-w-2xl text-base leading-relaxed text-cyan-100/80">
            {projects.heroSubtitle}
          </p>

        </div>
      </section>

      {/* Categories grid */}
      <section className="mx-auto max-w-6xl px-4 py-14 sm:px-6 lg:px-8">
        {categories.length === 0 ? (
          <EmptyState title={projects.emptyTitle} text={projects.emptyText} />
        ) : (
          <>
            <div className="mb-3 text-center">
              <h2 className="text-2xl font-extrabold text-slate-900">{projects.title}</h2>
              <p className="mx-auto mt-2 max-w-2xl whitespace-pre-line px-2 text-sm leading-relaxed text-slate-500 sm:text-base">
                {projects.description}
              </p>
            </div>
            <div className="mb-8 flex justify-center">
              <span className="h-px w-16 bg-slate-200" />
            </div>
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {categories.map((cat, idx) => (
                <CategoryCard
                  key={cat.id}
                  category={cat}
                  index={idx}
                  locale={locale}
                />
              ))}
            </div>
          </>
        )}
      </section>

      <RiskManagementSection />
    </div>
  );
}
