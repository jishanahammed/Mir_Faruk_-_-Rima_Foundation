"use client";

import { useActionState, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { saveVoucherSettingAction } from "@/app/admin/voucher-settings/actions";

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

function NumberField({ name, label, defaultValue, hint, required = false }) {
  return (
    <label className="block">
      <FieldLabel required={required}>{label}</FieldLabel>
      <input
        name={name}
        type="number"
        min="0"
        step="1"
        required={required}
        defaultValue={defaultValue || ""}
        placeholder="0"
        className={`${inputClass} tabular-nums`}
      />
      {hint ? <span className="mt-1.5 block text-[0.68rem] leading-4 text-slate-400">{hint}</span> : null}
    </label>
  );
}

/**
 * Add or edit one voucher type.
 *
 * Mounted with a key tied to the row, so switching rows resets the uncontrolled
 * inputs instead of showing the previous row's values.
 */
function VoucherForm({ setting, purposes, onDone }) {
  const isEdit = Boolean(setting);
  const [state, formAction, pending] = useActionState(saveVoucherSettingAction, null);

  const available = purposes.filter((p) => !p.isConfigured);
  const [selectedPurpose, setSelectedPurpose] = useState(
    isEdit ? setting.purpose : available[0]?.purpose ?? "",
  );
  const selected = purposes.find((p) => p.purpose === selectedPurpose);

  useEffect(() => {
    if (state?.success) onDone();
  }, [state, onDone]);

  if (!isEdit && available.length === 0) {
    return (
      <p className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-600">
        Every voucher purpose is already configured. Edit an existing row to change it.
      </p>
    );
  }

  return (
    <form action={formAction} className="flex flex-col gap-5">
      {isEdit ? <input type="hidden" name="id" value={setting.id} /> : null}

      <div className="grid gap-4 md:grid-cols-2">
        <label className="block">
          <FieldLabel required>Used for</FieldLabel>
          {isEdit ? (
            // The purpose is the row's identity: changing it would repoint a
            // flow at different values, so it is fixed after creation.
            <>
              <input type="hidden" name="purpose" value={setting.purpose} />
              <p className="flex h-11 items-center rounded-xl border border-slate-200 bg-slate-100 px-3 text-sm text-slate-600">
                {setting.purposeName || setting.purpose}
              </p>
            </>
          ) : (
            <select
              name="purpose"
              required
              value={selectedPurpose}
              onChange={(event) => setSelectedPurpose(event.target.value)}
              className={inputClass}
            >
              {available.map((p) => (
                <option key={p.purpose} value={p.purpose}>
                  {p.displayName}
                </option>
              ))}
            </select>
          )}
          {selected?.description ? (
            <span className="mt-1.5 block text-[0.68rem] leading-4 text-slate-400">
              {selected.description}
            </span>
          ) : null}
        </label>

        <NumberField
          name="receiptVoucherTypeId"
          label="Voucher Type Id"
          required
          defaultValue={setting?.receiptVoucherTypeId}
          hint="The voucher type id in the accounting system."
        />
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <label className="block">
          <FieldLabel>Voucher Type Name</FieldLabel>
          <input
            name="receiptVoucherTypeName"
            type="text"
            maxLength={100}
            defaultValue={setting?.receiptVoucherTypeName ?? ""}
            placeholder={selected?.purpose === "Payment" ? "PaymentVoucher" : "ReceiptVoucher"}
            className={inputClass}
          />
        </label>

        <label className="block">
          <FieldLabel>Voucher No Prefix</FieldLabel>
          <input
            name="voucherNoPrefix"
            type="text"
            maxLength={50}
            defaultValue={setting?.voucherNoPrefix ?? selected?.defaultPrefix ?? ""}
            placeholder={selected?.defaultPrefix ?? "Plan365-RV"}
            className={`${inputClass} font-mono`}
          />
          <span className="mt-1.5 block text-[0.68rem] leading-4 text-slate-400">
            Year and sequence are added automatically, e.g.{" "}
            <span className="font-mono text-slate-500">
              {(setting?.voucherNoPrefix || selected?.defaultPrefix || "Plan365-RV") + "2026/004"}
            </span>
            .
          </span>
        </label>
      </div>

      <div>
        <p className="mb-3 text-xs font-bold uppercase tracking-[0.14em] text-slate-400">
          Header ids
        </p>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <NumberField name="fiscalYearId" label="Fiscal Year Id" defaultValue={setting?.fiscalYearId} />
          <NumberField name="taxYearId" label="Tax Year Id" defaultValue={setting?.taxYearId} />
          <NumberField name="companyId" label="Company Id" defaultValue={setting?.companyId} />
          <NumberField name="fundSourceId" label="Fund Source Id" defaultValue={setting?.fundSourceId} />
          <NumberField
            name="projectId"
            label="Project Id"
            defaultValue={setting?.projectId}
            hint="Leave 0 to omit it from the voucher."
          />
        </div>
      </div>

      <label className="flex items-center gap-2.5">
        <input
          name="isActive"
          type="checkbox"
          defaultChecked={setting ? setting.isActive : true}
          className="h-4 w-4 rounded border-slate-300 text-cyan-600 focus:ring-cyan-200"
        />
        <span className="text-sm text-slate-700">
          Active
          <span className="ml-1 text-xs text-slate-400">
            &mdash; when off, the configured defaults are used instead
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
          className="inline-flex h-11 items-center rounded-xl bg-[linear-gradient(135deg,#0f766e,#0891b2)] px-6 text-sm font-semibold !text-white shadow-lg shadow-cyan-200/70 transition hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-70"
        >
          {pending ? "Saving..." : isEdit ? "Save changes" : "Add voucher type"}
        </button>
      </div>
    </form>
  );
}

export function VoucherSettingFormPanel({ setting, purposes, isOpen }) {
  const router = useRouter();

  function close() {
    router.push("/admin/voucher-settings");
  }

  if (!isOpen) {
    return (
      <div className="flex justify-end">
        <button
          type="button"
          onClick={() => router.push("/admin/voucher-settings?add=1")}
          className="inline-flex h-11 items-center rounded-xl bg-[linear-gradient(135deg,#0f766e,#0891b2)] px-5 text-sm font-semibold !text-white shadow-lg shadow-cyan-200/70 transition hover:-translate-y-0.5"
        >
          Add voucher type
        </button>
      </div>
    );
  }

  return (
    <section className="rounded-[24px] border border-cyan-100 bg-white p-5 shadow-sm sm:p-6">
      <h2 className="mb-4 text-base font-bold text-slate-900">
        {setting ? "Edit voucher type" : "Add voucher type"}
      </h2>
      {/* Remounts per row so the form never shows a previous row's values. */}
      <VoucherForm
        key={setting ? `edit-${setting.id}` : "add"}
        setting={setting}
        purposes={purposes}
        onDone={close}
      />
    </section>
  );
}
