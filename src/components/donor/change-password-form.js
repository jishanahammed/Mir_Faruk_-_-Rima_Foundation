"use client";

import { useState } from "react";

function Field({ label, children }) {
  return (
    <label className="block">
      <span className="mb-2 block text-xs font-bold uppercase tracking-[0.14em] text-slate-500">
        {label}
      </span>
      {children}
    </label>
  );
}

const inputClass =
  "h-12 w-full rounded-2xl border border-slate-200 bg-white px-4 text-sm font-medium text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-emerald-400 focus:ring-4 focus:ring-emerald-100";

export function ChangePasswordForm({ email }) {
  const [step, setStep] = useState("request"); // "request" | "reset" | "done"
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");

  async function handleRequestOtp() {
    setError("");

    if (!email) {
      setError("We could not find an email address on your account. Please contact support.");
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const result = await response.json().catch(() => null);

      if (!response.ok) {
        throw new Error(result?.message ?? "Unable to send the verification code right now.");
      }

      setNotice(
        result?.message ?? `A verification code has been sent to ${email}.`,
      );
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
          email,
          otp: trimmedOtp,
          newPassword,
          confirmPassword,
        }),
      });

      const result = await response.json().catch(() => null);

      if (!response.ok) {
        throw new Error(result?.message ?? "Unable to change your password right now.");
      }

      setNotice(result?.message ?? "Your password has been changed successfully.");
      setStep("done");
    } catch (err) {
      setError(err?.message ?? "Unable to change your password right now.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="overflow-hidden rounded-[28px] border border-emerald-100 bg-white shadow-xl shadow-emerald-950/5">
      <div className="border-b border-emerald-100 bg-[radial-gradient(circle_at_top_left,_rgba(16,185,129,0.18),_transparent_38%),linear-gradient(135deg,#f8fafc,#ecfdf5)] px-6 py-5">
        <p className="text-xs font-black uppercase tracking-[0.2em] text-emerald-700">
          Change Password
        </p>
        <p className="mt-2 text-lg font-black text-slate-950">
          {step === "done" ? "Password updated" : "Verify it's you"}
        </p>
        <p className="mt-1 text-sm text-slate-500">{email || "No email on file"}</p>
      </div>

      <div className="p-6">
        {step === "request" ? (
          <div className="space-y-5">
            <p className="text-sm leading-7 text-slate-600">
              For your security, we&apos;ll email a 6-digit verification code to{" "}
              <strong className="text-slate-900">{email}</strong>. Enter it on the
              next step along with your new password.
            </p>

            {error ? (
              <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-bold text-red-700">
                {error}
              </div>
            ) : null}

            <button
              type="button"
              disabled={isSubmitting}
              onClick={handleRequestOtp}
              className="inline-flex h-12 items-center justify-center rounded-2xl bg-slate-950 px-6 text-sm font-bold text-white transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-70"
            >
              {isSubmitting ? "Sending code..." : "Send verification code"}
            </button>
          </div>
        ) : null}

        {step === "reset" ? (
          <form onSubmit={handleResetPassword} className="space-y-5">
            {notice ? (
              <div className="rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-bold text-emerald-800">
                {notice}
              </div>
            ) : null}

            <div className="grid gap-5 lg:grid-cols-2">
              <Field label="Verification Code">
                <input
                  type="text"
                  inputMode="numeric"
                  autoComplete="one-time-code"
                  placeholder="6-digit code"
                  required
                  value={otp}
                  onChange={(event) => setOtp(event.target.value)}
                  className={`${inputClass} text-center text-lg tracking-[0.4em] placeholder:tracking-normal placeholder:font-normal`}
                />
              </Field>
              <div />
              <Field label="New Password">
                <input
                  type="password"
                  autoComplete="new-password"
                  placeholder="Create a new password"
                  required
                  minLength={6}
                  value={newPassword}
                  onChange={(event) => setNewPassword(event.target.value)}
                  className={inputClass}
                />
              </Field>
              <Field label="Confirm New Password">
                <input
                  type="password"
                  autoComplete="new-password"
                  placeholder="Re-enter your new password"
                  required
                  minLength={6}
                  value={confirmPassword}
                  onChange={(event) => setConfirmPassword(event.target.value)}
                  className={inputClass}
                />
              </Field>
            </div>

            {error ? (
              <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-bold text-red-700">
                {error}
              </div>
            ) : null}

            <div className="flex flex-wrap items-center gap-3">
              <button
                type="submit"
                disabled={isSubmitting}
                className="inline-flex h-12 items-center justify-center rounded-2xl bg-slate-950 px-6 text-sm font-bold text-white transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-70"
              >
                {isSubmitting ? "Updating password..." : "Update password"}
              </button>
              <button
                type="button"
                onClick={() => {
                  setError("");
                  setNotice("");
                  setOtp("");
                  handleRequestOtp();
                }}
                className="text-xs font-bold text-emerald-700 transition hover:text-emerald-900"
              >
                Didn&apos;t get a code? Send it again
              </button>
            </div>
          </form>
        ) : null}

        {step === "done" ? (
          <div className="space-y-4">
            <div className="rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-bold text-emerald-800">
              {notice}
            </div>
            <p className="text-sm leading-7 text-slate-600">
              Use your new password the next time you sign in.
            </p>
          </div>
        ) : null}
      </div>
    </div>
  );
}
