"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useSiteLocale } from "@/components/public/providers/locale-provider";
import { DonateBankInfoModal } from "@/components/public/donate/donate-bank-info-modal";

// Site's brand gradient (teal-700 → cyan-700), used consistently across
// hero CTAs, the donate page, and here — no per-card color rotation.
const BRAND_GLOW = "from-teal-700 to-cyan-700";

function pick(en, bn, dk, locale) {
  if (locale === "BN") return bn || en;
  if (locale === "DK") return dk || en;
  return en;
}

const STATUS_BADGE_CLASS = {
  active: "bg-emerald-100 text-emerald-700",
  running: "bg-cyan-100 text-cyan-700",
  completed: "bg-violet-100 text-violet-700",
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

function FeaturedProjectCard({ project, locale, fp, onDonate }) {
  const title = pick(project.projectTitleEn, project.projectTitleBn, project.projectTitleDk, locale);
  const desc = pick(project.shortDescriptionEn, project.shortDescriptionBn, project.shortDescriptionDk, locale);
  const location = pick(project.projectLocationEn, project.projectLocationBn, project.projectLocationDk, locale);
  const statusKey = STATUS_BADGE_CLASS[project.status] ? project.status : "active";
  const badge = {
    label: fp.statusLabels[statusKey],
    cls: STATUS_BADGE_CLASS[statusKey],
  };
  const thumb = project.images?.[0]?.imageUrl ?? null;
  const detailHref = `/projects/${project.projectCategoryId}/${project.id}`;

  return (
    <article className="group relative flex h-full flex-col overflow-hidden rounded-[2rem] border-2 border-transparent bg-white bg-clip-padding shadow-[0_18px_50px_rgba(15,23,42,0.10)] ring-1 ring-slate-100 transition-all duration-300 hover:-translate-y-1.5 hover:border-cyan-400 hover:shadow-[0_0_0_4px_rgba(8,145,178,0.15),0_28px_70px_rgba(8,145,178,0.25)] hover:ring-cyan-200">
      <Link
        href={detailHref}
        className={`relative block h-48 overflow-hidden bg-linear-to-br ${BRAND_GLOW} sm:h-52`}
      >
        {thumb ? (
          // Full-bleed photo banner, edge-to-edge.
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={thumb}
            alt={title}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" className="h-14 w-14 text-white/70" aria-hidden="true">
              <path d="M9 5H7a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-2" strokeLinecap="round" strokeLinejoin="round" />
              <rect x="9" y="3" width="6" height="4" rx="1" />
              <path d="M9 12h6M9 16h4" strokeLinecap="round" />
            </svg>
          </div>
        )}

        <div className="pointer-events-none absolute inset-0 bg-linear-to-t from-black/45 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

        <span className={`absolute right-3 top-3 rounded-full px-3 py-1 text-[11px] font-bold shadow-sm backdrop-blur-sm ${badge.cls}`}>
          {badge.label}
        </span>
      </Link>

      <div className="flex flex-1 flex-col p-5 sm:p-6">
        <Link href={detailHref}>
          <h3 className="text-center text-base font-extrabold leading-snug text-slate-900 transition-opacity group-hover:opacity-80 sm:text-lg">
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
          onClick={() => onDonate({ id: project.id, title })}
          className={`mt-5 inline-flex w-full items-center justify-center gap-2 rounded-full border border-transparent bg-linear-to-r ${BRAND_GLOW} px-5 py-2.5 text-sm font-bold text-white! shadow-md shadow-cyan-200/70 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-cyan-300/70 active:translate-y-0`}
        >
          <HeartIcon />
          {fp.donateNowLabel}
        </button>
      </div>
    </article>
  );
}

export function FeaturedProjectsGrid({ projects }) {
  const { locale, copy } = useSiteLocale();
  const fp = copy.featuredProjects;
  const [modalProject, setModalProject] = useState(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const trackRef = useRef(null);

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;

    let frame = null;
    const handleScroll = () => {
      if (frame) return;
      frame = requestAnimationFrame(() => {
        frame = null;
        const cardWidth = track.scrollWidth / projects.length;
        const index = Math.round(track.scrollLeft / cardWidth);
        setActiveIndex(Math.min(projects.length - 1, Math.max(0, index)));
      });
    };

    track.addEventListener("scroll", handleScroll, { passive: true });
    return () => {
      track.removeEventListener("scroll", handleScroll);
      if (frame) cancelAnimationFrame(frame);
    };
  }, [projects.length]);

  const scrollToIndex = (index) => {
    const track = trackRef.current;
    if (!track) return;
    const cardWidth = track.scrollWidth / projects.length;
    track.scrollTo({ left: cardWidth * index, behavior: "smooth" });
  };

  return (
    <>
      {/* Mobile: swipeable, snap-scrolling carousel with dot pagination */}
      <div className="mt-10 sm:hidden">
        <div
          ref={trackRef}
          className="flex snap-x snap-mandatory gap-4 overflow-x-auto scroll-smooth px-1 pb-2 scrollbar-none [-ms-overflow-style:none]"
        >
          {projects.map((project) => (
            <div key={project.id} className="w-[86%] shrink-0 snap-center">
              <FeaturedProjectCard
                project={project}
                locale={locale}
                fp={fp}
                onDonate={(info) => setModalProject(info)}
              />
            </div>
          ))}
        </div>

        {projects.length > 1 ? (
          <div className="mt-4 flex items-center justify-center gap-2">
            {projects.map((project, index) => (
              <button
                key={project.id}
                type="button"
                aria-label={`Show project ${index + 1}`}
                onClick={() => scrollToIndex(index)}
                className={`h-2 rounded-full transition-all ${index === activeIndex
                  ? `w-6 bg-linear-to-r ${BRAND_GLOW}`
                  : "w-2 bg-slate-300"
                  }`}
              />
            ))}
          </div>
        ) : null}
      </div>

      {/* Tablet/desktop: standard grid */}
      <div className="mt-10 hidden gap-6 sm:grid sm:grid-cols-2 lg:grid-cols-3">
        {projects.map((project) => (
          <FeaturedProjectCard
            key={project.id}
            project={project}
            locale={locale}
            fp={fp}
            onDonate={(info) => setModalProject(info)}
          />
        ))}
      </div>

      <DonateBankInfoModal
        isOpen={Boolean(modalProject)}
        project={modalProject?.title}
        projectId={modalProject?.id}
        onClose={() => setModalProject(null)}
      />
    </>
  );
}
