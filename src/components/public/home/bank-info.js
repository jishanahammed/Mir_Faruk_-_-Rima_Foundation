"use client";

import Image from "next/image";
import { useState } from "react";
import { useSiteLocale } from "@/components/public/providers/locale-provider";
import { resolveModalCopy } from "@/components/public/donate/donate-bank-info-modal";
import { DonationTransactionQueryForm } from "@/components/public/donate/donation-transaction-query-form";

// Ordered the way someone fills in a transfer form: who the account belongs to,
// then the numbers they actually type, then the bank and branch behind them.
const BANK_DETAILS = [
  { label: "Account Name", value: "MIR FARUK & RIMA FOUNDATION", copyable: true },
  { label: "Account Number", value: "1301000680242", copyable: true, mono: true },
  { label: "Bank", value: "Mutual Trust Bank PLC" },
  { label: "Branch", value: "Meradia Sub-Branch" },
  { label: "Routing Number", value: "145273976", copyable: true, mono: true },
  { label: "SWIFT / BIC", value: "MTBLBDDH", copyable: true, mono: true },
];

// Networks the Bangla QR accepts. These appear only as logos inside the poster,
// so naming them keeps the capability readable as text and to screen readers.
const QR_NETWORKS = ["Mastercard", "Visa", "UnionPay", "NPSB", "TakaPay"];

function CopyButton({ value, label }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Clipboard unavailable (e.g. non-secure context) — silently ignore.
    }
  };

  return (
    <button
      type="button"
      onClick={handleCopy}
      aria-label={`Copy ${label}`}
      className={`inline-flex shrink-0 items-center gap-1.5 rounded-lg border px-2.5 py-1.5 text-[0.7rem] font-semibold transition focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400 focus-visible:ring-offset-2 ${copied
        ? "border-teal-200 bg-teal-50 text-teal-700"
        : "border-slate-200 bg-white text-slate-500 hover:border-cyan-300 hover:bg-cyan-50 hover:text-cyan-700"
        }`}
    >
      {copied ? (
        <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2.2" className="h-3.5 w-3.5">
          <path d="m5 10.5 3.2 3.2L15 7" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      ) : (
        <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.7" className="h-3.5 w-3.5">
          <rect x="7.2" y="7.2" width="9" height="9" rx="2" />
          <path d="M12.8 4.5H5.8a1.3 1.3 0 0 0-1.3 1.3v7" strokeLinecap="round" />
        </svg>
      )}
      {copied ? "Copied" : "Copy"}
    </button>
  );
}

