"use client";

import { useSiteLocale } from "@/components/public/providers/locale-provider";
import { DonationPaymentMethods, resolveModalCopy } from "@/components/public/donate/donate-bank-info-modal";
import { DonationTransactionQueryForm } from "@/components/public/donate/donation-transaction-query-form";

const headerCopy = {
  en: {
    eyebrow: "Support Our Work",
    description: "Donate through bKash or bank transfer. Scan the QR code or copy the payment details below.",
  },
  bn: {
    eyebrow: "আমাদের কাজে সহায়তা করুন",
    description: "বিকাশ বা ব্যাংক ট্রান্সফারের মাধ্যমে দান করুন। কিউআর কোড স্ক্যান করুন অথবা নিচের পেমেন্টের তথ্য কপি করুন।",
  },
  da: {
    eyebrow: "Stoet vores arbejde",
    description: "Doner via bKash eller bankoverfoersel. Scan QR-koden, eller kopier betalingsoplysningerne nedenfor.",
  },
};

export function HomeBankInfo() {
  const { copy: siteCopy } = useSiteLocale();
  const copy = resolveModalCopy(siteCopy?.htmlLang);
  const header = headerCopy[siteCopy?.htmlLang === "dk" ? "da" : siteCopy?.htmlLang] ?? headerCopy.en;

  return (
    <section
      id="home-bank-info"
      className="relative overflow-hidden px-6 py-8 sm:py-12 lg:px-8"
    >
      <div className="absolute inset-x-0 top-0 h-px bg-[linear-gradient(90deg,_transparent,_rgba(8,145,178,0.35),_transparent)]" />
      <div className="absolute left-[-6rem] bottom-8 h-56 w-56 rounded-full bg-cyan-100/60 blur-3xl" />
      <div className="absolute right-[-5rem] top-10 h-48 w-48 rounded-full bg-amber-100/55 blur-3xl" />

      <div className="relative mx-auto max-w-7xl">
        <div className="mx-auto max-w-xl space-y-3 text-center lg:mx-0 lg:max-w-2xl lg:text-left">
          <p className="text-xs font-semibold tracking-[0.32em] text-cyan-700 uppercase">
            {header.eyebrow}
          </p>
          <h2 className="text-2xl font-semibold leading-tight text-balance sm:text-3xl">
            <span className="bg-[linear-gradient(135deg,_#0f172a_0%,_#0f766e_54%,_#0891b2_100%)] bg-clip-text text-transparent">
              {copy.title}
            </span>
          </h2>
          <p className="text-sm leading-7 text-slate-600">
            {header.description}
          </p>
        </div>

        <DonationPaymentMethods copy={copy} spacious />

        {/* Reporting a transaction follows the payment options, since a donor
            only has details to send once they have actually given. */}
        <div className="mt-6 overflow-hidden rounded-3xl border border-slate-200/80 bg-white shadow-[0_18px_50px_-18px_rgba(15,23,42,0.28)]">
          <div className="border-b border-slate-100 px-4 py-4 sm:px-6">
            <p className="text-[0.62rem] font-semibold uppercase tracking-[0.18em] text-slate-400">
              {copy.transaction.heading}
            </p>
            <p className="mt-1 text-sm leading-6 text-slate-600">{copy.transaction.intro}</p>
          </div>
          <div className="px-4 py-5 sm:px-6">
            <DonationTransactionQueryForm copy={copy} />
          </div>
        </div>
      </div>
    </section>
  );
}
