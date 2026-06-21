"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import { ADMIN_SESSION_COOKIE } from "@/lib/admin-auth";
import { authApiClient } from "@/lib/api/server-client";
import {
  updateAdminBoardMemberStatus,
  deleteAdminBoardMember,
} from "@/lib/api/admin-board-member-service";

async function getAccessToken() {
  const cookieStore = await cookies();
  return cookieStore.get(ADMIN_SESSION_COOKIE)?.value ?? "";
}

async function uploadFormData(endpoint, method, formData) {
  const token = await getAccessToken();

  try {
    const response = await authApiClient.request({
      method,
      url: endpoint,
      data: formData,
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data ?? null;
  } catch (error) {
    const message =
      error?.response?.data?.message ??
      error?.response?.data?.title ??
      error?.message ??
      "Request failed.";
    throw new Error(message);
  }
}

function readId(formData) {
  const id = Number.parseInt(String(formData.get("id") ?? ""), 10);
  if (!Number.isFinite(id) || id <= 0) {
    throw new Error("Valid board member id is required.");
  }
  return id;
}

function readReturnPath(formData) {
  const returnPath = String(formData.get("returnPath") ?? "/admin/Board_Member_Page");
  return returnPath.startsWith("/admin/Board_Member_Page")
    ? returnPath
    : "/admin/Board_Member_Page";
}

function str(formData, key) {
  return String(formData.get(key) ?? "").trim();
}

function buildBackendFormData(formData) {
  const fd = new FormData();

  const serialNo = Number.parseInt(str(formData, "serialNo"), 10);
  fd.set("SerialNo", String(Number.isFinite(serialNo) ? serialNo : 0));

  fd.set("NameEn", str(formData, "nameEn"));
  fd.set("NameBn", str(formData, "nameBn"));
  fd.set("NameDk", str(formData, "nameDk"));
  fd.set("DesignationEn", str(formData, "designationEn"));
  fd.set("DesignationBn", str(formData, "designationBn"));
  fd.set("DesignationDk", str(formData, "designationDk"));
  fd.set("OrganizationNameEn", str(formData, "organizationNameEn"));
  fd.set("OrganizationNameBn", str(formData, "organizationNameBn"));
  fd.set("OrganizationNameDk", str(formData, "organizationNameDk"));
  fd.set("ResponsibilityNoteEn", str(formData, "responsibilityNoteEn"));
  fd.set("ResponsibilityNoteBn", str(formData, "responsibilityNoteBn"));
  fd.set("ResponsibilityNoteDk", str(formData, "responsibilityNoteDk"));

  // getAll picks up both the hidden "false" fallback and the checkbox "true" if checked;
  // last value wins — checkbox appears after the hidden input in DOM order.
  const isActiveValues = formData.getAll("isActive");
  const isActive = isActiveValues.at(-1) === "true";
  fd.set("IsActive", String(isActive));

  const profileImage = formData.get("profileImage");
  if (profileImage && profileImage instanceof File && profileImage.size > 0) {
    fd.set("ProfileImage", profileImage, profileImage.name);
  }

  return fd;
}

export async function createBoardMemberAction(formData) {
  const fd = buildBackendFormData(formData);
  await uploadFormData("BoardMembers/add", "POST", fd);

  revalidatePath("/admin/Board_Member_Page");
  redirect("/admin/Board_Member_Page");
}

export async function updateBoardMemberAction(formData) {
  const id = readId(formData);
  const returnTo = String(formData.get("returnTo") ?? "/admin/Board_Member_Page");
  const safeReturn = returnTo.startsWith("/admin") ? returnTo : "/admin/Board_Member_Page";

  const fd = buildBackendFormData(formData);
  await uploadFormData(`BoardMembers/${id}`, "PUT", fd);

  revalidatePath("/admin/Board_Member_Page");
  redirect(safeReturn);
}

export async function updateBoardMemberStatusAction(formData) {
  const returnPath = readReturnPath(formData);
  const revalidateTarget = returnPath.split("?")[0] || "/admin/Board_Member_Page";

  await updateAdminBoardMemberStatus(
    readId(formData),
    formData.get("isActive") === "true",
  );

  revalidatePath("/admin/Board_Member_Page");
  revalidatePath(revalidateTarget);
  redirect(returnPath);
}

export async function deleteBoardMemberAction(formData) {
  await deleteAdminBoardMember(readId(formData));

  const returnPath = readReturnPath(formData);
  revalidatePath("/admin/Board_Member_Page");
  redirect(returnPath);
}
