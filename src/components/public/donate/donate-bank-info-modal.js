"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { fetchProjectAssistancesAction } from "@/app/(public)/actions";
import { useSiteLocale } from "@/components/public/providers/locale-provider";
import { DonationTransactionQueryForm } from "@/components/public/donate/donation-transaction-query-form";

const modalCopy = {
  en: {
    eyebrow: "Support This Project",
    title: "Donation Details",
    contributionPrefix: "Your contribution will support",
    bankTransfer: "Bank Transfer",
    officialAccount: "Official Account",
    transaction: {
      heading: "Already Donated?",
      intro: "Send us your transaction details so we can match your payment and record it against your name.",
      name: "Full Name",
      email: "Email",
      mobile: "Mobile",
      reference: "Donor Reference ID",
      referenceHint: "If you are registered, add it so we can link this to your record.",
      message: "Transaction Details",
      messagePlaceholder: "Transaction ID, amount, date, and any other details…",
      submit: "Send Details",
      sending: "Sending…",
      sentTitle: "Details received",
      sentNote: "Our team will verify the transaction and record your contribution. Thank you.",
      error: "Could not send your details. Please try again.",
    },
    reference: {
      label: "Your Donation Reference ID",
      note: "Please quote this reference whenever you make a donation, so we can record your contribution correctly. We have also emailed it to you.",
      copy: "Copy",
      copied: "Copied",
    },
    qr: {
      heading: "Scan to Pay",
      panelLabel: "Quick Pay",
      badge: "Instant",
      note: "Open any banking or MFS app, scan the Bangla QR, and the foundation's account fills in automatically.",
    },
    afterNote: {
      badge: "1",
      text: "After sending your donation, our team will record the transaction and email you a confirmation. Need help? Contact",
      or: "or call",
    },
    verify: {
      title: "Verify Registration",
      note: "Already registered? Quote your Donation Reference ID when you give. Not yet? Register first to link your donation.",
      registerCta: "Register Now",
    },
    close: "Close",
    closeAria: "Close donation details",
  },
  bn: {
    eyebrow: "এই প্রকল্পে সহায়তা করুন",
    title: "দানের বিবরণ",
    contributionPrefix: "আপনার অনুদান সহায়তা করবে",
    bankTransfer: "ব্যাংক ট্রান্সফার",
    officialAccount: "অফিসিয়াল অ্যাকাউন্ট",
    transaction: {
      heading: "ইতিমধ্যে দান করেছেন?",
      intro: "আপনার লেনদেনের তথ্য পাঠান, যাতে আমরা পেমেন্টটি মিলিয়ে আপনার নামে রেকর্ড করতে পারি।",
      name: "পূর্ণ নাম",
      email: "ইমেইল",
      mobile: "মোবাইল",
      reference: "ডোনার রেফারেন্স আইডি",
      referenceHint: "নিবন্ধিত হলে এটি দিন, যাতে আমরা আপনার রেকর্ডের সঙ্গে যুক্ত করতে পারি।",
      message: "লেনদেনের বিবরণ",
      messagePlaceholder: "ট্রানজেকশন আইডি, পরিমাণ, তারিখ এবং অন্যান্য তথ্য…",
      submit: "বিবরণ পাঠান",
      sending: "পাঠানো হচ্ছে…",
      sentTitle: "বিবরণ পাওয়া গেছে",
      sentNote: "আমাদের দল লেনদেনটি যাচাই করে আপনার অবদান রেকর্ড করবে। ধন্যবাদ।",
      error: "বিবরণ পাঠানো যায়নি। আবার চেষ্টা করুন।",
    },
    reference: {
      label: "আপনার ডোনেশন রেফারেন্স আইডি",
      note: "দান করার সময় এই রেফারেন্সটি উল্লেখ করুন, যাতে আমরা আপনার অবদান সঠিকভাবে রেকর্ড করতে পারি। এটি আপনার ইমেইলেও পাঠানো হয়েছে।",
      copy: "কপি",
      copied: "কপি হয়েছে",
    },
    qr: {
      heading: "স্ক্যান করে পেমেন্ট",
      panelLabel: "দ্রুত পেমেন্ট",
      badge: "তাৎক্ষণিক",
      note: "যেকোনো ব্যাংকিং বা এমএফএস অ্যাপ খুলে বাংলা কিউআর স্ক্যান করুন, ফাউন্ডেশনের অ্যাকাউন্ট স্বয়ংক্রিয়ভাবে যুক্ত হয়ে যাবে।",
    },
    afterNote: {
      badge: "১",
      text: "দান পাঠানোর পর, আমাদের দল লেনদেনটি রেকর্ড করে আপনাকে একটি নিশ্চিতকরণ ইমেইল পাঠাবে। সাহায্য প্রয়োজন? যোগাযোগ করুন",
      or: "অথবা কল করুন",
    },
    verify: {
      title: "নিবন্ধন যাচাই করুন",
      note: "ইতিমধ্যে নিবন্ধিত? দান করার সময় আপনার ডোনেশন রেফারেন্স আইডি উল্লেখ করুন। এখনও করেননি? আগে নিবন্ধন করুন।",
      registerCta: "এখনই নিবন্ধন করুন",
    },
    close: "বন্ধ করুন",
    closeAria: "দানের বিবরণ বন্ধ করুন",
  },
  da: {
    eyebrow: "Stot dette projekt",
    title: "Donationsoplysninger",
    contributionPrefix: "Dit bidrag vil stotte",
    bankTransfer: "Bankoverfoersel",
    officialAccount: "Officiel konto",
    transaction: {
      heading: "Har du allerede doneret?",
      intro: "Send dine transaktionsoplysninger, saa vi kan matche betalingen og registrere den i dit navn.",
      name: "Fulde navn",
      email: "E-mail",
      mobile: "Mobil",
      reference: "Donationsreferencenummer",
      referenceHint: "Er du registreret, saa angiv det, saa vi kan knytte det til din profil.",
      message: "Transaktionsoplysninger",
      messagePlaceholder: "Transaktions-id, beloeb, dato og andre oplysninger…",
      submit: "Send oplysninger",
      sending: "Sender…",
      sentTitle: "Oplysninger modtaget",
      sentNote: "Vores team verificerer transaktionen og registrerer dit bidrag. Tak.",
      error: "Oplysningerne kunne ikke sendes. Proev igen.",
    },
    reference: {
      label: "Dit donationsreferencenummer",
      note: "Angiv venligst denne reference, naar du donerer, saa vi kan registrere dit bidrag korrekt. Vi har ogsaa sendt den til din e-mail.",
      copy: "Kopier",
      copied: "Kopieret",
    },
    qr: {
      heading: "Scan og betal",
      panelLabel: "Hurtig betaling",
      badge: "Straks",
      note: "Aabn en bank- eller MFS-app, scan Bangla QR-koden, og fondens konto udfyldes automatisk.",
    },
    afterNote: {
      badge: "1",
      text: "Efter du har sendt din donation, registrerer vores team transaktionen og sender dig en bekraeftelse via e-mail. Brug for hjaelp? Kontakt",
      or: "eller ring til",
    },
    verify: {
      title: "Bekraeft registrering",
      note: "Allerede registreret? Angiv dit donationsreferencenummer, naar du giver. Ikke endnu? Registrer dig forst.",
      registerCta: "Registrer nu",
    },
    close: "Luk",
    closeAria: "Luk donationsoplysninger",
  },
};

