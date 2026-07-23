"use client";

import Link from "next/link";
import { useState } from "react";

function isValidEmail(value) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

export default function ForgotPasswordPage() {
  const [step, setStep] = useState("request"); // "request" | "reset" | "done"
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");

  async function handleRequestOtp(event) {
    event.preventDefault();
    setError("");

    const trimmedEmail = email.trim();
    if (!isValidEmail(trimmedEmail)) {
      setError("Enter a valid email address.");
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: trimmedEmail }),
      });

      const result = await response.json().catch(() => null);

      if (!response.ok) {
        throw new Error(result?.message ?? "Unable to send the verification code right now.");
      }

      setNotice(result?.message ?? "If an account exists for this email address, a verification code has been sent.");
      setStep("reset");
    } catch (err) {
      setError(err?.message ?? "Unable to send the verification code right now.");
    } finally {
      setIsSubmitting(false);
    }
  }

  async function handleResetPassword(event) {
    event.preventDefault();
    setError("");

    const trimmedOtp = otp.trim();

    if (!trimmedOtp) {
      setError("Enter the verification code sent to your email.");
      return;
    }

    if (newPassword.length < 6) {
      setError("Use at least 6 characters for the new password.");
      return;
    }

    if (newPassword !== confirmPassword) {
      setError("Password and confirm password do not match.");
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: email.trim(),
          otp: trimmedOtp,
          newPassword,
          confirmPassword,
        }),
      });

      const result = await response.json().catch(() => null);

      if (!response.ok) {
        throw new Error(result?.message ?? "Unable to reset your password right now.");
      }

      setNotice(result?.message ?? "Your password has been reset successfully.");
      setStep("done");
    } catch (err) {
      setError(err?.message ?? "Unable to reset your password right now.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <section className="relative isolate overflow-hidden px-4 py-10 sm:px-6 sm:py-14 lg:px-8 lg:py-20">
      <div className="absolute inset-0 -z-20 bg-[linear-gradient(180deg,#ecfeff_0%,#f8fafc_44%,#ffffff_100%)]" />
      <div className="absolute inset-x-0 top-0 -z-10 h-[30rem] bg-[radial-gradient(circle_at_top_left,_rgba(34,211,238,0.25),_transparent_42%),radial-gradient(circle_at_top_right,_rgba(14,165,233,0.18),_transparent_36%)]" />

      <div className="mx-auto w-full max-w-md rounded-[2rem] border border-white/70 bg-white/90 p-6 shadow-[0_30px_80px_rgba(15,23,42,0.12)] backdrop-blur sm:p-8">
        <div className="rounded-full bg-cyan-50 px-4 py-1.5 text-xs font-semibold tracking-[0.24em] text-cyan-700 uppercase inline-block">
          Account recovery
        </div>

        <h1 className="mt-5 text-2xl font-semibold tracking-tight text-slate-950 sm:text-3xl">
          {step === "done" ? "Password reset" : "Forgot your password?"}
        </h1>

        <p className="mt-3 text-sm leading-7 text-slate-600">
          {step === "request" &&
            "Enter your registered email address and we'll send you a verification code."}
          {step === "reset" &&
            "Enter the verification code we emailed you along with your new password."}
          {step === "done" &&
            "You can now sign in with your new password."}
        </p>

        {step === "request" ? (
          <form onSubmit={handleRequestOtp} className="mt-8 space-y-5">
            <div className="space-y-2">
              <label htmlFor="email" className="text-sm font-semibold text-slate-800">
                Email address
              </label>
              <input
                id="email"
                type="email"
                autoComplete="email"
                placeholder="you@example.com"
                required
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3.5 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-cyan-400 focus:bg-white focus:ring-4 focus:ring-cyan-100"
              />
            </div>

            {error ? (
              <div className="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
                {error}
              </div>
            ) : null}

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full rounded-2xl bg-slate-950 px-5 py-3.5 text-sm font-semibold text-white transition hover:bg-cyan-700 disabled:cursor-not-allowed disabled:opacity-70"
            >
              {isSubmitting ? "Sending code..." : "Send verification code"}
            </button>
          </form>
        ) : null}

        {step === "reset" ? (
          <form onSubmit={handleResetPassword} className="mt-8 space-y-5">
            {notice ? (
              <div className="rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-800">
                {notice}
              </div>
            ) : null}

            <div className="space-y-2">
              <label htmlFor="otp" className="text-sm font-semibold text-slate-800">
                Verification code
              </label>
              <input
                id="otp"
                type="text"
                inputMode="numeric"
                autoComplete="one-time-code"
                placeholder="6-digit code"
                required
                value={otp}
                onChange={(event) => setOtp(event.target.value)}
                className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3.5 text-center text-lg font-semibold tracking-[0.4em] text-slate-900 outline-none transition placeholder:text-slate-400 placeholder:tracking-normal placeholder:font-normal focus:border-cyan-400 focus:bg-white focus:ring-4 focus:ring-cyan-100"
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="newPassword" className="text-sm font-semibold text-slate-800">
                New password
              </label>
              <input
                id="newPassword"
                type="password"
                autoComplete="new-password"
                placeholder="Create a new password"
                required
                minLength={6}
                value={newPassword}
                onChange={(event) => setNewPassword(event.target.value)}
                className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3.5 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-cyan-400 focus:bg-white focus:ring-4 focus:ring-cyan-100"
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="confirmPassword" className="text-sm font-semibold text-slate-800">
                Confirm new password
              </label>
              <input
                id="confirmPassword"
                type="password"
                autoComplete="new-password"
                placeholder="Re-enter your new password"
                required
                minLength={6}
                value={confirmPassword}
                onChange={(event) => setConfirmPassword(event.target.value)}
                className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3.5 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-cyan-400 focus:bg-white focus:ring-4 focus:ring-cyan-100"
              />
            </div>

            {error ? (
              <div className="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
                {error}
              </div>
            ) : null}

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full rounded-2xl bg-slate-950 px-5 py-3.5 text-sm font-semibold text-white transition hover:bg-cyan-700 disabled:cursor-not-allowed disabled:opacity-70"
            >
              {isSubmitting ? "Resetting password..." : "Reset password"}
            </button>

            <button
              type="button"
              onClick={() => {
                setStep("request");
                setError("");
                setNotice("");
                setOtp("");
                setNewPassword("");
                setConfirmPassword("");
              }}
              className="w-full text-center text-xs font-semibold text-cyan-700 transition hover:text-cyan-900"
            >
              Didn&apos;t get a code? Send it again
            </button>
          </form>
        ) : null}

        {step === "done" ? (
          <div className="mt-8 space-y-5">
            <div className="rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-800">
              {notice}
            </div>
            <Link
              href="/login"
              className="block w-full rounded-2xl bg-slate-950 px-5 py-3.5 text-center text-sm font-semibold text-white transition hover:bg-cyan-700"
            >
              Go to sign in
            </Link>
          </div>
        ) : null}

        <div className="mt-6 text-center text-sm text-slate-600">
          <Link href="/login" className="font-semibold text-cyan-700 transition hover:text-cyan-900">
            Back to sign in
          </Link>
        </div>
      </div>
    </section>
  );
}
