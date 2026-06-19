"use server";

import { revalidatePath } from "next/cache";
import { getApiErrorMessage } from "@/lib/api/api-error";
import { updateCurrentDonorProfile } from "@/lib/api/donor-portal-service";
import { getCurrentDonorUser } from "@/lib/donor-session";

function readRequiredText(formData, name, label) {
  const value = String(formData.get(name) ?? "").trim();

  if (!value) {
    return { error: `${label} is required.` };
  }

  return { value };
}

export async function updateDonerProfileAction(_state, formData) {
  const fullName = readRequiredText(formData, "fullName", "Full name");
  const email = readRequiredText(formData, "email", "Email address");
  const mobile = readRequiredText(formData, "mobile", "Mobile number");
  const address = readRequiredText(formData, "address", "Address");
  const validationError = [fullName, email, mobile, address].find((item) => item.error);

  if (validationError) {
    return { message: validationError.error };
  }

  try {
    const user = await getCurrentDonorUser();

    await updateCurrentDonorProfile(user, {
      FullName: fullName.value,
      Email: email.value,
      Mobile: mobile.value,
      Address: address.value,
      Profession: String(formData.get("profession") ?? "").trim(),
      DonorType: String(formData.get("donorType") ?? "").trim(),
      Purpose: String(formData.get("purpose") ?? "").trim(),
      Frequency: String(formData.get("frequency") ?? "").trim(),
      ContactFullName: String(formData.get("contactFullName") ?? "").trim(),
      ContactMobile: String(formData.get("contactMobile") ?? "").trim(),
      ContactTelephone: String(formData.get("contactTelephone") ?? "").trim(),
    });

    revalidatePath("/doner");
    revalidatePath("/doner/profile");

    return {
      success: true,
      message: "Your donor profile has been updated successfully.",
    };
  } catch (error) {
    return {
      message: getApiErrorMessage(error),
    };
  }
}
