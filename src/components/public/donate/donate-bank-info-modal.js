"use client";

import Image from "next/image";
import { useEffect, useState } from "react";

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

const MOBILE_BANKING = [
  { label: "bKash (Personal)", value: "+880 1771-528299", copyable: true, mono: true },
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
      className={`inline-flex shrink-0 items-center gap-1 rounded-full border px-2.5 py-1 text-[0.6rem] font-semibold uppercase tracking-widest transition sm:px-3 sm:text-[0.68rem] sm:tracking-[0.12em] ${
        copied
          ? "border-teal-200 bg-teal-50 text-teal-700"
          : "border-slate-200 bg-white text-slate-500 hover:border-cyan-200 hover:bg-cyan-50 hover:text-cyan-800"
      }`}
    >
      {copied ? "Copied" : "Copy"}
    </button>
  );
}

function DetailRow({ item, highlight = false }) {
  return (
    <div
      className={`flex flex-col gap-2 px-4 py-3 sm:flex-row sm:items-center sm:justify-between sm:gap-3 sm:px-6 sm:py-3.5 ${
        item.fullWidth ? "sm:col-span-2" : ""
      } ${highlight ? "bg-cyan-50/60" : "bg-white"}`}
    >
      <div className="min-w-0">
        <dt className="text-[0.6rem] font-semibold uppercase tracking-[0.16em] text-slate-400 sm:text-[0.65rem] sm:tracking-[0.2em]">
          {item.label}
        </dt>
        <dd
          className={`mt-1 break-all font-semibold text-slate-900 ${
            item.mono
              ? "font-mono text-[0.82rem] tracking-wide sm:text-[0.95rem]"
              : "text-[0.82rem] sm:text-sm"
          }`}
        >
          {item.value}
        </dd>
      </div>
      {item.copyable ? (
        <div className="self-start sm:shrink-0 sm:self-auto">
          <CopyButton value={item.value} />
        </div>
      ) : null}
    </div>
  );
}

function SectionHeading({ icon, children }) {
  return (
    <p className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.2em] text-cyan-700">
      <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-cyan-100 text-cyan-700">
        {icon}
      </span>
      {children}
    </p>
  );
}

function BankIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="h-3.5 w-3.5" aria-hidden="true">
      <path d="M3 21h18M4 21V10M20 21V10M2 10l10-6 10 6M6 10v11M10 10v11M14 10v11M18 10v11" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function PhoneIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="h-3.5 w-3.5" aria-hidden="true">
      <rect x="7" y="2" width="10" height="20" rx="2" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M11 18h2" strokeLinecap="round" />
    </svg>
  );
}

