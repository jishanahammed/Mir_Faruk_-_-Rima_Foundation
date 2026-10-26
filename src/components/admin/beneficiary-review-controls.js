"use client";

import { useEffect, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { approveBeneficiaryAction, updateBeneficiaryStatusAction } from "@/app/admin/beneficiaries/actions";

const statuses = ["Pending", "UnderReview", "Approved", "Rejected"];

export function BeneficiaryReviewControls({ beneficiary, returnPath = "/admin/beneficiaries", compact = false }) {
  const router = useRouter();
  const [current, setCurrent] = useState(beneficiary);
  const [feedback, setFeedback] = useState(null);
  const [pending, startTransition] = useTransition();
  const linked = Boolean(current.ledgerId > 0);
  const complete = linked && current.isApprov && current.status === "Approved";

  useEffect(() => { setCurrent(beneficiary); }, [beneficiary]);

  function review(status, approve = false) {
    setFeedback(null);
    startTransition(async () => {
      try {
        const formData = new FormData();
        formData.set("id", String(current.id));
        formData.set("status", status);
        formData.set("returnPath", returnPath);
        const result = approve ? await approveBeneficiaryAction(Number(current.id)) : await updateBeneficiaryStatusAction(formData);
        setFeedback(result);
        if (result.success) { setCurrent(result.beneficiary); router.refresh(); }
      } catch { setFeedback({ success: false, message: "Unable to update this beneficiary. Check your connection and try again." }); }
    });
  }

  return <div aria-busy={pending} className={`space-y-2 ${compact ? "w-full" : "min-w-48 max-w-72"}`}>
    {!complete ? <>
      <label className="block"><span className="sr-only">Review status for {current.fullName}</span>
        <select aria-label={`Review status for ${current.fullName}`} value={current.status} disabled={pending} onChange={(event) => review(event.target.value)} className="h-10 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm font-medium text-slate-900 outline-none focus:border-cyan-400 focus:ring-2 focus:ring-cyan-100 disabled:opacity-60">
          {statuses.map((status) => <option key={status} value={status} disabled={linked && status !== "Approved"}>{status === "UnderReview" ? "Under review" : status}</option>)}
        </select>
      </label>
      <button type="button" disabled={pending} onClick={() => review("Approved", true)} className="inline-flex min-h-10 w-full items-center justify-center gap-2 rounded-xl bg-emerald-800 px-3 py-2 text-xs font-bold text-white! transition hover:bg-emerald-700 disabled:cursor-wait disabled:opacity-60">
        <svg aria-hidden="true" className="h-4 w-4 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m5 12 4 4L19 6" /></svg>{pending ? "Saving approval..." : linked ? "Confirm approval" : current.status === "Approved" ? "Complete ledger setup" : "Approve & create ledger"}
      </button>
    </> : <p className="inline-flex items-center gap-1.5 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-xs font-bold text-emerald-800"><span aria-hidden="true">✓</span> Approved</p>}
    <p className="break-words text-[11px] leading-5 text-slate-500">Project: {current.projectTitleEn || `#${current.projectId}`}</p>
    {linked ? <div className="rounded-xl border border-emerald-100 bg-emerald-50/60 px-3 py-2"><p className="break-all text-[11px] font-bold text-emerald-800">Ledger: {current.ledgerCode || current.ledgerId}</p>{current.ledgerName ? <p className="mt-0.5 break-words text-[11px] text-emerald-700">{current.ledgerName}</p> : null}</div> : null}
    {feedback ? <p role={feedback.success ? "status" : "alert"} className={`rounded-xl border px-3 py-2 text-xs leading-5 ${feedback.success ? "border-emerald-200 bg-emerald-50 text-emerald-800" : "border-rose-200 bg-rose-50 text-rose-700"}`}>{feedback.message}</p> : null}
  </div>;
}
