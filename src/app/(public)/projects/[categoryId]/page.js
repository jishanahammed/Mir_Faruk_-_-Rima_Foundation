import { notFound } from "next/navigation";
import { getPublicProjectCategories } from "@/lib/api/public-project-category-service";
import { getPublicProjectsByCategory } from "@/lib/api/public-foundation-project-service";
import { CategoryProjectsPage } from "@/components/public/projects/category-projects-page";

export async function generateMetadata({ params }) {
  const { categoryId } = await params;
  const categories = await getPublicProjectCategories();
  const category = categories.find((c) => String(c.id) === String(categoryId));
  if (!category) return { title: "Projects | Mir Faruk & Rima Foundation" };
  return {
    title: `${category.nameEn} Projects | Mir Faruk & Rima Foundation`,
    description: category.descriptionEn ?? `Explore ${category.nameEn} projects by Mir Faruk & Rima Foundation.`,
  };
}

export default async function CategoryProjectsRoute({ params }) {
  const { categoryId } = await params;

  const [categories, projects] = await Promise.all([
    getPublicProjectCategories(),
    getPublicProjectsByCategory(categoryId),
  ]);

  const category = categories.find((c) => String(c.id) === String(categoryId));
  if (!category) notFound();

  return <CategoryProjectsPage category={category} projects={projects} />;
}
