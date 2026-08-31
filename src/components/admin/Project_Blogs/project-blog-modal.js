"use client";

import { useRef, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { ProjectBlogCoverUploader } from "./project-blog-cover-uploader";
import { ProjectBlogGalleryUploader } from "./project-blog-gallery-uploader";

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
        <textarea name={name} defaultValue={defaultValue ?? ""} rows={5} className={base} />
      ) : (
        <input name={name} type={type} defaultValue={defaultValue ?? ""} step={step} min={min} required={required} className={base} />
      )}
    </div>
  );
}

const SELECT_CLS = "w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-800 focus:border-cyan-400 focus:outline-none focus:ring-2 focus:ring-cyan-100 transition";

export function ProjectBlogModal({
  params,
  allBlogs,
  projects,
  createAction,
  updateAction,
  uploadCoverAction,
  uploadGalleryAction,
  deleteImageAction,
}) {
  const router = useRouter();
  const formRef = useRef(null);
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState(null);

  const isAdd = params?.add === "1";
  const editId = params?.edit ? Number(params.edit) : null;
  const editing = editId ? allBlogs.find((b) => b.id === editId) : null;
  const isOpen = isAdd || !!editing;

  const [isPublished, setIsPublished] = useState(editing?.isPublished ?? false);
  const [isActive, setIsActive] = useState(editing?.isActive ?? true);

  function close() {
    router.push("/admin/Project_Blogs");
  }

  function handleSubmit(e) {
    e.preventDefault();
    setError(null);
    const fd = new FormData(formRef.current);
    if (editing) fd.set("id", editing.id);
    fd.set("isPublished", String(isPublished));
    fd.set("isActive", String(isActive));
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

      <div className="relative z-10 w-full max-w-3xl rounded-3xl bg-white shadow-2xl shadow-slate-900/20 my-4">
        {/* Header */}
        <div className="rounded-t-3xl bg-[linear-gradient(135deg,#0f766e,#0891b2)] px-6 py-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-bold uppercase tracking-widest text-cyan-200">Project Blogs</p>
              <h2 className="mt-0.5 text-lg font-extrabold text-white">
                {editing ? "Edit Blog" : "Add New Blog"}
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
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <Field label="Project" name="projectId" required>
                <select name="projectId" defaultValue={editing?.projectId ?? ""} required className={SELECT_CLS}>
                  <option value="">Select project</option>
                  {projects.map((p) => (
                    <option key={p.id} value={p.id}>{p.projectTitleEn}</option>
                  ))}
                </select>
              </Field>
              <Field label="Serial No" name="serialNo" type="number" min="0" defaultValue={editing?.serialNo} />
            </div>
          </div>

          {/* Section 2: Title */}
          <div className="flex flex-col gap-4">
            <SectionLabel>Title</SectionLabel>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
              <Field label="Title (English)" name="titleEn" defaultValue={editing?.titleEn} required />
              <Field label="Title (Bangla)" name="titleBn" defaultValue={editing?.titleBn} required />
              <Field label="Title (Danish)" name="titleDk" defaultValue={editing?.titleDk} />
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
            <SectionLabel>Description</SectionLabel>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
              <Field label="Description (English)" name="descriptionEn" multiline defaultValue={editing?.descriptionEn} />
              <Field label="Description (Bangla)" name="descriptionBn" multiline defaultValue={editing?.descriptionBn} />
              <Field label="Description (Danish)" name="descriptionDk" multiline defaultValue={editing?.descriptionDk} />
            </div>
          </div>

          {/* Section 3: Cover Image */}
          <div className="flex flex-col gap-4">
            <SectionLabel>Cover Image</SectionLabel>
            <ProjectBlogCoverUploader
              uploadAction={uploadCoverAction}
              deleteAction={deleteImageAction}
              existingImage={editing?.coverImage}
            />
          </div>

          {/* Section 4: Gallery Images */}
          <div className="flex flex-col gap-4">
            <SectionLabel>Gallery Images</SectionLabel>
            <ProjectBlogGalleryUploader
              uploadAction={uploadGalleryAction}
              deleteAction={deleteImageAction}
              existingImages={editing?.galleryImages ?? []}
            />
          </div>

          {/* Section 5: Publish & Active */}
          <div className="flex flex-col gap-4">
            <SectionLabel>Visibility</SectionLabel>
            <div className="flex flex-wrap gap-4">
              <label className="flex items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm font-semibold text-slate-700 cursor-pointer">
                <input
                  type="checkbox"
                  checked={isPublished}
                  onChange={(e) => setIsPublished(e.target.checked)}
                  className="h-4 w-4 rounded border-slate-300 text-cyan-600 focus:ring-cyan-500"
                />
                Published
              </label>
              <label className="flex items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm font-semibold text-slate-700 cursor-pointer">
                <input
                  type="checkbox"
                  checked={isActive}
                  onChange={(e) => setIsActive(e.target.checked)}
                  className="h-4 w-4 rounded border-slate-300 text-cyan-600 focus:ring-cyan-500"
                />
                Active
              </label>
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
              {isPending ? "Saving…" : editing ? "Update Blog" : "Create Blog"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
