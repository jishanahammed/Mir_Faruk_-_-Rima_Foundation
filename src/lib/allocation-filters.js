export const ALLOCATION_FILTER_FIELDS = ["projectId", "divisionId", "districtId", "upazilaId", "unionParishadorPourashavaId", "wardId"];

export function readAllocationFilters(formData) {
  const filters = {};
  for (const key of ALLOCATION_FILTER_FIELDS) {
    const raw = String(formData.get(key) ?? "").trim();
    const value = raw ? Number(raw) : null;
    if (raw && (!Number.isSafeInteger(value) || value <= 0)) return { error: "Select valid project and location filters." };
    filters[key] = value;
  }
  if (!filters.projectId || !filters.divisionId) return { error: "Project and Division are required." };
  if (filters.upazilaId && !filters.districtId || filters.unionParishadorPourashavaId && !filters.upazilaId || filters.wardId && !filters.unionParishadorPourashavaId) {
    return { error: "Select each parent location before choosing a more specific location." };
  }
  return { filters };
}

export function allocationFilterKey(filters) {
  return ALLOCATION_FILTER_FIELDS.map((key) => String(filters[key] || "")).join(":");
}
