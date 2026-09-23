import { AccountingEndpointTable } from "@/components/admin/accounting_settings/accounting-endpoint-table";
import { AccountingEndpointFormPanel } from "@/components/admin/accounting_settings/accounting-endpoint-form";
import { getApiErrorMessage } from "@/lib/api/api-error";
import {
  getAccountingEndpointKeys,
  getAccountingEndpoints,
} from "@/lib/api/admin-accounting-settings-service";

export const metadata = {
  title: "Accounting Endpoints | Mir Faruk & Rima Foundation",
};

function readSingleValue(value) {
  return Array.isArray(value) ? value[0] ?? "" : value ?? "";
}

export default async function AdminAccountingEndpointsPage({ searchParams }) {
  const params = await searchParams;
  const editId = Number.parseInt(String(readSingleValue(params.edit)), 10);
  const isAdding = String(readSingleValue(params.add)) === "1";

  let endpoints = [];
  let keys = [];
  let errorMessage = "";

  try {
    [endpoints, keys] = await Promise.all([
      getAccountingEndpoints(),
      getAccountingEndpointKeys(),
    ]);
  } catch (error) {
    errorMessage = getApiErrorMessage(error);
  }

  const editing = Number.isFinite(editId)
    ? endpoints.find((e) => e.id === editId) ?? null
    : null;

  return (
    <div className="space-y-5 xl:space-y-6">
      {errorMessage ? (
        <section className="rounded-[24px] border border-red-200 bg-red-50 px-4 py-3 text-sm leading-6 text-red-700 sm:px-5 sm:py-4">
          <strong className="block font-semibold">Unable to load accounting endpoints</strong>
          {errorMessage}
        </section>
      ) : null}

      <section className="rounded-[24px] border border-cyan-100 bg-[radial-gradient(circle_at_top_left,_rgba(34,211,238,0.14),_transparent_40%),linear-gradient(135deg,#f8fafc,#effcff)] px-5 py-4 sm:px-6 sm:py-5">
        <p className="text-xs font-bold uppercase tracking-[0.18em] text-cyan-700">
          Accounting Setting
        </p>
        <h1 className="mt-1.5 text-xl font-black tracking-tight text-slate-950">
          Accounting Endpoints
        </h1>
        <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-600">
          Where the integration sends its requests. Each endpoint has a built-in URL that
          is used unless a row here overrides it &mdash; so this screen only needs a row
          when the accounting system moves a route.
        </p>
      </section>

      <AccountingEndpointFormPanel
        endpoint={editing}
        keys={keys}
        isOpen={isAdding || Boolean(editing)}
      />

      <section className="overflow-hidden rounded-[24px] border border-slate-200 bg-white shadow-sm">
        <AccountingEndpointTable items={endpoints} />
      </section>
    </div>
  );
}
