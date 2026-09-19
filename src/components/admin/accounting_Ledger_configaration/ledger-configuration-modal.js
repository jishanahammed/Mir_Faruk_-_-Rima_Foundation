"use client";

import { useRef, useState, useTransition } from "react";
import { useRouter } from "next/navigation";

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

const inputClass =
  "w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-800 placeholder:text-slate-400 focus:border-cyan-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-cyan-100 transition";

const readOnlyClass =
  "w-full rounded-xl border border-slate-200 bg-slate-100 px-3 py-2 font-mono text-sm text-slate-600 tabular-nums";

function Field({ label, name, required, hint, children }) {
  return (
    <div className="flex flex-col gap-1">
      <label htmlFor={name} className="text-xs font-semibold text-slate-600">
        {label}{required && <span className="ml-0.5 text-rose-500">*</span>}
      </label>
      {children}
      {hint && <p className="text-[0.68rem] leading-4 text-slate-400">{hint}</p>}
    </div>
  );
}

export function LedgerConfigurationModal({
  params,
  configurations,
  ledgerTypes,
  accountGroups,
  accountGroupError,
  createAction,
  updateAction,
}) {
  const router = useRouter();

  const isAdd = params?.add === "1";
  const editId = params?.edit ? Number(params.edit) : null;
  const editing = editId ? configurations.find((c) => c.id === editId) : null;
  const isOpen = isAdd || !!editing;

  function close() {
    router.push("/admin/ledger-configuration");
  }

  if (!isOpen) return null;

  // Each ledger type is configured once, so types already taken are hidden
  // from the Add form rather than failing on save.
  const takenTypes = new Set(
    configurations.filter((c) => c.id !== editing?.id).map((c) => c.ledgerType)
  );
  const availableTypes = ledgerTypes.filter((t) => !takenTypes.has(t));

  // The form lives in its own component keyed to the row being edited, so
  // opening a different row remounts it — resetting both the uncontrolled
  // defaultValues and the group selection state to that row's values.
  return (
    <LedgerConfigurationForm
      key={editing ? `edit-${editing.id}` : "add"}
      editing={editing}
      availableTypes={availableTypes}
      accountGroups={accountGroups}
      accountGroupError={accountGroupError}
      createAction={createAction}
      updateAction={updateAction}
      close={close}
    />
  );
}

