import "server-only";

import { cookies } from "next/headers";
import { ApiError } from "@/lib/api/api-error";
import { apiGet, apiGetById, apiPost, apiPut, apiDelete } from "@/lib/api/api-service";
import { ADMIN_SESSION_COOKIE } from "@/lib/admin-auth";

function pick(payload, camelKey, pascalKey, fallback) {
  return payload?.[camelKey] ?? payload?.[pascalKey] ?? fallback;
}

async function authConfig() {
  const cookieStore = await cookies();
  const token = cookieStore.get(ADMIN_SESSION_COOKIE)?.value;
  if (!token) throw new ApiError("Admin session token is missing.");
  return { headers: { Authorization: `Bearer ${token}` } };
}

function normalizeGalleryImage(p) {
  if (!p) return null;
  return {
    id: pick(p, "id", "Id", 0),
    projectBlogId: pick(p, "projectBlogId", "ProjectBlogId", 0),
    imagePath: pick(p, "imagePath", "ImagePath", ""),
    sortOrder: pick(p, "sortOrder", "SortOrder", null),
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
    coverImage: pick(p, "coverImage", "CoverImage", null),
    isPublished: pick(p, "isPublished", "IsPublished", false),
    isActive: pick(p, "isActive", "IsActive", true),
    serialNo: pick(p, "serialNo", "SerialNo", null),
    galleryImages: (pick(p, "galleryImages", "GalleryImages", []) ?? [])
      .map(normalizeGalleryImage)
      .filter(Boolean),
    createdAt: pick(p, "createdAt", "CreatedAt", null),
    updatedAt: pick(p, "updatedAt", "UpdatedAt", null),
  };
}

export async function getAdminProjectBlogs() {
  const payload = await apiGet("ProjectBlogs", await authConfig());
  const items = Array.isArray(payload) ? payload : [];
  return items.map(normalizeBlog).filter(Boolean);
}

export async function getAdminProjectBlogById(id) {
  const payload = await apiGetById("ProjectBlogs", id, await authConfig());
  return normalizeBlog(payload);
}

export async function createAdminProjectBlog(data) {
  const payload = await apiPost("ProjectBlogs", data, await authConfig());
  return normalizeBlog(payload);
}

export async function updateAdminProjectBlog(id, data) {
  const payload = await apiPut(`ProjectBlogs/${id}`, data, await authConfig());
  return normalizeBlog(payload);
}

export async function updateAdminProjectBlogPublish(id, isPublished) {
  await apiPut(`ProjectBlogs/${id}/publish`, { IsPublished: isPublished }, await authConfig());
}

export async function updateAdminProjectBlogActive(id, isActive) {
  await apiPut(`ProjectBlogs/${id}/active`, { IsActive: isActive }, await authConfig());
}

export async function deleteAdminProjectBlog(id) {
  await apiDelete("ProjectBlogs", id, await authConfig());
}
