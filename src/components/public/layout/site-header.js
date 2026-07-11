"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { DonorRegistrationModal } from "@/components/public/home/donor-registration-modal";
import { useSiteLocale } from "@/components/public/providers/locale-provider";

const HEADER_OFFSET = 200;
const languageFlagImages = {
  EN: "/en.png",
  BN: "/bg.png",
  DK: "/dk.png",
};

function ProfileIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
      className="h-5 w-5"
      aria-hidden="true"
    >
      <path
        d="M19 20a7 7 0 0 0-14 0"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle cx="12" cy="8" r="4" />
    </svg>
  );
}

function splitPrimaryNavItems(items) {
  return {
    leadingItems: items.slice(0, 3),
    trailingItems: items.slice(3),
  };
}

function getRegistrationOptionHref(optionId) {
  if (optionId === "beneficiary-registration") {
    return "/register/beneficiary";
  }

  return `/register#${optionId}`;
}

export function SiteHeader() {
  const { copy, isLoading, languageOptions, locale, setLocale } = useSiteLocale();
  const pathname = usePathname();
  const headerRef = useRef(null);
  const [isLanguageOpen, setIsLanguageOpen] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [isMembersOpen, setIsMembersOpen] = useState(false);
  const [isRegistrationOpen, setIsRegistrationOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isAboutOpen, setIsAboutOpen] = useState(false);
  const [isProgrammesOpen, setIsProgrammesOpen] = useState(false);
  const [isMobileLanguageOpen, setIsMobileLanguageOpen] = useState(false);
  const [isPinned, setIsPinned] = useState(false);
  const [isDonorModalOpen, setIsDonorModalOpen] = useState(false);

  const { header, members, registration } = copy;
  const aboutDropdown = header.about;
  const programmesDropdown = header.programmes;

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
    setIsLanguageOpen(false);
    setIsMobileOpen(false);
    setIsMembersOpen(false);
    setIsRegistrationOpen(false);
    setIsProfileOpen(false);
    setIsAboutOpen(false);
    setIsProgrammesOpen(false);
    setIsMobileLanguageOpen(false);
  }, [locale, pathname]);

  useEffect(() => {
    function closeMenusOnOutsideClick(event) {
      if (!headerRef.current?.contains(event.target)) {
        setIsLanguageOpen(false);
        setIsMembersOpen(false);
        setIsRegistrationOpen(false);
        setIsProfileOpen(false);
        setIsAboutOpen(false);
        setIsProgrammesOpen(false);
        setIsMobileLanguageOpen(false);
      }
    }

    function closeMenusOnEscape(event) {
      if (event.key === "Escape") {
        setIsLanguageOpen(false);
        setIsMembersOpen(false);
        setIsRegistrationOpen(false);
        setIsProfileOpen(false);
        setIsAboutOpen(false);
        setIsProgrammesOpen(false);
        setIsMobileLanguageOpen(false);
      }
    }

    document.addEventListener("pointerdown", closeMenusOnOutsideClick);
    document.addEventListener("keydown", closeMenusOnEscape);

    return () => {
      document.removeEventListener("pointerdown", closeMenusOnOutsideClick);
      document.removeEventListener("keydown", closeMenusOnEscape);
    };
  }, []);

  const shellClassName = isPinned
    ? "fixed inset-x-0 top-0 z-30 border-b border-slate-200 bg-white/95 shadow-lg shadow-slate-900/5 backdrop-blur-xl"
    : "absolute inset-x-0 top-0 z-20 border-b border-transparent bg-transparent";

  const menuLabel = isMobileOpen ? header.closeMenuLabel : header.openMenuLabel;
  const isMembersActive = pathname.startsWith("/members");
  const isRegistrationActive = pathname.startsWith("/register");
  const isLoginActive = pathname === "/login";
  const isAboutActive = pathname.startsWith("/about");
  const isProgrammesActive =
    pathname.startsWith("/our-work") ||
    pathname.startsWith("/donor-impact-info-update");
  const { leadingItems, trailingItems: [aboutNavItem, ...remainingTrailingItems] } = splitPrimaryNavItems(header.navItems);
  const selectedLanguage =
    languageOptions.find((language) => language.code === locale) ??
    languageOptions[0];

  function openDonorRegistration() {
    setIsDonorModalOpen(true);
    setIsRegistrationOpen(false);
    setIsMembersOpen(false);
    setIsProfileOpen(false);
    setIsMobileOpen(false);
  }

  return (
    <>
      <div ref={headerRef} className="relative h-24 lg:h-28">
        <header className={`${shellClassName} transition-all duration-300 ease-out`}>
          <div className="mx-auto flex w-full max-w-7xl items-center justify-between gap-4 px-4 py-4 sm:px-6 lg:px-8">
            <Link href="/" className="flex items-center" aria-label={header.homeAriaLabel}>
              <span
                className={`flex items-center justify-center rounded-[1.75rem] transition-all duration-300 ${isPinned
                  ? "bg-transparent p-0 shadow-none"
                  : "bg-white p-2.5 shadow-xl shadow-slate-950/12"
                  }`}
              >
                <Image
                  src="/logo.png"
                  alt={copy.brand.name}
                  width={64}
                  height={64}
                  className={`w-auto transition-all duration-300 ${isPinned ? "h-12 sm:h-14" : "h-16 sm:h-20"
                    }`}
                  priority
                />
              </span>
            </Link>

            <div className="hidden items-center gap-4 lg:flex">
              <nav
                className={`flex items-center gap-2 rounded-full px-2 py-2 text-sm transition-all duration-300 ${isPinned
                  ? "border border-slate-200 bg-slate-50 text-slate-700"
                  : "border border-cyan-100 bg-white/92 text-slate-700 shadow-lg shadow-cyan-100/50 backdrop-blur-md"
                  }`}
              >
                {leadingItems.map((item) =>
                  item.href === "/our-work" ? (
                    <div key={item.href} className="relative">
                      <button
                        type="button"
                        className={`flex items-center gap-2 rounded-full px-4 py-2 transition ${isProgrammesActive
                          ? "border border-cyan-300 bg-white/70 text-cyan-800 shadow-sm shadow-cyan-100"
                          : "hover:bg-cyan-50 hover:text-cyan-700"
                          }`}
                        aria-expanded={isProgrammesOpen}
                        aria-controls="programmes-menu"
                        aria-current={isProgrammesActive ? "page" : undefined}
                        onClick={() => {
                          setIsProgrammesOpen(!isProgrammesOpen);
                          setIsMembersOpen(false);
                          setIsRegistrationOpen(false);
                          setIsAboutOpen(false);
                          setIsProfileOpen(false);
                        }}
                      >
                        {programmesDropdown.menuLabel}
                        <span
                          className={`mt-[-0.15rem] block h-2.5 w-2.5 rotate-45 border-b border-r border-current transition ${isProgrammesOpen ? "-translate-y-px" : "translate-y-0"
                            }`}
                          aria-hidden="true"
                        />
                      </button>

                      {isProgrammesOpen ? (
                        <div
                          id="programmes-menu"
                          className="absolute left-0 top-[calc(100%+0.75rem)] w-72 rounded-3xl border border-slate-200 bg-white p-3 shadow-2xl shadow-slate-200/80"
                        >
                          {programmesDropdown.items.map((menuItem) => (
                            <Link
                              key={menuItem.id}
                              href={menuItem.href}
                              className={`block rounded-2xl px-4 py-3 transition ${pathname === menuItem.href
                                ? "border border-cyan-300 bg-white text-cyan-800"
                                : "hover:bg-cyan-50"
                                }`}
                              onClick={() => setIsProgrammesOpen(false)}
                            >
                              <p className="text-sm font-semibold text-slate-900">
                                {menuItem.title}
                              </p>
                            </Link>
                          ))}
                        </div>
                      ) : null}
                    </div>
                  ) : (
                    <Link
                      key={item.href}
                      href={item.href}
                      aria-current={pathname === item.href ? "page" : undefined}
                      className={`rounded-full px-4 py-2 transition ${pathname === item.href
                        ? "border border-cyan-300 bg-white/70 text-cyan-800 shadow-sm shadow-cyan-100"
                        : "hover:bg-cyan-50 hover:text-cyan-700"
                        }`}
                      onClick={() => {
                        setIsMembersOpen(false);
                        setIsRegistrationOpen(false);
                        setIsProgrammesOpen(false);
                        setIsProfileOpen(false);
                      }}
                    >
                      {item.label}
                    </Link>
                  )
                )}

                <div className="relative">
                  <button
                    type="button"
                    className={`flex items-center gap-2 rounded-full px-4 py-2 transition ${isMembersActive
                      ? "border border-cyan-300 bg-white/70 text-cyan-800 shadow-sm shadow-cyan-100"
                      : "hover:bg-cyan-50 hover:text-cyan-700"
                      }`}
                    aria-expanded={isMembersOpen}
                    aria-controls="members-menu"
                    aria-current={isMembersActive ? "page" : undefined}
                    onClick={() => {
                      setIsMembersOpen(!isMembersOpen);
                      setIsRegistrationOpen(false);
                      setIsProfileOpen(false);
                    }}
                  >
                    {members.menuLabel}
                    <span
                      className={`mt-[-0.15rem] block h-2.5 w-2.5 rotate-45 border-b border-r border-current transition ${isMembersOpen ? "-translate-y-px" : "translate-y-0"
                        }`}
                      aria-hidden="true"
                    />
                  </button>

                  {isMembersOpen ? (
                    <div
                      id="members-menu"
                      className="absolute right-0 top-[calc(100%+0.75rem)] w-72 rounded-3xl border border-slate-200 bg-white p-3 shadow-2xl shadow-slate-200/80"
                    >
                      {members.items.map((item) => (
                        <Link
                          key={item.id}
                          href={item.href}
                          className={`block rounded-2xl px-4 py-3 transition ${pathname === item.href
                            ? "border border-cyan-300 bg-white text-cyan-800"
                            : "hover:bg-cyan-50"
                            }`}
                          onClick={() => setIsMembersOpen(false)}
                        >
                          <p className="text-sm font-semibold text-slate-900">
                            {item.title}
                          </p>
                          <p className="mt-1 text-xs leading-6 text-slate-500">
                            {item.description}
                          </p>
                        </Link>
                      ))}
                    </div>
                  ) : null}
                </div>

                <div className="relative">
                  <button
                    type="button"
                    className={`flex items-center gap-2 rounded-full px-4 py-2 transition ${isRegistrationActive
                      ? "border border-cyan-300 bg-white/70 text-cyan-800 shadow-sm shadow-cyan-100"
                      : "hover:bg-cyan-50 hover:text-cyan-700"
                      }`}
                    aria-expanded={isRegistrationOpen}
                    aria-controls="registration-menu"
                    aria-current={isRegistrationActive ? "page" : undefined}
                    onClick={() => {
                      setIsRegistrationOpen(!isRegistrationOpen);
                      setIsMembersOpen(false);
                      setIsProfileOpen(false);
                    }}
                  >
                    {registration.menuLabel}
                    <span
                      className={`mt-[-0.15rem] block h-2.5 w-2.5 rotate-45 border-b border-r border-current transition ${isRegistrationOpen ? "-translate-y-px" : "translate-y-0"
                        }`}
                      aria-hidden="true"
                    />
                  </button>

                  {isRegistrationOpen ? (
                    <div
                      id="registration-menu"
                      className="absolute right-0 top-[calc(100%+0.75rem)] w-72 rounded-3xl border border-slate-200 bg-white p-3 shadow-2xl shadow-slate-200/80"
                    >
                      <Link
                        href="/register"
                        className={`mb-2 block rounded-2xl border px-4 py-3 text-sm font-semibold transition ${isRegistrationActive
                          ? "border-cyan-300 bg-white text-cyan-800"
                          : "border-cyan-100 bg-cyan-50 text-cyan-800 hover:bg-cyan-100"
                          }`}
                        onClick={() => setIsRegistrationOpen(false)}
                      >
                        {registration.menuLabel}
                      </Link>
                      {registration.options.map((item) =>
                        item.id === "donor-registration" ? (
                          <button
                            key={item.id}
                            type="button"
                            className="block w-full rounded-2xl px-4 py-3 text-left transition hover:bg-cyan-50"
                            onClick={openDonorRegistration}
                          >
                            <p className="text-sm font-semibold text-slate-900">
                              {item.title}
                            </p>
                            <p className="mt-1 text-xs leading-6 text-slate-500">
                              {item.description}
                            </p>
                          </button>
                        ) : (
                          <Link
                            key={item.id}
                            href={getRegistrationOptionHref(item.id)}
                            className="block rounded-2xl px-4 py-3 transition hover:bg-cyan-50"
                            onClick={() => setIsRegistrationOpen(false)}
                          >
                            <p className="text-sm font-semibold text-slate-900">
                              {item.title}
                            </p>
                            <p className="mt-1 text-xs leading-6 text-slate-500">
                              {item.description}
                            </p>
                          </Link>
                        )
                      )}
                    </div>
                  ) : null}
                </div>

                {/* About dropdown */}
                <div className="relative">
                  <button
                    type="button"
                    className={`flex items-center gap-2 rounded-full px-4 py-2 transition ${isAboutActive
                      ? "border border-cyan-300 bg-white/70 text-cyan-800 shadow-sm shadow-cyan-100"
                      : "hover:bg-cyan-50 hover:text-cyan-700"
                      }`}
                    aria-expanded={isAboutOpen}
                    aria-controls="about-menu"
                    aria-current={isAboutActive ? "page" : undefined}
                    onClick={() => {
                      setIsAboutOpen(!isAboutOpen);
                      setIsMembersOpen(false);
                      setIsRegistrationOpen(false);
                      setIsProfileOpen(false);
                    }}
                  >
                    {aboutNavItem.label}
                    <span
                      className={`mt-[-0.15rem] block h-2.5 w-2.5 rotate-45 border-b border-r border-current transition ${isAboutOpen ? "-translate-y-px" : "translate-y-0"
                        }`}
                      aria-hidden="true"
                    />
                  </button>

                  {isAboutOpen ? (
                    <div
                      id="about-menu"
                      className="absolute right-0 top-[calc(100%+0.75rem)] w-72 rounded-3xl border border-slate-200 bg-white p-3 shadow-2xl shadow-slate-200/80"
                    >
                      {aboutDropdown.items.map((item) => (
                        <Link
                          key={item.id}
                          href={item.href}
                          className={`block rounded-2xl px-4 py-3 transition ${pathname === item.href
                            ? "border border-cyan-300 bg-white text-cyan-800"
                            : "hover:bg-cyan-50"
                            }`}
                          onClick={() => setIsAboutOpen(false)}
                        >
                          <p className="text-sm font-semibold text-slate-900">{item.title}</p>
                        </Link>
                      ))}
                    </div>
                  ) : null}
                </div>

                {remainingTrailingItems.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    aria-current={pathname === item.href ? "page" : undefined}
                    className={`rounded-full px-4 py-2 transition ${pathname === item.href
                      ? "border border-cyan-300 bg-white/70 text-cyan-800 shadow-sm shadow-cyan-100"
                      : "hover:bg-cyan-50 hover:text-cyan-700"
                      }`}
                    onClick={() => {
                      setIsMembersOpen(false);
                      setIsRegistrationOpen(false);
                      setIsAboutOpen(false);
                      setIsProfileOpen(false);
                    }}
                  >
                    {item.label}
                  </Link>
                ))}

              </nav>

              <div className="relative">
                <button
                  type="button"
                  aria-label={header.languageLabel}
                  aria-expanded={isLanguageOpen}
                  disabled={isLoading}
                  onClick={() => {
                    setIsLanguageOpen(!isLanguageOpen);
                    setIsMembersOpen(false);
                    setIsRegistrationOpen(false);
                    setIsProfileOpen(false);
                  }}
                  className={`flex items-center gap-3 rounded-full px-3 py-2 text-sm font-semibold outline-none transition disabled:cursor-not-allowed disabled:opacity-60 ${isPinned
                    ? "border border-slate-200 bg-white text-slate-700 hover:border-cyan-200"
                    : "border border-cyan-100 bg-white/92 text-slate-700 shadow-lg shadow-cyan-100/50 hover:border-cyan-200"
                    }`}
                >
                  <span className="flex h-7 w-7 items-center justify-center rounded-full bg-cyan-50 text-[0.65rem] font-bold text-cyan-800">
                    <Image
                      src={languageFlagImages[selectedLanguage.code]}
                      alt=""
                      width={22}
                      height={22}
                      className="h-5 w-5 rounded-full object-cover"
                    />
                  </span>
                  <span>{selectedLanguage.label}</span>
                  <span
                    className={`mt-[-0.15rem] block h-2.5 w-2.5 rotate-45 border-b border-r border-current transition ${isLanguageOpen ? "-translate-y-px" : "translate-y-0"
                      }`}
                    aria-hidden="true"
                  />
                </button>

                {isLanguageOpen ? (
                  <div className="absolute right-0 top-[calc(100%+0.75rem)] w-52 rounded-3xl border border-slate-200 bg-white p-2 shadow-2xl shadow-slate-200/80">
                    {languageOptions.map((language) => {
                      const isSelected = language.code === locale;

                      return (
                        <button
                          key={language.code}
                          type="button"
                          className={`flex w-full items-center gap-3 rounded-2xl px-3 py-3 text-left text-sm font-semibold transition ${isSelected
                            ? "border border-cyan-300 bg-cyan-50 text-cyan-800"
                            : "text-slate-700 hover:bg-cyan-50 hover:text-cyan-800"
                            }`}
                          onClick={() => {
                            setLocale(language.code);
                            setIsLanguageOpen(false);
                          }}
                        >
                          <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-slate-100 text-[0.68rem] font-bold text-slate-700">
                            <Image
                              src={languageFlagImages[language.code]}
                              alt=""
                              width={24}
                              height={24}
                              className="h-6 w-6 rounded-full object-cover"
                            />
                          </span>
                          <span>{language.label}</span>
                        </button>
                      );
                    })}
                  </div>
                ) : null}
              </div>

              <div className="relative">
                <button
                  type="button"
                  aria-label={header.profileMenuLabel}
                  aria-expanded={isProfileOpen}
                  aria-controls="profile-menu"
                  aria-current={isLoginActive ? "page" : undefined}
                  className={`flex h-11 w-11 items-center justify-center rounded-full transition ${isLoginActive
                    ? "border border-cyan-300 bg-white text-cyan-800 shadow-lg shadow-cyan-100/60"
                    : isPinned
                      ? "border border-slate-200 bg-white text-slate-700 hover:border-cyan-200 hover:text-cyan-700"
                      : "border border-cyan-100 bg-white/92 text-slate-700 shadow-lg shadow-cyan-100/50 hover:border-cyan-200 hover:text-cyan-700"
                    }`}
                  onClick={() => {
                    setIsProfileOpen(!isProfileOpen);
                    setIsMembersOpen(false);
                    setIsRegistrationOpen(false);
                    setIsLanguageOpen(false);
                  }}
                >
                  <ProfileIcon />
                </button>

                {isProfileOpen ? (
                  <div
                    id="profile-menu"
                    className="absolute right-0 top-[calc(100%+0.75rem)] w-56 rounded-3xl border border-slate-200 bg-white p-3 shadow-2xl shadow-slate-200/80"
                  >
                    <Link
                      href="/login"
                      className={`flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-semibold transition ${isLoginActive
                        ? "border border-cyan-300 bg-white text-cyan-800"
                        : "hover:bg-cyan-50"
                        }`}
                      onClick={() => setIsProfileOpen(false)}
                    >
                      <ProfileIcon />
                      <span>{header.loginLabel}</span>
                    </Link>
                  </div>
                ) : null}
              </div>
            </div>

            <div className="flex items-center gap-2 lg:hidden">
              <div className="relative">
                <button
                  type="button"
                  aria-label={header.languageLabel}
                  aria-expanded={isMobileLanguageOpen}
                  aria-controls="mobile-language-menu"
                  disabled={isLoading}
                  onClick={() => {
                    setIsMobileLanguageOpen(!isMobileLanguageOpen);
                    setIsMobileOpen(false);
                    setIsProfileOpen(false);
                  }}
                  className={`flex h-11 items-center gap-1.5 rounded-2xl px-2.5 text-sm font-semibold transition disabled:cursor-not-allowed disabled:opacity-60 ${isPinned
                    ? "border border-slate-200 bg-slate-50 text-slate-700 hover:bg-cyan-50"
                    : "border border-cyan-100 bg-white/92 text-slate-700 shadow-lg shadow-cyan-100/50 hover:bg-cyan-50"
                    }`}
                >
                  <Image
                    src={languageFlagImages[selectedLanguage.code]}
                    alt=""
                    width={24}
                    height={24}
                    className="h-6 w-6 rounded-full object-cover"
                  />
                  <span>{selectedLanguage.label}</span>
                  <span
                    className={`mt-[-0.15rem] block h-2 w-2 rotate-45 border-b border-r border-current transition ${isMobileLanguageOpen ? "-translate-y-px" : "translate-y-0"
                      }`}
                    aria-hidden="true"
                  />
                </button>

                {isMobileLanguageOpen ? (
                  <div
                    id="mobile-language-menu"
                    className="absolute right-0 top-[calc(100%+0.5rem)] z-40 w-48 rounded-3xl border border-slate-200 bg-white p-2 shadow-2xl shadow-slate-200/80"
                  >
                    {languageOptions.map((language) => {
                      const isSelected = language.code === locale;

                      return (
                        <button
                          key={language.code}
                          type="button"
                          disabled={isLoading}
                          className={`flex w-full items-center gap-3 rounded-2xl px-3 py-3 text-left text-sm font-semibold transition disabled:cursor-not-allowed disabled:opacity-60 ${isSelected
                            ? "border border-cyan-300 bg-cyan-50 text-cyan-800"
                            : "text-slate-700 hover:bg-cyan-50 hover:text-cyan-800"
                            }`}
                          onClick={() => {
                            setLocale(language.code);
                            setIsMobileLanguageOpen(false);
                          }}
                        >
                          <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-slate-100">
                            <Image
                              src={languageFlagImages[language.code]}
                              alt=""
                              width={24}
                              height={24}
                              className="h-6 w-6 rounded-full object-cover"
                            />
                          </span>
                          <span>{language.label}</span>
                        </button>
                      );
                    })}
                  </div>
                ) : null}
              </div>

              <button
                type="button"
                className={`flex h-11 w-11 items-center justify-center rounded-2xl transition ${isPinned
                  ? "border border-slate-200 bg-slate-50 text-slate-700 hover:bg-cyan-50"
                  : "border border-cyan-100 bg-white/92 text-slate-700 shadow-lg shadow-cyan-100/50 hover:bg-cyan-50"
                  }`}
                aria-label={menuLabel}
                aria-expanded={isMobileOpen}
                aria-controls="mobile-menu"
                onClick={() => {
                  setIsMobileOpen(!isMobileOpen);
                  setIsProfileOpen(false);
                  setIsMobileLanguageOpen(false);
                }}
              >
                <span className="relative block h-4 w-5" aria-hidden="true">
                  <span
                    className={`absolute left-0 top-0 h-0.5 w-5 rounded-full bg-current transition ${isMobileOpen ? "top-[0.45rem] rotate-45" : ""
                      }`}
                  />
                  <span
                    className={`absolute left-0 top-[0.45rem] h-0.5 w-5 rounded-full bg-current transition ${isMobileOpen ? "opacity-0" : ""
                      }`}
                  />
                  <span
                    className={`absolute left-0 top-[0.9rem] h-0.5 w-5 rounded-full bg-current transition ${isMobileOpen ? "top-[0.45rem] -rotate-45" : ""
                      }`}
                  />
                </span>
              </button>
            </div>
          </div>

          {isMobileOpen ? (
            <div
              id="mobile-menu"
              className={`border-t px-4 pb-5 pt-3 lg:hidden ${isPinned
                ? "border-slate-200 bg-white"
                : "border-cyan-100 bg-white/96 backdrop-blur-xl"
                }`}
            >
              <div className="mx-auto flex w-full max-w-7xl flex-col gap-3">
                {leadingItems.map((item) =>
                  item.href === "/our-work" ? (
                    <div
                      key={item.href}
                      className={`rounded-3xl p-3 ${isPinned
                        ? "border border-slate-200 bg-slate-50"
                        : "border border-cyan-100 bg-slate-50"
                        }`}
                    >
                      <button
                        type="button"
                        className={`flex w-full items-center justify-between rounded-2xl px-2 py-2 text-left text-sm font-semibold ${isProgrammesActive
                          ? "border border-cyan-300 bg-white text-cyan-800"
                          : "text-slate-900"
                          }`}
                        aria-expanded={isProgrammesOpen}
                        aria-current={isProgrammesActive ? "page" : undefined}
                        onClick={() => {
                          setIsProgrammesOpen(!isProgrammesOpen);
                          setIsMembersOpen(false);
                          setIsRegistrationOpen(false);
                          setIsAboutOpen(false);
                          setIsProfileOpen(false);
                        }}
                      >
                        <span>{programmesDropdown.menuLabel}</span>
                        <span
                          className={`mt-[-0.15rem] block h-2.5 w-2.5 rotate-45 border-b border-r border-current transition ${isProgrammesOpen ? "-translate-y-px" : "translate-y-0"
                            }`}
                          aria-hidden="true"
                        />
                      </button>

                      {isProgrammesOpen ? (
                        <div className="mt-2 space-y-2">
                          {programmesDropdown.items.map((menuItem) => (
                            <Link
                              key={menuItem.id}
                              href={menuItem.href}
                              className={`block rounded-2xl px-4 py-3 ${pathname === menuItem.href
                                ? "border border-cyan-300 bg-white text-cyan-800"
                                : "bg-white"
                                }`}
                              onClick={() => {
                                setIsProgrammesOpen(false);
                                setIsMobileOpen(false);
                              }}
                            >
                              <p className="text-sm font-semibold text-slate-900">
                                {menuItem.title}
                              </p>
                            </Link>
                          ))}
                        </div>
                      ) : null}
                    </div>
                  ) : (
                    <Link
                      key={item.href}
                      href={item.href}
                      aria-current={pathname === item.href ? "page" : undefined}
                      className={`rounded-2xl px-4 py-3 text-sm font-medium ${pathname === item.href
                        ? "border border-cyan-300 bg-white text-cyan-800"
                        : isPinned
                          ? "border border-slate-200 bg-slate-50 text-slate-700"
                          : "border border-cyan-100 bg-slate-50 text-slate-700"
                        }`}
                      onClick={() => {
                        setIsMobileOpen(false);
                        setIsMembersOpen(false);
                        setIsRegistrationOpen(false);
                        setIsProgrammesOpen(false);
                        setIsProfileOpen(false);
                      }}
                    >
                      {item.label}
                    </Link>
                  )
                )}

                <div
                  className={`rounded-3xl p-3 ${isPinned
                    ? "border border-slate-200 bg-slate-50"
                    : "border border-cyan-100 bg-slate-50"
                    }`}
                >
                  <button
                    type="button"
                    className={`flex w-full items-center justify-between rounded-2xl px-2 py-2 text-left text-sm font-semibold ${isMembersActive
                      ? "border border-cyan-300 bg-white text-cyan-800"
                      : "text-slate-900"
                      }`}
                    aria-expanded={isMembersOpen}
                    aria-current={isMembersActive ? "page" : undefined}
                    onClick={() => {
                      setIsMembersOpen(!isMembersOpen);
                      setIsRegistrationOpen(false);
                      setIsProfileOpen(false);
                    }}
                  >
                    <span>{members.menuLabel}</span>
                    <span
                      className={`mt-[-0.15rem] block h-2.5 w-2.5 rotate-45 border-b border-r border-current transition ${isMembersOpen ? "-translate-y-px" : "translate-y-0"
                        }`}
                      aria-hidden="true"
                    />
                  </button>

                  {isMembersOpen ? (
                    <div className="mt-2 space-y-2">
                      {members.items.map((item) => (
                        <Link
                          key={item.id}
                          href={item.href}
                          className={`block rounded-2xl px-4 py-3 ${pathname === item.href
                            ? "border border-cyan-300 bg-white text-cyan-800"
                            : "bg-white"
                            }`}
                          onClick={() => {
                            setIsMembersOpen(false);
                            setIsMobileOpen(false);
                            setIsProfileOpen(false);
                          }}
                        >
                          <p className="text-sm font-semibold text-slate-900">
                            {item.title}
                          </p>
                          <p className="mt-1 text-xs leading-6 text-slate-500">
                            {item.description}
                          </p>
                        </Link>
                      ))}
                    </div>
                  ) : null}
                </div>

                {/* About accordion */}
                <div
                  className={`rounded-3xl p-3 ${isPinned
                    ? "border border-slate-200 bg-slate-50"
                    : "border border-cyan-100 bg-slate-50"
                    }`}
                >
                  <button
                    type="button"
                    className={`flex w-full items-center justify-between rounded-2xl px-2 py-2 text-left text-sm font-semibold ${isAboutActive
                      ? "border border-cyan-300 bg-white text-cyan-800"
                      : "text-slate-900"
                      }`}
                    aria-expanded={isAboutOpen}
                    aria-current={isAboutActive ? "page" : undefined}
                    onClick={() => {
                      setIsAboutOpen(!isAboutOpen);
                      setIsMembersOpen(false);
                      setIsRegistrationOpen(false);
                      setIsProfileOpen(false);
                    }}
                  >
                    <span>{aboutNavItem.label}</span>
                    <span
                      className={`mt-[-0.15rem] block h-2.5 w-2.5 rotate-45 border-b border-r border-current transition ${isAboutOpen ? "-translate-y-px" : "translate-y-0"
                        }`}
                      aria-hidden="true"
                    />
                  </button>

                  {isAboutOpen ? (
                    <div className="mt-2 space-y-2">
                      {aboutDropdown.items.map((item) => (
                        <Link
                          key={item.id}
                          href={item.href}
                          className={`block rounded-2xl px-4 py-3 ${pathname === item.href
                            ? "border border-cyan-300 bg-white text-cyan-800"
                            : "bg-white"
                            }`}
                          onClick={() => {
                            setIsAboutOpen(false);
                            setIsMobileOpen(false);
                          }}
                        >
                          <p className="text-sm font-semibold text-slate-900">{item.title}</p>
                        </Link>
                      ))}
                    </div>
                  ) : null}
                </div>

                {remainingTrailingItems.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    aria-current={pathname === item.href ? "page" : undefined}
                    className={`rounded-2xl px-4 py-3 text-sm font-medium ${pathname === item.href
                      ? "border border-cyan-300 bg-white text-cyan-800"
                      : isPinned
                        ? "border border-slate-200 bg-slate-50 text-slate-700"
                        : "border border-cyan-100 bg-slate-50 text-slate-700"
                      }`}
                    onClick={() => {
                      setIsMobileOpen(false);
                      setIsMembersOpen(false);
                      setIsRegistrationOpen(false);
                      setIsAboutOpen(false);
                      setIsProfileOpen(false);
                    }}
                  >
                    {item.label}
                  </Link>
                ))}

                <div
                  className={`rounded-3xl p-3 ${isPinned
                    ? "border border-slate-200 bg-slate-50"
                    : "border border-cyan-100 bg-slate-50"
                    }`}
                >
                  <button
                    type="button"
                    className={`flex w-full items-center justify-between rounded-2xl px-2 py-2 text-left text-sm font-semibold ${isRegistrationActive
                      ? "border border-cyan-300 bg-white text-cyan-800"
                      : "text-slate-900"
                      }`}
                    aria-expanded={isRegistrationOpen}
                    aria-current={isRegistrationActive ? "page" : undefined}
                    onClick={() => {
                      setIsRegistrationOpen(!isRegistrationOpen);
                      setIsMembersOpen(false);
                      setIsProfileOpen(false);
                    }}
                  >
                    <span>{registration.menuLabel}</span>
                    <span
                      className={`mt-[-0.15rem] block h-2.5 w-2.5 rotate-45 border-b border-r border-current transition ${isRegistrationOpen ? "-translate-y-px" : "translate-y-0"
                        }`}
                      aria-hidden="true"
                    />
                  </button>


                  {isRegistrationOpen ? (
                    <div className="mt-2 space-y-2">
                      <Link
                        href="/register"
                        className={`block rounded-2xl border px-4 py-3 text-sm font-semibold ${isRegistrationActive
                          ? "border-cyan-300 bg-white text-cyan-800"
                          : "border-cyan-100 bg-cyan-50 text-cyan-800"
                          }`}
                        onClick={() => {
                          setIsRegistrationOpen(false);
                          setIsMobileOpen(false);
                          setIsProfileOpen(false);
                        }}
                      >
                        {registration.menuLabel}
                      </Link>
                      {registration.options.map((item) =>
                        item.id === "donor-registration" ? (
                          <button
                            key={item.id}
                            type="button"
                            className="block w-full rounded-2xl bg-white px-4 py-3 text-left"
                            onClick={openDonorRegistration}
                          >
                            <p className="text-sm font-semibold text-slate-900">
                              {item.title}
                            </p>
                            <p className="mt-1 text-xs leading-6 text-slate-500">
                              {item.description}
                            </p>
                          </button>
                        ) : (
                          <Link
                            key={item.id}
                            href={getRegistrationOptionHref(item.id)}
                            className="block rounded-2xl bg-white px-4 py-3"
                            onClick={() => {
                              setIsRegistrationOpen(false);
                              setIsMobileOpen(false);
                              setIsProfileOpen(false);
                            }}
                          >
                            <p className="text-sm font-semibold text-slate-900">
                              {item.title}
                            </p>
                            <p className="mt-1 text-xs leading-6 text-slate-500">
                              {item.description}
                            </p>
                          </Link>
                        )
                      )}
                    </div>
                  ) : null}
                </div>

                <div
                  className={`rounded-3xl p-3 ${isPinned
                    ? "border border-slate-200 bg-slate-50"
                    : "border border-cyan-100 bg-slate-50"
                    }`}
                >
                  <button
                    type="button"
                    className={`flex w-full items-center justify-between rounded-2xl px-2 py-2 text-left text-sm font-semibold ${isLoginActive
                      ? "border border-cyan-300 bg-white text-cyan-800"
                      : "text-slate-900"
                      }`}
                    aria-label={header.profileMenuLabel}
                    aria-expanded={isProfileOpen}
                    aria-controls="mobile-profile-menu"
                    aria-current={isLoginActive ? "page" : undefined}
                    onClick={() => {
                      setIsProfileOpen(!isProfileOpen);
                      setIsMembersOpen(false);
                      setIsRegistrationOpen(false);
                    }}
                  >
                    <span className="flex items-center gap-3">
                      <ProfileIcon />
                      <span>{header.profileLabel}</span>
                    </span>
                    <span
                      className={`mt-[-0.15rem] block h-2.5 w-2.5 rotate-45 border-b border-r border-current transition ${isProfileOpen ? "-translate-y-px" : "translate-y-0"
                        }`}
                      aria-hidden="true"
                    />
                  </button>

                  {isProfileOpen ? (
                    <div id="mobile-profile-menu" className="mt-2 space-y-2">
                      <Link
                        href="/login"
                        className={`flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-semibold ${isLoginActive
                          ? "border border-cyan-300 bg-white text-cyan-800"
                          : "bg-white text-slate-900"
                          }`}
                        onClick={() => {
                          setIsProfileOpen(false);
                          setIsMobileOpen(false);
                        }}
                      >
                        <ProfileIcon />
                        <span>{header.loginLabel}</span>
                      </Link>
                    </div>
                  ) : null}
                </div>
              </div>
            </div>
          ) : null}
        </header>
      </div>

      <DonorRegistrationModal
        isOpen={isDonorModalOpen}
        language={copy.htmlLang}
        onClose={() => setIsDonorModalOpen(false)}
      />
    </>
  );
}
