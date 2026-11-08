"use client";

import { useState } from "react";

export function BeneficiaryRegistrationPdfButton({ text }) {
  const [isPreparing, setIsPreparing] = useState(false);
  const [error, setError] = useState("");

  async function downloadForm() {
    if (isPreparing) return;
    setIsPreparing(true);
    setError("");

    try {
      const [{ pdf }, { BeneficiaryRegistrationDocument }] = await Promise.all([
        import("@react-pdf/renderer"),
        import("@/components/volunteer/beneficiary-registration-document"),
      ]);
      const blob = await pdf(<BeneficiaryRegistrationDocument text={text} />).toBlob();
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = "beneficiary-registration-form.pdf";
      document.body.appendChild(link);
      link.click();
      link.remove();
      setTimeout(() => URL.revokeObjectURL(url), 60_000);
    } catch {
      setError(text.pdf.error);
    } finally {
      setIsPreparing(false);
    }
  }

  return (
    <div className="shrink-0 sm:max-w-64">
      <button type="button" onClick={downloadForm} disabled={isPreparing}
        className="inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-xl border border-cyan-200 bg-white px-4 py-3 text-sm font-bold text-cyan-800 transition hover:bg-cyan-50 disabled:cursor-wait disabled:opacity-60">
        <svg className="h-5 w-5 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <path d="M12 3v12m-5-5 5 5 5-5M5 16v5h14v-5" />
        </svg>
        {isPreparing ? text.pdf.preparing : text.pdf.download}
      </button>
      <p className="mt-2 text-xs leading-5 text-slate-500">{text.pdf.instructions}</p>
      {error ? <p role="alert" className="mt-2 text-xs leading-5 text-red-700">{error}</p> : null}
    </div>
  );
}
