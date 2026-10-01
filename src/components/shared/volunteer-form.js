"use client";

import { useEffect, useId, useState } from "react";
import { volunteerCopy, volunteerPayload } from "@/lib/volunteer-registration";

const fields = [
  ["divisionId", "divisions", null, "division"],
  ["districtId", "districts", "divisionId", "district"],
  ["upazilaId", "upazilas", "districtId", "upazila"],
  ["localGovernmentId", "local-governments", "upazilaId", "localGovernment"],
  ["wardId", "wards", "localGovernmentId", "ward"],
];
const inputClass = "mt-2 w-full rounded-xl border border-slate-300 bg-white px-3 py-3 text-sm text-slate-900 outline-none focus:border-cyan-600 focus:ring-2 focus:ring-cyan-100 disabled:bg-slate-100 disabled:text-slate-500";

function LocationSelect({ field, values, initial, onChange, copy, locale, prefix }) {
  const [key, endpoint, parent, nameKey] = field;
  const parentId = parent ? values[parent] : "root";
  const [state, setState] = useState({ url: "", items: [], error: false });
  const [attempt, setAttempt] = useState(0);
  const url = parentId ? `/api/locations/${endpoint}${parent ? `?${parent}=${encodeURIComponent(parentId)}` : ""}` : "";
  useEffect(() => {
    if (!url) return;
    const controller = new AbortController();
    fetch(url, { signal: controller.signal }).then(async (response) => {
      const data = await response.json();
      if (!response.ok || !Array.isArray(data)) throw new Error("Locations unavailable");
      if (!controller.signal.aborted) setState({ url, items: data, error: false });
    }).catch(() => {
      if (!controller.signal.aborted) setState({ url, items: [], error: true });
    });
    return () => controller.abort();
  }, [url, attempt]);
  const loaded = state.url === url;
  const items = loaded ? state.items : [];
  const currentMissing = values[key] && !items.some((item) => String(item.id ?? item.Id) === String(values[key]));
  return (
    <div>
      <label htmlFor={`${prefix}-${key}`} className="text-sm font-semibold text-slate-700">{copy[key]} <span aria-hidden="true">*</span></label>
      <select id={`${prefix}-${key}`} name={key} value={values[key] || ""} required className={inputClass}
        disabled={!parentId || !loaded || state.error} onChange={(event) => onChange(key, event.target.value)}>
        <option value="">{url && !loaded ? copy.loading : `${copy.choose} — ${copy[key]}`}</option>
        {currentMissing && initial?.[key] === Number(values[key]) ? <option value={values[key]}>{initial[nameKey]}</option> : null}
        {items.map((item) => {
          const id = item.id ?? item.Id;
          const label = locale === "BN" ? (item.nameBn ?? item.NameBn) : locale === "DK" ? (item.nameDk ?? item.NameDk) : null;
          return <option key={id} value={id}>{label || item.nameEn || item.NameEn}</option>;
        })}
      </select>
      {url && loaded && state.error ? <p className="mt-2 text-sm text-red-700" role="alert">{copy.loadError} <button type="button" className="font-semibold underline" onClick={() => { setState({ url: "", items: [], error: false }); setAttempt(attempt + 1); }}>{copy.retry}</button></p> : null}
      {url && loaded && !state.error && !items.length && !values[key] ? <p className="mt-2 text-sm text-amber-700">{copy.empty}</p> : null}
    </div>
  );
}

export function VolunteerForm({ initial, locale = "EN", onSave, onCancel, onSuccess }) {
  const copy = volunteerCopy[locale] || volunteerCopy.EN;
  const prefix = useId();
  const [values, setValues] = useState(() => Object.fromEntries(fields.map(([key]) => [key, initial?.[key] || ""])));
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  function changeLocation(key, value) {
    const index = fields.findIndex(([name]) => name === key);
    setValues((previous) => ({ ...previous, [key]: value,
      ...Object.fromEntries(fields.slice(index + 1).map(([name]) => [name, ""])) }));
  }

  async function submit(event) {
    event.preventDefault();
    if (busy) return;
    const payload = volunteerPayload({ ...Object.fromEntries(new FormData(event.currentTarget)), ...values });
    setBusy(true); setError("");
    try {
      if (fields.some(([key]) => !payload[key])) throw new Error("Please select your complete location.");
      if (onSave) {
        const result = await onSave(payload);
        if (!result.ok) throw new Error(result.message);
      } else {
        const response = await fetch("/api/volunteers/register", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) });
        const result = await response.json();
        if (!response.ok) throw new Error(result.message || "Unable to submit registration.");
      }
      onSuccess?.();
    } catch (err) { setError(err.message || "Unable to save. Please try again."); }
    finally { setBusy(false); }
  }

  return (
    <form onSubmit={submit} className="space-y-7">
      {error ? <p role="alert" className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">{error}</p> : null}
      <fieldset disabled={busy} className="space-y-5">
        <legend className="mb-4 text-lg font-bold text-slate-900">{copy.personal}</legend>
        <div className="grid gap-5 sm:grid-cols-2">
          {[["name", "text", 150, "name"], ["phone", "tel", 30, "tel"], ["email", "email", 200, "email"], ["profession", "text", 150, "organization-title"]].map(([key, type, max, autoComplete]) => (
            <div key={key}>
              <label htmlFor={`${prefix}-${key}`} className="text-sm font-semibold text-slate-700">{copy[key]} <span aria-hidden="true">*</span></label>
              <input id={`${prefix}-${key}`} name={key} type={type} maxLength={max} required autoComplete={autoComplete}
                defaultValue={initial?.[key] || ""} className={inputClass} aria-describedby={key === "phone" ? `${prefix}-phone-hint` : undefined} />
              {key === "phone" ? <p id={`${prefix}-phone-hint`} className="mt-1.5 text-xs text-slate-500">{copy.phoneHint}</p> : null}
            </div>
          ))}
        </div>
      </fieldset>
      <fieldset disabled={busy}>
        <legend className="mb-4 text-lg font-bold text-slate-900">{copy.location}</legend>
        <div className="grid gap-5 sm:grid-cols-2">
          {fields.map((field) => <LocationSelect key={field[0]} field={field} values={values} initial={initial} onChange={changeLocation} copy={copy} locale={locale} prefix={prefix} />)}
        </div>
      </fieldset>
      <div className="flex flex-wrap gap-3">
        <button type="submit" disabled={busy || fields.some(([key]) => !values[key])} className="rounded-full bg-cyan-700 px-6 py-3 text-sm font-bold text-white! transition hover:bg-cyan-800 disabled:cursor-not-allowed disabled:opacity-50">{busy ? copy.saving : initial ? copy.save : copy.submit}</button>
        {onCancel ? <button type="button" disabled={busy} onClick={onCancel} className="rounded-full border border-slate-300 px-6 py-3 text-sm font-semibold">{copy.cancel}</button> : null}
      </div>
    </form>
  );
}
