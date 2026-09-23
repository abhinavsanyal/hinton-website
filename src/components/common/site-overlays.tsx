"use client";
import dynamic from "next/dynamic";
import { useVideoStore } from "@/store/use-video-store";
import { useUIStore } from "@/store/use-ui-store";
const VideoModal = dynamic(() => import("./video-modal").then(m => m.VideoModal), { ssr: false });
const ConnectModal = dynamic(() => import("./connect-modal").then(m => m.ConnectModal), { ssr: false });
export function SiteOverlays() {
  const videoOpen = useVideoStore(s => s.isOpen);
  const contactOpen = useUIStore(s => s.isConnectModalOpen);
  return <>{videoOpen && <VideoModal />}{contactOpen && <ConnectModal />}</>;
}
