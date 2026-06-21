"use client";

import { useRef, useState, useTransition, useCallback } from "react";

// ── Toast ─────────────────────────────────────────────────────────────────────

function Toast({ message, type, onClose }) {
  const isError = type === "error";
  return (
    <div
      className={`fixed bottom-6 right-6 z-50 flex items-center gap-3 rounded-2xl px-5 py-4 shadow-2xl shadow-slate-900/20 transition-all ${
        isError
          ? "border border-red-200 bg-red-50 text-red-800"
          : "border border-emerald-200 bg-emerald-50 text-emerald-800"
      }`}
    >
      <span className="text-lg">{isError ? "✕" : "✓"}</span>
      <span className="text-sm font-semibold">{message}</span>
      <button type="button" onClick={onClose} className="ml-2 opacity-60 hover:opacity-100">
        <svg viewBox="0 0 16 16" fill="currentColor" className="h-4 w-4">
          <path d="M4.47 4.47a.75.75 0 0 1 1.06 0L8 6.94l2.47-2.47a.75.75 0 1 1 1.06 1.06L9.06 8l2.47 2.47a.75.75 0 1 1-1.06 1.06L8 9.06l-2.47 2.47a.75.75 0 0 1-1.06-1.06L6.94 8 4.47 5.53a.75.75 0 0 1 0-1.06Z" />
        </svg>
      </button>
    </div>
  );
}

function useToast() {
  const [toast, setToast] = useState(null);
  const show = useCallback((message, type = "success") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3500);
  }, []);
  return { toast, show };
}

// ── Modal ─────────────────────────────────────────────────────────────────────

