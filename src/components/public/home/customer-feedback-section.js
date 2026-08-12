"use client";

import { useState } from "react";
import { useSiteLocale } from "@/components/public/providers/locale-provider";

const feedbackCopy = {
  en: {
    eyebrow: "Your Voice",
    title: "Customer Feedback",
    nameLabel: "Full name",
    namePlaceholder: "Your full name",
    emailLabel: "Email",
    emailPlaceholder: "you@example.com",
    ratingLabel: "How was your experience?",
    messageLabel: "Your feedback",
    messagePlaceholder: "Share what went well, or what we can improve...",
    submit: "Submit Feedback",
    submitting: "Submitting...",
    successTitle: "Thank you for your feedback!",
    successText: "We appreciate you taking the time to share your thoughts with us.",
    submitAnother: "Submit another response",
    nameRequired: "Please enter your name.",
    emailRequired: "Please enter a valid email address.",
    messageRequired: "Please write your feedback before submitting.",
    genericError: "Something went wrong while submitting your feedback. Please try again.",
    privacyNote: "We only use your name and email to attribute your feedback — never shared publicly without your name shown as you enter it.",
  },
  bn: {
    eyebrow: "আপনার মতামত",
    title: "গ্রাহক মতামত",
    nameLabel: "পূর্ণ নাম",
    namePlaceholder: "আপনার পূর্ণ নাম",
    emailLabel: "ইমেইল",
    emailPlaceholder: "you@example.com",
    ratingLabel: "আপনার অভিজ্ঞতা কেমন ছিল?",
    messageLabel: "আপনার মতামত",
    messagePlaceholder: "কী ভালো লেগেছে বা কী উন্নত করা যায় তা লিখুন...",
    submit: "মতামত জমা দিন",
    submitting: "জমা দেওয়া হচ্ছে...",
    successTitle: "আপনার মতামতের জন্য ধন্যবাদ!",
    successText: "আমাদের সাথে আপনার মতামত শেয়ার করার জন্য আমরা কৃতজ্ঞ।",
    submitAnother: "আরেকটি মতামত জমা দিন",
    nameRequired: "আপনার নাম লিখুন।",
    emailRequired: "একটি সঠিক ইমেইল ঠিকানা লিখুন।",
    messageRequired: "জমা দেওয়ার আগে আপনার মতামত লিখুন।",
    genericError: "মতামত জমা দেওয়ার সময় সমস্যা হয়েছে। আবার চেষ্টা করুন।",
    privacyNote: "আপনার মতামত যাচাইয়ের জন্য শুধু নাম ও ইমেইল ব্যবহার করা হয়।",
  },
  da: {
    eyebrow: "Din stemme",
    title: "Kundefeedback",
    nameLabel: "Fulde navn",
    namePlaceholder: "Dit fulde navn",
    emailLabel: "E-mail",
    emailPlaceholder: "dig@example.com",
    ratingLabel: "Hvordan var din oplevelse?",
    messageLabel: "Din feedback",
    messagePlaceholder: "Del hvad der gik godt, eller hvad vi kan forbedre...",
    submit: "Indsend feedback",
    submitting: "Indsender...",
    successTitle: "Tak for din feedback!",
    successText: "Vi saetter pris paa, at du tog dig tid til at dele dine tanker med os.",
    submitAnother: "Indsend et andet svar",
    nameRequired: "Indtast venligst dit navn.",
    emailRequired: "Indtast venligst en gyldig e-mailadresse.",
    messageRequired: "Skriv venligst din feedback foer indsendelse.",
    genericError: "Noget gik galt under indsendelse af din feedback. Proev igen.",
    privacyNote: "Vi bruger kun dit navn og din e-mail til at tilskrive din feedback.",
  },
};

function resolveCopy(htmlLang) {
  if (htmlLang === "bn") return feedbackCopy.bn;
  if (htmlLang === "da" || htmlLang === "dk") return feedbackCopy.da;
  return feedbackCopy.en;
}

function isValidEmail(value) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

const RATING_LABELS = {
  en: ["Poor", "Fair", "Good", "Great", "Excellent"],
  bn: ["খারাপ", "মোটামুটি", "ভালো", "খুব ভালো", "অসাধারণ"],
  da: ["Daarlig", "Okay", "God", "Rigtig god", "Fremragende"],
};

