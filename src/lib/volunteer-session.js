import "server-only";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { ADMIN_SESSION_COOKIE, getUserHomePath, isVolunteerUser } from "@/lib/admin-auth";
import { getCurrentAdminUser } from "@/lib/admin-session";

export async function getCurrentVolunteerUser() {
  if (!(await cookies()).get(ADMIN_SESSION_COOKIE)?.value) redirect("/login");
  const user = await getCurrentAdminUser();
  if (!isVolunteerUser(user)) redirect(getUserHomePath(user));
  return user;
}
