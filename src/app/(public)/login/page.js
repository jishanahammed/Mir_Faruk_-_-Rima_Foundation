"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useActionState, useEffect, useState } from "react";
import { useSiteLocale } from "@/components/public/providers/locale-provider";
import { loginAdmin } from "@/app/(public)/login/actions";
import { setLoginUserInformation } from "@/lib/auth/auth-storage-service";

function EyeIcon({ open }) {
  if (open) {
    return (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.7"
        className="h-5 w-5"
        aria-hidden="true"
      >
        <path
          d="M2 12s3.5-6 10-6 10 6 10 6-3.5 6-10 6-10-6-10-6Z"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <circle cx="12" cy="12" r="3" />
      </svg>
    );
  }

  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
      className="h-5 w-5"
      aria-hidden="true"
    >
      <path
        d="m3 3 18 18"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M10.6 10.7A3 3 0 0 0 13.4 13.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M9.4 5.3A11.5 11.5 0 0 1 12 5c6.5 0 10 7 10 7a17.6 17.6 0 0 1-4.1 4.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M6.2 6.2A17.2 17.2 0 0 0 2 12s3.5 7 10 7c1.7 0 3.2-.4 4.6-1.1"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export default function LoginPage() {
  const { copy } = useSiteLocale();
  const router = useRouter();
  const [state, formAction, pending] = useActionState(loginAdmin, null);
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    if (!state?.success || !state.session) {
      return;
    }

    setLoginUserInformation(state.session);
    router.replace(state.redirectTo ?? "/admin");
  }, [router, state]);

  return (
    <section className="relative isolate overflow-hidden px-4 py-10 sm:px-6 sm:py-14 lg:px-8 lg:py-20">
      <div className="absolute inset-0 -z-20 bg-[linear-gradient(180deg,#ecfeff_0%,#f8fafc_44%,#ffffff_100%)]" />
      <div className="absolute inset-x-0 top-0 -z-10 h-[30rem] bg-[radial-gradient(circle_at_top_left,_rgba(34,211,238,0.25),_transparent_42%),radial-gradient(circle_at_top_right,_rgba(14,165,233,0.18),_transparent_36%)]" />
      <div className="absolute left-1/2 top-16 -z-10 h-64 w-64 -translate-x-1/2 rounded-full bg-cyan-200/30 blur-3xl" />

      <div className="mx-auto grid w-full max-w-6xl overflow-hidden rounded-[2rem] border border-white/70 bg-white/80 shadow-[0_30px_80px_rgba(15,23,42,0.12)] backdrop-blur xl:grid-cols-[1.05fr_0.95fr]">
        <div className="relative overflow-hidden bg-slate-950 px-6 py-8 text-white sm:px-8 sm:py-10 lg:px-10">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(34,211,238,0.22),_transparent_42%),linear-gradient(160deg,_rgba(2,6,23,0.92),_rgba(8,47,73,0.96))]" />
          <div className="relative">
            <div className="inline-flex items-center gap-2 rounded-full border border-cyan-300/25 bg-white/10 px-4 py-1.5 text-[0.7rem] font-semibold tracking-[0.28em] text-cyan-100 uppercase">
              {copy.header.loginLabel}
            </div>

            <h1 className="mt-6 max-w-md text-3xl font-semibold tracking-tight text-white sm:text-4xl lg:text-[2.75rem]">
              Secure member access with email and password.
            </h1>

            <p className="mt-5 max-w-xl text-sm leading-7 text-slate-200 sm:text-base">
              Sign in to continue with {copy.brand.name}. This login screen is
              designed for a simple, focused experience with only the essentials:
              your email and password.
            </p>

            <div className="mt-8 grid gap-3 sm:grid-cols-3">
              <div className="rounded-3xl border border-white/10 bg-white/8 p-4">
                <p className="text-xs uppercase tracking-[0.24em] text-cyan-100/85">
                  Access
                </p>
                <p className="mt-2 text-lg font-semibold text-white">Member login</p>
              </div>
              <div className="rounded-3xl border border-white/10 bg-white/8 p-4">
                <p className="text-xs uppercase tracking-[0.24em] text-cyan-100/85">
                  Method
                </p>
                <p className="mt-2 text-lg font-semibold text-white">Email only</p>
              </div>
              <div className="rounded-3xl border border-white/10 bg-white/8 p-4">
                <p className="text-xs uppercase tracking-[0.24em] text-cyan-100/85">
                  Security
                </p>
                <p className="mt-2 text-lg font-semibold text-white">Password protected</p>
              </div>
            </div>

            <div className="mt-8 rounded-[1.75rem] border border-white/10 bg-white/8 p-5 sm:p-6">
              <p className="text-sm font-semibold text-white">Need an account first?</p>
              <p className="mt-2 text-sm leading-7 text-slate-200">
                Register your role with the foundation and come back here when
                your access is ready.
              </p>
              <div className="mt-5 flex flex-wrap gap-3">
                <Link
                  href="/register"
                  className="rounded-full bg-[linear-gradient(135deg,#06b6d4,#0f766e)] px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-cyan-950/25 transition hover:brightness-110"
                >
                  {copy.registration.menuLabel}
                </Link>
                <Link
                  href="/contact"
                  className="rounded-full border border-white/20 px-5 py-2.5 text-sm font-semibold text-white transition hover:border-cyan-200 hover:bg-white/10"
                >
                  Contact
                </Link>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white px-5 py-8 sm:px-8 sm:py-10 lg:px-10">
          <div className="mx-auto w-full max-w-md">
            <div className="rounded-full bg-cyan-50 px-4 py-1.5 text-xs font-semibold tracking-[0.24em] text-cyan-700 uppercase">
              Welcome back
            </div>

            <h2 className="mt-5 text-3xl font-semibold tracking-tight text-slate-950">
              Sign in to your account
            </h2>

            <p className="mt-3 text-sm leading-7 text-slate-600">
              Use your registered email address and password to continue.
            </p>

            <form action={formAction} className="mt-8 space-y-5">
              <div className="space-y-2">
                <label
                  htmlFor="email"
                  className="text-sm font-semibold text-slate-800"
                >
                  Email address
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  placeholder="you@example.com"
                  required
                  className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3.5 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-cyan-400 focus:bg-white focus:ring-4 focus:ring-cyan-100"
                />
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between gap-3">
                  <label
                    htmlFor="password"
                    className="text-sm font-semibold text-slate-800"
                  >
                    Password
                  </label>
                  <Link
                    href="/contact"
                    className="text-xs font-semibold text-cyan-700 transition hover:text-cyan-900"
                  >
                    Forgot password?
                  </Link>
                </div>

                <div className="relative">
                  <input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    autoComplete="current-password"
                    placeholder="Enter your password"
                    required

                    className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3.5 pr-13 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-cyan-400 focus:bg-white focus:ring-4 focus:ring-cyan-100"
                  />
                  <button
                    type="button"
                    aria-label={showPassword ? "Hide password" : "Show password"}
                    onClick={() => setShowPassword((value) => !value)}
                    className="absolute inset-y-0 right-0 flex w-12 items-center justify-center text-slate-500 transition hover:text-cyan-700"
                  >
                    <EyeIcon open={showPassword} />
                  </button>
                </div>
              </div>

              <label className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-700">
                <input
                  type="checkbox"
                  name="remember"
                  className="h-4 w-4 rounded border-slate-300 text-cyan-600 focus:ring-cyan-500"
                />
                <span>Keep me signed in on this device</span>
              </label>

              <button
                type="submit"
                disabled={pending}
                className="w-full rounded-2xl bg-slate-950 px-5 py-3.5 text-sm font-semibold text-white transition hover:bg-cyan-700 disabled:cursor-not-allowed disabled:opacity-70"
              >
                {pending ? "Signing in..." : copy.header.loginLabel}
              </button>

              {state?.message ? (
                <div className="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
                  {state.message}
                </div>
              ) : null}
            </form>

            <div className="mt-6 rounded-[1.5rem] border border-slate-200 bg-slate-50 p-5">
              <p className="text-sm font-semibold text-slate-900">
                New to the foundation portal?
              </p>
              <p className="mt-2 text-sm leading-7 text-slate-600">
                Create your registration first, then come back here to access
                your account.
              </p>
              <Link
                href="/register"
                className="mt-4 inline-flex rounded-full bg-[linear-gradient(135deg,#0f172a,#155e75)] px-4 py-2 text-sm font-semibold text-white shadow-md shadow-slate-900/10 transition hover:brightness-110"
              >
                Go to registration
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
