"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useSiteLocale } from "@/components/public/providers/locale-provider";
import { DonateBankInfoModal } from "@/components/public/donate/donate-bank-info-modal";
import { QardHasanahBanner } from "@/components/public/home/qard-hasanah-banner";

const HERO_SLIDES = ["/d-1.png", "/d-2.png", "/d-3.png"];
const BRAND_GLOW = "from-teal-700 to-cyan-700";
const STATUS_BADGE_CLASS = {
  active: "bg-emerald-100 text-emerald-700",
  running: "bg-cyan-100 text-cyan-700",
  completed: "bg-violet-100 text-violet-700",
};

function pick(en, bn, dk, locale) {
  if (locale === "BN") return bn || en;
  if (locale === "DK") return dk || en;
  return en;
}

function getProjectThumb(project) {
  return project.thumbnailImage ?? project.images?.find((item) => item?.imageUrl)?.imageUrl ?? null;
}

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
        <span>{`\u09F3${collectedNum.toLocaleString()} raised`}</span>
        <span className="text-cyan-700">{pct}%</span>
      </div>
    </div>
  );
}

function DonateProjectCard({ project, locale, fp, onDonate }) {
  const title = pick(project.projectTitleEn, project.projectTitleBn, project.projectTitleDk, locale);
  const desc = pick(project.shortDescriptionEn, project.shortDescriptionBn, project.shortDescriptionDk, locale);
  const location = pick(project.projectLocationEn, project.projectLocationBn, project.projectLocationDk, locale);
  const statusKey = STATUS_BADGE_CLASS[project.status] ? project.status : "active";
  const badge = {
    label: fp?.statusLabels?.[statusKey] ?? statusKey,
    cls: STATUS_BADGE_CLASS[statusKey],
  };
  const thumb = getProjectThumb(project);
  const detailHref = `/projects/${project.projectCategoryId}/${project.id}`;

  return (
    <article className="group relative flex h-full flex-col overflow-hidden rounded-[2rem] border border-cyan-100 bg-white ring-1 ring-slate-100 transition-all duration-300 hover:-translate-y-1 hover:border-cyan-200 hover:ring-cyan-100">
      <Link href={detailHref} className="relative block h-48 overflow-hidden bg-slate-100 sm:h-52">
        {thumb ? (
          <Image
            src={thumb}
            alt={title}
            fill
            sizes="(max-width: 639px) 86vw, (max-width: 1023px) 50vw, 33vw"
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
            unoptimized
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
          {fp?.donateNowLabel ?? "Donate Now"}
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
        Check back soon - new projects open for donation regularly.
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
    <div className="relative aspect-1400/1050 w-full overflow-hidden rounded-3xl border border-white/10 shadow-2xl shadow-slate-950/40">
      {HERO_SLIDES.map((src, index) => (
        <div
          key={src}
          className={`absolute inset-0 transition-opacity duration-700 ${index === activeIndex ? "opacity-100" : "opacity-0"}`}
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
            className={`h-1.5 rounded-full transition-all ${index === activeIndex ? "w-6 bg-white" : "w-1.5 bg-white/50"}`}
          />
        ))}
      </div>
    </div>
  );
}

export function DonatePage({ projects = [] }) {
  const { locale, copy } = useSiteLocale();
  const donateHero = copy.donateHero;
  const fp = copy.featuredProjects;
  const [modalProject, setModalProject] = useState(null);
  const [isDonateModalOpen, setIsDonateModalOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const [desktopIndex, setDesktopIndex] = useState(0);
  const [isHovering, setIsHovering] = useState(false);
  const trackRef = useRef(null);
  const visibleCount = 3;
  const maxDesktopIndex = Math.max(0, projects.length - visibleCount);

  useEffect(() => {
    const track = trackRef.current;
    if (!track || projects.length === 0) return;

    let frame = null;
    const handleScroll = () => {
      if (frame) return;
      frame = requestAnimationFrame(() => {
        frame = null;
        const children = Array.from(track.children);
        const nextIndex = children.reduce((closestIndex, child, index) => {
          const currentDistance = Math.abs(track.scrollLeft - child.offsetLeft);
          const closestDistance = Math.abs(track.scrollLeft - children[closestIndex].offsetLeft);
          return currentDistance < closestDistance ? index : closestIndex;
        }, 0);
        setActiveIndex(nextIndex);
      });
    };

    track.addEventListener("scroll", handleScroll, { passive: true });
    return () => {
      track.removeEventListener("scroll", handleScroll);
      if (frame) cancelAnimationFrame(frame);
    };
  }, [projects.length]);

  useEffect(() => {
    if (maxDesktopIndex <= 0 || isHovering) return;
    const timer = setInterval(() => {
      setDesktopIndex((prev) => (prev + 1) % (maxDesktopIndex + 1));
    }, 4000);
    return () => clearInterval(timer);
  }, [isHovering, maxDesktopIndex]);

  const scrollToIndex = (index) => {
    const track = trackRef.current;
    if (!track) return;
    const target = track.children[index];
    if (!target) return;
    track.scrollTo({ left: target.offsetLeft, behavior: "smooth" });
  };

  return (
    <div className="min-h-screen bg-white">
      <section className="relative overflow-hidden bg-[linear-gradient(135deg,#0f172a,#155e75_52%,#0f766e)] px-5 py-10 sm:px-6 sm:py-7 lg:px-8">
        <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
          <div className="absolute -top-32 -right-32 h-96 w-96 rounded-full border border-cyan-500/20" />
          <div className="absolute -top-16 -right-16 h-64 w-64 rounded-full border border-cyan-400/15" />
          <div className="absolute bottom-0 left-0 h-64 w-64 -translate-x-1/2 translate-y-1/2 rounded-full border border-cyan-600/20" />
        </div>

        <div className="relative mx-auto grid max-w-7xl items-center gap-8 lg:grid-cols-2 lg:gap-6">
          <div className="text-center lg:text-left">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-cyan-400/30 bg-cyan-400/10 px-3.5 py-1.5 text-[11px] font-bold uppercase tracking-widest text-cyan-300 sm:px-4 sm:text-xs">
              <HeartIcon />
              {donateHero.badge}
            </span>
            <h1 className="mt-4 text-[1.75rem] font-extrabold leading-tight text-white sm:mt-3 sm:text-3xl lg:text-4xl">
              {donateHero.title}
            </h1>
            <p className="mx-auto mt-3 max-w-xl text-sm leading-relaxed text-cyan-100/80 sm:mt-2 lg:mx-0">
              {donateHero.subtitle}
            </p>

            <div className="mt-6 flex flex-col gap-3 sm:mt-4 sm:flex-row sm:flex-wrap sm:justify-center sm:gap-3 lg:justify-start">
              <button
                type="button"
                onClick={() => {
                  setModalProject(null);
                  setIsDonateModalOpen(true);
                }}
                className="group inline-flex w-full items-center justify-center gap-2 rounded-full bg-white px-5 py-3.5 text-sm font-extrabold text-cyan-800 shadow-lg shadow-cyan-950/30 ring-2 ring-white/60 transition hover:-translate-y-0.5 hover:shadow-xl hover:shadow-cyan-950/40 sm:w-auto sm:px-6 sm:py-3"
              >
                <HeartIcon />
                {donateHero.ctaLabel}
                <span className="transition-transform group-hover:translate-x-1">&rarr;</span>
              </button>

              <Link
                href="/emergency-donation"
                className="group inline-flex w-full items-center justify-center gap-2 rounded-full border-2 border-white/80 bg-white px-5 py-3.5 text-sm font-extrabold text-rose-600! transition hover:-translate-y-0.5 hover:bg-rose-50 hover:text-rose-700! sm:w-auto sm:px-6 sm:py-3"
              >
                Emergency Donation
                <span className="transition-transform group-hover:translate-x-1">&rarr;</span>
              </Link>
            </div>
          </div>

          <div className="w-full max-w-xl justify-self-center lg:max-w-none lg:justify-self-auto">
            <HeroSlider />
          </div>
        </div>
      </section>

      <section id="projects" className="mx-auto max-w-7xl px-4 pb-4 pt-12 sm:px-6 sm:pb-6 sm:pt-14 lg:px-4 lg:pb-8 lg:pt-16">
        {projects.length === 0 ? (
          <EmptyState />
        ) : (
          <>
            <div className="sm:hidden">
              <div
                ref={trackRef}
                className="flex snap-x snap-mandatory gap-4 overflow-x-auto scroll-smooth px-1 pb-4 pt-1 scrollbar-none [-ms-overflow-style:none]"
              >
                {projects.map((project) => (
                  <div key={project.id} className="w-[86%] shrink-0 snap-center">
                    <DonateProjectCard
                      project={project}
                      locale={locale}
                      fp={fp}
                      onDonate={(info) => {
                        setModalProject(info);
                        setIsDonateModalOpen(true);
                      }}
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
                      className={`h-2 rounded-full transition-all ${index === activeIndex ? `w-6 bg-linear-to-r ${BRAND_GLOW}` : "w-2 bg-slate-300"}`}
                    />
                  ))}
                </div>
              ) : null}
            </div>

            <div
              className="relative hidden sm:block"
              onMouseEnter={() => setIsHovering(true)}
              onMouseLeave={() => setIsHovering(false)}
            >
              <div className="overflow-hidden rounded-[2rem] bg-white px-2 py-2">
                <div
                  className="flex transition-transform duration-700 ease-out"
                  style={{ transform: `translateX(-${desktopIndex * (100 / visibleCount)}%)` }}
                >
                  {projects.map((project) => (
                    <div key={project.id} className="w-1/3 shrink-0 px-2">
                      <DonateProjectCard
                        project={project}
                        locale={locale}
                        fp={fp}
                        onDonate={(info) => {
                          setModalProject(info);
                          setIsDonateModalOpen(true);
                        }}
                      />
                    </div>
                  ))}
                </div>
              </div>

              {maxDesktopIndex > 0 ? (
                <div className="mt-6 flex items-center justify-center gap-2.5">
                  {Array.from({ length: maxDesktopIndex + 1 }).map((_, index) => (
                    <button
                      key={index}
                      type="button"
                      aria-label={`Show slide ${index + 1}`}
                      onClick={() => setDesktopIndex(index)}
                      className={`h-2.5 rounded-full transition-all duration-300 ${index === desktopIndex ? `w-8 bg-linear-to-r ${BRAND_GLOW}` : "w-2.5 bg-slate-300 hover:bg-slate-400"}`}
                    />
                  ))}
                </div>
              ) : null}
            </div>
          </>
        )}
      </section>

      <div className="-mt-2 sm:-mt-4">
        <QardHasanahBanner onCtaClick={() => setIsDonateModalOpen(true)} />
      </div>

      <DonateBankInfoModal
        isOpen={isDonateModalOpen}
        project={modalProject?.title ?? null}
        projectId={modalProject?.id}
        onClose={() => setIsDonateModalOpen(false)}
      />
    </div>
  );
}
