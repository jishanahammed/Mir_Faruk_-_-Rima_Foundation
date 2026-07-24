import { HomePage } from "@/components/public/home/home-page";
import { FeaturedProjects } from "@/components/public/home/featured-projects";

export const dynamic = "force-dynamic";

export default function Home() {
  return <HomePage featuredProjects={<FeaturedProjects />} />;
}
