"use server";

import { getPublicProjectAssistancesByProjectId } from "@/lib/api/public-project-assistance-service";

export async function fetchProjectAssistancesAction(projectId) {
  return getPublicProjectAssistancesByProjectId(projectId);
}
