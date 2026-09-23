/** IDs returned by Google's live configuration on 2026-09-23 identify one tag. */
export const GA_ID = "G-J75JY1GDPW";
export const GOOGLE_TAG_ALIASES = [GA_ID, "GT-TNSSVPSG", "AW-18469066667"];
export type GoogleCommand = (...args: unknown[]) => void;
export interface GoogleTagState {
  started: boolean;
  configured: boolean;
  analyticsPageStarted: boolean;
  adsConfigured: string[];
}
export function createGoogleTagState(): GoogleTagState {
  return { started: false, configured: false, analyticsPageStarted: false, adsConfigured: [] };
}

/** Idempotent across route effects, consent changes and component remounts.
 * Google Enhanced Measurement owns subsequent history-based page views.
 */
export function configureGoogleTag(
  state: GoogleTagState,
  gtag: GoogleCommand,
  consent: { analytics: boolean; marketing: boolean },
  adsId?: string,
) {
  if (!consent.analytics && !(consent.marketing && adsId)) return false;
  if (!state.started) {
    state.started = true;
    gtag("js", new Date());
  }
  if (!state.configured) {
    state.configured = true;
    state.analyticsPageStarted = consent.analytics;
    gtag("config", GA_ID, { send_page_view: consent.analytics });
  } else if (consent.analytics && !state.analyticsPageStarted) {
    // Marketing-only consent may have started the tag without its initial GA view.
    state.analyticsPageStarted = true;
    gtag("event", "page_view", { send_to: GA_ID });
  }
  if (consent.marketing && adsId && !GOOGLE_TAG_ALIASES.includes(adsId) && !state.adsConfigured.includes(adsId)) {
    state.adsConfigured.push(adsId);
    gtag("config", adsId, { send_page_view: false });
  }
  return true;
}
