"use client";

import Image from "next/image";
import Link from "next/link";
import { useSiteLocale } from "@/components/public/providers/locale-provider";

export function SiteFooter() {
  const { copy } = useSiteLocale();
  const { brand, contact, footer, header, members, registration } = copy;
  const year = new Date().getFullYear();

  // Brand name shown on two lines: everything before the last word, then the
  // last word ("Foundation" / "ফাউন্ডেশন" / "Fonden") on its own line.
  const brandNameWords = brand.name.split(" ");
  const brandNameLast = brandNameWords.pop();
  const brandNameFirst = brandNameWords.join(" ");

  return (
    <footer className="relative overflow-hidden bg-[linear-gradient(135deg,_#083344_0%,_#0f172a_52%,_#134e4a_100%)] text-white">
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
          </div>

          <div>
            <p className="text-xs font-semibold tracking-[0.28em] text-cyan-300 uppercase">
              {footer.navigationLabel}
            </p>
            <nav className="mt-5 grid gap-3">
              {header.navItems.map((item) => (
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

        <div className="mt-10 border-t border-white/10 pt-6 text-xs text-slate-400">
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
