"use client";

import Link from "next/link";
import { useState } from "react";
import { useSiteLocale } from "@/components/public/providers/locale-provider";

function pick(en, bn, dk, locale) {
  const preferred = locale === "BN" ? bn : locale === "DK" ? dk : en;
  return [preferred, en, bn, dk].find((value) => String(value ?? "").trim()) || "";
}

function PeopleIcon({ className = "h-6 w-6" }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className={className} aria-hidden="true">
      <circle cx="9" cy="8" r="3" />
      <path d="M3 20v-2a6 6 0 0 1 12 0v2M16 5a3 3 0 0 1 0 6m2 3a5 5 0 0 1 3 4v2" strokeLinecap="round" />
    </svg>
  );
}

function MemberPortrait({ name, imageUrl }) {
  const [imageFailed, setImageFailed] = useState(false);
  const initials = String(name).trim().split(/\s+/).slice(0, 2).map((word) => Array.from(word)[0] || "").join("").toUpperCase();

  return (
    <div className="relative aspect-square h-full w-full overflow-hidden rounded-full bg-[#e2f1ef]">
      <div className="flex h-full w-full items-center justify-center bg-[linear-gradient(145deg,#e9f6f3,#dbeaf5)] text-6xl font-semibold text-[#163b4a]">
        {initials || <PeopleIcon className="h-14 w-14" />}
      </div>
      {imageUrl && !imageFailed && (
        // Member photos are served through the existing local asset proxy.
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={imageUrl}
          alt=""
          loading="lazy"
          decoding="async"
          width={208}
          height={208}
          onError={() => setImageFailed(true)}
          // Keep one crop position and scale; hover must not change the framing.
          className="absolute inset-0 h-full w-full object-cover object-[50%_35%]"
        />
      )}
    </div>
  );
}

function MemberCard({ member, locale, t, index, numberFormat }) {
  const name = pick(member.nameEn, member.nameBn, member.nameDk, locale) || t.memberLabel;
  const designation = pick(member.designationEn, member.designationBn, member.designationDk, locale);
  const organization = pick(member.organizationNameEn, member.organizationNameBn, member.organizationNameDk, locale);
  const responsibility = pick(member.responsibilityNoteEn, member.responsibilityNoteBn, member.responsibilityNoteDk, locale);

  return (
    <article className="group relative flex min-w-0 flex-col overflow-hidden rounded-[1.75rem] border border-slate-200/80 bg-white shadow-[0_8px_30px_-16px_rgba(15,55,65,0.18)] motion-safe:transition-all motion-safe:duration-300 hover:border-teal-200 hover:shadow-[0_20px_55px_-18px_rgba(15,90,95,0.22)] motion-safe:hover:-translate-y-1">
      <div aria-hidden="true" className="absolute inset-x-0 top-0 h-36 bg-[radial-gradient(ellipse_at_top_right,#d9efed,transparent_70%),linear-gradient(120deg,#f1f8f7,#f6f9fc)]" />
      <div className="relative flex items-center justify-between px-6 pt-5">
        <span aria-hidden="true" className="h-1 w-8 rounded-full bg-teal-600/60" />
        <span className="text-xs font-medium tabular-nums tracking-widest text-slate-400">
          <span className="sr-only">{t.serialNo} </span>
          {numberFormat.format(member.serialNo > 0 ? member.serialNo : index + 1)}
        </span>
      </div>

      <div className="relative mx-auto mt-3 h-52 w-52 shrink-0 rounded-full bg-white p-2 shadow-[0_8px_28px_rgba(15,65,75,0.12)] ring-1 ring-teal-900/5">
        <div className="h-full w-full rounded-full border border-teal-100 p-1">
          <MemberPortrait key={member.profileImageAbsoluteUrl || "placeholder"} name={name} imageUrl={member.profileImageAbsoluteUrl} />
        </div>
      </div>

      <div className="relative flex flex-1 flex-col px-6 pb-7 pt-6 text-center sm:px-7">
        <h3 className="break-words text-xl font-bold leading-snug tracking-tight text-[#142f46] sm:text-2xl">{name}</h3>
        <p className="mt-3 self-center rounded-full bg-teal-50 px-4 py-1.5 text-sm font-semibold leading-6 text-teal-800">
          {designation || t.memberLabel}
        </p>

        {organization && (
          <div className="mt-5 flex items-start justify-center gap-2 text-slate-500">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="mt-0.5 h-4 w-4 shrink-0 text-teal-600" aria-hidden="true">
              <path d="M4 21V5a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v16M2 21h20M9 21v-4h6v4M8 7h2m4 0h2M8 11h2m4 0h2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            <p className="break-words text-sm leading-6"><span className="sr-only">{t.organizationLabel}: </span>{organization}</p>
          </div>
        )}

        {responsibility && (
          <div className="mt-auto pt-6 text-left">
            <div className="rounded-2xl border border-slate-100 bg-[#f7faf9] p-4">
              <p className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-widest text-teal-700">
                <span aria-hidden="true" className="h-1.5 w-1.5 rounded-full bg-teal-500" />
                {t.responsibilityLabel}
              </p>
              <p className="mt-2 whitespace-pre-line break-words text-sm leading-7 text-slate-600">{responsibility}</p>
            </div>
          </div>
        )}
      </div>
    </article>
  );
}

