"use client";

import Link from "next/link";
import { useSiteLocale } from "@/components/public/providers/locale-provider";

function pick(en, bn, dk, locale) {
  if (locale === "BN") return bn || en;
  if (locale === "DK") return dk || en;
  return en;
}

const STATUS_BADGE = {
  active:    { label: "Active",    cls: "bg-emerald-100 text-emerald-700" },
  running:   { label: "Running",   cls: "bg-cyan-100 text-cyan-700" },
  completed: { label: "Completed", cls: "bg-violet-100 text-violet-700" },
};

function LocationIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="h-4 w-4 shrink-0" aria-hidden="true">
      <path d="M12 22s-8-4.5-8-11.8A8 8 0 0 1 12 2a8 8 0 0 1 8 8.2c0 7.3-8 11.8-8 11.8Z" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx="12" cy="10" r="3" />
    </svg>
  );
}

function TargetIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="h-4 w-4 shrink-0" aria-hidden="true">
      <circle cx="12" cy="12" r="10" />
      <circle cx="12" cy="12" r="6" />
      <circle cx="12" cy="12" r="2" />
    </svg>
  );
}

function BudgetIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="h-4 w-4 shrink-0" aria-hidden="true">
      <path d="M12 2v20M17 5H9.5a3.5 3.5 0 1 0 0 7h5a3.5 3.5 0 1 1 0 7H6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function ProjectCard({ project, locale }) {
  const title = pick(project.projectTitleEn, project.projectTitleBn, project.projectTitleDk, locale);
  const desc = pick(project.shortDescriptionEn, project.shortDescriptionBn, project.shortDescriptionDk, locale);
  const location = pick(project.projectLocationEn, project.projectLocationBn, project.projectLocationDk, locale);
  const badge = STATUS_BADGE[project.status] ?? STATUS_BADGE.active;
  const thumb = project.images?.[0]?.imageUrl ?? null;

  return (
    <div className="group flex flex-col overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm transition-all duration-300 hover:shadow-xl hover:shadow-slate-900/10 hover:-translate-y-1">
      {/* Thumbnail */}
      <div className="relative h-52 overflow-hidden bg-gradient-to-br from-cyan-50 to-slate-100">
        {thumb ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={thumb} alt={title} className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" />
        ) : (
          <div className="flex h-full w-full items-center justify-center">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" className="h-16 w-16 text-slate-300" aria-hidden="true">
              <path d="M9 5H7a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-2" strokeLinecap="round" strokeLinejoin="round" />
              <rect x="9" y="3" width="6" height="4" rx="1" />
              <path d="M9 12h6M9 16h4" strokeLinecap="round" />
            </svg>
          </div>
        )}
        {/* Status badge */}
        <span className={`absolute right-3 top-3 rounded-full px-3 py-1 text-[11px] font-bold ${badge.cls}`}>
          {badge.label}
        </span>
        {/* Code badge */}
        <span className="absolute left-3 top-3 rounded-lg bg-black/50 px-2.5 py-1 font-mono text-[11px] font-bold text-white">
          {project.projectCode}
        </span>
        {/* Image count */}
        {project.images.length > 1 && (
          <span className="absolute bottom-3 right-3 flex items-center gap-1 rounded-lg bg-black/50 px-2 py-0.5 text-[11px] font-semibold text-white">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-3 w-3"><rect x="3" y="3" width="18" height="18" rx="2"/><path d="m3 9 4-4 4 4 4-4 4 4"/><path d="m3 14 4 4 4-4 4 4 4-4"/></svg>
            {project.images.length}
          </span>
        )}
      </div>

      {/* Content */}
      <div className="flex flex-1 flex-col gap-3 p-5">
        <h3 className="text-base font-extrabold leading-snug text-slate-900 group-hover:text-cyan-700 transition-colors">
          {title}
        </h3>

        {desc && (
          <p className="line-clamp-2 text-sm leading-relaxed text-slate-500">{desc}</p>
        )}

        <div className="mt-auto flex flex-col gap-2 border-t border-slate-100 pt-3">
          {location && (
            <div className="flex items-center gap-2 text-xs text-slate-500">
              <LocationIcon />
              <span className="truncate">{location}</span>
            </div>
          )}
          {project.targetBeneficiary && (
            <div className="flex items-center gap-2 text-xs text-slate-500">
              <TargetIcon />
              <span className="truncate">{project.targetBeneficiary}</span>
            </div>
          )}
          {project.estimatedBudget != null && (
            <div className="flex items-center gap-2 text-xs font-semibold text-cyan-700">
              <BudgetIcon />
              <span>৳{Number(project.estimatedBudget).toLocaleString()}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export function CategoryProjectsPage({ category, projects }) {
  const { locale } = useSiteLocale();

  const categoryName = pick(category.nameEn, category.nameBn, category.nameDk, locale);
  const categoryDesc = pick(category.descriptionEn, category.descriptionBn, category.descriptionDk, locale);

  return (
    <div className="min-h-screen bg-white">
      {/* Hero */}
      <section className="relative overflow-hidden bg-[linear-gradient(135deg,#0f172a,#155e75_52%,#0f766e)] px-4 py-20 sm:px-6 lg:px-8">
        <div className="pointer-events-none absolute inset-0" aria-hidden="true">
          <div className="absolute -top-32 -right-32 h-96 w-96 rounded-full border border-cyan-500/20" />
          <div className="absolute bottom-0 left-0 h-64 w-64 -translate-x-1/2 translate-y-1/2 rounded-full border border-cyan-600/20" />
        </div>
        <div className="relative mx-auto max-w-4xl">
          {/* Breadcrumb */}
          <nav className="mb-6 flex items-center gap-2 text-xs font-semibold text-cyan-300/70">
            <Link href="/" className="hover:text-cyan-200 transition-colors">Home</Link>
            <span>/</span>
            <Link href="/projects" className="hover:text-cyan-200 transition-colors">Projects</Link>
            <span>/</span>
            <span className="text-cyan-200">{categoryName}</span>
          </nav>

          <div className="text-center">
            <span className="inline-block rounded-full border border-cyan-400/30 bg-cyan-400/10 px-4 py-1.5 text-xs font-bold uppercase tracking-widest text-cyan-300">
              Category
            </span>
            <h1 className="mt-4 text-3xl font-extrabold leading-tight text-white sm:text-4xl lg:text-5xl">
              {categoryName}
            </h1>
            {categoryDesc && (
              <p className="mx-auto mt-4 max-w-2xl text-base leading-relaxed text-cyan-100/80">
                {categoryDesc}
              </p>
            )}
            <div className="mt-6 flex items-center justify-center gap-4">
              <div className="inline-flex items-center gap-2 rounded-full border border-cyan-400/20 bg-white/10 px-4 py-2">
                <span className="flex h-2 w-2 rounded-full bg-emerald-400" />
                <span className="text-sm font-semibold text-white">
                  {projects.length} project{projects.length !== 1 ? "s" : ""}
                </span>
              </div>
              <Link
                href="/projects"
                className="inline-flex items-center gap-1.5 rounded-full border border-white/20 bg-white/10 px-4 py-2 text-sm font-semibold text-white hover:bg-white/20 transition-colors"
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-4 w-4" aria-hidden="true">
                  <path d="M19 12H5M12 19l-7-7 7-7" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                All Categories
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Projects grid */}
      <section className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
        {projects.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <div className="flex h-20 w-20 items-center justify-center rounded-3xl bg-cyan-50">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" className="h-10 w-10 text-cyan-400" aria-hidden="true">
                <path d="M9 5H7a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-2" strokeLinecap="round" strokeLinejoin="round" />
                <rect x="9" y="3" width="6" height="4" rx="1" />
                <path d="M9 12h6M9 16h4" strokeLinecap="round" />
              </svg>
            </div>
            <p className="mt-5 text-lg font-bold text-slate-800">No projects yet</p>
            <p className="mt-2 max-w-sm text-sm text-slate-500">
              There are no active projects in this category at the moment. Check back soon.
            </p>
            <Link
              href="/projects"
              className="mt-6 inline-flex items-center gap-2 rounded-xl bg-cyan-600 px-5 py-2.5 text-sm font-bold text-white hover:bg-cyan-700 transition-colors"
            >
              Browse All Categories
            </Link>
          </div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {projects.map((project) => (
              <ProjectCard key={project.id} project={project} locale={locale} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
