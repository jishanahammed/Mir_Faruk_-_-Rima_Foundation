"use client";

import { useEffect, useState } from "react";
import { useSiteLocale } from "@/components/public/providers/locale-provider";

function pick(en, bn, dk, locale) {
  if (locale === "BN") return bn || en;
  if (locale === "DK") return dk || en;
  return en;
}

function fmtDate(d) {
  if (!d) return null;
  try {
    return new Date(d).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" });
  } catch { return null; }
}

const BlogIcon = (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="h-5 w-5">
    <path d="M4 6h16M4 11h16M4 16h10" strokeLinecap="round" />
  </svg>
);

const ImagePlaceholderIcon = (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="h-8 w-8">
    <rect x="3" y="3" width="18" height="18" rx="2" />
    <circle cx="8.5" cy="8.5" r="1.5" />
    <path d="M21 15l-5-5L5 21" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

function BlogCard({ blog, locale, onOpen }) {
  const title = pick(blog.titleEn, blog.titleBn, blog.titleDk, locale);
  const shortDesc = pick(blog.shortDescriptionEn, blog.shortDescriptionBn, blog.shortDescriptionDk, locale);
  const date = fmtDate(blog.createdAt);
  const galleryCount = blog.galleryImages?.length ?? 0;

  return (
    <button
      type="button"
      onClick={() => onOpen(blog)}
      className="group relative flex flex-col overflow-hidden rounded-3xl border border-slate-200 bg-white text-left shadow-sm transition-all duration-300 hover:-translate-y-1.5 hover:border-cyan-200 hover:shadow-xl hover:shadow-cyan-900/10"
    >
      <div className="relative aspect-16/10 w-full overflow-hidden bg-slate-100">
        {blog.coverImage ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={blog.coverImage}
            alt={title}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-[linear-gradient(135deg,#f1f5f9,#e2e8f0)] text-slate-300">
            {ImagePlaceholderIcon}
          </div>
        )}
        <div className="pointer-events-none absolute inset-0 bg-linear-to-t from-slate-950/70 via-slate-950/0 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

        {date && (
          <span className="absolute left-3 top-3 rounded-full bg-white/95 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-slate-600 shadow-sm backdrop-blur">
            {date}
          </span>
        )}
        {galleryCount > 0 && (
          <span className="absolute right-3 top-3 flex items-center gap-1 rounded-full bg-black/55 px-2.5 py-1 text-[10px] font-bold text-white backdrop-blur">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-3 w-3">
              <rect x="3" y="3" width="18" height="18" rx="2" />
              <circle cx="8.5" cy="8.5" r="1.5" />
              <path d="M21 15l-5-5L5 21" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            {galleryCount}
          </span>
        )}

        <span className="absolute bottom-3 right-3 flex translate-y-2 items-center gap-1 rounded-full bg-white px-3 py-1.5 text-[11px] font-bold text-cyan-700 opacity-0 shadow-md transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100">
          Read more
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="h-3 w-3">
            <path d="M5 12h14M13 6l6 6-6 6" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </span>
      </div>

      <div className="flex flex-1 flex-col gap-2 p-5">
        <h3 className="text-base font-extrabold leading-snug text-slate-900 transition-colors group-hover:text-cyan-700 line-clamp-2">
          {title}
        </h3>
        {shortDesc && (
          <p className="text-sm leading-relaxed text-slate-500 line-clamp-3">{shortDesc}</p>
        )}
      </div>

      <span className="absolute inset-x-0 bottom-0 h-1 origin-left scale-x-0 bg-[linear-gradient(90deg,#0f766e,#0891b2)] transition-transform duration-300 group-hover:scale-x-100" />
    </button>
  );
}

function BlogModal({ blog, locale, onClose }) {
  useEffect(() => {
    if (!blog) return;
    const handleKeyDown = (e) => { if (e.key === "Escape") onClose(); };
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [blog, onClose]);

  if (!blog) return null;

  const title = pick(blog.titleEn, blog.titleBn, blog.titleDk, locale);
  const description = pick(blog.descriptionEn, blog.descriptionBn, blog.descriptionDk, locale);
  const shortDesc = pick(blog.shortDescriptionEn, blog.shortDescriptionBn, blog.shortDescriptionDk, locale);
  const date = fmtDate(blog.createdAt);

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center bg-slate-950/60 px-4 py-4 backdrop-blur-sm sm:items-center sm:py-8"
      role="dialog"
      aria-modal="true"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="relative flex max-h-[92vh] w-full max-w-2xl flex-col overflow-hidden rounded-3xl border border-white/70 bg-white shadow-2xl shadow-slate-950/40">
        {blog.coverImage ? (
          <div className="relative aspect-video w-full shrink-0 overflow-hidden bg-slate-100">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={blog.coverImage} alt={title} className="h-full w-full object-cover" />
            <div className="absolute inset-0 bg-linear-to-t from-slate-950/80 via-slate-950/10 to-transparent" />
            <button
              type="button"
              onClick={onClose}
              className="absolute right-4 top-4 flex h-9 w-9 items-center justify-center rounded-full bg-white/20 text-lg leading-none text-white backdrop-blur-sm transition hover:bg-white/30"
            >
              x
            </button>
            <div className="absolute inset-x-0 bottom-0 p-5 sm:p-7">
              {date && (
                <p className="text-[11px] font-bold uppercase tracking-wider text-cyan-200">{date}</p>
              )}
              <h2 className="mt-1 text-lg font-extrabold leading-tight text-white sm:text-2xl">{title}</h2>
            </div>
          </div>
        ) : (
          <div className="flex items-start justify-between gap-4 bg-[linear-gradient(135deg,#0f172a,#155e75_52%,#0f766e)] px-5 py-5 sm:px-7">
            <div className="min-w-0">
              {date && <p className="text-[11px] font-bold uppercase tracking-wider text-cyan-200">{date}</p>}
              <h2 className="mt-1 text-lg font-extrabold text-white sm:text-2xl">{title}</h2>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-white/15 text-lg leading-none text-white transition hover:bg-white/25"
            >
              x
            </button>
          </div>
        )}

        <div className="min-h-0 flex-1 overflow-y-auto px-5 py-6 sm:px-7">
          {shortDesc && (
            <p className="mb-4 whitespace-pre-line text-base font-semibold leading-relaxed text-slate-800">{shortDesc}</p>
          )}

          {description && (
            <p className="whitespace-pre-line text-sm leading-relaxed text-slate-600">{description}</p>
          )}

          {blog.galleryImages.length > 0 && (
            <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3">
              {blog.galleryImages.map((img) => (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  key={img.id}
                  src={img.imageUrl}
                  alt={title}
                  className="aspect-square w-full rounded-xl object-cover shadow-sm transition hover:scale-[1.03]"
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export function ProjectBlogSection({ blogs }) {
  const { locale } = useSiteLocale();
  const [activeBlog, setActiveBlog] = useState(null);

  if (!blogs || blogs.length === 0) return null;

  return (
    <section className="relative overflow-hidden rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
      <div className="pointer-events-none absolute -right-16 -top-16 h-56 w-56 rounded-full bg-cyan-100/50 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-20 -left-10 h-56 w-56 rounded-full bg-teal-100/40 blur-3xl" />

      <div className="relative flex flex-wrap items-end justify-between gap-3 border-b border-slate-100 pb-5">
        <div>
          <p className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-cyan-700">
            <span className="flex h-7 w-7 items-center justify-center rounded-full bg-cyan-50">{BlogIcon}</span>
            Project Blog
          </p>
          <h2 className="mt-2 text-xl font-extrabold text-slate-950 sm:text-2xl">Updates &amp; Stories</h2>
        </div>
        <span className="rounded-full border border-cyan-200 bg-cyan-50 px-3 py-1 text-xs font-bold text-cyan-700">
          {blogs.length} post{blogs.length !== 1 ? "s" : ""}
        </span>
      </div>

      <div className="relative mt-6 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {blogs.map((blog) => (
          <BlogCard key={blog.id} blog={blog} locale={locale} onOpen={setActiveBlog} />
        ))}
      </div>

      <BlogModal blog={activeBlog} locale={locale} onClose={() => setActiveBlog(null)} />
    </section>
  );
}
