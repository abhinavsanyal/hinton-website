"use client";
import { useRef, useState } from "react";
import Link from "next/link";
import { trackEvent } from "@/components/analytics/analytics";
import { FormFeedback } from "@/components/contact/form-feedback";
type Result = { report: { website: string; title: string; recommendations: string[]; limitation: string }; emailed: boolean; leadReceived: boolean };
export function ReportForm() {
  const [result, setResult] = useState<Result | null>(null);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const pending = useRef(false); const started = useRef(false);
  const results = useRef<HTMLElement>(null);
  const measure = (name: string, params: Record<string, string> = {}) => { try { trackEvent(name, { form_id: "website_report", ...params }); } catch {} };
  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault(); if (pending.current) return;
    pending.current = true; setBusy(true); setError("");
    measure("enquiry_form_attempt");
    const form = new FormData(event.currentTarget);
    try {
      const response = await fetch("/api/video-report", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ website: form.get("website"), email: form.get("email"), consent: form.get("consent") === "on" }) });
      const body = await response.json();
      if (!response.ok) { measure("enquiry_form_error", { error_code: body.error?.code || "report_error" }); throw new Error(body.error?.message || "Unable to review this website. Please try its final HTTPS homepage URL."); }
      setResult(body.data); measure("lead_tool_submission", { method: "website_report", email_delivery: body.data.emailed ? "accepted" : "unavailable", studio_delivery: body.data.leadReceived ? "accepted" : "unavailable" });
      requestAnimationFrame(() => { results.current?.focus(); results.current?.scrollIntoView({ block: "start", behavior: "instant" }); });
    } catch (error) { setError(error instanceof Error ? error.message : "Please try again."); } finally { pending.current = false; setBusy(false); }
  }
  return <><form className="planner-form" aria-label="Free video marketing report" aria-busy={busy} onSubmit={submit} onFocus={() => { if (!started.current) { started.current = true; measure("enquiry_form_start"); } }} onInvalid={() => measure("enquiry_form_invalid")}><label>Your website<input name="website" type="url" placeholder="https://www.yourbrand.com" required maxLength={2048} /></label><label>Email address<input name="email" type="email" autoComplete="email" required maxLength={254} /></label><label><span><input name="consent" type="checkbox" required /> I agree to receive this report and enquiry follow-up from Hinton. See our <Link href="/privacy-policy">privacy policy</Link>.</span></label><button disabled={busy}>{busy ? "Reviewing your homepage…" : "Create my free report ↗"}</button></form><FormFeedback error={error} />{result && <section ref={results} tabIndex={-1} className="editorial-section report-results" aria-live="polite"><p className="editorial-kicker">Your next video starts here</p><h2>Your video marketing starting points</h2><p className="editorial-lede">{result.report.title}</p><p>{result.report.website}</p><div className="editorial-grid">{result.report.recommendations.map((item, i) => <article className="editorial-card" key={item}><p className="editorial-kicker">Opportunity 0{i + 1}</p><p>{item}</p></article>)}</div><p className="form-note">{result.report.limitation}</p><p>{result.emailed ? "A copy is on its way to your inbox." : "Your report is ready here, but email delivery was unavailable. Keep this page open to refer to the findings."}</p><p>{result.leadReceived ? "The studio has also received your request for follow-up." : "To discuss these ideas with the studio, use the contact options below."}</p><div className="action-row"><Link className="primary-button" href="/contact" data-cta>Turn these ideas into a brief ↗</Link><Link className="quiet-button" href="/work">Explore our films ↗</Link></div></section>}</>;
}
