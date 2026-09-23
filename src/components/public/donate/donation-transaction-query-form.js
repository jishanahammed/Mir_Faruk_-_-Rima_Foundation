"use client";

import { useState } from "react";
import {
  submitDonationTransactionQueryAction,
  uploadDonationTransactionAttachmentAction,
} from "@/app/(public)/actions";

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

function formatFileSize(bytes) {
  if (!bytes) return "";
  const kb = bytes / 1024;
  return kb < 1024 ? `${Math.round(kb)} KB` : `${(kb / 1024).toFixed(1)} MB`;
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
export function DonationTransactionQueryForm({ copy, donorId = "", prefill = null }) {
  const [isPending, setIsPending] = useState(false);
  const [error, setError] = useState(null);
  const [sent, setSent] = useState(false);

  // The screenshot uploads as soon as it is chosen, so the donor sees it
  // attached before committing to send. Only the returned URL is submitted.
  const [attachment, setAttachment] = useState(null); // { url, name, preview }
  const [isUploading, setIsUploading] = useState(false);
  const [isDragging, setIsDragging] = useState(false);

  async function uploadFile(file, resetInput) {
    setError(null);

    if (!file.type.startsWith("image/")) {
      setError(copy.transaction.attachmentTypeError);
      resetInput?.();
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setError(copy.transaction.attachmentSizeError);
      resetInput?.();
      return;
    }

    setIsUploading(true);
    try {
      const fd = new FormData();
      fd.append("file", file);
      const result = await uploadDonationTransactionAttachmentAction(fd);

      if (!result?.success || !result.url) {
        throw new Error(result?.message || copy.transaction.attachmentError);
      }

      setAttachment({
        url: result.url,
        name: file.name,
        size: file.size,
        preview: URL.createObjectURL(file),
      });
    } catch (err) {
      setError(err?.message ?? copy.transaction.attachmentError);
      resetInput?.();
    } finally {
      setIsUploading(false);
    }
  }

  function handleFileChange(event) {
    const input = event.target;
    const file = input.files?.[0];
    if (file) uploadFile(file, () => { input.value = ""; });
  }

  // Dropping an image is the natural gesture on desktop, so it runs the same
  // validation and upload as the picker.
  function handleDrop(event) {
    event.preventDefault();
    setIsDragging(false);
    if (isUploading) return;
    const file = event.dataTransfer?.files?.[0];
    if (file) uploadFile(file);
  }

  function removeAttachment() {
    if (attachment?.preview) URL.revokeObjectURL(attachment.preview);
    setAttachment(null);
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setError(null);
    setIsPending(true);

    const fd = new FormData(event.currentTarget);
    const email = String(fd.get("email") ?? "").trim();
    const mobile = String(fd.get("mobile") ?? "").trim();

    if (!email && !mobile) {
      setError(copy.transaction.contactRequired);
      setIsPending(false);
      return;
    }

    try {
      const result = await submitDonationTransactionQueryAction({
        fullName: String(fd.get("fullName") ?? "").trim(),
        email,
        mobile,
        donorReference: String(fd.get("donorReference") ?? "").trim(),
        message: String(fd.get("message") ?? "").trim(),
        attachmentUrl: attachment?.url ?? "",
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
          <input
            id="dtq-fullName"
            name="fullName"
            type="text"
            required
            maxLength={150}
            defaultValue={prefill?.fullName ?? ""}
            className={inputClass}
          />
        </Field>
        <Field label={copy.transaction.email} htmlFor="dtq-email" optional>
          <input
            id="dtq-email"
            name="email"
            type="email"
            maxLength={200}
            defaultValue={prefill?.email ?? ""}
            className={inputClass}
          />
        </Field>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Field
          label={copy.transaction.mobile}
          htmlFor="dtq-mobile"
          optional
          hint={copy.transaction.contactHint}
        >
          <input
            id="dtq-mobile"
            name="mobile"
            type="tel"
            maxLength={30}
            defaultValue={prefill?.mobile ?? ""}
            className={inputClass}
          />
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

      {/* The screenshot is the fastest way for a donor to prove a payment, so
          it gets a real drop zone rather than another thin text-input row. */}
      <div className="flex flex-col gap-1.5">
        <label htmlFor="dtq-attachment" className="text-xs font-semibold text-slate-600">
          {copy.transaction.attachment}
          <span className="ml-1 font-normal text-slate-400">(optional)</span>
        </label>

        {attachment ? (
          <div className="flex items-center gap-3 rounded-2xl border border-teal-200 bg-[linear-gradient(135deg,#f0fdfa,#ecfeff)] p-3">
            <div className="relative shrink-0">
              {/* Local object URL, so the thumbnail shows without a round trip. */}
              <img
                src={attachment.preview}
                alt={copy.transaction.attachment}
                className="h-16 w-16 rounded-xl object-cover ring-1 ring-teal-200"
              />
              <span className="absolute -right-1.5 -top-1.5 flex h-5 w-5 items-center justify-center rounded-full bg-teal-600 text-white shadow-sm">
                <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2.6" className="h-3 w-3" aria-hidden="true">
                  <path d="m5 10.5 3.2 3.2L15 7" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </span>
            </div>

            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-bold text-teal-900">{attachment.name}</p>
              <p className="mt-0.5 text-[0.68rem] font-semibold text-teal-700">
                {copy.transaction.attachmentAttached}
                {attachment.size ? ` · ${formatFileSize(attachment.size)}` : ""}
              </p>
            </div>

            <button
              type="button"
              onClick={removeAttachment}
              aria-label={copy.transaction.attachmentRemove}
              className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-teal-200 bg-white text-teal-700 transition hover:border-rose-200 hover:bg-rose-50 hover:text-rose-600"
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-4 w-4" aria-hidden="true">
                <path d="M18 6 6 18M6 6l12 12" strokeLinecap="round" />
              </svg>
            </button>
          </div>
        ) : (
          <label
            htmlFor="dtq-attachment"
            onDragOver={(e) => { e.preventDefault(); if (!isUploading) setIsDragging(true); }}
            onDragLeave={() => setIsDragging(false)}
            onDrop={handleDrop}
            className={`group flex cursor-pointer flex-col items-center justify-center gap-2 rounded-2xl border-2 border-dashed px-4 py-6 text-center transition ${isUploading
              ? "pointer-events-none border-slate-200 bg-slate-50 opacity-70"
              : isDragging
                ? "border-cyan-400 bg-cyan-50"
                : "border-slate-200 bg-slate-50/70 hover:border-cyan-300 hover:bg-cyan-50/60"
              }`}
          >
            <span
              className={`flex h-11 w-11 items-center justify-center rounded-full transition ${isDragging
                ? "bg-cyan-600 text-white"
                : "bg-white text-cyan-600 shadow-sm ring-1 ring-slate-200 group-hover:bg-cyan-600 group-hover:text-white group-hover:ring-cyan-300"
                }`}
            >
              {isUploading ? <Spinner /> : (
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="h-5 w-5" aria-hidden="true">
                  <rect x="3" y="4.5" width="18" height="15" rx="2.5" />
                  <circle cx="8.5" cy="10" r="1.6" />
                  <path d="m4 17 4.5-4.5 3.5 3.5 3-3L20 17.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              )}
            </span>

            <span className="text-sm font-bold text-slate-700">
              {isUploading ? copy.transaction.attachmentUploading : copy.transaction.attachmentChoose}
            </span>
            <span className="text-[0.68rem] leading-4 text-slate-400">
              {copy.transaction.attachmentHint}
            </span>
          </label>
        )}

        <input
          id="dtq-attachment"
          name="attachment"
          type="file"
          accept="image/*"
          className="sr-only"
          onChange={handleFileChange}
          disabled={isUploading}
        />
      </div>

      {error && (
        <div className="rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm font-semibold text-rose-700">
          {error}
        </div>
      )}

      <button
        type="submit"
        disabled={isPending || isUploading}
        className="inline-flex items-center justify-center gap-2 self-start rounded-full bg-[linear-gradient(135deg,#0f766e,#0891b2)] px-6 py-2.5 text-sm font-bold text-white shadow-md shadow-cyan-900/15 transition hover:-translate-y-0.5 hover:shadow-lg disabled:translate-y-0 disabled:opacity-60"
      >
        {isPending && <Spinner />}
        {isPending ? copy.transaction.sending : copy.transaction.submit}
      </button>
    </form>
  );
}
