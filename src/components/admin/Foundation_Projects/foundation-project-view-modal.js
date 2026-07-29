"use client";

import { useRouter } from "next/navigation";
import Link from "next/link";

const STATUS_STYLES = {
  draft:     "bg-slate-100 text-slate-600",
  active:    "bg-emerald-50 text-emerald-700",
  running:   "bg-cyan-50 text-cyan-700",
  completed: "bg-violet-50 text-violet-700",
  cancelled: "bg-rose-50 text-rose-700",
};

function Row({ label, value }) {
  if (!value && value !== 0) return null;
  return (
    <div className="flex flex-col gap-0.5">
      <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400">{label}</span>
      <span className="text-sm text-slate-800 whitespace-pre-wrap break-words">{value}</span>
    </div>
  );
}

function Section({ title, children }) {
  const hasContent = Array.isArray(children)
    ? children.some(Boolean)
    : Boolean(children);
  if (!hasContent) return null;
  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center gap-3">
        <span className="text-xs font-bold uppercase tracking-widest text-cyan-700">{title}</span>
        <span className="h-px flex-1 bg-cyan-100" />
      </div>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">{children}</div>
    </div>
  );
}

function buildImageUrl(rawPath) {
  if (!rawPath) return null;
  const clean = rawPath.replace(/\\/g, "/").replace(/^~\//, "").replace(/^\/+/, "");
  return `/api/asset?path=${encodeURIComponent(clean)}`;
}

export function FoundationProjectViewModal({ params, allProjects }) {
  const router = useRouter();
  const viewId = params?.view ? Number(params.view) : null;
  const project = viewId ? allProjects.find((p) => p.id === viewId) : null;

  if (!project) return null;

  function close() {
    router.push("/admin/Foundation_Projects");
  }

  const status = project.status ?? "draft";
  const images = project.images ?? [];

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto p-4 sm:p-8"
      onClick={(e) => e.target === e.currentTarget && close()}
    >
      <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm" aria-hidden="true" onClick={close} />

      <div className="relative z-10 my-4 w-full max-w-4xl rounded-3xl bg-white shadow-2xl shadow-slate-900/20">
        {/* Header */}
        <div className="rounded-t-3xl bg-[linear-gradient(135deg,#0f766e,#0891b2)] px-6 py-5">
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1 min-w-0">
              <p className="text-xs font-bold uppercase tracking-widest text-cyan-200">Foundation Projects</p>
              <h2 className="mt-0.5 text-lg font-extrabold text-white truncate">{project.projectTitleEn}</h2>
              <p className="mt-0.5 text-sm text-cyan-100/80 truncate">{project.projectTitleBn}</p>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <span className={`rounded-full px-3 py-1 text-xs font-bold capitalize ${STATUS_STYLES[status] ?? STATUS_STYLES.draft}`}>
                {status}
              </span>
              <Link
                href={`?edit=${project.id}`}
                className="flex h-8 items-center gap-1.5 rounded-full bg-white/20 px-3 text-xs font-bold text-white hover:bg-white/30 transition"
              >
                Edit
              </Link>
              <button
                onClick={close}
                className="flex h-8 w-8 items-center justify-center rounded-full bg-white/20 text-white hover:bg-white/30 transition"
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-4 w-4">
                  <path d="M18 6 6 18M6 6l12 12" strokeLinecap="round" />
                </svg>
              </button>
            </div>
          </div>
        </div>

        {/* Body */}
        <div className="flex flex-col gap-6 p-6">

          {/* Basic */}
          <div className="flex flex-col gap-3">
            <div className="flex items-center gap-3">
              <span className="text-xs font-bold uppercase tracking-widest text-cyan-700">Basic Information</span>
              <span className="h-px flex-1 bg-cyan-100" />
            </div>
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
              <Row label="Project Code" value={project.projectCode} />
              <Row label="Category" value={project.categoryNameEn} />
              <Row label="Status" value={status} />
              <Row label="Sort Order" value={project.sortOrder} />
            </div>
          </div>

          {/* Titles */}
          <Section title="Project Title">
            <Row label="English" value={project.projectTitleEn} />
            <Row label="Bangla" value={project.projectTitleBn} />
            <Row label="Danish" value={project.projectTitleDk} />
          </Section>

          {/* Short Desc */}
          <Section title="Short Description">
            <Row label="English" value={project.shortDescriptionEn} />
            <Row label="Bangla" value={project.shortDescriptionBn} />
            <Row label="Danish" value={project.shortDescriptionDk} />
          </Section>

          {/* Full Desc */}
          <Section title="Full Description">
            <Row label="English" value={project.fullDescriptionEn} />
            <Row label="Bangla" value={project.fullDescriptionBn} />
            <Row label="Danish" value={project.fullDescriptionDk} />
          </Section>

          {/* Objective */}
          <Section title="Objective">
            <Row label="English" value={project.objectiveEn} />
            <Row label="Bangla" value={project.objectiveBn} />
            <Row label="Danish" value={project.objectiveDk} />
          </Section>

          {/* Beneficiary & Location */}
          <div className="flex flex-col gap-3">
            <div className="flex items-center gap-3">
              <span className="text-xs font-bold uppercase tracking-widest text-cyan-700">Beneficiary & Location</span>
              <span className="h-px flex-1 bg-cyan-100" />
            </div>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <Row label="Target Beneficiary" value={project.targetBeneficiary} />
              <Row label="Location (EN)" value={project.projectLocationEn} />
              <Row label="Location (BN)" value={project.projectLocationBn} />
              <Row label="Location (DK)" value={project.projectLocationDk} />
            </div>
            {(project.divisionId || project.districtId || project.upazilaId) && (
              <div className="grid grid-cols-3 gap-4">
                <Row label="Division ID" value={project.divisionId} />
                <Row label="District ID" value={project.districtId} />
                <Row label="Upazila ID" value={project.upazilaId} />
              </div>
            )}
          </div>

          {/* Budget */}
          <div className="flex flex-col gap-3">
            <div className="flex items-center gap-3">
              <span className="text-xs font-bold uppercase tracking-widest text-cyan-700">Budget</span>
              <span className="h-px flex-1 bg-cyan-100" />
            </div>
            <div className="grid grid-cols-3 gap-4">
              <div className="flex flex-col gap-0.5 rounded-2xl border border-slate-100 bg-slate-50 p-4">
                <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Estimated</span>
                <span className="text-xl font-extrabold text-slate-800">
                  {project.estimatedBudget != null ? `৳${Number(project.estimatedBudget).toLocaleString()}` : "—"}
                </span>
              </div>
              <div className="flex flex-col gap-0.5 rounded-2xl border border-emerald-100 bg-emerald-50 p-4">
                <span className="text-[10px] font-bold uppercase tracking-widest text-emerald-500">Collected</span>
                <span className="text-xl font-extrabold text-emerald-700">
                  {project.collectedAmount != null ? `৳${Number(project.collectedAmount).toLocaleString()}` : "—"}
                </span>
              </div>
              <div className="flex flex-col gap-0.5 rounded-2xl border border-cyan-100 bg-cyan-50 p-4">
                <span className="text-[10px] font-bold uppercase tracking-widest text-cyan-500">Distributed</span>
                <span className="text-xl font-extrabold text-cyan-700">
                  {project.distributedAmount != null ? `৳${Number(project.distributedAmount).toLocaleString()}` : "—"}
                </span>
              </div>
            </div>
          </div>

          {/* Images */}
          {images.length > 0 && (
            <div className="flex flex-col gap-3">
              <div className="flex items-center gap-3">
                <span className="text-xs font-bold uppercase tracking-widest text-cyan-700">Images</span>
                <span className="h-px flex-1 bg-cyan-100" />
                <span className="text-xs text-slate-400">{images.length} image{images.length !== 1 ? "s" : ""}</span>
              </div>
              <div className="grid grid-cols-3 gap-3 sm:grid-cols-4 lg:grid-cols-5">
                {images.map((img, idx) => (
                  <a
                    key={idx}
                    href={buildImageUrl(img.imagePath)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group relative aspect-square overflow-hidden rounded-xl border border-slate-200 bg-slate-100 shadow-sm"
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={buildImageUrl(img.imagePath)}
                      alt={`Image ${idx + 1}`}
                      className="h-full w-full object-cover transition-transform duration-200 group-hover:scale-105"
                    />
                    <span className="absolute bottom-1 left-1 rounded-md bg-black/50 px-1.5 py-0.5 text-[10px] font-bold text-white">
                      {idx + 1}
                    </span>
                  </a>
                ))}
              </div>
            </div>
          )}

          {/* Footer */}
          <div className="flex items-center justify-end gap-3 border-t border-slate-100 pt-4">
            <button
              onClick={close}
              className="rounded-xl border border-slate-200 px-5 py-2 text-sm font-semibold text-slate-600 hover:bg-slate-50 transition"
            >
              Close
            </button>
            <Link
              href={`?edit=${project.id}`}
              className="inline-flex items-center gap-2 rounded-xl bg-[linear-gradient(135deg,#0f766e,#0891b2)] px-6 py-2 text-sm font-bold text-white shadow-md shadow-cyan-200/60 hover:opacity-90 transition"
            >
              Edit Project
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
