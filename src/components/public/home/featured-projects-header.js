"use client";

import Link from "next/link";
import { useSiteLocale } from "@/components/public/providers/locale-provider";

export function FeaturedProjectsHeader() {
  const { copy } = useSiteLocale();
  const fp = copy.featuredProjects;

  if (!fp) {
    return null;
  }

  return (
    <div className="flex flex-col items-center gap-4 text-center sm:flex-row sm:items-end sm:justify-between sm:text-left">
      <div>
        <span className="inline-block rounded-full border border-cyan-200 bg-cyan-50 px-4 py-1.5 text-xs font-bold uppercase tracking-widest text-cyan-700">
          {fp.badge}
        </span>
        <h2 className="mt-4 text-3xl font-extrabold leading-tight text-slate-900 sm:text-4xl">
          {fp.title}
        </h2>
        <p className="mt-3 max-w-xl text-sm leading-relaxed text-slate-500 sm:text-base">
          {fp.subtitle}
        </p>
      </div>

      <Link
        href="/donate"
        className="inline-flex shrink-0 items-center gap-2 rounded-full bg-[linear-gradient(135deg,#0f172a,#155e75_52%,#0f766e)] px-6 py-3 text-sm font-bold text-white! shadow-lg shadow-cyan-900/20 transition hover:-translate-y-0.5 hover:shadow-xl hover:shadow-cyan-900/30"
      >
        {fp.viewAllLabel}
      </Link>
    </div>
  );
}
