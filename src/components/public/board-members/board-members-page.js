"use client";

import { useSiteLocale } from "@/components/public/providers/locale-provider";

function pick(en, bn, dk, locale) {
  if (locale === "BN") return bn || en;
  if (locale === "DK") return dk || en;
  return en;
}

function AvatarPlaceholder({ name }) {
  const initials = name
    .split(" ")
    .slice(0, 2)
    .map((w) => w[0] ?? "")
    .join("")
    .toUpperCase();

  return (
    <div className="flex h-full w-full items-center justify-center bg-linear-to-br from-cyan-100 to-cyan-200 text-2xl font-bold text-cyan-700">
      {initials || "?"}
    </div>
  );
}

function MemberCard({ member, locale }) {
  const name = pick(member.nameEn, member.nameBn, member.nameDk, locale);
  const designation = pick(
    member.designationEn,
    member.designationBn,
    member.designationDk,
    locale,
  );
  const organization = pick(
    member.organizationNameEn,
    member.organizationNameBn,
    member.organizationNameDk,
    locale,
  );
  const responsibility = pick(
    member.responsibilityNoteEn,
    member.responsibilityNoteBn,
    member.responsibilityNoteDk,
    locale,
  );

  return (
    <div className="group relative flex flex-col overflow-hidden rounded-3xl border border-slate-100 bg-white shadow-sm shadow-slate-900/5 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-slate-900/10">
      {/* Image */}
      <div className="relative h-64 w-full overflow-hidden bg-cyan-50">
        {member.profileImageAbsoluteUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={member.profileImageAbsoluteUrl}
            alt={name}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <AvatarPlaceholder name={name} />
        )}
        {/* Serial badge */}
        <div className="absolute left-4 top-4 flex h-8 w-8 items-center justify-center rounded-full bg-white/90 text-xs font-bold text-cyan-700 shadow-md backdrop-blur-sm">
          {member.serialNo}
        </div>
      </div>

      {/* Content */}
      <div className="flex flex-1 flex-col gap-3 p-6">
        <div>
          <h3 className="text-lg font-bold leading-snug text-slate-900">{name}</h3>
          {designation && (
            <p className="mt-1 text-sm font-semibold text-cyan-700">{designation}</p>
          )}
        </div>

        {organization && (
          <div className="flex items-start gap-2">
            <span className="mt-0.5 shrink-0">
              <svg
                viewBox="0 0 20 20"
                fill="currentColor"
                className="h-4 w-4 text-slate-400"
              >
                <path
                  fillRule="evenodd"
                  d="M4 4a2 2 0 012-2h8a2 2 0 012 2v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4zm3 1h6v4H7V5zm0 6h2v2H7v-2zm4 0h2v2h-2v-2z"
                  clipRule="evenodd"
                />
              </svg>
            </span>
            <p className="text-sm text-slate-600">{organization}</p>
          </div>
        )}

        {responsibility && (
          <div className="mt-auto rounded-2xl bg-slate-50 px-4 py-3">
            <p className="text-xs leading-relaxed text-slate-500">{responsibility}</p>
          </div>
        )}
      </div>
    </div>
  );
}

export function BoardMembersPage({ members }) {
  const { copy, locale } = useSiteLocale();
  const t = copy.boardMembers;

  return (
    <main className="min-h-screen bg-linear-to-b from-slate-50 to-white">
      {/* Hero */}
      <section className="relative overflow-hidden border-b border-slate-100 bg-white pb-16 pt-32">
        {/* Decorative circles */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -right-32 -top-32 h-96 w-96 rounded-full bg-cyan-50 opacity-60"
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -left-20 top-24 h-64 w-64 rounded-full bg-cyan-50 opacity-40"
        />

        <div className="relative mx-auto max-w-3xl px-4 text-center sm:px-6 lg:px-8">
          <span className="inline-block rounded-full bg-cyan-50 px-4 py-1.5 text-xs font-semibold tracking-widest text-cyan-700 uppercase">
            {t.eyebrow}
          </span>
          <h1 className="mt-4 text-4xl font-extrabold tracking-tight text-slate-900 sm:text-5xl">
            {t.title}
          </h1>
          <p className="mt-5 text-base leading-relaxed text-slate-500 sm:text-lg">
            {t.description}
          </p>

          {/* Accent line */}
          <div
            aria-hidden="true"
            className="mx-auto mt-8 h-1 w-16 rounded-full bg-linear-to-r from-cyan-400 to-cyan-600"
          />
        </div>
      </section>

      {/* Members grid */}
      <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
        {members.length === 0 ? (
          <div className="flex flex-col items-center justify-center gap-4 py-32 text-center">
            <div className="flex h-20 w-20 items-center justify-center rounded-full bg-slate-100">
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                className="h-10 w-10 text-slate-400"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z"
                />
              </svg>
            </div>
            <p className="text-base font-medium text-slate-500">{t.emptyLabel}</p>
          </div>
        ) : (
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {members.map((member) => (
              <MemberCard key={member.id} member={member} locale={locale} />
            ))}
          </div>
        )}
      </section>
    </main>
  );
}
