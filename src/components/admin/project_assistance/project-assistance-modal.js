"use client";

import { useRef, useState, useTransition } from "react";
import { useRouter } from "next/navigation";

const TARGET_BENEFICIARY_TYPES = ["Individual", "Family", "Community", "Institution"];
const SUPPORT_MODES = ["Cash", "InKind", "Service", "Hybrid"];

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
        <textarea name={name} defaultValue={defaultValue ?? ""} rows={3} required={required} className={base} />
      ) : (
        <input name={name} type={type} defaultValue={defaultValue ?? ""} step={step} min={min} required={required} className={base} />
      )}
    </div>
  );
}

function Checkbox({ label, name, defaultChecked }) {
  return (
    <label className="flex items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm font-semibold text-slate-700 cursor-pointer">
      <input type="checkbox" name={name} defaultChecked={defaultChecked} className="h-4 w-4 rounded border-slate-300 text-cyan-600 focus:ring-cyan-400" />
      {label}
    </label>
  );
}

export function ProjectAssistanceModal({
  params,
  allAssistances,
  projects,
  assistanceTypes,
  createAction,
  updateAction,
}) {
  const router = useRouter();
  const formRef = useRef(null);
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState(null);

  const isAdd = params?.add === "1";
  const editId = params?.edit ? Number(params.edit) : null;
  const editing = editId ? allAssistances.find((a) => a.id === editId) : null;
  const isOpen = isAdd || !!editing;

  function close() {
    router.push("/admin/project-assistance");
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
      <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm" aria-hidden="true" onClick={close} />

      <div className="relative z-10 w-full max-w-3xl rounded-3xl bg-white shadow-2xl shadow-slate-900/20 my-4">
        {/* Header */}
        <div className="rounded-t-3xl bg-[linear-gradient(135deg,#0f766e,#0891b2)] px-6 py-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-bold uppercase tracking-widest text-cyan-200">Project Assistance</p>
              <h2 className="mt-0.5 text-lg font-extrabold text-white">
                {editing ? "Edit Assistance" : "Add New Assistance"}
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

          {/* Section 1: Links */}
          <div className="flex flex-col gap-4">
            <SectionLabel>Linked Project & Type</SectionLabel>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <Field label="Foundation Project" name="projectId" required>
                <select name="projectId" defaultValue={editing?.projectId ?? ""} required className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-800 focus:border-cyan-400 focus:outline-none focus:ring-2 focus:ring-cyan-100">
                  <option value="" disabled>Select project…</option>
                  {projects.map((p) => <option key={p.id} value={p.id}>{p.projectTitleEn}</option>)}
                </select>
              </Field>
              <Field label="Assistance Type" name="assistanceTypeId" required>
                <select name="assistanceTypeId" defaultValue={editing?.assistanceTypeId ?? ""} required className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-800 focus:border-cyan-400 focus:outline-none focus:ring-2 focus:ring-cyan-100">
                  <option value="" disabled>Select type…</option>
                  {assistanceTypes.map((t) => <option key={t.id} value={t.id}>{t.nameEn}</option>)}
                </select>
              </Field>
            </div>
          </div>

          {/* Section 2: Name & Description */}
          <div className="flex flex-col gap-4">
            <SectionLabel>Name</SectionLabel>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
              <Field label="Name (English)" name="nameEn" defaultValue={editing?.nameEn} required />
              <Field label="Name (Bangla)" name="nameBn" defaultValue={editing?.nameBn} required />
              <Field label="Name (Danish)" name="nameDk" defaultValue={editing?.nameDk} />
            </div>

            <SectionLabel>Description</SectionLabel>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
              <Field label="Description (English)" name="descriptionEn" multiline defaultValue={editing?.descriptionEn} />
              <Field label="Description (Bangla)" name="descriptionBn" multiline defaultValue={editing?.descriptionBn} />
              <Field label="Description (Danish)" name="descriptionDk" multiline defaultValue={editing?.descriptionDk} />
            </div>
          </div>

          {/* Section 3: Beneficiary & Support */}
          <div className="flex flex-col gap-4">
            <SectionLabel>Beneficiary & Support</SectionLabel>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <Field label="Target Beneficiary Type" name="targetBeneficiaryType">
                <select name="targetBeneficiaryType" defaultValue={editing?.targetBeneficiaryType ?? "Individual"} className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-800 focus:border-cyan-400 focus:outline-none focus:ring-2 focus:ring-cyan-100">
                  {TARGET_BENEFICIARY_TYPES.map((v) => <option key={v} value={v}>{v}</option>)}
                </select>
              </Field>
              <Field label="Support Mode" name="supportMode">
                <select name="supportMode" defaultValue={editing?.supportMode ?? "Cash"} className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-800 focus:border-cyan-400 focus:outline-none focus:ring-2 focus:ring-cyan-100">
                  {SUPPORT_MODES.map((v) => <option key={v} value={v}>{v}</option>)}
                </select>
              </Field>
            </div>
          </div>

          {/* Section 4: Funding */}
          <div className="flex flex-col gap-4">
            <SectionLabel>Funding</SectionLabel>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
              <Field label="Target Amount (৳)" name="targetAmount" type="number" step="0.01" min="0" defaultValue={editing?.targetAmount} required />
              <Field label="Collected (Online, ৳)" name="collectedAmount" type="number" step="0.01" min="0" defaultValue={editing?.collectedAmount} />
              <Field label="Collected (Offline, ৳)" name="offlineCollectedAmount" type="number" step="0.01" min="0" defaultValue={editing?.offlineCollectedAmount} />
            </div>
          </div>

          {/* Section 5: Status */}
          <div className="flex flex-col gap-4">
            <SectionLabel>Status</SectionLabel>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <Checkbox label="Active" name="isActive" defaultChecked={editing?.isActive ?? true} />
              <Field label="Sort Order" name="sortOrder" type="number" min="0" defaultValue={editing?.sortOrder} />
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
              {isPending ? "Saving…" : editing ? "Update Assistance" : "Create Assistance"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
