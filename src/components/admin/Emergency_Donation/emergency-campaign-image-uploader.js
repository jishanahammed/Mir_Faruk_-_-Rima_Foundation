"use client";

import { useRef, useState, useTransition } from "react";

const ALLOWED = ["image/jpeg", "image/png", "image/gif", "image/webp"];
const MAX_SIZE = 5 * 1024 * 1024;
const MAX_FILES = 10;

function buildPreviewUrl(rawPath) {
  if (!rawPath) return null;
  const clean = rawPath.replace(/^~\//, "");
  const base = (process.env.NEXT_PUBLIC_API_BASE_URL ?? "https://localhost:7130").replace(/\/$/, "");
  return `${base}/${clean}`;
}

function UploadIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="h-8 w-8 text-slate-400" aria-hidden="true">
      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" strokeLinecap="round" strokeLinejoin="round" />
      <polyline points="17 8 12 3 7 8" strokeLinecap="round" strokeLinejoin="round" />
      <line x1="12" y1="3" x2="12" y2="15" strokeLinecap="round" />
    </svg>
  );
}

function TrashIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-3.5 w-3.5" aria-hidden="true">
      <polyline points="3 6 5 6 21 6" strokeLinecap="round" />
      <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M10 11v6M14 11v6" strokeLinecap="round" />
    </svg>
  );
}

