"use client";

import { useRef, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { EmergencyCategoryImageUploader } from "./emergency-category-image-uploader";

function Field({ label, name, required, defaultValue, placeholder, multiline }) {
  const cls =
    "w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-sm text-slate-900 placeholder-slate-400 outline-none transition focus:border-cyan-400 focus:bg-white focus:ring-2 focus:ring-cyan-100";
  return (
    <div>
      <label className="mb-1.5 block text-xs font-semibold text-slate-500">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      {multiline ? (
        <textarea
          name={name}
          required={required}
          defaultValue={defaultValue ?? ""}
          placeholder={placeholder}
          rows={2}
          className={cls}
        />
      ) : (
        <input
          name={name}
          required={required}
          defaultValue={defaultValue ?? ""}
          placeholder={placeholder}
          className={cls}
        />
      )}
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

export function EmergencyCategoryModal({ params, allCategories, createAction, updateAction, uploadAction, deleteImageAction }) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState("");
  const formRef = useRef(null);

  const isAdding = params?.add === "1";
  const editId = params?.edit ? Number(params.edit) : null;
  const editItem = editId ? allCategories.find((c) => c.id === editId) : null;
  const isOpen = isAdding || Boolean(editItem);

  if (!isOpen) return null;

  const isEdit = Boolean(editItem);

  function close() {
    router.push("/admin/Emergency_Category");
  }

  function handleSubmit(e) {
    e.preventDefault();
    setError("");
    const fd = new FormData(formRef.current);
    if (isEdit) fd.set("id", editItem.id);

    startTransition(async () => {
      try {
        await (isEdit ? updateAction(fd) : createAction(fd));
        router.push("/admin/Emergency_Category");
      } catch (err) {
        setError(err?.message ?? "Something went wrong.");
      }
    });
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={close} />
      <div className="relative w-full max-w-2xl overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-2xl shadow-slate-900/20 max-h-[90vh] overflow-y-auto">
        {/* Modal header */}
        <div className="flex items-start justify-between border-b border-slate-100 bg-[radial-gradient(circle_at_top_left,rgba(34,211,238,0.12),transparent_40%),linear-gradient(135deg,#f8fafc,#f0fdf9)] px-6 py-5">
          <div>
            <p className="text-xs font-bold uppercase tracking-widest text-cyan-700">
              {isEdit ? "Update" : "New"}
            </p>
            <h3 className="text-base font-bold text-slate-900">
              {isEdit ? `Edit: ${editItem.nameEn}` : "Add Emergency Category"}
            </h3>
          </div>
          <button
            type="button"
            onClick={close}
            className="flex h-8 w-8 items-center justify-center rounded-xl text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
          >
            <svg viewBox="0 0 16 16" fill="currentColor" className="h-4 w-4">
              <path d="M4.47 4.47a.75.75 0 0 1 1.06 0L8 6.94l2.47-2.47a.75.75 0 1 1 1.06 1.06L9.06 8l2.47 2.47a.75.75 0 1 1-1.06 1.06L8 9.06l-2.47 2.47a.75.75 0 0 1-1.06-1.06L6.94 8 4.47 5.53a.75.75 0 0 1 0-1.06Z" />
            </svg>
          </button>
        </div>

        <form ref={formRef} onSubmit={handleSubmit} className="space-y-5 p-6">
          {/* Image */}
          <div>
            <p className="mb-3 text-xs font-bold uppercase tracking-wider text-slate-400">Category Image</p>
            <EmergencyCategoryImageUploader
              uploadAction={uploadAction}
              deleteAction={deleteImageAction}
              existingImagePath={editItem?.imageUrl}
            />
          </div>

          {/* Names row */}
          <div>
            <p className="mb-3 text-xs font-bold uppercase tracking-wider text-slate-400">Category Name</p>
            <div className="grid gap-4 sm:grid-cols-3">
              <Field name="nameEn" label="English" required placeholder="Name in English" defaultValue={editItem?.nameEn} />
              <Field name="nameBn" label="বাংলা" required placeholder="বাংলায় নাম" defaultValue={editItem?.nameBn} />
              <Field name="nameDk" label="Dansk" placeholder="Navn på dansk" defaultValue={editItem?.nameDk} />
            </div>
          </div>

          {/* Descriptions */}
          <div>
            <p className="mb-3 text-xs font-bold uppercase tracking-wider text-slate-400">Description (optional)</p>
            <div className="grid gap-4 sm:grid-cols-3">
              <Field name="descriptionEn" label="English" placeholder="Brief description…" defaultValue={editItem?.descriptionEn} multiline />
              <Field name="descriptionBn" label="বাংলা" placeholder="সংক্ষিপ্ত বিবরণ…" defaultValue={editItem?.descriptionBn} multiline />
              <Field name="descriptionDk" label="Dansk" placeholder="Kort beskrivelse…" defaultValue={editItem?.descriptionDk} multiline />
            </div>
          </div>

          {/* Display order + Status */}
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-1.5 block text-xs font-semibold text-slate-500">Display Order</label>
              <input
                name="displayOrder"
                type="number"
                min="0"
                defaultValue={editItem?.displayOrder ?? 0}
                placeholder="e.g. 1"
                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-sm text-slate-900 placeholder-slate-400 outline-none transition focus:border-cyan-400 focus:bg-white focus:ring-2 focus:ring-cyan-100"
              />
            </div>
            <div>
              <label className="mb-1.5 block text-xs font-semibold text-slate-500">Status</label>
              <select
                name="isActive"
                defaultValue={editItem ? String(editItem.isActive) : "true"}
                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-sm text-slate-900 outline-none transition focus:border-cyan-400 focus:bg-white focus:ring-2 focus:ring-cyan-100"
              >
                <option value="true">Active</option>
                <option value="false">Inactive</option>
              </select>
            </div>
          </div>

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
              className="flex items-center gap-2 rounded-xl bg-[linear-gradient(135deg,#0f766e,#0891b2)] px-6 py-2.5 text-sm font-semibold text-white shadow-sm shadow-cyan-200/60 transition hover:-translate-y-0.5 hover:shadow-lg disabled:opacity-60"
            >
              {isPending && <Spinner />}
              {isPending ? "Saving…" : isEdit ? "Save Changes" : "Add Category"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
