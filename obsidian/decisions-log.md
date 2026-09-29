
## 2026-09-23 — Consent-aware measurement and honest delivery status

Marketing/analytics integrations are gated by the visitor's chosen categories. Contact success means the studio notification was delivered to SMTP; missing configuration returns a clear failure. Browser and server Meta Lead events share a server-generated ID. The free website review performs bounded, public HTML checks with DNS pinning; it is explicitly not represented as an AI analysis. Audio remains noindex until approved samples are supplied. Real Hinton branding replaces starter artwork and native typography replaces hundreds of unused font subset downloads. See [[frontend/launch-readiness]].

## Portfolio follow-up: stable watch URLs and source frames
Each portfolio film has a stable `/work/[slug]` page and a 2026 poster extracted from its own source media. Social sharing uses the production canonical URL and a film-specific OG image. Native dialog sharing is rendered through a portal so card overflow and the video overlay cannot clip it. Native share supports installed apps; Instagram is served by device sharing/copy-link rather than a fabricated web-share endpoint. Verified exact upload dates remain outstanding; no dates or review ratings are invented for schema.

Legacy animation and combined brand/product service routes permanently redirect to canonical services. Navigation generation excludes the retired entries, while related links are remapped. The old animation examples and production detail are retained in the consolidated animation page.

## Google tag: one owner for page views
The public Google configuration enables Enhanced Measurement history events. Use Google automatic initial/history page views; do not combine these with manual per-route events. `lib/google-tag.ts` owns a per-document state reused through `window.hintonGoogleTagState` so remounts, route effects and consent changes do not configure the same tag twice. Only a transition from marketing-only initialization to analytics consent requires one explicit initial page view. Connected GT/G/AW IDs are aliases, not extra installations. A separate Ads account remains supported with one configuration and `send_page_view: false`.

References: https://support.google.com/analytics/answer/12326985 and https://developers.google.com/analytics/devguides/collection/ga4/views .

## Google Ads conversions: explicit lead outcomes
Use the owner's supplied custom event and approved enquiry/contact-click triggers. Since contact forms display inline success, emit on confirmed API success rather than every page load. Do not invent a purchase value. Preserve default connected-tag routing for this custom Ads event, while ordinary analytics events remain GA4-targeted. Replace legacy label-based conversion emission to prevent dual signals. Marketing consent controls all Ads conversion emission; contact navigation must work even if the Google script is blocked.

## Journal: source-backed articles and personal reactions
Keep the first ten article URLs while introducing typed, sourced feature stories. Verified vendor capabilities and published market data are attributed beside the relevant paragraphs; workflow recommendations are original editorial guidance, not claimed studio benchmarks. Model names are verified against official documentation. Do not equate total ad spend with AI production revenue or occupational exposure with job losses.

Article HTML, images and metadata render on the server. Client leaves handle reactions, spring motion, sharing and engagement. Reactions persist only on the reader’s device and are explicitly labelled; there is no aggregate backend or fabricated social proof. Analytics consent gates all article events. Reading completion requires 90% depth plus 30 seconds of foreground time; it remains an engagement proxy, not evidence that the reader understood the article, and is not an advertising conversion.

## Google Ads: align website event with the verified import (29 September 2026)
The signed-in Ads account revealed action 7796649086 imports `manual_event_REQUEST_QUOTE`, not the previously supplied `conversion_event_purchase`. Reuse this established primary campaign action for the owner-approved enquiries/WhatsApp/phone outcomes. Route directly to GA4, retain method and server event ID, and do not emit a second purchase or AW-label conversion. The legacy event name remains stable while the Ads display name describes its actual meaning. Count One avoids treating repeated contact actions after one ad interaction as separate leads.

## Enquiries: password-free delivery with explicit acceptance (29 September 2026)
The owner declined SMTP credential setup and requested To abhinava@hintonstudios.com with CC souvik@hintonstudios.com and avkash@hintonstudios.com. Use FormSubmit's server-side AJAX endpoint when SMTP is incomplete. Recipients and template are fixed in code, and visitor data never configures destinations. Keep optional SMTP for future branded sender/autoresponse support. Do not silently fail over after a send error, which could duplicate leads. FormSubmit activation and `success: "false"` must fail closed; only acceptance creates an acknowledgement receipt and allows client lead conversion. FormSubmit AJAX has no autoresponse; show on-site acknowledgement honestly. No email provider secrets enter the browser.
