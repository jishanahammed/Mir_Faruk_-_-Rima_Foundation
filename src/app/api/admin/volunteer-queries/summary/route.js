import { NextResponse } from "next/server";
import { getVolunteerQuerySummary } from "@/lib/api/volunteer-query-service";
import { getApiErrorMessage } from "@/lib/api/api-error";

export async function GET() {
  try {
    return NextResponse.json(await getVolunteerQuerySummary(), { headers: { "Cache-Control": "no-store" } });
  } catch (error) {
    const status = [401, 403].includes(error.status) ? error.status : 503;
    return NextResponse.json({ message: getApiErrorMessage(error) }, { status, headers: { "Cache-Control": "no-store" } });
  }
}
