
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
