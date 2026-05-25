import { ApiError } from "@/lib/api/api-error";
import { apiPost } from "@/lib/api/api-service";
import { apiTimeouts } from "@/lib/api/server-client";

function pickMessage(payload) {
  return payload?.message ?? payload?.data?.message ?? "Donor registration completed successfully.";
}

export async function registerDonor(data) {
  const payload = await apiPost("Donors/register", data, {
    timeout: apiTimeouts.donorRegistration,
  });

  if (!payload) {
    throw new ApiError("Donor registration failed. Please try again.");
  }

  return {
    message: pickMessage(payload),
    userId: payload?.userId ?? payload?.data?.userId ?? null,
    donorProfileId: payload?.donorProfileId ?? payload?.data?.donorProfileId ?? null,
    roleName: payload?.roleName ?? payload?.data?.roleName ?? "Donor",
    raw: payload,
  };
}
