import { cookies } from "next/headers";
import { ADMIN_SESSION_COOKIE } from "@/lib/admin-auth";
import { authApiClient } from "@/lib/api/server-client";

export async function POST(request) {
  const cookieStore = await cookies();
  const token = cookieStore.get(ADMIN_SESSION_COOKIE)?.value;
  if (!token) {
    return Response.json({ message: "Unauthorized." }, { status: 401 });
  }

  let formData;
  try {
    formData = await request.formData();
  } catch {
    return Response.json({ message: "Invalid form data." }, { status: 400 });
  }

  // Convert Next.js FormData (Web API) to Node.js FormData for axios
  const { default: FormDataNode } = await import("form-data");
  const axiosForm = new FormDataNode();
  for (const [key, value] of formData.entries()) {
    if (value instanceof File) {
      const buffer = Buffer.from(await value.arrayBuffer());
      axiosForm.append(key, buffer, {
        filename: value.name,
        contentType: value.type,
        knownLength: buffer.length,
      });
    } else {
      axiosForm.append(key, value);
    }
  }

  try {
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
    return Response.json(res.data, { status: res.status });
  } catch (err) {
    const status = err?.status ?? err?.response?.status ?? 502;
    const message = err?.message ?? "Upload failed.";
    return Response.json({ message }, { status });
  }
}
