"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { getApiErrorMessage } from "@/lib/api/api-error";
import {
  createAccountingEndpoint,
  deleteAccountingEndpoint,
  updateAccountingEndpoint,
  updateAccountingEndpointStatus,
} from "@/lib/api/admin-accounting-settings-service";

const PAGE = "/admin/accounting-endpoints";

function readId(formData) {
  const id = Number.parseInt(String(formData.get("id") ?? ""), 10);
  if (!Number.isFinite(id) || id <= 0) {
    throw new Error("Valid endpoint id is required.");
  }
  return id;
}

function readUrl(formData) {
  const url = String(formData.get("apiUrl") ?? "").trim();
  if (!url) return { error: "API URL is required." };

  // Caught here so an obvious typo never reaches the integration; the server
  // validates again, since this action is not the only way in.
  try {
    const parsed = new URL(url);
    if (parsed.protocol !== "http:" && parsed.protocol !== "https:") {
      return { error: "API URL must start with http:// or https://." };
    }
  } catch {
    return { error: `"${url}" is not a valid URL.` };
  }

  return { value: url };
}

export async function saveAccountingEndpointAction(_state, formData) {
  const idRaw = String(formData.get("id") ?? "").trim();
  const isEdit = Boolean(idRaw);
  const url = readUrl(formData);

  if (url.error) return { message: url.error };

  const displayName = String(formData.get("displayName") ?? "").trim();
  const description = String(formData.get("description") ?? "").trim();
  const isActive = String(formData.get("isActive") ?? "") === "on";

  try {
    if (isEdit) {
      await updateAccountingEndpoint(Number.parseInt(idRaw, 10), {
        DisplayName: displayName || null,
        ApiUrl: url.value,
        Description: description || null,
        IsActive: isActive,
      });
    } else {
      const endpointKey = String(formData.get("endpointKey") ?? "").trim();
      if (!endpointKey) return { message: "Choose which endpoint this is." };

      await createAccountingEndpoint({
        EndpointKey: endpointKey,
        DisplayName: displayName || null,
        ApiUrl: url.value,
        Description: description || null,
        IsActive: isActive,
      });
    }

    revalidatePath(PAGE);
    return { success: true, message: isEdit ? "Endpoint updated." : "Endpoint added." };
  } catch (error) {
    return { message: getApiErrorMessage(error) };
  }
}

export async function toggleAccountingEndpointAction(formData) {
  const id = readId(formData);
  const isActive = String(formData.get("isActive") ?? "") === "true";

  await updateAccountingEndpointStatus(id, isActive);

  revalidatePath(PAGE);
  redirect(PAGE);
}

export async function deleteAccountingEndpointAction(formData) {
  await deleteAccountingEndpoint(readId(formData));

  revalidatePath(PAGE);
  redirect(PAGE);
}
