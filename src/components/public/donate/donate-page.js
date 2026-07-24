"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useSiteLocale } from "@/components/public/providers/locale-provider";
import { DonateBankInfoModal } from "@/components/public/donate/donate-bank-info-modal";

const HERO_SLIDES = ["/d-1.png", "/d-2.png"];

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

function BudgetIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="h-4 w-4 shrink-0" aria-hidden="true">
      <path d="M12 2v20M17 5H9.5a3.5 3.5 0 1 0 0 7h5a3.5 3.5 0 1 1 0 7H6" strokeLinecap="round" strokeLinejoin="round" />
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
          className="h-full rounded-full bg-[linear-gradient(90deg,_#0f766e,_#0891b2)] shadow-[0_0_8px_rgba(8,145,178,0.5)] transition-all duration-500"
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

function DonateProjectCard({ project, locale, onDonate }) {
  const title = pick(project.projectTitleEn, project.projectTitleBn, project.projectTitleDk, locale);
  const desc = pick(project.shortDescriptionEn, project.shortDescriptionBn, project.shortDescriptionDk, locale);
  const location = pick(project.projectLocationEn, project.projectLocationBn, project.projectLocationDk, locale);
  const badge = STATUS_BADGE[project.status] ?? STATUS_BADGE.active;
  const thumb = project.images?.[0]?.imageUrl ?? null;

  return (
    <article className="group flex flex-col overflow-hidden rounded-3xl border-2 border-cyan-100 bg-white shadow-sm ring-1 ring-cyan-50 transition-all duration-300 hover:-translate-y-1.5 hover:border-cyan-400 hover:shadow-2xl hover:shadow-cyan-900/20 hover:ring-cyan-200">
      <Link
        href={`/projects/${project.projectCategoryId}/${project.id}`}
        className="relative block h-52 overflow-hidden bg-linear-to-br from-cyan-50 to-slate-100"
      >
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
        {/* <span className="absolute left-3 top-3 rounded-lg bg-black/55 px-2.5 py-1 font-mono text-[11px] font-bold tracking-wide text-white backdrop-blur-sm">
          {project.projectCode}
        </span> */}
      </Link>

      <div className="flex flex-1 flex-col p-6">
        <Link href={`/projects/${project.projectCategoryId}/${project.id}`}>
          <h3 className="bg-[linear-gradient(90deg,#0f766e,#0891b2)] text-center bg-clip-text text-lg font-extrabold leading-snug text-transparent transition-opacity group-hover:opacity-80">
            {title}
          </h3>
        </Link>

        {desc && (
          <p className="mt-2 line-clamp-3 text-center whitespace-pre-line text-sm font-medium leading-relaxed text-slate-600">
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
          {project.estimatedBudget != null && (
            <div className="flex items-center gap-2 text-xs font-semibold text-cyan-700">
              <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-cyan-50 text-cyan-600">
                <BudgetIcon />
              </span>
              <span>Target ৳{Number(project.estimatedBudget).toLocaleString()}</span>
            </div>
          )}
          <ProgressBar collected={project.collectedAmount} target={project.estimatedBudget} />
        </div>

        <button
          type="button"
          onClick={() => onDonate(title)}
          className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-full border border-transparent bg-[linear-gradient(135deg,_#0f766e,_#0891b2)] px-5 py-3 text-sm font-bold text-white shadow-md shadow-cyan-200/70 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-cyan-300/70 active:translate-y-0"
        >
          <HeartIcon />
          Donate Now
        </button>
      </div>
    </article>
  );
}

function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center rounded-3xl border border-dashed border-slate-200 bg-slate-50/60 py-24 text-center">
      <div className="flex h-20 w-20 items-center justify-center rounded-3xl bg-white text-cyan-600 shadow-sm ring-1 ring-cyan-100">
        <HeartIcon />
      </div>
      <p className="mt-5 text-lg font-bold text-slate-800">No active projects right now</p>
      <p className="mt-2 max-w-sm text-sm leading-relaxed text-slate-500">
        Check back soon — new projects open for donation regularly.
      </p>
    </div>
  );
}

function HeroSlider() {
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setActiveIndex((current) => (current + 1) % HERO_SLIDES.length);
    }, 4500);

    return () => clearInterval(timer);
  }, []);

  return (
    <div className="relative w-full overflow-hidden rounded-3xl border border-white/10 shadow-2xl shadow-slate-950/40">
      <Image
        src={HERO_SLIDES[0]}
        alt=""
        width={1400}
        height={800}
        className="invisible h-auto w-full"
        aria-hidden="true"
      />

      {HERO_SLIDES.map((src, index) => (
        <div
          key={src}
          className={`absolute inset-0 transition-opacity duration-700 ${index === activeIndex ? "opacity-100" : "opacity-0"
            }`}
        >
          <Image
            src={src}
            alt=""
            width={1400}
            height={1050}
            className="h-full w-full object-cover"
            priority={index === 0}
          />
        </div>
      ))}

      <div className="absolute bottom-3 left-1/2 flex -translate-x-1/2 gap-1.5">
        {HERO_SLIDES.map((src, index) => (
          <button
            key={src}
            type="button"
            aria-label={`Show slide ${index + 1}`}
            onClick={() => setActiveIndex(index)}
            className={`h-1.5 rounded-full transition-all ${index === activeIndex ? "w-6 bg-white" : "w-1.5 bg-white/50"
              }`}
          />
        ))}
      </div>
    </div>
  );
}

