## Promo video: code-rendered motion graphics, outside the site build

Promotional video lives in `video/<project>/`, outside `src/` and `public/`, and is excluded from lint. Each project keeps its own composition (HTML/JS rendered frame-by-frame by headless Chromium), preproduction scripts and prompts, audio stems (FLAC) and final encodes. Frame rendering is a pure function of time, so any frame re-renders identically. The site's spring-only animation rule (ADR-0002) governs the website runtime; the video composition uses its own closed-form spring/ease helpers and never ships to visitors. Generative APIs are called from local scripts with `GEMINI_API_KEY` from the environment. Keys are never committed.


## Promo video v4: music-first sound; transitions motivated by the story; stars through their words
The reel's score is edited on the beat grid first, and picture hits follow it. SFX and the clips' own ambience share one hall, and dialogue is ridden per line. Transitions come from the story: irises, a film burn into colour, and a 4K-to-tile-wall match cut. Real stars appear only as short attributed quotations, never as photographs or likenesses. See ADR-0029 in `obsidian/meta/decisions-log.md`.

## 2026-09-23 — Consent-aware measurement and honest delivery status

Marketing/analytics integrations are gated by the visitor's chosen categories. Contact success means the studio notification was delivered to SMTP; missing configuration returns a clear failure. Browser and server Meta Lead events share a server-generated ID. The free website review performs bounded, public HTML checks with DNS pinning; it is explicitly not represented as an AI analysis. Audio remains noindex until approved samples are supplied. Real Hinton branding replaces starter artwork and native typography replaces hundreds of unused font subset downloads. See [[frontend/launch-readiness]].

## Portfolio follow-up: stable watch URLs and source frames
Each portfolio film has a stable `/work/[slug]` page and a 2026 poster extracted from its own source media. Social sharing uses the production canonical URL and a film-specific OG image. Native dialog sharing is rendered through a portal so card overflow and the video overlay cannot clip it. Native share supports installed apps; Instagram is served by device sharing/copy-link rather than a fabricated web-share endpoint. Verified exact upload dates remain outstanding; no dates or review ratings are invented for schema.

Legacy animation and combined brand/product service routes permanently redirect to canonical services. Navigation generation excludes the retired entries, while related links are remapped. The old animation examples and production detail are retained in the consolidated animation page.

## Google tag: one owner for page views
The public Google configuration enables Enhanced Measurement history events. Use Google automatic initial/history page views; do not combine these with manual per-route events. `lib/google-tag.ts` owns a per-document state reused through `window.hintonGoogleTagState` so remounts, route effects and consent changes do not configure the same tag twice. Only a transition from marketing-only initialization to analytics consent requires one explicit initial page view. Connected GT/G/AW IDs are aliases, not extra installations. A separate Ads account remains supported with one configuration and `send_page_view: false`.

References: https://support.google.com/analytics/answer/12326985 and https://developers.google.com/analytics/devguides/collection/ga4/views .
