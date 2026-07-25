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
    <section className="relative overflow-hidden bg-slate-50 px-5 py-16 sm:px-6 sm:py-20 lg:px-8">
      <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
        <div className="absolute -top-24 -right-24 h-72 w-72 rounded-full bg-cyan-100/50 blur-3xl" />
        <div className="absolute bottom-0 left-0 h-64 w-64 -translate-x-1/2 translate-y-1/2 rounded-full bg-teal-100/40 blur-3xl" />
      </div>

      <div className="relative mx-auto max-w-7xl">
        <FeaturedProjectsHeader />

        <FeaturedProjectsGrid projects={featured} />
      </div>
    </section>
  );
}