function Modal({ title, subtitle, onClose, children }) {
  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
        onClick={onClose}
      />
      <div className="relative w-full max-w-lg overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-2xl shadow-slate-900/20">
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

// ── NameForm ──────────────────────────────────────────────────────────────────

function NameForm({ defaultValues, hiddenFields, action, onDone, submitLabel, onSuccess, onError }) {
  const [isPending, startTransition] = useTransition();
  const formRef = useRef(null);

  function handleSubmit(e) {
    e.preventDefault();
    const fd = new FormData(formRef.current);
    startTransition(async () => {
      try {
        await action(fd);
        onSuccess?.();
        onDone?.();
      } catch (err) {
        onError?.(err?.message ?? "Something went wrong.");
      }
    });
  }

  return (
    <form ref={formRef} onSubmit={handleSubmit} className="space-y-4">
      {hiddenFields?.map(([name, value]) => (
        <input key={name} type="hidden" name={name} value={value} />
      ))}
      <div className="grid gap-4 sm:grid-cols-3">
        {[
          { name: "nameEn", label: "English", placeholder: "Name in English", required: true },
          { name: "nameBn", label: "বাংলা", placeholder: "বাংলায় নাম", required: true },
          { name: "nameDk", label: "Dansk", placeholder: "Navn på dansk", required: false },
        ].map(({ name, label, placeholder, required }) => (
          <div key={name}>
            <label className="mb-1.5 block text-xs font-semibold text-slate-500">
              {label} {required && <span className="text-red-500">*</span>}
            </label>
            <input
              name={name}
              required={required}
              defaultValue={defaultValues?.[name] ?? ""}
              placeholder={placeholder}
              className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-sm text-slate-900 placeholder-slate-400 outline-none transition focus:border-cyan-400 focus:bg-white focus:ring-2 focus:ring-cyan-100"
            />
          </div>
        ))}
      </div>
      <div className="flex justify-end gap-2 pt-1">
        {onDone && (
          <button
            type="button"
            onClick={onDone}
            className="rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-600 transition hover:bg-slate-50"
          >
            Cancel
          </button>
        )}
        <button
          type="submit"
          disabled={isPending}
          className="flex items-center gap-2 rounded-xl bg-cyan-700 px-5 py-2.5 text-sm font-semibold text-white shadow-sm shadow-cyan-900/20 transition hover:bg-cyan-800 disabled:opacity-60"
        >
          {isPending && (
            <svg className="h-3.5 w-3.5 animate-spin" viewBox="0 0 24 24" fill="none">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
            </svg>
          )}
          {isPending ? "Saving…" : submitLabel}
        </button>
      </div>
    </form>
  );
}

// ── Delete confirm modal ───────────────────────────────────────────────────────

function DeleteConfirmModal({ item, action, onClose, onSuccess, onError }) {
  const [isPending, startTransition] = useTransition();

  function handleDelete() {
    const fd = new FormData();
    fd.set("id", item.id);
    startTransition(async () => {
      try {
        await action(fd);
        onSuccess?.();
        onClose();
      } catch (err) {
        onError?.(err?.message ?? "Delete failed.");
        onClose();
      }
    });
  }

  return (
    <Modal title="Confirm Delete" subtitle="This action cannot be undone." onClose={onClose}>
      <div className="space-y-5">
        <div className="rounded-2xl border border-red-100 bg-red-50 px-4 py-3">
          <p className="text-sm text-red-700">
            Are you sure you want to delete{" "}
            <strong className="font-bold">&ldquo;{item.nameEn}&rdquo;</strong>?
            All child records linked to this entry may be affected.
          </p>
        </div>
        <div className="flex justify-end gap-2">
          <button
            type="button"
            onClick={onClose}
            className="rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-600 transition hover:bg-slate-50"
          >
            Cancel
          </button>
          <button
            type="button"
            disabled={isPending}
            onClick={handleDelete}
            className="flex items-center gap-2 rounded-xl bg-red-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-red-700 disabled:opacity-60"
          >
            {isPending ? "Deleting…" : "Yes, Delete"}
          </button>
        </div>
      </div>
    </Modal>
  );
}

// ── Row ───────────────────────────────────────────────────────────────────────

function Row({ item, index, updateAction, deleteAction, onSuccess, onError }) {
  const [editOpen, setEditOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);

  const dotColors = {
    cyan: "bg-cyan-500",
    violet: "bg-violet-500",
    emerald: "bg-emerald-500",
  };

  return (
    <>
      <li className="group flex items-center gap-4 rounded-2xl border border-slate-100 bg-white px-4 py-3.5 text-sm transition hover:border-slate-200 hover:shadow-sm">
        <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-xl bg-slate-100 text-xs font-bold text-slate-500">
          {index + 1}
        </span>
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-x-2.5 gap-y-0.5">
            <span className="font-semibold text-slate-900">{item.nameEn}</span>
            {item.nameBn && (
              <span className="text-slate-500">{item.nameBn}</span>
            )}
            {item.nameDk && (
              <span className="rounded-md bg-slate-100 px-2 py-0.5 text-xs text-slate-500">
                {item.nameDk}
              </span>
            )}
          </div>
        </div>
        <div className="flex shrink-0 items-center gap-1.5 opacity-0 transition group-hover:opacity-100">
          <button
            type="button"
            onClick={() => setEditOpen(true)}
            className="flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-600 transition hover:border-cyan-300 hover:bg-cyan-50 hover:text-cyan-700"
          >
            <svg viewBox="0 0 16 16" fill="currentColor" className="h-3 w-3">
              <path d="M11.013 1.427a1.75 1.75 0 0 1 2.474 0l1.086 1.086a1.75 1.75 0 0 1 0 2.474l-8.61 8.61c-.21.21-.47.364-.756.445l-3.251.93a.75.75 0 0 1-.927-.928l.929-3.25c.081-.286.235-.547.445-.758l8.61-8.61Z" />
            </svg>
            Edit
          </button>
          <button
            type="button"
            onClick={() => setDeleteOpen(true)}
            className="flex items-center gap-1.5 rounded-lg border border-red-100 bg-white px-3 py-1.5 text-xs font-semibold text-red-500 transition hover:border-red-300 hover:bg-red-50"
          >
            <svg viewBox="0 0 16 16" fill="currentColor" className="h-3 w-3">
              <path d="M5 3.25V4H2.75a.75.75 0 0 0 0 1.5h.3l.815 8.15A1.5 1.5 0 0 0 5.357 15h5.285a1.5 1.5 0 0 0 1.493-1.35l.815-8.15h.3a.75.75 0 0 0 0-1.5H11v-.75A2.25 2.25 0 0 0 8.75 1h-1.5A2.25 2.25 0 0 0 5 3.25Zm2.25-.75a.75.75 0 0 1 .75-.75h1.5a.75.75 0 0 1 .75.75V4h-3V2.5Z" />
            </svg>
            Delete
          </button>
        </div>
      </li>

      {editOpen && (
        <Modal
          title={`Edit — ${item.nameEn}`}
          subtitle="Update the names in all languages."
          onClose={() => setEditOpen(false)}
        >
          <NameForm
            defaultValues={item}
            hiddenFields={[["id", item.id]]}
            action={updateAction}
            submitLabel="Save Changes"
            onDone={() => setEditOpen(false)}
            onSuccess={() => onSuccess?.("Updated successfully.")}
            onError={onError}
          />
        </Modal>
      )}

      {deleteOpen && (
        <DeleteConfirmModal
          item={item}
          action={deleteAction}
          onClose={() => setDeleteOpen(false)}
          onSuccess={() => onSuccess?.(`"${item.nameEn}" deleted.`)}
          onError={onError}
        />
      )}
    </>
  );
}

// ── Panel shell ───────────────────────────────────────────────────────────────

function PanelShell({
  eyebrow,
  title,
  icon,
  count,
  accentColor,
  searchPlaceholder,
  addLabel,
  emptyText,
  items,
  filterNode,
  addFormNode,
  onAddToggle,
  isAdding,
  updateAction,
  deleteAction,
  onSuccess,
  onError,
}) {
  const [search, setSearch] = useState("");

  const filtered = items.filter(
    (it) =>
      it.nameEn.toLowerCase().includes(search.toLowerCase()) ||
      it.nameBn.includes(search) ||
      (it.nameDk ?? "").toLowerCase().includes(search.toLowerCase()),
  );

  const colors = {
    cyan: {
      badge: "border-cyan-200 bg-cyan-50 text-cyan-700",
      header: "from-cyan-600 to-cyan-800",
      count: "bg-cyan-100 text-cyan-800",
      addBtn: "border-cyan-200 text-cyan-700 hover:border-cyan-400 hover:bg-cyan-50",
      iconBg: "bg-cyan-600",
    },
    violet: {
      badge: "border-violet-200 bg-violet-50 text-violet-700",
      header: "from-violet-600 to-violet-800",
      count: "bg-violet-100 text-violet-800",
      addBtn: "border-violet-200 text-violet-700 hover:border-violet-400 hover:bg-violet-50",
      iconBg: "bg-violet-600",
    },
    emerald: {
      badge: "border-emerald-200 bg-emerald-50 text-emerald-700",
      header: "from-emerald-600 to-emerald-800",
      count: "bg-emerald-100 text-emerald-800",
      addBtn: "border-emerald-200 text-emerald-700 hover:border-emerald-400 hover:bg-emerald-50",
      iconBg: "bg-emerald-600",
    },
  };
  const c = colors[accentColor] ?? colors.cyan;

  return (
    <section className="flex flex-col overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
      {/* Header */}
      <div className={`bg-linear-to-br ${c.header} px-6 py-5 text-white`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className={`flex h-9 w-9 items-center justify-center rounded-xl bg-white/15`}>
              {icon}
            </div>
            <div>
              <p className="text-[0.65rem] font-bold tracking-widest text-white/60 uppercase">{eyebrow}</p>
              <h2 className="text-lg font-extrabold leading-tight">{title}</h2>
            </div>
          </div>
          <span className="rounded-xl bg-white/20 px-3 py-1 text-sm font-bold">{count}</span>
        </div>
      </div>

      {/* Filter + search bar */}
      <div className="space-y-3 border-b border-slate-100 px-4 py-4">
        {filterNode}
        <div className="relative">
          <svg
            viewBox="0 0 20 20"
            fill="currentColor"
            className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400"
          >
            <path fillRule="evenodd" d="M9 3.5a5.5 5.5 0 1 0 0 11 5.5 5.5 0 0 0 0-11ZM2 9a7 7 0 1 1 12.452 4.391l3.328 3.329a.75.75 0 1 1-1.06 1.06l-3.329-3.328A7 7 0 0 1 2 9Z" clipRule="evenodd" />
          </svg>
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder={searchPlaceholder}
            className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2.5 pl-9 pr-3.5 text-sm text-slate-900 placeholder-slate-400 outline-none focus:border-cyan-400 focus:bg-white focus:ring-2 focus:ring-cyan-100"
          />
          {search && (
            <button
              type="button"
              onClick={() => setSearch("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700"
            >
              <svg viewBox="0 0 16 16" fill="currentColor" className="h-3.5 w-3.5">
                <path d="M4.47 4.47a.75.75 0 0 1 1.06 0L8 6.94l2.47-2.47a.75.75 0 1 1 1.06 1.06L9.06 8l2.47 2.47a.75.75 0 1 1-1.06 1.06L8 9.06l-2.47 2.47a.75.75 0 0 1-1.06-1.06L6.94 8 4.47 5.53a.75.75 0 0 1 0-1.06Z" />
              </svg>
            </button>
          )}
        </div>
      </div>

      {/* List */}
      <div className="flex-1 overflow-y-auto px-4 py-3" style={{ maxHeight: "420px" }}>
        {filtered.length > 0 ? (
          <ul className="space-y-1.5">
            {filtered.map((item, index) => (
              <Row
                key={item.id}
                item={item}
                index={index}
                accentColor={accentColor}
                updateAction={updateAction}
                deleteAction={deleteAction}
                onSuccess={onSuccess}
                onError={onError}
              />
            ))}
          </ul>
        ) : (
          <div className="flex flex-col items-center justify-center gap-2 py-12 text-center">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="h-10 w-10 text-slate-300">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
              <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1 1 15 0Z" />
            </svg>
            <p className="text-sm font-medium text-slate-400">{emptyText}</p>
          </div>
        )}
      </div>

      {/* Add row */}
      <div className="border-t border-slate-100 p-4">
        {isAdding ? addFormNode : (
          <button
            type="button"
            onClick={onAddToggle}
            className={`flex w-full items-center justify-center gap-2 rounded-xl border border-dashed py-3 text-sm font-semibold transition ${c.addBtn}`}
          >
            <svg viewBox="0 0 20 20" fill="currentColor" className="h-4 w-4">
              <path d="M10.75 4.75a.75.75 0 0 0-1.5 0v4.5h-4.5a.75.75 0 0 0 0 1.5h4.5v4.5a.75.75 0 0 0 1.5 0v-4.5h4.5a.75.75 0 0 0 0-1.5h-4.5v-4.5Z" />
            </svg>
            {addLabel}
          </button>
        )}
      </div>
    </section>
  );
}

// ── Division icon ─────────────────────────────────────────────────────────────

function DivisionIcon() {
  return (
    <svg viewBox="0 0 20 20" fill="currentColor" className="h-5 w-5 text-white">
      <path fillRule="evenodd" d="M1 2.75A.75.75 0 0 1 1.75 2h10.5a.75.75 0 0 1 0 1.5H12v13.75a.75.75 0 0 1-.75.75h-1.5a.75.75 0 0 1-.75-.75v-3.5a.75.75 0 0 0-.75-.75h-2.5a.75.75 0 0 0-.75.75v3.5a.75.75 0 0 1-.75.75h-3A.75.75 0 0 1 1 17.25V2.75ZM4 5.5a.5.5 0 0 1 .5-.5h1a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5h-1a.5.5 0 0 1-.5-.5v-1Zm.5 3.5a.5.5 0 0 0-.5.5v1a.5.5 0 0 0 .5.5h1a.5.5 0 0 0 .5-.5v-1a.5.5 0 0 0-.5-.5h-1ZM8 5.5a.5.5 0 0 1 .5-.5h1a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5h-1a.5.5 0 0 1-.5-.5v-1Zm.5 3.5a.5.5 0 0 0-.5.5v1a.5.5 0 0 0 .5.5h1a.5.5 0 0 0 .5-.5v-1a.5.5 0 0 0-.5-.5h-1Z" clipRule="evenodd" />
      <path d="M14.75 7.25a.75.75 0 0 0-.75.75v9.25h3.25A.75.75 0 0 0 18 16.5V10a.75.75 0 0 0-.75-.75h-.5V8a.75.75 0 0 0-.75-.75h-1.25Zm.5 2.25a.5.5 0 0 1 .5-.5h.5a.5.5 0 0 1 .5.5v.5a.5.5 0 0 1-.5.5h-.5a.5.5 0 0 1-.5-.5v-.5Zm.5 3a.5.5 0 0 0-.5.5v.5a.5.5 0 0 0 .5.5h.5a.5.5 0 0 0 .5-.5v-.5a.5.5 0 0 0-.5-.5h-.5Z" />
    </svg>
  );
}

function DistrictIcon() {
  return (
    <svg viewBox="0 0 20 20" fill="currentColor" className="h-5 w-5 text-white">
      <path fillRule="evenodd" d="M9.293 2.293a1 1 0 0 1 1.414 0l7 7A1 1 0 0 1 17 11h-1v6a1 1 0 0 1-1 1h-2a1 1 0 0 1-1-1v-3a1 1 0 0 0-1-1H9a1 1 0 0 0-1 1v3a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1v-6H3a1 1 0 0 1-.707-1.707l7-7Z" clipRule="evenodd" />
    </svg>
  );
}

function UpazilaIcon() {
  return (
    <svg viewBox="0 0 20 20" fill="currentColor" className="h-5 w-5 text-white">
      <path fillRule="evenodd" d="M9.69 18.933l.003.001C9.89 19.02 10 19 10 19s.11.02.308-.066l.002-.001.006-.003.018-.008a5.741 5.741 0 0 0 .281-.14c.186-.096.446-.24.757-.433.62-.384 1.445-.966 2.274-1.765C15.302 15.57 17 13.35 17 10a7 7 0 1 0-14 0c0 3.35 1.698 5.57 3.354 7.085a13.195 13.195 0 0 0 3.057 2.199l.018.008.006.003ZM10 11.25a1.25 1.25 0 1 0 0-2.5 1.25 1.25 0 0 0 0 2.5Z" clipRule="evenodd" />
    </svg>
  );
}

// ── Division panel ────────────────────────────────────────────────────────────

export function DivisionPanel({ divisions, createAction, updateAction, deleteAction }) {
  const [adding, setAdding] = useState(false);
  const { toast, show } = useToast();

  return (
    <>
      <PanelShell
        eyebrow="Level 1"
        title="Divisions"
        icon={<DivisionIcon />}
        count={divisions.length}
        accentColor="cyan"
        searchPlaceholder="Search divisions…"
        addLabel="Add New Division"
        emptyText="No divisions found"
        items={divisions}
        isAdding={adding}
        onAddToggle={() => setAdding(true)}
        updateAction={updateAction}
        deleteAction={deleteAction}
        onSuccess={(msg) => show(msg, "success")}
        onError={(msg) => show(msg, "error")}
        addFormNode={
          <div className="rounded-2xl border border-cyan-100 bg-cyan-50 p-4">
            <p className="mb-3 text-xs font-bold tracking-widest text-cyan-700 uppercase">New Division</p>
            <NameForm
              action={createAction}
              submitLabel="Add Division"
              onDone={() => setAdding(false)}
              onSuccess={() => { setAdding(false); show("Division added.", "success"); }}
              onError={(msg) => show(msg, "error")}
            />
          </div>
        }
      />
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => {}} />}
    </>
  );
}

// ── District panel ────────────────────────────────────────────────────────────

export function DistrictPanel({ divisions, districts, createAction, updateAction, deleteAction }) {
  const [adding, setAdding] = useState(false);
  const [divisionId, setDivisionId] = useState(divisions[0]?.id ?? "");
  const { toast, show } = useToast();

  const filtered = districts.filter((d) => !divisionId || String(d.divisionId) === String(divisionId));

  const filterNode = (
    <div className="flex items-center gap-2">
      <label className="shrink-0 text-xs font-semibold text-slate-500">Division</label>
      <select
        value={divisionId}
        onChange={(e) => setDivisionId(e.target.value)}
        className="flex-1 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-900 outline-none focus:border-cyan-400 focus:ring-2 focus:ring-cyan-100"
      >
        <option value="">All Divisions</option>
        {divisions.map((d) => <option key={d.id} value={d.id}>{d.nameEn}</option>)}
      </select>
    </div>
  );

  return (
    <>
      <PanelShell
        eyebrow="Level 2"
        title="Districts"
        icon={<DistrictIcon />}
        count={districts.length}
        accentColor="violet"
        searchPlaceholder="Search districts…"
        addLabel="Add New District"
        emptyText="No districts found"
        items={filtered}
        isAdding={adding}
        onAddToggle={() => setAdding(true)}
        filterNode={filterNode}
        updateAction={updateAction}
        deleteAction={deleteAction}
        onSuccess={(msg) => show(msg, "success")}
        onError={(msg) => show(msg, "error")}
        addFormNode={
          <div className="rounded-2xl border border-violet-100 bg-violet-50 p-4">
            <p className="mb-3 text-xs font-bold tracking-widest text-violet-700 uppercase">New District</p>
            <div className="mb-3">
              <label className="mb-1.5 block text-xs font-semibold text-slate-500">Division <span className="text-red-500">*</span></label>
              <select
                id="new-district-division"
                defaultValue={divisionId || divisions[0]?.id}
                className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm outline-none focus:border-cyan-400"
                onChange={(e) => setDivisionId(e.target.value)}
              >
                {divisions.map((d) => <option key={d.id} value={d.id}>{d.nameEn}</option>)}
              </select>
            </div>
            <NameForm
              action={createAction}
              hiddenFields={[["divisionId", divisionId || divisions[0]?.id]]}
              submitLabel="Add District"
              onDone={() => setAdding(false)}
              onSuccess={() => { setAdding(false); show("District added.", "success"); }}
              onError={(msg) => show(msg, "error")}
            />
          </div>
        }
      />
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => {}} />}
    </>
  );
}

