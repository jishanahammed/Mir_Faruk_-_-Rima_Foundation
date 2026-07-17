"use client";

import Image from "next/image";
import { useState } from "react";

const BANK_DETAILS = [
  { label: "Bank Name", value: "Mutual Trust Bank PLC" },
  { label: "Branch Name", value: "Meradia Sub-Branch", copyable: true, mono: true },
  {
    label: "Account Name",
    value: "MIR FARUK & RIMA FOUNDATION",
    copyable: true,
    nowrap: true,
    fullWidth: true,
  },
  { label: "Account No", value: "1301000680242", copyable: true, mono: true },
  { label: "Routing Number", value: "145273976", copyable: true, mono: true },
  { label: "SWIFT Code", value: "MTBLBDDH", copyable: true, mono: true, fullWidth: true },
];

function CopyButton({ value }) {
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
      aria-label={`Copy ${value}`}
      className={`inline-flex shrink-0 items-center gap-1 rounded-full border px-3 py-1 text-[0.68rem] font-semibold uppercase tracking-[0.12em] transition ${copied
        ? "border-teal-200 bg-teal-50 text-teal-700"
        : "border-slate-200 bg-white text-slate-500 hover:border-cyan-200 hover:bg-cyan-50 hover:text-cyan-800"
        }`}
    >
      {copied ? "Copied" : "Copy"}
    </button>
  );
}

// Donation bank details card. The dark header band exists because the MTB
// footer logo has white lettering and needs a dark surface to stay legible.
export function BankInfo() {
  return (
    <section
      id="bank-info"
      className="relative overflow-hidden px-5 py-14 sm:px-6 lg:px-8 lg:py-20"
    >
      <div className="absolute inset-x-0 top-0 h-px bg-[linear-gradient(90deg,_transparent,_rgba(8,145,178,0.35),_transparent)]" />
      <div className="absolute left-[-6rem] bottom-8 h-56 w-56 rounded-full bg-cyan-100/60 blur-3xl" />
      <div className="absolute right-[-5rem] top-10 h-48 w-48 rounded-full bg-amber-100/55 blur-3xl" />

      <div className="relative mx-auto max-w-2xl">
        <div className="mx-auto max-w-xl space-y-3 text-center">
          <p className="text-xs font-semibold tracking-[0.32em] text-cyan-700 uppercase">
            Donate via Bank
          </p>
          <h2 className="text-2xl font-semibold leading-tight sm:text-3xl">
            <span className="bg-[linear-gradient(135deg,_#0f172a_0%,_#0f766e_54%,_#0891b2_100%)] bg-clip-text text-transparent">
              Bank Account Information
            </span>
          </h2>
          <p className="text-sm leading-7 text-slate-600">
            Send your contribution directly to our official bank account. Every
            detail below can be copied with one tap.
          </p>
        </div>

        <div className="mt-10 overflow-hidden rounded-[2rem] border border-white/70 bg-white/90 shadow-[0_30px_100px_rgba(15,23,42,0.14)] ring-1 ring-slate-200/70 backdrop-blur-xl">
          <div className="relative bg-[linear-gradient(135deg,_#0f172a_0%,_#134e4a_55%,_#155e75_100%)] px-6 py-6 sm:px-8">
            <div className="absolute right-[-2rem] top-[-2rem] h-28 w-28 rounded-full bg-cyan-400/20 blur-2xl" aria-hidden="true" />
            <div className="absolute inset-x-8 bottom-0 h-px bg-[linear-gradient(90deg,_transparent,_rgba(103,232,249,0.5),_transparent)]" aria-hidden="true" />

            <div className="relative flex flex-wrap items-center justify-between gap-4">
              <Image
                src="/footer-logo.webp"
                alt="Mutual Trust Bank PLC"
                width={297}
                height={60}
                className="h-9 w-auto sm:h-10"
              />
              <span className="rounded-full border border-cyan-300/40 bg-cyan-400/10 px-3 py-1 text-[0.65rem] font-semibold uppercase tracking-[0.22em] text-cyan-100">
                Official Account
              </span>
            </div>
          </div>

          <dl className="grid gap-px bg-slate-100 sm:grid-cols-2">
            {BANK_DETAILS.map((item) => (
              <div
                key={item.label}
                className={`flex items-center justify-between gap-3 bg-white px-6 py-4 sm:px-8 ${item.fullWidth ? "sm:col-span-2" : ""
                  }`}
              >
                <div>
                  <dt className="text-[0.68rem] font-semibold uppercase tracking-[0.22em] text-slate-400">
                    {item.label}
                  </dt>
                  <dd className={`mt-1 font-semibold text-slate-900 ${item.mono
                    ? "font-mono text-base tracking-wide"
                    : item.nowrap
                      ? "whitespace-nowrap text-[0.78rem] tracking-tight sm:text-base sm:tracking-normal"
                      : "text-sm"
                    }`}>
                    {item.value}
                  </dd>
                </div>
                {item.copyable ? <CopyButton value={item.value} /> : null}
              </div>
            ))}
          </dl>
        </div>
      </div>
    </section>
  );
}
