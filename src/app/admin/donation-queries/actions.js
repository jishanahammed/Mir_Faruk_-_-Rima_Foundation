"use server";

import { revalidatePath } from "next/cache";
import {
  getDonationTransactionQueryById,
  updateDonationTransactionQueryStatus,
  deleteDonationTransactionQuery,
} from "@/lib/api/admin-donation-transaction-query-service";

function readId(fd) {
  const id = Number.parseInt(String(fd.get("id") ?? ""), 10);
  if (!Number.isFinite(id) || id <= 0) throw new Error("Valid ID is required.");
  return id;
}

function revalidate() {
  revalidatePath("/admin/donation-queries");
  // The sidebar badge lives in the admin layout, so refresh that too or the
  // count stays stale after a query is opened or deleted.
  revalidatePath("/admin", "layout");
}

/** Opening a query marks it seen on the server, which clears the badge. */
export async function openDonationQueryAction(id) {
  const result = await getDonationTransactionQueryById(id);
  revalidate();
  return result;
}

export async function setDonationQuerySeenAction(fd) {
  const isSeen = String(fd.get("isSeen") ?? "") === "true";
  await updateDonationTransactionQueryStatus(readId(fd), isSeen, null);
  revalidate();
}

export async function deleteDonationQueryAction(fd) {
  await deleteDonationTransactionQuery(readId(fd));
  revalidate();
}
