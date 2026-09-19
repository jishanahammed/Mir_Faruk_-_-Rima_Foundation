import { getApiErrorMessage } from "@/lib/api/api-error";
import { getAdminAccountingCredential } from "@/lib/api/admin-accounting-credential-service";
import { AccountingCredentialForm } from "@/components/admin/accounting_credential/accounting-credential-form";
import { saveAccountingCredentialAction } from "./actions";

export const metadata = {
  title: "Accounting Credentials | Admin | Mir Faruk & Rima Foundation",
};

export default async function AdminAccountingCredentialsPage() {
  let credential = null, error = null;

  try {
    credential = await getAdminAccountingCredential();
  } catch (err) {
    error = getApiErrorMessage(err);
  }

  return (
    <div className="flex max-w-3xl flex-col gap-6">
      <div>
        <p className="text-xs font-bold uppercase tracking-widest text-cyan-600">Accounting Setting</p>
        <h1 className="mt-1 text-2xl font-extrabold text-slate-900">Accounting Credentials</h1>
        <p className="mt-1 text-sm text-slate-500">
          Login details for the accounting system the foundation connects to.
        </p>
      </div>

      {error && (
        <div className="rounded-2xl border border-rose-200 bg-rose-50 px-5 py-4 text-sm font-semibold text-rose-700">
          {error}
        </div>
      )}

      {/* These fields hold a live login for an external system, so the risk is
          stated on screen rather than only in the code. */}
      <div className="flex items-start gap-3 rounded-2xl border border-amber-200 bg-amber-50 px-5 py-4">
        <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-amber-500 text-white">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-3.5 w-3.5" aria-hidden="true">
            <path d="M12 9v4M12 17h.01M10.3 3.9 2.4 17.5A1.8 1.8 0 0 0 4 20.2h16a1.8 1.8 0 0 0 1.6-2.7L13.7 3.9a1.8 1.8 0 0 0-3.4 0Z" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </span>
        <p className="text-xs leading-5 text-amber-900">
          <span className="font-bold">Sensitive data.</span> The password here is stored
          unencrypted and is visible to anyone with admin access or database access.
          Use a dedicated integration account rather than a personal login, and rotate
          it if access changes.
        </p>
      </div>

      <AccountingCredentialForm
        credential={credential}
        saveAction={saveAccountingCredentialAction}
      />
    </div>
  );
}