function StarRating({ value, onChange, label, htmlLang }) {
  const [hovered, setHovered] = useState(0);
  const labels = RATING_LABELS[htmlLang] ?? RATING_LABELS.en;
  const activeIndex = (hovered || value) - 1;

  return (
    <div>
      <span className="mb-2 block text-center text-xs font-bold uppercase tracking-wide text-slate-500 sm:text-left lg:text-sm">
        {label}
      </span>
      <div className="flex min-h-12 flex-col items-center justify-center gap-1.5 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 sm:h-14 sm:flex-row sm:justify-between sm:gap-2 lg:h-14 lg:px-5">
        <div className="flex items-center gap-1" onMouseLeave={() => setHovered(0)}>
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              type="button"
              onClick={() => onChange(star)}
              onMouseEnter={() => setHovered(star)}
              aria-label={`${star} star`}
              className="p-0.5 transition-transform hover:scale-110"
            >
              <svg
                viewBox="0 0 24 24"
                className={`h-7 w-7 transition-colors sm:h-8 sm:w-8 ${star <= (hovered || value) ? "fill-amber-400" : "fill-slate-200"
                  }`}
              >
                <path d="M12 2.5l2.9 6.06 6.6.72-4.9 4.5 1.28 6.55L12 16.9l-5.88 3.43 1.28-6.55-4.9-4.5 6.6-.72L12 2.5Z" />
              </svg>
            </button>
          ))}
        </div>
        <span className="min-w-24 shrink-0 text-center text-sm font-bold text-amber-600 sm:text-right lg:min-w-28 lg:text-base">
          {activeIndex >= 0 ? labels[activeIndex] : ""}
        </span>
      </div>
    </div>
  );
}

