import { NextResponse } from "next/server";
import { ApiError } from "@/lib/api/api-error";
import { apiTimeouts, assertApiConfigured, authApiClient } from "@/lib/api/server-client";

export const runtime = "nodejs";

export async function GET(request) {
  try {
    assertApiConfigured();

    const localGovernmentId = new URL(request.url).searchParams.get("localGovernmentId");

    const response = await authApiClient.request({
      method: "get",
      url: "Locations/wards",
      params: localGovernmentId ? { localGovernmentId } : undefined,
      timeout: apiTimeouts.default,
    });

    return NextResponse.json(response.data ?? [], { status: 200 });
  } catch (error) {
    const status = error instanceof ApiError && error.status ? error.status : 500;
    const message =
      error instanceof ApiError ? error.message : "Unable to load wards right now.";

    return NextResponse.json({ message }, { status });
  }
}
