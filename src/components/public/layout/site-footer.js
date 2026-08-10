"use client";

import Image from "next/image";
import Link from "next/link";
import { useSiteLocale } from "@/components/public/providers/locale-provider";

const SOCIAL_LINKS = [
  {
    name: "Facebook",
    href: "https://www.facebook.com/profile.php?id=61591138875113",
    hoverClass: "hover:border-[#1877F2] hover:bg-[#1877F2] hover:text-white hover:shadow-[#1877F2]/40",
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5" aria-hidden="true">
        <path d="M13.5 21v-7.5h2.5l.4-3H13.5V8.4c0-.87.24-1.46 1.5-1.46h1.6V4.28C16.3 4.19 15.32 4.1 14.2 4.1c-2.34 0-3.94 1.43-3.94 4.05v2.35H7.75v3h2.5V21h3.25Z" />
      </svg>
    ),
  },
  {
    name: "YouTube",
    href: "https://www.youtube.com/@MirFarukRimaFoundation",
    hoverClass: "hover:border-[#FF0000] hover:bg-[#FF0000] hover:text-white hover:shadow-[#FF0000]/40",
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5" aria-hidden="true">
        <path d="M21.6 7.2s-.21-1.5-.87-2.16c-.83-.87-1.76-.87-2.19-.92C15.44 4 12 4 12 4h-.01s-3.44 0-6.55.12c-.43.05-1.36.05-2.19.92C2.6 5.7 2.4 7.2 2.4 7.2S2.18 8.96 2.18 10.72v1.55C2.18 14.03 2.4 15.8 2.4 15.8s.2 1.5.86 2.16c.83.87 1.92.84 2.4.93 1.75.17 7.34.22 7.34.22s3.44-.01 6.55-.13c.43-.05 1.36-.05 2.19-.92.66-.66.87-2.16.87-2.16s.22-1.76.22-3.53v-1.55c0-1.76-.22-3.52-.22-3.52ZM9.94 14.3V8.7l5.4 2.81-5.4 2.79Z" />
      </svg>
    ),
  },
  {
    name: "LinkedIn",
    href: "https://www.linkedin.com/feed/",
    hoverClass: "hover:border-[#0A66C2] hover:bg-[#0A66C2] hover:text-white hover:shadow-[#0A66C2]/40",
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5" aria-hidden="true">
        <path d="M6.94 8.5H3.56V20h3.38V8.5ZM5.25 3.25a1.96 1.96 0 1 0 0 3.92 1.96 1.96 0 0 0 0-3.92ZM20.44 20h-3.37v-5.93c0-1.41-.03-3.23-1.97-3.23-1.97 0-2.27 1.54-2.27 3.13V20H9.46V8.5h3.24v1.57h.05c.45-.85 1.55-1.75 3.2-1.75 3.42 0 4.5 2.25 4.5 5.17V20Z" />
      </svg>
    ),
  },
];

function SocialLinks({ label, className = "" }) {
  return (
    <div className={`flex items-center gap-3 ${className}`}>
      {label ? (
        <span className="sr-only">{label}</span>
      ) : null}
      {SOCIAL_LINKS.map((social) => (
        <a
          key={social.name}
          href={social.href}
          target="_blank"
          rel="noreferrer noopener"
          aria-label={social.name}
          title={social.name}
          className={`flex h-10 w-10 items-center justify-center rounded-full border border-white/15 bg-white/5 text-slate-200 shadow-lg shadow-black/10 backdrop-blur-sm transition duration-200 hover:-translate-y-0.5 hover:shadow-xl ${social.hoverClass}`}
        >
          {social.icon}
        </a>
      ))}
    </div>
  );
}

