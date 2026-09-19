import "server-only";

import { apiPost } from "@/lib/api/api-service";

/**
 * Submits a donor's transaction details. Public — no auth header — because a
 * donor may give before they ever create an account.
 */
export async function submitDonationTransactionQuery(data) {
  const payload = await apiPost("DonationTransactionQueries", data);
  return {
    message: payload?.message ?? payload?.Message ?? "",
    id: payload?.id ?? payload?.Id ?? null,
    // True when the backend matched this report to an existing donor record.
    isLinked: Boolean(payload?.isLinked ?? payload?.IsLinked ?? false),
  };
}
