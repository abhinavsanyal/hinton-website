"use client";
import Link from "next/link";
import { useEnquiryForm } from "@/hooks/use-enquiry-form";
import { FormFeedback } from "./form-feedback";

export function EnquiryForm({ onSuccess, method = "contact_modal" }: { onSuccess?: () => void; method?: "contact_modal" | "contact_form" }) {
  const enquiry = useEnquiryForm(method);
  return <form className="planner-form" aria-label="Project enquiry" aria-busy={enquiry.busy} onFocus={enquiry.start} onInvalid={enquiry.invalid} onSubmit={event => {
    event.preventDefault(); const data = new FormData(event.currentTarget);
    void enquiry.submit({ name: String(data.get("name") || ""), email: String(data.get("email") || ""), message: String(data.get("message") || ""), website: String(data.get("website") || "") }, onSuccess);
  }}>
    <div className="form-pair"><label>Your name<input name="name" autoComplete="name" required maxLength={100} placeholder="Your name" /></label><label>Email address<input name="email" type="email" autoComplete="email" required maxLength={254} placeholder="you@company.com" /></label></div>
    <label>What would you like to make?<textarea name="message" required maxLength={2000} rows={5} placeholder="Tell us about your idea, audience and timeline. A rough brief is a great start." /></label>
    <div className="sr-only" aria-hidden="true"><label>Leave empty<input name="website" tabIndex={-1} autoComplete="off" /></label></div>
    <p className="form-note">We’ll use your details to respond to your enquiry. <Link href="/privacy-policy">Privacy policy</Link></p>
    <button type="submit" disabled={enquiry.busy}>{enquiry.busy ? "Sending your enquiry…" : "Send to the studio ↗"}</button>
    <FormFeedback error={enquiry.error} />
  </form>;
}
