"use client";

import { useEffect, useId, useMemo, useRef, useState } from "react";

function extractYoutubeId(input) {
  if (!input) return null;
  const trimmed = String(input).trim();

  if (/^[\w-]{11}$/.test(trimmed)) return trimmed;

  try {
    const url = new URL(trimmed);
    if (url.hostname.includes("youtu.be")) {
      return url.pathname.split("/").filter(Boolean)[0] ?? null;
    }
    if (url.hostname.includes("youtube.com")) {
      if (url.pathname === "/watch") return url.searchParams.get("v");
      const segments = url.pathname.split("/").filter(Boolean);
      const shortsOrEmbedIndex = segments.findIndex((seg) => seg === "shorts" || seg === "embed");
      if (shortsOrEmbedIndex !== -1) return segments[shortsOrEmbedIndex + 1] ?? null;
    }
  } catch {
    return null;
  }

  return null;
}

function PlayIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className="h-7 w-7 translate-x-0.5 sm:h-9 sm:w-9" aria-hidden="true">
      <path d="M8 5.14v13.72a1 1 0 0 0 1.53.85l10.72-6.86a1 1 0 0 0 0-1.7L9.53 4.29A1 1 0 0 0 8 5.14Z" />
    </svg>
  );
}

/**
 * Self-contained, dependency-free YouTube player.
 * Drop-in usage: <YoutubePlayer url="https://www.youtube.com/watch?v=VIDEO_ID" title="..." />
 * Lazy-loads the iframe only after the user clicks play, using the thumbnail as a poster.
 */
export function YoutubePlayer({
  url,
  videoId: videoIdProp,
  title = "YouTube video player",
  autoPlay = true,
  className = "",
}) {
  const reactId = useId();
  const videoId = useMemo(() => videoIdProp || extractYoutubeId(url), [videoIdProp, url]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [thumbQuality, setThumbQuality] = useState("maxresdefault");
  const containerRef = useRef(null);

  useEffect(() => {
    setIsPlaying(false);
    setThumbQuality("maxresdefault");
  }, [videoId]);

  const handleKeyDown = (event) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      setIsPlaying(true);
    }
  };

  if (!videoId) {
    return (
      <div
        className={`flex aspect-video w-full items-center justify-center rounded-2xl border border-dashed border-slate-300 bg-slate-50 text-sm font-medium text-slate-400 ${className}`}
      >
        Invalid YouTube link
      </div>
    );
  }

  const thumbSrc = `https://i.ytimg.com/vi/${videoId}/${thumbQuality}.jpg`;
  const embedSrc = `https://www.youtube-nocookie.com/embed/${videoId}?autoplay=${autoPlay ? 1 : 0}&rel=0&modestbranding=1&playsinline=1`;
  const labelId = `yt-player-title-${reactId}`;

  return (
    <div
      ref={containerRef}
      className={`group relative aspect-video w-full overflow-hidden rounded-2xl bg-black shadow-[0_20px_60px_-15px_rgba(0,0,0,0.5)] ring-1 ring-black/10 ${className}`}
    >
      {isPlaying ? (
        <iframe
          src={embedSrc}
          title={title}
          aria-labelledby={labelId}
          className="absolute inset-0 h-full w-full"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowFullScreen
        />
      ) : (
        <button
          type="button"
          onClick={() => setIsPlaying(true)}
          onKeyDown={handleKeyDown}
          aria-label={`Play video: ${title}`}
          id={labelId}
          className="absolute inset-0 h-full w-full cursor-pointer"
        >
          <img
            src={thumbSrc}
            alt=""
            aria-hidden="true"
            onError={() => {
              if (thumbQuality === "maxresdefault") setThumbQuality("hqdefault");
            }}
            className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 ease-out group-hover:scale-105"
            loading="lazy"
          />

          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-black/30 transition-opacity duration-300 group-hover:from-black/70" />

          <span className="absolute inset-0 flex items-center justify-center">
            <span className="flex h-14 w-14 items-center justify-center rounded-full bg-white/95 text-red-600 shadow-xl ring-4 ring-white/30 transition-transform duration-300 ease-out group-hover:scale-110 group-active:scale-95 sm:h-20 sm:w-20">
              <PlayIcon />
            </span>
          </span>

          {title ? (
            <span className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 to-transparent px-4 py-3 text-left text-sm font-semibold text-white sm:px-5 sm:py-4 sm:text-base">
              {title}
            </span>
          ) : null}
        </button>
      )}
    </div>
  );
}
