"use server";

import { revalidatePath } from "next/cache";
import {
  createAdminDivision, updateAdminDivision, deleteAdminDivision, setAdminDivisionActiveStatus,
  createAdminDistrict, updateAdminDistrict, deleteAdminDistrict, setAdminDistrictActiveStatus,
  createAdminUpazila, updateAdminUpazila, deleteAdminUpazila, setAdminUpazilaActiveStatus,
  createAdminLocalGovernment, updateAdminLocalGovernment, deleteAdminLocalGovernment, setAdminLocalGovernmentActiveStatus,
  createAdminWard, updateAdminWard, deleteAdminWard, setAdminWardActiveStatus,
  LOCAL_GOVERNMENT_TYPE_OPTIONS,
} from "@/lib/api/admin-location-service";

function str(formData, key) {
  return String(formData.get(key) ?? "").trim();
}

function readId(formData) {
  const id = Number.parseInt(str(formData, "id"), 10);
  if (!Number.isFinite(id) || id <= 0) throw new Error("Valid ID is required.");
  return id;
}

function readIsActive(formData) {
  return str(formData, "isActive") === "true";
}

function revalidate() {
  revalidatePath("/admin/location-page");
}

// ── Divisions ─────────────────────────────────────────────────────────────────
export async function createDivisionAction(formData) {
  await createAdminDivision({
    NameEn: str(formData, "nameEn"),
    NameBn: str(formData, "nameBn"),
    NameDk: str(formData, "nameDk") || null,
  });
  revalidate();
}

export async function updateDivisionAction(formData) {
  await updateAdminDivision(readId(formData), {
    NameEn: str(formData, "nameEn"),
    NameBn: str(formData, "nameBn"),
    NameDk: str(formData, "nameDk") || null,
  });
  revalidate();
}

export async function toggleDivisionActiveAction(formData) {
  await setAdminDivisionActiveStatus(readId(formData), readIsActive(formData));
  revalidate();
}

export async function deleteDivisionAction(formData) {
  await deleteAdminDivision(readId(formData));
  revalidate();
}

// ── Districts ─────────────────────────────────────────────────────────────────
export async function createDistrictAction(formData) {
  const divisionId = Number.parseInt(str(formData, "divisionId"), 10);
  await createAdminDistrict({
    DivisionId: divisionId,
    NameEn: str(formData, "nameEn"),
    NameBn: str(formData, "nameBn"),
    NameDk: str(formData, "nameDk") || null,
  });
  revalidate();
}

export async function updateDistrictAction(formData) {
  await updateAdminDistrict(readId(formData), {
    NameEn: str(formData, "nameEn"),
    NameBn: str(formData, "nameBn"),
    NameDk: str(formData, "nameDk") || null,
  });
  revalidate();
}

export async function toggleDistrictActiveAction(formData) {
  await setAdminDistrictActiveStatus(readId(formData), readIsActive(formData));
  revalidate();
}

export async function deleteDistrictAction(formData) {
  await deleteAdminDistrict(readId(formData));
  revalidate();
}

// ── Upazilas ──────────────────────────────────────────────────────────────────
export async function createUpazilaAction(formData) {
  const districtId = Number.parseInt(str(formData, "districtId"), 10);
  await createAdminUpazila({
    DistrictId: districtId,
    NameEn: str(formData, "nameEn"),
    NameBn: str(formData, "nameBn"),
    NameDk: str(formData, "nameDk") || null,
  });
  revalidate();
}

export async function updateUpazilaAction(formData) {
  await updateAdminUpazila(readId(formData), {
    NameEn: str(formData, "nameEn"),
    NameBn: str(formData, "nameBn"),
    NameDk: str(formData, "nameDk") || null,
  });
  revalidate();
}

export async function toggleUpazilaActiveAction(formData) {
  await setAdminUpazilaActiveStatus(readId(formData), readIsActive(formData));
  revalidate();
}

export async function deleteUpazilaAction(formData) {
  await deleteAdminUpazila(readId(formData));
  revalidate();
}

// ── Union Parishads / Pourashavas ─────────────────────────────────────────────
function readLocalGovernmentType(formData) {
  const requested = str(formData, "type");
  const match = LOCAL_GOVERNMENT_TYPE_OPTIONS.find(
    (option) => option.toLowerCase() === requested.toLowerCase(),
  );

  if (!match) throw new Error("Type must be either Union Parishad or Pourashava.");
  return match;
}

export async function createLocalGovernmentAction(formData) {
  const upazilaId = Number.parseInt(str(formData, "upazilaId"), 10);
  if (!Number.isFinite(upazilaId) || upazilaId <= 0) throw new Error("Upazila is required.");

  await createAdminLocalGovernment({
    UpazilaId: upazilaId,
    NameEn: str(formData, "nameEn"),
    NameBn: str(formData, "nameBn"),
    NameDk: str(formData, "nameDk") || null,
    Type: readLocalGovernmentType(formData),
  });
  revalidate();
}

export async function updateLocalGovernmentAction(formData) {
  await updateAdminLocalGovernment(readId(formData), {
    NameEn: str(formData, "nameEn"),
    NameBn: str(formData, "nameBn"),
    NameDk: str(formData, "nameDk") || null,
    Type: readLocalGovernmentType(formData),
  });
  revalidate();
}

export async function toggleLocalGovernmentActiveAction(formData) {
  await setAdminLocalGovernmentActiveStatus(readId(formData), readIsActive(formData));
  revalidate();
}

export async function deleteLocalGovernmentAction(formData) {
  await deleteAdminLocalGovernment(readId(formData));
  revalidate();
}

// ── Wards ─────────────────────────────────────────────────────────────────────
function readWardNo(formData) {
  const wardNo = Number.parseInt(str(formData, "wardNo"), 10);
  if (!Number.isFinite(wardNo) || wardNo <= 0) throw new Error("Ward No. must be greater than zero.");
  return wardNo;
}

export async function createWardAction(formData) {
  const localGovernmentId = Number.parseInt(str(formData, "localGovernmentId"), 10);
  if (!Number.isFinite(localGovernmentId) || localGovernmentId <= 0) {
    throw new Error("Union Parishad / Pourashava is required.");
  }

  await createAdminWard({
    LocalGovernmentId: localGovernmentId,
    WardNo: readWardNo(formData),
    NameEn: str(formData, "nameEn"),
    NameBn: str(formData, "nameBn"),
    NameDk: str(formData, "nameDk") || null,
  });
  revalidate();
}

export async function updateWardAction(formData) {
  await updateAdminWard(readId(formData), {
    WardNo: readWardNo(formData),
    NameEn: str(formData, "nameEn"),
    NameBn: str(formData, "nameBn"),
    NameDk: str(formData, "nameDk") || null,
  });
  revalidate();
}

export async function toggleWardActiveAction(formData) {
  await setAdminWardActiveStatus(readId(formData), readIsActive(formData));
  revalidate();
}

export async function deleteWardAction(formData) {
  await deleteAdminWard(readId(formData));
  revalidate();
}
