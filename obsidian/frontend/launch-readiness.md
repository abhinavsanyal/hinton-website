# Launch readiness — 23 September 2026

## Implementation map

- `components/analytics/analytics.tsx`: consent-aware GA4, Clarity, optional Ads and Meta browser events. `generate_lead` runs after delivered contact submissions. `view_work`, `cta_click`, `whatsapp_click`, `phone_click`, `email_click`, `lead_tool_submission` cover visitor actions. Google owns automatic page-load/history measurement and its standard URL attribution. Custom events are explicitly routed to GA4; form contents are not analytics parameters. Do not place personal form data in URLs.
- `lib/meta-conversions.ts`: optional server-side Lead, SHA-256 email and shared event ID for browser/server deduplication. Server secrets are read through `env.ts`; configure a supported Graph API version from the advertiser's Meta app.
- `lib/mail.ts`, `api/contact`: SMTP notification and separate confirmation with portfolio link. Failed confirmation does not cause duplicate lead submission.
- `lib/website-audit.ts`, `api/video-report`, `views/report-*`: deterministic public homepage HTML review with bounded response size, timeout, no redirects, public IPv4 validation and pinned DNS. No external AI provider is configured; the UI explicitly describes this as a basic rules-based review. Report is shown even if email is unavailable, without pretending it was emailed.
- `views/editorial.tsx`, `data/articles.ts`: ten original guides (three AI/technical, six filmmaking/advertising/micro-drama, one broad public-interest/political production article). No invented endorsements or political campaign results.
- `data/audio-samples.ts`, `components/ui/audio-player.tsx`: approved-media manifest and inline player with native download affordance disabled. Empty collection remains noindex. Publicly playable audio cannot be made impossible to save.
- `components/common/site-overlays.tsx`: load video/contact modals only when opened. No protected spring-engine files were changed.
- `lib/media-posters.ts`: explicit source/poster mapping. All eight portfolio posters and six legacy showreel posters re-extracted from actual media, with versioned 2026 filenames. Legacy exports are mapped to canonical watch pages. Incorrect legacy episode and animation labels were removed.
- Brand assets: geometric H, black/white and red. Real Hinton logo replaces purple-star browser/share graphics. Trendloud logo sourced from https://trendloud.com/images/logo-main.png; IIFFCA logo from the supplied https://www.instagram.com/iiffca.fed/ profile. Nice Kidz logo from https://nicekidz.com/cdn/shop/files/Nice_Kidz_Page_1.png?v=1769083446&width=500; BJP logo from https://commons.wikimedia.org/wiki/File:Logo_of_the_Bharatiya_Janata_Party.svg (source attribution SantoUY / Commons; SVG hosted locally). Logo credit refers to the user-stated BJP IT Cell relationship.

## External configuration still required

1. Configure SMTP environment variables from `.env.example`, verify sender domain SPF/DKIM/DMARC and run a real inbox delivery check. Local SMTP test sink verified both studio and confirmation messages; no real messages were sent during those tests.
2. In GA4, review Realtime/DebugView, mark `generate_lead` as a key event, link Google Ads and exclude local/test traffic. Keep Enhanced Measurement → Page views → Page changes based on browser history events enabled. Google owns page views; do not add a second manual page-view/GTM implementation.
3. Google Ads action `7796649086` imports GA4 `manual_event_REQUEST_QUOTE` from Hinton Studios and is used by Hinton Search Ads. Its display name is “Website enquiries & WhatsApp / phone clicks”, primary, count One. The site explicitly sends this event to `G-J75JY1GDPW`; no AW conversion-label variable is needed. Do not additionally import `generate_lead` for the same actions. Set the Meta Pixel ID. Add Meta CAPI access token, supported API version and temporary test-event code in server environment; verify matching browser/server event IDs in Events Manager, then remove test code. Account mapping was verified on 29 September; actual paid-click attribution still requires a genuine ad-sourced conversion.
4. Configure WhatsApp Business greeting/away automation in the account. A website click cannot automatically reply inside WhatsApp. Suggested greeting: “Thanks for contacting Hinton Studios. Explore our films and samples at https://www.hintonstudios.com/work. Share your brief, target date and preferred format, and our team will follow up.”
5. Supply approved team names, roles, bios/photos, licensed audio clips. About currently describes the studio and names existing contacts without inventing biographies.
6. VideoObject markup uses known title, description, content URL and thumbnail. Eight individual watch pages are now implemented. Supply verified upload dates before claiming Google video-rich-result eligibility.
7. Review original service statistics and client/work dates against business records; do not infer actual results from inherited sample content. The owner requested removal of testimonials; no testimonials are displayed. Film years were confirmed as 2026 by the owner.
8. Deploy, validate production canonical origin/environment values, submit the sitemap to Search Console, run URL Inspection and monitor actual Core Web Vitals. Local Lighthouse results are lab measurements, not guaranteed production load times or rankings.
9. Rate limiting is process-local. Use hosting WAF/distributed rate limits for multi-instance deployments and stronger spam resistance as volume grows.

