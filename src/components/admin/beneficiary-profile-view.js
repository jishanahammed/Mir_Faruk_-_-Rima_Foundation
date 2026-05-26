import Link from "next/link";
import { updateBeneficiaryStatusAction } from "@/app/admin/beneficiaries/actions";
import { AutoSubmitSelect } from "@/components/admin/auto-submit-select";
import { BeneficiaryReportDownloadButton } from "@/components/admin/beneficiary-report-download-button";
import { BENEFICIARY_STATUS_OPTIONS } from "@/lib/api/admin-beneficiary-service";

const statusClassNames = {
  Pending: "border-amber-200 bg-amber-50 text-amber-700",
  UnderReview: "border-cyan-200 bg-cyan-50 text-cyan-700",
  Approved: "border-emerald-200 bg-emerald-50 text-emerald-700",
  Rejected: "border-red-200 bg-red-50 text-red-700",
};

function formatDate(value, options = {}) {
  if (!value) {
    return "Not available";
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "Not available";
  }

  return new Intl.DateTimeFormat("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    ...options,
  }).format(date);
}

function formatCurrency(value) {
  const amount = Number(value ?? 0);

  if (!Number.isFinite(amount)) {
    return "0 BDT";
  }

  return `${new Intl.NumberFormat("en-BD", {
    maximumFractionDigits: 0,
  }).format(amount)} BDT`;
}

function formatFileSize(value) {
  const size = Number(value ?? 0);

  if (!Number.isFinite(size) || size <= 0) {
    return "Unknown size";
  }

  const units = ["B", "KB", "MB", "GB"];
  let currentSize = size;
  let unitIndex = 0;

  while (currentSize >= 1024 && unitIndex < units.length - 1) {
    currentSize /= 1024;
    unitIndex += 1;
  }

  const decimals = unitIndex === 0 ? 0 : currentSize < 10 ? 1 : 0;
  return `${currentSize.toFixed(decimals)} ${units[unitIndex]}`;
}

function getInitials(name) {
  return (
    String(name ?? "")
      .split(" ")
      .filter(Boolean)
      .slice(0, 2)
      .map((part) => part[0]?.toUpperCase())
      .join("") || "BF"
  );
}

function isImageDocument(document) {
  const documentType = String(document.documentType ?? "").toLowerCase();
  const fileName = String(document.originalFileName ?? "").toLowerCase();
  const filePath = String(document.filePath ?? document.fileUrl ?? "").toLowerCase();
  const imageExtensions = ["jpg", "jpeg", "png", "webp"];

  return (
    documentType === "applicantphoto" ||
    documentType === "guarantorphoto" ||
    documentType === "beneficiaryphoto" ||
    String(document.contentType ?? "").toLowerCase().startsWith("image/") ||
    imageExtensions.includes(String(document.extension ?? "").toLowerCase()) ||
    imageExtensions.some((extension) => fileName.endsWith(`.${extension}`)) ||
    imageExtensions.some((extension) => filePath.endsWith(`.${extension}`))
  );
}

function isPdfDocument(document) {
  return (
    String(document.contentType ?? "").toLowerCase() === "application/pdf" ||
    document.extension === "pdf"
  );
}

function StatusBadge({ status }) {
  return (
    <span
      className={`inline-flex rounded-full border px-3 py-1 text-xs font-bold ${
        statusClassNames[status] ?? statusClassNames.Pending
      }`}
    >
      {status}
    </span>
  );
}

function BooleanBadge({ value, trueLabel = "Yes", falseLabel = "No" }) {
  return (
    <span
      className={`inline-flex rounded-full border px-3 py-1 text-xs font-semibold ${
        value
          ? "border-emerald-200 bg-emerald-50 text-emerald-700"
          : "border-slate-200 bg-slate-100 text-slate-600"
      }`}
    >
      {value ? trueLabel : falseLabel}
    </span>
  );
}

function Section({ eyebrow, title, description, children }) {
  return (
    <section className="overflow-hidden rounded-[28px] border border-slate-200 bg-white shadow-sm shadow-cyan-950/5">
      <div className="border-b border-slate-100 px-6 py-5">
        <p className="text-xs font-bold uppercase tracking-[0.18em] text-cyan-700">{eyebrow}</p>
        <h2 className="mt-2 text-xl font-bold tracking-tight text-slate-950">{title}</h2>
        {description ? <p className="mt-2 text-sm leading-6 text-slate-500">{description}</p> : null}
      </div>
      <div className="p-6">{children}</div>
    </section>
  );
}

function DetailItem({ label, value, className = "" }) {
  return (
    <div className={`rounded-2xl border border-slate-100 bg-slate-50/80 p-4 ${className}`}>
      <p className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-400">{label}</p>
      <p className="mt-2 break-words text-sm font-semibold leading-6 text-slate-900">
        {value || "Not provided"}
      </p>
    </div>
  );
}

