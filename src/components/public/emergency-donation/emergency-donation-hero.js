"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useSiteLocale } from "@/components/public/providers/locale-provider";

const CATEGORY_ICONS = ["🎓", "📚", "🩺", "🏠", "🌊", "🍚", "🧵", "🚑"];

function pick(en, bn, dk, locale) {
  if (locale === "BN") return bn || en;
  if (locale === "DK") return dk || en;
  return en;
}

const COPY = {
  eyebrow: {
    en: "In service of humanity",
    bn: "মানবতার সেবায় আমরা",
    dk: "I menneskehedens tjeneste",
  },
  titleAccent: { en: "Emergency", bn: "ইমার্জেন্সি", dk: "Nødhjælp" },
  titleRest: { en: "Donation", bn: "ডোনেশন", dk: "Donation" },
  description: {
    en: "Support people affected by education, medical, and disaster emergencies — contribute today.",
    bn: "শিক্ষা, চিকিৎসা ও দুর্যোগে ক্ষতিগ্রস্ত মানুষের পাশে দাঁড়াতে আজই সহযোগিতা করুন।",
    dk: "Støt mennesker ramt af uddannelses-, medicinske og katastrofenødsituationer — bidrag i dag.",
  },
  donateNow: { en: "Donate now", bn: "এখনই দান করুন", dk: "Doner nu" },
  viewDetails: { en: "View details", bn: "বিস্তারিত দেখুন", dk: "Se detaljer" },
  impactBadgeLines: {
    en: ["Your donation", "builds", "a better future"],
    bn: ["আপনার দান", "গড়ে তোলে", "উন্নত ভবিষ্যৎ"],
    dk: ["Din donation", "skaber", "en bedre fremtid"],
  },
};

const TRUST_COPY = [
  {
    icon: "🛡️",
    en: "Transparency is our promise",
    bn: "স্বচ্ছতা আমাদের অঙ্গীকার",
    dk: "Gennemsigtighed er vores løfte",
  },
  {
    icon: "👥",
    en: "Trusted & credible organization",
    bn: "বিশ্বস্ত ও নির্ভরযোগ্য প্রতিষ্ঠান",
    dk: "Betroet og troværdig organisation",
  },
  {
    icon: "💚",
    en: "Transparent accounting & regular updates",
    bn: "স্বচ্ছ হিসাব ও নিয়মিত আপডেট",
    dk: "Gennemsigtigt regnskab og regelmæssige opdateringer",
  },
  {
    icon: "🔒",
    en: "Safe & easy donation process",
    bn: "নিরাপদ ও সহজ দান প্রক্রিয়া",
    dk: "Sikker og nem donationsproces",
  },
];

function t(entry, locale) {
  if (locale === "BN") return entry.bn || entry.en;
  if (locale === "DK") return entry.dk || entry.en;
  return entry.en;
}

function CategoryCard({ category, index }) {
  const { locale } = useSiteLocale();
  const icon = CATEGORY_ICONS[index % CATEGORY_ICONS.length];
  const hasImage = Boolean(category.imageUrl);
  const name = pick(category.nameEn, category.nameBn, category.nameDk, locale);
  const description = pick(category.descriptionEn, category.descriptionBn, category.descriptionDk, locale);

  return (
    <Link
      href={`/emergency-donation?categoryId=${category.id}`}
      aria-label={`${name} — ${t(COPY.donateNow, locale)}`}
      className="group relative flex min-h-55 items-center overflow-hidden rounded-2xl border border-slate-100 bg-[#fdf6ee] shadow-[0_4px_16px_rgba(15,23,42,0.05)] transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_14px_32px_rgba(15,23,42,0.12)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-500 focus-visible:ring-offset-2 sm:min-h-60"
    >
      {/* Background media */}
      {hasImage ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={category.imageUrl}
          alt=""
          className="absolute inset-0 h-full w-full object-cover object-right transition-transform duration-500 group-hover:scale-105"
        />
      ) : (
        <div
          className="absolute inset-0 flex items-center justify-end bg-[linear-gradient(135deg,#0f172a,#155e75_52%,#0f766e)] pr-8 text-5xl opacity-80"
          aria-hidden="true"
        >
          <span>{icon}</span>
        </div>
      )}

      {/* Left fade so text stays legible over any image */}
      <div
        className="absolute inset-0 bg-[linear-gradient(90deg,#fdf6ee_0%,#fdf6ee_45%,rgba(253,246,238,0.55)_65%,transparent_90%)]"
        aria-hidden="true"
      />

      {/* Text content */}
      <div className="relative z-10 flex h-full w-[70%] flex-col items-center justify-center gap-2 py-5 pl-5 pr-2 text-center sm:w-3/5">
        <div className="flex flex-col items-center">
          <h3 className="text-base font-extrabold text-cyan-900 sm:text-lg">{name}</h3>
          <span className="mt-1 block h-1 w-8 rounded-full bg-cyan-600 transition-all duration-300 group-hover:w-12" aria-hidden="true" />
        </div>
        {description && (
          <p className="text-xs leading-5 text-slate-600 line-clamp-2 sm:text-sm">{description}</p>
        )}

        <span className="mt-5 inline-flex w-fit items-center gap-1.5 rounded-full bg-cyan-700 px-3 py-1.5 text-xs font-bold text-white shadow-sm transition-colors duration-300 group-hover:bg-cyan-800">
          {t(COPY.donateNow, locale)}
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-0.5"
            aria-hidden="true"
          >
            <path d="M5 12h14M13 6l6 6-6 6" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </span>
      </div>
    </Link>
  );
}