/**
 * Shared so other surfaces (e.g. the public BankInfo section) can render the
 * same localized donation copy without duplicating the strings.
 */
export function resolveModalCopy(htmlLang) {
  if (htmlLang === "bn") return modalCopy.bn;
  if (htmlLang === "da" || htmlLang === "dk") return modalCopy.da;
  return modalCopy.en;
}

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
      className={`inline-flex shrink-0 items-center gap-1.5 rounded-lg border px-2.5 py-1.5 text-[0.65rem] font-semibold transition focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400 focus-visible:ring-offset-1 ${copied
        ? "border-teal-200 bg-teal-50 text-teal-700"
        : "border-slate-200 bg-white text-slate-500 hover:border-cyan-300 hover:bg-cyan-50 hover:text-cyan-700 hover:shadow-sm"
        }`}
    >
      {copied ? (
        <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2.2" className="h-3 w-3" aria-hidden="true">
          <path d="m5 10.5 3.2 3.2L15 7" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      ) : (
        <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.7" className="h-3 w-3" aria-hidden="true">
          <rect x="7.2" y="7.2" width="9" height="9" rx="2" />
          <path d="M12.8 4.5H5.8a1.3 1.3 0 0 0-1.3 1.3v7" strokeLinecap="round" />
        </svg>
      )}
      {copied ? "Copied" : "Copy"}
    </button>
  );
}

