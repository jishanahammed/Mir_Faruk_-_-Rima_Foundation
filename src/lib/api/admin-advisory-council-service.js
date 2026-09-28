import "server-only";

import { cookies } from "next/headers";
import { ADMIN_SESSION_COOKIE } from "@/lib/admin-auth";
import { apiGet } from "@/lib/api/api-service";
import { ApiError } from "@/lib/api/api-error";

export async function getAdvisoryCouncil() {
  const token = (await cookies()).get(ADMIN_SESSION_COOKIE)?.value;
  if (!token) throw new ApiError("Admin session token is missing.");

  const result = await apiGet("AdvisoryCouncil", {
    headers: { Authorization: `Bearer ${token}` },
  });

  return (Array.isArray(result) ? result : []).map((item) => {
    const imagePath = String(item.imageUrl ?? item.ImageUrl ?? "");
    const normalizedPath = imagePath.replace(/\\/g, "/").replace(/^~\//, "").replace(/^\/+/, "");
    return {
      id: item.id ?? item.Id,
      name: item.name ?? item.Name ?? "",
      designation: item.designation ?? item.Designation ?? "",
      objective: item.objective ?? item.Objective ?? "",
      phoneNumber: item.phoneNumber ?? item.PhoneNumber ?? "",
      emailAddress: item.emailAddress ?? item.EmailAddress ?? "",
      orderNo: item.orderNo ?? item.OrderNo ?? 0,
      description: item.description ?? item.Description ?? "",
      imageUrl: normalizedPath ? `/api/asset?path=${encodeURIComponent(normalizedPath)}` : "",
    };
  });
}