function DonationImpactBadge({ mobile = false }) {
  const { locale } = useSiteLocale();
  const lines = COPY.impactBadgeLines[locale.toLowerCase()] ?? COPY.impactBadgeLines.en;

  const containerClass = mobile
    ? "flex w-full max-w-sm items-center gap-3 rounded-2xl border border-emerald-100 bg-white/90 px-4 py-3 shadow-sm backdrop-blur-sm sm:w-auto"
    : "pointer-events-none absolute left-[8%] top-[7%] flex max-w-[11rem] flex-col items-center gap-2 rounded-3xl border-4 border-stone-100 bg-white/95 px-4 py-4 text-center shadow-[0_12px_30px_rgba(15,23,42,0.12)] xl:left-[10%] xl:top-[8%] xl:max-w-[12rem] 2xl:left-[12%]";

  const iconClass = mobile
    ? "flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-emerald-600 text-white shadow-sm"
    : "flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-emerald-600 text-white shadow-sm";

  const textClass = mobile
    ? "text-left text-sm font-bold leading-5 text-emerald-700"
    : "text-[13px] font-bold leading-5 text-emerald-700 xl:text-[15px]";

  return (
    <div className={containerClass}>
      <span className={iconClass} aria-hidden="true">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" className="h-5 w-5">
          <path d="M5 13l4 4L19 7" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </span>
      <span className={textClass}>{lines.join(" ")}</span>
    </div>
  );
}

const AUTOPLAY_INTERVAL_MS = 4000;