export function EmergencyCampaignImageUploader({ uploadAction, deleteAction, existingImages = [] }) {
  const inputRef = useRef(null);
  const [isPending, startTransition] = useTransition();

  const [saved, setSaved] = useState(existingImages.map((img) => img.imagePath));
  const [previews, setPreviews] = useState(
    existingImages.map((img) => ({ path: img.imagePath, url: buildPreviewUrl(img.imagePath) }))
  );
  const [errors, setErrors] = useState([]);
  const [dragOver, setDragOver] = useState(false);

  function validateFiles(files) {
    const valid = [];
    const errs = [];
    for (const f of files) {
      if (!ALLOWED.includes(f.type)) { errs.push(`${f.name}: unsupported type.`); continue; }
      if (f.size > MAX_SIZE) { errs.push(`${f.name}: exceeds 5 MB.`); continue; }
      valid.push(f);
    }
    const remaining = MAX_FILES - saved.length;
    if (valid.length > remaining) {
      errs.push(`Max ${MAX_FILES} images allowed. Only ${remaining} slot(s) left.`);
      return { valid: valid.slice(0, remaining), errs };
    }
    return { valid, errs };
  }

  function handleFiles(rawFiles) {
    const { valid, errs } = validateFiles(Array.from(rawFiles));
    setErrors(errs);
    if (valid.length === 0) return;

    const localPreviews = valid.map((f) => ({ path: null, url: URL.createObjectURL(f), file: f }));
    setPreviews((p) => [...p, ...localPreviews]);

    const fd = new FormData();
    valid.forEach((f) => fd.append("files", f));

    startTransition(async () => {
      try {
        const result = await uploadAction(fd);
        const uploadedPaths = result?.urls ?? [];
        const serverErrs = result?.errors ?? [];

        setPreviews((prev) => {
          const updated = [...prev];
          let si = 0;
          for (let i = 0; i < updated.length; i++) {
            if (updated[i].path === null && updated[i].file) {
              if (si < uploadedPaths.length) {
                URL.revokeObjectURL(updated[i].url);
                updated[i] = { path: uploadedPaths[si], url: buildPreviewUrl(uploadedPaths[si]) };
                si++;
              }
            }
          }
          return updated;
        });
        setSaved((s) => [...s, ...uploadedPaths]);
        if (serverErrs.length) setErrors((e) => [...e, ...serverErrs]);
      } catch (err) {
        setErrors((e) => [...e, err?.message ?? "Upload failed."]);
        setPreviews((p) => p.filter((x) => x.path !== null));
      }
    });
  }

  async function handleRemove(index) {
    const item = previews[index];
    if (item.path) {
      const fd = new FormData();
      fd.set("imagePath", item.path);
      startTransition(async () => {
        try { await deleteAction(fd); } catch { /* ignore */ }
      });
      setSaved((s) => s.filter((p) => p !== item.path));
    } else {
      URL.revokeObjectURL(item.url);
    }
    setPreviews((p) => p.filter((_, i) => i !== index));
  }

  return (
    <div className="flex flex-col gap-3">
      {saved.map((p, i) => (
        <input key={i} type="hidden" name="imagePaths" value={p} />
      ))}

      <div
        onClick={() => inputRef.current?.click()}
        onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
        onDragLeave={() => setDragOver(false)}
        onDrop={(e) => { e.preventDefault(); setDragOver(false); handleFiles(e.dataTransfer.files); }}
        className={[
          "flex cursor-pointer flex-col items-center justify-center gap-2 rounded-2xl border-2 border-dashed px-6 py-8 transition-all duration-200 select-none",
          dragOver ? "border-cyan-400 bg-cyan-50" : "border-slate-200 bg-slate-50 hover:border-cyan-300 hover:bg-cyan-50/40",
          isPending ? "pointer-events-none opacity-60" : "",
          saved.length >= MAX_FILES ? "pointer-events-none opacity-40" : "",
        ].join(" ")}
      >
        <UploadIcon />
        <div className="text-center">
          <p className="text-sm font-semibold text-slate-700">
            {isPending ? "Uploading…" : "Click or drag images here"}
          </p>
          <p className="mt-0.5 text-xs text-slate-400">
            JPG, PNG, GIF, WebP · Max 5 MB · Up to {MAX_FILES} images
          </p>
        </div>
        <input
          ref={inputRef}
          type="file"
          accept={ALLOWED.join(",")}
          multiple
          className="hidden"
          onChange={(e) => { handleFiles(e.target.files); e.target.value = ""; }}
        />
      </div>

      {errors.length > 0 && (
        <div className="rounded-xl border border-rose-200 bg-rose-50 px-4 py-3">
          {errors.map((e, i) => (
            <p key={i} className="text-xs font-semibold text-rose-700">{e}</p>
          ))}
          <button type="button" onClick={() => setErrors([])} className="mt-1 text-[10px] font-bold text-rose-500 underline">
            Dismiss
          </button>
        </div>
      )}

      {previews.length > 0 && (
        <div className="grid grid-cols-3 gap-3 sm:grid-cols-4 lg:grid-cols-5">
          {previews.map((item, idx) => (
            <div key={idx} className="group relative aspect-square overflow-hidden rounded-xl border border-slate-200 bg-slate-100 shadow-sm">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={item.url} alt={`Campaign image ${idx + 1}`} className="h-full w-full object-cover transition-transform duration-200 group-hover:scale-105" />
              {item.path === null && (
                <div className="absolute inset-0 flex items-center justify-center bg-white/60">
                  <svg className="h-5 w-5 animate-spin text-cyan-600" viewBox="0 0 24 24" fill="none">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4Z" />
                  </svg>
                </div>
              )}
              {item.path !== null && (
                <button
                  type="button"
                  onClick={() => handleRemove(idx)}
                  className="absolute right-1 top-1 flex h-6 w-6 items-center justify-center rounded-full bg-rose-600 text-white opacity-0 shadow transition-opacity duration-150 group-hover:opacity-100 hover:bg-rose-700"
                >
                  <TrashIcon />
                </button>
              )}
              <span className="absolute bottom-1 left-1 rounded-md bg-black/50 px-1.5 py-0.5 text-[10px] font-bold text-white">
                {idx + 1}
              </span>
            </div>
          ))}
        </div>
      )}

      {saved.length > 0 && (
        <p className="text-xs text-slate-400">{saved.length} image{saved.length !== 1 ? "s" : ""} attached</p>
      )}
    </div>
  );
}
