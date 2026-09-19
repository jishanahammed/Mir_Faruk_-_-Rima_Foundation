"use server";

import { revalidatePath } from "next/cache";
import { saveAdminAccountingCredential } from "@/lib/api/admin-accounting-credential-service";

function str(fd, key) {
  return String(fd.get(key) ?? "").trim();
}

export async function saveAccountingCredentialAction(fd) {
  await saveAdminAccountingCredential({
    Name:        str(fd, "name"),
    UserName:    str(fd, "userName"),
    // Blank means "keep the stored password" — send null rather than an empty
    // string so the API leaves the existing value alone.
    Password:    str(fd, "password") || null,
    LoginApiUrl: str(fd, "loginApiUrl"),
    Notes:       str(fd, "notes") || null,
    IsActive:    fd.get("isActive") !== null,
  });

  revalidatePath("/admin/accounting-credentials");
}
