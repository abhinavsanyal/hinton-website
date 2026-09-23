"use client";
import { useState } from "react";
import { trackEvent } from "@/components/analytics/analytics";
type Result = { report: { website: string; title: string; recommendations: string[]; limitation: string }; emailed: boolean };
export function ReportForm() {
  const [result, setResult] = useState<Result | null>(null);
  const [error, setError] = useState(""); const [busy, setBusy] = useState(false);
  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault(); setBusy(true); setError(""); setResult(null);
    const form = new FormData(event.currentTarget);
    try {
      const response = await fetch("/api/video-report", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ website: form.get("website"), email: form.get("email"), consent: form.get("consent") === "on" }) });
      const body = await response.json();
      if (!response.ok) throw new Error(body.error?.message || "Unable to review this website. Please try again.");
      setResult(body.data); trackEvent("lead_tool_submission", { method: "website_report" });
    } catch (error) { setError(error instanceof Error ? error.message : "Please try again."); } finally { setBusy(false); }
  }
  return <><form className="planner-form" onSubmit={submit}><label>Your website<input name="website" type="url" placeholder="https://www.yourbrand.com" required maxLength={2048} /></label><label>Email address<input name="email" type="email" autoComplete="email" required maxLength={254} /></label><label><span><input name="consent" type="checkbox" required /> I agree to receive this report and enquiry follow-up from Hinton. See our <a href="/privacy-policy">privacy policy</a>.</span></label><button disabled={busy}>{busy ? "Reviewing your homepage…" : "Create my free report ↗"}</button></form>{error && <p role="alert">{error}</p>}{result && <section className="editorial-prose" aria-live="polite"><h2>Your video marketing starting points</h2><p>{result.report.website}</p>{result.report.recommendations.map((item, i) => <p key={item}><strong>{i + 1}.</strong> {item}</p>)}<p>{result.report.limitation}</p><p>{result.emailed ? "A copy has been sent to your email." : "Your report is ready above. Email delivery is currently unavailable; please save this page or contact the studio."}</p></section>}</>;
}
