"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useCookieStore } from "@/components/common/Cookie/cookieStore";
import { trackEvent, trackLead } from "@/components/analytics/analytics";

const paths = [
  { name: "A brand campaign", number: "01", description: "Launch a product, tell a brand story or build a campaign people remember.", suggestion: "Start with your audience, one clear message and the screens you want to reach." },
  { name: "A feature film", number: "02", description: "Turn a synopsis, a screenplay or an ambitious idea into a world on screen.", suggestion: "Share a synopsis, your genre and where you are in development. We can begin with a treatment or previz." },
  { name: "A series or micro-drama", number: "03", description: "Build characters and stories that keep viewers coming back for the next episode.", suggestion: "Tell us about your characters, episode length and preferred platform. We’ll help shape a repeatable production plan." },
];

export function ProjectPlanner() {
  const [selected, setSelected] = useState(0);
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");
  const [message, setMessage] = useState("");
  const successRef = useRef<HTMLDivElement>(null);
  useEffect(() => { if (status === "sent") { successRef.current?.focus({ preventScroll: true }); successRef.current?.scrollIntoView({ block: "center", behavior: "instant" }); } }, [status]);
  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("sending");
    const form = event.currentTarget;
    const data = new FormData(form);
    try {
      const response = await fetch("/api/contact", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ name: data.get("name"), email: data.get("email"), website: data.get("website"), marketingConsent: useCookieStore.getState().consent?.marketing ?? false, message: `Project: ${paths[selected].name}\nStage: ${data.get("stage")}\nTarget timing: ${data.get("timing")}\n\n${data.get("brief")}` }) });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error?.message || "Please try again, or contact us on WhatsApp.");
      trackLead("project_brief", result.data.eventId);
      setMessage(result.data.confirmationSent ? "Your brief is with the studio. Check your inbox for a confirmation and a few films to explore." : "Your brief is with the studio. We couldn’t send the confirmation email, but our team has received your enquiry.");
      setStatus("sent");
      form.reset();
    } catch (error) { setMessage(error instanceof Error ? error.message : "Please try again, or email the studio."); setStatus("error"); }
  }
  return <section id="start-a-project" className="editorial-section project-planner" aria-labelledby="project-title">
    <p className="editorial-kicker">A good story starts with a conversation</p><h2 id="project-title">What are you making?</h2><p className="editorial-lede">A thirty-second spark or a feature-length world. Pick a starting point and let’s shape it together.</p>
    <div className="editorial-grid" aria-label="Choose a project type">{paths.map((path, index) => <button type="button" key={path.name} className="editorial-card project-choice" aria-pressed={selected === index} onClick={() => { setSelected(index); trackEvent("project_type_selected", { project_type: path.name }); }}><span className="editorial-kicker">{path.number} / {selected === index ? "Selected" : "Start here"}</span><h3>{path.name} ↗</h3><p>{path.description}</p></button>)}</div>
    <div className="brief-layout"><div><p className="editorial-kicker">Your next step</p><h3>Give us the first few lines.</h3><p>{paths[selected].suggestion}</p><p>No polished deck needed. A rough idea is enough to start a conversation.</p><a className="quiet-button" href={`https://wa.me/919330226381?text=${encodeURIComponent(`Hi Hinton, I’d like to discuss ${paths[selected].name.toLowerCase()}.`)}`} target="_blank" rel="noopener noreferrer" data-cta>Prefer WhatsApp? Chat with us ↗</a></div>
      {status === "sent" ? <div ref={successRef} tabIndex={-1} className="editorial-card" role="status"><h3>Let’s make it happen.</h3><p>{message}</p><Link href="/work" className="quiet-button">Explore more films ↗</Link></div> : <form onSubmit={submit} className="planner-form">
        <div className="form-pair"><label>Your name<input name="name" autoComplete="name" required maxLength={100} placeholder="Name" /></label><label>Email address<input type="email" name="email" autoComplete="email" required maxLength={254} placeholder="you@company.com" /></label></div>
        <div className="form-pair"><label>Where are you starting?<select name="stage"><option>An early idea</option><option>A script or brief</option><option>Ready for production</option><option>Exploring possibilities</option></select></label><label>When are you thinking?<select name="timing"><option>Let’s discuss a timeline</option><option>Within a month</option><option>In 1–3 months</option><option>Later this year</option></select></label></div>
        <label>Your idea<textarea name="brief" required rows={4} maxLength={1600} placeholder="What’s the story? Who is it for? Share any references, goals or budget guidance." /></label>
        <div className="sr-only" aria-hidden="true"><label>Leave this field empty<input name="website" tabIndex={-1} autoComplete="off" /></label></div>
        <p className="form-note">We’ll use these details to respond to your enquiry. <Link href="/privacy-policy">Privacy policy</Link></p>
        <button type="submit" disabled={status === "sending"}>{status === "sending" ? "Sending your brief…" : "Send my brief ↗"}</button>
        {status === "error" && <p role="alert">{message}</p>}
      </form>}
    </div>
  </section>;
}
