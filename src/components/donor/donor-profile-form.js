"use client";

import { useActionState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { updateDonerProfileAction } from "@/app/doner/profile/actions";

function Field({ label, name, defaultValue = "", type = "text", required = false, children }) {
  return (
    <label className="block">
      <span className="mb-2 block text-xs font-bold uppercase tracking-[0.14em] text-slate-500">
        {label}
        {required ? <span className="ml-1 text-red-500">*</span> : null}
      </span>
      {children ?? (
        <input
          name={name}
          type={type}
          required={required}
          defaultValue={defaultValue ?? ""}
          className="h-12 w-full rounded-2xl border border-slate-200 bg-white px-4 text-sm font-medium text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-emerald-400 focus:ring-4 focus:ring-emerald-100"
        />
      )}
    </label>
  );
}

export function DonorProfileForm({ donor }) {
  const [state, formAction, pending] = useActionState(updateDonerProfileAction, null);
  const router = useRouter();

  useEffect(() => {
    if (state?.success) {
      router.refresh();
    }
  }, [router, state]);

  return (
    <form
      action={formAction}
      className="overflow-hidden rounded-[28px] border border-emerald-100 bg-white shadow-xl shadow-emerald-950/5"
    >
      <div className="border-b border-emerald-100 bg-[radial-gradient(circle_at_top_left,_rgba(16,185,129,0.18),_transparent_38%),linear-gradient(135deg,#f8fafc,#ecfdf5)] px-6 py-5">
        <p className="text-xs font-black uppercase tracking-[0.2em] text-emerald-700">
          Profile Update
        </p>
        <p className="mt-2 text-lg font-black text-slate-950">
          {donor.fullName || "Donor profile"}
        </p>
        <p className="mt-1 text-sm text-slate-500">{donor.email}</p>
      </div>

      <div className="grid gap-5 p-6 lg:grid-cols-2">
        <Field label="Full Name" name="fullName" defaultValue={donor.fullName} required />
        <Field label="Email Address" name="email" type="email" defaultValue={donor.email} required />
        <Field label="Mobile Number" name="mobile" defaultValue={donor.mobile} required />
        <Field label="Profession" name="profession" defaultValue={donor.profession} />
        <Field label="Donor Type" name="donorType" defaultValue={donor.donorType} />
        <Field label="Donation Frequency" name="frequency" defaultValue={donor.frequency} />
        <Field label="Preferred Donation Purpose" name="purpose" defaultValue={donor.purpose} />
        <Field label="Contact Person Full Name" name="contactFullName" defaultValue={donor.contactFullName} />
        <Field label="Contact Person Mobile" name="contactMobile" defaultValue={donor.contactMobile} />
        <Field
          label="Contact Person Telephone"
          name="contactTelephone"
          defaultValue={donor.contactTelephone}
        />
        <Field label="Address" name="address" required>
          <textarea
            name="address"
            required
            defaultValue={donor.address}
            rows={4}
            className="min-h-28 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-medium text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-emerald-400 focus:ring-4 focus:ring-emerald-100"
          />
        </Field>
      </div>

      {state?.message ? (
        <div
          className={`mx-6 rounded-2xl border px-4 py-3 text-sm font-bold ${
            state.success
              ? "border-emerald-200 bg-emerald-50 text-emerald-700"
              : "border-red-200 bg-red-50 text-red-700"
          }`}
        >
          {state.message}
        </div>
      ) : null}

      <div className="flex flex-col-reverse gap-3 border-t border-slate-100 px-6 py-5 sm:flex-row sm:justify-end">
        <button
          type="submit"
          disabled={pending}
          className="inline-flex h-12 items-center justify-center rounded-2xl bg-emerald-800 px-5 text-sm font-bold text-white shadow-lg shadow-emerald-200/80 transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-70"
        >
          {pending ? "Saving..." : "Save Changes"}
        </button>
      </div>
    </form>
  );
}
