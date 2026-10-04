/** Contact intent is distinct from a successfully received Lead. No visitor data is sent. */
export function trackMetaContact(pixel: ((...args: unknown[]) => void) | undefined, consent: boolean, method: "phone_click" | "whatsapp_click") {
  if (!consent || !pixel) return false;
  try {
    pixel("track", "Contact", { content_name: method });
    return true;
  } catch { return false; /* Vendor failures must never interrupt contact navigation. */ }
}
