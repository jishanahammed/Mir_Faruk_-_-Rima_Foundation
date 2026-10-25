"use client";

import { useState } from "react";
import { VolunteerForm } from "@/components/shared/volunteer-form";
import { saveVolunteerProfileAction } from "@/app/volunteer/profile/actions";
import { getLoginUserInformation, setLoginUserInformation } from "@/lib/auth/auth-storage-service";

export function VolunteerProfileForm({ profile }) {
  const [saved, setSaved] = useState(false);

  async function save(payload) {
    setSaved(false);
    const result = await saveVolunteerProfileAction(payload);
    if (result.ok) setLoginUserInformation({ ...getLoginUserInformation(), user: result.user });
    return result;
  }

  return <div className="space-y-5">
    {saved ? <p role="status" className="rounded-2xl border border-emerald-200 bg-emerald-50 p-4 text-sm font-semibold text-emerald-800">Your volunteer profile has been updated.</p> : null}
    <section className="rounded-3xl border border-emerald-100 bg-white p-5 shadow-sm shadow-emerald-950/5 sm:p-8">
      <VolunteerForm initial={profile} onSave={save} onSuccess={() => setSaved(true)} />
    </section>
  </div>;
}