function LongTextItem({ label, value }) {
  return (
    <div className="rounded-3xl border border-slate-100 bg-white p-5 shadow-sm shadow-cyan-950/5">
      <p className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-400">{label}</p>
      <p className="mt-3 whitespace-pre-wrap text-sm leading-7 text-slate-700">
        {value || "Not provided"}
      </p>
    </div>
  );
}

function DocumentPreview({ document }) {
  if (isImageDocument(document)) {
    return (
      <a href={document.fileUrl} target="_blank" rel="noreferrer" className="block">
        <img
          src={document.fileUrl}
          alt={document.label}
          className="h-56 w-full rounded-2xl object-cover"
        />
      </a>
    );
  }

  if (isPdfDocument(document)) {
    return (
      <iframe
        src={document.fileUrl}
        title={document.label}
        className="h-56 w-full rounded-2xl border border-slate-200 bg-slate-50"
      />
    );
  }

  return (
    <div className="flex h-56 items-center justify-center rounded-2xl border border-dashed border-slate-300 bg-slate-50 px-6 text-center">
      <div>
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-white text-slate-500 shadow-sm ring-1 ring-slate-200">
          <svg
            className="h-7 w-7"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <path d="M7 3.75h6.5L19.25 9.5V19A1.75 1.75 0 0 1 17.5 20.75h-10A1.75 1.75 0 0 1 5.75 19v-13.5A1.75 1.75 0 0 1 7.5 3.75Z" />
            <path d="M13 3.75V9.5h5.75" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
        <p className="mt-4 text-sm font-semibold text-slate-700">{document.originalFileName}</p>
        <p className="mt-1 text-xs text-slate-500">Preview is not available for this file type.</p>
      </div>
    </div>
  );
}

function DocumentCard({ document }) {
  return (
    <article className="rounded-[26px] border border-slate-200 bg-white p-4 shadow-sm shadow-cyan-950/5">
      <div className="mb-4 flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="text-sm font-bold text-slate-950">{document.label}</p>
          <p className="mt-1 break-all text-xs text-slate-500">{document.originalFileName}</p>
        </div>
        <span className="inline-flex rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-[11px] font-semibold text-slate-600">
          {formatFileSize(document.fileSize)}
        </span>
      </div>

      <DocumentPreview document={document} />

      <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
        <div className="text-xs text-slate-500">
          Uploaded {formatDate(document.uploadedAt, { day: "2-digit", month: "short", year: "numeric" })}
        </div>
        <a
          href={document.fileUrl}
          target="_blank"
          rel="noreferrer"
          className="inline-flex h-10 items-center justify-center rounded-xl border border-cyan-200 bg-cyan-50 px-4 text-sm font-semibold text-cyan-800 transition hover:border-cyan-300 hover:bg-cyan-100"
        >
          Open document
        </a>
      </div>
    </article>
  );
}

function StatusControl({ beneficiary, currentPath }) {
  return (
    <form action={updateBeneficiaryStatusAction} className="space-y-3">
      <input type="hidden" name="id" value={beneficiary.id} />
      <input type="hidden" name="returnPath" value={currentPath} />
      <label className="block">
        <span className="mb-2 block text-xs font-semibold uppercase tracking-[0.14em] text-slate-500">
          Review status
        </span>
        <AutoSubmitSelect
          name="status"
          defaultValue={beneficiary.status}
          className="h-12 w-full rounded-2xl border border-slate-200 bg-white px-4 text-sm font-semibold text-slate-900 outline-none transition focus:border-cyan-400 focus:ring-4 focus:ring-cyan-100"
        >
          {BENEFICIARY_STATUS_OPTIONS.map((status) => (
            <option key={status} value={status}>
              {status}
            </option>
          ))}
        </AutoSubmitSelect>
      </label>
      <p className="text-xs leading-5 text-slate-500">
        Changing the selection updates the beneficiary status immediately.
      </p>
    </form>
  );
}