function CategorySlider({ categories }) {
  const trackRef = useRef(null);
  const realCount = categories.length;
  const cloneCount = Math.min(2, realCount);
  const loopItems = realCount > 1 ? [...categories, ...categories.slice(0, cloneCount)] : categories;

  const [activeIndex, setActiveIndex] = useState(0);
  const [canScrollPrev, setCanScrollPrev] = useState(false);
  const [canScrollNext, setCanScrollNext] = useState(realCount > 1);
  const [isPaused, setIsPaused] = useState(false);

  function updateScrollState() {
    const el = trackRef.current;
    if (!el) return;

    const children = Array.from(el.children);
    const center = el.scrollLeft + el.clientWidth / 2;
    let closestIndex = 0;
    let closestDistance = Infinity;
    children.forEach((child, i) => {
      const childCenter = child.offsetLeft + child.offsetWidth / 2;
      const distance = Math.abs(childCenter - center);
      if (distance < closestDistance) {
        closestDistance = distance;
        closestIndex = i;
      }
    });

    if (realCount > 1) {
      setCanScrollPrev(true);
      setCanScrollNext(true);
      // If we've scrolled onto a cloned card at the end, silently rewind to the real equivalent.
      if (closestIndex >= realCount) {
        const realIndex = closestIndex - realCount;
        const realCard = el.children[realIndex];
        if (realCard) {
          el.scrollLeft = realCard.offsetLeft - (el.clientWidth - realCard.clientWidth) / 2;
        }
        setActiveIndex(realIndex);
        return;
      }
    } else {
      setCanScrollPrev(el.scrollLeft > 8);
      setCanScrollNext(el.scrollLeft + el.clientWidth < el.scrollWidth - 8);
    }

    setActiveIndex(closestIndex);
  }

  useEffect(() => {
    updateScrollState();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [categories.length]);

  function scrollToIndex(index, behavior = "smooth") {
    const el = trackRef.current;
    const card = el?.children[index];
    if (!card) return;
    el.scrollTo({ left: card.offsetLeft - (el.clientWidth - card.clientWidth) / 2, behavior });
  }

  function scrollByCard(direction) {
    const el = trackRef.current;
    if (!el) return;

    if (realCount <= 1) {
      const card = el.children[0];
      const cardWidth = card ? card.getBoundingClientRect().width + 16 : el.clientWidth * 0.8;
      const atEnd = el.scrollLeft + el.clientWidth >= el.scrollWidth - 8;
      const atStart = el.scrollLeft <= 8;
      if (direction > 0 && atEnd) scrollToIndex(0);
      else if (direction < 0 && atStart) scrollToIndex(realCount - 1);
      else el.scrollBy({ left: direction * cardWidth, behavior: "smooth" });
      return;
    }

    // Looping: move forward continuously through the cloned tail; scroll backward past the
    // start jumps to the cloned tail so it can continue scrolling seamlessly in either direction.
    const nextIndex = activeIndex + direction;
    if (nextIndex < 0) {
      scrollToIndex(realCount, "instant");
      requestAnimationFrame(() => scrollToIndex(realCount - 1));
    } else {
      scrollToIndex(nextIndex);
    }
  }

  useEffect(() => {
    if (realCount <= 1 || isPaused) return undefined;
    const id = setInterval(() => scrollByCard(1), AUTOPLAY_INTERVAL_MS);
    return () => clearInterval(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [realCount, isPaused, activeIndex]);

  return (
    <div
      className="relative sm:px-12"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onTouchStart={() => setIsPaused(true)}
      onTouchEnd={() => setIsPaused(false)}
    >
      <div
        ref={trackRef}
        onScroll={updateScrollState}
        className="flex snap-x snap-mandatory gap-4 overflow-x-auto scroll-smooth pb-2 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        {loopItems.map((category, index) => (
          <div key={`${category.id}-${index}`} className="w-[85%] shrink-0 snap-center sm:w-[50%] lg:w-[50%]">
            <CategoryCard category={category} index={index % realCount} />
          </div>
        ))}
      </div>

      {canScrollPrev && (
        <button
          type="button"
          onClick={() => scrollByCard(-1)}
          aria-label="Previous categories"
          className="absolute left-0 top-1/2 z-20 hidden h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-white text-cyan-800 shadow-lg ring-1 ring-slate-200 transition hover:bg-cyan-50 sm:flex"
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="h-5 w-5">
            <path d="M15 18l-6-6 6-6" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
      )}
      {canScrollNext && (
        <button
          type="button"
          onClick={() => scrollByCard(1)}
          aria-label="Next categories"
          className="absolute right-0 top-1/2 z-20 hidden h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-white text-cyan-800 shadow-lg ring-1 ring-slate-200 transition hover:bg-cyan-50 sm:flex"
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="h-5 w-5">
            <path d="M9 18l6-6-6-6" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
      )}

      {categories.length > 1 && (
        <div className="mt-4 flex items-center justify-center gap-2">
          {categories.map((category, index) => (
            <button
              key={category.id}
              type="button"
              onClick={() => scrollToIndex(index)}
              aria-label={`Go to slide ${index + 1}`}
              aria-current={index === activeIndex}
              className="relative h-2 w-6 overflow-hidden rounded-full bg-cyan-200 transition-colors duration-300 hover:bg-cyan-300"
            >
              <span
                className={`absolute inset-y-0 left-0 rounded-full bg-cyan-700 transition-all ${index === activeIndex
                  ? !isPaused
                    ? "w-full duration-4000 ease-linear"
                    : "w-full duration-300"
                  : "w-0 duration-300"
                  }`}
                style={
                  index === activeIndex && !isPaused
                    ? { animation: `emergency-dot-fill ${AUTOPLAY_INTERVAL_MS}ms linear` }
                    : undefined
                }
              />
            </button>
          ))}
        </div>
      )}

      <style jsx>{`
        @keyframes emergency-dot-fill {
          from {
            width: 0%;
          }
          to {
            width: 100%;
          }
        }
      `}</style>
    </div>
  );
}

