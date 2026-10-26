"use server";

import { revalidatePath } from "next/cache";
import { setVolunteerQuerySeen } from "@/lib/api/volunteer-query-service";
import { getApiErrorMessage } from "@/lib/api/api-error";

export async function setVolunteerQuerySeenAction(id, isSeen) {
  try {
    const query = await setVolunteerQuerySeen(id, isSeen);
    revalidatePath("/admin/volunteer-queries");
    revalidatePath("/volunteer/send-query");
    return { success: true, query };
  } catch (error) {
    return { success: false, message: getApiErrorMessage(error) };
  }
}
