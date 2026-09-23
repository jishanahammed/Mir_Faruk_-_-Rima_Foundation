import "server-only";

import { cookies } from "next/headers";
import { ApiError } from "@/lib/api/api-error";
import { apiGet } from "@/lib/api/api-service";
import { ADMIN_SESSION_COOKIE } from "@/lib/admin-auth";

function pick(payload, camelKey, pascalKey, fallback) {
  return payload?.[camelKey] ?? payload?.[pascalKey] ?? fallback;
}

async function authConfig() {
  const cookieStore = await cookies();
  const token = cookieStore.get(ADMIN_SESSION_COOKIE)?.value;
  if (!token) throw new ApiError("Admin session token is missing.");
  return { headers: { Authorization: `Bearer ${token}` } };
}

function normalizePaymentLedger(p) {
  if (!p) return null;

  const id = Number(pick(p, "id", "Id", 0)) || 0;
  if (!id) return null;

  const subLedgerRaw = pick(p, "subLadgerId", "SubLadgerId", null);
  const subLedgerId = Number(subLedgerRaw) || 0;

  return {
    id,
    // The provider spells it "subLadgerId"; kept as-is on the wire, corrected here.
    subLedgerId: subLedgerId > 0 ? subLedgerId : null,
    // Anything above zero means the account posts through its sub-ledger.
    haveSubLedger: Number(pick(p, "haveSubLedger", "HaveSubLedger", 0)) > 0,
    groupId: Number(pick(p, "groupId", "GroupId", 0)) || 0,
    natureId: Number(pick(p, "natureId", "NatureId", 0)) || 0,
    accountCode: pick(p, "accountCode", "AccountCode", ""),
    accountName: pick(p, "accountName", "AccountName", ""),
    ledgerType: pick(p, "ledgerType", "LedgerType", ""),
  };
}

/**
 * Cash and bank accounts from the accounting system, for the payment dropdown.
 *
 * A provider-side failure is reported rather than thrown, so the page still
 * renders and the admin is told why the dropdown is empty.
 */
export async function getPaymentLedgers() {
  try {
    const payload = await apiGet("accounting/dropdown/payment-ledgers", await authConfig());
    const list = pick(payload, "list", "List", []);

    return {
      success: pick(payload, "success", "Success", false),
      message: pick(payload, "message", "Message", ""),
      list: (Array.isArray(list) ? list : []).map(normalizePaymentLedger).filter(Boolean),
    };
  } catch (err) {
    return {
      success: false,
      message: err?.message ?? "Could not load payment accounts.",
      list: [],
    };
  }
}
