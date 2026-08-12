"use client";

import { useMemo, useState } from "react";
import { useSiteLocale } from "@/components/public/providers/locale-provider";
import { resolveCopy } from "@/components/public/home/customer-feedback-section";

const PAGE_SIZE = 6;

function formatDate(value) {
  if (!value) return "";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";
  return new Intl.DateTimeFormat("en-GB", { day: "2-digit", month: "short", year: "numeric" }).format(date);
}

function Stars({ rating }) {
  return (
    <div className="flex items-center justify-center gap-1" aria-label={`${rating} out of 5 stars`}>
      {[1, 2, 3, 4, 5].map((star) => (
        <svg
          key={star}
          viewBox="0 0 24 24"
          strokeWidth={star <= rating ? 1.5 : 0}
          stroke="currentColor"
          className={`h-4 w-4 sm:h-5 sm:w-5 ${star <= rating ? "fill-amber-400 text-amber-600" : "fill-slate-200"}`}
        >
          <path d="M12 2.5l2.9 6.06 6.6.72-4.9 4.5 1.28 6.55L12 16.9l-5.88 3.43 1.28-6.55-4.9-4.5 6.6-.72L12 2.5Z" />
        </svg>
      ))}
    </div>
  );
}

function FeedbackCard({ item }) {
  return (
    <article className="flex h-full flex-col rounded-xl border border-slate-200 bg-white p-3 transition hover:-translate-y-0.5 sm:rounded-2xl sm:p-4">
      <p className="flex-1 text-[11px] leading-4 text-slate-700 line-clamp-3 sm:text-xs sm:leading-5 sm:line-clamp-4">
        &ldquo;{item.message}&rdquo;
      </p>
      <div className="mt-2.5 flex items-center justify-between gap-2 border-t border-slate-100 pt-2.5 sm:mt-3 sm:gap-2.5 sm:pt-3">
        <div className="flex min-w-0 items-center gap-2 sm:gap-2.5">
          <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-cyan-100 text-[11px] font-black text-cyan-700 sm:h-7 sm:w-7 sm:text-xs">
            {item.fullName.charAt(0).toUpperCase()}
          </span>
          <div className="min-w-0">
            <p className="truncate text-[11px] font-bold text-slate-900 sm:text-xs">{item.fullName}</p>
            <p className="text-[10px] text-slate-400 sm:text-[11px]">{formatDate(item.createdAt)}</p>
          </div>
        </div>
        <Stars rating={item.rating} />
      </div>
    </article>
  );
}

function PaginationButton({ children, className, ...props }) {
  return (
    <button
      type="button"
      {...props}
      className={
        className ??
        "inline-flex h-9 min-w-9 items-center justify-center rounded-xl border border-slate-200 bg-white px-3 text-xs font-bold text-slate-600 transition hover:border-cyan-300 hover:text-cyan-700 disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:border-slate-200 disabled:hover:text-slate-600"
      }
    >
      {children}
    </button>
  );
}

export function CustomerFeedbackShowcase({ items }) {
  const { copy: siteCopy } = useSiteLocale();
  const text = resolveCopy(siteCopy.htmlLang);
  const [page, setPage] = useState(1);

  const totalPages = Math.max(1, Math.ceil((items?.length ?? 0) / PAGE_SIZE));
  const pageItems = useMemo(() => {
    const start = (page - 1) * PAGE_SIZE;
    return (items ?? []).slice(start, start + PAGE_SIZE);
  }, [items, page]);

  if (!items?.length) return null;

  function goToPage(next) {
    setPage(Math.min(Math.max(1, next), totalPages));
  }

  return (
    <section className="bg-white py-10 sm:py-12">
      <div className="mx-auto w-full max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <p className="text-xs font-black uppercase tracking-[0.22em] text-cyan-700">{text.eyebrow}</p>
          <h2 className="mt-2 text-xl font-black tracking-tight text-slate-950 sm:text-2xl">{text.title}</h2>
        </div>

        <div className="mt-6 grid grid-cols-1 gap-3 sm:mt-10 sm:grid-cols-2 sm:gap-5 lg:grid-cols-3">
          {pageItems.map((item) => (
            <FeedbackCard key={item.id} item={item} />
          ))}
        </div>

        {totalPages > 1 ? (
          <div className="mt-8 flex items-center justify-center gap-2 sm:mt-10">
            <PaginationButton onClick={() => goToPage(page - 1)} disabled={page === 1} aria-label="Previous page">
              ‹
            </PaginationButton>

            {Array.from({ length: totalPages }, (_, index) => index + 1).map((pageNumber) => (
              <PaginationButton
                key={pageNumber}
                onClick={() => goToPage(pageNumber)}
                aria-current={pageNumber === page ? "page" : undefined}
                className={`inline-flex h-9 min-w-9 items-center justify-center rounded-xl border px-3 text-xs font-bold transition ${pageNumber === page
                  ? "border-cyan-600 bg-cyan-600 text-white"
                  : "border-slate-200 bg-white text-slate-600 hover:border-cyan-300 hover:text-cyan-700"
                  }`}
              >
                {pageNumber}
              </PaginationButton>
            ))}

            <PaginationButton
              onClick={() => goToPage(page + 1)}
              disabled={page === totalPages}
              aria-label="Next page"
            >
              ›
            </PaginationButton>
          </div>
        ) : null}
      </div>
    </section>
  );
}