## Validation

- TypeScript and production build; ESLint.
- Crawl of 38 local HTML pages: one H1, unique canonical matching route, description present, parseable JSON-LD and no unresolved internal page links.
- Browser desktop/mobile: responsive layouts, no horizontal overflow, contact success and local confirmation delivery, video playback and Escape close, cookie acceptance/rejection and persistence, GA4 request to the supplied measurement ID.
- API checks: invalid email 400; unconfigured SMTP 503; private URL 400; public homepage review 200; mock SMTP delivery and report email 200.
- Detailed final Lighthouse metrics are recorded in the user-facing handoff report.

## Navigation build step

`npm run generate:nav` derives a small navigation manifest from the full service content source. The production build runs it automatically; run it after changing services during development. This prevents footer/navigation imports from bundling all long service descriptions into every page. The final type stack uses native system fonts with no font downloads.

## Initial render

The root `loading.tsx` returned null and wrapped otherwise static pages in a streaming boundary. The resulting HTML contained a hidden `S:0` page awaiting JavaScript reveal. It was removed so initial content can render without waiting for that reveal. The protected spring engine was not changed.

## Follow-up verification
- ESLint, TypeScript and production build passed after the follow-up changes.
- Project brief mobile success and confirmation delivery verified through a local SMTP sink; success is focused and scrolled into view. Missing SMTP produces an explicit error.
- Four client logos load; all eight watch-page posters load; six legacy preview frames inspected.
- Native share dialog, copy-link, Escape, video playback (readyState 4, playback advancing), disabled Originals, mobile navigation and no horizontal overflow checked.
- Follow-up Lighthouse mobile: performance 93, accessibility 100, best practices 100, SEO 100, LCP 3.2s, FCP 0.9s, CLS 0, TBT 40ms. This lab run precedes the final smaller legacy-poster and form-focus refinements; production field data remains outstanding.

## Google tag audit — duplicate page views
The live Google tag response lists `G-J75JY1GDPW|GT-TNSSVPSG|AW-18469066667` together. Its Enhanced Measurement history setting is enabled. Before the fix, live navigation from Home to About produced two GA4 `page_view` requests for About. The website contained one Google loader.

After the fix, the local production build was checked with the actual Google library: no Google loader before consent; one loader, one `js` initialization, one canonical config; one initial page view and one page view for each settled Journal → Work → back navigation. Custom `view_work` remains separate. Four initialization/consent regression tests, ESLint and the production build passed. No Google Analytics/Ads account settings were modified; preserve the existing automatic history measurement setting.

