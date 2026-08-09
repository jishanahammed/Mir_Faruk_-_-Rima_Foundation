"use client";

import { useRef, useState, useTransition } from "react";
import { useRouter, useSearchParams } from "next/navigation";

function Field({ label, name, required, defaultValue, placeholder }) {
  return (
    <div>
      <label className="mb-1.5 block text-xs font-semibold text-slate-500">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      <input
        name={name}
        required={required}
        defaultValue={defaultValue ?? ""}
        placeholder={placeholder}
        className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-sm text-slate-900 placeholder-slate-400 outline-none transition focus:border-cyan-400 focus:bg-white focus:ring-2 focus:ring-cyan-100"
      />
    </div>
  );
}

function NameFields({ defaultValues }) {
  return (
    <div className="grid gap-4 sm:grid-cols-3">
      <Field name="nameEn" label="English" required placeholder="Name in English" defaultValue={defaultValues?.nameEn} />
      <Field name="nameBn" label="বাংলা" required placeholder="বাংলায় নাম" defaultValue={defaultValues?.nameBn} />
      <Field name="nameDk" label="Dansk" placeholder="Navn på dansk" defaultValue={defaultValues?.nameDk} />
    </div>
  );
}

function Spinner() {
  return (
    <svg className="h-3.5 w-3.5 animate-spin" viewBox="0 0 24 24" fill="none">
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
    </svg>
  );
}

function Modal({ title, subtitle, onClose, children }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-2xl overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-2xl shadow-slate-900/20">
        <div className="flex items-start justify-between border-b border-slate-100 px-6 py-5">
          <div>
            <h3 className="text-base font-bold text-slate-900">{title}</h3>
            {subtitle && <p className="mt-0.5 text-xs text-slate-500">{subtitle}</p>}
          </div>
          <button
            type="button"
            onClick={onClose}
            className="flex h-8 w-8 items-center justify-center rounded-xl text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
          >
            <svg viewBox="0 0 16 16" fill="currentColor" className="h-4 w-4">
              <path d="M4.47 4.47a.75.75 0 0 1 1.06 0L8 6.94l2.47-2.47a.75.75 0 1 1 1.06 1.06L9.06 8l2.47 2.47a.75.75 0 1 1-1.06 1.06L8 9.06l-2.47 2.47a.75.75 0 0 1-1.06-1.06L6.94 8 4.47 5.53a.75.75 0 0 1 0-1.06Z" />
            </svg>
          </button>
        </div>
        <div className="p-6">{children}</div>
      </div>
    </div>
  );
}

