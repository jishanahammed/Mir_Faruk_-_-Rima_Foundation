"use server";

import { getPublicProjectAssistancesByProjectId } from "@/lib/api/public-project-assistance-service";
import { submitDonationTransactionQuery } from "@/lib/api/donation-transaction-query-service";
import { getApiErrorMessage } from "@/lib/api/api-error";

export async function fetchProjectAssistancesAction(projectId) {
  return getPublicProjectAssistancesByProjectId(projectId);
}

/**
 * Sends a donor's transaction details to the foundation. Returns a result
 * object rather than throwing, so the dialog can show the reason inline
 * instead of surfacing a runtime error overlay.
 */
export async function submitDonationTransactionQueryAction(input) {
  try {
    const result = await submitDonationTransactionQuery({
      FullName: input.fullName,
      Email: input.email,
      Mobile: input.mobile || null,
      DonorReference: input.donorReference || null,
      Message: input.message,
    });
    return { success: true, ...result };
  } catch (error) {
    return { success: false, message: getApiErrorMessage(error) };
  }
}
