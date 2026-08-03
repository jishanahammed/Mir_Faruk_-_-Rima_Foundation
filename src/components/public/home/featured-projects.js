import { getAllPublicProjects } from "@/lib/api/public-foundation-project-service";
import { FeaturedProjectsGrid } from "@/components/public/home/featured-projects-grid";
import { FeaturedProjectsHeader } from "@/components/public/home/featured-projects-header";

const MAX_FEATURED_PROJECTS = 6;

export async function FeaturedProjects() {
  const projects = await getAllPublicProjects();
  const featured = projects.slice(0, MAX_FEATURED_PROJECTS);

  if (featured.length === 0) {
    return null;
  }

  return (
    <section className="relative overflow-hidden bg-white px-5 py-16 sm:px-6 sm:py-20 lg:px-8">
      <div className="relative mx-auto max-w-7xl">
        <FeaturedProjectsHeader />

        <FeaturedProjectsGrid projects={featured} />
      </div>
    </section>
  );
}
