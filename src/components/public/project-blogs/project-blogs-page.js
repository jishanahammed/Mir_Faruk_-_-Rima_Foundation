"use client";

import Link from "next/link";
import { useSiteLocale } from "@/components/public/providers/locale-provider";

function pick(en, bn, dk, locale) {
  if (locale === "BN") return bn || en;
  if (locale === "DK") return dk || en;
  return en;
}

function formatDate(value, locale) {
  if (!value) return null;
  try {
    return new Date(value).toLocaleDateString(locale === "BN" ? "bn-BD" : "en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  } catch {
    return null;
  }
}

function BlogCard({ blog, locale, index, copy }) {
  const title = pick(blog.titleEn, blog.titleBn, blog.titleDk, locale);
  const summary = pick(blog.shortDescriptionEn, blog.shortDescriptionBn, blog.shortDescriptionDk, locale);
  const date = formatDate(blog.createdAt, locale);

  return (
    <Link
      href={`/project-blogs/${blog.id}`}
      className="group relative flex flex-col overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm shadow-slate-900/5 transition-all duration-300 hover:-translate-y-1 hover:border-cyan-200 hover:shadow-xl hover:shadow-cyan-900/10"
      style={{ animationDelay: `${index * 60}ms` }}
    >
      {/* Cover image */}
      <div className="relative aspect-[16/10] w-full overflow-hidden bg-slate-100">
        {blog.coverImage ? (
          <img
            src={blog.coverImage}
            alt={title}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-[linear-gradient(135deg,#0f172a,#155e75_52%,#0f766e)]">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" className="h-10 w-10 text-cyan-200/70" aria-hidden="true">
              <path d="M9 5H7a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-2" strokeLinecap="round" strokeLinejoin="round" />
              <rect x="9" y="3" width="6" height="4" rx="1" />
              <path d="M9 12h6M9 16h4" strokeLinecap="round" />
            </svg>
          </div>
        )}
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-slate-900/50 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

        {blog.projectTitleEn && (
          <span className="absolute left-4 top-4 rounded-full border border-white/30 bg-white/90 px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-cyan-800 backdrop-blur-sm shadow-sm">
            {blog.projectTitleEn}
          </span>
        )}
      </div>

      {/* Content */}
      <div className="flex flex-1 flex-col gap-3 p-6">
        {date && (
          <span className="inline-flex w-fit items-center gap-1.5 text-xs font-semibold uppercase tracking-widest text-cyan-600">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-3.5 w-3.5" aria-hidden="true">
              <rect x="3" y="5" width="18" height="16" rx="2" />
              <path d="M8 3v4M16 3v4M3 10h18" strokeLinecap="round" />
            </svg>
            {date}
          </span>
        )}

        <h3 className="text-lg font-extrabold leading-snug text-slate-900 transition-colors group-hover:text-cyan-700">
          {title}
        </h3>

        {summary && (
          <p className="line-clamp-3 flex-1 text-sm leading-relaxed text-slate-500">
            {summary}
          </p>
        )}

        <span className="mt-1 inline-flex items-center gap-1.5 text-sm font-bold text-cyan-700">
          {copy.readStory}
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-1" aria-hidden="true">
            <path d="M5 12h14M13 6l6 6-6 6" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </span>
      </div>
    </Link>
  );
}

function EmptyState({ copy }) {
  return (
    <div className="flex flex-col items-center justify-center py-24 text-center">
      <div className="flex h-20 w-20 items-center justify-center rounded-3xl bg-cyan-50">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" className="h-10 w-10 text-cyan-400" aria-hidden="true">
          <path d="M9 5H7a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-2" strokeLinecap="round" strokeLinejoin="round" />
          <rect x="9" y="3" width="6" height="4" rx="1" />
          <path d="M9 12h6M9 16h4" strokeLinecap="round" />
        </svg>
      </div>
      <p className="mt-5 text-lg font-bold text-slate-800">{copy.emptyTitle}</p>
      <p className="mt-2 max-w-sm text-sm leading-relaxed text-slate-500">
        {copy.emptyText}
      </p>
    </div>
  );
}

export function ProjectBlogsPage({ blogs = [] }) {
  const { locale, copy: siteCopy } = useSiteLocale();
  const copy = siteCopy.projectBlogs;

  return (
    <div className="min-h-screen bg-white">
      {/* Hero header */}
      <section className="relative overflow-hidden bg-[linear-gradient(135deg,#0f172a,#155e75_52%,#0f766e)] px-4 py-16 sm:px-6 lg:px-8">
        <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
          <div className="absolute -top-32 -right-32 h-96 w-96 rounded-full border border-cyan-500/20" />
          <div className="absolute -top-16 -right-16 h-64 w-64 rounded-full border border-cyan-400/15" />
          <div className="absolute bottom-0 left-0 h-64 w-64 -translate-x-1/2 translate-y-1/2 rounded-full border border-cyan-600/20" />
        </div>
        <div className="relative mx-auto max-w-4xl text-center">
          <span className="inline-block rounded-full border border-cyan-400/30 bg-cyan-400/10 px-4 py-1.5 text-xs font-bold uppercase tracking-widest text-cyan-300">
            {copy.eyebrow}
          </span>
          <h1 className="mt-5 text-4xl font-extrabold leading-tight text-white sm:text-5xl">
            {copy.heroTitle}
          </h1>
          <p className="mx-auto mt-5 max-w-2xl text-base leading-relaxed text-cyan-100/80">
            {copy.heroSubtitle}
          </p>
        </div>
      </section>

      {/* Blog grid */}
      <section className="mx-auto max-w-6xl px-4 py-14 sm:px-6 lg:px-8">
        {blogs.length === 0 ? (
          <EmptyState copy={copy} />
        ) : (
          <>
            <div className="mb-3 text-center">
              <span className="inline-flex items-center gap-2 rounded-full border border-cyan-200 bg-cyan-50 px-4 py-1.5 text-xs font-bold uppercase tracking-widest text-cyan-700">
                {blogs.length} {blogs.length === 1 ? copy.storiesLabel : copy.storiesLabelPlural}
              </span>
            </div>
            <div className="mb-10 flex justify-center">
              <span className="h-px w-16 bg-slate-200" />
            </div>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {blogs.map((blog, idx) => (
                <BlogCard key={blog.id} blog={blog} locale={locale} index={idx} copy={copy} />
              ))}
            </div>
          </>
        )}
      </section>
    </div>
  );
}
