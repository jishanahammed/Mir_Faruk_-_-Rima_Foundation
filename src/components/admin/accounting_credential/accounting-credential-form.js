"use client";

import { useRef, useState, useTransition } from "react";

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

function Field({ label, name, defaultValue, type = "text", required, placeholder, hint, multiline, children }) {
  const base =
    "w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-800 placeholder:text-slate-400 focus:border-cyan-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-cyan-100 transition";
  return (
    <div className="flex flex-col gap-1">
      <label htmlFor={name} className="text-xs font-semibold text-slate-600">
        {label}{required && <span className="ml-0.5 text-rose-500">*</span>}
      </label>
      {children ? children : multiline ? (
        <textarea id={name} name={name} defaultValue={defaultValue ?? ""} rows={3} placeholder={placeholder} className={base} />
      ) : (
        <input
          id={name}
          name={name}
          type={type}
          defaultValue={defaultValue ?? ""}
          placeholder={placeholder}
          required={required}
          className={base}
        />
      )}
      {hint && <p className="text-[0.68rem] leading-4 text-slate-400">{hint}</p>}
    </div>
  );
}

function formatStamp(value) {
  if (!value) return null;
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return null;
  return d.toLocaleString();
}

/**
 * Single settings record: the same form creates it the first time and updates
 * it thereafter, so there is no list, no add button and no delete.
 */
export function AccountingCredentialForm({ credential, saveAction }) {
  const formRef = useRef(null);
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState(null);
  const [saved, setSaved] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const exists = !!credential?.id;
  const hasPassword = !!credential?.hasPassword;
  const savedAt = formatStamp(credential?.updatedAt ?? credential?.createdAt);

  function handleSubmit(e) {
    e.preventDefault();
    setError(null);
    setSaved(false);
    const fd = new FormData(formRef.current);
    startTransition(async () => {
      try {
        await saveAction(fd);
        setSaved(true);
      } catch (err) {
        setError(err?.message ?? "Something went wrong.");
      }
    });
  }

  return (
    <section className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm shadow-slate-900/4">
      <div className="flex flex-wrap items-center justify-between gap-3 bg-[linear-gradient(135deg,#0f766e,#0891b2)] px-6 py-4">
        <div>
          <h2 className="text-sm font-bold text-white">Accounting System Login</h2>
          <p className="text-xs text-cyan-100/80">
            {exists ? "Update the stored credentials below." : "Enter the credentials to connect your accounting system."}
          </p>
        </div>
        <span
          className={`rounded-full border px-3 py-1 text-[0.62rem] font-semibold uppercase tracking-[0.18em] ${exists
            ? "border-cyan-300/40 bg-cyan-400/10 text-cyan-100"
            : "border-amber-300/50 bg-amber-400/15 text-amber-100"
            }`}
        >
          {exists ? "Configured" : "Not set up"}
        </span>
      </div>

      <form ref={formRef} onSubmit={handleSubmit} className="flex flex-col gap-6 p-6">
        <div className="flex flex-col gap-4">
          <SectionLabel>Identity</SectionLabel>
          <Field
            label="Display Name"
            name="name"
            defaultValue={credential?.name}
            placeholder="e.g. Tally — Live"
            required
            hint="A label for the accounting system these credentials belong to."
          />
        </div>

        <div className="flex flex-col gap-4">
          <SectionLabel>Login Details</SectionLabel>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Field
              label="Username or Email"
              name="userName"
              defaultValue={credential?.userName}
              placeholder="accounts@example.com"
              required
            />
            <Field
              label="Password"
              name="password"
              required
              hint={
                hasPassword
                  ? "Use Show to reveal the saved password, or type a new one to replace it."
                  : undefined
              }
            >
              <div className="relative">
                <input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  defaultValue={credential?.password ?? ""}
                  required
                  autoComplete="new-password"
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 pr-16 text-sm text-slate-800 placeholder:text-slate-400 transition focus:border-cyan-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-cyan-100"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  className="absolute right-2 top-1/2 -translate-y-1/2 rounded-md border border-slate-200 bg-white px-2 py-1 text-[0.62rem] font-semibold text-slate-500 transition hover:border-cyan-300 hover:text-cyan-700"
                >
                  {showPassword ? "Hide" : "Show"}
                </button>
              </div>
            </Field>
          </div>

          <Field
            label="Login API URL"
            name="loginApiUrl"
            type="url"
            defaultValue={credential?.loginApiUrl}
            placeholder="https://accounting.example.com/api/auth/login"
            required
            hint="Full URL of the accounting system's login endpoint."
          />
        </div>

        <div className="flex flex-col gap-4">
          <SectionLabel>Options</SectionLabel>
          <Field label="Notes" name="notes" multiline defaultValue={credential?.notes} placeholder="Optional internal note." />
          <label className="flex w-fit cursor-pointer items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm font-semibold text-slate-700">
            <input
              type="checkbox"
              name="isActive"
              defaultChecked={credential?.isActive ?? true}
              className="h-4 w-4 rounded border-slate-300 text-cyan-600 focus:ring-cyan-400"
            />
            Active
          </label>
        </div>

        {error && (
          <div className="rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm font-semibold text-rose-700">
            {error}
          </div>
        )}

        {saved && !error && (
          <div className="rounded-xl border border-teal-200 bg-teal-50 px-4 py-3 text-sm font-semibold text-teal-700">
            Credentials saved.
          </div>
        )}

        <div className="flex flex-wrap items-center justify-between gap-3 border-t border-slate-100 pt-4">
          <p className="text-xs text-slate-400">
            {savedAt ? `Last saved ${savedAt}` : "Not saved yet."}
          </p>
          <button
            type="submit"
            disabled={isPending}
            className="inline-flex items-center gap-2 rounded-xl bg-[linear-gradient(135deg,#0f766e,#0891b2)] px-6 py-2 text-sm font-bold text-white shadow-md shadow-cyan-200/60 transition hover:opacity-90 disabled:opacity-60"
          >
            {isPending && <Spinner />}
            {isPending ? "Saving…" : "Save Credentials"}
          </button>
        </div>
      </form>
    </section>
  );
}
