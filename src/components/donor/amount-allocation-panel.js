"use client";

import Link from "next/link";
import { useEffect, useState, useTransition } from "react";
import { assignAmountAction, refreshAllocationDataAction, searchAllocationTargetsAction } from "@/app/doner/amount-allocation/actions";
import { ALLOCATION_FILTER_FIELDS, allocationFilterKey } from "@/lib/allocation-filters";

const EMPTY_FILTERS = { projectId: "", divisionId: "", districtId: "", upazilaId: "", unionParishadorPourashavaId: "", wardId: "", search: "" };
const inputClass = "h-12 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm font-medium text-slate-900 outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 disabled:cursor-not-allowed disabled:bg-slate-50 disabled:opacity-60";
const money = (amount) => Number(amount || 0).toLocaleString("en-BD", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
const filterKey = (filters) => allocationFilterKey(filters) + ":" + String(filters.search || "").trim();

function useLocationList(endpoint, parentKey, parentId) {
  const [state, setState] = useState({ key: "", items: [], loading: false, error: "" });
  const [version, setVersion] = useState(0);
  useEffect(() => {
    if (!parentId) return;
    let alive = true;
    const controller = new AbortController();
    const timer = window.setTimeout(() => controller.abort(), 30000);
    setState({ key: parentId, items: [], loading: true, error: "" });
    async function load() {
      try {
        const query = new URLSearchParams({ [parentKey]: parentId, activeOnly: "false" });
        const response = await fetch(`/api/locations/${endpoint}?${query}`, { signal: controller.signal, cache: "no-store" });
        const payload = await response.json();
        if (!response.ok) throw new Error(payload.message || "Unable to load locations.");
        if (!Array.isArray(payload)) throw new Error("The location list could not be read.");
        if (alive) setState({ key: parentId, items: payload.map((x) => ({ id: x.id ?? x.Id, nameEn: x.nameEn ?? x.NameEn ?? "", wardNo: x.wardNo ?? x.WardNo })), loading: false, error: "" });
      } catch (error) {
        if (alive) setState({ key: parentId, items: [], loading: false, error: error.name === "AbortError" ? "Location lookup timed out." : error.message });
      } finally { window.clearTimeout(timer); }
    }
    void load();
    return () => { alive = false; controller.abort(); window.clearTimeout(timer); };
  }, [endpoint, parentKey, parentId, version]);
  const current = parentId && state.key === parentId ? state : { items: [], loading: Boolean(parentId), error: "" };
  return { items: current.items, loading: current.loading, error: current.error, retry: () => setVersion((value) => value + 1) };
}

function FilterField({ label, name, value, onChange, items, required, disabled, placeholder, loading, error, retry, ward = false }) {
  return <div><label htmlFor={`allocation-${name}`} className="mb-2 block text-xs font-bold text-slate-600">{label}{required ? <span className="ml-1 text-rose-600">*</span> : <span className="ml-1 font-normal text-slate-400">(optional)</span>}</label>
    <select id={`allocation-${name}`} name={name} required={required} value={value} onChange={(event) => onChange(event.target.value)} disabled={disabled || loading || Boolean(error)} className={inputClass} aria-describedby={error ? `${name}-error` : undefined}>
      <option value="">{loading ? "Loading..." : placeholder}</option>
      {items.map((item) => <option key={item.id} value={item.id}>{ward && item.wardNo ? `Ward ${item.wardNo}${item.nameEn ? ` - ${item.nameEn}` : ""}` : item.projectTitleEn || item.nameEn}</option>)}
    </select>
    {error ? <p id={`${name}-error`} role="alert" className="mt-2 text-xs text-rose-700">{error} <button type="button" onClick={retry} className="font-bold underline">Retry</button></p> : null}
  </div>;
}

function SummaryCard({ label, amount, green = false }) {
  return <div className={`rounded-2xl border p-5 ${green ? "border-emerald-200 bg-emerald-50" : "border-slate-200 bg-white"}`}><p className="text-xs font-bold text-slate-500">{label}</p><p className={`mt-3 text-2xl font-black ${green ? "text-emerald-800" : "text-slate-900"}`}>BDT {money(amount)}</p></div>;
}

function AllocationRow({ item, type, payments, busy, onAllocate, feedback }) {
  const [paymentId, setPaymentId] = useState("");
  const [amount, setAmount] = useState("");
  const payment = payments.find((x) => String(x.id) === paymentId);
  useEffect(() => { if (paymentId && !payments.some((x) => String(x.id) === paymentId)) { setPaymentId(""); setAmount(""); } }, [paymentId, payments]);
  const beneficiary = type === "Beneficiary";
  const title = beneficiary ? item.fullName : item.nameEn;
  const id = `${type}-${item.id}`;
  return <li className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
    <div className="flex flex-wrap items-start justify-between gap-3"><div className="min-w-0 flex-1"><span className={`rounded-full px-2.5 py-1 text-[10px] font-bold ${beneficiary ? "bg-cyan-50 text-cyan-800" : "bg-emerald-50 text-emerald-800"}`}>{beneficiary ? "Approved beneficiary" : "Active project assistance"}</span>
      <h3 className="mt-3 break-words text-base font-black text-slate-900">{title}</h3>
      {beneficiary ? <><p className="mt-2 break-words text-xs leading-6 text-slate-500">{[item.ward, item.unionParishadorPourashava, item.upazila, item.district, item.division].filter(Boolean).join(", ")}</p>{item.assistanceType ? <p className="mt-1 text-xs font-semibold text-emerald-700">{item.assistanceType}</p> : null}</>
        : <><p className="mt-2 break-words text-xs text-slate-500">{item.donationCode} | {item.supportMode}</p>{item.descriptionEn ? <p className="mt-2 line-clamp-3 break-words text-sm leading-6 text-slate-500">{item.descriptionEn}</p> : null}
          <dl className="mt-4 grid grid-cols-1 gap-2 rounded-xl bg-slate-50 p-3 text-xs sm:grid-cols-3"><div><dt className="text-slate-500">Target</dt><dd className="mt-1 font-bold text-slate-800">BDT {money(item.targetAmount)}</dd></div><div><dt className="text-slate-500">Collected</dt><dd className="mt-1 font-bold text-slate-800">BDT {money(item.totalCollectedAmount)}</dd></div><div><dt className="text-slate-500">Allocated</dt><dd className="mt-1 font-bold text-emerald-800">BDT {money(item.allocatedAmount)}</dd></div></dl></>}
    </div>{beneficiary ? <Link href={`/doner/amount-allocation/${item.id}`} className="shrink-0 rounded-xl border border-slate-200 px-3 py-2 text-xs font-bold text-slate-600">View profile</Link> : null}</div>
    <form onSubmit={(event) => { event.preventDefault(); onAllocate(type, item.id, paymentId, amount); }} className="mt-5 grid gap-3 border-t border-slate-100 pt-4 sm:grid-cols-[minmax(0,1fr)_10rem_auto]">
      <div><label htmlFor={`${id}-payment`} className="mb-1.5 block text-xs font-bold text-slate-600">Available payment</label><select id={`${id}-payment`} required value={paymentId} disabled={busy || payments.length === 0} onChange={(event) => {
        setPaymentId(event.target.value); const selected = payments.find((x) => String(x.id) === event.target.value); setAmount(selected ? Number(selected.amount).toFixed(2) : "");
      }} className={inputClass}><option value="">{payments.length ? "Select payment" : "No available payment"}</option>{payments.map((x) => <option key={x.id} value={x.id}>{x.currency} {money(x.amount)} | {x.transactionId}</option>)}</select></div>
      <div><label htmlFor={`${id}-amount`} className="mb-1.5 block text-xs font-bold text-slate-600">Amount ({payment?.currency || "BDT"})</label><input id={`${id}-amount`} required type="number" inputMode="decimal" step="0.01" min="0.01" max={payment?.amount || undefined} value={amount} onChange={(event) => setAmount(event.target.value)} disabled={busy || !payment} className={inputClass} /></div>
      <button type="submit" disabled={busy || !payment || Number(amount) <= 0 || Number(amount) > payment.amount} className="h-12 self-end rounded-xl bg-emerald-800 px-5 text-sm font-bold text-white! hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-50">{busy ? "Please wait..." : "Allocate"}</button>
    </form>
    {payment ? <p className="mt-2 text-xs text-slate-500">Available in this payment: {payment.currency} {money(payment.amount)}. You can allocate all or part of it.</p> : null}
    {feedback ? <p role={feedback.success ? "status" : "alert"} className={`mt-3 rounded-xl border p-3 text-xs leading-6 ${feedback.success ? "border-emerald-200 bg-emerald-50 text-emerald-800" : "border-rose-200 bg-rose-50 text-rose-700"}`}>{feedback.message}</p> : null}
  </li>;
}

function ResultPagination({ page, onPage, busy, label }) {
  if (!page.totalCount) return null;
  return <nav aria-label={`${label} pagination`} className="flex flex-wrap items-center justify-between gap-3 pt-2"><p className="text-xs text-slate-500">{page.totalCount} results | Page {page.pageNumber} of {page.totalPages}</p><div className="flex gap-2"><button type="button" onClick={() => onPage(page.pageNumber - 1)} disabled={busy || !page.hasPreviousPage} className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-bold disabled:opacity-40">Previous</button><button type="button" onClick={() => onPage(page.pageNumber + 1)} disabled={busy || !page.hasNextPage} className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-bold disabled:opacity-40">Next</button></div></nav>;
}

function toFormData(filters) {
  const data = new FormData();
  for (const key of [...ALLOCATION_FILTER_FIELDS, "search", "beneficiaryPage", "assistancePage"]) data.set(key, String(filters[key] || ""));
  return data;
}

export function AmountAllocationPanel({ initialSummary, initialAssignablePayments = [], initialOptions }) {
  const [summary, setSummary] = useState(initialSummary);
  const [payments, setPayments] = useState(initialAssignablePayments);
  const [options, setOptions] = useState(initialOptions || { projects: [], divisions: [] });
  const [draft, setDraft] = useState(EMPTY_FILTERS);
  const [applied, setApplied] = useState(null);
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [feedbacks, setFeedbacks] = useState({});
  const [searching, startSearch] = useTransition();
  const [allocating, startAllocation] = useTransition();
  const [refreshing, startRefresh] = useTransition();
  const busy = searching || allocating || refreshing;
  const districts = useLocationList("districts", "divisionId", draft.divisionId);
  const upazilas = useLocationList("upazilas", "districtId", draft.districtId);
  const unions = useLocationList("local-governments", "upazilaId", draft.upazilaId);
  const wards = useLocationList("wards", "localGovernmentId", draft.unionParishadorPourashavaId);
  const changed = applied && filterKey(draft) !== filterKey(applied);
  useEffect(() => { setSummary(initialSummary); setPayments(initialAssignablePayments); }, [initialSummary, initialAssignablePayments]);

  function change(key, value) {
    const locationKeys = ["divisionId", "districtId", "upazilaId", "unionParishadorPourashavaId", "wardId"];
    setDraft((current) => {
      const next = { ...current, [key]: value }; const index = locationKeys.indexOf(key);
      if (index >= 0) for (const child of locationKeys.slice(index + 1)) next[child] = "";
      return next;
    });
  }
  function search(filters) {
    setError(""); setNotice("");
    startSearch(async () => {
      try {
        const response = await searchAllocationTargetsAction(toFormData(filters));
        if (!response.success) { setError(response.message); setResult(null); return; }
        setResult(response.result); setApplied({ ...filters, beneficiaryPage: response.result.beneficiaries.pageNumber, assistancePage: response.result.projectAssistances.pageNumber });
      } catch { setError("Unable to search. Check your connection and try again."); }
    });
  }
  function refresh() {
    setError("");
    startRefresh(async () => {
      try {
        const response = await refreshAllocationDataAction();
        if (!response.success) { setError(response.message); return; }
        setSummary(response.summary); setPayments(response.payments); setOptions(response.options); setNotice("Available payments and filters refreshed.");
        if (draft.projectId && !response.options.projects.some((x) => String(x.id) === draft.projectId)) change("projectId", "");
      } catch { setError("Unable to refresh payments. Check your connection and try again."); }
    });
  }
  function allocate(type, id, paymentId, amount) {
    if (!applied || changed || busy) return;
    const key = `${type}-${id}`;
    setFeedbacks((current) => ({ ...current, [key]: null }));
    startAllocation(async () => {
      try {
        const data = toFormData(applied); data.set(type === "Beneficiary" ? "beneficiaryProfileId" : "projectAssistanceId", String(id)); data.set("paymentHistoryId", paymentId); data.set("amount", amount);
        const response = await assignAmountAction(data);
        setFeedbacks((current) => ({ ...current, [key]: response }));
        if (!response.success) return;
        setSummary(response.summary);
        setPayments((current) => response.payments || current.filter((x) => String(x.id) !== paymentId));
        if (response.warning) setNotice(response.warning);
        if (type === "ProjectAssistance") setResult((current) => ({ ...current, projectAssistances: { ...current.projectAssistances,
          items: current.projectAssistances.items.map((item) => item.id === id ? { ...item, allocatedAmount: item.allocatedAmount + Number(response.assignment?.assignedAmount || amount) } : item) } }));
      } catch { setFeedbacks((current) => ({ ...current, [key]: { success: false, message: "Unable to allocate. Check your connection and refresh payments before retrying." } })); }
    });
  }

  return <div className="space-y-6">
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4"><SummaryCard label="Total payments" amount={summary.totalPaymentAmount} /><SummaryCard label="Completed allocations" amount={summary.totalApprovedAmount} green /><SummaryCard label="Awaiting allocation review" amount={summary.totalPendingAmount} /><SummaryCard label="Available to allocate" amount={summary.totalAvailableAmount} green /></div>
    <section className="rounded-3xl border border-emerald-100 bg-white p-5 shadow-sm sm:p-7">
      <div className="flex flex-wrap items-start justify-between gap-4"><div><p className="text-xs font-bold uppercase tracking-widest text-emerald-700">Amount allocation</p><h2 className="mt-2 text-xl font-black text-slate-950">Find a project and community to support</h2><p className="mt-2 max-w-2xl text-sm leading-7 text-slate-500">Select a Project and Division, then search for approved beneficiaries and active project assistance. Other location fields are optional.</p></div><button type="button" onClick={refresh} disabled={busy} className="rounded-xl border border-emerald-200 px-4 py-2.5 text-xs font-bold text-emerald-800 disabled:opacity-50">{refreshing ? "Refreshing..." : "Refresh payments & filters"}</button></div>
      <form onSubmit={(event) => { event.preventDefault(); search({ ...draft, beneficiaryPage: 1, assistancePage: 1 }); }} className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        <FilterField label="Project" name="projectId" required value={draft.projectId} onChange={(value) => change("projectId", value)} items={options.projects} disabled={busy || !options.projects.length} placeholder="Select active project" />
        <FilterField label="Division" name="divisionId" required value={draft.divisionId} onChange={(value) => change("divisionId", value)} items={options.divisions} disabled={busy || !options.divisions.length} placeholder="Select division" />
        <FilterField label="District" name="districtId" value={draft.districtId} onChange={(value) => change("districtId", value)} {...districts} disabled={busy || !draft.divisionId} placeholder={draft.divisionId ? "All districts" : "Select division first"} />
        <FilterField label="Upazila" name="upazilaId" value={draft.upazilaId} onChange={(value) => change("upazilaId", value)} {...upazilas} disabled={busy || !draft.districtId} placeholder={draft.districtId ? "All upazilas" : "Select district first"} />
        <FilterField label="Union / Pourashava" name="unionParishadorPourashavaId" value={draft.unionParishadorPourashavaId} onChange={(value) => change("unionParishadorPourashavaId", value)} {...unions} disabled={busy || !draft.upazilaId} placeholder={draft.upazilaId ? "All unions / pourashavas" : "Select upazila first"} />
        <FilterField label="Ward" name="wardId" value={draft.wardId} onChange={(value) => change("wardId", value)} {...wards} disabled={busy || !draft.unionParishadorPourashavaId} placeholder={draft.unionParishadorPourashavaId ? "All wards" : "Select union first"} ward />
        <div className="sm:col-span-2"><label htmlFor="allocation-search" className="mb-2 block text-xs font-bold text-slate-600">Search name, mobile, NID or assistance code (optional)</label><input id="allocation-search" type="search" maxLength={100} value={draft.search} onChange={(event) => change("search", event.target.value)} disabled={busy} placeholder="Search within the selected project and location" className={inputClass} /></div>
        <button type="submit" disabled={busy || !draft.projectId || !draft.divisionId} className="h-12 self-end rounded-xl bg-emerald-800 px-5 text-sm font-bold text-white! hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-50">{searching ? "Searching..." : "Search"}</button>
      </form>
      {!options.projects.length ? <p className="mt-4 text-sm text-amber-700">No active projects are available. Refresh filters or contact the foundation team.</p> : null}
      <p className="mt-4 text-xs leading-6 text-slate-500">Only approved, unallocated payments can be used. Allocations are sent for administrator review.</p>
    </section>
    {error ? <p role="alert" className="rounded-2xl border border-rose-200 bg-rose-50 p-4 text-sm text-rose-700">{error}</p> : null}
    {notice ? <p role="status" className="rounded-2xl border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-800">{notice}</p> : null}
    {changed ? <p role="status" className="rounded-2xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-800">Filters changed. Click Search to load matching beneficiaries and project assistance.</p> : null}
    {!applied && !searching && !error ? <div className="rounded-2xl border border-dashed border-emerald-200 bg-emerald-50/40 p-8 text-center text-sm text-slate-500">Choose a Project and Division, then click Search to see allocation options.</div> : null}
    {result && !changed ? <div className="space-y-7"><div className="flex flex-wrap items-center gap-3"><h2 className="text-lg font-black text-slate-900">{result.project.projectTitleEn}</h2><span className="text-xs font-semibold text-emerald-700">Beneficiaries: {result.beneficiaries.totalCount} | Project assistance: {result.projectAssistances.totalCount}</span></div>
      {[{ type: "ProjectAssistance", title: "Project assistance", page: result.projectAssistances, pageKey: "assistancePage", empty: "No active project assistance matches this project and location." }, { type: "Beneficiary", title: "Approved beneficiaries", page: result.beneficiaries, pageKey: "beneficiaryPage", empty: "No approved beneficiaries match this project and location." }].map((section) => <section key={section.type} aria-label={section.title} className="space-y-4"><div className="flex items-center gap-3"><h2 className="text-lg font-black text-slate-900">{section.title}</h2><span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-bold text-emerald-800">{section.page.totalCount}</span></div>
        {section.page.items.length ? <ul className="space-y-4">{section.page.items.map((item) => <AllocationRow key={`${section.type}-${item.id}`} item={item} type={section.type} payments={payments} busy={busy} onAllocate={allocate} feedback={feedbacks[`${section.type}-${item.id}`]} />)}</ul> : <p className="rounded-2xl border border-dashed border-slate-200 bg-white p-7 text-center text-sm text-slate-500">{section.empty}</p>}
        <ResultPagination page={section.page} label={section.title} busy={busy} onPage={(page) => search({ ...applied, [section.pageKey]: page })} />
      </section>)}
    </div> : null}
  </div>;
}
