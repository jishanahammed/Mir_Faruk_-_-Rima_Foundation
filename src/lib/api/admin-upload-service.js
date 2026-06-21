"use server";

import "server-only";
import FormData from "form-data";
import { cookies } from "next/headers";
import { ApiError } from "@/lib/api/api-error";
import { ADMIN_SESSION_COOKIE } from "@/lib/admin-auth";
import { authApiClient } from "@/lib/api/server-client";

async function getToken() {
  const cookieStore = await cookies();
  const token = cookieStore.get(ADMIN_SESSION_COOKIE)?.value;
  if (!token) throw new ApiError("Admin session token is missing.");
  return token;
}

export async function uploadProjectImages(webFormData) {
  const token = await getToken();

  // Convert Web API FormData (File objects) → Node form-data (Buffer) for axios
  const axiosForm = new FormData();
  for (const [key, value] of webFormData.entries()) {
    if (value && typeof value === "object" && typeof value.arrayBuffer === "function") {
      const buffer = Buffer.from(await value.arrayBuffer());
      axiosForm.append(key, buffer, {
        filename: value.name || "upload",
        contentType: value.type || "application/octet-stream",
        knownLength: buffer.length,
      });
    } else {
      axiosForm.append(key, String(value));
    }
  }

  const res = await authApiClient.post(
    "FoundationProjects/upload-images",
    axiosForm,
    {
      headers: {
        Authorization: `Bearer ${token}`,
        ...axiosForm.getHeaders(),
      },
      maxBodyLength: Infinity,
      maxContentLength: Infinity,
    }
  );

  return res.data; // { urls: string[], errors: string[] }
}

export async function deleteProjectImage(imagePath) {
  const token = await getToken();
  await authApiClient.delete("FoundationProjects/delete-image", {
    headers: { Authorization: `Bearer ${token}` },
    data: { ImagePath: imagePath },
  });
}
