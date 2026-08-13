import { create } from "zustand";

interface VideoState {
  isOpen: boolean;
  videoSrc: string | null;
  open: (src: string) => void;
  close: () => void;
}

export const useVideoStore = create<VideoState>((set) => ({
  isOpen: false,
  videoSrc: null,
  open: (src) => set({ isOpen: true, videoSrc: src }),
  close: () => set({ isOpen: false, videoSrc: null }),
}));
