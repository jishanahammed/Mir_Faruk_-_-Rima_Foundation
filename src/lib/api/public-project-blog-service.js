import "server-only";

import { apiGet } from "@/lib/api/api-service";

function pick(p, k, K, fb) {
  return p?.[k] ?? p?.[K] ?? fb;
}

function buildImageUrl(rawPath) {
  if (!rawPath) return null;
  const clean = String(rawPath).replace(/\\/g, "/").replace(/^~\//, "").replace(/^\/+/, "");
  return `/api/asset?path=${encodeURIComponent(clean)}`;
}

function normalizeGalleryImage(img) {
  if (!img) return null;
  return {
    id: pick(img, "id", "Id", 0),
    imagePath: pick(img, "imagePath", "ImagePath", ""),
    imageUrl: buildImageUrl(pick(img, "imagePath", "ImagePath", "")),
    sortOrder: pick(img, "sortOrder", "SortOrder", null),
  };
}

function normalizeBlog(p) {
  if (!p) return null;
  return {
    id: pick(p, "id", "Id", 0),
    projectId: pick(p, "projectId", "ProjectId", 0),
    projectTitleEn: pick(p, "projectTitleEn", "ProjectTitleEn", null),
    titleEn: pick(p, "titleEn", "TitleEn", ""),
    titleBn: pick(p, "titleBn", "TitleBn", ""),
    titleDk: pick(p, "titleDk", "TitleDk", null),
    shortDescriptionEn: pick(p, "shortDescriptionEn", "ShortDescriptionEn", null),
    shortDescriptionBn: pick(p, "shortDescriptionBn", "ShortDescriptionBn", null),
    shortDescriptionDk: pick(p, "shortDescriptionDk", "ShortDescriptionDk", null),
    descriptionEn: pick(p, "descriptionEn", "DescriptionEn", null),
    descriptionBn: pick(p, "descriptionBn", "DescriptionBn", null),
    descriptionDk: pick(p, "descriptionDk", "DescriptionDk", null),
    coverImage: buildImageUrl(pick(p, "coverImage", "CoverImage", null)),
    serialNo: pick(p, "serialNo", "SerialNo", null),
    galleryImages: (pick(p, "galleryImages", "GalleryImages", []) ?? [])
      .map(normalizeGalleryImage)
      .filter(Boolean),
    createdAt: pick(p, "createdAt", "CreatedAt", null),
    updatedAt: pick(p, "updatedAt", "UpdatedAt", null),
  };
}

export async function getPublicProjectBlogsByProject(projectId) {
  if (!projectId) return [];
  try {
    const payload = await apiGet(`ProjectBlogs/public?projectId=${encodeURIComponent(projectId)}`);
    const items = Array.isArray(payload) ? payload : [];
    return items.map(normalizeBlog).filter(Boolean);
  } catch {
    return [];
  }
}

export async function getPublicProjectBlogById(id) {
  try {
    const p = await apiGet(`ProjectBlogs/public/${encodeURIComponent(id)}`);
    return normalizeBlog(p);
  } catch {
    return null;
  }
}
