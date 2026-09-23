"use client";
import { useState } from "react";
import type { WorkVideo } from "@/data/mocks/work";
import { trackEvent } from "@/components/analytics/analytics";
export function FilmPlayer({ video }: { video: WorkVideo }) {
  const [failed, setFailed] = useState(false);
  return <><video className="film-player" controls playsInline preload="none" poster={video.posterUrl} src={video.videoUrl} aria-label={video.title} onPlay={() => trackEvent("video_start", { video_title: video.title, item_id: video.slug })} onEnded={() => trackEvent("video_complete", { item_id: video.slug })} onError={() => setFailed(true)} />{failed && <p role="alert">The film could not load. <a href={video.videoUrl} target="_blank" rel="noopener noreferrer">Open the video directly</a> or try again.</p>}</>;
}
