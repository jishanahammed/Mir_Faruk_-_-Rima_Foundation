import { notFound } from "next/navigation";
import { getPublicProjectCategories } from "@/lib/api/public-project-category-service";
import { getPublicProjectById } from "@/lib/api/public-foundation-project-service";
import { getDivisions, getDistricts, getUpazilas } from "@/lib/api/public-location-service";
import { ProjectDetailPage } from "@/components/public/projects/project-detail-page";

export async function generateMetadata({ params }) {
  const { projectId } = await params;
  const project = await getPublicProjectById(projectId);
  if (!project) return { title: "Project | Mir Faruk & Rima Foundation" };
  return {
    title: `${project.projectTitleEn} | Mir Faruk & Rima Foundation`,
    description: project.shortDescriptionEn ?? `Learn about ${project.projectTitleEn}.`,
  };
}

export default async function ProjectDetailRoute({ params }) {
  const { categoryId, projectId } = await params;

  const [categories, project] = await Promise.all([
    getPublicProjectCategories(),
    getPublicProjectById(projectId),
  ]);

  if (!project) notFound();

  const category = categories.find((c) => String(c.id) === String(categoryId));

  // Resolve location names only for the IDs that exist on this project
  const [divisions, districts, upazilas] = await Promise.all([
    project.divisionId  ? getDivisions()                              : Promise.resolve([]),
    project.districtId  ? getDistricts(project.divisionId ?? null)    : Promise.resolve([]),
    project.upazilaId   ? getUpazilas(project.districtId  ?? null)    : Promise.resolve([]),
  ]);

  const divisionName  = divisions.find( (d) => d.id === project.divisionId)  ?? null;
  const districtName  = districts.find( (d) => d.id === project.districtId)  ?? null;
  const upazilaName   = upazilas.find(  (u) => u.id === project.upazilaId)   ?? null;

  return (
    <ProjectDetailPage
      project={project}
      category={category ?? null}
      divisionName={divisionName}
      districtName={districtName}
      upazilaName={upazilaName}
    />
  );
}
