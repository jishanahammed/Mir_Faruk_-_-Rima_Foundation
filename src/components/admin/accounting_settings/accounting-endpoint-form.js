"use client";

import { useActionState, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { saveAccountingEndpointAction } from "@/app/admin/accounting-endpoints/actions";

const inputClass =
  "h-11 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-cyan-400 focus:ring-4 focus:ring-cyan-100";

function FieldLabel({ children, required = false }) {
  return (
    <span className="mb-1.5 block text-xs font-semibold uppercase tracking-[0.12em] text-slate-500">
      {children}
      {required ? <span className="ml-1 text-red-500">*</span> : null}
    </span>
  );
}

/**
 * Add or edit one endpoint.
 *
 * Mounted with a key tied to the row being edited, so switching rows resets the
 * uncontrolled inputs instead of showing the previous row's values.
 */
function EndpointForm({ endpoint, keys, onDone }) {
  const isEdit = Boolean(endpoint);
  const [state, formAction, pending] = useActionState(saveAccountingEndpointAction, null);

  // On add, picking the endpoint prefills its shipped URL — the common case is
  // re-pointing one slightly, not typing a whole URL from scratch.
  const available = keys.filter((k) => !k.isConfigured);
  const [selectedKey, setSelectedKey] = useState(isEdit ? endpoint.endpointKey : available[0]?.key ?? "");
  const selected = keys.find((k) => k.key === selectedKey);

  useEffect(() => {
    if (state?.success) onDone();
  }, [state, onDone]);

  if (!isEdit && available.length === 0) {
    return (
      <p className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-600">
        Every endpoint is already configured. Edit an existing row to change its URL.
      </p>
    );
  }

  return (
    <form action={formAction} className="flex flex-col gap-4">
      {isEdit ? <input type="hidden" name="id" value={endpoint.id} /> : null}

      <div className="grid gap-4 md:grid-cols-2">
        <label className="block">
          <FieldLabel required>Endpoint</FieldLabel>
          {isEdit ? (
            // The key is the row's identity: changing it would repoint a
            // different part of the integration, so it is fixed after creation.
            <>
              <input type="hidden" name="endpointKey" value={endpoint.endpointKey} />
              <p className="flex h-11 items-center rounded-xl border border-slate-200 bg-slate-100 px-3 font-mono text-sm text-slate-600">
                {endpoint.endpointKey}
              </p>
            </>
          ) : (
            <select
              name="endpointKey"
              required
              value={selectedKey}
              onChange={(event) => setSelectedKey(event.target.value)}
              className={inputClass}
            >
              {available.map((k) => (
                <option key={k.key} value={k.key}>
                  {k.displayName}
                </option>
              ))}
            </select>
          )}
        </label>

        <label className="block">
          <FieldLabel>Display name</FieldLabel>
          <input
            name="displayName"
            type="text"
            maxLength={200}
            defaultValue={endpoint?.displayName ?? ""}
            placeholder={selected?.displayName ?? "Shown on this screen"}
            className={inputClass}
          />
        </label>
      </div>

      <label className="block">
        <FieldLabel required>API URL</FieldLabel>
        <input
          name="apiUrl"
          type="url"
          required
          maxLength={500}
          defaultValue={endpoint?.apiUrl ?? selected?.defaultUrl ?? ""}
          placeholder="https://accbackend.plan365.dk/api/v2/..."
          className={`${inputClass} font-mono text-xs`}
        />
        {selected?.defaultUrl ? (
          <span className="mt-1.5 block truncate text-[0.68rem] text-slate-400" title={selected.defaultUrl}>
            Built-in default: {selected.defaultUrl}
          </span>
        ) : null}
      </label>

      <label className="block">
        <FieldLabel>Description</FieldLabel>
        <input
          name="description"
          type="text"
          maxLength={500}
          defaultValue={endpoint?.description ?? selected?.description ?? ""}
          className={inputClass}
        />
      </label>

      <label className="flex items-center gap-2.5">
        <input
          name="isActive"
          type="checkbox"
          defaultChecked={endpoint ? endpoint.isActive : true}
          className="h-4 w-4 rounded border-slate-300 text-cyan-600 focus:ring-cyan-200"
        />
        <span className="text-sm text-slate-700">
          Active
          <span className="ml-1 text-xs text-slate-400">
            &mdash; when off, the built-in URL is used instead
          </span>
        </span>
      </label>

      {state?.message ? (
        <p
          className={`rounded-xl border px-4 py-2.5 text-sm font-medium ${
            state.success
              ? "border-emerald-200 bg-emerald-50 text-emerald-700"
              : "border-red-200 bg-red-50 text-red-700"
          }`}
        >
          {state.message}
        </p>
      ) : null}

      <div className="flex items-center justify-end gap-3 border-t border-slate-100 pt-4">
        <button
          type="button"
          onClick={onDone}
          className="inline-flex h-11 items-center rounded-xl border border-slate-200 bg-white px-5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={pending}
          className="inline-flex h-11 items-center rounded-xl bg-[linear-gradient(135deg,#0f766e,#0891b2)] px-5 text-sm font-semibold !text-white shadow-lg shadow-cyan-200/70 transition hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-70"
        >
          {pending ? "Saving..." : isEdit ? "Save changes" : "Add endpoint"}
        </button>
      </div>
    </form>
  );
}

export function AccountingEndpointFormPanel({ endpoint, keys, isOpen }) {
  const router = useRouter();

  function close() {
    router.push("/admin/accounting-endpoints");
  }

  if (!isOpen) {
    return (
      <div className="flex justify-end">
        <button
          type="button"
          onClick={() => router.push("/admin/accounting-endpoints?add=1")}
          className="inline-flex h-11 items-center rounded-xl bg-[linear-gradient(135deg,#0f766e,#0891b2)] px-5 text-sm font-semibold !text-white shadow-lg shadow-cyan-200/70 transition hover:-translate-y-0.5"
        >
          Add endpoint
        </button>
      </div>
    );
  }

  return (
    <section className="rounded-[24px] border border-cyan-100 bg-white p-5 shadow-sm sm:p-6">
      <h2 className="mb-4 text-base font-bold text-slate-900">
        {endpoint ? "Edit endpoint" : "Add endpoint"}
      </h2>
      {/* Remounts per row so the form never shows a previous row's values. */}
      <EndpointForm
        key={endpoint ? `edit-${endpoint.id}` : "add"}
        endpoint={endpoint}
        keys={keys}
        onDone={close}
      />
    </section>
  );
}
