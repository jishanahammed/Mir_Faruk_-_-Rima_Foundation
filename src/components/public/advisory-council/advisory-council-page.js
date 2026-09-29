"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { useSiteLocale } from "@/components/public/providers/locale-provider";

function MemberPortrait({ member }) {
  const imageRef = useRef(null);
  const [imageLoaded, setImageLoaded] = useState(false);
  const initials = member.name.split(/\s+/).slice(0, 2).map((part) => part[0]).join("").toUpperCase();

  useEffect(() => {
    if (imageRef.current?.complete) {
      setImageLoaded(imageRef.current.naturalWidth > 0);
    }
  }, [member.imageUrl]);

  return (
    <div className="relative h-full w-full">
      <div className="flex h-full w-full items-center justify-center bg-[linear-gradient(145deg,#f7faf9,#e6f3f3_60%,#dcecf8)] text-5xl font-semibold tracking-tight text-[#14264f]">
        {initials || "?"}
      </div>
      {member.imageUrl && (
        // Images are served through the local asset proxy.
        // eslint-disable-next-line @next/next/no-img-element
        <img
          ref={imageRef}
          src={member.imageUrl}
          alt=""
          loading="lazy"
          onLoad={() => setImageLoaded(true)}
          onError={() => setImageLoaded(false)}
          className={`absolute inset-0 h-full w-full object-cover object-top transition duration-700 group-hover:scale-105 ${imageLoaded ? "opacity-100" : "opacity-0"}`}
        />
      )}
    </div>
  );
}




function MemberCard({ member }) {
  return (
    <article className="group grid h-full min-w-0 grid-cols-1 grid-rows-[auto_auto_1fr] overflow-hidden rounded-[2rem] border border-slate-200 bg-white px-6 pb-8 pt-7 text-center shadow-[0_18px_48px_rgba(15,23,42,0.09)] transition duration-300 hover:-translate-y-1 hover:border-cyan-200 hover:shadow-[0_24px_60px_rgba(8,96,112,0.12)] sm:px-7 sm:pt-8">
      <div className="relative row-start-1 mx-auto h-52 w-52 min-w-0 overflow-hidden rounded-full bg-[conic-gradient(from_180deg,#b68d2d,#14264f_42%,#14264f_75%,#b68d2d)] p-[2px] sm:h-56 sm:w-56">
        <div className="relative h-full w-full overflow-hidden rounded-full bg-white">
          <MemberPortrait member={member} />
        </div>
      </div>

      <div className="row-start-2 mt-5 flex min-w-0 flex-col">
        <h3 className="break-words text-2xl font-bold leading-tight tracking-tight text-[#14264f]">{member.name}</h3>
        {member.designation && (
          <p className="mt-3 min-w-0 text-sm font-bold leading-6 text-slate-700">{member.designation}</p>
        )}
      </div>

      <div className="row-start-3 min-w-0 pt-6">
        {member.objective && (
          <p className="whitespace-pre-line break-words text-sm font-normal leading-7 text-[#14264f]">{member.objective}</p>
        )}
        {member.description && <p className="mt-5 whitespace-pre-line break-words text-sm font-normal leading-7 text-slate-600">{member.description}</p>}
      </div>
    </article>
  );
}

function NoticePanel({ title, description, aboutLabel }) {
  return (
    <div role="status" className="grid overflow-hidden rounded-[2rem] border border-slate-200 bg-white shadow-[0_18px_48px_rgba(15,23,42,0.05)] md:grid-cols-[14rem_1fr]">
      <div className="relative flex min-h-44 items-center justify-center overflow-hidden bg-[linear-gradient(145deg,#0c3340,#0e817f)]">
        <div className="absolute h-44 w-44 rounded-full border border-white/20" aria-hidden="true" />
        <div className="absolute h-32 w-32 rounded-full border border-white/20" aria-hidden="true" />
        <svg viewBox="0 0 64 64" fill="none" className="relative h-16 w-16 text-cyan-100" aria-hidden="true">
          <path d="M12 49C23 35 32 41 38 25C41 18 48 16 54 13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          <circle cx="12" cy="49" r="4" fill="currentColor" />
          <circle cx="38" cy="25" r="4" fill="currentColor" />
          <circle cx="54" cy="13" r="4" fill="currentColor" />
        </svg>
      </div>
      <div className="flex flex-col items-start justify-center px-7 py-9 sm:px-10">
        <h3 className="text-xl font-semibold tracking-tight text-slate-950 sm:text-2xl">{title}</h3>
        <p className="mt-3 max-w-xl text-sm leading-7 text-slate-600">{description}</p>
        <Link href="/about" className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-teal-700 underline decoration-teal-300 underline-offset-4 transition hover:text-teal-900">
          {aboutLabel} <span aria-hidden="true">↗</span>
        </Link>
      </div>
    </div>
  );
}

export function AdvisoryCouncilPage({ members, loadError }) {
  const { copy } = useSiteLocale();
  const t = copy.advisoryCouncil;

  return (
    <div className="min-h-screen bg-[#f8fbfa]">
      <section className="border-b border-cyan-100 bg-[radial-gradient(circle_at_100%_0%,#dff4f2_0%,#f7fcfb_48%,#ffffff_100%)] px-4 pb-10 pt-6 sm:px-6 sm:pb-14 sm:pt-8 lg:px-8 lg:pb-16">
        <div className="mx-auto max-w-7xl">
          <nav aria-label={t.breadcrumbLabel} className="flex items-center gap-2 text-sm font-medium text-slate-500">
            <Link href="/about" className="transition hover:text-teal-700">{copy.header.about.menuLabel}</Link>
            <span className="text-slate-300" aria-hidden="true">/</span>
            <span className="text-teal-800">{t.title}</span>
          </nav>

          <div className="mt-8 max-w-3xl sm:mt-10">
            <div className="inline-flex items-center gap-3 text-xs font-bold uppercase tracking-[0.22em] text-teal-700">
              <span className="h-px w-9 bg-teal-500" aria-hidden="true" />
              {t.eyebrow}
            </div>
            <h1 className="mt-4 text-4xl font-semibold leading-[1.08] tracking-[-0.04em] text-slate-950 sm:text-5xl lg:text-[3.75rem]">{t.title}</h1>
            <p className="mt-4 max-w-2xl border-l-[3px] border-cyan-400 pl-4 text-base leading-7 text-slate-600 sm:text-lg sm:leading-8">{t.description}</p>
          </div>
        </div>
      </section>

      <section className="bg-white/70 px-4 py-12 sm:px-6 sm:py-16 lg:px-8 lg:py-20">
        <div className="mx-auto max-w-7xl">
          <div className="mb-8 border-b border-slate-200 pb-6 sm:mb-10">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-teal-700">{t.sectionEyebrow}</p>
              <h2 className="mt-3 text-3xl font-semibold tracking-tight text-slate-950 sm:text-4xl">{t.sectionTitle}</h2>
            </div>
          </div>

          {loadError ? (
            <NoticePanel title={t.errorTitle} description={t.errorDescription} aboutLabel={copy.header.about.menuLabel} />
          ) : members.length === 0 ? (
            <NoticePanel title={t.emptyTitle} description={t.emptyDescription} aboutLabel={copy.header.about.menuLabel} />
          ) : (
            <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3 xl:gap-8">
              {members.map((member) => <MemberCard key={member.id} member={member} />)}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
