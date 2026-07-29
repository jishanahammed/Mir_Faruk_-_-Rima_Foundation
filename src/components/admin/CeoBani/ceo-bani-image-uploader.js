"use client";

import { useRef, useState, useTransition } from "react";

const ALLOWED = ["image/jpeg", "image/png", "image/gif", "image/webp"];
const MAX_SIZE = 5 * 1024 * 1024;

function buildPreviewUrl(rawPath) {
  if (!rawPath) return null;
  const clean = rawPath.replace(/^~\//, "");
  const base = (process.env.NEXT_PUBLIC_API_BASE_URL ?? "https://localhost:7130").replace(/\/$/, "");
  return `${base}/${clean}`;
}

function UploadIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="h-7 w-7 text-slate-400" aria-hidden="true">
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

export function CeoBaniImageUploader({ name, label, uploadAction, deleteAction, existingImagePath }) {
  const inputRef = useRef(null);
  const [isPending, startTransition] = useTransition();

  const [saved, setSaved] = useState(existingImagePath ?? null);
  const [preview, setPreview] = useState(
    existingImagePath ? { path: existingImagePath, url: buildPreviewUrl(existingImagePath) } : null
  );
  const [error, setError] = useState(null);
  const [dragOver, setDragOver] = useState(false);

  function handleFile(file) {
    setError(null);
    if (!file) return;
    if (!ALLOWED.includes(file.type)) { setError(`${file.name}: unsupported type.`); return; }
    if (file.size > MAX_SIZE) { setError(`${file.name}: exceeds 5 MB.`); return; }

    const localUrl = URL.createObjectURL(file);
    setPreview({ path: null, url: localUrl });

    const fd = new FormData();
    fd.set("file", file);

    startTransition(async () => {
      try {
        const result = await uploadAction(fd);
        const uploadedPath = result?.url ?? null;
        if (uploadedPath) {
          URL.revokeObjectURL(localUrl);
          setPreview({ path: uploadedPath, url: buildPreviewUrl(uploadedPath) });
          setSaved(uploadedPath);
        }
      } catch (err) {
        setError(err?.message ?? "Upload failed.");
        setPreview(existingImagePath ? { path: existingImagePath, url: buildPreviewUrl(existingImagePath) } : null);
      }
    });
  }

  async function handleRemove() {
    if (saved) {
      const fd = new FormData();
      fd.set("imagePath", saved);
      startTransition(async () => {
        try { await deleteAction(fd); } catch { /* ignore */ }
      });
    } else if (preview?.url) {
      URL.revokeObjectURL(preview.url);
    }
    setSaved(null);
    setPreview(null);
  }

  return (
    <div className="flex flex-col gap-2">
      <label className="text-xs font-semibold text-slate-500">{label}</label>
      <input type="hidden" name={name} value={saved ?? ""} />

      {preview ? (
        <div className="group relative h-28 w-28 overflow-hidden rounded-xl border border-slate-200 bg-slate-100 shadow-sm">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={preview.url} alt={label} className="h-full w-full object-cover" />
          {preview.path === null && (
            <div className="absolute inset-0 flex items-center justify-center bg-white/60">
              <svg className="h-5 w-5 animate-spin text-cyan-600" viewBox="0 0 24 24" fill="none">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4Z" />
              </svg>
            </div>
          )}
          {preview.path !== null && (
            <button
              type="button"
              onClick={handleRemove}
              className="absolute right-1 top-1 flex h-6 w-6 items-center justify-center rounded-full bg-rose-600 text-white opacity-0 shadow transition-opacity duration-150 group-hover:opacity-100 hover:bg-rose-700"
            >
              <TrashIcon />
            </button>
          )}
        </div>
      ) : (
        <div
          onClick={() => inputRef.current?.click()}
          onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
          onDragLeave={() => setDragOver(false)}
          onDrop={(e) => { e.preventDefault(); setDragOver(false); handleFile(e.dataTransfer.files?.[0]); }}
          className={[
            "flex h-28 w-28 cursor-pointer flex-col items-center justify-center gap-1 rounded-xl border-2 border-dashed px-2 text-center transition-all duration-200 select-none",
            dragOver ? "border-cyan-400 bg-cyan-50" : "border-slate-200 bg-slate-50 hover:border-cyan-300 hover:bg-cyan-50/40",
            isPending ? "pointer-events-none opacity-60" : "",
          ].join(" ")}
        >
          <UploadIcon />
          <p className="text-[11px] font-semibold text-slate-500">
            {isPending ? "Uploading…" : "Click / drop"}
          </p>
          <input
            ref={inputRef}
            type="file"
            accept={ALLOWED.join(",")}
            className="hidden"
            onChange={(e) => { handleFile(e.target.files?.[0]); e.target.value = ""; }}
          />
        </div>
      )}

      {error && <p className="text-xs font-semibold text-rose-700">{error}</p>}
    </div>
  );
}
