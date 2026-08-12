import "server-only";

import { authApiClient, apiTimeouts, assertApiConfigured } from "@/lib/api/server-client";

function pick(payload, camelKey, pascalKey, fallback) {
  return payload?.[camelKey] ?? payload?.[pascalKey] ?? fallback;
}

function normalizePublishedFeedback(p) {
  if (!p) return null;
  return {
    id: pick(p, "id", "Id", 0),
    fullName: pick(p, "fullName", "FullName", ""),
    rating: Number(pick(p, "rating", "Rating", 0)) || 0,
    message: pick(p, "message", "Message", ""),
    createdAt: pick(p, "createdAt", "CreatedAt", null),
  };
}

export async function getPublishedCustomerFeedback() {
  try {
    assertApiConfigured();
    const response = await authApiClient.request({
      method: "get",
      url: "CustomerFeedbacks/public",
      timeout: apiTimeouts.default,
    });
    const items = Array.isArray(response.data) ? response.data : [];
    return items.map(normalizePublishedFeedback).filter(Boolean);
  } catch {
    return [];
  }
}
