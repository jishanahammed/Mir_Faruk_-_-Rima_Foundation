import { NextResponse } from "next/server";
import { ApiError, getApiErrorMessage } from "@/lib/api/api-error";
import { resetPassword } from "@/lib/api/auth-service";

export const runtime = "nodejs";

function extractStatus(error) {
  if (error instanceof ApiError && error.status) {
    return error.status;
  }

  return 400;
}

export async function POST(request) {
  try {
    const body = await request.json().catch(() => ({}));
    const email = String(body?.email ?? "").trim();
    const otp = String(body?.otp ?? "").trim();
    const newPassword = String(body?.newPassword ?? "");
    const confirmPassword = String(body?.confirmPassword ?? "");

    if (!email || !otp || !newPassword || !confirmPassword) {
      return NextResponse.json({ message: "All fields are required." }, { status: 400 });
    }

    const result = await resetPassword({ email, otp, newPassword, confirmPassword });
    return NextResponse.json({ message: result.message }, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { message: getApiErrorMessage(error) },
      { status: extractStatus(error) },
    );
  }
}
