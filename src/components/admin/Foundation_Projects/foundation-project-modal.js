"use client";

import { useRef, useState, useTransition, useEffect } from "react";
import { useRouter } from "next/navigation";
import { ProjectImageUploader } from "./project-image-uploader";

const STATUS_OPTIONS = ["draft", "active", "running", "completed", "cancelled"];

function Spinner() {
  return (
    <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none">
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4Z" />
    </svg>
  );
}

function SectionLabel({ children }) {
  return (
    <div className="flex items-center gap-3 pb-1">
      <span className="text-xs font-bold uppercase tracking-widest text-cyan-700">{children}</span>
      <span className="h-px flex-1 bg-cyan-100" />
    </div>
  );
}

function Field({ label, name, defaultValue, multiline, type = "text", required, step, min, children }) {
  const base = "w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-800 placeholder:text-slate-400 focus:border-cyan-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-cyan-100 transition";
  return (
    <div className="flex flex-col gap-1">
      <label className="text-xs font-semibold text-slate-600">
        {label}{required && <span className="ml-0.5 text-rose-500">*</span>}
      </label>
      {children ? children : multiline ? (
        <textarea name={name} defaultValue={defaultValue ?? ""} rows={3} className={base} />
      ) : (
        <input name={name} type={type} defaultValue={defaultValue ?? ""} step={step} min={min} className={base} />
      )}
    </div>
  );
}

const SELECT_CLS = "w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-800 focus:border-cyan-400 focus:outline-none focus:ring-2 focus:ring-cyan-100 disabled:opacity-50 disabled:cursor-not-allowed transition";

function LocationCascade({ divisions, districts, upazilas, defaultDivisionId, defaultDistrictId, defaultUpazilaId }) {
  const [divisionId, setDivisionId] = useState(defaultDivisionId ?? "");
  const [districtId, setDistrictId] = useState(defaultDistrictId ?? "");
  const [upazilaId, setUpazilaId] = useState(defaultUpazilaId ?? "");

  const filteredDistricts = divisionId
    ? districts.filter((d) => String(d.divisionId) === String(divisionId))
    : [];
  const filteredUpazilas = districtId
    ? upazilas.filter((u) => String(u.districtId) === String(districtId))
    : [];

  // Reset child when parent changes
  useEffect(() => { setDistrictId(""); setUpazilaId(""); }, [divisionId]);
  useEffect(() => { setUpazilaId(""); }, [districtId]);

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
      {/* Division */}
      <div className="flex flex-col gap-1">
        <label className="text-xs font-semibold text-slate-600">Division</label>
        <select
          name="divisionId"
          value={divisionId}
          onChange={(e) => setDivisionId(e.target.value)}
          className={SELECT_CLS}
        >
          <option value="">— Select Division —</option>
          {divisions.map((d) => (
            <option key={d.id} value={d.id}>{d.nameEn}</option>
          ))}
        </select>
      </div>

      {/* District */}
      <div className="flex flex-col gap-1">
        <label className="text-xs font-semibold text-slate-600">
          District
          {!divisionId && <span className="ml-1 text-[10px] font-normal text-slate-400">(select division first)</span>}
        </label>
        <select
          name="districtId"
          value={districtId}
          onChange={(e) => setDistrictId(e.target.value)}
          disabled={!divisionId}
          className={SELECT_CLS}
        >
          <option value="">
            {divisionId
              ? filteredDistricts.length === 0 ? "No districts found" : "— Select District —"
              : "— Select Division First —"}
          </option>
          {filteredDistricts.map((d) => (
            <option key={d.id} value={d.id}>{d.nameEn}</option>
          ))}
        </select>
        {divisionId && filteredDistricts.length > 0 && (
          <p className="text-[10px] text-slate-400">{filteredDistricts.length} district{filteredDistricts.length !== 1 ? "s" : ""} available</p>
        )}
      </div>

      {/* Upazila */}
      <div className="flex flex-col gap-1">
        <label className="text-xs font-semibold text-slate-600">
          Upazila / Thana
          {!districtId && <span className="ml-1 text-[10px] font-normal text-slate-400">(select district first)</span>}
        </label>
        <select
          name="upazilaId"
          value={upazilaId}
          onChange={(e) => setUpazilaId(e.target.value)}
          disabled={!districtId}
          className={SELECT_CLS}
        >
          <option value="">
            {districtId
              ? filteredUpazilas.length === 0 ? "No upazilas found" : "— Select Upazila —"
              : "— Select District First —"}
          </option>
          {filteredUpazilas.map((u) => (
            <option key={u.id} value={u.id}>{u.nameEn}</option>
          ))}
        </select>
        {districtId && filteredUpazilas.length > 0 && (
          <p className="text-[10px] text-slate-400">{filteredUpazilas.length} upazila{filteredUpazilas.length !== 1 ? "s" : ""} available</p>
        )}
      </div>
    </div>
  );
}

