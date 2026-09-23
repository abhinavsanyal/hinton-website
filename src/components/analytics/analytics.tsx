"use client";

import { GA_ID, configureGoogleTag, createGoogleTagState, type GoogleTagState } from "@/lib/google-tag";
import { publicEnv } from "@/env";
import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import { useCookieStore } from "@/components/common/Cookie/cookieStore";

type Pixel = ((...args: unknown[]) => void) & { callMethod?: (...args: unknown[]) => void; queue: unknown[][]; push?: Pixel; loaded: boolean; version: string };
declare global {
  interface Window {
    dataLayer: unknown[];
    hintonGoogleTagState?: GoogleTagState;
    fbq?: Pixel;
    _fbq?: Pixel;
    gtag?: (...args: unknown[]) => void;
    clarity?: (...args: unknown[]) => void;
  }
}
function loadScript(id: string, src: string) {
  if (document.getElementById(id)) return;
  const script = document.createElement("script");
  script.id = id; script.async = true; script.src = src;
  document.head.appendChild(script);
}
export function trackEvent(name: string, params: Record<string, string> = {}) {
  if (!useCookieStore.getState().consent?.analytics) return;
  window.gtag?.("event", name, { ...params, send_to: GA_ID });
}
export function trackLead(method: string, eventId: string) {
  trackEvent("generate_lead", { method });
  if (!useCookieStore.getState().consent?.marketing) return;
  const { NEXT_PUBLIC_GOOGLE_ADS_ID: adsId, NEXT_PUBLIC_GOOGLE_ADS_LEAD_LABEL: label } = publicEnv;
  if (adsId && label) window.gtag?.("event", "conversion", { send_to: `${adsId}/${label}`, transaction_id: eventId });
  window.fbq?.("track", "Lead", { content_name: method }, { eventID: eventId });
}
export function Analytics() {
  const lastPage = useRef("");
  const lastMetaPage = useRef("");
  const pathname = usePathname();
  const consent = useCookieStore((s) => s.consent);
  useEffect(() => {
    window.dataLayer ||= [];
    // Google’s command queue expects an Arguments object (official gtag bootstrap).
    // eslint-disable-next-line prefer-rest-params
    window.gtag ||= function () { window.dataLayer.push(arguments); };
    window.gtag("consent", "update", {
      analytics_storage: consent?.analytics ? "granted" : "denied",
      ad_storage: consent?.marketing ? "granted" : "denied",
      ad_user_data: consent?.marketing ? "granted" : "denied",
      ad_personalization: consent?.marketing ? "granted" : "denied",
    });
    if (consent?.marketing && publicEnv.NEXT_PUBLIC_META_PIXEL_ID) {
      if (!window.fbq) {
        const pixel: Pixel = Object.assign((...args: unknown[]) => { if (pixel.callMethod) pixel.callMethod(...args); else pixel.queue.push(args); }, { queue: [] as unknown[][], loaded: true, version: "2.0" });
        pixel.push = pixel; window.fbq = pixel; window._fbq = pixel;
        pixel("init", publicEnv.NEXT_PUBLIC_META_PIXEL_ID);
        loadScript("hinton-meta", "https://connect.facebook.net/en_US/fbevents.js");
      }
      window.fbq("consent", "grant");
      if (lastMetaPage.current !== pathname) { window.fbq("track", "PageView"); lastMetaPage.current = pathname; }
    } else window.fbq?.("consent", "revoke");
    const googleState = window.hintonGoogleTagState ||= createGoogleTagState();
    if (configureGoogleTag(googleState, window.gtag, {
      analytics: consent?.analytics ?? false,
      marketing: consent?.marketing ?? false,
    }, publicEnv.NEXT_PUBLIC_GOOGLE_ADS_ID)) {
      loadScript("hinton-google", `https://www.googletagmanager.com/gtag/js?id=${GA_ID}`);
    }
    if (!consent?.analytics) {
      window.clarity?.("consentv2", { analytics_Storage: "denied", ad_Storage: "denied" });
      return;
    }
    if (!document.getElementById("hinton-clarity")) {
      const queue: unknown[][] = [];
      window.clarity ||= Object.assign((...args: unknown[]) => { queue.push(args); }, { q: queue });
      loadScript("hinton-clarity", "https://www.clarity.ms/tag/ymm8snva5u");
    }
    window.clarity?.("consentv2", { analytics_Storage: "granted", ad_Storage: consent.marketing ? "granted" : "denied" });
    // Only custom engagement is manual. Google tracks page views on load/history.
    if (lastPage.current === pathname) return;
    lastPage.current = pathname;
    if (pathname === "/work" || pathname.startsWith("/work/") || pathname === "/audio-samples") trackEvent("view_work", { page_path: pathname });
  }, [consent, pathname]);
  useEffect(() => {
    const onClick = (event: MouseEvent) => {
      const target = event.target instanceof Element ? event.target.closest<HTMLElement>("a,button") : null;
      if (!target || target.closest("[data-share-dialog]")) return;
      const href = target.getAttribute("href") || "";
      const name = href.startsWith("mailto:") ? "email_click" : href.startsWith("tel:") ? "phone_click" : /wa.me|api.whatsapp.com/.test(href) ? "whatsapp_click" : target.hasAttribute("data-cal-link") || target.hasAttribute("data-cta") ? "cta_click" : null;
      if (name) trackEvent(name, { page_path: location.pathname });
    };
    document.addEventListener("click", onClick, true);
    return () => document.removeEventListener("click", onClick, true);
  }, []);
  return null;
}
