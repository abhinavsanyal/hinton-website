import { publicEnv } from "@/env";

// The base URL for large media files (Cloudflare R2, Bunny, etc.)
// If unset during local development, falls back to the local public folder.
const MEDIA_BASE = publicEnv.NEXT_PUBLIC_MEDIA_URL
  ? publicEnv.NEXT_PUBLIC_MEDIA_URL.replace(/\/$/, "")
  : "https://pub-fc6cefbd1ab24e1fb85d8851c0271332.r2.dev";

export interface WorkVideo {
  id: string;
  title: string;
  slug: string;
  description: string;
  videoUrl: string;
  posterUrl: string;
  categories: string[];
  client: string;
  duration: string;
  year: string;
}

/**
 * Static manifest of all portfolio videos.
 * This replaces the previous `fs.readdirSync` approach, which fails on Vercel's Edge
 * since serverless functions cannot read static assets from the CDN layer.
 */
export const workVideos: WorkVideo[] = [
  {
    id: "video-0",
    slug: "kookie-kandy-animation",
    title: "Kookie & Kandy — A world of characters",
    description: "A 30-second character-led animation exploring playful design, expressive performance and a colourful brand world.",
    videoUrl: `${MEDIA_BASE}/all-content/${encodeURIComponent("3D Animation Kookie Kandy[30sec].mov")}`,
    posterUrl: "/assets/posters/kookie-2026.jpg",
    categories: ["3D Animation", "Commercial"],
    client: "Kookie Kandy",
    duration: "30s",
    year: "2026",
  },
  {
    id: "video-1",
    slug: "dominos-product-film",
    title: "Domino’s — Made for the craving",
    description: "A 30-second food commercial combining product-focused visuals, animated movement and a fast-paced advertising edit.",
    videoUrl: `${MEDIA_BASE}/all-content/${encodeURIComponent("Dominoz[30sec].mov")}`,
    posterUrl: "/assets/posters/dominoz-2026.jpg",
    categories: ["Commercial"],
    client: "Dominoz",
    duration: "30s",
    year: "2026",
  },
  {
    id: "video-2",
    slug: "horror-comedy-soda",
    title: "A soda ad with a dark sense of humour",
    description: "A 60-second horror-comedy advertising film that builds a cinematic setup around an unexpected product moment.",
    videoUrl: `${MEDIA_BASE}/all-content/${encodeURIComponent("Horror Comedy Soda AD[60secs].mov")}`,
    posterUrl: "/assets/posters/horror-2026.jpg",
    categories: ["Commercial", "Comedy"],
    client: "Soda Brand",
    duration: "60s",
    year: "2026",
  },
  {
    id: "video-3",
    slug: "ilaiyaraaja-tribute",
    title: "Ilaiyaraaja — A cinematic tribute",
    description: "A visual birthday tribute to Ilaiyaraaja, exploring how cinematic imagery can accompany a musical legacy.",
    videoUrl: `${MEDIA_BASE}/all-content/${encodeURIComponent("Ilaiyaraaja-birthday-tribute-final-cut.mov")}`,
    posterUrl: "/assets/posters/ilaiyaraaja-2026.jpg",
    categories: ["Tribute", "Commercial"],
    client: "Ilaiyaraaja",
    duration: "Tribute film",
    year: "2026",
  },
  {
    id: "video-4",
    slug: "nishiddham-previz",
    title: "Nishiddham — From script to screen",
    description: "A four-minute previsualisation exploring scene geography, visual atmosphere and shot progression before full production.",
    videoUrl: `${MEDIA_BASE}/all-content/${encodeURIComponent("Nishiddham-previz[4mins].mov")}`,
    posterUrl: "/assets/posters/nishiddham-2026.jpg",
    categories: ["Feature Film Previz"],
    client: "Nishiddham",
    duration: "4m",
    year: "2026",
  },
  {
    id: "video-5",
    slug: "superstar-previz",
    title: "Superstar — Visualising the story",
    description: "A three-minute previsualisation exploring cinematic staging, camera choices and editorial rhythm for narrative filmmaking.",
    videoUrl: `${MEDIA_BASE}/all-content/${encodeURIComponent("Superstar-previz[3mins].mov")}`,
    posterUrl: "/assets/posters/superstar-2026.jpg",
    categories: ["Feature Film Previz"],
    client: "Superstar",
    duration: "3m",
    year: "2026",
  },
  {
    id: "video-6",
    slug: "tata-1mg-commercial",
    title: "Tata 1mg — A dose of storytelling",
    description: "A 40-second commercial combining character-driven storytelling, visual effects and a compact advertising narrative.",
    videoUrl: `${MEDIA_BASE}/all-content/${encodeURIComponent("TATA-1MG[40secs].mov")}`,
    posterUrl: "/assets/posters/tata1mg-2026.jpg",
    categories: ["Commercial"],
    client: "TATA 1MG",
    duration: "40s",
    year: "2026",
  },
  {
    id: "video-7",
    slug: "zepto-raksha-bandhan",
    title: "Zepto — Raksha Bandhan 2026",
    description: "A festive advertising film exploring the sibling bond through a Raksha Bandhan story and a brand-led occasion.",
    videoUrl: `${MEDIA_BASE}/all-content/${encodeURIComponent("Zepto-Raksha-Bandhan-2026.mov")}`,
    posterUrl: "/assets/posters/zepto-2026.jpg",
    categories: ["Commercial"],
    client: "Zepto",
    duration: "Festive film",
    year: "2026",
  },
];

/** Earlier showreel exports are alternate encodes of these same portfolio films. */
const legacyFilmIds: Record<string, string> = {
  "portfolio-1.mp4": "video-6",
  "portfolio-2.mp4": "video-1",
  "portfolio-3.mp4": "video-0",
  "portfolio-4.mp4": "video-2",
  "portfolio-5.mp4": "video-4",
  "portfolio-6.mp4": "video-5",
};
export function getWorkVideoBySource(src: string) {
  const file = decodeURIComponent(src.split("/").pop()?.split("?")[0] || "");
  return workVideos.find(video => video.videoUrl === src || video.id === legacyFilmIds[file]);
}
