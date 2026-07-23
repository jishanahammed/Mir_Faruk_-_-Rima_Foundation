import Link from "next/link";
import { getAllPublicProjects } from "@/lib/api/public-foundation-project-service";
import { FeaturedProjectsGrid } from "@/components/public/home/featured-projects-grid";

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
        <div className="flex flex-col items-center gap-4 text-center sm:flex-row sm:items-end sm:justify-between sm:text-left">
          <div>
            <span className="inline-block rounded-full border border-cyan-200 bg-cyan-50 px-4 py-1.5 text-xs font-bold uppercase tracking-widest text-cyan-700">
              Active Projects
            </span>
            <h2 className="mt-4 text-3xl font-extrabold leading-tight text-slate-900 sm:text-4xl">
              Projects You Can Support Today
            </h2>
            <p className="mt-3 max-w-xl text-sm leading-relaxed text-slate-500 sm:text-base">
              Every donation goes directly toward a specific, transparently tracked project.
            </p>
          </div>

          <Link
            href="/donate"
            className="inline-flex shrink-0 items-center gap-2 rounded-full bg-[linear-gradient(135deg,#0f172a,#155e75_52%,#0f766e)] px-6 py-3 text-sm font-bold text-white! shadow-lg shadow-cyan-900/20 transition hover:-translate-y-0.5 hover:shadow-xl hover:shadow-cyan-900/30"
          >
            View All Projects
          </Link>
        </div>

        <FeaturedProjectsGrid projects={featured} />
      </div>
    </section>
  );
}