function DetailRow({ item, highlight = false }) {
  return (
    <div
      className={`flex flex-1 items-center justify-between gap-3 py-2 pr-4 transition-colors sm:pr-5 ${highlight
        ? "border-l-[3px] border-cyan-500 bg-cyan-50/70 pl-[calc(1rem-3px)] sm:pl-[calc(1.25rem-3px)]"
        : "bg-white pl-4 hover:bg-slate-50/70 sm:pl-5"
        }`}
    >
      <div className="min-w-0">
        <dt className={`text-[0.6rem] font-semibold uppercase tracking-[0.16em] ${highlight ? "text-cyan-700" : "text-slate-400"
          }`}>
          {item.label}
        </dt>
        <dd
          className={`mt-0.5 break-words font-semibold text-slate-900 ${item.mono
            ? `font-mono tracking-wide tabular-nums ${highlight ? "text-base sm:text-[1.05rem]" : "text-[0.85rem]"}`
            : "text-[0.85rem]"
            }`}
        >
          {item.value}
        </dd>
      </div>
      {item.copyable ? <CopyButton value={item.value} /> : null}
    </div>
  );
}

function SectionHeading({ icon, children }) {
  return (
    <p className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.2em] text-cyan-700">
      <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[linear-gradient(135deg,#0f766e,#0891b2)] text-white shadow-sm shadow-cyan-900/20">
        {icon}
      </span>
      <span className="shrink-0">{children}</span>
      <span className="h-px flex-1 bg-[linear-gradient(90deg,rgba(8,145,178,0.25),transparent)]" aria-hidden="true" />
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

function HandHeartIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="h-3.5 w-3.5" aria-hidden="true">
      <path d="M12 21s-7.5-4.9-10.2-9.3C.4 9.1 1.2 5.6 4.2 4.2c2.1-1 4.4-.3 5.8 1.4L12 7.7l2-2.1c1.4-1.7 3.7-2.4 5.8-1.4 3 1.4 3.8 4.9 2.4 7.5C19.5 16.1 12 21 12 21Z" />
    </svg>
  );
}

function QrIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="h-3.5 w-3.5" aria-hidden="true">
      <rect x="3.5" y="3.5" width="6" height="6" rx="1.2" />
      <rect x="14.5" y="3.5" width="6" height="6" rx="1.2" />
      <rect x="3.5" y="14.5" width="6" height="6" rx="1.2" />
      <path d="M14.5 14.5h3v3m3 0v3h-6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

// The MTB poster is fully branded on its own, so it sits on a plain white mat
// rather than inside a second competing frame. Height-capped so the portrait
// artwork (1680x2380) cannot drive the modal's height.
function QrPanel({ copy }) {
  return (
    <div className="order-first flex flex-col lg:order-2">
      <SectionHeading icon={<QrIcon />}>{copy.qr.heading}</SectionHeading>
      <figure className="mt-3 flex flex-1 flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="flex items-center justify-between gap-3 border-b border-slate-100 px-4 py-3 sm:px-5">
          <p className="text-[0.82rem] font-semibold text-slate-900 sm:text-sm">
            {copy.qr.panelLabel}
          </p>
          <span className="shrink-0 rounded-full border border-teal-200 bg-teal-50 px-2.5 py-1 text-[0.58rem] font-semibold uppercase tracking-[0.15em] text-teal-700">
            {copy.qr.badge}
          </span>
        </div>
        <div className="flex flex-1 items-center justify-center bg-[radial-gradient(circle_at_50%_30%,rgba(8,145,178,0.07),transparent_70%)] px-2 py-3 sm:px-3 sm:py-4">
          <Image
            src="/qr.png"
            alt="Mutual Trust Bank Bangla QR code for Mir Faruk & Rima Foundation. Merchant ID 105100105101199."
            width={1680}
            height={2380}
            sizes="(min-width: 640px) 20rem, 80vw"
            className="h-auto w-full max-w-[19rem] rounded-xl shadow-lg shadow-slate-900/15 ring-1 ring-slate-900/5 sm:max-h-[22rem] sm:w-auto sm:max-w-full"
          />
        </div>
        <figcaption className="border-t border-slate-100 px-4 py-3 text-center text-xs leading-5 text-slate-500 sm:px-5">
          {copy.qr.note}
        </figcaption>
      </figure>
    </div>
  );
}

function ReceiptIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="h-3.5 w-3.5" aria-hidden="true">
      <path d="M6 3.5h12v17l-2-1.4-2 1.4-2-1.4-2 1.4-2-1.4-2 1.4Z" strokeLinejoin="round" />
      <path d="M9.5 8.5h5M9.5 12h5" strokeLinecap="round" />
    </svg>
  );
}

function ShieldCheckIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="h-3.5 w-3.5" aria-hidden="true">
      <path d="M12 3l7 3v5c0 4.5-3 8.2-7 10-4-1.8-7-5.5-7-10V6l7-3Z" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M9 12l2 2 4-4" strokeLinecap="round" strokeLinejoin="round" />
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

/**
 * Shown right after a donor registers. The reference is the one thing they must
 * keep from this screen, so it leads the modal and can be copied in one tap.
 */
function DonationReferenceCard({ donorId, copy }) {
  const [copied, setCopied] = useState(false);

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(donorId);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Clipboard unavailable (e.g. non-secure context) — silently ignore.
    }
  }

  return (
    <div className="mb-5 overflow-hidden rounded-2xl border border-teal-200 bg-[linear-gradient(135deg,#f0fdfa,#ecfeff)] shadow-sm">
      <div className="flex flex-col items-center gap-3 px-5 py-5 text-center sm:px-6">
        <p className="text-[0.62rem] font-bold uppercase tracking-[0.22em] text-teal-700">
          {copy.reference.label}
        </p>

        <div className="flex items-center gap-2">
          <span className="font-mono text-3xl font-extrabold tracking-[0.12em] tabular-nums text-teal-900">
            {donorId}
          </span>
          <button
            type="button"
            onClick={handleCopy}
            aria-label={copy.reference.copy}
            className={`inline-flex shrink-0 items-center gap-1.5 rounded-lg border px-2.5 py-1.5 text-[0.65rem] font-semibold transition focus:outline-none focus-visible:ring-2 focus-visible:ring-teal-400 ${copied
              ? "border-teal-300 bg-teal-100 text-teal-800"
              : "border-teal-200 bg-white text-teal-700 hover:bg-teal-50"
              }`}
          >
            {copied ? (
              <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2.2" className="h-3 w-3" aria-hidden="true">
                <path d="m5 10.5 3.2 3.2L15 7" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            ) : (
              <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.7" className="h-3 w-3" aria-hidden="true">
                <rect x="7.2" y="7.2" width="9" height="9" rx="2" />
                <path d="M12.8 4.5H5.8a1.3 1.3 0 0 0-1.3 1.3v7" strokeLinecap="round" />
              </svg>
            )}
            {copied ? copy.reference.copied : copy.reference.copy}
          </button>
        </div>

        <p className="max-w-md text-xs leading-5 text-slate-600">
          {copy.reference.note}
        </p>
      </div>
    </div>
  );
}

