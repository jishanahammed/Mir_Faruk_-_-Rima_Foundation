"use client";

import { useActionState, useEffect, useId, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { addPaymentHistoryAction } from "@/app/admin/donersPayment/actions";
import {
  ADMIN_APPROVAL_STATUS_OPTIONS,
  DONATION_TYPE_OPTIONS,
  PAYMENT_METHOD_OPTIONS,
  PAYMENT_STATUS_OPTIONS,
} from "@/lib/donor-payment-history-options";

function formatLabel(value) {
  const labels = {
    GeneralDonation: "General Donation",
    QardEHasanaFund: "Qard-e-Hasana Fund",
    bKash: "bKash",
  };

  if (labels[value]) {
    return labels[value];
  }

  return String(value ?? "")
    .replace(/([a-z])([A-Z])/g, "$1 $2")
    .trim();
}

function todayInputValue() {
  return new Date().toISOString().slice(0, 10);
}

function FieldLabel({ children, required = false }) {
  return (
    <span className="mb-2 block text-xs font-semibold uppercase tracking-[0.14em] text-slate-500">
      {children}
      {required ? <span className="ml-1 text-red-500">*</span> : null}
    </span>
  );
}

function TextField({
  name,
  label,
  type = "text",
  placeholder,
  required = false,
  defaultValue = "",
  min,
  step,
}) {
  return (
    <label className="block">
      <FieldLabel required={required}>{label}</FieldLabel>
      <input
        name={name}
        type={type}
        required={required}
        defaultValue={defaultValue}
        placeholder={placeholder}
        min={min}
        step={step}
        className="h-12 w-full rounded-2xl border border-slate-200 bg-white px-4 text-sm font-medium text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-cyan-400 focus:ring-4 focus:ring-cyan-100"
      />
    </label>
  );
}

function SelectField({ name, label, options, required = false, defaultValue = "" }) {
  return (
    <label className="block">
      <FieldLabel required={required}>{label}</FieldLabel>
      <select
        name={name}
        required={required}
        defaultValue={defaultValue}
        className="h-12 w-full rounded-2xl border border-slate-200 bg-white px-4 text-sm font-medium text-slate-900 outline-none transition focus:border-cyan-400 focus:ring-4 focus:ring-cyan-100"
      >
        <option value="">Select {label.toLowerCase()}</option>
        {options.map((option) => (
          <option key={option} value={option}>
            {formatLabel(option)}
          </option>
        ))}
      </select>
    </label>
  );
}

function getDonorLabel(donor) {
  const contact = [donor.email, donor.mobile].filter(Boolean).join(" | ");
  return `${donor.fullName || "Unnamed donor"}${contact ? ` - ${contact}` : ""}`;
}

function DonorSelectField({ donors }) {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [selectedDonorId, setSelectedDonorId] = useState("");
  const searchInputRef = useRef(null);
  const selectedDonor = donors.find((donor) => String(donor.id) === selectedDonorId);
  const normalizedSearch = search.trim().toLowerCase();
  const filteredDonors = normalizedSearch
    ? donors.filter((donor) =>
        [
          donor.fullName,
          donor.email,
          donor.mobile,
          donor.id,
        ]
          .join(" ")
          .toLowerCase()
          .includes(normalizedSearch),
      )
    : donors;

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    const timeout = window.setTimeout(() => {
      searchInputRef.current?.focus();
    }, 0);

    return () => {
      window.clearTimeout(timeout);
    };
  }, [isOpen]);

  return (
    <div className="block">
      <FieldLabel required>Donor</FieldLabel>
      <div className="relative">
        <input type="hidden" name="donorId" value={selectedDonorId} />
        <button
          type="button"
          disabled={!donors.length}
          aria-expanded={isOpen}
          onClick={() => setIsOpen((value) => !value)}
          className="flex h-12 w-full items-center justify-between gap-3 rounded-2xl border border-slate-200 bg-white px-4 text-left text-sm font-medium text-slate-900 outline-none transition focus:border-cyan-400 focus:ring-4 focus:ring-cyan-100 disabled:cursor-not-allowed disabled:bg-slate-100 disabled:text-slate-400"
        >
          <span className="min-w-0 truncate">
            {selectedDonor
              ? `#${selectedDonor.id} - ${getDonorLabel(selectedDonor)}`
              : donors.length
                ? "Select donor"
                : "No donors available"}
          </span>
          <svg className="h-4 w-4 shrink-0 text-slate-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" aria-hidden="true">
            <path d="m6 9 6 6 6-6" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>

        {isOpen ? (
          <div className="absolute left-0 right-0 top-14 z-50 overflow-hidden rounded-2xl border border-cyan-100 bg-white shadow-2xl shadow-slate-950/15">
            <div className="border-b border-slate-100 p-3">
              <input
                ref={searchInputRef}
                type="search"
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Search donor name, email, mobile, or ID"
                className="h-11 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 text-sm font-medium text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-cyan-400 focus:bg-white focus:ring-4 focus:ring-cyan-100"
              />
            </div>
            <div className="max-h-64 overflow-y-auto p-2">
              {filteredDonors.length ? (
                filteredDonors.map((donor) => (
                  <button
                    key={donor.id}
                    type="button"
                    onClick={() => {
                      setSelectedDonorId(String(donor.id));
                      setIsOpen(false);
                      setSearch("");
                    }}
                    className={`block w-full rounded-xl px-3 py-2.5 text-left text-sm transition ${
                      String(donor.id) === selectedDonorId
                        ? "bg-cyan-50 text-cyan-800 ring-1 ring-cyan-200"
                        : "text-slate-700 hover:bg-slate-50 hover:text-slate-950"
                    }`}
                  >
                    <span className="block truncate font-semibold">
                      #{donor.id} - {donor.fullName || "Unnamed donor"}
                    </span>
                    <span className="mt-1 block truncate text-xs text-slate-500">
                      {[donor.email, donor.mobile].filter(Boolean).join(" | ") || "No contact added"}
                    </span>
                  </button>
                ))
              ) : (
                <p className="px-3 py-6 text-center text-sm font-medium text-slate-500">
                  No donors match this search.
                </p>
              )}
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
}

export function AddDonorPaymentHistoryModal({ donors = [] }) {
  const [isOpen, setIsOpen] = useState(false);
  const [state, formAction, pending] = useActionState(addPaymentHistoryAction, null);
  const titleId = useId();
  const router = useRouter();

  useEffect(() => {
    if (!isOpen) {
      return undefined;
    }

    function handleKeyDown(event) {
      if (event.key === "Escape") {
        setIsOpen(false);
      }
    }

    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen]);

  useEffect(() => {
    if (!state?.success) {
      return;
    }

    setIsOpen(false);
    router.refresh();
  }, [router, state]);

  return (
    <>
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        className="inline-flex h-12 items-center justify-center rounded-2xl bg-[linear-gradient(135deg,#0f766e,#0891b2)] px-5 text-sm font-semibold !text-white shadow-lg shadow-cyan-200/80 transition hover:-translate-y-0.5 hover:shadow-xl hover:shadow-cyan-300/70"
      >
        Add payment history
      </button>

      {isOpen ? (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/55 px-4 py-6 backdrop-blur-sm"
          role="dialog"
          aria-modal="true"
          aria-labelledby={titleId}
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) {
              setIsOpen(false);
            }
          }}
        >
          <div className="max-h-[92vh] w-full max-w-4xl overflow-hidden rounded-[30px] border border-white/70 bg-white shadow-2xl shadow-slate-950/25">
            <div className="border-b border-cyan-100 bg-[radial-gradient(circle_at_top_left,_rgba(34,211,238,0.2),_transparent_35%),linear-gradient(135deg,#f8fafc,#effcff)] p-6">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-xs font-bold uppercase tracking-[0.2em] text-cyan-700">
                    Donor Payments
                  </p>
                  <h2 id={titleId} className="mt-2 text-2xl font-black tracking-tight text-slate-950">
                    Add payment history
                  </h2>
                  <p className="mt-2 text-sm leading-6 text-slate-600">
                    Record a donor transaction and set the initial payment and approval status.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border border-slate-200 bg-white text-slate-500 shadow-sm transition hover:border-red-200 hover:bg-red-50 hover:text-red-500"
                  aria-label="Close add payment history modal"
                >
                  <svg className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path d="m6 6 12 12M18 6 6 18" strokeLinecap="round" />
                  </svg>
                </button>
              </div>
            </div>

            <form action={formAction} className="max-h-[calc(92vh-170px)] overflow-y-auto p-6">
              <div className="grid gap-4 md:grid-cols-2">
                <DonorSelectField donors={donors} />
                <TextField
                  name="transactionId"
                  label="Transaction ID"
                  required
                  placeholder="Example: TXN-2026-001"
                />
                <SelectField
                  name="donationType"
                  label="Donation Type"
                  options={DONATION_TYPE_OPTIONS}
                  required
                  defaultValue={DONATION_TYPE_OPTIONS[0]}
                />
                <SelectField
                  name="paymentMethod"
                  label="Payment Method"
                  options={PAYMENT_METHOD_OPTIONS}
                  required
                  defaultValue={PAYMENT_METHOD_OPTIONS[0]}
                />
                <TextField
                  name="paymentDate"
                  label="Payment Date"
                  type="date"
                  required
                  defaultValue={todayInputValue()}
                />
                <TextField
                  name="amount"
                  label="Amount"
                  type="number"
                  min="0.01"
                  step="0.01"
                  required
                  placeholder="Example: 5000"
                />
                <TextField
                  name="currency"
                  label="Currency"
                  required
                  defaultValue="BDT"
                  placeholder="BDT"
                />
                <SelectField
                  name="paymentStatus"
                  label="Payment Status"
                  options={PAYMENT_STATUS_OPTIONS}
                  required
                  defaultValue="Success"
                />
                <SelectField
                  name="adminApprovalStatus"
                  label="Admin Approval Status"
                  options={ADMIN_APPROVAL_STATUS_OPTIONS}
                  required
                  defaultValue="Waiting"
                />
                <TextField
                  name="receiptUrl"
                  label="Receipt URL"
                  type="url"
                  placeholder="https://example.com/receipt.pdf"
                />
              </div>

              <label className="mt-4 block">
                <FieldLabel>Remarks</FieldLabel>
                <textarea
                  name="remarks"
                  rows={4}
                  placeholder="Optional note"
                  className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-medium text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-cyan-400 focus:ring-4 focus:ring-cyan-100"
                />
              </label>

              {state?.message ? (
                <div
                  className={`mt-4 rounded-2xl border px-4 py-3 text-sm font-semibold ${
                    state.success
                      ? "border-emerald-200 bg-emerald-50 text-emerald-700"
                      : "border-red-200 bg-red-50 text-red-700"
                  }`}
                >
                  {state.message}
                </div>
              ) : null}

              <div className="mt-6 flex flex-col-reverse gap-3 border-t border-slate-100 pt-5 sm:flex-row sm:items-center sm:justify-end">
                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  className="inline-flex h-12 items-center justify-center rounded-2xl border border-slate-200 bg-white px-5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={pending}
                  className="inline-flex h-12 items-center justify-center rounded-2xl bg-slate-950 px-5 text-sm font-semibold !text-white transition hover:bg-cyan-700 disabled:cursor-not-allowed disabled:opacity-70"
                >
                  {pending ? "Saving..." : "Save payment history"}
                </button>
              </div>
            </form>
          </div>
        </div>
      ) : null}
    </>
  );
}