export function FoundationProjectModal({
  params,
  allProjects,
  categories,
  divisions,
  districts,
  upazilas,
  createAction,
  updateAction,
  uploadAction,
  deleteImageAction,
}) {
  const router = useRouter();
  const formRef = useRef(null);
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState(null);

  const isAdd = params?.add === "1";
  const editId = params?.edit ? Number(params.edit) : null;
  const editing = editId ? allProjects.find((p) => p.id === editId) : null;
  const isOpen = isAdd || !!editing;

  function close() {
    router.push("/admin/Foundation_Projects");
  }

  function handleSubmit(e) {
    e.preventDefault();
    setError(null);
    const fd = new FormData(formRef.current);
    if (editing) fd.set("id", editing.id);
    startTransition(async () => {
      try {
        if (editing) await updateAction(fd);
        else await createAction(fd);
        close();
      } catch (err) {
        setError(err?.message ?? "Something went wrong.");
      }
    });
  }

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto p-4 sm:p-8" onClick={(e) => e.target === e.currentTarget && close()}>
      {/* Backdrop */}
      <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm" aria-hidden="true" onClick={close} />

      <div className="relative z-10 w-full max-w-4xl rounded-3xl bg-white shadow-2xl shadow-slate-900/20 my-4">
        {/* Header */}
        <div className="rounded-t-3xl bg-[linear-gradient(135deg,#0f766e,#0891b2)] px-6 py-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-bold uppercase tracking-widest text-cyan-200">Foundation Projects</p>
              <h2 className="mt-0.5 text-lg font-extrabold text-white">
                {editing ? "Edit Project" : "Add New Project"}
              </h2>
            </div>
            <button onClick={close} className="flex h-8 w-8 items-center justify-center rounded-full bg-white/20 text-white hover:bg-white/30 transition">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-4 w-4">
                <path d="M18 6 6 18M6 6l12 12" strokeLinecap="round" />
              </svg>
            </button>
          </div>
        </div>

        {/* Form */}
        <form ref={formRef} onSubmit={handleSubmit} className="flex flex-col gap-6 p-6">

          {/* Section 1: Basic Info */}
          <div className="flex flex-col gap-4">
            <SectionLabel>Basic Information</SectionLabel>
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
              <Field label="Project Code" name="projectCode" defaultValue={editing?.projectCode} required />
              <Field label="Category" name="projectCategoryId" required>
                <select name="projectCategoryId" defaultValue={editing?.projectCategoryId ?? ""} className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-800 focus:border-cyan-400 focus:outline-none focus:ring-2 focus:ring-cyan-100">
                  <option value="">Select category</option>
                  {categories.map((c) => <option key={c.id} value={c.id}>{c.nameEn}</option>)}
                </select>
              </Field>
              <Field label="Status" name="status">
                <select name="status" defaultValue={editing?.status ?? "draft"} className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-800 focus:border-cyan-400 focus:outline-none focus:ring-2 focus:ring-cyan-100">
                  {STATUS_OPTIONS.map((s) => <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>)}
                </select>
              </Field>
              <Field label="Sort Order" name="sortOrder" type="number" min="0" defaultValue={editing?.sortOrder} />
            </div>
          </div>

          {/* Section 2: Titles */}
          <div className="flex flex-col gap-4">
            <SectionLabel>Project Title</SectionLabel>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
              <Field label="Title (English)" name="projectTitleEn" defaultValue={editing?.projectTitleEn} required />
              <Field label="Title (Bangla)" name="projectTitleBn" defaultValue={editing?.projectTitleBn} required />
              <Field label="Title (Danish)" name="projectTitleDk" defaultValue={editing?.projectTitleDk} />
            </div>
          </div>

          {/* Section 3: Short Description */}
          <div className="flex flex-col gap-4">
            <SectionLabel>Short Description</SectionLabel>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
              <Field label="Short Desc (English)" name="shortDescriptionEn" multiline defaultValue={editing?.shortDescriptionEn} />
              <Field label="Short Desc (Bangla)" name="shortDescriptionBn" multiline defaultValue={editing?.shortDescriptionBn} />
              <Field label="Short Desc (Danish)" name="shortDescriptionDk" multiline defaultValue={editing?.shortDescriptionDk} />
            </div>
          </div>

          {/* Section 4: Full Description */}
          <div className="flex flex-col gap-4">
            <SectionLabel>Full Description</SectionLabel>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
              <Field label="Full Desc (English)" name="fullDescriptionEn" multiline defaultValue={editing?.fullDescriptionEn} />
              <Field label="Full Desc (Bangla)" name="fullDescriptionBn" multiline defaultValue={editing?.fullDescriptionBn} />
              <Field label="Full Desc (Danish)" name="fullDescriptionDk" multiline defaultValue={editing?.fullDescriptionDk} />
            </div>
          </div>

          {/* Section 5: Objective */}
          <div className="flex flex-col gap-4">
            <SectionLabel>Project Objective</SectionLabel>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
              <Field label="Objective (English)" name="objectiveEn" multiline defaultValue={editing?.objectiveEn} />
              <Field label="Objective (Bangla)" name="objectiveBn" multiline defaultValue={editing?.objectiveBn} />
              <Field label="Objective (Danish)" name="objectiveDk" multiline defaultValue={editing?.objectiveDk} />
            </div>
          </div>

          {/* Section 6: Beneficiary & Location */}
          <div className="flex flex-col gap-4">
            <SectionLabel>Beneficiary & Location</SectionLabel>
            <Field label="Target Beneficiary" name="targetBeneficiary" defaultValue={editing?.targetBeneficiary} />
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
              <Field label="Location (English)" name="projectLocationEn" defaultValue={editing?.projectLocationEn} />
              <Field label="Location (Bangla)" name="projectLocationBn" defaultValue={editing?.projectLocationBn} />
              <Field label="Location (Danish)" name="projectLocationDk" defaultValue={editing?.projectLocationDk} />
            </div>
            <LocationCascade
              divisions={divisions}
              districts={districts}
              upazilas={upazilas}
              defaultDivisionId={editing?.divisionId}
              defaultDistrictId={editing?.districtId}
              defaultUpazilaId={editing?.upazilaId}
            />
          </div>

          {/* Section 7: Budget & Images */}
          <div className="flex flex-col gap-4">
            <SectionLabel>Budget & Images</SectionLabel>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
              <Field label="Estimated Budget (৳)" name="estimatedBudget" type="number" step="0.01" min="0" defaultValue={editing?.estimatedBudget} />
              <Field label="Collected Amount (৳)" name="collectedAmount" type="number" step="0.01" min="0" defaultValue={editing?.collectedAmount} />
              <Field label="Distributed Amount (৳)" name="distributedAmount" type="number" step="0.01" min="0" defaultValue={editing?.distributedAmount} />
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-xs font-semibold text-slate-600">Project Images</label>
              <ProjectImageUploader
                uploadAction={uploadAction}
                deleteAction={deleteImageAction}
                existingImages={editing?.images ?? []}
              />
            </div>
          </div>

          {/* Error */}
          {error && (
            <div className="rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm font-semibold text-rose-700">
              {error}
            </div>
          )}

          {/* Footer */}
          <div className="flex items-center justify-end gap-3 border-t border-slate-100 pt-4">
            <button type="button" onClick={close} className="rounded-xl border border-slate-200 px-5 py-2 text-sm font-semibold text-slate-600 hover:bg-slate-50 transition">
              Cancel
            </button>
            <button
              type="submit"
              disabled={isPending}
              className="inline-flex items-center gap-2 rounded-xl bg-[linear-gradient(135deg,#0f766e,#0891b2)] px-6 py-2 text-sm font-bold text-white shadow-md shadow-cyan-200/60 hover:opacity-90 transition disabled:opacity-60"
            >
              {isPending && <Spinner />}
              {isPending ? "Saving…" : editing ? "Update Project" : "Create Project"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
