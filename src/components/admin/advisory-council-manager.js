"use client";

import { useEffect, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { deleteAdvisoryCouncil } from "@/app/admin/advisory-council/actions";

const MAX_IMAGE_SIZE = 5 * 1024 * 1024;
const inputClass = "mt-1.5 w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-sm text-slate-900 outline-none transition focus:border-cyan-500 focus:ring-2 focus:ring-cyan-100";
const fields = [
  { name: "name", label: "Name", required: true, maxLength: 150 },
  { name: "designation", label: "Designation", required: true, maxLength: 200 },
  { name: "phoneNumber", label: "Phone Number", type: "tel", maxLength: 30 },
  { name: "emailAddress", label: "Email Address", type: "email", maxLength: 254 },
];

function MemberImage({ member, size = "h-11 w-11" }) {
  return member?.imageUrl ? (
    <img src={member.imageUrl} alt="" className={`${size} rounded-xl object-cover`} />
  ) : (
    <div className={`${size} flex items-center justify-center rounded-xl bg-cyan-50 text-sm font-bold text-cyan-700`}>
      {member?.name?.slice(0, 1).toUpperCase() || "?"}
    </div>
  );
}

export function AdvisoryCouncilManager({ members, loadError }) {
  const router = useRouter();
  const [selected, setSelected] = useState(null);
  const [search, setSearch] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [imagePreview, setImagePreview] = useState("");
  const [pending, startTransition] = useTransition();

  useEffect(() => () => {
    if (imagePreview) URL.revokeObjectURL(imagePreview);
  }, [imagePreview]);

  const filtered = members.filter((member) =>
    `${member.name} ${member.designation} ${member.objective} ${member.description} ${member.phoneNumber} ${member.emailAddress}`.toLowerCase().includes(search.toLowerCase()),
  );

  function beginEdit(member) {
    setSelected(member);
    setError("");
    setSuccess("");
    setImagePreview("");
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function submit(event) {
    event.preventDefault();
    const form = event.currentTarget;
    const data = new FormData(form);
    const image = data.get("image");
    if (image instanceof File && image.size > MAX_IMAGE_SIZE) {
      setError("The image must be 5 MB or smaller.");
      return;
    }
    setError("");
    setSuccess("");
    startTransition(async () => {
      try {
        const response = await fetch("/api/advisory-council", { method: "POST", body: data });
        const result = await response.json().catch(() => null);
        if (!response.ok || !result?.success) {
          setError(result?.error || (response.status === 413
            ? "The image must be 5 MB or smaller."
            : "Could not save the council member. Please try again."));
          return;
        }
        setSelected(null);
        setImagePreview("");
        form.reset();
        setSuccess(data.get("id") ? "Council member updated." : "Council member added.");
        router.refresh();
      } catch {
        setError("Could not save the council member. Please try again.");
      }
    });
  }

  function remove(member) {
    if (!window.confirm(`Delete ${member.name} from the Advisory Council?`)) return;
    setError("");
    setSuccess("");
    startTransition(async () => {
      const result = await deleteAdvisoryCouncil(Number(member.id));
      if (!result.success) return setError(result.error);
      if (selected?.id === member.id) setSelected(null);
      setSuccess("Council member deleted.");
      router.refresh();
    });
  }

  return (
    <div className="space-y-5">
      <div className="rounded-[24px] border border-cyan-100 bg-white p-6 shadow-sm">
        <p className="text-xs font-bold uppercase tracking-[0.2em] text-cyan-700">Organization</p>
        <h1 className="mt-1 text-2xl font-bold text-slate-950">Advisory Council</h1>
        <p className="mt-1 text-sm text-slate-500">Manage council profiles, contact details, images, and display order.</p>
      </div>

      {(loadError || error || success) && (
        <div role="status" className={`rounded-2xl border px-5 py-3 text-sm ${loadError || error ? "border-red-200 bg-red-50 text-red-700" : "border-emerald-200 bg-emerald-50 text-emerald-700"}`}>
          {loadError || error || success}
        </div>
      )}

      <div className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_390px]">
        <section className="min-w-0 rounded-[24px] border border-slate-200 bg-white shadow-sm">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 p-5">
            <div>
              <h2 className="font-bold text-slate-950">Council members</h2>
              <p className="text-xs text-slate-500">{members.length} total members</p>
            </div>
            <input aria-label="Search council members" value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search members..." className="rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none focus:border-cyan-500" />
          </div>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[650px] text-left text-sm">
              <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
                <tr><th className="px-5 py-3">Member</th><th className="px-4 py-3">Contact</th><th className="px-4 py-3">Order</th><th className="px-5 py-3 text-right">Actions</th></tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filtered.map((member) => (
                  <tr key={member.id} className="align-top">
                    <td className="px-5 py-4"><div className="flex items-start gap-3"><MemberImage member={member} /><div><p className="font-semibold text-slate-900">{member.name}</p><p className="text-slate-500">{member.designation}</p><p className="mt-1 max-w-[260px] text-xs text-slate-500">{member.objective}</p>{member.description && <p className="mt-1 max-w-[260px] text-xs text-slate-400">{member.description}</p>}</div></div></td>
                    <td className="px-4 py-4 text-slate-600"><p>{member.phoneNumber || "—"}</p><p className="break-all text-xs">{member.emailAddress || ""}</p></td>
                    <td className="px-4 py-4 font-medium text-slate-600">{member.orderNo}</td>
                    <td className="px-5 py-4"><div className="flex justify-end gap-2"><button type="button" disabled={pending} onClick={() => beginEdit(member)} className="rounded-lg border border-cyan-200 px-3 py-1.5 font-semibold text-cyan-700 hover:bg-cyan-50 disabled:opacity-50">Edit</button><button type="button" disabled={pending} onClick={() => remove(member)} className="rounded-lg border border-red-200 px-3 py-1.5 font-semibold text-red-700 hover:bg-red-50 disabled:opacity-50">Delete</button></div></td>
                  </tr>
                ))}
              </tbody>
            </table>
            {!filtered.length && <p className="p-8 text-center text-sm text-slate-500">{search ? "No members match your search." : "No council members yet. Add the first member using the form."}</p>}
          </div>
        </section>

        <section className="h-fit rounded-[24px] border border-slate-200 bg-white p-5 shadow-sm">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="font-bold text-slate-950">{selected ? "Edit council member" : "Add council member"}</h2>
            {selected && <button type="button" onClick={() => { setSelected(null); setImagePreview(""); setError(""); }} className="text-sm font-semibold text-cyan-700">Cancel edit</button>}
          </div>
          <form key={selected?.id ?? "new"} onSubmit={submit} className="space-y-4">
            <input type="hidden" name="id" value={selected?.id ?? ""} />
            {fields.map((field) => <label key={field.name} className="block text-xs font-semibold text-slate-600">{field.label}{field.required && <span className="text-red-600"> *</span>}<input className={inputClass} name={field.name} type={field.type ?? "text"} maxLength={field.maxLength} required={field.required} defaultValue={selected?.[field.name] ?? ""} /></label>)}
            <label className="block text-xs font-semibold text-slate-600">Objective <span className="text-red-600">*</span><textarea className={inputClass} name="objective" rows={3} maxLength={1000} required defaultValue={selected?.objective ?? ""} /></label>
            <label className="block text-xs font-semibold text-slate-600">Description<textarea className={inputClass} name="description" rows={4} maxLength={4000} defaultValue={selected?.description ?? ""} /></label>
            <label className="block text-xs font-semibold text-slate-600">Order number<input className={inputClass} name="orderNo" type="number" min="0" step="1" required defaultValue={selected?.orderNo ?? 0} /></label>
            <label className="block text-xs font-semibold text-slate-600">Profile image<input className={inputClass} name="image" type="file" accept="image/jpeg,image/png,image/webp" onChange={(event) => {
              const file = event.target.files?.[0];
              if (file && file.size > MAX_IMAGE_SIZE) {
                event.target.value = "";
                setImagePreview("");
                setError("The image must be 5 MB or smaller.");
                return;
              }
              setError("");
              setImagePreview(file ? URL.createObjectURL(file) : "");
            }} /><span className="mt-1 block font-normal text-slate-500">JPG, PNG, or WebP. Maximum 5 MB. Leave empty to keep the current image.</span></label>
            {(imagePreview || selected?.imageUrl) && <img src={imagePreview || selected.imageUrl} alt="Profile preview" className="h-28 w-28 rounded-xl border border-slate-200 object-cover" />}
            <button type="submit" disabled={pending} className="w-full rounded-xl bg-cyan-700 px-4 py-3 text-sm font-bold text-white hover:bg-cyan-800 disabled:opacity-50">{pending ? "Saving..." : selected ? "Save changes" : "Add member"}</button>
          </form>
        </section>
      </div>
    </div>
  );
}