export function SiteFooter() {
  const { copy } = useSiteLocale();
  const { brand, contact, footer, members, registration } = copy;
  const year = new Date().getFullYear();

  // Brand name shown on two lines: everything before the last word, then the
  // last word ("Foundation" / "ফাউন্ডেশন" / "Fonden") on its own line.
  const brandNameWords = brand.name.split(" ");
  const brandNameLast = brandNameWords.pop();
  const brandNameFirst = brandNameWords.join(" ");

  return (
    <footer className="relative overflow-hidden bg-[linear-gradient(135deg,#0e4a5e_0%,#1e293b_52%,#1a6f61_100%)] text-white">
      <div className="absolute inset-x-0 top-0 h-px bg-[linear-gradient(90deg,_transparent,_rgba(34,211,238,0.45),_transparent)]" />
      <div className="absolute left-[-10rem] top-[-8rem] h-72 w-72 rounded-full bg-cyan-300/10 blur-3xl" />
      <div className="absolute right-[-8rem] bottom-[-10rem] h-80 w-80 rounded-full bg-teal-300/10 blur-3xl" />

      <div className="relative mx-auto w-full max-w-7xl px-6 py-12 lg:px-8">
        <div className="grid gap-10 lg:grid-cols-[1.2fr_0.75fr_0.85fr_0.95fr_1.15fr]">
          <div className="max-w-md">
            <div className="flex items-center gap-4">
              <span className="flex h-16 w-16 shrink-0 items-center justify-center rounded-[1.5rem] border border-white/10 bg-white p-2 shadow-2xl shadow-cyan-950/40">
                <Image
                  src="/logo.png"
                  alt={brand.name}
                  width={56}
                  height={56}
                  className="h-12 w-auto"
                />
              </span>
              <div>
                <p className="text-lg font-semibold leading-7 text-white">
                  <span className="block">{brandNameFirst}</span>
                  <span className="block">{brandNameLast}</span>
                </p>

              </div>
            </div>

            <p className="mt-6 text-sm leading-7 text-slate-300">
              {footer.note}
            </p>

            <SocialLinks label={footer.contactLabel} className="mt-6 hidden sm:flex" />
          </div>

          <div>
            <p className="text-xs font-semibold tracking-[0.28em] text-cyan-300 uppercase">
              {footer.navigationLabel}
            </p>
            <nav className="mt-5 grid gap-3">
              {footer.navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="text-sm font-medium text-slate-300 transition hover:text-cyan-200"
                >
                  {item.label}
                </Link>
              ))}
            </nav>
          </div>

          <div>
            <p className="text-xs font-semibold tracking-[0.28em] text-cyan-300 uppercase">
              {footer.registrationLabel}
            </p>
            <nav className="mt-5 grid gap-3">
              {registration.options.map((item) => (
                <Link
                  key={item.id}
                  href={`/register#${item.id}`}
                  className="text-sm font-medium text-slate-300 transition hover:text-cyan-200"
                >
                  {item.title}
                </Link>
              ))}
            </nav>
          </div>

          <div>
            <p className="text-xs font-semibold tracking-[0.28em] text-cyan-300 uppercase">
              {members.menuLabel}
            </p>
            <nav className="mt-5 grid gap-3">
              {members.items.map((item) => (
                <Link
                  key={item.id}
                  href={item.href}
                  className="text-sm font-medium text-slate-300 transition hover:text-cyan-200"
                >
                  {item.title}
                </Link>
              ))}
            </nav>
          </div>

          <div>
            <p className="text-xs font-semibold tracking-[0.28em] text-cyan-300 uppercase">
              {footer.contactLabel}
            </p>
            <div className="mt-5 grid gap-4">
              {contact.channels.map((item) => {
                const valueClassName =
                  "mt-1 block break-words text-sm font-semibold leading-6 text-white transition";

                return (
                  <div key={item.title}>
                    <p className="text-xs font-semibold text-slate-400">
                      {item.title}
                    </p>
                    {item.href ? (
                      <a
                        href={item.href}
                        className={`${valueClassName} hover:text-cyan-200`}
                      >
                        {item.value}
                      </a>
                    ) : (
                      <p className={valueClassName}>{item.value}</p>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        <SocialLinks
          label={footer.contactLabel}
          className="mt-4 justify-center border-t border-white/10 pt-4 sm:hidden"
        />

        <div className="mt-2 border-t-0 pt-2 text-xs text-slate-400 sm:mt-10 sm:border-t sm:border-white/10 sm:pt-6">
          {/* Mobile: centred lines. Desktop: split row (left / right). */}
          <div className="space-y-0.5 text-center sm:flex sm:w-full sm:items-center sm:justify-between sm:gap-3 sm:space-y-0 sm:text-left">
            <p className="leading-5">
              {/* &copy; {year} {brand.name} */}
              {/* On mobile the © hangs outside the name so the name itself
                  centres on the same axis as the lines below. */}
              <span className="relative sm:static">
                <span className="absolute right-full pr-1 sm:static sm:pr-0">
                  &copy;{" "}
                </span>
                {brand.name}
              </span>
            </p>
            {footer.legal ? (
              <p className="leading-5 sm:text-right">
                <span className="block sm:inline">{footer.legal[1]}</span>
                <span className="hidden sm:inline"> | </span>
                {/* full text on desktop, short version on mobile */}
                <span className="hidden sm:inline">{footer.legal[3]}</span>
                <span className="block sm:hidden">{footer.legalShortRjsc}</span>
              </p>
            ) : (
              <p>{footer.note}</p>
            )}
          </div>
        </div>
      </div>
    </footer>
  );
}
