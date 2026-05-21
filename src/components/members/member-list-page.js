"use client";

import Link from "next/link";
import { useSiteLocale } from "@/components/providers/locale-provider";

export function MemberListPage({ type }) {
  const { copy } = useSiteLocale();
  const { members } = copy;
  const currentItem =
    members.items.find((item) => item.id === type) ?? members.items[0];

  return (
    <section className="relative overflow-hidden bg-[linear-gradient(180deg,_#ffffff_0%,_#f8fafc_48%,_#ecfeff_100%)] px-6 py-20 lg:px-8">
      <div className="absolute inset-x-0 top-0 h-px bg-[linear-gradient(90deg,_transparent,_rgba(8,145,178,0.35),_transparent)]" />
      <div className="absolute right-[-8rem] top-16 h-72 w-72 rounded-full bg-cyan-100/60 blur-3xl" />

      <div className="relative mx-auto w-full max-w-7xl">
        <div className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr] lg:items-start">
          <div className="rounded-[2rem] border border-slate-200/80 bg-white/90 p-6 shadow-[0_24px_80px_rgba(15,23,42,0.08)] ring-1 ring-white/80 backdrop-blur sm:p-8">
            <p className="text-xs font-semibold tracking-[0.32em] text-cyan-700 uppercase">
              {members.eyebrow}
            </p>
            <h1 className="mt-3 text-3xl font-semibold leading-tight text-slate-950 md:text-4xl">
              {currentItem.title}
            </h1>
            <p className="mt-4 text-sm leading-7 text-slate-600 md:text-base">
              {currentItem.description}
            </p>

            <div className="mt-8 grid gap-3">
              {members.items.map((item) => (
                <Link
                  key={item.id}
                  href={item.href}
                  className={`rounded-2xl border px-4 py-3 text-sm font-semibold transition ${
                    item.id === currentItem.id
                      ? "border-cyan-300 bg-white text-cyan-800 shadow-sm shadow-cyan-100"
                      : "border-slate-200 bg-slate-50 text-slate-700 hover:border-cyan-200 hover:text-cyan-700"
                  }`}
                >
                  {item.title}
                </Link>
              ))}
            </div>
          </div>

          <div className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-[0_24px_80px_rgba(15,23,42,0.08)] sm:p-8">
            <div className="flex flex-col gap-5 border-b border-slate-200 pb-6 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-xs font-semibold tracking-[0.24em] text-cyan-700 uppercase">
                  {members.menuLabel}
                </p>
                <h2 className="mt-2 text-2xl font-semibold text-slate-950">
                  {currentItem.title}
                </h2>
              </div>
              <span className="rounded-full border border-cyan-200 bg-cyan-50 px-4 py-2 text-sm font-semibold text-cyan-800">
                {members.emptyLabel}
              </span>
            </div>

            <div className="mt-8 rounded-[1.5rem] border border-dashed border-cyan-200 bg-cyan-50/60 p-8 text-center">
              <p className="text-lg font-semibold text-slate-950">
                {members.emptyLabel}
              </p>
              <p className="mx-auto mt-3 max-w-xl text-sm leading-7 text-slate-600">
                {members.emptyText}
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
