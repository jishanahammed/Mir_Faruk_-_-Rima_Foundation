"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { fetchProjectAssistancesAction } from "@/app/(public)/actions";
import { useSiteLocale } from "@/components/public/providers/locale-provider";

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

function HandHeartIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="h-3.5 w-3.5" aria-hidden="true">
      <path d="M12 21s-7.5-4.9-10.2-9.3C.4 9.1 1.2 5.6 4.2 4.2c2.1-1 4.4-.3 5.8 1.4L12 7.7l2-2.1c1.4-1.7 3.7-2.4 5.8-1.4 3 1.4 3.8 4.9 2.4 7.5C19.5 16.1 12 21 12 21Z" />
    </svg>
  );
}

function pick(en, bn, dk, locale) {
  if (locale === "BN") return bn || en;
  if (locale === "DK") return dk || en;
  return en;
}

function fmtTaka(n) {
  return "৳" + Number(n ?? 0).toLocaleString("en-BD");
}

const SUPPORT_MODE_LABEL = {
  Cash: "Cash",
  InKind: "In-Kind",
  Service: "Service",
  Hybrid: "Hybrid",
};

function AssistanceItem({ item, locale }) {
  const name = pick(item.nameEn, item.nameBn, item.nameDk, locale);
  const description = pick(item.descriptionEn, item.descriptionBn, item.descriptionDk, locale);
  const typeName = pick(item.assistanceTypeNameEn, item.assistanceTypeNameBn, item.assistanceTypeNameDk, locale);
  const progress = Math.min(100, Number(item.progressPercent) || 0);

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm transition hover:border-cyan-200 hover:shadow-md">
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0">
          <h4 className="text-sm font-bold text-slate-900">{name}</h4>
          {typeName && (
            <span className="mt-1 inline-flex items-center rounded-full bg-cyan-50 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-cyan-700">
              {typeName}
            </span>
          )}
        </div>
        <span className="shrink-0 rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-bold text-slate-500">
          {SUPPORT_MODE_LABEL[item.supportMode] ?? item.supportMode}
        </span>
      </div>

      {description && (
        <p className="mt-2 whitespace-pre-wrap text-xs leading-5 text-slate-500">{description}</p>
      )}

      <div className="mt-3 h-1.5 w-full overflow-hidden rounded-full bg-slate-100">
        <div
          className="h-full rounded-full bg-[linear-gradient(90deg,#0f766e,#0891b2)] transition-all duration-500"
          style={{ width: `${progress}%` }}
        />
      </div>
      <div className="mt-1.5 flex items-center justify-between text-[11px] font-semibold">
        <span className="text-emerald-700">{fmtTaka(item.totalCollectedAmount)} raised</span>
        <span className="text-slate-400">of {fmtTaka(item.targetAmount)}</span>
      </div>
      <p className="mt-1 text-[10px] font-semibold uppercase tracking-wide text-slate-400">
        For: {item.targetBeneficiaryType}
      </p>
    </div>
  );
}

function useProjectAssistances(projectId) {
  const [assistances, setAssistances] = useState(null);

  useEffect(() => {
    if (!projectId) {
      setAssistances(null);
      return undefined;
    }

    let cancelled = false;
    setAssistances(null);
    fetchProjectAssistancesAction(projectId).then((result) => {
      if (!cancelled) setAssistances(Array.isArray(result) ? result : []);
    });

    return () => {
      cancelled = true;
    };
  }, [projectId]);

  return assistances;
}

function AssistanceList({ assistances, locale }) {
  if (assistances === null) {
    return (
      <div className="space-y-3">
        {[0, 1].map((i) => (
          <div key={i} className="h-24 animate-pulse rounded-2xl bg-slate-200/70" />
        ))}
      </div>
    );
  }

  if (assistances.length === 0) {
    return (
      <p className="text-xs leading-5 text-slate-400">
        No specific assistance items are listed for this project yet.
      </p>
    );
  }

  return (
    <div className="space-y-3">
      {assistances.map((item) => (
        <AssistanceItem key={item.id} item={item} locale={locale} />
      ))}
    </div>
  );
}

function AssistanceHeading() {
  return (
    <p className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.2em] text-cyan-700">
      <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-cyan-100 text-cyan-700">
        <HandHeartIcon />
      </span>
      Project Assistance
    </p>
  );
}

// Mobile: rendered inline in the main scroll column, after bank info. Desktop (sm+): its
// own scrollable side panel. Same data/hook, two layouts via the `variant` prop.
function AssistanceSection({ projectId, variant }) {
  const { locale } = useSiteLocale();
  const assistances = useProjectAssistances(projectId);

  if (!projectId) return null;

  if (variant === "inline") {
    return (
      <div className="mt-6 sm:hidden">
        <AssistanceHeading />
        <div className="mt-4">
          <AssistanceList assistances={assistances} locale={locale} />
        </div>
      </div>
    );
  }

  return (
    <div className="hidden min-h-0 w-76 shrink-0 overflow-y-auto border-l border-slate-100 bg-slate-50/60 px-5 py-6 sm:block">
      <AssistanceHeading />
      <div className="mt-4">
        <AssistanceList assistances={assistances} locale={locale} />
      </div>
    </div>
  );
}

export function DonateBankInfoModal({ isOpen, onClose, project, projectId }) {
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

      <div
        className={`relative flex max-h-[94vh] w-full flex-col overflow-hidden rounded-t-3xl border border-white/70 bg-white shadow-2xl shadow-slate-950/30 sm:max-h-[92vh] sm:flex-row sm:rounded-3xl ${
          projectId ? "max-w-3xl" : "max-w-lg"
        }`}
      >
        <div className="flex min-h-0 flex-1 flex-col">
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

            <AssistanceSection projectId={projectId} variant="inline" />

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

        <AssistanceSection projectId={projectId} variant="panel" />
      </div>
    </div>
  );
}
