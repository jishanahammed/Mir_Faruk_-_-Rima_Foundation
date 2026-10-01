"use client";

import Link from "next/link";
import { useState } from "react";
import { VolunteerForm } from "@/components/shared/volunteer-form";
import { useSiteLocale } from "@/components/public/providers/locale-provider";
import { volunteerCopy } from "@/lib/volunteer-registration";

export function VolunteerRegistrationForm() {
  const { locale } = useSiteLocale();
  const copy = volunteerCopy[locale] || volunteerCopy.EN;
  const [success, setSuccess] = useState(false);
  return (
    <section className="bg-gradient-to-b from-cyan-50 to-white px-4 py-12 sm:py-16">
      <div className="mx-auto max-w-3xl">
        <Link href="/register" className="text-sm font-semibold text-cyan-800 hover:underline">← {copy.back}</Link>
        <h1 className="mt-6 text-3xl font-bold tracking-tight text-slate-950 sm:text-4xl">{copy.title}</h1>
        <p className="mt-3 text-slate-600">{copy.intro}</p>
        <div className="mt-8 rounded-3xl border border-slate-200 bg-white p-5 shadow-sm sm:p-8">
          {success ? <div role="status" className="space-y-4 py-6">
            <h2 className="text-2xl font-bold text-emerald-800">{copy.success}</h2>
            <p className="leading-7 text-slate-600">{copy.received}</p>
            <button type="button" onClick={() => setSuccess(false)} className="rounded-full bg-cyan-700 px-5 py-3 font-semibold text-white!">{copy.another}</button>
          </div> : <>
            <p className="mb-7 rounded-xl bg-cyan-50 p-4 text-sm leading-6 text-cyan-900">{copy.note}</p>
            <VolunteerForm locale={locale} onSuccess={() => setSuccess(true)} />
          </>}
        </div>
      </div>
    </section>
  );
}
