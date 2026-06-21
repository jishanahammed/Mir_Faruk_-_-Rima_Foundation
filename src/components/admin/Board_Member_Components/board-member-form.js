"use client";

import { useRef, useState } from "react";

function FieldGroup({ label, children }) {
  return (
    <div className="rounded-[20px] border border-slate-200 bg-white p-5 shadow-sm">
      <h3 className="mb-4 text-xs font-bold uppercase tracking-[0.18em] text-cyan-700">{label}</h3>
      <div className="space-y-4">{children}</div>
    </div>
  );
}

function InputField({ label, name, defaultValue = "", placeholder, required = false, type = "text" }) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-xs font-semibold text-slate-600">
        {label} {required && <span className="text-red-500">*</span>}
      </span>
      <input
        type={type}
        name={name}
        defaultValue={defaultValue}
        placeholder={placeholder}
        required={required}
        className="h-12 w-full rounded-2xl border border-slate-200 bg-white px-4 text-sm font-medium text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-cyan-400 focus:ring-4 focus:ring-cyan-100"
      />
    </label>
  );
}

function TextareaField({ label, name, defaultValue = "", placeholder, rows = 3 }) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-xs font-semibold text-slate-600">{label}</span>
      <textarea
        name={name}
        defaultValue={defaultValue}
        placeholder={placeholder}
        rows={rows}
        className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-medium text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-cyan-400 focus:ring-4 focus:ring-cyan-100 resize-none"
      />
    </label>
  );
}

