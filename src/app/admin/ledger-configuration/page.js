import Link from "next/link";
import { getApiErrorMessage } from "@/lib/api/api-error";
import {
  getLedgerConfigurations,
  getLedgerTypes,
  getAccountGroups,
} from "@/lib/api/admin-ledger-configuration-service";
import { LedgerConfigurationTable } from "@/components/admin/accounting_Ledger_configaration/ledger-configuration-table";
import { LedgerConfigurationModal } from "@/components/admin/accounting_Ledger_configaration/ledger-configuration-modal";
import {
  createLedgerConfigurationAction,
  updateLedgerConfigurationAction,
  updateLedgerConfigurationStatusAction,
  deleteLedgerConfigurationAction,
} from "./actions";

export const metadata = {
  title: "Ledger Configuration | Admin | Mir Faruk & Rima Foundation",
};

const FALLBACK_LEDGER_TYPES = ["Donor", "Beneficiary", "Volunteer", "Staff", "General"];

export default async function AdminLedgerConfigurationPage({ searchParams }) {
  const params = await searchParams;

  let configurations = [], ledgerTypes = FALLBACK_LEDGER_TYPES, error = null;
  let accountGroups = [], accountGroupError = null;

  try {
    [configurations, ledgerTypes] = await Promise.all([
      getLedgerConfigurations(),
      getLedgerTypes(),
    ]);
  } catch (err) {
    error = getApiErrorMessage(err);
  }

  // The dropdown needs a live call to the accounting system. A failure there
  // must not take the whole screen down, so it degrades to manual entry.
  const groupResult = await getAccountGroups();
  if (groupResult.success) accountGroups = groupResult.list;
  else accountGroupError = groupResult.message || "Account groups could not be loaded.";

  const configuredCount = configurations.length;
  const totalTypes = (ledgerTypes.length ? ledgerTypes : FALLBACK_LEDGER_TYPES).length;

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-xs font-bold uppercase tracking-widest text-cyan-600">Accounting</p>
          <h1 className="mt-1 text-2xl font-extrabold text-slate-900">Ledger Configuration</h1>
          <p className="mt-1 text-sm text-slate-500">
            Map each people type to its group and nature in the accounting system.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <span className="flex h-8 items-center rounded-full border border-cyan-200 bg-cyan-50 px-3 text-xs font-bold text-cyan-700">
            {configuredCount} of {totalTypes} configured
          </span>
          {configuredCount < totalTypes && (
            <Link
              href="?add=1"
              className="inline-flex items-center gap-2 rounded-xl bg-[linear-gradient(135deg,#0f766e,#0891b2)] px-4 py-2 text-sm font-bold text-white shadow-md shadow-cyan-200/60 transition hover:opacity-90"
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="h-4 w-4">
                <path d="M12 5v14M5 12h14" strokeLinecap="round" />
              </svg>
              Add Configuration
            </Link>
          )}
        </div>
      </div>

      {error && (
        <div className="rounded-2xl border border-rose-200 bg-rose-50 px-5 py-4 text-sm font-semibold text-rose-700">
          {error}
        </div>
      )}

      {accountGroupError && (
        <div className="flex items-start gap-3 rounded-2xl border border-amber-200 bg-amber-50 px-5 py-4">
          <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-amber-500 text-white">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-3.5 w-3.5" aria-hidden="true">
              <path d="M12 9v4M12 17h.01M10.3 3.9 2.4 17.5A1.8 1.8 0 0 0 4 20.2h16a1.8 1.8 0 0 0 1.6-2.7L13.7 3.9a1.8 1.8 0 0 0-3.4 0Z" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </span>
          <p className="text-xs leading-5 text-amber-900">
            <span className="font-bold">Account groups unavailable.</span> {accountGroupError}{" "}
            You can still save a configuration by entering the group details manually.
          </p>
        </div>
      )}

      <section className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm shadow-slate-900/4">
        <div className="bg-[linear-gradient(135deg,#0f766e,#0891b2)] px-6 py-4">
          <h2 className="text-sm font-bold text-white">Configured Ledger Types</h2>
          <p className="text-xs text-cyan-100/80">
            Each type maps to one accounting group and nature.
          </p>
        </div>
        <div className="p-6">
          <LedgerConfigurationTable
            items={configurations}
            updateStatusAction={updateLedgerConfigurationStatusAction}
            deleteAction={deleteLedgerConfigurationAction}
          />
        </div>
      </section>

      <LedgerConfigurationModal
        params={params}
        configurations={configurations}
        ledgerTypes={ledgerTypes.length ? ledgerTypes : FALLBACK_LEDGER_TYPES}
        accountGroups={accountGroups}
        accountGroupError={accountGroupError}
        createAction={createLedgerConfigurationAction}
        updateAction={updateLedgerConfigurationAction}
      />
    </div>
  );
}
