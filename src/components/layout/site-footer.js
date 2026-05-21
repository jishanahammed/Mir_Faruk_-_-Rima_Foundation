"use client";

import { useSiteLocale } from "@/components/providers/locale-provider";

export function SiteFooter() {
  const { copy } = useSiteLocale();

  return (
    <footer className="border-t border-slate-200 bg-white">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-3 px-6 py-6 text-sm text-slate-500 md:flex-row md:items-center md:justify-between lg:px-8">
        <p className="font-semibold text-slate-700">{copy.brand.name}</p>
        <p>{copy.footer.note}</p>
      </div>
    </footer>
  );
}
