## 2026-09-24 — "Dream in 4K" Instagram reel (video/hinton-reel-2026)

- Added a self-contained motion-graphics project under `video/hinton-reel-2026/`: a 59.9 s Vox-style history of Indian cinema (1913 → 2026) ending on Hinton Studios. It is delivered as a 1080×1920 Reel master and a 1080×1440 feed cut, H.264/AAC, −14 LUFS.
- Composition is deterministic HTML/JS rendered frame-by-frame in headless Chromium (`tools/render.mjs`). Narration is Gemini 3.8 Flash TTS (voice Charon), the score is Lyria 3 Pro, archival-style stills are Gemini 3 Pro Image, and the SFX are synthesised procedurally. The brand logo sting is `public/assets/reload-animation/logo-90.mp4`.
- Only publicly visible portfolio frames are used. Nishiddham, Superstar and portfolio-5/6 are excluded, matching the 2026-09-23 hide. No real person's likeness is generated, and maps are drawn without political borders. Rights notes are in the project README.
- `eslint.config.mjs` now ignores `video/**`; the site build is unaffected.


## 2026-09-23 — SEO, measurement and launch-readiness improvements

- Canonicals now use the live www origin; work and legal pages have their own canonical URLs. Sitemap covers 12 service pages, 10 journal articles, About and the free website review.
- Added focused ad-film, brand-film, product-film, animation, VFX/CGI, reels and UGC-style pages. Added editorial layouts, client strip, About and an audio collection scaffold (noindex until approved audio exists).
- GA4 `G-J75JY1GDPW` and Clarity `ymm8snva5u` load after consent; page and interaction events added. Optional Google Ads, Meta Pixel and deduplicated CAPI lead delivery use environment configuration.
- Fixed Accept all, persisted consent in storage plus a domain cookie, added footer preference access, and corrected dropdown hydration/focusability.
- Contact now fails clearly without SMTP, sends confirmation after successful lead delivery and uses plain text to avoid injecting user HTML. Added same-origin checks, local rate limits, bounded inputs and a website review that pins validated public DNS addresses.
- Matched icons/social images to real Hinton assets. Replaced excessive Japanese font subset loading with native system typography, removed unused script font, deferred booking/modals, removed hero video downloads, optimized poster rendering and extracted the missing Zepto frame.
- Read `frontend/launch-readiness.md` for validation evidence and remaining external setup.
- Removed the empty root loading boundary after finding that it hid prerendered page content until a JavaScript reveal, delaying mobile largest-content paint.

## 2026-09-23 — Logo, portfolio and enquiry follow-up
- Replaced Nice Kidz/BJP text credits with supplied-identity logo assets; accessible names remain as image alt text. Logo row contains no visible name substitutes.
- Added AI Feature Films service and narrative previz examples. Consolidated overlapping animation and brand/product hubs with permanent redirects and removed duplicates from navigation and sitemap.
- Added disabled Originals / Coming soon in desktop and mobile navigation.
- Re-extracted all eight portfolio posters from actual media at 4 seconds; refreshed titles, descriptions and all displayed film years to 2026 as confirmed by the owner. Homepage cards now derive from the same film manifest.
- Added eight static watch pages with individual canonicals, film-specific social preview images, VideoObject and breadcrumbs. Gallery, homepage and player offer native sharing, social links and copy-link.
- Added project-type selection and a short contact brief using the existing validated SMTP endpoint. Added focused starting points for brands, filmmakers, portfolio discovery and editorial guides.
- Updated all five social profile links/handles and Organization sameAs. Added share, video start/completion and project selection analytics, plus watch-page view_work events. Share-to-WhatsApp does not count as a contact click.
- Removed testimonials entirely at the owner's explicit request; no fabricated quotes or faces.
- Follow-up thumbnail audit found black first frames in three legacy showreel exports. Extracted fresh 8-second frames for all six legacy encodes, verified they match existing portfolio films, and mapped their share targets to the corresponding watch pages. Removed incorrectly labelled commercial/previz clips from micro-drama and animation examples. All visible service sample titles now derive from the verified film manifest.
- Form success now moves focus and scrolls to the confirmation panel after the form collapses. Service-page scheduling no longer loads Cal before interaction.
- Fixed a service CTA hydration warning by moving its static background colour out of the spring's initial inline state; hover remains spring-based and protected animation engine files are unchanged.

## 2026-09-23 — Temporarily hide client logos
- Removed the client logo section from the homepage render at the owner’s request. The component and assets remain available for restoration.

## 2026-09-23 — Temporarily hide Nishiddham and Superstar
- Added `hidden: true` on the two film records. The public catalogue excludes them from the work gallery, watch routes, metadata and sitemap; service examples and legacy showreel exports use the same visibility setting.
- Homepage selections now use stable film IDs instead of array indexes, preserving the existing three featured films when other films are hidden.
- Restore either film by removing its `hidden: true` line in `src/data/mocks/work.ts`. Video files, thumbnails and descriptions remain intact.

## 2026-09-23 — Google tag duplicate page-view fix
- Confirmed from Google's served tag configuration that G-J75JY1GDPW, GT-TNSSVPSG and AW-18469066667 identify one Google tag. The live website had one loader, not a separate GT-TNSSVPSG installation.
- Reproduced two GA4 page_view requests for one client-side navigation to About: automatic Enhanced Measurement plus our manual route event.
- Removed manual route page views and let the existing enabled Google history tracking own them. Google initialization/configuration is now once per document, independent of Clarity, with consent-upgrade handling and duplicate alias protection for optional Ads configuration.
- Explicitly route custom analytics events to GA4. Keep Ads conversion events targeted to their configured conversion label.
- Added four regression tests for denied consent, repeated initialization, consent upgrades and distinct Ads destinations (`node --experimental-strip-types --test scripts/google-tag.test.ts`).
