"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { getApiErrorMessage } from "@/lib/api/api-error";
import {
  createVoucherSetting,
  deleteVoucherSetting,
  updateVoucherSetting,
  updateVoucherSettingStatus,
} from "@/lib/api/admin-accounting-settings-service";

const PAGE = "/admin/voucher-settings";

function readId(formData) {
  const id = Number.parseInt(String(formData.get("id") ?? ""), 10);
  if (!Number.isFinite(id) || id <= 0) {
    throw new Error("Valid voucher setting id is required.");
  }
  return id;
}

/** Zero means "not set", which the server leaves out of the voucher payload. */
function readOptionalInt(formData, name) {
  const raw = String(formData.get(name) ?? "").trim();
  if (!raw) return 0;

  const parsed = Number.parseInt(raw, 10);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : 0;
}

export async function saveVoucherSettingAction(_state, formData) {
  const idRaw = String(formData.get("id") ?? "").trim();
  const isEdit = Boolean(idRaw);

  const receiptVoucherTypeId = readOptionalInt(formData, "receiptVoucherTypeId");

  // Without a voucher type nothing can be posted, so it is the one required
  // value — the rest are optional ids.
  if (receiptVoucherTypeId <= 0) {
    return { message: "Voucher Type Id is required and must be greater than zero." };
  }

  const body = {
    ReceiptVoucherTypeId: receiptVoucherTypeId,
    ReceiptVoucherTypeName: String(formData.get("receiptVoucherTypeName") ?? "").trim() || null,
    VoucherNoPrefix: String(formData.get("voucherNoPrefix") ?? "").trim() || null,
    FiscalYearId: readOptionalInt(formData, "fiscalYearId"),
    TaxYearId: readOptionalInt(formData, "taxYearId"),
    CompanyId: readOptionalInt(formData, "companyId"),
    FundSourceId: readOptionalInt(formData, "fundSourceId"),
    ProjectId: readOptionalInt(formData, "projectId"),
    IsActive: String(formData.get("isActive") ?? "") === "on",
  };

  try {
    if (isEdit) {
      await updateVoucherSetting(Number.parseInt(idRaw, 10), body);
    } else {
      const purpose = String(formData.get("purpose") ?? "").trim();
      if (!purpose) return { message: "Choose what this voucher type is used for." };

      await createVoucherSetting({ Purpose: purpose, ...body });
    }

    revalidatePath(PAGE);
    return { success: true, message: isEdit ? "Voucher type updated." : "Voucher type added." };
  } catch (error) {
    return { message: getApiErrorMessage(error) };
  }
}

export async function toggleVoucherSettingAction(formData) {
  const id = readId(formData);
  const isActive = String(formData.get("isActive") ?? "") === "true";

  await updateVoucherSettingStatus(id, isActive);

  revalidatePath(PAGE);
  redirect(PAGE);
}

export async function deleteVoucherSettingAction(formData) {
  await deleteVoucherSetting(readId(formData));

  revalidatePath(PAGE);
  redirect(PAGE);
}
