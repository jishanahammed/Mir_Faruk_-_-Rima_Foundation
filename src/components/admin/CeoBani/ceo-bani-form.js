"use client";

import { useRef, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { CeoBaniImageUploader } from "./ceo-bani-image-uploader";

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

export function CeoBaniForm({
  ceoBani,
  updateAction,
  uploadEnAction,
  uploadBnAction,
  uploadDkAction,
  deleteImageAction,
}) {
  const router = useRouter();
  const formRef = useRef(null);
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  function handleSubmit(e) {
    e.preventDefault();
    setError(null);
    setSuccess(false);
    const fd = new FormData(formRef.current);
    startTransition(async () => {
      try {
        await updateAction(fd);
        setSuccess(true);
        router.refresh();
      } catch (err) {
        setError(err?.message ?? "Something went wrong.");
      }
    });
  }

  return (
    <form ref={formRef} onSubmit={handleSubmit} className="flex flex-col gap-6 p-6">
      <div className="flex flex-col gap-4">
        <SectionLabel>CEO Message</SectionLabel>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <div className="flex flex-col gap-1">
            <label className="text-xs font-semibold text-slate-600">English</label>
            <textarea
              name="messageEn"
              rows={5}
              defaultValue={ceoBani?.messageEn ?? ""}
              className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-800 focus:border-cyan-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-cyan-100 transition"
            />
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-xs font-semibold text-slate-600">Bangla</label>
            <textarea
              name="messageBn"
              rows={5}
              defaultValue={ceoBani?.messageBn ?? ""}
              className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-800 focus:border-cyan-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-cyan-100 transition"
            />
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-xs font-semibold text-slate-600">Danish</label>
            <textarea
              name="messageDk"
              rows={5}
              defaultValue={ceoBani?.messageDk ?? ""}
              className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-800 focus:border-cyan-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-cyan-100 transition"
            />
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-4">
        <SectionLabel>CEO Image (per language)</SectionLabel>
        <div className="flex flex-wrap gap-6">
          <CeoBaniImageUploader
            name="imageUrlEn"
            label="English"
            uploadAction={uploadEnAction}
            deleteAction={deleteImageAction}
            existingImagePath={ceoBani?.imageUrlEn}
          />
          <CeoBaniImageUploader
            name="imageUrlBn"
            label="Bangla"
            uploadAction={uploadBnAction}
            deleteAction={deleteImageAction}
            existingImagePath={ceoBani?.imageUrlBn}
          />
          <CeoBaniImageUploader
            name="imageUrlDk"
            label="Danish"
            uploadAction={uploadDkAction}
            deleteAction={deleteImageAction}
            existingImagePath={ceoBani?.imageUrlDk}
          />
        </div>
      </div>

      {error && (
        <div className="rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm font-semibold text-rose-700">
          {error}
        </div>
      )}
      {success && !error && (
        <div className="rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-semibold text-emerald-700">
          Saved successfully.
        </div>
      )}

      <div className="flex items-center justify-end gap-3 border-t border-slate-100 pt-4">
        <button
          type="submit"
          disabled={isPending}
          className="inline-flex items-center gap-2 rounded-xl bg-[linear-gradient(135deg,#0f766e,#0891b2)] px-6 py-2 text-sm font-bold text-white shadow-md shadow-cyan-200/60 hover:opacity-90 transition disabled:opacity-60"
        >
          {isPending && <Spinner />}
          {isPending ? "Saving…" : "Save Changes"}
        </button>
      </div>
    </form>
  );
}