export function EmergencyDonationHero({ categories = [] }) {
  const { locale } = useSiteLocale();

  return (
    <section className="relative overflow-hidden">
      {/* Banner */}
      <div className="relative">
        <div
          className="absolute inset-0 hidden bg-cover bg-center bg-no-repeat lg:block"
          style={{ backgroundImage: "url('/emg-bg.png')" }}
          aria-hidden="true"
        />
        <div
          className="absolute inset-0 bg-cover bg-position-[78%_center] bg-no-repeat lg:hidden"
          style={{
            backgroundImage:
              "linear-gradient(180deg, rgba(253,246,238,0.92) 0%, rgba(253,246,238,0.72) 45%, rgba(253,246,238,0.94) 100%), url('/emg-bg.png')",
          }}
          aria-hidden="true"
        />
        <div className="relative mx-auto grid max-w-7xl grid-cols-1 gap-6 px-4 py-10 sm:px-6 sm:py-12 lg:grid-cols-[minmax(0,58%)_1fr] lg:gap-8 lg:px-16 lg:py-16">
          <div className="text-center lg:text-left">
            <span className="inline-flex items-center gap-2 rounded-full bg-rose-50 px-4 py-1.5 text-xs font-bold text-rose-600 ring-1 ring-rose-100">
              <span aria-hidden="true">🤲</span> {t(COPY.eyebrow, locale)}
            </span>

            <h1 className="mt-4 text-3xl font-extrabold leading-tight tracking-tight sm:text-4xl lg:text-5xl">
              <span className="text-rose-600">{t(COPY.titleAccent, locale)}</span>{" "}
              <span className="text-slate-900">{t(COPY.titleRest, locale)}</span>
            </h1>

            <div className="mt-3 flex items-center justify-center gap-3 lg:justify-start">
              <span className="h-0.5 flex-1 max-w-16 rounded-full bg-rose-300 sm:max-w-24" aria-hidden="true" />
              <span className="text-rose-500" aria-hidden="true">❤</span>
              <span className="h-0.5 flex-1 max-w-16 rounded-full bg-rose-300 sm:max-w-24" aria-hidden="true" />
            </div>

            <p className="mx-auto mt-4 max-w-xl text-sm leading-7 text-slate-700 sm:text-base lg:mx-0">
              {t(COPY.description, locale)}
            </p>

            <div className="mt-6 flex flex-wrap items-center justify-center gap-3 lg:justify-start">
              <Link
                href="/emergency-donation"
                className="inline-flex items-center gap-2 rounded-lg bg-[linear-gradient(135deg,#0f766e,#0891b2)] px-6 py-3 text-sm font-bold text-white! shadow-lg shadow-cyan-950/20 transition hover:-translate-y-0.5 hover:opacity-90 hover:shadow-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-500 focus-visible:ring-offset-2"
              >
                <span aria-hidden="true">🤝</span> {t(COPY.donateNow, locale)}
              </Link>
              <Link
                href="#emergency-categories"
                className="inline-flex items-center gap-2 rounded-lg border-2 border-emerald-600 bg-white/90 px-6 py-3 text-sm font-bold text-emerald-700 transition hover:-translate-y-0.5 hover:bg-emerald-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:ring-offset-2"
              >
                <span aria-hidden="true">ⓘ</span> {t(COPY.viewDetails, locale)}
              </Link>
            </div>

            <div className="mt-5 flex justify-center lg:hidden">
              <DonationImpactBadge mobile />
            </div>
          </div>

          {/* Spacer column reserved for the photo baked into the background image */}
          <div className="relative hidden lg:block">
            <DonationImpactBadge />
          </div>
        </div>
      </div>

      <div className="relative mx-auto max-w-7xl px-4 pb-14 sm:px-6 lg:px-8">
        {/* Category cards */}
        {categories.length > 0 && (
          <div id="emergency-categories" className="mt-12 scroll-mt-24 sm:mt-14">
            <CategorySlider categories={categories} />
          </div>
        )}

        {/* Trust strip — mobile: passive auto-sliding marquee, sm+: static wrapped row */}
        <div className="mt-10 overflow-hidden rounded-2xl border border-cyan-100 bg-white/80 shadow-sm backdrop-blur-sm sm:hidden">
          <div className="flex w-max animate-[emergency-trust-marquee_18s_linear_infinite] gap-6 px-5 py-4">
            {[...TRUST_COPY, ...TRUST_COPY].map((item, i) => (
              <span
                key={`${item.en}-${i}`}
                className="flex shrink-0 items-center gap-2 text-xs font-semibold text-slate-700"
              >
                <span aria-hidden="true">{item.icon}</span>
                {t(item, locale)}
              </span>
            ))}
          </div>
        </div>
        <div className="mt-10 hidden flex-wrap items-center justify-center gap-6 rounded-2xl border border-cyan-100 bg-white/80 px-5 py-4 shadow-sm backdrop-blur-sm sm:flex">
          {TRUST_COPY.map((item) => (
            <span
              key={item.en}
              className="flex items-center gap-2 text-sm font-semibold text-slate-700"
            >
              <span aria-hidden="true">{item.icon}</span>
              {t(item, locale)}
            </span>
          ))}
        </div>

        <style jsx>{`
          @keyframes emergency-trust-marquee {
            from {
              transform: translateX(0);
            }
            to {
              transform: translateX(-50%);
            }
          }
        `}</style>
      </div>
    </section>
  );
}