export function DonateBankInfoModal({ isOpen, onClose, project, projectId, donorId }) {
  const { copy: siteCopy } = useSiteLocale();
  const copy = resolveModalCopy(siteCopy?.htmlLang);

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
      className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-slate-950/55 px-3 py-4 backdrop-blur-sm sm:items-center sm:px-4 sm:py-8"
      role="dialog"
      aria-modal="true"
      aria-labelledby="donate-bank-info-title"
    >
      <button
        type="button"
        className="absolute inset-0 cursor-default"
        aria-label={copy.closeAria}
        onClick={onClose}
      />

      <div
        className={`relative my-auto flex w-full max-w-full min-w-0 flex-col overflow-hidden rounded-3xl border border-white/70 bg-white shadow-2xl shadow-slate-950/30 sm:max-h-[92vh] sm:flex-row ${projectId ? "sm:max-w-6xl" : "sm:max-w-4xl"
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
                  {copy.eyebrow}
                </p>
                <h2
                  id="donate-bank-info-title"
                  className="mt-2 text-lg font-semibold text-white sm:text-2xl"
                >
                  {copy.title}
                </h2>
                {project ? (
                  <p className="mt-2 max-w-sm text-xs leading-6 text-cyan-100/85 sm:text-sm">
                    {copy.contributionPrefix}{" "}
                    <span className="font-semibold text-white">{project}</span>.
                  </p>
                ) : null}
              </div>
              <button
                type="button"
                className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-white/25 bg-white/10 text-white transition hover:rotate-90 hover:border-cyan-200 hover:bg-white/20 focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-300 sm:h-10 sm:w-10"
                aria-label={copy.closeAria}
                onClick={onClose}
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-4 w-4 sm:h-4.5 sm:w-4.5" aria-hidden="true">
                  <path d="M18 6 6 18M6 6l12 12" strokeLinecap="round" />
                </svg>
              </button>
            </div>
          </div>

          <div className="min-h-0 flex-1 px-4 py-5 sm:overflow-y-auto sm:px-7 sm:py-6">
            {donorId ? <DonationReferenceCard donorId={donorId} copy={copy} /> : null}

            <AssistanceSection projectId={projectId} variant="inline" />

            {!donorId && (
              <div className="flex flex-col gap-2.5 rounded-2xl border border-cyan-200 bg-cyan-50/60 px-4 py-3 sm:flex-row sm:items-center sm:justify-between sm:gap-3 sm:px-5">
                <div className="flex items-start gap-2.5">
                  <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-cyan-600 text-white">
                    <ShieldCheckIcon />
                  </span>
                  <p className="text-xs leading-5 text-slate-700">
                    <span className="mr-1 font-bold text-cyan-800">{copy.verify.title}:</span>
                    {copy.verify.note}
                  </p>
                </div>
                <Link
                  href="/register/donor"
                  className="inline-flex shrink-0 items-center justify-center gap-1.5 self-start rounded-full bg-[linear-gradient(135deg,#0f766e,#0891b2)] px-4 py-2 text-xs font-semibold text-white! shadow-md shadow-cyan-900/15 visited:text-white! hover:text-white! focus:text-white! active:text-white! transition hover:-translate-y-0.5 hover:shadow-lg sm:self-auto"
                >
                  {copy.verify.registerCta}
                  <span aria-hidden="true">&rarr;</span>
                </Link>
              </div>
            )}

            <div className="mt-6 grid items-stretch gap-5 lg:grid-cols-2">
              <div className="order-2 flex flex-col lg:order-1">
                <SectionHeading icon={<BankIcon />}>{copy.bankTransfer}</SectionHeading>
                <div className="mt-3 flex flex-1 flex-col overflow-hidden rounded-2xl border border-slate-200 shadow-sm">
                  <div className="relative flex flex-wrap items-center justify-between gap-3 bg-[linear-gradient(135deg,#0f172a_0%,#134e4a_55%,#155e75_100%)] px-4 py-4 sm:flex-nowrap sm:gap-4 sm:px-6">
                    <Image
                      src="/footer-logo.webp"
                      alt="Mutual Trust Bank PLC"
                      width={297}
                      height={60}
                      className="h-7 w-auto sm:h-9"
                    />
                    <span className="shrink-0 rounded-full border border-cyan-300/40 bg-cyan-400/10 px-2.5 py-1 text-[0.58rem] font-semibold uppercase tracking-[0.15em] text-cyan-100 sm:px-3 sm:text-[0.62rem] sm:tracking-[0.2em]">
                      {copy.officialAccount}
                    </span>
                  </div>
                  <dl className="flex flex-1 flex-col gap-px bg-slate-100">
                    {BANK_DETAILS.map((item) => (
                      <DetailRow key={item.label} item={item} highlight={item.label === "Account No"} />
                    ))}
                  </dl>
                </div>
              </div>

              <QrPanel copy={copy} />
            </div>

            <div className="mt-6">
              <SectionHeading icon={<ReceiptIcon />}>{copy.transaction.heading}</SectionHeading>
              <div className="mt-3 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5">
                <p className="mb-4 text-xs leading-5 text-slate-500">{copy.transaction.intro}</p>
                <DonationTransactionQueryForm copy={copy} donorId={donorId} />
              </div>
            </div>

            <div className="mt-6 flex gap-3 rounded-2xl border border-slate-200 bg-slate-50 p-4 text-sm leading-6 text-slate-600">
              <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-slate-300 text-xs font-bold text-slate-700">
                {copy.afterNote.badge}
              </span>
              <p>
                {copy.afterNote.text}{" "}
                <a href="mailto:support@farukrimafoundation.org" className="font-semibold text-cyan-700 hover:text-cyan-900">
                  support@farukrimafoundation.org
                </a>{" "}
                {copy.afterNote.or}{" "}
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
              {copy.close}
            </button>
          </div>
        </div>

        <AssistanceSection projectId={projectId} variant="panel" />
      </div>
    </div>
  );
}
