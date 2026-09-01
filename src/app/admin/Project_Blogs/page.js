import Link from "next/link";
import { getApiErrorMessage } from "@/lib/api/api-error";
import { getAdminProjectBlogs } from "@/lib/api/admin-project-blog-service";
import { getAdminFoundationProjects } from "@/lib/api/admin-foundation-project-service";
import { ProjectBlogTable } from "@/components/admin/Project_Blogs/project-blog-table";
import { ProjectBlogModal } from "@/components/admin/Project_Blogs/project-blog-modal";
import {
  createProjectBlogAction,
  updateProjectBlogAction,
  updateProjectBlogPublishAction,
  updateProjectBlogActiveAction,
  deleteProjectBlogAction,
  uploadProjectBlogCoverImageAction,
  uploadProjectBlogGalleryImagesAction,
  deleteProjectBlogImageAction,
} from "@/app/admin/Project_Blogs/actions";

export const metadata = {
  title: "Project Blogs | Admin | Mir Faruk & Rima Foundation",
};

const PAGE_SIZES = [10, 20, 50];

function readParam(params, key, fallback = "") {
  const v = params?.[key];
  return Array.isArray(v) ? (v[0] ?? fallback) : (v ?? fallback);
}

function paginate(items, page, pageSize, search) {
  const filtered = search
    ? items.filter((b) =>
        [b.titleEn, b.titleBn, b.shortDescriptionEn, b.projectTitleEn]
          .join(" ").toLowerCase().includes(search.toLowerCase())
      )
    : items;
  const totalCount = filtered.length;
  const totalPages = Math.max(1, Math.ceil(totalCount / pageSize));
  const safePage = Math.min(Math.max(1, page), totalPages);
  return {
    items: filtered.slice((safePage - 1) * pageSize, safePage * pageSize),
    totalCount,
    totalPages,
    pageNumber: safePage,
    pageSize,
  };
}

export default async function AdminProjectBlogsPage({ searchParams }) {
  const params = await searchParams;

  const search = readParam(params, "search").trim();
  const page = Math.max(1, Number.parseInt(readParam(params, "page", "1"), 10) || 1);
  const pageSize = PAGE_SIZES.includes(Number(readParam(params, "pageSize", "10")))
    ? Number(readParam(params, "pageSize", "10"))
    : 10;

  let allBlogs = [], projects = [], error = null;

  try {
    [allBlogs, projects] = await Promise.all([
      getAdminProjectBlogs(),
      getAdminFoundationProjects(),
    ]);
  } catch (err) {
    error = getApiErrorMessage(err);
  }

  const data = paginate(allBlogs, page, pageSize, search);

  return (
    <div className="flex flex-col gap-6">
      {/* Page Header */}
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-xs font-bold uppercase tracking-widest text-cyan-600">Projects</p>
          <h1 className="mt-1 text-2xl font-extrabold text-slate-900">Project Blogs</h1>
          <p className="mt-1 text-sm text-slate-500">
            Manage blog posts linked to foundation projects — create, publish, and organize with images.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <span className="flex h-8 items-center rounded-full border border-cyan-200 bg-cyan-50 px-3 text-xs font-bold text-cyan-700">
            {allBlogs.length} blog{allBlogs.length !== 1 ? "s" : ""}
          </span>
          <Link
            href="?add=1"
            className="inline-flex items-center gap-2 rounded-xl bg-[linear-gradient(135deg,#0f766e,#0891b2)] px-4 py-2 text-sm font-bold text-white shadow-md shadow-cyan-200/60 hover:opacity-90 transition"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="h-4 w-4">
              <path d="M12 5v14M5 12h14" strokeLinecap="round" />
            </svg>
            Add Blog
          </Link>
        </div>
      </div>

      {/* Error banner */}
      {error && (
        <div className="rounded-2xl border border-rose-200 bg-rose-50 px-5 py-4 text-sm font-semibold text-rose-700">
          {error}
        </div>
      )}

      {/* Table card */}
      <section className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm shadow-slate-900/4">
        {/* Card header */}
        <div className="bg-[linear-gradient(135deg,#0f766e,#0891b2)] px-6 py-4">
          <h2 className="text-sm font-bold text-white">All Blogs</h2>
          <p className="text-xs text-cyan-100/80">Search, publish/unpublish, activate/deactivate or edit any blog below.</p>
        </div>
        <div className="p-6">
          <ProjectBlogTable
            data={data}
            search={search}
            updatePublishAction={updateProjectBlogPublishAction}
            updateActiveAction={updateProjectBlogActiveAction}
            deleteAction={deleteProjectBlogAction}
          />
        </div>
      </section>

      {/* Add / Edit Modal */}
      <ProjectBlogModal
        key={params?.edit ?? (params?.add === "1" ? "add" : "closed")}
        params={params}
        allBlogs={allBlogs}
        projects={projects}
        createAction={createProjectBlogAction}
        updateAction={updateProjectBlogAction}
        uploadCoverAction={uploadProjectBlogCoverImageAction}
        uploadGalleryAction={uploadProjectBlogGalleryImagesAction}
        deleteImageAction={deleteProjectBlogImageAction}
      />
    </div>
  );
}
