"use server";

import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";
import { ADMIN_USER_COOKIE, serializeAdminUser } from "@/lib/admin-auth";
import { getCurrentVolunteerUser } from "@/lib/volunteer-session";
import { updateVolunteerProfile } from "@/lib/api/volunteer-portal-service";
import { volunteerPayload, volunteerErrorMessage } from "@/lib/volunteer-registration";

export async function saveVolunteerProfileAction(input) {
  const user = await getCurrentVolunteerUser();
  try {
    const profile = await updateVolunteerProfile(volunteerPayload(input));
    const sessionUser = { ...user.raw, userId: user.id, fullName: profile.name,
      email: profile.email, mobile: profile.phone, roleName: "Volunteer", roleNames: ["Volunteer"] };
    (await cookies()).set(ADMIN_USER_COOKIE, serializeAdminUser(sessionUser), {
      httpOnly: true, sameSite: "lax", path: "/", secure: process.env.NODE_ENV === "production", maxAge: 60 * 60 * 8,
    });
    revalidatePath("/volunteer", "layout");
    revalidatePath("/admin/volunteers");
    return { ok: true, user: sessionUser };
  } catch (error) { return { ok: false, message: volunteerErrorMessage(error) }; }
}
