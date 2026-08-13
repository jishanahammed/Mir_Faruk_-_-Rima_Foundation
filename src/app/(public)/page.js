import { HomePage } from "@/components/public/home/home-page";
import { FeaturedProjects } from "@/components/public/home/featured-projects";
import { getPublishedVideoSpeech } from "@/lib/api/public-video-speech-service";

export const dynamic = "force-dynamic";

export default async function Home() {
  const videoSpeech = await getPublishedVideoSpeech();

  return (
    <HomePage
      featuredProjects={<FeaturedProjects />}
      videoSpeech={videoSpeech}
    />
  );
}


