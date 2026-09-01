import { ProjectBlogsPage } from "@/components/public/project-blogs/project-blogs-page";
import { getPublicProjectBlogs } from "@/lib/api/public-project-blog-service";

export const metadata = {
  title: "Project Stories | Mir Faruk & Rima Foundation",
  description: "Read the latest published updates and stories from Mir Faruk & Rima Foundation's projects.",
};

export default async function PublicProjectBlogsPage() {
  const blogs = await getPublicProjectBlogs();
  return <ProjectBlogsPage blogs={blogs} />;
}
