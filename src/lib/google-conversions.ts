/** The custom Google Ads event supplied by the account owner. No purchase value is invented. */
export const ADS_CONVERSION_EVENT = "conversion_event_purchase";
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

export function createConversionTracker() {
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
    const params: Record<string, unknown> = { method };
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
    // Use the connected tag's default destinations, matching the supplied snippet.
    gtag("event", ADS_CONVERSION_EVENT, params);
    return true;
  };
}
