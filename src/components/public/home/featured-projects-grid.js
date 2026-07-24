"use client";

import { useState } from "react";
import Link from "next/link";
import { useSiteLocale } from "@/components/public/providers/locale-provider";
import { DonateBankInfoModal } from "@/components/public/donate/donate-bank-info-modal";

function pick(en, bn, dk, locale) {
  if (locale === "BN") return bn || en;
  if (locale === "DK") return dk || en;
  return en;
}

const STATUS_BADGE = {
  active: { label: "Active", cls: "bg-emerald-100 text-emerald-700" },
  running: { label: "Running", cls: "bg-cyan-100 text-cyan-700" },
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

function HeartIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className="h-4 w-4 shrink-0" aria-hidden="true">
      <path d="M12 21s-7.5-4.9-10.2-9.3C.4 9.1 1.2 5.6 4.2 4.2c2.1-1 4.4-.3 5.8 1.4L12 7.7l2-2.1c1.4-1.7 3.7-2.4 5.8-1.4 3 1.4 3.8 4.9 2.4 7.5C19.5 16.1 12 21 12 21Z" />
    </svg>
  );
}

function ProgressBar({ collected, target }) {
  const collectedNum = Number(collected) || 0;
  const targetNum = Number(target) || 0;
  const pct = targetNum > 0 ? Math.min(100, Math.round((collectedNum / targetNum) * 100)) : null;

  if (pct === null) {
    return null;
  }

  return (
    <div className="mt-3">
      <div className="h-2 w-full overflow-hidden rounded-full bg-slate-100">
        <div
          className="h-full rounded-full bg-[linear-gradient(90deg,#0f766e,#0891b2)] shadow-[0_0_8px_rgba(8,145,178,0.5)] transition-all duration-500"
          style={{ width: `${pct}%` }}
        />
      </div>
      <div className="mt-1.5 flex items-center justify-between text-[11px] font-semibold text-slate-500">
        <span>৳{collectedNum.toLocaleString()} raised</span>
        <span className="text-cyan-700">{pct}%</span>
      </div>
    </div>
  );
}

function FeaturedProjectCard({ project, locale, onDonate }) {
  const title = pick(project.projectTitleEn, project.projectTitleBn, project.projectTitleDk, locale);
  const desc = pick(project.shortDescriptionEn, project.shortDescriptionBn, project.shortDescriptionDk, locale);
  const location = pick(project.projectLocationEn, project.projectLocationBn, project.projectLocationDk, locale);
  const badge = STATUS_BADGE[project.status] ?? STATUS_BADGE.active;
  const thumb = project.images?.[0]?.imageUrl ?? null;
  const detailHref = `/projects/${project.projectCategoryId}/${project.id}`;

  return (
    <article className="group flex flex-col overflow-hidden rounded-3xl border-2 border-cyan-100 bg-white shadow-sm ring-1 ring-cyan-50 transition-all duration-300 hover:-translate-y-1.5 hover:border-cyan-400 hover:shadow-2xl hover:shadow-cyan-900/20 hover:ring-cyan-200">
      <Link href={detailHref} className="relative block h-44 overflow-hidden bg-linear-to-br from-cyan-50 to-slate-100 sm:h-48">
        {thumb ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={thumb}
            alt={title}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" className="h-14 w-14 text-slate-300" aria-hidden="true">
              <path d="M9 5H7a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-2" strokeLinecap="round" strokeLinejoin="round" />
              <rect x="9" y="3" width="6" height="4" rx="1" />
              <path d="M9 12h6M9 16h4" strokeLinecap="round" />
            </svg>
          </div>
        )}
        <div className="pointer-events-none absolute inset-0 bg-linear-to-t from-black/40 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
        <span className={`absolute right-3 top-3 rounded-full px-3 py-1 text-[11px] font-bold shadow-sm backdrop-blur-sm ${badge.cls}`}>
          {badge.label}
        </span>
      </Link>

      <div className="flex flex-1 flex-col p-5 sm:p-6">
        <Link href={detailHref}>
          <h3 className="text-center bg-[linear-gradient(90deg,#0f766e,#0891b2)] bg-clip-text text-base font-extrabold leading-snug text-transparent transition-opacity group-hover:opacity-80 sm:text-lg">
            {title}
          </h3>
        </Link>

        {desc && (
          <p className="mt-2 text-center whitespace-pre-line text-sm font-medium leading-relaxed text-slate-600">
            {desc}
          </p>
        )}

        <div className="mt-auto space-y-2.5 border-t border-slate-100 pt-4">
          {location && (
            <div className="flex items-center gap-2 text-xs text-slate-500">
              <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-slate-50 text-slate-400">
                <LocationIcon />
              </span>
              <span className="truncate">{location}</span>
            </div>
          )}
          <ProgressBar collected={project.collectedAmount} target={project.estimatedBudget} />
        </div>

        <button
          type="button"
          onClick={() => onDonate(title)}
          className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-full border border-transparent bg-[linear-gradient(135deg,#0f766e,#0891b2)] px-5 py-2.5 text-sm font-bold text-white! shadow-md shadow-cyan-200/70 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-cyan-300/70 active:translate-y-0"
        >
          <HeartIcon />
          Donate Now
        </button>
      </div>
    </article>
  );
}

export function FeaturedProjectsGrid({ projects }) {
  const { locale } = useSiteLocale();
  const [modalProject, setModalProject] = useState(null);

  return (
    <>
      <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {projects.map((project) => (
          <FeaturedProjectCard
            key={project.id}
            project={project}
            locale={locale}
            onDonate={(title) => setModalProject(title)}
          />
        ))}
      </div>

      <DonateBankInfoModal
        isOpen={Boolean(modalProject)}
        project={modalProject}
        onClose={() => setModalProject(null)}
      />
    </>
  );
}
