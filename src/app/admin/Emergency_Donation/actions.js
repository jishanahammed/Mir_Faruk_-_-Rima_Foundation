"use server";

import { revalidatePath } from "next/cache";
import {
  createAdminEmergencyCampaign,
  updateAdminEmergencyCampaign,
  updateAdminEmergencyCampaignStatus,
  deleteAdminEmergencyCampaign,
} from "@/lib/api/admin-emergency-campaign-service";
import {
  uploadEmergencyCampaignImages,
  deleteEmergencyCampaignImage,
} from "@/lib/api/admin-emergency-upload-service";

function str(fd, key) {
  return String(fd.get(key) ?? "").trim();
}

function num(fd, key) {
  const v = str(fd, key);
  return v ? Number(v) : null;
}

function bool(fd, key) {
  return fd.get(key) === "on" || fd.get(key) === "true";
}

function readId(fd) {
  const id = Number.parseInt(str(fd, "id"), 10);
  if (!Number.isFinite(id) || id <= 0) throw new Error("Valid ID is required.");
  return id;
}

function buildPayload(fd) {
  const imagePaths = fd.getAll("imagePaths").map((v) => String(v).trim()).filter(Boolean);
  return {
    TitleEn:                   str(fd, "titleEn"),
    TitleBn:                   str(fd, "titleBn"),
    TitleDk:                   str(fd, "titleDk") || null,
    Slug:                      str(fd, "slug") || null,
    EmergencyCategoryId:       num(fd, "emergencyCategoryId"),
    ShortDescriptionEn:        str(fd, "shortDescriptionEn"),
    ShortDescriptionBn:        str(fd, "shortDescriptionBn"),
    ShortDescriptionDk:        str(fd, "shortDescriptionDk") || null,
    DescriptionEn:             str(fd, "descriptionEn"),
    DescriptionBn:             str(fd, "descriptionBn"),
    DescriptionDk:             str(fd, "descriptionDk") || null,
    TargetAmount:              num(fd, "targetAmount") ?? 0,
    CollectedAmount:           num(fd, "collectedAmount"),
    OfflineCollectedAmount:    num(fd, "offlineCollectedAmount"),
    BeneficiaryName:           str(fd, "beneficiaryName") || null,
    BeneficiaryPhone:          str(fd, "beneficiaryPhone") || null,
    BeneficiaryAddressEn:      str(fd, "beneficiaryAddressEn") || null,
    BeneficiaryAddressBn:      str(fd, "beneficiaryAddressBn") || null,
    BeneficiaryAddressDk:      str(fd, "beneficiaryAddressDk") || null,
    HospitalOrInstitutionName: str(fd, "hospitalOrInstitutionName") || null,
    ReferenceNumber:           str(fd, "referenceNumber") || null,
    CoverImageUrl:             str(fd, "coverImageUrl") || null,
    IsFeatured:                bool(fd, "isFeatured"),
    IsUrgent:                  bool(fd, "isUrgent"),
    IsVerified:                bool(fd, "isVerified"),
    Status:                    str(fd, "status") || "draft",
    StartDateUtc:              str(fd, "startDateUtc") || null,
    EndDateUtc:                str(fd, "endDateUtc") || null,
    SortOrder:                 num(fd, "sortOrder"),
    ImagePaths:                imagePaths,
  };
}

function revalidate() {
  revalidatePath("/admin/Emergency_Donation");
}

export async function createEmergencyCampaignAction(fd) {
  await createAdminEmergencyCampaign(buildPayload(fd));
  revalidate();
}

export async function updateEmergencyCampaignAction(fd) {
  await updateAdminEmergencyCampaign(readId(fd), buildPayload(fd));
  revalidate();
}

export async function updateEmergencyCampaignStatusAction(fd) {
  const id = readId(fd);
  const status = str(fd, "status");
  await updateAdminEmergencyCampaignStatus(id, status);
  revalidate();
}

export async function deleteEmergencyCampaignAction(fd) {
  await deleteAdminEmergencyCampaign(readId(fd));
  revalidate();
}

export async function uploadEmergencyImagesAction(fd) {
  return uploadEmergencyCampaignImages(fd);
}

export async function deleteEmergencyImageAction(fd) {
  const imagePath = str(fd, "imagePath");
  await deleteEmergencyCampaignImage(imagePath);
}
