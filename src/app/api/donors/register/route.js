import { NextResponse } from "next/server";
import { ApiError } from "@/lib/api/api-error";
import { registerDonor } from "@/lib/api/donor-service";

export const runtime = "nodejs";

function extractMessage(error) {
  if (error instanceof ApiError) {
    const detailErrors = error.details?.errors;

    if (detailErrors && typeof detailErrors === "object") {
      const firstError = Object.values(detailErrors).flat().find(Boolean);

      if (firstError) {
        return firstError;
      }
    }

    return error.message;
  }

  return error?.message ?? "Unable to complete donor registration right now.";
}

function extractStatus(error) {
  if (error instanceof ApiError && error.status) {
    return error.status;
  }

  return 500;
}

export async function POST(request) {
  try {
    const body = await request.json();
    const result = await registerDonor(body);

    return NextResponse.json(result, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      {
        message: extractMessage(error),
      },
      { status: extractStatus(error) },
    );
  }
}
