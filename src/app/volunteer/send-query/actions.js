"use server";

import { revalidatePath } from "next/cache";
import { createVolunteerQuery } from "@/lib/api/volunteer-query-service";
import { getApiErrorMessage } from "@/lib/api/api-error";
import { validateVolunteerQuery } from "@/lib/volunteer-query-utils";

export async function sendVolunteerQueryAction(_previousState, formData) {
  const subject = String(formData.get("subject") ?? "").trim();
  const message = String(formData.get("message") ?? "").trim();
  const errors = validateVolunteerQuery(subject, message);
  if (Object.keys(errors).length) return { success: false, errors, message: "Please check the highlighted fields." };
  try {
    const query = await createVolunteerQuery({ subject, message });
    revalidatePath("/volunteer/send-query");
    revalidatePath("/admin/volunteer-queries");
    return { success: true, queryId: query.id, message: `Query #${query.id} has been sent to the admin team.` };
  } catch (error) {
    return { success: false, message: getApiErrorMessage(error) };
  }
}
