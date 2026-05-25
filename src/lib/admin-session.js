import { cookies } from "next/headers";
import { ADMIN_USER_COOKIE, parseAdminUser } from "@/lib/admin-auth";

export async function getCurrentAdminUser() {
  const cookieStore = await cookies();
  return parseAdminUser(cookieStore.get(ADMIN_USER_COOKIE)?.value);
}
