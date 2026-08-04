import { YoutubePlayer } from "@/components/shared/youtube-player";

export const metadata = {
  title: "Video | Mir Faruk & Rima Foundation",
};

export default function VideoPage() {
  return (
    <section className="mx-auto max-w-4xl px-4 py-10 sm:px-6 sm:py-14 lg:px-8">
      <div className="text-center">
        <p className="text-xs font-semibold uppercase tracking-[0.28em] text-cyan-700">
          Video
        </p>
        <h1 className="mt-2 text-2xl font-extrabold text-slate-900 sm:text-3xl">
          Watch Our Story
        </h1>
      </div>

      <div className="mt-8">
        <YoutubePlayer
          url="https://www.youtube.com/watch?v=dQw4w9WgXcQ"
          title="Mir Faruk & Rima Foundation"
        />
      </div>
    </section>
  );
}
