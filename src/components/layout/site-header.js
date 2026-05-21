"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useSiteLocale } from "@/components/providers/locale-provider";

const HEADER_OFFSET = 200;

export function SiteHeader() {
  const { copy, isLoading, languageOptions, locale, setLocale } = useSiteLocale();
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [isRegistrationOpen, setIsRegistrationOpen] = useState(false);
  const [isPinned, setIsPinned] = useState(false);

  const { header, registration } = copy;

  useEffect(() => {
    const handleScroll = () => {
      setIsPinned(window.scrollY > HEADER_OFFSET);
    };

    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  useEffect(() => {
    setIsMobileOpen(false);
    setIsRegistrationOpen(false);
  }, [locale]);

  const shellClassName = isPinned
    ? "fixed inset-x-0 top-0 z-30 border-b border-slate-200 bg-white/95 shadow-lg shadow-slate-900/5 backdrop-blur-xl"
    : "absolute inset-x-0 top-0 z-20 border-b border-transparent bg-transparent";

  const menuLabel = isMobileOpen ? header.closeMenuLabel : header.openMenuLabel;

  return (
    <div className="relative h-24 lg:h-28">
      <header className={`${shellClassName} transition-all duration-300 ease-out`}>
        <div className="mx-auto flex w-full max-w-7xl items-center justify-between gap-4 px-4 py-4 sm:px-6 lg:px-8">
          <Link href="/" className="flex items-center" aria-label={header.homeAriaLabel}>
            <span
              className={`flex items-center justify-center rounded-[1.75rem] transition-all duration-300 ${
                isPinned
                  ? "bg-transparent p-0 shadow-none"
                  : "bg-white p-2.5 shadow-xl shadow-slate-950/12"
              }`}
            >
              <Image
                src="/logo.png"
                alt={copy.brand.name}
                width={64}
                height={64}
                className={`w-auto transition-all duration-300 ${
                  isPinned ? "h-12 sm:h-14" : "h-16 sm:h-20"
                }`}
                priority
              />
            </span>
          </Link>

          <div className="hidden items-center gap-4 lg:flex">
            <nav
              className={`flex items-center gap-2 rounded-full px-2 py-2 text-sm transition-all duration-300 ${
                isPinned
                  ? "border border-slate-200 bg-slate-50 text-slate-700"
                  : "border border-cyan-100 bg-white/92 text-slate-700 shadow-lg shadow-cyan-100/50 backdrop-blur-md"
              }`}
            >
              {header.navItems.map((item) => (
                <a
                  key={item.href}
                  href={item.href}
                  className="rounded-full px-4 py-2 transition hover:bg-cyan-50 hover:text-cyan-700"
                  onClick={() => setIsRegistrationOpen(false)}
                >
                  {item.label}
                </a>
              ))}

              <div className="relative">
                <button
                  type="button"
                  className="flex items-center gap-2 rounded-full px-4 py-2 transition hover:bg-cyan-50 hover:text-cyan-700"
                  aria-expanded={isRegistrationOpen}
                  aria-controls="registration-menu"
                  onClick={() => setIsRegistrationOpen(!isRegistrationOpen)}
                >
                  {registration.menuLabel}
                  <span
                    className={`mt-[-0.15rem] block h-2.5 w-2.5 rotate-45 border-b border-r border-current transition ${
                      isRegistrationOpen ? "-translate-y-px" : "translate-y-0"
                    }`}
                    aria-hidden="true"
                  />
                </button>

                {isRegistrationOpen ? (
                  <div
                    id="registration-menu"
                    className="absolute right-0 top-[calc(100%+0.75rem)] w-72 rounded-3xl border border-slate-200 bg-white p-3 shadow-2xl shadow-slate-200/80"
                  >
                    {registration.options.map((item) => (
                      <a
                        key={item.id}
                        href={`#${item.id}`}
                        className="block rounded-2xl px-4 py-3 transition hover:bg-cyan-50"
                        onClick={() => setIsRegistrationOpen(false)}
                      >
                        <p className="text-sm font-semibold text-slate-900">
                          {item.title}
                        </p>
                        <p className="mt-1 text-xs leading-6 text-slate-500">
                          {item.description}
                        </p>
                      </a>
                    ))}
                  </div>
                ) : null}
              </div>
            </nav>

            <label className="sr-only" htmlFor="language-select">
              {header.languageLabel}
            </label>
            <select
              id="language-select"
              value={locale}
              aria-label={header.languageLabel}
              disabled={isLoading}
              onChange={(event) => setLocale(event.target.value)}
              className={`rounded-full px-4 py-2 text-sm font-medium outline-none transition ${
                isPinned
                  ? "border border-slate-200 bg-white text-slate-700 focus:border-cyan-400"
                  : "border border-cyan-100 bg-white/92 text-slate-700 shadow-lg shadow-cyan-100/50 focus:border-cyan-300"
              }`}
            >
              {languageOptions.map((language) => (
                <option
                  key={language.code}
                  value={language.code}
                  className="text-slate-700"
                >
                  {language.label}
                </option>
              ))}
            </select>
          </div>

          <button
            type="button"
            className={`flex h-11 w-11 items-center justify-center rounded-2xl transition lg:hidden ${
              isPinned
                ? "border border-slate-200 bg-slate-50 text-slate-700 hover:bg-cyan-50"
                : "border border-cyan-100 bg-white/92 text-slate-700 shadow-lg shadow-cyan-100/50 hover:bg-cyan-50"
            }`}
            aria-label={menuLabel}
            aria-expanded={isMobileOpen}
            aria-controls="mobile-menu"
            onClick={() => setIsMobileOpen(!isMobileOpen)}
          >
            <span className="relative block h-4 w-5" aria-hidden="true">
              <span
                className={`absolute left-0 top-0 h-0.5 w-5 rounded-full bg-current transition ${
                  isMobileOpen ? "top-[0.45rem] rotate-45" : ""
                }`}
              />
              <span
                className={`absolute left-0 top-[0.45rem] h-0.5 w-5 rounded-full bg-current transition ${
                  isMobileOpen ? "opacity-0" : ""
                }`}
              />
              <span
                className={`absolute left-0 top-[0.9rem] h-0.5 w-5 rounded-full bg-current transition ${
                  isMobileOpen ? "top-[0.45rem] -rotate-45" : ""
                }`}
              />
            </span>
          </button>
        </div>

        {isMobileOpen ? (
          <div
            id="mobile-menu"
            className={`border-t px-4 pb-5 pt-3 lg:hidden ${
              isPinned
                ? "border-slate-200 bg-white"
                : "border-cyan-100 bg-white/96 backdrop-blur-xl"
            }`}
          >
            <div className="mx-auto flex w-full max-w-7xl flex-col gap-3">
              {header.navItems.map((item) => (
                <a
                  key={item.href}
                  href={item.href}
                  className={`rounded-2xl px-4 py-3 text-sm font-medium ${
                    isPinned
                      ? "border border-slate-200 bg-slate-50 text-slate-700"
                      : "border border-cyan-100 bg-slate-50 text-slate-700"
                  }`}
                  onClick={() => setIsMobileOpen(false)}
                >
                  {item.label}
                </a>
              ))}

              <div
                className={`rounded-3xl p-3 ${
                  isPinned
                    ? "border border-slate-200 bg-slate-50"
                    : "border border-cyan-100 bg-slate-50"
                }`}
              >
                <button
                  type="button"
                  className="flex w-full items-center justify-between rounded-2xl px-2 py-2 text-left text-sm font-semibold text-slate-900"
                  aria-expanded={isRegistrationOpen}
                  onClick={() => setIsRegistrationOpen(!isRegistrationOpen)}
                >
                  <span>{registration.menuLabel}</span>
                  <span
                    className={`mt-[-0.15rem] block h-2.5 w-2.5 rotate-45 border-b border-r border-current transition ${
                      isRegistrationOpen ? "-translate-y-px" : "translate-y-0"
                    }`}
                    aria-hidden="true"
                  />
                </button>

                {isRegistrationOpen ? (
                  <div className="mt-2 space-y-2">
                    {registration.options.map((item) => (
                      <a
                        key={item.id}
                        href={`#${item.id}`}
                        className="block rounded-2xl bg-white px-4 py-3"
                        onClick={() => {
                          setIsRegistrationOpen(false);
                          setIsMobileOpen(false);
                        }}
                      >
                        <p className="text-sm font-semibold text-slate-900">
                          {item.title}
                        </p>
                        <p className="mt-1 text-xs leading-6 text-slate-500">
                          {item.description}
                        </p>
                      </a>
                    ))}
                  </div>
                ) : null}
              </div>

              <label className="sr-only" htmlFor="language-select-mobile">
                {header.languageLabel}
              </label>
              <select
                id="language-select-mobile"
                value={locale}
                aria-label={header.languageLabel}
                disabled={isLoading}
                onChange={(event) => setLocale(event.target.value)}
                className={`rounded-2xl px-4 py-3 text-sm font-medium outline-none ${
                  isPinned
                    ? "border border-slate-200 bg-white text-slate-700 focus:border-cyan-400"
                    : "border border-cyan-100 bg-white text-slate-700 focus:border-cyan-300"
                }`}
              >
                {languageOptions.map((language) => (
                  <option
                    key={language.code}
                    value={language.code}
                    className="text-slate-700"
                  >
                    {language.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
        ) : null}
      </header>
    </div>
  );
}
