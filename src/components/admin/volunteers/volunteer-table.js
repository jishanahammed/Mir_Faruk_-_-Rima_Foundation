"use client";

import { useRef, useState, useTransition } from "react";
import { VolunteerForm } from "@/components/shared/volunteer-form";
import { createVolunteerAction, deleteVolunteerAction, saveVolunteerAction, setVolunteerStatusAction } from "@/app/admin/volunteers/actions";

const buttonClass = "rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 disabled:opacity-50";

function AssignedPassword({ item }) {
  const [visible, setVisible] = useState(false);
  if (!item.plainPassword) return <span className="text-xs text-slate-400">{item.userId ? "Not recorded" : "No account"}</span>;
  return <div className="max-w-48 space-y-2"><span className="block break-all font-mono text-xs text-slate-700">{visible ? item.plainPassword : "••••••••"}</span><button type="button" className={buttonClass} aria-label={`${visible ? "Hide" : "Show"} password for ${item.name}`} aria-pressed={visible} onClick={() => setVisible((value) => !value)}>{visible ? "Hide" : "Show"}</button></div>;
}

export function VolunteerTable({ items }) {
  const [editing, setEditing] = useState(null);
  const [deleting, setDeleting] = useState(null);
  const [message, setMessage] = useState(null);
  const [pending, startTransition] = useTransition();
  const editorRef = useRef(null);

  function openEditor(item) {
    setEditing(item); setMessage(null); setDeleting(null);
    setTimeout(() => { editorRef.current?.focus(); editorRef.current?.scrollIntoView({ behavior: "smooth", block: "start" }); }, 0);
  }

  function run(action, success) {
    setMessage(null);
    startTransition(async () => {
      try {
        const result = await action();
        setMessage({ error: !result.ok, text: result.ok ? success : result.message });
        if (result.ok) setDeleting(null);
      } catch { setMessage({ error: true, text: "Unable to save the change. Please try again." }); }
    });
  }

  return (
    <div className="space-y-5">
      <div className="flex justify-end"><button type="button" disabled={pending || !!editing} onClick={() => openEditor({})} className="rounded-xl bg-cyan-700 px-5 py-3 text-sm font-semibold text-white! disabled:opacity-50">Add volunteer</button></div>
      {message ? <p role={message.error ? "alert" : "status"} className={`rounded-xl border p-4 text-sm ${message.error ? "border-red-200 bg-red-50 text-red-700" : "border-emerald-200 bg-emerald-50 text-emerald-800"}`}>{message.text}</p> : null}
      {editing ? <section ref={editorRef} tabIndex={-1} aria-labelledby="volunteer-editor-title" className="rounded-2xl border border-cyan-200 bg-white p-5 sm:p-7">
        <h2 id="volunteer-editor-title" className="mb-6 text-xl font-bold text-slate-900">{editing.id ? `Edit volunteer: ${editing.name}` : "Add volunteer"}</h2>
        <VolunteerForm key={editing.id ?? "new"} initial={editing.id ? editing : undefined} manageAccount onSave={(payload) => editing.id ? saveVolunteerAction(editing.id, payload) : createVolunteerAction(payload)}
          onCancel={() => setEditing(null)} onSuccess={() => { setEditing(null); setMessage({ text: editing.id ? "Volunteer details updated." : "Volunteer added successfully." }); }} />
      </section> : null}
      <div className="overflow-x-auto rounded-2xl border border-slate-200 bg-white">
        <table className="w-full min-w-[950px] text-left text-sm">
          <caption className="sr-only">Volunteer registrations, contact information, locations and approval status</caption>
          <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500"><tr>
            {["Volunteer", "Contact", "Location", "Leader / Account", "Assigned password", "Approval", "Active status", "Actions"].map((label) => <th scope="col" key={label} className="px-5 py-4">{label}</th>)}
          </tr></thead>
          <tbody className="divide-y divide-slate-100">
            {items.length ? items.map((item) => <tr key={item.id} className="align-top">
              <td className="px-5 py-5"><p className="font-semibold text-slate-900">{item.name}</p><p className="mt-1 text-slate-500">{item.profession}</p><p className="mt-2 text-xs text-slate-400">Registered {item.createdAt ? new Date(item.createdAt).toLocaleDateString("en-GB", { timeZone: "Asia/Dhaka" }) : "—"}</p></td>
              <td className="px-5 py-5"><a href={`tel:${item.phone}`} className="block text-cyan-800 hover:underline">{item.phone}</a><a href={`mailto:${item.email}`} className="mt-1 block break-all text-slate-600 hover:underline">{item.email}</a></td>
              <td className="px-5 py-5 text-slate-600"><p>{item.division} / {item.district}</p><p className="mt-1">{item.upazila}</p><p className="mt-1 text-xs">{item.localGovernment} / {item.ward}</p></td>
              <td className="px-5 py-5"><span className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${item.isLeader ? "bg-cyan-50 text-cyan-800" : "bg-slate-100 text-slate-600"}`}>{item.isLeader ? "Leader" : "Volunteer"}</span><p className="mt-2 text-xs text-slate-500">{item.userId ? item.isLeader ? "Login account linked" : "Portal access removed" : "No login account"}</p></td>
              <td className="px-5 py-5"><AssignedPassword key={item.plainPassword || "empty"} item={item} /></td>
              <td className="px-5 py-5"><span className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${item.isApprove ? "bg-emerald-50 text-emerald-700" : "bg-amber-50 text-amber-800"}`}>{item.isApprove ? "Approved" : "Pending"}</span><button type="button" disabled={pending || !!editing} className={`${buttonClass} mt-3 block`} onClick={() => run(() => setVolunteerStatusAction(item.id, "isApprove", !item.isApprove), item.isApprove ? "Approval removed." : "Volunteer approved.")}>{item.isApprove ? "Remove approval" : "Approve"}</button></td>
              <td className="px-5 py-5"><span className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${item.isActive ? "bg-cyan-50 text-cyan-800" : "bg-slate-100 text-slate-600"}`}>{item.isActive ? "Active" : "Inactive"}</span><button type="button" disabled={pending || !!editing} className={`${buttonClass} mt-3 block`} onClick={() => run(() => setVolunteerStatusAction(item.id, "isActive", !item.isActive), "Active status updated.")}>{item.isActive ? "Deactivate" : "Activate"}</button></td>
              <td className="px-5 py-5">
                <div className="flex gap-2"><button type="button" className={buttonClass} disabled={pending || !!editing} onClick={() => openEditor(item)}>Edit</button>
                  <button type="button" className={`${buttonClass} text-red-700!`} disabled={pending || !!editing} onClick={() => setDeleting(item.id)}>Delete</button></div>
                {deleting === item.id ? <div className="mt-3 max-w-56 rounded-xl bg-red-50 p-3"><p className="text-xs text-red-800">Delete {item.name}&apos;s registration?</p><div className="mt-2 flex gap-2"><button type="button" disabled={pending} className={`${buttonClass} text-red-700!`} onClick={() => run(() => deleteVolunteerAction(item.id), "Volunteer registration deleted.")}>{pending ? "Deleting…" : "Confirm delete"}</button><button type="button" disabled={pending} className={buttonClass} onClick={() => setDeleting(null)}>Cancel</button></div></div> : null}
              </td>
            </tr>) : <tr><td colSpan={8} className="px-6 py-16 text-center text-slate-500">No volunteers found. Add a volunteer or try changing the filters.</td></tr>}
          </tbody>
        </table>
      </div>
    </div>
  );
}
