import "server-only";

import { authApiClient, apiTimeouts, assertApiConfigured } from "@/lib/api/server-client";

function pick(payload, camelKey, pascalKey, fallback) {
  return payload?.[camelKey] ?? payload?.[pascalKey] ?? fallback;
}

function normalizePublishedVideoSpeech(p) {
  if (!p) return null;
  return {
    id: pick(p, "id", "Id", 0),
    nameEn: pick(p, "nameEn", "NameEn", ""),
    nameBn: pick(p, "nameBn", "NameBn", ""),
    nameDk: pick(p, "nameDk", "NameDk", null),
    roleEn: pick(p, "roleEn", "RoleEn", ""),
    roleBn: pick(p, "roleBn", "RoleBn", ""),
    roleDk: pick(p, "roleDk", "RoleDk", null),
    descriptionEn: pick(p, "descriptionEn", "DescriptionEn", null),
    descriptionBn: pick(p, "descriptionBn", "DescriptionBn", null),
    descriptionDk: pick(p, "descriptionDk", "DescriptionDk", null),
    videoId: pick(p, "videoId", "VideoId", ""),
    backgroundImageUrl: pick(p, "backgroundImageUrl", "BackgroundImageUrl", null),
  };
}

export async function getPublishedVideoSpeech() {
  try {
    assertApiConfigured();
    const response = await authApiClient.request({
      method: "get",
      url: "VideoSpeeches/public",
      timeout: apiTimeouts.default,
    });
    return normalizePublishedVideoSpeech(response.data);
  } catch {
    return null;
  }
}