export function BeneficiaryProfileView({ beneficiary, backHref, currentPath }) {
  return (
    <div className="space-y-6">
      <section className="overflow-hidden rounded-[32px] border border-cyan-100 bg-white shadow-xl shadow-cyan-950/5">
        <div className="bg-[radial-gradient(circle_at_top_left,_rgba(34,211,238,0.18),_transparent_38%),linear-gradient(135deg,#f8fafc,#effcff)] p-6 sm:p-7">
          <div className="flex flex-col gap-6 xl:flex-row xl:items-start xl:justify-between">
            <div className="flex items-start gap-4">
              <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-3xl bg-white text-lg font-black text-cyan-800 shadow-sm ring-1 ring-cyan-100">
                {getInitials(beneficiary.fullName)}
              </div>
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.2em] text-cyan-700">
                  Beneficiary Profile
                </p>
                <h1 className="mt-2 text-3xl font-black tracking-tight text-slate-950">
                  {beneficiary.fullName || "Unnamed beneficiary"}
                </h1>
                <p className="mt-2 text-sm font-medium text-slate-500">
                  ID #{beneficiary.id} - User {beneficiary.userId || "Not assigned"}
                </p>
                <div className="mt-4 flex flex-wrap gap-2">
                  <StatusBadge status={beneficiary.status} />
                  <span className="inline-flex rounded-full border border-slate-200 bg-white px-3 py-1 text-xs font-semibold text-slate-600">
                    {beneficiary.documentCount} documents
                  </span>
                  <span className="inline-flex rounded-full border border-slate-200 bg-white px-3 py-1 text-xs font-semibold text-slate-600">
                    Submitted {formatDate(beneficiary.submittedAt || beneficiary.createdAt)}
                  </span>
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row xl:flex-col">
              <div className="flex flex-col gap-3 sm:flex-row xl:flex-col">
                <Link
                  href={backHref}
                  className="inline-flex h-12 items-center justify-center rounded-2xl border border-slate-200 bg-white px-5 text-sm font-semibold text-slate-700 transition hover:border-cyan-200 hover:text-cyan-800"
                >
                  Back to list
                </Link>
                <BeneficiaryReportDownloadButton beneficiary={beneficiary} />
              </div>
              <div className="min-w-[280px] rounded-[26px] border border-white/70 bg-white/90 p-4 shadow-sm backdrop-blur">
                <StatusControl beneficiary={beneficiary} currentPath={currentPath} />
              </div>
            </div>
          </div>
        </div>
      </section>

      <Section
        eyebrow="Overview"
        title="Application summary"
        description="Core beneficiary account information with registration and review timestamps."
      >
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          <DetailItem label="Mobile Number" value={beneficiary.mobile} />
          <DetailItem label="Email Address" value={beneficiary.email} />
          <DetailItem label="NID / Birth Number" value={beneficiary.nidOrBirthNumber} />
          <DetailItem label="Date of Birth" value={formatDate(beneficiary.dateOfBirth)} />
          <DetailItem label="Gender" value={beneficiary.gender} />
          <DetailItem label="Marital Status" value={beneficiary.maritalStatus} />
          <DetailItem label="Family Members" value={String(beneficiary.familyMembers || 0)} />
          <DetailItem label="Current Status" value={beneficiary.status} />
          <DetailItem label="Submitted At" value={formatDate(beneficiary.submittedAt)} />
          <DetailItem label="Created At" value={formatDate(beneficiary.createdAt)} />
          <DetailItem label="Last Updated" value={formatDate(beneficiary.updatedAt)} />
          <DetailItem label="Agreement Accepted" value={formatDate(beneficiary.acceptedAt)} />
        </div>
      </Section>

      <Section
        eyebrow="Personal Info"
        title="Beneficiary identity and address"
        description="Primary applicant information as submitted during registration."
      >
        <div className="grid gap-4 lg:grid-cols-2 xl:grid-cols-3">
          <DetailItem label="Full Name" value={beneficiary.fullName} />
          <DetailItem label="Father / Husband Name" value={beneficiary.fatherOrHusbandName} />
          <DetailItem label="Mother Name" value={beneficiary.motherName} />
          <DetailItem label="District" value={beneficiary.district} />
          <DetailItem label="Upazila" value={beneficiary.upazila} />
          <DetailItem label="Union / Ward" value={beneficiary.unionWard} />
          <DetailItem label="Village / Area" value={beneficiary.villageArea} className="xl:col-span-3" />
          <DetailItem label="Present Address" value={beneficiary.presentAddress} className="xl:col-span-3" />
          <DetailItem label="Permanent Address" value={beneficiary.permanentAddress} className="xl:col-span-3" />
        </div>
      </Section>

      <Section
        eyebrow="Assistance"
        title="Financial need and support request"
        description="Income profile, assistance type, and the stated purpose behind the request."
      >
        <div className="grid gap-4 lg:grid-cols-2 xl:grid-cols-4">
          <DetailItem label="Monthly Income" value={formatCurrency(beneficiary.monthlyIncome)} />
          <DetailItem label="Main Occupation" value={beneficiary.mainOccupation} />
          <DetailItem label="Financial Condition" value={beneficiary.financialCondition} />
          <DetailItem label="Assistance Type" value={beneficiary.assistanceType} />
          <DetailItem label="Expected Assistance" value={beneficiary.expectedAssistance} className="xl:col-span-2" />
          <div className="rounded-2xl border border-slate-100 bg-slate-50/80 p-4">
            <p className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-400">
              Repayment Commitment
            </p>
            <div className="mt-3">
              <BooleanBadge value={beneficiary.repaymentCommitment} trueLabel="Confirmed" falseLabel="Not confirmed" />
            </div>
          </div>
        </div>
        <div className="mt-4 grid gap-4 xl:grid-cols-2">
          <LongTextItem label="Reason for Assistance" value={beneficiary.assistanceReason} />
          <LongTextItem label="Purpose of Assistance" value={beneficiary.assistancePurpose} />
        </div>
      </Section>

      <Section
        eyebrow="Guarantor"
        title="Guarantor verification details"
        description="Contact and relationship details for the person who confirmed this application."
      >
        <div className="grid gap-4 lg:grid-cols-2 xl:grid-cols-4">
          <DetailItem label="Guarantor Name" value={beneficiary.guarantorName} />
          <DetailItem
            label="Father / Husband Name"
            value={beneficiary.guarantorFatherOrHusbandName}
          />
          <DetailItem label="NID Number" value={beneficiary.guarantorNid} />
          <DetailItem label="Mobile Number" value={beneficiary.guarantorMobile} />
          <DetailItem label="Email Address" value={beneficiary.guarantorEmail} />
          <DetailItem label="Occupation" value={beneficiary.guarantorOccupation} />
          <DetailItem label="Relationship" value={beneficiary.guarantorRelation} />
          <DetailItem label="Known Duration" value={beneficiary.knownDuration} />
          <DetailItem label="Confirms Information" value={beneficiary.confirmsInfo} />
          <DetailItem label="Supports Verification" value={beneficiary.supportsVerification} />
          <DetailItem label="District" value={beneficiary.guarantorDistrict} />
          <DetailItem label="Upazila" value={beneficiary.guarantorUpazila} />
          <DetailItem
            label="Present Address"
            value={beneficiary.guarantorPresentAddress}
            className="xl:col-span-2"
          />
          <DetailItem
            label="Permanent Address"
            value={beneficiary.guarantorPermanentAddress}
            className="xl:col-span-2"
          />
        </div>
        <div className="mt-4">
          <LongTextItem label="Guarantor Comment" value={beneficiary.guarantorComment} />
        </div>
      </Section>

      <Section
        eyebrow="Agreement"
        title="Submitted confirmations"
        description="Boolean confirmations captured when the applicant completed the registration form."
      >
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-5">
          <div className="rounded-2xl border border-slate-100 bg-slate-50/80 p-4">
            <p className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-400">
              Terms accepted
            </p>
            <div className="mt-3">
              <BooleanBadge value={beneficiary.termsAccepted} trueLabel="Accepted" falseLabel="Missing" />
            </div>
          </div>
          <div className="rounded-2xl border border-slate-100 bg-slate-50/80 p-4">
            <p className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-400">
              Truth confirmed
            </p>
            <div className="mt-3">
              <BooleanBadge value={beneficiary.truthConfirmed} trueLabel="Confirmed" falseLabel="Missing" />
            </div>
          </div>
          <div className="rounded-2xl border border-slate-100 bg-slate-50/80 p-4">
            <p className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-400">
              Guarantor known
            </p>
            <div className="mt-3">
              <BooleanBadge
                value={beneficiary.guarantorKnownConfirmed}
                trueLabel="Confirmed"
                falseLabel="Missing"
              />
            </div>
          </div>
          <div className="rounded-2xl border border-slate-100 bg-slate-50/80 p-4">
            <p className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-400">
              Guarantor cooperation
            </p>
            <div className="mt-3">
              <BooleanBadge
                value={beneficiary.guarantorCooperationConfirmed}
                trueLabel="Confirmed"
                falseLabel="Missing"
              />
            </div>
          </div>
          <div className="rounded-2xl border border-slate-100 bg-slate-50/80 p-4">
            <p className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-400">
              Digital signature
            </p>
            <div className="mt-3">
              <BooleanBadge
                value={beneficiary.digitalSignatureConfirmed}
                trueLabel="Confirmed"
                falseLabel="Missing"
              />
            </div>
          </div>
        </div>
      </Section>

      <Section
        eyebrow="Documents"
        title="Uploaded documentation"
        description="All submitted beneficiary documents are previewed below when the file type supports it."
      >
        {beneficiary.documents.length ? (
          <div className="grid gap-4 xl:grid-cols-2">
            {beneficiary.documents.map((document) => (
              <DocumentCard key={document.id || document.fileUrl} document={document} />
            ))}
          </div>
        ) : (
          <div className="rounded-[28px] border border-dashed border-slate-300 bg-slate-50 px-6 py-16 text-center">
            <p className="text-base font-semibold text-slate-800">No uploaded documents found.</p>
            <p className="mt-2 text-sm text-slate-500">
              This beneficiary profile does not currently include any saved supporting files.
            </p>
          </div>
        )}
      </Section>
    </div>
  );
}
