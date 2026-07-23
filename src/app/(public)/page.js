import { HomePage } from "@/components/public/home/home-page";
import { FeaturedProjects } from "@/components/public/home/featured-projects";

export default function Home() {
  return <HomePage featuredProjects={<FeaturedProjects />} />;
}
