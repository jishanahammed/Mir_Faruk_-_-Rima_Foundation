import "server-only";

import { apiGet } from "@/lib/api/api-service";

function pick(p, k, K, fb) {
  return p?.[k] ?? p?.[K] ?? fb;
}

function normalizeAssistance(p) {
  if (!p) return null;
  return {
    id: pick(p, "id", "Id", 0),
    projectId: pick(p, "projectId", "ProjectId", 0),
    assistanceTypeId: pick(p, "assistanceTypeId", "AssistanceTypeId", 0),
    assistanceTypeNameEn: pick(p, "assistanceTypeNameEn", "AssistanceTypeNameEn", null),
    assistanceTypeNameBn: pick(p, "assistanceTypeNameBn", "AssistanceTypeNameBn", null),
    assistanceTypeNameDk: pick(p, "assistanceTypeNameDk", "AssistanceTypeNameDk", null),
    nameEn: pick(p, "nameEn", "NameEn", ""),
    nameBn: pick(p, "nameBn", "NameBn", ""),
    nameDk: pick(p, "nameDk", "NameDk", null),
    descriptionEn: pick(p, "descriptionEn", "DescriptionEn", null),
    descriptionBn: pick(p, "descriptionBn", "DescriptionBn", null),
    descriptionDk: pick(p, "descriptionDk", "DescriptionDk", null),
    targetBeneficiaryType: pick(p, "targetBeneficiaryType", "TargetBeneficiaryType", "Individual"),
    supportMode: pick(p, "supportMode", "SupportMode", "Cash"),
    targetAmount: pick(p, "targetAmount", "TargetAmount", 0),
    collectedAmount: pick(p, "collectedAmount", "CollectedAmount", 0),
    offlineCollectedAmount: pick(p, "offlineCollectedAmount", "OfflineCollectedAmount", 0),
    totalCollectedAmount: pick(p, "totalCollectedAmount", "TotalCollectedAmount", 0),
    progressPercent: pick(p, "progressPercent", "ProgressPercent", 0),
  };
}

export async function getPublicProjectAssistancesByProjectId(projectId) {
  if (!projectId) return [];
  try {
    const payload = await apiGet(`ProjectAssistances/public/by-project/${projectId}`);
    const items = Array.isArray(payload) ? payload : [];
    return items.map(normalizeAssistance).filter(Boolean);
  } catch {
    return [];
  }
}