// ── Upazila panel ─────────────────────────────────────────────────────────────

export function UpazilaPanel({ districts, upazilas, createAction, updateAction, deleteAction }) {
  const [adding, setAdding] = useState(false);
  const [districtId, setDistrictId] = useState(districts[0]?.id ?? "");
  const { toast, show } = useToast();

  const filtered = upazilas.filter((u) => !districtId || String(u.districtId) === String(districtId));

  const filterNode = (
    <div className="flex items-center gap-2">
      <label className="shrink-0 text-xs font-semibold text-slate-500">District</label>
      <select
        value={districtId}
        onChange={(e) => setDistrictId(e.target.value)}
        className="flex-1 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-900 outline-none focus:border-cyan-400 focus:ring-2 focus:ring-cyan-100"
      >
        <option value="">All Districts</option>
        {districts.map((d) => <option key={d.id} value={d.id}>{d.nameEn}</option>)}
      </select>
    </div>
  );

  return (
    <>
      <PanelShell
        eyebrow="Level 3"
        title="Upazilas / Thanas"
        icon={<UpazilaIcon />}
        count={upazilas.length}
        accentColor="emerald"
        searchPlaceholder="Search upazilas…"
        addLabel="Add New Upazila"
        emptyText="No upazilas found"
        items={filtered}
        isAdding={adding}
        onAddToggle={() => setAdding(true)}
        filterNode={filterNode}
        updateAction={updateAction}
        deleteAction={deleteAction}
        onSuccess={(msg) => show(msg, "success")}
        onError={(msg) => show(msg, "error")}
        addFormNode={
          <div className="rounded-2xl border border-emerald-100 bg-emerald-50 p-4">
            <p className="mb-3 text-xs font-bold tracking-widest text-emerald-700 uppercase">New Upazila</p>
            <div className="mb-3">
              <label className="mb-1.5 block text-xs font-semibold text-slate-500">District <span className="text-red-500">*</span></label>
              <select
                defaultValue={districtId || districts[0]?.id}
                className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm outline-none focus:border-cyan-400"
                onChange={(e) => setDistrictId(e.target.value)}
              >
                {districts.map((d) => <option key={d.id} value={d.id}>{d.nameEn}</option>)}
              </select>
            </div>
            <NameForm
              action={createAction}
              hiddenFields={[["districtId", districtId || districts[0]?.id]]}
              submitLabel="Add Upazila"
              onDone={() => setAdding(false)}
              onSuccess={() => { setAdding(false); show("Upazila added.", "success"); }}
              onError={(msg) => show(msg, "error")}
            />
          </div>
        }
      />
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => {}} />}
    </>
  );
}
