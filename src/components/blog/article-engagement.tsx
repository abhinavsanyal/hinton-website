"use client";

import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import { animated, useReducedMotion, useSpring } from "@react-spring/web";
import { trackEvent } from "@/components/analytics/analytics";
import { useCookieStore } from "@/components/common/Cookie/cookieStore";
import { ShareArticle } from "@/components/common/share-video";

function subscribe(callback: () => void) {
  window.addEventListener("hinton-reaction", callback);
  window.addEventListener("storage", callback);
  return () => { window.removeEventListener("hinton-reaction", callback); window.removeEventListener("storage", callback); };
}
function Reaction({ slug, kind }: { slug: string; kind: "clap" | "love" }) {
  const key = `hinton-article-${slug}-${kind}`;
  const saved = useSyncExternalStore(subscribe, () => {
    try { return Math.min(kind === "clap" ? 50 : 1, Math.max(0, Number(localStorage.getItem(key)) || 0)); }
    catch { return 0; }
  }, () => 0);
  const [temporary, setTemporary] = useState<number | null>(null);
  const count = temporary ?? saved;
  const reduced = useReducedMotion();
  const [spring, api] = useSpring(() => ({ scale: 1 }));
  function react() {
    const next = kind === "love" ? Number(!count) : Math.min(50, count + 1);
    if (next === count) return;
    try { localStorage.setItem(key, String(next)); window.dispatchEvent(new Event("hinton-reaction")); }
    catch { setTemporary(next); }
    void api.start({ from: { scale: 1.16 }, to: { scale: 1 }, immediate: !!reduced, config: { tension: 350, friction: 16 } });
    trackEvent("article_reaction", { article_slug: slug, reaction: kind, action: next ? "add" : "remove", reaction_count: String(next) });
  }
  return <button type="button" className="quiet-button reaction-button" onClick={react} aria-pressed={kind === "love" ? !!count : undefined} aria-label={kind === "love" ? (count ? "Remove love" : "Love this article") : `Clap for this article (${count} of 50)`} disabled={kind === "clap" && count >= 50}>
    <animated.svg style={{ transform: spring.scale.to(value => `scale(${value})`) }} width="22" height="22" viewBox="0 0 24 24" fill={kind === "love" && count ? "currentColor" : "none"} stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      {kind === "love" ? <path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.7l-1.1-1.1a5.5 5.5 0 0 0-7.8 7.8L12 21l8.8-8.6a5.5 5.5 0 0 0 0-7.8Z" /> : <><path d="m8 12-2-4a1.5 1.5 0 0 1 2.6-1.5L12 12l-1-6a1.5 1.5 0 0 1 3-.5l1 7 1-4a1.5 1.5 0 0 1 3 .5l-1 8c-.4 3-2.5 5-5.5 5H11c-2 0-3-1-4-2l-4-5a1.5 1.5 0 0 1 2-2l3 2Z"/><path d="m4 3 1 1M18 2v2M22 6l-2 1"/></>}
    </animated.svg>{kind === "clap" ? `Clap ${count || ""}` : count ? "Loved" : "Love"}
  </button>;
}
export function ArticleActions({ slug, title }: { slug: string; title: string }) {
  return <div className="article-actions"><div className="action-row"><Reaction slug={slug} kind="clap" /><Reaction slug={slug} kind="love" /><ShareArticle slug={slug} title={title} /></div><small>Your reactions · saved on this device</small></div>;
}
export function ArticleEngagement({ slug }: { slug: string }) {
  const analytics = useCookieStore(s => s.consent?.analytics);
  const sent = useRef(new Set<string>());
  const activeSeconds = useRef(0);
  const depth = useRef(0);
  const reduced = useReducedMotion();
  const [progress, api] = useSpring(() => ({ scaleX: 0 }));
  useEffect(() => {
    const article = document.getElementById("article-content");
    if (!article) return;
    function emit(name: string, params: Record<string, string> = {}) {
      const id = `${name}:${params.percent ?? ""}`;
      if (!analytics || sent.current.has(id)) return;
      sent.current.add(id);
      trackEvent(name, { article_slug: slug, ...params });
    }
    function update() {
      if (!article) return;
      const rect = article.getBoundingClientRect();
      depth.current = Math.max(0, Math.min(1, (innerHeight - rect.top) / rect.height));
      void api.start({ scaleX: depth.current, immediate: !!reduced, config: { tension: 210, friction: 30 } });
      if (document.visibilityState !== "visible") return;
      for (const percent of [25, 50, 90]) if (depth.current >= percent / 100) emit("article_scroll", { percent: String(percent) });
    }
    emit("article_view");
    update();
    const timer = window.setInterval(() => {
      const rect = article.getBoundingClientRect();
      if (!analytics || document.visibilityState !== "visible" || rect.bottom <= 0 || rect.top >= innerHeight) return;
      activeSeconds.current++;
      if (activeSeconds.current >= 30) emit("article_engaged", { active_seconds: "30" });
      if (activeSeconds.current >= 30 && depth.current >= .9) emit("article_complete", { active_seconds: String(activeSeconds.current) });
    }, 1000);
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    return () => { clearInterval(timer); window.removeEventListener("scroll", update); window.removeEventListener("resize", update); };
  }, [slug, analytics, api, reduced]);
  return <animated.div className="article-progress" style={progress} aria-hidden="true" />;
}
