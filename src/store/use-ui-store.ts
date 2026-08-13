import { create } from "zustand";

interface UIState {
  isConnectModalOpen: boolean;
  openConnectModal: () => void;
  closeConnectModal: () => void;
}

export const useUIStore = create<UIState>((set) => ({
  isConnectModalOpen: false,
  openConnectModal: () => set({ isConnectModalOpen: true }),
  closeConnectModal: () => set({ isConnectModalOpen: false }),
}));
