"use client";

import { useActionState, useEffect, useId, useState } from "react";
import { reviewAmountAssignmentAction } from "@/app/admin/amount-assignment/actions";

// Mirrors ASSIGNMENT_REVIEW_OPTIONS in the admin service, which is server-only and
// therefore cannot be imported into this client component.
const ASSIGNMENT_REVIEW_OPTIONS = ["Pending", "Completed", "Rejected"];

const ASSIGNMENT_REVIEW_LABELS = {
  Pending: "Pending (awaiting review)",
  Completed: "Approve (Completed)",
  Rejected: "Reject",
};

function formatAmount(amount) {
  const parsed = Number(amount);

  if (!Number.isFinite(parsed)) {
    return "0.00";
  }

  return new Intl.NumberFormat("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(parsed);
}

function DetailRow({ label, value }) {
  return (
    <div>
      <p className="text-xs font-bold uppercase tracking-[0.14em] text-slate-400">{label}</p>
      <p className="mt-1 text-sm font-bold text-slate-900">{value || "Not available"}</p>
    </div>
  );
}

export function AmountAssignmentReviewModal({ assignment, returnPath, batchSize = 1, bankLedgers = [], bankLedgerError = "" }) {
  const [isOpen, setIsOpen] = useState(false);
  const [status, setStatus] = useState("");
  const [bankLedgerId, setBankLedgerId] = useState("");
  const [result, formAction, isPending] = useActionState(reviewAmountAssignmentAction, null);
  const titleId = useId();
  const isApproving = status === "Completed";
  const isLocked = assignment.isLocked || Boolean(assignment.voucherId || assignment.voucherPostedAt);
  const selectedBank = bankLedgers.find((ledger) => String(ledger.id) === bankLedgerId);
  const totalAmount = assignment.batchAmount ?? assignment.assignedAmount;
  const paymentCount = assignment.batchSize || batchSize;
  const isRejecting = status === "Rejected";
  const isRestoring = assignment.assignmentStatus === "Rejected" && status !== "Rejected" && status !== "";
  const availableOptions = ASSIGNMENT_REVIEW_OPTIONS.filter(
    (option) => option !== assignment.assignmentStatus || (option === "Completed" && !isLocked),
  );

  useEffect(() => {
    if (!isOpen) {
      setStatus("");
      setBankLedgerId("");
      return undefined;
    }

    function handleKeyDown(event) {
      if (event.key === "Escape" && !isPending) {
        setIsOpen(false);
      }
    }

    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, isPending]);

  if (isLocked) {
    return (
      <span className="text-xs font-semibold text-slate-500" title="This assignment is locked because its voucher has been posted.">
        Locked · Voucher {assignment.voucherNo || assignment.voucherId || "posted"}
      </span>
    );
  }

  return (
    <>
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        className="inline-flex h-9 items-center justify-center rounded-xl border border-cyan-200 bg-cyan-50 px-3 text-xs font-bold text-cyan-700 transition hover:bg-cyan-100"
        title="Change assignment status"
      >
        Change status
      </button>

      {isOpen ? (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/55 px-4 py-6 backdrop-blur-sm"
          role="dialog"
          aria-modal="true"
          aria-labelledby={titleId}
          onMouseDown={(event) => {
            if (event.target === event.currentTarget && !isPending) {
              setIsOpen(false);
            }
          }}
        >
          <div className="max-h-[calc(100dvh-3rem)] w-full max-w-xl overflow-y-auto rounded-[30px] border border-white/70 bg-white shadow-2xl shadow-slate-950/25">
            <div className="border-b border-cyan-100 bg-[radial-gradient(circle_at_top_left,_rgba(34,211,238,0.2),_transparent_35%),linear-gradient(135deg,#f8fafc,#effcff)] p-6">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-xs font-bold uppercase tracking-[0.2em] text-cyan-700">
                    Amount Assignment
                  </p>
                  <h2 id={titleId} className="mt-2 text-2xl font-black tracking-tight text-slate-950">
                    Change assignment status
                  </h2>
                  <p className="mt-2 text-sm font-medium text-slate-500">
                    ৳ {formatAmount(assignment.assignedAmount)} · {assignment.transactionId} · Currently{" "}
                    {assignment.assignmentStatus}
                  </p>
                </div>
                <button
                  type="button"
                  disabled={isPending}
                  onClick={() => setIsOpen(false)}
                  className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border border-slate-200 bg-white text-slate-500 shadow-sm transition hover:border-red-200 hover:bg-red-50 hover:text-red-500"
                  aria-label="Close review modal"
                >
                  <svg className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path d="m6 6 12 12M18 6 6 18" strokeLinecap="round" />
                  </svg>
                </button>
              </div>
            </div>

            <form action={formAction} className="p-6">
              <input type="hidden" name="id" value={assignment.id} />
              <input type="hidden" name="returnPath" value={returnPath} />

              <div className="grid gap-4 sm:grid-cols-2">
                <DetailRow label="Donor" value={assignment.donorName} />
                <DetailRow label="Allocation target" value={assignment.targetName || assignment.beneficiaryName} />
                <DetailRow label="Target type" value={assignment.targetType === "ProjectAssistance" ? "Project assistance" : "Beneficiary"} />
                <DetailRow label="Project" value={assignment.projectTitleEn} />
                <DetailRow label="Transaction" value={assignment.transactionId} />
                <DetailRow label="Assigned Amount" value={`৳ ${formatAmount(assignment.assignedAmount)}`} />
              </div>

              <label className="mt-5 block">
                <span className="mb-2 block text-xs font-semibold uppercase tracking-[0.14em] text-slate-500">
                  Assignment status <span className="text-red-500">*</span>
                </span>
                <select
                  name="assignmentStatus"
                  value={status}
                  onChange={(event) => setStatus(event.target.value)}
                  required
                  disabled={isPending}
                  className="h-12 w-full rounded-2xl border border-slate-200 bg-white px-4 text-sm font-semibold text-slate-900 outline-none transition focus:border-cyan-400 focus:ring-4 focus:ring-cyan-100"
                >
                  <option value="">Select status</option>
                  {availableOptions.map((option) => (
                    <option key={option} value={option}>
                      {ASSIGNMENT_REVIEW_LABELS[option]}
                    </option>
                  ))}
                </select>
              </label>

              {isApproving ? (
                <section className="mt-5 space-y-4 rounded-2xl border border-cyan-100 bg-cyan-50/50 p-4">
                  <label className="block">
                    <span className="mb-2 block text-xs font-semibold uppercase tracking-[0.14em] text-slate-500">
                      Bank ledger (Cr Amount) <span className="text-red-500">*</span>
                    </span>
                    <select
                      name="bankLedgerId"
                      value={bankLedgerId}
                      onChange={(event) => setBankLedgerId(event.target.value)}
                      required
                      disabled={isPending || !bankLedgers.length}
                      className="h-12 w-full rounded-2xl border border-slate-200 bg-white px-3 text-sm text-slate-900 disabled:opacity-50"
                    >
                      <option value="">Select bank ledger</option>
                      {bankLedgers.map((ledger) => (
                        <option key={ledger.id} value={ledger.id}>
                          {ledger.accountName}{ledger.accountCode ? ` (${ledger.accountCode})` : ""}
                        </option>
                      ))}
                    </select>
                  </label>
                  {!bankLedgers.length ? (
                    <p role="alert" className="text-sm text-red-700">
                      {bankLedgerError || "No bank ledgers are available. Check the accounting connection and refresh."}
                    </p>
                  ) : null}
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs">
                      <caption className="mb-2 text-left font-bold text-slate-700">Payment voucher preview</caption>
                      <thead><tr className="text-slate-500"><th className="py-2">Ledger</th><th className="px-2 text-right">Dr Amount</th><th className="text-right">Cr Amount</th></tr></thead>
                      <tbody className="text-slate-800">
                        <tr className="border-t border-cyan-100">
                          <td className="py-2">{assignment.targetLedgerName || assignment.targetName || assignment.beneficiaryName}{assignment.targetLedgerCode ? ` (${assignment.targetLedgerCode})` : ""}</td>
                          <td className="px-2 text-right">{formatAmount(totalAmount)}</td><td className="text-right">0.00</td>
                        </tr>
                        <tr className="border-t border-cyan-100">
                          <td className="py-2">{selectedBank ? `${selectedBank.accountName} (${selectedBank.accountCode})` : "Select bank ledger"}</td>
                          <td className="px-2 text-right">0.00</td><td className="text-right">{formatAmount(totalAmount)}</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                  {!assignment.targetLedgerId ? <p role="alert" className="text-sm text-red-700">The allocation target has no accounting ledger. Create its ledger before approving.</p> : null}
                  <p className="text-xs leading-5 text-slate-600">Approval creates the payment voucher and locks this allocation against further status changes.</p>
                </section>
              ) : null}

              <label className="mt-5 block">
                <span className="mb-2 block text-xs font-semibold uppercase tracking-[0.14em] text-slate-500">
                  Admin remarks
                </span>
                <textarea
                  name="adminRemarks"
                  rows={3}
                  disabled={isPending}
                  maxLength={500}
                  placeholder="Optional note explaining this decision"
                  className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-medium text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-cyan-400 focus:ring-4 focus:ring-cyan-100"
                />
              </label>

              {paymentCount > 1 ? (
                <p className="mt-4 rounded-2xl border border-cyan-200 bg-cyan-50 px-4 py-3 text-xs font-semibold leading-5 text-cyan-800">
                  This allocation was funded by {paymentCount} payments. Your decision applies to all
                  {" "}
                  {paymentCount} of them together.
                </p>
              ) : null}

              {isRejecting ? (
                <p className="mt-4 rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-xs font-semibold leading-5 text-amber-800">
                  Rejecting marks the payment as unassigned and returns
                  {paymentCount > 1 ? ` all ${paymentCount} payments` : " the payment"} to the
                  donor&apos;s available balance.
                </p>
              ) : null}

              {isRestoring ? (
                <p className="mt-4 rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-xs font-semibold leading-5 text-amber-800">
                  This assignment was rejected, so its payment was already released. Moving it back
                  to {status} re-reserves that payment for this target. This fails safely if the
                  payment has since been assigned elsewhere.
                </p>
              ) : null}

              {result?.error ? <p role="alert" className="mt-4 rounded-xl bg-red-50 p-3 text-sm text-red-700">{result.error}</p> : null}

              <div className="mt-6 flex flex-col-reverse gap-3 border-t border-slate-100 pt-5 sm:flex-row sm:items-center sm:justify-end">
                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  disabled={isPending}
                  className="inline-flex h-11 items-center justify-center rounded-xl border border-slate-200 bg-white px-4 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isPending || !status || (isApproving && (!selectedBank || !assignment.targetLedgerId))}
                  className={`inline-flex h-11 items-center justify-center rounded-xl px-5 text-sm font-bold !text-white transition disabled:cursor-not-allowed disabled:opacity-50 ${
                    isRejecting ? "bg-red-600 hover:bg-red-700" : "bg-emerald-600 hover:bg-emerald-700"
                  }`}
                >
                  {isPending ? "Saving…" : isApproving ? "Approve & create voucher" : isRejecting ? "Reject assignment" : status ? `Set to ${status}` : "Save status"}
                </button>
              </div>
            </form>
          </div>
        </div>
      ) : null}
    </>
  );
}
