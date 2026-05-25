import Link from "next/link";
import { notFound } from "next/navigation";
import { updateDonorAction } from "@/app/admin/donors/actions";
import { getAdminDonorById } from "@/lib/api/admin-donor-service";

export const metadata = {
  title: "Edit Donor | Mir Faruk & Rima Foundation",
};

function Field({ label, name, defaultValue = "", type = "text", required = false, children }) {
  return (
    <label className="block">
      <span className="mb-2 block text-xs font-semibold uppercase tracking-[0.14em] text-slate-500">
        {label}
        {required ? <span className="ml-1 text-red-500">*</span> : null}
      </span>
      {children ?? (
        <input
          name={name}
          type={type}
          required={required}
          defaultValue={defaultValue ?? ""}
          className="h-12 w-full rounded-2xl border border-slate-200 bg-white px-4 text-sm font-medium text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-cyan-400 focus:ring-4 focus:ring-cyan-100"
        />
      )}
    </label>
  );
}

export default async function EditDonorPage({ params }) {
  const { id } = await params;
  const donor = await getAdminDonorById(id);

  if (!donor) {
    notFound();
  }

  return (
    <div className="space-y-5">
      <header className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-cyan-700">
            Donor Management
          </p>
          <h1 className="mt-2 text-2xl font-bold tracking-tight text-slate-950">
            Edit donor profile
          </h1>
        </div>
        <Link
          href="/admin/donors"
          className="inline-flex h-11 items-center justify-center rounded-2xl border border-slate-200 bg-white px-4 text-sm font-semibold text-slate-700 transition hover:border-cyan-200 hover:text-cyan-800"
        >
          Back to list
        </Link>
      </header>

      <form
        action={updateDonorAction}
        className="overflow-hidden rounded-[28px] border border-cyan-100 bg-white shadow-xl shadow-cyan-950/5"
      >
        <input type="hidden" name="id" value={donor.id} />

        <div className="border-b border-cyan-100 bg-[radial-gradient(circle_at_top_left,_rgba(34,211,238,0.18),_transparent_38%),linear-gradient(135deg,#f8fafc,#effcff)] px-6 py-5">
          <p className="text-lg font-bold text-slate-950">{donor.fullName}</p>
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
              className="min-h-28 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-medium text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-cyan-400 focus:ring-4 focus:ring-cyan-100"
            />
          </Field>
        </div>

        <div className="flex flex-col-reverse gap-3 border-t border-slate-100 px-6 py-5 sm:flex-row sm:justify-end">
          <Link
            href="/admin/donors"
            className="inline-flex h-12 items-center justify-center rounded-2xl border border-slate-200 bg-white px-5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
          >
            Cancel
          </Link>
          <button
            type="submit"
            className="inline-flex h-12 items-center justify-center rounded-2xl bg-[linear-gradient(135deg,#0f766e,#0891b2)] px-5 text-sm font-semibold text-white shadow-lg shadow-cyan-200/80 transition hover:-translate-y-0.5 hover:shadow-xl hover:shadow-cyan-300/70"
          >
            Save Changes
          </button>
        </div>
      </form>
    </div>
  );
}
