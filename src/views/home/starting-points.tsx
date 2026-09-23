import Link from "next/link";
const resources = [
  { tag: "For brands", title: "Find your next video opportunity", text: "Get a free, practical review of the video opportunities on your website.", href: "/video-marketing-report", cta: "Review my website" },
  { tag: "For filmmakers", title: "Bring a bigger story to life", text: "Explore feature film development, visual worlds and narrative previsualisation.", href: "/services/ai-feature-films", cta: "Explore feature films" },
  { tag: "For a little inspiration", title: "See what’s possible", text: "Watch commercials, character animation and cinematic previz from the studio.", href: "/work", cta: "Watch the films" },
  { tag: "Before you brief", title: "Understand the process", text: "Read our guides to AI filmmaking, advertising and episodic storytelling.", href: "/blog", cta: "Read the journal" },
];
export function StartingPoints() {
  return <section className="editorial-section" aria-labelledby="starting-title"><p className="editorial-kicker">Not sure where to begin?</p><h2 id="starting-title">Take the first small step.</h2><div className="starting-grid">{resources.map(resource => <Link key={resource.href} className="editorial-card" href={resource.href} data-cta><span className="editorial-kicker">{resource.tag}</span><h3>{resource.title}</h3><p>{resource.text}</p><span className="text-link">{resource.cta} ↗</span></Link>)}</div></section>;
}
