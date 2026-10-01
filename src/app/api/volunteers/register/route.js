import { NextResponse } from "next/server";
import { apiPost } from "@/lib/api/api-service";
import { volunteerPayload, volunteerErrorMessage } from "@/lib/volunteer-registration";

export const runtime = "nodejs";

export async function POST(request) {
  let body;
  try { body = await request.json(); }
  catch { return NextResponse.json({ message: "Invalid registration data." }, { status: 400 }); }
  if (!body || typeof body !== "object" || Array.isArray(body)) {
    return NextResponse.json({ message: "Invalid registration data." }, { status: 400 });
  }
  try {
    const result = await apiPost("Volunteers/register", volunteerPayload(body));
    return NextResponse.json(result, { status: 201 });
  } catch (error) {
    return NextResponse.json({ message: volunteerErrorMessage(error) }, { status: error.status || 500 });
  }
}
