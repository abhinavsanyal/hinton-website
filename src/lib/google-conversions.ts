/** Existing GA4 import used by Hinton Search Ads (action 7796649086).
 * Keep the legacy event name: renaming the Ads action does not change its GA4 mapping.
 */
export const ADS_CONVERSION_EVENT = "manual_event_REQUEST_QUOTE";
export const CONVERSION_TIMEOUT_MS = 2000;
type Command = (...args: unknown[]) => void;

export function contactConversionMethod(href: string): "phone_click" | "whatsapp_click" | null {
  if (href.startsWith("tel:")) return "phone_click";
  try {
    const url = new URL(href);
    if (url.protocol === "https:" && ["wa.me", "api.whatsapp.com"].includes(url.hostname)) return "whatsapp_click";
  } catch { /* Non-URL buttons and relative links are not contact conversions. */ }
  return null;
}

export function createConversionTracker(gaMeasurementId: string) {
  const sentLeads = new Set<string>();
  return function sendConversion(
    gtag: Command | undefined,
    marketingConsent: boolean,
    method: string,
    options: { eventId?: string; navigate?: () => void } = {},
  ): boolean {
    if (!marketingConsent || !gtag) return false;
    if (options.eventId && sentLeads.has(options.eventId)) return false;
    if (options.eventId) sentLeads.add(options.eventId);
    const params: Record<string, unknown> = { method, send_to: gaMeasurementId };
    if (options.eventId) params.transaction_id = options.eventId;
    if (options.navigate) {
      let finished = false;
      const finish = () => {
        if (finished) return;
        finished = true;
        clearTimeout(timer);
        options.navigate?.();
      };
      // Independent fallback also works when the vendor script is blocked.
      const timer = setTimeout(finish, CONVERSION_TIMEOUT_MS);
      params.event_callback = finish;
      params.event_timeout = CONVERSION_TIMEOUT_MS;
    }
    // This is an imported GA4 key event, not a direct AW conversion-label event.
    gtag("event", ADS_CONVERSION_EVENT, params);
    return true;
  };
}
