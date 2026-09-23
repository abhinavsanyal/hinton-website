"use client";
import type { AudioSample } from "@/data/audio-samples";
export function AudioPlayer({ sample }: { sample: AudioSample }) {
  return <article className="editorial-card"><h2>{sample.title}</h2><p>{sample.description}</p><audio className="w-full" aria-label={sample.title} controls preload="none" controlsList="nodownload" onContextMenu={event => event.preventDefault()} src={sample.src}>Your browser does not support audio playback.</audio></article>;
}
