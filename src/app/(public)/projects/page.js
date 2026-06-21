import { ProjectsPage } from "@/components/public/projects/projects-page";
import { getPublicProjectCategories } from "@/lib/api/public-project-category-service";

export const metadata = {
  title: "Projects | Mir Faruk & Rima Foundation",
  description: "Explore the active programmes and initiatives of Mir Faruk & Rima Foundation.",
};

export default async function PublicProjectsPage() {
  const categories = await getPublicProjectCategories();
  return <ProjectsPage categories={categories} />;
}
