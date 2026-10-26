"use client";

import { useActionState, useEffect, useRef, useState } from "react";
import { sendVolunteerQueryAction } from "@/app/volunteer/send-query/actions";
import { QUERY_MESSAGE_LIMIT, QUERY_SUBJECT_LIMIT } from "@/lib/volunteer-query-utils";

async function submitQuery(previousState, formData) {
  try { return await sendVolunteerQueryAction(previousState, formData); }
  catch { return { success: false, message: "Unable to send your query. Check your connection and try again." }; }
}

export function SendQueryForm() {
  const [state, action, pending] = useActionState(submitQuery, null);
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const feedbackRef = useRef(null);
  const handledQueryRef = useRef(null);

  useEffect(() => {
    if (!state) return;
    if (state.success && handledQueryRef.current !== state.queryId) {
      handledQueryRef.current = state.queryId;
      setSubject("");
      setMessage("");
    }
    feedbackRef.current?.focus();
  }, [state]);

  const fieldClass = "w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 disabled:opacity-60";
  return <form action={action} className="space-y-5">
    {state ? <div ref={feedbackRef} tabIndex={-1} role={state.success ? "status" : "alert"} className={`rounded-2xl border p-4 text-sm font-semibold outline-none ${state.success ? "border-emerald-200 bg-emerald-50 text-emerald-800" : "border-rose-200 bg-rose-50 text-rose-700"}`}>{state.message}</div> : null}
    <div>
      <div className="mb-2 flex items-center justify-between gap-2"><label htmlFor="query-subject" className="text-sm font-bold text-slate-800">Subject <span className="text-rose-600">*</span></label><span className="text-xs text-slate-400">{subject.length}/{QUERY_SUBJECT_LIMIT}</span></div>
      <input id="query-subject" name="subject" required maxLength={QUERY_SUBJECT_LIMIT} value={subject} onChange={(event) => setSubject(event.target.value)} disabled={pending} placeholder="What would you like help with?" aria-invalid={Boolean(state?.errors?.subject)} aria-describedby={state?.errors?.subject ? "query-subject-error" : undefined} className={fieldClass} />
      {state?.errors?.subject ? <p id="query-subject-error" className="mt-2 text-xs text-rose-700">{state.errors.subject}</p> : null}
    </div>
    <div>
      <div className="mb-2 flex items-center justify-between gap-2"><label htmlFor="query-message" className="text-sm font-bold text-slate-800">Message <span className="text-rose-600">*</span></label><span className="text-xs text-slate-400">{message.length.toLocaleString("en-GB")}/{QUERY_MESSAGE_LIMIT.toLocaleString("en-GB")}</span></div>
      <textarea id="query-message" name="message" required maxLength={QUERY_MESSAGE_LIMIT} rows={7} value={message} onChange={(event) => setMessage(event.target.value)} disabled={pending} placeholder="Include the details our admin team needs to review your query." aria-invalid={Boolean(state?.errors?.message)} aria-describedby={state?.errors?.message ? "query-message-error" : "query-message-help"} className={`${fieldClass} resize-y`} />
      {state?.errors?.message ? <p id="query-message-error" className="mt-2 text-xs text-rose-700">{state.errors.message}</p> : null}
      <p id="query-message-help" className="mt-2 text-xs leading-5 text-slate-500">Your name and contact details are included automatically from your volunteer profile.</p>
    </div>
    <div className="flex flex-wrap items-center justify-between gap-4 border-t border-slate-100 pt-5">
      <p className="max-w-sm text-xs leading-5 text-slate-500">After sending, you can check below whether an admin has seen your query.</p>
      <button type="submit" disabled={pending || !subject.trim() || !message.trim()} className="inline-flex h-12 items-center justify-center gap-2 rounded-2xl bg-emerald-800 px-6 text-sm font-bold text-white! transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-50">
        <svg aria-hidden="true" className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="m22 2-7 20-4-9L2 9 22 2ZM22 2 11 13" /></svg>{pending ? "Sending query..." : "Send Query"}
      </button>
    </div>
  </form>;
}
