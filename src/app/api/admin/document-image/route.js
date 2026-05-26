import { cookies } from "next/headers";
import { ADMIN_SESSION_COOKIE } from "@/lib/admin-auth";
import { authApiClient } from "@/lib/api/server-client";

function getApiOrigin() {
  try {
    return new URL(process.env.AUTH_API_BASE_URL).origin;
  } catch {
    return "";
  }
}

function resolveDocumentUrl(value) {
  const raw = String(value ?? "").trim().replace(/\\/g, "/");
  const apiOrigin = getApiOrigin();

  if (!raw || !apiOrigin) {
    return null;
  }

  try {
    const url = /^https?:\/\//i.test(raw)
      ? new URL(raw)
      : new URL(raw.replace(/^~\//, "").replace(/^\/+/, ""), `${apiOrigin}/`);

    return url.origin === apiOrigin ? url.toString() : null;
  } catch {
    return null;
  }
}

export async function GET(request) {
  const requestUrl = new URL(request.url);
  const documentUrl = resolveDocumentUrl(requestUrl.searchParams.get("url"));

  if (!documentUrl) {
    return new Response("Invalid document URL.", { status: 400 });
  }

  const cookieStore = await cookies();
  const accessToken = cookieStore.get(ADMIN_SESSION_COOKIE)?.value;

  try {
    const response = await authApiClient.get(documentUrl, {
      responseType: "arraybuffer",
      headers: {
        Accept: "image/*",
        ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
      },
    });

    return new Response(response.data, {
      headers: {
        "Cache-Control": "private, max-age=60",
        "Content-Type": response.headers["content-type"] ?? "image/jpeg",
      },
    });
  } catch {
    return new Response("Unable to load document image.", { status: 502 });
  }
}
