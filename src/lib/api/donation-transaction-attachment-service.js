"use server";

import "server-only";
import FormData from "form-data";
import { authApiClient } from "@/lib/api/server-client";

/**
 * Uploads a transaction screenshot and returns its stored URL.
 *
 * No auth header: the endpoint is public, because a donor may report a payment
 * before ever creating an account.
 */
export async function uploadDonationTransactionAttachment(webFormData) {
  const file = webFormData.get("file");

  if (!file || typeof file !== "object" || typeof file.arrayBuffer !== "function") {
    throw new Error("No file received.");
  }

  const buffer = Buffer.from(await file.arrayBuffer());
  const axiosForm = new FormData();
  axiosForm.append("file", buffer, {
    filename: file.name || "attachment",
    contentType: file.type || "application/octet-stream",
    knownLength: buffer.length,
  });

  const res = await authApiClient.post(
    "DonationTransactionQueries/upload-attachment",
    axiosForm,
    {
      headers: { ...axiosForm.getHeaders() },
      maxBodyLength: Infinity,
      maxContentLength: Infinity,
    },
  );

  return res.data; // { url: string }
}