export function BoardMembersPage({ members = [], loadError = false }) {
  const { copy, locale } = useSiteLocale();
  const t = copy.boardMembers;
  const boardMembers = Array.isArray(members) ? members.filter(Boolean) : [];
  const numberFormat = new Intl.NumberFormat(locale === "BN" ? "bn-BD" : locale === "DK" ? "da-DK" : "en", { minimumIntegerDigits: 2 });
  const memberCount = new Intl.NumberFormat(locale === "BN" ? "bn-BD" : locale === "DK" ? "da-DK" : "en").format(boardMembers.length);

  return (
    <div className="min-h-screen bg-[#f7faf9]">
      <section className="relative isolate overflow-hidden border-b border-teal-100 bg-[#edf7f5] px-4 pb-12 pt-6 sm:px-6 sm:pb-16 sm:pt-8 lg:px-8">
        <div aria-hidden="true" className="pointer-events-none absolute -right-24 -top-48 -z-10 h-[38rem] w-[38rem] rounded-full border border-teal-200/50 bg-[radial-gradient(circle,#d6eeea,transparent_70%)]" />
        <div className="mx-auto max-w-7xl">
          <nav aria-label={t.breadcrumbLabel} className="flex flex-wrap items-center gap-2 text-sm text-slate-500">
            <Link href="/about" className="rounded-sm transition hover:text-teal-800 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-teal-600">{copy.header.about.menuLabel}</Link>
            <span aria-hidden="true" className="text-teal-700/40">/</span>
            <span aria-current="page" className="font-medium text-teal-800">{t.title}</span>
          </nav>

          <div className="mt-10 grid items-center gap-10 sm:mt-12 lg:grid-cols-[1.3fr_0.7fr] lg:gap-16">
            <div>
              <p className="flex items-center gap-3 text-xs font-bold uppercase tracking-[0.2em] text-teal-700">
                <span aria-hidden="true" className="h-px w-8 bg-teal-600" />{t.eyebrow}
              </p>
              <h1 className="mt-5 break-words text-4xl font-bold leading-tight tracking-tight text-[#142f46] sm:text-5xl lg:text-6xl">{t.title}</h1>
              <p className="mt-5 max-w-2xl text-base leading-8 text-slate-600 sm:text-lg sm:leading-8">{t.description}</p>
            </div>

            <div className="relative overflow-hidden rounded-[1.75rem] bg-[#123d46] p-7 text-white shadow-[0_16px_40px_-12px_rgba(18,61,70,0.25)] sm:p-8">
              <div aria-hidden="true" className="absolute -right-14 -top-14 h-48 w-48 rounded-full border border-white/10" />
              <div aria-hidden="true" className="absolute -right-5 -top-5 h-30 w-30 rounded-full border border-white/10" />
              <div className="relative">
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl border border-white/15 bg-white/10 text-teal-200"><PeopleIcon /></div>
                <p className="mt-5 max-w-xs text-2xl font-semibold leading-snug tracking-tight sm:text-3xl">{t.purposeTitle}</p>
                <p className="mt-3 text-sm leading-7 text-teal-100/75">{t.purposeDescription}</p>
                {!loadError && boardMembers.length > 0 && (
                  <div className="mt-6 flex items-center gap-4 border-t border-white/15 pt-5">
                    <div aria-hidden="true" className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-white/15 bg-white/10 text-teal-200"><PeopleIcon /></div>
                    <p className="text-sm font-medium text-teal-50"><span className="font-bold text-white">{memberCount}</span> {boardMembers.length === 1 ? t.memberSingular : t.memberPlural}</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section aria-labelledby="board-members-heading" className="mx-auto max-w-7xl px-4 py-12 sm:px-6 sm:py-16 lg:px-8 lg:py-20">
        <div className="mb-8 flex flex-wrap items-end justify-between gap-4 sm:mb-10">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-teal-700">{t.sectionEyebrow}</p>
            <h2 id="board-members-heading" className="mt-3 text-2xl font-bold tracking-tight text-[#142f46] sm:text-3xl">{t.sectionTitle}</h2>
          </div>
          {!loadError && boardMembers.length > 0 && <span className="flex items-center gap-2 rounded-full border border-teal-100 bg-white px-4 py-2 text-sm font-medium text-teal-800"><PeopleIcon className="h-4 w-4" />{memberCount} {boardMembers.length === 1 ? t.memberSingular : t.memberPlural}</span>}
        </div>

        {loadError || boardMembers.length === 0 ? (
          <div role="status" className="flex flex-col items-center rounded-[1.75rem] border border-dashed border-teal-200 bg-white px-6 py-16 text-center sm:py-20">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-teal-50 text-teal-700"><PeopleIcon className="h-8 w-8" /></div>
            <h3 className="mt-5 text-xl font-semibold text-[#142f46]">{loadError ? t.errorTitle : t.emptyLabel}</h3>
            <p className="mt-3 max-w-md text-sm leading-7 text-slate-500">{loadError ? t.errorDescription : t.emptyDescription}</p>
          </div>
        ) : (
          <div className={`grid items-stretch gap-6 lg:gap-8 ${boardMembers.length === 1 ? "mx-auto max-w-md" : boardMembers.length === 2 ? "mx-auto max-w-4xl sm:grid-cols-2" : "sm:grid-cols-2 lg:grid-cols-3"}`}>
            {boardMembers.map((member, index) => <MemberCard key={`${member.id}-${index}`} member={member} locale={locale} t={t} index={index} numberFormat={numberFormat} />)}
          </div>
        )}
      </section>
    </div>
  );
}
