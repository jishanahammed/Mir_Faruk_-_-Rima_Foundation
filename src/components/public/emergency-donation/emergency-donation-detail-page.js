"use client";

import { useState } from "react";
import Link from "next/link";

function fmt(n) {
  return "৳" + Number(n ?? 0).toLocaleString("en-BD");
}

function fmtDate(d) {
  if (!d) return null;
  try {
    return new Date(d).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" });
  } catch { return null; }
}

function ImageGallery({ images, coverImageUrl, title }) {
  const all = images?.length ? images : coverImageUrl ? [{ id: "cover", imageUrl: coverImageUrl }] : [];
  const [active, setActive] = useState(0);

  if (all.length === 0) {
    return (
      <div className="flex aspect-video w-full items-center justify-center rounded-2xl border border-slate-200 bg-slate-100 text-slate-300">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="h-16 w-16">
          <path d="M12 2 3 7v6c0 5 4 8.5 9 9 5-.5 9-4 9-9V7l-9-5Z" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </div>
    );
  }

  const prev = () => setActive((p) => (p - 1 + all.length) % all.length);
  const next = () => setActive((p) => (p + 1) % all.length);

  return (
    <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
      <div className="relative aspect-video w-full overflow-hidden bg-slate-100">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img key={active} src={all[active].imageUrl} alt={`${title} — ${active + 1}`} className="h-full w-full object-cover" />
        {all.length > 1 && (
          <>
            <button onClick={prev} aria-label="Previous"
              className="absolute left-3 top-1/2 -translate-y-1/2 flex h-10 w-10 items-center justify-center rounded-full bg-black/45 text-white backdrop-blur-sm hover:bg-black/65 transition-colors">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="h-5 w-5">
                <path d="M15 18l-6-6 6-6" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
            <button onClick={next} aria-label="Next"
              className="absolute right-3 top-1/2 -translate-y-1/2 flex h-10 w-10 items-center justify-center rounded-full bg-black/45 text-white backdrop-blur-sm hover:bg-black/65 transition-colors">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="h-5 w-5">
                <path d="M9 18l6-6-6-6" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
            <span className="absolute bottom-3 right-3 rounded-full bg-black/50 px-3 py-1 text-xs font-bold text-white">
              {active + 1} / {all.length}
            </span>
          </>
        )}
      </div>
      {all.length > 1 && (
        <div className="flex gap-2 overflow-x-auto p-3">
          {all.map((img, i) => (
            <button key={img.id ?? i} onClick={() => setActive(i)}
              className={`h-16 w-24 shrink-0 overflow-hidden rounded-lg border-2 transition-all ${i === active ? "border-cyan-500" : "border-transparent opacity-55 hover:opacity-85"}`}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={img.imageUrl} alt={`Thumb ${i + 1}`} className="h-full w-full object-cover" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

export function EmergencyDonationDetailPage({ campaign }) {
  const progress = Math.min(100, campaign.progressPercent ?? 0);

  return (
    <div className="min-h-screen bg-[#f5fbfc] pb-20">
      {/* Breadcrumb / back */}
      <div className="mx-auto max-w-6xl px-4 pt-6 sm:px-6 lg:px-8">
        <Link href="/emergency-donation" className="inline-flex items-center gap-1.5 text-sm font-semibold text-cyan-700 hover:text-cyan-800">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="h-4 w-4">
            <path d="M19 12H5M11 18l-6-6 6-6" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          Back to Emergency Donation
        </Link>
      </div>

      <div className="mx-auto grid max-w-6xl grid-cols-1 gap-8 px-4 pt-6 sm:px-6 lg:grid-cols-3 lg:px-8">
        {/* Main column */}
        <div className="flex flex-col gap-6 lg:col-span-2">
          <div className="flex flex-wrap items-center gap-2">
            {campaign.isUrgent && (
              <span className="rounded-full bg-rose-600 px-3 py-1 text-xs font-bold uppercase tracking-wide text-white">Urgent</span>
            )}
            {campaign.isVerified && (
              <span className="rounded-full bg-cyan-600 px-3 py-1 text-xs font-bold uppercase tracking-wide text-white">Verified</span>
            )}
            {campaign.isFeatured && (
              <span className="rounded-full bg-amber-500 px-3 py-1 text-xs font-bold uppercase tracking-wide text-white">Featured</span>
            )}
          </div>

          <h1 className="text-2xl font-extrabold text-slate-900 sm:text-3xl">{campaign.titleEn}</h1>
          {campaign.shortDescriptionEn && (
            <p className="text-base text-slate-500">{campaign.shortDescriptionEn}</p>
          )}

          <ImageGallery images={campaign.images} coverImageUrl={campaign.coverImageUrl} title={campaign.titleEn} />

          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="mb-3 text-sm font-bold uppercase tracking-widest text-cyan-700">About this appeal</h2>
            <p className="whitespace-pre-wrap text-sm leading-relaxed text-slate-700">{campaign.descriptionEn}</p>
          </div>

          {(campaign.beneficiaryName || campaign.hospitalOrInstitutionName) && (
            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <h2 className="mb-4 text-sm font-bold uppercase tracking-widest text-cyan-700">Beneficiary Details</h2>
              <dl className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                {campaign.beneficiaryName && (
                  <div>
                    <dt className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Name</dt>
                    <dd className="text-sm text-slate-800">{campaign.beneficiaryName}</dd>
                  </div>
                )}
                {campaign.hospitalOrInstitutionName && (
                  <div>
                    <dt className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Hospital / Institution</dt>
                    <dd className="text-sm text-slate-800">{campaign.hospitalOrInstitutionName}</dd>
                  </div>
                )}
                {campaign.referenceNumber && (
                  <div>
                    <dt className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Reference No.</dt>
                    <dd className="text-sm text-slate-800">{campaign.referenceNumber}</dd>
                  </div>
                )}
              </dl>
            </div>
          )}
        </div>

        {/* Sidebar — donation card */}
        <div className="lg:col-span-1">
          <div className="sticky top-24 flex flex-col gap-5 rounded-3xl border border-slate-200 bg-white p-6 shadow-lg shadow-cyan-950/5">
            <div>
              <div className="flex items-baseline justify-between">
                <span className="text-2xl font-extrabold text-emerald-700">{fmt(campaign.totalCollectedAmount)}</span>
                <span className="text-xs font-semibold text-slate-400">raised</span>
              </div>
              <div className="mt-3 h-2.5 w-full overflow-hidden rounded-full bg-slate-100">
                <div
                  className="h-full rounded-full bg-[linear-gradient(90deg,#0f766e,#0891b2)] transition-all"
                  style={{ width: `${progress}%` }}
                />
              </div>
              <div className="mt-2 flex items-center justify-between text-xs text-slate-500">
                <span>{progress}% funded</span>
                <span>Goal: {fmt(campaign.targetAmount)}</span>
              </div>
            </div>

            {(campaign.startDateUtc || campaign.endDateUtc) && (
              <div className="flex flex-col gap-1 border-t border-slate-100 pt-4 text-xs text-slate-500">
                {campaign.startDateUtc && <span>Started: {fmtDate(campaign.startDateUtc)}</span>}
                {campaign.endDateUtc && <span>Ends: {fmtDate(campaign.endDateUtc)}</span>}
              </div>
            )}

            <Link
              href="/donate"
              className="flex items-center justify-center gap-2 rounded-xl bg-[linear-gradient(135deg,#0f766e,#0891b2)] px-6 py-3 text-sm font-bold text-white shadow-md shadow-cyan-200/60 transition hover:opacity-90"
            >
              Donate Now
            </Link>
            <p className="text-center text-[11px] text-slate-400">
              100% of your donation supports this emergency appeal.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
