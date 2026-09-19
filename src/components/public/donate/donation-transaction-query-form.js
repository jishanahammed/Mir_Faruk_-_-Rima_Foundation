"use client";

import { useState } from "react";
import { submitDonationTransactionQueryAction } from "@/app/(public)/actions";

const inputClass =
  "w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-800 placeholder:text-slate-400 transition focus:border-cyan-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-cyan-100";

function Spinner() {
  return (
    <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4Z" />
    </svg>
  );
}

function Field({ label, htmlFor, optional, hint, children }) {
  return (
    <div className="flex flex-col gap-1">
      <label htmlFor={htmlFor} className="text-xs font-semibold text-slate-600">
        {label}
        {optional ? (
          <span className="ml-1 font-normal text-slate-400">(optional)</span>
        ) : (
          <span className="ml-0.5 text-rose-500">*</span>
        )}
      </label>
      {children}
      {hint && <p className="text-[0.68rem] leading-4 text-slate-400">{hint}</p>}
    </div>
  );
}

/**
 * Lets a donor report a donation they have already sent. Submitting does not
 * require an account: the backend links the report to a donor record when the
 * reference or email matches one, so anyone can send details and still be
 * traced back correctly.
 */
export function DonationTransactionQueryForm({ copy, donorId = "" }) {
  const [isPending, setIsPending] = useState(false);
  const [error, setError] = useState(null);
  const [sent, setSent] = useState(false);

  async function handleSubmit(event) {
    event.preventDefault();
    setError(null);
    setIsPending(true);

    const fd = new FormData(event.currentTarget);

    try {
      const result = await submitDonationTransactionQueryAction({
        fullName: String(fd.get("fullName") ?? "").trim(),
        email: String(fd.get("email") ?? "").trim(),
        mobile: String(fd.get("mobile") ?? "").trim(),
        donorReference: String(fd.get("donorReference") ?? "").trim(),
        message: String(fd.get("message") ?? "").trim(),
      });

      if (!result?.success) throw new Error(result?.message || copy.transaction.error);
      setSent(true);
    } catch (err) {
      setError(err?.message ?? copy.transaction.error);
    } finally {
      setIsPending(false);
    }
  }

  if (sent) {
    return (
      <div className="flex items-start gap-3 rounded-2xl border border-teal-200 bg-teal-50 px-5 py-4">
        <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-teal-600 text-white">
          <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2.4" className="h-3.5 w-3.5" aria-hidden="true">
            <path d="m5 10.5 3.2 3.2L15 7" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </span>
        <div>
          <p className="text-sm font-bold text-teal-900">{copy.transaction.sentTitle}</p>
          <p className="mt-1 text-xs leading-5 text-teal-800">{copy.transaction.sentNote}</p>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Field label={copy.transaction.name} htmlFor="dtq-fullName">
          <input id="dtq-fullName" name="fullName" type="text" required maxLength={150} className={inputClass} />
        </Field>
        <Field label={copy.transaction.email} htmlFor="dtq-email">
          <input id="dtq-email" name="email" type="email" required maxLength={200} className={inputClass} />
        </Field>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Field label={copy.transaction.mobile} htmlFor="dtq-mobile" optional>
          <input id="dtq-mobile" name="mobile" type="tel" maxLength={30} className={inputClass} />
        </Field>
        <Field
          label={copy.transaction.reference}
          htmlFor="dtq-donorReference"
          optional
          hint={copy.transaction.referenceHint}
        >
          <input
            id="dtq-donorReference"
            name="donorReference"
            type="text"
            maxLength={20}
            defaultValue={donorId}
            placeholder="100001"
            className={`${inputClass} font-mono tabular-nums`}
          />
        </Field>
      </div>

      <Field label={copy.transaction.message} htmlFor="dtq-message">
        <textarea
          id="dtq-message"
          name="message"
          required
          rows={4}
          maxLength={2000}
          placeholder={copy.transaction.messagePlaceholder}
          className={inputClass}
        />
      </Field>

      {error && (
        <div className="rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm font-semibold text-rose-700">
          {error}
        </div>
      )}

      <button
        type="submit"
        disabled={isPending}
        className="inline-flex items-center justify-center gap-2 self-start rounded-full bg-[linear-gradient(135deg,#0f766e,#0891b2)] px-6 py-2.5 text-sm font-bold text-white shadow-md shadow-cyan-900/15 transition hover:-translate-y-0.5 hover:shadow-lg disabled:translate-y-0 disabled:opacity-60"
      >
        {isPending && <Spinner />}
        {isPending ? copy.transaction.sending : copy.transaction.submit}
      </button>
    </form>
  );
}
