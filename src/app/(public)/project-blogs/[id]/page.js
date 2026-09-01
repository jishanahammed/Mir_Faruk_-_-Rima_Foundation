import { notFound } from "next/navigation";
import { getPublicProjectBlogById } from "@/lib/api/public-project-blog-service";
import { ProjectBlogDetailPage } from "@/components/public/project-blogs/project-blog-detail-page";

export async function generateMetadata({ params }) {
  const { id } = await params;
  const blog = await getPublicProjectBlogById(id);
  if (!blog) return { title: "Project Story | Mir Faruk & Rima Foundation" };
  return {
    title: `${blog.titleEn} | Mir Faruk & Rima Foundation`,
    description: blog.shortDescriptionEn ?? `Read about ${blog.titleEn}.`,
  };
}

export default async function ProjectBlogDetailRoute({ params }) {
  const { id } = await params;
  const blog = await getPublicProjectBlogById(id);
  if (!blog) notFound();

  return <ProjectBlogDetailPage blog={blog} />;
}