## Google Ads conversion event — 27 September 2026
- Owner-approved triggers: successful enquiries and direct WhatsApp/phone clicks. `trackLead` sends `manual_event_REQUEST_QUOTE` (corrected 29 September to match the existing Ads import) after contact API success in the footer, contact modal and project planner. These inline success states are the conversion-page equivalent; ordinary page loads, failed forms, email links, share links and report previews are not Ads conversions.
- Marketing consent is required. The connected tag can initialize with marketing-only consent even without an optional Ads ID. The existing automatic page-view owner is unchanged.
- Enquiries deduplicate by server event ID per document. The old label-based Google conversion emission was replaced, avoiding two Google conversion signals for one submission. GA4 `generate_lead` and Meta Lead remain separate.
- Same-tab direct contact navigation waits for the callback, with an independent two-second fallback and once-only navigation. New-tab and modifier-click behavior is preserved. No form values or invented purchase values are sent.
- Verify real attribution in Google Ads/Tag Assistant after deployment; local stubbed tests do not prove account-side recording or campaign attribution.

## Journal measurement — September 2026
- `select_content`: article discovery, with `content_type`, `item_id`, and placement (`home` / `blog`).
- `article_view`: article opened after analytics consent. `article_scroll`: once each at 25%, 50%, 90% of article body. `article_engaged`: 30 foreground seconds while body is visible. `article_complete`: at least 30 foreground seconds and 90% depth.
- `article_reaction`: clap/love add/remove, article slug and personal reaction count. Counts reflect this device only.
- `share`: article identifier, method, `content_type: article`; cancelled native sharing does not record success. Social links measure a share intent, not confirmed publication.
- `article_cta_click`: article slug and same-site destination. These events do not call the Ads conversion tracker; the existing successful-enquiry / phone / WhatsApp rules remain the only Ads triggers.
- Configure GA4 custom dimensions for `article_slug`, `placement`, `reaction` and other parameters if needed for exploration reports. No Analytics or Ads account settings are changed by this code.

### Journal validation
- ESLint, TypeScript/production build and nine existing Google tag/conversion regression tests pass.
- All 15 article pages checked for one H1, matching canonical and parseable structured data. The five new pages each render exactly two described article images and a unique cover in social metadata.
- Desktop and 390px mobile browser checks: no horizontal overflow, images load, Blogs menu resolves correctly, homepage has three featured cards, footer location is consolidated.
- Reaction preferences survive reload; no event emitted before analytics consent. With a stubbed tag, clap/love and copy-share events carry the article identifier, and no Ads conversion event is emitted. Native dialog Escape and canonical share URL verified.
- Source audit: FICCI–EY’s official PDF was downloaded and its animation/VFX/post-production table cross-checked. The full report URL was corrected to the publisher’s actual download link.
- Timed browser check confirmed one `article_engaged` and one `article_complete` at 30 foreground seconds after reaching 90% depth; no duplicate milestone events in the captured queue.

## Google Ads mapping repair — 29 September 2026
- Signed-in Ads inspection showed the campaign uses Request quote and Google-hosted Lead form goals. The previous `conversion_event_purchase` was not the event imported by its Request quote action.
- The approved site outcomes now emit only `manual_event_REQUEST_QUOTE`, explicitly routed to GA4. The existing action was renamed to describe enquiries and contact clicks, and Count changed from Every to One; no duplicate action, new tag loader, campaign budget or bid change.
- Public Google configuration confirms this event is already a key event and G/GT/AW IDs remain connected aliases. Existing `ads_conversion_submit_lead_form` is generated from raw `form_submit`, so it was not repurposed or added to the campaign; raw submission attempts must not become website-success conversions.
- Form success deduplication, marketing consent and delayed navigation fallback are retained. WhatsApp/phone clicks indicate contact intent, not confirmed conversations.
- Verification: ESLint, production build and 10 tracking regression tests passed. Production served the new event bundle. In Chrome Tag Assistant on the live domain, a controlled WhatsApp navigation produced one `manual_event_REQUEST_QUOTE` event and Hits Sent showed that event plus its GA4 conversion hit to G-J75JY1GDPW. One connected Google tag was detected, with G/GT/AW aliases; no console errors in Tag Assistant. No WhatsApp message or test form enquiry was sent. Paid-ad attribution and clearing the Ads warning remain dependent on genuine eligible activity and Google processing.
