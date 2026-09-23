"use client";

import { useEffect, useId, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { siteConfig } from "@/lib/site";
import { trackEvent } from "@/components/analytics/analytics";

export function ShareVideo({ slug, title }: { slug: string; title: string }) {
  const [open, setOpen] = useState(false);
  const [status, setStatus] = useState("");
  const id = useId();
  const dialog = useRef<HTMLDialogElement>(null);
  useEffect(() => { if (open) dialog.current?.showModal(); }, [open]);
  const trigger = useRef<HTMLButtonElement>(null);
  const url = `${siteConfig.url}/work/${slug}`;
  const encodedUrl = encodeURIComponent(url);
  const encodedTitle = encodeURIComponent(`${title} — Hinton Studios`);
  const record = (method: string) => trackEvent("share", { method, content_type: "video", item_id: slug });
  async function copy() {
    try { await navigator.clipboard.writeText(url); setStatus("Link copied. Paste it into your favourite app."); record("copy_link"); }
    catch { setStatus("Copy the film link from the field below."); }
  }
  async function nativeShare() {
    if (!navigator.share) { await copy(); return; }
    try { await navigator.share({ title, url }); record("native"); }
    catch (error) { if (!(error instanceof DOMException && error.name === "AbortError")) setStatus("Sharing is unavailable here. Try copying the link."); }
  }
  return <div className="share-video" onClick={event => event.stopPropagation()} onKeyDown={event => { if (event.key === "Escape") { event.stopPropagation(); setOpen(false); trigger.current?.focus(); } }}>
    <button ref={trigger} type="button" className="quiet-button" aria-expanded={open} aria-controls={id} aria-label={`Share ${title}`} onClick={() => setOpen(!open)}><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden="true"><path d="m8 7 4-4 4 4M12 3v12M5 12v8h14v-8" /></svg>Share</button>
    {open && createPortal(<dialog ref={dialog} id={id} className="share-panel" data-share-dialog aria-label={`Share ${title}`} onCancel={() => setOpen(false)} onClose={() => { setOpen(false); trigger.current?.focus(); }}><div className="film-actions"><p>Share this film</p><button type="button" className="quiet-button" onClick={() => dialog.current?.close()}>Close</button></div><div className="action-row">
      <button type="button" className="quiet-button" onClick={nativeShare}>Share to apps</button>
      <button type="button" className="quiet-button" onClick={copy}>Copy link</button>
      {[
        ["WhatsApp", `https://wa.me/?text=${encodedTitle}%20${encodedUrl}`],
        ["Facebook", `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`],
        ["X", `https://twitter.com/intent/tweet?text=${encodedTitle}&url=${encodedUrl}`],
        ["LinkedIn", `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`],
        ["Email", `mailto:?subject=${encodedTitle}&body=${encodedUrl}`],
      ].map(([label, href]) => <a key={label} className="quiet-button" href={href} target="_blank" rel="noopener noreferrer" onClick={() => record(label.toLowerCase())}>{label}</a>)}
    </div><label className="share-url">Film link<input value={url} readOnly onFocus={event => event.target.select()} /></label><small>For Instagram and other apps, use your device’s share menu or paste the link.</small><p role="status">{status}</p></dialog>, document.body)}
  </div>;
}
