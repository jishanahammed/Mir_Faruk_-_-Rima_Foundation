import { VoucherSettingTable } from "@/components/admin/accounting_settings/voucher-setting-table";
import { VoucherSettingFormPanel } from "@/components/admin/accounting_settings/voucher-setting-form";
import { getApiErrorMessage } from "@/lib/api/api-error";
import {
  getVoucherPurposes,
  getVoucherSettings,
} from "@/lib/api/admin-accounting-settings-service";

export const metadata = {
  title: "Voucher Settings | Mir Faruk & Rima Foundation",
};

function readSingleValue(value) {
  return Array.isArray(value) ? value[0] ?? "" : value ?? "";
}

export default async function AdminVoucherSettingsPage({ searchParams }) {
  const params = await searchParams;
  const editId = Number.parseInt(String(readSingleValue(params.edit)), 10);
  const isAdding = String(readSingleValue(params.add)) === "1";

  let settings = [];
  let purposes = [];
  let errorMessage = "";

  try {
    [settings, purposes] = await Promise.all([getVoucherSettings(), getVoucherPurposes()]);
  } catch (error) {
    errorMessage = getApiErrorMessage(error);
  }

  const editing = Number.isFinite(editId)
    ? settings.find((s) => s.id === editId) ?? null
    : null;

  return (
    <div className="space-y-5 xl:space-y-6">
      {errorMessage ? (
        <section className="rounded-[24px] border border-red-200 bg-red-50 px-4 py-3 text-sm leading-6 text-red-700 sm:px-5 sm:py-4">
          <strong className="block font-semibold">Unable to load voucher settings</strong>
          {errorMessage}
        </section>
      ) : null}

      <section className="rounded-[24px] border border-cyan-100 bg-[radial-gradient(circle_at_top_left,_rgba(34,211,238,0.14),_transparent_40%),linear-gradient(135deg,#f8fafc,#effcff)] px-5 py-4 sm:px-6 sm:py-5">
        <p className="text-xs font-bold uppercase tracking-[0.18em] text-cyan-700">
          Accounting Setting
        </p>
        <h1 className="mt-1.5 text-xl font-black tracking-tight text-slate-950">
          Voucher Settings
        </h1>
        <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-600">
          One row per voucher type, each carrying the header values its vouchers are posted
          with. Rows are matched by what they are used for, so adding a type never changes
          what an existing flow posts.
        </p>
      </section>

      <VoucherSettingFormPanel
        setting={editing}
        purposes={purposes}
        isOpen={isAdding || Boolean(editing)}
      />

      <section className="overflow-hidden rounded-[24px] border border-slate-200 bg-white shadow-sm">
        <VoucherSettingTable items={settings} />
      </section>
    </div>
  );
}
