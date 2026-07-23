import { NextResponse } from "next/server";
import { getApiErrorMessage } from "@/lib/api/api-error";
import { forgotPassword } from "@/lib/api/auth-service";

export const runtime = "nodejs";

export async function POST(request) {
  try {
    const body = await request.json().catch(() => ({}));
    const email = String(body?.email ?? "").trim();

    if (!email) {
      return NextResponse.json({ message: "Email address is required." }, { status: 400 });
    }

    const result = await forgotPassword({ email });
    return NextResponse.json({ message: result.message }, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { message: getApiErrorMessage(error) },
      { status: 500 },
    );
  }
}
