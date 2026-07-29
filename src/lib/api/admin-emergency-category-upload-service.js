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

export async function uploadEmergencyCategoryImage(webFormData) {
  const token = await getToken();

  const file = webFormData.get("file");
  const axiosForm = new FormData();
  if (file && typeof file === "object" && typeof file.arrayBuffer === "function") {
    const buffer = Buffer.from(await file.arrayBuffer());
    axiosForm.append("file", buffer, {
      filename: file.name || "upload",
      contentType: file.type || "application/octet-stream",
      knownLength: buffer.length,
    });
  }

  const res = await authApiClient.post(
    "EmergencyCategories/upload-image",
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

  return res.data; // { url: string }
}

export async function deleteEmergencyCategoryImage(imagePath) {
  const token = await getToken();
  await authApiClient.delete("EmergencyCategories/delete-image", {
    headers: { Authorization: `Bearer ${token}` },
    data: { ImagePath: imagePath },
  });
}
