"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useSiteLocale } from "@/components/public/providers/locale-provider";

function pick(en, bn, dk, locale) {
  if (locale === "BN") return bn || en;
  if (locale === "DK") return dk || en;
  return en;
}

function fmt(n) {
  return "৳" + Number(n ?? 0).toLocaleString("en-BD");
}

function CampaignCard({ campaign }) {
  const { locale } = useSiteLocale();
  const title = pick(campaign.titleEn, campaign.titleBn, campaign.titleDk, locale);
  const shortDescription = pick(
    campaign.shortDescriptionEn,
    campaign.shortDescriptionBn,
    campaign.shortDescriptionDk,
    locale
  );
  const categoryName = pick(campaign.categoryNameEn, campaign.categoryNameBn, campaign.categoryNameDk, locale);
  const progress = Math.min(100, campaign.progressPercent ?? 0);
  const cover = campaign.coverImageUrl ?? campaign.images?.[0]?.imageUrl ?? null;

  return (
    <Link
      href={`/emergency-donation/${campaign.slug}`}
      aria-label={`${title} — donate now`}
      className="group flex flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-500 focus-visible:ring-offset-2"
    >
      <div className="relative aspect-[16/10] w-full overflow-hidden bg-slate-100">
        {cover ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={cover} alt={title} className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105" />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-slate-300" aria-hidden="true">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="h-12 w-12">
              <path d="M12 2 3 7v6c0 5 4 8.5 9 9 5-.5 9-4 9-9V7l-9-5Z" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
        )}
        <div className="absolute left-3 top-3 flex gap-2">
          {campaign.isUrgent && (
            <span className="rounded-full bg-rose-600 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide text-white shadow">
              Urgent
            </span>
          )}
          {campaign.isVerified && (
            <span className="rounded-full bg-cyan-600 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide text-white shadow">
              Verified
            </span>
          )}
        </div>
      </div>

      <div className="flex flex-1 flex-col gap-3 p-5">
        {categoryName && (
          <span className="w-fit rounded-full bg-cyan-50 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide text-cyan-700">
            {categoryName}
          </span>
        )}
        <h3 className="text-base font-extrabold text-slate-900 line-clamp-2">{title}</h3>
        {shortDescription && (
          <p className="text-sm text-slate-500 line-clamp-2">{shortDescription}</p>
        )}

        <div className="mt-auto flex flex-col gap-2">
          <div
            className="h-2 w-full overflow-hidden rounded-full bg-slate-100"
            role="progressbar"
            aria-valuenow={progress}
            aria-valuemin={0}
            aria-valuemax={100}
            aria-label={`${progress}% funded`}
          >
            <div
              className="h-full rounded-full bg-[linear-gradient(90deg,#0f766e,#0891b2)] transition-all"
              style={{ width: `${progress}%` }}
            />
          </div>
          <div className="flex items-center justify-between text-xs">
            <span className="font-bold text-emerald-700">{fmt(campaign.totalCollectedAmount)} raised</span>
            <span className="text-slate-400">of {fmt(campaign.targetAmount)}</span>
          </div>
        </div>

        <span className="mt-1 inline-flex items-center gap-1.5 text-sm font-bold text-cyan-700">
          Donate now
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="h-4 w-4 transition-transform group-hover:translate-x-1" aria-hidden="true">
            <path d="M5 12h14M13 6l6 6-6 6" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </span>
      </div>
    </Link>
  );
}

export function EmergencyDonationListPage({ campaigns, categories = [], initialCategoryId = "" }) {
  const router = useRouter();
  const { locale } = useSiteLocale();
  const [filter, setFilter] = useState("all");
  const [categoryId, setCategoryId] = useState(String(initialCategoryId ?? ""));

  function handleCategoryChange(value) {
    setCategoryId(value);
    router.replace(value ? `/emergency-donation?categoryId=${value}` : "/emergency-donation", { scroll: false });
  }

  const filtered = campaigns.filter((c) => {
    if (categoryId && String(c.emergencyCategoryId ?? "") !== String(categoryId)) return false;
    if (filter === "urgent") return c.isUrgent;
    if (filter === "verified") return c.isVerified;
    return true;
  });

  return (
    <div className="min-h-screen bg-[#f5fbfc]">
      {/* Filters */}
      <div
        role="group"
        aria-label="Filter emergency campaigns"
        className="mx-auto flex max-w-6xl flex-wrap items-center justify-center gap-2 px-4 py-6 sm:px-6 lg:px-8"
      >
        {[
          { key: "all", label: "All Campaigns" },
          { key: "urgent", label: "Urgent" },
          { key: "verified", label: "Verified" },
        ].map((f) => (
          <button
            key={f.key}
            type="button"
            onClick={() => setFilter(f.key)}
            aria-pressed={filter === f.key}
            className={`rounded-full border px-4 py-2 text-sm font-semibold transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-500 focus-visible:ring-offset-2 ${
              filter === f.key
                ? "border-cyan-600 bg-cyan-600 text-white shadow"
                : "border-slate-200 bg-white text-slate-600 hover:border-cyan-200 hover:text-cyan-700"
            }`}
          >
            {f.label}
          </button>
        ))}
        {categories.length > 0 && (
          <label className="sr-only" htmlFor="emergency-category-filter">
            Filter by category
          </label>
        )}
        {categories.length > 0 && (
          <select
            id="emergency-category-filter"
            value={categoryId}
            onChange={(e) => handleCategoryChange(e.target.value)}
            className="rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-600 outline-none transition hover:border-cyan-200 hover:text-cyan-700 focus:border-cyan-400"
          >
            <option value="">All Categories</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>
                {pick(c.nameEn, c.nameBn, c.nameDk, locale)}
              </option>
            ))}
          </select>
        )}
      </div>

      {/* Grid */}
      <div className="mx-auto max-w-6xl px-4 pb-20 sm:px-6 lg:px-8">
        {filtered.length === 0 ? (
          <div role="status" className="rounded-2xl border border-slate-200 bg-white py-20 text-center text-sm text-slate-400">
            No emergency campaigns available right now. Please check back soon.
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {filtered.map((campaign) => (
              <CampaignCard key={campaign.id} campaign={campaign} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
