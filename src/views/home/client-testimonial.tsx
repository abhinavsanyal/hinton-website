"use client";
import Image from "next/image";
import Link from "next/link";
import { useRef, useState } from "react";
import { trackEvent } from "@/components/analytics/analytics";
const videoUrl = "https://pub-fc6cefbd1ab24e1fb85d8851c0271332.r2.dev/trendloud-testimonial-2026.mp4";
export function ClientTestimonial() {
  const [playing, setPlaying] = useState(false);
  const [failed, setFailed] = useState(false);
  const milestones = useRef(new Set<number>());
  const started = useRef(false);
  return <section className="client-story" aria-labelledby="client-story-title">
    <div className="client-story-heading"><div><p className="editorial-kicker">A client perspective</p><h2 id="client-story-title">In their own words.</h2></div><p>TrendLoud on working with Hinton Studios.</p></div>
    <div className="client-story-player">
      {playing ? <video controls autoPlay playsInline preload="none" poster="/assets/testimonials/trendloud.jpg" aria-label="TrendLoud client testimonial"
        onPlay={() => { if (!started.current) { started.current = true; trackEvent("testimonial_start", { client: "TrendLoud" }); } }}
        onTimeUpdate={event => { const video = event.currentTarget; if (!video.duration) return; const percent = video.currentTime / video.duration * 100; for (const milestone of [25, 50, 75]) if (percent >= milestone && !milestones.current.has(milestone)) { milestones.current.add(milestone); trackEvent("testimonial_progress", { client: "TrendLoud", percent: String(milestone) }); } }}
        onEnded={() => trackEvent("testimonial_complete", { client: "TrendLoud" })} onError={() => setFailed(true)}>
        <source src={videoUrl} type="video/mp4" />Your browser does not support embedded video.
      </video> : <button type="button" className="client-story-play" aria-label="Play TrendLoud client testimonial" onClick={() => setPlaying(true)}>
        <Image src="/assets/testimonials/trendloud.jpg" alt="The TrendLoud team sharing their experience with Hinton Studios" width={1280} height={720} sizes="(max-width: 800px) 92vw, 1200px" />
        <span className="client-story-play-icon"><svg viewBox="0 0 24 24" width="24" height="24" fill="currentColor" aria-hidden="true"><path d="m8 5 11 7-11 7Z" /></svg></span><span className="client-story-watch">Watch the conversation <span>3:04</span></span>
      </button>}
    </div>
    {failed && <p role="status">The video couldn’t load. <a href={videoUrl}>Open the video directly ↗</a></p>}
    <div className="client-story-footer"><span>TrendLoud · Client testimonial</span><Link href="/#contact" onClick={() => trackEvent("testimonial_cta", { client: "TrendLoud" })}>Let’s make your next film ↗</Link></div>
  </section>;
}
