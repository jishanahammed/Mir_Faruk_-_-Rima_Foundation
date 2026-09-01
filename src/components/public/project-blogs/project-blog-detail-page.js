"use client";

import { useEffect, useState } from "react";
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
      month: "long",
      day: "numeric",
    });
  } catch {
    return null;
  }
}

function FullscreenViewer({ images, index, title, onClose, onNavigate }) {
  useEffect(() => {
    function handleKey(e) {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowRight") onNavigate((index + 1) % images.length);
      if (e.key === "ArrowLeft") onNavigate((index - 1 + images.length) % images.length);
    }
    document.addEventListener("keydown", handleKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", handleKey);
      document.body.style.overflow = "";
    };
  }, [index, images.length, onClose, onNavigate]);

  const image = images[index];
  if (!image) return null;

  return (
    <div
      className="fixed inset-0 z-[100] flex flex-col bg-slate-950/95 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      onClick={onClose}
    >
      {/* Top bar */}
      <div className="flex items-center justify-between px-4 py-4 sm:px-6" onClick={(e) => e.stopPropagation()}>
        <span className="text-sm font-semibold text-white/80">
          {index + 1} / {images.length}
        </span>
        <button
          type="button"
          onClick={onClose}
          aria-label="Close"
          className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white transition hover:bg-white/20"
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="h-5 w-5">
            <path d="M6 6l12 12M18 6L6 18" strokeLinecap="round" />
          </svg>
        </button>
      </div>

      {/* Image stage */}
      <div className="relative flex flex-1 items-center justify-center px-4 pb-4 sm:px-10">
        {images.length > 1 && (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onNavigate((index - 1 + images.length) % images.length);
            }}
            aria-label="Previous image"
            className="absolute left-1 top-1/2 z-10 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-white/10 text-white transition hover:bg-white/20 sm:left-4 sm:h-12 sm:w-12"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="h-5 w-5 sm:h-6 sm:w-6">
              <path d="M15 6l-6 6 6 6" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
        )}

        <img
          src={image.imageUrl}
          alt={`${title} — ${index + 1}`}
          className="max-h-full max-w-full rounded-lg object-contain shadow-2xl"
          onClick={(e) => e.stopPropagation()}
        />

        {images.length > 1 && (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onNavigate((index + 1) % images.length);
            }}
            aria-label="Next image"
            className="absolute right-1 top-1/2 z-10 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-white/10 text-white transition hover:bg-white/20 sm:right-4 sm:h-12 sm:w-12"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="h-5 w-5 sm:h-6 sm:w-6">
              <path d="M9 6l6 6-6 6" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
        )}
      </div>

      {/* Thumbnail strip */}
      {images.length > 1 && (
        <div
          className="flex justify-center gap-2 overflow-x-auto px-4 pb-5"
          onClick={(e) => e.stopPropagation()}
        >
          {images.map((img, i) => (
            <button
              key={img.id ?? i}
              type="button"
              onClick={() => onNavigate(i)}
              className={`h-12 w-16 shrink-0 overflow-hidden rounded-lg border-2 transition sm:h-14 sm:w-20 ${
                i === index ? "border-cyan-400" : "border-transparent opacity-50 hover:opacity-90"
              }`}
            >
              <img src={img.imageUrl} alt={`Thumb ${i + 1}`} className="h-full w-full object-cover" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

function GallerySection({ images, title, copy }) {
  const [viewerIndex, setViewerIndex] = useState(null);
  if (!images.length) return null;

  return (
    <div className="mt-8 sm:mt-10">
      <div className="mb-4 flex items-center gap-3">
        <h2 className="text-base font-extrabold text-slate-900 sm:text-lg">{copy.galleryTitle}</h2>
        <span className="h-px flex-1 bg-slate-200" />
        <span className="text-xs font-semibold text-slate-400">{images.length}</span>
      </div>

      <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-3 sm:gap-3">
        {images.map((img, i) => (
          <button
            key={img.id ?? i}
            type="button"
            onClick={() => setViewerIndex(i)}
            className="group relative aspect-square overflow-hidden rounded-xl border border-slate-200 bg-slate-100 shadow-sm transition hover:shadow-md sm:rounded-2xl"
          >
            <img
              src={img.imageUrl}
              alt={`${title} — ${i + 1}`}
              className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
            />
            <div className="absolute inset-0 flex items-center justify-center bg-slate-900/0 opacity-0 transition-all duration-200 group-hover:bg-slate-900/30 group-hover:opacity-100">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-7 w-7 text-white">
                <path d="M15 3h6v6M9 21H3v-6M21 3l-7 7M3 21l7-7" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
          </button>
        ))}
      </div>

      {viewerIndex !== null && (
        <FullscreenViewer
          images={images}
          index={viewerIndex}
          title={title}
          onClose={() => setViewerIndex(null)}
          onNavigate={setViewerIndex}
        />
      )}
    </div>
  );
}

export function ProjectBlogDetailPage({ blog }) {
  const { locale, copy: siteCopy } = useSiteLocale();
  const copy = siteCopy.projectBlogs;

  const title = pick(blog.titleEn, blog.titleBn, blog.titleDk, locale);
  const summary = pick(blog.shortDescriptionEn, blog.shortDescriptionBn, blog.shortDescriptionDk, locale);
  const description = pick(blog.descriptionEn, blog.descriptionBn, blog.descriptionDk, locale);
  const date = formatDate(blog.createdAt, locale);

  return (
    <div className="min-h-screen bg-white">
      {/* Hero */}
      <section className="relative overflow-hidden bg-[linear-gradient(135deg,#0f172a,#155e75_52%,#0f766e)] px-4 pb-24 pt-10 sm:px-6 sm:pb-32 sm:pt-14 lg:px-8">
        <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
          <div className="absolute -top-32 -right-32 h-96 w-96 rounded-full border border-cyan-500/20" />
          <div className="absolute -top-16 -right-16 h-64 w-64 rounded-full border border-cyan-400/15" />
          <div className="absolute bottom-0 left-0 h-64 w-64 -translate-x-1/2 translate-y-1/2 rounded-full border border-cyan-600/20" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(6,182,212,0.14),transparent_60%)]" />
        </div>
        <div className="relative mx-auto max-w-3xl">
          <Link
            href="/project-blogs"
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-cyan-200 transition-colors hover:text-white"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="h-4 w-4 shrink-0">
              <path d="M19 12H5M11 6l-6 6 6 6" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            {copy.allStories}
          </Link>

          <div className="mt-5 flex flex-wrap items-center gap-2 sm:mt-6 sm:gap-3">
            {blog.projectTitleEn && (
              <span className="rounded-full border border-cyan-400/30 bg-cyan-400/10 px-3 py-1 text-[11px] font-bold uppercase tracking-widest text-cyan-300 sm:px-4 sm:py-1.5 sm:text-xs">
                {blog.projectTitleEn}
              </span>
            )}
            {date && (
              <span className="inline-flex items-center gap-1.5 text-xs font-medium text-cyan-100/70 sm:text-sm">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-3.5 w-3.5" aria-hidden="true">
                  <rect x="3" y="5" width="18" height="16" rx="2" />
                  <path d="M8 3v4M16 3v4M3 10h18" strokeLinecap="round" />
                </svg>
                {date}
              </span>
            )}
          </div>

          <h1 className="mt-4 text-2xl font-extrabold leading-tight text-white sm:text-3xl lg:text-4xl">
            {title}
          </h1>

          {summary && (
            <p className="mt-4 max-w-2xl text-sm leading-relaxed text-cyan-100/80 sm:text-base">
              {summary}
            </p>
          )}
        </div>

        {/* Curved divider into content */}
        <svg
          className="absolute inset-x-0 bottom-0 h-10 w-full text-white sm:h-16"
          viewBox="0 0 1440 80"
          preserveAspectRatio="none"
          aria-hidden="true"
        >
          <path fill="currentColor" d="M0,32 C360,80 1080,0 1440,40 L1440,80 L0,80 Z" />
        </svg>
      </section>

      {/* Content */}
      <section className="relative mx-auto -mt-14 max-w-3xl px-4 pb-14 sm:-mt-20 sm:px-6 sm:pb-20 lg:px-8">
        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl shadow-slate-900/10 sm:rounded-3xl">
          <div className="h-1.5 w-full bg-[linear-gradient(90deg,#0f766e,#0891b2,#0f172a)]" />

          <div className="p-5 sm:p-10">
            {blog.coverImage && (
              <div className="mb-6 overflow-hidden rounded-xl border border-slate-100 shadow-sm sm:mb-8 sm:rounded-2xl">
                <img src={blog.coverImage} alt={title} className="w-full object-cover" />
              </div>
            )}

            {description ? (
              <p className="whitespace-pre-wrap break-words text-sm leading-relaxed text-slate-700 sm:text-[15px]">
                {description}
              </p>
            ) : (
              <p className="text-sm text-slate-400">{copy.noDetails}</p>
            )}

            <GallerySection images={blog.galleryImages ?? []} title={title} copy={copy} />
          </div>
        </div>

        <div className="mt-8 flex justify-center sm:mt-10">
          <Link
            href="/donate"
            className="group inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-[linear-gradient(135deg,#0f766e,#0891b2)] px-6 py-3.5 text-sm font-bold text-white shadow-lg shadow-cyan-900/20 transition hover:shadow-xl hover:shadow-cyan-900/30 hover:brightness-105 sm:w-auto"
          >
            {copy.supportProject}
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-1">
              <path d="M5 12h14M13 6l6 6-6 6" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </Link>
        </div>
      </section>
    </div>
  );
}