export function DonateBankInfoModal({ isOpen, onClose, project }) {
  useEffect(() => {
    if (!isOpen) {
      return;
    }

    const handleKeyDown = (event) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) {
    return null;
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center bg-slate-950/55 px-4 py-4 backdrop-blur-sm sm:items-center sm:py-8"
      role="dialog"
      aria-modal="true"
      aria-labelledby="donate-bank-info-title"
    >
      <button
        type="button"
        className="absolute inset-0 cursor-default"
        aria-label="Close donation details"
        onClick={onClose}
      />

      <div className="relative flex max-h-[94vh] w-full max-w-lg flex-col overflow-hidden rounded-t-3xl border border-white/70 bg-white shadow-2xl shadow-slate-950/30 sm:max-h-[92vh] sm:rounded-3xl">
        <div className="relative shrink-0 overflow-hidden bg-[linear-gradient(135deg,#0f172a_0%,#134e4a_55%,#155e75_100%)] px-5 py-5 sm:px-8 sm:py-6">
          <div
            className="pointer-events-none absolute right-[-2rem] top-[-2rem] h-28 w-28 rounded-full bg-cyan-400/20 blur-2xl"
            aria-hidden="true"
          />
          <div className="relative flex items-start justify-between gap-3 sm:gap-4">
            <div className="min-w-0">
              <p className="text-[0.65rem] font-bold tracking-[0.2em] text-cyan-200 uppercase sm:text-xs sm:tracking-[0.24em]">
                Support This Project
              </p>
              <h2
                id="donate-bank-info-title"
                className="mt-2 text-lg font-semibold text-white sm:text-2xl"
              >
                Donation Details
              </h2>
              {project ? (
                <p className="mt-2 max-w-sm text-xs leading-6 text-cyan-100/85 sm:text-sm">
                  Your contribution will support{" "}
                  <span className="font-semibold text-white">{project}</span>.
                </p>
              ) : null}
            </div>
            <button
              type="button"
              className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-white/25 bg-white/10 text-lg leading-none text-white transition hover:border-cyan-200 hover:bg-white/20 sm:h-10 sm:w-10 sm:text-xl"
              aria-label="Close donation details"
              onClick={onClose}
            >
              x
            </button>
          </div>
        </div>

        <div className="min-h-0 flex-1 overflow-y-auto px-4 py-5 sm:px-7 sm:py-6">
          <div className="flex gap-3 rounded-2xl border border-cyan-100 bg-cyan-50/70 p-4 text-sm leading-6 text-slate-700">
            <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-cyan-600 text-xs font-bold text-white">
              1
            </span>
            <p>
              Use your registered mobile number as the <strong>Donation Reference ID</strong> when
              sending your contribution, so we can accurately record it against your account.
            </p>
          </div>

          <div className="mt-6">
            <SectionHeading icon={<BankIcon />}>Bank Transfer</SectionHeading>
            <div className="mt-3 overflow-hidden rounded-2xl border border-slate-200 shadow-sm">
              <div className="relative flex flex-wrap items-center justify-between gap-3 bg-[linear-gradient(135deg,#0f172a_0%,#134e4a_55%,#155e75_100%)] px-4 py-4 sm:flex-nowrap sm:gap-4 sm:px-6">
                <Image
                  src="/footer-logo.webp"
                  alt="Mutual Trust Bank PLC"
                  width={297}
                  height={60}
                  className="h-7 w-auto sm:h-9"
                />
                <span className="shrink-0 rounded-full border border-cyan-300/40 bg-cyan-400/10 px-2.5 py-1 text-[0.58rem] font-semibold uppercase tracking-[0.15em] text-cyan-100 sm:px-3 sm:text-[0.62rem] sm:tracking-[0.2em]">
                  Official Account
                </span>
              </div>
              <dl className="grid gap-px bg-slate-100 sm:grid-cols-2">
                {BANK_DETAILS.map((item) => (
                  <DetailRow key={item.label} item={item} highlight={item.label === "Account No"} />
                ))}
              </dl>
            </div>
          </div>

          <div className="mt-6">
            <SectionHeading icon={<PhoneIcon />}>Mobile Banking</SectionHeading>
            <div className="mt-3 overflow-hidden rounded-2xl border border-slate-200 shadow-sm">
              <dl className="grid gap-px bg-slate-100">
                {MOBILE_BANKING.map((item) => (
                  <DetailRow key={item.label} item={item} highlight />
                ))}
              </dl>
            </div>
          </div>

          <div className="mt-6 flex gap-3 rounded-2xl border border-slate-200 bg-slate-50 p-4 text-sm leading-6 text-slate-600">
            <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-slate-300 text-xs font-bold text-slate-700">
              2
            </span>
            <p>
              After sending your donation, our team will record the transaction and email you a
              confirmation. Need help? Contact{" "}
              <a href="mailto:support@farukrimafoundation.org" className="font-semibold text-cyan-700 hover:text-cyan-900">
                support@farukrimafoundation.org
              </a>{" "}
              or call{" "}
              <a href="tel:+8801771528299" className="font-semibold text-cyan-700 hover:text-cyan-900">
                +88 01771-528299
              </a>
              .
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="mt-6 w-full rounded-full border border-slate-200 bg-white px-6 py-3.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
