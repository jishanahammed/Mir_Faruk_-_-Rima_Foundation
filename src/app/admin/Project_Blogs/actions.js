"use server";

import { revalidatePath } from "next/cache";
import {
  createAdminProjectBlog,
  updateAdminProjectBlog,
  updateAdminProjectBlogPublish,
  updateAdminProjectBlogActive,
  deleteAdminProjectBlog,
} from "@/lib/api/admin-project-blog-service";
import {
  uploadProjectBlogCoverImage,
  uploadProjectBlogGalleryImages,
  deleteProjectBlogImage,
} from "@/lib/api/admin-upload-service";

function str(fd, key) {
  return String(fd.get(key) ?? "").trim();
}

function num(fd, key) {
  const v = str(fd, key);
  return v ? Number(v) : null;
}

function bool(fd, key) {
  return fd.get(key) === "true" || fd.get(key) === "on";
}

function readId(fd) {
  const id = Number.parseInt(str(fd, "id"), 10);
  if (!Number.isFinite(id) || id <= 0) throw new Error("Valid ID is required.");
  return id;
}

function buildPayload(fd) {
  const galleryImagePaths = fd.getAll("galleryImagePaths").map((v) => String(v).trim()).filter(Boolean);
  return {
    ProjectId: Number(str(fd, "projectId")) || 0,
    TitleEn: str(fd, "titleEn"),
    TitleBn: str(fd, "titleBn"),
    TitleDk: str(fd, "titleDk") || null,
    ShortDescriptionEn: str(fd, "shortDescriptionEn") || null,
    ShortDescriptionBn: str(fd, "shortDescriptionBn") || null,
    ShortDescriptionDk: str(fd, "shortDescriptionDk") || null,
    DescriptionEn: str(fd, "descriptionEn") || null,
    DescriptionBn: str(fd, "descriptionBn") || null,
    DescriptionDk: str(fd, "descriptionDk") || null,
    CoverImage: str(fd, "coverImage") || null,
    IsPublished: bool(fd, "isPublished"),
    IsActive: fd.has("isActive") ? bool(fd, "isActive") : true,
    SerialNo: num(fd, "serialNo"),
    GalleryImagePaths: galleryImagePaths,
  };
}

function revalidate() {
  revalidatePath("/admin/Project_Blogs");
}

export async function createProjectBlogAction(fd) {
  await createAdminProjectBlog(buildPayload(fd));
  revalidate();
}

export async function updateProjectBlogAction(fd) {
  await updateAdminProjectBlog(readId(fd), buildPayload(fd));
  revalidate();
}

export async function updateProjectBlogPublishAction(fd) {
  const id = readId(fd);
  await updateAdminProjectBlogPublish(id, bool(fd, "isPublished"));
  revalidate();
}

export async function updateProjectBlogActiveAction(fd) {
  const id = readId(fd);
  await updateAdminProjectBlogActive(id, bool(fd, "isActive"));
  revalidate();
}

export async function deleteProjectBlogAction(fd) {
  await deleteAdminProjectBlog(readId(fd));
  revalidate();
}

export async function uploadProjectBlogCoverImageAction(fd) {
  return uploadProjectBlogCoverImage(fd);
}

export async function uploadProjectBlogGalleryImagesAction(fd) {
  return uploadProjectBlogGalleryImages(fd);
}

export async function deleteProjectBlogImageAction(fd) {
  const imagePath = str(fd, "imagePath");
  await deleteProjectBlogImage(imagePath);
}