export function LocationAddModal({
  tab, params,
  divisions, districts, upazilas = [], localGovernments = [],
  allDivisions, allDistricts, allUpazilas,
  allLocalGovernments = [], allWards = [],
  createDivisionAction, updateDivisionAction,
  createDistrictAction, updateDistrictAction,
  createUpazilaAction, updateUpazilaAction,
  createLocalGovernmentAction, updateLocalGovernmentAction,
  createWardAction, updateWardAction,
}) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState("");
  const formRef = useRef(null);

  const isAdding = params?.add === "1";
  const editId = params?.edit ? Number(params.edit) : null;

  // Resolve the item being edited
  const editItem =
    editId && tab === "divisions" ? allDivisions.find((d) => d.id === editId)
    : editId && tab === "districts" ? allDistricts.find((d) => d.id === editId)
    : editId && tab === "upazilas" ? allUpazilas.find((u) => u.id === editId)
    : editId && tab === "local-governments" ? allLocalGovernments.find((lg) => lg.id === editId)
    : editId && tab === "wards" ? allWards.find((w) => w.id === editId)
    : null;

  const isOpen = isAdding || Boolean(editItem);
  if (!isOpen) return null;

  const isEdit = Boolean(editItem);
  const baseHref = `/admin/location-page?tab=${tab}`;

  function close() {
    router.push(baseHref);
  }

  function handleSubmit(e) {
    e.preventDefault();
    setError("");
    const fd = new FormData(formRef.current);
    if (isEdit) fd.set("id", editItem.id);

    const action =
      tab === "divisions" ? (isEdit ? updateDivisionAction : createDivisionAction)
      : tab === "districts" ? (isEdit ? updateDistrictAction : createDistrictAction)
      : tab === "upazilas" ? (isEdit ? updateUpazilaAction : createUpazilaAction)
      : tab === "local-governments" ? (isEdit ? updateLocalGovernmentAction : createLocalGovernmentAction)
      : isEdit ? updateWardAction : createWardAction;

    startTransition(async () => {
      try {
        await action(fd);
        router.push(baseHref);
      } catch (err) {
        setError(err?.message ?? "Something went wrong.");
      }
    });
  }

  const titles = {
    divisions: { add: "Add Division", edit: `Edit Division — ${editItem?.nameEn ?? ""}` },
    districts:  { add: "Add District",  edit: `Edit District — ${editItem?.nameEn ?? ""}` },
    upazilas:   { add: "Add Upazila",   edit: `Edit Upazila — ${editItem?.nameEn ?? ""}` },
    "local-governments": {
      add: "Add Union Parishad / Pourashava",
      edit: `Edit Union Parishad / Pourashava — ${editItem?.nameEn ?? ""}`,
    },
    wards: { add: "Add Ward", edit: `Edit Ward — ${editItem?.nameEn ?? ""}` },
  };

  const submitLabels = {
    divisions: "Division",
    districts: "District",
    upazilas: "Upazila",
    "local-governments": "Union / Pourashava",
    wards: "Ward",
  };

  return (
    <Modal
      title={titles[tab][isEdit ? "edit" : "add"]}
      subtitle="Fill in the names in all available languages."
      onClose={close}
    >
      <form ref={formRef} onSubmit={handleSubmit} className="space-y-5">
        {/* Parent selector for districts */}
        {tab === "districts" && (
          <div>
            <label className="mb-1.5 block text-xs font-semibold text-slate-500">
              Division <span className="text-red-500">*</span>
            </label>
            <select
              name="divisionId"
              required
              defaultValue={editItem?.divisionId ?? divisions[0]?.id ?? ""}
              className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-sm text-slate-900 outline-none transition focus:border-cyan-400 focus:bg-white focus:ring-2 focus:ring-cyan-100"
            >
              <option value="">— Select Division —</option>
              {divisions.map((d) => (
                <option key={d.id} value={d.id}>{d.nameEn}</option>
              ))}
            </select>
          </div>
        )}

        {/* Parent selector for upazilas */}
        {tab === "upazilas" && (
          <div>
            <label className="mb-1.5 block text-xs font-semibold text-slate-500">
              District <span className="text-red-500">*</span>
            </label>
            <select
              name="districtId"
              required
              defaultValue={editItem?.districtId ?? districts[0]?.id ?? ""}
              className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-sm text-slate-900 outline-none transition focus:border-cyan-400 focus:bg-white focus:ring-2 focus:ring-cyan-100"
            >
              <option value="">— Select District —</option>
              {districts.map((d) => (
                <option key={d.id} value={d.id}>{d.nameEn}</option>
              ))}
            </select>
          </div>
        )}

        {/* Parent selector + type for union parishads / pourashavas */}
        {tab === "local-governments" && (
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-1.5 block text-xs font-semibold text-slate-500">
                Upazila <span className="text-red-500">*</span>
              </label>
              <select
                name="upazilaId"
                required
                disabled={isEdit}
                defaultValue={editItem?.upazilaId ?? upazilas[0]?.id ?? ""}
                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-sm text-slate-900 outline-none transition focus:border-cyan-400 focus:bg-white focus:ring-2 focus:ring-cyan-100 disabled:opacity-60"
              >
                <option value="">— Select Upazila —</option>
                {upazilas.map((u) => (
                  <option key={u.id} value={u.id}>{u.nameEn}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="mb-1.5 block text-xs font-semibold text-slate-500">
                Type <span className="text-red-500">*</span>
              </label>
              <select
                name="type"
                required
                defaultValue={editItem?.type ?? "UnionParishad"}
                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-sm text-slate-900 outline-none transition focus:border-cyan-400 focus:bg-white focus:ring-2 focus:ring-cyan-100"
              >
                <option value="UnionParishad">Union Parishad</option>
                <option value="Pourashava">Pourashava</option>
              </select>
            </div>
          </div>
        )}

        {/* Parent selector + ward no for wards */}
        {tab === "wards" && (
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-1.5 block text-xs font-semibold text-slate-500">
                Union Parishad / Pourashava <span className="text-red-500">*</span>
              </label>
              <select
                name="localGovernmentId"
                required
                disabled={isEdit}
                defaultValue={editItem?.localGovernmentId ?? localGovernments[0]?.id ?? ""}
                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-sm text-slate-900 outline-none transition focus:border-cyan-400 focus:bg-white focus:ring-2 focus:ring-cyan-100 disabled:opacity-60"
              >
                <option value="">— Select Union Parishad / Pourashava —</option>
                {localGovernments.map((lg) => (
                  <option key={lg.id} value={lg.id}>{lg.nameEn}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="mb-1.5 block text-xs font-semibold text-slate-500">
                Ward No. <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                name="wardNo"
                min="1"
                step="1"
                required
                defaultValue={editItem?.wardNo ?? ""}
                placeholder="e.g. 1"
                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-sm text-slate-900 placeholder-slate-400 outline-none transition focus:border-cyan-400 focus:bg-white focus:ring-2 focus:ring-cyan-100"
              />
            </div>
          </div>
        )}

        <NameFields defaultValues={editItem} />

        {!isEdit && (
          <p className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-xs leading-5 text-amber-800">
            New entries start <strong>Inactive</strong>. Use the status toggle on the list after
            saving to make it visible in registration and donor dropdowns.
          </p>
        )}

        {error && (
          <p className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{error}</p>
        )}

        <div className="flex justify-end gap-2 border-t border-slate-100 pt-4">
          <button
            type="button"
            onClick={close}
            className="rounded-xl border border-slate-200 px-5 py-2.5 text-sm font-semibold text-slate-600 transition hover:bg-slate-50"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isPending}
            className="flex items-center gap-2 rounded-xl bg-cyan-700 px-6 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-cyan-800 disabled:opacity-60"
          >
            {isPending && <Spinner />}
            {isPending ? "Saving…" : isEdit ? "Save Changes" : `Add ${submitLabels[tab] ?? "Item"}`}
          </button>
        </div>
      </form>
    </Modal>
  );
}