// Donation details for the foundation's MTB account. Two real payment routes
// sit side by side — typing the numbers, or scanning the Bangla QR — so the
// labelled divider between them marks an either/or rather than decoration.
// On phones the QR leads, since scanning is faster with the device in hand.
export function BankInfo() {
  const { copy: siteCopy } = useSiteLocale();
  const copy = resolveModalCopy(siteCopy?.htmlLang);

  return (
    <section
      id="bank-info"
      className="relative overflow-hidden px-5 py-12 sm:px-6 lg:px-8 lg:py-16"
    >
      <div className="absolute inset-x-0 top-0 h-px bg-[linear-gradient(90deg,_transparent,_rgba(8,145,178,0.35),_transparent)]" />
      <div className="absolute left-[-6rem] bottom-8 h-56 w-56 rounded-full bg-cyan-100/60 blur-3xl" />
      <div className="absolute right-[-5rem] top-10 h-48 w-48 rounded-full bg-amber-100/55 blur-3xl" />

      <div className="relative mx-auto max-w-5xl">
        <div className="mx-auto max-w-xl space-y-3 text-center">
          <p className="text-xs font-semibold tracking-[0.32em] text-cyan-700 uppercase">
            Donate via Bank
          </p>
          <h2 className="text-2xl font-semibold leading-tight text-balance sm:text-3xl">
            <span className="bg-[linear-gradient(135deg,_#0f172a_0%,_#0f766e_54%,_#0891b2_100%)] bg-clip-text text-transparent">
              Bank Account Information
            </span>
          </h2>
          <p className="text-sm leading-7 text-slate-600">
            Transfer to our official account, or scan the Bangla QR with any
            banking app. Every detail below can be copied with one tap.
          </p>
        </div>

        <div className="mt-10 grid items-stretch gap-5 lg:grid-cols-2 lg:gap-5">
          {/* Route 1 — type the numbers */}
          <div className="order-2 flex flex-col overflow-hidden rounded-3xl border border-slate-200/80 bg-white shadow-[0_18px_50px_-18px_rgba(15,23,42,0.28)] lg:order-1">
            <div className="relative overflow-hidden bg-[linear-gradient(135deg,_#0f172a_0%,_#134e4a_58%,_#155e75_100%)] px-6 py-4">
              <div className="absolute right-[-2rem] top-[-2.5rem] h-28 w-28 rounded-full bg-cyan-400/20 blur-2xl" aria-hidden="true" />
              <div className="relative flex items-center justify-between gap-4">
                <Image
                  src="/footer-logo.webp"
                  alt="Mutual Trust Bank PLC"
                  width={297}
                  height={60}
                  className="h-8 w-auto"
                />
                <span className="shrink-0 rounded-full border border-cyan-300/40 bg-cyan-400/10 px-3 py-1 text-[0.6rem] font-semibold uppercase tracking-[0.18em] text-cyan-100">
                  Official
                </span>
              </div>
            </div>

            {/* One row per field. A single column keeps every label, value and
                button on the same left edge — the two-column version left odd
                gaps whenever a value wrapped onto a second line. */}
            <dl className="flex flex-1 flex-col divide-y divide-slate-100">
              {BANK_DETAILS.map((item) => (
                <div
                  key={item.label}
                  className="flex flex-1 items-center justify-between gap-4 px-6 py-3"
                >
                  <div className="min-w-0">
                    <dt className="text-[0.62rem] font-semibold uppercase tracking-[0.18em] text-slate-400">
                      {item.label}
                    </dt>
                    <dd
                      className={`mt-1 break-words font-semibold text-slate-900 ${item.mono
                        ? "font-mono text-[0.95rem] tracking-wide tabular-nums"
                        : "text-[0.95rem]"
                        }`}
                    >
                      {item.value}
                    </dd>
                  </div>
                  {item.copyable ? <CopyButton value={item.value} label={item.label} /> : null}
                </div>
              ))}
            </dl>
          </div>

          {/* Divider — a real either/or, shown where the two routes stack */}
          <div className="order-1 flex items-center gap-4 lg:hidden" aria-hidden="true">
            <span className="h-px flex-1 bg-slate-200" />
            <span className="text-[0.62rem] font-semibold uppercase tracking-[0.24em] text-slate-400">
              or scan
            </span>
            <span className="h-px flex-1 bg-slate-200" />
          </div>

          {/* Route 2 — scan. The poster is fully branded already, so it sits on
              a plain mat instead of inside a second competing frame. */}
          <div className="order-first flex lg:order-2">
            <figure className="flex h-full w-full flex-col overflow-hidden rounded-3xl border border-slate-200/80 bg-white shadow-[0_18px_50px_-18px_rgba(15,23,42,0.28)]">
              <div className="flex items-center justify-between gap-4 border-b border-slate-100 px-6 py-4">
                <div>
                  <p className="text-[0.62rem] font-semibold uppercase tracking-[0.18em] text-slate-400">
                    Bangla QR
                  </p>
                  <p className="mt-1 text-[0.95rem] font-semibold text-slate-900">
                    Scan to pay
                  </p>
                </div>
                <span className="shrink-0 rounded-full border border-teal-200 bg-teal-50 px-3 py-1 text-[0.6rem] font-semibold uppercase tracking-[0.18em] text-teal-700">
                  Instant
                </span>
              </div>

              <div className="flex flex-1 items-center justify-center px-5 py-4">
                <Image
                  src="/qr.png"
                  alt="Mutual Trust Bank Bangla QR code for Mir Faruk & Rima Foundation. Merchant ID 105100105101199."
                  width={1680}
                  height={2380}
                  sizes="(min-width: 640px) 20rem, 76vw"
                  className="mx-auto h-auto w-auto max-h-[28rem] max-w-full rounded-2xl"
                />
              </div>

              <figcaption className="border-t border-slate-100 px-6 py-4">
                <p className="text-center text-sm leading-6 text-slate-600">
                  Open any banking or MFS app, scan, and the foundation&rsquo;s
                  account fills in automatically.
                </p>
                <ul className="mt-3 flex flex-wrap justify-center gap-1">
                  {QR_NETWORKS.map((network) => (
                    <li
                      key={network}
                      className="rounded-md border border-slate-200 bg-slate-50 px-1.5 py-0.5 text-[0.58rem] font-semibold uppercase tracking-[0.04em] text-slate-500"
                    >
                      {network}
                    </li>
                  ))}
                </ul>
              </figcaption>
            </figure>
          </div>
        </div>

        {/* Reporting a transaction follows the payment options, since a donor
            only has details to send once they have actually given. */}
        <div className="mt-6 overflow-hidden rounded-3xl border border-slate-200/80 bg-white shadow-[0_18px_50px_-18px_rgba(15,23,42,0.28)]">
          <div className="border-b border-slate-100 px-6 py-4">
            <p className="text-[0.62rem] font-semibold uppercase tracking-[0.18em] text-slate-400">
              {copy.transaction.heading}
            </p>
            <p className="mt-1 text-sm leading-6 text-slate-600">{copy.transaction.intro}</p>
          </div>
          <div className="px-6 py-5">
            <DonationTransactionQueryForm copy={copy} />
          </div>
        </div>
      </div>
    </section>
  );
}
