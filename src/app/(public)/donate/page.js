import { DonatePage } from "@/components/public/donate/donate-page";
import { getAllPublicProjects } from "@/lib/api/public-foundation-project-service";

export const metadata = {
  title: "Donate | Mir Faruk & Rima Foundation",
  description: "Browse active projects and donate directly to a cause you care about at Mir Faruk & Rima Foundation.",
};

export default async function PublicDonatePage() {
  const projects = await getAllPublicProjects();
  return <DonatePage projects={projects} />;
}
