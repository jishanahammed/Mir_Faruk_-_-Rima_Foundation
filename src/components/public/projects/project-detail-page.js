"use client";

import { useState } from "react";
import Link from "next/link";
import { useSiteLocale } from "@/components/public/providers/locale-provider";

function pick(en, bn, dk, locale) {
  if (locale === "BN") return bn || en;
  if (locale === "DK") return dk || en;
  return en;
}

const STATUS_CONFIG = {
  active: { label: "Active", dot: "bg-emerald-400", cls: "bg-emerald-50 text-emerald-700 border-emerald-200" },
  running: { label: "Running", dot: "bg-cyan-400", cls: "bg-cyan-50 text-cyan-700 border-cyan-200" },
  completed: { label: "Completed", dot: "bg-violet-400", cls: "bg-violet-50 text-violet-700 border-violet-200" },
  draft: { label: "Draft", dot: "bg-slate-400", cls: "bg-slate-50 text-slate-600 border-slate-200" },
};

function fmt(n) {
  if (n == null) return null;
  return "৳" + Number(n).toLocaleString("en-BD");
}

function fmtDate(d) {
  if (!d) return null;
  try {
    return new Date(d).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" });
  } catch { return null; }
}

/* ── Image Gallery ─────────────────────────────────────────────────────────── */
function ImageGallery({ images, title }) {
  const [active, setActive] = useState(0);
  if (!images || images.length === 0) return null;

  const prev = () => setActive((p) => (p - 1 + images.length) % images.length);
  const next = () => setActive((p) => (p + 1) % images.length);

  return (
    <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
      {/* Main image */}
      <div className="relative aspect-video w-full overflow-hidden bg-slate-100">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          key={active}
          src={images[active].imageUrl}
          alt={`${title} — ${active + 1}`}
          className="h-full w-full object-cover"
        />
        {images.length > 1 && (
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
              {active + 1} / {images.length}
            </span>
          </>
        )}
      </div>
      {/* Thumbnails */}
      {images.length > 1 && (
        <div className="flex gap-2 overflow-x-auto p-3">
          {images.map((img, i) => (
            <button key={img.id} onClick={() => setActive(i)}
              className={`h-16 w-24 shrink-0 overflow-hidden rounded-lg border-2 transition-all ${i === active ? "border-cyan-500" : "border-transparent opacity-55 hover:opacity-85"
                }`}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={img.imageUrl} alt={`Thumb ${i + 1}`} className="h-full w-full object-cover" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

/* ── Info Row ──────────────────────────────────────────────────────────────── */
function InfoRow({ icon, label, value, mono }) {
  if (!value) return null;
  return (
    <div className="flex items-start gap-3 py-3 border-b border-slate-100 last:border-0">
      <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-cyan-50 text-cyan-600">
        {icon}
      </div>
      <div className="min-w-0 flex-1">
        <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">{label}</p>
        <p className={`mt-0.5 text-sm font-semibold text-slate-800 wrap-break-word ${mono ? "font-mono" : ""}`}>{value}</p>
      </div>
    </div>
  );
}

/* ── Section Card ──────────────────────────────────────────────────────────── */
function SectionCard({ icon, title, children }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <h2 className="mb-4 flex items-center gap-2 text-sm font-extrabold uppercase tracking-wider text-slate-500">
        <span className="text-cyan-600">{icon}</span>
        {title}
      </h2>
      {children}
    </div>
  );
}

/* ── Icons ─────────────────────────────────────────────────────────────────── */
const Icons = {
  code: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="h-4 w-4"><path d="M8 9l-3 3 3 3M16 9l3 3-3 3M12 5l-2 14" strokeLinecap="round" strokeLinejoin="round" /></svg>,
  category: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="h-4 w-4"><path d="M4 6h16M4 10h16M4 14h16M4 18h16" strokeLinecap="round" /></svg>,
  location: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="h-4 w-4"><path d="M12 22s-8-4.5-8-11.8A8 8 0 0 1 12 2a8 8 0 0 1 8 8.2c0 7.3-8 11.8-8 11.8Z" strokeLinecap="round" strokeLinejoin="round" /><circle cx="12" cy="10" r="3" /></svg>,
  target: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="h-4 w-4"><circle cx="12" cy="12" r="10" /><circle cx="12" cy="12" r="6" /><circle cx="12" cy="12" r="2" /></svg>,
  money: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="h-4 w-4"><path d="M12 2v20M17 5H9.5a3.5 3.5 0 1 0 0 7h5a3.5 3.5 0 1 1 0 7H6" strokeLinecap="round" strokeLinejoin="round" /></svg>,
  calendar: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="h-4 w-4"><rect x="3" y="4" width="18" height="18" rx="2" /><path d="M16 2v4M8 2v4M3 10h18" strokeLinecap="round" /></svg>,
  docs: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="h-4 w-4"><path d="M4 6h16M4 11h16M4 16h10" strokeLinecap="round" /></svg>,
  check: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="h-4 w-4"><path d="M9 12l2 2 4-4" strokeLinecap="round" strokeLinejoin="round" /><path d="M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" strokeLinecap="round" /></svg>,
  map: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="h-4 w-4"><path d="M3 7l6-3 6 3 6-3v13l-6 3-6-3-6 3V7Z" strokeLinecap="round" strokeLinejoin="round" /><path d="M9 4v13M15 7v13" strokeLinecap="round" /></svg>,
  back: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-4 w-4"><path d="M19 12H5M12 19l-7-7 7-7" strokeLinecap="round" strokeLinejoin="round" /></svg>,
  images: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="h-4 w-4"><rect x="3" y="3" width="18" height="18" rx="2" /><circle cx="8.5" cy="8.5" r="1.5" /><path d="M21 15l-5-5L5 21" strokeLinecap="round" strokeLinejoin="round" /></svg>,
};

/* ── Main Component ────────────────────────────────────────────────────────── */
export function ProjectDetailPage({ project, category, divisionName, districtName, upazilaName }) {
  const { locale } = useSiteLocale();

  const title = pick(project.projectTitleEn, project.projectTitleBn, project.projectTitleDk, locale);
  const shortDesc = pick(project.shortDescriptionEn, project.shortDescriptionBn, project.shortDescriptionDk, locale);
  const fullDesc = pick(project.fullDescriptionEn, project.fullDescriptionBn, project.fullDescriptionDk, locale);
  const objective = pick(project.objectiveEn, project.objectiveBn, project.objectiveDk, locale);
  const location = pick(project.projectLocationEn, project.projectLocationBn, project.projectLocationDk, locale);
  const categoryName = category
    ? pick(category.nameEn, category.nameBn, category.nameDk, locale)
    : project.categoryNameEn;

  const badge = STATUS_CONFIG[project.status] ?? STATUS_CONFIG.draft;

  const estimated = fmt(project.estimatedBudget);
  const collected = fmt(project.collectedAmount);
  const distributed = fmt(project.distributedAmount);

  const budgetPct = project.estimatedBudget && project.collectedAmount
    ? Math.min(100, Math.round((Number(project.collectedAmount) / Number(project.estimatedBudget)) * 100))
    : null;

  const createdAt = fmtDate(project.createdAt);
  const updatedAt = fmtDate(project.updatedAt);

  // Use gallery images; if none but thumbnailImage exists, show that
  const galleryImages = project.images?.length
    ? project.images
    : project.thumbnailImage
      ? [{ id: 0, imageUrl: project.thumbnailImage }]
      : [];

  const divName = divisionName ? pick(divisionName.nameEn, divisionName.nameBn, divisionName.nameDk, locale) : null;
  const distName = districtName ? pick(districtName.nameEn, districtName.nameBn, districtName.nameDk, locale) : null;
  const upaName = upazilaName ? pick(upazilaName.nameEn, upazilaName.nameBn, upazilaName.nameDk, locale) : null;

  return (
    <div className="min-h-screen bg-slate-50">
      {/* ── Hero ── */}
      <div className="bg-[linear-gradient(135deg,#0f172a,#155e75_52%,#0f766e)]">
        <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
          {/* Breadcrumb */}
          <nav className="mb-5 flex flex-wrap items-center gap-1.5 text-xs font-semibold text-cyan-300/70">
            <Link href="/" className="hover:text-cyan-200 transition-colors">Home</Link>
            <span>/</span>
            <Link href="/projects" className="hover:text-cyan-200 transition-colors">Projects</Link>
            {category && (
              <>
                <span>/</span>
                <Link href={`/projects/${category.id}`} className="hover:text-cyan-200 transition-colors">{categoryName}</Link>
              </>
            )}
            <span>/</span>
            <span className="text-cyan-200 line-clamp-1">{title}</span>
          </nav>

          <div className="flex flex-wrap items-start gap-3">
            <div className="flex-1 min-w-0">
              <div className="flex flex-wrap items-center gap-2 mb-3">
                <span className="rounded-lg bg-black/30 px-2.5 py-1 font-mono text-[11px] font-bold text-white">{project.projectCode}</span>
                <span className={`flex items-center gap-1.5 rounded-full border px-3 py-0.5 text-[11px] font-bold ${badge.cls}`}>
                  <span className={`h-1.5 w-1.5 rounded-full ${badge.dot}`} />
                  {badge.label}
                </span>
                {categoryName && (
                  <span className="rounded-full bg-white/10 px-3 py-0.5 text-[11px] font-semibold text-cyan-200">{categoryName}</span>
                )}
              </div>
              <h3 className="text-2xl font-extrabold leading-tight text-white sm:text-2xl lg:text-3xl">{title}</h3>
              {shortDesc && (
                <p className="mt-3 max-w-3xl whitespace-pre-line text-base font-bold leading-relaxed text-cyan-100/80">{shortDesc}</p>
              )}
              {/* Quick stats row */}
              <div className="mt-5 flex flex-wrap gap-4">
                {estimated && (
                  <div className="flex items-center gap-1.5 text-sm font-semibold text-white/80">
                    {Icons.money}
                    <span className="text-white font-bold">{estimated}</span>
                    <span className="text-white/50 text-xs">estimated</span>
                  </div>
                )}
                {location && (
                  <div className="flex items-center gap-1.5 text-sm text-white/80">
                    {Icons.location}
                    <span>{location}</span>
                  </div>
                )}
                {galleryImages.length > 0 && (
                  <div className="flex items-center gap-1.5 text-sm text-white/80">
                    {Icons.images}
                    <span>{galleryImages.length} photo{galleryImages.length !== 1 ? "s" : ""}</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── Body ── */}
      <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="grid gap-8 lg:grid-cols-3">

          {/* ── Left column ── */}
          <div className="lg:col-span-2 space-y-8">

            {/* Gallery */}
            {galleryImages.length > 0 && (
              <ImageGallery images={galleryImages} title={title} />
            )}

            {/* Full Description */}
            {fullDesc && (
              <SectionCard icon={Icons.docs} title="About This Project">
                <p className="whitespace-pre-line text-sm leading-relaxed text-slate-600">{fullDesc}</p>
              </SectionCard>
            )}

            {/* Objective */}
            {objective && (
              <SectionCard icon={Icons.check} title="Objective">
                <p className="whitespace-pre-line text-sm leading-relaxed text-slate-600">{objective}</p>
              </SectionCard>
            )}
          </div>

          {/* ── Right sidebar ── */}
          <div className="space-y-6">

            {/* Project Details */}
            <div className="rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden">
              <div className="bg-slate-50 px-5 py-3 border-b border-slate-100">
                <h2 className="text-xs font-extrabold uppercase tracking-wider text-slate-500">Project Details</h2>
              </div>
              <div className="px-5">
                <InfoRow icon={Icons.code} label="Project Code" value={project.projectCode} mono />
                <InfoRow icon={Icons.category} label="Category" value={categoryName} />
                <InfoRow icon={Icons.location} label="Location" value={location} />
                <InfoRow icon={Icons.target} label="Target Beneficiary" value={project.targetBeneficiary} />
                <InfoRow icon={Icons.map} label="Division" value={divName} />
                <InfoRow icon={Icons.map} label="District" value={distName} />
                <InfoRow icon={Icons.map} label="Upazila" value={upaName} />
                <InfoRow icon={Icons.calendar} label="Created" value={createdAt} />
                <InfoRow icon={Icons.calendar} label="Updated" value={updatedAt} />
              </div>
            </div>

            {/* Budget */}
            {(estimated || collected || distributed) && (
              <div className="rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden">
                <div className="bg-slate-50 px-5 py-3 border-b border-slate-100">
                  <h2 className="text-xs font-extrabold uppercase tracking-wider text-slate-500">Budget & Finance</h2>
                </div>
                <div className="p-5 space-y-4">
                  {estimated && (
                    <div>
                      <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">Estimated Budget</p>
                      <p className="mt-0.5 text-2xl font-extrabold text-slate-800">{estimated}</p>
                    </div>
                  )}

                  {collected && (
                    <div className="flex items-end justify-between border-t border-slate-100 pt-3">
                      <div>
                        <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">Collected</p>
                        <p className="mt-0.5 text-lg font-bold text-cyan-700">{collected}</p>
                      </div>
                      {budgetPct !== null && (
                        <span className="text-2xl font-extrabold text-cyan-600">{budgetPct}%</span>
                      )}
                    </div>
                  )}

                  {/* Progress bar */}
                  {budgetPct !== null && (
                    <div>
                      <div className="h-3 w-full overflow-hidden rounded-full bg-slate-100">
                        <div
                          className="h-full rounded-full bg-linear-to-r from-cyan-500 to-teal-500 transition-all duration-700"
                          style={{ width: `${budgetPct}%` }}
                        />
                      </div>
                      <p className="mt-1.5 text-[11px] text-slate-400">
                        {budgetPct}% of target collected
                      </p>
                    </div>
                  )}

                  {distributed && (
                    <div className="border-t border-slate-100 pt-3">
                      <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">Distributed</p>
                      <p className="mt-0.5 text-lg font-bold text-emerald-700">{distributed}</p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Back */}
            {category && (
              <Link href={`/projects/${category.id}`}
                className="flex w-full items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-bold text-slate-700 shadow-sm hover:bg-slate-50 transition-colors">
                {Icons.back}
                Back to {categoryName}
              </Link>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
