// 📖 Docs: obsidian/frontend/components/common.md
"use client";

import { create } from "zustand";

const STORAGE_KEY = "cookie-consent-v1";

export type CookieConsent = {
  /** Strictly necessary — always true, never user-disabled. */
  necessary: true;
  analytics: boolean;
  marketing: boolean;
};

const DEFAULT_CONSENT: CookieConsent = {
  necessary: true,
  analytics: false,
  marketing: false,
};

const loadConsent = (): CookieConsent | null => {
  if (typeof window === "undefined") return null;
  try {
    let raw: string | null = null;
    try { raw = window.localStorage.getItem(STORAGE_KEY); } catch {}
    raw ||= document.cookie.split("; ").find((item) => item.startsWith(`${STORAGE_KEY}=`))?.split("=").slice(1).join("=") ?? null;
    if (raw) raw = decodeURIComponent(raw);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as Partial<CookieConsent>;
    if (typeof parsed.analytics !== "boolean" || typeof parsed.marketing !== "boolean") return null;
    return { necessary: true, analytics: parsed.analytics, marketing: parsed.marketing };
  } catch {
    return null;
  }
};

const saveConsent = (consent: CookieConsent) => {
  const domain = /(^|\.)hintonstudios\.com$/.test(location.hostname) ? "; Domain=hintonstudios.com" : "";
  document.cookie = `${STORAGE_KEY}=${encodeURIComponent(JSON.stringify(consent))}; Path=/; Max-Age=31536000; SameSite=Lax${location.protocol === "https:" ? "; Secure" : ""}${domain}`;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(consent));
  } catch {
    /* ignore storage failures (private mode, quota) */
  }
};

interface CookieStore {
  /** null until the user has decided. After hydration, the banner shows iff this is null. */
  consent: CookieConsent | null;
  /** True once the client has read localStorage — guards against SSR/CSR mismatch. */
  hydrated: boolean;
  modalOpen: boolean;
  hydrate: () => void;
  acceptAll: () => void;
  rejectAll: () => void;
  savePreferences: (next: { analytics: boolean; marketing: boolean }) => void;
  openModal: () => void;
  closeModal: () => void;
}

export const useCookieStore = create<CookieStore>((set, get) => ({
  consent: null,
  hydrated: false,
  modalOpen: false,
  hydrate: () => set({ consent: loadConsent(), hydrated: true }),
  acceptAll: () => {
    const next: CookieConsent = { necessary: true, analytics: true, marketing: true };
    saveConsent(next);
    set({ consent: next, modalOpen: false });
  },
  rejectAll: () => {
    const wasTracking = get().consent?.analytics || get().consent?.marketing;
    const next = { ...DEFAULT_CONSENT };
    saveConsent(next);
    set({ consent: next, modalOpen: false });
    if (wasTracking) window.location.reload();
  },
  savePreferences: ({ analytics, marketing }) => {
    const previous = get().consent;
    const revoked = (previous?.analytics && !analytics) || (previous?.marketing && !marketing);
    const next: CookieConsent = { necessary: true, analytics, marketing };
    saveConsent(next);
    set({ consent: next, modalOpen: false });
    // Reload removes already-running vendor scripts after consent withdrawal.
    if (revoked) window.location.reload();
  },
  openModal: () => set({ modalOpen: true }),
  closeModal: () => set({ modalOpen: false }),
}));