function LedgerConfigurationForm({
  editing,
  availableTypes,
  accountGroups,
  accountGroupError,
  createAction,
  updateAction,
  close,
}) {
  const formRef = useRef(null);
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState(null);

  // Selecting a group fills the code and nature, which the provider supplies
  // together — so those two are shown read-only rather than retyped.
  const [groupId, setGroupId] = useState(String(editing?.groupId ?? ""));

  const selected = accountGroups.find((g) => String(g.id) === String(groupId));
  const groupCode = selected?.groupCode ?? editing?.groupCode ?? "";
  const natureId = selected?.natureId ?? editing?.natureId ?? "";
  const groupName = selected?.groupName ?? editing?.groupName ?? "";

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

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto p-4 sm:p-8"
      onClick={(e) => e.target === e.currentTarget && close()}
    >
      <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm" aria-hidden="true" onClick={close} />

      <div className="relative z-10 my-4 w-full max-w-xl rounded-3xl bg-white shadow-2xl shadow-slate-900/20">
        <div className="rounded-t-3xl bg-[linear-gradient(135deg,#0f766e,#0891b2)] px-6 py-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-bold uppercase tracking-widest text-cyan-200">Ledger Configuration</p>
              <h2 className="mt-0.5 text-lg font-extrabold text-white">
                {editing ? `Edit ${editing.ledgerType}` : "Add Configuration"}
              </h2>
            </div>
            <button
              onClick={close}
              aria-label="Close"
              className="flex h-8 w-8 items-center justify-center rounded-full bg-white/20 text-white transition hover:bg-white/30"
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-4 w-4">
                <path d="M18 6 6 18M6 6l12 12" strokeLinecap="round" />
              </svg>
            </button>
          </div>
        </div>

        <form ref={formRef} onSubmit={handleSubmit} className="flex flex-col gap-6 p-6">
          <div className="flex flex-col gap-4">
            <SectionLabel>Ledger Type</SectionLabel>
            <Field label="Applies To" name="ledgerType" required hint="Each type can be configured once.">
              <select
                id="ledgerType"
                name="ledgerType"
                defaultValue={editing?.ledgerType ?? ""}
                required
                className={inputClass}
              >
                <option value="" disabled>Select ledger type…</option>
                {editing && <option value={editing.ledgerType}>{editing.ledgerType}</option>}
                {availableTypes.map((t) => <option key={t} value={t}>{t}</option>)}
              </select>
            </Field>
          </div>

          <div className="flex flex-col gap-4">
            <SectionLabel>Account Group</SectionLabel>

            {accountGroupError ? (
              // The list comes from the accounting system; when it is unreachable
              // the values can still be typed so the screen stays usable.
              <>
                <p className="rounded-xl border border-amber-200 bg-amber-50 px-3 py-2 text-[0.68rem] leading-4 text-amber-900">
                  {accountGroupError} Enter the group details manually.
                </p>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                  <Field label="Group ID" name="groupId" required>
                    <input id="groupId" name="groupId" type="number" min="0" defaultValue={editing?.groupId ?? ""} required className={inputClass} />
                  </Field>
                  <Field label="Group Code" name="groupCode" required>
                    <input id="groupCode" name="groupCode" type="text" defaultValue={editing?.groupCode ?? ""} required className={inputClass} />
                  </Field>
                  <Field label="Nature ID" name="natureId" required>
                    <input id="natureId" name="natureId" type="number" min="0" defaultValue={editing?.natureId ?? ""} required className={inputClass} />
                  </Field>
                </div>
                <input type="hidden" name="groupName" value={editing?.groupName ?? ""} />
              </>
            ) : (
              <>
                <Field
                  label="Group"
                  name="groupId"
                  required
                  hint="Loaded from the accounting system. Code and nature follow the group you pick."
                >
                  <select
                    id="groupId"
                    name="groupId"
                    value={groupId}
                    onChange={(e) => setGroupId(e.target.value)}
                    required
                    className={inputClass}
                  >
                    <option value="" disabled>Select account group…</option>
                    {/* The saved group may be absent from the fetched list
                        (inactive, or a different subscriber) — keep it listed
                        so editing does not silently clear it. */}
                    {editing?.groupId != null
                      && !accountGroups.some((g) => String(g.id) === String(editing.groupId)) && (
                      <option value={editing.groupId}>
                        {editing.groupCode ? `${editing.groupCode} — ` : ""}
                        {editing.groupName || `Group ${editing.groupId}`}
                      </option>
                    )}
                    {accountGroups.map((g) => (
                      <option key={g.id} value={g.id}>
                        {g.groupCode ? `${g.groupCode} — ` : ""}{g.groupName}
                        {g.groupNameBN ? ` (${g.groupNameBN})` : ""}
                      </option>
                    ))}
                  </select>
                </Field>

                {/* Supplied by the chosen group — shown so the mapping is
                    visible, submitted as hidden fields. */}
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <Field label="Group Code" name="groupCodeDisplay">
                    <div className={readOnlyClass}>{groupCode || "—"}</div>
                  </Field>
                  <Field label="Nature ID" name="natureIdDisplay">
                    <div className={readOnlyClass}>{natureId === "" ? "—" : natureId}</div>
                  </Field>
                </div>

                <input type="hidden" name="groupCode" value={groupCode} />
                <input type="hidden" name="natureId" value={natureId} />
                <input type="hidden" name="groupName" value={groupName} />
              </>
            )}

            <Field
              label="Add API URL"
              name="addApiUrl"
              hint="Optional. Endpoint used to create a record of this type."
            >
              <input
                id="addApiUrl"
                name="addApiUrl"
                type="url"
                defaultValue={editing?.addApiUrl ?? ""}
                placeholder="https://accbackend.plan365.dk/api/v2/.../create"
                className={inputClass}
              />
            </Field>

            <Field
              label="Update API URL"
              name="updateApiUrl"
              hint="Optional. Endpoint used to update an existing record."
            >
              <input
                id="updateApiUrl"
                name="updateApiUrl"
                type="url"
                defaultValue={editing?.updateApiUrl ?? ""}
                placeholder="https://accbackend.plan365.dk/api/v2/.../update"
                className={inputClass}
              />
            </Field>

            <label className="flex w-fit cursor-pointer items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm font-semibold text-slate-700">
              <input
                type="checkbox"
                name="isActive"
                defaultChecked={editing?.isActive ?? true}
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

          <div className="flex items-center justify-end gap-3 border-t border-slate-100 pt-4">
            <button
              type="button"
              onClick={close}
              className="rounded-xl border border-slate-200 px-5 py-2 text-sm font-semibold text-slate-600 transition hover:bg-slate-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isPending}
              className="inline-flex items-center gap-2 rounded-xl bg-[linear-gradient(135deg,#0f766e,#0891b2)] px-6 py-2 text-sm font-bold text-white shadow-md shadow-cyan-200/60 transition hover:opacity-90 disabled:opacity-60"
            >
              {isPending && <Spinner />}
              {isPending ? "Saving…" : editing ? "Update" : "Create"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
