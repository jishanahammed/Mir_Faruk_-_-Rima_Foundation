import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";
import { ADMIN_SESSION_COOKIE } from "@/lib/admin-auth";
import { authApiClient } from "@/lib/api/server-client";

const MAX_IMAGE_SIZE = 5 * 1024 * 1024;
const MAX_REQUEST_SIZE = 6 * 1024 * 1024;
const IMAGE_TYPES = new Set(["image/jpeg", "image/png", "image/webp"]);

function errorResponse(message, status) {
  return Response.json({ success: false, error: message }, { status });
}

function apiErrorMessage(error) {
  const errors = error?.details?.errors ?? error?.response?.data?.errors;
  const first = errors && Object.values(errors).flat()[0];
  return String(first ?? error?.message ?? "The request failed.");
}

export async function POST(request) {
  const token = (await cookies()).get(ADMIN_SESSION_COOKIE)?.value;
  if (!token) return errorResponse("Admin session token is missing.", 401);

  const origin = request.headers.get("origin");
  if (origin && new URL(origin).host !== request.headers.get("host")) {
    return errorResponse("Invalid request origin.", 403);
  }

  const contentLength = Number(request.headers.get("content-length"));
  if (contentLength > MAX_REQUEST_SIZE) {
    return errorResponse("Request is too large. The image must be 5 MB or smaller.", 413);
  }

  let formData;
  try {
    formData = await request.formData();
  } catch {
    return errorResponse("Could not read the form. Please try again.", 400);
  }

  const image = formData.get("image");
  if (image instanceof File && image.size > 0) {
    if (image.size > MAX_IMAGE_SIZE) return errorResponse("The image must be 5 MB or smaller.", 413);
    if (!IMAGE_TYPES.has(image.type)) return errorResponse("Choose a JPG, PNG, or WebP image.", 400);
  }

  const idRaw = String(formData.get("id") ?? "").trim();
  const id = idRaw ? Number(idRaw) : 0;
  const orderNo = Number(formData.get("orderNo"));
  if (!Number.isSafeInteger(id) || id < 0) return errorResponse("Invalid council member ID.", 400);
  if (!Number.isSafeInteger(orderNo) || orderNo < 0) return errorResponse("Order number must be zero or greater.", 400);
  if (["name", "designation", "objective"].some((field) => !String(formData.get(field) ?? "").trim())) {
    return errorResponse("Name, designation, and objective are required.", 400);
  }

  const payload = new FormData();
  for (const field of ["name", "designation", "objective", "phoneNumber", "emailAddress", "description"]) {
    payload.set(field, String(formData.get(field) ?? "").trim());
  }
  payload.set("orderNo", String(orderNo));
  if (image instanceof File && image.size > 0) payload.set("image", image, image.name);

  try {
    await authApiClient.request({
      method: id > 0 ? "PUT" : "POST",
      url: id > 0 ? `AdvisoryCouncil/${id}` : "AdvisoryCouncil",
      headers: { Authorization: `Bearer ${token}`, "Content-Type": "multipart/form-data" },
      data: payload,
    });
    revalidatePath("/admin/advisory-council");
    return Response.json({ success: true });
  } catch (error) {
    return errorResponse(apiErrorMessage(error), error.status >= 400 && error.status < 500 ? error.status : 502);
  }
}