export function BoardMemberForm({ member, action, returnTo }) {
  const [previewUrl, setPreviewUrl] = useState(member?.profileImageAbsoluteUrl ?? "");
  const [isPending, setIsPending] = useState(false);
  const [error, setError] = useState("");
  const formRef = useRef(null);

  function handleImageChange(e) {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
    }
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setIsPending(true);
    setError("");

    try {
      const formData = new FormData(formRef.current);
      await action(formData);
    } catch (err) {
      setError(err?.message ?? "Something went wrong. Please try again.");
      setIsPending(false);
    }
  }

  const isEditing = Boolean(member?.id);

  return (
    <form ref={formRef} onSubmit={handleSubmit} className="space-y-5 xl:space-y-6">
      {member?.id && <input type="hidden" name="id" value={member.id} />}
      {returnTo && <input type="hidden" name="returnTo" value={returnTo} />}

      {error && (
        <div className="rounded-[20px] border border-red-200 bg-red-50 px-5 py-4 text-sm text-red-700">
          <strong className="block font-semibold">Error</strong>
          {error}
        </div>
      )}

      <div className="grid gap-5 xl:grid-cols-[1fr_280px]">
        <div className="space-y-5">
          {/* Serial No */}
          <FieldGroup label="General">
            <InputField
              label="Serial No"
              name="serialNo"
              type="number"
              defaultValue={member?.serialNo ?? ""}
              placeholder="1"
            />
          </FieldGroup>

          {/* Name fields */}
          <FieldGroup label="Name">
            <InputField
              label="Name (English)"
              name="nameEn"
              defaultValue={member?.nameEn ?? ""}
              placeholder="e.g. John Smith"
              required
            />
            <InputField
              label="Name (Bangla)"
              name="nameBn"
              defaultValue={member?.nameBn ?? ""}
              placeholder="বাংলায় নাম"
            />
            <InputField
              label="Name (Danish)"
              name="nameDk"
              defaultValue={member?.nameDk ?? ""}
              placeholder="Navn på dansk"
            />
          </FieldGroup>

          {/* Designation */}
          <FieldGroup label="Designation">
            <InputField
              label="Designation (English)"
              name="designationEn"
              defaultValue={member?.designationEn ?? ""}
              placeholder="e.g. Chairman"
            />
            <InputField
              label="Designation (Bangla)"
              name="designationBn"
              defaultValue={member?.designationBn ?? ""}
              placeholder="বাংলায় পদবি"
            />
            <InputField
              label="Designation (Danish)"
              name="designationDk"
              defaultValue={member?.designationDk ?? ""}
              placeholder="Betegnelse på dansk"
            />
          </FieldGroup>

          {/* Organization — fixed to foundation name */}
          <FieldGroup label="Organization">
            {[
              { label: "Organization Name (English)", name: "organizationNameEn", value: "Mir Faruk & Rima Foundation" },
              { label: "Organization Name (Bangla)",  name: "organizationNameBn", value: "মীর ফারুক & রিমা ফাউন্ডেশন" },
              { label: "Organization Name (Danish)",  name: "organizationNameDk", value: "Mir Faruk & Rima Foundation" },
            ].map(({ label, name, value }) => (
              <label key={name} className="block">
                <span className="mb-1.5 block text-xs font-semibold text-slate-600">{label}</span>
                <div className="relative">
                  <input
                    type="text"
                    name={name}
                    value={value}
                    readOnly
                    className="h-12 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 pr-10 text-sm font-medium text-slate-500 outline-none cursor-not-allowed"
                  />
                  <span className="pointer-events-none absolute inset-y-0 right-4 flex items-center text-slate-300">
                    <svg className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" aria-hidden="true">
                      <rect x="3" y="11" width="18" height="11" rx="2" />
                      <path d="M7 11V7a5 5 0 0 1 10 0v4" strokeLinecap="round" />
                    </svg>
                  </span>
                </div>
              </label>
            ))}
          </FieldGroup>

          {/* Responsibility Note */}
          <FieldGroup label="Responsibility Note">
            <TextareaField
              label="Responsibility Note (English)"
              name="responsibilityNoteEn"
              defaultValue={member?.responsibilityNoteEn ?? ""}
              placeholder="Describe this member's responsibilities..."
              rows={3}
            />
            <TextareaField
              label="Responsibility Note (Bangla)"
              name="responsibilityNoteBn"
              defaultValue={member?.responsibilityNoteBn ?? ""}
              placeholder="বাংলায় দায়িত্বের বিবরণ..."
              rows={3}
            />
            <TextareaField
              label="Responsibility Note (Danish)"
              name="responsibilityNoteDk"
              defaultValue={member?.responsibilityNoteDk ?? ""}
              placeholder="Ansvarsbeskrivelse på dansk..."
              rows={3}
            />
          </FieldGroup>
        </div>

        {/* Sidebar: image + status */}
        <div className="space-y-5">
          <FieldGroup label="Profile Image">
            <div className="flex flex-col items-center gap-4">
              <div className="relative h-36 w-36 overflow-hidden rounded-2xl border-2 border-dashed border-slate-200 bg-slate-50">
                {previewUrl ? (
                  <img
                    src={previewUrl}
                    alt="Profile preview"
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <div className="flex h-full flex-col items-center justify-center text-slate-400">
                    <svg
                      className="h-10 w-10"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      viewBox="0 0 24 24"
                      aria-hidden="true"
                    >
                      <path
                        d="M12 16V8m-4 4 4-4 4 4"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                      <rect x="3" y="3" width="18" height="18" rx="3" />
                    </svg>
                    <span className="mt-2 text-xs">No image</span>
                  </div>
                )}
              </div>
              <label className="w-full cursor-pointer">
                <span className="block w-full rounded-2xl border border-slate-200 bg-white px-4 py-2.5 text-center text-sm font-semibold text-slate-700 transition hover:bg-slate-50">
                  {previewUrl ? "Change Image" : "Upload Image"}
                </span>
                <input
                  type="file"
                  name="profileImage"
                  accept="image/*"
                  className="sr-only"
                  onChange={handleImageChange}
                />
              </label>
              <p className="text-center text-[11px] text-slate-400">
                JPG, PNG, WEBP. Max 10 MB.
              </p>
            </div>
          </FieldGroup>

          <FieldGroup label="Status">
            <label className="flex cursor-pointer items-center justify-between gap-3 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 transition hover:bg-slate-100">
              <div>
                <p className="text-sm font-semibold text-slate-900">Active</p>
                <p className="text-xs text-slate-500">Show on public site</p>
              </div>
              <input type="hidden" name="isActive" value="false" />
              <input
                type="checkbox"
                name="isActive"
                value="true"
                defaultChecked={member?.isActive ?? true}
                className="h-5 w-5 rounded border-slate-300 text-cyan-600 focus:ring-cyan-400"
              />
            </label>
          </FieldGroup>
        </div>
      </div>

      {/* Footer actions */}
      <div className="flex items-center justify-between gap-4 rounded-[20px] border border-slate-200 bg-white p-5 shadow-sm">
        <a
          href={returnTo ?? "/admin/Board_Member_Page"}
          className="inline-flex h-11 items-center rounded-2xl border border-slate-200 bg-white px-5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
        >
          Cancel
        </a>
        <button
          type="submit"
          disabled={isPending}
          className="inline-flex h-11 items-center gap-2 rounded-2xl bg-[linear-gradient(135deg,#0f766e,#0891b2)] px-6 text-sm font-semibold text-white shadow-lg shadow-cyan-200/80 transition hover:-translate-y-0.5 hover:shadow-xl disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isPending ? (
            <>
              <svg
                className="h-4 w-4 animate-spin"
                fill="none"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 0 1 8-8V0C5.373 0 0 5.373 0 12h4Z"
                />
              </svg>
              Saving...
            </>
          ) : isEditing ? (
            "Save Changes"
          ) : (
            "Add Member"
          )}
        </button>
      </div>
    </form>
  );
}
