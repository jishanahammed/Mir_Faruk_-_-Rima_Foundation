import { redirect } from "next/navigation";
import { getCurrentAdminUser } from "@/lib/admin-session";
import { getUserHomePath, isDonorUser } from "@/lib/admin-auth";

export async function getCurrentDonorUser() {
  const user = await getCurrentAdminUser();

  if (!isDonorUser(user)) {
    redirect(getUserHomePath(user));
  }

  return user;
}
