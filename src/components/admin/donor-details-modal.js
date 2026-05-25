"use client";

import { useEffect, useId, useState } from "react";

function formatDate(value) {
  if (!value) {
    return "Not available";
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "Not available";
  }

  return new Intl.DateTimeFormat("en-GB", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  })
    .format(date)
    .replaceAll("/", "-");
}

function getInitials(name) {
  return (
    String(name ?? "")
      .split(" ")
      .filter(Boolean)
      .slice(0, 2)
      .map((part) => part[0]?.toUpperCase())
      .join("") || "DN"
  );
}

function DetailItem({ label, value }) {
  return (
    <div className="rounded-2xl border border-slate-100 bg-slate-50/80 p-4">
      <p className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-400">{label}</p>
      <p className="mt-2 break-words text-sm font-semibold text-slate-900">
        {value || "Not provided"}
      </p>
    </div>
  );
}

function StatusBadge({ children, tone }) {
  const tones = {
    amber: "border-amber-200 bg-amber-50 text-amber-700",
    emerald: "border-emerald-200 bg-emerald-50 text-emerald-700",
    slate: "border-slate-200 bg-slate-100 text-slate-700",
    cyan: "border-cyan-200 bg-cyan-50 text-cyan-700",
  };

  return (
    <span
      className={`inline-flex rounded-full border px-3 py-1 text-xs font-bold ${tones[tone] ?? tones.slate}`}
    >
      {children}
    </span>
  );
}

function ActionTooltip({ children }) {
  return (
    <span className="pointer-events-none absolute -top-10 left-1/2 z-20 -translate-x-1/2 translate-y-1 whitespace-nowrap rounded-xl border border-cyan-200/50 bg-[linear-gradient(135deg,#0f766e,#0891b2)] px-3 py-1.5 text-[11px] font-bold text-white opacity-0 shadow-xl shadow-cyan-950/20 transition duration-200 ease-out before:absolute before:left-1/2 before:top-full before:h-2 before:w-2 before:-translate-x-1/2 before:-translate-y-1 before:rotate-45 before:bg-[#0891b2] group-hover:translate-y-0 group-hover:opacity-100">
      <span className="relative z-10">{children}</span>
    </span>
  );
}

export function DonorDetailsModal({ donor }) {
  const [isOpen, setIsOpen] = useState(false);
  const titleId = useId();

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

  return (
    <>
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        className="group relative inline-flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-700 transition hover:border-cyan-200 hover:bg-cyan-50 hover:text-cyan-800"
        aria-label="View donor details"
        title="View"
      >
        <ActionTooltip>View</ActionTooltip>
        <svg className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" aria-hidden="true">
          <path d="M2.25 12s3.5-6.75 9.75-6.75S21.75 12 21.75 12s-3.5 6.75-9.75 6.75S2.25 12 2.25 12Z" />
          <circle cx="12" cy="12" r="2.75" />
        </svg>
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
            <div className="relative overflow-hidden border-b border-cyan-100 bg-[radial-gradient(circle_at_top_left,_rgba(34,211,238,0.2),_transparent_35%),linear-gradient(135deg,#f8fafc,#effcff)] p-6">
              <div className="absolute right-0 top-0 h-32 w-32 rounded-bl-full bg-cyan-100/60" />
              <div className="relative flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
                <div className="flex items-start gap-4">
                  <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-3xl bg-white text-lg font-black text-cyan-800 shadow-sm ring-1 ring-cyan-100">
                    {getInitials(donor.fullName)}
                  </div>
                  <div>
                    <p className="text-xs font-bold uppercase tracking-[0.2em] text-cyan-700">
                      Donor Profile
                    </p>
                    <h2 id={titleId} className="mt-2 text-2xl font-black tracking-tight text-slate-950">
                      {donor.fullName || "Unnamed donor"}
                    </h2>
                    <p className="mt-1 text-sm font-medium text-slate-500">{donor.email}</p>
                    <div className="mt-4 flex flex-wrap gap-2">
                      <StatusBadge tone={donor.isApprove ? "emerald" : "amber"}>
                        {donor.isApprove ? "Approved" : "Pending approval"}
                      </StatusBadge>
                      <StatusBadge tone={donor.isPublic ? "cyan" : "slate"}>
                        {donor.isPublic ? "Public profile" : "Private profile"}
                      </StatusBadge>
                    </div>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  className="inline-flex h-11 w-11 items-center justify-center rounded-2xl border border-slate-200 bg-white text-slate-500 shadow-sm transition hover:border-red-200 hover:bg-red-50 hover:text-red-500"
                  aria-label="Close donor details"
                >
                  <svg className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path d="m6 6 12 12M18 6 6 18" strokeLinecap="round" />
                  </svg>
                </button>
              </div>
            </div>

            <div className="max-h-[calc(92vh-180px)] overflow-y-auto p-6">
              <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                <DetailItem label="Mobile" value={donor.mobile} />
                <DetailItem label="Profession" value={donor.profession} />
                <DetailItem label="Donor Type" value={donor.donorType || "General"} />
                <DetailItem label="Donation Frequency" value={donor.frequency} />
                <DetailItem label="Donation Purpose" value={donor.purpose} />
                <DetailItem label="Joined Date" value={formatDate(donor.createdAt)} />
                <DetailItem label="Contact Person" value={donor.contactFullName} />
                <DetailItem label="Contact Mobile" value={donor.contactMobile} />
                <DetailItem label="Contact Telephone" value={donor.contactTelephone} />
              </div>

              <div className="mt-4 rounded-3xl border border-slate-100 bg-white p-5 shadow-sm shadow-cyan-950/5">
                <p className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-400">
                  Address
                </p>
                <p className="mt-3 text-sm font-medium leading-7 text-slate-700">
                  {donor.address || "Not provided"}
                </p>
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}