export function CustomerFeedbackSection() {
  const { copy: siteCopy } = useSiteLocale();
  const text = resolveCopy(siteCopy.htmlLang);

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [rating, setRating] = useState(0);
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState("idle"); // idle | submitting | success | error
  const [errors, setErrors] = useState({});

  async function handleSubmit(event) {
    event.preventDefault();

    const trimmedName = fullName.trim();
    const trimmedEmail = email.trim();
    const trimmedMessage = message.trim();

    const nextErrors = {};
    if (!trimmedName) nextErrors.fullName = text.nameRequired;
    if (!isValidEmail(trimmedEmail)) nextErrors.email = text.emailRequired;
    if (!trimmedMessage) nextErrors.message = text.messageRequired;

    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) return;

    setStatus("submitting");

    try {
      const response = await fetch("/api/customer-feedback", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fullName: trimmedName,
          email: trimmedEmail,
          rating: rating || 5,
          message: trimmedMessage,
        }),
      });

      if (!response.ok) {
        const payload = await response.json().catch(() => null);
        throw new Error(payload?.message || text.genericError);
      }

      setStatus("success");
    } catch (error) {
      setStatus("error");
      setErrors({ form: error?.message || text.genericError });
    }
  }

  function resetForSubmitAnother() {
    setStatus("idle");
    setFullName("");
    setEmail("");
    setRating(0);
    setMessage("");
    setErrors({});
  }

  const inputClass = (hasError) =>
    `h-12 w-full rounded-2xl border bg-slate-50 px-4 text-sm text-slate-900 placeholder-slate-400 outline-none transition focus:bg-white focus:ring-4 lg:h-14 lg:px-5 lg:text-base ${hasError
      ? "border-red-300 focus:border-red-400 focus:ring-red-100"
      : "border-slate-200 focus:border-cyan-400 focus:ring-cyan-100"
    }`;

  return (
    <section className="relative overflow-hidden bg-[linear-gradient(180deg,#f8fafc_0%,#ecfeff_45%,#f8fafc_100%)] py-10 sm:py-10">
      <div className="pointer-events-none absolute left-1/2 top-0 h-72 w-xl -translate-x-1/2 rounded-full bg-cyan-200/30 blur-3xl" />

      <div className="relative mx-auto w-full max-w-4xl px-4 sm:px-4 lg:px-4">
        <div className="text-center">
          <p className="text-xs font-black uppercase tracking-[0.22em] text-cyan-700">{text.eyebrow}</p>
          <h1 className="mt-2 text-2xl font-black tracking-tight text-slate-950 sm:text-1xl lg:text-3xl">{text.title}</h1>
        </div>

        <div className="mt-8 sm:mt-10 lg:mt-14">
          {status === "success" ? (
            <div className="mx-auto max-w-2xl rounded-3xl border border-emerald-200 bg-emerald-50 p-8 text-center shadow-xl shadow-emerald-900/5 sm:p-10 lg:p-14">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-emerald-100 text-emerald-600 lg:h-16 lg:w-16">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-7 w-7 lg:h-8 lg:w-8">
                  <path d="M5 13l4 4L19 7" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
              <h2 className="mt-4 text-lg font-black text-slate-950 lg:text-2xl">{text.successTitle}</h2>
              <p className="mt-2 text-sm text-slate-600 lg:text-base">{text.successText}</p>
              <button
                type="button"
                onClick={resetForSubmitAnother}
                className="mt-6 inline-flex h-11 items-center justify-center rounded-xl border border-emerald-300 bg-white px-5 text-sm font-bold text-emerald-700 transition hover:bg-emerald-100 lg:h-12 lg:px-6 lg:text-base"
              >
                {text.submitAnother}
              </button>
            </div>
          ) : (
            <form
              onSubmit={handleSubmit}
              className="space-y-6 rounded-4xl border border-slate-200 bg-white/90 p-5 shadow-xl shadow-slate-900/5 backdrop-blur-sm sm:p-8 lg:space-y-8 lg:p-12"
            >
              {/* Row 1: name, email, rating */}
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 lg:gap-6">
                <label className="block">
                  <span className="mb-1.5 block text-xs font-bold uppercase tracking-wide text-slate-500 lg:text-sm">
                    {text.nameLabel}
                  </span>
                  <input
                    type="text"
                    value={fullName}
                    onChange={(event) => setFullName(event.target.value)}
                    placeholder={text.namePlaceholder}
                    className={inputClass(Boolean(errors.fullName))}
                  />
                  {errors.fullName ? (
                    <span className="mt-1 block text-xs font-semibold text-red-600">{errors.fullName}</span>
                  ) : null}
                </label>

                <label className="block">
                  <span className="mb-1.5 block text-xs font-bold uppercase tracking-wide text-slate-500 lg:text-sm">
                    {text.emailLabel}
                  </span>
                  <input
                    type="email"
                    value={email}
                    onChange={(event) => setEmail(event.target.value)}
                    placeholder={text.emailPlaceholder}
                    className={inputClass(Boolean(errors.email))}
                  />
                  {errors.email ? (
                    <span className="mt-1 block text-xs font-semibold text-red-600">{errors.email}</span>
                  ) : null}
                </label>

                <div className="sm:col-span-2 lg:col-span-1">
                  <StarRating
                    value={rating}
                    onChange={setRating}
                    label={text.ratingLabel}
                    htmlLang={siteCopy.htmlLang}
                  />
                </div>
              </div>

              {/* Row 2: message */}
              <label className="block">
                <span className="mb-1.5 block text-xs font-bold uppercase tracking-wide text-slate-500 lg:text-sm">
                  {text.messageLabel}
                </span>
                <textarea
                  value={message}
                  onChange={(event) => setMessage(event.target.value)}
                  rows={6}
                  maxLength={2000}
                  placeholder={text.messagePlaceholder}
                  className={`w-full resize-none rounded-2xl border bg-slate-50 px-4 py-3 text-sm text-slate-900 placeholder-slate-400 outline-none transition focus:bg-white focus:ring-4 lg:rounded-3xl lg:px-5 lg:py-4 lg:text-base ${errors.message
                    ? "border-red-300 focus:border-red-400 focus:ring-red-100"
                    : "border-slate-200 focus:border-cyan-400 focus:ring-cyan-100"
                    }`}
                />
                {errors.message ? (
                  <span className="mt-1 block text-xs font-semibold text-red-600">{errors.message}</span>
                ) : null}
              </label>

              {errors.form ? (
                <p className="rounded-xl border border-red-200 bg-red-50 px-3.5 py-2.5 text-xs font-semibold text-red-700">
                  {errors.form}
                </p>
              ) : null}

              <div className="flex flex-col-reverse gap-3 sm:flex-row sm:items-center sm:justify-between lg:gap-6">
                <p className="text-[11px] leading-5 text-slate-400 sm:max-w-xs lg:text-xs lg:max-w-sm">{text.privacyNote}</p>
                <button
                  type="submit"
                  disabled={status === "submitting"}
                  className="inline-flex h-12 w-full shrink-0 items-center justify-center rounded-2xl bg-[linear-gradient(135deg,#0f766e,#0891b2)] px-8 text-sm font-bold text-white shadow-lg shadow-cyan-900/20 transition hover:-translate-y-0.5 hover:shadow-xl disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:translate-y-0 sm:w-auto lg:h-14 lg:px-10 lg:text-base"
                >
                  {status === "submitting" ? text.submitting : text.submit}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </section>
  );
}
