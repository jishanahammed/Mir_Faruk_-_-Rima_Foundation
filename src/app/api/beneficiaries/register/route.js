import { NextResponse } from "next/server";
import { ApiError } from "@/lib/api/api-error";
import { apiTimeouts, assertApiConfigured, authApiClient } from "@/lib/api/server-client";

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

  return error?.message ?? "Unable to complete beneficiary registration right now.";
}

function extractStatus(error) {
  if (error instanceof ApiError && error.status) {
    return error.status;
  }

  if (error instanceof ApiError && error.code === "TIMEOUT") {
    return 504;
  }

  return 500;
}

export async function POST(request) {
  try {
    assertApiConfigured();

    const formData = await request.formData();
    const response = await authApiClient.request({
      method: "post",
      url: "Beneficiaries/register",
      data: formData,
      timeout: apiTimeouts.beneficiaryRegistration,
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    return NextResponse.json(response.data ?? null, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      {
        message: extractMessage(error),
      },
      { status: extractStatus(error) },
    );
  }
}
