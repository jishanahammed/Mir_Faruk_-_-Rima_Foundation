"use server";

import { revalidatePath } from "next/cache";
import {
  createAdminDivision, updateAdminDivision, deleteAdminDivision,
  createAdminDistrict, updateAdminDistrict, deleteAdminDistrict,
  createAdminUpazila, updateAdminUpazila, deleteAdminUpazila,
} from "@/lib/api/admin-location-service";

function str(formData, key) {
  return String(formData.get(key) ?? "").trim();
}

function readId(formData) {
  const id = Number.parseInt(str(formData, "id"), 10);
  if (!Number.isFinite(id) || id <= 0) throw new Error("Valid ID is required.");
  return id;
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

export async function deleteUpazilaAction(formData) {
  await deleteAdminUpazila(readId(formData));
  revalidate();
}
