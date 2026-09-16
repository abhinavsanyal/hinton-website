import { create } from "zustand";

/**
 * Global loader state. With the intro loader removed, both flags default to
 * `true` so any consumer (e.g. the header reveal spring) shows immediately.
 */
export interface LoaderState {
  ready: boolean;
  setReady: (ready: boolean) => void;
  revealed: boolean;
  setRevealed: (revealed: boolean) => void;
}

export const useLoaderStore = create<LoaderState>((set) => ({
  ready: true,
  setReady: (ready) => set({ ready }),
  revealed: true,
  setRevealed: (revealed) => set({ revealed }),
}));