export function DonatePage({ projects = [] }) {
  const { locale } = useSiteLocale();
  const [modalProject, setModalProject] = useState(null);
  const [isDonateModalOpen, setIsDonateModalOpen] = useState(false);

  return (
    <div className="min-h-screen bg-white">
      <section className="relative overflow-hidden bg-[linear-gradient(135deg,#0f172a,#155e75_52%,#0f766e)] px-4 py-6 sm:px-6 sm:py-7 lg:px-8">
        <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
          <div className="absolute -top-32 -right-32 h-96 w-96 rounded-full border border-cyan-500/20" />
          <div className="absolute -top-16 -right-16 h-64 w-64 rounded-full border border-cyan-400/15" />
          <div className="absolute bottom-0 left-0 h-64 w-64 -translate-x-1/2 translate-y-1/2 rounded-full border border-cyan-600/20" />
        </div>

        <div className="relative mx-auto grid max-w-7xl items-center gap-6 lg:grid-cols-2">
          <div className="text-center lg:text-left">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-cyan-400/30 bg-cyan-400/10 px-4 py-1.5 text-xs font-bold uppercase tracking-widest text-cyan-300">
              <HeartIcon />
              Give With Purpose
            </span>
            <h1 className="mt-3 text-2xl font-extrabold leading-tight text-white sm:text-3xl lg:text-4xl">
              Donate to an Active Project
            </h1>
            <p className="mx-auto mt-2 max-w-xl text-sm leading-relaxed text-cyan-100/80 lg:mx-0">
              Every contribution is directed to a specific, transparently tracked project — see exactly where your donation goes.
            </p>

            <div className="mt-4 flex justify-center lg:justify-start">
              <button
                type="button"
                onClick={() => {
                  setModalProject(null);
                  setIsDonateModalOpen(true);
                }}
                className="group inline-flex items-center gap-2 rounded-full bg-white px-6 py-3 text-sm font-extrabold text-cyan-800 shadow-lg shadow-cyan-950/30 ring-2 ring-white/60 transition hover:-translate-y-0.5 hover:shadow-xl hover:shadow-cyan-950/40"
              >
                <HeartIcon />
                Donate Now
                <span className="transition-transform group-hover:translate-x-1">&rarr;</span>
              </button>
            </div>
          </div>

          <div className="w-full max-w-xl justify-self-center lg:max-w-none lg:justify-self-auto">
            <HeroSlider />
          </div>
        </div>
      </section>

      <section id="projects" className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        {projects.length === 0 ? (
          <EmptyState />
        ) : (
          <div className="grid gap-7 sm:grid-cols-2 lg:grid-cols-3">
            {projects.map((project) => (
              <DonateProjectCard
                key={project.id}
                project={project}
                locale={locale}
                onDonate={(title) => {
                  setModalProject(title);
                  setIsDonateModalOpen(true);
                }}
              />
            ))}
          </div>
        )}
      </section>

      <DonateBankInfoModal
        isOpen={isDonateModalOpen}
        project={modalProject}
        onClose={() => setIsDonateModalOpen(false)}
      />
    </div>
  );
}
