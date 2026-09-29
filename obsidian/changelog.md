
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

## 2026-09-27 — Google Ads custom conversion setup
- Installed the supplied `conversion_event_purchase` event for successful enquiries and WhatsApp/phone clicks, gated by marketing consent.
- Added server-ID deduplication, safe delayed navigation with a two-second fallback, and regression coverage. Replaced the old label-based emission; no second Google loader or automatic page-load conversion added.

## 2026-09-27 — Prefilled WhatsApp enquiries
- Header, footer and project-planner contact links now share the owner's supplied introductory message via `lib/whatsapp.ts`. Omitted the unrelated `utm_source=chatgpt.com` parameter. Video-sharing links retain their film-specific text.
- WhatsApp opens a draft; visitors must tap Send themselves. Existing consent-aware click conversions are unchanged and measure clicks, not confirmed WhatsApp messages.

## 2026-09-27 — Illustrated journal and engagement
- Added five researched articles (approximately 650–900 words each), dated source links, original prompting examples and clearly qualified market/job analysis. Retained the existing ten articles and URLs.
- Added five optimized generated covers and five original SVG explainers; each new story has two images. Artwork direction is recorded in `frontend/journal-artwork.md`.
- Blogs navigation on desktop/mobile, three homepage featured stories, image cards, article-specific social metadata, BlogPosting JSON-LD and dated sitemap entries.
- Added spring-animated clap/love reactions, persistent personal preferences, native/social/copy sharing, reading progress and consent-aware reading/CTA events. No public reaction totals or comments are fabricated. Blog engagement never calls Ads lead conversion tracking.
- Consolidated footer location to one Bengaluru, India line with a location pin. Kept worldwide markets separately.

## 2026-09-27 — Client logo drift
- Added the owner's newly approved 28-client logo list directly between the homepage hero and services marquee. Logo-only presentation, greyscale treatment, soft edge fades and slow continuous React Spring movement.
- Confirmed Caesar AI / Spartan Media / House of Farmer from owner-provided links. Saved optimized local WebP assets (148,702 bytes total) and recorded provenance in `frontend/client-logo-sources.md`.
- Added hover/focus/offscreen/tab visibility pause, a keyboard-accessible pause toggle, and a static scrollable list for reduced motion. Decorative duplicate images are hidden from assistive technology.
- Verified desktop and 390px mobile rendering, all 28 assets loaded, no document horizontal overflow, stable paused transform, and reduced-motion transform/duplicate/overflow behavior. Lint and production build pass; browser reported no errors.

## 2026-09-27 — Opposing grey bands, client film and complete blog imagery
- Replaced the white service ticker with a compact charcoal/grey band. Shared measured React Spring loops now send logos left at 18 px/s and service names right at 29 px/s, with pause and reduced-motion support on both.
- Added the owner's real TrendLoud testimonial as a single prominent click-to-play section. Encoded the full 3:04 source to a 39 MB faststart MP4 and uploaded it to the existing R2 bucket through the signed-in dashboard. Confirmed public access, byte-range delivery and actual browser playback. No media request before the user presses play; consent-aware testimonial engagement tracking is included.
- Generated ten individual editorial covers using the built-in image generation tool. Every one of the 15 blog posts now has a cover, alt text, card image, social preview and BlogPosting image. Made cover/alt required in Article types. Prompt/output manifest: `frontend/blog-cover-prompts.md`.
- Checked the new covers visually, desktop/mobile layouts, opposing transforms, stable pause control, no horizontal overflow, and article image metadata. Lint, production build, all 15 cover file checks and 9 Google tag/conversion regression tests pass.

## 2026-09-27 — Shareable testimonial watch page
- Added Share and Open player actions to the homepage testimonial, plus a dedicated `/testimonials/trendloud` watch page with native playback, fullscreen controls, social previews, canonical URL, sitemap entry and VideoObject schema.
- Reused the share dialog for native sharing, copy link and social destinations with consent-aware share analytics. All shared links stay on hintonstudios.com.

## 2026-09-28 — Activate supplied Meta Pixel
- Set `2163865941221500` as the default public Meta Pixel ID and document it in `.env.example`.
- Reuses the existing shared consent-aware loader: one initialization, PageView on initial consented load and route changes, and Lead after successful enquiries. Optional environment override remains supported.
- No additional inline loader or unconditional noscript beacon is inserted, avoiding duplicate events and tracking before marketing consent. CAPI still requires separate server credentials.

## 2026-09-29 — Repair Google Ads conversion mapping
- Replaced the unmatched purchase event with the verified GA4 import `manual_event_REQUEST_QUOTE`, targeted to G-J75JY1GDPW.
- Existing Ads action renamed “Website enquiries & WhatsApp / phone clicks” and set to Count One. Campaign budgets/bidding unchanged.
- Regression tests verify all five approved trigger methods reach the imported event, with consent, deduplication and navigation fallback preserved.

## 2026-09-29 — Repair enquiry delivery and acknowledgement journey
- Confirmed production contact API returned 503 because SMTP credentials were absent. Owner chose password-free delivery instead of configuring a Google app password.
- Added server-side FormSubmit delivery with fixed To/CC, structured table emails, reply-to, full brief/source/reference and strict provider-response checking. Sent the owner's receiving inbox an activation request; inbox activation and actual inbox arrival still require verification.
- Shared enquiry submission hook now preserves failed briefs, blocks concurrent clicks, separates form attempts/errors from successful Ads leads, and sends accepted submissions to the new branded `/thank-you` page. Added indexable `/contact` and footer navigation; replaced the placeholder calendar in the legacy modal with a working enquiry form.
- Report requests notify the studio independently from visitor email delivery. Password-free AJAX delivery does not support visitor autoresponses; the UI does not promise one. Optional SMTP retains confirmations.
- Added privacy disclosure, large-image preview metadata and form/service/contact engagement events. The acknowledgement is noindex and never a conversion trigger.
- Validation: 13 delivery/Google regression tests, lint and production build; local SMTP browser tests for contact and project briefs, mobile acknowledgement and retained footer input on failure; all 40 sitemap pages passed status, title, description, canonical and H1 checks. Real FormSubmit delivery awaits inbox activation.
