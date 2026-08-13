import { publicEnv } from "@/env";

// The base URL for large media files (Cloudflare R2, Bunny, etc.)
// If unset during local development, falls back to the local public folder.
const MEDIA_BASE = publicEnv.NEXT_PUBLIC_MEDIA_URL 
  ? publicEnv.NEXT_PUBLIC_MEDIA_URL.replace(/\/$/, "") 
  : "/assets";

export interface WorkVideo {
  id: string;
  title: string;
  videoUrl: string;
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
    title: "3D Animation Kookie Kandy",
    videoUrl: `${MEDIA_BASE}/all-content/${encodeURIComponent("3D Animation Kookie Kandy[30sec].mov")}`,
    categories: ["3D Animation", "Commercial"],
    client: "Kookie Kandy",
    duration: "30s",
    year: "2024",
  },
  {
    id: "video-1",
    title: "Dominoz",
    videoUrl: `${MEDIA_BASE}/all-content/${encodeURIComponent("Dominoz[30sec].mov")}`,
    categories: ["Commercial"],
    client: "Dominoz",
    duration: "30s",
    year: "2024",
  },
  {
    id: "video-2",
    title: "Horror Comedy Soda AD",
    videoUrl: `${MEDIA_BASE}/all-content/${encodeURIComponent("Horror Comedy Soda AD[60secs].mov")}`,
    categories: ["Commercial", "Comedy"],
    client: "Soda Brand",
    duration: "60s",
    year: "2024",
  },
  {
    id: "video-3",
    title: "Ilaiyaraaja Birthday Tribute",
    videoUrl: `${MEDIA_BASE}/all-content/${encodeURIComponent("Ilaiyaraaja-birthday-tribute-final-cut.mov")}`,
    categories: ["Tribute", "Commercial"],
    client: "Ilaiyaraaja",
    duration: "Various",
    year: "2024",
  },
  {
    id: "video-4",
    title: "Nishiddham",
    videoUrl: `${MEDIA_BASE}/all-content/${encodeURIComponent("Nishiddham-previz[4mins].mov")}`,
    categories: ["Previz"],
    client: "Nishiddham",
    duration: "4m",
    year: "2024",
  },
  {
    id: "video-5",
    title: "Superstar",
    videoUrl: `${MEDIA_BASE}/all-content/${encodeURIComponent("Superstar-previz[3mins].mov")}`,
    categories: ["Previz"],
    client: "Superstar",
    duration: "3m",
    year: "2024",
  },
  {
    id: "video-6",
    title: "TATA 1MG",
    videoUrl: `${MEDIA_BASE}/all-content/${encodeURIComponent("TATA-1MG[40secs].mov")}`,
    categories: ["Commercial"],
    client: "TATA 1MG",
    duration: "40s",
    year: "2024",
  },
];
