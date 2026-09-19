"use server";

import { revalidatePath } from "next/cache";
import {
  createLedgerConfiguration,
  updateLedgerConfiguration,
  updateLedgerConfigurationStatus,
  deleteLedgerConfiguration,
} from "@/lib/api/admin-ledger-configuration-service";

function str(fd, key) {
  return String(fd.get(key) ?? "").trim();
}

function num(fd, key, fallback = 0) {
  const v = Number(str(fd, key));
  return Number.isFinite(v) ? v : fallback;
}

function readId(fd) {
  const id = Number.parseInt(str(fd, "id"), 10);
  if (!Number.isFinite(id) || id <= 0) throw new Error("Valid ID is required.");
  return id;
}

function buildPayload(fd) {
  return {
    GroupId:    num(fd, "groupId"),
    LedgerType: str(fd, "ledgerType"),
    GroupCode:  str(fd, "groupCode"),
    NatureId:   num(fd, "natureId"),
    // Captured alongside the id so the table stays readable if the accounting
    // system is unreachable later.
    GroupName:  str(fd, "groupName") || null,
    AddApiUrl:    str(fd, "addApiUrl") || null,
    UpdateApiUrl: str(fd, "updateApiUrl") || null,
    IsActive:   fd.get("isActive") !== null,
  };
}

function revalidate() {
  revalidatePath("/admin/ledger-configuration");
}

export async function createLedgerConfigurationAction(fd) {
  await createLedgerConfiguration(buildPayload(fd));
  revalidate();
}

export async function updateLedgerConfigurationAction(fd) {
  await updateLedgerConfiguration(readId(fd), buildPayload(fd));
  revalidate();
}

export async function updateLedgerConfigurationStatusAction(fd) {
  const id = readId(fd);
  const isActive = fd.get("isActive") === "true";
  await updateLedgerConfigurationStatus(id, isActive);
  revalidate();
}

export async function deleteLedgerConfigurationAction(fd) {
  await deleteLedgerConfiguration(readId(fd));
  revalidate();
}
