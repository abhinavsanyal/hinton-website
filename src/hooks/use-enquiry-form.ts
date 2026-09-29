"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { useCookieStore } from "@/components/common/Cookie/cookieStore";
import { trackEvent, trackLead } from "@/components/analytics/analytics";

type Method = "contact_form" | "contact_modal" | "project_brief";
type Enquiry = { name?: string; email: string; message: string; website?: string };
/** All enquiry surfaces share delivery, analytics and acknowledgement behavior. */
export function useEnquiryForm(method: Method) {
  const router = useRouter();
  const pending = useRef(false);
  const started = useRef(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const measure = (name: string, extra: Record<string, string> = {}) => {
    try { trackEvent(name, { form_id: method, ...extra }); } catch { /* Measurement never blocks an enquiry. */ }
  };
  function start() {
    if (started.current) return;
    started.current = true;
    measure("enquiry_form_start");
  }
  function invalid() { measure("enquiry_form_invalid"); }
  async function submit(input: Enquiry, onSuccess?: () => void) {
    if (pending.current) return;
    pending.current = true; setBusy(true); setError("");
    measure("enquiry_form_attempt");
    let received = false;
    try {
      const response = await fetch("/api/contact", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...input, source: method, marketingConsent: useCookieStore.getState().consent?.marketing ?? false }),
      });
      const body = await response.json();
      if (!response.ok || !body.data?.received || typeof body.data.eventId !== "string") {
        measure("enquiry_form_error", { error_code: body.error?.code || "delivery_error" });
        setError(body.error?.message || "We couldn’t deliver your enquiry. Your message is still here—please try again or contact us below.");
        return;
      }
      received = true;
      measure("enquiry_form_success");
      try { trackLead(method, body.data.eventId); } catch { /* Delivery already succeeded. */ }
      onSuccess?.();
      // The server sets a short-lived, HttpOnly receipt, with no personal form data.
      router.push("/thank-you");
      router.refresh();
    } catch {
      measure("enquiry_form_error", { error_code: "network_error" });
      setError("We couldn’t confirm delivery. Keep your message here and try again, or contact the studio below.");
    } finally {
      if (!received) { pending.current = false; setBusy(false); }
    }
  }
  return { busy, error, start, invalid, submit };
}
